import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  MoreVertical,
  Search,
  ShoppingCart,
  Heart,
  User,
  Bell,
  HelpCircle,
  Sparkles,
  Store,
  ShieldAlert,
  Layers,
  ChevronDown,
  ArrowRight,
  SlidersHorizontal,
  Flame,
  Sun,
  Moon,
  Palette,
  X,
  Radio,
  Workflow,
  Tag,
  ArrowLeft,
  RotateCcw,
  Smartphone,
  Download,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  LogOut,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Home,
  TrendingDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    role,
    setRole,
    currentUser,
    guestSession,
    openAuthModal,
    loginUser,
    loginWithGoogle,
    logoutUser,
    trackActivity,
    cart,
    wishlist,
    cashbackWallet,
    setIsAiAssistantOpen,
    searchQuery,
    setSearchQuery,
    products,
    isDarkMode,
    toggleDarkMode,
    activeTheme,
    toggleTheme,
    setIsBgModalOpen,
    setIsSmsCenterOpen
  } = useApp();

  const navTheme = {
    headerBg: isDarkMode
      ? 'bg-[#0b1329]/95 border-b border-slate-800 text-white'
      : 'bg-white/95 border-b border-slate-200/90 text-slate-900 shadow-xs',
    searchInput: isDarkMode
      ? 'bg-slate-800/90 border-slate-700 text-white placeholder:text-slate-400 focus:bg-slate-900 focus:border-blue-500'
      : 'bg-slate-100/90 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15',
    searchBtn: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-extrabold',
    searchPopup: isDarkMode ? 'bg-[#111d38] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-xl',
    aiBtn: isDarkMode ? 'bg-slate-800 border-slate-700 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
    aiIcon: isDarkMode ? 'text-blue-400' : 'text-blue-600',
    appBtn: isDarkMode ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 font-bold',
    themeToggleBtn: isDarkMode ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200',
    themeIcon: isDarkMode ? 'text-amber-400' : 'text-slate-700',
    cartBtn: 'bg-blue-600 hover:bg-blue-700 text-white font-extrabold shadow-sm',
    cartCountBadge: 'bg-slate-900 text-white',
    logoTextGradient: 'text-blue-600',
    proBadge: isDarkMode ? 'bg-blue-950/80 text-blue-300 border-blue-800' : 'bg-blue-50 text-blue-700 border-blue-200',
    tooltipText: isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode',
  };

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const navDrawerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close nav drawer on outside click or escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navDrawerRef.current && !navDrawerRef.current.contains(e.target as Node)) {
        setIsNavDrawerOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsNavDrawerOpen(false);
      }
    };
    if (isNavDrawerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isNavDrawerOpen]);

  // Close profile dropdown on outside click or escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsProfileMenuOpen(false);
      }
    };
    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isProfileMenuOpen]);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredSuggestions = searchQuery.trim()
    ? products.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      trackActivity('SEARCH_PRODUCT', { query: searchQuery.trim() });
      setIsSearchFocused(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b shadow-sm w-full transition-colors duration-300 ${navTheme.headerBg}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: isDarkMode ? 'rgba(11, 19, 41, 0.98)' : 'rgba(255, 255, 255, 0.98)'
        }}
      >
        {/* Main Navbar Bar */}
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-2 sm:gap-4">
          {/* Left Side: Three Lines Menu Button + Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Three Lines Menu Button (Visible on all devices as shown in screenshots) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsNavDrawerOpen(true);
              }}
              className="p-2 sm:p-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-xs group"
              title="All Features & Categories (Menu)"
              aria-label="Navigation Menu"
            >
              <Menu className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
            </button>

            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl overflow-hidden shadow-md shadow-blue-500/20 ring-1 ring-blue-500/20 group-hover:scale-105 transition-transform bg-[#00061e] flex items-center justify-center shrink-0">
                <img
                  src="/smartdeal_icon_mark.png"
                  alt="SmartDeal Logo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white font-sans">
                    Smart<span className={navTheme.logoTextGradient}>Deal</span>
                  </span>
                  <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-md shadow-xs border ${navTheme.proBadge}`}>
                    PRO
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                  Compare. Save. Buy Smarter.
                </p>
              </div>
            </Link>
          </div>

          {/* Right Actions: Restored on both Mobile and Desktop */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Download & Install SmartDeal App Button */}
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('trigger-app-install'));
              }}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-full border font-extrabold text-[11px] sm:text-xs shadow-xs transition-all cursor-pointer active:scale-95 ${navTheme.appBtn}`}
              title="Direct Download SmartDeal App on Phone or Laptop"
            >
              <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>App</span>
            </button>

            {/* 2-Mode Theme Toggle (Sun / Moon) */}
            <button
              onClick={toggleTheme}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-full border transition-all hover:scale-105 cursor-pointer shadow-xs flex items-center gap-1.5 ${navTheme.themeToggleBtn}`}
              title={navTheme.tooltipText}
              aria-label="Toggle Theme Mode (Light / Dark)"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span className="hidden sm:inline text-xs font-bold text-amber-400">Dark</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-700" />
                  <span className="hidden sm:inline text-xs font-bold text-slate-700">Light</span>
                </>
              )}
            </button>

            {/* Notifications with Red Badge */}
            <Link
              to="/notifications"
              className="relative p-1.5 sm:p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700 dark:text-slate-200" />
              <span className="absolute top-0 right-0 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-rose-500 text-white text-[8px] sm:text-[10px] font-black flex items-center justify-center shadow-xs">
                3
              </span>
            </Link>

            {/* Cart Button */}
            <Link
              to="/cart"
              className={`hidden xl:flex relative p-2 px-3 rounded-full transition-all shadow-sm items-center gap-1.5 active:scale-95 ${navTheme.cartBtn}`}
              title="Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="text-xs font-black">Cart</span>
              {cartItemCount > 0 ? (
                <span className={`w-4 h-4 rounded-full text-[10px] font-black flex items-center justify-center ${navTheme.cartCountBadge}`}>
                  {cartItemCount}
                </span>
              ) : null}
            </Link>

            {/* User Profile Avatar / Initial Badge */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-900 dark:bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shadow-sm cursor-pointer hover:scale-105 transition-transform"
                title="Account & Login"
                aria-label="Account Profile"
              >
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'J'}
              </button>

              {/* Mobile Backdrop */}
              {isProfileMenuOpen && (
                <div
                  className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 sm:hidden animate-fadeIn"
                  onClick={() => setIsProfileMenuOpen(false)}
                />
              )}

              {isProfileMenuOpen && (
                <div
                  ref={profileMenuRef}
                  className="fixed sm:absolute right-3 sm:right-0 left-3 sm:left-auto top-16 sm:top-full mt-2 w-auto sm:w-96 max-w-sm sm:max-w-none bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 z-50 animate-fadeIn max-h-[min(660px,calc(100vh-5rem))] overflow-y-auto flex flex-col divide-y divide-slate-100 dark:divide-slate-800"
                >
                  {currentUser ? (
                    /* ----------------- LOGGED IN USER VIEW ----------------- */
                    <>
                      <div className="p-4 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/20">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center font-black text-base shadow-md shadow-brand-500/25 shrink-0">
                              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-black text-slate-900 dark:text-white truncate">
                                  {currentUser.name}
                                </span>
                                <span
                                  className={`text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider ${currentUser.role === 'ADMIN'
                                      ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60'
                                      : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60'
                                    }`}
                                >
                                  {currentUser.role}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                {currentUser.email}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                            title="Close"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Cashback Wallet Pill */}
                        <Link
                          to="/account/cashback"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="mt-3 flex items-center justify-between p-2.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/60 hover:bg-emerald-100/70 transition-all group"
                        >
                          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                            <Sparkles className="w-4 h-4 text-emerald-500" />
                            <span>Cashback Wallet</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-black text-emerald-700 dark:text-emerald-300">
                              ₹{cashbackWallet.availableBalance}
                            </span>
                            <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 block">
                              Direct Bank / UPI
                            </span>
                          </div>
                        </Link>
                      </div>

                      {/* Navigation Links */}
                      <div className="p-2 space-y-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          <span>My Profile & Addresses</span>
                        </Link>

                        <Link
                          to="/orders"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                          <ShoppingCart className="w-4 h-4 text-slate-400" />
                          <span>My Orders & Live Tracking</span>
                        </Link>

                        <Link
                          to="/account/cashback"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                          <Sparkles className="w-4 h-4 text-emerald-500" />
                          <span>Cashback & Rewards Ledger</span>
                        </Link>

                        <Link
                          to="/price-alerts"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                          <Bell className="w-4 h-4 text-slate-400" />
                          <span>Price Drop Alerts</span>
                        </Link>

                        <Link
                          to="/wishlist"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                          <Heart className="w-4 h-4 text-rose-500" />
                          <span>My Wishlist ({wishlist.length})</span>
                        </Link>

                        <Link
                          to="/become-seller"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 font-bold transition-colors"
                        >
                          <Store className="w-4 h-4 text-amber-500" />
                          <span>Become a Seller</span>
                        </Link>

                        {/* Admin Command Center Link */}
                        {(currentUser?.role === 'ADMIN' || (currentUser?.role as any) === 'SUPER_ADMIN' || currentUser?.email === 'jk7217514087@gmail.com' || currentUser?.email === 'admin@smartdeal.com' || role === 'ADMIN') && (
                          <>
                            <Link
                              to={sessionStorage.getItem('smartdeal_admin_authenticated') === 'true' ? "/admin/dashboard" : "/admin/login"}
                              onClick={() => setIsProfileMenuOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold transition-colors"
                            >
                              <ShieldAlert className="w-4 h-4 text-rose-500" />
                              <span>Admin Command Center</span>
                            </Link>
                            {sessionStorage.getItem('smartdeal_admin_authenticated') === 'true' && (
                              <button
                                onClick={() => {
                                  setIsProfileMenuOpen(false);
                                  setIsSmsCenterOpen(true);
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 font-bold transition-colors cursor-pointer text-left"
                              >
                                <Smartphone className="w-4 h-4 text-emerald-500" />
                                <span>Live SMS & Alerts Center</span>
                              </button>
                            )}
                          </>
                        )}

                        <div className="border-t border-slate-100 dark:border-slate-800 my-1 pt-1" />

                        <button
                          onClick={async () => {
                            await logoutUser();
                            setIsProfileMenuOpen(false);
                            navigate('/');
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-bold transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    /* ----------------- GUEST SHOPPER VIEW ----------------- */
                    <>
                      {/* Guest Header */}
                      <div className="p-4 bg-gradient-to-r from-slate-50 via-white to-blue-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/20 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-black text-slate-900 dark:text-white">Guest Shopper</span>
                              <span className="text-[9px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/60">
                                Active
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1">
                              <span>Local device session</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Close menu"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Guest Information & Upgrade CTA */}
                      <div className="p-4 space-y-3">
                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                          Your wishlist and price drop alerts are currently stored on this browser. Sign in or create an account to access them across all your devices.
                        </div>

                        {/* Primary Action Buttons */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsProfileMenuOpen(false);
                              openAuthModal('login');
                            }}
                            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <LogIn className="w-3.5 h-3.5" />
                            <span>Sign In</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setIsProfileMenuOpen(false);
                              openAuthModal('signup');
                            }}
                            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs border border-slate-200 dark:border-slate-700 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            <span>Register</span>
                          </button>
                        </div>
                      </div>

                      {/* Useful Quick Links */}
                      <div className="p-2 space-y-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <Link
                          to="/orders"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
                        >
                          <ShoppingCart className="w-4 h-4 text-slate-400" />
                          <span>Track Existing Order</span>
                        </Link>

                        <Link
                          to="/wishlist"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
                        >
                          <Heart className="w-4 h-4 text-slate-400" />
                          <span>Saved Wishlist ({wishlist.length})</span>
                        </Link>

                        <Link
                          to="/support"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
                        >
                          <HelpCircle className="w-4 h-4 text-emerald-500" />
                          <span>Help & Support Center</span>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Persistent Global Search Bar Row with 3-Dots Menu on Side (Locked Fixed at Top on All Pages) */}
        <div className="max-w-7xl mx-auto px-3.5 sm:px-4 pb-2.5 pt-0.5 flex items-center gap-2">
          <form onSubmit={handleSearchSubmit} className="flex-1 min-w-0">
            <div className="relative flex items-center w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder="Search products, brands or categories..."
                className={`w-full pl-10 pr-20 sm:pr-24 py-2 sm:py-2.5 rounded-full border text-xs sm:text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none transition-all shadow-inner ${navTheme.searchInput}`}
              />
              <button
                type="submit"
                className={`absolute right-1 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-black transition-all shadow-sm cursor-pointer ${navTheme.searchBtn}`}
              >
                Search
              </button>
            </div>
          </form>

          {/* 3-Dots Menu Button (Visible on all devices as shown in screenshots) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsNavDrawerOpen(true);
            }}
            className="p-2 sm:p-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-xs"
            title="Navigation Menu"
            aria-label="Navigation Menu"
          >
            <MoreVertical className="w-5 h-5 text-amber-500" />
          </button>
        </div>

        {/* Autocomplete suggestions popup on all screen sizes */}
        {isSearchFocused && filteredSuggestions.length > 0 && (
          <div className="max-w-7xl mx-auto px-3.5 sm:px-4">
            <div className={`mt-1 rounded-2xl shadow-2xl border overflow-hidden z-50 animate-fadeIn ${navTheme.searchPopup}`}>
              <div className="p-2 text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800">
                Matching Products
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-60 overflow-y-auto">
                {filteredSuggestions.map(item => (
                  <div
                    key={item.id}
                    onMouseDown={() => navigate(`/product/${item.id}`)}
                    className="p-2.5 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center justify-between gap-2.5 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={item.image} alt={item.name} className="w-8 h-8 object-contain rounded-lg border border-slate-100 dark:border-slate-800 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800 dark:text-white truncate">{item.name}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          ₹{item.sellingPrice.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Fixed Header Height Spacer (Prevents page content from hiding behind fixed header on all screen sizes) */}
      <div className="h-[114px] sm:h-[120px] w-full shrink-0 pointer-events-none" aria-hidden="true" />

      {/* ============================================================== */}
      {/* THREE-LINE (☰) NAVIGATION DRAWER (Compact User/Product Only)   */}
      {/* ============================================================== */}
      {isNavDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsNavDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 max-w-full flex h-full">
            <div
              ref={navDrawerRef}
              onClick={(e) => e.stopPropagation()}
              className="w-72 max-w-[280px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between overflow-y-auto h-full"
            >
              {/* Drawer Content */}
              <div>
                {/* Header */}
                <div className="p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/40">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl overflow-hidden shadow-md shadow-brand-500/20 bg-[#00061e] flex items-center justify-center shrink-0">
                      <img
                        src="/smartdeal_icon_mark.png"
                        alt="SmartDeal Logo"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-black text-base tracking-tight text-slate-900 dark:text-white font-sans">
                          Smart<span className={navTheme.logoTextGradient}>Deal</span>
                        </span>
                        <span className={`text-[8px] font-black px-1.5 py-0.2 rounded-md shadow-xs border ${navTheme.proBadge}`}>
                          PRO
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium">
                        Compare • Save • Buy Smarter
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsNavDrawerOpen(false)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Close Menu"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Main Navigation Links: ONLY User & Product Relevant Features */}
                <div className="p-3 space-y-1">
                  <div className="text-[9px] font-black uppercase tracking-wider text-slate-400 px-2.5 py-1">
                    Store Navigation
                  </div>

                  {/* Home */}
                  <Link
                    to="/"
                    onClick={() => setIsNavDrawerOpen(false)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <Home className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-xs font-extrabold text-slate-900 dark:text-white">Home</div>
                    </div>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  {/* Deals & Offers */}
                  <Link
                    to="/deals"
                    onClick={() => setIsNavDrawerOpen(false)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-rose-50/60 dark:hover:bg-rose-950/30 text-slate-800 dark:text-slate-100 font-bold text-xs transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                        <Flame className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-xs font-extrabold text-rose-600 dark:text-rose-400">Deals & Offers</div>
                    </div>
                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
                      HOT
                    </span>
                  </Link>

                  {/* Wishlist / Saved Deals */}
                  <Link
                    to="/wishlist"
                    onClick={() => setIsNavDrawerOpen(false)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                        <Heart className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-xs font-extrabold text-slate-900 dark:text-white">Wishlist / Saved</div>
                    </div>
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300">
                      {wishlist.length}
                    </span>
                  </Link>

                  {/* All Categories */}
                  <Link
                    to="/categories"
                    onClick={() => setIsNavDrawerOpen(false)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-xs font-extrabold text-slate-900 dark:text-white">All Categories</div>
                    </div>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  {/* Coupons & Discounts */}
                  <Link
                    to="/coupons"
                    onClick={() => setIsNavDrawerOpen(false)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                        <Tag className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-xs font-extrabold text-slate-900 dark:text-white">Coupons & Discounts</div>
                    </div>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  {/* My Orders / Track Order */}
                  <Link
                    to="/orders"
                    onClick={() => setIsNavDrawerOpen(false)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <ShoppingCart className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-xs font-extrabold text-slate-900 dark:text-white">Track Orders</div>
                    </div>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  {/* 24/7 Support & Help Desk */}
                  <Link
                    to="/support"
                    onClick={() => setIsNavDrawerOpen(false)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                        <HelpCircle className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-xs font-extrabold text-slate-900 dark:text-white">Help & Support</div>
                    </div>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Drawer Bottom Actions */}
              <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
                <button
                  onClick={() => {
                    setIsNavDrawerOpen(false);
                    window.dispatchEvent(new CustomEvent('trigger-app-install'));
                  }}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-brand-600 hover:from-indigo-500 hover:to-brand-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download App</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
