-- ==========================================================
-- SMARTDEALS PRODUCTION DATABASE SCHEMA (POSTGRESQL / MYSQL COMPLIANT)
-- Covers all 35 tables specified in Section 42 of the SmartDeals Specification
-- ==========================================================

-- 1. Roles Table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL, -- 'USER', 'SELLER', 'ADMIN', 'SUPER_ADMIN'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id INT REFERENCES roles(id) ON DELETE RESTRICT,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Addresses Table
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
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

-- 4. Sellers Table
CREATE TABLE sellers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    gst_number VARCHAR(20) UNIQUE,
    pan_number VARCHAR(15) NOT NULL,
    bank_account_number VARCHAR(30) NOT NULL,
    bank_ifsc VARCHAR(15) NOT NULL,
    kyc_status VARCHAR(30) DEFAULT 'Pending', -- 'Pending', 'Approved', 'Rejected'
    is_verified BOOLEAN DEFAULT FALSE,
    sales_count_for_incentive INT DEFAULT 0, -- Counter for 10-sales 0% commission
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Seller Documents Table (KYC)
CREATE TABLE seller_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID REFERENCES sellers(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL, -- 'GST_CERTIFICATE', 'PAN_CARD', 'CANCELLED_CHEQUE'
    file_url TEXT NOT NULL,
    verification_status VARCHAR(30) DEFAULT 'Pending',
    verified_at TIMESTAMP WITH TIME ZONE
);

-- 6. Seller Stores Table
CREATE TABLE seller_stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID UNIQUE REFERENCES sellers(id) ON DELETE CASCADE,
    store_name VARCHAR(150) NOT NULL,
    store_slug VARCHAR(150) UNIQUE NOT NULL,
    description TEXT,
    logo_url TEXT,
    rating NUMERIC(3, 2) DEFAULT 4.50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Categories Table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(50),
    parent_id INT REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Platforms Table (Price Comparison stores)
CREATE TABLE platforms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL, -- 'SmartDeals', 'Amazon India', 'Flipkart', 'Croma', 'Tata CLiQ'
    domain VARCHAR(150) NOT NULL,
    logo_url TEXT,
    affiliate_tag VARCHAR(100),
    is_internal BOOLEAN DEFAULT FALSE
);

