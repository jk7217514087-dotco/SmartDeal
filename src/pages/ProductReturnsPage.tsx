import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Package,
  Send,
  PhoneCall,
  Search,
  Info
} from 'lucide-react';
import { notificationService, ReturnRequestItem, OWNER_PHONE, OWNER_EMAIL } from '../services/notificationService';

export const ProductReturnsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const prefillProduct = searchParams.get('product') || '';
  const prefillStore = searchParams.get('store') || '';
  const prefillPrice = searchParams.get('price') || '';

  const [activeTab, setActiveTab] = useState<'request' | 'track' | 'policies'>('request');

  // Form State
  const [productName, setProductName] = useState(prefillProduct);
  const [marketplace, setMarketplace] = useState(prefillStore || 'Amazon India');
  const [orderRef, setOrderRef] = useState('');
  const [saleAmount, setSaleAmount] = useState(prefillPrice || '');
  const [reason, setReason] = useState('Defective / Damaged Item Received');
  const [customReason, setCustomReason] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [refundMode, setRefundMode] = useState<'UPI' | 'Original Payment' | 'Bank Transfer'>('UPI');
  const [refundDetails, setRefundDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReturn, setSubmittedReturn] = useState<ReturnRequestItem | null>(null);

  // Tracking tab search
  const [searchQuery, setSearchQuery] = useState('');
  const [returnsList, setReturnsList] = useState<ReturnRequestItem[]>(() => notificationService.getReturnRequests());

  useEffect(() => {
    const unsub = notificationService.subscribe(() => {
      setReturnsList(notificationService.getReturnRequests());
    });
    return unsub;
  }, []);

  const handleSubmitReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !orderRef.trim()) {
      alert('Please provide Product Name and Order Reference ID.');
      return;
    }

    setIsSubmitting(true);
    try {
      const finalReason = customReason.trim() ? `${reason}: ${customReason}` : reason;
      const result = await notificationService.submitReturnRequest({
        orderRef: orderRef.trim(),
        productName: productName.trim(),
        marketplace,
        saleAmount: Number(saleAmount || 0),
        reason: finalReason,
        customerName: customerName.trim() || 'Valued Customer',
        customerPhone: customerPhone.trim() || '7217514087',
        customerEmail: customerEmail.trim() || 'jk7217514087@gmail.com',
        refundMode,
        refundAccountDetails: refundDetails.trim() || 'user@upi'
      });

      setSubmittedReturn(result);
      setActiveTab('track');
    } catch (err) {
      console.error(err);
      alert('Could not submit return request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredReturns = returnsList.filter(r =>
    r.orderRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] py-8 sm:py-12 transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 text-white p-6 sm:p-10 shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold border border-white/20">
              <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
              <span>SmartDeal Hassle-Free Returns & Warranty</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Product Return & Refund Assistance
            </h1>
            <p className="text-sm text-blue-100 font-medium">
              Bought a product from Amazon, Flipkart, Croma or partner stores through SmartDeal? We assist with guaranteed returns, courier pickups, and instant commission & cashback adjustments.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold pt-2 text-blue-100">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 7-14 Day Store Guarantee
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Free Return Support
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <PhoneCall className="w-4 h-4 text-amber-300" /> Direct Admin SMS: +91 {OWNER_PHONE}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-200/70 dark:bg-slate-800/80 border border-slate-300/60 dark:border-slate-700 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('request')}
            className={`flex-1 py-2.5 px-4 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'request'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Request Return</span>
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`flex-1 py-2.5 px-4 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'track'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Track Returns ({returnsList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('policies')}
            className={`flex-1 py-2.5 px-4 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'policies'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Store Policies</span>
          </button>
        </div>

        {/* TAB 1: SUBMIT RETURN REQUEST */}
        {activeTab === 'request' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800 space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Initiate Product Return or Replacement
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Fill out the details below. Our support team and the store owner will receive an instant SMS on <b>+91 {OWNER_PHONE}</b> and Email to coordinate your return.
              </p>
            </div>

            <form onSubmit={handleSubmitReturn} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. boAt Airdopes 141 or Samsung Galaxy M14"
                    value={productName}
                    onChange={e => setProductName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Purchased From Store *
                  </label>
                  <select
                    value={marketplace}
                    onChange={e => setMarketplace(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
                  >
                    <option value="Amazon India">Amazon India</option>
                    <option value="Flipkart">Flipkart</option>
                    <option value="Croma">Croma</option>
                    <option value="Reliance Digital">Reliance Digital</option>
                    <option value="Myntra">Myntra</option>
                    <option value="Ajio">Ajio</option>
                    <option value="Other Official Store">Other Official Store</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Store Order ID / Invoice Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 403-9182371-2918291 or OD3098172901"
                    value={orderRef}
                    onChange={e => setOrderRef(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Found in your Amazon/Flipkart app order history</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Order Price Paid (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 1299"
                    value={saleAmount}
                    onChange={e => setSaleAmount(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Reason for Return / Replacement *
                </label>
                <select
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
                >
                  <option value="Defective / Damaged Item Received">Defective / Damaged Item Received</option>
                  <option value="Received Wrong Item / Color / Model">Received Wrong Item / Color / Model</option>
                  <option value="Performance or Quality Issue">Performance or Quality Issue</option>
                  <option value="Better Price Found Elsewhere">Better Price Found Elsewhere</option>
                  <option value="Product Missing Parts / Accessories">Product Missing Parts / Accessories</option>
                  <option value="Delayed Delivery / No Longer Needed">Delayed Delivery / No Longer Needed</option>
                  <option value="Other Reason">Other Reason</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Detailed Description (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe the issue you experienced with the product..."
                  value={customReason}
                  onChange={e => setCustomReason(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Customer Contact Details */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3">
                <h3 className="font-extrabold text-xs text-slate-900 dark:text-white">
                  Your Contact & Refund Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Jitendra Kumar"
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Phone Number (For Pickup SMS)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 7217514087"
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. jk7217514087@gmail.com"
                      value={customerEmail}
                      onChange={e => setCustomerEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Preferred Refund Mode
                    </label>
                    <select
                      value={refundMode}
                      onChange={e => setRefundMode(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                    >
                      <option value="UPI">UPI ID (Instant Transfer)</option>
                      <option value="Original Payment">Original Payment Mode (Store Refund)</option>
                      <option value="Bank Transfer">Bank Account (NEFT/IMPS)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      UPI ID / Account Details
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 7217514087@paytm or name@okhdfcbank"
                      value={refundDetails}
                      onChange={e => setRefundDetails(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Instant Alert Notice */}
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 flex items-start gap-3 text-xs text-amber-800 dark:text-amber-300">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-extrabold">Instant Notification Dispatched Upon Submission</p>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">
                    Upon clicking Submit, an urgent alert is sent immediately to the store owner's mobile <b>+91 {OWNER_PHONE}</b> and email <b>{OWNER_EMAIL}</b>. Your return ticket will be registered instantly.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting & Dispatching Alert...' : 'Submit Return Request & Alert Owner'}</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: TRACK RETURN STATUS */}
        {activeTab === 'track' && (
          <div className="space-y-6">
            {/* Search filter */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search return by Ticket ID (e.g. RET-8941), Order ID, or Product name..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full text-xs font-semibold bg-transparent text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            {submittedReturn && (
              <div className="p-5 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-2 animate-fade-in">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-black text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Return Request #{submittedReturn.id} Registered Successfully!</span>
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  SMS alert sent to <b>+91 {OWNER_PHONE}</b> and Email to <b>{OWNER_EMAIL}</b>. Our team will verify the return with {submittedReturn.marketplace} within 2-4 business hours.
                </p>
              </div>
            )}

            {filteredReturns.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="font-black text-slate-900 dark:text-white text-sm">No return requests found</h3>
                <p className="text-xs text-slate-500 mt-1">Submit a return request to track its pickup and refund status here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReturns.map(ret => (
                  <div
                    key={ret.id}
                    className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-md space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-slate-900 dark:text-white">
                            Ticket #{ret.id}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                            Order: {ret.orderRef}
                          </span>
                        </div>
                        <p className="font-extrabold text-sm text-slate-800 dark:text-slate-200 mt-1">
                          {ret.productName}
                        </p>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                        ret.status === 'REFUNDED'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : ret.status === 'PICKUP_SCHEDULED'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {ret.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Store:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{ret.marketplace}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Refund Amount:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {ret.saleAmount ? `₹${ret.saleAmount.toLocaleString('en-IN')}` : 'Full Order Value'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Customer:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{ret.customerName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Refund Mode:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{ret.refundMode}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
                      <span className="font-bold text-slate-500">Reason: </span>
                      <span className="text-slate-700 dark:text-slate-300">{ret.reason}</span>
                    </div>

                    {/* Timeline visualization */}
                    <div className="space-y-2 pt-1">
                      <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                        Live Tracking Timeline
                      </p>
                      <div className="space-y-2">
                        {ret.timeline.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                            <div>
                              <p className="font-bold text-slate-800 dark:text-slate-200">{step.label}</p>
                              {step.notes && <p className="text-[11px] text-slate-500">{step.notes}</p>}
                              <p className="text-[10px] text-slate-400">{new Date(step.timestamp).toLocaleString('en-IN')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: STORE POLICIES & WINDOWS */}
        {activeTab === 'policies' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📦</span>
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-white">Amazon India Return Policy</h3>
                  <p className="text-xs text-slate-500">7 Days Replacement & Refund</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Electronics and mobile phones are eligible for free 7-day replacement or technician verification if defective. Fashion products have a 10-30 day hassle-free return window with doorstep courier pickup.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🛍️</span>
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-white">Flipkart Return Policy</h3>
                  <p className="text-xs text-slate-500">7 to 10 Days Hassle-Free Returns</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Flipkart offers standard 7-day replacement for electronic accessories and smart devices, and 10 days for lifestyle and home appliances. Free return pickup directly at your doorstep.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏬</span>
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-white">Croma & Reliance Digital</h3>
                  <p className="text-xs text-slate-500">15 Days In-Store & Online Exchange</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Croma and Reliance Digital allow replacement or repair under brand warranty. Defective appliances are inspected by certified technicians with 100% manufacturer backing.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-white">SmartDeal Instant Cashbacks</h3>
                  <p className="text-xs text-slate-500">Automatic Ledger Adjustments</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                If a product is returned and refunded by the marketplace, any pending cashback is adjusted safely in accordance with Section 12 double-entry accounting rules without affecting other confirmed earnings.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
