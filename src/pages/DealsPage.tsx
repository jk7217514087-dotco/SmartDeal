import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Zap,
  Tag,
  ExternalLink,
  ShieldCheck,
  TrendingDown
} from 'lucide-react';

export const DealsPage: React.FC = () => {
  const { products, isDarkMode, activeTheme } = useApp();
  const isWhite = !isDarkMode && (activeTheme === 'light' || activeTheme === 'pure-white');
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>('Top Deals');

  // Real-time live deals derived directly from actual product database, sorted by highest discount
  const deals = useMemo(() => {
    return [...products]
      .filter(p => (p.discountPercent && p.discountPercent > 0) || (p.mrp > p.sellingPrice))
      .map(p => ({
        ...p,
        calculatedDiscount: p.discountPercent || Math.round(((p.mrp - p.sellingPrice) / p.mrp) * 100)
      }))
      .sort((a, b) => b.calculatedDiscount - a.calculatedDiscount);
  }, [products]);

  // Featured top deal of the day dynamically calculated in real-time
  const topDeal = deals[0] || products[0];
  const maxDiscount = topDeal?.calculatedDiscount || 70;

  // Real-time unique categories dynamically extracted from product catalog
  const categories = useMemo(() => {
    const cats = Array.from(new Set(deals.map(d => d.category))).filter(Boolean);
    return ['Top Deals', ...cats];
  }, [deals]);

  const filteredDeals = useMemo(() => {
    if (activeCategory === 'Top Deals') return deals;
    return deals.filter(d => d.category.toLowerCase() === activeCategory.toLowerCase());
  }, [deals, activeCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* 2. DEALS PAGE: BUDGET BUZZ DEALS HERO BANNER MATCHING SCREEN 2 */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-950 via-indigo-900 to-purple-950 p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-indigo-700/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-3 text-center md:text-left z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-white/20 border border-white/30 text-white">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>SmartDeal Flash Spotlight</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
            Budget Buzz Deals
          </h1>

          <div className="text-xl sm:text-2xl font-black text-amber-300">
            Up to {maxDiscount}% OFF
          </div>

          <p className="text-xs sm:text-sm text-indigo-100 font-medium leading-relaxed">
            Grab the best deals before they're gone! Compare verified prices across Amazon, Flipkart, Croma & top stores.
          </p>

          <div className="pt-2 flex items-center gap-3 justify-center md:justify-start">
            <Link
              to={`/product/${topDeal.id}`}
              className="px-6 py-3 rounded-2xl bg-white text-slate-950 hover:bg-slate-100 font-black text-xs sm:text-sm shadow-xl hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4 text-blue-600" />
            </Link>
          </div>
        </div>

        {/* 3D Visual Artwork Showcase - Real-time Live Top Deal */}
        <Link
          to={`/product/${topDeal.id}`}
          className="relative z-10 shrink-0 w-48 sm:w-64 h-44 sm:h-52 flex items-center justify-center group"
          title={`View ${topDeal.name}`}
        >
          <div className="relative w-full h-full rounded-2xl bg-white/5 border border-white/10 p-3 flex items-center justify-center backdrop-blur-xs group-hover:scale-105 transition-transform">
            <img
              src={topDeal.image}
              alt={topDeal.name}
              className="max-h-full max-w-full object-contain drop-shadow-2xl"
            />
            <div className="absolute -top-2 -right-2 px-3 py-1 rounded-full bg-rose-600 text-white font-black text-xs shadow-lg transform rotate-6 border border-white/40">
              {topDeal.calculatedDiscount}% OFF
            </div>
          </div>
        </Link>
      </div>

      {/* Category Filter Pills Strip matching Screen 2 */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-black transition-all shrink-0 cursor-pointer shadow-xs ${
              activeCategory === cat
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-400/30'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Deals Grid matching Screen 2 (2 columns on mobile, 4 columns on laptop) */}
      <div id="deals-grid" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {filteredDeals.map(deal => (
          <div
            key={deal.id}
            className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-3 sm:p-4 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all relative overflow-hidden"
          >
            {/* Top Red Discount Pill */}
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white shadow-xs">
                {deal.calculatedDiscount}% OFF
              </span>
              <span className="text-amber-500 font-bold text-xs">
                ★ {deal.rating || 4.5}
              </span>
            </div>

            {/* Centered Image */}
            <Link to={`/product/${deal.id}`} className="block relative w-full h-32 sm:h-40 flex items-center justify-center p-2 group-hover:scale-105 transition-transform">
              <img
                src={deal.image}
                alt={deal.name}
                className="max-h-full max-w-full object-contain"
              />
            </Link>

            {/* Title & Price Details */}
            <div className="pt-2 space-y-1.5">
              <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {deal.name}
              </h3>

              <div className="flex items-baseline gap-1.5">
                <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  ₹{deal.sellingPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 line-through">
                  ₹{deal.mrp.toLocaleString('en-IN')}
                </span>
              </div>

              <Link
                to={`/product/${deal.id}`}
                className="mt-2 w-full py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-black text-xs text-center flex items-center justify-center gap-1 transition-all shadow-xs"
              >
                <span>View Deal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
