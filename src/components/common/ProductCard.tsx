import React, { useState } from 'react';
import { Product } from '../../types';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PurchaseTrackerModal } from './PurchaseTrackerModal';
import { ProductQuickDetailsModal } from '../product/ProductQuickDetailsModal';
import { notificationService } from '../../services/notificationService';
import {
  Heart,
  Layers,
  ExternalLink
} from 'lucide-react';

interface Props {
  product: Product;
}

interface CardThemeConfig {
  cardContainer: string;
  imageWrapper: string;
  brandText: string;
  starText: string;
  titleHover: string;
  bestStoreBox: string;
  bestStoreText: string;
  bestStoreSeller: string;
  bestStorePrice: string;
  actionsBorder: string;
  viewDetailsBtn: string;
  buyBtn: string;
  compareBtn: string;
  topActionBtn: string;
}

const CARD_THEMES: Record<string, CardThemeConfig> = {
  'pure-white': {
    cardContainer: 'bg-[#374151] border-[#4b5563] shadow-lg hover:shadow-2xl hover:border-slate-300',
    imageWrapper: 'bg-white border-slate-200/80 shadow-inner',
    brandText: 'text-slate-300',
    starText: 'text-emerald-400',
    titleHover: 'hover:text-cyan-300',
    bestStoreBox: 'bg-[#282d37] border-[#4b5563]',
    bestStoreText: 'text-slate-300',
    bestStoreSeller: 'text-white',
    bestStorePrice: 'text-cyan-300',
    actionsBorder: 'border-[#4b5563]',
    viewDetailsBtn: 'bg-[#4b5563] hover:bg-[#5a6578] text-white border-[#6b7280]',
    buyBtn: 'bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-black shadow-md shadow-blue-600/30',
    compareBtn: 'bg-[#282d37] hover:bg-[#323846] text-cyan-300 border-[#4b5563]',
    topActionBtn: 'bg-[#4b5563] text-slate-200 hover:text-amber-300 hover:bg-[#5a6578] border-[#6b7280]',
  },
  'steel-navy': {
    cardContainer: 'bg-[#112240] border-sky-900/60 shadow-lg hover:shadow-sky-500/20 hover:border-sky-400/60',
    imageWrapper: 'bg-[#071324] border-sky-900/40 shadow-inner',
    brandText: 'text-sky-300',
    starText: 'text-sky-400',
    titleHover: 'hover:text-sky-300',
    bestStoreBox: 'bg-[#0b1a30] border-sky-900/60',
    bestStoreText: 'text-sky-300',
    bestStoreSeller: 'text-white',
    bestStorePrice: 'text-sky-400',
    actionsBorder: 'border-sky-900/60',
    viewDetailsBtn: 'bg-[#0e223f] hover:bg-[#14325c] text-sky-200 border-sky-800/60',
    buyBtn: 'bg-gradient-to-r from-sky-400 via-sky-300 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-slate-950 font-black shadow-sky-500/30',
    compareBtn: 'bg-[#0b1a30] hover:bg-[#102747] text-sky-300 border-sky-900/60',
    topActionBtn: 'bg-[#0e223f] text-slate-300 hover:text-sky-300 hover:bg-[#14325c] border-sky-900/50',
  },
  'matrix-lime': {
    cardContainer: 'bg-[#172219] border-lime-900/60 shadow-lg hover:shadow-lime-500/20 hover:border-lime-400/60',
    imageWrapper: 'bg-[#0c140d] border-lime-900/40 shadow-inner',
    brandText: 'text-lime-300',
    starText: 'text-lime-400',
    titleHover: 'hover:text-lime-300',
    bestStoreBox: 'bg-[#111612] border-lime-900/60',
    bestStoreText: 'text-lime-300',
    bestStoreSeller: 'text-white',
    bestStorePrice: 'text-lime-400',
    actionsBorder: 'border-lime-900/60',
    viewDetailsBtn: 'bg-[#1f2d22] hover:bg-[#283b2d] text-lime-200 border-lime-800/60',
    buyBtn: 'bg-gradient-to-r from-lime-300 via-lime-400 to-green-400 hover:from-lime-200 hover:to-green-300 text-slate-950 font-black shadow-lime-500/30',
    compareBtn: 'bg-[#111612] hover:bg-[#18241b] text-lime-300 border-lime-900/60',
    topActionBtn: 'bg-[#1f2d22] text-slate-300 hover:text-lime-300 hover:bg-[#283b2d] border-lime-900/50',
  },
  'sunset-coral': {
    cardContainer: 'bg-[#28113b] border-pink-900/60 shadow-lg hover:shadow-pink-500/20 hover:border-rose-400/60',
    imageWrapper: 'bg-[#160722] border-pink-900/40 shadow-inner',
    brandText: 'text-pink-300',
    starText: 'text-pink-400',
    titleHover: 'hover:text-pink-300',
    bestStoreBox: 'bg-[#1c0b29] border-pink-900/60',
    bestStoreText: 'text-pink-300',
    bestStoreSeller: 'text-white',
    bestStorePrice: 'text-pink-400',
    actionsBorder: 'border-pink-900/60',
    viewDetailsBtn: 'bg-[#36164f] hover:bg-[#471c67] text-pink-200 border-pink-800/60',
    buyBtn: 'bg-gradient-to-r from-rose-400 via-pink-400 to-orange-400 hover:from-rose-300 hover:to-orange-300 text-slate-950 font-black shadow-pink-500/30',
    compareBtn: 'bg-[#1c0b29] hover:bg-[#28113b] text-pink-300 border-pink-900/60',
    topActionBtn: 'bg-[#36164f] text-slate-300 hover:text-pink-300 hover:bg-[#471c67] border-pink-900/50',
  },
  'aurora-jade': {
    cardContainer: 'bg-[#092e20] border-emerald-900/60 shadow-lg hover:shadow-emerald-500/20 hover:border-emerald-400/60',
    imageWrapper: 'bg-[#03150e] border-emerald-900/40 shadow-inner',
    brandText: 'text-emerald-300',
    starText: 'text-emerald-400',
    titleHover: 'hover:text-emerald-300',
    bestStoreBox: 'bg-[#051f15] border-emerald-900/60',
    bestStoreText: 'text-emerald-300',
    bestStoreSeller: 'text-white',
    bestStorePrice: 'text-emerald-400',
    actionsBorder: 'border-emerald-900/60',
    viewDetailsBtn: 'bg-[#0e3d2b] hover:bg-[#13523a] text-emerald-200 border-emerald-800/60',
    buyBtn: 'bg-gradient-to-r from-emerald-300 via-teal-300 to-green-400 hover:from-emerald-200 hover:to-green-300 text-slate-950 font-black shadow-emerald-500/30',
    compareBtn: 'bg-[#051f15] hover:bg-[#092e20] text-emerald-300 border-emerald-900/60',
    topActionBtn: 'bg-[#0e3d2b] text-slate-300 hover:text-emerald-300 hover:bg-[#13523a] border-emerald-900/50',
  },
  'royal-gold': {
    cardContainer: 'bg-[#241a0b] border-amber-900/60 shadow-lg hover:shadow-amber-500/20 hover:border-amber-400/60',
    imageWrapper: 'bg-[#120c05] border-amber-900/40 shadow-inner',
    brandText: 'text-amber-300',
    starText: 'text-amber-400',
    titleHover: 'hover:text-amber-300',
    bestStoreBox: 'bg-[#181107] border-amber-900/60',
    bestStoreText: 'text-amber-300',
    bestStoreSeller: 'text-white',
    bestStorePrice: 'text-amber-400',
    actionsBorder: 'border-amber-900/60',
    viewDetailsBtn: 'bg-[#2e200e] hover:bg-[#3d2a13] text-amber-200 border-amber-800/60',
    buyBtn: 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black shadow-amber-500/30',
    compareBtn: 'bg-[#181107] hover:bg-[#241a0b] text-amber-300 border-amber-900/60',
    topActionBtn: 'bg-[#2e200e] text-slate-300 hover:text-amber-300 hover:bg-[#3d2a13] border-amber-900/50',
  },
  'cyber-indigo': {
    cardContainer: 'bg-[#0f1248] border-violet-900/60 shadow-lg hover:shadow-violet-500/20 hover:border-violet-400/60',
    imageWrapper: 'bg-[#05061e] border-violet-900/40 shadow-inner',
    brandText: 'text-violet-300',
    starText: 'text-violet-400',
    titleHover: 'hover:text-violet-300',
    bestStoreBox: 'bg-[#08092d] border-violet-900/60',
    bestStoreText: 'text-violet-300',
    bestStoreSeller: 'text-white',
    bestStorePrice: 'text-violet-400',
    actionsBorder: 'border-violet-900/60',
    viewDetailsBtn: 'bg-[#171a63] hover:bg-[#202484] text-violet-200 border-violet-800/60',
    buyBtn: 'bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 hover:from-violet-400 hover:to-indigo-400 text-white font-black shadow-violet-500/30',
    compareBtn: 'bg-[#08092d] hover:bg-[#0f1248] text-violet-300 border-violet-900/60',
    topActionBtn: 'bg-[#171a63] text-slate-300 hover:text-violet-300 hover:bg-[#202484] border-violet-900/50',
  },
};

