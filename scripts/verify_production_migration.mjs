// scripts/verify_production_migration.mjs
// Live Post-Migration Production Verification Suite
// Target: https://smartdeal-backend-10kv.onrender.com

const BACKEND_URL = process.env.BACKEND_URL || 'https://smartdeal-backend-10kv.onrender.com';

const results = [];

function recordResult(testName, passed, details) {
  results.push({ testName, passed, details });
  const icon = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`  ${icon}: ${testName}`);
  if (details) console.log(`     ↳ ${details}`);
}

async function request(method, path, body = null, headers = {}) {
  const url = `${BACKEND_URL}${path}`;
  const reqHeaders = { 'Content-Type': 'application/json', ...headers };
  const opts = { method, headers: reqHeaders, signal: AbortSignal.timeout(15000) };
  if (body) opts.body = typeof body === 'string' ? body : JSON.stringify(body);
  const res = await fetch(url, opts);
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch {}
  return { status: res.status, headers: res.headers, body: json || text };
}

async function runVerification() {
  console.log('================================================================');
  console.log('🚀 SMARTDEAL — LIVE PRODUCTION MIGRATION VERIFICATION');
  console.log(`Target Backend: ${BACKEND_URL}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log('================================================================\n');

  // 1. Database Connectivity via /api/health
  console.log('--- 1. DATABASE CONNECTIVITY (/api/health) ---');
  try {
    const health = await request('GET', '/api/health');
    recordResult('Health endpoint returns HTTP 200', health.status === 200, `Status: ${health.status}`);
    const isHealthy = health.body?.status === 'healthy';
    recordResult('Service status is healthy', isHealthy, `Status: ${health.body?.status}`);
    const dbConnected = health.body?.database?.connected === true;
    recordResult('Database status is CONNECTED', dbConnected, `DB Status: ${health.body?.database?.status}`);
    const engine = health.body?.database?.engine || '';
    recordResult('PostgreSQL 18 confirmed', engine.includes('PostgreSQL 18'), `Engine: ${engine}`);
    const latency = health.body?.database?.latencyMs || 0;
    recordResult('Database latency < 100ms', latency < 100, `Latency: ${latency}ms`);
  } catch (err) {
    recordResult('Health endpoint check failed', false, err.message);
  }

  // 2. Admin Authentication
  console.log('\n--- 2. ADMIN AUTHENTICATION ---');
  try {
    const adminLogin = await request('POST', '/api/admin/login', {
      email: 'admin@smartdeal.com',
      password: 'admin123'
    });
    // In our architecture, admin login returns either success or MFA prompt (requireMfa: true)
    const adminPassed = adminLogin.status === 200 && (adminLogin.body?.success === true || adminLogin.body?.requireMfa === true);
    recordResult('Admin login succeeds with credentials', adminPassed, 
      adminLogin.body?.error ? `Error: ${adminLogin.body.error}` : `Status: ${adminLogin.status}`);
  } catch (err) {
    recordResult('Admin login endpoint check', false, err.message);
  }

  // 3. Customer Registration & Authentication
  console.log('\n--- 3. CUSTOMER AUTHENTICATION ---');
  const testEmail = `cust-prod-${Date.now()}@smartdeal-audit.com`;
  const testPass = 'SecureAuditPass@2026!';
  let customerToken = null;

  try {
    const regRes = await request('POST', '/api/auth/register', {
      name: 'Audit Customer',
      email: testEmail,
      phone: '9876543210',
      password: testPass
    });
    const regSuccess = regRes.status === 200 || regRes.status === 201;
    recordResult('Customer registration endpoint works', regSuccess, `Status: ${regRes.status}`);

    const loginRes = await request('POST', '/api/auth/login', {
      email: testEmail,
      password: testPass
    });
    const loginSuccess = loginRes.status === 200 && (loginRes.body?.success === true || Boolean(loginRes.body?.token));
    customerToken = loginRes.body?.token || null;
    recordResult('Customer login with registered account', loginSuccess, `Token generated: ${Boolean(customerToken)}`);
  } catch (err) {
    recordResult('Customer auth flow', false, err.message);
  }

  // 4. Catalog, Search & Marketplaces
  console.log('\n--- 4. CATALOG, SEARCH & MARKETPLACES ---');
  try {
    const prodRes = await request('GET', '/api/products');
    recordResult('GET /api/products returns HTTP 200', prodRes.status === 200, `Status: ${prodRes.status}`);

    const catRes = await request('GET', '/api/categories');
    recordResult('GET /api/categories returns HTTP 200', catRes.status === 200, `Status: ${catRes.status}`);

    const mktRes = await request('GET', '/api/marketplaces');
    recordResult('GET /api/marketplaces returns HTTP 200', mktRes.status === 200, `Status: ${mktRes.status}`);
  } catch (err) {
    recordResult('Catalog & marketplace endpoints', false, err.message);
  }

  // 5. Cashback Discontinuation & Commission Retention
  console.log('\n--- 5. CASHBACK PROGRAM DISCONTINUATION ---');
  try {
    const authHeader = customerToken ? { 'Authorization': `Bearer ${customerToken}` } : {};
    const walletRes = await request('GET', '/api/cashback/wallet', null, authHeader);
    recordResult('GET /api/cashback/wallet returns HTTP 200', walletRes.status === 200, `Status: ${walletRes.status}`);
    const availBal = walletRes.body?.wallet?.availableBalance ?? walletRes.body?.availableBalance;
    recordResult('Available cashback balance is strictly 0', availBal === 0, `Balance: ${availBal}`);

    const redeemRes = await request('POST', '/api/cashback/redeem', { amount: 50 }, authHeader);
    recordResult('POST /api/cashback/redeem returns HTTP 410 Gone', redeemRes.status === 410, `Status: ${redeemRes.status}`);
  } catch (err) {
    recordResult('Cashback verification', false, err.message);
  }

  console.log('\n================================================================');
  const passCount = results.filter(r => r.passed).length;
  const failCount = results.filter(r => !r.passed).length;
  console.log(`FINAL RESULTS: ${passCount} Passed, ${failCount} Failed (${results.length} total)`);
  console.log('================================================================');
}

runVerification().catch(console.error);
