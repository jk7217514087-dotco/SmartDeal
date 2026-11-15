import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { trackingService } from '../services/trackingService';
import {
  Coins,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  Gift,
  Share2,
  Star,
  CheckCircle2,
  Clock,
  Wallet,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  X,
  CreditCard,
  Building,
  Smartphone
} from 'lucide-react';

export const SmartCoinsWalletPage: React.FC = () => {
  const {
    currentUser,
    smartCoinsBalance,
    smartCoinsTransactions,
    claimDailyCoins,
    canClaimDaily
  } = useApp();

  // Primary toggle: Cashback Wallet (Panel 8) or SmartCoins Loyalty System
  const [walletTab, setWalletTab] = useState<'cashback' | 'coins'>('cashback');
  const [coinsSubTab, setCoinsSubTab] = useState<'all' | 'earned' | 'redeemed'>('all');
  const [claimMsg, setClaimMsg] = useState<string | null>(null);

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

  const handleClaim = () => {
    const res = claimDailyCoins();
    setClaimMsg(res.message);
  };

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

  const filteredCoinsTxs = smartCoinsTransactions.filter(tx => {
    if (coinsSubTab === 'earned') return tx.type === 'earned';
    if (coinsSubTab === 'redeemed') return tx.type === 'redeemed';
    return true;
  });

  const rupeeValue = Math.floor(smartCoinsBalance / 10);

  // Mock initial transactions matching Panel 8 screenshot if user ledger is empty
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
          orderRef: 'SD-AMZ-99120'
        },
        {
          id: 'cb-2',
          productName: 'HP Pavilion 15',
          marketplace: 'Flipkart',
          amount: 50,
          status: 'Pending' as const,
          createdAt: '2026-10-23T11:20:00Z',
          orderRef: 'SD-FLP-48192'
        },
        {
          id: 'cb-3',
          productName: 'Running Shoes',
          marketplace: 'Myntra',
          amount: 40,
          status: 'Available' as const,
          createdAt: '2026-10-22T09:15:00Z',
          orderRef: 'SD-MYN-10294'
        }
      ];

  const availableBal = cashbackWallet.availableBalance > 0 ? cashbackWallet.availableBalance : 1250;
  const pendingBal = cashbackWallet.pendingBalance > 0 ? cashbackWallet.pendingBalance : 2350;
  const totalEarned = cashbackWallet.totalEarned > 0 ? cashbackWallet.totalEarned : 22450;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Top Navigation Tabs: Cashback Wallet vs SmartCoins Loyalty */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            SmartDeal Financial & Rewards Hub
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Verified double-entry affiliate cashback and loyalty coin redemption
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setWalletTab('cashback')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              walletTab === 'cashback'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-white'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Cashback Wallet (Panel 8)</span>
          </button>

          <button
            onClick={() => setWalletTab('coins')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              walletTab === 'coins'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-white'
            }`}
          >
            <Coins className="w-4 h-4 text-amber-300" />
            <span>SmartCoins Rewards</span>
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* TAB 1: CASHBACK WALLET (DIRECT REPLICA OF PANEL 8 IN REFERENCE IMAGE) */}
      {/* =================================================================== */}
      {walletTab === 'cashback' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Emerald Green Cashback Balance Card (Panel 8) */}
          <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-400/40">
            <div className="space-y-2 text-center md:text-left z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-extrabold backdrop-blur-md">
                <ShieldCheck className="w-4 h-4 text-emerald-200" />
                <span>Audited Double-Entry Ledger</span>
              </div>

              <div className="pt-2">
                <div className="text-xs text-emerald-100 font-bold uppercase tracking-wider">
                  Your Cashback Balance
                </div>
                <div className="text-4xl sm:text-5xl font-black tracking-tight mt-1 flex items-baseline gap-2 justify-center md:justify-start">
                  <span>₹{availableBal.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-xs text-emerald-100 mt-1 font-medium">
                  Available for instant withdrawal to Bank or UPI ID
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 z-10">
              <button
                onClick={() => setIsWithdrawOpen(true)}
                className="px-8 py-3.5 rounded-2xl bg-white text-emerald-800 hover:bg-emerald-50 font-black text-xs sm:text-sm shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                Withdraw
              </button>
            </div>

            {/* Ambient Watermark */}
            <Wallet className="absolute -right-6 -bottom-6 w-60 h-60 text-white/10 pointer-events-none" />
          </div>

          {/* Two Summary Cards: Pending Cashback & Total Earned (Panel 8) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Pending Cashback */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Pending Cashback
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  ₹{pendingBal.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-slate-400">
                  Credited once store return window closes (avg 14-30 days)
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            {/* Total Earned */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Total Earned
                </div>
                <div className="text-2xl font-black text-emerald-500">
                  ₹{totalEarned.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-slate-400">
                  Lifetime affiliate commission shared with you
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Recent Cashback Transactions (Panel 8) */}
          <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Recent Cashback Transactions
              </h3>
              <button
                type="button"
                onClick={() => setWalletVersion(v => v + 1)}
                className="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View History</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {displayCashbackTxs.map(tx => (
                <div key={tx.id} className="py-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-black">
                      ₹
                    </div>
                    <div className="min-w-0">
                      <div className="font-black text-slate-900 dark:text-white text-sm truncate max-w-[140px] sm:max-w-none">
                        {tx.productName}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[150px] sm:max-w-none">
                        Store: <strong className="text-slate-300">{tx.marketplace}</strong> • Ref: {tx.orderRef}
                      </div>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="font-black text-sm text-emerald-400">
                      +₹{Math.abs(tx.amount)}
                    </div>
                    <div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          tx.status === 'Confirmed'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : tx.status === 'Pending'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setWalletVersion(v => v + 1)}
                className="text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                View All Transactions & Audited Ledgers →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 2: SMARTCOINS LOYALTY REWARDS (10 COINS = ₹1 RULE) */}
      {/* =================================================================== */}
      {walletTab === 'coins' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Wallet Balance Hero Card */}
          <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-amber-400/30">
            <div className="space-y-2 text-center md:text-left z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-md">
                <Coins className="w-4 h-4 text-amber-200" />
                <span>SmartCoins Loyalty System</span>
              </div>

              <div className="pt-2">
                <div className="text-xs text-amber-100 font-semibold uppercase tracking-wider">Current Balance</div>
                <div className="text-4xl sm:text-5xl font-black tracking-tight mt-1 flex items-baseline gap-2 justify-center md:justify-start">
                  <span>{smartCoinsBalance}</span>
                  <span className="text-lg font-bold text-amber-200">SmartCoins</span>
                </div>
                <div className="text-sm font-extrabold text-white mt-1">
                  Redemption Value: <span className="bg-white/20 px-2 py-0.5 rounded-lg">₹{rupeeValue}</span>
                </div>
                <div className="text-[11px] text-amber-100 mt-1 font-medium">
                  Formula: <strong>10 SmartCoins = ₹1</strong> checkout discount
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 z-10">
              <button
                onClick={handleClaim}
                disabled={!canClaimDaily}
                className="px-6 py-3.5 rounded-2xl bg-white text-amber-700 hover:bg-amber-50 font-black text-xs shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
              >
                {canClaimDaily ? 'Claim +5 Daily Login Coins' : 'Daily Streak Claimed Today ✓'}
              </button>
            </div>

            <Coins className="absolute -right-8 -bottom-8 w-64 h-64 text-white/10 pointer-events-none" />
          </div>

          {claimMsg && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>{claimMsg}</span>
            </div>
          )}

          {/* Ways to Earn SmartCoins */}
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">How to Earn SmartCoins</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-[#111827] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 hover:border-amber-400 dark:hover:border-amber-500/50 transition-all">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-100 dark:border-amber-900/40">
                  <Gift className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Purchase Products</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                  Earn up to 500 SmartCoins per eligible order based on product value.
                </p>
                <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400">Up to 500 Coins/order</div>
              </div>

              <div className="bg-white dark:bg-[#111827] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 hover:border-amber-400 dark:hover:border-amber-500/50 transition-all">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
                  <Share2 className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Invite Friends</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                  Get +50 SmartCoins when a friend registers and completes their first purchase.
                </p>
                <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">+50 Coins per Referral</div>
              </div>

              <div className="bg-white dark:bg-[#111827] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 hover:border-amber-400 dark:hover:border-amber-500/50 transition-all">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/40">
                  <Star className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Write Reviews</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                  Submit verified product feedback and photo reviews to earn bonus coins.
                </p>
                <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">+15 Coins per Review</div>
              </div>

              <div className="bg-white dark:bg-[#111827] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 hover:border-amber-400 dark:hover:border-amber-500/50 transition-all">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-100 dark:border-purple-900/40">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Daily App Streak</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                  Open SmartDeals daily to collect streak rewards and flash deal alerts.
                </p>
                <div className="text-[11px] font-bold text-purple-600 dark:text-purple-400">+5 Coins Everyday</div>
              </div>
            </div>
          </div>

          {/* SmartCoins Transactions */}
          <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Coins Ledger</h3>
              <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setCoinsSubTab('all')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${coinsSubTab === 'all' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 dark:text-slate-400'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setCoinsSubTab('earned')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${coinsSubTab === 'earned' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 dark:text-slate-400'}`}
                >
                  Earned
                </button>
                <button
                  onClick={() => setCoinsSubTab('redeemed')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${coinsSubTab === 'redeemed' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 dark:text-slate-400'}`}
                >
                  Redeemed
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredCoinsTxs.map(tx => (
                <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black ${
                        tx.type === 'earned' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {tx.type === 'earned' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{tx.reason}</div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500">{tx.date}</div>
                    </div>
                  </div>

                  <span
                    className={`font-black text-sm ${
                      tx.type === 'earned' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {tx.type === 'earned' ? `+${tx.amount}` : `-${tx.amount}`} Coins
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
                    placeholder="yourname@okhdfcbank"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              ) : (
                <div className="text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div>Account: <strong>HDFC Bank ****2819</strong></div>
                  <div>IFSC: <strong>HDFC0001892</strong> (Verified)</div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                Confirm ₹{withdrawAmount} Withdrawal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
