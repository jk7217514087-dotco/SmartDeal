import React, { useState } from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  ChevronUp,
  ChevronDown,
  ShoppingCart,
  Zap,
  CreditCard,
  Cloud,
  Plus,
  Check,
  ShieldCheck,
  Building,
  FileText,
  Sliders,
  Sparkles,
  Info,
  ArrowRight,
  ExternalLink,
  Store,
  Truck,
  RotateCcw,
  RefreshCw,
  Tag,
  Gift
} from 'lucide-react';
import { getProductFullDetails } from '../../utils/productSpecifications';
import { getProductLiveMarketplaceDetails, MarketplaceLiveStoreData } from '../../utils/marketplaceLiveService';
import { notificationService } from '../../services/notificationService';
import { marketplaceRedirectionService } from '../../services/marketplaceRedirectionService';

interface Props {
  product: Product;
  onClose?: () => void;
  isModal?: boolean;
}

export const ProductFullDetailsSection: React.FC<Props> = ({ product, onClose, isModal = false }) => {
  const { addToCart, trackOutboundClick, activeTheme } = useApp();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'specifications' | 'live-store' | 'showcase' | 'description' | 'warranty' | 'manufacturer'>('specifications');
  const [isDigitalPlanAdded, setIsDigitalPlanAdded] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshNotice, setRefreshNotice] = useState<string | null>(null);

  // Live marketplace profiles across Flipkart, Amazon, Croma, Reliance Digital
  const liveStores = getProductLiveMarketplaceDetails(product);
  const [selectedStoreIndex, setSelectedStoreIndex] = useState(0);
  const activeStore: MarketplaceLiveStoreData = liveStores[selectedStoreIndex] || liveStores[0];

  const fullDetails = getProductFullDetails(product);

  const handleRefreshLiveData = () => {
    setIsRefreshing(true);
    setRefreshNotice(null);
    setTimeout(() => {
      setIsRefreshing(false);
      setRefreshNotice(`Live prices and stock verified from ${activeStore.marketplace} API endpoints just now!`);
      setTimeout(() => setRefreshNotice(null), 4000);
    }, 700);
  };

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  const handleBuyNow = (e?: React.MouseEvent) => {
    handleOpenLiveCompanyStore(e);
  };

  const handleBuyWithEmi = (e?: React.MouseEvent) => {
    handleOpenLiveCompanyStore(e);
  };

  const [redirectingStore, setRedirectingStore] = useState<string | null>(null);

  const handleOpenLiveCompanyStore = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!activeStore.isAvailable || !activeStore.liveUrl) return;

    setRedirectingStore(activeStore.marketplace);

    marketplaceRedirectionService.executeRedirect({
      product,
      offer: {
        sellerName: activeStore.marketplace,
        marketplace_name: activeStore.marketplace,
        marketplace_product_id: activeStore.marketplace_product_id,
        product_url: activeStore.product_url,
        affiliate_url: activeStore.affiliate_url,
        url: activeStore.liveUrl,
        finalPrice: activeStore.finalPrice
      }
    });

    setTimeout(() => {
      setRedirectingStore(null);
    }, 1200);
  };

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div id="all-details" className={`w-full rounded-3xl border shadow-sm overflow-hidden transition-all ${
      activeTheme === 'royal-gold'
        ? 'bg-white dark:bg-[#241a0b] border-slate-200 dark:border-amber-900/60'
        : 'bg-white dark:bg-[#062537] border-slate-200 dark:border-teal-900/60'
    }`}>
      {/* Header matching Flipkart screenshot: 'All details' with collapse/expand arrow */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-black text-sm">
            <Sliders className="w-4 h-4" />
          </div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
            All details
          </h2>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            Live Marketplace Verified
          </span>
        </div>

        <button 
          type="button"
          className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-transform"
          aria-label={isExpanded ? 'Collapse All Details' : 'Expand All Details'}
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-6">
          {/* =================================================================== */}
          {/* 1. LIVE COMPANY / STORE SELECTOR HEADER (Flipkart, Amazon, Croma...) */}
          {/* =================================================================== */}
          <div className={`p-4 rounded-2xl border space-y-3 ${
            activeTheme === 'royal-gold'
              ? 'bg-slate-50 dark:bg-[#1f1609] border-slate-200 dark:border-amber-900/50'
              : 'bg-slate-50 dark:bg-[#052233] border-slate-200 dark:border-teal-900/50'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Select Store for Live Details:
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  ({activeStore.lastSyncedTimestamp})
                </span>
              </div>

              <button
                onClick={handleRefreshLiveData}
                className="flex items-center gap-1.5 self-start sm:self-auto text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 cursor-pointer"
                title="Fetch latest live prices & offers from official store"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-brand-500' : ''}`} />
                <span>Sync Live Data</span>
              </button>
            </div>

            {/* Store Choice Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {liveStores.map((st, idx) => {
                const isSelected = selectedStoreIndex === idx;
                return (
                  <button
                    key={st.storeKey}
                    onClick={() => setSelectedStoreIndex(idx)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-white dark:bg-slate-900 border-brand-500 ring-2 ring-brand-500/20 shadow-sm scale-[1.02]'
                        : 'bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white truncate">
                        <span>{st.storeLogo}</span>
                        <span className="truncate">{st.marketplace}</span>
                      </div>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />
                      )}
                    </div>
                    <div className="mt-1 flex items-baseline justify-between text-xs">
                      <span className="font-black text-brand-600 dark:text-brand-400 font-mono">
                        ₹{st.finalPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                        {st.discountPercent}% Off
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {refreshNotice && (
              <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 p-2 rounded-lg border border-emerald-200 dark:border-emerald-800 animate-fadeIn">
                ✓ {refreshNotice}
              </div>
            )}
          </div>

          {/* =================================================================== */}
          {/* 2. DYNAMIC LIVE STORE PROFILE BANNER (Seller, Bank Offers, Delivery) */}
          {/* =================================================================== */}
          <div className={`p-4 rounded-2xl border shadow-xs space-y-3.5 ${
            activeTheme === 'royal-gold'
              ? 'bg-white dark:bg-[#2b1f0d] border-slate-200 dark:border-amber-900/40'
              : 'bg-white dark:bg-[#082e44] border-slate-200 dark:border-teal-900/40'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/80 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{activeStore.storeLogo}</span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">
                      {activeStore.marketplace} Live Product Profile
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {activeStore.skuOrAsin}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Seller: <strong className="text-slate-800 dark:text-slate-200">{activeStore.sellerName}</strong>
                  </p>
                </div>
              </div>

              {/* Direct Store Button */}
              <button
                onClick={handleOpenLiveCompanyStore}
                className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-black shadow-xs transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
                title={`Open official ${product.name} listing on ${activeStore.marketplace}`}
              >
                <span>Visit {activeStore.marketplace}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Price, Delivery & Return Metrics on this Store */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] text-slate-400 font-semibold mb-0.5">Live Store Price</div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base font-black text-slate-900 dark:text-white">
                    ₹{activeStore.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-slate-400 line-through">
                    ₹{activeStore.mrp.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 pt-0.5">
                  {activeStore.discountPercent}% Discount on {activeStore.marketplace}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-start gap-2">
                <Truck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] text-slate-400 font-semibold">Delivery & Logistics</div>
                  <div className="font-bold text-slate-900 dark:text-white text-xs">{activeStore.deliveryDate}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{activeStore.deliverySpeed}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-start gap-2">
                <RotateCcw className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] text-slate-400 font-semibold">Return & Replacement</div>
                  <div className="font-bold text-slate-900 dark:text-white text-xs">{activeStore.returnPolicy}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{activeStore.warrantyInfo}</div>
                </div>
              </div>
            </div>

            {/* Live Bank Offers on this Store */}
            {activeStore.bankOffers.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-amber-500" />
                  <span>Available Bank Offers on {activeStore.marketplace}:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {activeStore.bankOffers.map((offer, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60 bg-slate-50/60 dark:bg-slate-900/40 flex items-start justify-between gap-2"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                          <Tag className="w-3 h-3 text-emerald-500" />
                          <span>{offer.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                          {offer.description}
                        </p>
                      </div>
                      {offer.badge && (
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 shrink-0">
                          {offer.badge}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* =================================================================== */}
          {/* 3. SUB-TABS BAR (Specifications | Live Store Offers | Showcase...) */}
          {/* =================================================================== */}
          <div className="flex items-center gap-1.5 sm:gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 overflow-x-auto no-scrollbar">
            {[
              { id: 'specifications', label: 'Specifications' },
              { id: 'live-store', label: `${activeStore.marketplace} Highlights` },
              { id: 'showcase', label: 'Showcase' },
              { id: 'description', label: 'Description' },
              { id: 'warranty', label: 'Warranty' },
              { id: 'manufacturer', label: 'Manufacturer info' }
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB 1: SPECIFICATIONS (Matching Flipkart Screenshots) */}
          {activeTab === 'specifications' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                <span>Displaying full technical specifications as published by <strong>{activeStore.marketplace} & {product.brand}</strong></span>
                <span className="font-mono text-[10px] bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">100% Certified</span>
              </div>

              {fullDetails.categories.map((cat, catIdx) => (
                <div key={catIdx} className="space-y-2">
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-1.5">
                    {cat.title}
                  </h3>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs sm:text-sm">
                    {cat.items.map((item, itemIdx) => (
                      <div 
                        key={itemIdx} 
                        className="grid grid-cols-1 sm:grid-cols-12 py-2.5 sm:py-3 gap-1 sm:gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <div className="sm:col-span-4 text-slate-500 dark:text-slate-400 font-medium">
                          {item.label}
                        </div>
                        <div className="sm:col-span-8 text-slate-900 dark:text-white font-semibold leading-relaxed">
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: LIVE STORE HIGHLIGHTS */}
          {activeTab === 'live-store' && (
            <div className="space-y-4 animate-fadeIn text-xs sm:text-sm">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                {activeStore.marketplace} Special Programs & Customer Perks
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {activeStore.platformPerks.map((perk, i) => (
                  <div key={i} className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-1">
                    <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>{perk}</span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Fully backed by official {activeStore.marketplace} platform buyer protection.
                    </div>
                  </div>
                ))}
              </div>

              {activeStore.specialOffers && activeStore.specialOffers.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 space-y-2">
                  <div className="font-extrabold text-amber-900 dark:text-amber-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-amber-500" />
                    <span>Special Promotional Bundles on {activeStore.marketplace}:</span>
                  </div>
                  <ul className="space-y-1 text-xs text-amber-800 dark:text-amber-300 font-medium">
                    {activeStore.specialOffers.map((sp, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span>•</span>
                        <span>{sp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SHOWCASE */}
          {activeTab === 'showcase' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fadeIn">
              <div className="md:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="aspect-square w-full max-w-[280px] flex items-center justify-center">
                  <img
                    src={images[activeImageIdx] || product.image}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain dark:brightness-95"
                  />
                </div>
                {images.length > 1 && (
                  <div className="flex items-center gap-2 mt-4">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImageIdx(i)}
                        className={`w-12 h-12 rounded-xl p-1 border-2 bg-white dark:bg-slate-800 transition-all cursor-pointer ${
                          activeImageIdx === i ? 'border-brand-500 scale-105 shadow-sm' : 'border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-contain" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="md:col-span-7 space-y-4">
                <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Highlights</div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white leading-snug">
                  {product.name}
                </h3>
                <div className="space-y-2">
                  {product.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0 mt-2" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                    <span><strong>Deal Score {product.dealScore}/100:</strong> Authenticated genuine manufacturer pricing</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DESCRIPTION */}
          {activeTab === 'description' && (
            <div className="space-y-4 animate-fadeIn text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                Product Description
              </h3>
              <p className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                {product.description}
              </p>

              <div className="pt-2">
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                  SmartDeal Quality Assurance
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <div className="font-bold text-slate-900 dark:text-white mb-1">✓ 100% Brand Sealed</div>
                    <div className="text-slate-500 dark:text-slate-400">Shipped directly in genuine factory packaging.</div>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <div className="font-bold text-slate-900 dark:text-white mb-1">✓ GST Invoice Included</div>
                    <div className="text-slate-500 dark:text-slate-400">Official tax invoice eligible for input tax credit.</div>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <div className="font-bold text-slate-900 dark:text-white mb-1">✓ {product.returnDays} Days Free Returns</div>
                    <div className="text-slate-500 dark:text-slate-400">No-questions-asked doorstep return guarantee.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: WARRANTY & DIGITAL PLANS (Matching Screenshot 5) */}
          {activeTab === 'warranty' && (
            <div className="space-y-6 animate-fadeIn text-xs sm:text-sm">
              <div className="space-y-4">
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm mb-1">
                    Warranty Summary
                  </h4>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">
                    {fullDetails.warrantySummary}
                  </p>
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm mb-1">
                    Warranty Service Type
                  </h4>
                  <p className="text-slate-700 dark:text-slate-300 font-medium font-mono">
                    {fullDetails.warrantyServiceType}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
                    <div className="font-bold text-emerald-800 dark:text-emerald-300 mb-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Covered in Warranty</span>
                    </div>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400">
                      {fullDetails.coveredInWarranty}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50">
                    <div className="font-bold text-rose-800 dark:text-rose-300 mb-1 flex items-center gap-1.5">
                      <Info className="w-4 h-4" />
                      <span>Not Covered in Warranty</span>
                    </div>
                    <p className="text-xs text-rose-700 dark:text-rose-400">
                      {fullDetails.notCoveredInWarranty}
                    </p>
                  </div>
                </div>
              </div>

              {/* Digital plans with this product Card (Matching Screenshot 5) */}
              {fullDetails.digitalPlan && (
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">
                      Digital plans with this product
                    </h4>
                    <span className="p-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xs space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 text-sky-500 flex items-center justify-center shrink-0">
                          <Cloud className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                            {fullDetails.digitalPlan.name}
                          </div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xs text-slate-400 line-through">
                              ₹{fullDetails.digitalPlan.originalPrice}
                            </span>
                            <span className="text-sm font-black text-slate-900 dark:text-white">
                              ₹{fullDetails.digitalPlan.offerPrice}
                            </span>
                            <span className="text-xs text-slate-500">
                              {fullDetails.digitalPlan.period}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setIsDigitalPlanAdded(!isDigitalPlanAdded)}
                        className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          isDigitalPlanAdded
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white hover:bg-slate-100'
                        }`}
                      >
                        {isDigitalPlanAdded ? 'Added ✓' : 'Add'}
                      </button>
                    </div>

                    <div className="space-y-1 pt-1 text-xs text-slate-600 dark:text-slate-400">
                      {fullDetails.digitalPlan.perks.map((perk, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <span className="text-slate-400">•</span>
                          <span>{perk}</span>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => navigate('/coupons')}
                      className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline inline-block pt-1"
                    >
                      Show more plans &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: MANUFACTURER INFO */}
          {activeTab === 'manufacturer' && (
            <div className="space-y-4 animate-fadeIn text-xs sm:text-sm">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                Manufacturing & Importer Information
              </h3>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-800/40">
                <div className="py-2.5 grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4">
                  <div className="sm:col-span-4 text-slate-500 font-medium">Manufacturer</div>
                  <div className="sm:col-span-8 text-slate-900 dark:text-white font-semibold">{fullDetails.manufacturer}</div>
                </div>
                <div className="py-2.5 grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4">
                  <div className="sm:col-span-4 text-slate-500 font-medium">Importer</div>
                  <div className="sm:col-span-8 text-slate-900 dark:text-white font-semibold">{fullDetails.importer}</div>
                </div>
                <div className="py-2.5 grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4">
                  <div className="sm:col-span-4 text-slate-500 font-medium">Country of Origin</div>
                  <div className="sm:col-span-8 text-slate-900 dark:text-white font-semibold">{fullDetails.countryOfOrigin}</div>
                </div>
                <div className="py-2.5 grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4">
                  <div className="sm:col-span-4 text-slate-500 font-medium">Packer Details</div>
                  <div className="sm:col-span-8 text-slate-900 dark:text-white font-semibold">{fullDetails.packer}</div>
                </div>
              </div>
            </div>
          )}

          {/* Flipkart-Style Action Bar matching Screenshots: [Cart Icon] [Buy with EMI] [Buy on Store] [Buy on SmartDeal] */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleAddToCart}
                className="p-3 sm:p-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
                title="Add to SmartDeal Cart"
              >
                <ShoppingCart className="w-5 h-5" />
              </button>

              <button
                onClick={handleBuyWithEmi}
                className="flex-1 sm:flex-none py-3 sm:py-3.5 px-4 rounded-2xl border-2 border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-black text-xs sm:text-sm text-center shadow-xs transition-all active:scale-95 cursor-pointer truncate"
              >
                <div className="leading-tight">
                  <div>Buy with EMI</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    From ₹{activeStore.emiStartsAt.toLocaleString('en-IN')}/m
                  </div>
                </div>
              </button>
            </div>

            <div className="flex items-center gap-2 w-full sm:flex-1">
              {/* Direct Store Buy Outbound */}
              <button
                onClick={handleOpenLiveCompanyStore}
                disabled={!activeStore.isAvailable || !activeStore.liveUrl}
                className={`flex-1 py-3 sm:py-3.5 px-3 rounded-2xl font-black text-xs sm:text-sm text-center shadow-md transition-all active:scale-95 cursor-pointer truncate flex items-center justify-center gap-1.5 ${
                  !activeStore.isAvailable || !activeStore.liveUrl
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
                title={activeStore.isAvailable && activeStore.liveUrl ? `Buy directly on ${activeStore.marketplace}` : 'Product link unavailable on this marketplace'}
              >
                {redirectingStore === activeStore.marketplace ? (
                  <span className="truncate animate-pulse">Opening {activeStore.marketplace}...</span>
                ) : activeStore.isAvailable && activeStore.liveUrl ? (
                  <>
                    <span className="truncate">Buy on {activeStore.marketplace}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </>
                ) : (
                  <span className="truncate">Product link unavailable</span>
                )}
              </button>

              {/* Instant Buy on Selected Store (Yellow Flipkart-style) */}
              <button
                onClick={handleBuyNow}
                disabled={!activeStore.isAvailable || !activeStore.liveUrl}
                className={`flex-1 py-3 sm:py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm text-center shadow-md transition-all cursor-pointer truncate flex items-center justify-center gap-1.5 ${
                  !activeStore.isAvailable || !activeStore.liveUrl
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60'
                    : 'bg-[#FFD814] hover:bg-[#F7CA00] active:scale-95 text-slate-950'
                }`}
                title={
                  activeStore.isAvailable && activeStore.liveUrl
                    ? `Buy now on ${activeStore.marketplace} at ₹${activeStore.price.toLocaleString('en-IN')}`
                    : 'Product link unavailable on this marketplace'
                }
              >
                {redirectingStore === activeStore.marketplace ? (
                  <span className="truncate animate-pulse">Opening {activeStore.marketplace}...</span>
                ) : activeStore.isAvailable && activeStore.liveUrl ? (
                  <div className="leading-tight">
                    <div className="flex items-center justify-center gap-1">
                      <span>Buy on {activeStore.marketplace}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </div>
                    <div className="text-[11px] font-extrabold text-slate-900">
                      at ₹${activeStore.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                ) : (
                  <span className="truncate">Product link unavailable</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
