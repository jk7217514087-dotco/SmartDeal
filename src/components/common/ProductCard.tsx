import React from 'react';
import { Product } from '../../types';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getMarketplaceComparisonStores } from '../../utils/comparisonStores';
import {
  Heart,
  Layers,
  Info
} from 'lucide-react';

interface Props {
  product: Product;
}

interface CardThemeConfig {
  cardContainer: string;
  imageWrapper: string;
  brandText: string;
  starText: string;
  titleColor: string;
  titleHover: string;
  priceColor: string;
  discountColor: string;
  discountArrowBg: string;
  detailsBtn: string;
  compareBtn: string;
  topActionBtn: string;
}

const renderStoreBadge = (storeName: string) => {
  const name = (storeName || '').toLowerCase();
  if (name.includes('amazon')) {
    return (
      <span className="w-5 h-5 rounded-full bg-[#131921] text-amber-400 flex items-center justify-center text-[10px] font-black shrink-0 shadow-xs border border-amber-400/30" title="Amazon">
        a
      </span>
    );
  }
  if (name.includes('flipkart')) {
    return (
      <span className="w-5 h-5 rounded-full bg-[#2874f0] text-yellow-300 flex items-center justify-center text-[8px] font-black shrink-0 shadow-xs border border-yellow-300/40" title="Flipkart">
        fk
      </span>
    );
  }
  if (name.includes('croma')) {
    return (
      <span className="w-5 h-5 rounded-full bg-[#00e9bf] text-slate-950 flex items-center justify-center text-[8px] font-black shrink-0 shadow-xs" title="Croma">
        cr
      </span>
    );
  }
  if (name.includes('meesho')) {
    return (
      <span className="w-5 h-5 rounded-full bg-[#f43397] text-white flex items-center justify-center text-[9px] font-black shrink-0 shadow-xs" title="Meesho">
        M
      </span>
    );
  }
  if (name.includes('myntra')) {
    return (
      <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-pink-500 to-amber-500 text-white flex items-center justify-center text-[9px] font-black shrink-0 shadow-xs" title="Myntra">
        M
      </span>
    );
  }
  if (name.includes('lenovo')) {
    return (
      <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[8px] font-black shrink-0 shadow-xs" title="Lenovo">
        L
      </span>
    );
  }
  return (
    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px] font-black shrink-0 shadow-xs" title={storeName || 'Store'}>
      {(storeName || 'S').charAt(0).toUpperCase()}
    </span>
  );
};

