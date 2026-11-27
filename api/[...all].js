// SmartDeal Production Serverless API Gateway
// Fully secured: No hardcoded PINs, demo OTPs or mock bypass credentials

import { pool, query } from '../server/db/connection.mjs';
import {
  hashPassword,
  verifyPassword,
  upgradeUserPasswordToArgon2,
  createUserSession,
  createAdminSession,
  validateUserSession,
  validateAdminSession,
  generateSecureOtp
} from '../server/security/auth.mjs';

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = req.url || '';
  let body = req.body || {};
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  // 1. ADMIN LOGIN (Database-verified with Argon2id)
  if (url.includes('/admin/login')) {
    const { email, password } = body;
    const cleanEmail = (email || '').toLowerCase().trim();

    if (!cleanEmail || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required.'
      });
    }

    try {
      const rows = await query(`
        SELECT u.id, u.full_name, u.email, u.phone, u.password_hash, u.role, u.status, a.permissions
        FROM users u
        JOIN admin_users a ON u.id = a.user_id
        WHERE LOWER(u.email) = $1 AND u.status = 'ACTIVE' AND a.is_active = TRUE;
      `, [cleanEmail]);

      if (rows.length === 0) {
        return res.status(401).json({
          success: false,
          error: 'Invalid administrative credentials.'
        });
      }

      const admin = rows[0];
      const { valid, needsUpgrade } = await verifyPassword(password, admin.password_hash);

      if (!valid) {
        return res.status(401).json({
          success: false,
          error: 'Invalid administrative credentials.'
        });
      }

      if (needsUpgrade) {
        await upgradeUserPasswordToArgon2(admin.id, password);
      }

      const token = await createAdminSession(admin.id, req.headers['x-forwarded-for'] || '127.0.0.1', req.headers['user-agent'] || '');

      return res.status(200).json({
        success: true,
        message: 'Admin authentication successful.',
        token,
        admin: {
          id: admin.id,
          name: admin.full_name,
          email: admin.email,
          phone: admin.phone,
          role: admin.role,
          permissions: admin.permissions,
          status: admin.status
        }
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Database authentication failed.' });
    }
  }

  // 2. USER AUTH LOGIN (Database-verified with Argon2id)
  if (url.includes('/auth/login')) {
    const { email, identifier, password } = body;
    const clean = (email || identifier || '').toLowerCase().trim();

    if (!clean || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    try {
      const rows = await query(`
        SELECT id, full_name, email, phone, password_hash, role, status
        FROM users
        WHERE (LOWER(email) = $1 OR phone = $1) AND status = 'ACTIVE';
      `, [clean]);

      if (rows.length === 0) {
        return res.status(401).json({ success: false, error: 'Invalid credentials.' });
      }

      const user = rows[0];
      const { valid, needsUpgrade } = await verifyPassword(password, user.password_hash);

      if (!valid) {
        return res.status(401).json({ success: false, error: 'Invalid credentials.' });
      }

      if (needsUpgrade) {
        await upgradeUserPasswordToArgon2(user.id, password);
      }

      const token = await createUserSession(user.id, req.headers['x-forwarded-for'] || '127.0.0.1', req.headers['user-agent'] || '');

      return res.status(200).json({
        success: true,
        message: 'Login successful.',
        token,
        user: {
          id: user.id,
          name: user.full_name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status
        }
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Login query failed.' });
    }
  }

  // 3. USER AUTH REGISTER (Argon2id persistence)
  if (url.includes('/auth/register')) {
    const { name, email, phone, password } = body;
    const cleanEmail = (email || '').toLowerCase().trim();

    if (!cleanEmail || !password || !name) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required.' });
    }

    try {
      const existing = await query('SELECT id FROM users WHERE LOWER(email) = $1;', [cleanEmail]);
      if (existing.length > 0) {
        return res.status(409).json({ success: false, error: 'Account already exists with this email address.' });
      }

      const newId = `U-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`.toUpperCase();
      const hash = await hashPassword(password);

      await query(`
        INSERT INTO users (id, full_name, email, phone, password_hash, role, status)
        VALUES ($1, $2, $3, $4, $5, 'USER', 'ACTIVE');
      `, [newId, name, cleanEmail, phone || null, hash]);

      // Initialize cashback wallet
      await query(`
        INSERT INTO cashback_wallets (id, user_id, confirmed_balance, pending_balance, redeemed_balance, lifetime_cashback)
        VALUES ($1, $2, 0.00, 0.00, 0.00, 0.00);
      `, [`wallet-${newId}`, newId]);

      const token = await createUserSession(newId, req.headers['x-forwarded-for'] || '127.0.0.1', req.headers['user-agent'] || '');

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully.',
        token,
        user: {
          id: newId,
          name,
          email: cleanEmail,
          phone: phone || null,
          role: 'USER',
          status: 'ACTIVE'
        }
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Registration failed.' });
    }
  }

  // Default response
  return res.status(200).json({
    success: true,
    message: 'SmartDeal Real PostgreSQL Serverless Gateway Active',
    engine: 'PostgreSQL 18',
    timestamp: new Date().toISOString()
  });
}
