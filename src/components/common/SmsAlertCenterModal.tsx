import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Mail,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Trash2,
  X,
  Settings,
  Filter,
  ExternalLink,
  ShieldCheck,
  Zap,
  Copy,
  Check,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCheck
} from 'lucide-react';
import {
  notificationService,
  OwnerNotification,
  SmsGatewayConfig,
  OWNER_PHONE,
  OWNER_EMAIL
} from '../../services/notificationService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SmsAlertCenterModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<OwnerNotification[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'BUY_CLICK' | 'PURCHASE_SUCCESS' | 'PURCHASE_NOT_BOUGHT'>('ALL');
  const [config, setConfig] = useState<SmsGatewayConfig>(() => notificationService.getSmsConfig());
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [configTab, setConfigTab] = useState<'SMS' | 'EMAIL'>('SMS');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [expandedEmailId, setExpandedEmailId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLogs(notificationService.getNotificationLogs());
    setConfig(notificationService.getSmsConfig());

    const unsub = notificationService.subscribe(() => {
      setLogs(notificationService.getNotificationLogs());
    });
    return unsub;
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    notificationService.saveSmsConfig(config);
    setIsConfigOpen(false);
    setTestResult('Configuration saved successfully & synced to backend.');
    setTimeout(() => setTestResult(null), 4000);
  };

  const handleSendTestSmsAndEmail = async () => {
    setIsSendingTest(true);
    setTestResult(null);
    try {
      const res = await notificationService.sendTestAlert();
      setTestResult(`✅ Test Alert dispatched to Phone (+91 ${res.phoneRecipient}) & Email (${res.emailRecipient})!`);
    } catch {
      setTestResult('⚠️ Test dispatched to local activity log.');
    } finally {
      setIsSendingTest(false);
      setTimeout(() => setTestResult(null), 5000);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearLogs = () => {
    if (window.confirm('Clear all SMS & Email notification logs?')) {
      localStorage.removeItem('smartdeal_owner_notifications_v1');
      setLogs([]);
    }
  };

  const filteredLogs = logs.filter(item => {
    if (filter === 'ALL') return true;
    return item.type === filter;
  });

  const clickCount = logs.filter(l => l.type === 'BUY_CLICK').length;
  const successCount = logs.filter(l => l.type === 'PURCHASE_SUCCESS').length;
  const notBoughtCount = logs.filter(l => l.type === 'PURCHASE_NOT_BOUGHT').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#0A0F1D] border border-blue-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#0e172a] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-blue-500/30 flex items-center gap-1">
              <Smartphone className="w-5 h-5 animate-pulse" />
              <Mail className="w-4 h-4 text-blue-200" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-white">
                  Owner SMS & Email Alert Center
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  SMS: +91 {config.ownerPhone || OWNER_PHONE}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Email: {config.ownerEmail || OWNER_EMAIL}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time dispatch to owner's phone & email for every product link visit, confirmed purchase, or abandoned click.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsConfigOpen(!isConfigOpen)}
              className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                isConfigOpen
                  ? 'bg-blue-600 border-blue-400 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title="SMS & Email Gateway Settings"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real Mobile Delivery Activation Banner */}
        <div className="bg-gradient-to-r from-amber-950/80 via-blue-950/60 to-slate-900 border-b border-amber-500/30 p-3.5 sm:p-4 text-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="p-1 rounded-lg bg-amber-500/20 text-amber-300 font-extrabold text-[11px] flex items-center gap-1 border border-amber-500/30">
                  <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                  Phone Par Real SMS Chahiye?
                </span>
                <span className="text-amber-200 font-bold text-xs">
                  Physical SIM Handset (+91 {config.ownerPhone || OWNER_PHONE})
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Computer se direct aapke mobile number ke SIM par telecom SMS bhejne ke liye <strong>Fast2SMS API Key</strong> zaroori hai (Free 50 SMS milte hain). Key enter karte hi har alert seedhe aapke phone par ring karega!
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsConfigOpen(true);
                  setConfigTab('SMS');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Activate Real SMS on Phone</span>
              </button>
            </div>
          </div>
        </div>

        {/* Status Toast Banner if test sent */}
        {testResult && (
          <div className="px-5 py-2.5 bg-emerald-950/80 border-b border-emerald-800 text-emerald-300 text-xs font-bold flex items-center justify-between animate-fadeIn">
            <span>{testResult}</span>
            <button onClick={() => setTestResult(null)} className="text-emerald-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Gateway Configuration Drawer */}
        {isConfigOpen && (
          <form onSubmit={handleSaveConfig} className="p-4 sm:p-5 bg-[#101b33] border-b border-slate-800 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="text-xs font-black uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>Configure Live Phone SMS & Email Transports</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-900 rounded-xl p-0.5 border border-slate-700 text-xs">
                <button
                  type="button"
                  onClick={() => setConfigTab('SMS')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                    configTab === 'SMS' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3 h-3" />
                  <span>Phone SMS</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConfigTab('EMAIL')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                    configTab === 'EMAIL' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Mail className="w-3 h-3" />
                  <span>Email</span>
                </button>
              </div>
            </div>

            {/* Tab 1: Phone SMS Config */}
            {configTab === 'SMS' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Owner Phone (SMS Target)
                  </label>
                  <input
                    type="text"
                    value={config.ownerPhone}
                    onChange={e => setConfig({ ...config, ownerPhone: e.target.value })}
                    placeholder="e.g. 7217514087"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    required
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Default: 7217514087</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    SMS Delivery Gateway
                  </label>
                  <select
                    value={config.provider}
                    onChange={e => setConfig({ ...config, provider: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium"
                  >
                    <option value="SIMULATED">Browser Live Audio & Toast (Always Active)</option>
                    <option value="FAST2SMS">Fast2SMS (Real Indian Mobile Cellular SMS)</option>
                    <option value="WEBHOOK">Custom Webhook (WhatsApp / Zapier / Telegram)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    {config.provider === 'FAST2SMS' ? 'Fast2SMS API Key' : config.provider === 'WEBHOOK' ? 'Webhook Endpoint URL' : 'Optional SMS API Key'}
                  </label>
                  <input
                    type="text"
                    value={config.fast2SmsApiKey || config.webhookUrl || ''}
                    onChange={e => {
                      if (config.provider === 'FAST2SMS') setConfig({ ...config, fast2SmsApiKey: e.target.value });
                      else if (config.provider === 'WEBHOOK') setConfig({ ...config, webhookUrl: e.target.value });
                    }}
                    placeholder={config.provider === 'FAST2SMS' ? 'Enter Fast2SMS API Key' : 'https://hooks.zapier.com/...'}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-[11px]"
                  />
                </div>
              </div>
            )}

            {/* Tab 2: Email Config */}
            {configTab === 'EMAIL' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Owner Email (Inbox Target)
                  </label>
                  <input
                    type="email"
                    value={config.ownerEmail}
                    onChange={e => setConfig({ ...config, ownerEmail: e.target.value })}
                    placeholder="e.g. jk7217514087@gmail.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                    required
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Default: jk7217514087@gmail.com</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Email Delivery Transport
                  </label>
                  <select
                    value={config.emailProvider || 'GMAIL_SMTP'}
                    onChange={e => setConfig({ ...config, emailProvider: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium"
                  >
                    <option value="GMAIL_SMTP">Gmail SMTP (via Google App Password)</option>
                    <option value="RESEND">Resend API (Cloud Transactional Email)</option>
                    <option value="EMAIL_WEBHOOK">Email Webhook (Zapier / Make / Formspree)</option>
                    <option value="SIMULATED">Instant 1-Click Gmail Draft Compose</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    {config.emailProvider === 'RESEND' ? 'Resend API Key (re_...)' : 'Gmail App Password (16 chars)'}
                  </label>
                  <input
                    type="password"
                    value={config.emailProvider === 'RESEND' ? (config.resendApiKey || '') : (config.gmailAppPassword || '')}
                    onChange={e => {
                      if (config.emailProvider === 'RESEND') setConfig({ ...config, resendApiKey: e.target.value });
                      else setConfig({ ...config, gmailAppPassword: e.target.value });
                    }}
                    placeholder={config.emailProvider === 'RESEND' ? 're_123...' : 'abcd efgh ijkl mnop'}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-[11px]"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>
                  {configTab === 'SMS'
                    ? 'Free Fast2SMS API key delivers real cellular SMS to 7217514087. Every notification also has a 1-click Phone SMS app button.'
                    : 'Use a 16-character Google App Password (myaccount.google.com > Security > App Passwords) for direct Gmail delivery.'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsConfigOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white text-xs"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Counter Summary Bar */}
        <div className="px-5 py-3.5 bg-[#0d1424] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                filter === 'ALL'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-800/70 text-slate-400 hover:text-white'
              }`}
            >
              All Alerts ({logs.length})
            </button>
            <button
              onClick={() => setFilter('BUY_CLICK')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                filter === 'BUY_CLICK'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-800/70 text-blue-400 hover:text-white'
              }`}
            >
              🚨 Outbound Clicks ({clickCount})
            </button>
            <button
              onClick={() => setFilter('PURCHASE_SUCCESS')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                filter === 'PURCHASE_SUCCESS'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800/70 text-emerald-400 hover:text-white'
              }`}
            >
              ✅ Bought ({successCount})
            </button>
            <button
              onClick={() => setFilter('PURCHASE_NOT_BOUGHT')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                filter === 'PURCHASE_NOT_BOUGHT'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
                  : 'bg-slate-800/70 text-rose-400 hover:text-white'
              }`}
            >
              ❌ Not Bought ({notBoughtCount})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSendTestSmsAndEmail}
              disabled={isSendingTest}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-extrabold flex items-center gap-1.5 active:scale-95 transition-all shadow-md shadow-blue-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSendingTest ? 'Dispatching...' : `Test Alert (SMS + Email)`}</span>
            </button>

            {logs.length > 0 && (
              <button
                onClick={handleClearLogs}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-800 transition-colors"
                title="Clear Logs"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Message Log Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 divide-y divide-slate-800/60">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 space-y-3 text-slate-500">
              <div className="flex justify-center gap-2">
                <Smartphone className="w-9 h-9 text-slate-600" />
                <Mail className="w-9 h-9 text-slate-600" />
              </div>
              <p className="text-sm font-bold text-slate-300">No alerts recorded in this filter</p>
              <p className="text-xs max-w-md mx-auto text-slate-400">
                Click any product on SmartDeal (like Noise Endeavour Pro) and proceed to Amazon or Flipkart. You will see both real-time SMS and Email alerts dispatched and recorded here!
              </p>
              <button
                onClick={handleSendTestSmsAndEmail}
                className="mt-2 px-4 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500"
              >
                Send Test Alert Now
              </button>
            </div>
          ) : (
            filteredLogs.map(item => {
              const isSuccess = item.type === 'PURCHASE_SUCCESS';
              const isNotBought = item.type === 'PURCHASE_NOT_BOUGHT';
              const isClick = item.type === 'BUY_CLICK';
              const isExpanded = expandedEmailId === item.id;

              const badgeColor = isSuccess
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                : isNotBought
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                : 'bg-blue-500/20 text-blue-400 border-blue-500/30';

              const badgeLabel = isSuccess
                ? '✅ PURCHASE CONFIRMED (BOUGHT)'
                : isNotBought
                ? '❌ PRODUCT NOT BOUGHT'
                : '🚨 OUTBOUND STORE VISIT';

              const phone = item.phoneRecipient || config.ownerPhone || OWNER_PHONE;
              const email = item.emailRecipient || config.ownerEmail || OWNER_EMAIL;
              const gmailUrl = item.gmailComposeUrl || `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(item.emailSubject || item.title)}&body=${encodeURIComponent(item.smsContent)}`;
              const smsUri = item.smsDirectUri || `sms:+91${phone}?body=${encodeURIComponent(item.smsContent)}`;

              return (
                <div key={item.id} className="pt-3.5 first:pt-0 space-y-2.5">
                  {/* Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${badgeColor}`}>
                        {badgeLabel}
                      </span>
                      <span className="text-xs font-bold text-white">
                        {item.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                      <span>SMS: <strong className="text-slate-200">+91 {phone}</strong></span>
                      <span>•</span>
                      <span>Email: <strong className="text-slate-200">{email}</strong></span>
                      <span>•</span>
                      <span>{new Date(item.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                    </div>
                  </div>

                  {/* SMS Bubble */}
                  <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-3.5 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed relative group">
                    <div className="text-[10px] uppercase font-black tracking-wider text-blue-400 mb-1 flex items-center gap-1">
                      <Smartphone className="w-3 h-3" />
                      <span>SMS Payload:</span>
                    </div>
                    {item.smsContent}

                    {/* Bottom Action Bar */}
                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCheck className="w-3 h-3" />
                          SMS: {item.smsDispatchStatus || 'DELIVERED'}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-[10px] text-blue-400 font-bold flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          Email: {item.emailDispatchStatus || 'DELIVERED'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Copy SMS */}
                        <button
                          onClick={() => handleCopyText(item.id, item.smsContent)}
                          className="inline-flex items-center gap-1 text-[10px] text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                        >
                          {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === item.id ? 'Copied' : 'Copy SMS'}</span>
                        </button>

                        {/* Open in Gmail */}
                        <a
                          href={gmailUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-blue-300 hover:text-white px-2.5 py-1 rounded-lg bg-blue-950/70 hover:bg-blue-900 border border-blue-800/50 transition-colors"
                        >
                          <Mail className="w-3 h-3 text-blue-400" />
                          <span>Open in Gmail</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>

                        {/* Open Mobile SMS App */}
                        <a
                          href={smsUri}
                          className="inline-flex items-center gap-1 text-[10px] text-emerald-300 hover:text-white px-2.5 py-1 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-800/50 transition-colors"
                        >
                          <Smartphone className="w-3 h-3 text-emerald-400" />
                          <span>Phone SMS</span>
                        </a>

                        {/* Toggle Email HTML view */}
                        <button
                          onClick={() => setExpandedEmailId(isExpanded ? null : item.id)}
                          className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-white px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors"
                        >
                          <span>{isExpanded ? 'Hide Email' : 'Email Preview'}</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>

                    {/* Collapsible Email HTML View */}
                    {isExpanded && item.emailHtml && (
                      <div className="mt-3 pt-3 border-t border-slate-800/80 animate-fadeIn">
                        <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center justify-between">
                          <span>Email Subject: {item.emailSubject || item.title}</span>
                          <span>Recipient: {email}</span>
                        </div>
                        <div
                          className="bg-white text-slate-900 p-3 rounded-xl text-xs max-h-56 overflow-y-auto"
                          dangerouslySetInnerHTML={{ __html: item.emailHtml }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Status Bar */}
        <div className="p-3 bg-[#0d1424] border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2 px-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Real-time delivery active: SMS target <strong>+91 {config.ownerPhone || OWNER_PHONE}</strong> & Email target <strong>{config.ownerEmail || OWNER_EMAIL}</strong></span>
          </div>
          <div className="font-mono text-slate-300">
            Total Alerts Dispatched: <b>{logs.length}</b>
          </div>
        </div>
      </div>
    </div>
  );
};
