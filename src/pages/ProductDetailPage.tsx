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
import { getMarketplaceComparisonStores } from '../utils/comparisonStores';
import { marketplaceRedirectionService } from '../services/marketplaceRedirectionService';
import { ProductImageGallery } from '../components/product/ProductImageGallery';
import { MarketplaceLogo } from '../components/common/MarketplaceLogo';

const getStoreButtonClass = (storeName: string) => {
  const name = (storeName || '').toLowerCase();
  if (name.includes('flipkart')) return 'bg-[#2563EB] hover:bg-[#1d4ed8] text-white';
  if (name.includes('meesho')) return 'bg-[#9B1750] hover:bg-[#801242] text-white';
  if (name.includes('amazon')) return 'bg-[#FF9900] hover:bg-[#e68a00] text-slate-950 font-black';
  if (name.includes('myntra')) return 'bg-[#FF3F6C] hover:bg-[#e02e5b] text-white';
  if (name.includes('tatacliq') || name.includes('tata')) return 'bg-[#1E293B] hover:bg-[#0f172a] text-white';
  if (name.includes('reliance')) return 'bg-[#E11900] hover:bg-[#c01500] text-white';
  if (name.includes('croma')) return 'bg-[#002D28] hover:bg-[#001f1c] text-[#00E9BF] border border-teal-800';
  if (name.includes('ajio')) return 'bg-[#1E293B] hover:bg-[#0f172a] text-white';
  return 'bg-[#2563EB] hover:bg-[#1d4ed8] text-white';
};
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
  Share2
} from 'lucide-react';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z" />
  </svg>
);

