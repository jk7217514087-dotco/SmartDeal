// ==========================================================
// SMARTDEAL REAL PRODUCTION POSTGRESQL CONNECTION MANAGER
// Powered by pg (node-postgres) with connection pooling,
// dynamic SSL detection for Render, telemetry & transaction support
// ==========================================================

import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

/**
 * Detects if the current runtime environment is a deployed cloud production server (Render / Vercel / Production container)
 */
export const isCloudProduction = () => {
  return (
    process.env.NODE_ENV === 'production' ||
    process.env.RENDER === 'true' ||
    Boolean(process.env.RENDER_SERVICE_ID) ||
    Boolean(process.env.RENDER_EXTERNAL_URL) ||
    Boolean(process.env.VERCEL)
  );
};

/**
 * Validates whether PostgreSQL connection parameters are explicitly and safely configured
 */
export const isDatabaseConfigured = () => {
  if (process.env.DATABASE_URL) return true;
  if (!isCloudProduction()) {
    // In local development, allow fallback to local cluster
    return Boolean(process.env.PGHOST || '127.0.0.1');
  }
  // In cloud production, require an explicit DATABASE_URL or dedicated cloud DB host
  return Boolean(process.env.PGHOST || process.env.DB_HOST);
};

// Parse configuration from DATABASE_URL or discrete parameters
const parseConnectionConfig = () => {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl) {
    const isLocal = databaseUrl.includes('127.0.0.1') || databaseUrl.includes('localhost');
    const sslRequired = process.env.PGSSL === 'true' || 
                        databaseUrl.includes('sslmode=require') || 
                        (!isLocal && (process.env.NODE_ENV === 'production' || isCloudProduction()));

    return {
      connectionString: databaseUrl,
      ssl: sslRequired ? { rejectUnauthorized: false } : false,
      max: parseInt(process.env.PG_MAX_POOL || '20', 10),
      idleTimeoutMillis: parseInt(process.env.PG_IDLE_TIMEOUT_MS || '30000', 10),
      connectionTimeoutMillis: parseInt(process.env.PG_CONNECTION_TIMEOUT_MS || '5000', 10)
    };
  }

  // If in cloud production without DATABASE_URL, fail safely without attempting local addresses
  if (isCloudProduction() && !process.env.PGHOST && !process.env.DB_HOST) {
    console.warn('⚠️ [SECURITY FAIL-SAFE]: Cloud production environment detected without DATABASE_URL. Silent fallback to 127.0.0.1:5433 is disabled to prevent connection errors.');
    return null;
  }

  const host = process.env.PGHOST || process.env.DB_HOST || '127.0.0.1';
  const port = parseInt(process.env.PGPORT || process.env.DB_PORT || '5433', 10);
  const user = process.env.PGUSER || process.env.DB_USER || 'postgres';
  const password = process.env.PGPASSWORD || process.env.DB_PASSWORD || '';
  const database = process.env.PGDATABASE || process.env.DB_NAME || 'smartdeal';
  const isLocal = host === '127.0.0.1' || host === 'localhost';
  const sslRequired = process.env.PGSSL === 'true' || (!isLocal && (process.env.NODE_ENV === 'production' || isCloudProduction()));

  return {
    host,
    port,
    user,
    password,
    database,
    ssl: sslRequired ? { rejectUnauthorized: false } : false,
    max: parseInt(process.env.PG_MAX_POOL || '20', 10),
    idleTimeoutMillis: parseInt(process.env.PG_IDLE_TIMEOUT_MS || '30000', 10),
    connectionTimeoutMillis: parseInt(process.env.PG_CONNECTION_TIMEOUT_MS || '5000', 10)
  };
};

const poolConfig = parseConnectionConfig();

// Backward compatibility configuration view
export const DB_CONFIGS = {
  postgres: {
    host: poolConfig?.host || (poolConfig?.connectionString ? 'connection-string' : 'not-configured'),
    port: poolConfig?.port || 5432,
    database: poolConfig?.database || 'smartdeal',
    maxPool: poolConfig?.max || 0,
    ssl: Boolean(poolConfig?.ssl)
  },
  users: { database: 'smartdeal (users schema/tables)' },
  admin: { database: 'smartdeal (admin schema/tables)' },
  core: { database: 'smartdeal (core schema/tables)' }
};

