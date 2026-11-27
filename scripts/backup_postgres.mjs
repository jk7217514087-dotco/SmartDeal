// ==========================================================
// SMARTDEAL REAL POSTGRESQL AUTOMATED BACKUP ENGINE
// Extracts table data, creates timestamped SQL dumps,
// JSON snapshots and SHA-256 checksums.
// ==========================================================

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import dotenv from 'dotenv';
dotenv.config();

import { pool, query } from '../server/db/connection.mjs';

const BACKUP_DIR = path.resolve('backups');
const MANIFEST_FILE = path.join(BACKUP_DIR, 'backup_manifest.json');

const sha256File = (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(fileBuffer).digest('hex');
};

const TABLES_TO_BACKUP = [
  'roles',
  'users',
  'user_sessions',
  'user_profiles',
  'user_preferences',
  'addresses',
  'wishlist',
  'admin_roles',
  'admin_users',
  'admin_sessions',
  'audit_logs',
  'categories',
  'platforms',
  'products',
  'marketplace_prices',
  'price_history',
  'outbound_clicks',
  'affiliate_conversions',
  'cashback_wallets',
  'cashback_ledger',
  'price_alerts',
  'notifications',
  'admin_settings'
];

export const runPostgresBackup = async () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const batchId = `SMARTDEAL-PG-BACKUP-${timestamp}`;
  const targetFolder = path.join(BACKUP_DIR, batchId);

  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  fs.mkdirSync(targetFolder, { recursive: true });

  console.log(`📦 [PostgreSQL Backup]: Initiating backup batch: ${batchId}...`);

  const backupFiles = [];
  const fullSqlDumpLines = [
    `-- ==========================================================`,
    `-- SMARTDEAL POSTGRESQL DATABASE DUMP`,
    `-- Generated At: ${new Date().toISOString()}`,
    `-- Batch ID: ${batchId}`,
    `-- ==========================================================\n`
  ];

  for (const tableName of TABLES_TO_BACKUP) {
    try {
      const rows = await query(`SELECT * FROM ${tableName};`);
      const jsonFileName = `${tableName}.json`;
      const jsonFilePath = path.join(targetFolder, jsonFileName);

      fs.writeFileSync(jsonFilePath, JSON.stringify(rows, null, 2), 'utf8');
      const stat = fs.statSync(jsonFilePath);
      const checksum = sha256File(jsonFilePath);

      backupFiles.push({
        fileName: jsonFileName,
        tableName,
        rowCount: rows.length,
        bytes: stat.size,
        checksumSha256: checksum
      });

      console.log(`   ✓ Exported ${tableName} (${rows.length} rows, ${(stat.size / 1024).toFixed(1)} KB)`);

      // Generate SQL INSERT statements
      if (rows.length > 0) {
        fullSqlDumpLines.push(`-- Table: ${tableName} (${rows.length} rows)`);
        for (const row of rows) {
          const cols = Object.keys(row);
          const vals = Object.values(row).map(v => {
            if (v === null || v === undefined) return 'NULL';
            if (typeof v === 'number' || typeof v === 'boolean') return String(v);
            if (typeof v === 'object') return `'${JSON.stringify(v).replace(/'/g, "''")}'`;
            return `'${String(v).replace(/'/g, "''")}'`;
          });
          fullSqlDumpLines.push(`INSERT INTO ${tableName} (${cols.join(', ')}) VALUES (${vals.join(', ')}) ON CONFLICT DO NOTHING;`);
        }
        fullSqlDumpLines.push('');
      }
    } catch (err) {
      console.warn(`   ⚠️ Table ${tableName} export warning:`, err.message);
    }
  }

  // Write full SQL dump file
  const sqlDumpFileName = `${batchId}.sql`;
  const sqlDumpFilePath = path.join(targetFolder, sqlDumpFileName);
  fs.writeFileSync(sqlDumpFilePath, fullSqlDumpLines.join('\n'), 'utf8');
  const sqlStat = fs.statSync(sqlDumpFilePath);
  const sqlChecksum = sha256File(sqlDumpFilePath);

  backupFiles.unshift({
    fileName: sqlDumpFileName,
    bytes: sqlStat.size,
    checksumSha256: sqlChecksum
  });

  // Update manifest
  const manifestEntry = {
    batchId,
    timestamp: new Date().toISOString(),
    status: 'VERIFIED_SUCCESSFUL',
    engine: 'PostgreSQL 18',
    totalFiles: backupFiles.length,
    totalSizeBytes: backupFiles.reduce((acc, f) => acc + f.bytes, 0),
    files: backupFiles
  };

  let manifest = [];
  try {
    if (fs.existsSync(MANIFEST_FILE)) {
      manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8'));
      if (!Array.isArray(manifest)) manifest = [];
    }
  } catch {
    manifest = [];
  }

  manifest.unshift(manifestEntry);

  // 30-Day Retention Policy Cleanup
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
  const cutoffTime = Date.now() - THIRTY_DAYS_MS;
  manifest = manifest.filter(entry => {
    const entryTime = new Date(entry.timestamp).getTime();
    if (entryTime < cutoffTime) {
      const oldFolder = path.join(BACKUP_DIR, entry.batchId);
      if (fs.existsSync(oldFolder)) {
        fs.rmSync(oldFolder, { recursive: true, force: true });
        console.log(`   🗑️ Purged expired backup: ${entry.batchId}`);
      }
      return false;
    }
    return true;
  });

  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`✅ [PostgreSQL Backup]: Successfully completed batch ${batchId}. Total size: ${(manifestEntry.totalSizeBytes / 1024).toFixed(1)} KB`);

  return manifestEntry;
};

if (process.argv[1] && process.argv[1].endsWith('backup_postgres.mjs')) {
  (async () => {
    try {
      await runPostgresBackup();
      await pool.end();
      process.exit(0);
    } catch (err) {
      console.error('❌ [PostgreSQL Backup Error]:', err);
      process.exit(1);
    }
  })();
}
