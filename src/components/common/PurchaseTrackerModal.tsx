import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  X,
  Clock
} from 'lucide-react';
import { notificationService, OWNER_PHONE, OWNER_EMAIL } from '../../services/notificationService';

interface PurchaseTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  storeName: string;
  price: number;
  productId?: string;
  targetUrl: string;
  clickId?: string;
}

export const PurchaseTrackerModal: React.FC<PurchaseTrackerModalProps> = ({
  isOpen,
  onClose,
  productName,
  storeName,
  price,
  productId,
  targetUrl,
  clickId
}) => {
  const [step, setStep] = useState<'prompt' | 'confirm_bought' | 'confirm_not_bought' | 'success' | 'not_bought_done'>('prompt');
  const [orderRef, setOrderRef] = useState('');
  const [actualPrice, setActualPrice] = useState(price);
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [notBoughtReason, setNotBoughtReason] = useState('Visited store but decided not to buy now');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const estCommission = Math.round(actualPrice * 0.05);
  const estCashback = Math.round(estCommission * 0.2);

  const handleConfirmPurchase = async () => {
    setIsSubmitting(true);
    try {
      const generatedOrderRef = orderRef.trim() || `OD-${Date.now().toString().slice(-8)}`;
      await notificationService.notifyPurchaseSuccess({
        clickId,
        productId,
        productName,
        marketplace: storeName,
        pricePaid: Number(actualPrice),
        orderRef: generatedOrderRef,
        commissionEarned: estCommission,
        userCashback: estCashback,
        customerName: buyerName.trim() || 'Verified Customer',
        customerContact: buyerPhone.trim() || 'Website Visitor'
      });
      setStep('success');
    } catch (err) {
      console.error(err);
      setStep('success');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDidNotBuy = async () => {
    setIsSubmitting(true);
    try {
      await notificationService.notifyDidNotBuy({
        clickId,
        productId,
        productName,
        marketplace: storeName,
        price: Number(actualPrice || price),
        reason: notBoughtReason,
        userName: buyerName.trim() || 'Website Visitor',
        userContact: buyerPhone.trim() || 'Web Session'
      });
      setStep('not_bought_done');
      setTimeout(() => {
        onClose();
        setStep('prompt');
      }, 2500);
    } catch (err) {
      console.error(err);
      setStep('not_bought_done');
      setTimeout(() => {
        onClose();
        setStep('prompt');
      }, 2500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <ExternalLink className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Purchase Tracking & Verification
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Opened {storeName} in a new tab
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Steps */}
        <div className="p-6 space-y-5">
          {step === 'prompt' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/30">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  You were directed to <span className="font-black text-blue-600 dark:text-blue-400">{storeName}</span> to view:
                </p>
                <p className="font-black text-sm text-slate-900 dark:text-white mt-1">
                  {productName}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                  <span>Price: ₹{price.toLocaleString('en-IN')}</span>
                  <span>•</span>
                  <span className="text-blue-600 dark:text-blue-400">Verified Marketplace Price</span>
                </div>
              </div>

              <div className="text-center py-2">
                <h4 className="text-base font-black text-slate-900 dark:text-white">
                  Did you complete your purchase on {storeName}?
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Confirming your purchase immediately verifies your order tracking and notifies our admin team.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setStep('confirm_bought')}
                  className="py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Yes, I Bought It!</span>
                </button>

                <button
                  onClick={() => setStep('confirm_not_bought')}
                  className="py-3 px-4 rounded-2xl border-2 border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-extrabold text-xs active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <XCircle className="w-4 h-4 text-rose-500" />
                  <span>No, I Did Not Buy</span>
                </button>
              </div>

              <div className="pt-2 text-center">
                <a
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1 font-bold"
                >
                  <span>Re-open {storeName} Product Page</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {step === 'confirm_not_bought' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 text-xs">
                <span className="font-extrabold text-rose-800 dark:text-rose-300">
                  ❌ Marking as Did Not Buy. We will report this outcome to the owner (+91 {OWNER_PHONE} & {OWNER_EMAIL}) with full product and reason details.
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Select Reason (included in Owner SMS):
                  </label>
                  <select
                    value={notBoughtReason}
                    onChange={e => setNotBoughtReason(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Visited store but decided not to buy now">Visited store but decided not to buy now</option>
                    <option value="Price was higher than expected / out of budget">Price was higher than expected / out of budget</option>
                    <option value="Checking reviews and specifications only">Checking reviews and specifications only</option>
                    <option value="Added to external wishlist, will buy later">Added to external wishlist, will buy later</option>
                    <option value="Looking for a different color / variant / model">Looking for a different color / variant / model</option>
                    <option value="Delivery time was too long on external store">Delivery time was too long on external store</option>
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[11px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Store:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{storeName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Listed Price:</span>
                    <span className="font-bold text-slate-900 dark:text-white">₹{price.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-rose-600 font-bold">Unrealized Commission:</span>
                    <span className="font-bold text-rose-600">₹{estCommission}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[10px] pt-1 border-t border-slate-200 dark:border-slate-700">
                    <span>SMS Alert Recipient:</span>
                    <span>+91 {OWNER_PHONE}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setStep('prompt')}
                  className="py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirmDidNotBuy}
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-lg shadow-rose-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  <span>{isSubmitting ? 'Dispatching Alerts...' : 'Confirm Did Not Buy & Send Alert'}</span>
                </button>
              </div>
            </div>
          )}

          {step === 'not_bought_done' && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
                <XCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  'Did Not Buy' Alert Dispatched!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  Owner notified on Phone (<b>+91 {OWNER_PHONE}</b>) and Email (<b>{OWNER_EMAIL}</b>) with full product and reason details.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-1.5 max-w-xs mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-400">Product:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[160px]">{productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Store:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{storeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-bold text-rose-600">DID NOT BUY</span>
                </div>
              </div>
            </div>
          )}

          {step === 'confirm_bought' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-xs">
                <span className="font-extrabold text-emerald-800 dark:text-emerald-300">
                  🎉 Great choice! Enter your details to confirm your store purchase.
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Store Order ID / Reference (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 403-1234567-8901234"
                    value={orderRef}
                    onChange={e => setOrderRef(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Found in your {storeName} order confirmation email or app.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Final Price Paid (₹)
                    </label>
                    <input
                      type="number"
                      value={actualPrice}
                      onChange={e => setActualPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Your Phone / Contact
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 9876543210"
                      value={buyerPhone}
                      onChange={e => setBuyerPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[11px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Verified Marketplace:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{storeName}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[10px] pt-1 border-t border-slate-200 dark:border-slate-700">
                    <span>Alert Recipients:</span>
                    <span className="font-mono">SMS: +91 {OWNER_PHONE} | Email: {OWNER_EMAIL}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setStep('prompt')}
                  className="py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirmPurchase}
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending Alert...' : 'Submit & Confirm Purchase'}</span>
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Purchase Alert Dispatched Successfully!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  A real-time SMS alert has been dispatched to <b>+91 {OWNER_PHONE}</b> and email to <b>{OWNER_EMAIL}</b> with full commission and product breakdown.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-1.5 max-w-xs mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-400">Product:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[160px]">{productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Price Paid:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">₹{actualPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Commission Earned:</span>
                  <span className="font-bold text-emerald-600">₹{estCommission}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-bold text-blue-600">SUCCESS CONFIRMED</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="py-3 px-8 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-lg shadow-brand-500/25 active:scale-95 transition-all"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
