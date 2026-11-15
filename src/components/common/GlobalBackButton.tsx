import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Home, ChevronRight } from 'lucide-react';

export const GlobalBackButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hasScrolled, setHasScrolled] = useState(false);

  // Don't render on the homepage
  const isHome = location.pathname === '/' || location.pathname === '';

  // Track scroll position to show floating back button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut: Alt + LeftArrow or Backspace outside inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isHome) return;
      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        handleBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHome]);

  if (isHome) return null;

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  // Human-readable page title based on path
  const getPageTitle = (path: string): string => {
    const clean = path.replace(/^\//, '').split('/')[0];
    switch (clean) {
      case 'search': return 'Search Results';
      case 'categories': return 'All Categories';
      case 'category': return 'Category View';
      case 'product': return 'Product Details';
      case 'compare': return 'Price Comparison';
      case 'product-vs-product': return 'Compare Side-by-Side';
      case 'deals': return "Today's Deals";
      case 'coupons': return 'Coupons & Vouchers';
      case 'price-tracker': return 'Price Tracker';
      case 'marketplaces': return 'Marketplaces';
      case 'wallet': return 'Cashback Wallet';
      case 'smartcoins': return 'SmartCoins Rewards';
      case 'wishlist': return 'My Wishlist';
      case 'price-alerts': return 'Price Alerts';
      case 'notifications': return 'Notifications';
      case 'orders': return 'My Orders';
      case 'cart': return 'Shopping Cart';
      case 'checkout': return 'Checkout';
      case 'profile': return 'User Account';
      case 'account': return 'User Account';
      case 'admin': return 'Admin Dashboard';
      case 'become-seller': return 'Merchant Center';
      case 'seller': return 'Seller Dashboard';
      case 'ai-assistant': return 'Smart Shopping AI';
      case 'external-tracking': return 'Affiliate Partnership Flow';
      case 'flowchart': return 'Platform Architecture';
      case 'support': return 'Help & Support';
      case 'about': return 'About SmartDeal';
      case 'contact': return 'Contact Us';
      case 'terms': return 'Terms of Service';
      case 'privacy': return 'Privacy Policy';
      default: return clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : 'Page';
    }
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <>
      {/* 1. TOP SUB-HEADER BAR: Visible on every non-home page right under Navbar */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 sticky top-[69px] z-30 transition-all">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Primary Back Button */}
            <button
              onClick={handleBack}
              className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-600 hover:text-white dark:hover:bg-brand-600 dark:hover:text-white text-slate-800 dark:text-slate-200 font-extrabold text-xs shadow-xs transition-all cursor-pointer border border-slate-200 dark:border-slate-700/60 active:scale-95"
              title="Click or press Alt+Left to go back"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>

            {/* Breadcrumb Path */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Link
                to="/"
                className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors"
                title="Go to Home"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
              <span className="text-slate-800 dark:text-slate-200 font-bold truncate max-w-xs sm:max-w-md">
                {pageTitle}
              </span>
            </div>
          </div>

          {/* Quick Home shortcut */}
          <Link
            to="/"
            className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors flex items-center gap-1"
          >
            <span>Home Page</span>
          </Link>
        </div>
      </div>

      {/* 2. FLOATING QUICK-BACK BUTTON: Visible when scrolled down on any page */}
      <div
        className={`fixed bottom-20 left-4 sm:bottom-6 sm:left-6 z-40 transition-all duration-300 ${
          hasScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900/90 dark:bg-slate-800/95 text-white backdrop-blur-md shadow-2xl hover:shadow-brand-500/25 border border-slate-700 hover:border-brand-500 text-xs font-black hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          title="Back to previous page"
        >
          <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center group-hover:-translate-x-0.5 transition-transform">
            <ArrowLeft className="w-3.5 h-3.5 text-white" />
          </div>
          <span>Back</span>
        </button>
      </div>
    </>
  );
};
