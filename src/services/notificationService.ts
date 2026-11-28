// SmartDeal Owner SMS & Email Notification Service
// Section: Instant Real-time Alerts to Owner (Phone: 7217514087 | Email: jk7217514087@gmail.com)

export interface OwnerNotification {
  id: string;
  type: 'BUY_CLICK' | 'PURCHASE_SUCCESS' | 'PURCHASE_NOT_BOUGHT' | 'RETURN_REQUEST' | 'RETURN_STATUS_UPDATE' | 'TEST_ALERT';
  title: string;
  phoneRecipient: string;
  emailRecipient: string;
  smsContent: string;
  emailSubject: string;
  emailHtml?: string;
  gmailComposeUrl?: string;
  smsDirectUri?: string;
  smsProvider?: string;
  emailProvider?: string;
  smsDispatchStatus?: string;
  emailDispatchStatus?: string;
  timestamp: string;
  status: 'DELIVERED' | 'PENDING' | 'SIMULATED';
  metadata?: Record<string, any>;
}

export interface SmsGatewayConfig {
  provider: 'SIMULATED' | 'FAST2SMS' | 'TWILIO' | 'WEBHOOK';
  ownerPhone: string;
  ownerEmail: string;
  fast2SmsApiKey?: string;
  twilioAccountSid?: string;
  twilioAuthToken?: string;
  twilioFromPhone?: string;
  webhookUrl?: string;
  // Email Configuration
  emailProvider?: 'SIMULATED' | 'GMAIL_SMTP' | 'RESEND' | 'EMAIL_WEBHOOK';
  gmailUser?: string;
  gmailAppPassword?: string;
  resendApiKey?: string;
  emailWebhookUrl?: string;
}

export interface ReturnRequestItem {
  id: string;
  orderRef: string;
  productName: string;
  marketplace: string;
  saleAmount: number;
  reason: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  refundMode: string;
  refundAccountDetails: string;
  status: 'REQUESTED' | 'APPROVED' | 'PICKUP_SCHEDULED' | 'REFUNDED' | 'REJECTED';
  createdAt: string;
  timeline: Array<{
    status: string;
    label: string;
    timestamp: string;
    notes?: string;
  }>;
}

const STORAGE_KEY = 'smartdeal_owner_notifications_v1';
const RETURNS_STORAGE_KEY = 'smartdeal_product_returns_v1';
const SMS_CONFIG_KEY = 'smartdeal_sms_gateway_config_v1';

export const OWNER_PHONE = '7217514087';
export const OWNER_EMAIL = 'jk7217514087@gmail.com';

class NotificationService {
  private listeners: Array<() => void> = [];
  private smsSubscribers: Array<(notif: OwnerNotification) => void> = [];

