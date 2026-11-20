-- ==========================================================
-- DATABASE MIGRATION 004: Seed Production Baseline Data
-- Seeds initial Roles, Permissions, Marketplaces, Categories & Baseline Entities
-- ==========================================================

-- ----------------------------------------------------------
-- 1. SEED smartdeal_admin
-- ----------------------------------------------------------
USE smartdeal_admin;

INSERT INTO admin_roles (role_code, role_name, description, is_system_role) VALUES
('SUPER_ADMIN', 'Super Administrator', 'Full administrative authority across all platform modules, security configurations and finances.', TRUE),
('ADMIN', 'Platform Administrator', 'Operational management of catalog, marketplaces, users and affiliate tracking.', TRUE),
('SUPPORT_ADMIN', 'Customer Support Specialist', 'Read-only access to customer activity and support tickets without financial or security modification rights.', TRUE)
ON DUPLICATE KEY UPDATE role_name=VALUES(role_name);

INSERT INTO admin_permissions (permission_code, module_name, description) VALUES
('CATALOG_READ', 'Catalog', 'View products, categories and specifications'),
('CATALOG_WRITE', 'Catalog', 'Create, update and archive products and categories'),
('MARKETPLACE_READ', 'Marketplaces', 'View marketplace compliance and affiliate configs'),
('MARKETPLACE_WRITE', 'Marketplaces', 'Update commission rates and tracking parameters'),
('USER_READ', 'Users', 'Inspect customer account profiles and timestamps'),
('USER_SUSPEND', 'Users', 'Suspend, block or reactivate customer accounts'),
('USER_EXPORT', 'Users', 'Export permitted customer lists to CSV'),
('AFFILIATE_VERIFY', 'Affiliate', 'Reconcile and confirm incoming network commissions'),
('FINANCE_VIEW', 'Finance', 'Inspect gross affiliate revenues and platform commission yields'),
('SECURITY_AUDIT', 'Security', 'View administrative activity audit logs and security telemetry'),
('ADMIN_MANAGE', 'Admin', 'Create, edit and assign administrative role accounts'),
('SYSTEM_CONFIG', 'System', 'Modify environment and platform operational rules')
ON DUPLICATE KEY UPDATE module_name=VALUES(module_name);

-- Assign permissions to SUPER_ADMIN (All permissions)
INSERT IGNORE INTO role_permissions (role_code, permission_code)
SELECT 'SUPER_ADMIN', permission_code FROM admin_permissions;

-- Assign permissions to ADMIN
INSERT IGNORE INTO role_permissions (role_code, permission_code) VALUES
('ADMIN', 'CATALOG_READ'),
('ADMIN', 'CATALOG_WRITE'),
('ADMIN', 'MARKETPLACE_READ'),
('ADMIN', 'MARKETPLACE_WRITE'),
('ADMIN', 'USER_READ'),
('ADMIN', 'USER_SUSPEND'),
('ADMIN', 'USER_EXPORT'),
('ADMIN', 'AFFILIATE_VERIFY'),
('ADMIN', 'FINANCE_VIEW'),
('ADMIN', 'SECURITY_AUDIT');

-- Assign permissions to SUPPORT_ADMIN
INSERT IGNORE INTO role_permissions (role_code, permission_code) VALUES
('SUPPORT_ADMIN', 'CATALOG_READ'),
('SUPPORT_ADMIN', 'MARKETPLACE_READ'),
('SUPPORT_ADMIN', 'USER_READ');

-- Seed Initial Super Admin Account (Owner Phone: 7217514087, Email: admin@smartdeal.com)
-- Password hash: SHA-256 for 'password123' (will support Argon2id / bcrypt in Auth service)
INSERT INTO admin_accounts (id, full_name, email, phone, password_hash, role_code, mfa_enabled, status) VALUES
('ADM-SUPER-001', 'SmartDeal Owner', 'admin@smartdeal.com', '7217514087', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'SUPER_ADMIN', TRUE, 'ACTIVE')
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

-- Seed System Operational Settings
INSERT INTO admin_settings (setting_key, setting_value, category, description, is_sensitive) VALUES
('platform_name', 'SmartDeal', 'GENERAL', 'Public platform commercial branding name', FALSE),
('owner_phone', '7217514087', 'CONTACT', 'Primary store owner cellular phone for critical security alerts', TRUE),
('owner_email', 'jk7217514087@gmail.com', 'CONTACT', 'Primary security and financial alert notifications recipient', TRUE),
('default_affiliate_tag', 'smartdeal-21', 'AFFILIATE', 'Default platform affiliate identification tag', FALSE),
('click_tracking_enabled', 'true', 'AFFILIATE', 'Global outbound affiliate redirect recording toggle', FALSE),
('rate_limit_per_minute', '60', 'SECURITY', 'Sliding window max requests per minute per IP', FALSE),
('mfa_mandatory_for_admin', 'true', 'SECURITY', 'Enforce 2-factor OTP challenge on all admin logins', FALSE)
ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value);


