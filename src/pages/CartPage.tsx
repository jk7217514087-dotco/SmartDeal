import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  Coins,
  Tag,
  ShieldCheck,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    appliedCoupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    useSmartCoins,
    setUseSmartCoins,
    cartCalculations,
    smartCoinsBalance
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; error?: boolean } | null>(null);
  const navigate = useNavigate();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponMsg({ text: res.message, error: !res.success });
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-5">
        <div className="w-20 h-20 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto shadow-inner border border-indigo-200 dark:border-indigo-800/50">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Your SmartDeals Cart is Empty</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Explore multi-marketplace discounts, track real prices, and earn SmartCoins on your next order!
        </p>
        <Link
          to="/categories"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-extrabold text-sm shadow-lg shadow-brand-500/25 hover:scale-105 active:scale-95 transition-all"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>Shopping Cart</span>
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50 px-2.5 py-1 rounded-full border border-brand-200 dark:border-brand-800/40">
              {cart.reduce((s, i) => s + i.quantity, 0)} Items
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Transparent Final Price Engine with live SmartCoins redemption
          </p>
        </div>
        <Link to="/categories" className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 flex items-center gap-1">
          <span>Continue Shopping</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {cart.map(item => {
            const itemPrice = item.selectedSellerPrice?.finalPrice ?? item.product.sellingPrice;
            const seller = item.selectedSellerPrice?.sellerName ?? item.product.seller;
            const sellerKey = `${item.product.id}-${seller}`;

            return (
              <div
                key={sellerKey}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center gap-4 hover:border-brand-300 dark:hover:border-brand-500/50 transition-all"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-24 h-24 object-contain rounded-2xl bg-slate-50 dark:bg-slate-800/80 p-2 shrink-0"
                />

                <div className="flex-1 space-y-1.5 w-full">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50 px-2 py-0.5 rounded-full border border-brand-200 dark:border-brand-800/40">
                        {item.product.brand}
                      </span>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 mt-1">
                        {item.product.name}
                      </h3>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id, item.selectedSellerPrice?.sellerName)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors shrink-0"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <span>Store / Seller:</span>
                    <span className="font-extrabold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded-md border border-brand-200 dark:border-brand-800/40">
                      {seller}
                    </span>
                    {item.selectedSellerPrice?.deliveryDate && (
                      <span className="text-[11px] text-slate-400">({item.selectedSellerPrice.deliveryDate})</span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-black text-slate-900 dark:text-white">
                        ₹{(itemPrice * item.quantity).toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 line-through">
                        ₹{(item.product.mrp * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Quantity stepper */}
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200/60 dark:border-slate-700">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.selectedSellerPrice?.sellerName)}
                        className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 shadow-xs text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center text-xs font-black text-slate-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.selectedSellerPrice?.sellerName)}
                        className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 shadow-xs text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center transition-colors"
                      >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
              </div>
            );
          })}

          {/* Trust Guarantees banner */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex items-center gap-3 text-xs text-indigo-900 dark:text-indigo-300">
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <div>
              <strong>SmartDeals Assured Protection:</strong> 100% authentic brand invoice, original packaging, and 7-day hassle-free return window.
            </div>
          </div>
        </div>

        {/* Final Price Engine / Order Summary Box (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-6 sticky top-28">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-black text-slate-900 dark:text-white text-base">Order Summary & Price Engine</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Transparent payable breakdown</p>
          </div>

          {/* Coupon Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>Apply Coupon</span>
            </label>
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/50 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Coupon {appliedCoupon} (-₹{couponDiscount})</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={e => setCouponInput(e.target.value)}
                  placeholder="e.g. SMART200, DEAL500"
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white uppercase font-bold focus:border-brand-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-brand-600 dark:hover:bg-brand-500 text-white font-bold text-xs"
                >
                  Apply
                </button>
              </form>
            )}
            {couponMsg && (
              <div className={`text-[11px] font-medium ${couponMsg.error ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {couponMsg.text}
              </div>
            )}
          </div>

          {/* SmartCoins Redemption Widget (Section 11 & 12) */}
          <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-amber-900 dark:text-amber-300">
                  SmartCoins Available: {smartCoinsBalance}
                </span>
              </div>
              <span className="text-[11px] font-extrabold text-amber-800 dark:text-amber-400">
                Value: ₹{Math.floor(smartCoinsBalance / 10)}
              </span>
            </div>

            <div className="text-[11px] text-amber-700 dark:text-amber-400">
              Rule: <strong>10 SmartCoins = ₹1</strong> redemption value. Max 500 coins per order.
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={useSmartCoins}
                onChange={e => setUseSmartCoins(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded accent-amber-500"
              />
              <span className="text-xs font-bold text-amber-950 dark:text-amber-200">
                Redeem {Math.min(smartCoinsBalance, 500)} Coins (-₹{cartCalculations.smartCoinsDiscount})
              </span>
            </label>
          </div>

          {/* Calculation Breakdown Lines (Section 7) */}
          <div className="space-y-2 text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Total MRP</span>
              <span className="line-through">₹{cartCalculations.mrpTotal.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Selling Price Total</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">₹{cartCalculations.sellingPriceTotal.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
              <span>Store Discount</span>
              <span>-₹{(cartCalculations.mrpTotal - cartCalculations.sellingPriceTotal).toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Delivery Charges</span>
              <span>
                {cartCalculations.deliveryTotal === 0 ? (
                  <strong className="text-emerald-600 dark:text-emerald-400">FREE</strong>
                ) : (
                  `₹${cartCalculations.deliveryTotal}`
                )}
              </span>
            </div>

            {couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                <span>Coupon ({appliedCoupon})</span>
                <span>-₹{couponDiscount}</span>
              </div>
            )}

            {cartCalculations.smartCoinsDiscount > 0 && (
              <div className="flex justify-between text-amber-700 dark:text-amber-400 font-bold">
                <span>SmartCoins Redeemed ({cartCalculations.smartCoinsDiscount * 10} Coins)</span>
                <span>-₹{cartCalculations.smartCoinsDiscount}</span>
              </div>
            )}

            {/* Final Payable */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline">
              <div>
                <div className="text-sm font-black text-slate-900 dark:text-white">Final Payable Price</div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                  Total Real Saving: ₹{cartCalculations.totalSavings.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="text-2xl font-black text-slate-950 dark:text-white">
                ₹{cartCalculations.finalPayable.toLocaleString('en-IN')}
              </div>
            </div>

            {/* SmartCoins earned on this order */}
            <div className="mt-2 p-2.5 rounded-xl bg-amber-100/60 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 font-bold text-xs flex items-center justify-between border border-amber-200 dark:border-amber-800/50">
              <span className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>You will earn on this order:</span>
              </span>
              <span className="font-extrabold text-amber-700 dark:text-amber-400">+{cartCalculations.coinsEarned} Coins</span>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-extrabold text-sm shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <span>Proceed to Buy</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
