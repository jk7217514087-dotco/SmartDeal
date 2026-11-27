import { pool, query, getDatabaseHealth } from '../server/db/connection.mjs';

async function main() {
  const health = await getDatabaseHealth();
  console.log('--- DATABASE HEALTH ---');
  console.log(JSON.stringify(health, null, 2));

  const schemas = await query(`
    SELECT schema_name 
    FROM information_schema.schemata 
    WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
    ORDER BY schema_name;
  `);
  console.log('--- EXISTING SCHEMAS ---');
  console.log(schemas.map(s => s.schema_name));

  const tables = await query(`
    SELECT table_schema, table_name 
    FROM information_schema.tables 
    WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
    ORDER BY table_schema, table_name;
  `);
  console.log('--- EXISTING TABLES ---');
  console.table(tables);

  const rowCounts = {};
  for (const t of tables) {
    try {
      const countRes = await query(`SELECT count(*) as count FROM "${t.table_schema}"."${t.table_name}";`);
      rowCounts[`${t.table_schema}.${t.table_name}`] = countRes[0].count;
    } catch (e) {
      rowCounts[`${t.table_schema}.${t.table_name}`] = `Err: ${e.message}`;
    }
  }
  console.log('--- ROW COUNTS ---');
  console.log(rowCounts);

  await pool.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