-- ----------------------------------------------------------
-- 2. SEED smartdeal_core
-- ----------------------------------------------------------
USE smartdeal_core;

-- Seed Categories
INSERT INTO categories (id, name, slug, icon, product_count, is_active) VALUES
('cat-mobiles', 'Mobiles & Tablets', 'mobiles', 'Smartphone', 24, TRUE),
('cat-laptops', 'Laptops & Computers', 'laptops', 'Laptop', 18, TRUE),
('cat-audio', 'Audio & Headphones', 'audio', 'Headphones', 32, TRUE),
('cat-wearables', 'Smartwatches & Wearables', 'wearables', 'Watch', 15, TRUE),
('cat-appliances', 'Home Appliances', 'appliances', 'Tv', 20, TRUE),
('cat-fashion', 'Fashion & Footwear', 'fashion', 'ShoppingBag', 45, TRUE)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Seed 8 Marketplaces (With Strict AJIO Compliance Policy Flag)
INSERT INTO marketplaces (id, name, domain, affiliate_tag, default_commission_rate, return_window_days, is_active, price_tracking_allowed, price_alerts_allowed, compliance_policy_notes) VALUES
('amazon', 'Amazon India', 'amazon.in', 'smartdeal-21', 5.50, 7, TRUE, TRUE, TRUE, 'Amazon Associates operating agreement compliant.'),
('flipkart', 'Flipkart', 'flipkart.com', 'smartdeal', 6.00, 10, TRUE, TRUE, TRUE, 'Flipkart Affiliate API compliant.'),
('croma', 'Croma', 'croma.com', 'smartdeal_crm', 4.50, 15, TRUE, TRUE, TRUE, 'Direct retail affiliate partner.'),
('reliancedigital', 'Reliance Digital', 'reliancedigital.in', 'smartdeal_rd', 4.00, 7, TRUE, TRUE, TRUE, 'Authorized omnichannel partner.'),
('myntra', 'Myntra', 'myntra.com', 'smartdeal_myn', 7.50, 14, TRUE, TRUE, TRUE, 'Curated fashion affiliate partner.'),
('tatacliq', 'Tata CLiQ', 'tatacliq.com', 'smartdeal_tata', 5.00, 7, TRUE, TRUE, TRUE, 'Luxury and electronics verified affiliate partner.'),
('meesho', 'Meesho', 'meesho.com', 'smartdeal_aff', 8.00, 7, TRUE, TRUE, FALSE, 'Direct budget deals partner.'),
('ajio', 'AJIO', 'ajio.com', 'smartdeal_ajio', 7.00, 15, TRUE, FALSE, FALSE, 'Price tracking and price alerts strictly paused until advance written approval.')
ON DUPLICATE KEY UPDATE default_commission_rate=VALUES(default_commission_rate);

-- Seed Baseline Canonical Products
INSERT INTO products (id, name, slug, category_id, description, mrp, selling_price, discount_percent, deal_score, rating, reviews_count, is_active) VALUES
('prod-hp-pavilion-15', 'HP Pavilion 15 (Intel Core i5 12th Gen, 16GB/512GB SSD)', 'hp-pavilion-15-i5-12th-gen', 'cat-laptops', 'High performance everyday computing laptop with Intel Core i5 12th Gen, FHD IPS display and B&O audio.', 69990.00, 54990.00, 21, 91, 4.50, 8940, TRUE),
('prod-samsung-m14', 'Samsung Galaxy M14 5G (Smoky Teal, 6GB RAM, 128GB Storage)', 'samsung-galaxy-m14-5g', 'cat-mobiles', '50MP triple camera, 6000mAh battery, 5G octa-core processor.', 17999.00, 12490.00, 31, 92, 4.40, 14820, TRUE),
('prod-apple-iphone15', 'Apple iPhone 15 (Black, 128 GB)', 'apple-iphone-15-black-128gb', 'cat-mobiles', 'Dynamic Island, 48MP main camera, USB-C, A16 Bionic chip.', 79900.00, 69900.00, 13, 95, 4.80, 14230, TRUE),
('prod-asus-vivobook', 'ASUS Vivobook 15 (Intel Core i5 12th Gen, 16GB/512GB SSD)', 'asus-vivobook-15-core-i5', 'cat-laptops', 'Sleek and lightweight laptop with military-grade durability and NanoEdge display.', 68990.00, 48990.00, 29, 94, 4.60, 6300, TRUE),
('prod-noise-endeavour-pro', 'Noise Endeavour Pro Rugged Smart Watch (1.46" AMOLED Display)', 'noise-endeavour-pro-rugged-watch', 'cat-wearables', 'Rugged outdoor smartwatch with 1.46" AMOLED display, BT calling, SOS and IP68 water resistance.', 19999.00, 9999.00, 50, 98, 4.80, 12701, TRUE),
('prod-sony-wh1000xm5', 'Sony WH-1000XM5 Wireless Noise Canceling Headphones', 'sony-wh-1000xm5-headphones', 'cat-audio', 'Industry-leading noise cancellation with 8 microphones and Auto NC Optimizer.', 34990.00, 26990.00, 23, 93, 4.70, 5120, TRUE),
('prod-macbook-air-m2', 'Apple MacBook Air M2 (8GB RAM, 256GB SSD, Midnight)', 'apple-macbook-air-m2-midnight', 'cat-laptops', 'Strikingly thin design with M2 chip, 13.6-inch Liquid Retina display and up to 18 hours battery life.', 99900.00, 82990.00, 17, 96, 4.90, 11450, TRUE)
ON DUPLICATE KEY UPDATE selling_price=VALUES(selling_price);

