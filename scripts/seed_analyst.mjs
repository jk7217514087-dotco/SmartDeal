import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:5433/smartdeal'
});

async function main() {
  const hash = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'; // admin123
  await pool.query(`
    INSERT INTO users (id, full_name, email, phone, password_hash, role, status, created_at)
    VALUES ('U10003', 'SmartDeal Data Analyst', 'analyst@smartdeal.com', '7217514089', $1, 'ANALYST', 'ACTIVE', NOW())
    ON CONFLICT (id) DO UPDATE SET role = 'ANALYST', status = 'ACTIVE';
  `, [hash]);

  await pool.query(`
    INSERT INTO admin_users (id, user_id, role, permissions, is_active)
    VALUES ('U10003', 'U10003', 'ANALYST', '["read:overview", "read:analytics", "read:reports"]'::jsonb, TRUE)
    ON CONFLICT (user_id) DO UPDATE SET role = 'ANALYST', is_active = TRUE;
  `);

  console.log('Seeded U10003 into PostgreSQL successfully.');
  await pool.end();
}

main().catch(err => {
  console.error('Error seeding analyst:', err);
  process.exit(1);
});
