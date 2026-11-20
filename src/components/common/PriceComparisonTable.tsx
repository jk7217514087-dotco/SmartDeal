import React, { useState, useEffect } from 'react';
import { MarketplacePrice, Product } from '../../types';
import {
  Truck,
  Sparkles,
  ExternalLink,
  ShoppingCart,
  CheckCircle2,
  ShieldCheck,
  TrendingDown,
  ArrowUpDown,
  Lock,
  Bot,
  X,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getStoreBuyUrl } from '../../utils/storeUrls';
import { notificationService } from '../../services/notificationService';
import { PurchaseTrackerModal } from './PurchaseTrackerModal';

interface Props {
  product: Product;
  prices?: MarketplacePrice[];
  onSelectSeller?: (price: MarketplacePrice) => void;
}

export const PriceComparisonTable: React.FC<Props> = ({
  product,
  prices = product.marketplacePrices,
  onSelectSeller
}) => {
  const { trackActivity, trackOutboundClick } = useApp();
  const [sortBy, setSortBy] = useState<'best' | 'price' | 'delivery' | 'score'>('best');
  const [redirectingStore, setRedirectingStore] = useState<{
    item: MarketplacePrice;
    cleanName: string;
    url: string;
    trackingId: string;
  } | null>(null);
  const [countdown, setCountdown] = useState<number>(3);
  const [trackerStore, setTrackerStore] = useState<{
    storeName: string;
    price: number;
    url: string;
    trackingId: string;
  } | null>(null);

  useEffect(() => {
    if (!redirectingStore) return;
    if (countdown <= 0) {
      setRedirectingStore(null);
      return;
    }
    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [redirectingStore, countdown]);

  // Filter out SmartDeal so comparison is strictly between external platforms
  const rawFiltered = (prices || product.marketplacePrices).filter(
    item => !item.isSmartDealsSeller && !item.sellerName.toLowerCase().includes('smartdeal')
  );

  // Sorting
  const sortedPrices = [...rawFiltered].sort((a, b) => {
    if (sortBy === 'price') return a.finalPrice - b.finalPrice;
    if (sortBy === 'score') return b.dealScore - a.dealScore;
    if (sortBy === 'delivery') return a.deliveryCharge - b.deliveryCharge;
    // 'best' - lowest price first, then highest deal score
    return a.finalPrice - b.finalPrice;
  });

  const lowestFinalPrice = rawFiltered.length > 0 ? Math.min(...rawFiltered.map(p => p.finalPrice)) : 0;

  const initiateStoreRedirect = (item: MarketplacePrice, cleanName: string) => {
    if (!item.inStock) return;
    if (onSelectSeller) {
      onSelectSeller(item);
    }
    const trackingId = 'sd_clk_' + Math.random().toString(36).substring(2, 9);
    const targetUrl = getStoreBuyUrl(item, product);

    // Track Step 1: SELECT_MARKETPLACE
    trackActivity(
      'SELECT_MARKETPLACE',
      {
        store: cleanName,
        price: item.finalPrice,
        mrp: product.mrp,
        savings: product.mrp - item.finalPrice
      },
      product.id,
      product.name,
      product.category
    );

    // Track Step 2: BUY_PRODUCT_CLICK
    trackActivity(
      'BUY_PRODUCT_CLICK',
      {
        store: cleanName,
        price: item.finalPrice,
        stockStatus: 'IN_STOCK'
      },
      product.id,
      product.name,
      product.category
    );

    // Track Step 3: PROCEED_CLICK
    trackActivity(
      'PROCEED_CLICK',
      {
        store: cleanName,
        targetUrl,
        affiliateTrackingId: trackingId
      },
      product.id,
      product.name,
      product.category
    );

    // Track Outbound Click for affiliate commission & user cashback
    trackOutboundClick(
      product.id,
      product.name,
      product.category,
      cleanName,
      item.finalPrice,
      targetUrl
    );

    // Instant real-time SMS to 7217514087 and Email to jk7217514087@gmail.com
    notificationService.notifyBuyClick({
      clickId: trackingId,
      productId: product.id,
      productName: product.name,
      marketplace: cleanName,
      price: item.finalPrice || item.price,
      targetUrl,
      userName: 'Website Visitor',
      userContact: 'Comparison Table Click'
    });

    // Open target store immediately inside user click handler so browser never blocks it
    window.open(targetUrl, '_blank', 'noopener,noreferrer');

    // Also trigger the purchase verification tracker modal
    setTrackerStore({
      storeName: cleanName,
      price: item.finalPrice || item.price,
      url: targetUrl,
      trackingId
    });

    setCountdown(4);
    setRedirectingStore({
      item,
      cleanName,
      url: targetUrl,
      trackingId
    });
  };

  const handleInstantRedirect = () => {
    if (redirectingStore) {
      window.open(redirectingStore.url, '_blank', 'noopener,noreferrer');
      setRedirectingStore(null);
    }
  };

  const getStoreDetails = (sellerName: string) => {
    const s = sellerName.toLowerCase();
    if (s.includes('amazon')) {
      return {
        cleanName: 'Amazon',
        badge: 'Trusted Seller',
        badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        logoBg: 'bg-slate-900 border-slate-700 text-amber-500',
        letter: 'a'
      };
    }
    if (s.includes('flipkart')) {
      return {
        cleanName: 'Flipkart',
        badge: 'Trusted Seller',
        badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        logoBg: 'bg-blue-600 text-yellow-300 font-black',
        letter: 'f'
      };
    }
    if (s.includes('croma')) {
      return {
        cleanName: 'Croma',
        badge: 'Authorized Seller',
        badgeClass: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
        logoBg: 'bg-slate-900 border-teal-500/40 text-teal-400 font-bold',
        letter: 'cr'
      };
    }
    if (s.includes('reliance')) {
      return {
        cleanName: 'Reliance Digital',
        badge: 'Authorized Seller',
        badgeClass: 'bg-red-500/10 text-red-400 border-red-500/30',
        logoBg: 'bg-red-600 text-white font-black',
        letter: 'rd'
      };
    }
    return {
      cleanName: sellerName,
      badge: 'Verified Retailer',
      badgeClass: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
      logoBg: 'bg-slate-800 text-white font-bold',
      letter: sellerName.slice(0, 2).toLowerCase()
    };
  };

  return (
    <div className="space-y-6">
      {/* Table Container responsive in light and dark themes */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1322] shadow-sm dark:shadow-2xl overflow-hidden backdrop-blur-md">
        {/* Header Bar */}
        <div className="p-3 sm:p-5 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-gradient-to-r dark:from-[#0d1627] dark:via-[#0e192e] dark:to-[#0d1627]">
          {/* Desktop Header (md and up) */}
          <div className="hidden md:flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  Price Comparison Across {rawFiltered.length} Marketplaces
                </h2>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                  Real-time Verified
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2 flex-wrap">
                <span className="flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                  Best Price Guarantee
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <TrendingDown className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                  Live price tracking
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
                  100% Verified Deals
                </span>
              </div>
            </div>

            {/* Sort By Dropdown (Desktop) */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="appearance-none bg-white dark:bg-[#141e33] border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 py-1.5 pl-3 pr-8 rounded-xl focus:outline-none focus:border-brand-400 cursor-pointer shadow-2xs"
                >
                  <option value="best">Best Deal</option>
                  <option value="price">Lowest Price</option>
                  <option value="score">Deal Score</option>
                  <option value="delivery">Fastest Delivery</option>
                </select>
                <ArrowUpDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Compact Mobile Header (md:hidden) - Streamlined to elevate price comparison */}
          <div className="md:hidden space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-black text-slate-900 dark:text-white leading-tight truncate">
                Price Comparison ({rawFiltered.length} Marketplaces)
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                Verified
              </span>
            </div>

            {/* Guarantees and Sort Row (Compact single block) */}
            <div className="flex items-center justify-between gap-2 pt-0.5 text-[11px]">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 text-slate-400">
                <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 font-medium shrink-0">
                  <ShieldCheck className="w-3 h-3 text-blue-500 dark:text-blue-400" />
                  Best Price
                </span>
                <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 font-medium shrink-0">
                  <TrendingDown className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
                  Live Tracking
                </span>
                <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 font-medium shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-purple-500 dark:text-purple-400" />
                  100% Deals
                </span>
              </div>

              {/* Sort By Dropdown (Mobile) */}
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Sort:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    className="appearance-none bg-white dark:bg-[#141e33] border border-slate-300 dark:border-slate-700 text-[10px] font-bold text-slate-800 dark:text-slate-200 py-1 pl-2 pr-5 rounded-lg focus:outline-none focus:border-brand-400 cursor-pointer shadow-2xs"
                  >
                    <option value="best">Best Deal</option>
                    <option value="price">Lowest Price</option>
                    <option value="score">Deal Score</option>
                    <option value="delivery">Fast Delivery</option>
                  </select>
                  <ArrowUpDown className="w-2.5 h-2.5 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Swipe Cue - Ultra slim */}
        <div className="md:hidden px-3 py-1.5 bg-slate-100 dark:bg-[#090e1a] text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80">
          <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold">
            <span>⇄</span>
            <span>Swipe horizontally to compare store details</span>
          </span>
          <span className="text-[10px] text-slate-500 font-mono">({sortedPrices.length} stores)</span>
        </div>

        {/* The Comparison Table */}
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 pt-1 pb-1">
          <table className="w-full min-w-[540px] text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-slate-50/80 dark:bg-[#080d18]/70">
                <th className="py-2.5 sm:py-3.5 px-3 sm:px-5">Marketplace</th>
                <th className="py-2.5 sm:py-3.5 px-3 sm:px-4">Price</th>
                <th className="py-2.5 sm:py-3.5 px-3 sm:px-4">Discount</th>
                <th className="py-2.5 sm:py-3.5 px-3 sm:px-4">Delivery</th>
                <th className="py-2.5 sm:py-3.5 px-3 sm:px-5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {sortedPrices.map((item, idx) => {
                const store = getStoreDetails(item.sellerName);
                const isLowest = item.finalPrice === lowestFinalPrice;
                const discountPercent = item.discountPercent || Math.round(((product.mrp - item.finalPrice) / product.mrp) * 100);

                return (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50 dark:hover:bg-[#121c30]/70 transition-colors group"
                  >
                    {/* Marketplace */}
                    <td className="py-2.5 sm:py-4 px-3 sm:px-5">
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <div
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-xs sm:text-sm shadow-md border border-black/5 dark:border-white/10 shrink-0 ${store.logoBg}`}
                        >
                          <span className="capitalize">{store.letter}</span>
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 sm:gap-2 font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                            <span>{store.cleanName}</span>
                            {isLowest && (
                              <span className="bg-emerald-500 text-slate-950 font-black text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full shadow-sm">
                                Best Price
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px]">
                            <span className="text-amber-500 dark:text-amber-400 font-bold">
                              ★ {item.rating || 4.5}
                            </span>
                            <span className="text-slate-300 dark:text-slate-600">•</span>
                            <span className="text-slate-500 dark:text-slate-400">{store.badge}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-2.5 sm:py-4 px-3 sm:px-4">
                      <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                        ₹{item.finalPrice.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 line-through">
                        ₹{product.mrp.toLocaleString('en-IN')}
                      </div>
                    </td>

                    {/* Discount */}
                    <td className="py-2.5 sm:py-4 px-3 sm:px-4">
                      <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-bold text-[10px] sm:text-[11px]">
                        {discountPercent}% OFF
                      </span>
                    </td>

                    {/* Delivery */}
                    <td className="py-2.5 sm:py-4 px-3 sm:px-4">
                      <div className="font-semibold text-slate-700 dark:text-slate-200 text-[11px] sm:text-xs">
                        {item.deliveryDate}
                      </div>
                      <div className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400">
                        {item.deliveryCharge === 0 ? 'FREE Delivery' : `₹${item.deliveryCharge} delivery`}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-2.5 sm:py-4 px-3 sm:px-5 text-center">
                      {item.inStock ? (
                        <button
                          onClick={() => initiateStoreRedirect(item, store.cleanName)}
                          className="px-3 sm:px-6 py-1.5 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-[11px] sm:text-xs shadow-md shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-1 sm:gap-1.5"
                          title={`Buy directly on ${store.cleanName} for ₹${item.finalPrice.toLocaleString('en-IN')}`}
                        >
                          <span>Buy on {store.cleanName}</span>
                          <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-bold text-[11px] sm:text-xs text-slate-500 bg-slate-800/50 border border-slate-800 cursor-not-allowed"
                        >
                          Out of Stock
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trust Features Bar at the bottom matching screenshot */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">100% Genuine Products</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Only verified sellers & trusted platforms</div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-400 dark:border-indigo-500/30 flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">Real-time Delivery Info</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Know delivery date & charges before you buy</div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">Best Price Guarantee</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Verified lowest store pricing</div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30 flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">Secure & Safe</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Your data and payments are protected</div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-2.5 col-span-2 sm:col-span-1">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 dark:bg-purple-500/15 dark:text-purple-400 dark:border-purple-500/30 flex items-center justify-center shrink-0">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">AI Price Insights</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Get the best deal with AI recommendations</div>
          </div>
        </div>
      </div>

      {/* MULTI-STEP PURCHASE & OUTBOUND REDIRECT MODAL (Steps 5, 6, 7 from diagram) */}
      {redirectingStore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-[#0D1527] border border-blue-500/30 rounded-3xl p-6 sm:p-7 shadow-[0_0_50px_rgba(37,99,235,0.25)] text-white space-y-6 relative text-center">
            <button
              onClick={() => setRedirectingStore(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              title="Cancel Redirect"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header: You selected {Store} (Panel 7) */}
            <div className="space-y-1">
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                You selected {redirectingStore.cleanName}
              </div>
              <div className="flex items-center justify-center gap-3 pt-1">
                <span className="text-xl font-black text-white">
                  {redirectingStore.cleanName}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold">
                  ★ {redirectingStore.item.rating || 4.5}
                </span>
              </div>
              <div className="text-2xl font-black text-blue-400 mt-1">
                ₹{redirectingStore.item.finalPrice.toLocaleString('en-IN')}
              </div>
            </div>

            {/* 3D Glowing Blue Shopping Bag Illustration (Matching Panel 7) */}
            <div className="relative py-4 flex items-center justify-center">
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-blue-600/30 via-indigo-600/20 to-cyan-500/10 border border-blue-500/40 flex items-center justify-center shadow-2xl relative">
                <div className="absolute inset-0 rounded-3xl bg-blue-500/10 blur-xl animate-pulse" />
                <ShoppingCart className="w-12 h-12 text-blue-400 animate-bounce" />
                <div className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] shadow-md">
                  Exact SKU Ready
                </div>
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
              We have opened the official {redirectingStore.cleanName} product page in a new tab so you can buy directly with all verified store discounts.
            </p>

            {/* Big Blue Action Button: Open Store Page -> */}
            <div className="space-y-3 pt-1">
              <button
                onClick={handleInstantRedirect}
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-600/40 active:scale-95 transition-all cursor-pointer"
              >
                <span>Open {redirectingStore.cleanName} Product Page</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <div className="text-[11px] text-slate-400">
                Auto-closing in <strong className="text-blue-400 font-mono text-xs">{countdown}s</strong> • Tracking ID: <span className="font-mono text-slate-300">{redirectingStore.trackingId}</span>
              </div>
            </div>

            {/* 3 Bottom Security Badges (Matching Panel 7) */}
            <div className="pt-2 border-t border-slate-800 grid grid-cols-3 gap-2 text-center text-[11px] font-bold">
              <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-300 flex flex-col items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                <span>Secure Redirect</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-300 flex flex-col items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Cashback Tracking</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-300 flex flex-col items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Exact Product Page</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Tracker Modal: Triggered after visiting store to report Buy vs Not Buy */}
      {trackerStore && !redirectingStore && (
        <PurchaseTrackerModal
          isOpen={true}
          onClose={() => setTrackerStore(null)}
          productName={product.name}
          storeName={trackerStore.storeName}
          price={trackerStore.price}
          productId={product.id}
          targetUrl={trackerStore.url}
          clickId={trackerStore.trackingId}
        />
      )}
    </div>
  );
};
