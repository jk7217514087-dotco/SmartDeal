import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  ExternalLink,
  CheckCircle2,
  Clock,
  Bell,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Layers,
  Sparkles,
  DollarSign,
  Filter,
  Eye,
  ChevronRight,
  Maximize2,
  Minimize2,
  RefreshCw,
  Play,
  Check,
  Lock,
  BarChart3,
  Award,
  Zap,
  Globe,
  Radio,
  FileText,
  X,
  AlertCircle,
  HelpCircle,
  MousePointerClick,
  Send
} from 'lucide-react';
import { notificationService, OwnerNotification, OWNER_PHONE, OWNER_EMAIL } from '../services/notificationService';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
  Cell
} from 'recharts';

// Sound effect synthesizer using Web Audio API for live real-time notification
const playNotificationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.35);
  } catch (e) {
    // AudioContext might be blocked until user gesture, ignore safely
  }
};

interface PurchaseRecord {
  id: string;
  trackingId: string;
  time: string;
  timestamp: string;
  product: string;
  productSpecs: string;
  image: string;
  platform: 'Amazon' | 'Flipkart' | 'Croma' | 'Myntra';
  platformLogo?: string;
  user: string;
  price: number;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  commission: number;
  comparedAt: string;
  clickedAt: string;
  purchasedAt: string;
  orderRef: string;
  verifiedHash: string;
}

const INITIAL_PURCHASES: PurchaseRecord[] = [
  {
    id: 'p-1',
    trackingId: 'SD-AFF-2026-000184',
    time: '10:51 PM',
    timestamp: 'Today, 10:51 PM',
    product: 'Samsung Galaxy M14 5G',
    productSpecs: '6GB RAM, 128GB Storage • Smoky Teal',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80',
    platform: 'Amazon',
    user: 'SD10245',
    price: 12999,
    status: 'Confirmed',
    commission: 390,
    comparedAt: '8 Sep 2026, 10:42 PM',
    clickedAt: '8 Sep 2026, 10:44 PM',
    purchasedAt: '8 Sep 2026, 10:51 PM',
    orderRef: '171-1234567-890123',
    verifiedHash: 'sha256:7f83b2e49c12a801ff456eaff98'
  },
  {
    id: 'p-2',
    trackingId: 'SD-AFF-2026-000183',
    time: '10:35 PM',
    timestamp: 'Today, 10:35 PM',
    product: 'HP Laptop 15s',
    productSpecs: '12th Gen Intel Core i5, 16GB RAM, 512GB SSD',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80',
    platform: 'Flipkart',
    user: 'SD10421',
    price: 54999,
    status: 'Confirmed',
    commission: 1650,
    comparedAt: '8 Sep 2026, 10:15 PM',
    clickedAt: '8 Sep 2026, 10:20 PM',
    purchasedAt: '8 Sep 2026, 10:35 PM',
    orderRef: 'OD309817290128',
    verifiedHash: 'sha256:88bc231908aafe394109841b9e0'
  },
  {
    id: 'p-3',
    trackingId: 'SD-AFF-2026-000182',
    time: '09:48 PM',
    timestamp: 'Today, 09:48 PM',
    product: 'Boat Earbuds 141',
    productSpecs: '42H Playtime, Low Latency BEAST Mode',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    platform: 'Amazon',
    user: 'SD10982',
    price: 1299,
    status: 'Pending',
    commission: 65,
    comparedAt: '8 Sep 2026, 09:30 PM',
    clickedAt: '8 Sep 2026, 09:36 PM',
    purchasedAt: '8 Sep 2026, 09:48 PM',
    orderRef: '404-9821456-112049',
    verifiedHash: 'sha256:91ac3481230abfed983719bca42'
  },
  {
    id: 'p-4',
    trackingId: 'SD-AFF-2026-000181',
    time: '08:32 PM',
    timestamp: 'Today, 08:32 PM',
    product: 'Realme Buds Air 5',
    productSpecs: '50dB Deep Sea ANC, 12.4mm Mega Titanizing Driver',
    image: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&auto=format&fit=crop&q=80',
    platform: 'Flipkart',
    user: 'SD10765',
    price: 2499,
    status: 'Confirmed',
    commission: 125,
    comparedAt: '8 Sep 2026, 08:12 PM',
    clickedAt: '8 Sep 2026, 08:19 PM',
    purchasedAt: '8 Sep 2026, 08:32 PM',
    orderRef: 'OD290182746190',
    verifiedHash: 'sha256:44fe89230a1bf6793e098471da9'
  },
  {
    id: 'p-5',
    trackingId: 'SD-AFF-2026-000180',
    time: '07:15 PM',
    timestamp: 'Today, 07:15 PM',
    product: 'Nike Air Max Shoes',
    productSpecs: 'Breathable Mesh Cushioning, Size 9 UK',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    platform: 'Amazon',
    user: 'SD10231',
    price: 4999,
    status: 'Pending',
    commission: 250,
    comparedAt: '8 Sep 2026, 06:50 PM',
    clickedAt: '8 Sep 2026, 07:02 PM',
    purchasedAt: '8 Sep 2026, 07:15 PM',
    orderRef: '171-8839201-901833',
    verifiedHash: 'sha256:12bc5564aa78eff10094b8e663a'
  },
  {
    id: 'p-6',
    trackingId: 'SD-AFF-2026-000179',
    time: '06:40 PM',
    timestamp: 'Today, 06:40 PM',
    product: 'Sony WH-1000XM5 Wireless Headphones',
    productSpecs: 'Industry Leading Noise Cancellation • Silver',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    platform: 'Croma',
    user: 'SD10884',
    price: 29990,
    status: 'Confirmed',
    commission: 900,
    comparedAt: '8 Sep 2026, 06:15 PM',
    clickedAt: '8 Sep 2026, 06:22 PM',
    purchasedAt: '8 Sep 2026, 06:40 PM',
    orderRef: 'CR-908124982',
    verifiedHash: 'sha256:77ae1209b55f8910ecad9938120'
  }
];