-- 9. Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID REFERENCES sellers(id) ON DELETE SET NULL,
    category_id INT REFERENCES categories(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    mrp NUMERIC(12, 2) NOT NULL,
    selling_price NUMERIC(12, 2) NOT NULL,
    stock INT DEFAULT 0,
    sku VARCHAR(100) UNIQUE,
    deal_score INT DEFAULT 85,
    is_smartdeals_choice BOOLEAN DEFAULT FALSE,
    return_policy_days INT DEFAULT 7,
    warranty TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Product Images Table
CREATE TABLE product_images (
    id SERIAL PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INT DEFAULT 0
);

-- 11. Prices Table (Live multi-marketplace prices)
CREATE TABLE prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    platform_id INT REFERENCES platforms(id) ON DELETE CASCADE,
    price NUMERIC(12, 2) NOT NULL,
    delivery_charge NUMERIC(8, 2) DEFAULT 0.00,
    delivery_date_estimate VARCHAR(100),
    in_stock BOOLEAN DEFAULT TRUE,
    external_product_url TEXT,
    last_crawled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Price History Table (90-day Fake Discount tracking)
CREATE TABLE price_history (
    id BIGSERIAL PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    platform_id INT REFERENCES platforms(id) ON DELETE CASCADE,
    recorded_price NUMERIC(12, 2) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Offers Table
CREATE TABLE offers (
    id SERIAL PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    bank_name VARCHAR(100),
    discount_amount NUMERIC(10, 2),
    min_order_value NUMERIC(10, 2),
    valid_until TIMESTAMP WITH TIME ZONE
);

-- 14. Coupons Table
CREATE TABLE coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'SMART200', 'DEAL500'
    discount_type VARCHAR(20) NOT NULL, -- 'FLAT', 'PERCENTAGE'
    discount_value NUMERIC(10, 2) NOT NULL,
    min_cart_value NUMERIC(10, 2) DEFAULT 0.00,
    max_uses_per_user INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    valid_from TIMESTAMP WITH TIME ZONE,
    valid_until TIMESTAMP WITH TIME ZONE
);

-- 15. Cart Table
CREATE TABLE cart (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 16. Cart Items Table
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID REFERENCES cart(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 17. Wishlist Table
CREATE TABLE wishlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- 18. Orders Table
CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'SD1234567890'
    user_id UUID REFERENCES users(id) ON DELETE RESTRICT,
    address_id UUID REFERENCES addresses(id) ON DELETE RESTRICT,
    total_mrp NUMERIC(12, 2) NOT NULL,
    product_discount NUMERIC(12, 2) DEFAULT 0.00,
    delivery_charge NUMERIC(8, 2) DEFAULT 0.00,
    coupon_id INT REFERENCES coupons(id) ON DELETE SET NULL,
    coupon_discount NUMERIC(10, 2) DEFAULT 0.00,
    smartcoins_redeemed INT DEFAULT 0,
    smartcoins_discount NUMERIC(10, 2) DEFAULT 0.00,
    smartcoins_earned INT DEFAULT 0,
    final_amount NUMERIC(12, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Confirmed', -- 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 19. Order Items Table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
    seller_id UUID REFERENCES sellers(id) ON DELETE RESTRICT,
    unit_price NUMERIC(12, 2) NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 20. Payments Table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
    payment_method VARCHAR(50) NOT NULL, -- 'UPI', 'CARD', 'NET_BANKING', 'COD'
    transaction_reference VARCHAR(150),
    amount NUMERIC(12, 2) NOT NULL,
    payment_status VARCHAR(30) DEFAULT 'Paid',
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 21. Delivery Table
CREATE TABLE delivery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(50) UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
    partner_name VARCHAR(100) NOT NULL, -- 'SmartDeals Express', 'Delhivery'
    tracking_number VARCHAR(100) NOT NULL,
    current_status VARCHAR(50) DEFAULT 'Confirmed',
    expected_delivery_date DATE NOT NULL,
    delivered_at TIMESTAMP WITH TIME ZONE
);

-- 22. Reviews Table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    review_title VARCHAR(200),
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 23. Ratings Table
CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, user_id)
);

-- 24. SmartCoins Wallet Table
CREATE TABLE smartcoins_wallet (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    balance INT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 25. SmartCoins Transactions Table
CREATE TABLE smartcoins_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID REFERENCES smartcoins_wallet(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL, -- 'EARNED', 'REDEEMED'
    amount INT NOT NULL,
    reason TEXT NOT NULL,
    order_id VARCHAR(50) REFERENCES orders(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 26. Price Alerts Table
CREATE TABLE price_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    target_price NUMERIC(12, 2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 27. Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 28. Commissions Table
CREATE TABLE commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
    seller_id UUID REFERENCES sellers(id) ON DELETE CASCADE,
    sale_amount NUMERIC(12, 2) NOT NULL,
    commission_rate NUMERIC(5, 2) NOT NULL,
    commission_fee NUMERIC(12, 2) NOT NULL,
    is_incentive_waived BOOLEAN DEFAULT FALSE, -- 0% commission sale flag
    net_payout NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 29. Seller Commission Tiers Table
CREATE TABLE seller_commission_tiers (
    id SERIAL PRIMARY KEY,
    tier_name VARCHAR(100) NOT NULL,
    min_amount NUMERIC(12, 2) NOT NULL,
    max_amount NUMERIC(12, 2) NOT NULL,
    commission_rate NUMERIC(5, 2) NOT NULL,
    discount_percentage NUMERIC(5, 2) DEFAULT 0.00
);

-- 30. Affiliate Clicks Table
CREATE TABLE affiliate_clicks (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    platform_id INT REFERENCES platforms(id) ON DELETE CASCADE,
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 31. Affiliate Conversions Table
CREATE TABLE affiliate_conversions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform_id INT REFERENCES platforms(id) ON DELETE CASCADE,
    click_id BIGINT REFERENCES affiliate_clicks(id) ON DELETE SET NULL,
    conversion_amount NUMERIC(12, 2) NOT NULL,
    commission_earned NUMERIC(10, 2) NOT NULL,
    converted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 32. Analytics Table
CREATE TABLE analytics (
    id BIGSERIAL PRIMARY KEY,
    event_name VARCHAR(100) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 33. Campaigns Table
CREATE TABLE campaigns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    banner_url TEXT,
    multiplier NUMERIC(3, 1) DEFAULT 1.0,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE
);

-- 34. Admin Users Table
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    permissions JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 35. Audit Logs Table
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    target_entity VARCHAR(100),
    entity_id VARCHAR(100),
    changes JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for high-speed price queries & search
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_selling_price ON products(selling_price);
CREATE INDEX idx_prices_product_platform ON prices(product_id, platform_id);
CREATE INDEX idx_price_history_product_date ON price_history(product_id, recorded_at);
CREATE INDEX idx_orders_user ON orders(user_id);
