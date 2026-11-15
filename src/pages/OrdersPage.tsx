import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { InvoiceModal } from '../components/common/InvoiceModal';
import { Order } from '../types';
import {
  Truck,
  ArrowRight,
  ShoppingBag,
  Coins,
  FileText
} from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const { orders } = useApp();
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">My Orders</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Track and manage past and active purchases</p>
        </div>
        <Link
          to="/categories"
          className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 flex items-center gap-1"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4">
          <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No orders placed yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Shop verified deals and earn SmartCoins rewards.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4 hover:border-brand-300 dark:hover:border-brand-500/50 transition-all"
            >
              {/* Order Top Meta */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-3">
                  <div>
                    <span className="text-slate-400">Order ID: </span>
                    <strong className="text-slate-900 dark:text-slate-100 font-mono">#{order.id}</strong>
                  </div>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="text-slate-500 dark:text-slate-400">{order.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-500 dark:text-slate-400">Total: <strong className="text-slate-900 dark:text-slate-100 text-sm">₹{order.finalAmount.toLocaleString('en-IN')}</strong></span>
                  <span className="text-xs bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/50">
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Items in order */}
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.productImage} alt="" className="w-14 h-14 object-contain rounded-xl bg-slate-50 dark:bg-slate-800/80 p-1 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{item.productName}</div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500">Qty: {item.quantity} • Seller: {item.sellerName}</div>
                      </div>
                    </div>
                    <span className="font-black text-slate-900 dark:text-white text-sm shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bottom Actions Bar */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold">
                  <Coins className="w-4 h-4 text-amber-500" />
                  <span>+{order.smartCoinsEarned} SmartCoins Earned</span>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to={`/tracking/${order.id}`}
                    className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Track Shipment</span>
                  </Link>

                  <button
                    onClick={() => setSelectedInvoiceOrder(order)}
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span>Tax Invoice</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedInvoiceOrder && (
        <InvoiceModal
          order={selectedInvoiceOrder}
          isOpen={!!selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}
    </div>
  );
};
