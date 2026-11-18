import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ShieldCheck,
  Truck,
  Coins,
  Store,
  HelpCircle,
  TrendingDown,
  Lock,
  HeartHandshake
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { role, activeTheme } = useApp();
  return (
    <footer className={`text-slate-300 pt-16 pb-24 sm:pb-12 border-t transition-colors ${
      activeTheme === 'royal-gold'
        ? 'bg-[#181107] border-amber-900/60'
        : 'bg-[#031926] border-teal-900/60'
    }`}>
      {/* 6 Core Value Pillars Banner */}
      <div className={`max-w-7xl mx-auto px-4 pb-12 border-b grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center sm:text-left ${
        activeTheme === 'royal-gold' ? 'border-amber-950/50' : 'border-teal-950/50'
      }`}>
        <div className="space-y-1">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center mx-auto sm:mx-0">
            <TrendingDown className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-sm">Best Price Comparison</h4>
          <p className="text-xs text-slate-400">Live prices from Amazon, Flipkart, Croma & SmartDeals</p>
        </div>

        <div className="space-y-1">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto sm:mx-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-sm">Deal Intelligence</h4>
          <p className="text-xs text-slate-400">0–100 Deal DNA & Fake Discount Detector</p>
        </div>

        <div className="space-y-1">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto sm:mx-0">
            <Coins className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-sm">SmartCoins Rewards</h4>
          <p className="text-xs text-slate-400">10 Coins = ₹1 real value on orders</p>
        </div>

        <div className="space-y-1">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto sm:mx-0">
            <Truck className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-sm">Early Delivery</h4>
          <p className="text-xs text-slate-400">Transparent delivery dates & zero hidden costs</p>
        </div>

        <div className="space-y-1">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto sm:mx-0">
            <Lock className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-sm">Buyer Protection</h4>
          <p className="text-xs text-slate-400">Verified sellers, genuine invoices & easy returns</p>
        </div>

        <div className="space-y-1">
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center mx-auto sm:mx-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-sm">AI Shopping Copilot</h4>
          <p className="text-xs text-slate-400">Find the right product with transparent logic</p>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-6 gap-8">
        {/* Brand column */}
        <div className="col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black transition-all ${
              activeTheme === 'royal-gold'
                ? 'bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 text-slate-950 shadow-md shadow-amber-500/25'
                : 'bg-gradient-to-tr from-teal-500 via-emerald-400 to-cyan-400 text-slate-950 shadow-md shadow-teal-500/25'
            }`}>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <span className="font-extrabold text-xl text-white">
              Smart<span className={activeTheme === 'royal-gold'
                ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent'
              }>Deal</span>
            </span>
          </div>
          <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
            SmartDeal is an intelligent dual platform: multi-marketplace price comparison engine plus high-trust direct marketplace. We calculate the true final payable price, detect fake sales, and reward you with real SmartCoins.
          </p>
          <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
            <span className="bg-slate-800 text-emerald-400 font-bold px-3 py-1 rounded-full border border-slate-700">
              ✓ Anti-Fake Price Guarantee
            </span>
            <span className="bg-slate-800 text-amber-400 font-bold px-3 py-1 rounded-full border border-slate-700">
              ✓ 10 SmartCoins = ₹1
            </span>
          </div>
        </div>

        {/* Quick Nav */}
        <div className="space-y-3">
          <h5 className="font-bold text-white text-sm uppercase tracking-wider">Shopping & Tools</h5>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link to="/categories" className="hover:text-white transition-colors">Browse Categories</Link></li>
            <li><button onClick={() => window.dispatchEvent(new CustomEvent('trigger-app-install'))} className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors cursor-pointer flex items-center gap-1">📲 Download SmartDeal App (.apk)</button></li>
            <li><Link to="/compare" className="hover:text-white transition-colors">Price Comparison Engine</Link></li>
            <li><Link to="/flowchart" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">UI/UX Flowchart & Architecture</Link></li>
            <li><Link to="/product-vs-product" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">Head-to-Head AI Comparison</Link></li>
            <li><Link to="/ai-assistant" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">AI Shopping Copilot</Link></li>
            <li><Link to="/fake-discount-detector/prod-boat-airdopes" className="hover:text-white transition-colors">Fake Discount Detector</Link></li>
            <li><Link to="/deal-intelligence/prod-samsung-m14" className="hover:text-white transition-colors">Deal DNA Score (0-100)</Link></li>
            <li><Link to="/wallet" className="hover:text-white transition-colors">SmartCoins Rewards Wallet</Link></li>
            <li><Link to="/price-alerts" className="hover:text-white transition-colors">Price Drop Alerts</Link></li>
          </ul>
        </div>

        {/* Customer & Orders */}
        <div className="space-y-3">
          <h5 className="font-bold text-white text-sm uppercase tracking-wider">Customer & Orders</h5>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link to="/orders" className="hover:text-white transition-colors">My Orders & Invoices</Link></li>
            <li><Link to="/tracking/ORD-98231" className="hover:text-white transition-colors">Live Order Tracking</Link></li>
            <li><Link to="/returns" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">Product Returns & Refunds</Link></li>
            <li><Link to="/wishlist" className="hover:text-white transition-colors">Saved Wishlist</Link></li>
            <li><Link to="/notifications" className="hover:text-white transition-colors">Price & Order Alerts</Link></li>
            <li><Link to="/profile" className="hover:text-white transition-colors">Delivery Address Manager</Link></li>
            <li><Link to="/support" className="hover:text-white transition-colors">Help Center & FAQs</Link></li>
          </ul>
        </div>

        {/* For Sellers & Admins */}
        <div className="space-y-3">
          <h5 className="font-bold text-white text-sm uppercase tracking-wider">Seller & Admin</h5>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link to="/become-seller" className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"><Store className="w-3.5 h-3.5" /> Become a Seller</Link></li>
            <li><Link to="/seller/dashboard" className="hover:text-white transition-colors">Seller Dashboard</Link></li>
            <li><Link to="/seller/commission" className="hover:text-white transition-colors">Commission Slabs & 0% Incentive</Link></li>
            {role === 'ADMIN' && (
              <>
                <li><Link to="/admin/dashboard" className="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Admin Control Suite</Link></li>
                <li><Link to="/admin/commission-control" className="hover:text-white transition-colors">Platform Commission Admin</Link></li>
                <li><Link to="/admin/smartcoins-control" className="hover:text-white transition-colors">SmartCoins Rules Config</Link></li>
              </>
            )}
          </ul>
        </div>

        {/* Legal & Trust */}
        <div className="space-y-3">
          <h5 className="font-bold text-white text-sm uppercase tracking-wider">Trust & Support</h5>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link to="/about" className="hover:text-white transition-colors">About SmartDeals Mission</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy & Data Policy</Link></li>
            <li><span className="text-emerald-400 font-medium block">GSTIN: 06AABCS9876Q1Z2</span></li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
        <p>© 2026 SmartDeal Inc. All rights reserved. “Smart Shopping. Better Deals. Every Time.”</p>
        <div className="flex items-center gap-4">
          <span>Encrypted 256-bit TLS</span>
          <span>Verified Merchant API</span>
          <span>Zero Fake Pricing Promise</span>
        </div>
      </div>
    </footer>
  );
};
