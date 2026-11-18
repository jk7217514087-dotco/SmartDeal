import React from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import {
  Bell,
  Trash2,
  BellRing,
  Mail,
  Smartphone,
  CheckCircle2,
  TrendingDown,
  ArrowRight,
  X
} from 'lucide-react';
import { PriceAlertModal } from '../components/common/PriceAlertModal';

export const PriceAlertsPage: React.FC = () => {
  const { priceAlerts, removePriceAlert, products } = useApp();
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>Price Drop Alerts</span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800/60">
              {priceAlerts.length} Active
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            We monitor competitor price cuts 24/7 and notify you instantly across your chosen channels
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPickerOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>+ Set New Alert</span>
          </button>
          <Link
            to="/categories"
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 flex items-center gap-1"
          >
            <span>Find Deals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {priceAlerts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <Bell className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No active price alerts</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
              Visit any product detail page and click "Price Alert" to set your target drop threshold.
            </p>
          </div>
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition-all"
          >
            <span>Browse Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {priceAlerts.map(alert => (
            <div
              key={alert.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-amber-400 dark:hover:border-amber-500/50 transition-all"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={alert.productImage}
                  alt=""
                  className="w-16 h-16 object-contain rounded-2xl bg-slate-50 dark:bg-slate-800/80 p-1.5 shrink-0"
                />
                <div className="space-y-1">
                  <Link
                    to={alert.productId === 'prod-boat-airdopes' ? '/' : `/product/${alert.productId}`}
                    className="text-sm font-bold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 line-clamp-1"
                  >
                    {alert.productName}
                  </Link>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-500 dark:text-slate-400">
                      Current: <strong className="text-slate-800 dark:text-slate-200 font-bold">₹{alert.currentPrice.toLocaleString('en-IN')}</strong>
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-extrabold flex items-center gap-1">
                      <TrendingDown className="w-3.5 h-3.5" />
                      Target: ₹{alert.targetPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                    <span>Active Channels:</span>
                    {alert.notifyVia.map(ch => (
                      <span key={ch} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded uppercase font-bold">
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                <Link
                  to={alert.productId === 'prod-boat-airdopes' ? '/' : `/product/${alert.productId}`}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-brand-600 dark:hover:bg-brand-500 text-white font-bold text-xs shadow-xs"
                >
                  View Live Deal
                </Link>
                <button
                  onClick={() => removePriceAlert(alert.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors"
                  title="Delete alert"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Selection Modal for Setting Alert */}
      {pickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Select a Product to Monitor
                </h3>
              </div>
              <button
                onClick={() => setPickerOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 shrink-0">
              Choose an item to track. We will continuously scan live prices across Amazon, Flipkart, Croma, and Tata CLiQ.
            </p>

            <div className="overflow-y-auto space-y-2 flex-1 pr-1">
              {products.map(p => (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedProduct(p);
                    setPickerOpen(false);
                  }}
                  className="flex items-center justify-between gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800/80 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt="" className="w-12 h-12 object-contain rounded-xl bg-slate-50 dark:bg-slate-800 p-1 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{p.name}</h4>
                      <div className="text-[11px] text-slate-400">Current: ₹{p.sellingPrice.toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1 rounded-xl shrink-0">
                    Track Price
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Target Price Alert Configuration Modal */}
      {selectedProduct && (
        <PriceAlertModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};
