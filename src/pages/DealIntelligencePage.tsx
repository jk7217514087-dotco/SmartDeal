import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PriceHistoryChart } from '../components/common/PriceHistoryChart';
import {
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const DealIntelligencePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products } = useApp();
  const navigate = useNavigate();

  const [selectedId, setSelectedId] = useState<string>(id || products[0]?.id || '');
  const product = products.find(p => p.id === selectedId) || products[0];

  const breakdown = product.dealScoreBreakdown;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-indigo-900/40">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-400/30">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI Deal DNA & Intelligence System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Deal Score & Fake Discount Audit
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            We evaluate 6 core vectors: Price Advantage, 90-day History, Offer Quality, Seller Reliability, Delivery, and Transparency.
          </p>
        </div>

        {/* Product selector */}
        <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 w-full md:w-80">
          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
            Choose Product to Audit
          </label>
          <select
            value={selectedId}
            onChange={e => {
              setSelectedId(e.target.value);
              navigate(`/deal-intelligence/${e.target.value}`);
            }}
            className="w-full bg-slate-900 text-white text-xs font-bold p-2.5 rounded-xl border border-white/20 focus:outline-none focus:border-brand-400"
          >
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name.slice(0, 40)}... (Score: {p.dealScore})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Highlight Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img src={product.image} alt="" className="w-16 h-16 object-contain rounded-2xl bg-slate-50 dark:bg-slate-800/80 p-1 shrink-0" />
          <div className="space-y-1">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white line-clamp-1">{product.name}</h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>Current Price: <strong className="text-slate-900 dark:text-white font-bold">₹{product.sellingPrice.toLocaleString('en-IN')}</strong></span>
              <span>•</span>
              <span>MRP: <span className="line-through">₹{product.mrp.toLocaleString('en-IN')}</span></span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{product.discountPercent}% Off</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-400 dark:text-slate-500 font-semibold">Overall Verdict</div>
            <div className="text-xl font-black text-brand-700 dark:text-brand-400">{breakdown.verdict}</div>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex flex-col items-center justify-center font-black shadow-md shadow-brand-500/25">
            <span className="text-2xl">{product.dealScore}</span>
            <span className="text-[9px] text-indigo-200 uppercase">/100</span>
          </div>
        </div>
      </div>

      {/* 6 Vectors Breakdown Grid (Section 8) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-extrabold text-slate-700 dark:text-slate-300">1. Price Advantage</span>
            <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">{breakdown.priceAdvantage}/100</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${breakdown.priceAdvantage}%` }} />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Measures the price gap between SmartDeals and competitors like Amazon/Flipkart.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-extrabold text-slate-700 dark:text-slate-300">2. Historical Price</span>
            <span className="font-black text-blue-600 dark:text-blue-400 text-sm">{breakdown.historicalPrice}/100</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${breakdown.historicalPrice}%` }} />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Evaluates current pricing compared to the 90-day all-time lowest price.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-extrabold text-slate-700 dark:text-slate-300">3. Offer Quality</span>
            <span className="font-black text-purple-600 dark:text-purple-400 text-sm">{breakdown.offerQuality}/100</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-purple-500 h-full rounded-full" style={{ width: `${breakdown.offerQuality}%` }} />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Assesses authentic coupon value, bank discounts, and SmartCoins cash rewards.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-extrabold text-slate-700 dark:text-slate-300">4. Seller Reliability</span>
            <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">{breakdown.sellerReliability}/100</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${breakdown.sellerReliability}%` }} />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Validates merchant invoice authenticity, return track record, and customer ratings.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-extrabold text-slate-700 dark:text-slate-300">5. Delivery Reliability</span>
            <span className="font-black text-amber-600 dark:text-amber-400 text-sm">{breakdown.delivery}/100</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${breakdown.delivery}%` }} />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Guaranteed next-day / 2-day delivery slot transparency with no hidden courier charges.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-extrabold text-slate-700 dark:text-slate-300">6. Transparency</span>
            <span className="font-black text-indigo-600 dark:text-indigo-400 text-sm">{breakdown.transparency}/100</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${breakdown.transparency}%` }} />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Zero artificial MRP markup; authentic discount rate verified against brand catalog.</p>
        </div>
      </div>

      {/* Chart & Fake Discount Detector */}
      <PriceHistoryChart product={product} />

      {/* CTA to Product */}
      <div className="flex items-center justify-between p-6 bg-slate-100 dark:bg-slate-800/80 rounded-3xl border border-slate-200/60 dark:border-slate-700">
        <div>
          <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Ready to buy with full confidence?</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">Get the authentic deal with verified invoice & SmartCoins rewards</p>
        </div>
        <button
          onClick={() => navigate(`/product/${product.id}`)}
          className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5 transition-colors"
        >
          <span>Go to Product Page</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
