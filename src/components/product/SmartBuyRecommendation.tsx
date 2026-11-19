import React, { useEffect, useState } from 'react';
import {
  SmartBuyRecommendationResult,
  Product
} from '../../types';
import { priceIntelligenceService } from '../../services/priceIntelligenceService';
import {
  Sparkles,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Info
} from 'lucide-react';

interface Props {
  product: Product;
  selectedMarketplace?: string;
  onMarketplaceChange?: (store: string) => void;
  className?: string;
}

export const SmartBuyRecommendation: React.FC<Props> = ({
  product,
  selectedMarketplace = 'flipkart',
  onMarketplaceChange,
  className = ''
}) => {
  const [data, setData] = useState<SmartBuyRecommendationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    priceIntelligenceService
      .fetchPriceRecommendation(
        product.id,
        product.name,
        selectedMarketplace,
        product.sellingPrice,
        product.mrp
      )
      .then(res => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [product.id, product.name, product.sellingPrice, product.mrp, selectedMarketplace]);

  const normStore = selectedMarketplace.toLowerCase();
  const isAjio = normStore === 'ajio';

  // Recommendation Level Configuration
  const levels = [
    {
      key: 'SKIP',
      label: 'SKIP',
      desc: 'Price too high. Avoid buying now.',
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/40',
      activeGradient: 'from-red-600 to-rose-600',
      minScore: 0,
      maxScore: 24
    },
    {
      key: 'WAIT',
      label: 'WAIT',
      desc: 'Price may decrease. Waiting advised.',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/20',
      borderColor: 'border-amber-500/40',
      activeGradient: 'from-amber-500 to-yellow-500',
      minScore: 25,
      maxScore: 49
    },
    {
      key: 'OKAY',
      label: 'OKAY',
      desc: 'Price is reasonable and fair.',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/20',
      borderColor: 'border-cyan-500/40',
      activeGradient: 'from-cyan-500 to-blue-500',
      minScore: 50,
      maxScore: 74
    },
    {
      key: 'YES',
      label: 'YES',
      desc: 'Attractive deal! Buying now recommended.',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20',
      borderColor: 'border-emerald-500/40',
      activeGradient: 'from-emerald-500 to-teal-500',
      minScore: 75,
      maxScore: 100
    }
  ];

  const currentLevelConfig = levels.find(l => l.key === data?.recommendation) || levels[2];
  const score = data?.score ?? 50;

  // Format currency
  const formatInr = (num?: number) => {
    if (typeof num !== 'number') return '₹0';
    return `₹${num.toLocaleString('en-IN')}`;
  };

  return (
    <div
      className={`rounded-3xl border border-slate-800 bg-[#0b1329] p-5 sm:p-7 shadow-2xl relative overflow-hidden text-slate-100 ${className}`}
    >
      {/* Decorative ambient glowing backdrops */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
              <span>AI Smart Buy Recommendation</span>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                Live Intelligence
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Real-time algorithmic price intelligence analyzing volatility, discounts, and historical deal cycles.
          </p>
        </div>

        {/* Selected Store / Tag */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-semibold text-slate-400">Store:</span>
          <span className="text-xs font-bold text-white px-3 py-1 rounded-xl bg-slate-800/90 border border-slate-700 capitalize">
            {selectedMarketplace}
          </span>
        </div>
      </div>

      {/* AJIO Compliance Notice */}
      {isAjio ? (
        <div className="my-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
          <div className="text-xs space-y-1">
            <div className="font-bold text-white text-sm">Price Tracking Paused for AJIO</div>
            <p className="text-amber-200/90 leading-relaxed">
              In accordance with marketplace terms and configuration policy, automated price tracking,
              drop alerts, and predictive buy ratings are currently paused for AJIO until written authorization is received.
            </p>
          </div>
        </div>
      ) : loading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-medium">Analyzing historical price volatility...</p>
        </div>
      ) : !data || !data.isReliable ? (
        <div className="my-6 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-2">
          <Info className="w-6 h-6 text-slate-400 mx-auto" />
          <div className="font-bold text-white text-sm">
            {data?.unreliableReason || 'Not enough price history to generate a reliable recommendation.'}
          </div>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            We require verified multi-week transaction records across sales cycles to deliver high-confidence buying recommendations.
          </p>
        </div>
      ) : (
        <div className="py-6 space-y-7 relative z-10">
          {/* Top Row: Recommendation Meter & AI Explanation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Meter (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400 tracking-wider uppercase text-[11px]">Recommendation Meter</span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span>Confidence:</span>
                  <span className="text-cyan-400 font-black">{data.confidence}%</span>
                </span>
              </div>

              {/* Four Level Pills */}
              <div className="grid grid-cols-4 gap-2 text-center">
                {levels.map(level => {
                  const isActive = level.key === data.recommendation;
                  return (
                    <div
                      key={level.key}
                      className={`p-2.5 rounded-xl border transition-all ${
                        isActive
                          ? `${level.bgColor} ${level.borderColor} ring-1 ring-white/20 shadow-lg`
                          : 'bg-slate-900/60 border-slate-800/80 opacity-60'
                      }`}
                    >
                      <div className={`text-xs font-black tracking-wider ${level.color}`}>{level.label}</div>
                      <div className="text-[10px] text-slate-400 hidden sm:block mt-0.5 truncate">
                        {level.desc}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Horizontal Smooth Multi-Color Gradient Bar with Pointer Marker */}
              <div className="pt-4 pb-2 px-1">
                <div className="relative">
                  {/* Continuous Gradient Bar */}
                  <div className="h-3.5 w-full rounded-full bg-gradient-to-r from-red-500 via-amber-400 via-cyan-400 to-emerald-500 shadow-inner relative" />

                  {/* Movable Pointer Indicator */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-out z-20 flex flex-col items-center pointer-events-none"
                    style={{ left: `calc(${score}% - 14px)` }}
                  >
                    {/* Pulsing Target Ring */}
                    <div className="w-7 h-7 rounded-full bg-white border-2 border-slate-900 shadow-xl flex items-center justify-center ring-4 ring-cyan-500/40 animate-pulse">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-950" />
                    </div>
                  </div>
                </div>

                {/* Score & Range Labels */}
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mt-2 px-1">
                  <span>0 (Peak Price)</span>
                  <span className="text-cyan-300 font-black">Deal Score: {score}/100</span>
                  <span>100 (All-time Low)</span>
                </div>
              </div>
            </div>

            {/* AI Price Analysis Explanation Card (5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#0e1a38] to-[#0a1122] border border-cyan-500/20 rounded-2xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-between h-full">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Price Analysis</span>
                  </span>
                  <span
                    className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${currentLevelConfig.bgColor} ${currentLevelConfig.color} ${currentLevelConfig.borderColor}`}
                  >
                    VERDICT: {data.recommendation}
                  </span>
                </div>

                {/* Dynamic Analysis Text generated using actual price data */}
                <p className="text-xs text-slate-200 leading-relaxed font-normal">
                  {data.analysisText}
                </p>
              </div>

              {/* Constant Price Probability & Volatility Pills */}
              <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>Stability: {data.constantPriceChance}%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Volatility: ±{data.volatilityPercent}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Grid: 8 Recommendation Details Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 pt-2">
            {/* 1. Current Price */}
            <div className="bg-[#0f1b38]/70 border border-slate-800/80 rounded-2xl p-3 space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Current Price</div>
              <div className="text-base font-black text-white">{formatInr(data.currentPrice)}</div>
              <div className="text-[10px] font-bold text-cyan-400 truncate">Verified Best</div>
            </div>

            {/* 2. Average Price */}
            <div className="bg-[#0f1b38]/70 border border-slate-800/80 rounded-2xl p-3 space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Average Price</div>
              <div className="text-base font-black text-slate-300">{formatInr(data.averagePrice)}</div>
              <div className="text-[10px] font-medium text-slate-400 truncate">Historical Mean</div>
            </div>

            {/* 3. Lowest Price */}
            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-3 space-y-1">
              <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Lowest Price</div>
              <div className="text-base font-black text-emerald-300">{formatInr(data.lowestPrice)}</div>
              <div className="text-[10px] font-medium text-emerald-400/80 truncate">Record low</div>
            </div>

            {/* 4. Highest Price */}
            <div className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-3 space-y-1">
              <div className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">Highest Price</div>
              <div className="text-base font-black text-rose-300">{formatInr(data.highestPrice)}</div>
              <div className="text-[10px] font-medium text-rose-400/80 truncate">Peak level</div>
            </div>

            {/* 5. Price Change */}
            <div className="bg-[#0f1b38]/70 border border-slate-800/80 rounded-2xl p-3 space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Price Change</div>
              <div className="text-base font-black text-white flex items-center gap-1">
                {data.priceChange <= 0 ? (
                  <TrendingDown className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <TrendingUp className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                )}
                <span className={data.priceChange <= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  {formatInr(Math.abs(data.priceChange))}
                </span>
              </div>
              <div className="text-[10px] font-medium text-slate-400 truncate">
                {data.priceChangePercent > 0 ? `+${data.priceChangePercent}%` : `${data.priceChangePercent}%`}
              </div>
            </div>

            {/* 6. Recommendation */}
            <div className={`border rounded-2xl p-3 space-y-1 ${currentLevelConfig.bgColor} ${currentLevelConfig.borderColor}`}>
              <div className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Recommendation</div>
              <div className={`text-base font-black ${currentLevelConfig.color}`}>{data.recommendation}</div>
              <div className="text-[10px] font-semibold text-slate-300 truncate">Buy Decision</div>
            </div>

            {/* 7. Confidence Level */}
            <div className="bg-[#0f1b38]/70 border border-slate-800/80 rounded-2xl p-3 space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Confidence</div>
              <div className="text-base font-black text-cyan-300">{data.confidence}%</div>
              <div className="text-[10px] font-bold text-cyan-400 truncate">High Precision</div>
            </div>

            {/* 8. Last Updated */}
            <div className="bg-[#0f1b38]/70 border border-slate-800/80 rounded-2xl p-3 space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Last Updated</div>
              <div className="text-base font-black text-slate-200">Today</div>
              <div className="text-[10px] font-medium text-slate-400 flex items-center gap-1 truncate">
                <Clock className="w-3 h-3 shrink-0" />
                <span>Live Audit</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