// Global Telemetry & Slow Query Monitoring State
export const dbTelemetry = {
  totalQueries: 0,
  slowQueries: 0,
  failedQueries: 0,
  totalLatencyMs: 0,
  slowQueryLog: [],
  mode: poolConfig ? 'INITIALIZING' : 'DATABASE_NOT_CONFIGURED',
  connected: false,
  configured: Boolean(poolConfig),
  lastHealthCheck: null,
  databaseVersion: null,
  activePoolSize: 0,
  idleConnections: 0,
  waitingClients: 0,
  startedAt: new Date().toISOString()
};

const SLOW_QUERY_THRESHOLD_MS = parseInt(process.env.SLOW_QUERY_THRESHOLD_MS || '200', 10);

// Instantiate PostgreSQL Pool safely
export const pool = poolConfig ? new Pool(poolConfig) : null;

// Pool connect listener to configure search_path across all 10 enterprise schemas
if (pool) {
  pool.on('connect', (client) => {
    client.query('SET search_path TO identity, administration, catalog, marketplace, pricing, offers, affiliate, personalization, analytics, operations, public;').catch(() => {});
  });
  pool.on('error', (err) => {
    console.error('[PostgreSQL Pool Unexpected Error]:', err.message);
    dbTelemetry.failedQueries++;
  });
}

/**
 * Checks connection health to the PostgreSQL cluster
 */
export const checkPoolsHealth = async () => {
  const result = {
    connected: false,
    configured: isDatabaseConfigured(),
    users: false,
    admin: false,
    core: false,
    allConnected: false,
    engine: 'PostgreSQL 18',
    version: '',
    latencyMs: 0,
    message: ''
  };

  if (!pool || !isDatabaseConfigured()) {
    result.message = 'Database connection is not configured: DATABASE_URL environment variable is missing.';
    dbTelemetry.connected = false;
    dbTelemetry.mode = 'DATABASE_NOT_CONFIGURED';
    dbTelemetry.lastHealthCheck = new Date().toISOString();
    return result;
  }

  const start = performance.now();
  try {
    const client = await pool.connect();
    try {
      const res = await client.query('SELECT version(), current_database(), current_user;');
      const duration = Math.round(performance.now() - start);
      result.connected = true;
      result.users = true;
      result.admin = true;
      result.core = true;
      result.allConnected = true;
      result.version = res.rows[0]?.version || 'PostgreSQL';
      result.latencyMs = duration;
      result.message = `PostgreSQL connected successfully [DB: ${res.rows[0]?.current_database}, User: ${res.rows[0]?.current_user}]`;

      dbTelemetry.connected = true;
      dbTelemetry.databaseVersion = result.version;
      dbTelemetry.mode = 'POSTGRESQL_PRODUCTION_POOLED';
      dbTelemetry.lastHealthCheck = new Date().toISOString();
      dbTelemetry.activePoolSize = pool.totalCount;
      dbTelemetry.idleConnections = pool.idleCount;
      dbTelemetry.waitingClients = pool.waitingCount;
    } finally {
      client.release();
    }
  } catch (err) {
    dbTelemetry.connected = false;
    dbTelemetry.mode = 'DATABASE_UNREACHABLE';
    dbTelemetry.lastHealthCheck = new Date().toISOString();
    result.message = `PostgreSQL connection error: ${err.message}`;
    console.error('[PostgreSQL Health Check Failed]:', err.message);
  }

  return result;
};

/**
 * Executes a monitored SQL query on PostgreSQL with latency tracking and slow query alerts
 * @param {string} sql - Parameterized SQL query
 * @param {Array} params - Query parameters ($1, $2, etc.)
 */
export const query = async (sql, params = []) => {
  if (!pool || !isDatabaseConfigured()) {
    const err = new Error('Database is not configured. DATABASE_URL environment variable is missing.');
    err.statusCode = 503;
    throw err;
  }

  const start = performance.now();
  dbTelemetry.totalQueries++;

  try {
    const result = await pool.query(sql, params);
    const duration = Math.round(performance.now() - start);
    dbTelemetry.totalLatencyMs += duration;

    if (duration > SLOW_QUERY_THRESHOLD_MS) {
      dbTelemetry.slowQueries++;
      const slowEntry = {
        sql: sql.slice(0, 160),
        durationMs: duration,
        timestamp: new Date().toISOString()
      };
      dbTelemetry.slowQueryLog.unshift(slowEntry);
      if (dbTelemetry.slowQueryLog.length > 50) dbTelemetry.slowQueryLog.pop();
      console.warn(`[SLOW QUERY ${duration}ms]: ${sql.slice(0, 120)}`);
    }

    return result.rows;
  } catch (err) {
    dbTelemetry.failedQueries++;
    console.error(`[PostgreSQL Query Error]: ${err.message} | SQL: ${sql.slice(0, 100)}`);
    throw err;
  }
};

