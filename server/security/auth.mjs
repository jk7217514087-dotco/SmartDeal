// ==========================================================
// SMARTDEAL ENTERPRISE SECURITY & AUTHENTICATION ENGINE
// Argon2id Password Hashing, Legacy SHA-256 Migration,
// Cryptographic Sessions & Persistent SQL Session Store
// ==========================================================

import argon2 from 'argon2';
import crypto from 'node:crypto';
import { pool, query } from '../db/connection.mjs';

// Argon2id configuration (OWASP recommended parameters)
const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 65536, // 64 MB
  timeCost: 3,       // 3 iterations
  parallelism: 1
};

/**
 * Hashes a plaintext password using Argon2id
 * @param {string} password
 * @returns {Promise<string>} Argon2id encoded hash string
 */
export const hashPassword = async (password) => {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string');
  }
  return argon2.hash(password, ARGON2_OPTIONS);
};

/**
 * Legacy SHA-256 hasher for backward compatibility verification
 */
export const sha256 = (str) => {
  return crypto.createHash('sha256').update(String(str || '')).digest('hex');
};

/**
 * Verifies a plaintext password against a stored hash (Argon2id or Legacy SHA-256)
 * If valid legacy SHA-256, flags `needsUpgrade: true` so the caller can transparently rehash
 * @param {string} password - Raw input password
 * @param {string} storedHash - Stored database hash
 * @returns {Promise<{ valid: boolean, needsUpgrade: boolean }>}
 */
export const verifyPassword = async (password, storedHash) => {
  if (!password || !storedHash) {
    return { valid: false, needsUpgrade: false };
  }

  // 1. Argon2id Hash format check ($argon2id$ or $argon2i$)
  if (storedHash.startsWith('$argon2')) {
    try {
      const match = await argon2.verify(storedHash, password);
      return { valid: match, needsUpgrade: false };
    } catch {
      return { valid: false, needsUpgrade: false };
    }
  }

  // 2. Legacy SHA-256 64-char hex format check
  if (storedHash.length === 64 && /^[0-9a-f]{64}$/i.test(storedHash)) {
    const computed = sha256(password);
    const bufA = Buffer.from(computed, 'hex');
    const bufB = Buffer.from(storedHash, 'hex');
    if (bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB)) {
      return { valid: true, needsUpgrade: true };
    }
  }

  return { valid: false, needsUpgrade: false };
};

/**
 * Upgrades a user's password in PostgreSQL to Argon2id
 * @param {string} userId
 * @param {string} plainPassword
 */
export const upgradeUserPasswordToArgon2 = async (userId, plainPassword) => {
  try {
    const newHash = await hashPassword(plainPassword);
    await query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2;',
      [newHash, userId]
    );
    console.log(`🔒 [Security Upgrade]: Migrated user ${userId} password to Argon2id.`);
  } catch (err) {
    console.error(`⚠️ [Security Upgrade Failed for user ${userId}]:`, err.message);
  }
};

/**
 * Cryptographically secure 6-digit OTP generator (Section 21 compliant)
 */
export const generateSecureOtp = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

/**
 * Generates high-entropy token and its SHA-256 storage hash
 */
export const generateSecureToken = (prefix = 'tok') => {
  const rawToken = `${prefix}_${crypto.randomBytes(32).toString('hex')}`;
  const tokenHash = sha256(rawToken);
  return { rawToken, tokenHash };
};

/**
 * Creates a persistent SQL user session in PostgreSQL
 * @param {string} userId
 * @param {string} ipAddress
 * @param {string} userAgent
 * @param {number} expiryDays
 * @returns {Promise<string>} raw authentication token for HTTP Authorization header / Cookie
 */
export const createUserSession = async (userId, ipAddress = '', userAgent = '', expiryDays = 30) => {
  const { rawToken, tokenHash } = generateSecureToken('sd_usr');
  const sessionId = `sess_${crypto.randomBytes(16).toString('hex')}`;
  const expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);

  await query(`
    INSERT INTO user_sessions (id, user_id, session_token_hash, ip_address, user_agent, expires_at)
    VALUES ($1, $2, $3, $4, $5, $6);
  `, [sessionId, userId, tokenHash, ipAddress, userAgent, expiresAt]);

  return rawToken;
};

