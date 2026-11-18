import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PriceComparisonTable } from '../components/common/PriceComparisonTable';
import {
  Sparkles,
  CheckCircle2,
  Coins,
  Smartphone,
  Laptop,
  Tv,
  Shirt,
  Home,
  Scale,
  Search,
  Tag,
  Store,
  Layers
} from 'lucide-react';

const COMPARE_THEMES: Record<string, {
  cardBg: string;
  cardBorder: string;
  bestPriceBg: string;
  bestPriceBorder: string;
  bestPriceBadge: string;
  bestPriceText: string;
  outsidePriceBg: string;
  outsidePriceBorder: string;
  outsidePriceText: string;
  savingsBg: string;
  savingsBorder: string;
  savingsText: string;
  switcherBg: string;
  switcherBorder: string;
  searchIcon: string;
  selectBg: string;
  selectBorder: string;
}> = {
  'steel-navy': {
    cardBg: 'bg-[#112240]',
    cardBorder: 'border-sky-800/60',
    bestPriceBg: 'bg-gradient-to-br from-sky-950/60 via-[#112240] to-[#112240]',
    bestPriceBorder: 'border-sky-500/50',
    bestPriceBadge: 'bg-sky-400 text-slate-950',
    bestPriceText: 'text-sky-400',
    outsidePriceBg: 'bg-gradient-to-br from-blue-950/40 via-[#112240] to-[#112240]',
    outsidePriceBorder: 'border-blue-800/60',
    outsidePriceText: 'text-sky-300',
    savingsBg: 'bg-gradient-to-br from-sky-950/40 via-[#112240] to-[#112240]',
    savingsBorder: 'border-sky-500/40',
    savingsText: 'text-sky-400',
    switcherBg: 'bg-[#112240]',
    switcherBorder: 'border-sky-800/60',
    searchIcon: 'text-sky-400',
    selectBg: 'bg-[#0f1d35]',
    selectBorder: 'border-sky-800/60 focus:border-sky-400'
  },
  'matrix-lime': {
    cardBg: 'bg-[#172219]',
    cardBorder: 'border-lime-800/60',
    bestPriceBg: 'bg-gradient-to-br from-lime-950/60 via-[#172219] to-[#172219]',
    bestPriceBorder: 'border-lime-500/50',
    bestPriceBadge: 'bg-lime-400 text-slate-950',
    bestPriceText: 'text-lime-400',
    outsidePriceBg: 'bg-gradient-to-br from-emerald-950/40 via-[#172219] to-[#172219]',
    outsidePriceBorder: 'border-lime-800/60',
    outsidePriceText: 'text-lime-300',
    savingsBg: 'bg-gradient-to-br from-lime-950/40 via-[#172219] to-[#172219]',
    savingsBorder: 'border-lime-500/40',
    savingsText: 'text-lime-400',
    switcherBg: 'bg-[#172219]',
    switcherBorder: 'border-lime-800/60',
    searchIcon: 'text-lime-400',
    selectBg: 'bg-[#141d16]',
    selectBorder: 'border-lime-800/60 focus:border-lime-400'
  },
  'sunset-coral': {
    cardBg: 'bg-[#28113b]',
    cardBorder: 'border-rose-900/60',
    bestPriceBg: 'bg-gradient-to-br from-rose-950/60 via-[#28113b] to-[#28113b]',
    bestPriceBorder: 'border-rose-500/50',
    bestPriceBadge: 'bg-rose-400 text-slate-950',
    bestPriceText: 'text-rose-400',
    outsidePriceBg: 'bg-gradient-to-br from-pink-950/40 via-[#28113b] to-[#28113b]',
    outsidePriceBorder: 'border-rose-800/60',
    outsidePriceText: 'text-rose-300',
    savingsBg: 'bg-gradient-to-br from-rose-950/40 via-[#28113b] to-[#28113b]',
    savingsBorder: 'border-rose-500/40',
    savingsText: 'text-rose-400',
    switcherBg: 'bg-[#28113b]',
    switcherBorder: 'border-rose-900/60',
    searchIcon: 'text-rose-400',
    selectBg: 'bg-[#200d30]',
    selectBorder: 'border-rose-900/60 focus:border-rose-400'
  },
  'aurora-jade': {
    cardBg: 'bg-[#092e20]',
    cardBorder: 'border-emerald-800/60',
    bestPriceBg: 'bg-gradient-to-br from-emerald-950/60 via-[#092e20] to-[#092e20]',
    bestPriceBorder: 'border-emerald-500/50',
    bestPriceBadge: 'bg-emerald-400 text-slate-950',
    bestPriceText: 'text-emerald-400',
    outsidePriceBg: 'bg-gradient-to-br from-teal-950/40 via-[#092e20] to-[#092e20]',
    outsidePriceBorder: 'border-emerald-800/60',
    outsidePriceText: 'text-emerald-300',
    savingsBg: 'bg-gradient-to-br from-emerald-950/40 via-[#092e20] to-[#092e20]',
    savingsBorder: 'border-emerald-500/40',
    savingsText: 'text-emerald-400',
    switcherBg: 'bg-[#092e20]',
    switcherBorder: 'border-emerald-800/60',
    searchIcon: 'text-emerald-400',
    selectBg: 'bg-[#072419]',
    selectBorder: 'border-emerald-800/60 focus:border-emerald-400'
  },
  'royal-gold': {
    cardBg: 'bg-[#241a0b]',
    cardBorder: 'border-amber-900/60',
    bestPriceBg: 'bg-gradient-to-br from-amber-950/60 via-[#241a0b] to-[#241a0b]',
    bestPriceBorder: 'border-amber-500/50',
    bestPriceBadge: 'bg-amber-400 text-slate-950',
    bestPriceText: 'text-amber-400',
    outsidePriceBg: 'bg-gradient-to-br from-yellow-950/40 via-[#241a0b] to-[#241a0b]',
    outsidePriceBorder: 'border-amber-900/60',
    outsidePriceText: 'text-amber-300',
    savingsBg: 'bg-gradient-to-br from-amber-950/40 via-[#241a0b] to-[#241a0b]',
    savingsBorder: 'border-amber-500/40',
    savingsText: 'text-amber-400',
    switcherBg: 'bg-[#241a0b]',
    switcherBorder: 'border-amber-900/60',
    searchIcon: 'text-amber-400',
    selectBg: 'bg-[#2c1f0e]',
    selectBorder: 'border-amber-900/60 focus:border-amber-400'
  },
  'cyber-indigo': {
    cardBg: 'bg-[#0f1248]',
    cardBorder: 'border-indigo-800/60',
    bestPriceBg: 'bg-gradient-to-br from-indigo-950/60 via-[#0f1248] to-[#0f1248]',
    bestPriceBorder: 'border-violet-500/50',
    bestPriceBadge: 'bg-violet-400 text-slate-950',
    bestPriceText: 'text-violet-400',
    outsidePriceBg: 'bg-gradient-to-br from-purple-950/40 via-[#0f1248] to-[#0f1248]',
    outsidePriceBorder: 'border-indigo-800/60',
    outsidePriceText: 'text-violet-300',
    savingsBg: 'bg-gradient-to-br from-indigo-950/40 via-[#0f1248] to-[#0f1248]',
    savingsBorder: 'border-violet-500/40',
    savingsText: 'text-violet-400',
    switcherBg: 'bg-[#0f1248]',
    switcherBorder: 'border-indigo-800/60',
    searchIcon: 'text-violet-400',
    selectBg: 'bg-[#0d103d]',
    selectBorder: 'border-indigo-800/60 focus:border-violet-400'
  }
};

