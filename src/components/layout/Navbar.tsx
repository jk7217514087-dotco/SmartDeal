import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Search,
  ShoppingCart,
  Heart,
  User,
  Bell,
  HelpCircle,
  Sparkles,
  Store,
  ShieldAlert,
  Layers,
  ChevronDown,
  ArrowRight,
  SlidersHorizontal,
  Flame,
  Sun,
  Moon,
  Palette,
  X,
  Radio,
  Workflow,
  Tag,
  ArrowLeft,
  RotateCcw,
  Smartphone,
  Download,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  LogOut,
  CheckCircle2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface NavbarThemeConfig {
  headerBg: string;
  topBannerBg: string;
  smartGuaranteeBadge: string;
  smsButton: string;
  logoIcon: string;
  logoTextGradient: string;
  proBadge: string;
  searchInput: string;
  searchBtn: string;
  searchPopup: string;
  aiBtn: string;
  aiIcon: string;
  appBtn: string;
  themeToggleBtn: string;
  themeIcon: string;
  cartBtn: string;
  cartCountBadge: string;
  categoriesNavBg: string;
  allCategoriesLink: string;
  compareStoresLink: string;
  guestShopperCard: string;
  guestDot: string;
  tooltipText: string;
}

const NAVBAR_THEMES: Record<string, NavbarThemeConfig> = {
  'steel-navy': {
    headerBg: 'dark:bg-[#0b1a30]/95 dark:border-sky-900/60',
    topBannerBg: 'bg-gradient-to-r from-[#0b1a30] via-[#102747] to-[#14325c] text-sky-100 border-sky-900/40',
    smartGuaranteeBadge: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    smsButton: 'bg-gradient-to-r from-sky-600/30 via-blue-600/30 to-sky-700/30 hover:from-sky-600 hover:to-blue-600 border-sky-400/50 text-sky-200',
    logoIcon: 'bg-gradient-to-tr from-sky-400 via-sky-500 to-blue-600 text-slate-950 shadow-lg shadow-sky-500/30',
    logoTextGradient: 'bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent',
    proBadge: 'bg-sky-400/20 text-sky-300 border-sky-400/50',
    searchInput: 'bg-slate-100/90 dark:bg-[#071324] border-slate-200/80 dark:border-sky-950/80 focus:bg-white dark:focus:bg-[#0d1d36] focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20',
    searchBtn: 'bg-gradient-to-r from-sky-400 via-sky-300 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-slate-950 shadow-sky-500/30 font-black',
    searchPopup: 'bg-white dark:bg-[#0b1a30] border-sky-950/80',
    aiBtn: 'bg-sky-950/60 border-sky-500/50 text-sky-300 hover:border-sky-400 hover:text-white hover:shadow-sky-500/25',
    aiIcon: 'text-sky-400',
    appBtn: 'bg-sky-950/50 hover:bg-sky-900/50 border-sky-800/80 text-sky-300',
    themeToggleBtn: 'bg-sky-950/70 border-sky-400/70 text-sky-300 hover:bg-sky-900/70 shadow-sky-500/30',
    themeIcon: 'text-sky-300',
    cartBtn: 'bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 text-slate-950 font-black shadow-sky-500/30',
    cartCountBadge: 'bg-slate-950 text-sky-300',
    categoriesNavBg: 'border-sky-900/60 bg-slate-50/80 dark:bg-[#0e223f]/95',
    allCategoriesLink: 'text-sky-300 hover:text-sky-200',
    compareStoresLink: 'text-sky-300',
    guestShopperCard: 'bg-[#112240] border-sky-500/40 text-sky-200 shadow-xs',
    guestDot: 'bg-sky-400',
    tooltipText: 'Active: Steel Oceanic Navy. Click to switch themes',
  },
  'matrix-lime': {
    headerBg: 'dark:bg-[#111612]/95 dark:border-lime-900/60',
    topBannerBg: 'bg-gradient-to-r from-[#111612] via-[#18241b] to-[#213325] text-lime-100 border-lime-900/40',
    smartGuaranteeBadge: 'bg-lime-500/20 text-lime-300 border-lime-500/40',
    smsButton: 'bg-gradient-to-r from-lime-600/30 via-green-600/30 to-lime-700/30 hover:from-lime-600 hover:to-green-600 border-lime-400/50 text-lime-200',
    logoIcon: 'bg-gradient-to-tr from-[#bef264] via-[#a3e635] to-[#84cc16] text-slate-950 shadow-lg shadow-lime-500/30',
    logoTextGradient: 'bg-gradient-to-r from-lime-300 via-lime-400 to-green-400 bg-clip-text text-transparent',
    proBadge: 'bg-lime-400/20 text-lime-300 border-lime-400/50',
    searchInput: 'bg-slate-100/90 dark:bg-[#0b0e0c] border-slate-200/80 dark:border-lime-950/80 focus:bg-white dark:focus:bg-[#151c16] focus:border-lime-400 focus:ring-4 focus:ring-lime-400/20',
    searchBtn: 'bg-gradient-to-r from-[#bef264] via-[#a3e635] to-[#84cc16] hover:from-[#d9f99d] hover:to-[#a3e635] text-slate-950 shadow-lime-500/30 font-black',
    searchPopup: 'bg-white dark:bg-[#111612] border-lime-950/80',
    aiBtn: 'bg-lime-950/60 border-lime-500/50 text-lime-300 hover:border-lime-400 hover:text-white hover:shadow-lime-500/25',
    aiIcon: 'text-lime-400',
    appBtn: 'bg-lime-950/50 hover:bg-lime-900/50 border-lime-800/80 text-lime-300',
    themeToggleBtn: 'bg-lime-950/70 border-lime-400/70 text-lime-300 hover:bg-lime-900/70 shadow-lime-500/30',
    themeIcon: 'text-lime-300',
    cartBtn: 'bg-gradient-to-r from-[#bef264] via-[#a3e635] to-[#84cc16] text-slate-950 font-black shadow-lime-500/30',
    cartCountBadge: 'bg-slate-950 text-lime-300',
    categoriesNavBg: 'border-lime-900/60 bg-slate-50/80 dark:bg-[#18241b]/95',
    allCategoriesLink: 'text-lime-300 hover:text-lime-200',
    compareStoresLink: 'text-lime-300',
    guestShopperCard: 'bg-[#172219] border-lime-500/40 text-lime-200 shadow-xs',
    guestDot: 'bg-lime-400',
    tooltipText: 'Active: Cyber Matrix Lime. Click to switch themes',
  },
  'sunset-coral': {
    headerBg: 'dark:bg-[#1c0b29]/95 dark:border-rose-900/60',
    topBannerBg: 'bg-gradient-to-r from-[#1c0b29] via-[#29103c] to-[#3a1555] text-rose-100 border-rose-900/40',
    smartGuaranteeBadge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    smsButton: 'bg-gradient-to-r from-orange-600/30 via-rose-600/30 to-pink-700/30 hover:from-orange-600 hover:to-rose-600 border-rose-400/50 text-rose-200',
    logoIcon: 'bg-gradient-to-tr from-orange-400 via-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/30',
    logoTextGradient: 'bg-gradient-to-r from-rose-400 via-pink-300 to-orange-400 bg-clip-text text-transparent',
    proBadge: 'bg-rose-400/20 text-rose-300 border-rose-400/50',
    searchInput: 'bg-slate-100/90 dark:bg-[#14061e] border-slate-200/80 dark:border-rose-950/80 focus:bg-white dark:focus:bg-[#250d37] focus:border-rose-400 focus:ring-4 focus:ring-rose-400/20',
    searchBtn: 'bg-gradient-to-r from-orange-400 via-rose-400 to-pink-500 hover:from-orange-300 hover:to-pink-400 text-white shadow-rose-500/30 font-black',
    searchPopup: 'bg-white dark:bg-[#1c0b29] border-rose-950/80',
    aiBtn: 'bg-rose-950/60 border-rose-500/50 text-rose-300 hover:border-rose-400 hover:text-white hover:shadow-rose-500/25',
    aiIcon: 'text-rose-400',
    appBtn: 'bg-rose-950/50 hover:bg-rose-900/50 border-rose-800/80 text-rose-300',
    themeToggleBtn: 'bg-rose-950/70 border-rose-400/70 text-rose-300 hover:bg-rose-900/70 shadow-rose-500/30',
    themeIcon: 'text-rose-300',
    cartBtn: 'bg-gradient-to-r from-orange-400 via-rose-500 to-pink-500 text-white font-black shadow-rose-500/30',
    cartCountBadge: 'bg-slate-950 text-rose-300',
    categoriesNavBg: 'border-rose-900/60 bg-slate-50/80 dark:bg-[#28113b]/95',
    allCategoriesLink: 'text-rose-300 hover:text-rose-200',
    compareStoresLink: 'text-rose-300',
    guestShopperCard: 'bg-[#28113b] border-rose-500/40 text-rose-200 shadow-xs',
    guestDot: 'bg-rose-400',
    tooltipText: 'Active: Cosmic Sunset Coral. Click to switch themes',
  },
  'aurora-jade': {
    headerBg: 'dark:bg-[#051f15]/95 dark:border-emerald-900/60',
    topBannerBg: 'bg-gradient-to-r from-[#051f15] via-[#082d1f] to-[#0c3e2b] text-emerald-100 border-emerald-900/40',
    smartGuaranteeBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    smsButton: 'bg-gradient-to-r from-emerald-600/30 via-green-600/30 to-teal-700/30 hover:from-emerald-600 hover:to-teal-600 border-emerald-400/50 text-emerald-200',
    logoIcon: 'bg-gradient-to-tr from-emerald-400 via-green-400 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/30',
    logoTextGradient: 'bg-gradient-to-r from-emerald-300 via-teal-300 to-green-400 bg-clip-text text-transparent',
    proBadge: 'bg-emerald-400/20 text-emerald-300 border-emerald-400/50',
    searchInput: 'bg-slate-100/90 dark:bg-[#03150e] border-slate-200/80 dark:border-emerald-950/80 focus:bg-white dark:focus:bg-[#082c1e] focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20',
    searchBtn: 'bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 shadow-emerald-500/30 font-black',
    searchPopup: 'bg-white dark:bg-[#051f15] border-emerald-950/80',
    aiBtn: 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 hover:border-emerald-400 hover:text-white hover:shadow-emerald-500/25',
    aiIcon: 'text-emerald-400',
    appBtn: 'bg-emerald-950/50 hover:bg-emerald-900/50 border-emerald-800/80 text-emerald-300',
    themeToggleBtn: 'bg-emerald-950/70 border-emerald-400/70 text-emerald-300 hover:bg-emerald-900/70 shadow-emerald-500/30',
    themeIcon: 'text-emerald-300',
    cartBtn: 'bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 text-slate-950 font-black shadow-emerald-500/30',
    cartCountBadge: 'bg-slate-950 text-emerald-300',
    categoriesNavBg: 'border-emerald-900/60 bg-slate-50/80 dark:bg-[#092e20]/95',
    allCategoriesLink: 'text-emerald-300 hover:text-emerald-200',
    compareStoresLink: 'text-emerald-300',
    guestShopperCard: 'bg-[#092e20] border-emerald-500/40 text-emerald-200 shadow-xs',
    guestDot: 'bg-emerald-400',
    tooltipText: 'Active: Aurora Emerald Jade. Click to switch themes',
  },
  'royal-gold': {
    headerBg: 'dark:bg-[#181107]/95 dark:border-amber-900/60',
    topBannerBg: 'bg-gradient-to-r from-[#181107] via-[#241a0b] to-[#2c1f0d] text-amber-100 border-amber-900/40',
    smartGuaranteeBadge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    smsButton: 'bg-gradient-to-r from-amber-600/30 via-yellow-600/30 to-amber-700/30 hover:from-amber-600 hover:to-yellow-600 border-amber-400/50 text-amber-200',
    logoIcon: 'bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/30',
    logoTextGradient: 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent',
    proBadge: 'bg-amber-400/20 text-amber-300 border-amber-400/50',
    searchInput: 'bg-slate-100/90 dark:bg-[#0d0d08] border-slate-200/80 dark:border-amber-950/80 focus:bg-white dark:focus:bg-[#141208] focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20',
    searchBtn: 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 shadow-amber-500/30 font-black',
    searchPopup: 'bg-white dark:bg-[#181107] border-amber-950/80',
    aiBtn: 'bg-amber-400/15 border-amber-400/50 text-amber-300 hover:border-amber-400 hover:bg-amber-400/25',
    aiIcon: 'text-amber-400',
    appBtn: 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-400/40 text-amber-200',
    themeToggleBtn: 'bg-amber-400/20 border-amber-400 text-amber-300 hover:bg-amber-400/30 shadow-amber-500/25',
    themeIcon: 'text-amber-400',
    cartBtn: 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black shadow-amber-500/30',
    cartCountBadge: 'bg-slate-950 text-amber-300',
    categoriesNavBg: 'border-amber-900/60 bg-slate-50/80 dark:bg-[#1f1609]/95',
    allCategoriesLink: 'text-amber-400 hover:text-amber-300',
    compareStoresLink: 'text-amber-300',
    guestShopperCard: 'bg-[#241a0b] border-amber-500/40 text-amber-200 shadow-xs',
    guestDot: 'bg-amber-400',
    tooltipText: 'Active: Royal Obsidian Gold. Click to switch themes',
  },
  'cyber-indigo': {
    headerBg: 'dark:bg-[#08092d]/95 dark:border-violet-900/60',
    topBannerBg: 'bg-gradient-to-r from-[#08092d] via-[#101348] to-[#161a60] text-violet-100 border-violet-900/40',
    smartGuaranteeBadge: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
    smsButton: 'bg-gradient-to-r from-violet-600/30 via-purple-600/30 to-indigo-700/30 hover:from-violet-600 hover:to-indigo-600 border-violet-400/50 text-violet-200',
    logoIcon: 'bg-gradient-to-tr from-violet-500 via-purple-400 to-indigo-600 text-white shadow-lg shadow-violet-500/30',
    logoTextGradient: 'bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent',
    proBadge: 'bg-violet-400/20 text-violet-300 border-violet-400/50',
    searchInput: 'bg-slate-100/90 dark:bg-[#070826] border-slate-200/80 dark:border-violet-950/80 focus:bg-white dark:focus:bg-[#0e1044] focus:border-violet-400 focus:ring-4 focus:ring-violet-400/20',
    searchBtn: 'bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 hover:from-violet-400 hover:to-indigo-400 text-white shadow-violet-500/30 font-black',
    searchPopup: 'bg-white dark:bg-[#08092d] border-violet-950/80',
    aiBtn: 'bg-violet-950/60 border-violet-500/50 text-violet-300 hover:border-violet-400 hover:text-white hover:shadow-violet-500/25',
    aiIcon: 'text-violet-400',
    appBtn: 'bg-violet-950/50 hover:bg-violet-900/50 border-violet-800/80 text-violet-300',
    themeToggleBtn: 'bg-violet-950/70 border-violet-400/70 text-violet-300 hover:bg-violet-900/70 shadow-violet-500/30',
    themeIcon: 'text-violet-300',
    cartBtn: 'bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 text-white font-black shadow-violet-500/30',
    cartCountBadge: 'bg-slate-950 text-violet-300',
    categoriesNavBg: 'border-violet-900/60 bg-slate-50/80 dark:bg-[#0f1248]/95',
    allCategoriesLink: 'text-violet-300 hover:text-violet-200',
    compareStoresLink: 'text-violet-300',
    guestShopperCard: 'bg-[#0f1248] border-violet-500/40 text-violet-200 shadow-xs',
    guestDot: 'bg-violet-400',
    tooltipText: 'Active: Cyber Cosmic Indigo. Click to switch themes',
  },
  'pure-white': {
    headerBg: 'bg-white/95 border-slate-200/90 shadow-xs text-slate-900',
    topBannerBg: 'bg-gradient-to-r from-blue-50 via-white to-sky-50 text-blue-900 border-blue-100',
    smartGuaranteeBadge: 'bg-blue-100/70 text-blue-700 border-blue-200',
    smsButton: 'bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-700 font-bold',
    logoIcon: 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25',
    logoTextGradient: 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent',
    proBadge: 'bg-blue-100 text-blue-700 border-blue-300',
    searchInput: 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15',
    searchBtn: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-extrabold',
    searchPopup: 'bg-white border-slate-200 text-slate-900 shadow-xl',
    aiBtn: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
    aiIcon: 'text-blue-600',
    appBtn: 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 font-bold',
    themeToggleBtn: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 shadow-xs',
    themeIcon: 'text-blue-600',
    cartBtn: 'bg-blue-600 hover:bg-blue-700 text-white font-extrabold shadow-sm',
    cartCountBadge: 'bg-slate-900 text-white',
    categoriesNavBg: 'border-slate-200/80 bg-white/95 text-slate-700 shadow-xs',
    allCategoriesLink: 'text-blue-600 hover:text-blue-700 font-bold',
    compareStoresLink: 'text-blue-600 font-bold',
    guestShopperCard: 'bg-slate-50 border-slate-200 text-slate-700 shadow-xs',
    guestDot: 'bg-blue-600',
    tooltipText: 'Active: Pure White & Royal Blue. Click to switch themes',
  },
};

