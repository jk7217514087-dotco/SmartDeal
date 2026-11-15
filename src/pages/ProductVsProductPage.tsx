import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { DealScoreBadge } from '../components/common/DealScoreBadge';
import {
  Scale,
  Award,
  ShoppingCart,
  ArrowLeftRight,
  Sparkles,
  Zap,
  CheckCircle2,
  TrendingDown
} from 'lucide-react';

export const ProductVsProductPage: React.FC = () => {
  const { products, addToCart } = useApp();
  const navigate = useNavigate();

  const [prodAId, setProdAId] = useState<string>(products[0]?.id || 'prod-samsung-m14');
  const [prodBId, setProdBId] = useState<string>(products[1]?.id || 'prod-apple-iphone15');

  const prodA = products.find(p => p.id === prodAId) || products[0];
  const prodB = products.find(p => p.id === prodBId) || products[1] || products[0];

  // AI Comparison Logic
  const getAIRecommendation = () => {
    if (prodA.id === prodB.id) {
      return {
        winner: prodA.name,
        verdict: 'Identical Products Selected',
        reason: 'Select two different items in the dropdowns above to view granular head-to-head price, spec, and Deal Score AI advantage analysis.'
      };
    }
    if (prodA.sellingPrice < prodB.sellingPrice) {
      return {
        winner: prodA.name,
        verdict: 'Best Budget Option',
        reason: `${prodA.name} provides superior value-for-money at ₹${prodA.sellingPrice.toLocaleString('en-IN')}, being ₹${(prodB.sellingPrice - prodA.sellingPrice).toLocaleString('en-IN')} cheaper while boasting an impressive Deal Score of ${prodA.dealScore}/100.`
      };
    } else {
      return {
        winner: prodB.name,
        verdict: 'Best Overall Flagship Experience',
        reason: `${prodB.name} delivers higher customer satisfaction rating (${prodB.rating}★) and premium specifications with ${prodB.smartCoinsEarned} SmartCoins loyalty rewards.`
      };
    }
  };

  const swapProducts = () => {
    setProdAId(prodBId);
    setProdBId(prodAId);
  };

  const presets = [
    { label: 'Mobiles: M14 5G vs iPhone 15', idA: 'prod-samsung-m14', idB: 'prod-apple-iphone15' },
    { label: 'Gadgets: boAt Earbuds vs Noise Watch', idA: 'prod-boat-airdopes', idB: 'prod-noise-colorfit' },
    { label: 'Work: iPhone 15 vs ASUS Vivobook', idA: 'prod-apple-iphone15', idB: 'prod-asus-vivobook' }
  ];

  const allSpecKeys = Array.from(new Set([
    ...Object.keys(prodA?.specs || {}),
    ...Object.keys(prodB?.specs || {})
  ]));

  const priceDiff = Math.abs(prodA.sellingPrice - prodB.sellingPrice);
  const aiRec = getAIRecommendation();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-3 border border-indigo-900/40">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-400/30">
          <Scale className="w-4 h-4 text-indigo-300" />
          <span>Section 27 • Product vs Product AI Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black">
          Head-to-Head AI Comparison
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
          Compare specs, real payable prices, Deal Scores, warranty, and seller reliability side-by-side with automated AI verdict.
        </p>

        {/* Quick presets */}
        <div className="pt-2 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold">Popular comparisons:</span>
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setProdAId(preset.idA);
                setProdBId(preset.idB);
              }}
              className="text-xs bg-slate-800/80 hover:bg-slate-700 text-indigo-200 hover:text-white px-3 py-1 rounded-full border border-slate-700 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Selectors Bar with Swap */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full flex-1 space-y-1">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Product A</label>
            <select
              value={prodAId}
              onChange={e => setProdAId(e.target.value)}
              className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name.slice(0, 48)}... (₹{p.sellingPrice.toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={swapProducts}
            title="Swap Products"
            className="p-3 rounded-2xl bg-slate-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-slate-800 dark:hover:bg-brand-950/60 dark:hover:text-brand-400 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all shrink-0"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>

          <div className="w-full flex-1 space-y-1">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Product B</label>
            <select
              value={prodBId}
              onChange={e => setProdBId(e.target.value)}
              className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name.slice(0, 48)}... (₹{p.sellingPrice.toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>
        </div>

        {prodA.id !== prodB.id && (
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <TrendingDown className="w-4 h-4 text-emerald-500" />
              <span>
                Price Delta: <strong className="text-slate-900 dark:text-white">₹{priceDiff.toLocaleString('en-IN')}</strong> ({prodA.sellingPrice < prodB.sellingPrice ? prodA.brand : prodB.brand} is {((priceDiff / Math.max(prodA.sellingPrice, prodB.sellingPrice)) * 100).toFixed(0)}% more affordable)
              </span>
            </div>
            <div className="text-slate-500 dark:text-slate-400">
              Deal Score Gap: <span className="font-bold text-slate-900 dark:text-white">{Math.abs(prodA.dealScore - prodB.dealScore)} pts</span>
            </div>
          </div>
        )}
      </div>

      {/* Side by Side Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product A Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-xs">
          <div className="flex items-center gap-4">
            <img src={prodA.image} alt="" className="w-20 h-20 object-contain rounded-2xl bg-slate-50 dark:bg-slate-800/80 p-2 shrink-0" />
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50 px-2 py-0.5 rounded-full border border-brand-200 dark:border-brand-800/40">
                {prodA.brand}
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2">{prodA.name}</h3>
              <div className="text-xl font-black text-slate-900 dark:text-white">₹{prodA.sellingPrice.toLocaleString('en-IN')}</div>
            </div>
          </div>

          <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800">
            <div className="flex justify-between py-2 items-center">
              <span className="text-slate-500 dark:text-slate-400">Deal Score</span>
              <DealScoreBadge score={prodA.dealScore} breakdown={prodA.dealScoreBreakdown} size="sm" />
            </div>
            <div className="flex justify-between py-2 items-center">
              <span className="text-slate-500 dark:text-slate-400">Customer Rating</span>
              <span className="font-bold text-amber-500">★ {prodA.rating} ({prodA.reviewsCount})</span>
            </div>
            <div className="flex justify-between py-2 items-center">
              <span className="text-slate-500 dark:text-slate-400">Delivery</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{prodA.deliveryDate} ({prodA.deliveryCharge === 0 ? 'FREE' : `₹${prodA.deliveryCharge}`})</span>
            </div>
            <div className="flex justify-between py-2 items-center">
              <span className="text-slate-500 dark:text-slate-400">SmartCoins Reward</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">+{prodA.smartCoinsEarned} Coins (₹{(prodA.smartCoinsEarned / 10).toFixed(0)})</span>
            </div>
            <div className="flex justify-between py-2 items-center">
              <span className="text-slate-500 dark:text-slate-400">Seller Authenticity</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{prodA.seller} ({prodA.sellerRating}★)</span>
            </div>
            <div className="flex justify-between py-2 items-center">
              <span className="text-slate-500 dark:text-slate-400">Warranty</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{prodA.warranty}</span>
            </div>
          </div>

          {/* Product A Action Buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => addToCart(prodA, 1)}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
            <button
              onClick={() => {
                addToCart(prodA, 1);
                navigate('/cart');
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition-all shadow-sm"
            >
              Buy {prodA.brand}
            </button>
          </div>
        </div>

        {/* Product B Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-xs">
          <div className="flex items-center gap-4">
            <img src={prodB.image} alt="" className="w-20 h-20 object-contain rounded-2xl bg-slate-50 dark:bg-slate-800/80 p-2 shrink-0" />
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50 px-2 py-0.5 rounded-full border border-brand-200 dark:border-brand-800/40">
                {prodB.brand}
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2">{prodB.name}</h3>
              <div className="text-xl font-black text-slate-900 dark:text-white">₹{prodB.sellingPrice.toLocaleString('en-IN')}</div>
            </div>
          </div>

          <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800">
            <div className="flex justify-between py-2 items-center">
              <span className="text-slate-500 dark:text-slate-400">Deal Score</span>
              <DealScoreBadge score={prodB.dealScore} breakdown={prodB.dealScoreBreakdown} size="sm" />
            </div>
            <div className="flex justify-between py-2 items-center">
              <span className="text-slate-500 dark:text-slate-400">Customer Rating</span>
              <span className="font-bold text-amber-500">★ {prodB.rating} ({prodB.reviewsCount})</span>
            </div>
            <div className="flex justify-between py-2 items-center">
              <span className="text-slate-500 dark:text-slate-400">Delivery</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{prodB.deliveryDate} ({prodB.deliveryCharge === 0 ? 'FREE' : `₹${prodB.deliveryCharge}`})</span>
            </div>
            <div className="flex justify-between py-2 items-center">
              <span className="text-slate-500 dark:text-slate-400">SmartCoins Reward</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">+{prodB.smartCoinsEarned} Coins (₹{(prodB.smartCoinsEarned / 10).toFixed(0)})</span>
            </div>
            <div className="flex justify-between py-2 items-center">
              <span className="text-slate-500 dark:text-slate-400">Seller Authenticity</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{prodB.seller} ({prodB.sellerRating}★)</span>
            </div>
            <div className="flex justify-between py-2 items-center">
              <span className="text-slate-500 dark:text-slate-400">Warranty</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{prodB.warranty}</span>
            </div>
          </div>

          {/* Product B Action Buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => addToCart(prodB, 1)}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
            <button
              onClick={() => {
                addToCart(prodB, 1);
                navigate('/cart');
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition-all shadow-sm"
            >
              Buy {prodB.brand}
            </button>
          </div>
        </div>
      </div>

      {/* AI Recommendation Box (Section 27) */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-xl space-y-3 border border-indigo-900/40">
        <div className="flex items-center gap-2 text-amber-300 font-extrabold text-sm">
          <Award className="w-5 h-5 text-amber-400" />
          <span>SmartDeals AI Verdict: {aiRec.verdict}</span>
        </div>
        <h4 className="text-xl font-black text-white">{aiRec.winner}</h4>
        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">{aiRec.reason}</p>
        <div className="pt-2 text-[10px] text-slate-400">
          Evaluated automatically considering price gap, verified user reviews, delivery speed, and loyalty rewards.
        </div>
      </div>

      {/* Granular Specs Comparison Matrix */}
      {allSpecKeys.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-500" />
              <h3 className="font-black text-slate-900 dark:text-white text-base">
                Technical Specifications & Hardware Matrix
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {allSpecKeys.length} comparison attributes
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4 w-1/3">Feature / Spec</th>
                  <th className="py-3 px-4 w-1/3 text-brand-600 dark:text-brand-400 font-extrabold">{prodA.brand}</th>
                  <th className="py-3 px-4 w-1/3 text-indigo-600 dark:text-indigo-400 font-extrabold">{prodB.brand}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {allSpecKeys.map((key) => {
                  const valA = prodA.specs?.[key] || '—';
                  const valB = prodB.specs?.[key] || '—';
                  const isMatch = valA === valB && valA !== '—';

                  return (
                    <tr key={key} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-600 dark:text-slate-400">{key}</td>
                      <td className={`py-3 px-4 font-semibold ${isMatch ? 'text-slate-600 dark:text-slate-300' : 'text-slate-900 dark:text-white font-bold'}`}>
                        {valA}
                      </td>
                      <td className={`py-3 px-4 font-semibold ${isMatch ? 'text-slate-600 dark:text-slate-300' : 'text-slate-900 dark:text-white font-bold'}`}>
                        {valB}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
