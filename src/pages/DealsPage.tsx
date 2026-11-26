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
      <div className="rounded-3xl bg-gradient-to-r from-[#0c0524] via-[#1b0d46] to-[#2c0e5a] p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-purple-500/30">
        {/* Ambient Neon Atmosphere Glows */}
        <div className="absolute top-0 right-10 w-80 h-80 bg-purple-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-60 h-60 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-3.5 text-center md:text-left z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-white/10 border border-white/20 text-purple-200 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>SmartDeal Flash Spotlight</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-sm">
            Budget Buzz Deals
          </h1>

          <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-amber-300 via-rose-300 to-purple-200 bg-clip-text text-transparent">
            Up to {maxDiscount}% OFF
          </div>

          <p className="text-xs sm:text-sm text-purple-100/90 font-medium leading-relaxed max-w-lg">
            Grab the best deals before they're gone! Compare verified prices across Amazon, Flipkart, Croma & top stores.
          </p>

          <div className="pt-2 flex items-center gap-3 justify-center md:justify-start">
            <Link
              to={`/product/${topDeal.id}`}
              className="px-6 py-2.5 rounded-full bg-white text-slate-950 hover:bg-slate-100 font-black text-xs sm:text-sm shadow-xl hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4 text-blue-600" />
            </Link>
          </div>
        </div>

        {/* 3D Visual Artwork Showcase - Clean Neon Isolated Packshot matching Screen 2 */}
        <Link
          to={`/product/${topDeal.id}`}
          className="relative z-10 shrink-0 w-52 sm:w-64 h-48 sm:h-56 flex flex-col items-center justify-center group cursor-pointer"
          title={`View ${topDeal.name}`}
        >
          {/* Neon Halo Aura behind 3D packshot */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/30 via-indigo-500/20 to-pink-500/30 rounded-3xl blur-xl group-hover:scale-110 transition-transform pointer-events-none" />

          {/* Clean Packshot Artwork container with zero clashing rectangular background */}
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <img
              src={topDeal.image}
              alt={topDeal.name}
              className="max-h-40 sm:max-h-44 max-w-full object-contain drop-shadow-[0_20px_35px_rgba(168,85,247,0.55)] group-hover:scale-105 transition-transform duration-300"
            />
            {/* Glowing Neon Pedestal Ellipse underneath */}
            <div className="w-32 sm:w-40 h-5 bg-gradient-to-r from-purple-500/40 via-indigo-400/50 to-pink-500/40 rounded-full blur-md -mt-2 pointer-events-none" />

            {/* 3D Floating Discount Tag matching Screen 2 */}
            <div className="absolute top-1 right-2 px-3 py-1 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-black text-xs shadow-xl transform rotate-12 border border-white/40 group-hover:scale-110 transition-transform">
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
        {filteredDeals.map(deal => {
          const shortName = deal.name.split('(')[0].trim();
          return (
            <div
              key={deal.id}
              className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 p-3 sm:p-4 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all relative overflow-hidden"
            >
              {/* Top Red Discount Pill & Rating */}
              <div className="flex items-center justify-between mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white shadow-xs">
                  {deal.calculatedDiscount}% OFF
                </span>
                <span className="text-amber-500 font-bold text-xs">
                  ★ {deal.rating || 4.5}
                </span>
              </div>

              {/* Centered Isolated Packshot Image */}
              <Link
                to={`/product/${deal.id}`}
                className="block relative w-full h-32 sm:h-36 flex items-center justify-center p-2 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 my-1 group-hover:scale-105 transition-transform"
                title={deal.name}
              >
                <img
                  src={deal.image}
                  alt={deal.name}
                  className="max-h-full max-w-full object-contain drop-shadow-xs"
                  loading="lazy"
                />
              </Link>

              {/* Title & Price Details */}
              <div className="pt-2 space-y-1.5">
                <h3
                  className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                  title={deal.name}
                >
                  {shortName || deal.name}
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
                  className="mt-2 w-full py-2 rounded-xl bg-[#eef4ff] hover:bg-[#dbeafe] text-[#2563eb] dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/60 font-black text-xs text-center flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>View Deal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
