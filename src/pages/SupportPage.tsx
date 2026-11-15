import React, { useState } from 'react';
import {
  HelpCircle,
  Package,
  Coins,
  Store,
  CreditCard,
  RotateCcw,
  Search,
  ChevronDown,
  Sparkles,
  PhoneCall,
  Mail
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SupportPage: React.FC = () => {
  const { setIsAiAssistantOpen } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [search, setSearch] = useState('');

  const faqs = [
    {
      q: 'How does SmartDeals guarantee the lowest price?',
      a: 'Our crawler regularly monitors live prices across Amazon, Flipkart, Croma, Tata CLiQ, and Reliance Digital. We factor in verified coupons, delivery charges, and SmartCoins redemption to compute the true final payable amount rather than just the surface sticker price.'
    },
    {
      q: 'What are SmartCoins and how are they redeemed?',
      a: 'SmartCoins are internal rewards credited on verified orders. The fixed rule is 10 SmartCoins = ₹1 cash redemption discount. You can redeem up to 500 SmartCoins (₹50) directly at checkout without restrictive minimum cart hurdles.'
    },
    {
      q: 'What is the Deal DNA / Deal Score?',
      a: 'Deal Score is an algorithmic score between 0 and 100 based on 6 core vectors: Price Advantage, 90-Day Historical Price, Offer Quality, Seller Reliability, Delivery Speed, and Price Transparency.'
    },
    {
      q: 'How does the Fake Discount Detector work?',
      a: 'Many online brands artificially boost listed MRPs to show exaggerated 70%+ discount banners. Our detector cross-references 90-day pricing history against authentic invoice data to warn you if an MRP is inflated.'
    },
    {
      q: 'How does the Seller "0% Commission" incentive work?',
      a: 'For products priced under ₹10,000, whenever a verified seller completes 10 successful delivered orders, SmartDeals waives its platform commission completely on the 11th eligible sale.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Support Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-8 rounded-3xl text-center space-y-4 shadow-xl border border-indigo-900/40">
        <div className="w-12 h-12 rounded-2xl bg-brand-500/30 text-brand-300 flex items-center justify-center mx-auto">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-black">How Can We Help You Today?</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
          Instant answers on order tracking, multi-store price matching, SmartCoins, and seller onboarding.
        </p>

        {/* Search */}
        <div className="max-w-lg mx-auto relative">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search FAQs, refunds, coins, orders..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-xs font-semibold focus:outline-none shadow-md border border-transparent dark:border-slate-700"
          />
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Support Topic Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-500 shadow-xs transition-all space-y-1.5 cursor-pointer">
          <Package className="w-5 h-5 text-brand-600 dark:text-brand-400 mx-auto" />
          <div className="text-xs font-bold text-slate-900 dark:text-white">Orders & Delivery</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-500 shadow-xs transition-all space-y-1.5 cursor-pointer">
          <RotateCcw className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto" />
          <div className="text-xs font-bold text-slate-900 dark:text-white">Returns & Refunds</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-500 shadow-xs transition-all space-y-1.5 cursor-pointer">
          <Coins className="w-5 h-5 text-amber-500 mx-auto" />
          <div className="text-xs font-bold text-slate-900 dark:text-white">SmartCoins Support</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-500 shadow-xs transition-all space-y-1.5 cursor-pointer">
          <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mx-auto" />
          <div className="text-xs font-bold text-slate-900 dark:text-white">Payments & UPI</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-500 shadow-xs transition-all space-y-1.5 cursor-pointer">
          <Store className="w-5 h-5 text-purple-600 dark:text-purple-400 mx-auto" />
          <div className="text-xs font-bold text-slate-900 dark:text-white">Seller Help</div>
        </div>
        <div
          onClick={() => setIsAiAssistantOpen(true)}
          className="p-4 rounded-2xl bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/60 hover:border-brand-400 shadow-xs transition-all space-y-1.5 cursor-pointer"
        >
          <Sparkles className="w-5 h-5 text-brand-600 dark:text-brand-400 mx-auto" />
          <div className="text-xs font-bold text-brand-800 dark:text-brand-300">Ask AI Support</div>
        </div>
      </div>

      {/* Accordion FAQs */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-white">Frequently Asked Questions</h2>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {faqs.map((faq, idx) => (
            <div key={idx} className="py-4">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white gap-4"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-brand-600 dark:text-brand-400' : ''}`} />
              </button>
              {openFaq === idx && (
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed pr-8 animate-fadeIn">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Channels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center border border-brand-200 dark:border-brand-800/40">
            <Mail className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <div className="font-bold text-slate-900 dark:text-white">Email Support</div>
            <div className="text-slate-500 dark:text-slate-400">support@smartdeals.in</div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800/40">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <div className="font-bold text-slate-900 dark:text-white">Toll-Free Helpline</div>
            <div className="text-slate-500 dark:text-slate-400">1800-SMART-DEALS</div>
          </div>
        </div>

        <div
          onClick={() => setIsAiAssistantOpen(true)}
          className="p-5 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50 shadow-xs flex items-center gap-3 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors"
        >
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <div className="font-bold text-slate-900 dark:text-white">AI Assistant 24/7</div>
            <div className="text-indigo-700 dark:text-indigo-300 font-semibold">Live instant assistance</div>
          </div>
        </div>
      </div>
    </div>
  );
};
