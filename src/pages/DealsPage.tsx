import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/common/ProductCard';
import {
  Flame,
  Sparkles,
  TrendingDown,
  Clock,
  ShieldCheck,
  Percent,
  SlidersHorizontal,
  Layers,
  ArrowRight,
  Zap,
  Tag,
  Headphones,
  ShoppingBag
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const DealsPage: React.FC = () => {
  const { products } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'All' | 'Flash Deals' | 'Price Drops' | 'Coupons' | 'Bank Offers' | 'Trending'>('All');
  const [selectedStore, setSelectedStore] = useState<string>('all');

  // Flash deals matching Panel 5
  const flashDealItems = [
    {
      id: 'prod-boat-airdopes',
      name: 'boAt Airdopes 141',
      brand: 'boAt',
      price: 1295,
      mrp: 4490,
      discount: 71,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      badge: 'Flash Deal'
    },
    {
      id: 'prod-samsung-galaxy-s24',
      name: 'Samsung Galaxy S24',
      brand: 'Samsung',
      price: 64999,
      mrp: 79999,
      discount: 19,
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80',
      badge: 'Flash Deal'
    },
    {
      id: 'prod-nike-running-shoes',
      name: 'Nike Running Shoes',
      brand: 'Nike',
      price: 2499,
      mrp: 4995,
      discount: 50,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      badge: 'Flash Deal'
    }
  ];

  const filteredDeals = products.filter(p => {
    if (activeTab === 'Flash Deals') {
      return (
        p.id === 'prod-boat-airdopes' ||
        p.id === 'prod-samsung-galaxy-s24' ||
        p.id === 'prod-nike-running-shoes' ||
        p.discountPercent >= 45
      );
    }
    if (activeTab === 'Price Drops' && p.discountPercent < 30) return false;
    if (activeTab === 'Trending' && p.dealScore < 90) return false;

    if (selectedStore !== 'all') {
      const hasStore = p.marketplacePrices.some(mp =>
        mp.sellerName.toLowerCase().includes(selectedStore.toLowerCase())
      );
      if (!hasStore) return false;
    }

    return true;
  });

  const sortedDeals = [...filteredDeals].sort((a, b) => b.dealScore - a.dealScore);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Panel 5 Hero Banner: Today's Best Deals / Up to 70% Off */}
      <div className="relative rounded-3xl bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 border border-purple-800/40 p-8 sm:p-12 text-white shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-xl text-center md:text-left">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Today's Best Deals
          </h1>
          <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-rose-400">
            Up to 70% Off
          </div>
          <p className="text-sm text-slate-300">
            Get the hottest verified deals before they're gone! Live cashback and multi-store price comparisons updated real-time.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                const el = document.getElementById('flash-deals-row');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-extrabold text-xs shadow-lg shadow-purple-500/30 transition-all cursor-pointer"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero Graphic with 70% Off sticker matching Panel 5 */}
        <div className="relative z-10 shrink-0 flex items-center justify-center">
          <div className="relative w-64 h-52 sm:w-72 sm:h-56 rounded-3xl bg-gradient-to-br from-indigo-900/60 to-purple-950/80 border border-purple-500/30 p-4 flex items-center justify-center backdrop-blur-md shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80"
              alt="Deals Showcase"
              className="w-full h-full object-contain filter drop-shadow-2xl"
            />
            {/* 70% Off Glowing Round Sticker */}
            <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 text-slate-950 font-black flex flex-col items-center justify-center text-center shadow-lg transform rotate-12 border-2 border-white">
              <span className="text-xs leading-none">70%</span>
              <span className="text-[10px] uppercase font-bold leading-none">Off</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs Strip matching Panel 5 */}
      <div className="p-2 sm:p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Category Pills matching Panel 5: All, Flash Deals, Price Drops, Coupons, Bank Offers, Trending */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {(['All', 'Flash Deals', 'Price Drops', 'Coupons', 'Bank Offers', 'Trending'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab === 'Flash Deals' && <span className="mr-1">⚡</span>}
              {tab === 'Price Drops' && <span className="mr-1">📉</span>}
              {tab === 'Coupons' && <span className="mr-1">🎟️</span>}
              {tab === 'Bank Offers' && <span className="mr-1">💳</span>}
              {tab === 'Trending' && <span className="mr-1">🔥</span>}
              <span>{tab}</span>
            </button>
          ))}
        </div>

        {/* Store Selector */}
        <div className="flex items-center gap-2 text-xs font-bold shrink-0">
          <span className="text-slate-400">Store:</span>
          <select
            value={selectedStore}
            onChange={e => setSelectedStore(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Stores</option>
            <option value="amazon">Amazon</option>
            <option value="flipkart">Flipkart</option>
            <option value="meesho">Meesho</option>
            <option value="myntra">Myntra</option>
            <option value="croma">Croma</option>
          </select>
        </div>
      </div>

      {/* FLASH DEALS ROW matching Panel 5 */}
      <section id="flash-deals-row" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
              <Zap className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Flash Deals
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Special limited-time discounts with verified highest cashback slabs
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-800/40 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Ends in 03h : 24m : 18s</span>
          </span>
        </div>

        {/* 3 Flash Deal Cards matching Panel 5 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {flashDealItems.map(item => (
            <div
              key={item.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group"
            >
              <div className="relative aspect-video rounded-2xl bg-slate-50 dark:bg-slate-950 p-4 flex items-center justify-center border border-slate-100 dark:border-slate-800 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
                <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-sm flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-white" />
                  <span>Flash Deal</span>
                </span>
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-600 text-white shadow-sm">
                  {item.discount}% OFF
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                  {item.brand}
                </span>
                <h3 className="font-black text-sm text-slate-900 dark:text-white line-clamp-1">
                  {item.name}
                </h3>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-lg font-black text-slate-950 dark:text-white">
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-slate-400 line-through">
                    ₹{item.mrp.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <Link
                to={`/compare/${item.id}`}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-600 hover:text-white dark:hover:bg-brand-600 text-slate-800 dark:text-slate-200 font-bold text-xs text-center transition-all cursor-pointer block"
              >
                View Deal
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* All Verified Deals Grid */}
      <section className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
          <span>Showing {sortedDeals.length} verified deals with live price comparisons</span>
          <span>Sorted by: AI Deal Score (Highest First)</span>
        </div>

        {sortedDeals.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
            {sortedDeals.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <Flame className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No deals match your selected filter</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Try selecting "All" or clearing the store filter.</p>
            <button
              onClick={() => {
                setActiveTab('All');
                setSelectedStore('all');
              }}
              className="px-5 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
