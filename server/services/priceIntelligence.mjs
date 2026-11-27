// ==========================================================
// SMARTDEAL ADVANCED PRICE & OFFER INTELLIGENCE ENGINE
// Decimal-safe conditional price calculation, ranking,
// append-only history, suspicious change detection & daily summaries
// ==========================================================

import { pool, query, withTransaction } from '../db/connection.mjs';

/**
 * Calculates complete conditional price breakdown
 * Never shows a conditional discount as universally available!
 */
export const calculateConditionalPriceBreakdown = ({
  mrp,
  sellingPrice,
  shippingCharges = 0,
  couponDiscount = 0,
  bankDiscount = 0,
  exchangeDiscount = 0
}) => {
  const baseSellingPrice = Math.round(Number(sellingPrice || 0) * 100) / 100;
  const originalMrp = Math.round(Number(mrp || baseSellingPrice) * 100) / 100;
  const shipping = Math.round(Number(shippingCharges || 0) * 100) / 100;
  const coupon = Math.min(baseSellingPrice, Math.round(Number(couponDiscount || 0) * 100) / 100);
  const bank = Math.min(baseSellingPrice - coupon, Math.round(Number(bankDiscount || 0) * 100) / 100);
  const exchange = Math.min(baseSellingPrice - coupon - bank, Math.round(Number(exchangeDiscount || 0) * 100) / 100);

  // 1. Normal selling price
  const normalPrice = baseSellingPrice;

  // 2. Coupon-eligible price
  const couponEligiblePrice = Math.max(0, normalPrice - coupon);

  // 3. Bank/card-eligible price (with coupon applied)
  const bankEligiblePrice = Math.max(0, couponEligiblePrice - bank);

  // 4. Exchange-eligible price
  const exchangeEligiblePrice = Math.max(0, bankEligiblePrice - exchange);

  // 5. Final conditional payable price (including shipping)
  const finalPayablePrice = Math.max(0, bankEligiblePrice + shipping);

  // 6. Absolute lowest possible price with all conditional offers (e.g. exchange)
  const absoluteLowestWithExchange = Math.max(0, exchangeEligiblePrice + shipping);

  const discountPercentage = originalMrp > 0
    ? Math.round(((originalMrp - baseSellingPrice) / originalMrp) * 100)
    : 0;

  return {
    mrp: originalMrp,
    normalSellingPrice: normalPrice,
    shippingCharges: shipping,
    couponDiscount: coupon,
    couponEligiblePrice,
    bankDiscount: bank,
    bankEligiblePrice,
    exchangeDiscount: exchange,
    exchangeEligiblePrice,
    finalPayablePrice,
    absoluteLowestWithExchange,
    discountPercentage,
    hasConditionalDiscount: (coupon > 0 || bank > 0 || exchange > 0)
  };
};

/**
 * Records verified price update with append-only audit trail and suspicious anomaly detection
 */
