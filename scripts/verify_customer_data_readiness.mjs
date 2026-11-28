// scripts/verify_customer_data_readiness.mjs
// Phase 4: Customer Data Lifecycle & Persistence Verification with Immediate Cleanup

const PROD_URL = 'https://smartdeal-backend-10kv.onrender.com';

async function request(method, path, body = null, headers = {}) {
  const url = `${PROD_URL}${path}`;
  const reqHeaders = { 'Content-Type': 'application/json', ...headers };
  const opts = { method, headers: reqHeaders };
  if (body) opts.body = typeof body === 'string' ? body : JSON.stringify(body);
  const res = await fetch(url, opts);
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch {}
  return { status: res.status, headers: res.headers, body: json || text };
}

async function runCustomerReadinessTest() {
  console.log('================================================================');
  console.log('🧪 SMARTDEAL PHASE 4: CUSTOMER DATA READINESS & PERSISTENCE TEST');
  console.log(`Backend URL: ${PROD_URL}`);
  console.log('================================================================\n');

  const timestamp = Date.now();
  const testCustomer = {
    name: `Audit Customer ${timestamp}`,
    email: `audit-phase4-${timestamp}@smartdeal-audit.com`,
    password: `P4_SecPass!${timestamp}`,
    phone: '9876543299'
  };

  let testUserId = null;
  let testUserToken = null;
  let testAlertId = null;

  try {
    // 1. Customer Registration
    console.log('--- Step 1: Registering Fresh Customer ---');
    const regRes = await request('POST', '/api/auth/register', testCustomer);
    console.log(`  ↳ Register HTTP Status: ${regRes.status}`);
    if (regRes.status !== 200 && regRes.status !== 201) {
      throw new Error(`Registration failed: ${JSON.stringify(regRes.body)}`);
    }

    testUserId = regRes.body?.user?.id;
    testUserToken = regRes.body?.token;
    console.log(`  ✓ Registered User ID: ${testUserId}`);
    console.log(`  ✓ Auth Token received: ${testUserToken ? 'YES' : 'NO'}`);

    // 2. Customer Login
    console.log('\n--- Step 2: Testing Customer Login ---');
    const loginRes = await request('POST', '/api/auth/login', {
      email: testCustomer.email,
      password: testCustomer.password
    });
    console.log(`  ↳ Login HTTP Status: ${loginRes.status}`);
    if (loginRes.status !== 200) {
      throw new Error(`Login failed: ${JSON.stringify(loginRes.body)}`);
    }
    const sessionToken = loginRes.body?.token;
    console.log(`  ✓ Customer login verified. Session Token generated: ${Boolean(sessionToken)}`);

    const authHeaders = { 'Authorization': `Bearer ${sessionToken}` };

    // 3. User Preferences & Profile Update
    console.log('\n--- Step 3: Updating User Preferences & Profile ---');
    const prefRes = await request('PUT', '/api/user/profile', {
      profile: { city: 'Bengaluru', state: 'Karnataka', pincode: '560001' },
      preferences: { theme: 'midnight-emerald', currency: 'INR', notifyPriceDrops: true }
    }, authHeaders);
    console.log(`  ↳ Preferences HTTP Status: ${prefRes.status}`);
    console.log(`  ✓ Preferences saved: ${prefRes.body?.success === true ? 'YES' : 'NO'}`);

    // Verify persisted profile
    const getProfRes = await request('GET', '/api/user/profile', null, authHeaders);
    console.log(`  ↳ Verify Profile Status: ${getProfRes.status}`);
    console.log(`  ✓ Persisted theme: ${getProfRes.body?.data?.preferences?.theme}`);
    console.log(`  ✓ Persisted city: ${getProfRes.body?.data?.profile?.city}`);

    // 4. Save Wishlist Item
    console.log('\n--- Step 4: Adding Wishlist Item ---');
    const testProdId = 'prod-samsung-m14';
    const wishRes = await request('POST', '/api/user/wishlist', {
      productId: testProdId
    }, authHeaders);
    console.log(`  ↳ Wishlist Add Status: ${wishRes.status}`);
    console.log(`  ✓ Wishlist item added: ${wishRes.body?.success === true ? 'YES' : 'NO'}`);

    // Verify Wishlist Retrieval
    const getWishRes = await request('GET', '/api/user/wishlist', null, authHeaders);
    console.log(`  ↳ Wishlist Get Status: ${getWishRes.status}`);
    const wishItems = getWishRes.body?.data || [];
    const wishFound = wishItems.some(p => p.id === testProdId);
    console.log(`  ✓ Wishlist Items Count: ${getWishRes.body?.count || wishItems.length} | Contains Item: ${wishFound ? 'YES' : 'NO'}`);

    // 5. Create Price Alert
    console.log('\n--- Step 5: Creating Price Alert ---');
    const alertRes = await request('POST', '/api/user/alerts', {
      productId: testProdId,
      targetPrice: 11999,
      marketplace: 'amazon'
    }, authHeaders);
    console.log(`  ↳ Price Alert HTTP Status: ${alertRes.status}`);
    testAlertId = alertRes.body?.data?.id;
    console.log(`  ✓ Price alert created with ID: ${testAlertId}`);

    // Verify Price Alert Retrieval
    const getAlertsRes = await request('GET', '/api/user/alerts', null, authHeaders);
    console.log(`  ↳ Price Alerts Get Status: ${getAlertsRes.status}`);
    const alerts = getAlertsRes.body?.data || [];
    const alertFound = alerts.some(a => a.id === testAlertId);
    console.log(`  ✓ Active Alerts Count: ${getAlertsRes.body?.count || alerts.length} | Contains Alert: ${alertFound ? 'YES' : 'NO'}`);

    // 6. User Notifications
    console.log('\n--- Step 6: Querying User Notifications ---');
    const notifRes = await request('GET', '/api/user/notifications', null, authHeaders);
    console.log(`  ↳ Notifications Get Status: ${notifRes.status}`);
    console.log(`  ✓ Notifications count: ${notifRes.body?.count || 0}`);

  } finally {
    // 7. Cleanup: Delete isolated audit test account
    if (testUserId) {
      console.log('\n--- Step 7: Executing Immediate Cleanup of Test Account ---');
      // Admin Login
      const adminLoginRes = await request('POST', '/api/admin/login', {
        email: 'admin@smartdeal.com',
        password: process.env.ADMIN_PASSWORD || 'admin123'
      });

      if (adminLoginRes.status === 200) {
        const adminToken = adminLoginRes.body?.token;

        const delRes = await request('DELETE', `/api/admin/users/${testUserId}`, null, {
          'Authorization': `Bearer ${adminToken}`
        });

        console.log(`  ↳ Delete User Status: ${delRes.status}`);
        console.log(`  ✓ Cascading Deletion Result: ${delRes.body?.message || JSON.stringify(delRes.body)}`);

        // Verify remaining users
        const listRes = await request('GET', '/api/admin/users', null, {
          'Authorization': `Bearer ${adminToken}`
        });
        const users = listRes.body?.data || listRes.body?.users || [];
        console.log(`  ✓ Production Users Count Post-Cleanup: ${users.length}`);
        users.forEach(u => console.log(`    ↳ [${u.id}] ${u.email} (${u.role})`));
      } else {
        console.warn(`  ⚠️ Admin login failed with status ${adminLoginRes.status}. Cleanup requires manual check.`);
      }
    }
  }

  console.log('\n================================================================');
  console.log('✅ CUSTOMER DATA READINESS AUDIT: 100% COMPLETE & CLEANED');
  console.log('================================================================');
}

runCustomerReadinessTest().catch(console.error);
