import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import {
  Truck,
  CreditCard,
  CheckCircle2,
  Lock,
  Coins
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { cartCalculations, placeOrder, cart } = useApp();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Credit / Debit Card' | 'Net Banking' | 'Cash on Delivery'>('UPI');
  const [selectedUpiApp, setSelectedUpiApp] = useState('Google Pay');
  const [upiId, setUpiId] = useState('rohit.kumar@okhdfcbank');
  const [isProcessing, setIsProcessing] = useState(false);

  const address = {
    id: 'addr-1',
    fullName: 'Rohit Kumar',
    street: '123, Green Park, Near Metro Station',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110016',
    phone: '+91 98765 43210',
    isDefault: true
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Trigger festive celebration confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      const order = placeOrder(paymentMethod, address);
      setIsProcessing(false);
      navigate(`/order-confirmation/${order.id}`);
    }, 1200);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">No items to checkout</h2>
        <button
          onClick={() => navigate('/categories')}
          className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Checkout Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>Secure Checkout</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200 dark:border-emerald-800/40">
              <Lock className="w-3 h-3" />
              256-bit Encrypted
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Complete your SmartDeals verified order</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Checkout Steps (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Delivery Address */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-sm">
                <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs">
                  1
                </div>
                <span>Delivery Address</span>
              </div>
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 cursor-pointer hover:underline">
                Change
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-xs space-y-1">
              <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{address.fullName}</span>
                <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-1.5 py-0.2 rounded font-bold">HOME</span>
              </div>
              <div className="text-slate-600 dark:text-slate-300">{address.street}, {address.city}, {address.state} - {address.pincode}</div>
              <div className="text-slate-500 dark:text-slate-400 font-medium">Contact: {address.phone}</div>
            </div>
          </div>

          {/* Step 2: Delivery Speed & Option */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-sm">
              <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs">
                2
              </div>
              <span>Delivery Option</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <Truck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Tomorrow Guaranteed Delivery</div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px]">Handled by SmartDeals Priority Surface Air</div>
                </div>
              </div>
              <span className="font-extrabold text-emerald-700 dark:text-emerald-400 uppercase">FREE</span>
            </div>
          </div>

          {/* Step 3: Payment Method */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-sm">
              <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs">
                3
              </div>
              <span>Select Payment Method</span>
            </div>

            <div className="space-y-2 text-xs">
              {/* UPI */}
              <label
                className={`p-3.5 rounded-2xl border flex flex-col gap-2 cursor-pointer transition-all ${
                  paymentMethod === 'UPI'
                    ? 'bg-indigo-50/50 dark:bg-indigo-950/40 border-brand-500 ring-2 ring-brand-500/10'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'UPI'}
                      onChange={() => setPaymentMethod('UPI')}
                      className="accent-brand-600"
                    />
                    <span>UPI (Google Pay, PhonePe, Paytm, BHIM)</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/40">
                    Fastest & Recommended
                  </span>
                </div>

                {paymentMethod === 'UPI' && (
                  <div className="pt-2 pl-6 space-y-2 border-t border-indigo-100 dark:border-indigo-900/50">
                    <div className="flex flex-wrap gap-2 text-xs">
                      {['Google Pay', 'PhonePe', 'Paytm', 'Enter UPI ID'].map(app => (
                        <button
                          key={app}
                          type="button"
                          onClick={() => setSelectedUpiApp(app)}
                          className={`px-3 py-1 rounded-xl font-bold text-xs transition-colors ${
                            selectedUpiApp === app
                              ? 'bg-brand-600 text-white'
                              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {app}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      placeholder="username@upi"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                )}
              </label>

              {/* Cards */}
              <label
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'Credit / Debit Card'
                    ? 'bg-indigo-50/50 dark:bg-indigo-950/40 border-brand-500 ring-2 ring-brand-500/10'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Credit / Debit Card'}
                    onChange={() => setPaymentMethod('Credit / Debit Card')}
                    className="accent-brand-600"
                  />
                  <span>Credit / Debit Card (Visa, Mastercard, RuPay)</span>
                </div>
                <CreditCard className="w-4 h-4 text-slate-400" />
              </label>

              {/* Net Banking */}
              <label
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'Net Banking'
                    ? 'bg-indigo-50/50 dark:bg-indigo-950/40 border-brand-500 ring-2 ring-brand-500/10'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Net Banking'}
                    onChange={() => setPaymentMethod('Net Banking')}
                    className="accent-brand-600"
                  />
                  <span>Net Banking (All Major Indian Banks)</span>
                </div>
              </label>

              {/* COD */}
              <label
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'bg-indigo-50/50 dark:bg-indigo-950/40 border-brand-500 ring-2 ring-brand-500/10'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                    className="accent-brand-600"
                  />
                  <span>Cash on Delivery (Cash / QR on Delivery)</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Order Summary Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6 sticky top-28">
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Order Review</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Checking out {cart.length} product(s)</p>
          </div>

          {/* Mini items list */}
          <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800 max-h-48 overflow-y-auto pr-1">
            {cart.map(i => {
              const itemPrice = i.selectedSellerPrice?.finalPrice ?? i.product.sellingPrice;
              const seller = i.selectedSellerPrice?.sellerName ?? i.product.seller;
              return (
                <div key={`${i.product.id}-${seller}`} className="pt-2 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <img src={i.product.image} alt="" className="w-10 h-10 object-contain rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800" />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{i.product.name}</div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500">
                        Qty: {i.quantity} • Sold by {seller}
                      </div>
                    </div>
                  </div>
                  <span className="font-extrabold text-slate-900 dark:text-white shrink-0">
                    ₹{(itemPrice * i.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2 text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Total MRP</span>
              <span>₹{cartCalculations.mrpTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
              <span>Product Discount</span>
              <span>-₹{(cartCalculations.mrpTotal - cartCalculations.sellingPriceTotal).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Delivery Charges</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">FREE</span>
            </div>
            {cartCalculations.couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                <span>Coupon Savings</span>
                <span>-₹{cartCalculations.couponDiscount}</span>
              </div>
            )}
            {cartCalculations.smartCoinsDiscount > 0 && (
              <div className="flex justify-between text-amber-700 dark:text-amber-400 font-bold">
                <span>SmartCoins Discount</span>
                <span>-₹{cartCalculations.smartCoinsDiscount}</span>
              </div>
            )}

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline">
              <span className="text-sm font-black text-slate-900 dark:text-white">Total Payable</span>
              <span className="text-2xl font-black text-slate-950 dark:text-white">
                ₹{cartCalculations.finalPayable.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 text-xs font-bold flex items-center justify-between border border-amber-200 dark:border-amber-800/50">
              <span className="flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-amber-500" />
                <span>SmartCoins to earn:</span>
              </span>
              <span>+{cartCalculations.coinsEarned} Coins</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isProcessing}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <span>Confirming Order...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Place Order • ₹{cartCalculations.finalPayable.toLocaleString('en-IN')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
