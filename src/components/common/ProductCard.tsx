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

  const savingsAmount = product.mrp > product.sellingPrice ? product.mrp - product.sellingPrice : 0;

  return (
    <div className="group bg-[#19191d] dark:bg-[#19191d] rounded-2xl sm:rounded-3xl border border-[#27272e] hover:border-[#3a3a44] transition-all duration-300 flex flex-col justify-between overflow-hidden relative shadow-lg hover:shadow-2xl">
      {/* Top Image Container with Croma-Style Actions */}
      <div className="relative p-2.5 sm:p-3 pb-0">
        <div className="aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#242428] dark:bg-[#242428] border border-[#2d2d33] flex items-center justify-center p-3 relative group-hover:scale-[1.02] transition-transform duration-300">
          <Link to={productDetailLink} className="w-full h-full flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain dark:brightness-100"
              loading="lazy"
            />
          </Link>

          {/* Top Left: Best Deal / Choice Tag */}
          {product.dealScore >= 80 && (
            <div className="absolute top-2 left-2 z-10">
              <span className="bg-[#12DAA8] text-slate-950 text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded shadow-sm">
                {product.dealScore >= 90 ? 'BEST VALUE' : 'TOP RATED'}
              </span>
            </div>
          )}

          {/* Top Right: Wishlist Heart + Compare Pill Checkbox (From Croma Screenshots) */}
          <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
            {/* Price Alert Quick Button */}
            <button
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                setIsAlertModalOpen(true);
              }}
              className={`p-1.5 rounded-full backdrop-blur-md transition-all border ${
                hasAlert
                  ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                  : 'bg-black/40 border-white/20 text-white hover:text-amber-400 hover:border-amber-400/50'
              }`}
              title={hasAlert ? 'Price Alert Active' : 'Set Price Alert'}
            >
              <Bell className={`w-3.5 h-3.5 ${hasAlert ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>

            {/* Wishlist Heart Button */}
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
              className={`p-1.5 rounded-full backdrop-blur-md transition-all border ${
                isWishlisted
                  ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                  : 'bg-black/40 border-white/20 text-white hover:text-rose-400 hover:border-rose-400/50'
              }`}
              title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            {/* Compare Checkbox Pill */}
            <Link
              to={`/compare/${product.id}`}
              onClick={e => e.stopPropagation()}
              className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white text-[10px] font-semibold transition-all hover:border-[#12DAA8]"
              title="Compare Product Across Marketplaces"
            >
              <div className="w-2.5 h-2.5 rounded-xs border border-white/70 flex items-center justify-center text-[7px]">
                <Check className="w-2 h-2 opacity-90" />
              </div>
              <span>Compare</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Product Information (Croma Typography & Layout) */}
      <div className="p-3 sm:p-4 pt-2.5 flex-1 flex flex-col justify-between space-y-2.5">
        <div>
          {/* Product Title (Clean Bold White, 2 lines) */}
          <Link to={productDetailLink} className="block mb-1">
            <h3 className="font-bold text-white text-xs sm:text-sm line-clamp-2 hover:text-[#12DAA8] transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Rating & Reviews (Signature Croma Mint Teal Star & Score) */}
          <div className="flex items-center gap-1.5 text-xs mb-1.5">
            <span className="font-bold text-[#12DAA8] flex items-center gap-0.5">
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-[13px] leading-none">★</span>
            </span>
            <span className="text-slate-400 text-[11px]">
              ({product.reviewsCount || Math.floor(product.rating * 32 + 18)})
            </span>
          </div>

          {/* Pricing Row: Current Price, MRP, Savings, Discount */}
          <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
            <span className="text-base sm:text-lg font-black text-white">
              ₹{product.sellingPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] sm:text-xs text-slate-400 line-through">
              ₹{product.mrp.toLocaleString('en-IN')}
            </span>
            {savingsAmount > 0 && (
              <span className="text-[10px] sm:text-[11px] text-slate-400">
                (Save ₹{savingsAmount.toLocaleString('en-IN')})
              </span>
            )}
            <span className="text-[11px] sm:text-xs font-bold text-white">
              {product.discountPercent}% Off
            </span>
          </div>

          {/* Delivery Status Row with Truck Icon */}
          <div className="mt-2 flex items-center gap-1.5 text-slate-300 text-[11px]">
            <Truck className="w-3.5 h-3.5 text-white shrink-0" />
            <span className="truncate">
              {product.discountPercent > 20
                ? 'Express Delivery within 3 hours'
                : `Standard Delivery by ${product.deliveryDate || 'Tomorrow, by 2 PM'}`}
            </span>
          </div>

          {/* Signature Croma Soft Mint Offer Capsules */}
          <div className="mt-2 flex items-center gap-1 sm:gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#12382F] text-[#34D399] border border-[#1A5346] whitespace-nowrap shadow-xs">
              Flat lowest price
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#12382F] text-[#34D399] border border-[#1A5346] whitespace-nowrap shadow-xs">
              {product.features?.[0] || '100% Genuine'}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#12382F] text-[#34D399] border border-[#1A5346] whitespace-nowrap shadow-xs">
              {product.warranty || '2 Years Warranty'}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#12382F] text-[#34D399] border border-[#1A5346] whitespace-nowrap shadow-xs">
              Additional 5% off in cart
            </span>
          </div>
        </div>

        {/* Action Buttons: View Details, Buy at Best Price, Compare Marketplaces */}
        <div className="pt-2.5 border-t border-[#292930] flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                setIsQuickDetailsOpen(true);
              }}
              className="flex-1 py-1.5 px-2 rounded-xl font-bold text-[11px] sm:text-xs text-center transition-all bg-[#26262B] hover:bg-[#323238] text-white border border-[#383842] cursor-pointer active:scale-95 truncate"
              title="View full Flipkart-style details & specifications"
            >
              View Details
            </button>

            <button
              onClick={handleQuickOutboundBuy}
              className="flex-1 py-1.5 px-2 rounded-xl text-[11px] sm:text-xs text-center font-black active:scale-95 transition-all flex items-center justify-center gap-1 bg-[#12DAA8] hover:bg-[#00E9BF] text-slate-950 shadow-md shadow-[#12DAA8]/20 cursor-pointer truncate"
              title={`Buy directly on ${lowestStoreListing?.sellerName || 'Amazon'}`}
            >
              <span>Buy {lowestStoreListing?.sellerName?.split(' ')[0] || 'Store'}</span>
              <ExternalLink className="w-3 h-3 shrink-0" />
            </button>
          </div>

          <Link
            to={`/compare/${product.id}`}
            className="w-full py-1.5 rounded-xl font-bold text-[10px] sm:text-[11px] flex items-center justify-center gap-1 bg-[#141418] hover:bg-[#1d1d22] text-[#12DAA8] border border-[#12DAA8]/30 hover:border-[#12DAA8]/60 transition-all truncate"
          >
            <Layers className="w-3 h-3 shrink-0" />
            <span>Compare {externalListings.length || 4} Marketplaces</span>
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
