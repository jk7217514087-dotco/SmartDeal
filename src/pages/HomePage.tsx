import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/common/ProductCard';
import { mockCategories } from '../data/mockProducts';
import {
  Sparkles,
  ArrowRight,
  Flame,
  Layers,
  Clock,
  Zap,
  Tag,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Percent,
  ShoppingBag,
  TrendingDown,
  Search,
  CheckCircle2,
  Calculator,
  SlidersHorizontal,
  Bot,
  Activity,
  Truck,
  RotateCcw,
  Headphones,
  Lock
} from 'lucide-react';

interface PromoAd {
  id: string;
  badge: string;
  store: string;
  storeColor: string;
  headline: string;
  subhead: string;
  discount: string;
  ctaText: string;
  link: string;
  bgGradient: string;
  image: string;
}

interface HeroThemeConfig {
  heroSectionBg: string;
  heroBorder: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  badgeIcon: string;
  titleGradient: string;
  searchContainer: string;
  searchBtn: string;
  pillBg: string;
  pedestalGlow: string;
  pedestalOuter: string;
  pedestalInner: string;
  dealsBadge: string;
  savingsBadge: string;
  guaranteeCard: string;
  promoCard: string;
  promoButton: string;
  promoBadge: string;
  promoIcon: string;
  promoText: string;
}