-- Seed Marketplace Listings
INSERT INTO marketplace_product_listings (id, product_id, marketplace_id, store_sku, sku_url, regular_price, offer_price, in_stock, seller_name, seller_rating, delivery_info) VALUES
('LIST-HP-FK', 'prod-hp-pavilion-15', 'flipkart', 'FK-HP15-01', 'https://www.flipkart.com/hp-pavilion-15/p/itm159', 69990.00, 54990.00, TRUE, 'RetailNet Authorized (4.8 ★)', 4.80, 'Tomorrow, FREE Delivery'),
('LIST-HP-AMZ', 'prod-hp-pavilion-15', 'amazon', 'B0B5H93H98', 'https://www.amazon.in/dp/B0B5H93H98', 69990.00, 56499.00, TRUE, 'Appario Retail (4.9 ★)', 4.90, '2-3 Days, Prime Delivery'),
('LIST-HP-CRM', 'prod-hp-pavilion-15', 'croma', 'CRM-261902', 'https://www.croma.com/hp-pavilion-15/p/261902', 69990.00, 57990.00, TRUE, 'Croma Retail (4.5 ★)', 4.50, 'Tomorrow Express'),
('LIST-HP-RD', 'prod-hp-pavilion-15', 'reliancedigital', 'RD-492819', 'https://www.reliancedigital.in/hp-pavilion-15/p/492819', 69990.00, 58490.00, TRUE, 'Reliance Digital Official', 4.30, '2-3 Days Delivery'),

('LIST-SAM-AMZ', 'prod-samsung-m14', 'amazon', 'B0BY8MCQ9S', 'https://www.amazon.in/dp/B0BY8MCQ9S', 17999.00, 12490.00, TRUE, 'Appario Retail', 4.90, 'Prime 1-Day Delivery'),
('LIST-SAM-FK', 'prod-samsung-m14', 'flipkart', 'FK-M14-02', 'https://www.flipkart.com/samsung-galaxy-m14-5g/p/itm124', 17999.00, 12999.00, TRUE, 'RetailNet', 4.70, '2 Days Delivery'),

('LIST-IPH-AMZ', 'prod-apple-iphone15', 'amazon', 'B0CHX1W1XY', 'https://www.amazon.in/dp/B0CHX1W1XY', 79900.00, 69900.00, TRUE, 'Apple Authorized Retailer', 4.90, 'Same Day Prime Delivery'),
('LIST-IPH-FK', 'prod-apple-iphone15', 'flipkart', 'FK-IPH15-01', 'https://www.flipkart.com/apple-iphone-15-black-128-gb/p/itmbf5553', 79900.00, 70499.00, TRUE, 'SuperComNet', 4.80, 'Tomorrow Delivery')
ON DUPLICATE KEY UPDATE offer_price=VALUES(offer_price);


-- ----------------------------------------------------------
-- 3. SEED smartdeal_users (Initial customer benchmark)
-- ----------------------------------------------------------
USE smartdeal_users;

INSERT INTO users (id, full_name, email, phone, password_hash, role, status) VALUES
('U10025', 'Rahul Sharma', 'rahul.sharma@example.com', '9876543210', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'USER', 'ACTIVE'),
('U10026', 'Rohit Kumar', 'rohit.kumar@example.com', '9876543211', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'USER', 'ACTIVE')
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

INSERT INTO user_profiles (id, user_id, city, state, pincode) VALUES
('PROF-U10025', 'U10025', 'New Delhi', 'Delhi', '110016'),
('PROF-U10026', 'U10026', 'Bengaluru', 'Karnataka', '560001')
ON DUPLICATE KEY UPDATE city=VALUES(city);

INSERT INTO user_preferences (id, user_id, theme, currency) VALUES
('PREF-U10025', 'U10025', 'steel-navy', 'INR'),
('PREF-U10026', 'U10026', 'emerald-surge', 'INR')
ON DUPLICATE KEY UPDATE theme=VALUES(theme);
