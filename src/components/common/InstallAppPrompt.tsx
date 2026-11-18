import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Share, PlusSquare, CheckCircle, Sparkles, ShieldCheck, ArrowDownToLine, RefreshCw } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const downloadSmartDealApk = () => {
  try {
    const link = document.createElement('a');
    link.href = '/SmartDeal.apk';
    link.setAttribute('download', 'SmartDeal.apk');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (err) {
    console.error('Failed to trigger APK download:', err);
    window.open('/SmartDeal.apk', '_blank');
    return false;
  }
};

export const InstallAppPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIosDevice, setIsIosDevice] = useState(false);

  useEffect(() => {
    // Check if app is already running in standalone/installed mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(userAgent);
    setIsIosDevice(isIos);

    // Check if dismissed recently (within 24 hours)
    const dismissedAt = localStorage.getItem('smartdeal_pwa_dismissed');
    const isRecentlyDismissed = dismissedAt && Date.now() - parseInt(dismissedAt, 10) < 86400000;

    // Listen for beforeinstallprompt event (Android / Chromium / Edge / Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!isRecentlyDismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for custom trigger from navbar / buttons
    const handleCustomTrigger = () => {
      handleAppDownloadClick();
    };
    window.addEventListener('trigger-app-install', handleCustomTrigger);

    // App installed event listener
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowBanner(false);
      setShowDownloadModal(false);
      setDeferredPrompt(null);
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('trigger-app-install', handleCustomTrigger);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleAppDownloadClick = () => {
    // 1. Immediately initiate download of SmartDeal.apk
    downloadSmartDealApk();
    setIsDownloaded(true);
    // 2. Open the comprehensive Download & Install modal
    setShowDownloadModal(true);
    setShowBanner(false);
  };

  const triggerPwaInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setShowBanner(false);
        setShowDownloadModal(false);
        setDeferredPrompt(null);
      }
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('smartdeal_pwa_dismissed', Date.now().toString());
  };

  if (isInstalled) {
    return null;
  }

  return (
    <>
      {/* Floating Bottom App Install Banner (Mobile & Desktop) */}
      {showBanner && !showDownloadModal && (
        <div className="fixed bottom-16 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-slideUp">
          <div className="bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-brand-500/30 flex items-center gap-3">
            <div className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-brand-500/40">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black text-white">Download SmartDeal App</span>
                <span className="px-1.5 py-0.5 text-[9px] font-black bg-brand-500 text-white rounded">APK</span>
              </div>
              <p className="text-[11px] text-slate-300 truncate">
                Faster shopping, instant alerts & offline deals!
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleAppDownloadClick}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-brand-600/30 active:scale-95 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
              <button
                onClick={handleDismiss}
                className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive SmartDeal App Download & Installation Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setShowDownloadModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/30 shrink-0">
                <Smartphone className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">SmartDeal App</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    v2.1.0 APK
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Official Mobile App Package</p>
              </div>
            </div>

            {/* Download Status Notification */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 mb-4 flex items-center justify-between gap-2 animate-fadeIn">
              <div className="flex items-center gap-2.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                <div>
                  <span>Download Started!</span>
                  <p className="text-[10px] font-normal text-emerald-700 dark:text-emerald-400">
                    File <strong className="font-bold">SmartDeal.apk</strong> is downloading.
                  </p>
                </div>
              </div>
              <button
                onClick={downloadSmartDealApk}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm cursor-pointer shrink-0"
                title="Download Again"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Re-Download</span>
              </button>
            </div>

            {/* Download Actions */}
            <div className="space-y-2.5 mb-5">
              <button
                onClick={downloadSmartDealApk}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <ArrowDownToLine className="w-4 h-4" />
                <span>Download SmartDeal.apk (Direct File)</span>
              </button>

              {deferredPrompt && (
                <button
                  onClick={triggerPwaInstall}
                  className="w-full py-2.5 px-4 rounded-2xl border border-brand-300 dark:border-brand-700 hover:bg-brand-50 dark:hover:bg-brand-950/50 text-brand-700 dark:text-brand-300 font-extrabold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Instant Install to Home Screen</span>
                </button>
              )}
            </div>

            {/* Android Installation Instructions */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="font-extrabold text-slate-900 dark:text-white block text-xs">
                How to Install SmartDeal APK on Android:
              </span>

              <div className="space-y-2">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60">
                  <div className="w-5 h-5 rounded-full bg-brand-600 text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300">
                    Pull down notifications or open your browser's <strong className="text-slate-900 dark:text-white">Downloads</strong>, then tap <strong className="text-brand-600 dark:text-brand-400">SmartDeal.apk</strong>.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60">
                  <div className="w-5 h-5 rounded-full bg-brand-600 text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300">
                    If prompted with <em>"Install unknown apps"</em>, tap <strong>Settings</strong> and switch on <strong>Allow from this source</strong>.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300">
                    Tap <strong className="text-emerald-600 dark:text-emerald-400">Install</strong>. Launch the app to enjoy instant deals & price comparison!
                  </div>
                </div>
              </div>

              {/* iOS Alternative */}
              {isIosDevice && (
                <div className="mt-3 p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/60 text-[11px] text-indigo-900 dark:text-indigo-200">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <Share className="w-3.5 h-3.5 text-blue-500" />
                    <span>For iPhone / iPad (iOS):</span>
                  </div>
                  <p>
                    Tap the <strong>Share</strong> button at bottom of Safari &rarr; Tap <strong>"Add to Home Screen"</strong>.
                  </p>
                </div>
              )}
            </div>

            {/* Verified Safe Badge */}
            <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>100% Verified Safe & Virus-Free Official Package</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
