// ==========================================================
// SMARTDEAL ENTERPRISE CATALOG SEEDER
// Populates brands, variants, universal identifiers (EAN/ASIN/FSN),
// dynamic specifications, external image metadata, and marketplace sellers
// ==========================================================

import { pool, query, withTransaction } from './connection.mjs';

export const seedEnterpriseCatalog = async () => {
  console.log('🌱 [Enterprise Catalog Seeder]: Populating brands, variants, and identifiers...');

  await withTransaction(async (client) => {
    // 1. Brands
    const brands = [
      { id: 'brand-samsung', name: 'Samsung', slug: 'samsung', website: 'https://www.samsung.com/in/' },
      { id: 'brand-apple', name: 'Apple', slug: 'apple', website: 'https://www.apple.com/in/' },
      { id: 'brand-asus', name: 'ASUS', slug: 'asus', website: 'https://www.asus.com/in/' },
      { id: 'brand-hp', name: 'HP', slug: 'hp', website: 'https://www.hp.com/in-en/' },
      { id: 'brand-noise', name: 'Noise', slug: 'noise', website: 'https://www.gonoise.com/' },
      { id: 'brand-sony', name: 'Sony', slug: 'sony', website: 'https://www.sony.co.in/' },
      { id: 'brand-boat', name: 'boAt', slug: 'boat', website: 'https://www.boat-lifestyle.com/' },
      { id: 'brand-oneplus', name: 'OnePlus', slug: 'oneplus', website: 'https://www.oneplus.in/' }
    ];

    for (const b of brands) {
      await client.query(`
        INSERT INTO catalog.brands (id, name, slug, website, is_verified)
        VALUES ($1, $2, $3, $4, TRUE)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          slug = EXCLUDED.slug,
          website = EXCLUDED.website;
      `, [b.id, b.name, b.slug, b.website]);
    }

    // Link products to brands
    await client.query(`
      UPDATE catalog.products SET brand_id = 'brand-samsung' WHERE LOWER(brand) = 'samsung';
      UPDATE catalog.products SET brand_id = 'brand-apple' WHERE LOWER(brand) = 'apple';
      UPDATE catalog.products SET brand_id = 'brand-asus' WHERE LOWER(brand) = 'asus';
      UPDATE catalog.products SET brand_id = 'brand-hp' WHERE LOWER(brand) = 'hp';
      UPDATE catalog.products SET brand_id = 'brand-noise' WHERE LOWER(brand) = 'noise';
      UPDATE catalog.products SET brand_id = 'brand-sony' WHERE LOWER(brand) = 'sony';
      UPDATE catalog.products SET brand_id = 'brand-boat' WHERE LOWER(brand) = 'boat';
      UPDATE catalog.products SET brand_id = 'brand-oneplus' WHERE LOWER(brand) = 'oneplus';
    `);

    // 2. Verified Marketplace Sellers
    const sellers = [
      { id: 'seller-amazon-appario', platformId: 'amazon', name: 'Appario Retail Private Ltd', rating: 4.9, score: 98 },
      { id: 'seller-amazon-clicktech', platformId: 'amazon', name: 'Clicktech Retail Private Ltd', rating: 4.8, score: 96 },
      { id: 'seller-fk-retailnet', platformId: 'flipkart', name: 'RetailNet Official', rating: 4.8, score: 97 },
      { id: 'seller-fk-supercom', platformId: 'flipkart', name: 'SuperComNet', rating: 4.7, score: 94 },
      { id: 'seller-croma-direct', platformId: 'croma', name: 'Infiniti Retail Ltd (Croma)', rating: 4.8, score: 98 },
      { id: 'seller-rd-direct', platformId: 'reliancedigital', name: 'Reliance Retail Ltd', rating: 4.7, score: 96 }
    ];

    for (const s of sellers) {
      await client.query(`
        INSERT INTO marketplace.marketplace_sellers (id, platform_id, seller_name, seller_rating, seller_score, is_authorized, is_fba_assured)
        VALUES ($1, $2, $3, $4, $5, TRUE, TRUE)
        ON CONFLICT (id) DO UPDATE SET
          seller_name = EXCLUDED.seller_name,
          seller_rating = EXCLUDED.seller_rating,
          seller_score = EXCLUDED.seller_score;
      `, [s.id, s.platformId, s.name, s.rating, s.score]);
    }

    // 3. Product Identifiers (EAN, UPC, ASIN, FSN) with Unique Enforcements
    const identifiers = [
      { productId: 'prod-samsung-m14', type: 'EAN', value: '8806094931023', isPrimary: true },
      { productId: 'prod-samsung-m14', type: 'ASIN', value: 'B0BY8MCQ9S', isPrimary: false },
      { productId: 'prod-samsung-m14', type: 'FSN', value: 'MOBGNRV7B74Q9QYY', isPrimary: false },

      { productId: 'prod-apple-iphone15', type: 'EAN', value: '0195949038280', isPrimary: true },
      { productId: 'prod-apple-iphone15', type: 'UPC', value: '195949038280', isPrimary: false },
      { productId: 'prod-apple-iphone15', type: 'ASIN', value: 'B0CHX1W1XY', isPrimary: false },
      { productId: 'prod-apple-iphone15', type: 'FSN', value: 'MOBGTAGPTB3VS24W', isPrimary: false },

      { productId: 'prod-asus-vivobook', type: 'EAN', value: '4711081921034', isPrimary: true },
      { productId: 'prod-asus-vivobook', type: 'ASIN', value: 'B0C1K9V2W3', isPrimary: false },

      { productId: 'prod-hp-pavilion-15', type: 'EAN', value: '0196786432198', isPrimary: true },
      { productId: 'prod-hp-pavilion-15', type: 'ASIN', value: 'B0B5H93H98', isPrimary: false },

      { productId: 'prod-noise-endeavour-pro', type: 'EAN', value: '8906145620914', isPrimary: true },
      { productId: 'prod-noise-endeavour-pro', type: 'ASIN', value: 'B0CFX5N8PQ', isPrimary: false },

      { productId: 'prod-sony-wh1000xm5', type: 'EAN', value: '4548736132573', isPrimary: true },
      { productId: 'prod-sony-wh1000xm5', type: 'UPC', value: '027242923508', isPrimary: false },
      { productId: 'prod-sony-wh1000xm5', type: 'ASIN', value: 'B09XS7JWHH', isPrimary: false }
    ];

    for (const idf of identifiers) {
      await client.query(`
        INSERT INTO catalog.product_identifiers (id, product_id, identifier_type, identifier_value, is_primary)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (identifier_type, identifier_value) DO NOTHING;
      `, [`idf-${idf.type.toLowerCase()}-${idf.value}`, idf.productId, idf.type, idf.value, idf.isPrimary]);
    }

    // 4. Product Variants
    const variants = [
      { id: 'var-iphone15-128-blk', productId: 'prod-apple-iphone15', name: '128 GB - Black', sku: 'IP15-128-BLK', color: 'Black', storage: '128 GB', mrp: 79900, price: 69900 },
      { id: 'var-iphone15-256-blu', productId: 'prod-apple-iphone15', name: '256 GB - Blue', sku: 'IP15-256-BLU', color: 'Blue', storage: '256 GB', mrp: 89900, price: 79900 },
      { id: 'var-m14-6-128-teal', productId: 'prod-samsung-m14', name: '6GB RAM / 128GB - Smoky Teal', sku: 'M14-6-128-TEAL', color: 'Smoky Teal', ram: '6 GB', storage: '128 GB', mrp: 17999, price: 12490 },
      { id: 'var-m14-4-64-blue', productId: 'prod-samsung-m14', name: '4GB RAM / 64GB - Berry Blue', sku: 'M14-4-64-BLUE', color: 'Berry Blue', ram: '4 GB', storage: '64 GB', mrp: 14999, price: 10990 }
    ];

    for (const v of variants) {
      await client.query(`
        INSERT INTO catalog.product_variants (id, product_id, variant_name, sku, color, storage_capacity, ram, mrp, selling_price)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (sku) DO UPDATE SET
          variant_name = EXCLUDED.variant_name,
          mrp = EXCLUDED.mrp,
          selling_price = EXCLUDED.selling_price;
      `, [v.id, v.productId, v.name, v.sku, v.color, v.storage, v.ram || null, v.mrp, v.price]);
    }

    // 5. Dynamic Product Specifications
    const specs = [
      { productId: 'prod-apple-iphone15', group: 'Processor', key: 'Chipset', value: 'A16 Bionic Chip (6-core CPU, 5-core GPU)' },
      { productId: 'prod-apple-iphone15', group: 'Display', key: 'Screen Size', value: '6.1-inch Super Retina XDR OLED (2556 x 1179)' },
      { productId: 'prod-apple-iphone15', group: 'Camera', key: 'Main Sensor', value: '48MP Main with 2x Telephoto + 12MP Ultra-Wide' },
      { productId: 'prod-apple-iphone15', group: 'Battery', key: 'Video Playback', value: 'Up to 20 Hours, USB-C Charging' },

      { productId: 'prod-samsung-m14', group: 'Processor', key: 'Chipset', value: 'Exynos 1330 Octa-Core (5nm Architecture)' },
      { productId: 'prod-samsung-m14', group: 'Display', key: 'Screen Size', value: '6.6-inch FHD+ 90Hz PLS LCD' },
      { productId: 'prod-samsung-m14', group: 'Battery', key: 'Capacity', value: '6000 mAh Monster Battery with 25W Fast Charge' },

      { productId: 'prod-sony-wh1000xm5', group: 'Audio', key: 'Driver Unit', value: '30mm Carbon Fiber Composite Dome' },
      { productId: 'prod-sony-wh1000xm5', group: 'Battery', key: 'Battery Life', value: 'Up to 30 Hours (NC ON), 40 Hours (NC OFF)' },
      { productId: 'prod-sony-wh1000xm5', group: 'Noise Cancellation', key: 'Processor', value: 'HD Noise Canceling Processor QN1 + V1' }
    ];

    for (const s of specs) {
      await client.query(`
        INSERT INTO catalog.product_specifications (product_id, spec_group, spec_key, spec_value)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (product_id, spec_group, spec_key) DO UPDATE SET
          spec_value = EXCLUDED.spec_value;
      `, [s.productId, s.group, s.key, s.value]);
    }

    // 6. External Object-Storage Image Metadata (No image blobs in PostgreSQL)
    const images = [
      { productId: 'prod-apple-iphone15', url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80', key: 'catalog/iphone15/front_black.webp', width: 800, height: 800, isPrimary: true },
      { productId: 'prod-samsung-m14', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80', key: 'catalog/m14/teal_angle.webp', width: 800, height: 800, isPrimary: true },
      { productId: 'prod-sony-wh1000xm5', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', key: 'catalog/sony_xm5/hero_silver.webp', width: 800, height: 800, isPrimary: true }
    ];

    for (const img of images) {
      await client.query(`
        INSERT INTO catalog.product_images (id, product_id, image_url, storage_key, width, height, is_primary)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO NOTHING;
      `, [`img-${img.productId}-main`, img.productId, img.url, img.key, img.width, img.height, img.isPrimary]);
    }

    // 7. Update Full-Text Search Vectors on Products
    await client.query(`
      UPDATE catalog.products
      SET tsv_search = setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
                       setweight(to_tsvector('english', coalesce(brand, '')), 'B') ||
                       setweight(to_tsvector('english', coalesce(description, '')), 'C');
    `);
  });

  console.log('✅ [Enterprise Catalog Seeder]: Successfully seeded enterprise catalog data.');
};

if (process.argv[1] && process.argv[1].endsWith('seed_enterprise_catalog.mjs')) {
  (async () => {
    try {
      await seedEnterpriseCatalog();
      await pool.end();
      process.exit(0);
    } catch (err) {
      console.error('❌ [Catalog Seeder Error]:', err);
      process.exit(1);
    }
  })();
}
