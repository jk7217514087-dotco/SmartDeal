import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Menu,
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
  const [profileTab, setProfileTab] = useState<'signin' | 'menu'>('signin');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [forgotSent, setForgotSent] = useState(false);

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

  const handleQuickLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      const res = await loginUser(loginIdentifier, loginPassword);
      setIsLoggingIn(false);
      if (res.success && res.user) {
        setIsProfileMenuOpen(false);
        trackActivity('LOGIN', { method: 'dropdown_quick_login', email: res.user.email });
        if (res.user.role === 'ADMIN') {
          navigate('/admin/dashboard');
        }
      } else {
        setLoginError(res.message || 'Invalid email or password.');
      }
    } catch {
      setIsLoggingIn(false);
      setLoginError('Authentication failed. Please try again.');
    }
  };

  const handleGoogleQuickLogin = async () => {
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const res = await loginWithGoogle();
      if (res.success && res.user) {
        setIsProfileMenuOpen(false);
        if (res.user.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } else {
        setLoginError(res.message || 'Google sign-in could not be completed.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Google sign-in error occurred.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleForgotTrigger = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsProfileMenuOpen(false);
    navigate('/forgot-password');
  };

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
    <header className={`sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b shadow-xs w-full transition-colors duration-300 ${navTheme.headerBg}`}>
      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Left Side: Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
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

        {/* Center-Left Navigation Links (Reference Design Section 0) */}
        <nav className="hidden lg:flex items-center gap-1 shrink-0 text-xs font-bold">
          <Link
            to="/"
            className={`px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors ${
              location.pathname === '/'
                ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 font-black'
                : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <Link
            to="/deals"
            className={`px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors ${
              location.pathname === '/deals'
                ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 font-black'
                : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Deals</span>
          </Link>
          <Link
            to="/compare"
            className={`px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors ${
              location.pathname === '/compare'
                ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 font-black'
                : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Compare</span>
          </Link>
          <Link
            to="/price-tracker"
            className={`px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors ${
              location.pathname === '/price-tracker'
                ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 font-black'
                : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Track Price</span>
          </Link>
          <Link
            to="/wishlist"
            className={`px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors ${
              location.pathname === '/wishlist'
                ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 font-black'
                : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Wishlist</span>
          </Link>
          <button
            onClick={() => setIsNavDrawerOpen(true)}
            className="px-2.5 py-1.5 rounded-xl flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <span>More</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </nav>

        {/* Global Search Bar (Pill design matching Section 0) */}
        <div className="relative flex-1 max-w-sm sm:max-w-md mx-2 hidden md:block">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder="Search for products, brands or categories..."
                className={`w-full pl-10 pr-20 py-2 rounded-full border text-xs sm:text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none transition-all shadow-inner ${navTheme.searchInput}`}
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <button
                type="submit"
                className={`absolute right-1 px-3 py-1 rounded-full text-xs font-black transition-all shadow-sm cursor-pointer ${navTheme.searchBtn}`}
              >
                Search
              </button>
            </div>
          </form>

          {/* Autocomplete suggestions popup */}
          {isSearchFocused && filteredSuggestions.length > 0 && (
            <div className={`absolute left-0 right-0 top-full mt-2 rounded-2xl shadow-2xl border overflow-hidden z-50 animate-fadeIn ${navTheme.searchPopup}`}>
              <div className="p-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800">
                Matching Products
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredSuggestions.map(item => (
                  <div
                    key={item.id}
                    onMouseDown={() => navigate(`/product/${item.id}`)}
                    className="p-3 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center justify-between gap-3 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-xl border border-slate-100 dark:border-slate-800" />
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-white line-clamp-1">{item.name}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Lowest: <span className="font-extrabold text-blue-600 dark:text-blue-400">₹{item.sellingPrice.toLocaleString('en-IN')}</span>
                          {' • '}Deal Score: <span className="font-bold text-emerald-600 dark:text-emerald-400">{item.dealScore}/100</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* AI Assistant Button */}
          <button
            onClick={() => setIsAiAssistantOpen(true)}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border font-extrabold text-xs shadow-xs transition-all hover:scale-105 cursor-pointer ${navTheme.aiBtn}`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${navTheme.aiIcon}`} />
            <span>Ask AI</span>
          </button>

          {/* Download & Install SmartDeal App Button */}
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('trigger-app-install'));
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border font-extrabold text-xs shadow-xs transition-all cursor-pointer active:scale-95 ${navTheme.appBtn}`}
            title="Direct Download SmartDeal App on Phone or Laptop"
          >
            <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>App</span>
          </button>

          {/* 2-Mode Theme Toggle (Sun / Moon) */}
          <button
            onClick={toggleTheme}
            className={`p-2 sm:px-2.5 sm:py-1.5 rounded-full border transition-all hover:scale-105 cursor-pointer shadow-xs flex items-center gap-1.5 ${navTheme.themeToggleBtn}`}
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
            className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700 dark:text-slate-200" />
            <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] sm:text-[10px] font-black flex items-center justify-center shadow-xs">
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

          {/* User Profile Avatar / Initial Badge (Circle badge with 'J' or user initial) */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="w-8 h-8 rounded-full bg-slate-900 dark:bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shadow-sm cursor-pointer hover:scale-105 transition-transform"
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
                                className={`text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                                  currentUser.role === 'ADMIN'
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
                  /* ----------------- GUEST SHOPPER / LOGIN VIEW ----------------- */
                  <>
                    {/* Guest Header */}
                    <div className="p-3.5 bg-gradient-to-r from-slate-50 via-white to-brand-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-brand-950/20 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-black">
                          <User className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-slate-900 dark:text-white">Guest Shopper</span>
                            <span className="text-[9px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.2 rounded border border-slate-200/80 dark:border-slate-700">
                              {guestSession.guest_id || 'G-SESSION'}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Anonymous session active</span>
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

                    {/* Tab Navigation: Sign In vs Quick Menu */}
                    <div className="p-2 bg-slate-50/70 dark:bg-slate-950/40 flex items-center gap-1.5 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setProfileTab('signin')}
                        className={`flex-1 py-1.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          profileTab === 'signin'
                            ? 'bg-white dark:bg-slate-800 text-brand-700 dark:text-brand-300 shadow-xs border border-slate-200/80 dark:border-slate-700 font-extrabold'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Sign In</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setProfileTab('menu')}
                        className={`flex-1 py-1.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          profileTab === 'menu'
                            ? 'bg-white dark:bg-slate-800 text-brand-700 dark:text-brand-300 shadow-xs border border-slate-200/80 dark:border-slate-700 font-extrabold'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        <span>Account Menu</span>
                      </button>
                    </div>

                    {/* TAB CONTENT */}
                    {profileTab === 'signin' ? (
                      <div className="p-4 space-y-3.5">
                        {/* Error Alert */}
                        {loginError && (
                          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-[11px] font-semibold animate-fadeIn">
                            {loginError}
                          </div>
                        )}

                        {/* Password Reset Sent Banner */}
                        {forgotSent && (
                          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-[11px] font-semibold flex items-center gap-1.5 animate-fadeIn">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>Reset instructions sent! Or visit <Link to="/forgot-password" onClick={() => setIsProfileMenuOpen(false)} className="underline font-bold">Forgot Password Page</Link></span>
                          </div>
                        )}

                        {/* Complete Login Form */}
                        <form onSubmit={handleQuickLogin} className="space-y-3">
                          {/* 1. Email or Mobile Input */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                Email or Mobile Number
                              </label>
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                                Auto-Register
                              </span>
                            </div>
                            <div className="relative">
                              <input
                                type="text"
                                required
                                value={loginIdentifier}
                                onChange={e => setLoginIdentifier(e.target.value)}
                                placeholder="name@example.com or phone..."
                                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
                              />
                              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                            </div>
                          </div>

                          {/* 2. Password with Show/Hide and Forgot Password */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                Password
                              </label>
                              <button
                                type="button"
                                onClick={handleForgotTrigger}
                                className="text-[10px] font-bold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
                              >
                                Forgot Password?
                              </button>
                            </div>
                            <div className="relative">
                              <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={loginPassword}
                                onChange={e => setLoginPassword(e.target.value)}
                                placeholder="Enter password..."
                                className="w-full pl-8 pr-8 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
                              />
                              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                                title={showPassword ? 'Hide password' : 'Show password'}
                              >
                                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          {/* 1-Click Test Credentials - Shopper Only */}
                          <div className="pt-1">
                            <div className="text-[10px] font-semibold text-slate-400 mb-1 flex items-center justify-between">
                              <span>Quick Demo Fill:</span>
                              <span className="text-emerald-500 font-bold">Shopper Login</span>
                            </div>
                            <div>
                              <button
                                type="button"
                                onClick={() => {
                                  setLoginIdentifier('rohit.kumar@example.com');
                                  setLoginPassword('password123');
                                  setLoginError('');
                                }}
                                className="w-full py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold transition-all text-center border border-slate-200 dark:border-slate-700 cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                <span>👤</span>
                                <span>Fill Demo Shopper Credentials (Rohit Kumar)</span>
                              </button>
                            </div>
                          </div>

                          {/* 4. Sign In Button */}
                          <button
                            type="submit"
                            disabled={isLoggingIn}
                            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-brand-600 dark:hover:bg-brand-500 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            {isLoggingIn ? (
                              <span>Signing In...</span>
                            ) : (
                              <>
                                <LogIn className="w-3.5 h-3.5" />
                                <span>Sign In Securely</span>
                              </>
                            )}
                          </button>
                        </form>

                        {/* Divider */}
                        <div className="relative flex items-center justify-center pt-1">
                          <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                          <span className="bg-white dark:bg-slate-900 px-2 text-[10px] uppercase font-bold text-slate-400 shrink-0">
                            or
                          </span>
                        </div>

                        {/* 5. Continue with Google */}
                        <button
                          type="button"
                          onClick={handleGoogleQuickLogin}
                          disabled={isLoggingIn}
                          className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                          </svg>
                          <span>Continue with Google</span>
                        </button>

                        {/* 6. Register & Full Login Page Options */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-[11px]">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 dark:text-slate-400">New to SmartDeal?</span>
                            <Link
                              to="/register"
                              onClick={() => setIsProfileMenuOpen(false)}
                              className="font-extrabold text-brand-600 dark:text-brand-400 hover:underline"
                            >
                              Create Account / Register
                            </Link>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 dark:text-slate-400">Prefer full screen?</span>
                            <Link
                              to="/login"
                              onClick={() => setIsProfileMenuOpen(false)}
                              className="font-bold text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1"
                            >
                              <span>Dedicated Login Page</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Guest Quick Menu Navigation */
                      <div className="p-2 space-y-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          <span>Guest Shopper Profile</span>
                        </Link>

                        <Link
                          to="/orders"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                          <ShoppingCart className="w-4 h-4 text-slate-400" />
                          <span>Track Existing Order</span>
                        </Link>

                        <Link
                          to="/support"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                          <HelpCircle className="w-4 h-4 text-emerald-500" />
                          <span>Help & Support Center</span>
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
                          to="/become-seller"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 font-bold transition-colors"
                        >
                          <Store className="w-4 h-4 text-amber-500" />
                          <span>Become a Seller</span>
                        </Link>

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={() => setProfileTab('signin')}
                            className="w-full py-2 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 font-extrabold text-xs hover:bg-brand-100 dark:hover:bg-brand-900 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <LogIn className="w-3.5 h-3.5" />
                            <span>Sign In to Access Saved Data</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Collapsible Input */}
      {isMobileSearchOpen && (
        <div className="md:hidden px-4 pb-3 pt-2 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 animate-fadeIn">
          <form
            onSubmit={e => {
              handleSearchSubmit(e);
              setIsMobileSearchOpen(false);
            }}
          >
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder="Search products, brands, or deals..."
                className="w-full pl-10 pr-20 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-brand-500"
                autoFocus
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3" />
              <button
                type="submit"
                className="absolute right-1 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-[11px] font-bold transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {isSearchFocused && filteredSuggestions.length > 0 && (
            <div className="mt-2 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
              {filteredSuggestions.map(item => (
                <div
                  key={item.id}
                  onMouseDown={() => {
                    setIsMobileSearchOpen(false);
                    navigate(`/product/${item.id}`);
                  }}
                  className="p-2.5 flex items-center justify-between gap-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <img src={item.image} alt="" className="w-8 h-8 object-contain rounded-lg bg-slate-50 dark:bg-slate-800 p-0.5" />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{item.name}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        ₹{item.sellingPrice.toLocaleString('en-IN')} • Score: {item.dealScore}/100
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* THREE-LINE (☰) NAVIGATION DRAWER (Slide-over)                  */}
      {/* ============================================================== */}
      {isNavDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsNavDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 max-w-full flex">
            <div
              ref={navDrawerRef}
              className="w-screen max-w-xs sm:max-w-sm md:max-w-md bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              {/* Drawer Content */}
              <div>
                {/* Header */}
                <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/40">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-md shadow-brand-500/20 bg-[#00061e] flex items-center justify-center shrink-0">
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
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white font-sans">
                          Smart<span className={navTheme.logoTextGradient}>Deal</span>
                        </span>
                        <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-md shadow-xs border ${navTheme.proBadge}`}>
                          PRO
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium">
                        Compare • Save • Buy Smarter
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsNavDrawerOpen(false)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Close Menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Session Status Banner: Guest Shopper or User */}
                {!currentUser ? (
                  <div className="mx-4 mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white border border-indigo-900/50 shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-black tracking-wide">Guest Shopper</span>
                      </div>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-indigo-200">
                        {guestSession?.guest_id ? guestSession.guest_id.slice(0, 8) : (guestSession?.sessionId ? guestSession.sessionId.slice(0, 8) : 'G-16F90Q')}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 mt-1">
                      Anonymous browsing session active. Private & encrypted.
                    </div>
                  </div>
                ) : (
                  <div className="mx-4 mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-brand-900/40 to-indigo-950/40 border border-brand-800/40 shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-brand-600 text-white font-black text-xs flex items-center justify-center">
                        {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {currentUser.name || 'Member'}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {currentUser.email}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Explore & Compare Links */}
                <div className="p-4 space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 py-1">
                    Explore & Compare
                  </div>

                  {/* All Categories */}
                  <Link
                    to="/categories"
                    onClick={() => setIsNavDrawerOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <SlidersHorizontal className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900 dark:text-white">All Categories</div>
                        <div className="text-[10px] text-slate-400 font-normal">Browse 100+ categories & products</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  {/* Deals */}
                  <Link
                    to="/deals"
                    onClick={() => setIsNavDrawerOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-rose-50/60 dark:hover:bg-rose-950/30 text-slate-800 dark:text-slate-100 font-bold text-xs transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Flame className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-rose-600 dark:text-rose-400">Deals & Offers</div>
                        <div className="text-[10px] text-slate-400 font-normal">Up to 70% off across marketplaces</div>
                      </div>
                    </div>
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
                      HOT
                    </span>
                  </Link>

                  {/* Coupons & Offers */}
                  <Link
                    to="/coupons"
                    onClick={() => setIsNavDrawerOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Tag className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900 dark:text-white">Coupons & Discounts</div>
                        <div className="text-[10px] text-slate-400 font-normal">Verified coupon codes & vouchers</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  {/* Compare Stores */}
                  <Link
                    to="/compare"
                    onClick={() => setIsNavDrawerOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900 dark:text-white">Compare Stores</div>
                        <div className="text-[10px] text-slate-400 font-normal">Live multi-store price comparison</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  {/* Price Tracker */}
                  <Link
                    to="/price-tracker"
                    onClick={() => setIsNavDrawerOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30 text-slate-800 dark:text-slate-100 font-bold text-xs transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">Price Tracker</div>
                        <div className="text-[10px] text-slate-400 font-normal">Track historical price drops & alerts</div>
                      </div>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  </Link>

                  {/* Marketplaces */}
                  <Link
                    to="/marketplaces"
                    onClick={() => setIsNavDrawerOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Store className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900 dark:text-white">Marketplaces</div>
                        <div className="text-[10px] text-slate-400 font-normal">Amazon, Flipkart, Croma, Reliance</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  {/* Product vs Product AI */}
                  <Link
                    to="/product-vs-product"
                    onClick={() => setIsNavDrawerOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Sparkles className="w-4 h-4 text-violet-500" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900 dark:text-white">Product vs Product AI</div>
                        <div className="text-[10px] text-slate-400 font-normal">AI head-to-head comparison engine</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  {/* Flowchart */}
                  <Link
                    to="/flowchart"
                    onClick={() => setIsNavDrawerOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-cyan-50/60 dark:hover:bg-cyan-950/30 text-slate-800 dark:text-slate-100 font-bold text-xs transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Workflow className="w-4 h-4 text-cyan-500" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-cyan-600 dark:text-cyan-400">Flowchart</div>
                        <div className="text-[10px] text-slate-400 font-normal">Interactive deal finding pipeline</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Trust & Help Section */}
                <div className="p-4 pt-0 space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 py-1">
                    Help & Assurance
                  </div>

                  <Link
                    to="/support"
                    onClick={() => setIsNavDrawerOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-4 h-4 text-slate-400" />
                      <span>24/7 Support & Help Desk</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>

                  <Link
                    to="/about"
                    onClick={() => setIsNavDrawerOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>Our Anti-Fake & Price Policy</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </div>
              </div>

              {/* Drawer Bottom Actions */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 space-y-2">
                <button
                  onClick={() => {
                    setIsNavDrawerOpen(false);
                    window.dispatchEvent(new CustomEvent('trigger-app-install'));
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-brand-600 hover:from-indigo-500 hover:to-brand-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download SmartDeal App</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
