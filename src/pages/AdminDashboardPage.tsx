import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldAlert,
  Users,
  Store,
  ShoppingBag,
  Coins,
  Percent,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  XCircle,
  Clock,
  Sliders,
  Sparkles,
  BarChart3,
  FileCheck,
  Package,
  Radio,
  ArrowUpRight,
  Search,
  Filter,
  Download,
  ExternalLink,
  Eye,
  ArrowRight,
  MousePointerClick,
  RefreshCw,
  Smartphone,
  Laptop,
  LogOut,
  Check,
  AlertTriangle,
  ChevronRight,
  Activity,
  Calendar,
  ShieldCheck,
  Layers,
  UserCheck,
  UserX,
  FileSpreadsheet,
  Settings,
  HelpCircle,
  Zap,
  Globe,
  Tag,
  AlertCircle,
  Database,
  FolderKanban,
  Info
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { trackingService } from '../services/trackingService';
import { DatabaseAnalyticsView } from '../components/admin/DatabaseAnalyticsView';
import { AllCategoryDashboardView } from '../components/admin/AllCategoryDashboardView';
import { AdminSecurityGuard } from '../components/admin/AdminSecurityGuard';
import {
  TrackedUser,
  GuestSession,
  UserActivityLog,
  OutboundClickRecord,
  CommissionStatus,
  AffiliateConversion,
  CashbackTransaction,
  AuditLog,
  MarketplaceComplianceConfig
} from '../types';
import { marketplaceComplianceService } from '../services/marketplaceComplianceService';

type AdminTab =
  | 'all-category'
  | 'overview'
  | 'database'
  | 'users'
  | 'guests'
  | 'product-activity'
  | 'comparisons'
  | 'outbound-clicks'
  | 'conversions'
  | 'commissions'
  | 'cashback'
  | 'marketplaces'
  | 'reports'
  | 'audit-logs'
  | 'sellers'
  | 'settings';

