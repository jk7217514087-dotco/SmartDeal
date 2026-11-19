import React from 'react';
import { Sparkles, ShieldCheck, HeartHandshake, Eye, Award, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-8 sm:p-12 rounded-3xl text-center space-y-4 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-400/30">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Our Vision & Creed</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black">
          Smart Shopping. Better Deals. Every Time.
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          SmartDeals was founded to solve a critical e-commerce challenge: false discount claims, hidden shipping fees, and price volatility that leaves shoppers guessing.
        </p>
      </div>

      {/* 4 Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-brand-600 dark:text-brand-400 flex items-center justify-center">
            <Eye className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Uncompromising Price Transparency</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            We never recommend an option merely because of high affiliate commission. Our Final Price Engine calculates the real payable figure: product price plus shipping minus validated store coupons.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Zero Fake Pricing Pledge</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Our algorithmic Fake Discount Detector tracks 90-day price trends across platforms to expose artificially inflated retail MRPs. When a discount is real, we certify it.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Direct Cash Savings & Cashback</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Shopping rewards shouldn't require reading fine print. With SmartDeals, you get verified store discounts and real INR cashback directly withdrawable to your bank or UPI.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Fair Merchant Partnership</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            We empower small and mid-size merchants through volume discounts and our 0% Commission Incentive — waiving fees on every 10th sale under ₹10,000 to foster genuine retail competition.
          </p>
        </div>
      </div>
    </div>
  );
};
