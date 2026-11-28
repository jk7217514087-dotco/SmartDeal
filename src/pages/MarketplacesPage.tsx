import React from 'react';
import {
  Globe,
  ShieldCheck,
  ExternalLink,
  Layers,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Info,
  CheckCircle2,
  RefreshCw,
  ShieldAlert,
  Lock,
  Check
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { MarketplacePartner } from '../types';
import { marketplaceComplianceService } from '../services/marketplaceComplianceService';

export const MarketplacesPage: React.FC = () => {
  const partners: MarketplacePartner[] = [
    {
      id: 'amazon',
      name: 'Amazon India',
      domain: 'amazon.in',
      logo: 'https://images.unsplash.com/photo-1523474253243-282a0762d115?w=100&auto=format&fit=crop&q=80',
      tagline: "India's largest online store for electronics, appliances, books & more.",
      averageCommission: '3.0% – 9.0%',
      cashbackRate: 'Verified Store',
      returnPolicyDays: 7,
      affiliateStatus: 'Active Partner',
      categories: ['Mobiles', 'Laptops', 'Audio', 'Appliances', 'Fashion', 'Books']
    },
    {
      id: 'flipkart',
      name: 'Flipkart',
      domain: 'flipkart.com',
      logo: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=100&auto=format&fit=crop&q=80',
      tagline: 'Leading e-commerce destination for smartphones, TVs, fashion & super deals.',
      averageCommission: '2.5% – 8.5%',
      cashbackRate: 'Verified Store',
      returnPolicyDays: 7,
      affiliateStatus: 'Active Partner',
      categories: ['Mobiles', 'Electronics', 'Appliances', 'Fashion', 'Home']
    },
    {
      id: 'croma',
      name: 'Croma Retail (Tata Enterprise)',
      domain: 'croma.com',
      logo: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=100&auto=format&fit=crop&q=80',
      tagline: 'Premium electronics, gadgets, authentic manufacturer warranty and store pickup.',
      averageCommission: '2.0% – 5.0%',
      cashbackRate: 'Verified Store',
      returnPolicyDays: 14,
      affiliateStatus: 'Verified Network',
      categories: ['Laptops', 'Audio', 'Tablets', 'Gaming', 'Smart Home']
    },
    {
      id: 'reliance',
      name: 'Reliance Digital',
      domain: 'reliancedigital.in',
      logo: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=100&auto=format&fit=crop&q=80',
      tagline: 'Nationwide omnichannel consumer electronics, instant delivery & store support.',
      averageCommission: '2.0% – 4.5%',
      cashbackRate: 'Verified Store',
      returnPolicyDays: 7,
      affiliateStatus: 'Verified Network',
      categories: ['Laptops', 'Smartphones', 'Audio', 'Home Entertainment']
    },
    {
      id: 'tata-cliq',
      name: 'Tata CLiQ',
      domain: 'tatacliq.com',
      logo: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=100&auto=format&fit=crop&q=80',
      tagline: 'Curated luxury lifestyle, high-end electronics, and authentic brand flagships.',
      averageCommission: '3.5% – 7.0%',
      cashbackRate: 'Verified Store',
      returnPolicyDays: 10,
      affiliateStatus: 'Active Partner',
      categories: ['Electronics', 'Watches', 'Audio', 'Premium Fashion']
    },
    {
      id: 'meesho',
      name: 'Meesho',
      domain: 'meesho.com',
      logo: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=100&auto=format&fit=crop&q=80',
      tagline: 'Everyday budget value e-commerce with lowest wholesale pricing across India.',
      averageCommission: '4.0% – 10.0%',
      cashbackRate: 'Verified Store',
      returnPolicyDays: 7,
      affiliateStatus: 'Integrated API',
      categories: ['Fashion', 'Accessories', 'Home Decor', 'Footwear']
    },
    {
      id: 'myntra',
      name: 'Myntra',
      domain: 'myntra.com',
      logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=80',
      tagline: 'Premier fashion and lifestyle destination for branded sneakers and apparel.',
      averageCommission: '5.0% – 10.0%',
      cashbackRate: 'Verified Store',
      returnPolicyDays: 14,
      affiliateStatus: 'Active Partner',
      categories: ['Sneakers', 'Sportswear', 'Fashion', 'Accessories']
    },
    {
      id: 'ajio',
      name: 'AJIO (Reliance Trends)',
      domain: 'ajio.com',
      logo: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100&auto=format&fit=crop&q=80',
      tagline: 'Trendsetting streetwear, international brands, and exclusive lifestyle fashion.',
      averageCommission: '4.5% – 9.0%',
      cashbackRate: 'Verified Store',
      returnPolicyDays: 10,
      affiliateStatus: 'Active Partner',
      categories: ['Footwear', 'Apparel', 'Streetwear', 'Accessories']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 border border-slate-800 p-8 sm:p-12 text-white shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-black uppercase tracking-wider">
            <Globe className="w-4 h-4 text-brand-400" />
            <span>Supported Marketplaces</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Official Stores & Affiliate Marketplace Partners
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            SmartDeal indexes and compares live listings from India's most trusted e-commerce stores, ensuring transparent pricing, authentic manufacturer warranties, and verified cashback.
          </p>
        </div>
      </div>

      {/* Partners Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Supported Shopping Platforms ({partners.length})
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">All prices updated live</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {partners.map(partner => (
            <div
              key={partner.id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 flex flex-col justify-between space-y-4 hover:border-brand-400 dark:hover:border-brand-500/50 hover:shadow-xl transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 dark:text-white">
                    {partner.name}
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                    {partner.affiliateStatus}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {partner.tagline}
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Store Status:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{partner.cashbackRate}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Return Window:</span>
                    <strong className="text-slate-700 dark:text-slate-300 font-bold">{partner.returnPolicyDays} Days</strong>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {partner.categories.slice(0, 4).map(cat => (
                    <span
                      key={cat}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold"
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                {/* Marketplace-Specific Policy Compliance Badges */}
                {(() => {
                  const compliance = marketplaceComplianceService.getComplianceConfig(partner.id);
                  const isTrackingAllowed = marketplaceComplianceService.isPriceTrackingAllowed(partner.id);
                  const isAlertsAllowed = marketplaceComplianceService.isPriceAlertsAllowed(partner.id);
                  return (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1 text-[11px]">
                      <div className="font-extrabold text-slate-400 text-[10px] uppercase tracking-wider mb-1">
                        Affiliate Policy Status
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Price Tracking:</span>
                        <span className={`font-bold ${isTrackingAllowed ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {isTrackingAllowed ? '✓ Permitted' : '⚠️ Disabled'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Price Alerts:</span>
                        <span className={`font-bold ${isAlertsAllowed ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {isAlertsAllowed ? '✓ Permitted' : '⚠️ Disabled'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Price Display:</span>
                        <span className="font-bold text-emerald-500">✓ Real-time Sync</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Approval:</span>
                        <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded ${
                          compliance.writtenApprovalObtained
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}>
                          {compliance.writtenApprovalObtained ? 'Approved' : 'Written Req.'}
                        </span>
                      </div>
                      {!isTrackingAllowed && (
                        <p className="text-[10px] text-amber-500/90 leading-tight pt-1">
                          *Tracking paused per {partner.name} policy
                        </p>
                      )}
                    </div>
                  );
                })()}
              </div>

              <a
                href={`https://www.${partner.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Visit {partner.domain}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Exact Redirect & Affiliate Disclosure Section (Section 6 & 11) */}
      <div className="rounded-3xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-8 space-y-6">
        <div className="flex items-center gap-2.5">
          <Info className="w-6 h-6 text-brand-600 dark:text-brand-400 shrink-0" />
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            Exact Product Redirect & Affiliate Transparency Policy
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          <div className="space-y-2 p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              1. Exact Deep Links
            </div>
            <p>
              SmartDeal never redirects users to a store's generic homepage. When you click "Buy at Best Price", you are taken straight to the exact product SKU page on Amazon, Flipkart, Croma, etc.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              2. 100% Free Price Comparison
            </div>
            <p>
              When you complete a purchase, the partner store pays SmartDeal a small referral commission at no additional cost to you. SmartDeal retains affiliate commissions as revenue to fund free, unbiased price comparisons for consumers.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-cyan-500" />
              3. Unbiased Price Intelligence
            </div>
            <p>
              SmartDeal indexes real prices, verified bank discounts, and shipping costs. Because we never inflate prices or distribute volatile incentives, our price intelligence remains 100% transparent and objective.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-500" />
              4. Marketplace Policy Compliance
            </div>
            <p>
              Each affiliate partner operates under independent terms. Price tracking & alerts are paused for Amazon India by default until formal written approval is obtained, while active for permitted networks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
