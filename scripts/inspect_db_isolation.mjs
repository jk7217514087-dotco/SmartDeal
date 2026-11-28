import { query, pool } from '../server/db/connection.mjs';

async function main() {
  console.log('--- Inspecting PostgreSQL Database Isolation ---');
  try {
    const schemasRes = await query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name NOT IN ('pg_catalog', 'information_schema')
      ORDER BY schema_name;
    `);
    console.log('Active Schemas:', schemasRes.map(r => r.schema_name));

    const tablesRes = await query(`
      SELECT table_schema, count(*)::int as table_count 
      FROM information_schema.tables 
      WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
      GROUP BY table_schema 
      ORDER BY table_schema;
    `);
    console.log('Tables Per Schema:', tablesRes);

    const rolesRes = await query(`
      SELECT DISTINCT role, count(*)::int as user_count 
      FROM users 
      GROUP BY role;
    `);
    console.log('User Roles Distribution in DB:', rolesRes);

    const auditRes = await query(`
      SELECT count(*)::int as total_audit_entries 
      FROM audit_logs;
    `);
    console.log('Audit Logs Table Rows in DB:', auditRes[0].total_audit_entries);

    const hashRes = await query(`
      SELECT count(*)::int as argon_hashes 
      FROM users 
      WHERE password_hash LIKE '$argon2id$%';
    `);
    console.log('Argon2id Hashed Accounts in DB:', hashRes[0].argon_hashes);

  } catch (err) {
    console.error('Database inspection error:', err.message);
  } finally {
    await pool.end();
  }
}

main();