export const Navbar: React.FC = () => {
  const {
    role,
    setRole,
    currentUser,
    guestSession,
    loginUser,
    loginWithGoogle,
    logoutUser,
    trackActivity,
    cart,
    wishlist,
    cashbackWallet,
    setIsAiAssistantOpen,
    searchQuery,
    setSearchQuery,
    products,
    isDarkMode,
    toggleDarkMode,
    activeTheme,
    toggleTheme,
    setIsBgModalOpen,
    setIsSmsCenterOpen
  } = useApp();

  const themeKey = (activeTheme === 'cyber-emerald' ? 'aurora-jade' : activeTheme) || 'steel-navy';
  const navTheme = NAVBAR_THEMES[themeKey] || NAVBAR_THEMES['steel-navy'];

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [profileTab, setProfileTab] = useState<'signin' | 'menu'>('signin');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [forgotSent, setForgotSent] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const navDrawerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close nav drawer on outside click or escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navDrawerRef.current && !navDrawerRef.current.contains(e.target as Node)) {
        setIsNavDrawerOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsNavDrawerOpen(false);
      }
    };
    if (isNavDrawerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isNavDrawerOpen]);

  // Close profile dropdown on outside click or escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsProfileMenuOpen(false);
      }
    };
    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isProfileMenuOpen]);

  const handleQuickLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      const res = await loginUser(loginIdentifier, loginPassword);
      setIsLoggingIn(false);
      if (res.success && res.user) {
        setIsProfileMenuOpen(false);
        trackActivity('LOGIN', { method: 'dropdown_quick_login', email: res.user.email });
        if (res.user.role === 'ADMIN') {
          navigate('/admin/dashboard');
        }
      } else {
        setLoginError(res.message || 'Invalid email or password.');
      }
    } catch {
      setIsLoggingIn(false);
      setLoginError('Authentication failed. Please try again.');
    }
  };

  const handleGoogleQuickLogin = async () => {
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const res = await loginWithGoogle();
      if (res.success && res.user) {
        setIsProfileMenuOpen(false);
        if (res.user.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } else {
        setLoginError(res.message || 'Google sign-in could not be completed.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Google sign-in error occurred.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleForgotTrigger = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsProfileMenuOpen(false);
    navigate('/forgot-password');
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredSuggestions = searchQuery.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      trackActivity('SEARCH_PRODUCT', { query: searchQuery.trim() });
      setIsSearchFocused(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className={`sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b shadow-xs w-full transition-colors duration-300 ${navTheme.headerBg}`}>
      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Left Side: Three-Line Menu (☰), Back Button & Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Three-Line (☰ Hamburger Menu) Button */}
          <button
            onClick={() => setIsNavDrawerOpen(true)}
            className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-slate-100 hover:bg-slate-200/90 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-2 border border-slate-200/80 dark:border-slate-700/80 group"
            title="Open Menu & Categories (Three Lines)"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5 text-slate-800 dark:text-white group-hover:text-brand-500 transition-colors" />
            <span className="hidden sm:inline font-extrabold text-xs text-slate-800 dark:text-white">Menu</span>
          </button>

          {location.pathname !== '/' && (
            <button
              onClick={() => {
                if (window.history.length > 2) {
                  navigate(-1);
                } else {
                  navigate('/');
                }
              }}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-slate-700 dark:hover:text-brand-400 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all cursor-pointer shadow-xs active:scale-95 group"
              title="Go back to previous page"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}

          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-lg shadow-brand-500/20 ring-1 ring-white/20 group-hover:scale-105 transition-transform bg-[#00061e] flex items-center justify-center shrink-0">
              <img
                src="/smartdeal_icon_mark.png"
                alt="SmartDeal Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white font-sans">
                  Smart<span className={navTheme.logoTextGradient}>Deal</span>
                </span>
                <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-md shadow-xs border ${navTheme.proBadge}`}>
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Compare. Save. Buy Smarter.
              </p>
            </div>
          </Link>
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1 max-w-xl mx-2 hidden md:block">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder="Search products, brands, compare prices, or ask AI..."
                className={`w-full pl-11 pr-24 py-2.5 rounded-2xl border text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none transition-all shadow-inner ${navTheme.searchInput}`}
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4" />
              <button
                type="submit"
                className={`absolute right-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all shadow-md cursor-pointer ${navTheme.searchBtn}`}
              >
                Search
              </button>
            </div>
          </form>

          {/* Autocomplete suggestions popup */}
          {isSearchFocused && filteredSuggestions.length > 0 && (
            <div className={`absolute left-0 right-0 top-full mt-2 rounded-2xl shadow-2xl border overflow-hidden z-50 animate-fadeIn ${navTheme.searchPopup}`}>
              <div className="p-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800">
                Matching Products
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredSuggestions.map(item => (
                  <div
                    key={item.id}
                    onMouseDown={() => navigate(`/product/${item.id}`)}
                    className="p-3 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center justify-between gap-3 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-xl border border-slate-100 dark:border-slate-800" />
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-white line-clamp-1">{item.name}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Lowest: <span className="font-extrabold text-brand-600 dark:text-brand-400">₹{item.sellingPrice.toLocaleString('en-IN')}</span>
                          {' • '}Deal Score: <span className="font-bold text-emerald-600 dark:text-emerald-400">{item.dealScore}/100</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* AI Assistant Button */}
          <button
            onClick={() => setIsAiAssistantOpen(true)}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border font-extrabold text-xs shadow-xs transition-all hover:scale-105 cursor-pointer ${navTheme.aiBtn}`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${navTheme.aiIcon}`} />
            <span>Ask AI</span>
          </button>

          {/* Download & Install SmartDeal App Button (Circled in User Image on Phone & Laptop) */}
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('trigger-app-install'));
            }}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl sm:rounded-2xl border font-extrabold text-xs shadow-xs transition-all cursor-pointer active:scale-95 ${navTheme.appBtn}`}
            title="Direct Download SmartDeal App on Phone or Laptop"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>App</span>
          </button>

          {/* 1-Click Multi-Color Theme Switcher */}
          <button
            onClick={toggleTheme}
            onContextMenu={(e) => {
              e.preventDefault();
              setIsBgModalOpen(true);
            }}
            className={`p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border transition-all hover:scale-110 cursor-pointer shadow-md flex items-center justify-center ${navTheme.themeToggleBtn}`}
            title={navTheme.tooltipText}
            aria-label="Toggle Website Color Theme"
          >
            <Sun className={`w-4 h-4 sm:w-5 sm:h-5 ${navTheme.themeIcon} animate-pulse`} />
          </button>

          {/* Notifications */}
          <Link
            to="/notifications"
            className="relative p-1.5 sm:p-2 rounded-xl sm:rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-2 h-2 rounded-full bg-brand-600" />
          </Link>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="relative p-1.5 sm:p-2 rounded-xl sm:rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
            title="Wishlist"
          >
            <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-0 right-0 sm:top-1 sm:right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] sm:text-[10px] font-black flex items-center justify-center shadow-sm">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart Button */}
          <Link
            to="/cart"
            className={`hidden sm:flex relative p-2 px-3 rounded-2xl transition-all shadow-md items-center gap-1.5 active:scale-95 ${navTheme.cartBtn}`}
            title="Cart"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="text-xs font-black">Cart</span>
            {cartItemCount > 0 ? (
              <span className={`w-5 h-5 rounded-full text-[11px] font-black flex items-center justify-center ${navTheme.cartCountBadge}`}>
                {cartItemCount}
              </span>
            ) : (
              <span className={`w-4 h-4 rounded-full text-[10px] font-black flex items-center justify-center ${navTheme.cartCountBadge}`}>
                1
              </span>
            )}
          </Link>

          {/* Account Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="p-1.5 sm:p-2 rounded-xl sm:rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              title="Account & Login"
              aria-label="Account Profile"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Mobile Backdrop */}
            {isProfileMenuOpen && (
              <div
                className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 sm:hidden animate-fadeIn"
                onClick={() => setIsProfileMenuOpen(false)}
              />
            )}

            {isProfileMenuOpen && (
              <div
                ref={profileMenuRef}
                className="fixed sm:absolute right-3 sm:right-0 left-3 sm:left-auto top-16 sm:top-full mt-2 w-auto sm:w-96 max-w-sm sm:max-w-none bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 z-50 animate-fadeIn max-h-[min(660px,calc(100vh-5rem))] overflow-y-auto flex flex-col divide-y divide-slate-100 dark:divide-slate-800"
              >
                {currentUser ? (
                  /* ----------------- LOGGED IN USER VIEW ----------------- */
                  <>
                    <div className="p-4 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/20">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center font-black text-base shadow-md shadow-brand-500/25 shrink-0">
                            {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-black text-slate-900 dark:text-white truncate">
                                {currentUser.name}
                              </span>
                              <span
                                className={`text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                                  currentUser.role === 'ADMIN'
                                    ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60'
                                    : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60'
                                }`}
                              >
                                {currentUser.role}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              {currentUser.email}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                          title="Close"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Cashback Wallet Pill */}
                      <Link
                        to="/account/cashback"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="mt-3 flex items-center justify-between p-2.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/60 hover:bg-emerald-100/70 transition-all group"
                      >
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                          <Sparkles className="w-4 h-4 text-emerald-500" />
                          <span>Cashback Wallet</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-black text-emerald-700 dark:text-emerald-300">
                            ₹{cashbackWallet.availableBalance}
                          </span>
                          <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 block">
                            Direct Bank / UPI
                          </span>
                        </div>
                      </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="p-2 space-y-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>My Profile & Addresses</span>
                      </Link>

                      <Link
                        to="/orders"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4 text-slate-400" />
                        <span>My Orders & Live Tracking</span>
                      </Link>

                      <Link
                        to="/account/cashback"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        <Sparkles className="w-4 h-4 text-emerald-500" />
                        <span>Cashback & Rewards Ledger</span>
                      </Link>

                      <Link
                        to="/price-alerts"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        <Bell className="w-4 h-4 text-slate-400" />
                        <span>Price Drop Alerts</span>
                      </Link>

                      <Link
                        to="/wishlist"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        <Heart className="w-4 h-4 text-rose-500" />
                        <span>My Wishlist ({wishlist.length})</span>
                      </Link>

                      <Link
                        to="/become-seller"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 font-bold transition-colors"
                      >
                        <Store className="w-4 h-4 text-amber-500" />
                        <span>Become a Seller</span>
                      </Link>

                      {/* Admin Command Center Link */}
                      {(currentUser?.role === 'ADMIN' || (currentUser?.role as any) === 'SUPER_ADMIN' || currentUser?.email === 'jk7217514087@gmail.com' || currentUser?.email === 'admin@smartdeal.com' || role === 'ADMIN') && (
                        <>
                          <Link
                            to={sessionStorage.getItem('smartdeal_admin_authenticated') === 'true' ? "/admin/dashboard" : "/admin/login"}
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold transition-colors"
                          >
                            <ShieldAlert className="w-4 h-4 text-rose-500" />
                            <span>Admin Command Center</span>
                          </Link>
                          {sessionStorage.getItem('smartdeal_admin_authenticated') === 'true' && (
                            <button
                              onClick={() => {
                                setIsProfileMenuOpen(false);
                                setIsSmsCenterOpen(true);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 font-bold transition-colors cursor-pointer text-left"
                            >
                              <Smartphone className="w-4 h-4 text-emerald-500" />
                              <span>Live SMS & Alerts Center</span>
                            </button>
                          )}
                        </>
                      )}

                      <div className="border-t border-slate-100 dark:border-slate-800 my-1 pt-1" />

                      <button
                        onClick={async () => {
                          await logoutUser();
                          setIsProfileMenuOpen(false);
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-bold transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                ) : (
                  /* ----------------- GUEST SHOPPER / LOGIN VIEW ----------------- */
                  <>
                    {/* Guest Header */}
                    <div className="p-3.5 bg-gradient-to-r from-slate-50 via-white to-brand-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-brand-950/20 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-black">
                          <User className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-slate-900 dark:text-white">Guest Shopper</span>
                            <span className="text-[9px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.2 rounded border border-slate-200/80 dark:border-slate-700">
                              {guestSession.guest_id || 'G-SESSION'}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Anonymous session active</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Close menu"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Tab Navigation: Sign In vs Quick Menu */}
                    <div className="p-2 bg-slate-50/70 dark:bg-slate-950/40 flex items-center gap-1.5 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setProfileTab('signin')}
                        className={`flex-1 py-1.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          profileTab === 'signin'
                            ? 'bg-white dark:bg-slate-800 text-brand-700 dark:text-brand-300 shadow-xs border border-slate-200/80 dark:border-slate-700 font-extrabold'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Sign In</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setProfileTab('menu')}
                        className={`flex-1 py-1.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          profileTab === 'menu'
                            ? 'bg-white dark:bg-slate-800 text-brand-700 dark:text-brand-300 shadow-xs border border-slate-200/80 dark:border-slate-700 font-extrabold'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        <span>Account Menu</span>
                      </button>
                    </div>

                    {/* TAB CONTENT */}
                    {profileTab === 'signin' ? (
                      <div className="p-4 space-y-3.5">
                        {/* Error Alert */}
                        {loginError && (
                          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-[11px] font-semibold animate-fadeIn">
                            {loginError}
                          </div>
                        )}

                        {/* Password Reset Sent Banner */}
                        {forgotSent && (
                          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-[11px] font-semibold flex items-center gap-1.5 animate-fadeIn">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>Reset instructions sent! Or visit <Link to="/forgot-password" onClick={() => setIsProfileMenuOpen(false)} className="underline font-bold">Forgot Password Page</Link></span>
                          </div>
                        )}

                        {/* Complete Login Form */}
                        <form onSubmit={handleQuickLogin} className="space-y-3">
                          {/* 1. Email or Mobile Input */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                Email or Mobile Number
                              </label>
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                                Auto-Register
                              </span>
                            </div>
                            <div className="relative">
                              <input
                                type="text"
                                required
                                value={loginIdentifier}
                                onChange={e => setLoginIdentifier(e.target.value)}
                                placeholder="name@example.com or phone..."
                                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
                              />
                              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                            </div>
                          </div>

                          {/* 2. Password with Show/Hide and Forgot Password */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                Password
                              </label>
                              <button
                                type="button"
                                onClick={handleForgotTrigger}
                                className="text-[10px] font-bold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
                              >
                                Forgot Password?
                              </button>
                            </div>
                            <div className="relative">
                              <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={loginPassword}
                                onChange={e => setLoginPassword(e.target.value)}
                                placeholder="Enter password..."
                                className="w-full pl-8 pr-8 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
                              />
                              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                                title={showPassword ? 'Hide password' : 'Show password'}
                              >
                                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          {/* 1-Click Test Credentials - Shopper Only */}
                          <div className="pt-1">
                            <div className="text-[10px] font-semibold text-slate-400 mb-1 flex items-center justify-between">
                              <span>Quick Demo Fill:</span>
                              <span className="text-emerald-500 font-bold">Shopper Login</span>
                            </div>
                            <div>
                              <button
                                type="button"
                                onClick={() => {
                                  setLoginIdentifier('rohit.kumar@example.com');
                                  setLoginPassword('password123');
                                  setLoginError('');
                                }}
                                className="w-full py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold transition-all text-center border border-slate-200 dark:border-slate-700 cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                <span>👤</span>
                                <span>Fill Demo Shopper Credentials (Rohit Kumar)</span>
                              </button>
                            </div>
                          </div>

                          {/* 4. Sign In Button */}
                          <button
                            type="submit"
                            disabled={isLoggingIn}
                            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-brand-600 dark:hover:bg-brand-500 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            {isLoggingIn ? (
                              <span>Signing In...</span>
                            ) : (
                              <>
                                <LogIn className="w-3.5 h-3.5" />
                                <span>Sign In Securely</span>
                              </>
                            )}
                          </button>
                        </form>

                        {/* Divider */}
                        <div className="relative flex items-center justify-center pt-1">
                          <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                          <span className="bg-white dark:bg-slate-900 px-2 text-[10px] uppercase font-bold text-slate-400 shrink-0">
                            or
                          </span>
                        </div>

                        {/* 5. Continue with Google */}
                        <button
                          type="button"
                          onClick={handleGoogleQuickLogin}
                          disabled={isLoggingIn}
                          className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                          </svg>
                          <span>Continue with Google</span>
                        </button>

                        {/* 6. Register & Full Login Page Options */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-[11px]">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 dark:text-slate-400">New to SmartDeal?</span>
                            <Link
                              to="/register"
                              onClick={() => setIsProfileMenuOpen(false)}
                              className="font-extrabold text-brand-600 dark:text-brand-400 hover:underline"
                            >
                              Create Account / Register
                            </Link>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 dark:text-slate-400">Prefer full screen?</span>
                            <Link
                              to="/login"
                              onClick={() => setIsProfileMenuOpen(false)}
                              className="font-bold text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1"
                            >
                              <span>Dedicated Login Page</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Guest Quick Menu Navigation */
                      <div className="p-2 space-y-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          <span>Guest Shopper Profile</span>
                        </Link>

                        <Link
                          to="/orders"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                          <ShoppingCart className="w-4 h-4 text-slate-400" />
                          <span>Track Existing Order</span>
                        </Link>

                        <Link
                          to="/support"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                          <HelpCircle className="w-4 h-4 text-emerald-500" />
                          <span>Help & Support Center</span>
                        </Link>

                        <Link
                          to="/price-alerts"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                          <Bell className="w-4 h-4 text-slate-400" />
                          <span>Price Drop Alerts</span>
                        </Link>

                        <Link
                          to="/become-seller"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 font-bold transition-colors"
                        >
                          <Store className="w-4 h-4 text-amber-500" />
                          <span>Become a Seller</span>
                        </Link>

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={() => setProfileTab('signin')}
                            className="w-full py-2 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 font-extrabold text-xs hover:bg-brand-100 dark:hover:bg-brand-900 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <LogIn className="w-3.5 h-3.5" />
                            <span>Sign In to Access Saved Data</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Collapsible Input */}
      {isMobileSearchOpen && (
        <div className="md:hidden px-4 pb-3 pt-2 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 animate-fadeIn">
          <form
            onSubmit={e => {
              handleSearchSubmit(e);
              setIsMobileSearchOpen(false);
            }}
          >
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder="Search products, brands, or deals..."
                className="w-full pl-10 pr-20 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-brand-500"
                autoFocus
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3" />
              <button
                type="submit"
                className="absolute right-1 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-[11px] font-bold transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {isSearchFocused && filteredSuggestions.length > 0 && (
            <div className="mt-2 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
              {filteredSuggestions.map(item => (
                <div
                  key={item.id}
                  onMouseDown={() => {
                    setIsMobileSearchOpen(false);
                    navigate(`/product/${item.id}`);
                  }}
                  className="p-2.5 flex items-center justify-between gap-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <img src={item.image} alt="" className="w-8 h-8 object-contain rounded-lg bg-slate-50 dark:bg-slate-800 p-0.5" />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{item.name}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        ₹{item.sellingPrice.toLocaleString('en-IN')} • Score: {item.dealScore}/100
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* THREE-LINE (☰) NAVIGATION DRAWER (Slide-over)                  */}
      {/* ============================================================== */}
      {isNavDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsNavDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 max-w-full flex">
            <div
              ref={navDrawerRef}
              className="w-screen max-w-xs sm:max-w-sm md:max-w-md bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              {/* Drawer Content */}
              <div>
                {/* Header */}
                <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/40">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-md shadow-brand-500/20 bg-[#00061e] flex items-center justify-center shrink-0">
                      <img
                        src="/smartdeal_icon_mark.png"
                        alt="SmartDeal Logo"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white font-sans">
                          Smart<span className={navTheme.logoTextGradient}>Deal</span>
                        </span>
                        <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-md shadow-xs border ${navTheme.proBadge}`}>
                          PRO
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium">
                        Compare • Save • Buy Smarter
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsNavDrawerOpen(false)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Close Menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Session Status Banner: Guest Shopper or User */}
                {!currentUser ? (
                  <div className="mx-4 mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white border border-indigo-900/50 shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-black tracking-wide">Guest Shopper</span>
                      </div>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-indigo-200">
                        {guestSession?.guest_id ? guestSession.guest_id.slice(0, 8) : (guestSession?.sessionId ? guestSession.sessionId.slice(0, 8) : 'G-16F90Q')}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 mt-1">
                      Anonymous browsing session active. Private & encrypted.
                    </div>
                  </div>
                ) : (
                  <div className="mx-4 mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-brand-900/40 to-indigo-950/40 border border-brand-800/40 shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-brand-600 text-white font-black text-xs flex items-center justify-center">
                        {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {currentUser.name || 'Member'}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {currentUser.email}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Explore & Compare Links */}
                <div className="p-4 space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 py-1">
                    Explore & Compare
                  </div>

                  {/* All Categories */}
                  <Link
                    to="/categories"
                    onClick={() => setIsNavDrawerOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <SlidersHorizontal className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900 dark:text-white">All Categories</div>
                        <div className="text-[10px] text-slate-400 font-normal">Browse 100+ categories & products</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  {/* Deals */}
                  <Link
                    to="/deals"
                    onClick={() => setIsNavDrawerOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-rose-50/60 dark:hover:bg-rose-950/30 text-slate-800 dark:text-slate-100 font-bold text-xs transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Flame className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-rose-600 dark:text-rose-400">Deals & Offers</div>
                        <div className="text-[10px] text-slate-400 font-normal">Up to 70% off across marketplaces</div>
                      </div>
                    </div>
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
                      HOT
                    </span>
                  </Link>

                  {/* Coupons & Offers */}
                  <Link
                    to="/coupons"
                    onClick={() => setIsNavDrawerOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Tag className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900 dark:text-white">Coupons & Discounts</div>
                        <div className="text-[10px] text-slate-400 font-normal">Verified coupon codes & vouchers</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  {/* Compare Stores */}
                  <Link
                    to="/compare"
                    onClick={() => setIsNavDrawerOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900 dark:text-white">Compare Stores</div>
                        <div className="text-[10px] text-slate-400 font-normal">Live multi-store price comparison</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  {/* Price Tracker */}
                  <Link
                    to="/price-tracker"
                    onClick={() => setIsNavDrawerOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30 text-slate-800 dark:text-slate-100 font-bold text-xs transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">Price Tracker</div>
                        <div className="text-[10px] text-slate-400 font-normal">Track historical price drops & alerts</div>
                      </div>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  </Link>

                  {/* Marketplaces */}
                  <Link
                    to="/marketplaces"
                    onClick={() => setIsNavDrawerOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Store className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900 dark:text-white">Marketplaces</div>
                        <div className="text-[10px] text-slate-400 font-normal">Amazon, Flipkart, Croma, Reliance</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  {/* Product vs Product AI */}
                  <Link
                    to="/product-vs-product"
                    onClick={() => setIsNavDrawerOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Sparkles className="w-4 h-4 text-violet-500" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900 dark:text-white">Product vs Product AI</div>
                        <div className="text-[10px] text-slate-400 font-normal">AI head-to-head comparison engine</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  {/* Flowchart */}
                  <Link
                    to="/flowchart"
                    onClick={() => setIsNavDrawerOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-cyan-50/60 dark:hover:bg-cyan-950/30 text-slate-800 dark:text-slate-100 font-bold text-xs transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Workflow className="w-4 h-4 text-cyan-500" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-cyan-600 dark:text-cyan-400">Flowchart</div>
                        <div className="text-[10px] text-slate-400 font-normal">Interactive deal finding pipeline</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Trust & Help Section */}
                <div className="p-4 pt-0 space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 py-1">
                    Help & Assurance
                  </div>

                  <Link
                    to="/support"
                    onClick={() => setIsNavDrawerOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-4 h-4 text-slate-400" />
                      <span>24/7 Support & Help Desk</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>

                  <Link
                    to="/about"
                    onClick={() => setIsNavDrawerOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>Our Anti-Fake & Price Policy</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </div>
              </div>

              {/* Drawer Bottom Actions */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 space-y-2">
                <button
                  onClick={() => {
                    setIsNavDrawerOpen(false);
                    window.dispatchEvent(new CustomEvent('trigger-app-install'));
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-brand-600 hover:from-indigo-500 hover:to-brand-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download SmartDeal App</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
