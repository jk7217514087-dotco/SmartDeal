import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { DealScoreBadge } from '../components/common/DealScoreBadge';
import { PriceComparisonTable } from '../components/common/PriceComparisonTable';
import { PriceHistoryChart } from '../components/common/PriceHistoryChart';
import { PriceAlertModal } from '../components/common/PriceAlertModal';
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

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, addToCart, wishlist, toggleWishlist, trackActivity } = useApp();
  const navigate = useNavigate();

  const product = products.find(p => p.id === id) || products[0];
  const [activeImage, setActiveImage] = useState(product.image);
  const [pincode, setPincode] = useState('110016');
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'specifications' | 'features' | 'reviews' | 'price-history'>('overview');

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

  const bestMarketplace = product.marketplacePrices[0] || {
    sellerName: 'Amazon',
    price: product.sellingPrice,
    url: '#',
    cashbackAmount: undefined as number | undefined,
  };

  const cashbackAmount =
    bestMarketplace.cashbackAmount ||
    Math.round(product.sellingPrice * 0.015);

  const handleBuyAtBestPrice = () => {
    // Navigate or trigger compare section with modal
    const element = document.getElementById('price-comparison-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/compare/${product.id}`);
    }
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
          <div className="relative aspect-square rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 flex items-center justify-center overflow-hidden shadow-sm">
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
                className={`w-16 h-16 rounded-2xl border-2 p-1.5 bg-white dark:bg-slate-800 overflow-hidden shrink-0 transition-all cursor-pointer ${activeImage === img ? 'border-brand-600 dark:border-brand-400 shadow-md scale-105' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
              >
                <img src={img} alt="" className="w-full h-full object-contain" />
              </button>
            ))}
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[11px] font-semibold text-slate-600 dark:text-slate-400">
            <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>100% Genuine</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center gap-1">
              <RotateCcw className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{product.returnDays} Days Return</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>Fast Dispatch</span>
            </div>
          </div>
        </div>

        {/* Center/Right: Product Details & Price Engine (7 cols) matching Panel 3 */}
        <div className="lg:col-span-7 space-y-6">
          {/* Brand & Title */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {product.brand}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white">
                Best Seller
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white">
                {product.discountPercent}% OFF
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-800/40">
                ★ {product.rating}
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                ({product.reviewsCount.toLocaleString('en-IN')} verified reviews)
              </span>
            </div>
          </div>

          {/* Pricing Engine Box matching Panel 3 */}
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white">
                ₹{product.sellingPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-lg text-slate-400 dark:text-slate-500 line-through">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/50">
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
              className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <span>Buy at Best Price</span>
              <ArrowRight className="w-4 h-4" />
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

      {/* MIDDLE SECTION: Tabs Bar matching Panel 3 */}
      <div className="space-y-6 pt-4">
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
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-6 shadow-sm flex flex-col justify-between">
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

        {/* Tab 2: Specifications */}
        {activeTab === 'specifications' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Full Technical Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-xs">
              {Object.entries(product.specs).map(([key, val]) => (
                <div key={key} className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold">{key}</span>
                  <span className="text-slate-900 dark:text-white font-bold text-right">{String(val)}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Warranty</span>
                <span className="text-slate-900 dark:text-white font-bold text-right">{product.warranty}</span>
              </div>
            </div>
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

        {/* Tab 5: Price History */}
        {activeTab === 'price-history' && (
          <PriceHistoryChart product={product} />
        )}
      </div>

      {/* SECTION 6: SMART PRICE COMPARISON TABLE matching Panel 4 */}
      <section id="price-comparison-section" className="space-y-6 pt-10 pb-8 border-t border-slate-100 dark:border-slate-800 my-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
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

        <div className="mt-6 pt-2">
          <PriceComparisonTable product={product} />
        </div>
      </section>

      {/* Mobile-Only Sticky Purchase Bar (Panel 10 Screen 3) */}
      <div className="sm:hidden fixed bottom-14 left-0 right-0 z-30 p-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-2xl">
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
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>Buy Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
