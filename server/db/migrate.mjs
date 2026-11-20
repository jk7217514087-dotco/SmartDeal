// ==========================================================
// SMARTDEAL DATABASE MIGRATION ENGINE
// Executes migrations against smartdeal_users, smartdeal_admin, and smartdeal_core
// ==========================================================

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const DEFAULT_HOST = process.env.DB_HOST || '127.0.0.1';
const DEFAULT_PORT = parseInt(process.env.DB_PORT || '3306', 10);
const DEFAULT_USER = process.env.DB_USER || 'root';
const DEFAULT_PASS = process.env.DB_PASSWORD || '';

const MIGRATIONS_DIR = path.resolve('migrations');

export const runMigrations = async () => {
  console.log('🔄 [SmartDeal Migrations] Starting database migration check...');

  let rootConnection = null;
  try {
    rootConnection = await mysql.createConnection({
      host: DEFAULT_HOST,
      port: DEFAULT_PORT,
      user: DEFAULT_USER,
      password: DEFAULT_PASS,
      multipleStatements: true
    });
    console.log(`✅ [SmartDeal Migrations] Connected to MySQL host at ${DEFAULT_HOST}:${DEFAULT_PORT}`);
  } catch (err) {
    console.warn(`⚠️ [SmartDeal Migrations] MySQL connection failed (${err.message}).`);
    console.warn(`ℹ️ You can run migrations manually once MySQL server is started: node server/db/migrate.mjs`);
    return { success: false, error: err.message };
  }

  try {
    const files = fs.readdirSync(MIGRATIONS_DIR)
      .filter(f => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      const filePath = path.join(MIGRATIONS_DIR, file);
      console.log(`📄 Applying migration file: ${file}...`);
      const sql = fs.readFileSync(filePath, 'utf8');

      // Execute SQL with multiple statements enabled
      await rootConnection.query(sql);
      console.log(`   ✓ Applied: ${file}`);
    }

    console.log('🎉 [SmartDeal Migrations] All 3 databases (smartdeal_users, smartdeal_admin, smartdeal_core) successfully prepared!');
    await rootConnection.end();
    return { success: true, count: files.length };
  } catch (err) {
    console.error('❌ [SmartDeal Migrations] Migration failed:', err.message);
    if (rootConnection) await rootConnection.end().catch(() => {});
    return { success: false, error: err.message };
  }
};

// Auto-run if executed directly via CLI
if (process.argv[1] && process.argv[1].endsWith('migrate.mjs')) {
  runMigrations()
    .then(res => {
      if (res.success) process.exit(0);
      else process.exit(1);
    })
    .catch(() => process.exit(1));
}
