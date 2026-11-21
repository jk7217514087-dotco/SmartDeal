import React, { useState } from 'react';
import { Product } from '../../types';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { DealScoreBadge } from './DealScoreBadge';
import { PriceAlertModal } from './PriceAlertModal';
import { PurchaseTrackerModal } from './PurchaseTrackerModal';
import { ProductQuickDetailsModal } from '../product/ProductQuickDetailsModal';
import { MarketplaceBadge } from './MarketplaceBadge';
import { notificationService } from '../../services/notificationService';
import {
  Heart,
  Layers,
  Bell,
  ExternalLink
} from 'lucide-react';

interface Props {
  product: Product;
  variant?: 'compact' | 'standard' | 'top-deals';
}

export const ProductCard: React.FC<Props> = ({ product, variant = 'standard' }) => {
  const { cart, addToCart, wishlist, toggleWishlist, priceAlerts, trackActivity, trackOutboundClick, activeTheme } = useApp();
  const navigate = useNavigate();
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isQuickDetailsOpen, setIsQuickDetailsOpen] = useState(false);
  const [trackerStore, setTrackerStore] = useState<{
    storeName: string;
    price: number;
    url: string;
    trackingId: string;
  } | null>(null);

  const isWishlisted = wishlist.includes(product.id);
  const isInCart = cart.some(item => item.product.id === product.id);
  const hasAlert = priceAlerts.some(a => a.productId === product.id);
  const productDetailLink = product.id === 'prod-boat-airdopes' ? '/' : `/product/${product.id}`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    navigate('/cart');
  };

  const externalListings = (product.marketplacePrices || []).filter(
    p => !p.isSmartDealsSeller && !p.sellerName.toLowerCase().includes('smartdeal')
  );
  const lowestStoreListing = externalListings.length > 0
    ? [...externalListings].sort((a, b) => a.finalPrice - b.finalPrice)[0]
    : null;

  const handleQuickOutboundBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const targetStore = lowestStoreListing || {
      sellerName: 'Amazon',
      finalPrice: product.sellingPrice,
      url: `https://www.amazon.in/s?k=${encodeURIComponent(product.name)}`
    };
    const storeName = targetStore.sellerName || 'Amazon';
    const storePrice = targetStore.finalPrice || product.sellingPrice;
    const trackingId = `SD-AFF-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const targetUrl = targetStore.url || `https://www.amazon.in/s?k=${encodeURIComponent(product.name)}`;

    // 1. Dispatch real-time SMS to 7217514087
    notificationService.notifyBuyClick({
      clickId: trackingId,
      productId: product.id,
      productName: product.name,
      marketplace: storeName,
      price: storePrice,
      targetUrl,
      userName: 'Website Visitor',
      userContact: 'Product Card Direct Buy'
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

    setTrackerStore({
      storeName,
      price: storePrice,
      url: targetUrl,
      trackingId
    });
  };

  if (variant === 'top-deals') {
    return (
      <div className="group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-400 transition-all duration-300 flex flex-col justify-between overflow-hidden relative p-3">
        {/* Top Heart Wishlist Button */}
        <button
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            trackActivity(
              isWishlisted ? 'WISHLIST_REMOVE' : 'WISHLIST_ADD',
              { price: product.sellingPrice },
              product.id,
              product.name,
              product.category
            );
            toggleWishlist(product.id);
          }}
          className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors z-10 cursor-pointer shadow-xs"
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Centered Product Image */}
        <Link to={productDetailLink} className="block relative pt-1 pb-1">
          <div className="w-full h-32 sm:h-36 flex items-center justify-center bg-slate-50/70 rounded-xl p-2 group-hover:scale-105 transition-transform duration-300">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain"
              loading="lazy"
            />
          </div>
        </Link>

        {/* Product Info */}
        <div className="pt-2 flex-1 flex flex-col justify-between">
          <div>
            <Link to={productDetailLink} className="block">
              <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug hover:text-blue-600 transition-colors" title={product.name}>
                {product.name}
              </h3>
            </Link>

            {/* Price Line with Store Logo on Right (matching reference image) */}
            <div className="mt-2 flex items-center justify-between gap-1 flex-wrap">
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-sm sm:text-base font-black text-slate-950">
                  ₹{product.sellingPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                  {product.discountPercent}% OFF
                </span>
              </div>
              <MarketplaceBadge storeName={lowestStoreListing?.sellerName || 'Amazon'} size="sm" />
            </div>
          </div>

          {/* Action Buttons: View Details & Buy on Store */}
          <div className="mt-3 flex flex-col gap-1.5 w-full">
            <div className="flex items-center gap-1.5 w-full">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsQuickDetailsOpen(true);
                }}
                className="flex-1 py-1.5 sm:py-2 px-1 sm:px-2 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-slate-100 text-slate-800 font-extrabold text-[11px] sm:text-xs text-center transition-all cursor-pointer active:scale-95 truncate shadow-xs"
                title="View product details & specifications"
              >
                View Details
              </button>

              <button
                onClick={handleQuickOutboundBuy}
                className="flex-1 py-1.5 sm:py-2 px-1 sm:px-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-[11px] sm:text-xs flex items-center justify-center gap-1 shadow-xs transition-all cursor-pointer truncate"
                title={`Buy directly on ${lowestStoreListing?.sellerName || 'Store'}`}
              >
                <span className="truncate">Buy on {lowestStoreListing?.sellerName?.split(' ')[0] || 'Store'}</span>
                <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Specifications & Details Modal */}
        <ProductQuickDetailsModal
          product={product}
          isOpen={isQuickDetailsOpen}
          onClose={() => setIsQuickDetailsOpen(false)}
        />

        {/* Purchase Tracker & Verification Modal */}
        {trackerStore && (
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
  }

  return (
    <div className={`group bg-white rounded-2xl sm:rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden relative ${
      activeTheme === 'pure-white'
        ? 'border-slate-200/90 shadow-xs hover:border-blue-400 hover:shadow-md'
        : activeTheme === 'royal-gold'
          ? 'dark:bg-[#241a0b] dark:border-amber-900/60 hover:border-amber-400/70 hover:shadow-xl hover:shadow-amber-500/15'
          : 'dark:bg-[#062537] dark:border-teal-900/60 hover:border-teal-400/70 hover:shadow-xl hover:shadow-teal-500/20'
    }`}>
      {/* Top Badges & Actions */}
      <div className="p-2 sm:p-3.5 pb-0 flex items-center justify-between gap-1 z-10">
        <DealScoreBadge score={product.dealScore} breakdown={product.dealScoreBreakdown} size="sm" />

        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              setIsAlertModalOpen(true);
            }}
            className={`p-1.5 sm:p-2 rounded-full backdrop-blur-md transition-all ${
              hasAlert
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                : 'bg-slate-100 dark:bg-[#131d33] text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40'
            }`}
            title={hasAlert ? 'Price Alert Active' : 'Set Price Alert'}
          >
            <Bell className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${hasAlert ? 'fill-amber-500' : ''}`} />
          </button>

          <button
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              trackActivity(
                isWishlisted ? 'WISHLIST_REMOVE' : 'WISHLIST_ADD',
                { price: product.sellingPrice },
                product.id,
                product.name,
                product.category
              );
              toggleWishlist(product.id);
            }}
            className={`p-1.5 sm:p-2 rounded-full backdrop-blur-md transition-all ${
              isWishlisted
                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                : 'bg-slate-100 dark:bg-[#131d33] text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40'
            }`}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Product Image */}
      <Link to={productDetailLink} className="block relative px-2.5 py-2 sm:px-4 sm:py-3 group-hover:scale-105 transition-transform duration-300">
        <div className={`aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center p-1.5 sm:p-2 border transition-colors ${
          activeTheme === 'royal-gold'
            ? 'dark:bg-[#1a1308] dark:border-amber-900/40'
            : 'dark:bg-[#041e2d] dark:border-teal-900/40'
        }`}>
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain dark:brightness-95"
            loading="lazy"
          />
        </div>
        {product.isSmartDealsChoice && (
          <div className="absolute bottom-3 left-3.5 sm:bottom-4 sm:left-6 bg-slate-900/90 dark:bg-brand-950/90 text-amber-300 text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded shadow-sm border border-amber-400/30">
            SmartDeals Choice
          </div>
        )}
      </Link>

      {/* Product Information */}
      <div className="p-2.5 sm:p-4 pt-1 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
        <div>
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-400 font-semibold mb-1">
            <span className="truncate max-w-[70px] sm:max-w-none">{product.brand}</span>
            <span className="text-amber-500 font-bold shrink-0">★ {product.rating}</span>
          </div>

          <Link to={productDetailLink} className="block">
            <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm line-clamp-2 hover:text-brand-600 dark:hover:text-cyan-300 transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Price Engine Display with Store Logo on Right */}
          <div className="mt-1.5 sm:mt-2.5 flex items-center justify-between gap-1 flex-wrap">
            <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap">
              <span className="text-sm sm:text-lg font-black text-slate-950 dark:text-white">
                ₹{product.sellingPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 line-through">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
              <span className="text-[9px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1 py-0.5 sm:px-1.5 sm:py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60">
                {product.discountPercent}% OFF
              </span>
            </div>
            <MarketplaceBadge storeName={lowestStoreListing?.sellerName || 'Amazon'} size="sm" />
          </div>

          {/* Lowest Store Indicator */}
          {lowestStoreListing && (
            <div className={`mt-1.5 sm:mt-2 flex items-center justify-between text-[10px] sm:text-[11px] px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg sm:rounded-xl border ${
              activeTheme === 'royal-gold'
                ? 'bg-[#2b1f0d] border-amber-900/60'
                : 'bg-[#082e43] border-teal-900/60'
            }`}>
              <span className="text-slate-500 dark:text-slate-400 truncate">
                Best: <strong className="text-slate-900 dark:text-slate-200">{lowestStoreListing.sellerName}</strong>
              </span>
              <span className={`font-black font-mono shrink-0 ml-1 ${
                activeTheme === 'royal-gold' ? 'text-amber-400' : 'text-teal-300'
              }`}>
                ₹{lowestStoreListing.finalPrice.toLocaleString('en-IN')}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons: View Details, Buy at Best Price, Compare */}
        <div className={`pt-2 border-t flex flex-col gap-1.5 sm:gap-2 ${
          activeTheme === 'pure-white'
            ? 'border-slate-100'
            : activeTheme === 'royal-gold' ? 'border-amber-950/60' : 'border-teal-950/60'
        }`}>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                setIsQuickDetailsOpen(true);
              }}
              className={`flex-1 py-1.5 sm:py-2 px-1 sm:px-3 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-xs text-center transition-all truncate cursor-pointer active:scale-95 border ${
                activeTheme === 'pure-white'
                  ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300'
                  : activeTheme === 'royal-gold'
                    ? 'bg-[#2c1f0e] hover:bg-[#382812] text-amber-200 border-amber-900/50 hover:border-amber-400/50'
                    : 'bg-[#083046] hover:bg-[#0c3e59] text-teal-200 border-teal-900/50 hover:border-teal-400/50'
              }`}
              title="View full Flipkart-style details & specifications"
            >
              View Details
            </button>

            <button
              onClick={handleQuickOutboundBuy}
              className={`flex-1 py-1.5 sm:py-2 px-1 sm:px-3 rounded-lg sm:rounded-xl text-[10px] sm:text-xs text-center active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer truncate ${
                activeTheme === 'pure-white'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white font-extrabold shadow-sm'
                  : activeTheme === 'royal-gold'
                    ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black shadow-sm shadow-amber-500/30'
                    : 'bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black shadow-sm shadow-teal-500/30'
              }`}
              title={`Buy directly on ${lowestStoreListing?.sellerName || 'Amazon'}`}
            >
              <span className="truncate">Buy {lowestStoreListing?.sellerName?.split(' ')[0] || 'Amazon'}</span>
              <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
            </button>
          </div>

          {/* Direct Marketplace Comparison Button */}
          <Link
            to={`/compare/${product.id}`}
            className={`w-full py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-xs flex items-center justify-center gap-1 active:scale-95 transition-all truncate ${
              activeTheme === 'pure-white'
                ? 'bg-blue-50/70 hover:bg-blue-100 text-blue-700 border border-blue-200/80 shadow-xs'
                : activeTheme === 'royal-gold'
                  ? 'bg-[#12110c] hover:bg-[#1c1a12] text-amber-300 border border-amber-500/30 hover:border-amber-400/60 shadow-xs'
                  : 'bg-[#061a20] hover:bg-[#0b2832] text-teal-300 border border-teal-500/30 hover:border-teal-400/60 shadow-xs'
            }`}
          >
            <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span className="truncate">Compare {externalListings.length} Stores</span>
          </Link>
        </div>
      </div>

      {/* Price Alert Trigger Modal */}
      {isAlertModalOpen && (
        <PriceAlertModal
          product={product}
          isOpen={isAlertModalOpen}
          onClose={() => setIsAlertModalOpen(false)}
        />
      )}

      {/* Quick Specifications & Details Modal */}
      <ProductQuickDetailsModal
        product={product}
        isOpen={isQuickDetailsOpen}
        onClose={() => setIsQuickDetailsOpen(false)}
      />

      {/* Purchase Tracker & Verification Modal */}
      {trackerStore && (
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
