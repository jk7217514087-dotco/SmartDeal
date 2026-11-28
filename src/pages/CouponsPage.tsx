import React, { useState } from 'react';
import {
  Tag,
  Percent,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  CreditCard,
  Building,
  Filter,
  Search
} from 'lucide-react';
import { CouponItem } from '../types';

export const CouponsPage: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const coupons: CouponItem[] = [
    {
      id: 'cpn-1',
      code: 'HDFCINSTANT',
      store: 'Amazon India',
      discountType: 'FLAT',
      discountValue: 1500,
      minOrderValue: 10000,
      description: 'Flat ₹1,500 Instant Discount on HDFC Bank Credit Cards & EMI transactions.',
      expiryDate: '31 Oct 2026',
      verified: true,
      category: 'Electronics & Mobiles',
      terms: 'Applicable on select smartphones, laptops and home appliances. One use per card.'
    },
    {
      id: 'cpn-2',
      code: 'SBIEXTRA10',
      store: 'Flipkart',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderValue: 5000,
      description: '10% Instant Discount up to ₹1,250 on SBI Credit Cards.',
      expiryDate: '28 Oct 2026',
      verified: true,
      category: 'Mobiles & Fashion',
      terms: 'Valid on orders of ₹5,000 and above. Excludes grocery items.'
    },
    {
      id: 'cpn-3',
      code: 'CROMA500',
      store: 'Croma',
      discountType: 'FLAT',
      discountValue: 500,
      minOrderValue: 4000,
      description: 'Flat ₹500 off on all audio, smartwatch & accessories purchases.',
      expiryDate: '15 Nov 2026',
      verified: true,
      category: 'Audio & Accessories',
      terms: 'Applicable on online Croma orders. Combinable with store warranty.'
    },
    {
      id: 'cpn-4',
      code: 'ICICISUPER',
      store: 'Reliance Digital',
      discountType: 'FLAT',
      discountValue: 2000,
      minOrderValue: 20000,
      description: 'Flat ₹2,000 Instant Cashback on ICICI Bank Net Banking and Credit Cards.',
      expiryDate: '05 Nov 2026',
      verified: true,
      category: 'Laptops & TVs',
      terms: 'Valid on flagship electronics, TVs, and gaming laptops.'
    },
    {
      id: 'cpn-5',
      code: 'TATAWELCOME',
      store: 'Tata CLiQ',
      discountType: 'PERCENTAGE',
      discountValue: 15,
      minOrderValue: 2500,
      description: '15% Off up to ₹750 on your first Tata CLiQ electronics or lifestyle order.',
      expiryDate: '30 Nov 2026',
      verified: true,
      category: 'Lifestyle & Tech',
      terms: 'Valid once per registered user. Instant checkout discount.'
    },
    {
      id: 'cpn-6',
      code: 'MYNTRA300',
      store: 'Myntra',
      discountType: 'FLAT',
      discountValue: 300,
      minOrderValue: 1999,
      description: 'Flat ₹300 off on sports footwear, apparel, and running shoes.',
      expiryDate: '10 Nov 2026',
      verified: true,
      category: 'Shoes & Fashion',
      terms: 'Valid on select sneaker brands including Nike, Puma, Adidas.'
    },
    {
      id: 'cpn-7',
      code: 'AXISFEST',
      store: 'Amazon India',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderValue: 7500,
      description: '10% Instant Savings up to ₹1,500 on Axis Bank Credit Cards.',
      expiryDate: '02 Nov 2026',
      verified: true,
      category: 'All Categories',
      terms: 'Applicable across electronics, fashion, and home products.'
    },
    {
      id: 'cpn-8',
      code: 'AJIOMANIAC',
      store: 'Ajio',
      discountType: 'FLAT',
      discountValue: 500,
      minOrderValue: 2490,
      description: 'Flat ₹500 off on trending fashion & streetwear collection.',
      expiryDate: '12 Nov 2026',
      verified: true,
      category: 'Fashion & Footwear',
      terms: 'Minimum cart value of ₹2,490 required.'
    }
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const filteredCoupons = coupons.filter(c => {
    if (selectedStore !== 'all' && !c.store.toLowerCase().includes(selectedStore.toLowerCase())) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.code.toLowerCase().includes(q) ||
        c.store.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        (c.category && c.category.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-slate-800 p-8 sm:p-12 text-white shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-black uppercase tracking-wider">
            <Tag className="w-4 h-4 text-purple-400" />
            <span>Verified Coupons & Bank Offers</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Save More with Verified Promo Codes & Bank Discounts
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Combine marketplace coupon codes with instant credit card discounts and SmartDeal price comparison to calculate your absolute lowest effective checkout price.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Store Selector */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-1 md:pb-0">
          {['all', 'Amazon', 'Flipkart', 'Croma', 'Reliance', 'Tata', 'Myntra', 'Ajio'].map(st => (
            <button
              key={st}
              onClick={() => setSelectedStore(st)}
              className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap cursor-pointer transition-all ${
                selectedStore.toLowerCase() === st.toLowerCase()
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {st === 'all' ? `All Stores (${coupons.length})` : st}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search code, bank, or category..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCoupons.map(coupon => (
          <div
            key={coupon.id}
            className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 flex flex-col justify-between space-y-4 hover:border-brand-400 dark:hover:border-brand-500/50 hover:shadow-xl transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                  {coupon.store}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Offer
                </span>
              </div>

              <div>
                <div className="text-xl font-black text-slate-950 dark:text-white">
                  {coupon.discountType === 'FLAT' ? `Flat ₹${coupon.discountValue} OFF` : `${coupon.discountValue}% Instant OFF`}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {coupon.description}
                </p>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                <div>Min. Order: <strong>₹{coupon.minOrderValue.toLocaleString('en-IN')}</strong></div>
                <div>Valid until: <strong>{coupon.expiryDate}</strong></div>
                {coupon.terms && <div className="text-[10px] text-slate-400 line-clamp-1">Terms: {coupon.terms}</div>}
              </div>
            </div>

            {/* Interactive Coupon Box */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-dashed border-slate-300 dark:border-slate-700">
                <span className="font-mono font-black text-sm text-brand-600 dark:text-brand-400 px-2 tracking-wider">
                  {coupon.code}
                </span>
                <button
                  onClick={() => handleCopy(coupon.code)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                    copiedCode === coupon.code
                      ? 'bg-emerald-600 text-white'
                      : 'bg-brand-600 hover:bg-brand-700 text-white'
                  }`}
                >
                  {copiedCode === coupon.code ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
