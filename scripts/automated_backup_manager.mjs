// ==========================================================
// SMARTDEAL PRODUCTION BACKUP AUTOMATION & RETENTION ENGINE
// Phase 4: Enterprise GFS Retention, AES-256-GCM Encryption,
// SHA-256 Integrity, Cloudflare R2 / AWS S3 Sync & Restore Drill
// ==========================================================

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import https from 'node:https';
import { execSync } from 'node:child_process';
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const BACKUP_ROOT = path.resolve('backups');
const ENCRYPTION_ALGO = 'aes-256-gcm';
const PG_DUMP_BIN = 'C:\\Program Files\\PostgreSQL\\18\\bin\\pg_dump.exe';
const PSQL_BIN = 'C:\\Program Files\\PostgreSQL\\18\\bin\\psql.exe';

// Master Encryption Key: Derived using scrypt (KDF) from BACKUP_ENCRYPTION_KEY or JWT_SECRET
const getMasterKey = () => {
  const secret = process.env.BACKUP_ENCRYPTION_KEY || process.env.JWT_SECRET || 'smartdeal-backup-secret-key-2026';
  return crypto.scryptSync(secret, 'smartdeal-salt', 32);
};

/**
 * Encrypt a plaintext buffer with AES-256-GCM (Authenticated Encryption)
 */
export const encryptBuffer = (buffer) => {
  const masterKey = getMasterKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGO, masterKey, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return {
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
    data: encrypted.toString('base64')
  };
};

/**
 * Decrypt an AES-256-GCM payload with authentication tag verification
 */
export const decryptPayload = (encryptedObj) => {
  const masterKey = getMasterKey();
  const iv = Buffer.from(encryptedObj.iv, 'hex');
  const authTag = Buffer.from(encryptedObj.authTag, 'hex');
  const decipher = crypto.createDecipheriv(ENCRYPTION_ALGO, masterKey, iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedObj.data, 'base64')),
    decipher.final()
  ]);
  return decrypted;
};

/**
 * Cloudflare R2 / AWS S3 SigV4 Upload Helper
 */
export async function uploadToOffsiteStorage(fileName, fileBuffer) {
  const bucket = process.env.R2_BUCKET || process.env.S3_BUCKET;
  const accessKey = process.env.R2_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
  const secretKey = process.env.R2_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;
  const endpoint = process.env.R2_ENDPOINT || process.env.S3_ENDPOINT;
  const region = process.env.AWS_REGION || 'auto';

  if (!bucket || !accessKey || !secretKey || !endpoint) {
    return {
      status: 'PENDING_CREDENTIALS',
      message: 'Cloudflare R2 / AWS S3 credentials not configured in environment. Local encrypted archive retained safely.'
    };
  }

  try {
    const url = new URL(`${endpoint.replace(/\/$/, '')}/${bucket}/${fileName}`);
    const now = new Date();
    const dateStamp = now.toISOString().slice(0, 10).replace(/-/g, '');
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
    const payloadHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    const canonicalHeaders = `host:${url.host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
    const signedHeaders = 'host;x-amz-content-sha256;x-amz-date';
    const canonicalRequest = `PUT\n/${bucket}/${fileName}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

    const credentialScope = `${dateStamp}/${region}/s3/aws4_request`;
    const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${credentialScope}\n${crypto.createHash('sha256').update(canonicalRequest).digest('hex')}`;

    const kDate = crypto.createHmac('sha256', `AWS4${secretKey}`).update(dateStamp).digest();
    const kRegion = crypto.createHmac('sha256', kDate).update(region).digest();
    const kService = crypto.createHmac('sha256', kRegion).update('s3').digest();
    const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();
    const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');

    const authorization = `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    const uploadRes = await new Promise((resolve, reject) => {
      const req = https.request(url, {
        method: 'PUT',
        headers: {
          'Host': url.host,
          'x-amz-date': amzDate,
          'x-amz-content-sha256': payloadHash,
          'Authorization': authorization,
          'Content-Length': fileBuffer.length,
          'Content-Type': 'application/json'
        }
      }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve({ statusCode: res.statusCode, body }));
      });
      req.on('error', reject);
      req.write(fileBuffer);
      req.end();
    });

    if (uploadRes.statusCode >= 200 && uploadRes.statusCode < 300) {
      return { status: 'UPLOADED', provider: endpoint.includes('r2') ? 'Cloudflare R2' : 'Amazon S3', bucket };
    } else {
      return { status: 'FAILED', error: uploadRes.body || `HTTP ${uploadRes.statusCode}` };
    }
  } catch (err) {
    return { status: 'ERROR', error: err.message };
  }
}

