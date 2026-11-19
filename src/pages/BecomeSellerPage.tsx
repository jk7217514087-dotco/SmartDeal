import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Store,
  CheckCircle2,
  TrendingUp,
  Percent,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Upload,
  FileText
} from 'lucide-react';

export const BecomeSellerPage: React.FC = () => {
  const { setRole } = useApp();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('Jitendra Sharma');
  const [businessName, setBusinessName] = useState('iTech Retail Ventures Pvt Ltd');
  const [email, setEmail] = useState('seller@itechretail.in');
  const [phone, setPhone] = useState('+91 98765 11223');
  const [storeName, setStoreName] = useState('iTech India Premium');
  const [category, setCategory] = useState('Electronics & Mobiles');
  const [gst, setGst] = useState('07AAAAA0000A1Z5');
  const [bankAccount, setBankAccount] = useState('918273645012');
  const [bankIfsc, setBankIfsc] = useState('HDFC0001234');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setRole('SELLER');
    setTimeout(() => {
      navigate('/seller/dashboard');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      {/* Hero Section */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-10 shadow-2xl space-y-4 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30">
          <Store className="w-4 h-4" />
          <span>SmartDeals Merchant Network</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          Sell Directly on SmartDeals Marketplace
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Access millions of smart shoppers who compare prices. Benefit from our transparent commission tiers and earn <strong>0% Commission Sales</strong> as you hit performance milestones.
        </p>

        {/* 3 Value Callouts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-left">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <Percent className="w-5 h-5 text-emerald-400" />
            <div className="font-extrabold text-sm text-white">0% Commission Sales</div>
            <div className="text-xs text-slate-400">Unlock 0% commission on every 10th eligible sale under ₹10,000.</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <TrendingUp className="w-5 h-5 text-brand-300" />
            <div className="font-extrabold text-sm text-white">Fair Price Matching</div>
            <div className="text-xs text-slate-400">Direct visibility alongside Amazon & Flipkart with verified badges.</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div className="font-extrabold text-sm text-white">Cashback Funded</div>
            <div className="text-xs text-slate-400">SmartDeals subsidizes shopper cashback to boost your conversion rates.</div>
          </div>
        </div>
      </div>

      {/* Seller Registration Form (Section 13) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Seller Onboarding & KYC Registration</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Provide official business details for admin review and approval</p>
        </div>

        {isSubmitted && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Registration Submitted! Redirecting to your Seller Dashboard...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Section 1: Business Profile */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm pb-2 border-b border-slate-100 dark:border-slate-800">
              1. Business & Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Full Name (Authorized Signatory)</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Business / Company Name</label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Business Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Store & Tax */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm pb-2 border-b border-slate-100 dark:border-slate-800">
              2. Storefront, Tax & Bank Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Display Store Name</label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={e => setStoreName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Primary Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 bg-white dark:bg-slate-800"
                >
                  <option>Electronics & Mobiles</option>
                  <option>Laptops & Computing</option>
                  <option>Fashion & Apparel</option>
                  <option>Home & Kitchen</option>
                  <option>Appliances</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">GSTIN / Tax ID</label>
                <input
                  type="text"
                  required
                  value={gst}
                  onChange={e => setGst(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 uppercase font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Bank Account Number</label>
                <input
                  type="text"
                  required
                  value={bankAccount}
                  onChange={e => setBankAccount(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Bank IFSC Code</label>
                <input
                  type="text"
                  required
                  value={bankIfsc}
                  onChange={e => setBankIfsc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 font-mono uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">KYC Verification Documents</label>
                <div className="p-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                    <span>gst_certificate_verified.pdf</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200/50 dark:border-emerald-800/50">Uploaded</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              By registering, you agree to the SmartDeals Marketplace Seller Agreement & commission schedule.
            </div>
            <button
              type="submit"
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-extrabold text-xs shadow-lg shadow-amber-500/25 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>Submit Registration</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
