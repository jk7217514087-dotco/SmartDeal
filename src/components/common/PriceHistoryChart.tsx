import React, { useState } from 'react';
import { Product } from '../../types';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import {
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Sparkles,
  ShieldAlert,
  Clock
} from 'lucide-react';

interface Props {
  product: Product;
}

export const PriceHistoryChart: React.FC<Props> = ({ product }) => {
  const [range, setRange] = useState<'30' | '90'>('90');

  const data = product.priceHistory.map(item => ({
    name: item.date,
    price: item.price,
    event: item.event
  }));

  const prices = data.map(d => d.price);
  const minPrice = Math.min(...prices, product.sellingPrice);
  const maxPrice = Math.max(...prices, product.mrp);

  const isGenuine = product.fakeDiscountAudit.isGenuine;
  const buyRecommendation = product.buyNowRecommendation;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-6">
      {/* Header with Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Price History & Fake Discount Detector
            </h3>
            <span className="text-xs bg-indigo-50 dark:bg-indigo-950/60 text-brand-600 dark:text-brand-400 font-bold px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800/50">
              AI Powered
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Transparent price tracking across 90 days. We detect artificial MRP markups.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setRange('30')}
            className={`px-3 py-1 rounded-lg transition-all ${
              range === '30'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setRange('90')}
            className={`px-3 py-1 rounded-lg transition-all ${
              range === '90'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            90 Days
          </button>
        </div>
      </div>

      {/* Benchmarks Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-3.5 border border-slate-100 dark:border-slate-700">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Current Price</div>
          <div className="text-lg font-black text-slate-900 dark:text-white mt-1">₹{product.sellingPrice.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-brand-600 dark:text-brand-400 font-bold mt-0.5">Live on SmartDeals</div>
        </div>

        <div className="bg-emerald-50/60 dark:bg-emerald-950/40 rounded-2xl p-3.5 border border-emerald-100 dark:border-emerald-800/60">
          <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Lowest Price</div>
          <div className="text-lg font-black text-emerald-700 dark:text-emerald-300 mt-1">₹{product.fakeDiscountAudit.lowestPriceEver.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">90-Day Low</div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-3.5 border border-slate-100 dark:border-slate-700">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Highest Price</div>
          <div className="text-lg font-black text-slate-800 dark:text-slate-200 mt-1">₹{product.fakeDiscountAudit.highestPriceEver.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-slate-400 font-medium mt-0.5">Peak market price</div>
        </div>

        <div className="bg-indigo-50/60 dark:bg-indigo-950/40 rounded-2xl p-3.5 border border-indigo-100 dark:border-indigo-800/60">
          <div className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">Listed MRP</div>
          <div className="text-lg font-black text-indigo-900 dark:text-indigo-300 mt-1 line-through opacity-80">₹{product.mrp.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold mt-0.5">₹{product.discountPercent}% Off Listed</div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-60 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#e2e8f0" />
            <YAxis
              domain={[Math.floor(minPrice * 0.9), Math.ceil(maxPrice * 1.05)]}
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickFormatter={(v) => `₹${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
              stroke="#e2e8f0"
            />
            <Tooltip
              formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Price']}
              contentStyle={{
                backgroundColor: '#0f172a',
                color: '#fff',
                borderRadius: '12px',
                border: 'none',
                fontSize: '12px',
                fontWeight: 600
              }}
            />
            <ReferenceLine y={product.fakeDiscountAudit.lowestPriceEver} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'All-time Low', fill: '#10b981', fontSize: 10 }} />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#4f46e5"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#priceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* AI Fake Discount Audit Box */}
      <div className={`p-4 rounded-2xl border ${
        isGenuine
          ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
          : 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-xl shrink-0 ${isGenuine ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
            {isGenuine ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                AI Audit Verdict: {product.fakeDiscountAudit.status}
              </h4>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isGenuine
                  ? 'bg-emerald-200 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200'
                  : 'bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200'
              }`}>
                {isGenuine ? 'Verified 100% Genuine' : 'Inflated MRP Detected'}
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {product.fakeDiscountAudit.reason}
            </p>
          </div>
        </div>
      </div>

      {/* Buy Now or Wait Recommendation */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl font-black text-sm flex items-center gap-1.5 ${
              buyRecommendation.action === 'BUY NOW'
                ? 'bg-emerald-500 text-white'
                : 'bg-amber-500 text-white'
            }`}>
              <Clock className="w-4 h-4" />
              <span>{buyRecommendation.action}</span>
            </div>
            <div>
              <div className="text-xs font-semibold text-indigo-200 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>AI Recommendation ({buyRecommendation.confidence}% Confidence)</span>
              </div>
              <p className="text-xs text-slate-200 mt-0.5 max-w-xl">
                {buyRecommendation.reason}
              </p>
            </div>
          </div>

          {buyRecommendation.expectedLow && (
            <div className="text-right">
              <div className="text-[11px] text-indigo-300">Expected Low Target</div>
              <div className="text-base font-extrabold text-amber-400">
                ₹{buyRecommendation.expectedLow.toLocaleString('en-IN')}
              </div>
            </div>
          )}
        </div>
        <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-white/10">
          AI prediction is based on price volatility, festive sales calendar, and merchant competition. Not a financial guarantee.
        </div>
      </div>
    </div>
  );
};