const HERO_THEMES: Record<string, HeroThemeConfig> = {
  'steel-navy': {
    heroSectionBg: 'bg-gradient-to-b from-[#071324] via-[#0b1a30] to-[#0e223f]',
    heroBorder: 'border-sky-900/60',
    badgeBg: 'bg-sky-950/60',
    badgeBorder: 'border-sky-500/40',
    badgeText: 'text-sky-300',
    badgeIcon: 'text-sky-400',
    titleGradient: 'bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent',
    searchContainer: 'bg-[#071220]/95 border-sky-500/40 shadow-[0_8px_35px_rgba(56,189,248,0.22)] focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-400/25',
    searchBtn: 'bg-gradient-to-r from-sky-400 via-sky-300 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-slate-950 shadow-sky-500/35 font-black',
    pillBg: 'bg-[#0c1c33] hover:bg-sky-500/20 border-sky-900/50 hover:border-sky-400 text-sky-100 hover:text-white',
    pedestalGlow: 'bg-gradient-to-tr from-sky-500/30 via-blue-400/25 to-sky-600/30',
    pedestalOuter: 'border-sky-400/75 bg-[#112240]/90 shadow-[0_0_65px_rgba(56,189,248,0.55)]',
    pedestalInner: 'border-sky-300/40 bg-gradient-to-b from-sky-950/60 to-[#0b1a30]/80',
    dealsBadge: 'bg-gradient-to-r from-sky-400 to-cyan-300 text-slate-950 shadow-sky-500/40 font-black',
    savingsBadge: 'bg-[#071426]/95 border-sky-400/50 text-sky-200',
    guaranteeCard: 'bg-[#112240]/85 border-sky-900/50 hover:border-sky-500/50',
    promoCard: 'bg-gradient-to-br from-[#0c1f38] via-[#102a4d] to-[#08172c] border-sky-500/40 hover:border-sky-400/60 hover:shadow-[0_12px_35px_-8px_rgba(56,189,248,0.35)]',
    promoButton: 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-sky-500/30 text-white font-black',
    promoBadge: 'bg-sky-500/15 border-sky-500/30 text-sky-300',
    promoIcon: 'text-sky-300',
    promoText: 'text-sky-100/70',
  },
  'matrix-lime': {
    heroSectionBg: 'bg-gradient-to-b from-[#0a0d0a] via-[#111612] to-[#151c16]',
    heroBorder: 'border-lime-900/60',
    badgeBg: 'bg-lime-950/60',
    badgeBorder: 'border-lime-500/40',
    badgeText: 'text-lime-300',
    badgeIcon: 'text-lime-400',
    titleGradient: 'bg-gradient-to-r from-lime-300 via-lime-400 to-green-400 bg-clip-text text-transparent',
    searchContainer: 'bg-[#0b0e0c]/95 border-lime-500/40 shadow-[0_8px_35px_rgba(163,230,53,0.22)] focus-within:border-lime-400 focus-within:ring-2 focus-within:ring-lime-400/25',
    searchBtn: 'bg-gradient-to-r from-[#bef264] via-[#a3e635] to-[#84cc16] hover:from-[#d9f99d] hover:to-[#a3e635] text-slate-950 shadow-lime-500/35 font-black',
    pillBg: 'bg-[#131c15] hover:bg-lime-500/20 border-lime-900/50 hover:border-lime-400 text-lime-100 hover:text-white',
    pedestalGlow: 'bg-gradient-to-tr from-lime-500/35 via-green-400/25 to-lime-600/30',
    pedestalOuter: 'border-lime-400/80 bg-[#162118]/90 shadow-[0_0_65px_rgba(163,230,53,0.6)]',
    pedestalInner: 'border-lime-300/40 bg-gradient-to-b from-lime-950/60 to-[#111612]/80',
    dealsBadge: 'bg-gradient-to-r from-[#bef264] to-[#a3e635] text-slate-950 shadow-lime-500/40 font-black',
    savingsBadge: 'bg-[#0c120d]/95 border-lime-400/50 text-lime-200',
    guaranteeCard: 'bg-[#172219]/85 border-lime-900/50 hover:border-lime-500/50',
    promoCard: 'bg-gradient-to-br from-[#131d14] via-[#1a291d] to-[#0c140d] border-lime-500/40 hover:border-lime-400/60 hover:shadow-[0_12px_35px_-8px_rgba(163,230,53,0.35)]',
    promoButton: 'bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-400 hover:to-green-500 shadow-lime-500/30 text-slate-950 font-black',
    promoBadge: 'bg-lime-500/15 border-lime-500/30 text-lime-300',
    promoIcon: 'text-lime-300',
    promoText: 'text-lime-100/70',
  },
  'sunset-coral': {
    heroSectionBg: 'bg-gradient-to-b from-[#13071c] via-[#1c0b29] to-[#250f37]',
    heroBorder: 'border-rose-900/60',
    badgeBg: 'bg-rose-950/60',
    badgeBorder: 'border-rose-500/40',
    badgeText: 'text-rose-300',
    badgeIcon: 'text-rose-400',
    titleGradient: 'bg-gradient-to-r from-rose-400 via-pink-300 to-orange-400 bg-clip-text text-transparent',
    searchContainer: 'bg-[#14061e]/95 border-rose-500/40 shadow-[0_8px_35px_rgba(244,63,94,0.22)] focus-within:border-rose-400 focus-within:ring-2 focus-within:ring-rose-400/25',
    searchBtn: 'bg-gradient-to-r from-orange-400 via-rose-400 to-pink-500 hover:from-orange-300 hover:to-pink-400 text-white shadow-rose-500/35 font-black',
    pillBg: 'bg-[#220d32] hover:bg-rose-500/20 border-rose-900/50 hover:border-rose-400 text-rose-100 hover:text-white',
    pedestalGlow: 'bg-gradient-to-tr from-rose-500/35 via-pink-400/25 to-orange-500/30',
    pedestalOuter: 'border-rose-400/80 bg-[#28113b]/90 shadow-[0_0_65px_rgba(244,63,94,0.6)]',
    pedestalInner: 'border-pink-300/40 bg-gradient-to-b from-rose-950/60 to-[#1c0b29]/80',
    dealsBadge: 'bg-gradient-to-r from-orange-400 to-rose-400 text-white shadow-rose-500/40 font-black',
    savingsBadge: 'bg-[#160721]/95 border-rose-400/50 text-rose-200',
    guaranteeCard: 'bg-[#28113b]/85 border-rose-900/50 hover:border-rose-500/50',
    promoCard: 'bg-gradient-to-br from-[#240e36] via-[#33144c] to-[#1a0927] border-rose-500/40 hover:border-rose-400/60 hover:shadow-[0_12px_35px_-8px_rgba(244,63,94,0.35)]',
    promoButton: 'bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-400 hover:to-rose-500 shadow-rose-500/30 text-white font-black',
    promoBadge: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
    promoIcon: 'text-rose-300',
    promoText: 'text-rose-100/70',
  },
  'aurora-jade': {
    heroSectionBg: 'bg-gradient-to-b from-[#02140d] via-[#051f15] to-[#092b1e]',
    heroBorder: 'border-emerald-900/60',
    badgeBg: 'bg-emerald-950/60',
    badgeBorder: 'border-emerald-500/40',
    badgeText: 'text-emerald-300',
    badgeIcon: 'text-emerald-400',
    titleGradient: 'bg-gradient-to-r from-emerald-300 via-teal-300 to-green-400 bg-clip-text text-transparent',
    searchContainer: 'bg-[#03150e]/95 border-emerald-500/40 shadow-[0_8px_35px_rgba(34,197,94,0.22)] focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-400/25',
    searchBtn: 'bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 shadow-emerald-500/35 font-black',
    pillBg: 'bg-[#07261a] hover:bg-emerald-500/20 border-emerald-900/50 hover:border-emerald-400 text-emerald-100 hover:text-white',
    pedestalGlow: 'bg-gradient-to-tr from-emerald-500/35 via-green-400/25 to-teal-500/30',
    pedestalOuter: 'border-emerald-400/80 bg-[#092e20]/90 shadow-[0_0_65px_rgba(34,197,94,0.6)]',
    pedestalInner: 'border-emerald-300/40 bg-gradient-to-b from-emerald-950/60 to-[#051f15]/80',
    dealsBadge: 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 shadow-emerald-500/40 font-black',
    savingsBadge: 'bg-[#041911]/95 border-emerald-400/50 text-emerald-200',
    guaranteeCard: 'bg-[#092e20]/85 border-emerald-900/50 hover:border-emerald-500/50',
    promoCard: 'bg-gradient-to-br from-[#08281c] via-[#0d3b2a] to-[#041a12] border-emerald-500/40 hover:border-emerald-400/60 hover:shadow-[0_12px_35px_-8px_rgba(34,197,94,0.35)]',
    promoButton: 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/30 text-slate-950 font-black',
    promoBadge: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
    promoIcon: 'text-emerald-300',
    promoText: 'text-emerald-100/70',
  },
  'royal-gold': {
    heroSectionBg: 'bg-gradient-to-b from-[#140e05] via-[#241709] to-[#181107]',
    heroBorder: 'border-amber-900/60',
    badgeBg: 'bg-amber-500/15',
    badgeBorder: 'border-amber-400/40',
    badgeText: 'text-amber-300',
    badgeIcon: 'text-amber-400',
    titleGradient: 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent',
    searchContainer: 'bg-[#0d0d08]/95 border-amber-500/40 shadow-[0_8px_35px_rgba(245,158,11,0.25)] focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/25',
    searchBtn: 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 shadow-amber-500/35 font-black',
    pillBg: 'bg-[#12120b] hover:bg-amber-500/20 border-amber-900/50 hover:border-amber-400 text-amber-100 hover:text-white',
    pedestalGlow: 'bg-gradient-to-tr from-amber-500/30 via-yellow-400/25 to-amber-600/30',
    pedestalOuter: 'border-amber-400/70 bg-[#251a0b]/90 shadow-[0_0_65px_rgba(245,158,11,0.55)]',
    pedestalInner: 'border-yellow-300/40 bg-gradient-to-b from-amber-950/40 to-[#181107]/80',
    dealsBadge: 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 shadow-amber-500/40 font-black',
    savingsBadge: 'bg-[#120f08]/95 border-amber-400/50 text-amber-300',
    guaranteeCard: 'bg-[#241a0b]/85 border-amber-900/50 hover:border-amber-500/50',
    promoCard: 'bg-gradient-to-br from-[#271b0b] via-[#35240f] to-[#1c1407] border-amber-500/40 hover:border-amber-400/60 hover:shadow-[0_12px_35px_-8px_rgba(245,158,11,0.35)]',
    promoButton: 'bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 hover:from-amber-500 hover:to-yellow-500 shadow-amber-600/30 text-slate-950 font-black',
    promoBadge: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
    promoIcon: 'text-amber-300',
    promoText: 'text-amber-100/70',
  },
  'cyber-indigo': {
    heroSectionBg: 'bg-gradient-to-b from-[#050620] via-[#08092d] to-[#0d0f3c]',
    heroBorder: 'border-violet-900/60',
    badgeBg: 'bg-violet-950/60',
    badgeBorder: 'border-violet-500/40',
    badgeText: 'text-violet-300',
    badgeIcon: 'text-violet-400',
    titleGradient: 'bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent',
    searchContainer: 'bg-[#070826]/95 border-violet-500/40 shadow-[0_8px_35px_rgba(139,92,246,0.22)] focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-400/25',
    searchBtn: 'bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 hover:from-violet-400 hover:to-indigo-400 text-white shadow-violet-500/35 font-black',
    pillBg: 'bg-[#101347] hover:bg-violet-500/20 border-violet-900/50 hover:border-violet-400 text-violet-100 hover:text-white',
    pedestalGlow: 'bg-gradient-to-tr from-violet-500/35 via-indigo-400/25 to-purple-500/30',
    pedestalOuter: 'border-violet-400/80 bg-[#0f1248]/90 shadow-[0_0_65px_rgba(139,92,246,0.6)]',
    pedestalInner: 'border-violet-300/40 bg-gradient-to-b from-violet-950/60 to-[#08092d]/80',
    dealsBadge: 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-violet-500/40 font-black',
    savingsBadge: 'bg-[#080930]/95 border-violet-400/50 text-violet-200',
    guaranteeCard: 'bg-[#0f1248]/85 border-violet-900/50 hover:border-violet-500/50',
    promoCard: 'bg-gradient-to-br from-[#0c0f44] via-[#14195d] to-[#070929] border-violet-500/40 hover:border-violet-400/60 hover:shadow-[0_12px_35px_-8px_rgba(139,92,246,0.35)]',
    promoButton: 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-violet-600/30 text-white font-black',
    promoBadge: 'bg-violet-500/15 border-violet-500/30 text-violet-300',
    promoIcon: 'text-violet-300',
    promoText: 'text-violet-100/70',
  },
  'pure-white': {
    heroSectionBg: 'bg-white border-b border-slate-200',
    heroBorder: 'border-slate-200',
    badgeBg: 'bg-blue-50',
    badgeBorder: 'border-blue-200',
    badgeText: 'text-blue-700',
    badgeIcon: 'text-blue-600',
    titleGradient: 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent',
    searchContainer: 'bg-white border-slate-300 shadow-md focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20',
    searchBtn: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 font-black',
    pillBg: 'bg-slate-100 hover:bg-blue-50 border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 shadow-xs',
    pedestalGlow: 'bg-gradient-to-tr from-blue-500/10 via-cyan-400/10 to-indigo-600/10',
    pedestalOuter: 'border-slate-200 bg-white shadow-lg',
    pedestalInner: 'border-slate-100 bg-white',
    dealsBadge: 'bg-blue-600 text-white shadow-md shadow-blue-500/25 font-black',
    savingsBadge: 'bg-white border-blue-200 text-blue-700 shadow-xs',
    guaranteeCard: 'bg-white border-slate-200 hover:border-blue-400 shadow-xs',
    promoCard: 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20',
    promoButton: 'bg-white hover:bg-slate-100 text-blue-600 font-black shadow-md',
    promoBadge: 'bg-white/20 border-white/30 text-white',
    promoIcon: 'text-white',
    promoText: 'text-blue-100',
  },
};