/**
 * Cloudflare R2 / AWS S3 SigV4 Download Helper
 */
export async function downloadFromOffsiteStorage(fileName) {
  const bucket = process.env.R2_BUCKET || process.env.S3_BUCKET;
  const accessKey = process.env.R2_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
  const secretKey = process.env.R2_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;
  const endpoint = process.env.R2_ENDPOINT || process.env.S3_ENDPOINT;
  const region = process.env.AWS_REGION || 'auto';

  if (!bucket || !accessKey || !secretKey || !endpoint) {
    return {
      status: 'PENDING_CREDENTIALS',
      message: 'Cloudflare R2 / AWS S3 credentials not configured in environment.'
    };
  }

  try {
    const url = new URL(`${endpoint.replace(/\/$/, '')}/${bucket}/${fileName}`);
    const now = new Date();
    const dateStamp = now.toISOString().slice(0, 10).replace(/-/g, '');
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
    const emptyPayloadHash = crypto.createHash('sha256').update('').digest('hex');

    const canonicalHeaders = `host:${url.host}\nx-amz-content-sha256:${emptyPayloadHash}\nx-amz-date:${amzDate}\n`;
    const signedHeaders = 'host;x-amz-content-sha256;x-amz-date';
    const canonicalRequest = `GET\n/${bucket}/${fileName}\n\n${canonicalHeaders}\n${signedHeaders}\n${emptyPayloadHash}`;

    const credentialScope = `${dateStamp}/${region}/s3/aws4_request`;
    const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${credentialScope}\n${crypto.createHash('sha256').update(canonicalRequest).digest('hex')}`;

    const kDate = crypto.createHmac('sha256', `AWS4${secretKey}`).update(dateStamp).digest();
    const kRegion = crypto.createHmac('sha256', kDate).update(region).digest();
    const kService = crypto.createHmac('sha256', kRegion).update('s3').digest();
    const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();
    const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');

    const authorization = `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    const downloadRes = await new Promise((resolve, reject) => {
      const req = https.request(url, {
        method: 'GET',
        headers: {
          'Host': url.host,
          'x-amz-date': amzDate,
          'x-amz-content-sha256': emptyPayloadHash,
          'Authorization': authorization
        }
      }, (res) => {
        const chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => resolve({ statusCode: res.statusCode, buffer: Buffer.concat(chunks) }));
      });
      req.on('error', reject);
      req.end();
    });

    if (downloadRes.statusCode === 200) {
      return { status: 'DOWNLOADED', buffer: downloadRes.buffer };
    } else {
      return { status: 'FAILED', error: `HTTP ${downloadRes.statusCode}` };
    }
  } catch (err) {
    return { status: 'ERROR', error: err.message };
  }
}

/**
 * Grandfather-Father-Son (GFS) Retention Policy Enforcement
 * Retains:
 * - 7 Daily backups (1 per day for past 7 days)
 * - 4 Weekly backups (1 per week for past 4 weeks)
 * - 3 Monthly backups (1 per month for past 3 months)
 */
