import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Coins,
  Bell,
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
  X,
  Radio,
  Workflow,
  Tag,
  ArrowLeft,
  RotateCcw,
  Smartphone,
  Mail
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    role,
    setRole,
    currentUser,
    guestSession,
    logoutUser,
    trackActivity,
    cart,
    wishlist,
    smartCoinsBalance,
    setIsAiAssistantOpen,
    searchQuery,
    setSearchQuery,
    products,
    isDarkMode,
    toggleDarkMode,
    setIsSmsCenterOpen
  } = useApp();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs w-full overflow-hidden">
      {/* Top Banner for Smart Shopping & Role Switcher */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white text-xs py-1.5 px-3 sm:px-4 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 overflow-hidden">
          <div className="flex items-center gap-2 overflow-hidden text-[11px] font-medium min-w-0">
            <span className="flex items-center gap-1 bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded-full font-bold shrink-0">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Smart Guarantee
            </span>
            <span className="hidden sm:inline text-slate-300 truncate">
              Live multi-store price comparison • Real Final Price • 100% Verified Deals
            </span>
          </div>

          {/* Owner SMS Alert Live Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsSmsCenterOpen(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600/40 via-indigo-600/40 to-purple-600/40 hover:from-blue-600 hover:to-indigo-600 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold tracking-wide transition-all border border-blue-400/40 text-blue-200 hover:text-white cursor-pointer shadow-xs active:scale-95"
              title="View Real-Time SMS & Email Alerts (Phone: 7217514087 | Email: jk7217514087@gmail.com)"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>SMS: 7217514087</span>
              <span className="text-slate-400">|</span>
              <Mail className="w-3.5 h-3.5 text-blue-300" />
              <span className="hidden sm:inline text-slate-300">Email: jk7217514087@gmail.com</span>
              <span className="sm:hidden text-slate-300">Email</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </button>

            {/* Quick Perspective / Role Switcher (Visible strictly to authenticated Admin) */}
            {role === 'ADMIN' && (
              <div className="relative shrink-0">
                <button
                  onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide transition-all border border-white/20"
                >
                  <span className="text-slate-300">Viewing as:</span>
                  <span className={`px-1.5 py-0.2 rounded font-extrabold ${
                    role === 'ADMIN' ? 'bg-rose-500 text-white' : role === 'SELLER' ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-white'
                  }`}>
                    {role}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-300" />
                </button>

                {isRoleMenuOpen && (
                  <div className="absolute right-0 mt-1.5 w-52 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-fadeIn">
                    <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-2 py-1">
                      Switch User View
                    </div>
                    <button
                      onClick={() => {
                        setRole('USER');
                        setIsRoleMenuOpen(false);
                        navigate('/');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                    >
                      <span>Customer View</span>
                    </button>

                    <button
                      onClick={() => {
                        setRole('SELLER');
                        setIsRoleMenuOpen(false);
                        navigate('/seller/dashboard');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                    >
                      <div className="flex items-center gap-1.5">
                        <Store className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        <span>Seller Dashboard</span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setRole('ADMIN');
                        setIsRoleMenuOpen(false);
                        navigate('/admin/dashboard');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300"
                    >
                      <div className="flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                        <span>Admin Panel</span>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-rose-600" />
                    </button>
                  </div>
                )}
              </div>
            )}
        </div>
      </div>
    </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Left Side: Back Button & Brand Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          {location.pathname !== '/' && (
            <button
              onClick={() => {
                if (window.history.length > 2) {
                  navigate(-1);
                } else {
                  navigate('/');
                }
              }}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-slate-700 dark:hover:text-brand-400 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all cursor-pointer shadow-xs active:scale-95 group"
              title="Go back to previous page"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}

          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-700 flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-all">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
            <div className="flex items-center gap-1">
              <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white font-sans">
                Smart<span className="text-brand-600 dark:text-brand-400">Deals</span>
              </span>
              <span className="text-[9px] bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-extrabold px-1.5 py-0.2 rounded-md border border-brand-200/50 dark:border-brand-800/50">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
              Smart Shopping. Better Deals.
            </p>
          </div>
        </Link>
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1 max-w-xl mx-2 hidden md:block">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder="Search products, brands, compare prices, or ask AI..."
                className="w-full pl-11 pr-24 py-2.5 rounded-2xl bg-slate-100/90 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4" />
              <button
                type="submit"
                className="absolute right-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-brand-600 dark:hover:bg-brand-700 text-white text-xs font-bold transition-all"
              >
                Search
              </button>
            </div>
          </form>

          {/* Autocomplete suggestions popup */}
          {isSearchFocused && filteredSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden z-50 animate-fadeIn">
              <div className="p-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800">
                Matching Products
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredSuggestions.map(item => (
                  <div
                    key={item.id}
                    onMouseDown={() => navigate(`/product/${item.id}`)}
                    className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-between gap-3 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-xl border border-slate-100 dark:border-slate-800" />
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-white line-clamp-1">{item.name}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Lowest: <span className="font-extrabold text-brand-600 dark:text-brand-400">₹{item.sellingPrice.toLocaleString('en-IN')}</span>
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
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* AI Assistant Button (Visible on sm+; on mobile it is prominent in MobileNav bottom bar) */}
          <button
            onClick={() => setIsAiAssistantOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-brand-50 to-indigo-100/70 dark:from-brand-950/60 dark:to-indigo-950/60 border border-brand-200 dark:border-brand-800/80 text-brand-700 dark:text-brand-300 hover:text-brand-800 font-extrabold text-xs shadow-xs hover:shadow-brand-500/20 transition-all hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Ask AI</span>
          </button>

          {/* SmartCoins Pill */}
          <Link
            to="/wallet"
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100/80 dark:hover:bg-amber-900/40 border border-amber-200/80 dark:border-amber-800/80 text-amber-800 dark:text-amber-300 font-extrabold text-[11px] sm:text-xs shadow-xs transition-all"
            title="SmartCoins Wallet (10 Coins = ₹1)"
          >
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <span>{smartCoinsBalance}</span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 hidden md:inline">Coins</span>
          </Link>

          {/* Mobile Search Toggle */}
          <button
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className="md:hidden p-1.5 sm:p-2 rounded-xl sm:rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Search Products"
            aria-label="Toggle Search"
          >
            {isMobileSearchOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Search className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-1.5 sm:p-2 rounded-xl sm:rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-500 transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 hover:text-indigo-600" />
            )}
          </button>

          {/* Notifications */}
          <Link
            to="/notifications"
            className="relative p-1.5 sm:p-2 rounded-xl sm:rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-2 h-2 rounded-full bg-brand-600" />
          </Link>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="relative p-1.5 sm:p-2 rounded-xl sm:rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
            title="Wishlist"
          >
            <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-0 right-0 sm:top-1 sm:right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] sm:text-[10px] font-black flex items-center justify-center shadow-sm">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart (Hidden on mobile; mobile users use bottom MobileNav cart button) */}
          <Link
            to="/cart"
            className="hidden sm:flex relative p-2 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 transition-all shadow-sm items-center gap-1.5"
            title="Cart"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="text-xs font-black">Cart</span>
            {cartItemCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-brand-500 text-white text-[11px] font-black flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* Account Profile Dropdown (Hidden on mobile; mobile users use bottom MobileNav account button) */}
          <div className="hidden sm:block relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            >
              <User className="w-5 h-5" />
            </button>

            {isProfileMenuOpen && (
              <div
                onMouseLeave={() => setIsProfileMenuOpen(false)}
                className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-fadeIn"
              >
                {currentUser ? (
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</div>
                      <span className={`text-[9px] font-black px-1.5 py-0.2 rounded uppercase ${
                        currentUser.role === 'ADMIN' ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300' : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      }`}>
                        {currentUser.role}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
                    <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                      <Coins className="w-3 h-3" />
                      <span>{smartCoinsBalance} SmartCoins (₹{Math.floor(smartCoinsBalance / 10)})</span>
                    </div>
                  </div>
                ) : (
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">Guest Shopper</div>
                      <span className="text-[9px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded">
                        {guestSession.guest_id}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">Anonymous session active</div>
                    <div className="mt-2 grid grid-cols-2 gap-1.5">
                      <Link
                        to="/login"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="text-center py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold text-[11px] transition-colors"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="text-center py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-[11px] transition-colors"
                      >
                        Register
                      </Link>
                    </div>
                  </div>
                )}

                <div className="py-1 space-y-0.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <Link
                    to="/profile"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  >
                    My Orders & Tracking
                  </Link>
                  <Link
                    to="/wallet"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  >
                    SmartCoins Wallet
                  </Link>
                  <Link
                    to="/price-alerts"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  >
                    Price Drop Alerts
                  </Link>
                  <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                  <Link
                    to="/become-seller"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 font-bold"
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>Become a Seller</span>
                  </Link>
                  {role === 'ADMIN' && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Admin Command Center</span>
                    </Link>
                  )}

                  {currentUser && (
                    <>
                      <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                      <button
                        onClick={() => {
                          logoutUser();
                          setIsProfileMenuOpen(false);
                          navigate('/');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-bold transition-colors cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </>
                  )}
                </div>
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

      {/* Categories Sub-nav */}
      <nav className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 overflow-x-auto no-scrollbar py-2">
          <div className="flex items-center gap-5">
            <Link
              to="/categories"
              className="flex items-center gap-1 text-brand-700 dark:text-brand-400 hover:text-brand-800"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>All Categories</span>
            </Link>
            <Link to="/deals" className="flex items-center gap-1 text-rose-600 dark:text-rose-400 hover:text-rose-700 font-extrabold">
              <Flame className="w-3.5 h-3.5" />
              <span>Deals</span>
            </Link>
            <Link to="/coupons" className="flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:text-amber-700 font-extrabold">
              <Tag className="w-3.5 h-3.5" />
              <span>Coupons & Offers</span>
            </Link>
            <Link to="/compare" className="flex items-center gap-1 text-indigo-700 dark:text-indigo-400 hover:text-indigo-900 font-extrabold">
              <Layers className="w-3.5 h-3.5" />
              <span>Compare Stores</span>
            </Link>
            <Link to="/price-tracker" className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-extrabold">
              <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span>Price Tracker</span>
            </Link>
            <Link to="/marketplaces" className="hover:text-slate-900 dark:hover:text-white">
              Marketplaces
            </Link>
            <Link to="/product-vs-product" className="flex items-center gap-1 text-purple-700 dark:text-purple-400 hover:text-purple-900 font-extrabold">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Product vs Product AI</span>
            </Link>
            <Link to="/flowchart" className="flex items-center gap-1 text-cyan-700 dark:text-cyan-400 hover:text-cyan-900 font-extrabold bg-cyan-50 dark:bg-cyan-950/40 px-2 py-0.5 rounded-full border border-cyan-200 dark:border-cyan-800/50">
              <Workflow className="w-3.5 h-3.5 text-cyan-500" />
              <span>Flowchart</span>
            </Link>
            <Link to="/returns" className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 font-extrabold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/50">
              <RotateCcw className="w-3.5 h-3.5 text-emerald-500" />
              <span>Returns & Refunds</span>
            </Link>
          </div>

          <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-[11px] font-medium shrink-0">
            <Link to="/support" className="hover:text-slate-800 dark:hover:text-slate-200">24/7 Support</Link>
            <Link to="/about" className="hover:text-slate-800 dark:hover:text-slate-200">Our Anti-Fake Policy</Link>
          </div>
        </div>
      </nav>
    </header>
  );
};
