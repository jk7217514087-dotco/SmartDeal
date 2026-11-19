import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Heart,
  ArrowRight,
  Bell,
  ShoppingCart,
  TrendingDown,
  User,
  Clock,
  Scale,
  Wallet,
  Settings,
  LogOut,
  Search,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, addToCart, toggleWishlist, currentUser, logoutUser } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  const filteredProducts = wishlistedProducts.filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
  });

  const totalSavings = wishlistedProducts.reduce((sum, p) => sum + (p.mrp - p.sellingPrice), 0);

  const handleMoveAllToCart = () => {
    wishlistedProducts.forEach(p => addToCart(p, 1));
    navigate('/cart');
  };

  const navMenuItems = [
    { label: 'Profile', path: '/profile', icon: User, active: false },
    { label: 'Wishlist', path: '/wishlist', icon: Heart, active: true },
    { label: 'Recently Viewed', path: '/recently-viewed', icon: Clock, active: false },
    { label: 'Comparison History', path: '/comparisons', icon: Scale, active: false },
    { label: 'Price Alerts', path: '/price-alerts', icon: Bell, active: false },
    { label: 'Notifications', path: '/notifications', icon: Bell, active: false },
    { label: 'Cashback Wallet', path: '/wallet', icon: Wallet, active: false },
    { label: 'Settings', path: '/settings', icon: Settings, active: false }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Mobile & Tablet (< lg) Horizontal Navigation Strip */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {navMenuItems.map((item, idx) => (
          <Link
            key={idx}
            to={item.path}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              item.active
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <item.icon className="w-3.5 h-3.5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      {/* 2-Column User Account Layout matching Panel 6 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: User Account Sidebar (Desktop) matching Panel 6 */}
        <aside className="hidden lg:block lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-6 shadow-sm sticky top-28">
          {/* User Profile Card */}
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-brand-500/20 shrink-0">
              {currentUser?.name ? currentUser.name.charAt(0) : 'J'}
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-black text-slate-900 dark:text-white truncate">
                {currentUser?.name || 'Jitendra Kumar'}
              </h2>
              <p className="text-xs text-slate-400 truncate">
                {currentUser?.email || 'jitendra@email.com'}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-bold">
            {navMenuItems.map((item, idx) => (
              <Link
                key={idx}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  item.active
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}

            <button
              onClick={() => {
                logoutUser();
                navigate('/login');
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all pt-3 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* RIGHT COLUMN: Wishlist View matching Panel 6 */}
        <main className="lg:col-span-9 space-y-6">
          {/* Header Bar with Count and Search Bar matching Panel 6 */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                My Wishlist ({wishlistedProducts.length})
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Real-time price drop notifications and side-by-side store comparisons
              </p>
            </div>

            {/* Search Wishlist Bar matching Panel 6 */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search wishlist..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Savings Strip */}
          {wishlistedProducts.length > 0 && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-wrap items-center justify-between gap-4 shadow-sm border border-indigo-900/40">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-400">Total Discount Advantage</div>
                  <div className="text-sm font-black text-white">
                    Save ₹{totalSavings.toLocaleString('en-IN')} below MRP across saved items
                  </div>
                </div>
              </div>

              <button
                onClick={handleMoveAllToCart}
                className="px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Move All to Cart</span>
              </button>
            </div>
          )}

          {/* Wishlist Items List matching Panel 6 */}
          {filteredProducts.length > 0 ? (
            <div className="space-y-4">
              {filteredProducts.map(product => {
                const bestStore = product.marketplacePrices[0]?.sellerName || 'Amazon';
                return (
                  <div
                    key={product.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/40 shadow-sm transition-all flex flex-col sm:flex-row items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      {/* Product Thumbnail */}
                      <div className="w-20 h-20 rounded-xl bg-slate-50 dark:bg-slate-950 p-2 shrink-0 border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Product Info matching Panel 6 */}
                      <div className="space-y-1">
                        <Link
                          to={product.id === 'prod-boat-airdopes' ? '/' : `/product/${product.id}`}
                          className="text-sm font-black text-slate-900 dark:text-white hover:text-brand-600 transition-colors line-clamp-1"
                        >
                          {product.name}
                        </Link>
                        <div className="flex items-baseline gap-2 text-xs">
                          <span className="text-base font-black text-slate-950 dark:text-white">
                            ₹{product.sellingPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-slate-400 line-through">
                            ₹{product.mrp.toLocaleString('en-IN')}
                          </span>
                          <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                            {product.discountPercent}% off
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Best: <strong className="text-slate-800 dark:text-slate-200">{bestStore}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Actions matching Panel 6 */}
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                      <Link
                        to={`/compare/${product.id}`}
                        className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer whitespace-nowrap"
                      >
                        View Deals
                      </Link>

                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-16 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <Heart className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No items in your wishlist
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Explore products and tap the heart icon to save products here for price tracking and deal alerts.
              </p>
              <Link
                to="/categories"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-md"
              >
                <span>Browse Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
