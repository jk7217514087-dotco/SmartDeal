// ==========================================================
// SMARTDEAL ENTERPRISE DATABASE CONNECTION MANAGER
// Manages 3 Logically Separated MySQL 8 Connection Pools:
// 1. smartdeal_users (Customers, Profiles, Preferences, Sessions)
// 2. smartdeal_admin (Administrative Accounts, RBAC, Audit Logs)
// 3. smartdeal_core  (Catalog, Marketplaces, Prices, Affiliate Financials)
// ==========================================================

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// Global Environment Configurations with Safe Defaults
const DEFAULT_HOST = process.env.DB_HOST || '127.0.0.1';
const DEFAULT_PORT = parseInt(process.env.DB_PORT || '3306', 10);
const DEFAULT_USER = process.env.DB_USER || 'root';
const DEFAULT_PASS = process.env.DB_PASSWORD || '';

// Connection configurations per database
export const DB_CONFIGS = {
  users: {
    host: process.env.DB_USERS_HOST || DEFAULT_HOST,
    port: parseInt(process.env.DB_USERS_PORT || String(DEFAULT_PORT), 10),
    user: process.env.DB_USERS_USER || DEFAULT_USER,
    password: process.env.DB_USERS_PASSWORD || DEFAULT_PASS,
    database: process.env.DB_USERS_NAME || 'smartdeal_users',
    waitForConnections: true,
    connectionLimit: parseInt(process.env.DB_USERS_POOL_LIMIT || '15', 10),
    queueLimit: 50,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    timezone: '+00:00', // UTC
    dateStrings: true
  },
  admin: {
    host: process.env.DB_ADMIN_HOST || DEFAULT_HOST,
    port: parseInt(process.env.DB_ADMIN_PORT || String(DEFAULT_PORT), 10),
    user: process.env.DB_ADMIN_USER || DEFAULT_USER,
    password: process.env.DB_ADMIN_PASSWORD || DEFAULT_PASS,
    database: process.env.DB_ADMIN_NAME || 'smartdeal_admin',
    waitForConnections: true,
    connectionLimit: parseInt(process.env.DB_ADMIN_POOL_LIMIT || '10', 10),
    queueLimit: 30,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    timezone: '+00:00', // UTC
    dateStrings: true
  },
  core: {
    host: process.env.DB_CORE_HOST || DEFAULT_HOST,
    port: parseInt(process.env.DB_CORE_PORT || String(DEFAULT_PORT), 10),
    user: process.env.DB_CORE_USER || DEFAULT_USER,
    password: process.env.DB_CORE_PASSWORD || DEFAULT_PASS,
    database: process.env.DB_CORE_NAME || 'smartdeal_core',
    waitForConnections: true,
    connectionLimit: parseInt(process.env.DB_CORE_POOL_LIMIT || '25', 10),
    queueLimit: 100,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    timezone: '+00:00', // UTC
    dateStrings: true
  }
};

// Telemetry & Slow Query Monitoring State
export const dbTelemetry = {
  totalQueries: 0,
  slowQueries: 0,
  failedQueries: 0,
  totalLatencyMs: 0,
  slowQueryLog: [],
  mode: 'INITIALIZING',
  poolsHealthy: {
    users: false,
    admin: false,
    core: false
  },
  lastSlowQuery: null,
  startedAt: new Date().toISOString()
};

const SLOW_QUERY_THRESHOLD_MS = parseInt(process.env.SLOW_QUERY_THRESHOLD_MS || '200', 10);

// Initialize Pools
let usersPool = null;
let adminPool = null;
let corePool = null;

try {
  usersPool = mysql.createPool(DB_CONFIGS.users);
  adminPool = mysql.createPool(DB_CONFIGS.admin);
  corePool = mysql.createPool(DB_CONFIGS.core);
} catch (err) {
  console.warn('[Database ConnectionPool Warning]: Unable to construct native pool:', err.message);
}

/**
 * Checks connection health for all three pools
 */