const CARD_THEMES: Record<string, CardThemeConfig> = {
  'pure-white': {
    cardContainer: 'bg-white border-slate-200/80 shadow-xs hover:shadow-lg hover:border-indigo-300',
    imageWrapper: 'bg-slate-50/80 border-slate-100',
    brandText: 'text-slate-400',
    starText: 'text-amber-500',
    titleColor: 'text-slate-800',
    titleHover: 'hover:text-indigo-600',
    priceColor: 'text-slate-950',
    discountColor: 'text-emerald-600',
    discountArrowBg: 'bg-emerald-100 text-emerald-700',
    detailsBtn: 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300 font-bold',
    compareBtn: 'bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 border-indigo-200 font-bold',
    topActionBtn: 'bg-slate-100 text-slate-400 hover:text-rose-500 hover:bg-rose-50 border-slate-200/60',
  },
  'steel-navy': {
    cardContainer: 'bg-[#112240] border-sky-900/60 shadow-lg hover:shadow-sky-500/20 hover:border-sky-400/60',
    imageWrapper: 'bg-[#071324] border-sky-900/40',
    brandText: 'text-sky-300/70',
    starText: 'text-sky-400',
    titleColor: 'text-white',
    titleHover: 'hover:text-sky-300',
    priceColor: 'text-white',
    discountColor: 'text-sky-400',
    discountArrowBg: 'bg-sky-950 text-sky-400 border border-sky-800/60',
    detailsBtn: 'bg-[#0e223f] hover:bg-[#16355f] text-sky-200 border-sky-800/80 font-bold',
    compareBtn: 'bg-[#0b1a30] hover:bg-sky-500 hover:text-slate-950 text-sky-300 border-sky-900/60 shadow-xs font-bold',
    topActionBtn: 'bg-[#0e223f] text-slate-300 hover:text-rose-400 hover:bg-[#14325c] border-sky-900/50',
  },
  'matrix-lime': {
    cardContainer: 'bg-[#172219] border-lime-900/60 shadow-lg hover:shadow-lime-500/20 hover:border-lime-400/60',
    imageWrapper: 'bg-[#0c140d] border-lime-900/40',
    brandText: 'text-lime-300/70',
    starText: 'text-lime-400',
    titleColor: 'text-white',
    titleHover: 'hover:text-lime-300',
    priceColor: 'text-white',
    discountColor: 'text-lime-400',
    discountArrowBg: 'bg-lime-950 text-lime-400 border border-lime-800/60',
    detailsBtn: 'bg-[#19261b] hover:bg-[#233526] text-lime-200 border-lime-800/80 font-bold',
    compareBtn: 'bg-[#111612] hover:bg-lime-400 hover:text-slate-950 text-lime-300 border-lime-900/60 shadow-xs font-bold',
    topActionBtn: 'bg-[#1f2d22] text-slate-300 hover:text-rose-400 hover:bg-[#283b2d] border-lime-900/50',
  },
  'sunset-coral': {
    cardContainer: 'bg-[#28113b] border-pink-900/60 shadow-lg hover:shadow-pink-500/20 hover:border-rose-400/60',
    imageWrapper: 'bg-[#160722] border-pink-900/40',
    brandText: 'text-pink-300/70',
    starText: 'text-pink-400',
    titleColor: 'text-white',
    titleHover: 'hover:text-pink-300',
    priceColor: 'text-white',
    discountColor: 'text-rose-400',
    discountArrowBg: 'bg-pink-950 text-rose-400 border border-pink-800/60',
    detailsBtn: 'bg-[#33154b] hover:bg-[#451b66] text-rose-200 border-pink-800/80 font-bold',
    compareBtn: 'bg-[#1c0b29] hover:bg-rose-500 hover:text-white text-pink-300 border-pink-900/60 shadow-xs font-bold',
    topActionBtn: 'bg-[#36164f] text-slate-300 hover:text-rose-400 hover:bg-[#471c67] border-pink-900/50',
  },
  'aurora-jade': {
    cardContainer: 'bg-[#092e20] border-emerald-900/60 shadow-lg hover:shadow-emerald-500/20 hover:border-emerald-400/60',
    imageWrapper: 'bg-[#03150e] border-emerald-900/40',
    brandText: 'text-emerald-300/70',
    starText: 'text-emerald-400',
    titleColor: 'text-white',
    titleHover: 'hover:text-emerald-300',
    priceColor: 'text-white',
    discountColor: 'text-emerald-400',
    discountArrowBg: 'bg-emerald-950 text-emerald-400 border border-emerald-800/60',
    detailsBtn: 'bg-[#0c3928] hover:bg-[#114f38] text-emerald-200 border-emerald-800/80 font-bold',
    compareBtn: 'bg-[#051f15] hover:bg-emerald-500 hover:text-slate-950 text-emerald-300 border-emerald-900/60 shadow-xs font-bold',
    topActionBtn: 'bg-[#0e3d2b] text-slate-300 hover:text-rose-400 hover:bg-[#13523a] border-emerald-900/50',
  },
  'royal-gold': {
    cardContainer: 'bg-[#241a0b] border-amber-900/60 shadow-lg hover:shadow-amber-500/20 hover:border-amber-400/60',
    imageWrapper: 'bg-[#120c05] border-amber-900/40',
    brandText: 'text-amber-300/70',
    starText: 'text-amber-400',
    titleColor: 'text-white',
    titleHover: 'hover:text-amber-300',
    priceColor: 'text-white',
    discountColor: 'text-amber-400',
    discountArrowBg: 'bg-amber-950 text-amber-400 border border-amber-800/60',
    detailsBtn: 'bg-[#2d200e] hover:bg-[#3d2c14] text-amber-200 border-amber-800/80 font-bold',
    compareBtn: 'bg-[#181107] hover:bg-amber-400 hover:text-slate-950 text-amber-300 border-amber-900/60 shadow-xs font-bold',
    topActionBtn: 'bg-[#2e200e] text-slate-300 hover:text-rose-400 hover:bg-[#3d2a13] border-amber-900/50',
  },
  'cyber-indigo': {
    cardContainer: 'bg-[#0f1248] border-violet-900/60 shadow-lg hover:shadow-violet-500/20 hover:border-violet-400/60',
    imageWrapper: 'bg-[#05061e] border-violet-900/40',
    brandText: 'text-violet-300/70',
    starText: 'text-violet-400',
    titleColor: 'text-white',
    titleHover: 'hover:text-violet-300',
    priceColor: 'text-white',
    discountColor: 'text-violet-400',
    discountArrowBg: 'bg-violet-950 text-violet-400 border border-violet-800/60',
    detailsBtn: 'bg-[#14185c] hover:bg-[#1c227e] text-violet-200 border-violet-800/80 font-bold',
    compareBtn: 'bg-[#08092d] hover:bg-violet-500 hover:text-white text-violet-300 border-violet-900/60 shadow-xs font-bold',
    topActionBtn: 'bg-[#171a63] text-slate-300 hover:text-rose-400 hover:bg-[#202484] border-violet-900/50',
  },
};

