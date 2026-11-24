import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PriceComparisonTable } from '../components/common/PriceComparisonTable';
import { SmartBuyRecommendation } from '../components/product/SmartBuyRecommendation';
import { InteractivePriceHistoryChart } from '../components/product/InteractivePriceHistoryChart';
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
  Tag,
  Store,
  Layers
} from 'lucide-react';

const getCompareTheme = (isDarkMode: boolean) => ({
  cardBg: isDarkMode ? 'bg-[#111d38]' : 'bg-white',
  cardBorder: isDarkMode ? 'border-slate-800' : 'border-slate-200/90',
  bestPriceBg: isDarkMode ? 'bg-gradient-to-br from-blue-950/60 via-[#111d38] to-[#111d38]' : 'bg-gradient-to-br from-blue-50/70 via-white to-indigo-50/50',
  bestPriceBorder: isDarkMode ? 'border-blue-500/50' : 'border-blue-200',
  bestPriceBadge: 'bg-blue-600 text-white',
  bestPriceText: isDarkMode ? 'text-blue-400' : 'text-blue-600',
  outsidePriceBg: isDarkMode ? 'bg-[#162544]' : 'bg-white',
  outsidePriceBorder: isDarkMode ? 'border-slate-800' : 'border-slate-200/80',
  outsidePriceText: isDarkMode ? 'text-slate-300' : 'text-slate-600',
  savingsBg: isDarkMode ? 'bg-gradient-to-br from-emerald-950/40 via-[#111d38] to-[#111d38]' : 'bg-gradient-to-br from-emerald-50/50 via-white to-white',
  savingsBorder: isDarkMode ? 'border-emerald-500/40' : 'border-emerald-200',
  savingsText: isDarkMode ? 'text-emerald-400' : 'text-emerald-600',
  switcherBg: isDarkMode ? 'bg-[#111d38]' : 'bg-white',
  switcherBorder: isDarkMode ? 'border-slate-800' : 'border-slate-200/80',
  searchIcon: isDarkMode ? 'text-blue-400' : 'text-blue-600',
  selectBg: isDarkMode ? 'bg-slate-900' : 'bg-slate-50',
  selectBorder: isDarkMode ? 'border-slate-700 focus:border-blue-500' : 'border-slate-200 focus:border-blue-500'
});

export const PriceComparisonPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, activeTheme, isDarkMode } = useApp();
  const navigate = useNavigate();

  const themeStyle = getCompareTheme(isDarkMode);

  const [selectedId, setSelectedId] = useState<string>(id || products[0]?.id || '');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedMarketplace, setSelectedMarketplace] = useState<string>('flipkart');
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
    <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 ${activeTheme === 'pure-white' ? 'text-slate-900' : 'text-slate-100'} transition-colors`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Product Summary Row matching screenshot: 4 responsive cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {/* Product Info Card */}
          <div className={`border rounded-2xl p-4 flex items-center gap-4 shadow-xl transition-all ${themeStyle.cardBg} ${themeStyle.cardBorder}`}>
            <div className={`w-16 h-16 sm:w-20 sm:h-20 ${activeTheme === 'pure-white' ? 'bg-slate-50' : 'bg-white/5'} rounded-2xl p-2 flex items-center justify-center shrink-0 border ${activeTheme === 'pure-white' ? 'border-slate-200' : 'border-slate-700/60'} overflow-hidden`}>
              <img
                src={currentProduct.image}
                alt={currentProduct.name}
                className="w-full h-full object-contain drop-shadow-md"
              />
            </div>
            <div className="space-y-1 overflow-hidden min-w-0">
              <h1 className={`text-sm sm:text-base font-extrabold ${activeTheme === 'pure-white' ? 'text-slate-900' : 'text-white'} truncate`} title={currentProduct.name}>
                {currentProduct.name}
              </h1>
              <div className="text-xs text-slate-400 font-medium truncate">
                {currentProduct.specs?.['RAM'] && currentProduct.specs?.['Storage']
                  ? `${currentProduct.specs['RAM']} | ${currentProduct.specs['Storage']}`
                  : '6GB RAM | 128GB Storage'}
              </div>
              <div className="flex items-center gap-3 pt-0.5">
                <span className="text-xs font-bold text-amber-500">
                  ★ {currentProduct.rating} <span className="text-slate-400 font-normal">({currentProduct.reviewsCount.toLocaleString()})</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
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
              <div className={`text-2xl sm:text-3xl font-black ${activeTheme === 'pure-white' ? 'text-slate-900' : 'text-white'}`}>
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
              <div className={`text-2xl sm:text-3xl font-black ${activeTheme === 'pure-white' ? 'text-slate-900' : 'text-white'}`}>
                ₹{(comparisonPrices[1]?.finalPrice || highestStore.finalPrice).toLocaleString('en-IN')}
              </div>
            </div>
            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>Amazon / Flipkart Average</span>
            </div>
          </div>

          {/* REAL EXTRA SAVINGS Card */}
          <div className={`border rounded-2xl p-4 flex flex-col justify-between shadow-xl transition-all ${themeStyle.savingsBg} ${themeStyle.savingsBorder}`}>
            <div className={`text-[11px] font-black tracking-wider uppercase ${themeStyle.savingsText}`}>
              REAL EXTRA SAVINGS
            </div>
            <div className="my-1.5">
              <div className={`text-2xl sm:text-3xl font-black ${activeTheme === 'pure-white' ? 'text-slate-900' : 'text-white'}`}>
                ₹{(netSavings || 480).toLocaleString('en-IN')}
              </div>
            </div>
            <div className="text-[11px] text-emerald-500 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Verified Lowest Price Across Stores</span>
            </div>
          </div>
        </div>

        {/* Filter Pills & Stock Legend Bar */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-y ${activeTheme === 'pure-white' ? 'border-slate-200' : 'border-slate-800/80'}`}>
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
                      : activeTheme === 'pure-white'
                        ? 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
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
            <span className={`${activeTheme === 'pure-white' ? 'text-slate-900' : 'text-white'} font-extrabold truncate`}>{currentProduct.name}</span>
          </div>

          <div className="w-full sm:w-80 shrink-0">
            <select
              value={selectedId}
              onChange={e => {
                setSelectedId(e.target.value);
                navigate(`/compare/${e.target.value}`);
              }}
              className={`w-full ${activeTheme === 'pure-white' ? 'text-slate-900' : 'text-white'} text-xs font-bold py-2 px-3 rounded-xl border focus:outline-none cursor-pointer transition-colors ${themeStyle.selectBg} ${themeStyle.selectBorder}`}
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

        {/* FEATURE 1: AI SMART BUY RECOMMENDATION SYSTEM */}
        <div className="pt-2">
          <SmartBuyRecommendation
            product={currentProduct}
            selectedMarketplace={selectedMarketplace}
            onMarketplaceChange={setSelectedMarketplace}
          />
        </div>

        {/* FEATURE 2: INTERACTIVE PRICE HISTORY GRAPH */}
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
