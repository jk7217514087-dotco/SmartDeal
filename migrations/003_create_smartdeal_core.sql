-- ==========================================================
-- DATABASE 3: smartdeal_core
-- Production Schema for SmartDeal Catalog, Price Comparison, Affiliate Tracking & Financials
-- Engine: InnoDB | Character Set: utf8mb4 | Collation: utf8mb4_unicode_ci
-- ==========================================================

CREATE DATABASE IF NOT EXISTS smartdeal_core
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE smartdeal_core;

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(50) DEFAULT 'Tag',
    parent_id VARCHAR(50) DEFAULT NULL,
    product_count INT DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_categories_slug (slug),
    INDEX idx_categories_parent (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Brands Table
CREATE TABLE IF NOT EXISTS brands (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    logo_url TEXT,
    is_verified BOOLEAN DEFAULT TRUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Products Table (Canonical Products)
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    brand_id VARCHAR(50),
    category_id VARCHAR(50) NOT NULL,
    description TEXT,
    mrp DECIMAL(12, 2) NOT NULL,
    selling_price DECIMAL(12, 2) NOT NULL,
    discount_percent INT DEFAULT 0 NOT NULL,
    deal_score INT DEFAULT 80 NOT NULL,
    rating DECIMAL(3, 2) DEFAULT 4.50 NOT NULL,
    reviews_count INT DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_prod_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    INDEX idx_products_category (category_id, is_active),
    INDEX idx_products_deal_score (deal_score),
    INDEX idx_products_prices (selling_price, mrp),
    INDEX idx_products_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Product Attributes Table
CREATE TABLE IF NOT EXISTS product_attributes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(64) NOT NULL,
    attribute_name VARCHAR(100) NOT NULL,
    attribute_value VARCHAR(255) NOT NULL,
    CONSTRAINT fk_attr_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_attr_prod (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Product Images Table
CREATE TABLE IF NOT EXISTS product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(64) NOT NULL,
    image_url TEXT NOT NULL,
    sort_order INT DEFAULT 0 NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE NOT NULL,
    CONSTRAINT fk_img_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_img_prod (product_id, is_primary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Product Specifications Table (Structured specs)
CREATE TABLE IF NOT EXISTS product_specifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(64) NOT NULL,
    spec_group VARCHAR(100) NOT NULL,
    spec_key VARCHAR(100) NOT NULL,
    spec_value TEXT NOT NULL,
    CONSTRAINT fk_spec_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_spec_prod (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Marketplaces Table (Configurable affiliate network partners)
CREATE TABLE IF NOT EXISTS marketplaces (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    domain VARCHAR(150) NOT NULL,
    affiliate_tag VARCHAR(100) NOT NULL,
    default_commission_rate DECIMAL(5, 2) DEFAULT 5.00 NOT NULL,
    return_window_days INT DEFAULT 7 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    price_tracking_allowed BOOLEAN DEFAULT TRUE NOT NULL,
    price_alerts_allowed BOOLEAN DEFAULT TRUE NOT NULL,
    api_access_allowed BOOLEAN DEFAULT TRUE NOT NULL,
    compliance_policy_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_marketplaces_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Marketplace Product Listings Table (Cross-store listings per product)
CREATE TABLE IF NOT EXISTS marketplace_product_listings (
    id VARCHAR(64) PRIMARY KEY,
    product_id VARCHAR(64) NOT NULL,
    marketplace_id VARCHAR(50) NOT NULL,
    store_sku VARCHAR(150),
    sku_url TEXT NOT NULL,
    regular_price DECIMAL(12, 2) NOT NULL,
    offer_price DECIMAL(12, 2) NOT NULL,
    in_stock BOOLEAN DEFAULT TRUE NOT NULL,
    seller_name VARCHAR(150),
    seller_rating DECIMAL(3, 2) DEFAULT 4.50,
    delivery_info VARCHAR(255),
    coupon_details VARCHAR(255),
    last_scraped_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    UNIQUE KEY uq_prod_marketplace (product_id, marketplace_id),
    CONSTRAINT fk_listing_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT fk_listing_marketplace FOREIGN KEY (marketplace_id) REFERENCES marketplaces(id) ON DELETE RESTRICT,
    INDEX idx_listings_prod (product_id),
    INDEX idx_listings_price (marketplace_id, offer_price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Price History Table (Immutable historical price movements)
CREATE TABLE IF NOT EXISTS price_history (
    id VARCHAR(64) PRIMARY KEY,
    product_id VARCHAR(64) NOT NULL,
    marketplace_id VARCHAR(50) NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    offer_price DECIMAL(12, 2) NOT NULL,
    recorded_at DATETIME NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR' NOT NULL,
    availability_status ENUM('IN_STOCK', 'OUT_OF_STOCK', 'PRICE_DROP') DEFAULT 'IN_STOCK' NOT NULL,
    event_label VARCHAR(150),
    CONSTRAINT fk_hist_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT fk_hist_marketplace FOREIGN KEY (marketplace_id) REFERENCES marketplaces(id) ON DELETE RESTRICT,
    INDEX idx_price_history_lookup (product_id, marketplace_id, recorded_at),
    INDEX idx_price_history_date (recorded_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Affiliate Links Table
CREATE TABLE IF NOT EXISTS affiliate_links (
    id VARCHAR(64) PRIMARY KEY,
    product_id VARCHAR(64) NOT NULL,
    marketplace_id VARCHAR(50) NOT NULL,
    original_url TEXT NOT NULL,
    clean_affiliate_url TEXT NOT NULL,
    tracking_param_name VARCHAR(50) DEFAULT 'tag',
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_aff_link_prod FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT fk_aff_link_store FOREIGN KEY (marketplace_id) REFERENCES marketplaces(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Affiliate Clicks Table (Outbound click tracking)
CREATE TABLE IF NOT EXISTS affiliate_clicks (
    id VARCHAR(64) PRIMARY KEY,
    click_id VARCHAR(64) NOT NULL UNIQUE,
    product_id VARCHAR(64) NOT NULL,
    marketplace_id VARCHAR(50) NOT NULL,
    user_id VARCHAR(36),
    guest_id VARCHAR(64),
    price_at_click DECIMAL(12, 2) NOT NULL,
    target_url TEXT NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    referrer TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_clicks_id (click_id),
    INDEX idx_clicks_prod_store (product_id, marketplace_id),
    INDEX idx_clicks_time (created_at),
    INDEX idx_clicks_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Affiliate Conversions Table (Verified network order confirmations)
CREATE TABLE IF NOT EXISTS affiliate_conversions (
    id VARCHAR(64) PRIMARY KEY,
    conversion_id VARCHAR(64) NOT NULL UNIQUE,
    click_id VARCHAR(64) NOT NULL,
    order_ref VARCHAR(100) NOT NULL,
    marketplace_id VARCHAR(50) NOT NULL,
    user_id VARCHAR(36),
    sale_amount DECIMAL(12, 2) NOT NULL,
    commission_rate_snapshot DECIMAL(5, 2) NOT NULL,
    commission_earned DECIMAL(12, 2) NOT NULL,
    status ENUM('CLICKED', 'PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'PAID') DEFAULT 'PENDING' NOT NULL,
    marketplace_tx_id VARCHAR(100),
    idempotency_key VARCHAR(128) NOT NULL UNIQUE,
    metadata_json JSON,
    confirmed_at DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_conv_click (click_id),
    INDEX idx_conv_status (status, marketplace_id),
    INDEX idx_conv_created (created_at),
    INDEX idx_conv_idempotency (idempotency_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Commission Records Table (Financial platform reconciliation)
CREATE TABLE IF NOT EXISTS commission_records (
    id VARCHAR(64) PRIMARY KEY,
    conversion_id VARCHAR(64) NOT NULL UNIQUE,
    marketplace_id VARCHAR(50) NOT NULL,
    gross_commission DECIMAL(12, 2) NOT NULL,
    platform_net_revenue DECIMAL(12, 2) NOT NULL,
    tax_deductions DECIMAL(12, 2) DEFAULT 0.00 NOT NULL,
    status ENUM('ACCRUED', 'RECONCILED', 'SETTLED', 'DISPUTED') DEFAULT 'ACCRUED' NOT NULL,
    payout_batch_id VARCHAR(64) DEFAULT NULL,
    reconciled_at DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_comm_status (status),
    INDEX idx_comm_marketplace (marketplace_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Marketplace API Logs Table (Integration latency & health telemetry)
CREATE TABLE IF NOT EXISTS marketplace_api_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    marketplace_id VARCHAR(50) NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    http_status INT NOT NULL,
    response_time_ms INT NOT NULL,
    error_message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_api_logs_store (marketplace_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Analytics Events Table (High-volume platform telemetry)
CREATE TABLE IF NOT EXISTS analytics_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_type VARCHAR(64) NOT NULL,
    entity_id VARCHAR(64),
    user_id VARCHAR(36),
    guest_id VARCHAR(64),
    ip_address VARCHAR(45),
    metadata_json JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_analytics_type (event_type, created_at),
    INDEX idx_analytics_entity (entity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
