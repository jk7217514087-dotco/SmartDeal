import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Mail,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Copy,
  Check,
  X,
  BellRing,
  Send
} from 'lucide-react';
import { notificationService, OwnerNotification, OWNER_PHONE, OWNER_EMAIL } from '../../services/notificationService';

interface Props {
  onOpenCenter?: () => void;
}

export const LiveSmsToast: React.FC<Props> = ({ onOpenCenter }) => {
  const [activeSms, setActiveSms] = useState<OwnerNotification | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    const unsub = notificationService.subscribeSms((notif: OwnerNotification) => {
      setActiveSms(notif);
      setMinimized(false);
      setIsCopied(false);

      // Auto-hide after 12s if not interacted
      const timer = setTimeout(() => {
        setActiveSms(prev => (prev?.id === notif.id ? null : prev));
      }, 12000);

      return () => clearTimeout(timer);
    });

    return unsub;
  }, []);

  if (!activeSms) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSms.smsContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const isSuccess = activeSms.type === 'PURCHASE_SUCCESS';
  const isNotBought = activeSms.type === 'PURCHASE_NOT_BOUGHT';
  const isClick = activeSms.type === 'BUY_CLICK';

  const badgeColor = isSuccess
    ? 'bg-emerald-500 text-slate-950 font-black'
    : isNotBought
    ? 'bg-rose-500 text-white font-black'
    : 'bg-blue-500 text-white font-black';

  const borderColor = isSuccess
    ? 'border-emerald-500/50 shadow-emerald-500/20'
    : isNotBought
    ? 'border-rose-500/50 shadow-rose-500/20'
    : 'border-blue-500/50 shadow-blue-500/20';

  const phone = activeSms.phoneRecipient || OWNER_PHONE;
  const email = activeSms.emailRecipient || OWNER_EMAIL;
  const gmailUrl = activeSms.gmailComposeUrl || `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(activeSms.emailSubject || activeSms.title)}&body=${encodeURIComponent(activeSms.smsContent)}`;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 max-w-sm sm:max-w-md w-[calc(100vw-2rem)] transition-all animate-bounce-in">
      <div className={`bg-[#0b1220]/95 backdrop-blur-xl border ${borderColor} rounded-3xl p-4 shadow-2xl text-white space-y-3 relative overflow-hidden`}>
        {/* Glow Accent */}
        <div className={`absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl opacity-30 ${isSuccess ? 'bg-emerald-500' : isNotBought ? 'bg-rose-500' : 'bg-blue-500'}`} />

        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-xl ${isSuccess ? 'bg-emerald-500/20 text-emerald-400' : isNotBought ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400'}`}>
              <Smartphone className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-tight text-white">
                  Alert Dispatched
                </span>
                <span className={`text-[10px] px-2 py-0.2 rounded-full ${badgeColor}`}>
                  {isSuccess ? '✅ BOUGHT' : isNotBought ? '❌ NOT BOUGHT' : '🚨 STORE VISITED'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                <span>📱 <b className="text-slate-200">+91 {phone}</b></span>
                <span>•</span>
                <span>📧 <b className="text-slate-200">{email}</b></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setMinimized(!minimized)}
              className="text-[10px] text-slate-400 hover:text-white px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              {minimized ? 'Expand' : 'Minimize'}
            </button>
            <button
              onClick={() => setActiveSms(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Box */}
        {!minimized && (
          <div className="space-y-2.5">
            <div className="bg-[#101b30] border border-slate-800 rounded-2xl p-3 text-[11px] font-mono leading-relaxed text-slate-200 whitespace-pre-wrap max-h-44 overflow-y-auto select-all shadow-inner">
              {activeSms.smsContent}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <span className="text-emerald-400 font-bold">● SMS & Email Dispatched</span>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold transition-all active:scale-95"
                >
                  {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{isCopied ? 'Copied' : 'Copy SMS'}</span>
                </button>

                <a
                  href={activeSms.smsDirectUri || `sms:+91${phone}?body=${encodeURIComponent(activeSms.smsContent)}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-[10px] font-bold border border-emerald-800/50 transition-all active:scale-95"
                >
                  <Smartphone className="w-3 h-3 text-emerald-400" />
                  <span>Send to Phone SMS</span>
                </a>

                <a
                  href={gmailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-blue-200 text-[10px] font-bold border border-blue-700/50 transition-all active:scale-95"
                >
                  <Mail className="w-3 h-3 text-blue-300" />
                  <span>Open Gmail</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>

                {onOpenCenter && (
                  <button
                    onClick={onOpenCenter}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95"
                  >
                    <span>Alert Center</span>
                  </button>
                )}
              </div>
            </div>

            <div className="pt-1 border-t border-slate-800/60 text-[10px] text-amber-300/90 flex items-center justify-between">
              <span>📲 Handset (+91 {phone}): Connect Fast2SMS API Key in Settings for live cellular SMS.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
