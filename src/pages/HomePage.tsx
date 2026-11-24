import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/common/ProductCard';
import { MarketplaceBadge } from '../components/common/MarketplaceBadge';
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
  Bot,
  Activity,
  Truck,
  RotateCcw,
  Headphones,
  Lock,
  Bell
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
  const { products, trackActivity, activeTheme, isDarkMode } = useApp();
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
    promoCard: 'bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 text-white shadow-lg border-indigo-500/40',
    promoButton: 'bg-white hover:bg-slate-50 text-blue-700 font-extrabold shadow-md',
    promoBadge: 'bg-white/20 border-white/30 text-white',
    promoIcon: 'text-white',
    promoText: 'text-blue-100',
  };
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);
  const [heroSlide, setHeroSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [flashTime, setFlashTime] = useState({ hours: 7, minutes: 24, seconds: 15 });

  // High-converting 2-Second Rotating Hero Discount Ads (matching user request)
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
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=80',
      targetUrl: '/product/prod-hp-pavilion-15',
    },
    {
      id: 'h-ad-boat',
      productTitle: 'boAt Airdopes 141 Bluetooth TWS Earbuds',
      category: 'Audio',
      discountBadge: 'LIGHTNING DEAL • 71% OFF',
      discountPercent: '71% OFF',
      sellingPrice: '₹1,299',
      mrp: '₹4,490',
      storeName: 'Amazon',
      image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80',
      targetUrl: '/product/prod-boat-airdopes',
    },
    {
      id: 'h-ad-nike',
      productTitle: 'Nike Revolution 6 Running Shoes',
      category: 'Footwear',
      discountBadge: 'FASHION GALA • 50% OFF',
      discountPercent: '50% OFF',
      sellingPrice: '₹2,499',
      mrp: '₹4,995',
      storeName: 'Myntra',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
      targetUrl: '/product/prod-nike-running-shoes',
    },
    {
      id: 'h-ad-noise',
      productTitle: 'Noise ColorFit Pro 5 Smartwatch',
      category: 'Wearables',
      discountBadge: 'BESTSELLER • 60% OFF',
      discountPercent: '60% OFF',
      sellingPrice: '₹2,999',
      mrp: '₹7,499',
      storeName: 'Flipkart',
      image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80',
      targetUrl: '/product/prod-noise-colorfit',
    },
    {
      id: 'h-ad-samsung',
      productTitle: 'Samsung 253L Smart Frost Free Refrigerator',
      category: 'Appliances',
      discountBadge: 'HOME APPLIANCES • 38% OFF',
      discountPercent: '38% OFF',
      sellingPrice: '₹22,990',
      mrp: '₹36,990',
      storeName: 'Croma',
      image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop&q=80',
      targetUrl: '/product/prod-samsung-refrigerator-253l',
    }
  ];

  // Auto-scroll discount ad image showcase every 2 seconds (2000ms) as requested: "2 har second me scroll hoti rahe"
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

  // Top Deals for You: 6 Featured Items exactly matching user reference image
  const topDealsProducts = [
    products.find(p => p.id === 'prod-apple-iphone15') || products[0],
    products.find(p => p.id === 'prod-hp-pavilion-15') || products.find(p => p.id === 'prod-lenovo-ideapad-slim3') || products[1],
    products.find(p => p.id === 'prod-boat-airdopes') || products.find(p => p.id === 'prod-boat-rockerz-450') || products[2],
    products.find(p => p.id === 'prod-nike-running-shoes') || products.find(p => p.id === 'prod-nike-court-vision') || products[3],
    products.find(p => p.id === 'prod-noise-colorfit') || products.find(p => p.id === 'prod-noise-colorfit-pro5') || products[4],
    products.find(p => p.id === 'prod-samsung-refrigerator-253l') || products[5],
  ].filter(Boolean);

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

  // Auto-slide advertisement carousel every 2 seconds
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % promoAds.length);
    }, 2000);
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
      <section className={`relative overflow-hidden w-full max-w-full ${isDarkMode ? 'text-white' : 'text-slate-900'} pt-8 pb-12 border-b -mt-2 transition-colors duration-500 ${heroTheme.heroSectionBg} ${heroTheme.heroBorder}`}>
        {/* Dynamic Theme Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[250px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 relative z-10 w-full overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Heading, Subtitle, Search Bar & Category Pills */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black shadow-xs border ${heroTheme.badgeBg} ${heroTheme.badgeBorder} ${heroTheme.badgeText}`}>
                <ShoppingBag className={`w-3.5 h-3.5 ${heroTheme.badgeIcon}`} />
                <span>SmartDeal Platform • Intelligent Comparison</span>
              </div>

              <div className="space-y-3">
                <h1 className={`text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Find the Best Price. <br />
                  <span className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>Compare. Save. </span>
                  <span className={heroTheme.titleGradient}>Buy Smarter.</span>
                </h1>

                <p className={`text-sm sm:text-base ${isDarkMode ? 'text-slate-300' : 'text-slate-600'} max-w-xl leading-relaxed`}>
                  Compare prices, track deals and discover the biggest savings across top marketplaces before you buy.
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

              {/* Category pill shortcuts directly under search */}
              <div className={`flex flex-wrap items-center gap-2 pt-1 text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                {[
                  { name: 'iPhone', emoji: '📱', query: 'iPhone 15' },
                  { name: 'Laptop', emoji: '💻', query: 'Laptop' },
                  { name: 'Headphones', emoji: '🎧', query: 'Headphones' },
                  { name: 'Shoes', emoji: '👟', query: 'Shoes' },
                  { name: 'TV', emoji: '📺', query: 'TV' },
                  { name: 'Smartwatch', emoji: '⌚', query: 'Smartwatch' },
                  { name: 'Refrigerator', emoji: '❄', query: 'Refrigerator' }
                ].map(item => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => navigate(`/search?q=${encodeURIComponent(item.query)}`)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95 border flex items-center gap-1.5 ${heroTheme.pillBg}`}
                  >
                    <span>{item.emoji}</span>
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>

              {/* Marketplace Partner Badges Row */}
              <div className="pt-2">
                <span className={`text-[11px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} block mb-2`}>
                  Top Supported Marketplaces:
                </span>
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

            {/* Right Column: Dynamic Auto-Scrolling 2-Second Discount Ad Showcase */}
            <div className="lg:col-span-5 flex justify-center relative w-full">
              <div className="relative w-full max-w-[360px] sm:max-w-[430px] rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden p-4 sm:p-5 flex flex-col justify-between transition-all duration-300">
                {/* Floating Save Up To Badge matching Panel 1 */}
                <div className="absolute top-3.5 right-3.5 z-20 px-3 py-1 rounded-xl font-black text-[11px] shadow-md flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <span>Save Up To ₹12,999</span>
                  <ExternalLink className="w-3 h-3" />
                </div>

                {/* Rotating Ad Content with 2-Second Transition */}
                <div className="relative z-10 w-full flex flex-col items-center">
                  {/* Top Store Badge & Discount Tag Row */}
                  <div className="w-full flex items-center justify-between gap-2 pr-36 mb-2">
                    <MarketplaceBadge storeName={heroDiscountAds[heroSlide].storeName} size="sm" />
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 truncate">
                      {heroDiscountAds[heroSlide].discountBadge}
                    </span>
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
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                          {heroDiscountAds[heroSlide].discountPercent}
                        </span>
                      </div>
                      <span className="text-[9px] font-black text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
                        2s Deal
                      </span>
                    </div>

                    {/* Action Buttons: View Details & Buy on Store */}
                    <div className="w-full flex items-center gap-2 pt-2">
                      <Link
                        to={heroDiscountAds[heroSlide].targetUrl}
                        className="flex-1 py-2 px-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-extrabold text-xs text-center transition-all cursor-pointer shadow-xs truncate"
                      >
                        View Details
                      </Link>
                      <Link
                        to={heroDiscountAds[heroSlide].targetUrl}
                        className="flex-1 py-2 px-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-xs flex items-center justify-center gap-1 shadow-xs transition-all cursor-pointer truncate"
                      >
                        <span className="truncate">Buy on {heroDiscountAds[heroSlide].storeName}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </Link>
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

          {/* 4 FEATURE / VALUE PROPOSITION CARDS MATCHING REFERENCE SECTION 1 */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* TOP DEALS FOR YOU SECTION (6-card row on laptop, 2 columns on phone) */}
      <section className="max-w-7xl mx-auto px-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
              <Flame className="w-4 h-4 fill-blue-600 text-blue-600" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-black">
              Top Deals for You
            </h2>
          </div>
          <Link
            to="/deals"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View all</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {topDealsProducts.map(p => (
            <ProductCard key={p.id} product={p} variant="top-deals" />
          ))}
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

      {/* PANEL 2: FINDING PRODUCTS SECTION (5 COLUMNS: 4 PRODUCTS + EXCLUSIVE DEALS CARD) */}
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

          {/* Card 4: Nike Running Shoes */}
          {products.find(p => p.id === 'prod-nike-running-shoes') && (
            <ProductCard product={products.find(p => p.id === 'prod-nike-running-shoes')!} />
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
              <h2 className="text-xl sm:text-2xl font-black text-black">
                Trending Deals & Best Prices
              </h2>
              <p className="text-xs text-slate-700 font-semibold mt-0.5">
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

      {/* 5. PANEL 3: BUDGET BUZZ DEALS BANNER & CLICK PAGE SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 space-y-4">
        <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-indigo-700/50">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2 text-center md:text-left z-10">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-white/20 text-indigo-200 uppercase tracking-wider">
                PANEL 3 • CLICK PAGE
              </span>
              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Deals Active
              </span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight">
              Budget Buzz Deals
            </h3>
            <p className="text-sm font-extrabold text-amber-300">
              Up to 70% OFF • Grab the hottest deals before they're gone!
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 z-10">
            <Link
              to="/deals"
              className="px-6 py-3.5 rounded-2xl bg-white text-slate-950 hover:bg-slate-100 font-black text-xs sm:text-sm shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4 text-blue-600" />
            </Link>
          </div>
        </div>

        {/* Category Pills matching Panel 3 */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          {['Top Deals', 'Electronics', 'Fashion', 'Mobiles', 'Home & Living', 'Laptops'].map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                const q = tab === 'Top Deals' ? '' : tab;
                if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
                else setSelectedCategory('All');
              }}
              className="px-3.5 py-1.5 rounded-full text-xs font-black bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 transition-all shrink-0 cursor-pointer shadow-xs"
            >
              {tab}
            </button>
          ))}
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
              <h2 className="text-xl font-black text-black">Bank Offers & Active Store Coupons</h2>
              <p className="text-xs text-slate-700 font-semibold mt-0.5">Verified bank discounts stackable with marketplace deals</p>
            </div>
          </div>
          <Link to="/coupons" className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1">
            <span>View All Coupons</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">HDFC BANK</span>
              <span className="text-xs font-black text-emerald-700">Flat 10% Instant Discount</span>
            </div>
            <div className="font-black text-sm text-black">Up to ₹1,500 Off on Credit Cards</div>
            <div className="text-[11px] text-slate-700 font-medium">Min. order ₹7,500 on Mobiles, Laptops & Electronics. Valid on Amazon & Flipkart.</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">ICICI BANK</span>
              <span className="text-xs font-black text-emerald-700">Flat ₹2,000 Off</span>
            </div>
            <div className="font-black text-sm text-black">Instant Discount on Laptops & Smart TVs</div>
            <div className="text-[11px] text-slate-700 font-medium">Valid on Croma & Reliance Digital purchases above ₹25,000.</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">SMARTDEAL GUARANTEE</span>
              <span className="text-xs font-black text-emerald-700">Live Across Stores</span>
            </div>
            <div className="font-black text-sm text-black">Verified Lowest Prices Across Stores</div>
            <div className="text-[11px] text-slate-700 font-medium">Real-time multi-store price monitoring ensures you never overpay on any order.</div>
          </div>
        </div>
      </section>

      {/* SECTION 4.10 & 14: SMARTDEAL DEAL INTELLIGENCE FEATURES */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black">
            <Bot className="w-3.5 h-3.5" />
            <span>AI Product Intelligence Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-black">
            Smart Deal Intelligence System
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 font-semibold">
            Explainable AI decision algorithms helping you save money with confidence and zero deceptive practices.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-black text-sm text-black">Deal DNA & Smart Score (0-100)</h3>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              Multi-factor algorithmic rating analyzing price advantage across stores, 90-day pricing trends, seller reliability, and verified coupon quality.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-black text-sm text-black">Fake Discount Detector</h3>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              Identifies artificially inflated MRPs and fake discount banners by cross-referencing actual manufacturer reference prices and historical lows.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-black text-sm text-black">Buy Now or Wait Estimator</h3>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              Predictive volatility analysis estimating whether the price is currently at its bottom cycle or expected to drop in upcoming festival sales.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-black text-sm text-black">Better Alternative Finder</h3>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              Discovers products with superior specifications, better reviews, or higher value-for-money in the same price bracket.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-black text-sm text-black">Personal Deal Radar</h3>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              Define your budget and desired product. Receive instant alerts via email or push notifications when your target price is reached.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="font-black text-sm text-black">Smart Savings Calculator</h3>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
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