export const ExternalTrackingPage: React.FC = () => {
  // Presentation modes
  const [viewMode, setViewMode] = useState<'canvas' | 'interactive' | 'analytics'>('canvas');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseRecord>(INITIAL_PURCHASES[0]);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [purchases, setPurchases] = useState<PurchaseRecord[]>(INITIAL_PURCHASES);

  // Filters
  const [platformFilter, setPlatformFilter] = useState<'All' | 'Amazon' | 'Flipkart' | 'Croma'>('All');
  const [dateFilter, setDateFilter] = useState<'Today' | 'This Week' | 'This Month'>('Today');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Confirmed' | 'Pending'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Simulator step
  const [simStep, setSimStep] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeToast, setActiveToast] = useState<{
    title: string;
    product: string;
    platform: string;
    price: number;
    user: string;
    time: string;
  } | null>(null);

  // Notification Feed state
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'purchase', title: 'New External Purchase Detected', product: 'Samsung Galaxy M14 5G', platform: 'Amazon', time: '10:51 PM', status: 'Confirmed' },
    { id: 2, type: 'purchase', title: 'New External Purchase Detected', product: 'HP Laptop 15s', platform: 'Flipkart', time: '10:35 PM', status: 'Confirmed' },
    { id: 3, type: 'click', title: 'New External Click', product: 'Boat Earbuds', platform: 'Amazon', time: '09:48 PM', status: 'Pending' },
    { id: 4, type: 'purchase', title: 'New External Purchase Detected', product: 'Realme Buds', platform: 'Flipkart', time: '08:32 PM', status: 'Confirmed' },
    { id: 5, type: 'click', title: 'New External Click', product: 'Nike Shoes', platform: 'Amazon', time: '07:15 PM', status: 'Pending' }
  ]);

  const [ownerNotifs, setOwnerNotifs] = useState<OwnerNotification[]>(() => notificationService.getNotificationLogs());

  useEffect(() => {
    const unsub = notificationService.subscribe(() => {
      setOwnerNotifs(notificationService.getNotificationLogs());
    });
    return unsub;
  }, []);

  const handleSendTestAlert = async () => {
    await notificationService.sendTestAlert();
  };

  // Handle live webhook simulation
  const triggerSimulatedWebhook = () => {
    setIsSimulating(true);
    playNotificationSound();

    const randomId = Math.floor(10000 + Math.random() * 90000);
    const newRecord: PurchaseRecord = {
      id: `p-${Date.now()}`,
      trackingId: `SD-AFF-2026-000${Math.floor(185 + purchases.length)}`,
      time: 'Just now',
      timestamp: 'Today, Just now',
      product: 'Samsung Galaxy M14 5G',
      productSpecs: '6GB RAM, 128GB Storage • Verified Partner',
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80',
      platform: 'Amazon',
      user: `SD${randomId}`,
      price: 12999,
      status: 'Confirmed',
      commission: 390,
      comparedAt: '8 Sep 2026, 10:42 PM',
      clickedAt: '8 Sep 2026, 10:44 PM',
      purchasedAt: '8 Sep 2026, 10:51 PM',
      orderRef: `171-${Math.floor(1000000 + Math.random() * 9000000)}-${Math.floor(100000 + Math.random() * 900000)}`,
      verifiedHash: `sha256:${Math.random().toString(16).slice(2, 10)}...verified`
    };

    // Update list & select
    setPurchases(prev => [newRecord, ...prev]);
    setSelectedPurchase(newRecord);

    // Add to notifications
    setNotifications(prev => [
      {
        id: Date.now(),
        type: 'purchase',
        title: 'New External Purchase Detected',
        product: newRecord.product,
        platform: newRecord.platform,
        time: 'Just now',
        status: 'Confirmed'
      },
      ...prev.slice(0, 7)
    ]);

    // Show floating toast
    setActiveToast({
      title: 'New External Purchase Detected',
      product: newRecord.product,
      platform: newRecord.platform,
      price: newRecord.price,
      user: newRecord.user,
      time: 'Just now'
    });

    setTimeout(() => {
      setIsSimulating(false);
    }, 600);

    setTimeout(() => {
      setActiveToast(null);
    }, 6000);
  };

  // Filtered Purchases
  const filteredPurchases = useMemo(() => {
    return purchases.filter(p => {
      if (platformFilter !== 'All' && p.platform !== platformFilter) return false;
      if (statusFilter !== 'All' && p.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          p.product.toLowerCase().includes(query) ||
          p.user.toLowerCase().includes(query) ||
          p.trackingId.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [purchases, platformFilter, statusFilter, searchQuery]);

  // Analytics Chart Data
  const hourlyClicksPurchases = [
    { time: '04 PM', clicks: 85, purchases: 42, rate: 49.4 },
    { time: '05 PM', clicks: 120, purchases: 68, rate: 56.6 },
    { time: '06 PM', clicks: 195, purchases: 124, rate: 63.5 },
    { time: '07 PM', clicks: 240, purchases: 168, rate: 70.0 },
    { time: '08 PM', clicks: 290, purchases: 215, rate: 74.1 },
    { time: '09 PM', clicks: 318, purchases: 226, rate: 71.0 },
    { time: '10 PM', clicks: 360, purchases: 260, rate: 72.2 }
  ];

  const platformDistribution = [
    { platform: 'Amazon', clicks: 680, purchases: 472, revenue: 68500, fill: '#f59e0b' },
    { platform: 'Flipkart', clicks: 420, purchases: 284, revenue: 41200, fill: '#3b82f6' },
    { platform: 'Croma', clicks: 110, purchases: 68, revenue: 11880, fill: '#10b981' },
    { platform: 'Myntra', clicks: 38, purchases: 19, revenue: 3000, fill: '#ec4899' }
  ];

  return (
    <div className={`min-h-screen ${isFullscreen ? 'fixed inset-0 z-50 overflow-y-auto bg-slate-950' : 'bg-[#F8FAFC] dark:bg-[#070B14]'} transition-all`}>
      
      {/* =========================================================================
          TOP COMMAND BAR & CONTROLS
         ========================================================================= */}
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-14 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Radio className="w-5 h-5 text-emerald-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 dark:text-white text-base sm:text-lg tracking-tight">
                  Smart<span className="text-brand-600 dark:text-brand-400">Deals</span>
                </span>
                <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
                  Affiliate Intelligence
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Live Webhook Active
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                External Purchase Tracking & Real-Time Notification System • Track • Notify • Analyze • Grow
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* View Mode Switcher */}
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200/80 dark:border-slate-700 text-xs font-bold">
              <button
                onClick={() => setViewMode('canvas')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === 'canvas'
                    ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>16:9 Canvas</span>
              </button>
              <button
                onClick={() => setViewMode('interactive')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === 'interactive'
                    ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <MousePointerClick className="w-3.5 h-3.5" />
                <span>Interactive Live</span>
              </button>
              <button
                onClick={() => setViewMode('analytics')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === 'analytics'
                    ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Analytics</span>
              </button>
            </div>

            {/* Simulate Live Webhook Button */}
            <button
              onClick={triggerSimulatedWebhook}
              disabled={isSimulating}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-sm shadow-emerald-600/20 active:scale-95 transition-all"
            >
              <Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>Simulate Webhook</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter 16:9 Presentation Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TOP BANNER: BRAND GUARANTEE & HOOK
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-2">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-indigo-900/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-amber-400 text-xl font-black shadow-inner">
              🔔
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                External Purchase Notification System
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-extrabold">
                  Production Verified
                </span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5 font-medium">
                Know what users buy, when they buy, and where they buy — with real-time notifications and privacy-first tracking.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="px-3.5 py-2 rounded-2xl bg-white/5 border border-white/10 text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero PII Exposure • Verified Affiliates Only</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          LIVE OWNER ALERTS: SMS (+91 7217514087) & EMAIL (jk7217514087@gmail.com)
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-500/30 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
                <Bell className="w-5 h-5 text-amber-300 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                    Live Owner Alert Dispatcher
                  </h3>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-extrabold text-[10px]">
                    ● ACTIVE
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Phone (SMS/WhatsApp): <b className="text-brand-600 dark:text-brand-400">+91 {OWNER_PHONE}</b> • Email: <b className="text-brand-600 dark:text-brand-400">{OWNER_EMAIL}</b>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSendTestAlert}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Test Alert to 7217514087</span>
              </button>
            </div>
          </div>

          {/* Quick Counter Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-blue-50/70 dark:bg-slate-800/60 border border-blue-200/60 dark:border-slate-700">
              <span className="text-slate-500 text-[10px] block font-bold">Total Dispatched:</span>
              <span className="text-base font-black text-blue-600 dark:text-blue-400">{ownerNotifs.length}</span>
            </div>
            <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-slate-800/60 border border-amber-200/60 dark:border-slate-700">
              <span className="text-slate-500 text-[10px] block font-bold">Outbound Clicks:</span>
              <span className="text-base font-black text-amber-600 dark:text-amber-400">
                {ownerNotifs.filter(n => n.type === 'BUY_CLICK').length}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-slate-800/60 border border-emerald-200/60 dark:border-slate-700">
              <span className="text-slate-500 text-[10px] block font-bold">Bought (Success):</span>
              <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                {ownerNotifs.filter(n => n.type === 'PURCHASE_SUCCESS').length}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-rose-50/70 dark:bg-slate-800/60 border border-rose-200/60 dark:border-slate-700">
              <span className="text-slate-500 text-[10px] block font-bold">Did Not Buy:</span>
              <span className="text-base font-black text-rose-600 dark:text-rose-400">
                {ownerNotifs.filter(n => n.type === 'PURCHASE_NOT_BOUGHT').length}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-purple-50/70 dark:bg-slate-800/60 border border-purple-200/60 dark:border-slate-700">
              <span className="text-slate-500 text-[10px] block font-bold">Return Requests:</span>
              <span className="text-base font-black text-purple-600 dark:text-purple-400">
                {ownerNotifs.filter(n => n.type === 'RETURN_REQUEST').length}
              </span>
            </div>
          </div>

          {/* Live SMS & Email Logs Feed */}
          <div className="space-y-2">
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              Recent Dispatched SMS & Email Logs to +91 {OWNER_PHONE}
            </p>
            {ownerNotifs.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">No alerts dispatched yet. Click any product's "Buy at Best Price" or "Send Test Alert" to see live dispatch.</p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {ownerNotifs.slice(0, 6).map(notif => (
                  <div key={notif.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          notif.type === 'PURCHASE_SUCCESS'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : notif.type === 'PURCHASE_NOT_BOUGHT'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            : notif.type === 'RETURN_REQUEST'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        }`}>
                          {notif.type === 'PURCHASE_SUCCESS' ? '✅ BOUGHT' : notif.type === 'PURCHASE_NOT_BOUGHT' ? '❌ DID NOT BUY' : notif.type === 'BUY_CLICK' ? '🚨 OUTBOUND CLICK' : notif.type}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">{notif.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 whitespace-pre-line mt-1 font-mono bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                        {notif.smsContent}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">{new Date(notif.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: THE VISUAL 5-STEP FLOW CANVAS (Horizontal / Unified 16:9 Presentation)
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-brand-600" />
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Visual Lifecycle Flow: Search to Conversion Notification
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Step 1 to Step 5 End-to-End Architecture
          </span>
        </div>

        {/* 5-Step Connected Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 lg:gap-4 relative">
          
          {/* STEP 1: USER SEARCHES PRODUCT */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative group">
            <div>
              {/* Header Step Badge */}
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-brand-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                  1
                </span>
                <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                  User Searches Product
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">
                User searches for a product on SmartDeals and compares prices across multiple platforms.
              </p>

              {/* Mini SmartDeals Search Mockup */}
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/80 p-2.5 border border-slate-100 dark:border-slate-700/60 text-xs">
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-200/70 dark:border-slate-700 text-[10px] font-bold text-slate-400">
                  <span className="text-brand-600 dark:text-brand-400">SmartDeals</span>
                  <div className="flex items-center gap-1.5">
                    <span>Home</span>
                    <span>Compare</span>
                  </div>
                </div>

                {/* Search Bar Input */}
                <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 rounded-xl px-2 py-1.5 border border-slate-200 dark:border-slate-700 shadow-inner mb-2.5">
                  <Search className="w-3 h-3 text-slate-400" />
                  <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 truncate">
                    Samsung Galaxy M14 5G
                  </span>
                </div>

                {/* Product Card Inside Step 1 */}
                <div className="bg-white dark:bg-slate-900/90 rounded-xl p-2 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
                  <img
                    src="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&auto=format&fit=crop&q=80"
                    alt="Samsung Galaxy M14 5G"
                    className="w-full h-24 object-cover rounded-lg mb-1.5"
                  />
                  <div className="font-bold text-[11px] text-slate-900 dark:text-white truncate">
                    Samsung Galaxy M14 5G
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    6GB RAM, 128GB
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-black text-brand-600 dark:text-brand-400 text-xs">₹12,490</span>
                    <span className="text-[10px] text-amber-500 font-bold">★ 4.2 (12k)</span>
                  </div>
                  <button
                    onClick={() => setSimStep(2)}
                    className="w-full mt-2 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold text-[10px] shadow-xs flex items-center justify-center gap-1 transition-all"
                  >
                    <span>Compare Prices</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Connecting Arrow for Desktop */}
            <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm items-center justify-center text-slate-400">
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* STEP 2: USER COMPARES & CHOOSES PLATFORM */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative group">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-brand-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                  2
                </span>
                <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                  User Compares Platforms
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">
                User compares prices, delivery dates, and SmartCoins across stores (e.g. Amazon).
              </p>

              {/* Price Comparison Mini Table */}
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/80 p-2.5 border border-slate-100 dark:border-slate-700/60 text-xs space-y-1.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Platform</span>
                  <span>Price & Action</span>
                </div>

                {/* Flipkart Row (Best Price) */}
                <div className="p-1.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between text-[10px]">
                  <div>
                    <div className="flex items-center gap-1 font-extrabold text-slate-900 dark:text-white">
                      <span>Flipkart</span>
                      <span className="text-[8px] bg-emerald-600 text-white px-1 py-0.2 rounded font-bold">
                        Best Price
                      </span>
                    </div>
                    <div className="text-slate-500 text-[9px]">2 Days • Free Delivery</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-emerald-700 dark:text-emerald-400 text-[11px]">₹12,799</div>
                    <span className="text-[9px] text-emerald-600 font-bold">Buy Now</span>
                  </div>
                </div>

                {/* Amazon Row (Selected highlight) */}
                <div className="p-1.5 rounded-xl bg-amber-50/90 dark:bg-amber-950/40 border-2 border-amber-400 dark:border-amber-600 shadow-sm flex items-center justify-between text-[10px]">
                  <div>
                    <div className="flex items-center gap-1 font-black text-slate-900 dark:text-white">
                      <span className="text-amber-600 font-black">a</span>
                      <span>Amazon</span>
                    </div>
                    <div className="text-slate-500 text-[9px]">2 Days • ₹40 Delivery</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-slate-900 dark:text-white text-[11px]">₹12,999</div>
                    <span className="text-[9px] bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded font-black">
                      Buy Now ↗
                    </span>
                  </div>
                </div>

                {/* Croma Row */}
                <div className="p-1.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-[10px]">
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">Croma</div>
                    <div className="text-slate-400 text-[9px]">3–4 Days • Free</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">₹13,499</div>
                    <span className="text-[9px] text-slate-500">Buy Now</span>
                  </div>
                </div>

                {/* Reliance Digital Row */}
                <div className="p-1.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-[10px]">
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">Reliance Digital</div>
                    <div className="text-slate-400 text-[9px]">2–3 Days • ₹49</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">₹13,999</div>
                    <span className="text-[9px] text-slate-400">Out of Stock</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm items-center justify-center text-slate-400">
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* STEP 3: USER BUYS ON EXTERNAL PLATFORM */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative group">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-brand-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                  3
                </span>
                <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                  User Buys on Amazon
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">
                User clicks Buy Now on Amazon and completes checkout on the external marketplace.
              </p>

              {/* Amazon Checkout Mockup */}
              <div className="rounded-2xl bg-slate-900 text-white p-2.5 border border-slate-800 text-xs">
                {/* Amazon Mock Navbar */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[10px]">
                  <div className="font-black tracking-tight text-amber-400 flex items-center gap-1">
                    <span>amazon.in</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <ShoppingCart className="w-3 h-3" />
                  </div>
                </div>

                {/* Product Detail in Amazon */}
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200&auto=format&fit=crop&q=80"
                    alt="Samsung M14"
                    className="w-10 h-10 object-cover rounded-lg border border-slate-700"
                  />
                  <div>
                    <div className="text-[10px] font-bold text-slate-100 truncate w-32">Samsung Galaxy M14 5G</div>
                    <div className="text-[9px] text-amber-400">★ 4.2 (12,456)</div>
                    <div className="text-[11px] font-extrabold text-white">₹12,999 <span className="text-[9px] text-blue-400">prime</span></div>
                  </div>
                </div>

                <div className="w-full py-1 rounded bg-[#FFD814] text-slate-950 font-bold text-[10px] text-center mb-2 shadow-xs">
                  Buy Now
                </div>

                {/* Purchase Successful Box */}
                <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-[10px]">
                  <div className="flex items-center gap-1 text-emerald-400 font-extrabold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Purchase Successful</span>
                  </div>
                  <div className="text-slate-300 text-[9px] mt-0.5">Order: 171-1234567-890123</div>
                  <div className="text-slate-400 text-[8px]">Placed: 8 Sep 2026, 10:51 PM</div>
                </div>
              </div>
            </div>

            <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm items-center justify-center text-slate-400">
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* STEP 4: EXTERNAL PURCHASE TRACKED */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative group">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                  4
                </span>
                <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                  Purchase Tracked
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">
                SmartDeals receives authorized affiliate/partner webhook data and verifies the transaction.
              </p>

              {/* Verified Tracking Receipt Box */}
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/90 p-2.5 border border-slate-200/80 dark:border-slate-700 text-xs">
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-200/80 dark:border-slate-700">
                  <div className="flex items-center gap-1">
                    <span className="w-4 h-4 rounded-md bg-amber-500 text-slate-950 font-black text-[9px] flex items-center justify-center">
                      a
                    </span>
                    <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">Amazon Partner</span>
                  </div>
                  <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full border border-emerald-200 dark:border-emerald-800/40 flex items-center gap-0.5">
                    <Check className="w-2.5 h-2.5" /> Confirmed
                  </span>
                </div>

                <div className="space-y-1 text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Product:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[100px]">Samsung M14</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">User ID:</span>
                    <span className="font-extrabold text-brand-600 dark:text-brand-400">#SD10245</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Compared:</span>
                    <span className="text-slate-700 dark:text-slate-300">10:42 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Purchased:</span>
                    <span className="text-slate-700 dark:text-slate-300">10:51 PM</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700">
                    <span className="text-slate-500">Purchase Price:</span>
                    <span className="font-black text-slate-900 dark:text-white">₹12,999</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Commission:</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400">₹390 (3.0%)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm items-center justify-center text-slate-400">
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* STEP 5: REAL-TIME NOTIFICATION SENT */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-brand-300 dark:border-brand-700/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative ring-2 ring-brand-500/20">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                  5
                </span>
                <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                  Real-Time Notification
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">
                SmartDeals immediately flashes a live notification to the admin dashboard.
              </p>

              {/* Notification Card Component */}
              <div className="rounded-2xl bg-gradient-to-b from-indigo-50/80 to-brand-50/60 dark:from-slate-800 dark:to-indigo-950/40 p-3 border border-brand-200/80 dark:border-brand-800/60 text-xs shadow-xs">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-xs">
                    <Bell className="w-3.5 h-3.5 animate-bounce" />
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 dark:text-white text-[11px]">
                      New External Purchase!
                    </div>
                    <div className="text-[9px] text-slate-500 dark:text-slate-400">
                      10:51 PM • Just detected
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900/90 rounded-xl p-2 border border-slate-200/60 dark:border-slate-800 space-y-1 text-[10px] mb-2">
                  <div className="font-bold text-slate-900 dark:text-white truncate">
                    Samsung Galaxy M14 5G
                  </div>
                  <div className="text-slate-500 flex items-center justify-between text-[9px]">
                    <span>Platform: Amazon</span>
                    <span className="font-bold text-brand-600 dark:text-brand-400">SD10245</span>
                  </div>
                  <div className="flex items-center justify-between pt-0.5 border-t border-slate-100 dark:border-slate-800">
                    <span className="font-extrabold text-slate-900 dark:text-white">₹12,999</span>
                    <span className="text-emerald-600 font-extrabold text-[9px]">Confirmed ✓</span>
                  </div>
                </div>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => {
                      setSelectedPurchase(INITIAL_PURCHASES[0]);
                      setIsDetailDrawerOpen(true);
                    }}
                    className="flex-1 py-1 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold text-[9px] shadow-xs text-center"
                  >
                    View Details
                  </button>
                  <Link
                    to="/compare/prod-samsung-m14"
                    className="px-2 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-[9px] text-center"
                  >
                    Compare
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: ADMIN DASHBOARD (Dark Navy SaaS View)
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-[#0B132B] dark:bg-[#070D1F] text-slate-100 rounded-3xl p-4 sm:p-6 shadow-2xl border border-indigo-950/60">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Sidebar (Left column - 2 cols) */}
            <div className="lg:col-span-2 hidden lg:flex flex-col justify-between border-r border-slate-800/80 pr-4 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center font-black text-sm text-white shadow-md">
                    SD
                  </div>
                  <div>
                    <div className="font-black text-sm text-white">SmartDeals</div>
                    <div className="text-[10px] text-slate-400">Admin Control</div>
                  </div>
                </div>

                <nav className="space-y-1 text-xs font-semibold text-slate-400">
                  <div className="p-2 rounded-xl hover:bg-slate-800/60 hover:text-white cursor-pointer transition-colors flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    <span>Overview</span>
                  </div>
                  <div className="p-2 rounded-xl bg-brand-600/20 text-brand-300 border border-brand-500/30 font-bold cursor-pointer flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                      <span>External Purchases</span>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="p-2 rounded-xl hover:bg-slate-800/60 hover:text-white cursor-pointer transition-colors flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Users</span>
                  </div>
                  <div className="p-2 rounded-xl hover:bg-slate-800/60 hover:text-white cursor-pointer transition-colors flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    <span>Sellers</span>
                  </div>
                  <div className="p-2 rounded-xl hover:bg-slate-800/60 hover:text-white cursor-pointer transition-colors flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    <span>Products</span>
                  </div>
                  <div className="p-2 rounded-xl hover:bg-slate-800/60 hover:text-white cursor-pointer transition-colors flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>Orders</span>
                  </div>
                  <div className="p-2 rounded-xl hover:bg-slate-800/60 hover:text-white cursor-pointer transition-colors flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>Commissions</span>
                  </div>
                  <div className="p-2 rounded-xl hover:bg-slate-800/60 hover:text-white cursor-pointer transition-colors flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>SmartCoins</span>
                  </div>
                  <div className="p-2 rounded-xl hover:bg-slate-800/60 hover:text-white cursor-pointer transition-colors flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Analytics</span>
                  </div>
                </nav>
              </div>

              {/* Sidebar bottom privacy pill */}
              <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-[10px] space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Privacy Shield</span>
                </div>
                <p className="text-slate-400 text-[9px] leading-relaxed">
                  Only anonymized tracking IDs & verified affiliate webhooks allowed.
                </p>
              </div>
            </div>

            {/* Main Center Area (10 cols) */}
            <div className="lg:col-span-10 space-y-6">
              
              {/* Main Area Title */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <span>External Purchase Notifications</span>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded-full font-extrabold">
                      Real-time Feed
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real-time tracking of purchases made through authorized external platforms
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Sync status:</span>
                  <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/60 px-2 py-1 rounded-lg border border-emerald-800/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Connected to Amazon & Flipkart Webhooks
                  </span>
                </div>
              </div>

              {/* 4 Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                
                {/* Metric 1: Total External Clicks */}
                <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 shadow-sm relative overflow-hidden group">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Total External Clicks</span>
                    <span className="p-1.5 rounded-lg bg-indigo-950/80 text-indigo-400 border border-indigo-800/40">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <div className="text-2xl font-black text-white">1,248</div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>+12% vs last week</span>
                  </div>
                  <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-indigo-500/5 blur-xl group-hover:bg-indigo-500/10 transition-all" />
                </div>

                {/* Metric 2: Confirmed Purchases */}
                <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 shadow-sm relative overflow-hidden group">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Confirmed Purchases</span>
                    <span className="p-1.5 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <div className="text-2xl font-black text-emerald-400">843</div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>+8% conversion rate</span>
                  </div>
                  <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-emerald-500/5 blur-xl group-hover:bg-emerald-500/10 transition-all" />
                </div>

                {/* Metric 3: Pending Purchases */}
                <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 shadow-sm relative overflow-hidden group">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Pending Purchases</span>
                    <span className="p-1.5 rounded-lg bg-amber-950/80 text-amber-400 border border-amber-800/40">
                      <Clock className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <div className="text-2xl font-black text-amber-400">287</div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold mt-1">
                    <span>Awaiting return window</span>
                  </div>
                  <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-amber-500/5 blur-xl group-hover:bg-amber-500/10 transition-all" />
                </div>

                {/* Metric 4: Total Commission */}
                <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 shadow-sm relative overflow-hidden group">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Total Commission</span>
                    <span className="p-1.5 rounded-lg bg-purple-950/80 text-purple-400 border border-purple-800/40">
                      <DollarSign className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <div className="text-2xl font-black text-white">₹1,24,580</div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>+15% revenue growth</span>
                  </div>
                  <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-purple-500/5 blur-xl group-hover:bg-purple-500/10 transition-all" />
                </div>
              </div>

              {/* Middle Section: Table + Details Panel + Notification Center */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                
                {/* Recent Purchases Table (7 cols) */}
                <div className="xl:col-span-7 bg-slate-900/70 rounded-2xl p-4 border border-slate-800 shadow-sm space-y-3">
                  
                  {/* Table Header Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800 text-xs">
                    <div className="font-extrabold text-sm text-white flex items-center gap-2">
                      <span>Recent Purchases</span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-bold">
                        {filteredPurchases.length} records
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      {/* Platform Filter */}
                      <select
                        value={platformFilter}
                        onChange={e => setPlatformFilter(e.target.value as unknown as 'All' | 'Amazon' | 'Flipkart' | 'Croma')}
                        className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-1 focus:outline-none focus:border-brand-500"
                      >
                        <option value="All">All Platforms</option>
                        <option value="Amazon">Amazon</option>
                        <option value="Flipkart">Flipkart</option>
                        <option value="Croma">Croma</option>
                      </select>

                      {/* Status Filter */}
                      <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value as unknown as 'All' | 'Confirmed' | 'Pending')}
                        className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-1 focus:outline-none focus:border-brand-500"
                      >
                        <option value="All">All Status</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Pending">Pending</option>
                      </select>

                      {/* Date Filter */}
                      <div className="inline-flex bg-slate-800 rounded-lg p-0.5 text-[10px] font-bold text-slate-400">
                        {(['Today', 'This Week', 'This Month'] as const).map(tab => (
                          <button
                            key={tab}
                            onClick={() => setDateFilter(tab)}
                            className={`px-2 py-0.5 rounded-md ${dateFilter === tab ? 'bg-brand-600 text-white' : 'hover:text-white'}`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Table View */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-800/70 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                        <tr>
                          <th className="py-2.5 px-3 rounded-l-lg">Time</th>
                          <th className="py-2.5 px-3">Product</th>
                          <th className="py-2.5 px-3">Platform</th>
                          <th className="py-2.5 px-3">User</th>
                          <th className="py-2.5 px-3">Price</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3 rounded-r-lg">Commission</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80">
                        {filteredPurchases.map(item => {
                          const isSelected = selectedPurchase.id === item.id;
                          return (
                            <tr
                              key={item.id}
                              onClick={() => setSelectedPurchase(item)}
                              className={`cursor-pointer transition-colors ${
                                isSelected
                                  ? 'bg-indigo-950/60 border-l-4 border-l-brand-500 font-medium'
                                  : 'hover:bg-slate-800/40'
                              }`}
                            >
                              <td className="py-3 px-3 text-[11px] text-slate-400 font-mono">
                                {item.time}
                              </td>
                              <td className="py-3 px-3">
                                <div className="font-bold text-white text-xs truncate max-w-[140px]">
                                  {item.product}
                                </div>
                                <div className="text-[10px] text-slate-500 truncate max-w-[140px]">
                                  {item.trackingId}
                                </div>
                              </td>
                              <td className="py-3 px-3">
                                <span className={`inline-flex items-center gap-1 font-bold text-[11px] px-2 py-0.5 rounded-md ${
                                  item.platform === 'Amazon'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : item.platform === 'Flipkart'
                                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                }`}>
                                  {item.platform}
                                </span>
                              </td>
                              <td className="py-3 px-3 font-mono font-bold text-slate-300 text-[11px]">
                                {item.user}
                              </td>
                              <td className="py-3 px-3 font-extrabold text-white text-xs">
                                ₹{item.price.toLocaleString('en-IN')}
                              </td>
                              <td className="py-3 px-3">
                                {item.status === 'Confirmed' ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    Confirmed
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                    Pending
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-3 font-extrabold text-emerald-400 text-xs">
                                ₹{item.commission}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Purchase Details Panel (3 cols) */}
                <div className="xl:col-span-3 bg-slate-900/80 rounded-2xl p-4 border border-slate-800 shadow-sm flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-brand-400" />
                        <span>Purchase Details</span>
                      </div>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                        {selectedPurchase.trackingId}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <img
                        src={selectedPurchase.image}
                        alt={selectedPurchase.product}
                        className="w-16 h-16 object-cover rounded-xl border border-slate-700 shadow-sm shrink-0"
                      />
                      <div>
                        <div className="font-bold text-white text-xs leading-snug line-clamp-2">
                          {selectedPurchase.product}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {selectedPurchase.productSpecs}
                        </div>
                        <div className="text-base font-black text-white mt-1">
                          ₹{selectedPurchase.price.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl bg-slate-950/70 p-3 border border-slate-800/80 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400 text-[11px]">Platform</span>
                        <span className="font-bold text-white text-[11px]">{selectedPurchase.platform}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 text-[11px]">User</span>
                        <span className="font-bold text-brand-400 text-[11px] font-mono">{selectedPurchase.user}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 text-[11px]">Compared On</span>
                        <span className="text-slate-300 text-[11px]">{selectedPurchase.comparedAt}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 text-[11px]">Purchased On</span>
                        <span className="text-slate-300 text-[11px]">{selectedPurchase.purchasedAt}</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-slate-800">
                        <span className="text-slate-400 text-[11px]">Status</span>
                        <span className="text-emerald-400 font-extrabold text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {selectedPurchase.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 text-[11px]">Commission</span>
                        <span className="text-emerald-400 font-black text-xs">₹{selectedPurchase.commission}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsDetailDrawerOpen(true)}
                    className="w-full mt-3 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-brand-600/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>View Details & Timeline</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Real-Time Notification Center (2 cols) */}
                <div className="xl:col-span-2 bg-slate-900/80 rounded-2xl p-4 border border-slate-800 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                      <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
                        <Bell className="w-3.5 h-3.5 text-amber-400" />
                        <span>Live Alerts</span>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>

                    <div className="space-y-2.5 overflow-y-auto max-h-[300px] no-scrollbar">
                      {notifications.map(n => (
                        <div
                          key={n.id}
                          className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-[10px] space-y-1 hover:border-slate-700 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-slate-200 truncate max-w-[120px]">
                              {n.title}
                            </span>
                            <span className="text-[8px] text-slate-500">{n.time}</span>
                          </div>
                          <div className="text-slate-400 text-[9px] truncate">
                            {n.product} • <span className="text-amber-400">{n.platform}</span>
                          </div>
                          <div className="flex items-center justify-between pt-0.5">
                            <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded-full ${
                              n.status === 'Confirmed'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                                : 'bg-amber-950 text-amber-400 border border-amber-800/40'
                            }`}>
                              {n.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={triggerSimulatedWebhook}
                    className="w-full mt-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] text-center border border-slate-700"
                  >
                    + Ping Next Alert
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 3: BOTTOM VALUE CARDS (Privacy, Seller Trends, Commission, Trust)
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: User Privacy Protection */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                User Privacy Protection
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                SmartDeals shows only anonymized User ID (e.g. <span className="font-mono font-bold text-brand-600 dark:text-brand-400">SD10245</span>) instead of full personal details to ensure 100% privacy and security.
              </p>
            </div>
            <div className="mt-4 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-mono font-black text-xs flex items-center justify-center">
                SD
              </div>
              <div className="text-[11px]">
                <div className="font-extrabold text-slate-800 dark:text-slate-200">SmartDeals User #SD10245</div>
                <div className="text-[10px] text-slate-400">No name, card, or phone exposed</div>
              </div>
            </div>
          </div>

          {/* Card 2: Seller Dashboard & Trends */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Seller Dashboard Value
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Track all external purchases, get real-time notifications, and analyze competitor platform preference.
              </p>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                <div className="text-[10px] text-slate-400">Today</div>
                <div className="font-black text-base text-slate-900 dark:text-white">12</div>
                <div className="text-[9px] text-emerald-600 font-bold">+33%</div>
              </div>
              <div className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                <div className="text-[10px] text-slate-400">This Week</div>
                <div className="font-black text-base text-slate-900 dark:text-white">86</div>
                <div className="text-[9px] text-emerald-600 font-bold">+21%</div>
              </div>
              <div className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                <div className="text-[10px] text-slate-400">This Month</div>
                <div className="font-black text-base text-slate-900 dark:text-white">342</div>
                <div className="text-[9px] text-emerald-600 font-bold">+18%</div>
              </div>
            </div>
          </div>

          {/* Card 3: Commission System */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                <DollarSign className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Commission System
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Commission is credited strictly for verified and confirmed affiliate partner purchases.
              </p>
            </div>
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40">
                <span className="text-amber-800 dark:text-amber-300 font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Pending Verification
                </span>
                <span className="font-black text-amber-900 dark:text-amber-200">₹5,420</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40">
                <span className="text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed & Payout Ready
                </span>
                <span className="font-black text-emerald-900 dark:text-emerald-200">₹18,760</span>
              </div>
            </div>
          </div>

          {/* Card 4: Privacy & Trust Checklist */}
          <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white rounded-3xl p-5 shadow-sm flex flex-col justify-between border border-indigo-800/50">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h4 className="font-extrabold text-sm text-white">Privacy & Trust</h4>
              </div>
              <div className="space-y-1.5 text-xs text-slate-300 mt-2">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>No personal data shown</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Only authorized partner tracking data</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Real-time webhook tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>No fake purchase records</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Compliant with privacy policy</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
              <span>SmartDeals Affiliate Engine</span>
              <span className="text-amber-400 font-bold">100% Genuine</span>
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
          SECTION 4: ANALYTICS & INSIGHTS (When viewMode === 'analytics' or bottom preview)
         ========================================================================= */}
      {viewMode === 'analytics' && (
        <div className="max-w-7xl mx-auto px-4 py-4 space-y-6 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-lg text-slate-900 dark:text-white">
                  Affiliate Conversion & Traffic Analytics
                </h3>
                <p className="text-xs text-slate-500">
                  External clicks, successful partner purchases, and platform preference breakdown
                </p>
              </div>
              <div className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                Overall Conversion Rate: 67.5%
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Hourly Clicks vs Purchases */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="font-extrabold text-sm text-slate-900 dark:text-white mb-3">
                  External Clicks vs Confirmed Purchases (Today)
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={hourlyClicksPurchases}>
                      <defs>
                        <linearGradient id="clicksGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="purchasesGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="time" stroke="#888888" fontSize={11} />
                      <YAxis stroke="#888888" fontSize={11} />
                      <Tooltip />
                      <Area type="monotone" dataKey="clicks" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#clicksGrad)" name="External Clicks" />
                      <Area type="monotone" dataKey="purchases" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#purchasesGrad)" name="Purchases" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Platform Revenue Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="font-extrabold text-sm text-slate-900 dark:text-white mb-3">
                  Affiliate Commission by Platform (MTD)
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={platformDistribution}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="platform" stroke="#888888" fontSize={11} />
                      <YAxis stroke="#888888" fontSize={11} />
                      <Tooltip />
                      <Bar dataKey="revenue" radius={[8, 8, 0, 0]} name="Commission (₹)">
                        {platformDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PURCHASE AUDIT DRAWER / MODAL (SD-AFF-2026-000184 Full Lifecycle)
         ========================================================================= */}
      {isDetailDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden animate-scaleUp">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-black">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white">
                    Affiliate Tracking Audit Record
                  </h3>
                  <p className="text-xs font-mono text-slate-500">
                    {selectedPurchase.trackingId}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDetailDrawerOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              
              {/* Product Info Banner */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                <img
                  src={selectedPurchase.image}
                  alt={selectedPurchase.product}
                  className="w-16 h-16 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shrink-0"
                />
                <div className="flex-1">
                  <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {selectedPurchase.product}
                  </div>
                  <div className="text-xs text-slate-500">
                    Platform: <span className="font-bold text-slate-700 dark:text-slate-300">{selectedPurchase.platform}</span> • Price: <span className="font-extrabold text-brand-600 dark:text-brand-400">₹{selectedPurchase.price.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                    Commission Earned: ₹{selectedPurchase.commission}
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs border border-emerald-200 dark:border-emerald-800/60">
                    {selectedPurchase.status}
                  </span>
                </div>
              </div>

              {/* Status Timeline (6 Stages) */}
              <div>
                <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider mb-3">
                  Authorized Conversion Timeline
                </h4>
                
                <div className="space-y-3 relative pl-6 border-l-2 border-brand-500">
                  <div className="relative">
                    <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-brand-600 text-white flex items-center justify-center text-[9px] font-bold">✓</span>
                    <div className="text-xs font-extrabold text-slate-900 dark:text-white">1. Compared on SmartDeals</div>
                    <div className="text-[11px] text-slate-500">{selectedPurchase.comparedAt} • User searched Samsung Galaxy M14 5G</div>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-brand-600 text-white flex items-center justify-center text-[9px] font-bold">✓</span>
                    <div className="text-xs font-extrabold text-slate-900 dark:text-white">2. Clicked External Platform (Amazon)</div>
                    <div className="text-[11px] text-slate-500">{selectedPurchase.clickedAt} • Affiliate token generated & tagged</div>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-brand-600 text-white flex items-center justify-center text-[9px] font-bold">✓</span>
                    <div className="text-xs font-extrabold text-slate-900 dark:text-white">3. Purchase Detected on External Store</div>
                    <div className="text-[11px] text-slate-500">{selectedPurchase.purchasedAt} • Order #{selectedPurchase.orderRef}</div>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-brand-600 text-white flex items-center justify-center text-[9px] font-bold">✓</span>
                    <div className="text-xs font-extrabold text-slate-900 dark:text-white">4. Pending Partner Verification</div>
                    <div className="text-[11px] text-slate-500">Partner webhook payload authenticated with HMAC SHA-256 signature</div>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold">✓</span>
                    <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">5. Confirmed & Validated</div>
                    <div className="text-[11px] text-slate-500">Affiliate conversion verified against SmartDeals tracking parameters</div>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold">✓</span>
                    <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">6. Commission Eligible</div>
                    <div className="text-[11px] text-slate-500">Credited to SmartDeals platform partner treasury balance</div>
                  </div>
                </div>
              </div>

              {/* Anonymized Webhook Payload Preview */}
              <div>
                <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider mb-2">
                  Verified Inbound Webhook Payload (Strict Zero-PII)
                </h4>
                <pre className="p-3 rounded-2xl bg-slate-950 text-emerald-400 text-[11px] font-mono overflow-x-auto border border-slate-800">
{JSON.stringify({
  event: "AFFILIATE_PURCHASE_VERIFIED",
  trackingId: selectedPurchase.trackingId,
  anonymousUserId: selectedPurchase.user,
  platform: selectedPurchase.platform,
  itemSku: "SAM-M14-5G-128",
  orderAmountINR: selectedPurchase.price,
  commissionAmountINR: selectedPurchase.commission,
  signature: selectedPurchase.verifiedHash,
  piiRemoved: true,
  status: "CONFIRMED"
}, null, 2)}
                </pre>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-500" />
                <span>Encrypted & Authorized by SmartDeals Privacy Shield</span>
              </div>
              <button
                onClick={() => setIsDetailDrawerOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
              >
                Close Record
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          LIVE FLOATING NOTIFICATION TOAST
         ========================================================================= */}
      {activeToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 text-white rounded-3xl p-4 shadow-2xl border-2 border-brand-500/60 animate-slideUp flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-md animate-pulse">
            <Bell className="w-5 h-5 text-amber-300" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs text-white">
                {activeToast.title}
              </span>
              <button onClick={() => setActiveToast(null)} className="text-slate-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-xs font-bold text-slate-200 mt-0.5">
              {activeToast.product}
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
              <span>Platform: <strong className="text-amber-400">{activeToast.platform}</strong></span>
              <span>•</span>
              <span>User: <strong className="text-brand-400 font-mono">{activeToast.user}</strong></span>
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800">
              <span className="font-black text-white text-xs">₹{activeToast.price.toLocaleString('en-IN')}</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                Confirmed ✓
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
