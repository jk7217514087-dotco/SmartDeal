import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Address, CashbackStatus } from '../types';
import {
  User,
  MapPin,
  ShoppingBag,
  Heart,
  LogOut,
  Bell,
  Store,
  ShieldAlert,
  CheckCircle2,
  Trash2,
  Plus,
  X,
  Activity,
  Radio,
  ExternalLink,
  ShieldCheck,
  Download,
  RefreshCw,
  KeyRound,
  Lock,
  AlertCircle,
  FileSpreadsheet,
  Sparkles,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { trackingService, hashPassword } from '../services/trackingService';

type ProfileTab = 'profile' | 'cashback' | 'timeline' | 'outbound' | 'privacy' | 'security';

export const UserProfilePage: React.FC = () => {
  const {
    orders,
    wishlist,
    priceAlerts,
    currentUser,
    guestSession,
    cashbackWallet,
    redeemCashback,
    processReturnReversal,
    refreshCashback,
    logoutUser
  } = useApp();

  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<ProfileTab>('profile');
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
    }
  }, [currentUser]);

  // Cashback filter & modal state
  const [cashbackFilter, setCashbackFilter] = useState<'All' | 'Available' | 'Pending' | 'Confirmed' | 'Redeemed' | 'Reversed'>('All');
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const [redeemAmount, setRedeemAmount] = useState<number>(100);
  const [redeemMethod, setRedeemMethod] = useState<'UPI' | 'Bank Transfer'>('UPI');
  const [redeemAccount, setRedeemAccount] = useState('rohit.kumar@okaxis');
  const [redeemMessage, setRedeemMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Security state
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [pwdMessage, setPwdMessage] = useState<string | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Privacy state
  const [dataConsent, setDataConsent] = useState(true);
  const [personalizationConsent, setPersonalizationConsent] = useState(true);

  // Detect route subpaths
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/cashback') || path.includes('/transactions')) {
      setActiveTab('cashback');
    } else if (path.includes('/privacy')) {
      setActiveTab('privacy');
    } else if (path.includes('/security')) {
      setActiveTab('security');
    } else if (path.includes('/search-history') || path.includes('/recently-viewed') || path.includes('/comparisons')) {
      setActiveTab('timeline');
    } else if (path.includes('/profile')) {
      setActiveTab('profile');
    }
  }, [location.pathname]);

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 'addr-1',
      fullName: 'Rohit Kumar',
      street: '123, Green Park, Near Metro Station',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110016',
      phone: '+91 98765 43210',
      isDefault: true
    },
    {
      id: 'addr-2',
      fullName: 'Rohit Kumar (Office)',
      street: 'Tower B, Level 8, DLF Cyber City',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122002',
      phone: '+91 98765 43210',
      isDefault: false
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAddr, setNewAddr] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    isDefault: false
  });

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.fullName || !newAddr.street || !newAddr.pincode) return;

    const created: Address = {
      id: `addr-${Date.now()}`,
      fullName: newAddr.fullName,
      street: newAddr.street,
      city: newAddr.city || 'New Delhi',
      state: newAddr.state || 'Delhi',
      pincode: newAddr.pincode,
      phone: newAddr.phone || phone,
      isDefault: newAddr.isDefault || addresses.length === 0
    };

    if (created.isDefault) {
      setAddresses(prev => prev.map(a => ({ ...a, isDefault: false })).concat(created));
    } else {
      setAddresses(prev => [...prev, created]);
    }

    setNewAddr({
      fullName: '',
      street: '',
      city: '',
      state: '',
      pincode: '',
      phone: '',
      isDefault: false
    });
    setIsAddModalOpen(false);
  };

  const handleSetDefault = (id: string) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleRedeemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRedeemMessage(null);
    const res = redeemCashback(redeemAmount, redeemMethod, redeemAccount);
    if (res.success) {
      setRedeemMessage({ type: 'success', text: res.message });
      setTimeout(() => {
        setIsRedeemModalOpen(false);
        setRedeemMessage(null);
      }, 2000);
    } else {
      setRedeemMessage({ type: 'error', text: res.message });
    }
  };

  const handleSimulateReturnReversal = () => {
    // Find an eligible order to reverse (e.g. 171-1234567-890123)
    const res = processReturnReversal(
      '171-1234567-890123',
      'Customer returned item to Amazon within 7-day return policy. Partner commission reversed.'
    );
    alert(res.message);
  };

  const handleExportCashbackCSV = () => {
    const csv = trackingService.exportCSV('cashback');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartdeal_cashback_ledger_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPersonalData = () => {
    const data = {
      profile: { name, email, phone },
      addresses,
      cashbackWallet,
      outboundClicks: trackingService.getOutboundClicks().filter(c => c.actorId === (currentUser?.id || 'U10025')),
      activityLogs: trackingService.getUserActivityTimeline(currentUser?.id || 'U10025'),
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartdeal_personal_data_${currentUser?.id || 'U10025'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMessage(null);
    if (newPwd.length < 6) {
      setPwdMessage('New password must be at least 6 characters.');
      return;
    }
    const users = trackingService.getUsers();
    const u = users.find(usr => usr.id === currentUser?.id || usr.email === email);
    if (u) {
      u.passwordHash = await hashPassword(newPwd);
      localStorage.setItem('smartdeal_tracked_users_v2', JSON.stringify(users));
      setPwdMessage('Password successfully updated with SHA-256 encryption!');
      setCurrentPwd('');
      setNewPwd('');
    }
  };

  // Filter cashback transactions
  const filteredCashbackTransactions = cashbackWallet.transactions.filter(t => {
    if (cashbackFilter === 'All') return true;
    return t.status.toLowerCase() === cashbackFilter.toLowerCase();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Welcome Card */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 sm:p-8 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-brand-600/30 border border-brand-400/40 text-brand-300 flex items-center justify-center font-black text-2xl shadow-inner">
            {name.charAt(0)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">{name}</h1>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                VERIFIED SHOPPER
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">{email} • {phone}</p>
            <p className="text-[11px] text-slate-400 font-mono">
              Account ID: {currentUser ? currentUser.id : `Guest: ${guestSession.sessionId}`}
            </p>
          </div>
        </div>

        {/* Quick Balance & Auth Actions */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Cashback Wallet Widget */}
          <div className="flex items-center gap-3 bg-white/10 p-3.5 rounded-2xl border border-white/20 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-lg">
              ₹
            </div>
            <div>
              <div className="text-[10px] text-emerald-200 font-bold uppercase tracking-wider">Available Cashback</div>
              <div className="text-lg font-black text-white">₹{cashbackWallet.availableBalance.toLocaleString('en-IN')}</div>
              <div className="text-[10px] text-slate-300">Pending: ₹{cashbackWallet.pendingBalance.toLocaleString('en-IN')}</div>
            </div>
          </div>

          {/* Quick Sign Out / Sign In Button */}
          {currentUser ? (
            <button
              onClick={async () => {
                await logoutUser();
                navigate('/login');
              }}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-rose-600/80 hover:bg-rose-600 text-white font-bold text-xs transition-all border border-rose-400/40 shadow-lg shadow-rose-600/20 cursor-pointer active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition-all shadow-lg shadow-brand-600/30 cursor-pointer active:scale-95"
            >
              <User className="w-4 h-4" />
              <span>Sign In / Register</span>
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-1 text-xs font-bold text-slate-700 dark:text-slate-300">
          <div className="p-2 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Account Management
          </div>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300'
                : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <User className="w-4 h-4 text-brand-500" />
            <span>Personal Profile & Addresses</span>
          </button>

          <button
            onClick={() => setActiveTab('cashback')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'cashback'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>Cashback Wallet & Ledger</span>
            </div>
            <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full text-[10px]">
              ₹{cashbackWallet.availableBalance}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'timeline'
                ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300'
                : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Activity className="w-4 h-4 text-indigo-500" />
            <span>Search & View History</span>
          </button>

          <button
            onClick={() => setActiveTab('outbound')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'outbound'
                ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300'
                : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <ExternalLink className="w-4 h-4 text-emerald-500" />
            <span>Outbound Store Visits</span>
          </button>

          <Link to="/wishlist" className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <div className="flex items-center gap-2.5">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Saved Wishlist</span>
            </div>
            <span className="bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 px-2 py-0.5 rounded-full text-[10px]">{wishlist.length}</span>
          </Link>

          <Link to="/price-tracker" className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-amber-500" />
              <span>Price Drop Alerts</span>
            </div>
            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full text-[10px]">{priceAlerts.length}</span>
          </Link>

          <div className="pt-2 my-2 border-t border-slate-100 dark:border-slate-800" />

          <div className="p-2 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Privacy & Security
          </div>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300'
                : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-cyan-500" />
            <span>Privacy & Tracking Controls</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300'
                : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <KeyRound className="w-4 h-4 text-amber-500" />
            <span>Security & 2FA Settings</span>
          </button>

          <button
            onClick={() => window.dispatchEvent(new CustomEvent('trigger-app-install'))}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Download className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Download SmartDeal App</span>
            </div>
            <span className="text-[10px] bg-indigo-200/80 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 px-1.5 py-0.5 rounded font-black">
              APK
            </span>
          </button>

          <div className="pt-2 my-2 border-t border-slate-100 dark:border-slate-800" />

          {currentUser ? (
            <button
              onClick={async () => {
                await logoutUser();
                navigate('/login');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer font-bold"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span>Sign Out from All Devices</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/40 transition-colors cursor-pointer font-bold"
            >
              <User className="w-4 h-4 text-brand-500" />
              <span>Sign In to Account</span>
            </Link>
          )}
        </div>

        {/* Tab Content (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <>
              <form onSubmit={handleSaveProfile} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Personal Details</h3>
                  {isSaved && (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Profile Updated!</span>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Preferred Currency</label>
                    <select className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-brand-500">
                      <option>INR (₹) - Indian Rupee</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-brand-600 dark:hover:bg-brand-500 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
                >
                  Save Profile
                </button>
              </form>

              {/* Saved Addresses */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                    <span>Saved Delivery Addresses ({addresses.length})</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map(addr => (
                    <div
                      key={addr.id}
                      className={`p-4 rounded-2xl border text-xs space-y-2 transition-all ${
                        addr.isDefault
                          ? 'bg-brand-50/40 dark:bg-brand-950/30 border-brand-300 dark:border-brand-700'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <span>{addr.fullName}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-extrabold px-2 py-0.5 rounded-md">
                              DEFAULT
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {!addr.isDefault && (
                            <button
                              type="button"
                              onClick={() => handleSetDefault(addr.id)}
                              className="text-[10px] text-brand-600 dark:text-brand-400 hover:underline font-bold cursor-pointer"
                            >
                              Set Default
                            </button>
                          )}
                          {addresses.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                              title="Delete Address"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        {addr.street}<br />
                        {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                      </div>
                      <div className="text-slate-500 dark:text-slate-400 font-medium">Phone: {addr.phone}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* TAB 2: CASHBACK WALLET & REVERSIBLE LEDGER (Section 11, 12, 13) */}
          {activeTab === 'cashback' && (
            <div className="space-y-6">
              {/* Balance Summary KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                  <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Available</div>
                  <div className="text-xl font-black text-emerald-700 dark:text-emerald-300">₹{cashbackWallet.availableBalance}</div>
                  <div className="text-[10px] text-emerald-600/70">Ready to withdraw</div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                  <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Pending</div>
                  <div className="text-xl font-black text-amber-700 dark:text-amber-300">₹{cashbackWallet.pendingBalance}</div>
                  <div className="text-[10px] text-amber-600/70">In return window</div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-1">
                  <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Total Earned</div>
                  <div className="text-xl font-black text-blue-700 dark:text-blue-300">₹{cashbackWallet.totalEarned}</div>
                  <div className="text-[10px] text-blue-600/70">Lifetime confirmed</div>
                </div>

                <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-1">
                  <div className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Redeemed</div>
                  <div className="text-xl font-black text-purple-700 dark:text-purple-300">₹{cashbackWallet.totalRedeemed}</div>
                  <div className="text-[10px] text-purple-600/70">Paid out to UPI/Bank</div>
                </div>

                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-1 col-span-2 sm:col-span-1">
                  <div className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Reversed</div>
                  <div className="text-xl font-black text-rose-700 dark:text-rose-300">₹{cashbackWallet.totalReversed}</div>
                  <div className="text-[10px] text-rose-600/70">Customer returns</div>
                </div>
              </div>

              {/* Action Buttons & Simulation Tools */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setIsRedeemModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>Withdraw Cashback</span>
                  </button>

                  <button
                    onClick={handleExportCashbackCSV}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export CSV</span>
                  </button>
                </div>

                {/* Return Reversal Test Button */}
                <button
                  onClick={handleSimulateReturnReversal}
                  className="px-3.5 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold text-xs hover:bg-rose-100 transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Test Section 12 return reversal business rule"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Simulate Marketplace Return (Reversal Test)</span>
                </button>
              </div>

              {/* Transactions Ledger Table */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Complete Cashback Ledger</h3>
                    <p className="text-xs text-slate-400">Append-only financial records with reversal audit trail</p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                    {(['All', 'Available', 'Pending', 'Confirmed', 'Redeemed', 'Reversed'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setCashbackFilter(tab)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          cashbackFilter === tab
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                        <th className="pb-3">Transaction / Order</th>
                        <th className="pb-3">Product / Store</th>
                        <th className="pb-3 text-right">Amount</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredCashbackTransactions.map(tx => (
                        <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 font-mono font-bold text-slate-900 dark:text-white">
                            <div>{tx.id}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{tx.orderRef}</div>
                          </td>
                          <td className="py-3">
                            <div className="font-bold text-slate-800 dark:text-slate-200">{tx.productName}</div>
                            <div className="text-[10px] text-slate-400">{tx.marketplace}</div>
                            {tx.reversalReason && (
                              <div className="text-[10px] text-rose-500 font-semibold mt-0.5">
                                Reversal: {tx.reversalReason}
                              </div>
                            )}
                          </td>
                          <td className="py-3 text-right font-black">
                            <span className={tx.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                              {tx.amount > 0 ? `+₹${tx.amount}` : `-₹${Math.abs(tx.amount)}`}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                              tx.status === 'Available' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                              tx.status === 'Pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                              tx.status === 'Confirmed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                              tx.status === 'Redeemed' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' :
                              'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="py-3 font-mono text-slate-400 text-[11px]">
                            {tx.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 text-xs">
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">My Activity Journey</h3>
                  <p className="text-slate-400">Complete, transparent history of your price searches, views, and store comparisons</p>
                </div>
                <span className="text-[10px] font-mono bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-full font-bold">
                  {currentUser ? `User: ${currentUser.id}` : `Guest: ${guestSession.sessionId}`}
                </span>
              </div>

              <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 space-y-6">
                {(currentUser
                  ? trackingService.getUserActivityTimeline(currentUser.id)
                  : trackingService.getGuestActivityTimeline(guestSession.sessionId)
                ).map(event => (
                  <div key={event.id} className="relative">
                    <span className="absolute -left-[31px] top-0 w-3.5 h-3.5 rounded-full bg-brand-500 ring-4 ring-white dark:ring-slate-900" />
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                          {event.actionType.replace(/_/g, ' ')}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">{event.timestamp}</span>
                      </div>
                      {event.productName && (
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          Product: {event.productName} ({event.category})
                        </div>
                      )}
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                        {JSON.stringify(event.details, null, 2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: OUTBOUND VISITS */}
          {activeTab === 'outbound' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 text-xs">
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Outbound Store Visits</h3>
                <p className="text-slate-400">Tracked affiliate clicks to Amazon, Flipkart, Croma and more</p>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {trackingService.getOutboundClicks()
                  .filter(c => currentUser ? c.user_identifier.includes(currentUser.id) || c.user_identifier.includes(currentUser.name) : c.user_identifier.includes(guestSession.sessionId))
                  .map(click => (
                    <div key={click.clickId} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">{click.productName}</div>
                        <div className="text-[11px] text-slate-400">
                          Store: <strong className="text-slate-700 dark:text-slate-300">{click.marketplace}</strong> • Ref ID: {click.clickId}
                        </div>
                        <a
                          href={click.exactProductUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <span>Visit Exact SKU deep-link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <div className="text-right">
                        <div className="font-black text-slate-900 dark:text-white text-sm">
                          ₹{click.priceAtClick.toLocaleString('en-IN')}
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          click.commissionStatus === 'CONFIRMED'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {click.commissionStatus}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 5: PRIVACY CONTROLS (Section 8 & 17) */}
          {activeTab === 'privacy' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 text-xs">
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Privacy & Tracking Controls</h3>
                <p className="text-slate-400">You control how SmartDeal collects and stores your browsing activity</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">Shopping Activity Consent</div>
                      <div className="text-[11px] text-slate-400">Log product views and price comparisons for personalized recommendations</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={dataConsent}
                      onChange={e => setDataConsent(e.target.checked)}
                      className="w-4 h-4 text-brand-600 rounded cursor-pointer"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">Price Drop Radar Consent</div>
                      <div className="text-[11px] text-slate-400">Store alert target prices and notify you when deals appear</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={personalizationConsent}
                      onChange={e => setPersonalizationConsent(e.target.checked)}
                      className="w-4 h-4 text-brand-600 rounded cursor-pointer"
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={handleExportPersonalData}
                    className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download All My Data (JSON)</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('Clear local search and view history?')) {
                        localStorage.removeItem('smartdeal_activity_logs_v2');
                        alert('Your local activity logs have been cleared.');
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                  >
                    Clear Search History
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SECURITY & 2FA */}
          {activeTab === 'security' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 text-xs">
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Security & Authentication</h3>
                <p className="text-slate-400">SHA-256 hashed credentials, multi-factor authentication & session control</p>
              </div>

              {pwdMessage && (
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{pwdMessage}</span>
                </div>
              )}

              {/* Password update form */}
              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Current Password</label>
                  <input
                    type="password"
                    value={currentPwd}
                    onChange={e => setCurrentPwd(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPwd}
                    onChange={e => setNewPwd(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-brand-600 text-white font-bold text-xs cursor-pointer shadow-md"
                >
                  Update Password
                </button>
              </form>

              {/* 2FA Toggle */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">Two-Factor Authentication (2FA)</div>
                    <div className="text-[11px] text-slate-400">Protect your cashback wallet with an authenticator app</div>
                  </div>
                  <button
                    onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                    className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all ${
                      twoFactorEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {twoFactorEnabled ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Redeem Cashback Modal */}
      {isRedeemModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Withdraw Confirmed Cashback</h3>
              </div>
              <button
                onClick={() => setIsRedeemModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
              Available to Withdraw: <strong>₹{cashbackWallet.availableBalance}</strong>
            </div>

            {redeemMessage && (
              <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                redeemMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200'
              }`}>
                {redeemMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{redeemMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleRedeemSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Withdrawal Amount (₹)</label>
                <input
                  type="number"
                  min={1}
                  max={cashbackWallet.availableBalance}
                  value={redeemAmount}
                  onChange={e => setRedeemAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-black text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Payout Method</label>
                <select
                  value={redeemMethod}
                  onChange={e => setRedeemMethod(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-slate-900 dark:text-white"
                >
                  <option value="UPI">Instant UPI (VPA)</option>
                  <option value="Bank Transfer">NEFT / IMPS Bank Transfer</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  {redeemMethod === 'UPI' ? 'UPI ID (VPA)' : 'Bank Account & IFSC'}
                </label>
                <input
                  type="text"
                  required
                  value={redeemAccount}
                  onChange={e => setRedeemAccount(e.target.value)}
                  placeholder={redeemMethod === 'UPI' ? 'e.g. name@upi' : 'Account number, IFSC'}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRedeemModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={cashbackWallet.availableBalance <= 0}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold shadow-md cursor-pointer"
                >
                  Confirm Withdrawal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Address Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Add New Delivery Address</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAddress} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Recipient Full Name *</label>
                <input
                  type="text"
                  required
                  value={newAddr.fullName}
                  onChange={e => setNewAddr({ ...newAddr, fullName: e.target.value })}
                  placeholder="e.g. Rohit Kumar"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Street Address & Flat / House No. *</label>
                <input
                  type="text"
                  required
                  value={newAddr.street}
                  onChange={e => setNewAddr({ ...newAddr, street: e.target.value })}
                  placeholder="e.g. Flat 402, Sunshine Apartments, MG Road"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">City / District *</label>
                  <input
                    type="text"
                    required
                    value={newAddr.city}
                    onChange={e => setNewAddr({ ...newAddr, city: e.target.value })}
                    placeholder="e.g. New Delhi"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">State *</label>
                  <input
                    type="text"
                    required
                    value={newAddr.state}
                    onChange={e => setNewAddr({ ...newAddr, state: e.target.value })}
                    placeholder="e.g. Delhi"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">6-Digit PIN Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={newAddr.pincode}
                    onChange={e => setNewAddr({ ...newAddr, pincode: e.target.value })}
                    placeholder="e.g. 110016"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Contact Phone *</label>
                  <input
                    type="text"
                    required
                    value={newAddr.phone}
                    onChange={e => setNewAddr({ ...newAddr, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md cursor-pointer"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
