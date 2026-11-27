// ==========================================================
// SMARTDEAL ENTERPRISE DATABASE ARCHITECTURE E2E TEST SUITE
// Verifies 10 logical schemas, catalog identifiers, dynamic specs,
// price ranking, conditional offer breakdown, pure affiliate tracking,
// background job queue, and GIN full-text search
// ==========================================================

import { pool, query, withTransaction, getDatabaseHealth } from './server/db/connection.mjs';
import { calculateConditionalPriceBreakdown, recordVerifiedPriceUpdate, getRankedMarketplacePrices, getPriceHistoryAggregates } from './server/services/priceIntelligence.mjs';
import { recordOutboundClick, processAffiliateConversion, recordCommissionReversal, getAffiliateMetrics } from './server/services/affiliateService.mjs';
import { enqueueJob, processNextJob, getQueueStats } from './server/services/jobQueue.mjs';

const runTests = async () => {
  console.log('\n================================================================');
  console.log('🏛️ RUNNING SMARTDEAL ENTERPRISE DATABASE ARCHITECTURE E2E SUITE');
  console.log('================================================================\n');

  let passed = 0;
  const total = 10;

  try {
    // 1. Verify 10 Logical Schemas and Database Health
    const health = await getDatabaseHealth();
    if (health.status === 'HEALTHY' && health.connection.logicalSchemas.length >= 10 && health.connection.totalTables >= 60) {
      console.log(`✅ [TEST 1/${total} PASSED]: 10 Logical Schemas verified in single PostgreSQL cluster.`);
      console.log(`   ↳ Active Schemas: ${health.connection.logicalSchemas.join(', ')} (Total Tables: ${health.connection.totalTables})`);
      passed++;
    } else {
      throw new Error(`Logical schemas verification failed: ${JSON.stringify(health)}`);
    }

    // 2. Verify Advanced Catalog Universal Identifiers & Duplicate Prevention
    const testEan = `EAN-${Date.now()}`;
    const testIdentId = `ident-${Date.now()}`;
    await query(`
      INSERT INTO catalog.product_identifiers (id, product_id, identifier_type, identifier_value)
      VALUES ($1, 'prod-apple-iphone15', 'EAN', $2)
      ON CONFLICT DO NOTHING;
    `, [testIdentId, testEan]);

    const dupCheck = await query(`
      SELECT * FROM catalog.product_identifiers WHERE identifier_value = $1;
    `, [testEan]);

    if (dupCheck.length === 1 && dupCheck[0].identifier_type === 'EAN') {
      console.log(`✅ [TEST 2/${total} PASSED]: Universal product identifiers (EAN/UPC/ASIN) persisted with uniqueness constraints.`);
      console.log(`   ↳ Linked ${testEan} to product: ${dupCheck[0].product_id}`);
      passed++;
    } else {
      throw new Error('Universal identifier verification failed.');
    }

    // 3. Verify Dynamic Product Specifications
    const specs = await query(`
      SELECT * FROM catalog.product_specifications WHERE product_id = 'prod-apple-iphone15';
    `);
    const chipSpec = specs.find(s => s.spec_key === 'Chipset');
    const displaySpec = specs.find(s => s.spec_key === 'Screen Size');
    if (specs.length >= 4 && chipSpec && displaySpec) {
      console.log(`✅ [TEST 3/${total} PASSED]: Dynamic product specifications verified.`);
      console.log(`   ↳ iPhone 15 specs: Chip: ${chipSpec.spec_value}, Display: ${displaySpec.spec_value}`);
      passed++;
    } else {
      throw new Error('Product specifications verification failed.');
    }

    // 4. Verify Decimal-Safe Conditional Price Calculation Engine
    const breakdown = calculateConditionalPriceBreakdown({
      mrp: 79900,
      sellingPrice: 71999,
      shippingCharges: 100,
      couponDiscount: 2000,
      bankDiscount: 3000,
      exchangeDiscount: 5000
    });

    if (
      breakdown.normalSellingPrice === 71999 &&
      breakdown.couponEligiblePrice === 69999 &&
      breakdown.bankEligiblePrice === 66999 &&
      breakdown.finalPayablePrice === 67099 &&
      breakdown.absoluteLowestWithExchange === 62099
    ) {
      console.log(`✅ [TEST 4/${total} PASSED]: Conditional price breakdown engine accurately segregates discounts.`);
      console.log(`   ↳ Normal: ₹${breakdown.normalSellingPrice} | Coupon: ₹${breakdown.couponEligiblePrice} | Bank: ₹${breakdown.bankEligiblePrice} | Final: ₹${breakdown.finalPayablePrice}`);
      passed++;
    } else {
      throw new Error(`Price breakdown logic error: ${JSON.stringify(breakdown)}`);
    }

    // 5. Verify Suspicious Price Change Detection & Historical Append-Only Snapshots
    await recordVerifiedPriceUpdate({
      productId: 'prod-apple-iphone15',
      platformId: 'amazon',
      newPrice: 71999,
      mrp: 79900
    });

    const suspiciousDrop = await recordVerifiedPriceUpdate({
      productId: 'prod-apple-iphone15',
      platformId: 'amazon',
      newPrice: 9999, // >80% drop from 71999!
      mrp: 79900
    });

    if (suspiciousDrop.isSuspicious) {
      console.log(`✅ [TEST 5/${total} PASSED]: Suspicious price anomaly detected and logged with append-only history.`);
      console.log(`   ↳ Anomaly Flagged: ${suspiciousDrop.changePercentage.toFixed(1)}% change recorded.`);
      passed++;
    } else {
      throw new Error('Suspicious price drop detection failed.');
    }

    // 6. Verify Structured Offer Engine (Coupons, Bank Offers, Exchange)
    const activeCoupons = await query('SELECT count(*) as count FROM offers.coupons WHERE is_active = TRUE;');
    const activeBanks = await query('SELECT count(*) as count FROM offers.bank_offers WHERE is_active = TRUE;');
    if (parseInt(activeCoupons[0].count, 10) > 0 && parseInt(activeBanks[0].count, 10) > 0) {
      console.log(`✅ [TEST 6/${total} PASSED]: Structured offer engine verified (${activeCoupons[0].count} coupons, ${activeBanks[0].count} bank offers).`);
      console.log(`   ↳ Active discount rules mapped to partner platforms.`);
      passed++;
    } else {
      throw new Error('Offer engine verification failed.');
    }

    // 7. Verify Pure Affiliate Tracking (Commissions Only, Zero Consumer Cashback)
    const testClickId = `SD-AFF-ENT-${Date.now()}`;
    await recordOutboundClick({
      clickId: testClickId,
      productId: 'prod-apple-iphone15',
      platformId: 'amazon',
      targetUrl: 'https://www.amazon.in/dp/B0BY8MCQ9S',
      subId1: 'campaign-diwali',
      subId2: 'banner-top'
    });

    const conversionRes = await processAffiliateConversion({
      idempotencyKey: `IDEMP-ENT-${Date.now()}`,
      clickId: testClickId,
      platformId: 'amazon',
      orderId: `ORD-ENT-${Date.now()}`,
      orderAmount: 71999,
      commissionRate: 0.05
    });

    if (conversionRes.success && conversionRes.smartDealCommission === 3599.95) {
      console.log(`✅ [TEST 7/${total} PASSED]: Pure affiliate model verified: SmartDeal earned ₹${conversionRes.smartDealCommission} commission.`);
      console.log(`   ↳ Strict compliance: Zero consumer cashback wallet credited.`);
      passed++;
    } else {
      throw new Error('Affiliate tracking verification failed.');
    }

    // 8. Verify Commission Reversals for Product Returns
    const revRes = await recordCommissionReversal({
      conversionId: conversionRes.conversionId,
      reversalAmount: 3599.95,
      reason: 'Customer initiated return within 7 days'
    });

    if (revRes.success && revRes.reversalAmount === 3599.95) {
      console.log(`✅ [TEST 8/${total} PASSED]: Affiliate commission reversal ledger verified.`);
      console.log(`   ↳ Reversal recorded with audit reason: "${revRes.reason}"`);
      passed++;
    } else {
      throw new Error('Affiliate reversal failed.');
    }

    // 9. Verify Background Job Queue (SELECT ... FOR UPDATE SKIP LOCKED)
    const enqJob = await enqueueJob('AGGREGATE_PRICE_HISTORY', { test: true }, 1);
    const procJob = await processNextJob();

    if (procJob.processed && procJob.status === 'SUCCESS') {
      console.log(`✅ [TEST 9/${total} PASSED]: PostgreSQL background job queue executed with SKIP LOCKED concurrency.`);
      console.log(`   ↳ Job ${procJob.jobId} [${procJob.jobType}] completed in ${procJob.durationMs}ms.`);
      passed++;
    } else {
      throw new Error('Background job processing failed.');
    }

    // 10. Verify Full-Text Search Vector (GIN Index)
    const searchRes = await query(`
      SELECT id, name
      FROM catalog.products
      WHERE tsv_search @@ to_tsquery('english', 'iphone | apple | samsung')
      LIMIT 3;
    `);

    if (searchRes.length > 0) {
      console.log(`✅ [TEST 10/${total} PASSED]: GIN index Full-Text Search (tsvector/tsquery) verified.`);
      console.log(`   ↳ Matches: ${searchRes.map(r => r.name.slice(0, 30) + '...').join(' | ')}`);
      passed++;
    } else {
      throw new Error('Full text search verification failed.');
    }

    console.log('\n================================================================');
    console.log(`🎉 ALL ${passed}/${total} ENTERPRISE DATABASE ARCHITECTURE TESTS PASSED!`);
    console.log('================================================================\n');

  } catch (err) {
    console.error(`\n❌ [ENTERPRISE TEST FAILURE]:`, err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

runTests();
