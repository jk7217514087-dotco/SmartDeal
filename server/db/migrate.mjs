// ==========================================================
// SMARTDEAL REAL PRODUCTION POSTGRESQL MIGRATION RUNNER
// Executes all DDL tables, indexes, constraints & seeds
// existing users and catalog with zero data loss.
// ==========================================================

import fs from 'node:fs';
import nodePath from 'node:path';
import { pool, withTransaction } from './connection.mjs';

export const runMigrations = async () => {
  console.log('🔄 [PostgreSQL Migration]: Starting schema initialization...');

  await withTransaction(async (client) => {
    // 1. Roles Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        full_name VARCHAR(150) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'USER' NOT NULL,
        status VARCHAR(30) DEFAULT 'ACTIVE' NOT NULL,
        email_verified BOOLEAN DEFAULT FALSE,
        phone_verified BOOLEAN DEFAULT FALSE,
        failed_login_attempts INT DEFAULT 0,
        locked_until TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
    `);

    // 3. User Sessions Table (Persistent SQL Session Store)
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
        session_token_hash VARCHAR(128) NOT NULL UNIQUE,
        ip_address VARCHAR(45),
        user_agent TEXT,
        device_type VARCHAR(50) DEFAULT 'BROWSER',
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_active_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token_hash);
      CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON user_sessions(user_id);
    `);

    // 4. User Profiles Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        avatar_url TEXT,
        bio TEXT,
        date_of_birth DATE,
        gender VARCHAR(30),
        city VARCHAR(100),
        state VARCHAR(100),
        pincode VARCHAR(20),
        country VARCHAR(100) DEFAULT 'India',
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. User Preferences Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_preferences (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        theme VARCHAR(50) DEFAULT 'steel-navy',
        currency VARCHAR(10) DEFAULT 'INR',
        notify_price_drops BOOLEAN DEFAULT TRUE,
        notify_email_digest BOOLEAN DEFAULT TRUE,
        notify_sms_alerts BOOLEAN DEFAULT FALSE,
        language VARCHAR(10) DEFAULT 'en',
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6. User Addresses Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS addresses (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
        full_name VARCHAR(150) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        street TEXT NOT NULL,
        landmark VARCHAR(150),
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        pincode VARCHAR(10) NOT NULL,
        is_default BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 7. Wishlists Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS wishlist (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
        product_id VARCHAR(100) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT uq_user_wishlist_product UNIQUE(user_id, product_id)
      );
      CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlist(user_id);
    `);

    // 8. Admin Roles Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_roles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        permissions JSONB NOT NULL DEFAULT '[]',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 9. Admin Users Table (Strict RBAC Isolation)
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(50) NOT NULL DEFAULT 'ADMIN',
        permissions JSONB NOT NULL DEFAULT '[]',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 10. Admin Sessions Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_sessions (
        id VARCHAR(64) PRIMARY KEY,
        admin_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
        session_token_hash VARCHAR(128) NOT NULL UNIQUE,
        ip_address VARCHAR(45),
        user_agent TEXT,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token_hash);
    `);

    // 11. Admin Audit Logs Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id BIGSERIAL PRIMARY KEY,
        admin_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
        admin_email VARCHAR(255),
        action VARCHAR(100) NOT NULL,
        target_entity VARCHAR(100),
        entity_id VARCHAR(100),
        changes JSONB,
        ip_address VARCHAR(45),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_time ON audit_logs(created_at);
    `);

    // 12. Categories Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        icon VARCHAR(50),
        count INT DEFAULT 0,
        parent_id VARCHAR(64) REFERENCES categories(id) ON DELETE SET NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 13. Platforms / Marketplaces Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS platforms (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        domain VARCHAR(150) NOT NULL,
        logo_url TEXT,
        affiliate_tag VARCHAR(100),
        commission_rate NUMERIC(5, 2) DEFAULT 5.0,
        return_window_days INT DEFAULT 7,
        active BOOLEAN DEFAULT TRUE,
        price_tracking_allowed BOOLEAN DEFAULT TRUE,
        price_alerts_allowed BOOLEAN DEFAULT TRUE,
        is_internal BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 14. Products Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(100) PRIMARY KEY,
        category_id VARCHAR(64) REFERENCES categories(id) ON DELETE SET NULL,
        name VARCHAR(255) NOT NULL,
        brand VARCHAR(100) NOT NULL,
        mrp NUMERIC(12, 2) NOT NULL,
        selling_price NUMERIC(12, 2) NOT NULL,
        discount_percent INT DEFAULT 0,
        rating NUMERIC(3, 2) DEFAULT 4.5,
        reviews_count INT DEFAULT 0,
        deal_score INT DEFAULT 85,
        is_smartdeals_choice BOOLEAN DEFAULT FALSE,
        stock INT DEFAULT 50,
        return_days INT DEFAULT 7,
        warranty TEXT,
        description TEXT,
        features JSONB DEFAULT '[]',
        specs JSONB DEFAULT '{}',
        image_url TEXT,
        images JSONB DEFAULT '[]',
        deal_score_breakdown JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
      CREATE INDEX IF NOT EXISTS idx_products_selling_price ON products(selling_price);
      CREATE INDEX IF NOT EXISTS idx_products_deal_score ON products(deal_score);
    `);

    // 15. Marketplace Prices Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS marketplace_prices (
        id VARCHAR(64) PRIMARY KEY,
        product_id VARCHAR(100) REFERENCES products(id) ON DELETE CASCADE,
        platform_id VARCHAR(64) REFERENCES platforms(id) ON DELETE CASCADE,
        price NUMERIC(12, 2) NOT NULL,
        sku_url TEXT,
        in_stock BOOLEAN DEFAULT TRUE,
        delivery_charge NUMERIC(8, 2) DEFAULT 0.00,
        delivery_date_estimate VARCHAR(100),
        last_checked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT uq_product_platform UNIQUE(product_id, platform_id)
      );
      CREATE INDEX IF NOT EXISTS idx_mp_product ON marketplace_prices(product_id);
      CREATE INDEX IF NOT EXISTS idx_mp_price ON marketplace_prices(price);
    `);

    // 16. Price History Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS price_history (
        id BIGSERIAL PRIMARY KEY,
        product_id VARCHAR(100) REFERENCES products(id) ON DELETE CASCADE,
        platform_id VARCHAR(64) REFERENCES platforms(id) ON DELETE SET NULL,
        recorded_price NUMERIC(12, 2) NOT NULL,
        recorded_date VARCHAR(50),
        event VARCHAR(100),
        recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_price_history_product_time ON price_history(product_id, recorded_at);
    `);

    // 17. Outbound Affiliate Clicks Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS outbound_clicks (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
        guest_id VARCHAR(64),
        product_id VARCHAR(100) REFERENCES products(id) ON DELETE CASCADE,
        platform_id VARCHAR(64) REFERENCES platforms(id) ON DELETE SET NULL,
        target_url TEXT NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_outbound_clicks_user ON outbound_clicks(user_id);
      CREATE INDEX IF NOT EXISTS idx_outbound_clicks_product ON outbound_clicks(product_id);
    `);

    // 18. Affiliate Conversions Table (Strict Idempotency)
    await client.query(`
      CREATE TABLE IF NOT EXISTS affiliate_conversions (
        id VARCHAR(64) PRIMARY KEY,
        idempotency_key VARCHAR(128) UNIQUE NOT NULL,
        click_id VARCHAR(64) REFERENCES outbound_clicks(id) ON DELETE SET NULL,
        user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
        platform_id VARCHAR(64) REFERENCES platforms(id) ON DELETE SET NULL,
        order_amount NUMERIC(12, 2) NOT NULL,
        commission_rate NUMERIC(5, 2) NOT NULL,
        commission_amount NUMERIC(12, 2) NOT NULL,
        cashback_rate NUMERIC(5, 2) NOT NULL DEFAULT 50.0,
        cashback_amount NUMERIC(12, 2) NOT NULL,
        status VARCHAR(30) DEFAULT 'CONFIRMED',
        converted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_conversions_idempotency ON affiliate_conversions(idempotency_key);
      CREATE INDEX IF NOT EXISTS idx_conversions_user ON affiliate_conversions(user_id);
    `);

    // 19. Cashback Wallets Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS cashback_wallets (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        confirmed_balance NUMERIC(12, 2) DEFAULT 0.00,
        pending_balance NUMERIC(12, 2) DEFAULT 0.00,
        redeemed_balance NUMERIC(12, 2) DEFAULT 0.00,
        lifetime_cashback NUMERIC(12, 2) DEFAULT 0.00,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 20. Cashback Double-Entry Ledger Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS cashback_ledger (
        id VARCHAR(64) PRIMARY KEY,
        wallet_id VARCHAR(64) REFERENCES cashback_wallets(id) ON DELETE CASCADE,
        user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
        conversion_id VARCHAR(64) REFERENCES affiliate_conversions(id) ON DELETE SET NULL,
        entry_type VARCHAR(30) NOT NULL,
        amount NUMERIC(12, 2) NOT NULL,
        status VARCHAR(30) NOT NULL,
        balance_after NUMERIC(12, 2) NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_cashback_ledger_user ON cashback_ledger(user_id);
    `);

    // 21. Price Alerts Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS price_alerts (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
        product_id VARCHAR(100) REFERENCES products(id) ON DELETE CASCADE,
        target_price NUMERIC(12, 2) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 22. Notifications Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        notification_type VARCHAR(50),
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 23. Admin Settings Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_settings (
        id VARCHAR(64) PRIMARY KEY DEFAULT 'primary',
        settings JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 24. Cart and Cart Items Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS cart (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS cart_items (
        id VARCHAR(64) PRIMARY KEY,
        cart_id VARCHAR(64) REFERENCES cart(id) ON DELETE CASCADE,
        product_id VARCHAR(100) REFERENCES products(id) ON DELETE CASCADE,
        quantity INT DEFAULT 1,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 25. Orders & Order Items
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) REFERENCES users(id) ON DELETE RESTRICT,
        total_mrp NUMERIC(12, 2) NOT NULL,
        product_discount NUMERIC(12, 2) DEFAULT 0.00,
        delivery_charge NUMERIC(8, 2) DEFAULT 0.00,
        final_amount NUMERIC(12, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'Confirmed',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
  });

  console.log('✅ [PostgreSQL Migration]: All tables and indexes verified.');
};