export const ProductCard: React.FC<Props> = ({ product }) => {
  const { wishlist, toggleWishlist, trackActivity, activeTheme } = useApp();

  const normalizedTheme = activeTheme === 'cyber-emerald' ? 'aurora-jade' : activeTheme;
  const cardTheme = CARD_THEMES[normalizedTheme] || CARD_THEMES['pure-white'];

  const isWishlisted = wishlist.includes(product.id);
  const productDetailLink = product.id === 'prod-boat-airdopes' ? '/' : `/product/${product.id}`;

  const comparisonStores = getMarketplaceComparisonStores(product);
  const lowestStoreListing = comparisonStores[0];

  const storeName = lowestStoreListing?.sellerName || 'Meesho';
  const effectivePrice = lowestStoreListing?.finalPrice || product.sellingPrice;
  const discountAmount = product.mrp > effectivePrice ? product.mrp - effectivePrice : 0;

  return (
    <div className={`group rounded-2xl sm:rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden relative p-3 ${cardTheme.cardContainer}`}>
      {/* Top Action - Wishlist */}
      <div className="absolute top-2.5 right-2.5 z-10">
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
          className={`p-1.5 rounded-full backdrop-blur-md transition-all shadow-xs border ${
            isWishlisted
              ? 'bg-rose-50 text-rose-500 border-rose-300 dark:bg-rose-950/80 dark:text-rose-400 dark:border-rose-500/50'
              : cardTheme.topActionBtn
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>

      {/* Product Image Container (Buyhatke Clean Style) */}
      <Link to={productDetailLink} className="block relative group-hover:scale-[1.02] transition-transform duration-300">
        <div className={`aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center p-3 border relative ${cardTheme.imageWrapper}`}>
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        </div>
      </Link>

      {/* Product Information (Buyhatke Layout: Title -> Store Icon + Price -> Green Discount -> Compare Button) */}
      <div className="pt-2.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Star Rating */}
          <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
            <span className={`truncate max-w-[100px] ${cardTheme.brandText}`}>{product.brand}</span>
            <span className={`${cardTheme.starText} font-bold shrink-0 flex items-center gap-1`}>
              ★ {product.rating}
            </span>
          </div>

          {/* Product Title */}
          <Link to={productDetailLink} className="block">
            <h3 className={`font-bold text-xs sm:text-sm line-clamp-2 transition-colors leading-snug ${cardTheme.titleColor} ${cardTheme.titleHover}`}>
              {product.name}
            </h3>
          </Link>

          {/* Store Logo + Bold Price (Exact Buyhatke Image 2 setup) */}
          <div className="mt-2.5 flex items-center gap-2">
            {renderStoreBadge(storeName)}
            <span className={`text-base sm:text-lg font-black tracking-tight ${cardTheme.priceColor}`}>
              ₹{effectivePrice.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Green Discount Pill: ↓ 15% (₹4,752) off */}
          {product.discountPercent > 0 && (
            <div className="flex items-center gap-1.5 mt-1 text-[11px] sm:text-xs font-bold">
              <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] shrink-0 font-black ${cardTheme.discountArrowBg}`}>
                ↓
              </span>
              <span className={cardTheme.discountColor}>
                {product.discountPercent}%
              </span>
              {discountAmount > 0 && (
                <span className="text-slate-500 dark:text-slate-400 font-semibold text-[10px] sm:text-[11px]">
                  (₹{discountAmount.toLocaleString('en-IN')})
                </span>
              )}
              <span className="text-slate-500 dark:text-slate-400 font-normal">off</span>
            </div>
          )}
        </div>

        {/* Dual Actions: View Details and Compare Stores */}
        <div className="pt-2.5 mt-2 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-1.5">
          <Link
            to={productDetailLink}
            className={`py-2 px-1.5 rounded-xl text-[11px] sm:text-xs flex items-center justify-center gap-1 active:scale-95 transition-all truncate border shadow-xs ${cardTheme.detailsBtn}`}
            title="View product details and specifications"
          >
            <Info className="w-3.5 h-3.5 shrink-0 opacity-80" />
            <span className="truncate">View Details</span>
          </Link>
          <Link
            to={`/compare/${product.id}`}
            className={`py-2 px-1.5 rounded-xl text-[11px] sm:text-xs flex items-center justify-center gap-1 active:scale-95 transition-all truncate border shadow-xs ${cardTheme.compareBtn}`}
            title="Compare live prices across Amazon, Flipkart, Croma & more"
          >
            <Layers className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Compare {comparisonStores.length > 0 ? `${comparisonStores.length} Stores` : 'Prices'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
