// ==========================================================
// SMARTDEAL ADVANCED AFFILIATE SERVICE
// Pure Business Model: Tracks legitimate affiliate commissions
// earned by SmartDeal across partner marketplaces.
// Strict policy: SmartDeal does NOT provide customer cashback
// or purchase incentives. Zero consumer wallet credits!
// ==========================================================

import { pool, query, withTransaction } from '../db/connection.mjs';

/**
 * Records an outbound affiliate click to an external marketplace
 */
export const recordOutboundClick = async ({
  clickId,
  userId = null,
  guestId = null,
  productId = null,
  platformId = 'amazon',
  targetUrl = '',
  ipAddress = '127.0.0.1',
  userAgent = '',
  subId1 = '',
  subId2 = ''
}) => {
  const generatedClickId = clickId || `SD-AFF-${Date.now()}-${Math.floor(100000 + Math.random() * 900000)}`;

  await withTransaction(async (client) => {
    // 1. Insert click record into affiliate.outbound_clicks
    await client.query(`
      INSERT INTO affiliate.outbound_clicks (
        id, user_id, guest_id, product_id, platform_id,
        target_url, ip_address, user_agent
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (id) DO NOTHING;
    `, [
      generatedClickId,
      userId,
      guestId,
      productId,
      platformId,
      targetUrl,
      ipAddress,
      userAgent
    ]);

    // 2. Track sub-identities for reconciliation
    if (subId1 || subId2) {
      await client.query(`
        INSERT INTO affiliate.affiliate_sub_identities (
          click_id, sub_id_1, sub_id_2, sub_id_3
        )
        VALUES ($1, $2, $3, $4)
        ON CONFLICT DO NOTHING;
      `, [generatedClickId, subId1 || null, subId2 || null, userId || null]);
    }
  });

  return {
    success: true,
    clickId: generatedClickId,
    platformId,
    targetUrl
  };
};

/**
 * Processes an affiliate conversion webhook or reconciliation file idempotently
 * Tracks SmartDeal's affiliate commission revenue ONLY (cashback_amount = 0.00).
 */
export const processAffiliateConversion = async ({
  idempotencyKey,
  clickId = null,
  userId = null,
  platformId = 'amazon',
  orderId = '',
  orderAmount = 0,
  commissionRate = 0.05, // e.g. 5% commission earned by SmartDeal
  status = 'CONFIRMED'
}) => {
  const numericAmount = Math.round(Number(orderAmount || 0) * 100) / 100;
  const commissionEarned = Math.round(numericAmount * Number(commissionRate || 0.05) * 100) / 100;
  const conversionId = `conv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const idemKey = idempotencyKey || `idem-${orderId || Date.now()}`;

  return await withTransaction(async (client) => {
    // 1. Idempotent insertion into affiliate.affiliate_conversions
    const convResult = await client.query(`
      INSERT INTO affiliate.affiliate_conversions (
        id, idempotency_key, click_id, user_id, platform_id,
        order_amount, commission_rate, commission_amount,
        cashback_rate, cashback_amount, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 0.00, 0.00, $9)
      ON CONFLICT (idempotency_key) DO UPDATE SET
        status = EXCLUDED.status
      RETURNING *;
    `, [
      conversionId,
      idemKey,
      clickId,
      userId,
      platformId,
      numericAmount,
      commissionRate,
      commissionEarned,
      status
    ]);

    const conversion = convResult.rows[0];

    // 2. Record SmartDeal's business commission ledger entry
    const commId = `comm-${conversion.id}`;
    await client.query(`
      INSERT INTO affiliate.affiliate_commissions (
        id, conversion_id, platform_id, order_ref, gross_commission,
        tax_deducted, net_commission, payout_status
      )
      VALUES ($1, $2, $3, $4, $5, 0.00, $5, 'APPROVED')
      ON CONFLICT (id) DO UPDATE SET
        gross_commission = EXCLUDED.gross_commission,
        net_commission = EXCLUDED.net_commission;
    `, [commId, conversion.id, platformId, orderId || conversion.id, commissionEarned]);

    return {
      success: true,
      conversionId: conversion.id,
      orderId,
      orderAmount: numericAmount,
      smartDealCommission: commissionEarned,
      consumerCashback: 0.00, // Explicitly zero
      status: conversion.status
    };
  });
};

/**
 * Records an affiliate commission reversal (returns, cancellations)
 */
export const recordCommissionReversal = async ({
  conversionId,
  reversalAmount,
  reason = 'Customer Product Return'
}) => {
  const revId = `rev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  return await withTransaction(async (client) => {
    const revResult = await client.query(`
      INSERT INTO affiliate.affiliate_reversals (
        id, conversion_id, reversal_reason, clawback_amount, reversal_date
      )
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      RETURNING *;
    `, [revId, conversionId, reason, reversalAmount]);

    // Update status in commissions table
    await client.query(`
      UPDATE affiliate.affiliate_commissions
      SET payout_status = 'REVERSED'
      WHERE conversion_id = $1;
    `, [conversionId]);

    await client.query(`
      UPDATE affiliate.affiliate_conversions
      SET status = 'REVERSED'
      WHERE id = $1;
    `, [conversionId]);

    return {
      success: true,
      reversalId: revResult.rows[0].id,
      reversalAmount,
      reason
    };
  });
};

/**
 * Returns comprehensive affiliate metrics for Admin Analytics
 */
export const getAffiliateMetrics = async () => {
  const clicksRes = await query('SELECT count(*) as total_clicks FROM affiliate.outbound_clicks;');
  const conversionsRes = await query(`
    SELECT 
      count(*) as total_conversions,
      COALESCE(SUM(order_amount), 0) as total_order_value,
      COALESCE(SUM(commission_amount), 0) as total_commission_earned
    FROM affiliate.affiliate_conversions
    WHERE status != 'REVERSED';
  `);
  const reversalRes = await query(`
    SELECT COALESCE(SUM(clawback_amount), 0) as total_reversed
    FROM affiliate.affiliate_reversals;
  `);

  const conv = conversionsRes[0] || {};
  const netCommission = Math.max(0, Number(conv.total_commission_earned || 0) - Number(reversalRes[0]?.total_reversed || 0));

  return {
    totalClicks: parseInt(clicksRes[0]?.total_clicks || '0', 10),
    totalConversions: parseInt(conv.total_conversions || '0', 10),
    grossOrderValue: parseFloat(conv.total_order_value || 0),
    totalCommissionEarned: parseFloat(conv.total_commission_earned || 0),
    totalReversed: parseFloat(reversalRes[0]?.total_reversed || 0),
    netCommission: Math.round(netCommission * 100) / 100
  };
};