export const HomePage: React.FC = () => {
  const { products, trackActivity, activeTheme } = useApp();
  const themeKey = (activeTheme === 'cyber-emerald' ? 'aurora-jade' : activeTheme) || 'pure-white';
  const heroTheme = HERO_THEMES[themeKey] || HERO_THEMES['pure-white'];
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [flashTime, setFlashTime] = useState({ hours: 7, minutes: 24, seconds: 15 });

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      trackActivity('SEARCH_PRODUCT', { query: heroSearch.trim(), source: 'hero_search' });
      navigate(`/search?q=${encodeURIComponent(heroSearch.trim())}`);
    }
  };

  // Promotional Ad Banners for the Top Carousel
  const promoAds: PromoAd[] = [
    {
      id: 'ad-amazon-electronics',
      badge: 'SPONSORED AD • MEGA SALE',
      store: 'Amazon India',
      storeColor: 'bg-amber-500 text-slate-950',
      headline: 'Amazon Electronics Fest',
      subhead: 'Up to 70% Off on Smartphones, Audio & Laptops + Extra ₹2,500 Instant Bank Discount',
      discount: 'UP TO 70% OFF',
      ctaText: 'Shop Amazon Deals',
      link: '/categories?cat=Electronics',
      bgGradient: 'from-slate-900 via-indigo-950 to-blue-950',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'ad-flipkart-mobiles',
      badge: 'PROMOTIONAL AD • BEST PRICE',
      store: 'Flipkart',
      storeColor: 'bg-blue-500 text-white',
      headline: 'Flipkart Super Value Week',
      subhead: 'Lowest Verified Prices on Samsung, Apple & OnePlus 5G Phones with Free Next-Day Delivery',
      discount: 'SAVE UP TO ₹12,000',
      ctaText: 'View Flipkart Offers',
      link: '/categories?cat=Mobiles',
      bgGradient: 'from-blue-950 via-slate-900 to-indigo-950',
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'ad-croma-appliances',
      badge: 'OFFICIAL PARTNER AD',
      store: 'Croma Retail',
      storeColor: 'bg-teal-500 text-slate-950',
      headline: 'Croma Tech Carnival',
      subhead: 'High-Performance Laptops, 4K Smart TVs & Premium Audio with Genuine Brand Warranty',
      discount: 'FLAT 45% OFF',
      ctaText: 'Explore Croma Deals',
      link: '/categories?cat=Laptops',
      bgGradient: 'from-teal-950 via-slate-900 to-cyan-950',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'ad-fashion-sneakers',
      badge: 'SPONSORED BRAND AD',
      store: 'Myntra & Ajio',
      storeColor: 'bg-rose-500 text-white',
      headline: 'Sneaker & Fashion Gala',
      subhead: 'Nike, Puma, Adidas Running Shoes & Trendy Apparel with 100% Verified Quality Guarantee',
      discount: 'MIN. 50% OFF',
      ctaText: 'Grab Fashion Deals',
      link: '/categories?cat=Shoes',
      bgGradient: 'from-purple-950 via-slate-900 to-rose-950',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80'
    }
  ];

  // Auto-slide advertisement carousel every 5 seconds
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % promoAds.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, [promoAds.length]);

  // Flash sale countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setFlashTime(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 8, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter products by selected category
  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => {
        const catFilter = selectedCategory.toLowerCase();
        const pCat = p.category.toLowerCase();
        return pCat === catFilter ||
          (catFilter.includes('fashion') && (pCat === 'fashion' || p.name.toLowerCase().includes('shoe'))) ||
          (catFilter.includes('shoe') && (pCat === 'fashion' || p.name.toLowerCase().includes('shoe')));
      });

  // High discount products for Lightning Flash Deals section
  const flashProducts = [...products].sort((a, b) => b.discountPercent - a.discountPercent).slice(0, 6);

  return (
    <div className="space-y-10 pb-16 w-full max-w-full overflow-x-hidden">
      {/* SECTION 4.2 & 4.3: PANEL 1 HERO SECTION (2-COLUMN WITH FLOATING SHOWCASE) */}
      <section className={`relative overflow-hidden w-full max-w-full ${themeKey === 'pure-white' ? 'text-slate-900' : 'text-white'} pt-8 pb-12 border-b -mt-2 transition-colors duration-500 ${heroTheme.heroSectionBg} ${heroTheme.heroBorder}`}>
        {/* Dynamic Theme Ambient Glow & Light Wave Sweeps */}
        {themeKey === 'matrix-lime' && (
          <>
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(to_right,#a3e63518_1px,transparent_1px),linear-gradient(to_bottom,#a3e63518_1px,transparent_1px)] bg-[size:36px_36px]" />
            <div className="hidden sm:block absolute top-1/4 left-1/4 w-[600px] h-[350px] bg-lime-500/18 rounded-full blur-[140px] pointer-events-none" />
            <div className="hidden sm:block absolute top-1/3 right-1/4 w-[500px] h-[300px] bg-green-500/14 rounded-full blur-[130px] pointer-events-none" />
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 1440 600" fill="none">
              <path d="M-100 220 C350 120, 650 480, 1500 180" stroke="url(#limeGrad1)" strokeWidth="3" />
              <path d="M-50 380 C450 260, 850 560, 1600 280" stroke="url(#limeGrad2)" strokeWidth="1.5" />
              <defs>
                <linearGradient id="limeGrad1" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#bef264" stopOpacity="0" />
                  <stop offset="50%" stopColor="#a3e635" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#84cc16" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="limeGrad2" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#65a30d" stopOpacity="0" />
                  <stop offset="50%" stopColor="#bef264" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#a3e635" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </>
        )}
        {themeKey === 'steel-navy' && (
          <>
            <div className="hidden sm:block absolute top-1/4 left-1/4 w-[600px] h-[350px] bg-sky-500/16 rounded-full blur-[140px] pointer-events-none" />
            <div className="hidden sm:block absolute top-1/3 right-1/4 w-[500px] h-[300px] bg-blue-500/14 rounded-full blur-[130px] pointer-events-none" />
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 1440 600" fill="none">
              <path d="M-100 220 C350 120, 650 480, 1500 180" stroke="url(#skyGrad1)" strokeWidth="3" />
              <path d="M-50 380 C450 260, 850 560, 1600 280" stroke="url(#skyGrad2)" strokeWidth="1.5" />
              <defs>
                <linearGradient id="skyGrad1" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
                  <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="skyGrad2" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0369a1" stopOpacity="0" />
                  <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </>
        )}
        {themeKey === 'sunset-coral' && (
          <>
            <div className="hidden sm:block absolute top-1/4 left-1/4 w-[600px] h-[350px] bg-rose-500/18 rounded-full blur-[140px] pointer-events-none" />
            <div className="hidden sm:block absolute top-1/3 right-1/4 w-[500px] h-[300px] bg-orange-500/14 rounded-full blur-[130px] pointer-events-none" />
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 1440 600" fill="none">
              <path d="M-100 220 C350 120, 650 480, 1500 180" stroke="url(#coralGrad1)" strokeWidth="3" />
              <path d="M-50 380 C450 260, 850 560, 1600 280" stroke="url(#coralGrad2)" strokeWidth="1.5" />
              <defs>
                <linearGradient id="coralGrad1" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0" />
                  <stop offset="50%" stopColor="#fb7185" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="coralGrad2" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ea580c" stopOpacity="0" />
                  <stop offset="50%" stopColor="#f43f5e" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#fb7185" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </>
        )}
        {themeKey === 'aurora-jade' && (
          <>
            <div className="hidden sm:block absolute top-1/4 left-1/4 w-[600px] h-[350px] bg-emerald-500/18 rounded-full blur-[140px] pointer-events-none" />
            <div className="hidden sm:block absolute top-1/3 right-1/4 w-[500px] h-[300px] bg-teal-500/14 rounded-full blur-[130px] pointer-events-none" />
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 1440 600" fill="none">
              <path d="M-100 220 C350 120, 650 480, 1500 180" stroke="url(#auroraGrad1)" strokeWidth="3" />
              <path d="M-50 380 C450 260, 850 560, 1600 280" stroke="url(#auroraGrad2)" strokeWidth="1.5" />
              <defs>
                <linearGradient id="auroraGrad1" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0" />
                  <stop offset="50%" stopColor="#4ade80" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="auroraGrad2" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#059669" stopOpacity="0" />
                  <stop offset="50%" stopColor="#22c55e" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </>
        )}
        {themeKey === 'royal-gold' && (
          <>
            <div className="hidden sm:block absolute top-1/4 left-1/4 w-[600px] h-[350px] bg-amber-500/15 rounded-full blur-[140px] pointer-events-none" />
            <div className="hidden sm:block absolute top-1/3 right-1/4 w-[500px] h-[300px] bg-yellow-500/10 rounded-full blur-[130px] pointer-events-none" />
            <div className="hidden sm:block absolute bottom-10 left-1/3 w-[450px] h-[250px] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" viewBox="0 0 1440 600" fill="none">
              <path d="M-100 200 C300 100, 600 450, 1500 150" stroke="url(#goldGradient1)" strokeWidth="3" />
              <path d="M-50 350 C400 250, 800 550, 1600 250" stroke="url(#goldGradient2)" strokeWidth="1.5" />
              <defs>
                <linearGradient id="goldGradient1" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0" />
                  <stop offset="50%" stopColor="#FCD34D" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="goldGradient2" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#B45309" stopOpacity="0" />
                  <stop offset="60%" stopColor="#FDE68A" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </>
        )}
        {themeKey === 'cyber-indigo' && (
          <>
            <div className="hidden sm:block absolute top-1/4 left-1/4 w-[600px] h-[350px] bg-violet-500/18 rounded-full blur-[140px] pointer-events-none" />
            <div className="hidden sm:block absolute top-1/3 right-1/4 w-[500px] h-[300px] bg-indigo-500/14 rounded-full blur-[130px] pointer-events-none" />
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 1440 600" fill="none">
              <path d="M-100 220 C350 120, 650 480, 1500 180" stroke="url(#indigoGrad1)" strokeWidth="3" />
              <path d="M-50 380 C450 260, 850 560, 1600 280" stroke="url(#indigoGrad2)" strokeWidth="1.5" />
              <defs>
                <linearGradient id="indigoGrad1" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
                  <stop offset="50%" stopColor="#a855f7" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="indigoGrad2" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0" />
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </>
        )}
        {themeKey === 'pure-white' && (
          <>
            <div className="hidden sm:block absolute top-0 right-1/4 w-[500px] h-[350px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="hidden sm:block absolute top-1/3 left-1/4 w-[400px] h-[250px] bg-purple-500/8 rounded-full blur-[120px] pointer-events-none" />
          </>
        )}

        <div className="max-w-7xl mx-auto px-4 relative z-10 w-full overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Heading, Subtitle, Search Bar & Category Pills */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black shadow-xs border ${heroTheme.badgeBg} ${heroTheme.badgeBorder} ${heroTheme.badgeText}`}>
                <ShoppingBag className={`w-3.5 h-3.5 ${heroTheme.badgeIcon}`} />
                <span>SmartDeal Platform • Intelligent Comparison</span>
              </div>

              <div className="space-y-3">
                <h1 className={`text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight leading-tight ${themeKey === 'pure-white' ? 'text-slate-900' : 'text-white'}`}>
                  Find the Best Price. <br />
                  <span className={themeKey === 'pure-white' ? 'text-slate-700' : 'text-slate-100'}>Compare. Save. </span>
                  <span className={heroTheme.titleGradient}>Buy Smarter.</span>
                </h1>

                <p className={`text-sm sm:text-base ${themeKey === 'pure-white' ? 'text-slate-600' : 'text-slate-300'} max-w-xl leading-relaxed`}>
                  Compare prices, offers and deals across multiple marketplaces before you buy.
                </p>
              </div>

              {/* Search Bar matching Panel 1 */}
              <form onSubmit={handleHeroSearch} className="max-w-xl">
                <div className={`relative flex items-center rounded-2xl p-2 border transition-all ${heroTheme.searchContainer}`}>
                  <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                  <input
                    type="text"
                    value={heroSearch}
                    onChange={e => setHeroSearch(e.target.value)}
                    placeholder="Search products, brands or categories..."
                    className={`w-full bg-transparent px-3 py-2 text-sm ${themeKey === 'pure-white' ? 'text-slate-900 placeholder-slate-400' : 'text-white placeholder-slate-400'} focus:outline-none`}
                  />
                  <button
                    type="submit"
                    className={`px-6 py-2.5 rounded-xl font-black text-xs transition-all shrink-0 cursor-pointer active:scale-95 shadow-lg ${heroTheme.searchBtn}`}
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Category pill shortcuts directly under search */}
              <div className={`flex flex-wrap items-center gap-2 pt-1 text-xs ${themeKey === 'pure-white' ? 'text-slate-600' : 'text-slate-300'}`}>
                {[
                  { name: 'iPhone', query: 'iPhone 15' },
                  { name: 'Laptop', query: 'Laptop' },
                  { name: 'Headphones', query: 'Headphones' },
                  { name: 'Shoes', query: 'Shoes' },
                  { name: 'TV', query: 'TV' },
                  { name: 'Smartwatch', query: 'Smartwatch' },
                  { name: 'Refrigerator', query: 'Refrigerator' }
                ].map(item => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => navigate(`/search?q=${encodeURIComponent(item.query)}`)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95 border ${heroTheme.pillBg}`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Composite Multi-Device Glowing Showcase */}
            <div className="lg:col-span-5 flex justify-center relative w-full overflow-hidden sm:overflow-visible">
              <div className="relative w-full max-w-[320px] sm:max-w-[420px] aspect-square flex items-center justify-center">
                {/* Glowing neon circular pedestal */}
                <div className={`absolute inset-0 rounded-full blur-2xl animate-pulse ${heroTheme.pedestalGlow}`} />

                {/* Outer Ring */}
                <div className={`absolute w-72 h-72 rounded-full border-2 flex items-center justify-center transition-all ${heroTheme.pedestalOuter}`}>
                  {/* Inner Ring */}
                  <div className={`w-56 h-56 rounded-full border ${heroTheme.pedestalInner}`} />
                </div>

                {/* Floating % BEST DEALS Badge */}
                <div className={`absolute top-2 right-2 z-20 px-4 py-2 rounded-2xl font-black text-xs shadow-xl flex items-center gap-1.5 rotate-6 hover:rotate-0 transition-transform ${heroTheme.dealsBadge}`}>
                  <span className="text-sm font-black">%</span>
                  <span>BEST DEALS</span>
                </div>

                {/* Floating Up to 50% Savings Badge */}
                <div className={`absolute bottom-4 right-2 z-20 px-4 py-2 rounded-2xl backdrop-blur-md font-black text-xs shadow-xl flex items-center gap-2 border ${heroTheme.savingsBadge}`}>
                  <span className="text-emerald-400">↗</span>
                  <span>Up to 50% Savings</span>
                </div>

                {/* Tech Devices Composition: Phone, Smartwatch, AirPods, Sneaker */}
                <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
                  {/* iPhone */}
                  <img
                    src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80"
                    alt="iPhone"
                    className="absolute w-32 h-52 object-cover rounded-3xl shadow-2xl border border-white/20 -translate-x-12 -translate-y-2 rotate-2 z-10"
                  />
                  {/* Earbuds / AirPods Case */}
                  <img
                    src="https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80"
                    alt="Earbuds"
                    className="absolute w-24 h-24 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)] -translate-x-28 translate-y-12 z-20"
                  />
                  {/* Smartwatch */}
                  <img
                    src="https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80"
                    alt="Smartwatch"
                    className="absolute w-24 h-24 object-contain drop-shadow-xl translate-x-12 translate-y-12 z-20"
                  />
                  {/* Nike Sneaker */}
                  <img
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80"
                    alt="Sneaker"
                    className="absolute w-36 h-28 object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.85)] translate-x-28 translate-y-16 rotate-12 z-20"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* MARKETPLACE RIBBON CARD */}
          <div className={`mt-10 p-4 rounded-2xl border shadow-2xl backdrop-blur-md transition-colors ${heroTheme.guaranteeCard}`}>
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className={`${themeKey === 'pure-white' ? 'text-slate-700' : 'text-slate-300'} font-bold flex items-center gap-2`}>
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Supported Marketplaces:</span>
              </span>
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 font-black">
                <button
                  type="button"
                  onClick={() => navigate('/compare/prod-apple-iphone15')}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/25 hover:bg-amber-500/20 transition-all cursor-pointer"
                >
                  amazon
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/compare/prod-hp-pavilion-15')}
                  className="px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/25 hover:bg-blue-500/20 transition-all cursor-pointer"
                >
                  Flipkart
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/compare/prod-apple-iphone15')}
                  className="px-3 py-1.5 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/25 hover:bg-pink-500/20 transition-all cursor-pointer"
                >
                  meesho
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/compare/prod-samsung-watch-6')}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/25 hover:bg-rose-500/20 transition-all cursor-pointer"
                >
                  Myntra
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/compare/prod-apple-iphone15')}
                  className="px-3 py-1.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/25 hover:bg-teal-500/20 transition-all cursor-pointer"
                >
                  AJIO
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/compare/prod-apple-iphone15')}
                  className="px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/25 hover:bg-purple-500/20 transition-all cursor-pointer"
                >
                  TATA CLIQ
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/compare/prod-apple-iphone15')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/20 transition-all cursor-pointer"
                >
                  croma
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/compare/prod-apple-iphone15')}
                  className="px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/25 hover:bg-red-500/20 transition-all cursor-pointer"
                >
                  reliance digital
                </button>
                <Link
                  to="/marketplaces"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                >
                  + More
                </Link>
              </div>
            </div>
          </div>

          {/* 4 VALUE GUARANTEES STRIP */}
          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${heroTheme.guaranteeCard}`}>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className={`text-xs font-bold ${themeKey === 'pure-white' ? 'text-slate-900' : 'text-white'}`}>Free Shipping</div>
                <div className="text-[11px] text-slate-400">On orders over ₹499</div>
              </div>
            </div>

            <div className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${heroTheme.guaranteeCard}`}>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className={`text-xs font-bold ${themeKey === 'pure-white' ? 'text-slate-900' : 'text-white'}`}>Secure Payments</div>
                <div className="text-[11px] text-slate-400">100% secure & trusted</div>
              </div>
            </div>

            <div className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${heroTheme.guaranteeCard}`}>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <div className={`text-xs font-bold ${themeKey === 'pure-white' ? 'text-slate-900' : 'text-white'}`}>Easy Returns</div>
                <div className="text-[11px] text-slate-400">Hassle-free process</div>
              </div>
            </div>

            <div className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${heroTheme.guaranteeCard}`}>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <div className={`text-xs font-bold ${themeKey === 'pure-white' ? 'text-slate-900' : 'text-white'}`}>24/7 Support</div>
                <div className="text-[11px] text-slate-400">We're here to help</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOP PROMOTIONAL AD BANNER CAROUSEL */}
      <section className="max-w-7xl mx-auto px-4 pt-2">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
          <div
            className={`bg-gradient-to-r ${promoAds[activeSlide].bgGradient} p-6 sm:p-10 text-white min-h-[340px] sm:min-h-[380px] flex flex-col justify-between relative transition-all duration-500`}
          >
            {/* Background ambient decorative shapes */}
            <div className="hidden sm:block absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="hidden sm:block absolute bottom-0 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Bar inside Ad Banner */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-full bg-white/15 border border-white/25 text-amber-300 backdrop-blur-md flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{promoAds[activeSlide].badge}</span>
                </span>
                <span className={`text-[10px] sm:text-xs font-extrabold px-2.5 py-1 rounded-full ${promoAds[activeSlide].storeColor}`}>
                  {promoAds[activeSlide].store}
                </span>
              </div>

              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                Ad • Sponsored Deal
              </span>
            </div>

            {/* Middle Content inside Ad Banner */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-4 z-10">
              <div className="md:col-span-8 space-y-3">
                <div className="inline-block px-3 py-1 rounded-lg bg-rose-500 text-white text-xs font-black tracking-wider uppercase shadow-md shadow-rose-500/30">
                  {promoAds[activeSlide].discount}
                </div>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                  {promoAds[activeSlide].headline}
                </h1>
                <p className="text-xs sm:text-base text-slate-300 max-w-xl leading-relaxed">
                  {promoAds[activeSlide].subhead}
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    to={promoAds[activeSlide].link}
                    className="px-6 py-3 rounded-2xl bg-white text-slate-950 hover:bg-slate-100 font-black text-xs sm:text-sm shadow-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                  >
                    <span>{promoAds[activeSlide].ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/compare"
                    className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm backdrop-blur-md transition-all flex items-center gap-1.5"
                  >
                    <Layers className="w-4 h-4 text-indigo-300" />
                    <span>Compare Live Prices</span>
                  </Link>
                </div>
              </div>

              {/* Product Visual on right */}
              <div className="hidden md:flex md:col-span-4 justify-center items-center">
                <div className="relative w-56 h-56 rounded-3xl bg-white/5 border border-white/15 p-4 backdrop-blur-md flex items-center justify-center shadow-2xl group">
                  <img
                    src={promoAds[activeSlide].image}
                    alt={promoAds[activeSlide].headline}
                    className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute -bottom-3 bg-slate-900 text-emerald-400 border border-emerald-500/40 text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
                    100% Genuine Store Deal
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Carousel Controls & Indicator Dots */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10 z-10">
              <div className="flex items-center gap-2">
                {promoAds.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      activeSlide === idx ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveSlide(prev => (prev - 1 + promoAds.length) % promoAds.length)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                  aria-label="Previous Ad"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveSlide(prev => (prev + 1) % promoAds.length)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                  aria-label="Next Ad"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PANEL 1: TRENDING PRODUCTS SECTION (5 COLUMNS: 4 PRODUCTS + CASHBACK CARD) */}
      <section className="max-w-7xl mx-auto px-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>Trending Products</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                Verified Best Prices
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Comparing live prices across Amazon, Flipkart, Croma, Myntra & partner stores
            </p>
          </div>
          <Link
            to="/categories"
            className="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
          {/* Card 1: iPhone 15 */}
          {products.find(p => p.id === 'prod-apple-iphone15') && (
            <ProductCard product={products.find(p => p.id === 'prod-apple-iphone15')!} />
          )}

          {/* Card 2: HP Pavilion 15 */}
          {products.find(p => p.id === 'prod-hp-pavilion-15') && (
            <ProductCard product={products.find(p => p.id === 'prod-hp-pavilion-15')!} />
          )}

          {/* Card 3: boAt Airdopes 141 */}
          {products.find(p => p.id === 'prod-boat-airdopes') && (
            <ProductCard product={products.find(p => p.id === 'prod-boat-airdopes')!} />
          )}

          {/* Card 4: Samsung Galaxy Watch6 */}
          {products.find(p => p.id === 'prod-samsung-watch-6') && (
            <ProductCard product={products.find(p => p.id === 'prod-samsung-watch-6')!} />
          )}

          {/* Card 5: SmartDeal Cashback Special Promo Card */}
          <div className={`rounded-3xl p-5 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group transition-all duration-300 min-h-[360px] border ${heroTheme.promoCard}`}>
            <div className="absolute top-0 right-0 w-36 h-36 rounded-full blur-2xl pointer-events-none opacity-40 bg-white/10" />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-30 bg-white/10" />
            <div className="space-y-3 relative z-10">
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black border ${heroTheme.promoBadge}`}>
                <Sparkles className={`w-3 h-3 ${heroTheme.promoIcon}`} />
                <span>SmartDeal Guarantee</span>
              </div>
              <h3 className="text-lg font-black leading-tight text-white">
                Real-Time Best Price Finder
              </h3>
              <p className={`text-xs leading-snug ${heroTheme.promoText}`}>
                Compare live prices and get the guaranteed lowest rates across top stores.
              </p>
            </div>

            <div className="pt-4 space-y-4 relative z-10">
              <Link
                to="/deals"
                className={`w-full py-2.5 px-4 rounded-xl font-black text-xs text-center flex items-center justify-center gap-1.5 shadow-lg transition-all cursor-pointer active:scale-95 ${heroTheme.promoButton}`}
              >
                <span>Explore Verified Deals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY FILTER CHIPS */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-400 shadow-xs'
            }`}
          >
            All Products ({products.length})
          </button>
          {mockCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                trackActivity('SEARCH_PRODUCT', {
                  category: cat.name,
                  filterType: 'home_category_chip'
                });
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
                selectedCategory.toLowerCase() === cat.id.toLowerCase()
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-300 shadow-xs'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* 4. MAIN PRODUCT GRID: TOP TRENDING DEALS */}
      <section className="max-w-7xl mx-auto px-4 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/25">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Trending Deals & Best Prices
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Comparing live prices across Amazon, Flipkart, Croma & top verified stores
              </p>
            </div>
          </div>
          <Link
            to="/categories"
            className="text-xs font-extrabold text-brand-600 dark:text-brand-400 hover:text-brand-700 flex items-center gap-1"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. MID-PAGE SPONSORED WIDE ADVERTISEMENT BANNER */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-amber-400/30">
          <div className="space-y-2 text-center md:text-left z-10">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-black/20 text-amber-100 uppercase tracking-wider">
                SPONSORED ADVERTISEMENT
              </span>
              <span className="text-[10px] font-bold text-white/80">
                Verified Merchant Campaign
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black">
              Flagship 5G Smartphones & Laptops Upgrade Fest
            </h3>
            <p className="text-xs sm:text-sm text-amber-100 max-w-xl">
              Exchange bonus up to ₹10,000 on Apple iPhone 15, Samsung Galaxy S24 & ASUS Vivobook across Amazon & Flipkart. 0% No-Cost EMI available.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 z-10">
            <Link
              to="/categories?cat=Mobiles"
              className="px-6 py-3.5 rounded-2xl bg-white text-slate-950 hover:bg-amber-50 font-black text-xs sm:text-sm shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>View Flagship Deals</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
            <Link
              to="/compare"
              className="px-5 py-3.5 rounded-2xl bg-black/20 hover:bg-black/30 border border-white/25 text-white font-bold text-xs sm:text-sm backdrop-blur-md transition-all"
            >
              Compare Stores
            </Link>
          </div>
        </div>
      </section>

      {/* 6. LIGHTNING FLASH SALE PRODUCTS WITH COUNTDOWN */}
      <section className="max-w-7xl mx-auto px-4 space-y-5">
        {/* Flash Sale Header Bar */}
        <div className="bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 rounded-3xl p-4 sm:p-6 text-white shadow-lg flex flex-wrap items-center justify-between gap-4 border border-rose-500/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-black text-xl shadow-inner">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-wider uppercase text-rose-200">
                  FLASH SALE • LOWEST EVER PRICES
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black mt-0.5">
                Limited-Time Price Drop Offers
              </h3>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 bg-black/25 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20">
            <Clock className="w-4 h-4 text-amber-300 animate-pulse" />
            <span className="text-xs font-bold text-slate-200">Ends In:</span>
            <div className="flex items-center gap-1 font-mono font-black text-sm text-white">
              <span className="px-1.5 py-0.5 rounded bg-black/40">
                {String(flashTime.hours).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="px-1.5 py-0.5 rounded bg-black/40">
                {String(flashTime.minutes).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="px-1.5 py-0.5 rounded bg-black/40">
                {String(flashTime.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Flash Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
          {flashProducts.map(product => (
            <ProductCard key={`flash-${product.id}`} product={product} />
          ))}
        </div>
      </section>

      {/* SECTION 4.8: BANK OFFERS & VERIFIED COUPONS */}
      <section className="max-w-7xl mx-auto px-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Bank Offers & Active Store Coupons</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Verified bank discounts stackable with marketplace deals</p>
            </div>
          </div>
          <Link to="/coupons" className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1">
            <span>View All Coupons</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/15 text-blue-400">HDFC BANK</span>
              <span className="text-xs font-black text-emerald-500">Flat 10% Instant Discount</span>
            </div>
            <div className="font-extrabold text-sm text-slate-900 dark:text-white">Up to ₹1,500 Off on Credit Cards</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Min. order ₹7,500 on Mobiles, Laptops & Electronics. Valid on Amazon & Flipkart.</div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/15 text-rose-400">ICICI BANK</span>
              <span className="text-xs font-black text-emerald-500">Flat ₹2,000 Off</span>
            </div>
            <div className="font-extrabold text-sm text-slate-900 dark:text-white">Instant Discount on Laptops & Smart TVs</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Valid on Croma & Reliance Digital purchases above ₹25,000.</div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400">SMARTDEAL GUARANTEE</span>
              <span className="text-xs font-black text-emerald-500">Live Across Stores</span>
            </div>
            <div className="font-extrabold text-sm text-slate-900 dark:text-white">Verified Lowest Prices Across Stores</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Real-time multi-store price monitoring ensures you never overpay on any order.</div>
          </div>
        </div>
      </section>

      {/* SECTION 4.10 & 14: SMARTDEAL DEAL INTELLIGENCE FEATURES */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 text-xs font-black">
            <Bot className="w-3.5 h-3.5" />
            <span>AI Product Intelligence Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Smart Deal Intelligence System
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Explainable AI decision algorithms helping you save money with confidence and zero deceptive practices.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Deal DNA & Smart Score (0-100)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Multi-factor algorithmic rating analyzing price advantage across stores, 90-day pricing trends, seller reliability, and verified coupon quality.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Fake Discount Detector</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Identifies artificially inflated MRPs and fake discount banners by cross-referencing actual manufacturer reference prices and historical lows.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Buy Now or Wait Estimator</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Predictive volatility analysis estimating whether the price is currently at its bottom cycle or expected to drop in upcoming festival sales.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Better Alternative Finder</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Discovers products with superior specifications, better reviews, or higher value-for-money in the same price bracket.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Personal Deal Radar</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Define your budget and desired product. Receive instant alerts via email or push notifications when your target price is reached.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Smart Savings Calculator</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Calculates real final effective cost = Listed Price - Bank Discount - Promo Coupons + Delivery Fee.
            </p>
          </div>
        </div>
      </section>

      {/* 7. DUAL SIDE-BY-SIDE PROMOTIONAL ADS */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ad Card 1: Laptop & Gaming */}
          <div className="rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 p-6 sm:p-8 text-white border border-indigo-800/40 shadow-xl relative overflow-hidden flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                  SPONSORED AD
                </span>
                <span className="text-[10px] font-extrabold text-amber-400">
                  Amazon & Croma Deals
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black">
                Laptops & Gaming Gear Up to 40% Off
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Intel Core i5, i7 & AMD Ryzen laptops from ASUS, HP, Dell & Lenovo. Verified prices and instant bank discounts.
              </p>
            </div>
            <Link
              to="/categories?cat=Laptops"
              className="w-fit px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all hover:scale-105"
            >
              <span>Shop Laptop Deals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Ad Card 2: Audio & Smartwatches */}
          <div className="rounded-3xl bg-gradient-to-br from-purple-950 via-slate-900 to-rose-950 p-6 sm:p-8 text-white border border-purple-800/40 shadow-xl relative overflow-hidden flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                  SPONSORED AD
                </span>
                <span className="text-[10px] font-extrabold text-emerald-400">
                  Flipkart & Reliance Digital
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black">
                Audio & Smartwatches Up to 65% Off
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Active Noise Cancellation earbuds, wireless headphones & AMOLED fitness smartwatches from Sony, Boat, Apple & Noise.
              </p>
            </div>
            <Link
              to="/categories?cat=Electronics"
              className="w-fit px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition-all hover:scale-105"
            >
              <span>Explore Audio Offers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. BOTTOM AD BANNER: DIRECT STORE REDIRECT GUARANTEE */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Genuine Partner Store Direct Buy</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              Shop Directly on Amazon, Flipkart & Croma with Official Warranties
            </h3>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              SmartDeal continuously compares real-time selling prices, delivery charges, and bank discounts across verified stores. Pick the best offer and checkout natively on the merchant's official site.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/compare"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-indigo-600/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <Layers className="w-4 h-4" />
              <span>Compare All Stores</span>
            </Link>
            <Link
              to="/categories"
              className="px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 transition-all"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
