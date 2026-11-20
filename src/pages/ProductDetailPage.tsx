import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { DealScoreBadge } from '../components/common/DealScoreBadge';
import { PriceComparisonTable } from '../components/common/PriceComparisonTable';
import { PriceHistoryChart } from '../components/common/PriceHistoryChart';
import { SmartBuyRecommendation } from '../components/product/SmartBuyRecommendation';
import { InteractivePriceHistoryChart } from '../components/product/InteractivePriceHistoryChart';
import { PriceAlertModal } from '../components/common/PriceAlertModal';
import { ProductFullDetailsSection } from '../components/product/ProductFullDetailsSection';
import { notificationService } from '../services/notificationService';
import {
  Heart,
  ShoppingCart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Coins,
  CheckCircle2,
  Bell,
  Sparkles,
  ArrowRight,
  MapPin,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  Scale,
  Check,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';

const THEME_STYLES: Record<string, {
  cardBg: string;
  cardBorder: string;
  badgeBg: string;
  badgeText: string;
  accentText: string;
  pricingBg: string;
  pricingBorder: string;
  thumbActiveBorder: string;
  thumbInactiveBg: string;
  iconText: string;
  mobileBg: string;
  mobileBorder: string;
  buyButton: string;
}> = {
  'steel-navy': {
    cardBg: 'bg-[#19191d]',
    cardBorder: 'border-[#27272e]',
    badgeBg: 'bg-[#12DAA8]',
    badgeText: 'bg-[#12DAA8]/20 text-[#12DAA8] border-[#12DAA8]/40',
    accentText: 'text-[#12DAA8]',
    pricingBg: 'bg-[#141417]',
    pricingBorder: 'border-[#27272e]',
    thumbActiveBorder: 'border-[#12DAA8]',
    thumbInactiveBg: 'border-[#27272e] bg-[#222227]',
    iconText: 'text-[#12DAA8]',
    mobileBg: 'dark:bg-[#121212]/95',
    mobileBorder: 'dark:border-[#27272e]',
    buyButton: 'bg-[#12DAA8] hover:bg-[#00E9BF] text-slate-950 font-black shadow-[#12DAA8]/25'
  },
  'matrix-lime': {
    cardBg: 'bg-[#172219]',
    cardBorder: 'border-lime-800/60',
    badgeBg: 'bg-lime-400',
    badgeText: 'bg-lime-500/20 text-lime-300 border-lime-400/40',
    accentText: 'text-lime-400',
    pricingBg: 'bg-[#0e140f]',
    pricingBorder: 'border-lime-900/60',
    thumbActiveBorder: 'border-lime-400',
    thumbInactiveBg: 'border-lime-900 bg-[#141d16]',
    iconText: 'text-lime-400',
    mobileBg: 'dark:bg-[#111612]/95',
    mobileBorder: 'dark:border-lime-800/80',
    buyButton: 'bg-gradient-to-r from-lime-400 via-lime-500 to-emerald-500 text-slate-950 shadow-lime-500/20'
  },
  'sunset-coral': {
    cardBg: 'bg-[#28113b]',
    cardBorder: 'border-rose-900/60',
    badgeBg: 'bg-rose-400',
    badgeText: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
    accentText: 'text-rose-400',
    pricingBg: 'bg-[#160822]',
    pricingBorder: 'border-rose-950/70',
    thumbActiveBorder: 'border-rose-400',
    thumbInactiveBg: 'border-rose-900 bg-[#200d30]',
    iconText: 'text-rose-400',
    mobileBg: 'dark:bg-[#1c0b29]/95',
    mobileBorder: 'dark:border-rose-900/80',
    buyButton: 'bg-gradient-to-r from-orange-500 via-rose-500 to-pink-600 text-white shadow-rose-500/20'
  },
  'aurora-jade': {
    cardBg: 'bg-[#092e20]',
    cardBorder: 'border-emerald-800/60',
    badgeBg: 'bg-emerald-400',
    badgeText: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
    accentText: 'text-emerald-400',
    pricingBg: 'bg-[#041710]',
    pricingBorder: 'border-emerald-950/70',
    thumbActiveBorder: 'border-emerald-400',
    thumbInactiveBg: 'border-emerald-900 bg-[#072419]',
    iconText: 'text-emerald-400',
    mobileBg: 'dark:bg-[#051f15]/95',
    mobileBorder: 'dark:border-emerald-800/80',
    buyButton: 'bg-gradient-to-r from-emerald-500 via-green-400 to-teal-500 text-slate-950 shadow-emerald-500/20'
  },
  'royal-gold': {
    cardBg: 'bg-[#241a0b]',
    cardBorder: 'border-amber-900/60',
    badgeBg: 'bg-amber-400',
    badgeText: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
    accentText: 'text-amber-400',
    pricingBg: 'bg-[#0c0c09]',
    pricingBorder: 'border-amber-950/70',
    thumbActiveBorder: 'border-amber-400',
    thumbInactiveBg: 'border-amber-900 bg-[#1c1408]',
    iconText: 'text-amber-400',
    mobileBg: 'dark:bg-[#181107]/95',
    mobileBorder: 'dark:border-amber-900/80',
    buyButton: 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 shadow-amber-500/20'
  },
  'cyber-indigo': {
    cardBg: 'bg-[#0f1248]',
    cardBorder: 'border-indigo-800/60',
    badgeBg: 'bg-violet-400',
    badgeText: 'bg-violet-500/20 text-violet-300 border-violet-400/40',
    accentText: 'text-violet-400',
    pricingBg: 'bg-[#060721]',
    pricingBorder: 'border-indigo-950/70',
    thumbActiveBorder: 'border-violet-400',
    thumbInactiveBg: 'border-indigo-900 bg-[#0d103d]',
    iconText: 'text-violet-400',
    mobileBg: 'dark:bg-[#08092d]/95',
    mobileBorder: 'dark:border-indigo-900/80',
    buyButton: 'bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-600 text-white shadow-indigo-500/20'
  },
  'pure-white': {
    cardBg: 'bg-white',
    cardBorder: 'border-slate-200/80',
    badgeBg: 'bg-indigo-600',
    badgeText: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    accentText: 'text-indigo-600',
    pricingBg: 'bg-slate-50',
    pricingBorder: 'border-slate-200/80',
    thumbActiveBorder: 'border-indigo-600',
    thumbInactiveBg: 'border-slate-200 bg-white',
    iconText: 'text-indigo-600',
    mobileBg: 'bg-white/95',
    mobileBorder: 'border-slate-200',
    buyButton: 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-indigo-500/20'
  }
};

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // If boAt Airdopes or specified product, immediately redirect to home page
  if (id === 'prod-boat-airdopes') {
    return <Navigate to="/" replace />;
  }

  const { products, addToCart, wishlist, toggleWishlist, trackActivity, trackOutboundClick, activeTheme } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (id === 'prod-boat-airdopes') {
      navigate('/', { replace: true });
    }
  }, [id, navigate]);

  const themeStyle = THEME_STYLES[activeTheme] || THEME_STYLES['steel-navy'];

  const product = products.find(p => p.id === id) || products[0];
  const [activeImage, setActiveImage] = useState(product.image);
  const [pincode, setPincode] = useState('110016');
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'specifications' | 'features' | 'reviews' | 'price-history'>('overview');
  const [selectedMarketplace, setSelectedMarketplace] = useState<string>('flipkart');

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      trackActivity(
        'VIEW_PRODUCT',
        {
          price: product.sellingPrice,
          mrp: product.mrp,
          dealScore: product.dealScore,
          sellerCount: product.marketplacePrices.length
        },
        product.id,
        product.name,
        product.category
      );

      const stores = product.marketplacePrices.map(m => m.sellerName);
      trackActivity(
        'COMPARE_PRODUCT',
        {
          storesCompared: stores,
          lowestPrice: Math.min(...product.marketplacePrices.map(m => m.finalPrice)),
          highestPrice: Math.max(...product.marketplacePrices.map(m => m.finalPrice))
        },
        product.id,
        product.name,
        product.category
      );
    }
  }, [product?.id]);

  const isWishlisted = wishlist.includes(product.id);

  const fallbackCashback = Math.round(product.sellingPrice * 0.015);
  const bestMarketplace = product.marketplacePrices[0] || {
    sellerName: 'Amazon',
    price: product.sellingPrice,
    finalPrice: Math.max(0, product.sellingPrice - fallbackCashback),
    url: '#',
    cashbackAmount: fallbackCashback,
  };

  const cashbackAmount =
    bestMarketplace.cashbackAmount ??
    fallbackCashback;

  const handleBuyAtBestPrice = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const targetStore = bestMarketplace;
    const storeName = targetStore.sellerName || 'Amazon';
    const storePrice = targetStore.finalPrice || targetStore.price || product.sellingPrice;
    const trackingId = `SD-AFF-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const targetUrl = (targetStore.url && targetStore.url !== '#')
      ? targetStore.url
      : (storeName.toLowerCase().includes('flipkart')
          ? `https://www.flipkart.com/search?q=${encodeURIComponent(product.name)}`
          : `https://www.amazon.in/s?k=${encodeURIComponent(product.name)}`);

    // 1. Dispatch real-time SMS to owner 7217514087
    notificationService.notifyBuyClick({
      clickId: trackingId,
      productId: product.id,
      productName: product.name,
      marketplace: storeName,
      price: storePrice,
      targetUrl,
      userName: 'Website Visitor',
      userContact: 'Product Detail Page Direct Buy'
    });

    // 2. Track outbound click
    trackOutboundClick(
      product.id,
      product.name,
      product.category,
      storeName,
      storePrice,
      targetUrl
    );

    // 3. Open official product page on that company directly
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  // Sparkline price history points for Panel 3
  const last30DaysTrend = [
    { day: '25 Aug', price: product.mrp },
    { day: '01 Sep', price: Math.round(product.sellingPrice * 1.06) },
    { day: '08 Sep', price: Math.round(product.sellingPrice * 1.03) },
    { day: '15 Sep', price: product.sellingPrice },
    { day: 'Today', price: product.sellingPrice }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-32 sm:pb-12 space-y-10">
      {/* Breadcrumbs matching Panel 3: Home > Mobiles > iPhone 15 */}
      <nav className="text-xs text-slate-400 dark:text-slate-400 flex items-center gap-2 font-medium">
        <Link to="/" className="hover:text-slate-800 dark:hover:text-white transition-colors">Home</Link>
        <span>&gt;</span>
        <Link to={`/categories?cat=${product.category}`} className="hover:text-slate-800 dark:hover:text-white transition-colors">
          {product.category}
        </Link>
        <span>&gt;</span>
        <span className="text-slate-900 dark:text-white font-bold truncate max-w-sm">{product.name}</span>
      </nav>

      {/* Main Product Hero & Purchase Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Gallery (5 cols) matching Panel 3 */}
        <div className="lg:col-span-5 space-y-4">
          <div className={`relative aspect-square rounded-3xl p-8 flex items-center justify-center overflow-hidden shadow-sm border ${themeStyle.cardBg} ${themeStyle.cardBorder}`}>
            <img
              src={activeImage}
              alt={product.name}
              className="h-full w-full object-contain dark:brightness-95"
            />
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md shadow-sm transition-all ${isWishlisted
                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                : 'bg-white/90 dark:bg-slate-800/90 text-slate-400 hover:text-rose-600'
                }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
            </button>
          </div>

          {/* Thumbnails row matching Panel 3 */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`w-16 h-16 rounded-2xl border-2 p-1.5 overflow-hidden shrink-0 transition-all cursor-pointer ${
                  activeImage === img 
                    ? `${themeStyle.thumbActiveBorder} shadow-md scale-105` 
                    : themeStyle.thumbInactiveBg
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-contain" />
              </button>
            ))}
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[11px] font-semibold text-slate-300">
            <div className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1 shadow-xs ${themeStyle.cardBg} ${themeStyle.cardBorder}`}>
              <ShieldCheck className={`w-4 h-4 ${themeStyle.iconText}`} />
              <span>100% Genuine</span>
            </div>
            <div className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1 shadow-xs ${themeStyle.cardBg} ${themeStyle.cardBorder}`}>
              <RotateCcw className={`w-4 h-4 ${themeStyle.iconText}`} />
              <span>{product.returnDays} Days Return</span>
            </div>
            <div className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1 shadow-xs ${themeStyle.cardBg} ${themeStyle.cardBorder}`}>
              <Truck className={`w-4 h-4 ${themeStyle.iconText}`} />
              <span>Fast Dispatch</span>
            </div>
          </div>
        </div>

        {/* Center/Right: Product Details & Price Engine (7 cols) matching Panel 3 */}
        <div className="lg:col-span-7 space-y-6">
          {/* Brand & Title */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${themeStyle.accentText}`}>
                {product.brand}
              </span>
              <span className="text-slate-700">•</span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white">
                Best Seller
              </span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider text-slate-950 ${themeStyle.badgeBg}`}>
                {product.discountPercent}% OFF
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-amber-400 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/30">
                ★ {product.rating}
              </span>
              <span className="text-slate-400">
                ({product.reviewsCount.toLocaleString('en-IN')} verified reviews)
              </span>
            </div>
          </div>

          {/* Pricing Engine Box matching Panel 3 */}
          <div className={`p-5 rounded-3xl border space-y-4 shadow-sm ${themeStyle.pricingBg} ${themeStyle.pricingBorder}`}>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-white">
                ₹{product.sellingPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-lg text-slate-500 line-through">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
              <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg border ${themeStyle.badgeText}`}>
                {product.discountPercent}% OFF
              </span>
            </div>

            {/* Wishlist & Compare actions row */}
            <div className="flex items-center gap-4 text-xs font-bold text-slate-600 dark:text-slate-300 pt-1">
              <button
                onClick={() => toggleWishlist(product.id)}
                className="flex items-center gap-1.5 hover:text-rose-600 transition-colors cursor-pointer"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'text-rose-500 fill-rose-500' : ''}`} />
                <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
              </button>
              <span>•</span>
              <Link
                to={`/compare/${product.id}`}
                className="flex items-center gap-1.5 hover:text-brand-500 transition-colors cursor-pointer"
              >
                <Scale className="w-4 h-4" />
                <span>Compare Stores</span>
              </Link>
            </div>
          </div>

          {/* Action Buttons: Compare Prices & Buy at Best Price matching Panel 3 */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
            <button
              onClick={() => {
                const el = document.getElementById('price-comparison-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else navigate(`/compare/${product.id}`);
              }}
              className="w-full sm:flex-1 py-4 px-6 rounded-2xl border-2 border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-transparent text-slate-900 dark:text-white font-extrabold text-sm text-center shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              Compare Prices
            </button>

            <button
              onClick={handleBuyAtBestPrice}
              className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-[#12DAA8] hover:bg-[#00E9BF] text-slate-950 font-black text-sm shadow-xl shadow-[#12DAA8]/25 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
              title={`Buy directly on ${bestMarketplace.sellerName || 'Official Store'}`}
            >
              <span>Buy on {bestMarketplace.sellerName?.split(' ')[0] || 'Store'} (₹{product.sellingPrice.toLocaleString('en-IN')})</span>
              <ExternalLink className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Fast Delivery & Pincode Checker */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Truck className="w-4 h-4 text-emerald-500" />
              <span>FREE Delivery • {product.deliveryDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={pincode}
                onChange={e => setPincode(e.target.value)}
                className="w-16 px-1.5 py-0.5 text-xs font-bold border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md text-center"
                maxLength={6}
              />
              <button className="text-[11px] font-bold text-brand-600 dark:text-brand-400">Apply</button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: SMART PRICE COMPARISON TABLE (Compare Prices Across Marketplaces) */}
      <section id="price-comparison-section" className="space-y-6 pt-6 pb-6 border-t border-slate-100 dark:border-slate-800 my-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Compare Prices Across Marketplaces
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Live pricing, delivery estimates, and verified store discounts compared side-by-side.
            </p>
          </div>
          <Link
            to={`/compare/${product.id}`}
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Full Comparison View</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="pt-1">
          <PriceComparisonTable product={product} />
        </div>

        {/* FEATURE 1: AI SMART BUY RECOMMENDATION SYSTEM */}
        <div className="pt-4">
          <SmartBuyRecommendation
            product={product}
            selectedMarketplace={selectedMarketplace}
            onMarketplaceChange={setSelectedMarketplace}
          />
        </div>
      </section>

      {/* MIDDLE SECTION: Tabs Bar matching Panel 3 */}
      <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
        {/* Navigation Tabs matching Panel 3 */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1 text-xs font-extrabold">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'specifications', label: 'Specifications' },
            { id: 'features', label: 'Features' },
            { id: 'reviews', label: 'Reviews' },
            { id: 'price-history', label: 'Price History' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${activeTab === tab.id
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview matching Panel 3 Dual-Card Showcase */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Card: Key Features & SmartDeal Score */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-3">
                  Key Features
                </h3>
                <ul className="space-y-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* SmartDeal Score Gauge matching Panel 3 */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="text-xs font-bold text-slate-400 mb-2">SmartDeal Score</div>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-full bg-emerald-500/10 border-4 border-emerald-500 flex items-center justify-center text-emerald-500 font-black text-lg shadow-lg shadow-emerald-500/10">
                    <span>{product.dealScore}</span>
                    <span className="text-[10px] text-emerald-400 font-bold block -mt-1">/100</span>
                  </div>
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{product.dealScoreBreakdown?.verdict || 'Excellent Deal'}</span>
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Audited price accuracy, verified seller reputation, and verified price tracking guaranteed.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card: About this Product & Price History Sparkline matching Panel 3 */}
            <div className={`p-6 rounded-3xl border space-y-6 shadow-sm flex flex-col justify-between ${themeStyle.cardBg} ${themeStyle.cardBorder}`}>
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-3">
                  About this Product
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Price History Last 30 Days Mini Sparkline matching Panel 3 */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-400">Price History (Last 30 Days)</span>
                  <button
                    onClick={() => setActiveTab('price-history')}
                    className="text-brand-600 dark:text-brand-400 font-bold hover:underline"
                  >
                    View Full Chart &rarr;
                  </button>
                </div>

                <div className="h-28 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={last30DaysTrend}>
                      <XAxis dataKey="day" hide />
                      <YAxis hide domain={['dataMin - 1000', 'dataMax + 1000']} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          border: '1px solid #334155',
                          borderRadius: '12px',
                          fontSize: '11px',
                          color: '#fff'
                        }}
                        formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Price']}
                      />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#6366f1"
                        strokeWidth={3}
                        dot={{ r: 3, fill: '#818cf8' }}
                        activeDot={{ r: 5, fill: '#4f46e5' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span>30d ago: ₹{product.mrp.toLocaleString('en-IN')}</span>
                  <span className="text-emerald-500">Today: ₹{product.sellingPrice.toLocaleString('en-IN')} (Best Price)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Specifications (Full Flipkart Structured View) */}
        {activeTab === 'specifications' && (
          <div className="pt-2">
            <ProductFullDetailsSection product={product} />
          </div>
        )}

        {/* Tab 3: Features */}
        {activeTab === 'features' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Complete Features Breakdown</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.features.map((feat, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-800 dark:text-slate-200 font-medium">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Reviews */}
        {activeTab === 'reviews' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-6">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-4xl font-black text-slate-900 dark:text-white">{product.rating}</div>
                <div className="text-amber-500 text-sm font-bold">★★★★★</div>
                <div className="text-[11px] text-slate-400">({product.reviewsCount} verified)</div>
              </div>
              <div className="space-y-1 text-xs flex-1">
                <div className="text-slate-600 dark:text-slate-300">
                  94% of customers recommend this product based on build quality, camera fidelity, and battery efficiency.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Interactive Price History Graph */}
        {activeTab === 'price-history' && (
          <div className="space-y-6">
            <InteractivePriceHistoryChart
              product={product}
              initialMarketplace={selectedMarketplace}
              onMarketplaceChange={setSelectedMarketplace}
            />
            {/* Legacy Fake Discount Audit Card for additional cross-verification */}
            <PriceHistoryChart product={product} />
          </div>
        )}
      </div>

      {/* SECTION: FULL FLIPKART-STYLE PRODUCT SPECIFICATIONS & DETAILS */}
      <section className="pt-2">
        <ProductFullDetailsSection product={product} />
      </section>

      {/* Mobile-Only Sticky Purchase Bar (Panel 10 Screen 3) */}
      <div className={`sm:hidden fixed bottom-14 left-0 right-0 z-30 p-3 backdrop-blur-md border-t flex items-center justify-between gap-3 shadow-2xl bg-white/95 ${themeStyle.mobileBg} border-slate-200 ${themeStyle.mobileBorder}`}>
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-slate-950 dark:text-white">
              ₹{product.sellingPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-slate-400 line-through">
              ₹{product.mrp.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            {product.discountPercent}% OFF • {bestMarketplace.sellerName}
          </div>
        </div>

        <button
          onClick={handleBuyAtBestPrice}
          className={`px-5 py-2.5 rounded-xl font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 ${themeStyle.buyButton}`}
          title={`Buy directly on ${bestMarketplace.sellerName || 'Official Store'}`}
        >
          <span>Buy on {bestMarketplace.sellerName?.split(' ')[0] || 'Store'}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
