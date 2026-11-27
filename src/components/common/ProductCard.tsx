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
  ExternalLink,
  ArrowRight
} from 'lucide-react';

interface Props {
  product: Product;
  variant?: 'compact' | 'standard' | 'top-deals' | 'finding-products';
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

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 flex flex-col justify-between overflow-hidden relative p-3 sm:p-3.5">
      {/* Top Wishlist & Alert Actions */}
      <div className="flex items-center justify-end w-full absolute top-2.5 right-2.5 px-0.5 z-10 pointer-events-none">
        <div className="flex items-center gap-1 pointer-events-auto">
          <button
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              setIsAlertModalOpen(true);
            }}
            className={`p-1.5 rounded-full transition-all cursor-pointer shadow-xs border ${
              hasAlert
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                : 'bg-slate-50 dark:bg-slate-800 hover:bg-amber-50 text-slate-400 hover:text-amber-600 border-slate-200/60 dark:border-slate-700'
            }`}
            title={hasAlert ? 'Price Alert Active' : 'Set Price Alert'}
          >
            <Bell className={`w-3.5 h-3.5 ${hasAlert ? 'fill-amber-500' : ''}`} />
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
            className="p-1.5 rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer shadow-xs border border-slate-200/60 dark:border-slate-700"
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Centered Product Image */}
      <Link to={productDetailLink} className="block relative pt-3 pb-1">
        <div className="w-full h-32 sm:h-36 flex items-center justify-center bg-slate-50/70 dark:bg-slate-950 rounded-xl p-2 group-hover:scale-105 transition-transform duration-300 border border-slate-100 dark:border-slate-800/80">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80';
            }}
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="pt-2 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-semibold mb-1">
            <span className="truncate max-w-[100px]">{product.brand}</span>
            <span className="text-amber-500 font-bold shrink-0">★ {product.rating}</span>
          </div>

          <Link to={productDetailLink} className="block">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm line-clamp-2 leading-snug hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title={product.name}>
              {product.name}
            </h3>
          </Link>

          {/* Price Line */}
          <div className="mt-2 space-y-1">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-sm sm:text-base font-black text-slate-950 dark:text-white">
                ₹{product.sellingPrice.toLocaleString('en-IN')}
              </span>
              {product.mrp > product.sellingPrice && (
                <span className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 line-through">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Discount Badge & Marketplace Badge Side-by-Side (Shifted next to % OFF as requested) */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {(product.discountPercent > 0 || product.mrp > product.sellingPrice) && (
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded shrink-0">
                  {product.discountPercent || Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)}% OFF
                </span>
              )}
              <MarketplaceBadge storeName={lowestStoreListing?.sellerName || 'Amazon'} size="sm" />
            </div>
          </div>
        </div>

        {/* Action Buttons: View Deal for finding-products or Dual Details & Buy */}
        {variant === 'finding-products' ? (
          <div className="mt-3 w-full">
            <Link
              to={productDetailLink}
              className="w-full py-2 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-extrabold text-xs text-center flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <span>View Deal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="mt-3 flex flex-col gap-1.5 w-full">
            <div className="flex items-center gap-1.5 w-full">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsQuickDetailsOpen(true);
                }}
                className="flex-1 py-1.5 sm:py-2 px-1 sm:px-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-extrabold text-[11px] sm:text-xs text-center transition-all cursor-pointer active:scale-95 truncate shadow-xs"
                title="View full product details & specifications"
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

            {/* Direct Marketplace Comparison Button */}
            {externalListings.length > 1 && (
              <Link
                to={`/compare/${product.id}`}
                className="w-full py-1.5 rounded-lg bg-blue-50/70 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800 font-bold text-[10px] sm:text-[11px] flex items-center justify-center gap-1 active:scale-95 transition-all truncate"
              >
                <Layers className="w-3 h-3 shrink-0" />
                <span>Compare {externalListings.length} Stores</span>
              </Link>
            )}
          </div>
        )}
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
