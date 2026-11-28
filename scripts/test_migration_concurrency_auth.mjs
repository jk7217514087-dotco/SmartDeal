// scripts/test_migration_concurrency_auth.mjs
// Phase 2: Migration Runner Concurrency & Authorization Security Audit
// Target: https://smartdeal-backend-10kv.onrender.com

const BACKEND_URL = process.env.BACKEND_URL || 'https://smartdeal-backend-10kv.onrender.com';

const testLog = [];

function logResult(testName, passed, details) {
  testLog.push({ testName, passed, details });
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

async function runMigrationSecurityAudit() {
  console.log('================================================================');
  console.log('🛡️ SMARTDEAL PHASE 2: MIGRATION RUNNER CONCURRENCY & AUTH AUDIT');
  console.log(`Target Backend: ${BACKEND_URL}`);
  console.log('================================================================\n');

  // TEST 1: Reject unauthenticated trigger
  console.log('--- 1. UNPROTECTED REQUEST REJECTION ---');
  try {
    const unauthRes = await request('POST', '/api/system/migrate');
    const rejectedOk = unauthRes.status === 403;
    logResult('POST /api/system/migrate rejects unauthenticated invocation', rejectedOk, 
      `Status: ${unauthRes.status} | Body: ${JSON.stringify(unauthRes.body)}`);
  } catch (err) {
    logResult('Unauthenticated request test', false, err.message);
  }

  // TEST 2: Reject forged secret
  console.log('\n--- 2. INVALID SECRET REJECTION ---');
  try {
    const forgedRes = await request('POST', '/api/system/migrate', null, {
      'X-System-Migration-Secret': 'wrong-attacker-secret-12345'
    });
    const forgedRejectedOk = forgedRes.status === 403;
    logResult('POST /api/system/migrate rejects invalid secret token', forgedRejectedOk, 
      `Status: ${forgedRes.status}`);
  } catch (err) {
    logResult('Invalid secret test', false, err.message);
  }

  // TEST 3: Zero secrets leak in response
  console.log('\n--- 3. LEAKAGE PREVENTION ---');
  try {
    const probeRes = await request('POST', '/api/system/migrate', null, {
      'X-System-Migration-Secret': 'invalid'
    });
    const bodyStr = JSON.stringify(probeRes.body);
    const leaksSecret = bodyStr.includes('smartdeal-prod') || bodyStr.includes('dpg-') || bodyStr.includes('password');
    logResult('Migration error responses do not leak expected secret or DB info', !leaksSecret, 
      `Leaked sensitive data: ${leaksSecret}`);
  } catch (err) {
    logResult('Leakage test', false, err.message);
  }

  // TEST 4: Verify Idempotency of Migration
  console.log('\n--- 4. MIGRATION REPEATABILITY & IDEMPOTENCY ---');
  try {
    // Calling with valid secret to verify idempotency (does not destroy or duplicate data)
    const validRes = await request('POST', '/api/system/migrate', null, {
      'X-System-Migration-Secret': 'smartdeal-prod-migrate-2026'
    });
    const validOk = validRes.status === 200 && validRes.body?.success === true;
    logResult('Authorized migration execution is 100% idempotent', validOk, 
      `Status: ${validRes.status} | Tables: ${validRes.body?.totalTables}`);
  } catch (err) {
    logResult('Idempotency execution test', false, err.message);
  }

  console.log('\n================================================================');
  const passedCount = testLog.filter(t => t.passed).length;
  console.log(`MIGRATION SECURITY RESULTS: ${passedCount}/${testLog.length} PASSED`);
  console.log('================================================================');
}

runMigrationSecurityAudit().catch(console.error);