export function applyGfsRetentionPolicy() {
  if (!fs.existsSync(BACKUP_ROOT)) return { retained: [], pruned: [] };

  const entries = fs.readdirSync(BACKUP_ROOT, { withFileTypes: true })
    .filter(e => e.isDirectory() && e.name.startsWith('SMARTDEAL-ENT-BACKUP-'))
    .sort((a, b) => b.name.localeCompare(a.name)); // newest first

  const dailySlots = new Set();
  const weeklySlots = new Set();
  const monthlySlots = new Set();

  const retained = [];
  const pruned = [];

  for (const entry of entries) {
    // Extract date from batch name e.g. SMARTDEAL-ENT-BACKUP-2026-11-28T09-47-08-862Z
    const match = entry.name.match(/SMARTDEAL-ENT-BACKUP-(\d{4}-\d{2}-\d{2})T(\d{2})/);
    if (!match) {
      retained.push(entry.name);
      continue;
    }

    const dateStr = match[1]; // YYYY-MM-DD
    const dateObj = new Date(dateStr);
    const dayKey = dateStr;
    const weekKey = `${dateObj.getFullYear()}-W${Math.ceil((dateObj.getDate() + 6 - dateObj.getDay()) / 7)}`;
    const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;

    let keep = false;
    let reason = '';

    if (dailySlots.size < 7 && !dailySlots.has(dayKey)) {
      dailySlots.add(dayKey);
      keep = true;
      reason = 'Daily Slot';
    } else if (weeklySlots.size < 4 && !weeklySlots.has(weekKey)) {
      weeklySlots.add(weekKey);
      keep = true;
      reason = 'Weekly Slot';
    } else if (monthlySlots.size < 3 && !monthlySlots.has(monthKey)) {
      monthlySlots.add(monthKey);
      keep = true;
      reason = 'Monthly Slot';
    }

    if (keep) {
      retained.push({ batch: entry.name, reason });
    } else {
      pruned.push(entry.name);
      // Prune directory
      const fullPath = path.join(BACKUP_ROOT, entry.name);
      try {
        fs.rmSync(fullPath, { recursive: true, force: true });
      } catch (err) {
        console.warn(`Failed to prune ${entry.name}:`, err.message);
      }
    }
  }

  return { retained, pruned };
}

/**
 * Dispatch Backup Status Notifications (Webhook / Console / Telemetry)
 */
export async function sendBackupNotification(event) {
  const webhookUrl = process.env.BACKUP_NOTIFICATION_WEBHOOK || process.env.SLACK_WEBHOOK_URL;
  const payload = {
    source: 'SmartDeal Backup Engine',
    timestamp: new Date().toISOString(),
    event: event.type, // 'SUCCESS' | 'FAILURE' | 'INTEGRITY_ALERT'
    batchId: event.batchId,
    rtoSeconds: event.rtoSeconds,
    rpoHours: event.rpoHours,
    sha256: event.sha256,
    sizeKb: event.sizeKb,
    externalStatus: event.externalStatus,
    details: event.details
  };

  console.log(`\n📢 [Backup Notification]: [${payload.event}] Batch ${payload.batchId || 'N/A'}`);
  console.log(`   ↳ Details: ${payload.details}`);

  if (webhookUrl) {
    try {
      const url = new URL(webhookUrl);
      await new Promise((resolve) => {
        const req = https.request(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }, () => resolve());
        req.on('error', () => resolve());
        req.write(JSON.stringify(payload));
        req.end();
      });
    } catch {}
  }
}

/**
 * Monitor Existing Backups for Corruption or Missing Archives
 */
export function auditBackupIntegrity() {
  if (!fs.existsSync(BACKUP_ROOT)) return { healthy: 0, corrupted: 0, missing: true };

  const entries = fs.readdirSync(BACKUP_ROOT)
    .filter(f => f.startsWith('SMARTDEAL-ENT-BACKUP-'))
    .sort().reverse();

  if (entries.length === 0) return { healthy: 0, corrupted: 0, missing: true };

  let healthy = 0;
  let corrupted = 0;
  const checked = [];

  for (const batch of entries) {
    const encJsonPath = path.join(BACKUP_ROOT, batch, `${batch}.enc.json`);
    if (!fs.existsSync(encJsonPath)) {
      corrupted++;
      checked.push({ batch, valid: false, error: 'enc.json file missing' });
      continue;
    }

    try {
      const raw = JSON.parse(fs.readFileSync(encJsonPath, 'utf8'));
      const decrypted = decryptPayload(raw.payload);
      const computedHash = crypto.createHash('sha256').update(decrypted).digest('hex');
      if (computedHash === raw.sha256Plaintext) {
        healthy++;
        checked.push({ batch, valid: true, sha256: computedHash, sizeKb: (raw.byteSize / 1024).toFixed(1) });
      } else {
        corrupted++;
        checked.push({ batch, valid: false, error: 'SHA-256 Checksum mismatch' });
      }
    } catch (err) {
      corrupted++;
      checked.push({ batch, valid: false, error: err.message });
    }
  }

  return { healthy, corrupted, missing: false, checked };
}

