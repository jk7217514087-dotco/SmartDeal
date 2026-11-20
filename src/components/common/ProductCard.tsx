import React, { useState } from 'react';
import { Product } from '../../types';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { DealScoreBadge } from './DealScoreBadge';
import { PriceAlertModal } from './PriceAlertModal';
import { PurchaseTrackerModal } from './PurchaseTrackerModal';
import { ProductQuickDetailsModal } from '../product/ProductQuickDetailsModal';
import { notificationService } from '../../services/notificationService';
import {
  Heart,
  Layers,
  Bell,
  ExternalLink,
  Truck,
  Check
} from 'lucide-react';

interface Props {
  product: Product;
}

export const ProductCard: React.FC<Props> = ({ product }) => {
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

  return (
    <div className="group bg-[#19191d] rounded-2xl sm:rounded-3xl border border-[#27272e] shadow-lg hover:shadow-2xl hover:border-slate-600 transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
      {/* Top Badges & Actions */}
      <div className="p-2.5 sm:p-3.5 pb-0 flex items-center justify-between gap-1 z-10">
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
                ? 'bg-amber-950/70 text-amber-400 border border-amber-500/50'
                : 'bg-[#24242c] text-slate-300 hover:text-amber-400 hover:bg-[#2c2c36] border border-[#34343f]'
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
                ? 'bg-rose-950/70 text-rose-400 border border-rose-500/50'
                : 'bg-[#24242c] text-slate-300 hover:text-rose-400 hover:bg-[#2c2c36] border border-[#34343f]'
            }`}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Product Image Container - PURE WHITE (#FFFFFF) as strictly requested */}
      <Link to={productDetailLink} className="block relative px-2.5 py-2 sm:px-3 sm:py-2.5 group-hover:scale-[1.02] transition-transform duration-300">
        <div className="aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden bg-white flex items-center justify-center p-3 border border-slate-200/80 shadow-inner relative">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain"
            loading="lazy"
          />
          {product.isSmartDealsChoice && (
            <div className="absolute bottom-2 left-2 bg-slate-900/90 text-amber-300 text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded shadow-sm border border-amber-400/30">
              SmartDeals Choice
            </div>
          )}
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-3 sm:p-4 pt-1 flex-1 flex flex-col justify-between space-y-2.5">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1">
            <span className="truncate max-w-[100px] text-slate-400">{product.brand}</span>
            <span className="text-emerald-400 font-bold shrink-0 flex items-center gap-1">
              ★ {product.rating} <span className="text-slate-400 font-normal">({Math.floor(25 + (product.rating * 14))})</span>
            </span>
          </div>

          <Link to={productDetailLink} className="block">
            <h3 className="font-bold text-white text-xs sm:text-sm line-clamp-2 hover:text-cyan-300 transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Price Engine Display */}
          <div className="mt-2 flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
            <span className="text-base sm:text-xl font-black text-white">
              ₹{product.sellingPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] sm:text-xs text-slate-400 line-through">
              ₹{product.mrp.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/60">
              (Save ₹{(product.mrp - product.sellingPrice).toLocaleString('en-IN')}) {product.discountPercent}% Off
            </span>
          </div>

          {/* Standard / Express Delivery Indicator */}
          <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-300">
            <Truck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Express Delivery available</span>
          </div>

          {/* Promotional Offer Pills */}
          <div className="mt-2 flex flex-wrap gap-1">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-950/60 text-teal-300 border border-teal-800/60">
              Flat lowest price
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#26262f] text-slate-300 border border-[#383844]">
              2 Years Warranty
            </span>
          </div>

          {/* Lowest Store Indicator */}
          {lowestStoreListing && (
            <div className="mt-2.5 flex items-center justify-between text-[11px] px-2.5 py-1.5 rounded-xl bg-[#24242c] border border-[#34343f]">
              <span className="text-slate-400 truncate">
                Best: <strong className="text-white">{lowestStoreListing.sellerName}</strong>
              </span>
              <span className="font-black font-mono text-cyan-300 shrink-0 ml-1">
                ₹{lowestStoreListing.finalPrice.toLocaleString('en-IN')}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons: Primary is Blue (#2563EB) with white text, Secondary is dark charcoal */}
        <div className="pt-2.5 border-t border-[#2a2a33] flex flex-col gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                setIsQuickDetailsOpen(true);
              }}
              className="flex-1 py-2 px-2 rounded-xl font-bold text-xs text-center transition-all truncate cursor-pointer active:scale-95 bg-[#26262B] hover:bg-[#32323a] text-slate-200 border border-[#3b3b45]"
              title="View full Flipkart-style details & specifications"
            >
              View Details
            </button>

            <button
              onClick={handleQuickOutboundBuy}
              className="flex-1 py-2 px-2 rounded-xl text-xs text-center active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer truncate bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-black shadow-md shadow-blue-600/30"
              title={`Buy directly on ${lowestStoreListing?.sellerName || 'Amazon'}`}
            >
              <span className="truncate">Buy {lowestStoreListing?.sellerName?.split(' ')[0] || 'Amazon'}</span>
              <ExternalLink className="w-3 h-3 shrink-0" />
            </button>
          </div>

          {/* Direct Marketplace Comparison Button */}
          <Link
            to={`/compare/${product.id}`}
            className="w-full py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all truncate bg-[#1f1f25] hover:bg-[#282830] text-cyan-400 border border-[#3b3b45]"
          >
            <Layers className="w-3.5 h-3.5 shrink-0" />
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
