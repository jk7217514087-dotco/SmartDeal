import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Laptop,
  Download,
  X,
  Share,
  CheckCircle,
  Sparkles,
  ShieldCheck,
  ArrowDownToLine,
  RefreshCw,
  ExternalLink,
  Monitor,
  Check
} from 'lucide-react';

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

export const downloadDesktopShortcut = () => {
  try {
    const shortcutContent = `[InternetShortcut]\nURL=https://smart-deal-m4ca.vercel.app/\nIconIndex=0\nIconFile=https://smart-deal-m4ca.vercel.app/favicon.png\n`;
    const blob = new Blob([shortcutContent], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'SmartDeal.url');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error('Failed to download shortcut:', err);
    return false;
  }
};

export const InstallAppPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [activeTab, setActiveTab] = useState<'mobile' | 'desktop'>('mobile');
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

    // Detect device type
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isMobile = /android|iphone|ipad|ipod|mobile/.test(userAgent);
    const isIos = /iphone|ipad|ipod/.test(userAgent);
    setIsIosDevice(isIos);
    setActiveTab(isMobile ? 'mobile' : 'desktop');

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
    // If native 1-click install prompt is supported by browser, trigger it directly!
    if (deferredPrompt) {
      triggerPwaInstall();
      return;
    }
    // Otherwise open the install modal with tailored instructions
    setShowDownloadModal(true);
    setShowBanner(false);
  };

  const triggerPwaInstall = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsInstalled(true);
          setShowBanner(false);
          setShowDownloadModal(false);
          setDeferredPrompt(null);
        }
      } catch (err) {
        console.warn('Install prompt error:', err);
        setShowDownloadModal(true);
      }
    } else {
      setShowDownloadModal(true);
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
            <div className="w-11 h-11 shrink-0 rounded-xl overflow-hidden shadow-md shadow-brand-500/40 ring-1 ring-white/20 bg-[#00061e] flex items-center justify-center">
              <img src="/smartdeal_app_icon.png" alt="SmartDeal App" className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black text-white">Install SmartDeal App</span>
                <span className="px-1.5 py-0.5 text-[9px] font-black bg-brand-500 text-white rounded">APP</span>
              </div>
              <p className="text-[11px] text-slate-300 truncate">
                Add to Home Screen or Desktop window!
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleAppDownloadClick}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-brand-600/30 active:scale-95 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install</span>
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
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setShowDownloadModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header with App Branding */}
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg shadow-brand-500/30 ring-2 ring-brand-500/40 shrink-0 bg-[#00061e] flex items-center justify-center">
                <img src="/smartdeal_app_icon.png" alt="SmartDeal App" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">SmartDeal Official App</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    Standalone
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Phone Screen ya Laptop Window par dusre apps ki tarah chalayein
                </p>
              </div>
            </div>

            {/* Device Switcher Tabs: Phone vs Laptop */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl mb-5">
              <button
                type="button"
                onClick={() => setActiveTab('mobile')}
                className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'mobile'
                    ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>📱 Phone (Mobile)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('desktop')}
                className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'desktop'
                    ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Laptop className="w-4 h-4" />
                <span>💻 Laptop / PC</span>
              </button>
            </div>

            {/* TAB 1: PHONE (ANDROID & IPHONE) */}
            {activeTab === 'mobile' && (
              <div className="space-y-4">
                {/* 1-Click PWA Install Button if available */}
                {deferredPrompt ? (
                  <button
                    onClick={triggerPwaInstall}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-indigo-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25 active:scale-95 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>1-Click Add to Phone Screen</span>
                  </button>
                ) : null}

                {/* Android Steps Card */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>🤖 Android Screen par Add karne ka tareeqa:</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      Recommended
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-brand-600 text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </div>
                      <div className="text-slate-700 dark:text-slate-300">
                        Browser me upar right side <strong>3 dots (⋮)</strong> menu par tap karein.
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-brand-600 text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </div>
                      <div className="text-slate-700 dark:text-slate-300">
                        Menu me <strong className="text-brand-600 dark:text-brand-400">"Install app"</strong> ya <strong className="text-brand-600 dark:text-brand-400">"Add to Home screen"</strong> par click karein.
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                        3
                      </div>
                      <div className="text-slate-700 dark:text-slate-300">
                        Phone home screen par SmartDeal icon aa jayega aur dusre apps ki tarah full-screen khulega!
                      </div>
                    </div>
                  </div>
                </div>

                {/* iPhone (iOS) Steps Card */}
                <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/60 space-y-2">
                  <span className="font-extrabold text-xs text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                    <Share className="w-3.5 h-3.5 text-blue-500" />
                    <span>🍎 iPhone / iPad (Safari) ke liye:</span>
                  </span>
                  <p className="text-xs text-indigo-800 dark:text-indigo-300 leading-relaxed">
                    Safari me niche <strong>Share (📤)</strong> icon dabayein &rarr; Scroll karke <strong>"Add to Home Screen"</strong> select karein.
                  </p>
                </div>

                {/* Direct APK Download fallback */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      downloadSmartDealApk();
                      setIsDownloaded(true);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Direct APK Package (SmartDeal.apk)</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: LAPTOP / PC (WINDOWS & MAC) */}
            {activeTab === 'desktop' && (
              <div className="space-y-4">
                {/* 1-Click Desktop Install Button if deferredPrompt available */}
                {deferredPrompt ? (
                  <button
                    onClick={triggerPwaInstall}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-indigo-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25 active:scale-95 transition-all cursor-pointer"
                  >
                    <Monitor className="w-4 h-4" />
                    <span>Install SmartDeal on Laptop / PC Window</span>
                  </button>
                ) : null}

                {/* Windows/Mac Browser Steps Card */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Monitor className="w-4 h-4 text-brand-500" />
                      <span>Chrome / Edge me Laptop App Install karein:</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      Standalone Window
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-brand-600 text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </div>
                      <div className="text-slate-700 dark:text-slate-300">
                        Browser ke URL / Address bar me upar right side <strong>Install Icon (🖥️ ya ⬇️)</strong> par click karein.
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-brand-600 text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </div>
                      <div className="text-slate-700 dark:text-slate-300">
                        Ya browser ke <strong>3 dots (⋮)</strong> menu &rarr; <strong>"Cast, save and share" / "Apps"</strong> &rarr; <strong>"Install SmartDeal"</strong> par click karein.
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                        3
                      </div>
                      <div className="text-slate-700 dark:text-slate-300">
                        SmartDeal aapke Windows Desktop, Start Menu aur Taskbar me save ho jayegi aur ek alag desktop window me open hogi!
                      </div>
                    </div>
                  </div>
                </div>

                {/* 1-Click Desktop Shortcut File Download */}
                <div className="p-3.5 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/60 flex items-center justify-between gap-3">
                  <div className="text-xs">
                    <span className="font-extrabold text-brand-900 dark:text-brand-200 block">
                      1-Click Windows Desktop Shortcut
                    </span>
                    <span className="text-[11px] text-brand-700 dark:text-brand-300">
                      Desktop par icon lane ke liye shortcut file download karein
                    </span>
                  </div>
                  <button
                    onClick={() => downloadDesktopShortcut()}
                    className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Save Shortcut</span>
                  </button>
                </div>
              </div>
            )}

            {/* Verified Safe Badge */}
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>100% Secure • Official Progressive Web Application</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
