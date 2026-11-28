// ==========================================================
// TEST SUITE: PRE-DEPLOYMENT SAFETY GATE (PHASE 5.3)
// Validates fail-closed checks, DB identity, key safety & zero residue
// ==========================================================

import fs from 'node:fs';
import path from 'node:path';
import { validateDatabaseIdentity, getMasterKey, executeBackupPipelineAndDrill } from './automated_backup_manager.mjs';

async function runPredeploymentSafetyTests() {
  console.log('🛡️ Starting Phase 5.3 Pre-Deployment Safety Gate Test Suite...\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
      failed++;
    }
  }

  // TEST 1: Database Identity Validation - Approved External Host
  console.log('--- Test 1: Production DB Identity Validation (Approved Hosts) ---');
  try {
    const res1 = validateDatabaseIdentity('postgresql://smartdeal:secret@dpg-cuid6j5ds78s73ba85ig-a.oregon-postgres.render.com:5432/smartdeal');
    assert(res1.host === 'dpg-cuid6j5ds78s73ba85ig-a.oregon-postgres.render.com', 'Approved external Render PostgreSQL host accepted');
    assert(res1.dbName === 'smartdeal', 'Approved database name "smartdeal" accepted');
    assert(!res1.sanitizedUrl.includes('secret'), 'Credentials strictly redacted from sanitized URL');
  } catch (err) {
    assert(false, `Unexpected rejection of valid host: ${err.message}`);
  }

  // TEST 2: Database Identity Validation - Approved Internal VPC Host
  try {
    const res2 = validateDatabaseIdentity('postgresql://smartdeal:secret@dpg-cuid6j5ds78s73ba85ig-a/smartdeal');
    assert(res2.host === 'dpg-cuid6j5ds78s73ba85ig-a', 'Approved internal VPC Render host accepted');
  } catch (err) {
    assert(false, `Unexpected rejection of internal host: ${err.message}`);
  }

  // TEST 3: Fail-Closed on Localhost in Production URL
  console.log('\n--- Test 2: Rejecting Dangerous/Invalid Hostnames (Fail-Closed) ---');
  try {
    validateDatabaseIdentity('postgresql://postgres:pass@127.0.0.1:5433/smartdeal');
    assert(false, 'Should have rejected 127.0.0.1');
  } catch (err) {
    assert(err.message.includes('FAIL-CLOSED'), `Correctly rejected localhost: ${err.message}`);
  }

  // TEST 4: Rejecting Foreign/Attacker Host
  try {
    validateDatabaseIdentity('postgresql://user:pass@evil-database.attacker.com:5432/smartdeal');
    assert(false, 'Should have rejected foreign attacker host');
  } catch (err) {
    assert(err.message.includes('FAIL-CLOSED'), `Correctly rejected foreign host: ${err.message}`);
  }

  // TEST 5: Rejecting Incorrect Database Name
  try {
    validateDatabaseIdentity('postgresql://user:pass@dpg-cuid6j5ds78s73ba85ig-a.oregon-postgres.render.com:5432/wrong_db');
    assert(false, 'Should have rejected database name other than "smartdeal"');
  } catch (err) {
    assert(err.message.includes('FAIL-CLOSED'), `Correctly rejected wrong database name: ${err.message}`);
  }

  // TEST 6: Production Encryption Key Strength Validation
  console.log('\n--- Test 3: Encryption Key Length & Entropy Validation ---');
  const originalNodeEnv = process.env.NODE_ENV;
  const originalRender = process.env.RENDER;
  const originalKey = process.env.BACKUP_ENCRYPTION_KEY;

  try {
    process.env.RENDER = 'true';
    delete process.env.BACKUP_ENCRYPTION_KEY;

    // Must fail if key is missing in production
    try {
      getMasterKey();
      assert(false, 'Should have rejected missing key in production');
    } catch (err) {
      assert(err.message.includes('FAIL-CLOSED'), `Correctly rejected missing key in production: ${err.message}`);
    }

    // Must fail if key is too short (< 32 chars)
    process.env.BACKUP_ENCRYPTION_KEY = 'short-weak-key';
    try {
      getMasterKey();
      assert(false, 'Should have rejected short key in production');
    } catch (err) {
      assert(err.message.includes('FAIL-CLOSED'), `Correctly rejected short key in production: ${err.message}`);
    }

    // Must succeed when key is strong (>= 32 chars)
    process.env.BACKUP_ENCRYPTION_KEY = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    const validKey = getMasterKey();
    assert(validKey && validKey.length === 32, 'Successfully derived 256-bit key from strong production secret');
  } finally {
    process.env.NODE_ENV = originalNodeEnv;
    if (originalRender !== undefined) process.env.RENDER = originalRender;
    else delete process.env.RENDER;
    if (originalKey !== undefined) process.env.BACKUP_ENCRYPTION_KEY = originalKey;
    else delete process.env.BACKUP_ENCRYPTION_KEY;
  }

  // TEST 7: Production Fail-Closed on Missing DATABASE_URL
  console.log('\n--- Test 4: Production Fail-Closed on Missing DATABASE_URL & Offsite Storage ---');
  try {
    process.env.RENDER = 'true';
    delete process.env.DATABASE_URL;

    try {
      await executeBackupPipelineAndDrill();
      assert(false, 'Should have aborted when RENDER=true without DATABASE_URL');
    } catch (err) {
      assert(err.message.includes('FAIL-CLOSED'), `Correctly aborted on missing DATABASE_URL in production: ${err.message}`);
    }
  } finally {
    delete process.env.RENDER;
  }

  // TEST 8: Zero Plaintext SQL Residue Check
  console.log('\n--- Test 5: Verifying Zero Plaintext SQL Residue on Disk ---');
  const backupRoot = path.resolve('backups');
  if (fs.existsSync(backupRoot)) {
    const batches = fs.readdirSync(backupRoot);
    let plaintextFilesFound = 0;
    for (const batch of batches) {
      const batchDir = path.join(backupRoot, batch);
      if (fs.statSync(batchDir).isDirectory()) {
        const files = fs.readdirSync(batchDir);
        for (const file of files) {
          if (file.endsWith('.raw.sql') || file.endsWith('.temp_restore.sql')) {
            plaintextFilesFound++;
          }
        }
      }
    }
    assert(plaintextFilesFound === 0, `Zero plaintext SQL files found in backups directory (${plaintextFilesFound} found)`);
  } else {
    assert(true, 'Backups directory clean (no directory or files present)');
  }

  // SUMMARY
  console.log('\n================================================================');
  console.log(`PRE-DEPLOYMENT SAFETY GATE RESULT: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPredeploymentSafetyTests().catch(err => {
  console.error('Safety Gate Harness Error:', err);
  process.exit(1);
});
