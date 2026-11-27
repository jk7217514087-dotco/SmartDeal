// ==========================================================
// SMARTDEAL ENTERPRISE OFFERS SEEDER
// Populates offers, coupons, bank offers (HDFC, ICICI, SBI, Axis),
// card eligibility, and exchange offers for realistic price calculation
// ==========================================================

import { pool, withTransaction } from './connection.mjs';

export const seedEnterpriseOffers = async () => {
  console.log('🌱 [Enterprise Offers Seeder]: Populating coupons, bank offers, and exchange rules...');

  await withTransaction(async (client) => {
    // 1. Promotional Campaigns
    await client.query(`
      INSERT INTO offers.promotional_campaigns (id, title, description, multiplier, start_date, end_date, is_active)
      VALUES 
        ('camp-festive-2026', 'Great Indian Festival 2026', 'Mega festive discounts across all major electronics and smartphones', 1.5, CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_TIMESTAMP + INTERVAL '30 days', TRUE),
        ('camp-super-saver', 'Super Saver Electronics Week', 'Extra bank instant discounts on premium laptops and appliances', 1.2, CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP + INTERVAL '14 days', TRUE)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        multiplier = EXCLUDED.multiplier,
        is_active = EXCLUDED.is_active;
    `);

    // 2. Verified Coupons
    const coupons = [
      { id: 'coup-festive2000', code: 'SMARTFEST2000', title: 'Flat ₹2000 Off on Electronics', discount_type: 'FLAT', discount_value: 2000, min_cart_value: 25000, max_discount: 2000, platform_id: 'amazon' },
      { id: 'coup-tech500', code: 'TECH500', title: '₹500 Instant Tech Coupon', discount_type: 'FLAT', discount_value: 500, min_cart_value: 5000, max_discount: 500, platform_id: 'flipkart' },
      { id: 'coup-apple1000', code: 'APPLE1000', title: 'Flat ₹1000 off on Apple & Premium Devices', discount_type: 'FLAT', discount_value: 1000, min_cart_value: 40000, max_discount: 1000, platform_id: 'croma' },
      { id: 'coup-audio15', code: 'SOUND15', title: '15% Off on boAt & Sony Audio', discount_type: 'PERCENTAGE', discount_value: 15, min_cart_value: 1000, max_discount: 1500, platform_id: 'amazon' }
    ];

    for (const c of coupons) {
      await client.query(`
        INSERT INTO offers.coupons (id, code, title, discount_type, discount_value, min_cart_value, max_discount, platform_id, valid_from, valid_until, is_active, terms_conditions)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP + INTERVAL '60 days', TRUE, 'Valid on verified partner checkouts only.')
        ON CONFLICT (id) DO UPDATE SET
          code = EXCLUDED.code,
          discount_value = EXCLUDED.discount_value,
          min_cart_value = EXCLUDED.min_cart_value;
      `, [c.id, c.code, c.title, c.discount_type, c.discount_value, c.min_cart_value, c.max_discount, c.platform_id]);
    }

    // 3. Bank Offers (HDFC, ICICI, SBI, Axis Bank)
    const bankOffers = [
      { id: 'bank-hdfc-cc-10', bank_name: 'HDFC', card_type: 'CREDIT', discount_type: 'PERCENTAGE', discount_value: 10, min_order_value: 10000, max_discount_amount: 3000 },
      { id: 'bank-icici-cc-75', bank_name: 'ICICI Bank', card_type: 'CREDIT', discount_type: 'PERCENTAGE', discount_value: 7.5, min_order_value: 7500, max_discount_amount: 2500 },
      { id: 'bank-sbi-cc-1500', bank_name: 'SBI', card_type: 'CREDIT', discount_type: 'FLAT', discount_value: 1500, min_order_value: 15000, max_discount_amount: 1500 },
      { id: 'bank-axis-cc-10', bank_name: 'Axis Bank', card_type: 'CREDIT', discount_type: 'PERCENTAGE', discount_value: 10, min_order_value: 12000, max_discount_amount: 3000 }
    ];

    for (const b of bankOffers) {
      await client.query(`
        INSERT INTO offers.bank_offers (id, bank_name, card_type, discount_type, discount_value, min_order_value, max_discount_amount, valid_from, valid_until, is_active, terms_conditions)
        VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP + INTERVAL '60 days', TRUE, 'Applicable on Credit Cards and full-swipe / EMI transactions.')
        ON CONFLICT (id) DO UPDATE SET
          bank_name = EXCLUDED.bank_name,
          discount_value = EXCLUDED.discount_value,
          max_discount_amount = EXCLUDED.max_discount_amount;
      `, [b.id, b.bank_name, b.card_type, b.discount_type, b.discount_value, b.min_order_value, b.max_discount_amount]);
    }

    // 4. Card Eligibility Rules
    await client.query(`
      INSERT INTO offers.card_eligibility (bank_offer_id, bin_prefix, card_tier, network)
      VALUES
        ('bank-hdfc-cc-10', '4111', 'REGALIA', 'VISA'),
        ('bank-hdfc-cc-10', '5241', 'MILLENNIA', 'MASTERCARD'),
        ('bank-icici-cc-75', '4315', 'SAPPHIRO', 'VISA'),
        ('bank-icici-cc-75', '5432', 'CORAL', 'MASTERCARD'),
        ('bank-sbi-cc-1500', '4726', 'SIMPLYCLICK', 'VISA'),
        ('bank-axis-cc-10', '4862', 'MAGNUS', 'VISA')
      ON CONFLICT DO NOTHING;
    `);

    // 5. Product Exchange Offers (Laptops and Smartphones)
    const exchangeProducts = [
      { id: 'exch-apple-iphone15', prodId: 'prod-apple-iphone15', baseDiscount: 5000, bonusDiscount: 2000 },
      { id: 'exch-samsung-m14', prodId: 'prod-samsung-m14', baseDiscount: 2000, bonusDiscount: 1000 },
      { id: 'exch-asus-vivobook', prodId: 'prod-asus-vivobook', baseDiscount: 4500, bonusDiscount: 1500 },
      { id: 'exch-hp-pavilion', prodId: 'prod-hp-pavilion-15', baseDiscount: 4000, bonusDiscount: 1500 }
    ];

    for (const ex of exchangeProducts) {
      await client.query(`
        INSERT INTO offers.exchange_offers (id, product_id, base_exchange_discount, bonus_exchange_discount, qualifying_brands)
        VALUES ($1, $2, $3, $4, '["Apple", "Samsung", "HP", "Dell", "OnePlus", "Lenovo"]'::jsonb)
        ON CONFLICT (id) DO UPDATE SET
          base_exchange_discount = EXCLUDED.base_exchange_discount,
          bonus_exchange_discount = EXCLUDED.bonus_exchange_discount;
      `, [ex.id, ex.prodId, ex.baseDiscount, ex.bonusDiscount]);
    }

    // 6. Structured Product Offers
    const sampleOffers = [
      { id: 'off-iphone-hdfc', prodId: 'prod-apple-iphone15', platId: 'amazon', title: 'HDFC Bank ₹3,000 Instant Discount', type: 'BANK', discount: 3000, min: 50000, max: 3000, bank: 'HDFC' },
      { id: 'off-samsung-icici', prodId: 'prod-samsung-m14', platId: 'flipkart', title: 'ICICI Bank ₹1,000 Instant Discount', type: 'BANK', discount: 1000, min: 10000, max: 1000, bank: 'ICICI Bank' },
      { id: 'off-asus-coup', prodId: 'prod-asus-vivobook', platId: 'croma', title: 'Flat ₹2,000 Super Tech Voucher', type: 'COUPON', discount: 2000, min: 40000, max: 2000, bank: null },
      { id: 'off-sony-sound', prodId: 'prod-sony-wh1000xm5', platId: 'amazon', title: 'Flat 10% Audio Fest Discount', type: 'COUPON', discount: 2500, min: 20000, max: 3000, bank: null }
    ];

    for (const o of sampleOffers) {
      await client.query(`
        INSERT INTO offers.offers (id, product_id, platform_id, offer_title, offer_type, discount_amount, min_purchase, max_discount, eligible_payment_method, eligible_bank, valid_until, is_verified, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'CREDIT_CARD', $9, CURRENT_TIMESTAMP + INTERVAL '60 days', TRUE, TRUE)
        ON CONFLICT (id) DO UPDATE SET
          offer_title = EXCLUDED.offer_title,
          discount_amount = EXCLUDED.discount_amount,
          is_active = EXCLUDED.is_active;
      `, [o.id, o.prodId, o.platId, o.title, o.type, o.discount, o.min, o.max, o.bank]);
    }
  });

  console.log('✅ [Enterprise Offers Seeder]: Successfully populated enterprise offers.');
};

if (process.argv[1]?.endsWith('seed_enterprise_offers.mjs')) {
  seedEnterpriseOffers()
    .then(async () => {
      await pool.end();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('❌ [Enterprise Offers Seeder Failed]:', err);
      await pool.end();
      process.exit(1);
    });
}
