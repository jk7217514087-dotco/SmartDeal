import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { InvoiceModal } from '../components/common/InvoiceModal';
import {
  CheckCircle2,
  Truck,
  ShoppingBag,
  FileText
} from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { orders } = useApp();
  const [invoiceOpen, setInvoiceOpen] = useState(false);

  const order = orders.find(o => o.id === id) || orders[0];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      {/* Confirmation Hero Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-4 shadow-sm">
        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto animate-bounce shadow-md border border-emerald-500/20">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div>
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/50">
            Payment Verified
          </span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-2">
            Order Placed Successfully!
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
            Thank you for shopping on SmartDeals. We've notified the verified merchant and sent the tax invoice to your email.
          </p>
        </div>

        {/* Order ID Pill */}
        <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-2xl text-xs font-mono font-bold text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700">
          <span>Order ID:</span>
          <span className="text-brand-600 dark:text-brand-400">{order.id}</span>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            to={`/tracking/${order.id}`}
            className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-md shadow-brand-500/25 flex items-center gap-2 transition-all"
          >
            <Truck className="w-4 h-4" />
            <span>Track Order Timeline</span>
          </Link>

          <button
            onClick={() => setInvoiceOpen(true)}
            className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-brand-600 dark:hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>View Tax Invoice</span>
          </button>

          <Link
            to="/orders"
            className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-2 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>All Orders</span>
          </Link>

          <Link
            to="/"
            className="px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      {/* Order Summary Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Order Details</h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60">
            <div className="text-slate-400 dark:text-slate-500 font-semibold">Total Amount</div>
            <div className="text-base font-black text-slate-900 dark:text-white mt-1">₹{order.finalAmount.toLocaleString('en-IN')}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60">
            <div className="text-slate-400 dark:text-slate-500 font-semibold">Payment Mode</div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{order.paymentMethod}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60">
            <div className="text-slate-400 dark:text-slate-500 font-semibold">Expected Delivery</div>
            <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mt-1">{order.expectedDelivery}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60">
            <div className="text-slate-400 dark:text-slate-500 font-semibold">Delivery Partner</div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{order.deliveryPartner}</div>
          </div>
        </div>

        {/* Items List */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800 pt-2">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <img src={item.productImage} alt="" className="w-12 h-12 object-contain rounded-xl bg-slate-50 dark:bg-slate-800/80 p-1" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{item.productName}</div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500">Qty: {item.quantity} • Sold by {item.sellerName}</div>
                </div>
              </div>
              <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>
      </div>

      <InvoiceModal
        order={order}
        isOpen={invoiceOpen}
        onClose={() => setInvoiceOpen(false)}
      />
    </div>
  );
};