export const PriceComparisonPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, activeTheme } = useApp();
  const navigate = useNavigate();

  const themeStyle = COMPARE_THEMES[activeTheme] || COMPARE_THEMES['steel-navy'];

  const [selectedId, setSelectedId] = useState<string>(id || products[0]?.id || '');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const currentProduct = products.find(p => p.id === selectedId) || products[0];

  // Compare only external marketplaces (Amazon, Flipkart, Croma, Reliance Digital, etc.)
  const comparisonPrices = currentProduct.marketplacePrices.filter(
    p => !p.isSmartDealsSeller && !p.sellerName.toLowerCase().includes('smartdeal')
  );

  const lowestStore = comparisonPrices.reduce(
    (prev, curr) => (curr.finalPrice < prev.finalPrice ? curr : prev),
    comparisonPrices[0] || currentProduct.marketplacePrices[0]
  );

  const highestStore = comparisonPrices.reduce(
    (prev, curr) => (curr.finalPrice > prev.finalPrice ? curr : prev),
    comparisonPrices[0] || currentProduct.marketplacePrices[0]
  );

  const netSavings = Math.max(0, (highestStore?.finalPrice || 0) - (lowestStore?.finalPrice || 0));
  const totalDiscount = Math.max(0, currentProduct.mrp - lowestStore.finalPrice);

  const categories = [
    { name: `All (${comparisonPrices.length})`, icon: Layers, key: 'All' },
    { name: 'Mobiles', icon: Smartphone, key: 'Mobiles' },
    { name: 'Laptops', icon: Laptop, key: 'Laptops' },
    { name: 'Electronics', icon: Tv, key: 'Electronics' },
    { name: 'Fashion', icon: Shirt, key: 'Fashion' },
    { name: 'Home & Kitchen', icon: Home, key: 'Home' },
    { name: 'Compare Prices', icon: Scale, key: 'Compare' }
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Product Summary Row matching screenshot: 4 responsive cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {/* Product Info Card */}
          <div className={`border rounded-2xl p-4 flex items-center gap-4 shadow-xl transition-all ${themeStyle.cardBg} ${themeStyle.cardBorder}`}>
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/5 rounded-2xl p-2 flex items-center justify-center shrink-0 border border-slate-700/60 overflow-hidden">
              <img
                src={currentProduct.image}
                alt={currentProduct.name}
                className="w-full h-full object-contain drop-shadow-md"
              />
            </div>
            <div className="space-y-1 overflow-hidden min-w-0">
              <h1 className="text-sm sm:text-base font-extrabold text-white truncate" title={currentProduct.name}>
                {currentProduct.name}
              </h1>
              <div className="text-xs text-slate-400 font-medium truncate">
                {currentProduct.specs?.['RAM'] && currentProduct.specs?.['Storage']
                  ? `${currentProduct.specs['RAM']} | ${currentProduct.specs['Storage']}`
                  : '6GB RAM | 128GB Storage'}
              </div>
              <div className="flex items-center gap-3 pt-0.5">
                <span className="text-xs font-bold text-amber-400">
                  ★ {currentProduct.rating} <span className="text-slate-500 font-normal">({currentProduct.reviewsCount.toLocaleString()})</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  In Stock
                </span>
              </div>
            </div>
          </div>

          {/* BEST PRICE Card */}
          <div className={`border rounded-2xl p-4 flex flex-col justify-between shadow-xl transition-all ${themeStyle.bestPriceBg} ${themeStyle.bestPriceBorder}`}>
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-black tracking-wider uppercase ${themeStyle.bestPriceText}`}>
                BEST PRICE
              </span>
              <span className={`font-black text-[10px] px-2 py-0.5 rounded-full ${themeStyle.bestPriceBadge}`}>
                ₹{totalDiscount.toLocaleString('en-IN')} OFF
              </span>
            </div>
            <div className="my-1.5">
              <div className="text-2xl sm:text-3xl font-black text-white">
                ₹{lowestStore.finalPrice.toLocaleString('en-IN')}
              </div>
            </div>
            <div className={`text-[11px] font-medium flex items-center gap-1.5 ${themeStyle.bestPriceText}`}>
              <Tag className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Inclusive of direct coupon ({lowestStore.sellerName})</span>
            </div>
          </div>

          {/* LOWEST OUTSIDE PRICE / BENCHMARK Card */}
          <div className={`border rounded-2xl p-4 flex flex-col justify-between shadow-xl transition-all ${themeStyle.outsidePriceBg} ${themeStyle.outsidePriceBorder}`}>
            <div className={`text-[11px] font-black tracking-wider uppercase ${themeStyle.outsidePriceText}`}>
              LOWEST OUTSIDE PRICE
            </div>
            <div className="my-1.5">
              <div className="text-2xl sm:text-3xl font-black text-white">
                ₹{(comparisonPrices[1]?.finalPrice || highestStore.finalPrice).toLocaleString('en-IN')}
              </div>
            </div>
            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Amazon / Flipkart Average</span>
            </div>
          </div>

          {/* REAL EXTRA SAVINGS Card */}
          <div className={`border rounded-2xl p-4 flex flex-col justify-between shadow-xl transition-all ${themeStyle.savingsBg} ${themeStyle.savingsBorder}`}>
            <div className={`text-[11px] font-black tracking-wider uppercase ${themeStyle.savingsText}`}>
              REAL EXTRA SAVINGS
            </div>
            <div className="my-1.5">
              <div className="text-2xl sm:text-3xl font-black text-white">
                ₹{(netSavings || 480).toLocaleString('en-IN')}
              </div>
            </div>
            <div className="text-[11px] text-amber-400 font-medium flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 shrink-0" />
              <span>+{lowestStore.smartCoins || 120} SmartCoins reward</span>
            </div>
          </div>
        </div>

        {/* Filter Pills & Stock Legend Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-y border-slate-800/80">
          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/25 ring-1 ring-indigo-400/40'
                      : 'bg-[#0f172a] text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Stock legend dots */}
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 shrink-0">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-xs shadow-emerald-400" />
              In Stock
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-xs shadow-amber-400" />
              Limited Stock
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400 shadow-xs shadow-rose-400" />
              Out of Stock
            </span>
          </div>
        </div>

        {/* Product Switcher Bar */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all ${themeStyle.switcherBg} ${themeStyle.switcherBorder}`}>
          <div className="flex items-center gap-2 text-xs text-slate-400 min-w-0">
            <Search className={`w-4 h-4 shrink-0 ${themeStyle.searchIcon}`} />
            <span className="shrink-0">Comparing for:</span>
            <span className="text-white font-extrabold truncate">{currentProduct.name}</span>
          </div>

          <div className="w-full sm:w-80 shrink-0">
            <select
              value={selectedId}
              onChange={e => {
                setSelectedId(e.target.value);
                navigate(`/compare/${e.target.value}`);
              }}
              className={`w-full text-white text-xs font-bold py-2 px-3 rounded-xl border focus:outline-none cursor-pointer transition-colors ${themeStyle.selectBg} ${themeStyle.selectBorder}`}
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name.slice(0, 36)}... (₹{p.sellingPrice.toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Table with Amazon, Flipkart, Croma, Reliance Digital */}
        <PriceComparisonTable product={currentProduct} prices={currentProduct.marketplacePrices} />
      </div>
    </div>
  );
};