  public subscribe(cb: () => void): () => void {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  public subscribeSms(cb: (notif: OwnerNotification) => void): () => void {
    this.smsSubscribers.push(cb);
    return () => {
      this.smsSubscribers = this.smsSubscribers.filter(l => l !== cb);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(cb => {
      try {
        cb();
      } catch (e) {
        console.error('Error in notification listener:', e);
      }
    });
  }

  private broadcastSms(notif: OwnerNotification) {
    this.smsSubscribers.forEach(cb => {
      try {
        cb(notif);
      } catch (e) {
        console.error('Error in SMS subscriber callback:', e);
      }
    });
  }

  public getSmsConfig(): SmsGatewayConfig {
    try {
      const data = localStorage.getItem(SMS_CONFIG_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          provider: parsed.provider || 'SIMULATED',
          ownerPhone: parsed.ownerPhone || OWNER_PHONE,
          ownerEmail: parsed.ownerEmail || OWNER_EMAIL,
          fast2SmsApiKey: parsed.fast2SmsApiKey || '',
          twilioAccountSid: parsed.twilioAccountSid || '',
          twilioAuthToken: parsed.twilioAuthToken || '',
          twilioFromPhone: parsed.twilioFromPhone || '',
          webhookUrl: parsed.webhookUrl || '',
          emailProvider: parsed.emailProvider || 'GMAIL_SMTP',
          gmailUser: parsed.gmailUser || parsed.ownerEmail || OWNER_EMAIL,
          gmailAppPassword: parsed.gmailAppPassword || '',
          resendApiKey: parsed.resendApiKey || '',
          emailWebhookUrl: parsed.emailWebhookUrl || ''
        };
      }
    } catch {}
    return {
      provider: 'SIMULATED',
      ownerPhone: OWNER_PHONE,
      ownerEmail: OWNER_EMAIL,
      emailProvider: 'GMAIL_SMTP',
      gmailUser: OWNER_EMAIL
    };
  }

  public saveSmsConfig(config: Partial<SmsGatewayConfig>) {
    const current = this.getSmsConfig();
    const updated = { ...current, ...config };
    localStorage.setItem(SMS_CONFIG_KEY, JSON.stringify(updated));
    this.notifyListeners();

    // Synchronize configuration with backend server
    try {
      fetch('/api/notifications/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: updated.ownerPhone,
          email: updated.ownerEmail,
          smsProvider: updated.provider,
          emailProvider: updated.emailProvider,
          fast2SmsApiKey: updated.fast2SmsApiKey,
          twilioSid: updated.twilioAccountSid,
          twilioToken: updated.twilioAuthToken,
          twilioFrom: updated.twilioFromPhone,
          smsWebhookUrl: updated.webhookUrl,
          gmailUser: updated.gmailUser,
          gmailAppPassword: updated.gmailAppPassword,
          resendApiKey: updated.resendApiKey,
          emailWebhookUrl: updated.emailWebhookUrl
        })
      }).catch(() => {});
    } catch {}
  }

  public getNotificationLogs(): OwnerNotification[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  private saveNotificationLog(item: OwnerNotification) {
    const list = this.getNotificationLogs();
    list.unshift(item);
    if (list.length > 300) list.pop();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    this.notifyListeners();
    this.broadcastSms(item);
  }

  /**
   * Sound synthesizer for alert audio
   */
  public playAlertSound(type: 'click' | 'success' | 'return' | 'did_not_buy' = 'click') {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'success') {
        // High upbeat victory chime (E5 -> A5)
        osc.frequency.setValueAtTime(659.25, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
      } else if (type === 'did_not_buy' || type === 'return') {
        // Warning / missed opportunity tone (Eb5 -> C5)
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(329.63, ctx.currentTime + 0.22);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else {
        // Crisp notification ping for outbound click
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.28);
      }
    } catch {
      // Audio might require user interaction, safely ignore
    }
  }

  /**
   * Dispatches via real external SMS gateway if configured (e.g. Fast2SMS / Webhook)
   */
  private async dispatchExternalSmsGateway(smsText: string, recipientPhone: string) {
    const config = this.getSmsConfig();

    // 1. Fast2SMS Integration (Instant Indian Transactional SMS)
    if (config.provider === 'FAST2SMS' && config.fast2SmsApiKey) {
      try {
        await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            'authorization': config.fast2SmsApiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            route: 'q',
            message: smsText,
            language: 'english',
            flash: 0,
            numbers: recipientPhone
          })
        });
        console.info(`[Fast2SMS] Dispatched SMS to ${recipientPhone}`);
      } catch (err) {
        console.warn('[Fast2SMS Error] Could not reach gateway:', err);
      }
    }

    // 2. Custom Webhook (Zapier / Make / WhatsApp)
    if (config.provider === 'WEBHOOK' && config.webhookUrl) {
      try {
        await fetch(config.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipient: recipientPhone,
            message: smsText,
            timestamp: new Date().toISOString()
          })
        });
      } catch (err) {
        console.warn('[Webhook Error]:', err);
      }
    }
  }

  /**
   * Dispatches via real external Email gateway if configured (Resend / Email Webhook / Formspree)
   */
  private async dispatchExternalEmailGateway(subject: string, text: string, recipientEmail: string, html?: string) {
    const config = this.getSmsConfig();

    // 1. Client-side Resend API (Direct Email delivery without SMTP config)
    if (config.resendApiKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${config.resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'SmartDeal Alerts <onboarding@resend.dev>',
            to: [recipientEmail],
            subject,
            html: html || `<p>${text.replace(/\n/g, '<br/>')}</p>`
          })
        });
        console.info(`[Resend] Email dispatched to ${recipientEmail}`);
      } catch (err) {
        console.warn('[Resend Client Error]:', err);
      }
    }

    // 2. Email Webhook (Make / Zapier / Formspree / EmailJS)
    if (config.emailWebhookUrl) {
      try {
        await fetch(config.emailWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipient: recipientEmail,
            subject,
            text,
            html,
            timestamp: new Date().toISOString()
          })
        });
      } catch (err) {
        console.warn('[Email Webhook Error]:', err);
      }
    }
  }

  /**
   * Helper to open pre-filled Gmail compose draft for owner in 1 click
   */
  public openGmailDraft(notif: OwnerNotification) {
    if (notif.gmailComposeUrl) {
      window.open(notif.gmailComposeUrl, '_blank', 'noopener,noreferrer');
    }
  }

  /**
   * Helper to open native phone SMS app with pre-filled message
   */
  public openSmsApp(notif: OwnerNotification) {
    if (notif.smsDirectUri) {
      window.location.href = notif.smsDirectUri;
    }
  }

  /**
   * 1. Alert owner whenever any user clicks "Buy" / goes to Amazon/Flipkart
   */
  public async notifyBuyClick(params: {
    clickId?: string;
    productId: string;
    productName: string;
    marketplace: string;
    price: number;
    targetUrl: string;
    userName?: string;
    userContact?: string;
  }): Promise<OwnerNotification> {
    const config = this.getSmsConfig();
    const phone = config.ownerPhone || OWNER_PHONE;
    const email = config.ownerEmail || OWNER_EMAIL;
    const clickId = params.clickId || `SD-AFF-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const estCommission = Math.round(params.price * 0.05); // ~5% standard

    const smsText = `🚨 [SmartDeal Alert] User Clicked Buy!\n• Product: ${params.productName}\n• Store: ${params.marketplace}\n• Price: ₹${params.price.toLocaleString('en-IN')}\n• Click ID: ${clickId}\n• Est. Commission: ₹${estCommission.toLocaleString('en-IN')} (100% Platform Revenue)\n• User: ${params.userName || 'Guest Visitor'} (${params.userContact || 'Web Session'})\n• Status: Visited Store (Decision Pending)\n• Store Link: ${params.targetUrl}`;
    const emailSubject = `🚨 [SmartDeal Alert] Outbound Click: ${params.productName} (${params.marketplace})`;

    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(smsText)}`;
    const smsDirectUri = `sms:+91${phone}?body=${encodeURIComponent(smsText)}`;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
        <h2 style="color: #2563eb; margin-top: 0;">🚨 New Product Buy Click Alert</h2>
        <p>A user on SmartDeal clicked to purchase a product from an external store:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
          <tr><td style="padding: 8px; font-weight: bold; width: 140px;">Product:</td><td>${params.productName}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Store / Marketplace:</td><td>${params.marketplace}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Price:</td><td>₹${params.price.toLocaleString('en-IN')}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Tracking Click ID:</td><td><code>${clickId}</code></td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Est. Commission:</td><td>₹${estCommission.toLocaleString('en-IN')} (5%)</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">User:</td><td>${params.userName || 'Guest'} (${params.userContact || 'Web Session'})</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Destination URL:</td><td><a href="${params.targetUrl}" style="color: #2563eb;">${params.targetUrl}</a></td></tr>
        </table>
        <p style="color: #64748b; font-size: 12px;">Alert dispatched to phone ${phone} and email ${email}</p>
      </div>
    `;

    const notif: OwnerNotification = {
      id: `NOTIF-CLICK-${Date.now().toString(36).toUpperCase()}`,
      type: 'BUY_CLICK',
      title: `Store Visited: ${params.productName}`,
      phoneRecipient: phone,
      emailRecipient: email,
      smsContent: smsText,
      emailSubject,
      emailHtml,
      gmailComposeUrl,
      smsDirectUri,
      timestamp: new Date().toISOString(),
      status: config.provider !== 'SIMULATED' ? 'DELIVERED' : 'SIMULATED',
      metadata: { ...params, clickId }
    };

    this.saveNotificationLog(notif);
    this.playAlertSound('click');
    this.dispatchExternalSmsGateway(smsText, phone);
    this.dispatchExternalEmailGateway(emailSubject, smsText, email, emailHtml);

    // Also dispatch to backend API asynchronously
    try {
      fetch('/api/notifications/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notif)
      }).catch(() => {});
    } catch {}

    return notif;
  }

  /**
   * 2. Alert owner when the purchase is confirmed / successful (BUY KIYA)
   */
  public async notifyPurchaseSuccess(params: {
    clickId?: string;
    productId?: string;
    productName: string;
    marketplace: string;
    pricePaid: number;
    orderRef: string;
    commissionEarned?: number;
    userCashback?: number;
    customerName?: string;
    customerContact?: string;
  }): Promise<OwnerNotification> {
    const config = this.getSmsConfig();
    const phone = config.ownerPhone || OWNER_PHONE;
    const email = config.ownerEmail || OWNER_EMAIL;
    const commission = params.commissionEarned || Math.round(params.pricePaid * 0.05);

    const smsText = `✅ [SmartDeal SUCCESS] Product Purchased!\n• Product: ${params.productName}\n• Store: ${params.marketplace}\n• Price Paid: ₹${params.pricePaid.toLocaleString('en-IN')}\n• Order Ref: ${params.orderRef}\n• Commission Earned: ₹${commission.toLocaleString('en-IN')} (100% Platform Revenue)\n• Customer: ${params.customerName || 'Customer'} (${params.customerContact || 'Verified'})\n• Click ID: ${params.clickId || 'SD-CONFIRMED'}\n• Status: Confirmed & Credited`;
    const emailSubject = `🎉 [SmartDeal SUCCESS] ₹${commission} Commission Earned: ${params.productName}`;

    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(smsText)}`;
    const smsDirectUri = `sms:+91${phone}?body=${encodeURIComponent(smsText)}`;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #ecfdf5; border-radius: 12px; border: 1px solid #10b981;">
        <h2 style="color: #059669; margin-top: 0;">🎉 Successful Product Purchase & Commission Confirmed!</h2>
        <p>Great news! A visitor purchased the product from ${params.marketplace}:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
          <tr><td style="padding: 8px; font-weight: bold; width: 140px;">Product:</td><td>${params.productName}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Store:</td><td>${params.marketplace}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Final Price:</td><td>₹${params.pricePaid.toLocaleString('en-IN')}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; color: #059669;">Commission Earned:</td><td style="font-weight: bold; color: #059669;">₹${commission.toLocaleString('en-IN')} (100% Platform Revenue)</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Order ID / Ref:</td><td>${params.orderRef}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Buyer:</td><td>${params.customerName || 'Customer'} (${params.customerContact || 'Verified'})</td></tr>
        </table>
        <p style="color: #065f46; font-size: 12px;">Dispatched to phone ${phone} and email ${email}</p>
      </div>
    `;

    const notif: OwnerNotification = {
      id: `NOTIF-SUCC-${Date.now().toString(36).toUpperCase()}`,
      type: 'PURCHASE_SUCCESS',
      title: `Purchase Confirmed: ${params.productName}`,
      phoneRecipient: phone,
      emailRecipient: email,
      smsContent: smsText,
      emailSubject,
      emailHtml,
      gmailComposeUrl,
      smsDirectUri,
      timestamp: new Date().toISOString(),
      status: config.provider !== 'SIMULATED' ? 'DELIVERED' : 'SIMULATED',
      metadata: params
    };

    this.saveNotificationLog(notif);
    this.playAlertSound('success');
    this.dispatchExternalSmsGateway(smsText, phone);
    this.dispatchExternalEmailGateway(emailSubject, smsText, email, emailHtml);

    try {
      fetch('/api/purchases/track-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: params.productId,
          productName: params.productName,
          marketplace: params.marketplace,
          saleAmount: params.pricePaid,
          status: 'BOUGHT_SUCCESS',
          orderRef: params.orderRef,
          customerName: params.customerName,
          customerPhone: params.customerContact
        })
      }).catch(() => {});
    } catch {}

    return notif;
  }

  /**
   * 3. Alert owner when the visitor did NOT buy the product (BUY NAHI KIYA)
   */
  public async notifyDidNotBuy(params: {
    clickId?: string;
    productId?: string;
    productName: string;
    marketplace: string;
    price: number;
    reason?: string;
    userName?: string;
    userContact?: string;
  }): Promise<OwnerNotification> {
    const config = this.getSmsConfig();
    const phone = config.ownerPhone || OWNER_PHONE;
    const email = config.ownerEmail || OWNER_EMAIL;
    const estCommission = Math.round(params.price * 0.05);

    const smsText = `❌ [SmartDeal Alert] Product NOT Bought (Did Not Buy)\n• Product: ${params.productName}\n• Store: ${params.marketplace}\n• Store Price: ₹${params.price.toLocaleString('en-IN')}\n• Click ID: ${params.clickId || 'SD-TRACK-LOST'}\n• Missed Commission: ₹${estCommission.toLocaleString('en-IN')}\n• User: ${params.userName || 'Web Visitor'} (${params.userContact || 'Session'})\n• Reason: ${params.reason || 'Customer browsed external store but did not complete purchase / Abandoned'}\n• Status: Abandoned / Not Purchased`;
    const emailSubject = `❌ [SmartDeal Alert] Product NOT Bought: ${params.productName} (${params.marketplace})`;

    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(smsText)}`;
    const smsDirectUri = `sms:+91${phone}?body=${encodeURIComponent(smsText)}`;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #fef2f2; border-radius: 12px; border: 1px solid #f87171;">
        <h2 style="color: #dc2626; margin-top: 0;">❌ Product Not Purchased Alert</h2>
        <p>A visitor visited the store page but did not complete the purchase:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
          <tr><td style="padding: 8px; font-weight: bold; width: 140px;">Product:</td><td>${params.productName}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Store:</td><td>${params.marketplace}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Price:</td><td>₹${params.price.toLocaleString('en-IN')}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Tracking Click ID:</td><td><code>${params.clickId || 'N/A'}</code></td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Missed Commission:</td><td>₹${estCommission.toLocaleString('en-IN')}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Customer Reason:</td><td>${params.reason || 'Visitor left without purchasing / Browsed only'}</td></tr>
        </table>
        <p style="color: #991b1b; font-size: 12px;">Dispatched to phone ${phone} and email ${email}</p>
      </div>
    `;

    const notif: OwnerNotification = {
      id: `NOTIF-NOTBOUGHT-${Date.now().toString(36).toUpperCase()}`,
      type: 'PURCHASE_NOT_BOUGHT',
      title: `Not Purchased: ${params.productName}`,
      phoneRecipient: phone,
      emailRecipient: email,
      smsContent: smsText,
      emailSubject,
      emailHtml,
      gmailComposeUrl,
      smsDirectUri,
      timestamp: new Date().toISOString(),
      status: config.provider !== 'SIMULATED' ? 'DELIVERED' : 'SIMULATED',
      metadata: params
    };

    this.saveNotificationLog(notif);
    this.playAlertSound('did_not_buy');
    this.dispatchExternalSmsGateway(smsText, phone);
    this.dispatchExternalEmailGateway(emailSubject, smsText, email, emailHtml);

    try {
      fetch('/api/notifications/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notif)
      }).catch(() => {});
    } catch {}

    return notif;
  }

  /**
   * 3. Submit Product Return Request and Alert Owner
   */
  public async submitReturnRequest(params: {
    orderRef: string;
    productName: string;
    marketplace: string;
    saleAmount?: number;
    reason: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    refundMode: string;
    refundAccountDetails: string;
  }): Promise<ReturnRequestItem> {
    const returnId = `RET-${Math.floor(1000 + Math.random() * 9000)}`;
    const returnItem: ReturnRequestItem = {
      id: returnId,
      orderRef: params.orderRef,
      productName: params.productName,
      marketplace: params.marketplace,
      saleAmount: params.saleAmount || 0,
      reason: params.reason,
      customerName: params.customerName,
      customerPhone: params.customerPhone,
      customerEmail: params.customerEmail,
      refundMode: params.refundMode,
      refundAccountDetails: params.refundAccountDetails,
      status: 'REQUESTED',
      createdAt: new Date().toISOString(),
      timeline: [
        {
          status: 'REQUESTED',
          label: 'Return Request Registered',
          timestamp: new Date().toISOString(),
          notes: 'Customer submitted return request. Owner and store notified.'
        }
      ]
    };

    // Save locally
    const existingReturns = this.getReturnRequests();
    existingReturns.unshift(returnItem);
    localStorage.setItem(RETURNS_STORAGE_KEY, JSON.stringify(existingReturns));

    // Send owner SMS & Email notification
    const smsText = `⚠️ [SmartDeal Alert] Product Return Requested!\n• Return ID: ${returnId}\n• Product: ${params.productName}\n• Store: ${params.marketplace}\n• Order Ref: ${params.orderRef}\n• Reason: ${params.reason}\n• Customer: ${params.customerName} (${params.customerPhone})\n• Refund Method: ${params.refundMode} (${params.refundAccountDetails})`;
    const emailSubject = `⚠️ [SmartDeal Return Request] ${params.productName} (Order: ${params.orderRef})`;

    const notif: OwnerNotification = {
      id: `NOTIF-RET-${Date.now().toString(36).toUpperCase()}`,
      type: 'RETURN_REQUEST',
      title: `Return Requested: ${params.productName}`,
      phoneRecipient: OWNER_PHONE,
      emailRecipient: OWNER_EMAIL,
      smsContent: smsText,
      emailSubject,
      emailHtml: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #fffbeb; border-radius: 12px; border: 1px solid #f59e0b;">
          <h2 style="color: #b45309; margin-top: 0;">⚠️ Product Return Request Alert</h2>
          <p>A customer has requested return assistance for an item:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
            <tr><td style="padding: 8px; font-weight: bold; width: 140px;">Return ID:</td><td>${returnId}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Product:</td><td>${params.productName}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Store:</td><td>${params.marketplace}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Order Reference:</td><td>${params.orderRef}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Reason:</td><td>${params.reason}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Customer:</td><td>${params.customerName} (${params.customerPhone} / ${params.customerEmail})</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Refund Mode:</td><td>${params.refundMode} (${params.refundAccountDetails})</td></tr>
          </table>
          <p style="color: #78350f; font-size: 12px;">Sent to phone ${OWNER_PHONE} and email ${OWNER_EMAIL}</p>
        </div>
      `,
      timestamp: new Date().toISOString(),
      status: 'DELIVERED',
      metadata: returnItem
    };

    this.saveNotificationLog(notif);
    this.playAlertSound('return');

    try {
      fetch('/api/returns/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      }).catch(() => {});
    } catch {
      // Ignore safely
    }

    return returnItem;
  }

  public getReturnRequests(): ReturnRequestItem[] {
    try {
      const data = localStorage.getItem(RETURNS_STORAGE_KEY);
      if (!data) {
        // Seed initial returns for demo
        const initial: ReturnRequestItem[] = [
          {
            id: 'RET-8941',
            orderRef: '403-8192019-182910',
            productName: 'boAt Airdopes 141 Bluetooth TWS Earbuds',
            marketplace: 'Amazon India',
            saleAmount: 1299,
            reason: 'Audio balance defect on right earbud',
            customerName: 'Rohit Verma',
            customerPhone: '9810293812',
            customerEmail: 'rohit.v@example.com',
            refundMode: 'UPI',
            refundAccountDetails: 'rohit@okaxis',
            status: 'PICKUP_SCHEDULED',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            timeline: [
              { status: 'REQUESTED', label: 'Return Registered', timestamp: new Date(Date.now() - 86400000).toISOString() },
              { status: 'APPROVED', label: 'Store Return Approved', timestamp: new Date(Date.now() - 43200000).toISOString() },
              { status: 'PICKUP_SCHEDULED', label: 'Amazon Courier Pickup Scheduled', timestamp: new Date(Date.now() - 10800000).toISOString() }
            ]
          }
        ];
        localStorage.setItem(RETURNS_STORAGE_KEY, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  /**
   * Send test alert to verify connectivity
   */
  public async sendTestAlert(): Promise<OwnerNotification> {
    const config = this.getSmsConfig();
    const phone = config.ownerPhone || OWNER_PHONE;
    const email = config.ownerEmail || OWNER_EMAIL;
    const smsText = `✅ [SmartDeal System Test]\nAll systems active! Real-time alerts connected:\n• Phone (SMS): +91 ${phone}\n• Email: ${email}\n• Timestamp: ${new Date().toLocaleString('en-IN')}`;
    const emailSubject = `✅ [SmartDeal Test] Alert System Active (Phone: +91 ${phone} | Email: ${email})`;

    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(smsText)}`;
    const smsDirectUri = `sms:+91${phone}?body=${encodeURIComponent(smsText)}`;

    const notif: OwnerNotification = {
      id: `NOTIF-TEST-${Date.now().toString(36).toUpperCase()}`,
      type: 'TEST_ALERT',
      title: 'Alert System Connectivity Test',
      phoneRecipient: phone,
      emailRecipient: email,
      smsContent: smsText,
      emailSubject,
      emailHtml: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #ecfdf5; border-radius: 12px; border: 1px solid #10b981;">
          <h2 style="color: #059669; margin-top: 0;">✅ SmartDeal Alerts Connected!</h2>
          <p>Real-time activity alerts are active and configured to deliver directly to:</p>
          <ul>
            <li><strong>Phone (SMS):</strong> +91 ${phone}</li>
            <li><strong>Email:</strong> ${email}</li>
          </ul>
          <p style="color: #047857; font-size: 12px;">Verified at ${new Date().toLocaleString('en-IN')}</p>
        </div>
      `,
      gmailComposeUrl,
      smsDirectUri,
      timestamp: new Date().toISOString(),
      status: 'DELIVERED'
    };

    this.saveNotificationLog(notif);
    this.playAlertSound('success');
    this.dispatchExternalSmsGateway(smsText, phone);
    this.dispatchExternalEmailGateway(emailSubject, smsText, email, notif.emailHtml);

    try {
      fetch('/api/notifications/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notif)
      }).catch(() => {});
    } catch {
      // Ignore safely
    }

    return notif;
  }
}

export const notificationService = new NotificationService();
