import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/common/ProductCard';
import { mockCategories } from '../data/mockProducts';
import {
  Sparkles,
  ArrowRight,
  Flame,
  Layers,
  Clock,
  Zap,
  Tag,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Percent,
  ShoppingBag,
  TrendingDown,
  Search,
  CheckCircle2,
  Calculator,
  SlidersHorizontal,
  Coins,
  Bot,
  Activity,
  Truck,
  RotateCcw,
  Headphones,
  Lock
} from 'lucide-react';

interface PromoAd {
  id: string;
  badge: string;
  store: string;
  storeColor: string;
  headline: string;
  subhead: string;
  discount: string;
  ctaText: string;
  link: string;
  bgGradient: string;
  image: string;
}

export const HomePage: React.FC = () => {
  const { products, trackActivity } = useApp();
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [flashTime, setFlashTime] = useState({ hours: 7, minutes: 24, seconds: 15 });

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      trackActivity('SEARCH_PRODUCT', { query: heroSearch.trim(), source: 'hero_search' });
      navigate(`/search?q=${encodeURIComponent(heroSearch.trim())}`);
    }
  };

  // Promotional Ad Banners for the Top Carousel
  const promoAds: PromoAd[] = [
    {
      id: 'ad-amazon-electronics',
      badge: 'SPONSORED AD • MEGA SALE',
      store: 'Amazon India',
      storeColor: 'bg-amber-500 text-slate-950',
      headline: 'Amazon Electronics Fest',
      subhead: 'Up to 70% Off on Smartphones, Audio & Laptops + Extra ₹2,500 Instant Bank Discount',
      discount: 'UP TO 70% OFF',
      ctaText: 'Shop Amazon Deals',
      link: '/categories?cat=Electronics',
      bgGradient: 'from-slate-900 via-indigo-950 to-blue-950',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'ad-flipkart-mobiles',
      badge: 'PROMOTIONAL AD • BEST PRICE',
      store: 'Flipkart',
      storeColor: 'bg-blue-500 text-white',
      headline: 'Flipkart Super Value Week',
      subhead: 'Lowest Verified Prices on Samsung, Apple & OnePlus 5G Phones with Free Next-Day Delivery',
      discount: 'SAVE UP TO ₹12,000',
      ctaText: 'View Flipkart Offers',
      link: '/categories?cat=Mobiles',
      bgGradient: 'from-blue-950 via-slate-900 to-indigo-950',
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'ad-croma-appliances',
      badge: 'OFFICIAL PARTNER AD',
      store: 'Croma Retail',
      storeColor: 'bg-teal-500 text-slate-950',
      headline: 'Croma Tech Carnival',
      subhead: 'High-Performance Laptops, 4K Smart TVs & Premium Audio with Genuine Brand Warranty',
      discount: 'FLAT 45% OFF',
      ctaText: 'Explore Croma Deals',
      link: '/categories?cat=Laptops',
      bgGradient: 'from-teal-950 via-slate-900 to-cyan-950',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'ad-fashion-sneakers',
      badge: 'SPONSORED BRAND AD',
      store: 'Myntra & Ajio',
      storeColor: 'bg-rose-500 text-white',
      headline: 'Sneaker & Fashion Gala',
      subhead: 'Nike, Puma, Adidas Running Shoes & Trendy Apparel with 100% Verified Quality Guarantee',
      discount: 'MIN. 50% OFF',
      ctaText: 'Grab Fashion Deals',
      link: '/categories?cat=Shoes',
      bgGradient: 'from-purple-950 via-slate-900 to-rose-950',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80'
    }
  ];

  // Auto-slide advertisement carousel every 5 seconds
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % promoAds.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, [promoAds.length]);

  // Flash sale countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setFlashTime(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 8, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter products by selected category
  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => {
        const catFilter = selectedCategory.toLowerCase();
        const pCat = p.category.toLowerCase();
        return pCat === catFilter ||
          (catFilter.includes('fashion') && (pCat === 'fashion' || p.name.toLowerCase().includes('shoe'))) ||
          (catFilter.includes('shoe') && (pCat === 'fashion' || p.name.toLowerCase().includes('shoe')));
      });

  // High discount products for Lightning Flash Deals section
  const flashProducts = [...products].sort((a, b) => b.discountPercent - a.discountPercent).slice(0, 6);

  return (
    <div className="space-y-10 pb-16 w-full max-w-full overflow-x-hidden">
      {/* SECTION 4.2 & 4.3: PANEL 1 HERO SECTION (2-COLUMN WITH FLOATING SHOWCASE) */}
      <section className="relative overflow-hidden w-full max-w-full bg-gradient-to-b from-[#080d1a] via-[#0B0F19] to-[#0B0F19] text-white pt-8 pb-12 border-b border-slate-800/80 -mt-2">
        <div className="hidden sm:block absolute top-1/4 left-1/4 w-[600px] h-[350px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="hidden sm:block absolute top-1/3 right-1/4 w-[500px] h-[300px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 relative z-10 w-full overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Heading, Subtitle, Search Bar & Category Pills */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-bold">
                <ShoppingBag className="w-3.5 h-3.5 text-blue-400" />
                <span>SmartDeal Platform</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight leading-tight text-white">
                  Find the Best Price. <br />
                  <span>Compare. Save. </span>
                  <span className="text-blue-500">Buy Smarter.</span>
                </h1>

                <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                  Compare prices, offers and deals across multiple marketplaces before you buy.
                </p>
              </div>

              {/* Search Bar matching Panel 1 */}
              <form onSubmit={handleHeroSearch} className="max-w-xl">
                <div className="relative flex items-center bg-[#111827] rounded-2xl p-2 border border-slate-700/80 shadow-2xl focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                  <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                  <input
                    type="text"
                    value={heroSearch}
                    onChange={e => setHeroSearch(e.target.value)}
                    placeholder="Search products, brands or categories..."
                    className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs shadow-md shadow-blue-500/25 transition-all shrink-0 cursor-pointer"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Category pill shortcuts directly under search matching Panel 1 */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-300">
                {[
                  { name: 'iPhone', query: 'iPhone 15' },
                  { name: 'Laptop', query: 'Laptop' },
                  { name: 'Headphones', query: 'Headphones' },
                  { name: 'Shoes', query: 'Shoes' },
                  { name: 'TV', query: 'TV' },
                  { name: 'Smartwatch', query: 'Smartwatch' },
                  { name: 'Refrigerator', query: 'Refrigerator' }
                ].map(item => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => navigate(`/search?q=${encodeURIComponent(item.query)}`)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#131b2e] hover:bg-blue-600/30 border border-slate-700 hover:border-blue-500 text-slate-200 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Composite Multi-Device Glowing Showcase from Panel 1 */}
            <div className="lg:col-span-5 flex justify-center relative w-full overflow-hidden sm:overflow-visible">
              <div className="relative w-full max-w-[320px] sm:max-w-[420px] aspect-square flex items-center justify-center">
                {/* Glowing neon circular pedestal */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600/20 via-purple-600/20 to-cyan-500/10 blur-2xl animate-pulse" />
                <div className="absolute w-72 h-72 rounded-full border border-blue-500/30 bg-[#0B0F19]/80 shadow-[0_0_50px_rgba(37,99,235,0.25)] flex items-center justify-center">
                  <div className="w-56 h-56 rounded-full border border-purple-500/20 bg-gradient-to-b from-blue-950/40 to-purple-950/40" />
                </div>

                {/* Floating Best Price Badge */}
                <div className="absolute top-4 right-4 z-20 px-3.5 py-1.5 rounded-xl bg-[#0c1427]/90 backdrop-blur-md border border-emerald-500/40 text-emerald-400 font-extrabold text-xs shadow-xl flex items-center gap-2 animate-bounce">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Best Price: ₹54,990</span>
                </div>

                {/* Floating Up to 50% Savings Badge */}
                <div className="absolute bottom-6 right-2 z-20 px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-900/90 to-indigo-900/90 backdrop-blur-md border border-purple-400/40 text-purple-200 font-black text-xs shadow-xl flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Up to 50% Savings</span>
                </div>

                {/* Tech Devices Composition */}
                <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
                  {/* Laptop */}
                  <img
                    src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80"
                    alt="Laptop"
                    className="absolute w-52 h-36 object-cover rounded-xl shadow-2xl border border-slate-700/80 -rotate-3 -translate-y-6"
                  />
                  {/* Phone */}
                  <img
                    src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80"
                    alt="iPhone"
                    className="absolute w-28 h-44 object-cover rounded-2xl shadow-2xl border border-blue-500/50 -translate-x-20 translate-y-4 rotate-6 z-10"
                  />
                  {/* Headphones */}
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
                    alt="Headphones"
                    className="absolute w-28 h-28 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] translate-x-20 translate-y-6 z-10"
                  />
                  {/* Smartwatch */}
                  <img
                    src="https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80"
                    alt="Smartwatch"
                    className="absolute w-20 h-20 object-contain drop-shadow-xl translate-x-4 translate-y-16 z-20"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* MARKETPLACE RIBBON CARD (Direct from Panel 1) */}
          <div className="mt-10 p-4 rounded-2xl bg-[#0e1628]/90 border border-slate-800 shadow-2xl backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-400 font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Supported Marketplaces:</span>
              </span>
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 font-black">
                <button
                  type="button"
                  onClick={() => navigate('/compare/prod-apple-iphone15')}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors cursor-pointer"
                >
                  amazon
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/compare/prod-hp-pavilion-15')}
                  className="px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors cursor-pointer"
                >
                  Flipkart
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/compare/prod-apple-iphone15')}
                  className="px-3 py-1.5 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20 hover:bg-pink-500/20 transition-colors cursor-pointer"
                >
                  meesho
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/compare/prod-samsung-watch-6')}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-colors cursor-pointer"
                >
                  Myntra
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/compare/prod-apple-iphone15')}
                  className="px-3 py-1.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 hover:bg-teal-500/20 transition-colors cursor-pointer"
                >
                  AJIO
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/compare/prod-apple-iphone15')}
                  className="px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-colors cursor-pointer"
                >
                  TATA CLIQ
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/compare/prod-apple-iphone15')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors cursor-pointer"
                >
                  croma
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/compare/prod-apple-iphone15')}
                  className="px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors cursor-pointer"
                >
                  reliance digital
                </button>
                <Link
                  to="/marketplaces"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                >
                  + More
                </Link>
              </div>
            </div>
          </div>

          {/* 4 VALUE GUARANTEES STRIP (Direct from Panel 1) */}
          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-3.5 rounded-2xl bg-[#0e1628]/60 border border-slate-800/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Free Shipping</div>
                <div className="text-[11px] text-slate-400">On orders over ₹499</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0e1628]/60 border border-slate-800/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Secure Payments</div>
                <div className="text-[11px] text-slate-400">100% secure & trusted</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0e1628]/60 border border-slate-800/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Easy Returns</div>
                <div className="text-[11px] text-slate-400">Hassle-free process</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0e1628]/60 border border-slate-800/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">24/7 Support</div>
                <div className="text-[11px] text-slate-400">We're here to help</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOP PROMOTIONAL AD BANNER CAROUSEL */}
      <section className="max-w-7xl mx-auto px-4 pt-2">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
          <div
            className={`bg-gradient-to-r ${promoAds[activeSlide].bgGradient} p-6 sm:p-10 text-white min-h-[340px] sm:min-h-[380px] flex flex-col justify-between relative transition-all duration-500`}
          >
            {/* Background ambient decorative shapes */}
            <div className="hidden sm:block absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="hidden sm:block absolute bottom-0 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Bar inside Ad Banner */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-full bg-white/15 border border-white/25 text-amber-300 backdrop-blur-md flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{promoAds[activeSlide].badge}</span>
                </span>
                <span className={`text-[10px] sm:text-xs font-extrabold px-2.5 py-1 rounded-full ${promoAds[activeSlide].storeColor}`}>
                  {promoAds[activeSlide].store}
                </span>
              </div>

              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                Ad • Sponsored Deal
              </span>
            </div>

            {/* Middle Content inside Ad Banner */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-4 z-10">
              <div className="md:col-span-8 space-y-3">
                <div className="inline-block px-3 py-1 rounded-lg bg-rose-500 text-white text-xs font-black tracking-wider uppercase shadow-md shadow-rose-500/30">
                  {promoAds[activeSlide].discount}
                </div>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                  {promoAds[activeSlide].headline}
                </h1>
                <p className="text-xs sm:text-base text-slate-300 max-w-xl leading-relaxed">
                  {promoAds[activeSlide].subhead}
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    to={promoAds[activeSlide].link}
                    className="px-6 py-3 rounded-2xl bg-white text-slate-950 hover:bg-slate-100 font-black text-xs sm:text-sm shadow-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                  >
                    <span>{promoAds[activeSlide].ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/compare"
                    className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm backdrop-blur-md transition-all flex items-center gap-1.5"
                  >
                    <Layers className="w-4 h-4 text-indigo-300" />
                    <span>Compare Live Prices</span>
                  </Link>
                </div>
              </div>

              {/* Product Visual on right */}
              <div className="hidden md:flex md:col-span-4 justify-center items-center">
                <div className="relative w-56 h-56 rounded-3xl bg-white/5 border border-white/15 p-4 backdrop-blur-md flex items-center justify-center shadow-2xl group">
                  <img
                    src={promoAds[activeSlide].image}
                    alt={promoAds[activeSlide].headline}
                    className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute -bottom-3 bg-slate-900 text-emerald-400 border border-emerald-500/40 text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
                    100% Genuine Store Deal
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Carousel Controls & Indicator Dots */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10 z-10">
              <div className="flex items-center gap-2">
                {promoAds.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      activeSlide === idx ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveSlide(prev => (prev - 1 + promoAds.length) % promoAds.length)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                  aria-label="Previous Ad"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveSlide(prev => (prev + 1) % promoAds.length)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                  aria-label="Next Ad"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PANEL 1: TRENDING PRODUCTS SECTION (5 COLUMNS: 4 PRODUCTS + CASHBACK CARD) */}
      <section className="max-w-7xl mx-auto px-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>Trending Products</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                Verified Best Prices
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Comparing live prices across Amazon, Flipkart, Croma, Myntra & partner stores
            </p>
          </div>
          <Link
            to="/categories"
            className="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
          {/* Card 1: iPhone 15 */}
          {products.find(p => p.id === 'prod-apple-iphone15') && (
            <ProductCard product={products.find(p => p.id === 'prod-apple-iphone15')!} />
          )}

          {/* Card 2: HP Pavilion 15 */}
          {products.find(p => p.id === 'prod-hp-pavilion-15') && (
            <ProductCard product={products.find(p => p.id === 'prod-hp-pavilion-15')!} />
          )}

          {/* Card 3: boAt Airdopes 141 */}
          {products.find(p => p.id === 'prod-boat-airdopes') && (
            <ProductCard product={products.find(p => p.id === 'prod-boat-airdopes')!} />
          )}

          {/* Card 4: Samsung Galaxy Watch6 */}
          {products.find(p => p.id === 'prod-samsung-watch-6') && (
            <ProductCard product={products.find(p => p.id === 'prod-samsung-watch-6')!} />
          )}

          {/* Card 5: SmartDeal Cashback Special Promo Card (Panel 1) */}
          <div className="rounded-3xl bg-gradient-to-br from-[#1e1b4b] via-[#2e1065] to-[#0f172a] border border-indigo-500/30 p-5 text-white flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-indigo-400 transition-all min-h-[360px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-3 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-black border border-indigo-500/30">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>SmartDeal</span>
              </div>
              <h3 className="text-lg font-black leading-tight text-white">
                Real-Time Best Price Finder
              </h3>
              <p className="text-xs text-indigo-200/80 leading-snug">
                Compare live prices and get the guaranteed lowest rates across top stores.
              </p>
            </div>

            <div className="pt-4 space-y-4 relative z-10">
              <Link
                to="/wallet"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs text-center flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              {/* Gold coins visual matching Panel 1 */}
              <div className="flex items-center justify-center pt-2">
                <div className="flex items-center -space-x-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 border-2 border-slate-900 shadow-md flex items-center justify-center text-xs font-black text-slate-950">₹</div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 border-2 border-slate-900 shadow-md flex items-center justify-center text-sm font-black text-slate-950">₹</div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 border-2 border-slate-900 shadow-lg flex items-center justify-center text-base font-black text-slate-950">₹</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY FILTER CHIPS */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-md'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
            }`}
          >
            All Products ({products.length})
          </button>
          {mockCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                trackActivity('SEARCH_PRODUCT', {
                  category: cat.name,
                  filterType: 'home_category_chip'
                });
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
                selectedCategory.toLowerCase() === cat.id.toLowerCase()
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-brand-300'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* 4. MAIN PRODUCT GRID: TOP TRENDING DEALS */}
      <section className="max-w-7xl mx-auto px-4 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/25">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Trending Deals & Best Prices
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Comparing live prices across Amazon, Flipkart, Croma & top verified stores
              </p>
            </div>
          </div>
          <Link
            to="/categories"
            className="text-xs font-extrabold text-brand-600 dark:text-brand-400 hover:text-brand-700 flex items-center gap-1"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. MID-PAGE SPONSORED WIDE ADVERTISEMENT BANNER */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-amber-400/30">
          <div className="space-y-2 text-center md:text-left z-10">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-black/20 text-amber-100 uppercase tracking-wider">
                SPONSORED ADVERTISEMENT
              </span>
              <span className="text-[10px] font-bold text-white/80">
                Verified Merchant Campaign
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black">
              Flagship 5G Smartphones & Laptops Upgrade Fest
            </h3>
            <p className="text-xs sm:text-sm text-amber-100 max-w-xl">
              Exchange bonus up to ₹10,000 on Apple iPhone 15, Samsung Galaxy S24 & ASUS Vivobook across Amazon & Flipkart. 0% No-Cost EMI available.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 z-10">
            <Link
              to="/categories?cat=Mobiles"
              className="px-6 py-3.5 rounded-2xl bg-white text-slate-950 hover:bg-amber-50 font-black text-xs sm:text-sm shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>View Flagship Deals</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
            <Link
              to="/compare"
              className="px-5 py-3.5 rounded-2xl bg-black/20 hover:bg-black/30 border border-white/25 text-white font-bold text-xs sm:text-sm backdrop-blur-md transition-all"
            >
              Compare Stores
            </Link>
          </div>
        </div>
      </section>

      {/* 6. LIGHTNING FLASH SALE PRODUCTS WITH COUNTDOWN */}
      <section className="max-w-7xl mx-auto px-4 space-y-5">
        {/* Flash Sale Header Bar */}
        <div className="bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 rounded-3xl p-4 sm:p-6 text-white shadow-lg flex flex-wrap items-center justify-between gap-4 border border-rose-500/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-black text-xl shadow-inner">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-wider uppercase text-rose-200">
                  FLASH SALE • LOWEST EVER PRICES
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black mt-0.5">
                Limited-Time Price Drop Offers
              </h3>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 bg-black/25 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20">
            <Clock className="w-4 h-4 text-amber-300 animate-pulse" />
            <span className="text-xs font-bold text-slate-200">Ends In:</span>
            <div className="flex items-center gap-1 font-mono font-black text-sm text-white">
              <span className="px-1.5 py-0.5 rounded bg-black/40">
                {String(flashTime.hours).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="px-1.5 py-0.5 rounded bg-black/40">
                {String(flashTime.minutes).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="px-1.5 py-0.5 rounded bg-black/40">
                {String(flashTime.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Flash Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
          {flashProducts.map(product => (
            <ProductCard key={`flash-${product.id}`} product={product} />
          ))}
        </div>
      </section>

      {/* SECTION 4.8: BANK OFFERS & VERIFIED COUPONS */}
      <section className="max-w-7xl mx-auto px-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Bank Offers & Active Store Coupons</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Verified bank discounts stackable with marketplace deals</p>
            </div>
          </div>
          <Link to="/coupons" className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1">
            <span>View All Coupons</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/15 text-blue-400">HDFC BANK</span>
              <span className="text-xs font-black text-emerald-500">Flat 10% Instant Discount</span>
            </div>
            <div className="font-extrabold text-sm text-slate-900 dark:text-white">Up to ₹1,500 Off on Credit Cards</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Min. order ₹7,500 on Mobiles, Laptops & Electronics. Valid on Amazon & Flipkart.</div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/15 text-rose-400">ICICI BANK</span>
              <span className="text-xs font-black text-emerald-500">Flat ₹2,000 Off</span>
            </div>
            <div className="font-extrabold text-sm text-slate-900 dark:text-white">Instant Discount on Laptops & Smart TVs</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Valid on Croma & Reliance Digital purchases above ₹25,000.</div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400">SMARTDEAL GUARANTEE</span>
              <span className="text-xs font-black text-emerald-500">Live Across Stores</span>
            </div>
            <div className="font-extrabold text-sm text-slate-900 dark:text-white">Verified Lowest Prices Across Stores</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Real-time multi-store price monitoring ensures you never overpay on any order.</div>
          </div>
        </div>
      </section>

      {/* SECTION 4.10 & 14: SMARTDEAL DEAL INTELLIGENCE FEATURES */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 text-xs font-black">
            <Bot className="w-3.5 h-3.5" />
            <span>AI Product Intelligence Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Smart Deal Intelligence System
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Explainable AI decision algorithms helping you save money with confidence and zero deceptive practices.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Deal DNA & Smart Score (0-100)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Multi-factor algorithmic rating analyzing price advantage across stores, 90-day pricing trends, seller reliability, and verified coupon quality.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Fake Discount Detector</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Identifies artificially inflated MRPs and fake discount banners by cross-referencing actual manufacturer reference prices and historical lows.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Buy Now or Wait Estimator</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Predictive volatility analysis estimating whether the price is currently at its bottom cycle or expected to drop in upcoming festival sales.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Better Alternative Finder</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Discovers products with superior specifications, better reviews, or higher value-for-money in the same price bracket.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Personal Deal Radar</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Define your budget and desired product. Receive instant alerts via email or push notifications when your target price is reached.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Smart Savings Calculator</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Calculates real final effective cost = Listed Price - Bank Discount - Promo Coupons + Delivery Fee.
            </p>
          </div>
        </div>
      </section>

      {/* 7. DUAL SIDE-BY-SIDE PROMOTIONAL ADS */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ad Card 1: Laptop & Gaming */}
          <div className="rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 p-6 sm:p-8 text-white border border-indigo-800/40 shadow-xl relative overflow-hidden flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                  SPONSORED AD
                </span>
                <span className="text-[10px] font-extrabold text-amber-400">
                  Amazon & Croma Deals
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black">
                Laptops & Gaming Gear Up to 40% Off
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Intel Core i5, i7 & AMD Ryzen laptops from ASUS, HP, Dell & Lenovo. Verified prices and instant bank discounts.
              </p>
            </div>
            <Link
              to="/categories?cat=Laptops"
              className="w-fit px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all hover:scale-105"
            >
              <span>Shop Laptop Deals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Ad Card 2: Audio & Smartwatches */}
          <div className="rounded-3xl bg-gradient-to-br from-purple-950 via-slate-900 to-rose-950 p-6 sm:p-8 text-white border border-purple-800/40 shadow-xl relative overflow-hidden flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                  SPONSORED AD
                </span>
                <span className="text-[10px] font-extrabold text-emerald-400">
                  Flipkart & Reliance Digital
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black">
                Audio & Smartwatches Up to 65% Off
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Active Noise Cancellation earbuds, wireless headphones & AMOLED fitness smartwatches from Sony, Boat, Apple & Noise.
              </p>
            </div>
            <Link
              to="/categories?cat=Electronics"
              className="w-fit px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition-all hover:scale-105"
            >
              <span>Explore Audio Offers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. BOTTOM AD BANNER: DIRECT STORE REDIRECT GUARANTEE */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Genuine Partner Store Direct Buy</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              Shop Directly on Amazon, Flipkart & Croma with Official Warranties
            </h3>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              SmartDeal continuously compares real-time selling prices, delivery charges, and bank discounts across verified stores. Pick the best offer and checkout natively on the merchant's official site.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/compare"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-indigo-600/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <Layers className="w-4 h-4" />
              <span>Compare All Stores</span>
            </Link>
            <Link
              to="/categories"
              className="px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 transition-all"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
