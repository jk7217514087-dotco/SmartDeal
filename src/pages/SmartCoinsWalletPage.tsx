import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { trackingService } from '../services/trackingService';
import {
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Clock,
  Wallet,
  ShieldCheck,
  TrendingUp,
  X,
  CreditCard,
  Building,
  Smartphone
} from 'lucide-react';

export const SmartCoinsWalletPage: React.FC = () => {
  const { currentUser } = useApp();

  // Withdrawal Modal State
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('500');
  const [withdrawMethod, setWithdrawMethod] = useState<'UPI' | 'Bank'>('UPI');
  const [upiId, setUpiId] = useState('user@okaxis');
  const [withdrawStatus, setWithdrawStatus] = useState<string | null>(null);

  // Live Cashback Wallet from trackingService
  const userId = currentUser?.id || 'U10025';
  const [walletVersion, setWalletVersion] = useState(0);
  const cashbackWallet = useMemo(() => {
    return trackingService.getCashbackWallet(userId);
  }, [userId, walletVersion]);

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0) {
      setWithdrawStatus('Please enter a valid withdrawal amount.');
      return;
    }
    const res = trackingService.redeemCashback(
      userId,
      amt,
      withdrawMethod,
      withdrawMethod === 'UPI' ? upiId : 'HDFC Bank - 5010049281729'
    );
    if (res.success) {
      setWithdrawStatus(res.message);
      setWalletVersion(v => v + 1);
      setTimeout(() => {
        setIsWithdrawOpen(false);
        setWithdrawStatus(null);
      }, 2000);
    } else {
      setWithdrawStatus(res.message);
    }
  };

  // Mock initial transactions if user ledger is empty
  const displayCashbackTxs = cashbackWallet.transactions.length > 0
    ? cashbackWallet.transactions
    : [
        {
          id: 'cb-1',
          productName: 'iPhone 15 (128GB)',
          marketplace: 'Amazon',
          amount: 120,
          status: 'Confirmed' as const,
          createdAt: '2026-10-24T14:30:00Z',
          details: 'Direct affiliate tracking verified'
        },
        {
          id: 'cb-2',
          productName: 'boAt Airdopes 141',
          marketplace: 'Flipkart',
          amount: 45,
          status: 'Confirmed' as const,
          createdAt: '2026-10-20T10:15:00Z',
          details: 'Store invoice matched'
        }
      ];

  const availableBal = cashbackWallet.availableBalance;
  const pendingBal = cashbackWallet.pendingBalance;
  const lifetimeBal = cashbackWallet.totalEarned;
  const withdrawnBal = cashbackWallet.totalRedeemed;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Wallet className="w-7 h-7 text-emerald-500" />
            <span>Cashback Wallet & Rewards Ledger</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real cash earnings on every verified purchase with instant UPI & Bank payouts
          </p>
        </div>

        <button
          onClick={() => setIsWithdrawOpen(true)}
          disabled={availableBal <= 0}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-40 text-white font-black text-xs shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all cursor-pointer active:scale-95"
        >
          <CreditCard className="w-4 h-4" />
          <span>Withdraw to UPI / Bank</span>
        </button>
      </div>

      {/* Main Cashback Balance Card */}
      <div className="space-y-6">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-400/40">
          <div className="space-y-2 text-center md:text-left z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-extrabold backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-emerald-200" />
              <span>Audited Double-Entry Ledger</span>
            </div>

            <div className="pt-2">
              <div className="text-xs text-emerald-100 font-bold uppercase tracking-wider">
                Available to Withdraw
              </div>
              <div className="text-4xl sm:text-5xl font-black tracking-tight mt-1">
                ₹{availableBal.toLocaleString('en-IN')}
              </div>
            </div>

            <p className="text-xs text-emerald-100/90 max-w-md pt-1">
              Confirmed cashback funds ready for instant transfer to your bank account or UPI ID.
            </p>
          </div>

          <div className="z-10 flex flex-col gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsWithdrawOpen(true)}
              disabled={availableBal <= 0}
              className="px-6 py-3.5 rounded-2xl bg-white text-emerald-800 hover:bg-emerald-50 disabled:opacity-50 font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>Withdraw to UPI / Bank</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Available</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
              ₹{availableBal.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-slate-500">Ready to withdraw</div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pending</div>
            <div className="text-xl sm:text-2xl font-black text-amber-500">
              ₹{pendingBal.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-slate-500">In 7-day return window</div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Lifetime Earned</div>
            <div className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400">
              ₹{lifetimeBal.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-slate-500">Total verified savings</div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Withdrawn</div>
            <div className="text-xl sm:text-2xl font-black text-slate-700 dark:text-slate-300">
              ₹{withdrawnBal.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-slate-500">Paid out to bank</div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              <span>Cashback History & Ledger</span>
            </h2>
            <span className="text-xs text-slate-400 font-bold">
              {displayCashbackTxs.length} Transactions
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {displayCashbackTxs.map(tx => (
              <div key={tx.id} className="py-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                    tx.status === 'Confirmed'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                      : tx.status === 'Pending'
                      ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                      : 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400'
                  }`}>
                    {tx.status === 'Redeemed' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownLeft className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-xs">
                      {tx.productName}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {tx.marketplace ? `${tx.marketplace} • ` : ''}{new Date(tx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`font-black text-sm ${
                    tx.status === 'Confirmed'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : tx.status === 'Pending'
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-purple-600 dark:text-purple-400'
                  }`}>
                    {tx.status === 'Redeemed' ? `-₹${tx.amount}` : `+₹${tx.amount}`}
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    tx.status === 'Confirmed'
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                      : tx.status === 'Pending'
                      ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
                      : 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300'
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WITHDRAWAL MODAL */}
      {isWithdrawOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-[#0D1527] border border-emerald-500/30 rounded-3xl p-6 shadow-2xl text-white space-y-5 relative">
            <button
              onClick={() => setIsWithdrawOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Withdraw Cashback</h3>
                <div className="text-xs text-slate-400">Available: ₹{availableBal.toLocaleString('en-IN')}</div>
              </div>
            </div>

            {withdrawStatus && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                {withdrawStatus}
              </div>
            )}

            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Withdrawal Amount (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  max={availableBal}
                  value={withdrawAmount}
                  onChange={e => setWithdrawAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Payout Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setWithdrawMethod('UPI')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      withdrawMethod === 'UPI'
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-900 border-slate-700 text-slate-400'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Instant UPI</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setWithdrawMethod('Bank')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      withdrawMethod === 'Bank'
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-900 border-slate-700 text-slate-400'
                    }`}
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span>Bank NEFT</span>
                  </button>
                </div>
              </div>

              {withdrawMethod === 'UPI' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    UPI ID (VPA)
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    placeholder="yourname@okaxis"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Bank Account Number</label>
                    <input
                      type="text"
                      defaultValue="5010049281729"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">IFSC Code</label>
                    <input
                      type="text"
                      defaultValue="HDFC0001234"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono uppercase"
                      required
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer active:scale-95"
              >
                Submit Withdrawal Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