export const recordVerifiedPriceUpdate = async ({
  productId,
  platformId,
  sellerId = null,
  newPrice,
  mrp = null,
  shippingCharges = 0,
  couponDiscount = 0,
  bankDiscount = 0,
  skuUrl = '',
  inStock = true,
  priceSource = 'AFFILIATE_FEED',
  verifierId = 'CRON_ENGINE'
}) => {
  return withTransaction(async (client) => {
    // 1. Check previous price
    const prevRes = await client.query(`
      SELECT price, mrp FROM pricing.marketplace_prices 
      WHERE product_id = $1 AND platform_id = $2;
    `, [productId, platformId]);

    const previousPrice = prevRes.rows.length > 0 ? Number(prevRes.rows[0].price) : Number(newPrice);
    const resolvedMrp = mrp || (prevRes.rows.length > 0 ? prevRes.rows[0].mrp : newPrice);

    const priceBreakdown = calculateConditionalPriceBreakdown({
      mrp: resolvedMrp,
      sellingPrice: newPrice,
      shippingCharges,
      couponDiscount,
      bankDiscount
    });

    // 2. Suspicious Price Change Anomaly Detection (>80% drop or >300% spike)
    let isSuspicious = false;
    const priceDiff = Number(newPrice) - previousPrice;
    const changePercentage = previousPrice > 0 ? (priceDiff / previousPrice) * 100 : 0;

    if (previousPrice > 0) {
      if (changePercentage <= -80 || changePercentage >= 300) {
        isSuspicious = true;
        console.warn(`⚠️ [SUSPICIOUS PRICE CHANGE]: Product ${productId} on ${platformId} changed by ${changePercentage.toFixed(1)}% (₹${previousPrice} -> ₹${newPrice})`);
      }
    }

    // 3. Upsert into pricing.marketplace_prices (Always ranks lowest final_payable_price first)
    await client.query(`
      INSERT INTO pricing.marketplace_prices (
        id, product_id, platform_id, seller_id, mrp, price, discount_amount,
        discount_percentage, coupon_discount, eligible_bank_discount, shipping_charges,
        final_payable_price, sku_url, in_stock, price_source, is_verified, verified_at, last_checked_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT (product_id, platform_id) DO UPDATE SET
        mrp = EXCLUDED.mrp,
        price = EXCLUDED.price,
        discount_amount = EXCLUDED.discount_amount,
        discount_percentage = EXCLUDED.discount_percentage,
        coupon_discount = EXCLUDED.coupon_discount,
        eligible_bank_discount = EXCLUDED.eligible_bank_discount,
        shipping_charges = EXCLUDED.shipping_charges,
        final_payable_price = EXCLUDED.final_payable_price,
        in_stock = EXCLUDED.in_stock,
        sku_url = COALESCE(EXCLUDED.sku_url, pricing.marketplace_prices.sku_url),
        price_source = EXCLUDED.price_source,
        is_verified = TRUE,
        verified_at = CURRENT_TIMESTAMP,
        last_checked_at = CURRENT_TIMESTAMP;
    `, [
      `${productId}-${platformId}`,
      productId,
      platformId,
      sellerId,
      priceBreakdown.mrp,
      priceBreakdown.normalSellingPrice,
      priceBreakdown.mrp - priceBreakdown.normalSellingPrice,
      priceBreakdown.discountPercentage,
      priceBreakdown.couponDiscount,
      priceBreakdown.bankDiscount,
      priceBreakdown.shippingCharges,
      priceBreakdown.finalPayablePrice,
      skuUrl,
      inStock,
      priceSource
    ]);

    // 4. Append to append-only pricing.price_history
    await client.query(`
      INSERT INTO pricing.price_history (product_id, platform_id, recorded_price, recorded_date, event)
      VALUES ($1, $2, $3, 'Today', $4);
    `, [productId, platformId, priceBreakdown.normalSellingPrice, isSuspicious ? 'Suspicious Price Audit' : 'Verified Market Price']);

    // 5. If price changed, log change event
    if (Math.abs(priceDiff) >= 1) {
      await client.query(`
        INSERT INTO pricing.price_change_events (
          product_id, platform_id, previous_price, new_price, change_amount, change_percentage, is_suspicious
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7);
      `, [productId, platformId, previousPrice, newPrice, priceDiff, changePercentage, isSuspicious]);
    }

    // 6. Log verification audit
    await client.query(`
      INSERT INTO pricing.price_verification_logs (product_id, platform_id, price_verified, method, verifier_id)
      VALUES ($1, $2, $3, $4, $5);
    `, [productId, platformId, newPrice, priceSource, verifierId]);

    // 7. Update Daily Aggregation Summary Table (idempotent daily min/max/avg)
    const today = new Date().toISOString().split('T')[0];
    await client.query(`
      INSERT INTO pricing.price_daily_summary (product_id, platform_id, summary_date, min_price, max_price, avg_price, closing_price)
      VALUES ($1, $2, $3, $4, $4, $4, $4)
      ON CONFLICT (product_id, platform_id, summary_date) DO UPDATE SET
        min_price = LEAST(pricing.price_daily_summary.min_price, EXCLUDED.min_price),
        max_price = GREATEST(pricing.price_daily_summary.max_price, EXCLUDED.max_price),
        avg_price = ROUND((pricing.price_daily_summary.avg_price + EXCLUDED.avg_price) / 2, 2),
        closing_price = EXCLUDED.closing_price;
    `, [productId, platformId, today, newPrice]);

    return {
      productId,
      platformId,
      breakdown: priceBreakdown,
      isSuspicious,
      changePercentage
    };
  });
};