export const AdminDashboardPage: React.FC = () => {
  const {
    role,
    setRole,
    currentUser,
    products,
    seller,
    updateSellerKYC,
    commissionSlabs,
    updateCommissionSlab,
    adminSettings,
    updateAdminSettings,
    setIsSmsCenterOpen
  } = useApp();

  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Trigger re-render after mutations
  const [version, setVersion] = useState(0);
  const refreshData = () => setVersion(v => v + 1);

  // Filters & State
  const [userSearch, setUserSearch] = useState('');
  const [guestSearch, setGuestSearch] = useState('');
  const [clickSearch, setClickSearch] = useState('');
  const [selectedUserForTimeline, setSelectedUserForTimeline] = useState<TrackedUser | null>(null);
  const [selectedGuestForTimeline, setSelectedGuestForTimeline] = useState<GuestSession | null>(null);
  const [commissionStatusFilter, setCommissionStatusFilter] = useState<string>('ALL');
  const [commissionActionModal, setCommissionActionModal] = useState<OutboundClickRecord | null>(null);
  const [verificationNotes, setVerificationNotes] = useState('');

  // Editable settings
  const [coinRatio, setCoinRatio] = useState(adminSettings.coinRedemptionRate);
  const [maxCoins, setMaxCoins] = useState(adminSettings.maxCoinsPerOrder);
  const [dailyReward, setDailyReward] = useState(adminSettings.dailyLoginReward);
  const [savedSettingsMsg, setSavedSettingsMsg] = useState(false);

  // Dynamic Data fetch via trackingService
  const stats = useMemo(() => trackingService.getDashboardOverviewStats(), [version]);
  const usersList = useMemo(() => trackingService.getUsers(), [version]);
  const guestsList = useMemo(() => trackingService.getGuests(), [version]);
  const outboundClicks = useMemo(() => trackingService.getOutboundClicks(), [version]);
  const allActivities = useMemo(() => trackingService.getActivities(), [version]);
  const marketplaceStats = useMemo(() => trackingService.getMarketplaceStats(), [version]);
  const productActivityStats = useMemo(() => trackingService.getProductActivityStats(), [version]);
  const conversionsList = useMemo(() => trackingService.getConversions(), [version]);
  const cashbackTxList = useMemo(() => trackingService.getCashbackTransactions(), [version]);
  const auditLogsList = useMemo(() => trackingService.getAuditLogs(), [version]);
  const [reversalOrderRef, setReversalOrderRef] = useState('171-1234567-890123');
  const [reversalReason, setReversalReason] = useState('Customer returned item to marketplace. Verified commission clawback.');
  const [reversalSuccessMsg, setReversalSuccessMsg] = useState<string | null>(null);

  // Marketplace Compliance States & Handlers
  const [complianceList, setComplianceList] = useState<MarketplaceComplianceConfig[]>(() =>
    marketplaceComplianceService.getAllComplianceConfigs()
  );
  const [approvalModalStore, setApprovalModalStore] = useState<MarketplaceComplianceConfig | null>(null);
  const [approvalRefInput, setApprovalRefInput] = useState('');
  const [complianceSuccessMsg, setComplianceSuccessMsg] = useState<string | null>(null);

  const handleToggleWrittenApproval = (config: MarketplaceComplianceConfig) => {
    if (config.writtenApprovalObtained) {
      marketplaceComplianceService.setWrittenApproval(config.marketplaceId, false);
      trackingService.logAuditEvent(
        'U10001',
        'admin@smartdeal.com',
        'COMPLIANCE_REVOKE_APPROVAL',
        'MarketplaceCompliance',
        config.marketplaceId,
        {
          message: `Revoked written approval for ${config.marketplaceName}. Tracking and alerts are now paused.`
        }
      );
      setComplianceList(marketplaceComplianceService.getAllComplianceConfigs());
      setComplianceSuccessMsg(`Revoked written approval for ${config.marketplaceName}. Tracking and alerts paused.`);
      setTimeout(() => setComplianceSuccessMsg(null), 4000);
      refreshData();
    } else {
      setApprovalModalStore(config);
      setApprovalRefInput(`${config.marketplaceId.toUpperCase()}-WRITTEN-APP-${Date.now().toString().slice(-6)}`);
    }
  };

  const handleConfirmWrittenApproval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!approvalModalStore) return;
    const ref = approvalRefInput.trim() || `WRITTEN-APP-${Date.now()}`;
    marketplaceComplianceService.setWrittenApproval(approvalModalStore.marketplaceId, true, ref);
    trackingService.logAuditEvent(
      'U10001',
      'admin@smartdeal.com',
      'COMPLIANCE_GRANT_APPROVAL',
      'MarketplaceCompliance',
      approvalModalStore.marketplaceId,
      {
        refId: ref,
        message: `Recorded verified written approval for ${approvalModalStore.marketplaceName}. Enabled tracking strictly for this marketplace.`
      }
    );
    setComplianceList(marketplaceComplianceService.getAllComplianceConfigs());
    setComplianceSuccessMsg(`Verified written approval recorded for ${approvalModalStore.marketplaceName}. Ref: ${ref}`);
    setApprovalModalStore(null);
    setApprovalRefInput('');
    setTimeout(() => setComplianceSuccessMsg(null), 4000);
    refreshData();
  };

  const handleToggleTracking = (marketplaceId: string, currentVal: boolean) => {
    const config = marketplaceComplianceService.getComplianceConfig(marketplaceId);
    if (marketplaceId === 'amazon' && !config.writtenApprovalObtained && !currentVal) {
      alert('Amazon Associates Operating Agreement Section 4 requires written approval before price tracking can be enabled.');
      return;
    }
    marketplaceComplianceService.updateMarketplaceCompliance(marketplaceId, {
      priceTrackingAllowed: !currentVal
    });
    trackingService.logAuditEvent(
      'U10001',
      'admin@smartdeal.com',
      'COMPLIANCE_UPDATE_TRACKING',
      'MarketplaceCompliance',
      marketplaceId,
      { priceTrackingAllowed: !currentVal }
    );
    setComplianceList(marketplaceComplianceService.getAllComplianceConfigs());
    refreshData();
  };

  const handleToggleAlerts = (marketplaceId: string, currentVal: boolean) => {
    const config = marketplaceComplianceService.getComplianceConfig(marketplaceId);
    if (marketplaceId === 'amazon' && !config.writtenApprovalObtained && !currentVal) {
      alert('Amazon Associates Operating Agreement Section 4 requires written approval before price alerts can be enabled.');
      return;
    }
    marketplaceComplianceService.updateMarketplaceCompliance(marketplaceId, {
      priceAlertsAllowed: !currentVal
    });
    trackingService.logAuditEvent(
      'U10001',
      'admin@smartdeal.com',
      'COMPLIANCE_UPDATE_ALERTS',
      'MarketplaceCompliance',
      marketplaceId,
      { priceAlertsAllowed: !currentVal }
    );
    setComplianceList(marketplaceComplianceService.getAllComplianceConfigs());
    refreshData();
  };

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/admin/all-category') || path.includes('/admin/categories') || path.includes('/admin/all-data')) setActiveTab('all-category');
    else if (path.includes('/admin/database') || path.includes('/admin/analytics')) setActiveTab('database');
    else if (path.includes('/admin/users')) setActiveTab('users');
    else if (path.includes('/admin/guest-sessions') || path.includes('/admin/guests')) setActiveTab('guests');
    else if (path.includes('/admin/product-activity') || path.includes('/admin/products')) setActiveTab('product-activity');
    else if (path.includes('/admin/comparisons')) setActiveTab('comparisons');
    else if (path.includes('/admin/outbound-clicks')) setActiveTab('outbound-clicks');
    else if (path.includes('/admin/conversions')) setActiveTab('conversions');
    else if (path.includes('/admin/commissions')) setActiveTab('commissions');
    else if (path.includes('/admin/cashback')) setActiveTab('cashback');
    else if (path.includes('/admin/marketplaces')) setActiveTab('marketplaces');
    else if (path.includes('/admin/reports')) setActiveTab('reports');
    else if (path.includes('/admin/audit-logs')) setActiveTab('audit-logs');
    else if (path.includes('/admin/settings')) setActiveTab('settings');
  }, [location.pathname]);



  // Handle Commission Status Update
  const handleUpdateCommission = (newStatus: CommissionStatus) => {
    if (!commissionActionModal) return;
    trackingService.updateCommissionStatus(commissionActionModal.click_id, newStatus, verificationNotes);
    setCommissionActionModal(null);
    setVerificationNotes('');
    refreshData();
  };

  // CSV Export Handler
  const handleExport = (type: 'users' | 'guests' | 'clicks' | 'commissions' | 'conversions' | 'cashback' | 'audit_logs') => {
    const csvContent = trackingService.exportCSV(type);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `smartdeal_${type}_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmConversion = (conversionId: string) => {
    const res = trackingService.confirmConversion(conversionId);
    if (res.success) {
      refreshData();
    }
  };

  const handleProcessReversal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reversalOrderRef) return;
    const res = trackingService.processReturnAndReversal({
      orderRef: reversalOrderRef,
      reason: reversalReason
    });
    if (res.success) {
      setReversalSuccessMsg(`Reversal successful! Order ${reversalOrderRef} reversed ₹${res.reversedAmount || 0} user cashback liability.`);
      refreshData();
    } else {
      setReversalSuccessMsg(`Reversal note: ${res.message}`);
    }
    setTimeout(() => setReversalSuccessMsg(null), 6000);
  };

  // Filtered Lists
  const filteredUsers = usersList.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.user_id.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredGuests = guestsList.filter(g =>
    g.guest_id.toLowerCase().includes(guestSearch.toLowerCase()) ||
    g.ip_address.includes(guestSearch) ||
    g.device_info.toLowerCase().includes(guestSearch.toLowerCase())
  );

  const filteredClicks = outboundClicks.filter(c => {
    const matchesQuery =
      c.click_id.toLowerCase().includes(clickSearch.toLowerCase()) ||
      c.product_name.toLowerCase().includes(clickSearch.toLowerCase()) ||
      c.marketplace.toLowerCase().includes(clickSearch.toLowerCase()) ||
      c.user_identifier.toLowerCase().includes(clickSearch.toLowerCase());
    const matchesStatus = commissionStatusFilter === 'ALL' || c.commission_status === commissionStatusFilter;
    return matchesQuery && matchesStatus;
  });

  const comparisonLogs = allActivities.filter(a => a.action_type === 'COMPARE_PRODUCT');

  // Colors for charts
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#f97316'];

  return (
    <AdminSecurityGuard>
      <div className="max-w-[1600px] mx-auto px-4 py-6 space-y-6">
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-orange-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-rose-600/40">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">SmartDeal Command Center</h1>
                <span className="text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2.5 py-0.5 rounded-full uppercase">
                  Super Admin
                </span>
                <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Auditing Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                User & Guest tracking, Outbound SKU redirects, Commission lifecycle verification, and Marketplace Intelligence
              </p>
            </div>
          </div>

          {/* Quick Admin Profile & Perspective controls */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="bg-white/5 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 text-xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-200 font-black">
                {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'AD'}
              </div>
              <div>
                <div className="font-bold text-white text-xs">{currentUser?.name || 'Administrator'}</div>
                <div className="text-[10px] text-slate-400">{currentUser?.email || 'admin@smartdeal.com'}</div>
              </div>
            </div>

            <button
              onClick={() => setIsSmsCenterOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Smartphone className="w-4 h-4 text-emerald-300 animate-pulse" />
              <span>Owner SMS (7217514087)</span>
            </button>

            <button
              onClick={() => {
                setRole('USER');
                navigate('/');
              }}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white text-xs font-bold transition-all border border-white/10 flex items-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Customer View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Horizontal Tab Ribbon (Visible < lg) */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {[
          { key: 'all-category', label: 'All Category', icon: FolderKanban },
          { key: 'database', label: 'Live SQL', icon: Database },
          { key: 'overview', label: 'Overview', icon: BarChart3 },
          { key: 'users', label: 'Users', icon: Users },
          { key: 'guests', label: 'Guests', icon: Globe },
          { key: 'product-activity', label: 'Products', icon: Tag },
          { key: 'comparisons', label: 'Comparisons', icon: Layers },
          { key: 'outbound-clicks', label: 'Clicks', icon: MousePointerClick },
          { key: 'conversions', label: 'Conversions', icon: ShoppingBag },
          { key: 'commissions', label: 'Commissions', icon: Percent },
          { key: 'cashback', label: 'Cashback', icon: Sparkles },
          { key: 'marketplaces', label: 'Marketplaces', icon: Store },
          { key: 'reports', label: 'Reports', icon: FileSpreadsheet },
          { key: 'audit-logs', label: 'Security', icon: ShieldCheck },
          { key: 'sellers', label: 'Sellers', icon: UserCheck },
          { key: 'settings', label: 'Rules', icon: Settings }
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as AdminTab)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-400'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Layout: 11-Item Sidebar + Content Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Navigation (Visible on lg+) */}
        <aside className="hidden lg:block lg:col-span-3 xl:col-span-2 space-y-2">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-3 shadow-sm space-y-1 text-xs font-bold">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 py-2">
              Intelligence & Metrics
            </div>

            {/* All Category Data Dashboard */}
            <button
              onClick={() => setActiveTab('all-category')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'all-category'
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FolderKanban className="w-4 h-4 text-amber-400" />
                <span>All Category</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                All Data
              </span>
            </button>

            <button
              onClick={() => setActiveTab('database')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'database'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-cyan-400" />
                <span>Database & Live Analytics</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                Live SQL
              </span>
            </button>

            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-4 h-4" />
                <span>Overview</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/20">10 KPIs</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span>Users ({usersList.length})</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('guests')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'guests'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4" />
                <span>Guest Sessions ({guestsList.length})</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('product-activity')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'product-activity'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Tag className="w-4 h-4" />
                <span>Product Activity</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('comparisons')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'comparisons'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4" />
                <span>Store Comparisons</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10">
                {comparisonLogs.length}
              </span>
            </button>

            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 pt-3 pb-2">
              Affiliate & Monetization
            </div>

            <button
              onClick={() => setActiveTab('outbound-clicks')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'outbound-clicks'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Outbound Clicks</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                {outboundClicks.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('commissions')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'commissions'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <DollarSign className="w-4 h-4" />
                <span>Commission Lifecycle</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">
                ₹{stats.totalPendingCommissions} Pend
              </span>
            </button>

            <button
              onClick={() => setActiveTab('conversions')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'conversions'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Affiliate Conversions</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                {conversionsList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('cashback')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'cashback'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Cashback & Reversals</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">
                ₹{stats.cashbackAvailable}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('marketplaces')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'marketplaces'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Store className="w-4 h-4" />
                <span>Marketplace Stats</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'reports'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-4 h-4" />
                <span>Reports & CSV Export</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('audit-logs')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'audit-logs'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Security Audit Logs</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 pt-3 pb-2">
              Configuration
            </div>

            <button
              onClick={() => setActiveTab('sellers')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'sellers'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-4 h-4" />
                <span>Sellers & KYC</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4" />
                <span>System Rules</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>
          </div>
        </aside>

        {/* Content Panel */}
        <main className="lg:col-span-9 xl:col-span-10 space-y-6">
          {/* TAB 0: ALL CATEGORY DATA DASHBOARD */}
          {activeTab === 'all-category' && (
            <div className="space-y-6 animate-fadeIn">
              <AllCategoryDashboardView />
            </div>
          )}

          {/* TAB 1: DATABASE & LIVE ANALYTICS (Matches Reference Design) */}
          {activeTab === 'database' && (
            <div className="space-y-6 animate-fadeIn">
              <DatabaseAnalyticsView onRefreshData={refreshData} />
            </div>
          )}

          {/* TAB 1: OVERVIEW — 10 REAL KPI METRICS (DYNAMICALLY CALCULATED) */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Top 10 Dynamic Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                {/* 1. Registered Users */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider">Registered Users</span>
                    <Users className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {stats.totalRegisteredUsers}
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                    +100% SHA-256 secure
                  </div>
                </div>

                {/* 2. Active Guests */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider">Guest Sessions</span>
                    <Globe className="w-3.5 h-3.5 text-indigo-500" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {stats.activeGuestSessions}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    Anonymous session IDs
                  </div>
                </div>

                {/* 3. Products Tracked */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider">Products Tracked</span>
                    <Package className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {stats.totalProductsTracked}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    All shopping categories
                  </div>
                </div>

                {/* 4. Searches Logged */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider">Product Searches</span>
                    <Search className="w-3.5 h-3.5 text-purple-500" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {stats.totalProductSearches}
                  </div>
                  <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                    Queries analyzed
                  </div>
                </div>

                {/* 5. Product Views */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider">Product Views</span>
                    <Eye className="w-3.5 h-3.5 text-teal-500" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {stats.totalProductViews}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    Detailed SKU view events
                  </div>
                </div>

                {/* 6. Product Comparisons */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider">Comparisons Done</span>
                    <Layers className="w-3.5 h-3.5 text-cyan-500" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {stats.totalProductComparisons}
                  </div>
                  <div className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold">
                    Multi-store audits
                  </div>
                </div>

                {/* 7. Outbound Clicks */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider">Outbound Clicks</span>
                    <MousePointerClick className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {stats.totalOutboundClicks}
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                    Direct merchant redirects
                  </div>
                </div>

                {/* 8. Pending Commissions */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider">Pending Comm.</span>
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <div className="text-2xl font-black text-amber-500">
                    ₹{stats.totalPendingCommissions.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    Awaiting return window
                  </div>
                </div>

                {/* 9. Confirmed Commissions */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider">Confirmed Comm.</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    ₹{stats.totalConfirmedCommissions.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                    Verified affiliate revenue
                  </div>
                </div>

                {/* 10. Net Platform Earnings */}
                <div className="bg-gradient-to-tr from-slate-900 to-rose-950 text-white p-4 rounded-3xl border border-rose-900/50 shadow-md space-y-1">
                  <div className="flex items-center justify-between text-rose-300">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider">Net Platform Profit</span>
                    <DollarSign className="w-3.5 h-3.5 text-rose-400" />
                  </div>
                  <div className="text-2xl font-black text-rose-300">
                    ₹{stats.netPlatformEarnings.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-bold">
                    Real-time reconciled
                  </div>
                </div>
              </div>

              {/* Interactive Performance Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Outbound Clicks by Marketplace Bar Chart */}
                <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                        Marketplace Outbound Clicks & Conversion
                      </h3>
                      <p className="text-xs text-slate-400">Direct user redirects vs confirmed commission orders</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-xl border border-emerald-500/30">
                      Live Stream
                    </span>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={marketplaceStats}>
                        <XAxis dataKey="marketplace" stroke="#64748b" tick={{ fontSize: 11 }} />
                        <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '1rem', color: '#fff' }}
                        />
                        <Bar dataKey="total_clicks" name="Outbound Clicks" fill="#6366f1" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="confirmed_orders" name="Confirmed Orders" fill="#10b981" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Marketplace GMV Share Pie Chart */}
                <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                        Estimated External GMV by Store (₹)
                      </h3>
                      <p className="text-xs text-slate-400">Total basket value sent to external merchants</p>
                    </div>
                  </div>

                  <div className="h-64 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={marketplaceStats}
                          dataKey="estimated_gmv"
                          nameKey="marketplace"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          innerRadius={45}
                          paddingAngle={4}
                        >
                          {marketplaceStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '1rem', color: '#fff' }}
                          formatter={(v: any) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Est. GMV']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Recent Real-Time Outbound Feed */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                      Recent Outbound Redirect Stream
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('outbound-clicks')}
                    className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All {outboundClicks.length} Clicks</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {outboundClicks.slice(0, 5).map(click => (
                    <div key={click.click_id} className="py-3 flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                          {click.click_id}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{click.product_name}</div>
                          <div className="text-[11px] text-slate-400">
                            Merchant: <strong className="text-slate-700 dark:text-slate-300">{click.marketplace}</strong> • Shopper: {click.user_identifier}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-black text-slate-900 dark:text-white">
                            ₹{click.price_at_click.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Est Comm: ₹{click.estimated_commission}
                          </div>
                        </div>

                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          click.commission_status === 'CONFIRMED'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : click.commission_status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}>
                          {click.commission_status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REGISTERED USERS LIST + TIMELINE MODAL */}
          {activeTab === 'users' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="font-extrabold text-slate-900 dark:text-white text-base">
                    Registered User Profiles & Activity Audits
                  </h2>
                  <p className="text-xs text-slate-400">
                    Passwords secured with SHA-256 cryptographic hashing. Click any user to inspect their live activity timeline.
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                    placeholder="Search name, email, ID..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      <th className="py-3 px-3">User</th>
                      <th className="py-3 px-3">Contact</th>
                      <th className="py-3 px-3">Account Created</th>
                      <th className="py-3 px-3">Last Login</th>
                      <th className="py-3 px-3">Activities</th>
                      <th className="py-3 px-3">Total Spend</th>
                      <th className="py-3 px-3">Role & Status</th>
                      <th className="py-3 px-3 text-right">Audit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredUsers.map(u => (
                      <tr key={u.user_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                          <div className="font-mono text-[10px] text-slate-400">{u.user_id}</div>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="text-slate-800 dark:text-slate-200">{u.email}</div>
                          <div className="text-[11px] text-slate-400">{u.phone}</div>
                        </td>
                        <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400">{u.created_at}</td>
                        <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400">{u.last_login}</td>
                        <td className="py-3.5 px-3">
                          <span className="font-extrabold text-slate-900 dark:text-white">{u.total_activities}</span>
                          <span className="text-[10px] text-slate-400 ml-1">events</span>
                        </td>
                        <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white">
                          ₹{u.total_spend.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            u.role === 'ADMIN'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <button
                            onClick={() => setSelectedUserForTimeline(u)}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-rose-600 dark:hover:bg-rose-700 text-white font-bold text-[11px] transition-all cursor-pointer shadow-xs"
                          >
                            View Timeline
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ANONYMOUS GUEST SESSIONS */}
          {activeTab === 'guests' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="font-extrabold text-slate-900 dark:text-white text-base">
                    Anonymous Guest Sessions
                  </h2>
                  <p className="text-xs text-slate-400">
                    Track shoppers who explore, compare, and click without creating an account (No unnecessary PII stored).
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    value={guestSearch}
                    onChange={e => setGuestSearch(e.target.value)}
                    placeholder="Search guest ID, IP, device..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      <th className="py-3 px-3">Guest Session ID</th>
                      <th className="py-3 px-3">Session Started</th>
                      <th className="py-3 px-3">Last Active</th>
                      <th className="py-3 px-3">Device / Browser</th>
                      <th className="py-3 px-3">IP Address</th>
                      <th className="py-3 px-3">Total Activities</th>
                      <th className="py-3 px-3">Outbound Clicks</th>
                      <th className="py-3 px-3 text-right">Audit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredGuests.map(g => (
                      <tr key={g.guest_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-3.5 px-3">
                          <span className="font-mono font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                            {g.guest_id}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400">{g.first_visit}</td>
                        <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400">{g.last_active}</td>
                        <td className="py-3.5 px-3 text-slate-700 dark:text-slate-300 font-medium">
                          {g.device_info}
                        </td>
                        <td className="py-3.5 px-3 font-mono text-slate-400">{g.ip_address}</td>
                        <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white">
                          {g.total_activities}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="font-black text-emerald-600 dark:text-emerald-400">
                            {g.outbound_clicks_count}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <button
                            onClick={() => setSelectedGuestForTimeline(g)}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-[11px] transition-all cursor-pointer"
                          >
                            Guest Timeline
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: PRODUCT ACTIVITY (ACROSS ALL CATEGORIES) */}
          {activeTab === 'product-activity' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div>
                  <h2 className="font-extrabold text-slate-900 dark:text-white text-base">
                    Product Engagement Across All Categories
                  </h2>
                  <p className="text-xs text-slate-400">
                    Aggregated discovery metrics across Mobiles, Laptops, Fashion, Shoes, Beauty, Electronics & Home Appliances
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Most Viewed Products */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
                    <h3 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                      <Eye className="w-4 h-4 text-blue-500" />
                      <span>Most Viewed Products</span>
                    </h3>
                    <div className="space-y-2">
                      {productActivityStats.mostViewed.map(item => (
                        <div key={item.product_id} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-between text-xs border border-slate-100 dark:border-slate-800">
                          <div className="min-w-0 flex-1 pr-2">
                            <div className="font-bold text-slate-800 dark:text-slate-200 truncate">{item.product_name}</div>
                            <div className="text-[10px] text-slate-400">{item.category}</div>
                          </div>
                          <span className="font-black text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60">
                            {item.view_count} views
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Most Clicked to Outbound Merchants */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
                    <h3 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                      <MousePointerClick className="w-4 h-4 text-emerald-500" />
                      <span>Most Clicked Outbound SKUs</span>
                    </h3>
                    <div className="space-y-2">
                      {productActivityStats.mostClicked.map(item => (
                        <div key={item.product_id} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-between text-xs border border-slate-100 dark:border-slate-800">
                          <div className="min-w-0 flex-1 pr-2">
                            <div className="font-bold text-slate-800 dark:text-slate-200 truncate">{item.product_name}</div>
                            <div className="text-[10px] text-slate-400">Total Redirects</div>
                          </div>
                          <span className="font-black text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60">
                            {item.click_count} redirects
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Popular Search Keywords */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
                  <h3 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                    <Search className="w-4 h-4 text-purple-500" />
                    <span>Top Search Query Trends</span>
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    {productActivityStats.topSearches.map(item => (
                      <span key={item.query} className="px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <span>"{item.query}"</span>
                        <span className="text-[10px] text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-1.5 py-0.2 rounded-md">
                          {item.count} searches
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: COMPARISON AUDIT STREAM */}
          {activeTab === 'comparisons' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 animate-fadeIn text-xs">
              <div>
                <h2 className="font-extrabold text-slate-900 dark:text-white text-base">
                  Multi-Store Price Comparison Audit Stream
                </h2>
                <p className="text-slate-400">
                  Detailed logs whenever users audit prices across Amazon, Flipkart, Croma, Myntra, Ajio and other retailers
                </p>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {comparisonLogs.map(log => (
                  <div key={log.log_id} className="py-3.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{log.product_name}</span>
                        <span className="text-[10px] text-slate-400">({log.category})</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">{log.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-[11px] flex-wrap">
                      <span>Shopper: <strong className="text-slate-700 dark:text-slate-300">{log.user_id ? `User: ${log.user_id}` : `Guest: ${log.guest_id}`}</strong></span>
                      <span>• Stores Audited: <strong className="text-slate-700 dark:text-slate-300">{log.details.storesCompared?.join(', ') || 'Amazon, Flipkart'}</strong></span>
                      {log.details.lowestPrice && (
                        <span>• Price Spread: <strong className="text-emerald-500">₹{log.details.lowestPrice}</strong> to <strong>₹{log.details.highestPrice}</strong></span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: OUTBOUND CLICKS STREAM */}
          {activeTab === 'outbound-clicks' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 animate-fadeIn text-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="font-extrabold text-slate-900 dark:text-white text-base">
                    Outbound Product Click Logs
                  </h2>
                  <p className="text-slate-400">
                    Real-time deep-link redirects to exact merchant product pages with affiliate tracking parameters
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={commissionStatusFilter}
                    onChange={e => setCommissionStatusFilter(e.target.value)}
                    className="p-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="CLICKED">Clicked</option>
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>

                  <div className="relative flex-1 sm:w-56">
                    <input
                      type="text"
                      value={clickSearch}
                      onChange={e => setClickSearch(e.target.value)}
                      placeholder="Search click ID, item, store..."
                      className="w-full pl-8 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      <th className="py-3 px-3">Click ID</th>
                      <th className="py-3 px-3">Product Name</th>
                      <th className="py-3 px-3">Merchant</th>
                      <th className="py-3 px-3">Shopper</th>
                      <th className="py-3 px-3">Price at Click</th>
                      <th className="py-3 px-3">Exact SKU Deep Link</th>
                      <th className="py-3 px-3">Timestamp</th>
                      <th className="py-3 px-3">Commission Status</th>
                      <th className="py-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredClicks.map(c => (
                      <tr key={c.click_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-3.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                          {c.click_id}
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-slate-900 dark:text-white max-w-xs truncate">{c.product_name}</div>
                          <div className="text-[10px] text-slate-400">{c.category}</div>
                        </td>
                        <td className="py-3.5 px-3 font-bold text-slate-800 dark:text-slate-200">
                          {c.marketplace}
                        </td>
                        <td className="py-3.5 px-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                          {c.user_identifier}
                        </td>
                        <td className="py-3.5 px-3 font-black text-slate-900 dark:text-white">
                          ₹{c.price_at_click.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-3">
                          <a
                            href={c.exact_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline max-w-xs truncate font-mono text-[10px]"
                            title={c.exact_url}
                          >
                            <span className="truncate">{c.exact_url}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        </td>
                        <td className="py-3.5 px-3 text-slate-400 text-[11px]">{c.timestamp}</td>
                        <td className="py-3.5 px-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            c.commission_status === 'CONFIRMED'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : c.commission_status === 'PENDING'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          }`}>
                            {c.commission_status}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <button
                            onClick={() => {
                              setCommissionActionModal(c);
                              setVerificationNotes(c.notes || '');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-[10px] transition-colors cursor-pointer"
                          >
                            Verify / Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: COMMISSIONS LIFECYCLE MANAGEMENT */}
          {activeTab === 'commissions' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 animate-fadeIn text-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="font-extrabold text-slate-900 dark:text-white text-base">
                    Commission Lifecycle & Reconciliation
                  </h2>
                  <p className="text-slate-400">
                    Rule: Clicking does not imply purchase. Commissions start at <strong>CLICKED</strong> or <strong>PENDING</strong>, transitioning to <strong>CONFIRMED</strong> only after merchant validation and return window clearance.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 p-2.5 rounded-2xl text-center">
                    <div className="text-[10px] font-bold text-amber-700 dark:text-amber-400">Pending Amount</div>
                    <div className="text-base font-black text-amber-600 dark:text-amber-300">
                      ₹{stats.totalPendingCommissions.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60 p-2.5 rounded-2xl text-center">
                    <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">Confirmed Amount</div>
                    <div className="text-base font-black text-emerald-600 dark:text-emerald-300">
                      ₹{stats.totalConfirmedCommissions.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {outboundClicks.map(click => (
                  <div key={click.click_id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {click.product_name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          {click.click_id}
                        </span>
                      </div>
                      <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                        Marketplace: <strong className="text-slate-700 dark:text-slate-300">{click.marketplace}</strong> • Price at Click: ₹{click.price_at_click.toLocaleString('en-IN')} • Estimated Platform Commission: <strong className="text-brand-600 dark:text-brand-400">₹{click.estimated_commission}</strong>
                      </div>
                      {click.notes && (
                        <div className="text-[11px] text-slate-400 italic">
                          Audit Note: {click.notes}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                        click.commission_status === 'CONFIRMED'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : click.commission_status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}>
                        {click.commission_status}
                      </span>

                      <button
                        onClick={() => {
                          setCommissionActionModal(click);
                          setVerificationNotes(click.notes || '');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs transition-colors cursor-pointer"
                      >
                        Verify / Settle
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: MARKETPLACE ANALYTICS & COMPLIANCE */}
          {activeTab === 'marketplaces' && (
            <div className="space-y-6">
              {complianceSuccessMsg && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{complianceSuccessMsg}</span>
                </div>
              )}

              {/* Performance Breakdown */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 animate-fadeIn text-xs">
                <div>
                  <h2 className="font-extrabold text-slate-900 dark:text-white text-base">
                    Marketplace Performance Breakdown
                  </h2>
                  <p className="text-slate-400">
                    Performance across all supported partner platforms (Amazon, Flipkart, Meesho, Myntra, Ajio, Tata CLiQ, Croma, Reliance Digital)
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                  {marketplaceStats.map(store => (
                    <div key={store.marketplace} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-sm text-slate-900 dark:text-white">{store.marketplace}</span>
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                          {store.total_clicks} Clicks
                        </span>
                      </div>

                      <div className="space-y-1 text-slate-600 dark:text-slate-300 text-[11px]">
                        <div className="flex justify-between">
                          <span>Confirmed Orders:</span>
                          <strong className="text-emerald-600 dark:text-emerald-400">{store.confirmed_orders}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Estimated GMV:</span>
                          <strong className="text-slate-900 dark:text-white">₹{store.estimated_gmv.toLocaleString('en-IN')}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Commission Revenue:</span>
                          <strong className="text-amber-600 dark:text-amber-400">₹{store.commission_earned}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Conversion Rate:</span>
                          <strong className="text-indigo-600 dark:text-indigo-400">
                            {store.total_clicks > 0 ? ((store.confirmed_orders / store.total_clicks) * 100).toFixed(1) : 0}%
                          </strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Marketplace Affiliate Policy & Compliance Manager */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 animate-fadeIn text-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                      <h2 className="font-extrabold text-slate-900 dark:text-white text-base">
                        Marketplace Affiliate Policy & Compliance Manager
                      </h2>
                    </div>
                    <p className="text-slate-400">
                      Granular, isolated compliance per marketplace. Amazon India price tracking & alerts are paused by default until advance written approval is recorded per Operating Agreement Section 4 & PA-API terms.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      Isolated Store Governance
                    </span>
                  </div>
                </div>

                {/* Compliance Governance Overview Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Registered Marketplaces</span>
                    <div className="text-base font-black text-slate-900 dark:text-white">{complianceList.length} Stores</div>
                    <p className="text-[10px] text-slate-500">Separately audited & configured</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                    <span className="text-emerald-600 dark:text-emerald-400 text-[10px] uppercase font-bold tracking-wider">Price Tracking Permitted</span>
                    <div className="text-base font-black text-emerald-600 dark:text-emerald-400">
                      {complianceList.filter(c => marketplaceComplianceService.isPriceTrackingAllowed(c.marketplaceId)).length} of {complianceList.length} Active
                    </div>
                    <p className="text-[10px] text-emerald-600/80">Flipkart, Croma, Reliance Digital, etc.</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                    <span className="text-emerald-600 dark:text-emerald-400 text-[10px] uppercase font-bold tracking-wider">Price Alerts Permitted</span>
                    <div className="text-base font-black text-emerald-600 dark:text-emerald-400">
                      {complianceList.filter(c => marketplaceComplianceService.isPriceAlertsAllowed(c.marketplaceId)).length} of {complianceList.length} Active
                    </div>
                    <p className="text-[10px] text-emerald-600/80">User drop alerts enabled where permitted</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 space-y-1">
                    <span className="text-amber-600 dark:text-amber-400 text-[10px] uppercase font-bold tracking-wider">Amazon India Gate</span>
                    <div className="text-base font-black text-amber-600 dark:text-amber-400">
                      {marketplaceComplianceService.isPriceTrackingAllowed('amazon') ? 'Written Approval Active' : 'Paused by Default (Safe)'}
                    </div>
                    <p className="text-[10px] text-amber-600/80">Operating Agreement Sec 4 Enforced</p>
                  </div>
                </div>

                {/* Marketplaces Compliance Matrix */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-800 dark:text-slate-200 text-xs">
                      Platform Policy Matrix & Approval Controls
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Changes logged to Audit Trail with full ledger immutability
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {complianceList.map(config => {
                      const isTrackingAllowed = marketplaceComplianceService.isPriceTrackingAllowed(config.marketplaceId);
                      const isAlertsAllowed = marketplaceComplianceService.isPriceAlertsAllowed(config.marketplaceId);
                      const isAmazon = config.marketplaceId === 'amazon';

                      return (
                        <div
                          key={config.marketplaceId}
                          className={`p-4 rounded-2xl border transition-all ${
                            isAmazon && !config.writtenApprovalObtained
                              ? 'bg-amber-500/[0.03] dark:bg-amber-500/[0.05] border-amber-500/30'
                              : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60'
                          }`}
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            {/* Marketplace Info */}
                            <div className="space-y-1 lg:w-1/4">
                              <div className="flex items-center gap-2">
                                <span className="font-black text-sm text-slate-900 dark:text-white">
                                  {config.marketplaceName}
                                </span>
                                <span
                                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                                    config.affiliateApprovalStatus === 'APPROVED' || config.writtenApprovalObtained
                                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40'
                                      : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/40'
                                  }`}
                                >
                                  {config.affiliateApprovalStatus}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono">
                                domain: {config.domain || 'Direct API'}
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                                {config.complianceDisclaimer}
                              </p>
                            </div>

                            {/* Permission Switches / Status */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 lg:w-1/2 text-[11px]">
                              {/* Price Tracking */}
                              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
                                <span className="text-slate-400 text-[10px]">Price Tracking</span>
                                <div className="flex items-center justify-between pt-1">
                                  <span className={`font-bold ${isTrackingAllowed ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`}>
                                    {isTrackingAllowed ? 'Permitted' : 'Paused'}
                                  </span>
                                  <button
                                    onClick={() => handleToggleTracking(config.marketplaceId, config.priceTrackingAllowed)}
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                                      config.priceTrackingAllowed
                                        ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                                    }`}
                                  >
                                    {config.priceTrackingAllowed ? 'ON' : 'OFF'}
                                  </button>
                                </div>
                              </div>

                              {/* Price Alerts */}
                              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
                                <span className="text-slate-400 text-[10px]">Price Alerts</span>
                                <div className="flex items-center justify-between pt-1">
                                  <span className={`font-bold ${isAlertsAllowed ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`}>
                                    {isAlertsAllowed ? 'Permitted' : 'Paused'}
                                  </span>
                                  <button
                                    onClick={() => handleToggleAlerts(config.marketplaceId, config.priceAlertsAllowed)}
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                                      config.priceAlertsAllowed
                                        ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                                    }`}
                                  >
                                    {config.priceAlertsAllowed ? 'ON' : 'OFF'}
                                  </button>
                                </div>
                              </div>

                              {/* Price Display */}
                              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
                                <span className="text-slate-400 text-[10px]">Price Display</span>
                                <div className="flex items-center justify-between pt-1">
                                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Live Sync</span>
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                                    SYNC
                                  </span>
                                </div>
                              </div>

                              {/* API Access */}
                              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
                                <span className="text-slate-400 text-[10px]">API Access</span>
                                <div className="flex items-center justify-between pt-1">
                                  <span className="font-bold text-cyan-600 dark:text-cyan-400">Permitted</span>
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300">
                                    API
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Written Approval Controls */}
                            <div className="flex flex-col justify-between items-start lg:items-end gap-2 lg:w-1/4">
                              <div className="space-y-0.5 text-left lg:text-right">
                                <div className="flex items-center gap-1.5 lg:justify-end">
                                  <span className="text-[10px] text-slate-400">Written Approval:</span>
                                  <strong className={`font-black ${config.writtenApprovalObtained ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`}>
                                    {config.writtenApprovalObtained ? '✓ Obtained' : 'Required'}
                                  </strong>
                                </div>
                                {config.writtenApprovalRef && (
                                  <div className="text-[10px] font-mono text-slate-400">
                                    Ref: {config.writtenApprovalRef}
                                  </div>
                                )}
                              </div>

                              <button
                                onClick={() => handleToggleWrittenApproval(config)}
                                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                                  config.writtenApprovalObtained
                                    ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 hover:bg-rose-100'
                                    : 'bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/20'
                                }`}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>{config.writtenApprovalObtained ? 'Revoke Approval' : 'Record Written Approval'}</span>
                              </button>
                            </div>
                          </div>

                          {/* Operating Agreement Policy Notes */}
                          {config.policyNotes && (
                            <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-1.5">
                              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                              <span>{config.policyNotes}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: AFFILIATE CONVERSIONS & POSTBACKS */}
          {activeTab === 'conversions' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 animate-fadeIn text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="font-extrabold text-slate-900 dark:text-white text-base">
                    Affiliate Network Conversions & Postback Ledger
                  </h2>
                  <p className="text-slate-400">
                    Section 6 & 11: Idempotent conversion records imported from authorized affiliate networks with separate commission & user cashback allocations.
                  </p>
                </div>
                <button
                  onClick={() => handleExport('conversions')}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Conversions CSV</span>
                </button>
              </div>

              {/* Conversion KPI Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Total Conversions</div>
                  <div className="text-xl font-black text-slate-900 dark:text-white">{conversionsList.length} Records</div>
                  <div className="text-[10px] text-emerald-500 font-medium">Idempotency Protected</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Gross Partner Commission</div>
                  <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                    ₹{conversionsList.filter(c => c.status === 'CONFIRMED').reduce((s, c) => s + c.commissionEarned, 0).toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-slate-400">Confirmed Revenue</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">User Cashback Allocation</div>
                  <div className="text-xl font-black text-amber-600 dark:text-amber-400">
                    ₹{conversionsList.filter(c => c.status === 'CONFIRMED').reduce((s, c) => s + c.userCashbackAllocation, 0).toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-slate-400">Customer Liability</div>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                  <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">SmartDeal Net Margin</div>
                  <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                    ₹{(
                      conversionsList.filter(c => c.status === 'CONFIRMED').reduce((s, c) => s + c.commissionEarned, 0) -
                      conversionsList.filter(c => c.status === 'CONFIRMED').reduce((s, c) => s + c.userCashbackAllocation, 0)
                    ).toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">Commission - Cashback</div>
                </div>
              </div>

              {/* Conversions Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-400">
                      <th className="py-3 px-3">Conversion ID / Order Ref</th>
                      <th className="py-3 px-3">Marketplace</th>
                      <th className="py-3 px-3">User / Guest</th>
                      <th className="py-3 px-3 text-right">Order Value</th>
                      <th className="py-3 px-3 text-right">Commission</th>
                      <th className="py-3 px-3 text-right">Cashback</th>
                      <th className="py-3 px-3 text-center">Status</th>
                      <th className="py-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                    {conversionsList.map(conv => (
                      <tr key={conv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900 dark:text-white">{conv.id}</div>
                          <div className="font-mono text-[10px] text-slate-400">Ref: {conv.orderRef}</div>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                          {conv.marketplace}
                        </td>
                        <td className="py-3 px-3 font-mono text-[10px] text-slate-500 dark:text-slate-400">
                          {conv.userId || conv.guestId || 'Guest'}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                          ₹{conv.saleAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          +₹{conv.commissionEarned}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-amber-600 dark:text-amber-400">
                          ₹{conv.userCashbackAllocation}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            conv.status === 'CONFIRMED'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : conv.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              : conv.status === 'REVERSED'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                          }`}>
                            {conv.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          {conv.status === 'PENDING' && (
                            <button
                              onClick={() => handleConfirmConversion(conv.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] cursor-pointer"
                            >
                              Confirm
                            </button>
                          )}
                          {conv.status === 'CONFIRMED' && (
                            <span className="text-slate-400 text-[10px]">Settled</span>
                          )}
                          {conv.status === 'REVERSED' && (
                            <span className="text-rose-400 text-[10px] font-bold">Clawed Back</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: CASHBACK LEDGER & REVERSIBLE CLAWBACK ENGINE */}
          {activeTab === 'cashback' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 animate-fadeIn text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="font-extrabold text-slate-900 dark:text-white text-base">
                    Cashback Wallet Ledger & Return Reversals (Section 11 & 12)
                  </h2>
                  <p className="text-slate-400">
                    Strict double-entry financial ledger. Pending cashback cannot be redeemed. Confirmed returns create separate negative adjustment entries.
                  </p>
                </div>
                <button
                  onClick={() => handleExport('cashback')}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Ledger CSV</span>
                </button>
              </div>

              {/* 5 Real-Time Wallet KPI Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                  <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">Pending Validation</div>
                  <div className="text-xl font-black text-amber-600 dark:text-amber-400">₹{stats.cashbackPending}</div>
                  <div className="text-[10px] text-slate-400">In 30-day return window</div>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                  <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Available Balance</div>
                  <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">₹{stats.cashbackAvailable}</div>
                  <div className="text-[10px] text-emerald-500 font-medium">Eligible for Withdrawal</div>
                </div>
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-1">
                  <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">Total Earned</div>
                  <div className="text-xl font-black text-blue-600 dark:text-blue-400">₹{stats.cashbackConfirmed}</div>
                  <div className="text-[10px] text-slate-400">Cumulative confirmed</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Total Redeemed</div>
                  <div className="text-xl font-black text-slate-700 dark:text-slate-300">₹{stats.cashbackRedeemed}</div>
                  <div className="text-[10px] text-slate-400">Withdrawn to Bank / UPI</div>
                </div>
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-1">
                  <div className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase">Reversed (Clawbacks)</div>
                  <div className="text-xl font-black text-rose-600 dark:text-rose-400">₹{stats.cashbackReversed}</div>
                  <div className="text-[10px] text-rose-500 font-medium">Post-Return Adjustments</div>
                </div>
              </div>

              {/* Section 12 Reversal Simulator Form */}
              <div className="p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 space-y-4">
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-extrabold text-sm">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>Marketplace Product Return & Commission Clawback Engine (Section 12)</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  When a partner reports an order cancellation, return, or chargeback, SmartDeal marks the conversion as <code>REVERSED</code>, logs an immutable negative ledger adjustment (e.g., <code>-₹100</code>), updates the customer wallet balance transactionally, and prevents duplicate reversal processing.
                </p>

                {reversalSuccessMsg && (
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 font-bold text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-rose-600" />
                    <span>{reversalSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleProcessReversal} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                  <div className="sm:col-span-4 space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Order Reference / ID</label>
                    <input
                      type="text"
                      value={reversalOrderRef}
                      onChange={e => setReversalOrderRef(e.target.value)}
                      placeholder="e.g. 171-1234567-890123"
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs"
                      required
                    />
                  </div>
                  <div className="sm:col-span-5 space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Clawback Reason & Audit Note</label>
                    <input
                      type="text"
                      value={reversalReason}
                      onChange={e => setReversalReason(e.target.value)}
                      placeholder="Return reason from marketplace postback"
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                      required
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md shadow-rose-600/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Execute Clawback</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Real-time Double-Entry Ledger Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                    Complete Immutable Transaction Ledger ({cashbackTxList.length} Entries)
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">No destructive balance overwrites</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-400">
                        <th className="py-2.5 px-3">Transaction ID</th>
                        <th className="py-2.5 px-3">Order Ref</th>
                        <th className="py-2.5 px-3">User ID</th>
                        <th className="py-2.5 px-3">Type</th>
                        <th className="py-2.5 px-3 text-right">Amount</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                        <th className="py-2.5 px-3">Audit Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                      {cashbackTxList.map(tx => (
                        <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                            {tx.id}
                          </td>
                          <td className="py-3 px-3 font-mono text-[10px] text-slate-500">
                            {tx.orderRef}
                          </td>
                          <td className="py-3 px-3 font-mono text-[10px] text-slate-400">
                            {tx.userId}
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              tx.type === 'CONFIRMED' || tx.type === 'AVAILABLE'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : tx.type === 'REVERSAL_ADJUSTMENT'
                                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                : 'bg-slate-500/10 text-slate-600 dark:text-slate-300'
                            }`}>
                              {tx.type}
                            </span>
                          </td>
                          <td className={`py-3 px-3 text-right font-mono font-black ${
                            tx.amount < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                          }`}>
                            {tx.amount < 0 ? `-₹${Math.abs(tx.amount)}` : `+₹${tx.amount}`}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                              tx.status === 'Confirmed' || tx.status === 'Available'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : tx.status === 'Pending'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-500 dark:text-slate-400 text-[10px]">
                            {tx.productName} {tx.reversalReason ? `• Reason: ${tx.reversalReason}` : ''}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: REPORTS & CSV EXPORT */}
          {activeTab === 'reports' && (
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 animate-fadeIn text-xs">
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="font-extrabold text-slate-900 dark:text-white text-base">
                  Audit Reports & Raw CSV Data Export
                </h2>
                <p className="text-slate-400">
                  Instant real-time downloadable CSV reports for accounting, partner audits, and behavioral intelligence.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">Registered Users Report</div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      User IDs, names, emails, spend totals, account creation dates, and activity counts.
                    </p>
                  </div>
                  <button
                    onClick={() => handleExport('users')}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">Guest Sessions Log</div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Anonymous guest IDs, devices, IPs, session timings, and total outbound clicks.
                    </p>
                  </div>
                  <button
                    onClick={() => handleExport('guests')}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">Outbound SKU Clicks</div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Click IDs, product names, categories, stores, deep link URLs, and prices at click.
                    </p>
                  </div>
                  <button
                    onClick={() => handleExport('clicks')}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer shadow-sm shadow-emerald-600/20"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">Commission Reconciliation</div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Statuses (Clicked, Pending, Confirmed, Cancelled), estimated commission, and settlement notes.
                    </p>
                  </div>
                  <button
                    onClick={() => handleExport('commissions')}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer shadow-sm shadow-indigo-600/20"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">Affiliate Conversions Log</div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Postbacks, partner order refs, commission amounts, and allocated user cashback.
                    </p>
                  </div>
                  <button
                    onClick={() => handleExport('conversions')}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer shadow-sm shadow-emerald-600/20"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">Cashback Ledger Journal</div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Double-entry records, credits, debit redemptions, and return reversals.
                    </p>
                  </div>
                  <button
                    onClick={() => handleExport('cashback')}
                    className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer shadow-sm shadow-amber-600/20"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">Security & Admin Audit Logs</div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Administrative actions, reversals, role elevations, and KYC decision audits.
                    </p>
                  </div>
                  <button
                    onClick={() => handleExport('audit_logs')}
                    className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer shadow-sm shadow-cyan-600/20"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SECURITY AUDIT LOGS */}
          {activeTab === 'audit-logs' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 animate-fadeIn text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="font-extrabold text-slate-900 dark:text-white text-base">
                    Security & Administrative Audit Logs (Section 10 & 17)
                  </h2>
                  <p className="text-slate-400">
                    Tamper-evident log of administrative actions, financial reversals, KYC status approvals, and data exports.
                  </p>
                </div>
                <button
                  onClick={() => handleExport('audit_logs')}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Audit Log CSV</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-400">
                      <th className="py-2.5 px-3">Log ID / Timestamp</th>
                      <th className="py-2.5 px-3">Actor</th>
                      <th className="py-2.5 px-3">Action</th>
                      <th className="py-2.5 px-3">Target Entity</th>
                      <th className="py-2.5 px-3">IP Address</th>
                      <th className="py-2.5 px-3">Audit Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                    {auditLogsList.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-3">
                          <div className="font-mono font-bold text-slate-900 dark:text-white">{log.id}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{log.timestamp}</div>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">
                          {log.adminEmail}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.action.includes('REVERS')
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                              : log.action.includes('EXPORT')
                              ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                              : log.action.includes('APPROV')
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-[10px] text-slate-500 dark:text-slate-400">
                          {log.targetEntity}
                        </td>
                        <td className="py-3 px-3 font-mono text-[10px] text-slate-400">
                          {log.ipAddress || '127.0.0.1'}
                        </td>
                        <td className="py-3 px-3">
                          <pre className="p-2 rounded bg-slate-50 dark:bg-slate-800 font-mono text-[10px] text-slate-600 dark:text-slate-300 max-w-xs overflow-x-auto">
                            {JSON.stringify(log.details)}
                          </pre>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 10: SELLERS & KYC (PRESERVED) */}
          {activeTab === 'sellers' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 text-xs animate-fadeIn">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Seller Verification & KYC Queue</h3>
                  <p className="text-slate-400">Approve or reject marketplace merchant applications</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">{seller.storeName}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      seller.kycStatus === 'Approved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}>
                      KYC: {seller.kycStatus}
                    </span>
                  </div>
                  <div className="text-slate-600 dark:text-slate-300">
                    Owner: {seller.fullName} • Business: {seller.businessName} • GST: {seller.gstNumber}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Bank: A/C {seller.bankAccount} ({seller.bankIfsc}) • Category: {seller.category}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateSellerKYC('Approved')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve KYC</span>
                  </button>

                  <button
                    onClick={() => updateSellerKYC('Rejected')}
                    className="px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: SETTINGS & SLABS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fadeIn text-xs">
              {/* Commission Slabs */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
                <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Platform Commission Slabs</h3>
                  <p className="text-slate-400">Configure affiliate cut and seller fees by ticket size</p>
                </div>

                <div className="space-y-3">
                  {commissionSlabs.map((slab, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <div className="font-extrabold text-slate-900 dark:text-white">{slab.tierName}</div>
                        <div className="text-slate-500 dark:text-slate-400">
                          Range: ₹{slab.minAmount.toLocaleString('en-IN')} to {slab.maxAmount === Infinity ? 'Unlimited' : `₹${slab.maxAmount.toLocaleString('en-IN')}`}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-bold text-slate-700 dark:text-slate-300">Rate (%):</span>
                        <input
                          type="number"
                          step="0.5"
                          value={slab.commissionRate}
                          onChange={e => updateCommissionSlab(idx, Number(e.target.value))}
                          className="w-20 p-2 text-center rounded-xl border border-slate-300 dark:border-slate-600 font-black text-brand-600 dark:text-brand-400 bg-white dark:bg-slate-700"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SmartCoins Rule Config */}
              <form
                onSubmit={e => {
                  e.preventDefault();
                  updateAdminSettings({
                    coinRedemptionRate: Number(coinRatio),
                    maxCoinsPerOrder: Number(maxCoins),
                    dailyLoginReward: Number(dailyReward)
                  });
                  setSavedSettingsMsg(true);
                  setTimeout(() => setSavedSettingsMsg(false), 2000);
                }}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4"
              >
                <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">SmartCoins Monetary Rules</h3>
                  <p className="text-slate-400">Monetary discount parameters and daily login bonuses</p>
                </div>

                {savedSettingsMsg && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Settings saved successfully!</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Coins per ₹1 Discount</label>
                    <input
                      type="number"
                      value={coinRatio}
                      onChange={e => setCoinRatio(Number(e.target.value))}
                      className="w-full p-2 text-center rounded-xl border border-slate-300 dark:border-slate-600 font-black bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400"
                    />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Max Coins per Order</label>
                    <input
                      type="number"
                      value={maxCoins}
                      onChange={e => setMaxCoins(Number(e.target.value))}
                      className="w-full p-2 text-center rounded-xl border border-slate-300 dark:border-slate-600 font-black bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400"
                    />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Daily Streak Reward</label>
                    <input
                      type="number"
                      value={dailyReward}
                      onChange={e => setDailyReward(Number(e.target.value))}
                      className="w-full p-2 text-center rounded-xl border border-slate-300 dark:border-slate-600 font-black bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs shadow-sm cursor-pointer"
                >
                  Save Configuration
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* MODAL 1: USER ACTIVITY TIMELINE DRAWER */}
      {selectedUserForTimeline && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-white space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black">
                    Activity Timeline: {selectedUserForTimeline.name}
                  </h3>
                  <div className="text-xs text-slate-400">
                    User ID: {selectedUserForTimeline.user_id} • {selectedUserForTimeline.email}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedUserForTimeline(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Timeline Events */}
            <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 space-y-6 text-xs">
              {trackingService.getUserActivityTimeline(selectedUserForTimeline.user_id).map((event, idx) => (
                <div key={event.log_id} className="relative">
                  <span className="absolute -left-[31px] top-0 w-3.5 h-3.5 rounded-full bg-rose-500 ring-4 ring-white dark:ring-slate-900" />
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                        {event.action_type.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">{event.timestamp}</span>
                    </div>

                    {event.product_name && (
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        Product: {event.product_name} ({event.category})
                      </div>
                    )}

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                      {JSON.stringify(event.details, null, 2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedUserForTimeline(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs cursor-pointer"
            >
              Close Timeline
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: GUEST ACTIVITY TIMELINE DRAWER */}
      {selectedGuestForTimeline && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-white space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black">
                    Anonymous Guest Timeline: {selectedGuestForTimeline.guest_id}
                  </h3>
                  <div className="text-xs text-slate-400">
                    Device: {selectedGuestForTimeline.device_info} • IP: {selectedGuestForTimeline.ip_address}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedGuestForTimeline(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Timeline Events */}
            <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 space-y-6 text-xs">
              {trackingService.getGuestActivityTimeline(selectedGuestForTimeline.guest_id).map((event, idx) => (
                <div key={event.log_id} className="relative">
                  <span className="absolute -left-[31px] top-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-slate-900" />
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                        {event.action_type.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">{event.timestamp}</span>
                    </div>

                    {event.product_name && (
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        Product: {event.product_name} ({event.category})
                      </div>
                    )}

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                      {JSON.stringify(event.details, null, 2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedGuestForTimeline(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs cursor-pointer"
            >
              Close Guest Timeline
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: COMMISSION VERIFICATION MODAL */}
      {commissionActionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-white space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-sm">Verify Commission Settlement</h3>
              <button
                onClick={() => setCommissionActionModal(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1.5 border border-slate-200 dark:border-slate-700/60">
              <div className="font-bold text-slate-900 dark:text-white">{commissionActionModal.product_name}</div>
              <div className="text-slate-400">Click ID: {commissionActionModal.click_id}</div>
              <div className="text-slate-400">Merchant: {commissionActionModal.marketplace}</div>
              <div className="text-slate-400">Price at Click: ₹{commissionActionModal.price_at_click.toLocaleString('en-IN')}</div>
              <div className="text-brand-600 dark:text-brand-400 font-black">
                Estimated Commission: ₹{commissionActionModal.estimated_commission}
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-300">Auditor Notes</label>
              <textarea
                value={verificationNotes}
                onChange={e => setVerificationNotes(e.target.value)}
                placeholder="e.g. Return window cleared via Amazon Associates API report"
                rows={2}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleUpdateCommission('CONFIRMED')}
                className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Confirmed</span>
              </button>

              <button
                onClick={() => handleUpdateCommission('CANCELLED')}
                className="py-2.5 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-black flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>Mark Cancelled</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: RECORD WRITTEN APPROVAL MODAL */}
      {approvalModalStore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-white space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-600" />
                <h3 className="font-black text-sm">Record Written Affiliate Approval</h3>
              </div>
              <button
                onClick={() => setApprovalModalStore(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1.5 border border-slate-200 dark:border-slate-700/60">
              <div className="font-bold text-slate-900 dark:text-white">{approvalModalStore.marketplaceName} ({approvalModalStore.domain})</div>
              <p className="text-slate-400 text-[11px]">
                In accordance with {approvalModalStore.marketplaceName} affiliate policy (e.g. Amazon Operating Agreement Section 4 & PA-API terms), price tracking and alerts may only be activated once written authorization has been received.
              </p>
            </div>

            <form onSubmit={handleConfirmWrittenApproval} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Written Approval Reference ID / Agreement Ref:
                </label>
                <input
                  type="text"
                  required
                  value={approvalRefInput}
                  onChange={e => setApprovalRefInput(e.target.value)}
                  placeholder="e.g. AMZ-IN-APPROVAL-2026-DOC89"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 font-mono text-xs"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[11px] leading-relaxed">
                Notice: Granting written approval applies strictly to {approvalModalStore.marketplaceName}. Permissions are strictly isolated and never leak or apply to other marketplaces.
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="submit"
                  className="py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black flex items-center justify-center gap-1.5 shadow-md shadow-brand-600/20 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Enable</span>
                </button>

                <button
                  type="button"
                  onClick={() => setApprovalModalStore(null)}
                  className="py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold flex items-center justify-center cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  </AdminSecurityGuard>
  );
};
