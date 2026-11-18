import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  Search,
  TrendingDown,
  Sparkles,
  ShieldCheck,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Layers,
  Radio,
  Sliders,
  ShieldAlert
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { marketplaceComplianceService } from '../services/marketplaceComplianceService';

export const PriceTrackerPage: React.FC = () => {
  const { products, priceAlerts, addPriceAlert, removePriceAlert } = useApp();
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [targetPrice, setTargetPrice] = useState<number>(() => {
    const p = products[0];
    return p ? Math.round(p.sellingPrice * 0.9) : 10000;
  });
  const [notifyChannels, setNotifyChannels] = useState<{ inApp: boolean; email: boolean; sms: boolean }>({
    inApp: true,
    email: true,
    sms: false
  });
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  const handleProductChange = (prodId: string) => {
    setSelectedProductId(prodId);
    const prod = products.find(p => p.id === prodId);
    if (prod) {
      setTargetPrice(Math.round(prod.sellingPrice * 0.9));
    }
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const channels: ('in-app' | 'email' | 'sms')[] = [];
    if (notifyChannels.inApp) channels.push('in-app');
    if (notifyChannels.email) channels.push('email');
    if (notifyChannels.sms) channels.push('sms');

    addPriceAlert(selectedProduct.id, targetPrice, channels);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950 to-blue-950 border border-slate-800 p-8 sm:p-12 text-white shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-black uppercase tracking-wider">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>AI Price Radar & Price Drop Alerts</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Never Miss a Price Drop. Buy When Prices Hit Rock Bottom.
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Set your target budget on any smartphone, laptop, or gadget. Our AI deal radar monitors Amazon, Flipkart, Croma, and other stores 24/7 and triggers an instant alert the second the price drops.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Set New Alert Card */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Create Price Radar Alert</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Select a product and configure your desired price target</p>
            </div>
          </div>

          <form onSubmit={handleCreateAlert} className="space-y-5">
            {/* Product Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Choose Product to Track</label>
              <select
                value={selectedProductId}
                onChange={e => handleProductChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Current: ₹{p.sellingPrice.toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Product Preview */}
            {selectedProduct && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-4">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-16 h-16 object-contain rounded-xl bg-white p-1"
                />
                <div className="space-y-1 text-xs">
                  <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{selectedProduct.name}</div>
                  <div className="text-slate-500 dark:text-slate-400">
                    Current Best: <strong className="text-brand-600 dark:text-brand-400">₹{selectedProduct.sellingPrice.toLocaleString('en-IN')}</strong>
                    {' '}(MRP: <span className="line-through">₹{selectedProduct.mrp.toLocaleString('en-IN')}</span>)
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                    Deal Score: {selectedProduct.dealScore}/100 • {selectedProduct.dealScoreBreakdown?.verdict || 'Good Deal'}
                  </div>
                </div>
              </div>
            )}

            {/* Target Price Input & Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">Your Target Price (₹)</span>
                <span className="text-brand-600 dark:text-brand-400 font-black text-sm">
                  ₹{targetPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min={Math.round((selectedProduct?.sellingPrice || 1000) * 0.5)}
                max={selectedProduct?.sellingPrice || 20000}
                step={50}
                value={targetPrice}
                onChange={e => setTargetPrice(Number(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>50% below current</span>
                <span>Current price</span>
              </div>
            </div>

            {/* Notification Channels */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Notification Channels</label>
              <div className="grid grid-cols-3 gap-2">
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyChannels.inApp}
                    onChange={e => setNotifyChannels(prev => ({ ...prev, inApp: e.target.checked }))}
                    className="rounded text-brand-600"
                  />
                  <span>In-App</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyChannels.email}
                    onChange={e => setNotifyChannels(prev => ({ ...prev, email: e.target.checked }))}
                    className="rounded text-brand-600"
                  />
                  <span>Email</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyChannels.sms}
                    onChange={e => setNotifyChannels(prev => ({ ...prev, sms: e.target.checked }))}
                    className="rounded text-brand-600"
                  />
                  <span>SMS</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-black text-xs sm:text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span>Activate Price Radar Alert</span>
            </button>

            {/* Marketplace Affiliate Policy Compliance Note */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-[11px] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Monitored Platforms</span>
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  {marketplaceComplianceService.getPermittedMarketplaces('price_tracking').slice(0, 3).join(', ')} Active
                </span>
              </div>

              {!marketplaceComplianceService.isPriceTrackingAllowed('amazon') && (
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-300 text-[10px] flex items-start gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Amazon India:</strong> Price tracking & alerts are paused by default in compliance with the Amazon Associates Operating Agreement until written approval is obtained.
                  </span>
                </div>
              )}
            </div>

            {showSuccessToast && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Price radar active! You will be notified the instant the price reaches ₹{targetPrice.toLocaleString('en-IN')}.</span>
              </div>
            )}
          </form>
        </div>

        {/* Active Alerts List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-brand-600" />
              <span>Active Price Drop Alerts ({priceAlerts.length})</span>
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">Monitoring Amazon, Flipkart, Croma & more</span>
          </div>

          {priceAlerts.length > 0 ? (
            <div className="space-y-4">
              {priceAlerts.map(alert => {
                const diff = alert.currentPrice - alert.targetPrice;
                const diffPercent = Math.round((diff / alert.currentPrice) * 100);

                return (
                  <div
                    key={alert.id}
                    className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm hover:border-brand-400 transition-all"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <img
                        src={alert.productImage}
                        alt={alert.productName}
                        className="w-16 h-16 object-contain rounded-2xl bg-slate-50 dark:bg-slate-800 p-1 shrink-0"
                      />
                      <div className="space-y-1">
                        <Link
                          to={alert.productId === 'prod-boat-airdopes' ? '/' : `/product/${alert.productId}`}
                          className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1 hover:text-brand-600 transition-colors"
                        >
                          {alert.productName}
                        </Link>
                        <div className="flex flex-wrap items-center gap-3 text-xs">
                          <span className="text-slate-500 dark:text-slate-400">
                            Current: <strong>₹{alert.currentPrice.toLocaleString('en-IN')}</strong>
                          </span>
                          <span className="text-brand-600 dark:text-brand-400 font-black">
                            Target: ₹{alert.targetPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 font-extrabold border border-amber-200 dark:border-amber-800/40">
                            Needs ₹{diff.toLocaleString('en-IN')} drop ({diffPercent}%)
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Channels: {alert.notifyVia?.join(', ') || 'in-app, email'} • Created: {alert.createdDate || 'Recently'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <Link
                        to={`/compare/${alert.productId}`}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all flex items-center gap-1.5"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Compare</span>
                      </Link>
                      <button
                        onClick={() => removePriceAlert(alert.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer"
                        title="Delete Alert"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <Bell className="w-10 h-10 text-slate-400 mx-auto" />
              <div className="text-sm font-bold text-slate-900 dark:text-white">No active price alerts set</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Use the form on the left to set your first target alert, or click the bell icon on any product card.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