/**
 * Validates a user session token against PostgreSQL
 * @param {string} rawToken
 * @returns {Promise<Object|null>} user record if valid, null otherwise
 */
export const validateUserSession = async (rawToken) => {
  if (!rawToken || typeof rawToken !== 'string') return null;
  const tokenHash = sha256(rawToken.trim());

  const rows = await query(`
    SELECT s.id AS session_id, s.expires_at, u.id, u.full_name, u.email, u.phone, u.role, u.status
    FROM user_sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.session_token_hash = $1 AND s.expires_at > CURRENT_TIMESTAMP AND u.status = 'ACTIVE';
  `, [tokenHash]);

  if (rows.length === 0) return null;

  // Touch session last_active_at asynchronously
  query(`UPDATE user_sessions SET last_active_at = CURRENT_TIMESTAMP WHERE id = $1;`, [rows[0].session_id]).catch(() => {});

  return {
    id: rows[0].id,
    name: rows[0].full_name,
    email: rows[0].email,
    phone: rows[0].phone,
    role: rows[0].role,
    status: rows[0].status
  };
};

/**
 * Destroys a user session in PostgreSQL (logout)
 * @param {string} rawToken
 */
export const destroyUserSession = async (rawToken) => {
  if (!rawToken) return;
  const tokenHash = sha256(rawToken.trim());
  await query('DELETE FROM user_sessions WHERE session_token_hash = $1;', [tokenHash]);
};

/**
 * Creates a persistent SQL admin session in PostgreSQL (Strict RBAC Isolation)
 * @param {string} adminId
 * @param {string} ipAddress
 * @param {string} userAgent
 * @param {number} expiryDays
 * @returns {Promise<string>} raw admin token
 */
export const createAdminSession = async (adminId, ipAddress = '', userAgent = '', expiryDays = 7) => {
  const { rawToken, tokenHash } = generateSecureToken('sd_adm');
  const sessionId = `admsess_${crypto.randomBytes(16).toString('hex')}`;
  const expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);

  await query(`
    INSERT INTO admin_sessions (id, admin_id, session_token_hash, ip_address, user_agent, expires_at)
    VALUES ($1, $2, $3, $4, $5, $6);
  `, [sessionId, adminId, tokenHash, ipAddress, userAgent, expiresAt]);

  return rawToken;
};

/**
 * Validates an admin session token against PostgreSQL (users cannot access admin records)
 * @param {string} rawToken
 * @returns {Promise<Object|null>}
 */
export const validateAdminSession = async (rawToken) => {
  if (!rawToken || typeof rawToken !== 'string') return null;
  const tokenHash = sha256(rawToken.trim());

  const rows = await query(`
    SELECT s.id AS session_id, s.expires_at, u.id, u.full_name, u.email, u.phone, u.role, u.status, a.permissions
    FROM admin_sessions s
    JOIN users u ON s.admin_id = u.id
    JOIN admin_users a ON u.id = a.user_id
    WHERE s.session_token_hash = $1 
      AND s.expires_at > CURRENT_TIMESTAMP 
      AND u.status = 'ACTIVE'
      AND a.is_active = TRUE
      AND u.role IN ('ADMIN', 'SUPER_ADMIN', 'SUPPORT_ADMIN', 'FINANCE_ADMIN');
  `, [tokenHash]);

  if (rows.length === 0) return null;

  return {
    id: rows[0].id,
    name: rows[0].full_name,
    email: rows[0].email,
    phone: rows[0].phone,
    role: rows[0].role,
    permissions: rows[0].permissions,
    status: rows[0].status
  };
};

/**
 * Destroys an admin session in PostgreSQL
 * @param {string} rawToken
 */
export const destroyAdminSession = async (rawToken) => {
  if (!rawToken) return;
  const tokenHash = sha256(rawToken.trim());
  await query('DELETE FROM admin_sessions WHERE session_token_hash = $1;', [tokenHash]);
};

export default {
  hashPassword,
  verifyPassword,
  upgradeUserPasswordToArgon2,
  sha256,
  generateSecureOtp,
  generateSecureToken,
  createUserSession,
  validateUserSession,
  destroyUserSession,
  createAdminSession,
  validateAdminSession,
  destroyAdminSession
};
