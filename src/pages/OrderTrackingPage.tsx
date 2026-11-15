import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { InvoiceModal } from '../components/common/InvoiceModal';
import {
  CheckCircle2,
  Clock,
  Truck,
  Package,
  MapPin,
  FileText,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const OrderTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { orders } = useApp();
  const [invoiceOpen, setInvoiceOpen] = useState(false);

  const order = orders.find(o => o.id === id) || orders[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Order Status & Live Courier Dispatch
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5 flex items-center gap-2">
            <span>Tracking Order</span>
            <span className="font-mono text-brand-600 dark:text-brand-400 font-extrabold text-xl">#{order.id}</span>
          </h1>
        </div>

        <button
          onClick={() => setInvoiceOpen(true)}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-200/80 dark:border-slate-700 transition-colors"
        >
          <FileText className="w-4 h-4 text-emerald-500" />
          <span>View Tax Invoice</span>
        </button>
      </div>

      {/* Tracking Stepper (Section 22) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="text-xs text-slate-400 dark:text-slate-500 font-semibold">Estimated Delivery</div>
            <div className="text-lg font-black text-emerald-700 dark:text-emerald-400">{order.expectedDelivery}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400 dark:text-slate-500 font-semibold">Delivery Partner</div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {order.deliveryPartner} (ID: {order.trackingId})
            </div>
          </div>
        </div>

        {/* Timeline Stepper */}
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2 relative z-10">
            {order.timeline.map((step, idx) => {
              const isDone = step.completed;
              return (
                <div key={idx} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-all ${
                      isDone
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>

                  <div className="space-y-0.5">
                    <div className={`text-xs font-bold ${isDone ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                      {step.title}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">{step.date}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight hidden sm:block">
                      {step.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Courier & Shipping Meta */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span>Shipping Address</span>
          </div>
          <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
            <div className="font-extrabold text-slate-900 dark:text-white">{order.shippingAddress.fullName}</div>
            <div>{order.shippingAddress.street}</div>
            <div>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</div>
            <div className="pt-1 font-semibold text-slate-800 dark:text-slate-200">Phone: {order.shippingAddress.phone}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Carrier Information</span>
          </div>
          <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
            <div className="font-extrabold text-slate-900 dark:text-white">{order.deliveryPartner}</div>
            <div>Tracking AWB: <span className="font-mono font-bold text-brand-600 dark:text-brand-400">{order.trackingId}</span></div>
            <div>Status: <span className="font-bold text-emerald-600 dark:text-emerald-400">{order.status}</span></div>
            <div className="pt-1 text-[11px] text-slate-400 dark:text-slate-500">
              Delivery executive will verify OTP at delivery.
            </div>
          </div>
        </div>
      </div>

      {/* Package Items */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Items in this Package</h3>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <img src={item.productImage} alt="" className="w-12 h-12 object-contain rounded-xl bg-slate-50 dark:bg-slate-800/80 p-1" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{item.productName}</div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500">Quantity: {item.quantity} • Seller: {item.sellerName}</div>
                </div>
              </div>
              <span className="font-black text-slate-900 dark:text-white text-sm">
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