export const ProductCard: React.FC<Props> = ({ product }) => {
  const { cart, addToCart, wishlist, toggleWishlist, trackActivity, trackOutboundClick, activeTheme } = useApp();
  const navigate = useNavigate();
  const [isQuickDetailsOpen, setIsQuickDetailsOpen] = useState(false);
  const [trackerStore, setTrackerStore] = useState<{
    storeName: string;
    price: number;
    url: string;
    trackingId: string;
  } | null>(null);

  const normalizedTheme = activeTheme === 'cyber-emerald' ? 'aurora-jade' : activeTheme;
  const cardTheme = CARD_THEMES[normalizedTheme] || CARD_THEMES['pure-white'];

  const isWishlisted = wishlist.includes(product.id);
  const isInCart = cart.some(item => item.product.id === product.id);
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
    <div className={`group rounded-2xl sm:rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden relative ${cardTheme.cardContainer}`}>
      {/* Top Action - Wishlist */}
      <div className="p-2.5 sm:p-3.5 pb-0 flex items-center justify-end z-10">
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
              ? 'bg-rose-900/80 text-rose-300 border border-rose-400'
              : cardTheme.topActionBtn
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Product Image Container */}
      <Link to={productDetailLink} className="block relative px-2.5 py-2 sm:px-3 sm:py-2.5 group-hover:scale-[1.02] transition-transform duration-300">
        <div className={`aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center p-3 border relative ${cardTheme.imageWrapper}`}>
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
          <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
            <span className={`truncate max-w-[100px] ${cardTheme.brandText}`}>{product.brand}</span>
            <span className={`${cardTheme.starText} font-bold shrink-0 flex items-center gap-1`}>
              ★ {product.rating} <span className="text-slate-400 font-normal">({Math.floor(25 + (product.rating * 14))})</span>
            </span>
          </div>

          <Link to={productDetailLink} className="block">
            <h3 className={`font-bold text-white text-xs sm:text-sm line-clamp-2 transition-colors leading-snug ${cardTheme.titleHover}`}>
              {product.name}
            </h3>
          </Link>

          {/* Price Engine Display */}
          <div className="mt-2 flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
            <span className="text-base sm:text-xl font-black text-white">
              ₹{product.sellingPrice.toLocaleString('en-IN')}
            </span>
            {product.mrp > product.sellingPrice && (
              <span className="text-[11px] sm:text-xs text-slate-400 line-through">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Lowest Store Indicator */}
          {lowestStoreListing && (
            <div className={`mt-2.5 flex items-center justify-between text-[11px] px-2.5 py-1.5 rounded-xl border ${cardTheme.bestStoreBox}`}>
              <span className={`truncate ${cardTheme.bestStoreText}`}>
                Best: <strong className={cardTheme.bestStoreSeller}>{lowestStoreListing.sellerName}</strong>
              </span>
              <span className={`font-black font-mono shrink-0 ml-1 ${cardTheme.bestStorePrice}`}>
                ₹{lowestStoreListing.finalPrice.toLocaleString('en-IN')}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className={`pt-2.5 border-t flex flex-col gap-1.5 sm:gap-2 ${cardTheme.actionsBorder}`}>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                setIsQuickDetailsOpen(true);
              }}
              className={`flex-1 py-2 px-2 rounded-xl font-bold text-xs text-center transition-all truncate cursor-pointer active:scale-95 border ${cardTheme.viewDetailsBtn}`}
              title="View full Flipkart-style details & specifications"
            >
              View Details
            </button>

            <button
              onClick={handleQuickOutboundBuy}
              className={`flex-1 py-2 px-2 rounded-xl text-xs text-center active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer truncate ${cardTheme.buyBtn}`}
              title={`Buy directly on ${lowestStoreListing?.sellerName || 'Amazon'}`}
            >
              <span className="truncate">Buy {lowestStoreListing?.sellerName?.split(' ')[0] || 'Amazon'}</span>
              <ExternalLink className="w-3 h-3 shrink-0" />
            </button>
          </div>

          {/* Direct Marketplace Comparison Button */}
          <Link
            to={`/compare/${product.id}`}
            className={`w-full py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all truncate border ${cardTheme.compareBtn}`}
          >
            <Layers className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Compare {externalListings.length} Stores</span>
          </Link>
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
};
