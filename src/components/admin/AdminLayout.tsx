import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  BarChart3,
  Users,
  Globe,
  Tag,
  FolderKanban,
  Store,
  DollarSign,
  MousePointerClick,
  ShoppingBag,
  Database,
  Search,
  Settings,
  ShieldCheck,
  Menu,
  X,
  ExternalLink,
  LogOut,
  ChevronRight,
  Server,
  Sparkles,
  Smartphone
} from 'lucide-react';

interface NavItem {
  name: string;
  to: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

const navSections: { label: string; items: NavItem[] }[] = [
  {
    label: 'Overview & Core',
    items: [
      { name: 'Dashboard Overview', to: '/admin/dashboard', icon: BarChart3, badge: '10 KPIs' },
      { name: 'Customer Orders', to: '/admin/orders', icon: ShoppingBag },
    ]
  },
  {
    label: 'Catalog & Compliance',
    items: [
      { name: 'Product Management', to: '/admin/products', icon: Tag },
      { name: 'Category Management', to: '/admin/categories', icon: FolderKanban },
      { name: 'Marketplaces', to: '/admin/marketplaces', icon: Store },
    ]
  },
  {
    label: 'Affiliate & Tracking',
    items: [
      { name: 'Affiliate Commissions', to: '/admin/commissions', icon: DollarSign, badge: 'Revenue' },
      { name: 'Outbound Clicks', to: '/admin/clicks', icon: MousePointerClick },
      { name: 'User Management', to: '/admin/users', icon: Users },
      { name: 'Guest Management', to: '/admin/guests', icon: Globe },
    ]
  },
  {
    label: 'Intelligence & Audit',
    items: [
      { name: 'Website Analytics', to: '/admin/analytics', icon: Database, badge: 'Live SQL' },
      { name: 'Search Analytics', to: '/admin/searches', icon: Search },
      { name: 'Activity Audit Logs', to: '/admin/activity-logs', icon: ShieldCheck, badge: 'Security' },
      { name: 'Admin Settings', to: '/admin/settings', icon: Settings },
    ]
  }
];

export const AdminLayout: React.FC = () => {
  const { currentUser, setRole, logoutUser, setIsSmsCenterOpen } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleAdminLogout = async () => {
    sessionStorage.removeItem('smartdeal_admin_authenticated');
    setRole('USER');
    await logoutUser();
    navigate('/admin/login', { replace: true });
  };

  // Current page title derived from path
  const currentTitle = (() => {
    const p = location.pathname;
    if (p.includes('/admin/users')) return 'User Management';
    if (p.includes('/admin/guests')) return 'Guest Session Management';
    if (p.includes('/admin/products') || p.includes('/admin/product-activity')) return 'Product Catalog Management';
    if (p.includes('/admin/categories') || p.includes('/admin/all-category')) return 'Category Management';
    if (p.includes('/admin/marketplaces')) return 'Marketplace Management & Compliance';
    if (p.includes('/admin/commissions') || p.includes('/admin/conversions')) return 'Affiliate Commission Management';
    if (p.includes('/admin/clicks') || p.includes('/admin/outbound-clicks')) return 'Outbound SKU Click Tracking';
    if (p.includes('/admin/orders')) return 'Customer Order Fulfillment';
    if (p.includes('/admin/analytics') || p.includes('/admin/database')) return 'Website & Database Analytics';
    if (p.includes('/admin/searches') || p.includes('/admin/search-analytics')) return 'Search Query Analytics';
    if (p.includes('/admin/activity-logs') || p.includes('/admin/audit-logs')) return 'Security & Admin Activity Logs';
    if (p.includes('/admin/settings')) return 'Platform Rules & Settings';
    return 'Admin Command Center Overview';
  })();

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0b132b] border-r border-slate-800/80 text-slate-200">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center font-black shadow-lg shadow-cyan-500/20">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-white text-base tracking-tight">SmartDeal</span>
              <span className="text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-1.5 py-0.2 rounded">
                ADMIN
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Enterprise Management</p>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={() => setMobileSidebarOpen(false)}
          className="lg:hidden p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
        {navSections.map(sec => (
          <div key={sec.label} className="space-y-1">
            <div className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400">
              {sec.label}
            </div>
            {sec.items.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to || 
                (item.to === '/admin/dashboard' && (location.pathname === '/admin' || location.pathname === '/admin/dashboard'));
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white shadow-md shadow-blue-600/30 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      isActive 
                        ? 'bg-black/30 text-white' 
                        : 'bg-slate-800 text-cyan-300 border border-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* Sidebar Footer with Live Connectivity & Logout */}
      <div className="p-3 border-t border-slate-800/80 space-y-2 bg-[#090e1f]">
        {/* Live Server Indicator */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px]">
          <div className="flex items-center gap-2 text-slate-300">
            <Server className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Backend :3001</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-400">LIVE RBAC</span>
        </div>

        {/* View Customer Website Link */}
        <button
          onClick={() => {
            setRole('USER');
            navigate('/');
          }}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            <span>Visit Customer Website</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
        </button>

        {/* Admin Logout */}
        <button
          onClick={handleAdminLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/20 hover:border-transparent transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Admin Portal</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans">
      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-y-0 left-0 w-72 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {renderSidebarContent()}
      </div>

      <div className="flex flex-1 min-h-screen">
        {/* Desktop Fixed Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0 min-h-screen sticky top-0 h-screen">
          {renderSidebarContent()}
        </aside>

        {/* Main Administrative Workspace */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Administrative Bar */}
          <header className="sticky top-0 z-30 bg-[#0b132b]/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span>SmartDeal Admin</span>
                  <span>/</span>
                  <span className="text-cyan-400 font-semibold">{currentTitle}</span>
                </div>
                <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
                  {currentTitle}
                </h1>
              </div>
            </div>

            {/* Right Header Controls */}
            <div className="flex items-center gap-3">
              {/* Owner SMS alerts center quick button */}
              <button
                onClick={() => setIsSmsCenterOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 transition-colors"
                title="Owner Phone Dispatch"
              >
                <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-mono text-[11px]">7217514087</span>
              </button>

              {/* Admin profile pill */}
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-black text-xs shadow-md">
                  {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'AD'}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-bold text-white leading-tight">
                    {currentUser?.name || 'Super Admin'}
                  </div>
                  <div className="text-[10px] text-cyan-400 font-mono">OWNER &bull; RBAC Verified</div>
                </div>
              </div>

              {/* Logout button */}
              <button
                onClick={handleAdminLogout}
                className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-rose-600/30 cursor-pointer active:scale-95"
                title="Sign out of Admin Dashboard"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </header>

          {/* Child View Workspace */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1700px] w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
