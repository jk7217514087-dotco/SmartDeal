// scripts/cleanup_production_audit_records.mjs
// Phase 3: Production Audit Test Data Cleanup Script
// Target: https://smartdeal-backend-10kv.onrender.com

const BACKEND_URL = process.env.BACKEND_URL || 'https://smartdeal-backend-10kv.onrender.com';

const cleanupLog = {
  executionId: `CLEANUP-${Date.now()}`,
  timestamp: new Date().toISOString(),
  targetBackend: BACKEND_URL,
  targetAuditUserIds: [
    'U-MX083UJU-IJLX',
    'U-MX081ZYE-E2O4',
    'U-MX080FOO-1P3G',
    'U-MX07RKXX-CETR'
  ],
  protectedAdmins: [
    'U10000',
    'U10001'
  ],
  deletionResults: []
};

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

async function runCleanup() {
  console.log('================================================================');
  console.log('🧹 SMARTDEAL PHASE 3: AUDIT TEST DATA CLEANUP');
  console.log(`Backend: ${BACKEND_URL}`);
  console.log('================================================================\n');

  // Step 1: Authenticate as Super Admin
  console.log('--- Step 1: Authenticating as System Super Admin ---');
  const loginRes = await request('POST', '/api/admin/login', {
    email: 'admin@smartdeal.com',
    password: 'admin123'
  });

  if (!loginRes.body?.token) {
    console.error('Failed to authenticate as super admin:', loginRes.body);
    return;
  }

  const adminToken = loginRes.body.token;
  const adminHeaders = { 'Authorization': `Bearer ${adminToken}` };
  console.log('  ✓ Super Admin authenticated successfully.');

  // Step 2: Query Current Users Inventory
  console.log('\n--- Step 2: Querying Pre-Cleanup User Inventory ---');
  const preRes = await request('GET', '/api/admin/users', null, adminHeaders);
  const preUsers = preRes.body?.data || [];
  console.log(`  ✓ Current Users Count: ${preUsers.length}`);
  preUsers.forEach(u => {
    console.log(`    ↳ [${u.id}] ${u.email} (${u.role}) - Created: ${u.createdAt}`);
  });

  // Step 3: Delete Audit Test Records Safely
  console.log('\n--- Step 3: Deleting Isolated Audit Test Records ---');
  for (const uid of cleanupLog.targetAuditUserIds) {
    if (cleanupLog.protectedAdmins.includes(uid)) {
      console.warn(`  ⚠️ SKIP: Protected account ${uid} will never be deleted.`);
      continue;
    }

    const delRes = await request('DELETE', `/api/admin/users/${uid}`, null, adminHeaders);
    const success = delRes.status === 200 && delRes.body?.success === true;
    cleanupLog.deletionResults.push({
      userId: uid,
      status: delRes.status,
      success,
      details: delRes.body?.message || delRes.body?.error
    });

    const icon = success ? '✅ DELETED' : '❌ FAILED';
    console.log(`  ${icon}: User ${uid} -> ${delRes.body?.message || delRes.body?.error || delRes.status}`);
  }

  // Step 4: Verify Post-Cleanup State
  console.log('\n--- Step 4: Verifying Post-Cleanup Database Integrity ---');
  const postRes = await request('GET', '/api/admin/users', null, adminHeaders);
  const postUsers = postRes.body?.data || [];
  console.log(`  ✓ Post-Cleanup Users Count: ${postUsers.length}`);
  postUsers.forEach(u => {
    console.log(`    ↳ [${u.id}] ${u.email} (${u.role})`);
  });

  const onlyAdminsRemain = postUsers.length === 2 && postUsers.every(u => cleanupLog.protectedAdmins.includes(u.id));
  console.log('\n================================================================');
  console.log(`CLEANUP VERDICT: ${onlyAdminsRemain ? '100% CLEAN (Zero Test Records Remain)' : 'PARTIAL'}`);
  console.log('================================================================');
}

runCleanup().catch(console.error);
