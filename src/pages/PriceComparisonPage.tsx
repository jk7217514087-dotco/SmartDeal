import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SmartBuyRecommendation } from '../components/product/SmartBuyRecommendation';
import { InteractivePriceHistoryChart } from '../components/product/InteractivePriceHistoryChart';
import { getMarketplaceComparisonStores, getStoreTargetUrl } from '../utils/comparisonStores';
import { notificationService } from '../services/notificationService';
import {
  Sparkles,
  CheckCircle2,
  Smartphone,
  Laptop,
  Tv,
  Shirt,
  Home,
  Scale,
  Search,
  ExternalLink,
  ShieldCheck,
  TrendingDown,
  Lock,
  Bot,
  Copy,
  Check,
  Layers
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

const COMPARE_THEMES: Record<string, {
  switcherBg: string;
  switcherBorder: string;
  searchIcon: string;
  selectBg: string;
  selectBorder: string;
}> = {
  'steel-navy': {
    switcherBg: 'bg-[#112240]',
    switcherBorder: 'border-sky-800/60',
    searchIcon: 'text-sky-400',
    selectBg: 'bg-[#0f1d35]',
    selectBorder: 'border-sky-800/60 focus:border-sky-400'
  },
  'matrix-lime': {
    switcherBg: 'bg-[#172219]',
    switcherBorder: 'border-lime-800/60',
    searchIcon: 'text-lime-400',
    selectBg: 'bg-[#141d16]',
    selectBorder: 'border-lime-800/60 focus:border-lime-400'
  },
  'sunset-coral': {
    switcherBg: 'bg-[#28113b]',
    switcherBorder: 'border-rose-900/60',
    searchIcon: 'text-rose-400',
    selectBg: 'bg-[#200d30]',
    selectBorder: 'border-rose-900/60 focus:border-rose-400'
  },
  'aurora-jade': {
    switcherBg: 'bg-[#092e20]',
    switcherBorder: 'border-emerald-800/60',
    searchIcon: 'text-emerald-400',
    selectBg: 'bg-[#072419]',
    selectBorder: 'border-emerald-800/60 focus:border-emerald-400'
  },
  'royal-gold': {
    switcherBg: 'bg-[#241a0b]',
    switcherBorder: 'border-amber-900/60',
    searchIcon: 'text-amber-400',
    selectBg: 'bg-[#2c1f0e]',
    selectBorder: 'border-amber-900/60 focus:border-amber-400'
  },
  'cyber-indigo': {
    switcherBg: 'bg-[#0f1248]',
    switcherBorder: 'border-indigo-800/60',
    searchIcon: 'text-violet-400',
    selectBg: 'bg-[#0d103d]',
    selectBorder: 'border-indigo-800/60 focus:border-violet-400'
  },
  'pure-white': {
    switcherBg: 'bg-white',
    switcherBorder: 'border-slate-200/80',
    searchIcon: 'text-indigo-600',
    selectBg: 'bg-slate-50',
    selectBorder: 'border-slate-200 focus:border-indigo-500'
  }
};

export const PriceComparisonPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, activeTheme, trackOutboundClick } = useApp();
  const navigate = useNavigate();

  const themeStyle = COMPARE_THEMES[activeTheme] || COMPARE_THEMES['steel-navy'];

  const [selectedId, setSelectedId] = useState<string>(id || products[0]?.id || '');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedMarketplace, setSelectedMarketplace] = useState<string>('flipkart');
  const [copied, setCopied] = useState<boolean>(false);

  const currentProduct = products.find(p => p.id === selectedId) || products[0];

  // Strictly sorted ascending: 1st lowest price, 2nd increased price, 3rd, 4th...
  const comparisonStores = useMemo(() => {
    return getMarketplaceComparisonStores(currentProduct);
  }, [currentProduct]);

  const bestStore = comparisonStores[0] || {
    sellerName: 'Meesho',
    finalPrice: currentProduct?.sellingPrice || 0,
    price: currentProduct?.sellingPrice || 0,
    rating: 4.3,
    trustLabel: 'Verified Retailer',
    deliveryDays: '4-5 days',
    deliveryCharge: 0,
    url: '#'
  };

  const bestStoreName = bestStore.sellerName || 'Meesho';
  const lowestPrice = bestStore.finalPrice || currentProduct.sellingPrice;
  const discountPercent = currentProduct.mrp > lowestPrice
    ? Math.round(((currentProduct.mrp - lowestPrice) / currentProduct.mrp) * 100)
    : currentProduct.discountPercent;

  const handleCopyLink = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsAppShare = () => {
    const text = `Check out ${currentProduct.name} at the lowest verified price (₹${lowestPrice.toLocaleString('en-IN')}) on SmartDeal: ${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleStoreClick = (store: { sellerName: string; finalPrice: number; price?: number; url?: string }) => {
    const storeName = store.sellerName || 'Store';
    const storePrice = store.finalPrice || store.price || currentProduct.sellingPrice;
    const trackingId = `SD-AFF-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const targetUrl = getStoreTargetUrl(storeName, currentProduct.name, store.url);

    notificationService.notifyBuyClick({
      clickId: trackingId,
      productId: currentProduct.id,
      productName: currentProduct.name,
      marketplace: storeName,
      price: storePrice,
      targetUrl,
      userName: 'Website Visitor',
      userContact: 'Price Comparison Page Store Compare'
    });

    trackOutboundClick(
      currentProduct.id,
      currentProduct.name,
      currentProduct.category,
      storeName,
      storePrice,
      targetUrl
    );

    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const categories = [
    { name: `All (${products.length})`, icon: Layers, key: 'All' },
    { name: 'Mobiles', icon: Smartphone, key: 'Mobiles' },
    { name: 'Laptops', icon: Laptop, key: 'Laptops' },
    { name: 'Electronics', icon: Tv, key: 'Electronics' },
    { name: 'Fashion', icon: Shirt, key: 'Fashion' },
    { name: 'Home & Kitchen', icon: Home, key: 'Home' },
    { name: 'Compare Prices', icon: Scale, key: 'Compare' }
  ];

  const filteredProducts = activeCategory === 'All' || activeCategory === 'Compare'
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <div className={`min-h-screen py-6 px-4 sm:px-6 lg:px-8 ${activeTheme === 'pure-white' ? 'text-slate-900' : 'text-slate-100'} transition-colors`}>
      <div className="max-w-5xl mx-auto space-y-6">

        {/* 1. Main Product Overview Box (Hero Card matching Image 1) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-start justify-between gap-4">
            {/* Left Side: Store Pill, Title, Price, Discount */}
            <div className="flex-1 space-y-2">
              {/* Store Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs text-xs font-bold text-slate-800 dark:text-slate-200">
                {renderStoreLogoBadge(bestStoreName, "w-6 h-6 text-[10px]")}
                <span>{bestStoreName}</span>
              </div>

              {/* Product Title */}
              <h1 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                {currentProduct.name}
              </h1>

              {/* Price Line */}
              <div className="flex items-baseline gap-2.5 pt-1">
                <span className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
                  ₹{lowestPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-slate-400 dark:text-slate-500 line-through">
                  ₹{currentProduct.mrp.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Green Discount */}
              <div className="flex items-center gap-1.5 text-xs font-black text-emerald-600 dark:text-emerald-400">
                <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-[10px] font-black">
                  ↓
                </span>
                <span>{discountPercent}% OFF</span>
              </div>
            </div>

            {/* Right Side: Product Image & WhatsApp / Copy Link Actions */}
            <div className="flex flex-col items-center shrink-0">
              <div className="w-24 h-28 sm:w-32 sm:h-36 rounded-2xl bg-white border border-slate-200/80 p-2 flex items-center justify-center shadow-xs">
                <img
                  src={currentProduct.image}
                  alt={currentProduct.name}
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

        {/* Product Switcher & Category Filter Bar */}
        <div className={`p-4 rounded-3xl border space-y-3 transition-all ${themeStyle.switcherBg} ${themeStyle.switcherBorder}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-400 min-w-0">
              <Search className={`w-4 h-4 shrink-0 ${themeStyle.searchIcon}`} />
              <span className="shrink-0 font-medium">Comparing for:</span>
              <span className={`${activeTheme === 'pure-white' ? 'text-slate-900' : 'text-white'} font-bold truncate`}>
                {currentProduct.name}
              </span>
            </div>

            <div className="w-full sm:w-80 shrink-0">
              <select
                value={selectedId}
                onChange={e => {
                  setSelectedId(e.target.value);
                  navigate(`/compare/${e.target.value}`);
                }}
                className={`w-full ${activeTheme === 'pure-white' ? 'text-slate-900' : 'text-white'} text-xs font-bold py-2.5 px-3 rounded-xl border focus:outline-none cursor-pointer transition-colors ${themeStyle.selectBg} ${themeStyle.selectBorder}`}
              >
                {filteredProducts.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name.slice(0, 36)}... (₹{p.sellingPrice.toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/25 ring-1 ring-indigo-400/40'
                      : activeTheme === 'pure-white'
                        ? 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                        : 'bg-[#0f172a] text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Full Marketplace Comparison Table matching Image 1 */}
        <div className="pt-1">
          <div className="overflow-x-auto rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full min-w-[620px] text-left border-collapse">
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
                  const storeDiscount = currentProduct.mrp > store.finalPrice
                    ? Math.round(((currentProduct.mrp - store.finalPrice) / currentProduct.mrp) * 100)
                    : 0;

                  return (
                    <tr
                      key={index}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Marketplace Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {renderStoreLogoBadge(store.sellerName)}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                                {store.sellerName}
                              </span>
                              {isLowest && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#059669] text-white">
                                  Best Price
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                              <span className="text-amber-500 font-bold">★ {store.rating || 4.5}</span>
                              <span>•</span>
                              <span>{store.trustLabel || 'Verified Retailer'}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Price Column */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-base text-slate-900 dark:text-white">
                          ₹{store.finalPrice.toLocaleString('en-IN')}
                        </div>
                        <div className="text-xs text-slate-400 line-through">
                          ₹{currentProduct.mrp.toLocaleString('en-IN')}
                        </div>
                      </td>

                      {/* Discount Column */}
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800/50 dark:text-emerald-400">
                          {storeDiscount}% OFF
                        </span>
                      </td>

                      {/* Delivery Column */}
                      <td className="py-4 px-6">
                        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {store.deliveryDays || '2-3 days'}
                        </div>
                        <div className="text-[11px] font-normal text-slate-400 dark:text-slate-500">
                          {store.deliveryCharge === 0 ? 'FREE Delivery' : `+₹${store.deliveryCharge} Delivery`}
                        </div>
                      </td>

                      {/* Action Column */}
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleStoreClick(store)}
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold text-xs sm:text-sm shadow-xs active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                        >
                          <span>Buy on {store.sellerName}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Five Trust Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5 shadow-2xs">
            <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">100% Genuine</div>
              <div className="text-[10px] text-slate-400">Verified Platforms</div>
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5 shadow-2xs">
            <TrendingDown className="w-5 h-5 text-emerald-500 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Real-Time Delivery</div>
              <div className="text-[10px] text-slate-400">Accurate ETAs</div>
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5 shadow-2xs">
            <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Best Price</div>
              <div className="text-[10px] text-slate-400">Lowest Across Stores</div>
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5 shadow-2xs">
            <Lock className="w-5 h-5 text-indigo-500 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Secure & Safe</div>
              <div className="text-[10px] text-slate-400">Protected Redirects</div>
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5 shadow-2xs col-span-2 sm:col-span-1">
            <Bot className="w-5 h-5 text-purple-500 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">AI Price Insights</div>
              <div className="text-[10px] text-slate-400">Smart Deal Scores</div>
            </div>
          </div>
        </div>

        {/* 4. FEATURE 1: AI SMART BUY RECOMMENDATION SYSTEM */}
        <div className="pt-2">
          <SmartBuyRecommendation
            product={currentProduct}
            selectedMarketplace={selectedMarketplace}
            onMarketplaceChange={setSelectedMarketplace}
          />
        </div>

        {/* 5. FEATURE 2: INTERACTIVE PRICE HISTORY GRAPH */}
        <div className="pt-2">
          <InteractivePriceHistoryChart
            product={currentProduct}
            initialMarketplace={selectedMarketplace}
            onMarketplaceChange={setSelectedMarketplace}
          />
        </div>
      </div>
    </div>
  );
};
