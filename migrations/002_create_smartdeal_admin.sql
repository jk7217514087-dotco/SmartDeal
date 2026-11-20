-- ==========================================================
-- DATABASE 2: smartdeal_admin
-- Production Schema for SmartDeal Administrative Governance, RBAC & Security Audit
-- Engine: InnoDB | Character Set: utf8mb4 | Collation: utf8mb4_unicode_ci
-- ==========================================================

CREATE DATABASE IF NOT EXISTS smartdeal_admin
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE smartdeal_admin;

-- 1. Admin Roles Table (Super Admin, Admin, Support Admin)
CREATE TABLE IF NOT EXISTS admin_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_code VARCHAR(50) NOT NULL UNIQUE,
    role_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT TRUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Admin Permissions Table (Granular system capabilities)
CREATE TABLE IF NOT EXISTS admin_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    permission_code VARCHAR(80) NOT NULL UNIQUE,
    module_name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_perm_module (module_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Role Permissions Mapping Table
CREATE TABLE IF NOT EXISTS role_permissions (
    role_code VARCHAR(50) NOT NULL,
    permission_code VARCHAR(80) NOT NULL,
    PRIMARY KEY (role_code, permission_code),
    INDEX idx_rp_role (role_code),
    INDEX idx_rp_permission (permission_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Admin Accounts Table (Staff and leadership identities)
CREATE TABLE IF NOT EXISTS admin_accounts (
    id VARCHAR(36) PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role_code VARCHAR(50) NOT NULL,
    mfa_enabled BOOLEAN DEFAULT TRUE NOT NULL,
    mfa_secret VARCHAR(64) DEFAULT NULL,
    status ENUM('ACTIVE', 'SUSPENDED', 'BLOCKED') DEFAULT 'ACTIVE' NOT NULL,
    failed_login_attempts INT DEFAULT 0 NOT NULL,
    locked_until DATETIME DEFAULT NULL,
    last_login_at DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_admin_role FOREIGN KEY (role_code) REFERENCES admin_roles(role_code) ON DELETE RESTRICT,
    INDEX idx_admin_email (email),
    INDEX idx_admin_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Admin Sessions Table (MFA-verified administrative bearer sessions)
CREATE TABLE IF NOT EXISTS admin_sessions (
    id VARCHAR(36) PRIMARY KEY,
    admin_id VARCHAR(36) NOT NULL,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    mfa_verified BOOLEAN DEFAULT FALSE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_activity_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_adminsess_account FOREIGN KEY (admin_id) REFERENCES admin_accounts(id) ON DELETE CASCADE,
    INDEX idx_admin_session_lookup (token_hash, expires_at),
    INDEX idx_admin_session_admin (admin_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Admin Login History Table
CREATE TABLE IF NOT EXISTS admin_login_history (
    id VARCHAR(36) PRIMARY KEY,
    admin_id VARCHAR(36),
    email_attempted VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    status ENUM('SUCCESS', 'MFA_CHALLENGE', 'FAILED_CREDENTIALS', 'FAILED_MFA', 'ACCOUNT_LOCKED') NOT NULL,
    failure_reason VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_admin_login_hist_admin (admin_id),
    INDEX idx_admin_login_hist_time (created_at),
    INDEX idx_admin_login_hist_ip (ip_address)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Admin Activity Logs Table (Immutable enterprise audit trail)
CREATE TABLE IF NOT EXISTS admin_activity_logs (
    id VARCHAR(36) PRIMARY KEY,
    admin_id VARCHAR(36) NOT NULL,
    admin_email VARCHAR(255) NOT NULL,
    admin_role VARCHAR(50) NOT NULL,
    action VARCHAR(80) NOT NULL,
    target_entity VARCHAR(80) NOT NULL,
    entity_id VARCHAR(80) NOT NULL,
    details_json JSON,
    ip_address VARCHAR(45) NOT NULL,
    correlation_id VARCHAR(64) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_admin_audit_actor (admin_id, action),
    INDEX idx_admin_audit_target (target_entity, entity_id),
    INDEX idx_admin_audit_time (created_at),
    INDEX idx_admin_audit_corr (correlation_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Security Events Table (Automated intrusion & threat telemetry)
CREATE TABLE IF NOT EXISTS security_events (
    id VARCHAR(36) PRIMARY KEY,
    event_type VARCHAR(64) NOT NULL,
    severity ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM' NOT NULL,
    description TEXT NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    metadata_json JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_sec_events_sev (severity, created_at),
    INDEX idx_sec_events_type (event_type),
    INDEX idx_sec_events_ip (ip_address)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Admin Settings Table (Dynamic system operational parameters)
CREATE TABLE IF NOT EXISTS admin_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'GENERAL' NOT NULL,
    description TEXT,
    is_sensitive BOOLEAN DEFAULT FALSE NOT NULL,
    updated_by VARCHAR(36),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_admin_settings_cat (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. System Configuration Table
CREATE TABLE IF NOT EXISTS system_configuration (
    id INT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(100) NOT NULL UNIQUE,
    config_value TEXT NOT NULL,
    environment VARCHAR(30) DEFAULT 'production' NOT NULL,
    is_encrypted BOOLEAN DEFAULT FALSE NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
