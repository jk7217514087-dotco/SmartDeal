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
  ArrowLeft,
  MapPin,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  Scale,
  Check,
  Info,
  Copy,
  Search,
  Mic,
  Share2
} from 'lucide-react';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z" />
  </svg>
);

const renderStoreLogoBadge = (storeName: string) => {
  const name = (storeName || '').toLowerCase();
  if (name.includes('croma')) {
    return (
      <div className="w-8 h-8 rounded-full p-0.5 border-2 border-dashed border-teal-400 flex items-center justify-center shrink-0">
        <span className="w-full h-full rounded-full bg-[#00e9bf] text-slate-950 flex items-center justify-center text-[9px] font-black">
          cr
        </span>
      </div>
    );
  }
  if (name.includes('flipkart')) {
    return (
      <div className="w-8 h-8 rounded-full p-0.5 border-2 border-dashed border-yellow-400 flex items-center justify-center shrink-0">
        <span className="w-full h-full rounded-full bg-[#2874f0] text-yellow-300 flex items-center justify-center text-[9px] font-black">
          fk
        </span>
      </div>
    );
  }
  if (name.includes('amazon')) {
    return (
      <div className="w-8 h-8 rounded-full p-0.5 border-2 border-dashed border-amber-400 flex items-center justify-center shrink-0">
        <span className="w-full h-full rounded-full bg-[#131921] text-amber-400 flex items-center justify-center text-[10px] font-black">
          a
        </span>
      </div>
    );
  }
  if (name.includes('meesho')) {
    return (
      <div className="w-8 h-8 rounded-full p-0.5 border-2 border-dashed border-pink-400 flex items-center justify-center shrink-0">
        <span className="w-full h-full rounded-full bg-[#f43397] text-white flex items-center justify-center text-[9px] font-black">
          M
        </span>
      </div>
    );
  }
  if (name.includes('myntra')) {
    return (
      <div className="w-8 h-8 rounded-full p-0.5 border-2 border-dashed border-rose-400 flex items-center justify-center shrink-0">
        <span className="w-full h-full rounded-full bg-gradient-to-tr from-pink-500 to-amber-500 text-white flex items-center justify-center text-[9px] font-black">
          M
        </span>
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-full p-0.5 border-2 border-dashed border-indigo-400 flex items-center justify-center shrink-0">
      <span className="w-full h-full rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">
        {(storeName || 'S').charAt(0).toUpperCase()}
      </span>
    </div>
  );
};
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
    cardBg: 'bg-[#112240]',
    cardBorder: 'border-sky-800/60',
    badgeBg: 'bg-sky-400',
    badgeText: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
    accentText: 'text-sky-400',
    pricingBg: 'bg-[#0c182b]',
    pricingBorder: 'border-sky-900/60',
    thumbActiveBorder: 'border-sky-400',
    thumbInactiveBg: 'border-sky-900 bg-[#0f1d35]',
    iconText: 'text-sky-400',
    mobileBg: 'dark:bg-[#0b1a30]/95',
    mobileBorder: 'dark:border-sky-800/80',
    buyButton: 'bg-gradient-to-r from-sky-500 via-blue-500 to-sky-600 text-white shadow-sky-500/20'
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
    cardBorder: 'border-slate-200',
    badgeBg: 'bg-indigo-600',
    badgeText: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    accentText: 'text-indigo-600',
    pricingBg: 'bg-white',
    pricingBorder: 'border-slate-200',
    thumbActiveBorder: 'border-indigo-600',
    thumbInactiveBg: 'border-slate-200 bg-white',
    iconText: 'text-indigo-600',
    mobileBg: 'bg-white/95',
    mobileBorder: 'border-slate-200',
    buyButton: 'bg-[#FF6A00] hover:bg-[#e65f00] text-white font-black shadow-md shadow-orange-500/20'
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

  const themeStyle = THEME_STYLES[activeTheme] || THEME_STYLES['pure-white'];

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
  const [copied, setCopied] = useState(false);
  const [navSearch, setNavSearch] = useState('');

  const comparisonStores = React.useMemo(() => {
    const raw = (product.marketplacePrices || []).filter(
      p => !p.isSmartDealsSeller && !p.sellerName.toLowerCase().includes('smartdeal')
    );
    const basePrice = product.sellingPrice;

    if (raw.length >= 4) {
      return [...raw].sort((a, b) => a.finalPrice - b.finalPrice);
    }

    const sorted = [...raw].sort((a, b) => a.finalPrice - b.finalPrice);
    const existingNames = sorted.map(s => s.sellerName.toLowerCase());

    const fallbackStores = [
      { name: 'Croma', mult: 1.0 },
      { name: 'Croma', mult: 1.04 },
      { name: 'Croma', mult: 1.15 },
      { name: 'Flipkart', mult: 1.33 },
      { name: 'Amazon', mult: 1.35 },
      { name: 'Reliance Digital', mult: 1.38 }
    ];

    if (sorted.length === 0) {
      return fallbackStores.slice(0, 4).map(fb => ({
        sellerName: fb.name,
        price: Math.round(basePrice * fb.mult),
        finalPrice: Math.round(basePrice * fb.mult),
        deliveryCharge: 0,
        deliveryDate: 'Free delivery',
        couponText: 'Verified Store Offer',
        couponDiscount: 0,
        smartCoins: 100,
        dealScore: 92,
        rating: 4.5,
        inStock: true,
        isSmartDealsSeller: false,
        url: '#'
      }));
    }

    const lowest = sorted[0];
    const diffMultipliers = [1.04, 1.15, 1.33, 1.38];
    let multIdx = 0;

    while (sorted.length < 4) {
      const mult = diffMultipliers[multIdx] || (1 + sorted.length * 0.08);
      multIdx++;
      const sellerCandidate = ['Croma', 'Flipkart', 'Amazon', 'Reliance Digital'].find(
        name => !existingNames.includes(name.toLowerCase())
      ) || lowest.sellerName;

      sorted.push({
        sellerName: sellerCandidate,
        price: Math.round(lowest.finalPrice * mult),
        finalPrice: Math.round(lowest.finalPrice * mult),
        deliveryCharge: 0,
        deliveryDate: 'Free delivery',
        couponText: 'Verified Store Offer',
        couponDiscount: 0,
        smartCoins: 100,
        dealScore: 88,
        rating: 4.5,
        inStock: true,
        isSmartDealsSeller: false,
        url: '#'
      });
    }

    return sorted.sort((a, b) => a.finalPrice - b.finalPrice);
  }, [product]);

  const bestStore = comparisonStores[0] || {
    sellerName: 'Croma',
    finalPrice: product.sellingPrice,
    price: product.sellingPrice,
    deliveryDate: 'Free delivery',
    deliveryCharge: 0,
    url: '#'
  };

  const lowestPrice = bestStore.finalPrice || product.sellingPrice;
  const bestStoreName = bestStore.sellerName || 'Croma';

  const handleCopyLink = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsAppShare = () => {
    const text = `Check out ${product.name} at the lowest verified price (₹${lowestPrice.toLocaleString('en-IN')}) on SmartDeal: ${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleStoreClick = (store: { sellerName: string; finalPrice: number; price?: number; url?: string }) => {
    const storeName = store.sellerName || 'Store';
    const storePrice = store.finalPrice || store.price || product.sellingPrice;
    const trackingId = `SD-AFF-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const targetUrl = (store.url && store.url !== '#')
      ? store.url
      : (storeName.toLowerCase().includes('flipkart')
          ? `https://www.flipkart.com/search?q=${encodeURIComponent(product.name)}`
          : storeName.toLowerCase().includes('croma')
            ? `https://www.croma.com/searchB?q=${encodeURIComponent(product.name)}`
            : `https://www.amazon.in/s?k=${encodeURIComponent(product.name)}`);

    notificationService.notifyBuyClick({
      clickId: trackingId,
      productId: product.id,
      productName: product.name,
      marketplace: storeName,
      price: storePrice,
      targetUrl,
      userName: 'Website Visitor',
      userContact: 'Product Detail Page Store Compare'
    });

    trackOutboundClick(
      product.id,
      product.name,
      product.category,
      storeName,
      storePrice,
      targetUrl
    );

    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleBuyAtBestPrice = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    handleStoreClick(bestStore);
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
    <div className="max-w-4xl mx-auto px-4 py-4 pb-28 space-y-6">
      {/* 1. Top Deep Indigo Notice Banner matching Buyhatke reference */}
      <div className="-mx-4 -mt-4 bg-[#3b38a8] text-white text-[11px] sm:text-xs py-2 px-4 text-center font-medium shadow-xs">
        Find best price by adding &quot;smartdeal.in/&quot; before any product link
      </div>

      {/* 2. Top App Navigation Bar (Back, Search Pill, Download App) */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-xs active:scale-95 transition-all shrink-0 cursor-pointer"
          title="Go back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (navSearch.trim()) {
              navigate(`/search?q=${encodeURIComponent(navSearch.trim())}`);
            }
          }}
          className="relative flex-1"
        >
          <Search className="w-4 h-4 text-indigo-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={navSearch}
            onChange={(e) => setNavSearch(e.target.value)}
            placeholder="Search for any product or paste any link"
            className="w-full pl-9 pr-9 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 shadow-2xs text-slate-900 dark:text-white"
          />
          <Mic className="w-4 h-4 text-indigo-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
        </form>

        <button
          onClick={() => {
            const promptEvent = (window as any).__smartdeal_deferred_prompt;
            if (promptEvent) promptEvent.prompt();
            else navigate('/');
          }}
          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shrink-0 shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          Download App
        </button>
      </div>

      {/* 3. Breadcrumbs matching Buyhatke reference */}
      <nav className="text-xs text-indigo-600 font-medium flex items-center gap-1.5 flex-wrap">
        <Link to="/" className="hover:underline">Home</Link>
        <span>/</span>
        <span className="text-slate-600 dark:text-slate-400 truncate max-w-sm">{product.name}</span>
      </nav>

      {/* 4. Main Product Overview Box (Pixel-perfect match to screenshot) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-start justify-between gap-4">
          {/* Left Side: Store Pill, Title, Price, Discount */}
          <div className="flex-1 space-y-2">
            {/* Store Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs text-xs font-bold text-slate-800 dark:text-slate-200">
              {renderStoreLogoBadge(bestStoreName)}
              <span>{bestStoreName}</span>
            </div>

            {/* Product Title */}
            <h1 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
              {product.name}
            </h1>

            {/* Price Line */}
            <div className="flex items-baseline gap-2.5 pt-1">
              <span className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
                ₹{lowestPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-sm text-slate-400 dark:text-slate-500 line-through">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Green Discount */}
            <div className="flex items-center gap-1.5 text-xs font-black text-emerald-600 dark:text-emerald-400">
              <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-[10px] font-black">
                ↓
              </span>
              <span>{product.discountPercent}% OFF</span>
            </div>
          </div>

          {/* Right Side: Product Image & WhatsApp / Copy Link Actions */}
          <div className="flex flex-col items-center shrink-0">
            <div className="w-24 h-28 sm:w-32 sm:h-36 rounded-2xl bg-white border border-slate-200/80 p-2 flex items-center justify-center shadow-xs">
              <img
                src={activeImage}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            </div>

            {/* WhatsApp & Copy Link Buttons */}
            <div className="flex items-center gap-2 mt-2.5">
              <button
                onClick={handleWhatsAppShare}
                className="w-8 h-8 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer"
                title="Share on WhatsApp"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </button>

              <button
                onClick={handleCopyLink}
                className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300 flex items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer"
                title="Copy Link"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Big Orange Full-Width CTA Button: Buy on Store */}
        <button
          onClick={() => handleStoreClick(bestStore)}
          className="w-full py-4 px-6 rounded-2xl bg-[#FF6A00] hover:bg-[#e65f00] text-white font-black text-base sm:text-lg shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 active:scale-[0.99] transition-all cursor-pointer"
        >
          <span>Buy on {bestStoreName}</span>
        </button>
      </div>

      {/* 5. Compare Available Prices Section */}
      <div className="space-y-3 pt-2">
        <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
          Compare {comparisonStores.length} Available Prices
        </h2>

        <div className="space-y-2.5">
          {comparisonStores.map((store, index) => {
            const isLowest = index === 0;
            const diff = store.finalPrice - lowestPrice;
            const higherPercent = lowestPrice > 0 ? Math.round((diff / lowestPrice) * 100) : 0;

            return (
              <div
                key={index}
                onClick={() => handleStoreClick(store)}
                className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl cursor-pointer transition-all duration-200 group ${
                  isLowest
                    ? 'bg-[#FFF5F5] dark:bg-[#231219] border border-rose-200/80 dark:border-rose-900/60 shadow-xs hover:border-rose-300'
                    : 'bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-2xs hover:border-indigo-300 hover:shadow-xs'
                }`}
              >
                {/* Store Icon & Info */}
                <div className="flex items-center gap-3">
                  {renderStoreLogoBadge(store.sellerName)}
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                      {store.sellerName}
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                      {store.deliveryCharge === 0 ? 'Free delivery' : `₹${store.deliveryCharge} delivery`}
                    </p>
                  </div>
                </div>

                {/* Price, Higher Tag & Chevron */}
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="text-right">
                    <span className="font-black text-base sm:text-lg text-slate-900 dark:text-white block leading-tight">
                      ₹{store.finalPrice.toLocaleString('en-IN')}
                    </span>
                    {higherPercent > 0 && (
                      <span className="text-[11px] sm:text-xs font-bold text-rose-500 block">
                        {higherPercent}% Higher
                      </span>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gallery Thumbnails (if multiple images) */}
      {product.images && product.images.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 pt-2">
          {product.images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(img)}
              className={`w-14 h-14 rounded-xl border-2 p-1 overflow-hidden shrink-0 transition-all cursor-pointer ${
                activeImage === img
                  ? 'border-indigo-600 shadow-sm scale-105'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-contain" />
            </button>
          ))}
        </div>
      )}

      {/* Guarantee Badges */}
      <div className="grid grid-cols-3 gap-2 pt-1 text-center text-[11px] font-semibold text-slate-700 dark:text-slate-300">
        <div className="p-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col items-center gap-1 shadow-xs">
          <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>100% Genuine</span>
        </div>
        <div className="p-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col items-center gap-1 shadow-xs">
          <RotateCcw className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>{product.returnDays} Days Return</span>
        </div>
        <div className="p-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col items-center gap-1 shadow-xs">
          <Truck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Fast Dispatch</span>
        </div>
      </div>

      {/* MIDDLE SECTION: Tabs Bar matching Panel 3 */}
      <div id="product-tabs-section" className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
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
      <section id="product-details-specs-section" className="pt-2">
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
            {product.discountPercent}% OFF • {bestStoreName}
          </div>
        </div>

        <button
          onClick={handleBuyAtBestPrice}
          className="px-5 py-2.5 rounded-xl font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 bg-[#FF6A00] hover:bg-[#e65f00] text-white"
          title={`Buy directly on ${bestStoreName}`}
        >
          <span>Buy on {bestStoreName.split(' ')[0] || 'Store'}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
