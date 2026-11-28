// scripts/benchmark_search_fts_vs_ilike.mjs
// Phase 5.1 Track 5: Comparison of ILIKE vs PostgreSQL Full-Text Search (tsvector + GIN)
// Runs strictly on isolated database smartdeal_restore_test on 127.0.0.1:5433 with 100,000 products

import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  host: '127.0.0.1',
  port: 5433,
  user: 'postgres',
  password: '',
  database: 'smartdeal_restore_test'
});

async function runSearchBenchmark() {
  console.log('================================================================');
  console.log('🔍 SMARTDEAL PHASE 5.1: SEARCH ENGINE ARCHITECTURE BENCHMARK');
  console.log('Target: smartdeal_restore_test on 127.0.0.1:5433 (100,000 PRODUCTS)');
  console.log('================================================================\n');

  const client = await pool.connect();
  try {
    // 1. Benchmark ILIKE (Unindexed / Full Sequential Scan)
    console.log('--- Step 1: Benchmarking ILIKE Pattern Search (100 Iterations) ---');
    const ilikeLatencies = [];
    for (let i = 0; i < 100; i++) {
      const term = `%Model ${(i % 1000) + 1}%`;
      const start = performance.now();
      await client.query('SELECT id, name, selling_price FROM products WHERE name ILIKE $1 LIMIT 20;', [term]);
      ilikeLatencies.push(performance.now() - start);
    }
    ilikeLatencies.sort((a, b) => a - b);
    const ilikeP50 = ilikeLatencies[Math.floor(ilikeLatencies.length * 0.5)].toFixed(2);
    const ilikeP95 = ilikeLatencies[Math.floor(ilikeLatencies.length * 0.95)].toFixed(2);
    const ilikeMean = (ilikeLatencies.reduce((a, b) => a + b, 0) / ilikeLatencies.length).toFixed(2);
    const ilikeQps = Math.round(1000 / parseFloat(ilikeMean));

    console.log(`  ✓ ILIKE Mean Latency: ${ilikeMean} ms | p50: ${ilikeP50} ms | p95: ${ilikeP95} ms`);
    console.log(`  ✓ ILIKE QPS:          ~${ilikeQps} queries/sec\n`);

    // 2. Prepare PostgreSQL Native Full-Text Search (tsvector column + GIN index)
    console.log('--- Step 2: Creating tsvector Search Column & GIN Index ---');
    const indexStart = performance.now();
    await client.query(`
      ALTER TABLE products ADD COLUMN IF NOT EXISTS search_vector tsvector;
      UPDATE products SET search_vector = to_tsvector('english', name || ' ' || brand || ' ' || COALESCE(description, '')) WHERE search_vector IS NULL;
      CREATE INDEX IF NOT EXISTS idx_products_search_vector_gin ON products USING GIN(search_vector);
    `);
    const indexDuration = ((performance.now() - indexStart) / 1000).toFixed(2);
    console.log(`  ✓ GIN Index created over 100,000 rows in ${indexDuration}s.\n`);

    // 3. Benchmark PostgreSQL Native Full-Text Search (GIN Index Scan)
    console.log('--- Step 3: Benchmarking PostgreSQL Native FTS (100 Iterations) ---');
    const ftsLatencies = [];
    const searchTerms = ['Apple & Pro', 'Samsung & Ultra', 'Sony & Model', 'Dell & High', 'HP & Series'];

    for (let i = 0; i < 100; i++) {
      const queryTerm = searchTerms[i % searchTerms.length];
      const start = performance.now();
      await client.query(`
        SELECT id, name, selling_price, ts_rank(search_vector, to_tsquery('english', $1)) as rank
        FROM products 
        WHERE search_vector @@ to_tsquery('english', $1) 
        ORDER BY rank DESC 
        LIMIT 20;
      `, [queryTerm]);
      ftsLatencies.push(performance.now() - start);
    }
    ftsLatencies.sort((a, b) => a - b);
    const ftsP50 = ftsLatencies[Math.floor(ftsLatencies.length * 0.5)].toFixed(2);
    const ftsP95 = ftsLatencies[Math.floor(ftsLatencies.length * 0.95)].toFixed(2);
    const ftsMean = (ftsLatencies.reduce((a, b) => a + b, 0) / ftsLatencies.length).toFixed(2);
    const ftsQps = Math.round(1000 / parseFloat(ftsMean));

    console.log(`  ✓ PostgreSQL FTS Mean Latency: ${ftsMean} ms | p50: ${ftsP50} ms | p95: ${ftsP95} ms`);
    console.log(`  ✓ PostgreSQL FTS QPS:          ~${ftsQps} queries/sec\n`);

    const speedup = (parseFloat(ilikeMean) / parseFloat(ftsMean)).toFixed(1);
    console.log(`🚀 RESULT: PostgreSQL Native FTS is ${speedup}x faster than unindexed ILIKE!`);

    // 4. Print Comparison Table
    console.log('\n================================================================');
    console.log('SEARCH ARCHITECTURE COMPARISON (100,000 PRODUCTS)');
    console.log('================================================================');
    console.table([
      { Method: 'PostgreSQL ILIKE', Latency_Mean_ms: ilikeMean, p95_ms: ilikeP95, QPS: ilikeQps, Cost: '$0', Complexity: 'Zero', Typo_Tolerance: 'None' },
      { Method: 'PostgreSQL tsvector (GIN)', Latency_Mean_ms: ftsMean, p95_ms: ftsP95, QPS: ftsQps, Cost: '$0', Complexity: 'Low (In-DB)', Typo_Tolerance: 'Stemming only' },
      { Method: 'Meilisearch (Projected)', Latency_Mean_ms: '2.5 - 4.5', p95_ms: '6.0', QPS: '800 - 1500', Cost: '+$7 - $15/mo', Complexity: 'Medium (CDC sync)', Typo_Tolerance: 'Full (Typo-tolerant)' }
    ]);

  } finally {
    client.release();
    await pool.end();
  }
}

runSearchBenchmark().catch(console.error);
