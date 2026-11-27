import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/common/ProductCard';
import { MarketplaceBadge } from '../components/common/MarketplaceBadge';
import {
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Zap,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { products, trackActivity, isDarkMode } = useApp();
  const heroTheme = {
    heroSectionBg: isDarkMode 
      ? 'bg-gradient-to-b from-[#071324] via-[#0b1329] to-[#0e223f]' 
      : 'bg-gradient-to-b from-[#f8fafd] via-[#ffffff] to-[#f1f5f9]',
    heroBorder: isDarkMode ? 'border-slate-800' : 'border-slate-200/80',
    badgeBg: isDarkMode ? 'bg-slate-800/80' : 'bg-blue-50',
    badgeBorder: isDarkMode ? 'border-slate-700' : 'border-blue-200',
    badgeText: isDarkMode ? 'text-blue-300' : 'text-blue-700',
    badgeIcon: isDarkMode ? 'text-blue-400' : 'text-blue-600',
    titleGradient: 'text-blue-600 font-extrabold',
    searchContainer: isDarkMode 
      ? 'bg-slate-900 border-slate-700 focus-within:border-blue-500' 
      : 'bg-white border-slate-200/90 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20',
    searchBtn: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-extrabold',
    pillBg: isDarkMode 
      ? 'bg-slate-800/90 hover:bg-slate-700 border-slate-700 text-slate-200' 
      : 'bg-white hover:bg-blue-50 border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 shadow-xs',
  };
  const navigate = useNavigate();
  const [bannerSlide, setBannerSlide] = useState(0);
  const [isBannerPaused, setIsBannerPaused] = useState(false);

  // Top Live Real Offer Products directly from catalog (no fake data, real images, real discount %)
  const realOfferProducts = useMemo(() => {
    return [...products]
      .filter(p => p.discountPercent > 0 || (p.mrp > p.sellingPrice))
      .map(p => {
        const lowestStore = (p.marketplacePrices || [])
          .filter(m => !m.isSmartDealsSeller && !m.sellerName.toLowerCase().includes('smartdeal'))
          .sort((a, b) => a.finalPrice - b.finalPrice)[0];

        const realStoreName = lowestStore?.sellerName || p.seller || 'Amazon';
        const realDiscount = p.discountPercent || Math.round(((p.mrp - p.sellingPrice) / p.mrp) * 100);
        const realSavings = Math.max(0, p.mrp - p.sellingPrice);

        return {
          product: p,
          storeName: realStoreName,
          discount: realDiscount,
          savings: realSavings
        };
      })
      .sort((a, b) => b.discount - a.discount)
      .slice(0, 8);
  }, [products]);

  // Auto-scroll real product offer ads every 3 seconds (3000ms) with hover pause
  useEffect(() => {
    if (isBannerPaused || realOfferProducts.length === 0) return;
    const bannerTimer = setInterval(() => {
      setBannerSlide(prev => (prev + 1) % realOfferProducts.length);
    }, 3000);
    return () => clearInterval(bannerTimer);
  }, [isBannerPaused, realOfferProducts.length]);

  const activeOffer = realOfferProducts.length > 0
    ? realOfferProducts[bannerSlide % realOfferProducts.length]
    : null;

  // Section 3: Real-time Live Click Page / Budget Buzz Deals
  const clickPageDeals = useMemo(() => {
    return [...products]
      .filter(p => (p.discountPercent && p.discountPercent > 0) || (p.mrp > p.sellingPrice))
      .map(p => ({
        ...p,
        calculatedDiscount: p.discountPercent || Math.round(((p.mrp - p.sellingPrice) / p.mrp) * 100)
      }))
      .sort((a, b) => b.calculatedDiscount - a.calculatedDiscount)
      .slice(0, 4);
  }, [products]);

  const maxDealDiscount = useMemo(() => {
    return Math.max(...clickPageDeals.map(p => p.calculatedDiscount), 70);
  }, [clickPageDeals]);

  return (
    <div className="space-y-10 pb-16 w-full max-w-full overflow-x-hidden">
      {/* 1. HERO SECTION: EXPANDED FULL-WIDTH SHOWCASE AD BANNER (Red Marked Area Size) */}
      <section className={`relative border-b ${heroTheme.heroSectionBg} ${heroTheme.heroBorder} py-3 sm:py-6 transition-all`}>
        <div className="w-full max-w-[1500px] mx-auto px-2 sm:px-4 md:px-6">
          {/* Full-Width Showcase Ad Banner - Sized to Red Marked Region */}
          <div className="w-full">
            {activeOffer && (
              <div
                className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-indigo-500/30 bg-gradient-to-r from-[#0b1329] via-[#161f38] to-[#1e1b4b] text-white p-4 sm:p-8 md:p-12 lg:p-14 flex flex-row items-center justify-between min-h-[200px] sm:min-h-[280px] md:min-h-[380px] lg:min-h-[460px] group select-none transition-all"
                onMouseEnter={() => setIsBannerPaused(true)}
                onMouseLeave={() => setIsBannerPaused(false)}
              >
                {/* Subtle Background Neon Atmosphere Glows */}
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 left-10 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />

                {/* Left Column: Real Brand, Store, Name, Real % Offer, Real Prices */}
                <div className="relative z-10 flex-1 min-w-0 pr-3 sm:pr-8 md:pr-12 space-y-2 sm:space-y-4 md:space-y-5 text-left">
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-start">
                    <MarketplaceBadge storeName={activeOffer.storeName} size="md" />
                    <span className="text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-wider text-purple-200 bg-white/10 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-md border border-white/15">
                      {activeOffer.product.brand}
                    </span>
                    {/* Real Active Discount Badge */}
                    <span className="text-xs sm:text-sm md:text-base font-black px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-md bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md ring-1 ring-white/30 animate-pulse">
                      {activeOffer.discount}% OFF
                    </span>
                  </div>

                  {/* Real Product Name */}
                  <Link
                    to={`/product/${activeOffer.product.id}`}
                    className="block font-black text-sm sm:text-2xl md:text-3xl lg:text-4xl text-white hover:text-purple-300 transition-colors line-clamp-2 leading-tight drop-shadow-md"
                    title={activeOffer.product.name}
                  >
                    {activeOffer.product.name}
                  </Link>

                  {/* Real Price Line */}
                  <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap justify-start pt-0.5 sm:pt-1">
                    <span className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight">
                      ₹{activeOffer.product.sellingPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs sm:text-base md:text-xl text-purple-200/60 line-through">
                      ₹{activeOffer.product.mrp.toLocaleString('en-IN')}
                    </span>
                    {activeOffer.savings > 0 && (
                      <span className="text-xs sm:text-base md:text-lg font-extrabold text-amber-300">
                        Save ₹{activeOffer.savings.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  {/* Shop Now CTA Button */}
                  <div className="pt-2 sm:pt-3 flex items-center justify-start">
                    <Link
                      to={`/product/${activeOffer.product.id}`}
                      className="inline-flex items-center gap-2 sm:gap-2.5 px-4 sm:px-8 md:px-10 py-2 sm:py-3.5 md:py-4 rounded-full bg-white hover:bg-slate-100 active:scale-95 text-slate-950 font-black text-xs sm:text-base md:text-lg shadow-2xl transition-all cursor-pointer hover:scale-105"
                    >
                      <span>Shop Now</span>
                      <ArrowRight className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-purple-700" />
                    </Link>
                  </div>
                </div>

                {/* Right Column: Premium Isolated Showcase Frame */}
                <Link
                  to={`/product/${activeOffer.product.id}`}
                  className="relative z-10 w-36 sm:w-64 md:w-84 lg:w-[420px] h-36 sm:h-64 md:h-80 lg:h-[390px] shrink-0 flex flex-col items-center justify-center group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                  title={activeOffer.product.name}
                >
                  {/* Neon Glow behind artwork frame */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/30 via-indigo-500/20 to-pink-500/30 rounded-3xl blur-2xl pointer-events-none" />

                  {/* Clean Packshot Frame with Soft Rounded Container */}
                  <div className="relative w-full h-full rounded-2xl sm:rounded-3xl bg-white/95 dark:bg-slate-900/90 p-2.5 sm:p-4 md:p-6 shadow-2xl border border-white/40 dark:border-white/10 flex items-center justify-center overflow-hidden backdrop-blur-xs">
                    <img
                      key={activeOffer.product.id}
                      src={activeOffer.product.image}
                      alt={activeOffer.product.name}
                      className="max-h-full max-w-full object-contain rounded-xl drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                      loading="eager"
                    />

                    {/* 3D Floating Discount Tag inside Frame */}
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 px-2 sm:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 text-white font-black text-[10px] sm:text-xs shadow-lg transform rotate-6 border border-white/40">
                      {activeOffer.discount}% OFF
                    </div>
                  </div>
                </Link>

                {/* Left Arrow */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setBannerSlide(prev => (prev - 1 + realOfferProducts.length) % realOfferProducts.length);
                  }}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3.5 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white backdrop-blur-xs transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-xl z-20"
                  title="Previous Deal"
                >
                  <ChevronLeft className="w-5 sm:w-6 h-5 sm:h-6" />
                </button>

                {/* Right Arrow */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setBannerSlide(prev => (prev + 1) % realOfferProducts.length);
                  }}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3.5 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white backdrop-blur-xs transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-xl z-20"
                  title="Next Deal"
                >
                  <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6" />
                </button>

                {/* 3-Second Pagination Dots Bar */}
                <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5 sm:gap-2 pointer-events-auto z-20">
                  {realOfferProducts.map((item, idx) => (
                    <button
                      key={item.product.id}
                      onClick={() => setBannerSlide(idx)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        bannerSlide === idx
                          ? 'w-7 sm:w-9 bg-white shadow-md'
                          : 'w-2 sm:w-2.5 bg-white/40 hover:bg-white/70'
                      }`}
                      title={`Deal ${idx + 1}: ${item.product.name}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Marketplace Partner Badges Row - Slightly Bigger Size (Only Ads & Store Badges in Pink Section as requested) */}
          <div className="pt-2 sm:pt-4 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {[
              { name: 'amazon', color: 'bg-[#131921] text-amber-400 border-slate-700 hover:border-amber-400' },
              { name: 'Flipkart', color: 'bg-[#2874f0] text-yellow-300 border-blue-400 hover:border-yellow-300' },
              { name: 'meesho', color: 'bg-[#f43397] text-white border-pink-400 hover:border-white' },
              { name: 'myntra', color: 'bg-white text-[#ff3f6c] border-pink-200 hover:border-[#ff3f6c]' },
              { name: 'AJIO', color: 'bg-[#2c4152] text-white border-slate-600 hover:border-white' },
              { name: 'TATA CLiQ', color: 'bg-[#1f2228] text-rose-400 border-slate-700 hover:border-rose-400' },
              { name: 'CROMA', color: 'bg-[#00e9bf]/20 text-teal-600 dark:text-teal-300 border-teal-500/40 hover:border-teal-400' },
              { name: 'Reliance digital', color: 'bg-[#e42529] text-white border-red-500 hover:border-white' },
              { name: '+ More', color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-slate-400' },
            ].map(partner => (
              <button
                key={partner.name}
                type="button"
                onClick={() => navigate(`/search?q=${encodeURIComponent(partner.name.replace('+', '').trim())}`)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black border shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer ${partner.color}`}
              >
                {partner.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. FINDING PRODUCTS SECTION (5 COLUMNS: 4 PRODUCTS + EXCLUSIVE DEALS CARD MATCHING PANEL 2) */}
      <section className="max-w-7xl mx-auto px-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>Finding Products</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                Verified Best Prices
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Comparing live prices across Amazon, Flipkart, Croma, Myntra & partner stores
            </p>
          </div>
          <Link
            to="/categories"
            className="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
          {/* Card 1: iPhone 15 */}
          {products.find(p => p.id === 'prod-apple-iphone15') && (
            <ProductCard product={products.find(p => p.id === 'prod-apple-iphone15')!} variant="finding-products" />
          )}

          {/* Card 2: MacBook Air or HP Pavilion */}
          {(products.find(p => p.id === 'prod-macbook-air-m2') || products.find(p => p.id === 'prod-hp-pavilion-15')) && (
            <ProductCard product={(products.find(p => p.id === 'prod-macbook-air-m2') || products.find(p => p.id === 'prod-hp-pavilion-15'))!} variant="finding-products" />
          )}

          {/* Card 3: Sony WH-1000XM5 or boAt Airdopes */}
          {(products.find(p => p.id === 'prod-sony-wh1000xm5') || products.find(p => p.id === 'prod-boat-airdopes')) && (
            <ProductCard product={(products.find(p => p.id === 'prod-sony-wh1000xm5') || products.find(p => p.id === 'prod-boat-airdopes'))!} variant="finding-products" />
          )}

          {/* Card 4: Nike Running Shoes or Court Vision */}
          {(products.find(p => p.id === 'prod-nike-court-vision') || products.find(p => p.id === 'prod-nike-running-shoes')) && (
            <ProductCard product={(products.find(p => p.id === 'prod-nike-court-vision') || products.find(p => p.id === 'prod-nike-running-shoes'))!} variant="finding-products" />
          )}

          {/* Card 5: Exclusive Deals & Offers! Gradient Card matching Panel 2 */}
          <div className="rounded-3xl p-5 text-white flex flex-col justify-between shadow-xl relative overflow-hidden group transition-all duration-300 min-h-[340px] bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 border border-indigo-400/40">
            <div className="absolute top-0 right-0 w-36 h-36 rounded-full blur-2xl pointer-events-none opacity-40 bg-white/20" />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-30 bg-white/20" />
            <div className="space-y-3 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-white/20 border border-white/30 text-white">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>SmartDeal Exclusive</span>
              </div>
              <h3 className="text-xl font-black leading-tight text-white">
                Exclusive Deals & Offers!
              </h3>
              <p className="text-xs text-indigo-100 leading-snug">
                Save more with SmartDeal Premium and unlock exclusive partner prices.
              </p>
            </div>

            <div className="pt-4 space-y-4 relative z-10">
              <div className="text-3xl text-amber-300">👑</div>
              <Link
                to="/deals"
                className="w-full py-2.5 px-4 rounded-xl font-black text-xs text-center flex items-center justify-center gap-1.5 shadow-lg bg-white text-indigo-700 hover:bg-slate-50 transition-all cursor-pointer active:scale-95"
              >
                <span>Explore Deals →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CLICK PAGE / BUDGET BUZZ DEALS SECTION MATCHING REFERENCE PANEL 3 */}
      <section className="max-w-7xl mx-auto px-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              3. Click Page
            </h2>
          </div>
        </div>

        {/* Deep Violet/Indigo Gradient Banner matching Reference Panel 3 */}
        <div className="rounded-3xl bg-gradient-to-r from-[#0c0524] via-[#1b0d46] to-[#2c0e5a] p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-purple-500/30">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 left-10 w-60 h-60 bg-indigo-600/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-2 text-center md:text-left z-10">
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-white drop-shadow-sm">
              Budget Buzz Deals
            </h3>
            <p className="text-sm sm:text-base font-extrabold bg-gradient-to-r from-amber-300 via-rose-300 to-purple-200 bg-clip-text text-transparent">
              Up to {maxDealDiscount}% OFF • Grab the hottest deals before they're gone!
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 z-10">
            <Link
              to="/deals"
              className="px-6 py-2.5 rounded-full bg-white text-slate-950 hover:bg-slate-100 font-black text-xs sm:text-sm shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4 text-purple-700" />
            </Link>
          </div>
        </div>

        {/* Category Pills directly below Banner matching Panel 3 */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          {['Top Deals', 'Electronics', 'Fashion', 'Mobiles', 'Home & Living', 'Laptops'].map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                const q = tab === 'Top Deals' ? '' : tab;
                if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
              }}
              className="px-4 py-1.5 rounded-full text-xs font-black bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 transition-all shrink-0 cursor-pointer shadow-xs"
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 4 Clean Deal Cards Row matching Panel 3 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-2">
          {clickPageDeals.map(deal => {
            const shortName = deal.name.split('(')[0].trim();
            return (
              <div
                key={deal.id}
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 p-3 sm:p-4 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all relative overflow-hidden"
              >
                {/* Top Red Discount Pill */}
                <div className="flex items-center justify-between mb-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white shadow-xs">
                    {deal.calculatedDiscount}% OFF
                  </span>
                  <span className="text-amber-500 font-bold text-xs">
                    ★ {deal.rating || 4.5}
                  </span>
                </div>

                {/* Centered Isolated Image */}
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
                <div className="pt-2 space-y-1">
                  <h4
                    className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                    title={deal.name}
                  >
                    {shortName || deal.name}
                  </h4>
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
                    className="mt-2 w-full py-1.5 rounded-xl bg-[#eef4ff] hover:bg-[#dbeafe] text-[#2563eb] dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/60 font-black text-xs text-center flex items-center justify-center gap-1 transition-colors shadow-xs"
                  >
                    <span>View Deal</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