/**
 * Executes operations inside an ACID database transaction
 * @param {Function} callback - Async function receiving the transactional pg client
 */
export const withTransaction = async (callback) => {
  if (!pool || !isDatabaseConfigured()) {
    const err = new Error('Database is not configured. DATABASE_URL environment variable is missing.');
    err.statusCode = 503;
    throw err;
  }

  const client = await pool.connect();
  try {
    await client.query('SET search_path TO identity, administration, catalog, marketplace, pricing, offers, affiliate, personalization, analytics, operations, public;');
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

// Backward-compatible query methods for existing route handlers
export const queryUsers = async (sql, params = []) => query(sql, params);
export const queryAdmin = async (sql, params = []) => query(sql, params);
export const queryCore = async (sql, params = []) => query(sql, params);

// Legacy pool reference aliases
export const usersPool = pool;
export const adminPool = pool;
export const corePool = pool;

/**
 * Diagnostic health endpoint payload for Admin Panel & monitoring
 */
export const getDatabaseHealth = async () => {
  const health = await checkPoolsHealth();
  const avgLatency = dbTelemetry.totalQueries > 0
    ? (dbTelemetry.totalLatencyMs / dbTelemetry.totalQueries).toFixed(2)
    : '0.00';

  let dbSize = 'Unknown';
  let totalTables = 0;
  let activeSchemas = [];

  if (health.connected) {
    try {
      const sizeRes = await pool.query('SELECT pg_size_pretty(pg_database_size(current_database())) as size;');
      dbSize = sizeRes.rows[0]?.size || 'Unknown';

      const tableRes = await pool.query(`
        SELECT count(*) as count 
        FROM information_schema.tables 
        WHERE table_schema IN ('identity', 'administration', 'catalog', 'marketplace', 'pricing', 'offers', 'affiliate', 'personalization', 'analytics', 'operations');
      `);
      totalTables = parseInt(tableRes.rows[0]?.count || '0', 10);

      const schemaRes = await pool.query(`
        SELECT schema_name 
        FROM information_schema.schemata 
        WHERE schema_name IN ('identity', 'administration', 'catalog', 'marketplace', 'pricing', 'offers', 'affiliate', 'personalization', 'analytics', 'operations')
        ORDER BY schema_name;
      `);
      activeSchemas = schemaRes.rows.map(r => r.schema_name);
    } catch {
      // Non-fatal
    }
  }

  return {
    status: health.allConnected ? 'HEALTHY' : 'DEGRADED',
    mode: dbTelemetry.mode,
    engine: 'PostgreSQL 18 (Enterprise Logical Schemas)',
    timestamp: new Date().toISOString(),
    connection: {
      connected: health.connected,
      configured: isDatabaseConfigured(),
      database: poolConfig?.database || (isDatabaseConfigured() ? 'smartdeal' : 'NOT_CONFIGURED'),
      ssl: Boolean(poolConfig?.ssl),
      activeConnections: pool?.totalCount || 0,
      idleConnections: pool?.idleCount || 0,
      waitingQueue: pool?.waitingCount || 0,
      version: dbTelemetry.databaseVersion,
      databaseSize: dbSize,
      totalTables,
      logicalSchemas: activeSchemas
    },
    performance: {
      totalQueriesExecuted: dbTelemetry.totalQueries,
      averageLatencyMs: parseFloat(avgLatency),
      slowQueriesRecorded: dbTelemetry.slowQueries,
      slowQueryThresholdMs: SLOW_QUERY_THRESHOLD_MS,
      failedQueries: dbTelemetry.failedQueries,
      recentSlowQueries: dbTelemetry.slowQueryLog.slice(0, 5)
    },
    resilienceNotice: health.allConnected
      ? 'Direct PostgreSQL production pool connected with 10 enterprise logical schemas.'
      : 'PostgreSQL cluster unreachable. Verify DATABASE_URL or PGPORT.'
  };
};

export default {
  pool,
  query,
  withTransaction,
  checkPoolsHealth,
  getDatabaseHealth,
  queryUsers,
  queryAdmin,
  queryCore,
  dbTelemetry,
  DB_CONFIGS
};
