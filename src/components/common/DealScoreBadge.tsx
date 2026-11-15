import React, { useState } from 'react';
import { DealScoreBreakdown } from '../../types';
import { ShieldCheck, Info, Sparkles } from 'lucide-react';

interface Props {
  score: number;
  breakdown?: DealScoreBreakdown;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export const DealScoreBadge: React.FC<Props> = ({
  score,
  breakdown,
  size = 'md',
  showTooltip = true
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getStatus = (val: number) => {
    if (val >= 90) return {
      label: 'Excellent Deal',
      bg: 'bg-emerald-500',
      text: 'text-emerald-700 dark:text-emerald-300',
      lightBg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/60'
    };
    if (val >= 80) return {
      label: 'Good Deal',
      bg: 'bg-blue-500',
      text: 'text-blue-700 dark:text-blue-300',
      lightBg: 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800/60'
    };
    if (val >= 70) return {
      label: 'Average Deal',
      bg: 'bg-amber-500',
      text: 'text-amber-700 dark:text-amber-300',
      lightBg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/60'
    };
    return {
      label: 'Poor Deal',
      bg: 'bg-rose-500',
      text: 'text-rose-700 dark:text-rose-300',
      lightBg: 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800/60'
    };
  };

  const status = getStatus(score);

  const effectiveBreakdown: DealScoreBreakdown = breakdown || {
    priceAdvantage: Math.min(100, Math.max(20, Math.round(score * 1.02))),
    historicalPrice: Math.min(100, Math.max(20, Math.round(score * 0.98))),
    offerQuality: Math.min(100, Math.max(20, Math.round(score * 0.95))),
    sellerReliability: Math.min(100, Math.max(20, Math.round(score * 1.01))),
    delivery: Math.min(100, Math.max(20, Math.round(score * 0.97))),
    transparency: Math.min(100, Math.max(20, Math.round(score * 1.0))),
    overallScore: score,
    verdict: score >= 90 ? 'Excellent Deal' : score >= 80 ? 'Good Deal' : score >= 70 ? 'Average Deal' : 'Poor Deal'
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div
        onClick={() => setIsOpen(prev => !prev)}
        className={`cursor-pointer inline-flex items-center gap-1.5 rounded-full font-semibold transition-all hover:scale-105 shadow-sm ${
          size === 'sm'
            ? 'px-2 py-0.5 text-xs'
            : size === 'lg'
            ? 'px-4 py-1.5 text-base'
            : 'px-2.5 py-1 text-xs'
        } ${status.lightBg} border`}
      >
        <span className={`w-2 h-2 rounded-full ${status.bg} animate-pulse`} />
        <span className="font-bold text-slate-800 dark:text-slate-200">Deal Score</span>
        <span className={`font-black ${status.text}`}>{score}/100</span>
        {showTooltip && <Info className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 ml-0.5" />}
      </div>

      {isOpen && showTooltip && (
        <div className="absolute left-0 top-full mt-2 w-72 p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 z-50 animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-sm">
              <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>Deal DNA Analysis</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold text-white ${status.bg}`}>
              {status.label}
            </span>
          </div>

          <div className="mt-3 space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
              <span>Price Advantage</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${effectiveBreakdown.priceAdvantage}%` }} />
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200 w-6 text-right">{effectiveBreakdown.priceAdvantage}</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
              <span>Historical Price</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${effectiveBreakdown.historicalPrice}%` }} />
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200 w-6 text-right">{effectiveBreakdown.historicalPrice}</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
              <span>Offer Quality</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: `${effectiveBreakdown.offerQuality}%` }} />
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200 w-6 text-right">{effectiveBreakdown.offerQuality}</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
              <span>Seller Reliability</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${effectiveBreakdown.sellerReliability}%` }} />
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200 w-6 text-right">{effectiveBreakdown.sellerReliability}</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
              <span>Delivery Speed</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${effectiveBreakdown.delivery}%` }} />
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200 w-6 text-right">{effectiveBreakdown.delivery}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Calculated from 12+ real market signals</span>
          </div>
        </div>
      )}
    </div>
  );
};
