import React, { useState } from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { Bell, X, Check, Mail, Smartphone, BellRing } from 'lucide-react';

interface Props {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const PriceAlertModal: React.FC<Props> = ({ product, isOpen, onClose }) => {
  const { addPriceAlert } = useApp();
  const [targetPrice, setTargetPrice] = useState(
    Math.round(product.sellingPrice * 0.9)
  );
  const [channels, setChannels] = useState<('in-app' | 'email' | 'sms')[]>([
    'in-app',
    'email'
  ]);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const toggleChannel = (ch: 'in-app' | 'email' | 'sms') => {
    setChannels(prev =>
      prev.includes(ch) ? prev.filter(c => c !== ch) : [...prev, ch]
    );
  };

  const handleSave = () => {
    addPriceAlert(product.id, targetPrice, channels);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-base">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Bell className="w-4 h-4" />
            </div>
            <span>Set Price Drop Alert</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
          <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-xl" />
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-slate-800 dark:text-white line-clamp-1">{product.name}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Current Price: <span className="font-extrabold text-slate-900 dark:text-white">₹{product.sellingPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Price (₹)</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
            <input
              type="number"
              value={targetPrice}
              onChange={e => setTargetPrice(Number(e.target.value))}
              className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-sm font-bold text-slate-900 dark:text-white focus:outline-none"
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Alert will trigger when price dips below ₹{targetPrice.toLocaleString('en-IN')}</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              Save ₹{(product.sellingPrice - targetPrice).toLocaleString('en-IN')} extra
            </span>
          </div>
        </div>

        {/* Channels */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Notify Me Via</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => toggleChannel('in-app')}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                channels.includes('in-app')
                  ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-300 dark:border-brand-700 text-brand-700 dark:text-brand-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
              }`}
            >
              <BellRing className="w-4 h-4" />
              <span>In-App</span>
            </button>
            <button
              onClick={() => toggleChannel('email')}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                channels.includes('email')
                  ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-300 dark:border-brand-700 text-brand-700 dark:text-brand-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </button>
            <button
              onClick={() => toggleChannel('sms')}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                channels.includes('sms')
                  ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-300 dark:border-brand-700 text-brand-700 dark:text-brand-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>SMS</span>
            </button>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-extrabold text-sm shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              <span>Price Alert Activated!</span>
            </>
          ) : (
            <>
              <Bell className="w-4 h-4" />
              <span>Create Price Alert</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
