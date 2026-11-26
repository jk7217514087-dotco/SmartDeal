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
  Bell
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
  const [heroSearch, setHeroSearch] = useState('');
  const [heroSlide, setHeroSlide] = useState(0);

  // High-converting 2-Second Rotating Hero Discount Ads (matching reference panel 1)
  const heroDiscountAds = [
    {
      id: 'h-ad-apple',
      productTitle: 'Apple iPhone 15 (Blue, 128 GB)',
      category: 'Smartphones',
      discountBadge: 'MEGA DEAL • SAVE ₹10,000',
      discountPercent: '11% OFF',
      sellingPrice: '₹79,999',
      mrp: '₹89,999',
      storeName: 'Meesho',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
      targetUrl: '/product/prod-apple-iphone15',
    },
    {
      id: 'h-ad-hp',
      productTitle: 'HP Pavilion 15 (Core i5 12th Gen, 16GB)',
      category: 'Laptops',
      discountBadge: 'SUPER VALUE • SAVE ₹15,000',
      discountPercent: '21% OFF',
      sellingPrice: '₹54,990',
      mrp: '₹69,990',
      storeName: 'Flipkart',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80',
      targetUrl: '/product/prod-hp-pavilion-15',
    },
    {
      id: 'h-ad-boat',
      productTitle: 'boAt Airdopes 141 Bluetooth TWS Earbuds',
      category: 'Audio',
      discountBadge: 'MASSIVE SAVING • SAVE ₹3,191',
      discountPercent: '71% OFF',
      sellingPrice: '₹1,299',
      mrp: '₹4,490',
      storeName: 'Amazon',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
      targetUrl: '/product/prod-boat-airdopes',
    },
    {
      id: 'h-ad-nike',
      productTitle: 'Nike Revolution 6 Running Shoes',
      category: 'Footwear',
      discountBadge: 'FASHION DROP • SAVE ₹2,496',
      discountPercent: '50% OFF',
      sellingPrice: '₹2,499',
      mrp: '₹4,995',
      storeName: 'Myntra',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
      targetUrl: '/product/prod-nike-running-shoes',
    },
    {
      id: 'h-ad-noise',
      productTitle: 'Noise Endeavour Pro Rugged Smart Watch',
      category: 'Wearables',
      discountBadge: 'SMART CHOICE • SAVE ₹10,000',
      discountPercent: '50% OFF',
      sellingPrice: '₹9,999',
      mrp: '₹19,999',
      storeName: 'Amazon',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      targetUrl: '/product/prod-noise-endeavour-pro',
    },
    {
      id: 'h-ad-fridge',
      productTitle: 'Samsung 253L Smart Frost Free Refrigerator',
      category: 'Appliances',
      discountBadge: 'HOME SAVER • SAVE ₹14,000',
      discountPercent: '38% OFF',
      sellingPrice: '₹22,990',
      mrp: '₹36,990',
      storeName: 'Croma',
      image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop&q=80',
      targetUrl: '/product/prod-samsung-refrigerator-253l',
    }
  ];

  // Auto-scroll discount ad image showcase every 2 seconds (2000ms)
  useEffect(() => {
    const heroTimer = setInterval(() => {
      setHeroSlide(prev => (prev + 1) % heroDiscountAds.length);
    }, 2000);
    return () => clearInterval(heroTimer);
  }, [heroDiscountAds.length]);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      trackActivity('SEARCH_PRODUCT', { query: heroSearch.trim(), source: 'hero_search' });
      navigate(`/search?q=${encodeURIComponent(heroSearch.trim())}`);
    }
  };

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
      {/* 1. HERO SECTION: STREAMLINED & CONVERSION-OPTIMIZED MATCHING REFERENCE PANEL 1 */}
      <section className={`relative border-b ${heroTheme.heroSectionBg} ${heroTheme.heroBorder} py-8 sm:py-12 transition-all`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Heading, Search & Partner Badges */}
            <div className="lg:col-span-7 space-y-5 text-left">
              {/* Trust Badge matching Panel 1 */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-xs transition-all bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-xs font-bold tracking-wide">
                  SmartDeal Platform • Intelligent Comparison
                </span>
              </div>

              {/* Main Headline matching Reference Image */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                  Find the Best Price. <br />
                  Compare. Save. <span className="text-blue-600">Buy Smarter.</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl font-medium">
                  Compare prices, track deals and discover the biggest savings across top marketplaces.
                </p>
              </div>

              {/* Search Bar matching Panel 1 */}
              <form onSubmit={handleHeroSearch} className="max-w-xl">
                <div className={`relative flex items-center rounded-2xl p-2 border transition-all ${heroTheme.searchContainer}`}>
                  <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                  <input
                    type="text"
                    value={heroSearch}
                    onChange={e => setHeroSearch(e.target.value)}
                    placeholder="Search products, brands or categories..."
                    className={`w-full bg-transparent px-3 py-2 text-sm ${isDarkMode ? 'text-white placeholder-slate-400' : 'text-slate-900 placeholder-slate-400'} focus:outline-none`}
                  />
                  <button
                    type="submit"
                    className={`px-6 py-2.5 rounded-xl font-black text-xs transition-all shrink-0 cursor-pointer active:scale-95 shadow-lg ${heroTheme.searchBtn}`}
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Marketplace Partner Badges Row matching Panel 1 */}
              <div className="pt-2">
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { name: 'amazon', color: 'bg-[#131921] text-amber-400 border-slate-700' },
                    { name: 'Flipkart', color: 'bg-[#2874f0] text-yellow-300 border-blue-400' },
                    { name: 'meesho', color: 'bg-[#f43397] text-white border-pink-400' },
                    { name: 'myntra', color: 'bg-white text-[#ff3f6c] border-pink-200' },
                    { name: 'AJIO', color: 'bg-[#2c4152] text-white border-slate-600' },
                    { name: 'TATA CLiQ', color: 'bg-[#1f2228] text-rose-400 border-slate-700' },
                    { name: 'CROMA', color: 'bg-[#00e9bf]/20 text-teal-600 dark:text-teal-300 border-teal-500/40' },
                    { name: 'Reliance digital', color: 'bg-[#e42529] text-white border-red-500' },
                    { name: '+ More', color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700' },
                  ].map(partner => (
                    <button
                      key={partner.name}
                      type="button"
                      onClick={() => navigate(`/search?q=${encodeURIComponent(partner.name.replace('+', '').trim())}`)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold border shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer ${partner.color}`}
                    >
                      {partner.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Auto-Scrolling 2-Second Discount Ad Showcase matching Panel 1 */}
            <div className="lg:col-span-5 flex justify-center relative w-full">
              <div className="relative w-full max-w-[360px] sm:max-w-[430px] rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden p-4 sm:p-5 flex flex-col justify-between transition-all duration-300">
                {/* Floating Save Up To Badge matching Panel 1 */}
                <div className="absolute top-3.5 right-3.5 z-20 px-3 py-1 rounded-xl font-black text-[11px] shadow-md flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <span>Save Up To ₹12,999</span>
                  <ExternalLink className="w-3 h-3" />
                </div>

                {/* Rotating Ad Content with 2-Second Transition */}
                <div className="relative z-10 w-full flex flex-col items-center">
                  {/* Top Store Badge Row */}
                  <div className="w-full flex items-center justify-between gap-2 pr-36 mb-2">
                    <MarketplaceBadge storeName={heroDiscountAds[heroSlide].storeName} size="sm" />
                  </div>

                  {/* Product Image Stage with Glow Background */}
                  <Link
                    to={heroDiscountAds[heroSlide].targetUrl}
                    className="relative w-full h-40 sm:h-48 flex items-center justify-center my-1 group cursor-pointer"
                  >
                    <div className="absolute w-36 h-36 rounded-full bg-blue-500/10 blur-xl pointer-events-none" />
                    <img
                      key={heroDiscountAds[heroSlide].id}
                      src={heroDiscountAds[heroSlide].image}
                      alt={heroDiscountAds[heroSlide].productTitle}
                      className="h-full max-h-40 sm:max-h-48 w-auto object-contain drop-shadow-xl transition-all duration-300 animate-fadeIn group-hover:scale-105"
                    />
                  </Link>

                  {/* Product Title & Price Details */}
                  <div className="w-full text-left pt-2 space-y-1">
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm line-clamp-1 hover:text-blue-600 transition-colors">
                      {heroDiscountAds[heroSlide].productTitle}
                    </h3>

                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                          {heroDiscountAds[heroSlide].sellingPrice}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          {heroDiscountAds[heroSlide].mrp}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded">
                          {heroDiscountAds[heroSlide].discountPercent}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 2-Second Rotating Progress Pagination Dots */}
                  <div className="flex items-center gap-1.5 pt-3">
                    {heroDiscountAds.map((ad, idx) => (
                      <button
                        key={ad.id}
                        onClick={() => setHeroSlide(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          heroSlide === idx ? 'w-6 bg-blue-600' : 'w-1.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                        }`}
                        title={`Slide ${idx + 1}: ${ad.productTitle}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 FEATURE / VALUE PROPOSITION CARDS MATCHING REFERENCE SCREEN 1 */}
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className={`p-4 rounded-2xl border transition-all ${isDarkMode ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white border-slate-200/90 text-slate-800 shadow-xs'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-900">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Real-Time Price Tracking</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Instant price updates across stores</p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border transition-all ${isDarkMode ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white border-slate-200/90 text-slate-800 shadow-xs'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-900">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Trusted & Secure Shopping</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">100% verified merchant listings</p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border transition-all ${isDarkMode ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white border-slate-200/90 text-slate-800 shadow-xs'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-900">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Get Alerts on Price Drop</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Notifications at your target price</p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border transition-all ${isDarkMode ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white border-slate-200/90 text-slate-800 shadow-xs'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-200 dark:border-purple-900">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Smart Deals Just for You</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">AI-powered lowest price picks</p>
                </div>
              </div>
            </div>
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

      {/* 3. CLICK PAGE / BUDGET BUZZ DEALS SECTION MATCHING REFERENCE PANEL 3 */}
      <section className="max-w-7xl mx-auto px-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              3. Click Page
            </h2>
          </div>
        </div>

        {/* Deep Violet/Indigo Gradient Banner matching Reference Panel 3 */}
        <div className="rounded-3xl bg-gradient-to-r from-blue-950 via-indigo-900 to-purple-950 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-indigo-700/40">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-2 text-center md:text-left z-10">
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Budget Buzz Deals
            </h3>
            <p className="text-sm sm:text-base font-extrabold text-amber-300">
              Up to {maxDealDiscount}% OFF • Grab the hottest deals before they're gone!
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 z-10">
            <Link
              to="/deals"
              className="px-6 py-3 rounded-2xl bg-white text-slate-950 hover:bg-slate-100 font-black text-xs sm:text-sm shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4 text-blue-600" />
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
          {clickPageDeals.map(deal => (
            <div
              key={deal.id}
              className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-3 sm:p-4 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-blue-400 transition-all relative overflow-hidden"
            >
              {/* Top Red Discount Pill */}
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white shadow-xs">
                  {deal.calculatedDiscount}% OFF
                </span>
              </div>

              {/* Centered Image */}
              <Link to={`/product/${deal.id}`} className="block relative w-full h-32 sm:h-36 flex items-center justify-center p-2 group-hover:scale-105 transition-transform">
                <img
                  src={deal.image}
                  alt={deal.name}
                  className="max-h-full max-w-full object-contain"
                />
              </Link>

              {/* Title & Price Details */}
              <div className="pt-2 space-y-1">
                <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {deal.name}
                </h4>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                    ₹{deal.sellingPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                    ₹{deal.mrp.toLocaleString('en-IN')}
                  </span>
                </div>

                <Link
                  to={`/product/${deal.id}`}
                  className="mt-2 w-full py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-black text-xs text-center flex items-center justify-center gap-1 transition-all"
                >
                  <span>View Deal</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