/**
 * Seeds baseline data from server/users.json and catalog definitions
 */
export const seedBaselineData = async () => {
  console.log('🌱 [PostgreSQL Seeding]: Starting baseline data seeding...');

  // 1. Seed Roles
  const roles = [
    { name: 'USER', description: 'Standard platform customer' },
    { name: 'ADMIN', description: 'Administrative staff with delegated access' },
    { name: 'SUPER_ADMIN', description: 'System owner with unrestricted privileges' },
    { name: 'SELLER', description: 'Verified merchant or brand partner' }
  ];

  for (const r of roles) {
    await pool.query(`
      INSERT INTO roles (name, description)
      VALUES ($1, $2)
      ON CONFLICT (name) DO NOTHING;
    `, [r.name, r.description]);
  }

  // 2. Seed Platforms (8 Supported Marketplaces)
  const platforms = [
    { id: 'amazon', name: 'Amazon India', domain: 'amazon.in', affiliateTag: 'smartdeal-21', commissionRate: 5.5, returnWindowDays: 7 },
    { id: 'flipkart', name: 'Flipkart', domain: 'flipkart.com', affiliateTag: 'smartdeal', commissionRate: 6.0, returnWindowDays: 10 },
    { id: 'meesho', name: 'Meesho', domain: 'meesho.com', affiliateTag: 'smartdeal_aff', commissionRate: 8.0, returnWindowDays: 7 },
    { id: 'myntra', name: 'Myntra', domain: 'myntra.com', affiliateTag: 'smartdeal_myn', commissionRate: 7.5, returnWindowDays: 14 },
    { id: 'ajio', name: 'AJIO', domain: 'ajio.com', affiliateTag: 'smartdeal_ajio', commissionRate: 7.0, returnWindowDays: 15 },
    { id: 'tatacliq', name: 'Tata CLiQ', domain: 'tatacliq.com', affiliateTag: 'smartdeal_tata', commissionRate: 5.0, returnWindowDays: 7 },
    { id: 'croma', name: 'Croma', domain: 'croma.com', affiliateTag: 'smartdeal_crm', commissionRate: 4.5, returnWindowDays: 15 },
    { id: 'reliancedigital', name: 'Reliance Digital', domain: 'reliancedigital.in', affiliateTag: 'smartdeal_rd', commissionRate: 4.0, returnWindowDays: 7 }
  ];

  for (const p of platforms) {
    await pool.query(`
      INSERT INTO platforms (id, name, domain, affiliate_tag, commission_rate, return_window_days)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        domain = EXCLUDED.domain,
        affiliate_tag = EXCLUDED.affiliate_tag,
        commission_rate = EXCLUDED.commission_rate,
        return_window_days = EXCLUDED.return_window_days;
    `, [p.id, p.name, p.domain, p.affiliateTag, p.commissionRate, p.returnWindowDays]);
  }

  // 3. Seed Categories
  const categories = [
    { id: 'cat-mobiles', name: 'Mobiles & Tablets', slug: 'mobiles', icon: 'Smartphone', count: 24 },
    { id: 'cat-laptops', name: 'Laptops & Computers', slug: 'laptops', icon: 'Laptop', count: 18 },
    { id: 'cat-audio', name: 'Audio & Headphones', slug: 'audio', icon: 'Headphones', count: 32 },
    { id: 'cat-wearables', name: 'Smartwatches & Wearables', slug: 'wearables', icon: 'Watch', count: 15 },
    { id: 'cat-appliances', name: 'Home Appliances', slug: 'appliances', icon: 'Tv', count: 20 },
    { id: 'cat-fashion', name: 'Fashion & Footwear', slug: 'fashion', icon: 'ShoppingBag', count: 45 }
  ];

  for (const c of categories) {
    await pool.query(`
      INSERT INTO categories (id, name, slug, icon, count)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        slug = EXCLUDED.slug,
        icon = EXCLUDED.icon,
        count = EXCLUDED.count;
    `, [c.id, c.name, c.slug, c.icon, c.count]);
  }

  // 4. Seed Essential System Administrators (Rule 3 compliant: Only System Admins, NO mock users)
  const systemAdmins = [
    {
      id: 'U10000',
      name: 'SmartDeal Owner',
      email: 'jk7217514087@gmail.com',
      phone: '7217514087',
      passwordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', // admin123
      role: 'SUPER_ADMIN',
      status: 'ACTIVE'
    },
    {
      id: 'U10001',
      name: 'SmartDeal Administrator',
      email: 'admin@smartdeal.com',
      phone: '7217514087',
      passwordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', // admin123
      role: 'SUPER_ADMIN',
      status: 'ACTIVE'
    }
  ];

  for (const u of systemAdmins) {
    await pool.query(`
      INSERT INTO users (id, full_name, email, phone, password_hash, role, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
      ON CONFLICT (email) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        phone = COALESCE(EXCLUDED.phone, users.phone),
        role = EXCLUDED.role,
        status = EXCLUDED.status;
    `, [u.id, u.name, u.email, u.phone, u.passwordHash, u.role, u.status]);

    await pool.query(`
      INSERT INTO admin_users (id, user_id, role, permissions)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id) DO UPDATE SET
        role = EXCLUDED.role,
        permissions = EXCLUDED.permissions;
    `, [u.id, u.id, u.role, JSON.stringify(['*'])]);

    await pool.query(`
      INSERT INTO user_preferences (id, user_id, theme, currency)
      VALUES ($1, $2, 'steel-navy', 'INR')
      ON CONFLICT (user_id) DO NOTHING;
    `, [`pref-${u.id}`, u.id]);
  }
  console.log('✅ [PostgreSQL Seeding]: Seeded system administrator accounts.');

  // Only import local users.json if explicitly requested via SEED_LOCAL_USERS=true
  if (process.env.SEED_LOCAL_USERS === 'true') {
    const usersFilePath = nodePath.resolve(process.cwd(), 'server', 'users.json');
    if (fs.existsSync(usersFilePath)) {
      try {
        const rawUsers = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
        let seededUsersCount = 0;

        for (const u of rawUsers) {
          const id = u.id || `U-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
          const name = u.name || u.full_name || 'Customer';
          const email = (u.email || '').toLowerCase().trim();
          if (!email) continue;
          const phone = u.phone || null;
          const passwordHash = u.passwordHash || u.password_hash || '';
          const role = u.role || 'USER';
          const status = u.status || 'ACTIVE';
          const createdAt = u.createdAt ? new Date(u.createdAt) : new Date();

          await pool.query(`
            INSERT INTO users (id, full_name, email, phone, password_hash, role, status, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (email) DO UPDATE SET
              full_name = EXCLUDED.full_name,
              phone = COALESCE(EXCLUDED.phone, users.phone),
              role = EXCLUDED.role,
              status = EXCLUDED.status;
          `, [id, name, email, phone, passwordHash, role, status, createdAt]);

          if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
            await pool.query(`
              INSERT INTO admin_users (id, user_id, role, permissions)
              VALUES ($1, $2, $3, $4)
              ON CONFLICT (user_id) DO UPDATE SET
                role = EXCLUDED.role,
                permissions = EXCLUDED.permissions;
            `, [id, id, role, JSON.stringify(['*'])]);
          }

          await pool.query(`
            INSERT INTO user_preferences (id, user_id, theme, currency)
            VALUES ($1, $2, 'steel-navy', 'INR')
            ON CONFLICT (user_id) DO NOTHING;
          `, [`pref-${id}`, id]);

          seededUsersCount++;
        }
        console.log(`✅ [PostgreSQL Seeding]: Seeded ${seededUsersCount} users from users.json`);
      } catch (err) {
        console.error('⚠️ [PostgreSQL Seeding User Error]:', err.message);
      }
    }
  } else {
    console.log('ℹ️ [PostgreSQL Seeding]: Skipped local mock users (Rule 3 compliant: pure enterprise setup).');
  }

  // 5. Seed Core Catalog Products from server/server.mjs definitions
  const baselineProducts = [
    {
      id: 'prod-samsung-m14',
      name: 'Samsung Galaxy M14 5G (Smoky Teal, 6GB RAM, 128GB Storage)',
      brand: 'Samsung',
      categoryId: 'cat-mobiles',
      mrp: 17999,
      sellingPrice: 12490,
      discountPercent: 31,
      rating: 4.4,
      reviewsCount: 14820,
      dealScore: 92,
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
      listings: [
        { platformId: 'amazon', price: 12490, skuUrl: 'https://www.amazon.in/dp/B0BY8MCQ9S' },
        { platformId: 'flipkart', price: 12999, skuUrl: 'https://www.flipkart.com/samsung-galaxy-m14-5g/p/itm124' },
        { platformId: 'croma', price: 13490, skuUrl: 'https://www.croma.com/samsung-galaxy-m14-5g/p/271891' }
      ]
    },
    {
      id: 'prod-apple-iphone15',
      name: 'Apple iPhone 15 (Black, 128 GB)',
      brand: 'Apple',
      categoryId: 'cat-mobiles',
      mrp: 79900,
      sellingPrice: 69900,
      discountPercent: 13,
      rating: 4.8,
      reviewsCount: 14230,
      dealScore: 95,
      imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
      listings: [
        { platformId: 'amazon', price: 69900, skuUrl: 'https://www.amazon.in/dp/B0CHX1W1XY' },
        { platformId: 'flipkart', price: 70499, skuUrl: 'https://www.flipkart.com/apple-iphone-15-black-128-gb/p/itmbf5553' },
        { platformId: 'reliancedigital', price: 71200, skuUrl: 'https://www.reliancedigital.in/apple-iphone-15-128gb/p/4938392' }
      ]
    },
    {
      id: 'prod-asus-vivobook',
      name: 'ASUS Vivobook 15 (Intel Core i5 12th Gen, 16GB/512GB SSD)',
      brand: 'ASUS',
      categoryId: 'cat-laptops',
      mrp: 68990,
      sellingPrice: 48990,
      discountPercent: 29,
      rating: 4.6,
      reviewsCount: 6300,
      dealScore: 94,
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80',
      listings: [
        { platformId: 'amazon', price: 48990, skuUrl: 'https://www.amazon.in/dp/B0C1K9V2W3' },
        { platformId: 'flipkart', price: 49490, skuUrl: 'https://www.flipkart.com/asus-vivobook-15-core-i5/p/itm872' }
      ]
    },
    {
      id: 'prod-hp-pavilion-15',
      name: 'HP Pavilion 15 (Intel Core i5 12th Gen, 16GB/512GB SSD)',
      brand: 'HP',
      categoryId: 'cat-laptops',
      mrp: 69990,
      sellingPrice: 54990,
      discountPercent: 21,
      rating: 4.5,
      reviewsCount: 8940,
      dealScore: 91,
      imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
      listings: [
        { platformId: 'flipkart', price: 54990, skuUrl: 'https://www.flipkart.com/hp-pavilion-15/p/itm159' },
        { platformId: 'amazon', price: 56499, skuUrl: 'https://www.amazon.in/dp/B0B5H93H98' },
        { platformId: 'croma', price: 57990, skuUrl: 'https://www.croma.com/hp-pavilion-15/p/261902' },
        { platformId: 'reliancedigital', price: 58490, skuUrl: 'https://www.reliancedigital.in/hp-pavilion-15/p/492819' }
      ]
    },
    {
      id: 'prod-noise-endeavour-pro',
      name: 'Noise Endeavour Pro Rugged Smart Watch (1.46" AMOLED Display)',
      brand: 'Noise',
      categoryId: 'cat-wearables',
      mrp: 19999,
      sellingPrice: 9999,
      discountPercent: 50,
      rating: 4.8,
      reviewsCount: 12701,
      dealScore: 98,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      listings: [
        { platformId: 'amazon', price: 9999, skuUrl: 'https://www.amazon.in/dp/B0CFX5N8PQ' },
        { platformId: 'flipkart', price: 10499, skuUrl: 'https://www.flipkart.com/noise-endeavour-pro/p/itme98' }
      ]
    },
    {
      id: 'prod-sony-wh1000xm5',
      name: 'Sony WH-1000XM5 Wireless Industry Leading Noise Canceling Headphones',
      brand: 'Sony',
      categoryId: 'cat-audio',
      mrp: 34990,
      sellingPrice: 26990,
      discountPercent: 23,
      rating: 4.7,
      reviewsCount: 18920,
      dealScore: 96,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      listings: [
        { platformId: 'amazon', price: 26990, skuUrl: 'https://www.amazon.in/dp/B09XS7JWHH' },
        { platformId: 'flipkart', price: 28990, skuUrl: 'https://www.flipkart.com/sony-wh-1000xm5/p/itm771' },
        { platformId: 'croma', price: 29990, skuUrl: 'https://www.croma.com/sony-wh-1000xm5/p/257321' }
      ]
    }
  ];

  if (process.env.SEED_MOCK_CATALOG === 'true') {
    for (const prod of baselineProducts) {
      await pool.query(`
        INSERT INTO products (
          id, category_id, name, brand, mrp, selling_price, discount_percent,
          rating, reviews_count, deal_score, image_url
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          brand = EXCLUDED.brand,
          mrp = EXCLUDED.mrp,
          selling_price = EXCLUDED.selling_price,
          discount_percent = EXCLUDED.discount_percent,
          deal_score = EXCLUDED.deal_score,
          image_url = EXCLUDED.image_url;
      `, [
        prod.id, prod.categoryId, prod.name, prod.brand, prod.mrp,
        prod.sellingPrice, prod.discountPercent, prod.rating, prod.reviewsCount,
        prod.dealScore, prod.imageUrl
      ]);

      for (const listing of prod.listings) {
        await pool.query(`
          INSERT INTO marketplace_prices (id, product_id, platform_id, price, sku_url, in_stock)
          VALUES ($1, $2, $3, $4, $5, TRUE)
          ON CONFLICT (product_id, platform_id) DO UPDATE SET
            price = EXCLUDED.price,
            sku_url = EXCLUDED.sku_url;
        `, [`${prod.id}-${listing.platformId}`, prod.id, listing.platformId, listing.price, listing.skuUrl]);

        // Seed initial price history
        await pool.query(`
          INSERT INTO price_history (product_id, platform_id, recorded_price, recorded_date, event)
          VALUES ($1, $2, $3, 'Today', 'Live Marketplace Price')
          ON CONFLICT DO NOTHING;
        `, [prod.id, listing.platformId, listing.price]);
      }
    }
    console.log('✅ [PostgreSQL Seeding]: Seeded mock catalog products.');
  } else {
    console.log('ℹ️ [PostgreSQL Seeding]: Skipped local mock catalog products (Rule 3 compliant).');
  }

  // 6. Seed Admin Settings
  await pool.query(`
    INSERT INTO admin_settings (id, settings)
    VALUES ('primary', $1)
    ON CONFLICT (id) DO UPDATE SET
      settings = EXCLUDED.settings,
      updated_at = CURRENT_TIMESTAMP;
  `, [JSON.stringify({
    platformName: 'SmartDeal',
    maintenanceMode: false,
    autoApproveSellers: false,
    defaultAffiliateTag: 'smartdeal-21',
    clickTrackingEnabled: true,
    priceAlertsGlobalEnabled: true,
    minPayoutThreshold: 500,
    supportEmail: 'support@smartdeal.com',
    ownerPhone: '7217514087',
    ownerEmail: 'jk7217514087@gmail.com'
  })]);

  console.log('✅ [PostgreSQL Seeding]: Baseline data seeded successfully.');
};

// Execute if called directly from CLI
if (process.argv[1] && process.argv[1].endsWith('migrate.mjs')) {
  (async () => {
    try {
      await runMigrations();
      await seedBaselineData();
      console.log('🎉 [PostgreSQL Setup]: Migration and Seeding Finished Successfully!');
      process.exit(0);
    } catch (err) {
      console.error('❌ [PostgreSQL Setup Error]:', err);
      process.exit(1);
    }
  })();
}
