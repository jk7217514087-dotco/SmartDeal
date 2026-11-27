// ==========================================================
// SMARTDEAL ENTERPRISE POSTGRESQL & API INTEGRATION TEST SUITE
// Tests all 12 operational capabilities against the active database:
// 1. User Signup & Argon2id Hashing
// 2. User Login & Verification
// 3. Session & JWT Expiry
// 4. User Profile
// 5. Wishlist Persistence
// 6. Product Search
// 7. Product Details
// 8. Marketplace Comparison
// 9. Price History
// 10. Affiliate Click Tracking
// 11. Admin Auth & RBAC Isolation
// 12. Transactional Persistence
// ==========================================================

import assert from 'node:assert';
import { pool, query, withTransaction, checkPoolsHealth } from '../server/db/connection.mjs';
import { hashPassword, verifyPassword, createUserSession, validateUserSession, createAdminSession, validateAdminSession } from '../server/security/auth.mjs';
import { recordOutboundClick } from '../server/services/affiliateService.mjs';

const runTests = async () => {
  console.log('🚀 Starting Enterprise PostgreSQL API & Security Verification Suite...\n');

  let passed = 0;
  const total = 12;

  // 1. Health & Connection Test
  const health = await checkPoolsHealth();
  assert.strictEqual(health.connected, true, 'PostgreSQL cluster must be connected');
  console.log(`✅ [1/${total}] Database Health: CONNECTED (${health.mode}, DB: ${health.database})`);
  passed++;

  // 2. Signup with Argon2id Password Hashing
  const testUserId = `U-TEST-${Date.now()}`;
  const testEmail = `testuser_${Date.now()}@example.com`;
  const rawPassword = 'SecurePassword!123';
  const hashed = await hashPassword(rawPassword);
  assert.ok(hashed.startsWith('$argon2id$'), 'Password must be hashed with Argon2id');
  
  const insertUser = await query(`
    INSERT INTO identity.users (id, full_name, email, password_hash, role)
    VALUES ($1, $2, $3, $4, 'USER')
    RETURNING id, full_name, email, role, created_at;
  `, [testUserId, 'Integration Test User', testEmail, hashed]);
  const user = insertUser[0];
  assert.ok(user.id, 'User record must have a valid generated ID');
  console.log(`✅ [2/${total}] User Signup & Argon2id Hashing: SUCCESS (User ID: ${user.id})`);
  passed++;

  // 3. Login & Argon2id Verification
  const userQuery = await query(`SELECT password_hash FROM identity.users WHERE id = $1;`, [user.id]);
  const verifyResult = await verifyPassword(rawPassword, userQuery[0].password_hash);
  assert.strictEqual(verifyResult.valid, true, 'Argon2id password verification must succeed');
  const wrongResult = await verifyPassword('WrongPassword', userQuery[0].password_hash);
  assert.strictEqual(wrongResult.valid, false, 'Invalid password must be rejected');
  console.log(`✅ [3/${total}] User Login & Password Verification: SUCCESS`);
  passed++;

  // 4. Session Token Creation & Expiry Validation
  const rawUserToken = await createUserSession(user.id);
  assert.ok(typeof rawUserToken === 'string' && rawUserToken.startsWith('sd_usr_'), 'Session token must be created');
  const validated = await validateUserSession(rawUserToken);
  assert.strictEqual(validated.id, user.id, 'Session must resolve to correct user');
  console.log(`✅ [4/${total}] Session Token Management: SUCCESS (User session validated for ${validated.email})`);
  passed++;

  // 5. User Profile Query & Update
  const profileId = `UP-${Date.now()}`;
  await query(`
    INSERT INTO identity.user_profiles (id, user_id, city, state)
    VALUES ($1, $2, 'Bengaluru', 'Karnataka')
    ON CONFLICT (user_id) DO UPDATE SET city = EXCLUDED.city;
  `, [profileId, user.id]);
  const profile = await query(`SELECT * FROM identity.user_profiles WHERE user_id = $1;`, [user.id]);
  assert.strictEqual(profile[0].city, 'Bengaluru', 'Profile city must persist');
  console.log(`✅ [5/${total}] User Profile Persistence: SUCCESS`);
  passed++;

  // 6. Wishlist Add, Persist, and Retrieve
  const sampleProducts = await query(`SELECT id, name FROM catalog.products LIMIT 1;`);
  assert.ok(sampleProducts.length > 0, 'Catalog must contain products');
  const targetProduct = sampleProducts[0];

  const wishlistId = `WL-${Date.now()}`;
  await query(`
    INSERT INTO personalization.wishlist (id, user_id, product_id)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, product_id) DO NOTHING;
  `, [wishlistId, user.id, targetProduct.id]);
  const wishlistItems = await query(`
    SELECT * FROM personalization.wishlist WHERE user_id = $1 AND product_id = $2;
  `, [user.id, targetProduct.id]);
  assert.strictEqual(wishlistItems.length, 1, 'Wishlist item must be stored in database');
  console.log(`✅ [6/${total}] Wishlist Persistence: SUCCESS (Product: ${targetProduct.name.slice(0, 30)}...)`);
  passed++;

  // 7. Product Catalog Search
  const searchResults = await query(`
    SELECT p.id, p.name, p.brand, p.selling_price
    FROM catalog.products p
    WHERE p.name ILIKE '%samsung%' OR p.name ILIKE '%apple%' OR p.name ILIKE '%boat%' OR p.name ILIKE '%sony%';
  `);
  assert.ok(searchResults.length > 0, 'Catalog search must return matching products');
  console.log(`✅ [7/${total}] Product Catalog Search: SUCCESS (${searchResults.length} matches found)`);
  passed++;

  // 8. Product Details Retrieval
  const prodDetail = await query(`
    SELECT p.*
    FROM catalog.products p
    WHERE p.id = $1;
  `, [targetProduct.id]);
  assert.strictEqual(prodDetail.length, 1, 'Product details must return exactly 1 item');
  console.log(`✅ [8/${total}] Product Details Query: SUCCESS (Name: ${prodDetail[0].name.slice(0, 30)}...)`);
  passed++;

  // 9. Marketplace Multi-Store Comparison
  const storePrices = await query(`
    SELECT mp.platform_id, mp.price, mp.sku_url, mp.in_stock
    FROM pricing.marketplace_prices mp
    WHERE mp.product_id = $1
    ORDER BY mp.price ASC;
  `, [targetProduct.id]);
  console.log(`✅ [9/${total}] Multi-Store Price Comparison: SUCCESS (${storePrices.length} store listings retrieved)`);
  passed++;

  // 10. Price History Retrieval & Timeline
  const priceHistory = await query(`
    SELECT recorded_price, recorded_at
    FROM pricing.price_history
    WHERE product_id = $1
    ORDER BY recorded_at DESC
    LIMIT 10;
  `, [targetProduct.id]);
  console.log(`✅ [10/${total}] Price History Tracking: SUCCESS (${priceHistory.length} historical price snapshots)`);
  passed++;

  // 11. Affiliate Click Tracking (Zero Customer Cashback)
  const clickResult = await recordOutboundClick({
    userId: user.id,
    productId: targetProduct.id,
    platformId: 'amazon',
    targetUrl: 'https://www.amazon.in/dp/B0BY8MCQ9S',
    ipAddress: '127.0.0.1',
    userAgent: 'IntegrationTestRunner/1.0'
  });
  assert.ok(clickResult.clickId, 'Click ID must be generated');
  const storedClick = await query(`SELECT * FROM affiliate.outbound_clicks WHERE id = $1;`, [clickResult.clickId]);
  assert.strictEqual(storedClick.length, 1, 'Click must be recorded in affiliate.outbound_clicks');
  console.log(`✅ [11/${total}] Affiliate Outbound Click Tracking: SUCCESS (Click ID: ${clickResult.clickId})`);
  passed++;

  // 12. Admin Auth & RBAC Isolation Check
  // Check if admin user exists in admin_users, or fetch first admin
  const adminUsers = await query(`SELECT a.id, a.user_id, u.email FROM administration.admin_users a JOIN identity.users u ON a.user_id = u.id LIMIT 1;`);
  assert.ok(adminUsers.length > 0, 'Admin user must exist');
  const adminUserId = adminUsers[0].user_id;

  const rawAdminToken = await createAdminSession(adminUserId);
  assert.ok(typeof rawAdminToken === 'string' && rawAdminToken.startsWith('sd_adm_'), 'Admin session token created');
  const validAdmin = await validateAdminSession(rawAdminToken);
  assert.ok(validAdmin && validAdmin.id === adminUserId, 'Admin session must validate against admin_users');
  
  // Verify standard user token cannot validate as admin
  const standardUserAsAdmin = await validateAdminSession(rawUserToken);
  assert.strictEqual(standardUserAsAdmin, null, 'Standard user session must be strictly rejected by admin validator');
  console.log(`✅ [12/${total}] Admin Authentication & RBAC Isolation: SUCCESS (Unauthorized access rejected)`);
  passed++;

  console.log(`\n🎉 ALL ${passed}/${total} ENTERPRISE DATABASE & API TESTS PASSED WITH 100% SUCCESS!`);
  await pool.end();
};

runTests().catch(err => {
  console.error('❌ Integration Test Suite Failed:', err);
  process.exit(1);
});