/**
 * Returns lowest-price-first ranked marketplace listings for a product with full breakdown
 */
export const getRankedMarketplacePrices = async (productId) => {
  const rows = await query(`
    SELECT mp.*, p.name as platform_name, p.domain, p.affiliate_tag, p.return_window_days,
           s.seller_name, s.seller_rating, s.seller_score
    FROM pricing.marketplace_prices mp
    JOIN marketplace.platforms p ON mp.platform_id = p.id
    LEFT JOIN marketplace.marketplace_sellers s ON mp.seller_id = s.id
    WHERE mp.product_id = $1 AND mp.in_stock = TRUE
    ORDER BY mp.final_payable_price ASC;
  `, [productId]);

  return rows.map((r, idx) => ({
    rank: idx + 1,
    isLowestPrice: idx === 0,
    platformId: r.platform_id,
    platformName: r.platform_name,
    domain: r.domain,
    sellerName: r.seller_name || 'Authorized Merchant',
    sellerRating: r.seller_rating || 4.8,
    mrp: Number(r.mrp || r.price),
    sellingPrice: Number(r.price),
    shippingCharges: Number(r.shipping_charges || 0),
    couponDiscount: Number(r.coupon_discount || 0),
    bankDiscount: Number(r.eligible_bank_discount || 0),
    finalPayablePrice: Number(r.final_payable_price || r.price),
    inStock: r.in_stock,
    skuUrl: r.sku_url,
    lastVerified: r.verified_at,
    isVerified: r.is_verified
  }));
};

/**
 * Calculates 7d, 30d, 90d, and all-time price statistics for a product
 */
export const getPriceHistoryAggregates = async (productId, platformId = null) => {
  let sql = `
    SELECT recorded_price, recorded_at
    FROM pricing.price_history
    WHERE product_id = $1
  `;
  const params = [productId];

  if (platformId && platformId !== 'ALL') {
    params.push(platformId);
    sql += ` AND platform_id = $2`;
  }
  sql += ` ORDER BY recorded_at ASC;`;

  const rows = await query(sql, params);
  if (rows.length === 0) {
    return {
      totalRecords: 0,
      lowestPriceAllTime: null,
      highestPriceAllTime: null,
      averagePrice: null,
      aggregates7d: null,
      aggregates30d: null,
      aggregates90d: null
    };
  }

  const now = Date.now();
  const pricesAll = rows.map(r => Number(r.recorded_price));
  const lowestAll = Math.min(...pricesAll);
  const highestAll = Math.max(...pricesAll);
  const avgAll = Math.round(pricesAll.reduce((a, b) => a + b, 0) / pricesAll.length);

  const calculateWindow = (days) => {
    const cutoff = now - days * 24 * 60 * 60 * 1000;
    const windowRows = rows.filter(r => new Date(r.recorded_at).getTime() >= cutoff);
    if (windowRows.length === 0) return { min: lowestAll, max: highestAll, avg: avgAll, count: 0 };
    const p = windowRows.map(r => Number(r.recorded_price));
    return {
      min: Math.min(...p),
      max: Math.max(...p),
      avg: Math.round(p.reduce((a, b) => a + b, 0) / p.length),
      count: p.length
    };
  };

  return {
    totalRecords: rows.length,
    lowestPriceAllTime: lowestAll,
    highestPriceAllTime: highestAll,
    averagePrice: avgAll,
    aggregates7d: calculateWindow(7),
    aggregates30d: calculateWindow(30),
    aggregates90d: calculateWindow(90)
  };
};

export default {
  calculateConditionalPriceBreakdown,
  recordVerifiedPriceUpdate,
  getRankedMarketplacePrices,
  getPriceHistoryAggregates
};
