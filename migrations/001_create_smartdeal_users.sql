-- ==========================================================
-- DATABASE 1: smartdeal_users
-- Production Schema for SmartDeal User & Customer Identity Management
-- Engine: InnoDB | Character Set: utf8mb4 | Collation: utf8mb4_unicode_ci
-- ==========================================================

CREATE DATABASE IF NOT EXISTS smartdeal_users
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE smartdeal_users;

-- 1. Users Table (Core customer identity)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) DEFAULT 'USER' NOT NULL,
    status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'BLOCKED') DEFAULT 'ACTIVE' NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE NOT NULL,
    phone_verified BOOLEAN DEFAULT FALSE NOT NULL,
    failed_login_attempts INT DEFAULT 0 NOT NULL,
    locked_until DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_users_email (email),
    INDEX idx_users_phone (phone),
    INDEX idx_users_status (status),
    INDEX idx_users_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. User Profiles Table (Detailed demographic & shipping metadata)
CREATE TABLE IF NOT EXISTS user_profiles (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,
    avatar_url TEXT,
    bio TEXT,
    date_of_birth DATE,
    gender ENUM('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    country VARCHAR(100) DEFAULT 'India',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_profiles_city (city),
    INDEX idx_profiles_pincode (pincode)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. User Preferences Table (App customizations & privacy)
CREATE TABLE IF NOT EXISTS user_preferences (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,
    theme VARCHAR(50) DEFAULT 'steel-navy' NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR' NOT NULL,
    notify_price_drops BOOLEAN DEFAULT TRUE NOT NULL,
    notify_email_digest BOOLEAN DEFAULT TRUE NOT NULL,
    notify_sms_alerts BOOLEAN DEFAULT FALSE NOT NULL,
    language VARCHAR(10) DEFAULT 'en' NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_pref_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. User Sessions Table (Stateful token & device management)
CREATE TABLE IF NOT EXISTS user_sessions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    session_token_hash VARCHAR(64) NOT NULL UNIQUE,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    device_type VARCHAR(50) DEFAULT 'BROWSER',
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_active_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_session_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_sessions_lookup (session_token_hash, expires_at),
    INDEX idx_user_sessions_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. User Login History Table (Security & intrusion detection)
CREATE TABLE IF NOT EXISTS user_login_history (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    email_attempted VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    status ENUM('SUCCESS', 'FAILED', 'BLOCKED_LOCKED') NOT NULL,
    failure_reason VARCHAR(255),
    login_time DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_login_history_user (user_id),
    INDEX idx_login_history_ip (ip_address, login_time),
    INDEX idx_login_history_time (login_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Wishlists Table (Saved products for tracking)
CREATE TABLE IF NOT EXISTS wishlists (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(64) NOT NULL,
    target_alert_price DECIMAL(12, 2) DEFAULT NULL,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE KEY uq_user_product_wishlist (user_id, product_id),
    CONSTRAINT fk_wishlist_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_wishlists_user (user_id),
    INDEX idx_wishlists_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Recently Viewed Products Table
CREATE TABLE IF NOT EXISTS recently_viewed_products (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(64) NOT NULL,
    viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    UNIQUE KEY uq_user_recent_view (user_id, product_id),
    CONSTRAINT fk_recent_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_recent_viewed (user_id, viewed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Search History Table (Personalized discovery analytics)
CREATE TABLE IF NOT EXISTS search_history (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    guest_id VARCHAR(64),
    search_query VARCHAR(255) NOT NULL,
    category_filter VARCHAR(100),
    results_count INT DEFAULT 0 NOT NULL,
    searched_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_search_user (user_id),
    INDEX idx_search_query (search_query),
    INDEX idx_search_time (searched_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Price Alerts Table (Automated threshold notifications)
CREATE TABLE IF NOT EXISTS price_alerts (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(64) NOT NULL,
    target_price DECIMAL(12, 2) NOT NULL,
    price_at_creation DECIMAL(12, 2) NOT NULL,
    preferred_marketplace VARCHAR(50) DEFAULT 'ALL',
    status ENUM('ACTIVE', 'TRIGGERED', 'CANCELLED', 'EXPIRED') DEFAULT 'ACTIVE' NOT NULL,
    triggered_at DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_alert_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_price_alerts_status (status),
    INDEX idx_price_alerts_product (product_id, target_price),
    INDEX idx_price_alerts_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. User Notifications Table
CREATE TABLE IF NOT EXISTS user_notifications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('PRICE_DROP', 'SECURITY', 'SYSTEM', 'DEAL_ALERT') DEFAULT 'PRICE_DROP' NOT NULL,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    metadata_json JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_notif_read (user_id, is_read, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. User Activity History Table
CREATE TABLE IF NOT EXISTS user_activity_history (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    action_type VARCHAR(64) NOT NULL,
    entity_id VARCHAR(64),
    entity_type VARCHAR(64),
    ip_address VARCHAR(45) NOT NULL,
    details_json JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_activity_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_activity (user_id, created_at),
    INDEX idx_user_action_type (action_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
