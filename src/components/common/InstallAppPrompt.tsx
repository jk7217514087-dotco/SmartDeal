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
  Monitor,
  Copy,
  Check,
  ExternalLink,
  ArrowRight
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

// 1. Direct download for Windows Laptop / PC Standalone Executable (.exe)
export const downloadWindowsAppExe = () => {
  try {
    const link = document.createElement('a');
    link.href = '/SmartDeal-Windows-App.exe';
    link.setAttribute('download', 'SmartDeal-Windows-App.exe');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (err) {
    console.error('Failed to download exe:', err);
    return false;
  }
};

// 2. Direct download for Windows Laptop 1-Click Desktop Setup Script (.bat)
export const downloadWindowsBatchSetup = () => {
  try {
    const link = document.createElement('a');
    link.href = '/SmartDeal-Windows-Setup.bat';
    link.setAttribute('download', 'SmartDeal-Windows-Setup.bat');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (err) {
    console.error('Failed to download bat setup:', err);
    return false;
  }
};

// 3. Direct download for Laptop / PC Windows Internet Shortcut (.url)
export const downloadDesktopShortcut = () => {
  try {
    const link = document.createElement('a');
    link.href = '/SmartDeal.url';
    link.setAttribute('download', 'SmartDeal.url');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (err) {
    console.error('Failed to download shortcut:', err);
    return false;
  }
};

// 2. Direct download for Mobile / Phone standalone launcher (.html)
export const downloadMobileAppLauncher = () => {
  try {
    const launcherHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>SmartDeal PRO App</title>
  <link rel="icon" type="image/png" href="https://smart-deal-m4ca.vercel.app/smartdeal_app_icon.png">
  <meta name="theme-color" content="#0b1a30">
  <meta http-equiv="refresh" content="1; url=https://smart-deal-m4ca.vercel.app/">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0b1a30;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
      text-align: center;
    }
    .card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 28px;
      padding: 32px 24px;
      max-width: 360px;
      width: 100%;
      box-shadow: 0 20px 50px rgba(0,0,0,0.6);
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .icon {
      width: 96px;
      height: 96px;
      border-radius: 24px;
      box-shadow: 0 12px 30px rgba(99,102,241,0.4);
      margin-bottom: 20px;
    }
    h1 {
      font-size: 24px;
      font-weight: 900;
      background: linear-gradient(135deg, #fff 30%, #818cf8 70%, #c084fc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 8px;
    }
    p {
      font-size: 13px;
      color: #94a3b8;
      margin-bottom: 24px;
      line-height: 1.5;
    }
    .btn {
      width: 100%;
      padding: 14px;
      border-radius: 16px;
      background: linear-gradient(135deg, #6366f1, #a855f7);
      color: #fff;
      font-weight: 800;
      font-size: 14px;
      text-decoration: none;
      display: block;
      box-shadow: 0 8px 24px rgba(99,102,241,0.35);
    }
    .note {
      font-size: 11px;
      color: #64748b;
      margin-top: 16px;
    }
  </style>
</head>
<body>
  <div class="card">
    <img src="https://smart-deal-m4ca.vercel.app/smartdeal_app_icon.png" class="icon" alt="SmartDeal PRO">
    <h1>SmartDeal PRO</h1>
    <p>Opening live shopping engine, verified coupons & best price comparison...</p>
    <a href="https://smart-deal-m4ca.vercel.app/" class="btn">🚀 Open SmartDeal App</a>
    <div class="note">Official Progressive Web Application</div>
  </div>
  <script>
    setTimeout(function() {
      window.location.replace("https://smart-deal-m4ca.vercel.app/");
    }, 600);
  </script>
</body>
</html>`;
    const blob = new Blob([launcherHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'SmartDeal-App.html');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error('Failed to download mobile launcher:', err);
    return false;
  }
};

// 3. Unified Direct Download Trigger (Works across Phone, Laptop & Desktop)
export const triggerDirectAppDownload = (deferredPrompt?: BeforeInstallPromptEvent | null) => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isMobile = /android|iphone|ipad|ipod|mobile/.test(userAgent);

  // Prompt native install if available (Chromium / Edge / Android Chrome)
  if (deferredPrompt) {
    try {
      deferredPrompt.prompt();
    } catch (e) {
      console.warn('Native install prompt error:', e);
    }
  }

  // Direct download appropriate launcher file
  if (isMobile) {
    downloadMobileAppLauncher();
  } else {
    // For Laptop / Windows: direct download the native Windows Executable!
    downloadWindowsAppExe();
  }

  return true;
};

export const InstallAppPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(
    () => (window as unknown as { __smartdeal_deferred_prompt?: BeforeInstallPromptEvent }).__smartdeal_deferred_prompt || null
  );
  const [showBanner, setShowBanner] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showDownloadToast, setShowDownloadToast] = useState(false);
  const [downloadToastMsg, setDownloadToastMsg] = useState('');
  const [isInstalled, setIsInstalled] = useState(false);
  const [activeTab, setActiveTab] = useState<'mobile' | 'desktop'>('mobile');
  const [isIosDevice, setIsIosDevice] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showDesktopGuide, setShowDesktopGuide] = useState(false);

  // Browser detection
  const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent.toLowerCase() : '';
  const isAndroid = /android/.test(userAgent);
  const isEdge = /edg\//.test(userAgent);
  const isChrome = !isEdge && /chrome|crios/.test(userAgent) && !/samsung|vivo|oppo|miui/.test(userAgent);
  const isVivoOrNativeBrowser = isAndroid && !isChrome;

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
    const isMobile = /android|iphone|ipad|ipod|mobile/.test(userAgent);
    const isIos = /iphone|ipad|ipod/.test(userAgent);
    setIsIosDevice(isIos);
    setActiveTab(isMobile ? 'mobile' : 'desktop');

    // Show banner on mobile/desktop unless already running as standalone app
    setShowBanner(true);

    // Pick up early prompt if already captured in <head>
    const earlyPrompt = (window as unknown as { __smartdeal_deferred_prompt?: BeforeInstallPromptEvent }).__smartdeal_deferred_prompt;
    if (earlyPrompt) {
      setDeferredPrompt(earlyPrompt);
    }

    const handlePromptReady = (e: Event) => {
      const customEvt = e as CustomEvent;
      if (customEvt.detail) {
        setDeferredPrompt(customEvt.detail);
      }
    };
    window.addEventListener('smartdeal-prompt-ready', handlePromptReady);

    // Listen for beforeinstallprompt event (Android / Chromium / Edge / Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      (window as unknown as { __smartdeal_deferred_prompt?: BeforeInstallPromptEvent }).__smartdeal_deferred_prompt = e as BeforeInstallPromptEvent;
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
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
      window.removeEventListener('smartdeal-prompt-ready', handlePromptReady);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('trigger-app-install', handleCustomTrigger);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [userAgent]);

  const handleAppDownloadClick = () => {
    // Open the download/install modal immediately so the user sees the primary 1-click install button!
    setShowDownloadModal(true);
    setShowBanner(false);
  };

  const handleMobileInstallClick = async () => {
    // If on Android but in Vivo/Native browser, Vivo blocks PWA installs:
    // Open in Google Chrome where WebAPK phone screen install is 100% supported!
    if (isVivoOrNativeBrowser) {
      openInChromeIntent();
      return;
    }

    // In Chrome (or browser with deferredPrompt):
    const promptEvent = deferredPrompt || (window as unknown as { __smartdeal_deferred_prompt?: BeforeInstallPromptEvent }).__smartdeal_deferred_prompt;
    if (promptEvent) {
      try {
        promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        if (choice.outcome === 'accepted') {
          setIsInstalled(true);
          setShowBanner(false);
          setShowDownloadModal(false);
          setDeferredPrompt(null);
        }
      } catch (err) {
        console.warn('Install prompt error:', err);
      }
    } else {
      // In Chrome if prompt not fired yet, guide user to 3 dots -> Install app
      setDownloadToastMsg('Chrome ke upar 3 dots (⋮) par tap karke "Install app" select karein!');
      setShowDownloadToast(true);
      setTimeout(() => setShowDownloadToast(false), 5000);
    }
  };

  const handleDesktopInstallClick = async () => {
    const promptEvent = deferredPrompt || (window as unknown as { __smartdeal_deferred_prompt?: BeforeInstallPromptEvent }).__smartdeal_deferred_prompt;
    if (promptEvent) {
      try {
        promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        if (choice.outcome === 'accepted') {
          setIsInstalled(true);
          setShowBanner(false);
          setShowDownloadModal(false);
          setDeferredPrompt(null);
        }
      } catch (err) {
        console.warn('Desktop install prompt error:', err);
        setShowDesktopGuide(true);
      }
    } else {
      // If deferredPrompt is not ready in Edge/Chrome, show highlighted address bar guide
      setShowDesktopGuide(true);
      setDownloadToastMsg('Browser ke URL bar me upar right side [ 🖥️ Install ] icon par click karein!');
      setShowDownloadToast(true);
      setTimeout(() => setShowDownloadToast(false), 5000);
    }
  };

  const triggerPwaInstall = async () => {
    if (activeTab === 'mobile') {
      handleMobileInstallClick();
    } else {
      handleDesktopInstallClick();
    }
  };

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText('https://smart-deal-m4ca.vercel.app');
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      setIsCopied(false);
    }
  };

  const openInChromeIntent = () => {
    // Android Intent to open current site in Google Chrome
    window.location.href =
      'intent://smart-deal-m4ca.vercel.app/#Intent;scheme=https;package=com.android.chrome;end';
  };

  const handleDismiss = () => {
    setShowBanner(false);
  };

  if (isInstalled) {
    return null;
  }

  return (
    <>
      {/* Direct Download Floating Status Toast */}
      {showDownloadToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999999] bg-slate-900/95 dark:bg-slate-950/95 text-white border border-emerald-500/60 shadow-2xl rounded-2xl px-4 py-3 flex items-center gap-3 backdrop-blur-md animate-slideDown max-w-sm w-[92%] sm:w-auto">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <Download className="w-4 h-4 text-emerald-400 animate-bounce" />
          </div>
          <div className="text-xs flex-1">
            <div className="font-extrabold text-emerald-400 flex items-center gap-1.5">
              <span>Direct Download Started!</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <div className="text-slate-300 text-[11px] mt-0.5">
              {downloadToastMsg || (activeTab === 'desktop'
                ? 'Windows App (SmartDeal-Windows-App.exe) aapke Downloads folder me direct save ho rahi hai.'
                : 'SmartDeal App file Downloads folder me direct save ho rahi hai.')}
            </div>
          </div>
          <button
            onClick={() => setShowDownloadToast(false)}
            className="p-1 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Floating Bottom App Install Banner (Mobile & Desktop) */}
      {showBanner && !showDownloadModal && (
        <div className="fixed bottom-16 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-slideUp">
          <div className="bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md text-white p-3 sm:p-4 rounded-2xl shadow-2xl border border-brand-500/30 flex items-center gap-3">
            <div className="w-12 h-12 shrink-0 rounded-2xl overflow-hidden shadow-lg shadow-brand-500/40 ring-2 ring-brand-400/30 bg-[#00061e] flex items-center justify-center">
              <img src="/smartdeal_app_icon.png" alt="SmartDeal App" className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black text-white">SmartDeal App</span>
                <span className="px-1.5 py-0.5 text-[9px] font-black bg-gradient-to-r from-brand-500 to-indigo-600 text-white rounded-md shadow-xs">OFFICIAL</span>
              </div>
              <p className="text-[11px] text-slate-300 truncate">
                Phone Screen par app ki tarah lagayein
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleAppDownloadClick}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-brand-600/30 active:scale-95 transition-all cursor-pointer"
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
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setShowDownloadModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header with App Branding and New Rainbow Squircle Icon */}
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-xl shadow-brand-500/30 ring-2 ring-brand-500/50 shrink-0 bg-[#00061e] flex items-center justify-center">
                <img src="/smartdeal_app_icon.png" alt="SmartDeal App" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">SmartDeal Official App</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    Standalone App
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
                <span>📱 Phone (Vivo / Android)</span>
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
                <span>💻 Laptop / Windows</span>
              </button>
            </div>

            {/* TAB 1: PHONE (ANDROID / VIVO / IPHONE) */}
            {activeTab === 'mobile' && (
              <div className="space-y-4">
                {/* 1-Click Phone Screen Install Button (Circled in Red by User) */}
                {isVivoOrNativeBrowser ? (
                  <button
                    onClick={openInChromeIntent}
                    className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-brand-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-blue-500/30 active:scale-95 transition-all cursor-pointer ring-2 ring-blue-400/50"
                  >
                    <ExternalLink className="w-5 h-5 text-amber-300 animate-pulse" />
                    <span>🌐 Google Chrome me kholein (App Install karein)</span>
                  </button>
                ) : (
                  <button
                    onClick={handleMobileInstallClick}
                    className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-indigo-500 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-brand-500/30 active:scale-95 transition-all cursor-pointer ring-2 ring-indigo-400/40"
                  >
                    <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                    <span>✨ 1-Click Phone Screen par Install karein</span>
                  </button>
                )}

                {/* Android / Vivo Notice */}
                {isVivoOrNativeBrowser && (
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs text-center font-semibold">
                    💡 Vivo / Phone browser me app install support nahi hota. Upar blue button dabayein — Chrome me bina kisi download error ke 100% app install ho jayega!
                  </div>
                )}

                {/* Android / Vivo Step-by-Step Instructions */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                      <span>🤖 Android / Vivo Phone Screen par App kaise lagayein:</span>
                    </span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                      100% Working
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </div>
                      <div className="text-slate-800 dark:text-slate-200">
                        Is website ko <strong>Google Chrome</strong> me open karein.
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </div>
                      <div className="text-slate-800 dark:text-slate-200">
                        Chrome ke upar right side <strong>3 dots (⋮)</strong> menu par tap karein.
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                        3
                      </div>
                      <div className="text-slate-800 dark:text-slate-200">
                        Menu me <strong className="text-emerald-700 dark:text-emerald-400 font-black">"Install app"</strong> (ya <strong className="text-emerald-700 dark:text-emerald-400 font-black">"Add to Home screen"</strong>) par click karein.
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                        4
                      </div>
                      <div className="text-slate-800 dark:text-slate-200">
                        <strong>"Install"</strong> dabate hi bina kisi file error ke SmartDeal ka colorful logo aapki phone screen par aa jayega!
                      </div>
                    </div>
                  </div>
                </div>

                {/* Open in Chrome & Copy Link Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <button
                    onClick={openInChromeIntent}
                    className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in Google Chrome</span>
                  </button>

                  <button
                    onClick={handleCopyLink}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Link Copied!' : 'Copy Website Link'}</span>
                  </button>
                </div>

                {/* iPhone (iOS) Steps Card */}
                {isIosDevice && (
                  <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/60 space-y-2">
                    <span className="font-extrabold text-xs text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                      <Share className="w-3.5 h-3.5 text-blue-500" />
                      <span>🍎 iPhone / iPad (Safari) ke liye:</span>
                    </span>
                    <p className="text-xs text-indigo-800 dark:text-indigo-300 leading-relaxed">
                      Safari me niche <strong>Share (📤)</strong> icon dabayein &rarr; Scroll karke <strong>"Add to Home Screen"</strong> select karein.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: LAPTOP / PC (WINDOWS & MAC) */}
            {activeTab === 'desktop' && (
              <div className="space-y-4">
                {/* 1-Click Laptop Screen Install Button (Circled in Red by User) - ALWAYS VISIBLE */}
                <button
                  onClick={handleDesktopInstallClick}
                  className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-indigo-500 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-brand-500/30 active:scale-95 transition-all cursor-pointer ring-2 ring-indigo-400/40"
                >
                  <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                  <span>1-Click Laptop Window par Install karein</span>
                </button>

                {/* Direct Browser Window Install Guide for Edge / Chrome */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  showDesktopGuide
                    ? 'bg-amber-500/15 border-amber-400/60 ring-2 ring-amber-400/30 animate-pulse'
                    : 'bg-blue-500/10 border-blue-500/30'
                }`}>
                  <div className="flex items-center gap-2 font-extrabold text-xs text-blue-300 mb-2">
                    <Monitor className="w-4 h-4 text-blue-400" />
                    <span>Microsoft Edge / Chrome se Direct Windows Install:</span>
                  </div>
                  <div className="space-y-2.5 text-xs text-slate-300">
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
                      <span>Upar browser ke URL (address) bar me right side <strong>Install Icon (🖥️ / ➕)</strong> par click karein.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
                      <span>Ya top-right <strong>3 dots (...) &rarr; Apps &rarr; Install SmartDeal</strong> par click karein.</span>
                    </div>
                  </div>
                </div>

                {/* Windows Desktop Setup (.exe) Installer */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-white flex items-center gap-1.5">
                      <Download className="w-4 h-4 text-emerald-400" />
                      <span>Windows Setup Installer (.exe):</span>
                    </span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/40">
                      Desktop Shortcut
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Niche button se download karein aur Edge Downloads bar me <strong>"Open file"</strong> dabayein — SmartDeal aapke Desktop par install ho jayegi.
                  </p>
                  <button
                    onClick={() => {
                      downloadWindowsAppExe();
                      setDownloadToastMsg('SmartDeal-Windows-App.exe download ho gayi! Downloads me "Open file" dabayein.');
                      setShowDownloadToast(true);
                      setTimeout(() => setShowDownloadToast(false), 5000);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Download Windows Installer (SmartDeal-Windows-App.exe)</span>
                  </button>
                </div>

                {/* 1-Click Desktop Shortcut File Download */}
                <div className="p-3.5 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/60 flex items-center justify-between gap-3">
                  <div className="text-xs">
                    <span className="font-extrabold text-brand-900 dark:text-brand-200 block">
                      Direct Windows Desktop Shortcut (.url)
                    </span>
                    <span className="text-[11px] text-brand-700 dark:text-brand-300">
                      Desktop par drag & drop karne ke liye shortcut
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      downloadDesktopShortcut();
                      setDownloadToastMsg('SmartDeal.url shortcut download ho gaya!');
                      setShowDownloadToast(true);
                      setTimeout(() => setShowDownloadToast(false), 4500);
                    }}
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
