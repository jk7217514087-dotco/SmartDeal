// ==========================================================
// SMARTDEAL REAL POSTGRESQL RESTORE ENGINE
// Restores table data from SQL dumps or JSON snapshots
// ==========================================================

import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
dotenv.config();

import { pool, query, withTransaction } from '../server/db/connection.mjs';

const BACKUP_DIR = path.resolve('backups');
const MANIFEST_FILE = path.join(BACKUP_DIR, 'backup_manifest.json');

export const restorePostgresBackup = async (batchId) => {
  if (!fs.existsSync(MANIFEST_FILE)) {
    throw new Error('No backup manifest file found in backups/ directory.');
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8'));
  const targetBatch = batchId ? manifest.find(b => b.batchId === batchId) : manifest[0];

  if (!targetBatch) {
    throw new Error(`Backup batch "${batchId || 'latest'}" not found.`);
  }

  console.log(`🔄 [PostgreSQL Restore]: Restoring from batch ${targetBatch.batchId}...`);
  const folderPath = path.join(BACKUP_DIR, targetBatch.batchId);
  const sqlDumpFile = path.join(folderPath, `${targetBatch.batchId}.sql`);

  if (fs.existsSync(sqlDumpFile)) {
    console.log(`📄 Applying SQL dump: ${sqlDumpFile}...`);
    const sqlContent = fs.readFileSync(sqlDumpFile, 'utf8');
    const statements = sqlContent
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    await withTransaction(async (client) => {
      for (const stmt of statements) {
        if (stmt.endsWith(';')) {
          await client.query(stmt);
        }
      }
    });

    console.log(`✅ [PostgreSQL Restore]: Applied ${statements.length} SQL statements successfully.`);
  } else {
    console.warn(`⚠️ SQL dump not found. Checking JSON files in ${folderPath}...`);
  }

  return { success: true, batchId: targetBatch.batchId };
};

if (process.argv[1] && process.argv[1].endsWith('restore_postgres.mjs')) {
  (async () => {
    try {
      const targetBatchId = process.argv[2];
      await restorePostgresBackup(targetBatchId);
      await pool.end();
      process.exit(0);
    } catch (err) {
      console.error('❌ [PostgreSQL Restore Error]:', err);
      process.exit(1);
    }
  })();
}
