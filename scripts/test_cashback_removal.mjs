// Automated Cashback Removal & Commission Retention Test Suite
import { spawn } from 'child_process';

const PORT = 3999;

async function runTests() {
  console.log('🚀 Starting Cashback Removal & Commission Retention Test Suite...');
  
  // Spawn backend server on port 3999
  const serverProcess = spawn('node', ['server/server.mjs'], {
    env: { ...process.env, PORT: String(PORT), NODE_ENV: 'test' },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  serverProcess.stderr.on('data', (d) => {
    // console.error('[Server Error]', d.toString());
  });

  // Wait for server to be ready
  let serverReady = false;
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/api/health`);
      if (res.status === 200) {
        serverReady = true;
        break;
      }
    } catch (e) {
      await new Promise(r => setTimeout(r, 200));
    }
  }

  if (!serverReady) {
    console.error('❌ Failed to start test server on port ' + PORT);
    serverProcess.kill();
    process.exit(1);
  }

  console.log(`📡 Test server running on http://127.0.0.1:${PORT}`);

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Test Customer Login
    console.log('\n--- 1. Customer Authentication ---');
    const loginRes = await fetch(`http://127.0.0.1:${PORT}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'rahul.sharma@example.com', password: 'password123' })
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200, 'Customer login returns HTTP 200');
    assert(loginData.success === true, 'Customer login succeeded');
    const token = loginData.token;
    assert(!!token, 'Customer auth token obtained');

    // 2. Test GET /api/cashback/wallet
    console.log('\n--- 2. GET /api/cashback/wallet ---');
    const walletRes = await fetch(`http://127.0.0.1:${PORT}/api/cashback/wallet`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const walletData = await walletRes.json();
    assert(walletRes.status === 200, 'Wallet endpoint returns HTTP 200');
    assert(walletData.discontinued === true, 'Wallet indicates discontinued status');
    assert(walletData.wallet.availableBalance === 0, 'Available balance is strictly 0');
    assert(walletData.wallet.pendingBalance === 0, 'Pending balance is strictly 0');

    // 3. Test GET /api/cashback/transactions
    console.log('\n--- 3. GET /api/cashback/transactions ---');
    const txRes = await fetch(`http://127.0.0.1:${PORT}/api/cashback/transactions`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const txData = await txRes.json();
    assert(txRes.status === 200, 'Transactions endpoint returns HTTP 200');
    assert(txData.discontinued === true, 'Transactions endpoint reports discontinued');
    assert(txData.count === 0, 'Transactions count is 0');

    // 4. Test POST /api/cashback/redeem (Should return HTTP 410 Gone)
    console.log('\n--- 4. POST /api/cashback/redeem ---');
    const redeemRes = await fetch(`http://127.0.0.1:${PORT}/api/cashback/redeem`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount: 100, method: 'UPI', accountDetails: 'rahul@upi' })
    });
    const redeemData = await redeemRes.json();
    assert(redeemRes.status === 410, 'Redeem endpoint returns HTTP 410 Gone');
    assert(redeemData.success === false, 'Redemption explicitly rejected');
    assert(redeemData.error.includes('discontinued'), 'Error message informs user program is discontinued');

    // 5. Test Conversion Postback (100% Commission Retained by SmartDeal, 0% to user)
    console.log('\n--- 5. Conversion Postback & Revenue Retention ---');
    const testIdempKey = `IDEMP-TEST-${Date.now()}`;
    const convRes = await fetch(`http://127.0.0.1:${PORT}/api/affiliate/conversions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clickId: 'SD-CLICK-TEST-999',
        orderRef: `ORD-TEST-${Date.now()}`,
        marketplace: 'Amazon',
        productName: 'Samsung Galaxy M14 5G',
        userId: loginData.user.id,
        saleAmount: 10000,
        commissionRate: 5.0,
        idempotencyKey: testIdempKey
      })
    });
    const convData = await convRes.json();
    assert(convRes.status === 201, 'Conversion postback created with HTTP 201');
    assert(convData.conversion.saleAmount === 10000, 'Sale amount is 10,000');
    assert(convData.conversion.commissionEarned === 500, 'Affiliate commission earned is 500 (5%)');
    assert(convData.conversion.userCashbackAllocation === 0, 'User cashback allocation is strictly 0.00');
    assert(convData.conversion.smartdealRemaining === 500, 'SmartDeal retains 100% (500) of affiliate commission');

    // 6. Test Products & Price Comparison
    console.log('\n--- 6. Product Search & Marketplace Pricing ---');
    const prodRes = await fetch(`http://127.0.0.1:${PORT}/api/products`);
    const prodData = await prodRes.json();
    assert(prodRes.status === 200, 'Products endpoint returns HTTP 200');
    assert(Array.isArray(prodData.data) && prodData.data.length > 0, 'Products returned successfully');

  } catch (err) {
    console.error('Unexpected error during testing:', err);
    failed++;
  } finally {
    serverProcess.kill();
    console.log(`\n========================================`);
    console.log(`🏁 TEST RESULTS: ${passed} passed, ${failed} failed`);
    console.log(`========================================\n`);
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