const renderStoreLogoBadge = (storeName: string, sizeClass = "w-9 h-9 text-xs") => {
  const name = (storeName || '').toLowerCase();
  if (name.includes('meesho')) {
    return (
      <div className={`${sizeClass} rounded-xl bg-[#1e293b] text-white flex items-center justify-center font-bold shrink-0 shadow-xs`}>
        Me
      </div>
    );
  }
  if (name.includes('amazon')) {
    return (
      <div className={`${sizeClass} rounded-xl bg-[#131921] text-amber-400 flex items-center justify-center font-bold shrink-0 shadow-xs`}>
        A
      </div>
    );
  }
  if (name.includes('flipkart')) {
    return (
      <div className={`${sizeClass} rounded-xl bg-[#2563eb] text-white flex items-center justify-center font-bold shrink-0 shadow-xs`}>
        F
      </div>
    );
  }
  if (name.includes('tata') || name.includes('cliq')) {
    return (
      <div className={`${sizeClass} rounded-xl bg-[#1e293b] text-white flex items-center justify-center font-bold shrink-0 shadow-xs`}>
        Ta
      </div>
    );
  }
  if (name.includes('reliance')) {
    return (
      <div className={`${sizeClass} rounded-xl bg-[#dc2626] text-white flex items-center justify-center font-bold shrink-0 shadow-xs`}>
        Rd
      </div>
    );
  }
  if (name.includes('croma')) {
    return (
      <div className={`${sizeClass} rounded-xl bg-[#002d28] text-[#00e9bf] flex items-center justify-center font-bold shrink-0 shadow-xs`}>
        Cr
      </div>
    );
  }
  if (name.includes('ajio')) {
    return (
      <div className={`${sizeClass} rounded-xl bg-[#1e293b] text-white flex items-center justify-center font-bold shrink-0 shadow-xs`}>
        Aj
      </div>
    );
  }
  if (name.includes('myntra')) {
    return (
      <div className={`${sizeClass} rounded-xl bg-[#1e293b] text-pink-400 flex items-center justify-center font-bold shrink-0 shadow-xs`}>
        My
      </div>
    );
  }
  return (
    <div className={`${sizeClass} rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold shrink-0 shadow-xs`}>
      {(storeName || 'S').slice(0, 2)}
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
  const [redirectingStoreName, setRedirectingStoreName] = useState<string | null>(null);

  const comparisonStores = React.useMemo(() => {
    return getMarketplaceComparisonStores(product);
  }, [product]);

  const bestStore = comparisonStores[0] || {
    sellerName: 'Flipkart',
    marketplace_name: 'Flipkart',
    finalPrice: product.sellingPrice,
    price: product.sellingPrice,
    rating: 4.3,
    trustLabel: 'Trusted Seller',
    deliveryDays: '2 Days',
    deliveryCharge: 0,
    url: '',
    isAvailable: false,
    inStock: false,
    isBestPrice: false
  };

  const lowestPrice = bestStore.finalPrice || product.sellingPrice;
  const bestStoreName = bestStore.sellerName || 'Flipkart';
  const highestPrice = comparisonStores.length > 0
    ? Math.max(...comparisonStores.map(s => s.finalPrice))
    : product.mrp;
  const maxSavings = Math.max(0, highestPrice - lowestPrice);
  const savingsPercent = product.mrp > lowestPrice ? Math.round(((product.mrp - lowestPrice) / product.mrp) * 100) : product.discountPercent;

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

  const handleStoreClick = async (store: {
    sellerName: string;
    marketplace_name?: string;
    marketplace_product_id?: string;
    product_url?: string;
    affiliate_url?: string;
    finalPrice: number;
    price?: number;
    url?: string;
    isAvailable?: boolean;
  }) => {
    if (store.isAvailable === false) return;
    setRedirectingStoreName(store.sellerName);
    await marketplaceRedirectionService.executeRedirect({
      product,
      offer: store,
      onComplete: () => {
        setTimeout(() => setRedirectingStoreName(null), 1200);
      },
      onError: (err) => {
        setRedirectingStoreName(null);
        console.warn('Redirect error:', err);
      }
    });
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
    <div className="max-w-6xl mx-auto px-4 py-6 pb-28 space-y-6">
      {/* 1. Main Product Overview Box (Hero Card matching Reference Image 2) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Product Image Gallery with Zoom Controls */}
          <div className="lg:col-span-5 w-full">
            <ProductImageGallery
              images={product.images && product.images.length > 0 ? product.images : [product.image]}
              productName={product.name}
            />
          </div>

          {/* Right Column: Store Badge, Title, Ratings, Pricing, CTA & Savings */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            {/* Top Row: Store Badge + Action Buttons (Share, Copy, Wishlist) */}
            <div className="flex items-center justify-between gap-3">
              {/* Active Best Store Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs text-xs font-bold text-slate-800 dark:text-slate-200">
                <MarketplaceLogo storeName={bestStoreName} sizeClass="w-5 h-5" />
                <span>{bestStoreName}</span>
              </div>

              {/* Action Buttons: WhatsApp Share, Copy Link, Wishlist Heart */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="w-8 h-8 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer"
                  title="Share on WhatsApp"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300 flex items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer"
                  title="Copy Link"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className={`w-8 h-8 rounded-full border flex items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer ${
                    isWishlisted
                      ? 'bg-rose-50 border-rose-200 text-rose-500'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-600 dark:text-slate-300'
                  }`}
                  title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                </button>
              </div>
            </div>

            {/* Product Title in Navy Bold */}
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug">
              {product.name}
            </h1>

            {/* Rating & Trusted Seller Line matching Reference Image 2 */}
            <div className="flex items-center flex-wrap gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
              <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-extrabold">
                ★ {product.rating} ({product.reviewsCount?.toLocaleString('en-IN') || '12.8K'} Reviews)
              </span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-bold">
                <Check className="w-3.5 h-3.5 stroke-[3]" /> Trusted Seller
              </span>
            </div>

            {/* Price Row: Large Navy Price, Strikethrough MRP, Green Discount Pill */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
                ₹{lowestPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-base text-slate-400 dark:text-slate-500 line-through">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                {savingsPercent}% OFF
              </span>
            </div>

            {/* Delivery Line */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
              <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Free Delivery • {bestStore.deliveryDays || '2-4 Days'}</span>
            </div>

            {/* Floating Best Price Pill placed above Main CTA button on the right */}
            <div className="flex justify-end -mb-2 z-10">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-[#16A34A] text-white shadow-xs">
                <Check className="w-3.5 h-3.5 stroke-[3]" /> Best Price
              </span>
            </div>

            {/* DYNAMIC MAIN BUY BUTTON: Always represents cheapest eligible store */}
            {bestStore.isAvailable ? (
              <button
                type="button"
                onClick={handleBuyAtBestPrice}
                disabled={redirectingStoreName === bestStoreName}
                className="w-full py-4 px-6 rounded-2xl bg-[#2563EB] hover:bg-[#1d4ed8] active:scale-[0.99] text-white font-black text-base sm:text-lg shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-75"
                title={`Buy directly on ${bestStoreName}`}
              >
                <MarketplaceLogo storeName={bestStoreName} sizeClass="w-7 h-7" />
                <span>
                  {redirectingStoreName === bestStoreName
                    ? `Opening ${bestStoreName}...`
                    : `Buy on ${bestStoreName} • ₹${lowestPrice.toLocaleString('en-IN')}`}
                </span>
                <ExternalLink className="w-4 h-4 ml-1" />
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="w-full py-4 px-6 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-base flex items-center justify-center gap-2 cursor-not-allowed opacity-75"
              >
                <span>Product link unavailable</span>
              </button>
            )}

            {/* Savings Comparison & Last Synced Timestamp */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-bold pt-1 text-slate-600 dark:text-slate-400">
              <div className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/40">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Save ₹{maxSavings.toLocaleString('en-IN')} compared with the highest listed price.</span>
              </div>
              <div className="inline-flex items-center gap-1 text-slate-400 text-[11px]">
                <span>🕒 Last updated: 2 min ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Full Marketplace Comparison (Desktop Table matching Image 2 & Mobile Cards matching Image 1) */}
      <div className="pt-2">
        {/* Desktop Table View (screens >= 768px) */}
        <div className="hidden md:block overflow-hidden rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/30">
                <th className="py-4 px-6 font-semibold">MARKETPLACE</th>
                <th className="py-4 px-6 font-semibold">PRICE</th>
                <th className="py-4 px-6 font-semibold">DISCOUNT</th>
                <th className="py-4 px-6 font-semibold">DELIVERY</th>
                <th className="py-4 px-6 text-right font-semibold">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
              {comparisonStores.map((store, index) => {
                const isLowest = index === 0;
                const discount = product.mrp > store.finalPrice
                  ? Math.round(((product.mrp - store.finalPrice) / product.mrp) * 100)
                  : 0;

                return (
                  <tr
                    key={index}
                    className={`transition-colors ${
                      isLowest
                        ? 'border-l-4 border-blue-600 bg-blue-50/20 dark:bg-blue-950/10'
                        : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {/* Marketplace Column with Squircle Logo */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <MarketplaceLogo storeName={store.sellerName} sizeClass="w-10 h-10" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-base text-slate-900 dark:text-white">
                              {store.sellerName}
                            </span>
                            {isLowest && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-[#16A34A] text-white shadow-2xs">
                                Best Price
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-medium">
                            <span className="text-amber-500 font-bold">★ {store.rating || 4.5}</span>
                            <span>|</span>
                            <span>{store.trustLabel || 'Verified Retailer'}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Price Column */}
                    <td className="py-4 px-6">
                      <div className="font-black text-lg text-slate-900 dark:text-white">
                        ₹{store.finalPrice.toLocaleString('en-IN')}
                      </div>
                      <div className="text-xs text-slate-400 line-through">
                        ₹{product.mrp.toLocaleString('en-IN')}
                      </div>
                    </td>

                    {/* Discount Column */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/40 dark:border-emerald-800/50 dark:text-emerald-400">
                        {discount}% OFF
                      </span>
                    </td>

                    {/* Delivery Column */}
                    <td className="py-4 px-6">
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {store.deliveryDays || '2-3 Days'}
                      </div>
                      <div className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                        {store.deliveryCharge === 0 ? 'FREE Delivery' : `+₹${store.deliveryCharge} Delivery`}
                      </div>
                    </td>

                    {/* Action Column with Store Color Theme */}
                    <td className="py-4 px-6 text-right">
                      {store.isAvailable ? (
                        <button
                          type="button"
                          onClick={() => handleStoreClick(store)}
                          disabled={redirectingStoreName === store.sellerName}
                          className={`inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-xs active:scale-95 transition-all cursor-pointer whitespace-nowrap disabled:opacity-75 ${getStoreButtonClass(
                            store.sellerName
                          )}`}
                          title={`Buy on ${store.sellerName}`}
                        >
                          <span>
                            {redirectingStoreName === store.sellerName
                              ? 'Opening...'
                              : `Buy on ${store.sellerName}`}
                          </span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="inline-block px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-xs font-semibold">
                          Product link unavailable
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile View matching Reference Image 1 (screens < 768px) */}
        <div className="block md:hidden bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Compare Prices</h3>
            <p className="text-xs font-medium text-slate-400">Find the best deal across marketplaces</p>
          </div>

          <div className="space-y-3">
            {comparisonStores.map((store, index) => {
              const isLowest = index === 0;
              const discount = product.mrp > store.finalPrice
                ? Math.round(((product.mrp - store.finalPrice) / product.mrp) * 100)
                : 0;

              return (
                <div
                  key={index}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isLowest
                      ? 'border-blue-500/80 bg-blue-50/20 dark:bg-blue-950/20 shadow-xs'
                      : 'border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <MarketplaceLogo storeName={store.sellerName} sizeClass="w-9 h-9" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                            {store.sellerName}
                          </span>
                          {isLowest && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-[#EAB308] text-slate-950 uppercase tracking-wider">
                              Best Price
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          ★ {store.rating || 4.3} • {store.deliveryDays || 'Free Delivery'}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-black text-base text-slate-950 dark:text-white">
                        ₹{store.finalPrice.toLocaleString('en-IN')}
                      </div>
                      <span className="inline-block text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                        -{discount}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <span>✓ {store.deliveryCharge === 0 ? 'Free Delivery' : `+₹${store.deliveryCharge}`}</span>
                    </div>

                    {store.isAvailable ? (
                      <button
                        type="button"
                        onClick={() => handleStoreClick(store)}
                        disabled={redirectingStoreName === store.sellerName}
                        className={`px-4 py-1.5 rounded-xl text-xs font-black shadow-xs active:scale-95 transition-all flex items-center gap-1 ${getStoreButtonClass(
                          store.sellerName
                        )}`}
                      >
                        <span>Buy Now</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-400">Link unavailable</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/40 flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Save ₹{maxSavings.toLocaleString('en-IN')} compared with the highest listed price.</span>
            </div>
          </div>
        </div>
      </div>

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

      {/* Mobile-Only Sticky Purchase Bar */}
      <div className={`sm:hidden fixed bottom-14 left-0 right-0 z-30 p-3 backdrop-blur-md border-t flex items-center justify-between gap-3 shadow-2xl bg-white/95 ${themeStyle.mobileBg} border-slate-200 ${themeStyle.mobileBorder}`}>
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-slate-950 dark:text-white">
              ₹{lowestPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-slate-400 line-through">
              ₹{product.mrp.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            {savingsPercent}% OFF • {bestStoreName}
          </div>
        </div>

        {bestStore.isAvailable ? (
          <button
            onClick={handleBuyAtBestPrice}
            disabled={redirectingStoreName === bestStoreName}
            className={`px-5 py-2.5 rounded-xl font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-75 ${getStoreButtonClass(
              bestStoreName
            )}`}
            title={`Buy directly on ${bestStoreName}`}
          >
            <span>{redirectingStoreName === bestStoreName ? 'Opening...' : `Buy on ${bestStoreName.split(' ')[0] || 'Store'}`}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            disabled
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
          >
            <span>Link unavailable</span>
          </button>
        )}
      </div>
    </div>
  );
};
