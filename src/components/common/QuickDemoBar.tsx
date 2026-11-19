import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Layers,
  Scale,
  TrendingDown,
  Truck,
  Store,
  ShieldAlert,
  ChevronUp,
  ChevronDown,
  Zap,
  ShoppingBag,
  Radio
} from 'lucide-react';

export const QuickDemoBar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { role, setRole, setIsAiAssistantOpen, currentUser } = useApp();

  // ONLY Owner / Verified Admin can see this interactive demo panel
  const isOwner = currentUser?.role === 'ADMIN' && sessionStorage.getItem('smartdeal_admin_authenticated') === 'true';
  if (!isOwner) {
    return null;
  }

  const scenarios = [
    ...(role === 'ADMIN' ? [{
      title: '🛡️ Admin Command Center',
      desc: '10 KPIs, User Timelines, Outbound Clicks, Commissions & CSV',
      icon: ShieldAlert,
      color: 'bg-rose-500',
      action: () => {
        setRole('ADMIN');
        navigate('/admin/dashboard');
      }
    }] : []),
    {
      title: '👤 User Activity Timeline',
      desc: 'Transparent shopper funnel & Outbound merchant visits',
      icon: Radio,
      color: 'bg-indigo-500',
      action: () => {
        setRole('USER');
        navigate('/profile');
      }
    },
    {
      title: 'Price Comparison Table',
      desc: 'Amazon vs Flipkart vs Croma with 3s redirect modal',
      icon: Layers,
      color: 'bg-indigo-500',
      action: () => {
        setRole('USER');
        navigate('/compare/prod-samsung-m14');
      }
    },
    {
      title: 'Deal DNA & Fake Discount',
      desc: '90-day price history & AI verdict',
      icon: TrendingDown,
      color: 'bg-emerald-500',
      action: () => {
        setRole('USER');
        navigate('/deal-intelligence/prod-samsung-m14');
      }
    },
    {
      title: 'Product vs Product AI',
      desc: 'Section 27 Head-to-Head Comparison',
      icon: Scale,
      color: 'bg-purple-500',
      action: () => {
        setRole('USER');
        navigate('/product-vs-product');
      }
    },
    {
      title: 'Cart & Price Engine',
      desc: 'Transparent store discount calculation',
      icon: ShoppingBag,
      color: 'bg-emerald-500',
      action: () => {
        setRole('USER');
        navigate('/cart');
      }
    },
    {
      title: '5-Step Order Tracking',
      desc: 'Carrier AWB & Live courier timeline',
      icon: Truck,
      color: 'bg-blue-500',
      action: () => {
        setRole('USER');
        navigate('/tracking/SD1234567890');
      }
    },
    {
      title: 'Seller 0% Commission',
      desc: '7/10 sales progress & Add Product payout',
      icon: Store,
      color: 'bg-orange-500',
      action: () => {
        setRole('SELLER');
        navigate('/seller/dashboard');
      }
    },
    ...(role === 'ADMIN' ? [{
      title: 'Admin Command Suite',
      desc: 'Platform GMV, KYC approvals, fee slabs',
      icon: ShieldAlert,
      color: 'bg-rose-500',
      action: () => {
        setRole('ADMIN');
        navigate('/admin/dashboard');
      }
    }] : [])
  ];

  return (
    <aside aria-label="Demo Shortcuts" className="fixed bottom-16 sm:bottom-4 left-3 sm:left-4 z-40 max-w-[calc(100vw-1.5rem)] sm:max-w-md">
      <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl border border-white/15 shadow-2xl overflow-hidden transition-all duration-300">
        {/* Toggle Bar */}
        <header
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2.5 px-3.5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-black tracking-wide">Interactive Demo Shortcuts</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <span>{isExpanded ? 'Minimize' : 'Explore Scenarios'}</span>
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </div>
        </header>

        {/* Shortcuts Grid */}
        {isExpanded && (
          <div className="p-3 pt-1 border-t border-white/10 space-y-1.5 text-xs max-h-72 overflow-y-auto">
            {scenarios.map((sc, idx) => {
              const Icon = sc.icon;
              return (
                <button
                  key={idx}
                  onClick={sc.action}
                  className="w-full p-2 rounded-xl bg-white/5 hover:bg-white/15 text-left flex items-center justify-between gap-2.5 transition-all group active:scale-98"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className={`w-7 h-7 rounded-lg ${sc.color} text-white flex items-center justify-center shrink-0 shadow-sm`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-bold text-white text-xs truncate group-hover:text-amber-300 transition-colors">
                        {sc.title}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{sc.desc}</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded font-bold text-slate-300 shrink-0">
                    Test
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};