export const checkPoolsHealth = async () => {
  const result = {
    users: false,
    admin: false,
    core: false,
    allConnected: false,
    message: ''
  };

  try {
    if (usersPool) {
      const conn = await usersPool.getConnection();
      await conn.query('SELECT 1');
      conn.release();
      result.users = true;
      dbTelemetry.poolsHealthy.users = true;
    }
  } catch (err) {
    dbTelemetry.poolsHealthy.users = false;
  }

  try {
    if (adminPool) {
      const conn = await adminPool.getConnection();
      await conn.query('SELECT 1');
      conn.release();
      result.admin = true;
      dbTelemetry.poolsHealthy.admin = true;
    }
  } catch (err) {
    dbTelemetry.poolsHealthy.admin = false;
  }

  try {
    if (corePool) {
      const conn = await corePool.getConnection();
      await conn.query('SELECT 1');
      conn.release();
      result.core = true;
      dbTelemetry.poolsHealthy.core = true;
    }
  } catch (err) {
    dbTelemetry.poolsHealthy.core = false;
  }

  result.allConnected = result.users && result.admin && result.core;
  dbTelemetry.mode = result.allConnected ? 'MYSQL_POOLED' : 'RESILIENT_FILE_PERSISTENCE';
  result.message = result.allConnected
    ? 'All 3 MySQL 8 logical database pools connected successfully.'
    : 'MySQL host unreachable or databases pending migration. Resilient in-memory/JSON store serving live traffic.';

  return result;
};

/**
 * Executes a prepared statement query on smartdeal_users pool
 */
export const queryUsers = async (sql, params = []) => {
  return executeMonitoredQuery(usersPool, 'smartdeal_users', sql, params);
};

/**
 * Executes a prepared statement query on smartdeal_admin pool
 */
export const queryAdmin = async (sql, params = []) => {
  return executeMonitoredQuery(adminPool, 'smartdeal_admin', sql, params);
};

/**
 * Executes a prepared statement query on smartdeal_core pool
 */
export const queryCore = async (sql, params = []) => {
  return executeMonitoredQuery(corePool, 'smartdeal_core', sql, params);
};

/**
 * Internal query wrapper measuring latency, logging slow queries, and sanitizing params
 */
const executeMonitoredQuery = async (pool, dbName, sql, params) => {
  const start = performance.now();
  dbTelemetry.totalQueries++;

  if (!pool || !dbTelemetry.poolsHealthy[dbName.replace('smartdeal_', '')]) {
    // Return null so callers know to use resilient JSON fallback
    return null;
  }

  try {
    const [rows, fields] = await pool.execute(sql, params);
    const duration = Math.round(performance.now() - start);
    dbTelemetry.totalLatencyMs += duration;

    if (duration > SLOW_QUERY_THRESHOLD_MS) {
      dbTelemetry.slowQueries++;
      const slowEntry = {
        database: dbName,
        sql: sql.slice(0, 160),
        durationMs: duration,
        timestamp: new Date().toISOString()
      };
      dbTelemetry.lastSlowQuery = slowEntry;
      dbTelemetry.slowQueryLog.unshift(slowEntry);
      if (dbTelemetry.slowQueryLog.length > 50) dbTelemetry.slowQueryLog.pop();
      console.warn(`[SLOW QUERY ${duration}ms in ${dbName}]: ${sql.slice(0, 120)}`);
    }

    return rows;
  } catch (err) {
    dbTelemetry.failedQueries++;
    console.error(`[DB Error in ${dbName}]:`, err.message);
    throw err;
  }
};

/**
 * Diagnostic health endpoint payload for Admin Panel
 */
export const getDatabaseHealth = async () => {
  const health = await checkPoolsHealth();
  const avgLatency = dbTelemetry.totalQueries > 0
    ? (dbTelemetry.totalLatencyMs / dbTelemetry.totalQueries).toFixed(2)
    : '0.00';

  return {
    status: health.allConnected ? 'HEALTHY' : 'DEGRADED',
    mode: dbTelemetry.mode,
    timestamp: new Date().toISOString(),
    connectionPools: {
      users: {
        database: DB_CONFIGS.users.database,
        host: DB_CONFIGS.users.host,
        port: DB_CONFIGS.users.port,
        limit: DB_CONFIGS.users.connectionLimit,
        connected: health.users
      },
      admin: {
        database: DB_CONFIGS.admin.database,
        host: DB_CONFIGS.admin.host,
        port: DB_CONFIGS.admin.port,
        limit: DB_CONFIGS.admin.connectionLimit,
        connected: health.admin
      },
      core: {
        database: DB_CONFIGS.core.database,
        host: DB_CONFIGS.core.host,
        port: DB_CONFIGS.core.port,
        limit: DB_CONFIGS.core.connectionLimit,
        connected: health.core
      }
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
      ? 'Direct MySQL 8 multi-pool connection active.'
      : 'Using local persistence fallback. Multi-database schemas ready in migrations/ folder.'
  };
};

export { usersPool, adminPool, corePool };
