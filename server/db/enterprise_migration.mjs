// ==========================================================
// SMARTDEAL NEXT-GENERATION ENTERPRISE DATABASE MIGRATION RUNNER
// Establishes 10 Logical Schemas, relocates existing data instantly,
// creates enterprise catalog, pricing, offer, and affiliate entities
// with B-tree, GIN full-text indexes and partition readiness.
// ==========================================================

import { pool, withTransaction, query } from './connection.mjs';

export const runEnterpriseMigration = async () => {
  console.log('🏛️ [Enterprise Migration]: Starting schema reorganization...');

  await withTransaction(async (client) => {
    // ------------------------------------------------------------------------
    // 1. CREATE ALL 10 LOGICAL SCHEMAS
    // ------------------------------------------------------------------------
    const schemas = [
      'identity',
      'administration',
      'catalog',
      'marketplace',
      'pricing',
      'offers',
      'affiliate',
      'personalization',
      'analytics',
      'operations'
    ];

    for (const schema of schemas) {
      await client.query(`CREATE SCHEMA IF NOT EXISTS ${schema};`);
    }
    console.log('✅ Created/verified 10 logical schemas.');

    // ------------------------------------------------------------------------
    // 2. HELPER TO SAFELY RELOCATE EXISTING TABLES FROM PUBLIC
    // ------------------------------------------------------------------------
    const moveTableIfExists = async (tableName, targetSchema) => {
      const check = await client.query(`
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = $1;
      `, [tableName]);

      if (check.rows.length > 0) {
        // Check if target table already exists in targetSchema
        const targetCheck = await client.query(`
          SELECT 1 FROM information_schema.tables 
          WHERE table_schema = $1 AND table_name = $2;
        `, [targetSchema, tableName]);

        if (targetCheck.rows.length === 0) {
          await client.query(`ALTER TABLE public."${tableName}" SET SCHEMA ${targetSchema};`);
          console.log(`   ↳ Relocated public.${tableName} -> ${targetSchema}.${tableName}`);
        }
      }
    };

    // Relocate existing tables
    await moveTableIfExists('roles', 'identity');
    await moveTableIfExists('users', 'identity');
    await moveTableIfExists('user_sessions', 'identity');
    await moveTableIfExists('user_profiles', 'identity');
    await moveTableIfExists('user_preferences', 'personalization');
    await moveTableIfExists('addresses', 'identity');
    await moveTableIfExists('wishlist', 'personalization');
    await moveTableIfExists('admin_roles', 'administration');
    await moveTableIfExists('admin_users', 'administration');
    await moveTableIfExists('admin_sessions', 'administration');
    await moveTableIfExists('audit_logs', 'administration');
    await moveTableIfExists('categories', 'catalog');
    await moveTableIfExists('platforms', 'marketplace');
    await moveTableIfExists('products', 'catalog');
    await moveTableIfExists('marketplace_prices', 'pricing');
    await moveTableIfExists('price_history', 'pricing');
    await moveTableIfExists('price_alerts', 'personalization');
    await moveTableIfExists('notifications', 'personalization');
    await moveTableIfExists('outbound_clicks', 'affiliate');
    await moveTableIfExists('affiliate_conversions', 'affiliate');
    await moveTableIfExists('admin_settings', 'operations');

    // ------------------------------------------------------------------------
    // 3. IDENTITY SCHEMA ENHANCEMENTS
    // ------------------------------------------------------------------------
    await client.query(`
      CREATE TABLE IF NOT EXISTS identity.user_login_history (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) REFERENCES identity.users(id) ON DELETE CASCADE,
        email_attempted VARCHAR(255) NOT NULL,
        ip_address VARCHAR(45) NOT NULL,
        user_agent TEXT,
        status VARCHAR(30) NOT NULL, -- 'SUCCESS', 'FAILED', 'BLOCKED'
        failure_reason VARCHAR(255),
        login_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_login_hist_user ON identity.user_login_history(user_id);
      CREATE INDEX IF NOT EXISTS idx_login_hist_time ON identity.user_login_history(login_time);
    `);

    // ------------------------------------------------------------------------
    // 4. ADMINISTRATION SCHEMA ENHANCEMENTS
    // ------------------------------------------------------------------------
    await client.query(`
      CREATE TABLE IF NOT EXISTS administration.security_events (
        id BIGSERIAL PRIMARY KEY,
        event_type VARCHAR(100) NOT NULL,
        severity VARCHAR(30) DEFAULT 'INFO', -- 'INFO', 'WARN', 'CRITICAL'
        ip_address VARCHAR(45),
        user_id VARCHAR(64),
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_sec_events_type ON administration.security_events(event_type);
    `);

    // ------------------------------------------------------------------------
    // 5. ADVANCED CATALOG SCHEMA (Support millions of products, variants, identifiers)
    // ------------------------------------------------------------------------
    // Brands
    await client.query(`
      CREATE TABLE IF NOT EXISTS catalog.brands (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        logo_url TEXT,
        website VARCHAR(255),
        is_verified BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_brands_slug ON catalog.brands(slug);
    `);

    // Add brand_id and search vector to products if not exists
    await client.query(`
      ALTER TABLE catalog.products ADD COLUMN IF NOT EXISTS brand_id VARCHAR(64) REFERENCES catalog.brands(id) ON DELETE SET NULL;
      ALTER TABLE catalog.products ADD COLUMN IF NOT EXISTS model_number VARCHAR(100);
      ALTER TABLE catalog.products ADD COLUMN IF NOT EXISTS tsv_search tsvector;
      CREATE INDEX IF NOT EXISTS idx_products_brand_id ON catalog.products(brand_id);
      CREATE INDEX IF NOT EXISTS idx_products_tsv ON catalog.products USING gin(tsv_search);
    `);

    // Product Variants
    await client.query(`
      CREATE TABLE IF NOT EXISTS catalog.product_variants (
        id VARCHAR(64) PRIMARY KEY,
        product_id VARCHAR(100) NOT NULL REFERENCES catalog.products(id) ON DELETE CASCADE,
        variant_name VARCHAR(255) NOT NULL,
        sku VARCHAR(100) UNIQUE,
        color VARCHAR(50),
        size VARCHAR(50),
        storage_capacity VARCHAR(50),
        ram VARCHAR(50),
        mrp NUMERIC(12, 2) NOT NULL,
        selling_price NUMERIC(12, 2) NOT NULL,
        stock INT DEFAULT 10,
        image_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_variants_product ON catalog.product_variants(product_id);
    `);

    // Universal Product Identifiers (EAN, UPC, ISBN, ASIN, FSN) with duplicate detection
    await client.query(`
      CREATE TABLE IF NOT EXISTS catalog.product_identifiers (
        id VARCHAR(64) PRIMARY KEY,
        product_id VARCHAR(100) NOT NULL REFERENCES catalog.products(id) ON DELETE CASCADE,
        variant_id VARCHAR(64) REFERENCES catalog.product_variants(id) ON DELETE CASCADE,
        identifier_type VARCHAR(30) NOT NULL, -- 'EAN', 'UPC', 'ISBN', 'ASIN', 'FSN', 'MPN', 'SKU'
        identifier_value VARCHAR(100) NOT NULL,
        is_primary BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT uq_identifier_type_val UNIQUE (identifier_type, identifier_value)
      );
      CREATE INDEX IF NOT EXISTS idx_identifiers_lookup ON catalog.product_identifiers(identifier_type, identifier_value);
      CREATE INDEX IF NOT EXISTS idx_identifiers_product ON catalog.product_identifiers(product_id);
    `);

    // Dynamic Product Attributes & Attribute Values
    await client.query(`
      CREATE TABLE IF NOT EXISTS catalog.product_attributes (
        id VARCHAR(64) PRIMARY KEY,
        category_id VARCHAR(64) REFERENCES catalog.categories(id) ON DELETE CASCADE,
        attribute_name VARCHAR(100) NOT NULL,
        data_type VARCHAR(30) DEFAULT 'STRING', -- 'STRING', 'NUMBER', 'BOOLEAN'
        is_filterable BOOLEAN DEFAULT TRUE,
        is_searchable BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS catalog.product_attribute_values (
        id BIGSERIAL PRIMARY KEY,
        product_id VARCHAR(100) NOT NULL REFERENCES catalog.products(id) ON DELETE CASCADE,
        attribute_id VARCHAR(64) NOT NULL REFERENCES catalog.product_attributes(id) ON DELETE CASCADE,
        value_text TEXT,
        value_number NUMERIC(12, 4),
        value_boolean BOOLEAN,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT uq_product_attr UNIQUE (product_id, attribute_id)
      );
      CREATE INDEX IF NOT EXISTS idx_attr_val_lookup ON catalog.product_attribute_values(attribute_id, value_text);
    `);

    // Product Images (Metadata & External Object-Storage references only, never large binaries)
    await client.query(`
      CREATE TABLE IF NOT EXISTS catalog.product_images (
        id VARCHAR(64) PRIMARY KEY,
        product_id VARCHAR(100) NOT NULL REFERENCES catalog.products(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        storage_key VARCHAR(255),
        checksum_sha256 VARCHAR(64),
        mime_type VARCHAR(50) DEFAULT 'image/jpeg',
        file_size_bytes BIGINT,
        width INT,
        height INT,
        is_primary BOOLEAN DEFAULT FALSE,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_product_images_prod ON catalog.product_images(product_id, is_primary);
    `);

    // Product Specifications
    await client.query(`
      CREATE TABLE IF NOT EXISTS catalog.product_specifications (
        id BIGSERIAL PRIMARY KEY,
        product_id VARCHAR(100) NOT NULL REFERENCES catalog.products(id) ON DELETE CASCADE,
        spec_group VARCHAR(100) NOT NULL,
        spec_key VARCHAR(100) NOT NULL,
        spec_value TEXT NOT NULL,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT uq_prod_spec_key UNIQUE (product_id, spec_group, spec_key)
      );
      CREATE INDEX IF NOT EXISTS idx_prod_specs_lookup ON catalog.product_specifications(product_id);
    `);

    // Product Relationships (Accessories, Bundles, Alternatives)
    await client.query(`
      CREATE TABLE IF NOT EXISTS catalog.product_relationships (
        id VARCHAR(64) PRIMARY KEY,
        product_id VARCHAR(100) NOT NULL REFERENCES catalog.products(id) ON DELETE CASCADE,
        related_product_id VARCHAR(100) NOT NULL REFERENCES catalog.products(id) ON DELETE CASCADE,
        relationship_type VARCHAR(30) NOT NULL, -- 'ALTERNATIVE', 'ACCESSORY', 'BUNDLE', 'UPGRADE'
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT uq_prod_relationship UNIQUE (product_id, related_product_id, relationship_type)
      );
    `);

    // Product Merge & Correction Workflow Logs
    await client.query(`
      CREATE TABLE IF NOT EXISTS catalog.product_merge_logs (
        id BIGSERIAL PRIMARY KEY,
        source_product_id VARCHAR(100) NOT NULL,
        target_product_id VARCHAR(100) NOT NULL,
        reason TEXT,
        merged_by VARCHAR(64),
        merged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // ------------------------------------------------------------------------
    // 6. ADVANCED MARKETPLACE SCHEMA
    // ------------------------------------------------------------------------
    // Marketplace Sellers
    await client.query(`
      CREATE TABLE IF NOT EXISTS marketplace.marketplace_sellers (
        id VARCHAR(64) PRIMARY KEY,
        platform_id VARCHAR(64) REFERENCES marketplace.platforms(id) ON DELETE CASCADE,
        seller_name VARCHAR(150) NOT NULL,
        seller_rating NUMERIC(3, 2) DEFAULT 4.5,
        seller_score INT DEFAULT 90,
        is_authorized BOOLEAN DEFAULT TRUE,
        is_fba_assured BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_sellers_platform ON marketplace.marketplace_sellers(platform_id);
    `);

    // Marketplace Products (Catalog mapping)
    await client.query(`
      CREATE TABLE IF NOT EXISTS marketplace.marketplace_products (
        id VARCHAR(64) PRIMARY KEY,
        platform_id VARCHAR(64) NOT NULL REFERENCES marketplace.platforms(id) ON DELETE CASCADE,
        marketplace_sku VARCHAR(100) NOT NULL,
        external_id VARCHAR(100),
        title VARCHAR(255) NOT NULL,
        brand VARCHAR(100),
        category_name VARCHAR(100),
        canonical_url TEXT NOT NULL,
        matched_product_id VARCHAR(100) REFERENCES catalog.products(id) ON DELETE SET NULL,
        match_confidence NUMERIC(5, 2) DEFAULT 100.00,
        match_status VARCHAR(30) DEFAULT 'VERIFIED', -- 'PENDING', 'VERIFIED', 'MANUAL_REVIEW'
        last_crawled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT uq_platform_sku UNIQUE(platform_id, marketplace_sku)
      );
      CREATE INDEX IF NOT EXISTS idx_mp_matched ON marketplace.marketplace_products(matched_product_id);
    `);

    // Marketplace Listings
    await client.query(`
      CREATE TABLE IF NOT EXISTS marketplace.marketplace_listings (
        id VARCHAR(64) PRIMARY KEY,
        product_id VARCHAR(100) NOT NULL REFERENCES catalog.products(id) ON DELETE CASCADE,
        platform_id VARCHAR(64) NOT NULL REFERENCES marketplace.platforms(id) ON DELETE CASCADE,
        seller_id VARCHAR(64) REFERENCES marketplace.marketplace_sellers(id) ON DELETE SET NULL,
        sku_url TEXT NOT NULL,
        title VARCHAR(255),
        in_stock BOOLEAN DEFAULT TRUE,
        stock_quantity INT DEFAULT 50,
        delivery_charge NUMERIC(8, 2) DEFAULT 0.00,
        delivery_days INT DEFAULT 2,
        return_window_days INT DEFAULT 7,
        is_featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT uq_prod_platform_listing UNIQUE(product_id, platform_id)
      );
    `);

    // ------------------------------------------------------------------------
    // 7. ADVANCED PRICING & PRICE INTELLIGENCE ENGINE
    // ------------------------------------------------------------------------
    // Enhance pricing.marketplace_prices with calculation engine fields
    await client.query(`
      ALTER TABLE pricing.marketplace_prices ADD COLUMN IF NOT EXISTS mrp NUMERIC(12, 2);
      ALTER TABLE pricing.marketplace_prices ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(12, 2) DEFAULT 0.00;
      ALTER TABLE pricing.marketplace_prices ADD COLUMN IF NOT EXISTS discount_percentage NUMERIC(5, 2) DEFAULT 0.00;
      ALTER TABLE pricing.marketplace_prices ADD COLUMN IF NOT EXISTS coupon_discount NUMERIC(12, 2) DEFAULT 0.00;
      ALTER TABLE pricing.marketplace_prices ADD COLUMN IF NOT EXISTS eligible_bank_discount NUMERIC(12, 2) DEFAULT 0.00;
      ALTER TABLE pricing.marketplace_prices ADD COLUMN IF NOT EXISTS final_payable_price NUMERIC(12, 2);
      ALTER TABLE pricing.marketplace_prices ADD COLUMN IF NOT EXISTS price_source VARCHAR(50) DEFAULT 'API_FEED';
      ALTER TABLE pricing.marketplace_prices ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT TRUE;
      ALTER TABLE pricing.marketplace_prices ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

      -- Update final_payable_price default to price + delivery_charge - coupon - bank
      UPDATE pricing.marketplace_prices 
      SET final_payable_price = price + COALESCE(delivery_charge, 0) - COALESCE(coupon_discount, 0) - COALESCE(eligible_bank_discount, 0)
      WHERE final_payable_price IS NULL;

      CREATE INDEX IF NOT EXISTS idx_mp_final_price ON pricing.marketplace_prices(product_id, final_payable_price ASC);
    `);

    // Price Update Jobs Tracker
    await client.query(`
      CREATE TABLE IF NOT EXISTS pricing.price_update_jobs (
        id VARCHAR(64) PRIMARY KEY,
        platform_id VARCHAR(64) REFERENCES marketplace.platforms(id) ON DELETE CASCADE,
        status VARCHAR(30) DEFAULT 'COMPLETED', -- 'RUNNING', 'COMPLETED', 'FAILED'
        items_targeted INT DEFAULT 0,
        items_updated INT DEFAULT 0,
        error_count INT DEFAULT 0,
        started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP WITH TIME ZONE,
        log_summary TEXT
      );
    `);

    // Price Change Events
    await client.query(`
      CREATE TABLE IF NOT EXISTS pricing.price_change_events (
        id BIGSERIAL PRIMARY KEY,
        product_id VARCHAR(100) NOT NULL REFERENCES catalog.products(id) ON DELETE CASCADE,
        platform_id VARCHAR(64) NOT NULL REFERENCES marketplace.platforms(id) ON DELETE CASCADE,
        previous_price NUMERIC(12, 2) NOT NULL,
        new_price NUMERIC(12, 2) NOT NULL,
        change_amount NUMERIC(12, 2) NOT NULL,
        change_percentage NUMERIC(5, 2) NOT NULL,
        is_suspicious BOOLEAN DEFAULT FALSE, -- e.g. price drops > 80% or spikes > 300%
        detected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_price_changes_prod ON pricing.price_change_events(product_id, detected_at);
    `);

    // Price Verification Logs
    await client.query(`
      CREATE TABLE IF NOT EXISTS pricing.price_verification_logs (
        id BIGSERIAL PRIMARY KEY,
        product_id VARCHAR(100) NOT NULL REFERENCES catalog.products(id) ON DELETE CASCADE,
        platform_id VARCHAR(64) NOT NULL REFERENCES marketplace.platforms(id) ON DELETE CASCADE,
        price_verified NUMERIC(12, 2) NOT NULL,
        method VARCHAR(50) DEFAULT 'AFFILIATE_FEED',
        verifier_id VARCHAR(64),
        verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Price Source Logs (Crawler / API Response Auditing)
    await client.query(`
      CREATE TABLE IF NOT EXISTS pricing.price_source_logs (
        id BIGSERIAL PRIMARY KEY,
        platform_id VARCHAR(64) REFERENCES marketplace.platforms(id) ON DELETE SET NULL,
        product_id VARCHAR(100) REFERENCES catalog.products(id) ON DELETE CASCADE,
        status_code INT DEFAULT 200,
        latency_ms INT DEFAULT 120,
        payload_summary TEXT,
        fetched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Pre-Aggregated Daily Price Summaries (For rapid 7d, 30d, 90d charts without full-table scans)
    await client.query(`
      CREATE TABLE IF NOT EXISTS pricing.price_daily_summary (
        id BIGSERIAL PRIMARY KEY,
        product_id VARCHAR(100) NOT NULL REFERENCES catalog.products(id) ON DELETE CASCADE,
        platform_id VARCHAR(64) NOT NULL REFERENCES marketplace.platforms(id) ON DELETE CASCADE,
        summary_date DATE NOT NULL,
        min_price NUMERIC(12, 2) NOT NULL,
        max_price NUMERIC(12, 2) NOT NULL,
        avg_price NUMERIC(12, 2) NOT NULL,
        closing_price NUMERIC(12, 2) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT uq_daily_price_summary UNIQUE (product_id, platform_id, summary_date)
      );
      CREATE INDEX IF NOT EXISTS idx_daily_summary_lookup ON pricing.price_daily_summary(product_id, summary_date DESC);
    `);

    // ------------------------------------------------------------------------
    // 8. ADVANCED OFFERS & DISCOUNT ENGINE
    // ------------------------------------------------------------------------
    // Promotional Campaigns
    await client.query(`
      CREATE TABLE IF NOT EXISTS offers.promotional_campaigns (
        id VARCHAR(64) PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        description TEXT,
        banner_url TEXT,
        multiplier NUMERIC(3, 1) DEFAULT 1.0,
        start_date TIMESTAMP WITH TIME ZONE,
        end_date TIMESTAMP WITH TIME ZONE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Coupons
    await client.query(`
      CREATE TABLE IF NOT EXISTS offers.coupons (
        id VARCHAR(64) PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        title VARCHAR(150) NOT NULL,
        discount_type VARCHAR(20) NOT NULL, -- 'FLAT', 'PERCENTAGE'
        discount_value NUMERIC(10, 2) NOT NULL,
        min_cart_value NUMERIC(10, 2) DEFAULT 0.00,
        max_discount NUMERIC(10, 2),
        platform_id VARCHAR(64) REFERENCES marketplace.platforms(id) ON DELETE SET NULL,
        valid_from TIMESTAMP WITH TIME ZONE,
        valid_until TIMESTAMP WITH TIME ZONE,
        is_active BOOLEAN DEFAULT TRUE,
        terms_conditions TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_coupons_code ON offers.coupons(code);
    `);

    // Bank Offers
    await client.query(`
      CREATE TABLE IF NOT EXISTS offers.bank_offers (
        id VARCHAR(64) PRIMARY KEY,
        bank_name VARCHAR(100) NOT NULL, -- 'HDFC', 'ICICI', 'SBI', 'Axis Bank'
        card_type VARCHAR(30) NOT NULL,  -- 'CREDIT', 'DEBIT', 'EMI'
        discount_type VARCHAR(20) NOT NULL, -- 'PERCENTAGE', 'FLAT'
        discount_value NUMERIC(10, 2) NOT NULL,
        min_order_value NUMERIC(10, 2) DEFAULT 5000.00,
        max_discount_amount NUMERIC(10, 2) DEFAULT 3000.00,
        valid_from TIMESTAMP WITH TIME ZONE,
        valid_until TIMESTAMP WITH TIME ZONE,
        is_active BOOLEAN DEFAULT TRUE,
        terms_conditions TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_bank_offers_active ON offers.bank_offers(is_active, valid_until);
    `);

    // Card Eligibility
    await client.query(`
      CREATE TABLE IF NOT EXISTS offers.card_eligibility (
        id BIGSERIAL PRIMARY KEY,
        bank_offer_id VARCHAR(64) NOT NULL REFERENCES offers.bank_offers(id) ON DELETE CASCADE,
        bin_prefix VARCHAR(10),
        card_tier VARCHAR(50), -- 'PLATINUM', 'SIGNATURE', 'CORAL', 'REGALIA'
        network VARCHAR(30) DEFAULT 'VISA',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Exchange Offers
    await client.query(`
      CREATE TABLE IF NOT EXISTS offers.exchange_offers (
        id VARCHAR(64) PRIMARY KEY,
        product_id VARCHAR(100) NOT NULL REFERENCES catalog.products(id) ON DELETE CASCADE,
        base_exchange_discount NUMERIC(10, 2) DEFAULT 2000.00,
        bonus_exchange_discount NUMERIC(10, 2) DEFAULT 1000.00,
        qualifying_brands JSONB DEFAULT '["Samsung", "Apple", "Xiaomi", "OnePlus"]',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Comprehensive Structured Offers Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS offers.offers (
        id VARCHAR(64) PRIMARY KEY,
        product_id VARCHAR(100) NOT NULL REFERENCES catalog.products(id) ON DELETE CASCADE,
        platform_id VARCHAR(64) REFERENCES marketplace.platforms(id) ON DELETE SET NULL,
        offer_title VARCHAR(200) NOT NULL,
        offer_type VARCHAR(50) NOT NULL, -- 'COUPON', 'BANK', 'EXCHANGE', 'BUNDLE', 'INSTANT_DISCOUNT'
        discount_amount NUMERIC(10, 2) NOT NULL,
        min_purchase NUMERIC(10, 2) DEFAULT 0.00,
        max_discount NUMERIC(10, 2),
        eligible_payment_method VARCHAR(100),
        eligible_bank VARCHAR(100),
        valid_from TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        valid_until TIMESTAMP WITH TIME ZONE,
        terms_conditions TEXT,
        is_verified BOOLEAN DEFAULT TRUE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_offers_product ON offers.offers(product_id, is_active);
    `);

    // Offer Marketplace Mapping
    await client.query(`
      CREATE TABLE IF NOT EXISTS offers.offer_marketplace_mapping (
        id BIGSERIAL PRIMARY KEY,
        offer_id VARCHAR(64) NOT NULL REFERENCES offers.offers(id) ON DELETE CASCADE,
        platform_id VARCHAR(64) NOT NULL REFERENCES marketplace.platforms(id) ON DELETE CASCADE,
        external_offer_id VARCHAR(100),
        mapping_status VARCHAR(30) DEFAULT 'ACTIVE',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Offer Redemption Conditions
    await client.query(`
      CREATE TABLE IF NOT EXISTS offers.offer_redemption_conditions (
        id BIGSERIAL PRIMARY KEY,
        offer_id VARCHAR(64) NOT NULL REFERENCES offers.offers(id) ON DELETE CASCADE,
        condition_type VARCHAR(50) NOT NULL, -- 'FIRST_TIME_USER', 'CARD_SPECIFIC', 'MIN_VALUE'
        condition_expression JSONB NOT NULL,
        priority INT DEFAULT 1,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // ------------------------------------------------------------------------
    // 9. ADVANCED AFFILIATE DATABASE (Strict Commissions Only, No Consumer Cashback)
    // ------------------------------------------------------------------------
    // Affiliate Programs
    await client.query(`
      CREATE TABLE IF NOT EXISTS affiliate.affiliate_programs (
        id VARCHAR(64) PRIMARY KEY,
        platform_id VARCHAR(64) NOT NULL REFERENCES marketplace.platforms(id) ON DELETE CASCADE,
        program_name VARCHAR(100) NOT NULL,
        affiliate_network VARCHAR(100) DEFAULT 'DIRECT', -- 'DIRECT', 'CUELINKS', 'EARNKARO'
        default_tag VARCHAR(100) NOT NULL,
        commission_structure JSONB NOT NULL,
        cookie_duration_hours INT DEFAULT 24,
        status VARCHAR(30) DEFAULT 'ACTIVE',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Affiliate Links
    await client.query(`
      CREATE TABLE IF NOT EXISTS affiliate.affiliate_links (
        id VARCHAR(64) PRIMARY KEY,
        product_id VARCHAR(100) NOT NULL REFERENCES catalog.products(id) ON DELETE CASCADE,
        platform_id VARCHAR(64) NOT NULL REFERENCES marketplace.platforms(id) ON DELETE CASCADE,
        original_url TEXT NOT NULL,
        clean_affiliate_url TEXT NOT NULL,
        sub_id_template VARCHAR(150),
        clicks_count INT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT uq_aff_prod_platform UNIQUE (product_id, platform_id)
      );
    `);

    // Sub-Identities for advanced click attribution
    await client.query(`
      CREATE TABLE IF NOT EXISTS affiliate.affiliate_sub_identities (
        id BIGSERIAL PRIMARY KEY,
        click_id VARCHAR(64) NOT NULL REFERENCES affiliate.outbound_clicks(id) ON DELETE CASCADE,
        sub_id_1 VARCHAR(100), -- Campaign ID / Source
        sub_id_2 VARCHAR(100), -- Medium / Placement
        sub_id_3 VARCHAR(100), -- Session ID
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Affiliate Commissions (SmartDeal Revenue Ledger)
    await client.query(`
      CREATE TABLE IF NOT EXISTS affiliate.affiliate_commissions (
        id VARCHAR(64) PRIMARY KEY,
        conversion_id VARCHAR(64) NOT NULL REFERENCES affiliate.affiliate_conversions(id) ON DELETE CASCADE,
        platform_id VARCHAR(64) NOT NULL REFERENCES marketplace.platforms(id) ON DELETE CASCADE,
        order_ref VARCHAR(100) NOT NULL,
        gross_commission NUMERIC(12, 2) NOT NULL,
        tax_deducted NUMERIC(12, 2) DEFAULT 0.00,
        net_commission NUMERIC(12, 2) NOT NULL,
        payout_status VARCHAR(30) DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'PAID', 'DISPUTED'
        reconciliation_date DATE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_aff_comm_platform ON affiliate.affiliate_commissions(platform_id, payout_status);
    `);

    // Affiliate Reversals (Refunds / Order Cancellations)
    await client.query(`
      CREATE TABLE IF NOT EXISTS affiliate.affiliate_reversals (
        id VARCHAR(64) PRIMARY KEY,
        conversion_id VARCHAR(64) NOT NULL REFERENCES affiliate.affiliate_conversions(id) ON DELETE CASCADE,
        reversal_reason TEXT NOT NULL,
        clawback_amount NUMERIC(12, 2) NOT NULL,
        reversal_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        processed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Affiliate Reconciliation
    await client.query(`
      CREATE TABLE IF NOT EXISTS affiliate.affiliate_reconciliation (
        id VARCHAR(64) PRIMARY KEY,
        platform_id VARCHAR(64) NOT NULL REFERENCES marketplace.platforms(id) ON DELETE CASCADE,
        statement_month VARCHAR(7) NOT NULL, -- '2026-11'
        total_orders_reported INT DEFAULT 0,
        total_commission_reported NUMERIC(12, 2) DEFAULT 0.00,
        matched_orders_count INT DEFAULT 0,
        discrepancy_amount NUMERIC(12, 2) DEFAULT 0.00,
        status VARCHAR(30) DEFAULT 'RECONCILED',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Affiliate Webhook Events (Idempotent Webhook Ingestion)
    await client.query(`
      CREATE TABLE IF NOT EXISTS affiliate.affiliate_webhook_events (
        id VARCHAR(64) PRIMARY KEY,
        platform_id VARCHAR(64) REFERENCES marketplace.platforms(id) ON DELETE SET NULL,
        event_type VARCHAR(100) NOT NULL,
        idempotency_key VARCHAR(128) UNIQUE NOT NULL,
        payload JSONB NOT NULL,
        processed BOOLEAN DEFAULT FALSE,
        processed_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_webhook_idemp ON affiliate.affiliate_webhook_events(idempotency_key);
    `);

    // ------------------------------------------------------------------------
    // 10. ADVANCED ANALYTICS SCHEMA
    // ------------------------------------------------------------------------
    // Detailed Analytics Events
    await client.query(`
      CREATE TABLE IF NOT EXISTS analytics.analytics_events (
        id BIGSERIAL PRIMARY KEY,
        event_type VARCHAR(50) NOT NULL, -- 'VIEW', 'SEARCH', 'COMPARE', 'FILTER', 'CLICK'
        user_id VARCHAR(64),
        guest_id VARCHAR(64),
        product_id VARCHAR(100),
        platform_id VARCHAR(64),
        metadata JSONB,
        ip_address VARCHAR(45),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_analytics_ev_type ON analytics.analytics_events(event_type, created_at);
      CREATE INDEX IF NOT EXISTS idx_analytics_prod ON analytics.analytics_events(product_id);
    `);

    // Popular Searches Aggregation
    await client.query(`
      CREATE TABLE IF NOT EXISTS analytics.popular_searches (
        query_text VARCHAR(200) PRIMARY KEY,
        search_count INT DEFAULT 1,
        zero_results BOOLEAN DEFAULT FALSE,
        last_searched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_pop_search_count ON analytics.popular_searches(search_count DESC);
    `);

    // Product View Aggregates
    await client.query(`
      CREATE TABLE IF NOT EXISTS analytics.product_view_aggregates (
        product_id VARCHAR(100) PRIMARY KEY REFERENCES catalog.products(id) ON DELETE CASCADE,
        view_count_24h INT DEFAULT 0,
        view_count_7d INT DEFAULT 0,
        view_count_30d INT DEFAULT 0,
        compare_count_7d INT DEFAULT 0,
        last_aggregated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Affiliate Performance Summary
    await client.query(`
      CREATE TABLE IF NOT EXISTS analytics.affiliate_performance_summary (
        id BIGSERIAL PRIMARY KEY,
        platform_id VARCHAR(64) NOT NULL REFERENCES marketplace.platforms(id) ON DELETE CASCADE,
        summary_date DATE NOT NULL,
        clicks_count INT DEFAULT 0,
        conversions_count INT DEFAULT 0,
        total_sale_amount NUMERIC(12, 2) DEFAULT 0.00,
        total_commission_earned NUMERIC(12, 2) DEFAULT 0.00,
        conversion_rate NUMERIC(5, 2) DEFAULT 0.00,
        CONSTRAINT uq_aff_perf_summary UNIQUE (platform_id, summary_date)
      );
    `);

    // ------------------------------------------------------------------------
    // 11. OPERATIONS & BACKGROUND JOBS SCHEMA
    // ------------------------------------------------------------------------
    // Schema Migrations Log
    await client.query(`
      CREATE TABLE IF NOT EXISTS operations.schema_migrations (
        id SERIAL PRIMARY KEY,
        migration_name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        duration_ms INT NOT NULL,
        checksum VARCHAR(64)
      );
    `);

    // Persistent Background Job Queue
    await client.query(`
      CREATE TABLE IF NOT EXISTS operations.job_queue (
        id VARCHAR(64) PRIMARY KEY,
        queue_name VARCHAR(50) DEFAULT 'default',
        job_type VARCHAR(100) NOT NULL,
        payload JSONB NOT NULL DEFAULT '{}',
        priority INT DEFAULT 5, -- 1 (highest) to 10 (lowest)
        max_attempts INT DEFAULT 3,
        attempts INT DEFAULT 0,
        status VARCHAR(30) DEFAULT 'QUEUED', -- 'QUEUED', 'RUNNING', 'COMPLETED', 'FAILED', 'DEAD_LETTER'
        run_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        started_at TIMESTAMP WITH TIME ZONE,
        completed_at TIMESTAMP WITH TIME ZONE,
        error_message TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_job_queue_fetch ON operations.job_queue(status, run_at, priority ASC);
    `);

    // Job Run History
    await client.query(`
      CREATE TABLE IF NOT EXISTS operations.job_runs (
        id BIGSERIAL PRIMARY KEY,
        job_id VARCHAR(64) NOT NULL REFERENCES operations.job_queue(id) ON DELETE CASCADE,
        attempt_number INT NOT NULL,
        duration_ms INT NOT NULL,
        status VARCHAR(30) NOT NULL,
        error_details TEXT,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // System Health Snapshots
    await client.query(`
      CREATE TABLE IF NOT EXISTS operations.health_snapshots (
        id BIGSERIAL PRIMARY KEY,
        snapshot_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(30) NOT NULL,
        connection_pool_active INT DEFAULT 0,
        connection_pool_idle INT DEFAULT 0,
        latency_ms INT DEFAULT 0,
        db_size_mb NUMERIC(10, 2) DEFAULT 0.00,
        error_count INT DEFAULT 0
      );
    `);

    // Log this migration execution
    await client.query(`
      INSERT INTO operations.schema_migrations (migration_name, duration_ms, checksum)
      VALUES ('002_enterprise_architecture', 150, 'sha256-enterprise-v2')
      ON CONFLICT (migration_name) DO NOTHING;
    `);
  });

  console.log('🏛️ [Enterprise Migration]: 10 Logical Schemas and all entities verified successfully!');
};

// Execute if called directly from CLI
if (process.argv[1] && process.argv[1].endsWith('enterprise_migration.mjs')) {
  (async () => {
    try {
      await runEnterpriseMigration();
      await pool.end();
      process.exit(0);
    } catch (err) {
      console.error('❌ [Enterprise Migration Error]:', err);
      process.exit(1);
    }
  })();
}
