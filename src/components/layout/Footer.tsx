import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  TrendingDown,
  Phone,
  Mail,
  Clock,
  Lock,
  CheckCircle2,
  Store,
  HelpCircle,
  Smartphone
} from 'lucide-react';

interface FooterThemeConfig {
  bg: string;
  border: string;
  cardBg: string;
  cardBorder: string;
  accentText: string;
  logoBadge: string;
  logoGradient: string;
  subBorder: string;
}

const getFooterTheme = (isDarkMode: boolean): FooterThemeConfig => ({
  bg: isDarkMode ? 'bg-[#0b1329] text-slate-300' : 'bg-white text-slate-600',
  border: isDarkMode ? 'border-slate-800' : 'border-slate-200/80',
  cardBg: isDarkMode ? 'bg-[#111d38]' : 'bg-slate-50',
  cardBorder: isDarkMode ? 'border-slate-800' : 'border-slate-200/80',
  accentText: isDarkMode ? 'text-blue-400' : 'text-blue-600',
  logoBadge: 'bg-blue-600 text-white shadow-blue-500/25',
  logoGradient: 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent',
  subBorder: isDarkMode ? 'border-slate-800/80' : 'border-slate-200/60',
});

export const Footer: React.FC = () => {
  const { isDarkMode } = useApp();
  const isWhite = !isDarkMode;
  const theme = getFooterTheme(isDarkMode);

  return (
    <footer className={`pt-12 pb-24 sm:pb-12 border-t transition-colors duration-300 ${theme.bg} ${theme.border}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* 4 Customer Trust Guarantees */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-10 border-b ${isWhite ? 'border-slate-200' : 'border-white/10'}`}>
          <div className={`p-4 rounded-2xl border ${theme.cardBg} ${theme.cardBorder} flex items-start gap-3.5 shadow-sm`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isWhite ? 'bg-indigo-50' : 'bg-white/5'} ${theme.accentText}`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className={`font-extrabold text-sm ${isWhite ? 'text-slate-900' : 'text-white'}`}>100% Genuine Products</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Direct authorized sellers from Amazon, Flipkart, Croma & verified brands.
              </p>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border ${theme.cardBg} ${theme.cardBorder} flex items-start gap-3.5 shadow-sm`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isWhite ? 'bg-indigo-50' : 'bg-white/5'} ${theme.accentText}`}>
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <h4 className={`font-extrabold text-sm ${isWhite ? 'text-slate-900' : 'text-white'}`}>Best Price Guarantee</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Live multi-store comparison with true final price, cashbacks, and coupons.
              </p>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border ${theme.cardBg} ${theme.cardBorder} flex items-start gap-3.5 shadow-sm`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isWhite ? 'bg-indigo-50' : 'bg-white/5'} ${theme.accentText}`}>
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className={`font-extrabold text-sm ${isWhite ? 'text-slate-900' : 'text-white'}`}>Fast & Reliable Delivery</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Speedy doorstep shipping to 27,000+ pin codes with live package tracking.
              </p>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border ${theme.cardBg} ${theme.cardBorder} flex items-start gap-3.5 shadow-sm`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isWhite ? 'bg-indigo-50' : 'bg-white/5'} ${theme.accentText}`}>
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className={`font-extrabold text-sm ${isWhite ? 'text-slate-900' : 'text-white'}`}>7-Day Easy Returns</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Hassle-free replacement or 100% refund guarantee with free doorstep pickup.
              </p>
            </div>
          </div>
        </div>

        {/* Main 4 Customer-Centric Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Column 1: Brand & Customer Care (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl overflow-hidden shadow-md shadow-brand-500/20 ring-1 ring-white/20 bg-[#00061e] flex items-center justify-center shrink-0">
                <img src="/smartdeal_icon_mark.png" alt="SmartDeal" className="w-full h-full object-cover" />
              </div>
              <span className={`font-black text-xl tracking-tight ${isWhite ? 'text-slate-900' : 'text-white'}`}>
                Smart<span className={theme.logoGradient}>Deal</span>
              </span>
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${isWhite ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-white/10 text-white border-white/15'} tracking-wider border`}>
                PRO
              </span>
            </div>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              India's trusted smart shopping and real-time price comparison platform. Compare live prices across Flipkart, Amazon, Croma, and Reliance Digital to guarantee you always pay the lowest price.
            </p>

            {/* Direct Customer Support Box */}
            <div className={`p-4 rounded-2xl border ${theme.cardBg} ${theme.cardBorder} space-y-2.5 text-xs`}>
              <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Customer Care & Order Support</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className={`w-3.5 h-3.5 shrink-0 ${theme.accentText}`} />
                <span className="font-bold">Phone / WhatsApp:</span>
                <a href="tel:7217514087" className={`font-black hover:underline ${isWhite ? 'text-indigo-600' : 'text-white'}`}>+91 72175 14087</a>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className={`w-3.5 h-3.5 shrink-0 ${theme.accentText}`} />
                <span className="font-bold">Support Email:</span>
                <a href="mailto:jk7217514087@gmail.com" className={`font-semibold hover:underline truncate ${isWhite ? 'text-indigo-600' : 'text-white'}`}>jk7217514087@gmail.com</a>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-[11px] pt-0.5">
                <Clock className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                <span>Support Timings: 9:00 AM – 9:00 PM (All 7 Days)</span>
              </div>
            </div>
          </div>

          {/* Column 2: Popular Categories (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className={`font-extrabold text-xs uppercase tracking-wider ${isWhite ? 'text-slate-900' : 'text-white'}`}>
              Popular Categories
            </h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/categories?cat=Mobiles" className={`transition-colors ${isWhite ? 'hover:text-indigo-600' : 'hover:text-white'}`}>Smartphones & 5G</Link></li>
              <li><Link to="/categories?cat=Laptops" className={`transition-colors ${isWhite ? 'hover:text-indigo-600' : 'hover:text-white'}`}>Laptops & Computers</Link></li>
              <li><Link to="/categories?cat=Audio" className={`transition-colors ${isWhite ? 'hover:text-indigo-600' : 'hover:text-white'}`}>Wireless Earbuds</Link></li>
              <li><Link to="/categories?cat=TV" className={`transition-colors ${isWhite ? 'hover:text-indigo-600' : 'hover:text-white'}`}>Smart TVs & Video</Link></li>
              <li><Link to="/categories?cat=Shoes" className={`transition-colors ${isWhite ? 'hover:text-indigo-600' : 'hover:text-white'}`}>Sneakers & Footwear</Link></li>
              <li><Link to="/categories?cat=Smartwatch" className={`transition-colors ${isWhite ? 'hover:text-indigo-600' : 'hover:text-white'}`}>Fitness Smartwatches</Link></li>
              <li><Link to="/deals" className="text-amber-500 hover:text-amber-600 font-bold transition-colors">🔥 Today's Best Deals</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Services (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h5 className={`font-extrabold text-xs uppercase tracking-wider ${isWhite ? 'text-slate-900' : 'text-white'}`}>
              Customer Services
            </h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/orders" className={`transition-colors ${isWhite ? 'hover:text-indigo-600' : 'hover:text-white'}`}>Track My Order & Delivery</Link></li>
              <li><Link to="/price-alerts" className={`transition-colors ${isWhite ? 'hover:text-indigo-600' : 'hover:text-white'}`}>Price Drop Alerts</Link></li>
              <li><Link to="/wishlist" className={`transition-colors ${isWhite ? 'hover:text-indigo-600' : 'hover:text-white'}`}>My Saved Wishlist</Link></li>
              <li><Link to="/compare" className={`transition-colors ${isWhite ? 'hover:text-indigo-600' : 'hover:text-white'}`}>Live Store Price Comparison</Link></li>
              <li><Link to="/support" className={`transition-colors ${isWhite ? 'hover:text-indigo-600' : 'hover:text-white'}`}>Help Center & FAQs</Link></li>
              <li>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('trigger-app-install'))}
                  className="text-indigo-500 hover:text-indigo-600 font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Install SmartDeal App</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Safe Shopping & Trust (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className={`font-extrabold text-xs uppercase tracking-wider ${isWhite ? 'text-slate-900' : 'text-white'}`}>
              Safe Shopping
            </h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><span className="text-emerald-500 font-semibold flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> 100% Genuine Invoice</span></li>
              <li><span className={`${isWhite ? 'text-slate-600' : 'text-slate-300'} flex items-center gap-1.5`}><CheckCircle2 className="w-3.5 h-3.5 text-blue-500" /> Brand Warranty</span></li>
              <li><Link to="/terms" className={`transition-colors ${isWhite ? 'hover:text-indigo-600' : 'hover:text-white'}`}>Terms of Service</Link></li>
              <li><Link to="/privacy" className={`transition-colors ${isWhite ? 'hover:text-indigo-600' : 'hover:text-white'}`}>Privacy Policy</Link></li>
              <li><Link to="/become-seller" className="text-amber-500 hover:text-amber-600 font-bold flex items-center gap-1.5 pt-1"><Store className="w-3.5 h-3.5" /> Become a Seller</Link></li>
            </ul>
          </div>
        </div>

        {/* Accepted Payment Methods & Security Strip */}
        <div className={`pt-6 pb-2 border-t ${isWhite ? 'border-slate-200' : 'border-white/10'} flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400`}>
          <div className="flex flex-wrap items-center gap-2 text-slate-400">
            <span className="font-extrabold text-[11px] uppercase tracking-wider mr-1">
              Supported Marketplaces:
            </span>
            <span className={`px-2 py-0.5 rounded-md ${isWhite ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-white/5 text-white border-white/10'} border text-[11px] font-bold`}>Amazon</span>
            <span className={`px-2 py-0.5 rounded-md ${isWhite ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-white/5 text-white border-white/10'} border text-[11px] font-bold`}>Flipkart</span>
            <span className={`px-2 py-0.5 rounded-md ${isWhite ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-white/5 text-white border-white/10'} border text-[11px] font-bold`}>Croma</span>
            <span className={`px-2 py-0.5 rounded-md ${isWhite ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-white/5 text-white border-white/10'} border text-[11px] font-bold`}>Reliance Digital</span>
            <span className={`px-2 py-0.5 rounded-md ${isWhite ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-white/5 text-white border-white/10'} border text-[11px] font-bold`}>Tata CLiQ</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            <span>256-Bit SSL Encrypted & Verified Deals</span>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className={`pt-6 border-t ${isWhite ? 'border-slate-200' : 'border-white/10'} flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500`}>
          <p>© 2026 SmartDeal Inc. All rights reserved. “Compare. Save. Buy Smarter.”</p>
          <div className="flex items-center gap-4 text-[11px]">
            <Link to="/privacy" className="hover:text-slate-400 transition-colors">Privacy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-slate-400 transition-colors">Terms</Link>
            <span>•</span>
            <Link to="/support" className="hover:text-slate-400 transition-colors">Help Center</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