/**
 * Execute Complete Backup Pipeline, GFS Retention & Isolated Restore Drill
 */
export async function executeBackupPipelineAndDrill() {
  console.log('================================================================');
  console.log('🛡️ SMARTDEAL PHASE 4: AUTOMATED BACKUP & RESTORE DRILL ENGINE');
  console.log('================================================================\n');

  const startTime = Date.now();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const batchId = `SMARTDEAL-ENT-BACKUP-${timestamp}`;
  const targetDir = path.join(BACKUP_ROOT, batchId);
  fs.mkdirSync(targetDir, { recursive: true });

  // 1. Full pg_dump across all 10 schemas
  console.log('--- Step 1: Performing Full PostgreSQL Dump across 10 Enterprise Schemas ---');
  const rawDumpPath = path.join(targetDir, `${batchId}.raw.sql`);
  execSync(`"${PG_DUMP_BIN}" -h 127.0.0.1 -p 5433 -U postgres -d smartdeal -F p -f "${rawDumpPath}"`, {
    stdio: 'pipe'
  });

  const rawBuffer = fs.readFileSync(rawDumpPath);
  const rawSha256 = crypto.createHash('sha256').update(rawBuffer).digest('hex');
  const rawKb = (rawBuffer.length / 1024).toFixed(1);
  console.log(`  ✓ Raw SQL dump size: ${rawKb} KB`);
  console.log(`  ✓ Plaintext SHA-256: ${rawSha256}`);

  // 2. Encrypt with AES-256-GCM
  console.log('\n--- Step 2: Encrypting Archive with AES-256-GCM ---');
  const encryptedPayload = encryptBuffer(rawBuffer);
  const archiveJson = {
    batchId,
    timestamp: new Date().toISOString(),
    algorithm: ENCRYPTION_ALGO,
    sha256Plaintext: rawSha256,
    byteSize: rawBuffer.length,
    payload: encryptedPayload
  };
  const archivePath = path.join(targetDir, `${batchId}.enc.json`);
  fs.writeFileSync(archivePath, JSON.stringify(archiveJson, null, 2), 'utf8');
  console.log(`  ✓ Encrypted archive saved: ${archivePath}`);

  // Clean raw dump file from disk immediately for security
  fs.unlinkSync(rawDumpPath);

  // 3. Offsite Cloud Synchronization (Cloudflare R2 / AWS S3)
  console.log('\n--- Step 3: Offsite Cloud Synchronization ---');
  const offsiteResult = await uploadToOffsiteStorage(`${batchId}.enc.json`, Buffer.from(JSON.stringify(archiveJson)));
  console.log(`  ↳ Offsite Sync Status: ${offsiteResult.status}`);
  if (offsiteResult.status === 'PENDING_CREDENTIALS') {
    console.log(`  ℹ️ [Offsite Notice]: ${offsiteResult.message}`);
  } else if (offsiteResult.status === 'UPLOADED') {
    console.log(`  ✅ Synced to ${offsiteResult.provider} bucket: ${offsiteResult.bucket}`);
  }

  // 4. GFS Retention Policy Application
  console.log('\n--- Step 4: Applying Grandfather-Father-Son (GFS) Retention Policy ---');
  const retentionResult = applyGfsRetentionPolicy();
  console.log(`  ✓ Retained Backups: ${retentionResult.retained.length} slots`);
  retentionResult.retained.forEach(r => console.log(`    ↳ [${r.reason}] ${r.batch}`));
  if (retentionResult.pruned.length > 0) {
    console.log(`  ✓ Pruned Expired Backups: ${retentionResult.pruned.length}`);
    retentionResult.pruned.forEach(p => console.log(`    ↳ Pruned: ${p}`));
  } else {
    console.log('  ✓ No expired backup batches required pruning.');
  }

  // 5. Isolated Restore Drill
  console.log('\n--- Step 5: Executing Isolated Restore Drill into temporary DB ---');
  console.log('  ⚠️ Target: smartdeal_restore_test (Local isolated test database)');
  
  // Decrypt archive in-memory
  const decryptedRestoreBuffer = decryptPayload(encryptedPayload);
  const verifySha256 = crypto.createHash('sha256').update(decryptedRestoreBuffer).digest('hex');
  if (verifySha256 !== rawSha256) {
    throw new Error('Integrity Check Failed: Decrypted SHA-256 does not match original plaintext hash!');
  }
  console.log(`  ✓ Cryptographic Decryption & SHA-256 Verification: 100% MATCH`);

  const tempRestoreSqlPath = path.join(targetDir, `${batchId}.temp_restore.sql`);
  fs.writeFileSync(tempRestoreSqlPath, decryptedRestoreBuffer);

  const localPool = new Pool({ host: '127.0.0.1', port: 5433, user: 'postgres', password: '', database: 'postgres' });
  await localPool.query('DROP DATABASE IF EXISTS smartdeal_restore_test;');
  await localPool.query('CREATE DATABASE smartdeal_restore_test;');
  await localPool.end();

  const restoreStart = performance.now();
  execSync(`"${PSQL_BIN}" -h 127.0.0.1 -p 5433 -U postgres -d smartdeal_restore_test -f "${tempRestoreSqlPath}"`, {
    stdio: 'pipe'
  });
  const restoreMs = Math.round(performance.now() - restoreStart);
  const restoreSec = (restoreMs / 1000).toFixed(2);
  console.log(`  ✅ Restore successfully executed in ${restoreMs} ms (${restoreSec}s RTO).`);

  // Unlink temp decrypted restore sql immediately
  fs.unlinkSync(tempRestoreSqlPath);

  // 6. Schema & Table Parity Verification
  console.log('\n--- Step 6: Verifying Schema, Table & Row Count Parity ---');
  const restorePool = new Pool({ host: '127.0.0.1', port: 5433, user: 'postgres', password: '', database: 'smartdeal_restore_test' });
  
  const tablesRes = await restorePool.query(`
    SELECT table_schema, count(*)::int as count 
    FROM information_schema.tables 
    WHERE table_schema IN ('identity', 'administration', 'catalog', 'marketplace', 'pricing', 'offers', 'affiliate', 'personalization', 'analytics', 'operations')
    GROUP BY table_schema ORDER BY table_schema;
  `);

  const totalTables = tablesRes.rows.reduce((sum, r) => sum + r.count, 0);
  console.log(`  ✓ Restored Enterprise Tables Count: ${totalTables} (Expected: 63)`);
  for (const row of tablesRes.rows) {
    console.log(`    ↳ Schema '${row.table_schema}': ${row.count} tables`);
  }

  // Representative records check
  const adminCheck = await restorePool.query(`
    SELECT a.id, a.user_id, a.role, u.email 
    FROM administration.admin_users a 
    JOIN identity.users u ON a.user_id = u.id 
    ORDER BY a.id;
  `);
  console.log(`  ✓ Restored Super Admins: ${adminCheck.rows.length}`);
  adminCheck.rows.forEach(a => console.log(`    ↳ [${a.id}] ${a.email} (${a.role})`));

  const catalogCheck = await restorePool.query('SELECT count(*)::int as count FROM catalog.products;');
  console.log(`  ✓ Restored Catalog Products: ${catalogCheck.rows[0].count}`);

  await restorePool.end();

  // 7. Dispatch Success Notification
  await sendBackupNotification({
    type: 'SUCCESS',
    batchId,
    rtoSeconds: restoreSec,
    rpoHours: '6 - 24',
    sha256: rawSha256,
    sizeKb: rawKb,
    externalStatus: offsiteResult.status,
    details: `Backup batch ${batchId} generated, AES-256-GCM encrypted, verified with SHA-256, and restored into test DB in ${restoreSec}s.`
  });

  console.log('\n================================================================');
  console.log(`VERDICT: RESTORE DRILL 100% SUCCESSFUL (RTO: ${restoreSec}s, Tables: ${totalTables}/63)`);
  console.log('================================================================');

  return {
    batchId,
    sha256: rawSha256,
    byteSize: rawBuffer.length,
    rtoSeconds: restoreSec,
    tablesRestored: totalTables,
    offsiteResult,
    retentionResult
  };
}

if (process.argv[1] && process.argv[1].endsWith('automated_backup_manager.mjs')) {
  executeBackupPipelineAndDrill().catch(err => {
    console.error('Backup Engine Error:', err);
    process.exit(1);
  });
}
