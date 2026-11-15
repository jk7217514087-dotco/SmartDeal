import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Tv,
  Footprints,
  Shirt,
  Sparkles,
  Home,
  ShoppingBag,
  Layers,
  Store,
  Clock,
  ChevronRight,
  Maximize2,
  Minimize2,
  Info,
  Check,
  Tag,
  Radio
} from 'lucide-react';

interface CategoryExample {
  id: string;
  name: string;
  category: string;
  icon: any;
  mrp: number;
  bestPrice: number;
  bestStore: string;
  image: string;
  stores: {
    name: string;
    logoLetter: string;
    price: number;
    delivery: string;
    url: string;
    badge: string;
    color: string;
  }[];
}

export const UIUXFlowchartPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Mobiles');
  const [selectedStore, setSelectedStore] = useState<string>('Amazon');
  const [isRedirectModalOpen, setIsRedirectModalOpen] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(3);
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'interactive' | 'diagram'>('interactive');

  const categoryExamples: Record<string, CategoryExample> = {
    Mobiles: {
      id: 'cat-mobiles',
      name: 'Apple iPhone 15 (128GB, Black)',
      category: 'Mobiles & Smartphones',
      icon: Smartphone,
      mrp: 79900,
      bestPrice: 69900,
      bestStore: 'Flipkart',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
      stores: [
        { name: 'Flipkart', logoLetter: 'f', price: 69900, delivery: 'FREE Tomorrow', url: 'https://www.flipkart.com/apple-iphone-15-black-128-gb/p/itm6ac6485515ae4?pid=MOBGTAGPTB3VS24W', badge: 'Best Price', color: 'bg-blue-600' },
        { name: 'Amazon', logoLetter: 'a', price: 70999, delivery: 'FREE 2 Days', url: 'https://www.amazon.in/Apple-iPhone-15-128-GB/dp/B0CHX1W1XY?tag=smartdeal-21', badge: 'Trusted Seller', color: 'bg-amber-500' },
        { name: 'Croma', logoLetter: 'cr', price: 72490, delivery: 'FREE Tomorrow', url: 'https://www.croma.com/apple-iphone-15-128gb-black-/p/300652', badge: 'Store Pickup', color: 'bg-teal-600' },
        { name: 'Reliance Digital', logoLetter: 'rd', price: 73990, delivery: '₹49 Delivery', url: 'https://www.reliancedigital.in/apple-iphone-15-128-gb-black/p/493839352', badge: 'Authorized', color: 'bg-rose-600' }
      ]
    },
    Laptops: {
      id: 'cat-laptops',
      name: 'Apple MacBook Air M2 (13.6-inch, 256GB SSD)',
      category: 'Laptops & Computers',
      icon: Laptop,
      mrp: 99900,
      bestPrice: 84990,
      bestStore: 'Amazon',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
      stores: [
        { name: 'Amazon', logoLetter: 'a', price: 84990, delivery: 'FREE Tomorrow', url: 'https://www.amazon.in/Apple-MacBook-Chip-13-6-inch-256GB/dp/B0B3B7NW3R?tag=smartdeal-21', badge: 'Best Price', color: 'bg-amber-500' },
        { name: 'Flipkart', logoLetter: 'f', price: 85990, delivery: 'FREE 2 Days', url: 'https://www.flipkart.com/apple-macbook-air-m2-8-gb-256-gb-ssd-mac-os-monterey-mly33hn-a/p/itm0a273b5f0ef35?pid=COMGFXDMZ7V94M5H', badge: 'Bank Offer', color: 'bg-blue-600' },
        { name: 'Croma', logoLetter: 'cr', price: 87990, delivery: 'FREE Store Pickup', url: 'https://www.croma.com/apple-macbook-air-2022-m2-chip-13-6-inch-8gb-256gb-ssd-macos-midnight-/p/256606', badge: 'Official Partner', color: 'bg-teal-600' },
        { name: 'Tata CLiQ', logoLetter: 'tc', price: 89900, delivery: 'FREE 3 Days', url: 'https://www.tatacliq.com/apple-macbook-air-mly33hnam2-chip-8gb-256gb-ssd-136-inch-liquid-retina-display-macos-midnight-124-kg/p-mp000000013726593', badge: 'Verified', color: 'bg-purple-600' }
      ]
    },
    Headphones: {
      id: 'cat-headphones',
      name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
      category: 'Audio & Headphones',
      icon: Headphones,
      mrp: 34990,
      bestPrice: 26990,
      bestStore: 'Amazon',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      stores: [
        { name: 'Amazon', logoLetter: 'a', price: 26990, delivery: 'FREE Tomorrow', url: 'https://www.amazon.in/Sony-WH-1000XM5-Wireless-Cancelling-Headphones/dp/B09XS7JWHH?tag=smartdeal-21', badge: 'Best Deal', color: 'bg-amber-500' },
        { name: 'Flipkart', logoLetter: 'f', price: 27990, delivery: 'FREE 2 Days', url: 'https://www.flipkart.com/sony-wh-1000xm5-bluetooth-headset/p/itm5a86481710928?pid=ACCGEYZ4ZGGZNZ4C', badge: 'Trusted', color: 'bg-blue-600' },
        { name: 'Croma', logoLetter: 'cr', price: 28990, delivery: 'FREE Tomorrow', url: 'https://www.croma.com/sony-wh-1000xm5-active-noise-cancellation-wireless-headphone/p/261890', badge: 'Brand Warranty', color: 'bg-teal-600' },
        { name: 'Reliance Digital', logoLetter: 'rd', price: 29990, delivery: 'FREE 2 Days', url: 'https://www.reliancedigital.in/sony-wh-1000xm5-wireless-active-noise-cancelling-headphones-black/p/493177748', badge: 'Authorized', color: 'bg-rose-600' }
      ]
    },
    Smartwatches: {
      id: 'cat-smartwatches',
      name: 'Apple Watch Series 9 GPS (45mm Starlight)',
      category: 'Smartwatches & Wearables',
      icon: Watch,
      mrp: 44900,
      bestPrice: 37999,
      bestStore: 'Flipkart',
      image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80',
      stores: [
        { name: 'Flipkart', logoLetter: 'f', price: 37999, delivery: 'FREE 2 Days', url: 'https://www.flipkart.com/apple-watch-series-9-gps-45mm-starlight-aluminium-case-sport-band/p/itm6d10a624508ec?pid=SMWGTAHPFGFAGNZK', badge: 'Best Price', color: 'bg-blue-600' },
        { name: 'Amazon', logoLetter: 'a', price: 38990, delivery: 'FREE Tomorrow', url: 'https://www.amazon.in/Apple-Watch-Series-GPS-45mm/dp/B0CHX6P8C7?tag=smartdeal-21', badge: 'Fast Delivery', color: 'bg-amber-500' },
        { name: 'Tata CLiQ', logoLetter: 'tc', price: 40990, delivery: 'FREE 3 Days', url: 'https://www.tatacliq.com/apple-watch-series-9-gps-45mm-starlight-aluminium-case-with-starlight-sport-band-m-l-mr9a3hn-a/p-mp000000019629144', badge: 'Verified', color: 'bg-purple-600' },
        { name: 'Croma', logoLetter: 'cr', price: 41900, delivery: 'FREE Store Pickup', url: 'https://www.croma.com/apple-watch-series-9-gps-45mm-starlight-aluminium-case-with-sport-band-starlight-s-m-/p/301290', badge: 'Store Pickup', color: 'bg-teal-600' }
      ]
    },
    Shoes: {
      id: 'cat-shoes',
      name: 'Nike Men\'s Revolution 6 Running Shoes',
      category: 'Footwear & Shoes',
      icon: Footprints,
      mrp: 5999,
      bestPrice: 2899,
      bestStore: 'Meesho',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
      stores: [
        { name: 'Meesho', logoLetter: 'm', price: 2899, delivery: 'FREE 3 Days', url: 'https://www.meesho.com/nike-revolution-6-running-shoes/p/47192801?ref=smartdeal', badge: 'Lowest Price', color: 'bg-pink-600' },
        { name: 'Amazon', logoLetter: 'a', price: 2999, delivery: 'FREE Tomorrow', url: 'https://www.amazon.in/Nike-Revolution-Running-Shoes-Black/dp/B09V7N8K44?tag=smartdeal-21', badge: 'Prime Verified', color: 'bg-amber-500' },
        { name: 'Flipkart', logoLetter: 'f', price: 3099, delivery: 'FREE 2 Days', url: 'https://www.flipkart.com/nike-revolution-6-running-shoes-men/p/itm217684021?pid=SHOGFE87654', badge: 'Trusted Seller', color: 'bg-blue-600' },
        { name: 'Myntra', logoLetter: 'my', price: 3249, delivery: 'FREE Tomorrow', url: 'https://www.myntra.com/sports-shoes/nike/nike-men-revolution-6-running-shoes/15894102/buy', badge: 'Authentic', color: 'bg-orange-600' }
      ]
    },
    Fashion: {
      id: 'cat-fashion',
      name: 'Levi\'s Men\'s Slim Fit Denim Jacket (Dark Indigo)',
      category: 'Clothing & Fashion',
      icon: Shirt,
      mrp: 4999,
      bestPrice: 2499,
      bestStore: 'Myntra',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80',
      stores: [
        { name: 'Myntra', logoLetter: 'my', price: 2499, delivery: 'FREE Tomorrow', url: 'https://www.myntra.com/jackets/levis/levis-men-blue-solid-denim-jacket/11492084/buy', badge: 'Best Deal', color: 'bg-orange-600' },
        { name: 'Ajio', logoLetter: 'aj', price: 2599, delivery: 'FREE 2 Days', url: 'https://www.ajio.com/levis-slim-fit-denim-jacket-with-flap-pockets/p/441112891_blue', badge: 'Coupon Valid', color: 'bg-teal-700' },
        { name: 'Amazon', logoLetter: 'a', price: 2799, delivery: 'FREE 2 Days', url: 'https://www.amazon.in/Levis-Mens-Slim-Denim-Jacket/dp/B08FGF8721?tag=smartdeal-21', badge: 'Prime', color: 'bg-amber-500' },
        { name: 'Flipkart', logoLetter: 'f', price: 2899, delivery: 'FREE 3 Days', url: 'https://www.flipkart.com/levi-s-full-sleeve-solid-men-jacket/p/itmd5b28a7e04f05?pid=JCKF98721', badge: 'Genuine', color: 'bg-blue-600' }
      ]
    },
    TVs: {
      id: 'cat-tvs',
      name: 'LG 55-inch 4K Smart OLED evo TV (OLED55C3PSA)',
      category: 'TVs & Entertainment',
      icon: Tv,
      mrp: 149990,
      bestPrice: 114990,
      bestStore: 'Croma',
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&auto=format&fit=crop&q=80',
      stores: [
        { name: 'Croma', logoLetter: 'cr', price: 114990, delivery: 'FREE Next Day + Installation', url: 'https://www.croma.com/lg-c3-139-7-cm-55-inch-4k-ultra-hd-oled-webos-tv-with-dolby-atmos-oled55c3psa-2023-model-/p/272782', badge: 'Lowest Price', color: 'bg-teal-600' },
        { name: 'Amazon', logoLetter: 'a', price: 116990, delivery: 'FREE 2 Days', url: 'https://www.amazon.in/LG-139-OLED55C3PSA-Cinema-Dolby/dp/B0C39Y45Q8?tag=smartdeal-21', badge: 'Bank ₹3000 Off', color: 'bg-amber-500' },
        { name: 'Reliance Digital', logoLetter: 'rd', price: 117990, delivery: 'FREE 2 Days', url: 'https://www.reliancedigital.in/lg-139-7-cm-55-inch-ultra-hd-4k-oled-smart-tv-oled55c3psa/p/493839219', badge: 'Official Warranty', color: 'bg-rose-600' },
        { name: 'Flipkart', logoLetter: 'f', price: 119990, delivery: 'FREE 3 Days', url: 'https://www.flipkart.com/lg-c3-139-cm-55-inch-oled-ultra-hd-4k-smart-webos-tv/p/itm3d7f02095f9a6?pid=TVSGQ7NXZZ8GFE4K', badge: 'SuperCoins', color: 'bg-blue-600' }
      ]
    }
  };

  const current = categoryExamples[activeCategory] || categoryExamples['Mobiles'];
  const currentSelectedOffer = current.stores.find(s => s.name === selectedStore) || current.stores[0];

  const handleTriggerRedirect = (storeName: string) => {
    setSelectedStore(storeName);
    setIsRedirectModalOpen(true);
    setCountdown(3);
    setIsRedirecting(false);
  };

  useEffect(() => {
    let timer: any;
    if (isRedirectModalOpen && countdown > 0) {
      timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
    } else if (isRedirectModalOpen && countdown === 0) {
      setIsRedirecting(true);
    }
    return () => clearTimeout(timer);
  }, [isRedirectModalOpen, countdown]);

  const executeRedirect = () => {
    window.open(currentSelectedOffer.url, '_blank');
    setIsRedirectModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#070b15] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border border-blue-500/30 text-xs font-black tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Master UI/UX Flowchart & Architectural Pipeline</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            SmartDeal End-to-End User Flow
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl mx-auto">
            Supporting <strong className="text-white">ANY PRODUCT across ALL Categories</strong> (Mobiles, Laptops, TVs, Headphones, Shoes, Fashion, Beauty, Home & more). Discover real prices, compare marketplaces, and execute direct zero-friction purchase redirects.
          </p>

          {/* Core Philosophy Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 via-indigo-950/70 to-purple-950/60 border border-indigo-500/30 text-xs font-mono text-indigo-200 flex items-center justify-center gap-2 max-w-2xl mx-auto shadow-lg">
            <span className="font-bold text-white">CORE PRINCIPLE:</span>
            <span>SmartDeal = Search + Discovery + Comparison</span>
            <span className="text-slate-500">•</span>
            <span className="font-bold text-amber-300">Marketplace = Actual Purchase</span>
          </div>

          {/* View Toggle */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setViewMode('interactive')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                viewMode === 'interactive'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              Interactive Step-by-Step UI Flow
            </button>
            <button
              onClick={() => setViewMode('diagram')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                viewMode === 'diagram'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              Figma Diagram View
            </button>
          </div>
        </div>

        {/* Category Switcher Tabs */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Select Product Category to Preview Dynamic Flow:</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {Object.keys(categoryExamples).map(catKey => {
              const cat = categoryExamples[catKey];
              const Icon = cat.icon;
              const isActive = activeCategory === catKey;
              return (
                <button
                  key={catKey}
                  onClick={() => {
                    setActiveCategory(catKey);
                    setSelectedStore(cat.stores[0].name);
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-400/40'
                      : 'bg-[#0f172a] text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{catKey}</span>
                </button>
              );
            })}
          </div>
        </div>

        {viewMode === 'diagram' ? (
          /* Diagram View: High-res visual diagram artifact */
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-800 bg-[#0c1322] p-4 sm:p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-lg font-black text-white">Full Architectural Infographic Canvas</h3>
                  <p className="text-xs text-slate-400">Presentation-ready UI/UX flow from Discovery to Final Merchant Purchase</p>
                </div>
                <a
                  href="/smartdeal_uiux_flowchart.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center gap-1.5 border border-slate-700 transition-all"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Open Full Resolution (4:3)</span>
                </a>
              </div>

              <div className="rounded-2xl overflow-hidden border border-slate-800/80 bg-black/40 shadow-inner">
                <img
                  src="/smartdeal_uiux_flowchart.jpg"
                  alt="SmartDeal UI/UX Flowchart"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        ) : (
          /* Interactive Step-by-Step UI Flow */
          <div className="space-y-12">

            {/* SECTION 1: SMARTDEAL PLATFORM */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-blue-500/30 pb-3">
                <div className="px-3 py-1 rounded-xl bg-blue-600 text-white font-black text-xs uppercase tracking-wider">
                  ZONE 1
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">SMARTDEAL PLATFORM</h2>
                  <p className="text-xs text-slate-400">Steps 1 to 6 • Search, Discovery, Spec Evaluation & Cross-Store Price Comparison</p>
                </div>
              </div>

              {/* Grid of Screens 1 to 6 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* SCREEN 1: Home Page */}
                <div className="bg-[#0c1322] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl relative group hover:border-slate-700 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-lg shadow-blue-500/30">
                      1
                    </span>
                    <span className="text-xs font-bold text-slate-400">Home Page</span>
                  </div>

                  <div className="rounded-2xl bg-[#080d18] border border-slate-800 p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs font-black text-white pb-2 border-b border-slate-800">
                      <span className="flex items-center gap-1.5">
                        <ShoppingBag className="w-4 h-4 text-brand-400" />
                        <span>SmartDeal</span>
                      </span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Active</span>
                    </div>

                    <div className="p-3 rounded-xl bg-gradient-to-r from-blue-950/60 to-purple-950/60 border border-indigo-500/20 text-center space-y-1">
                      <div className="text-xs font-black text-white">Best Deals Across All Stores</div>
                      <div className="text-[10px] text-slate-300">Compare Prices • Save Money • Shop Smart</div>
                    </div>

                    {/* Universal Search Bar */}
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#121c30] border border-slate-700 text-xs text-slate-300">
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-400 text-[11px] truncate">Search any product, brand or category...</span>
                    </div>

                    {/* Category Icons */}
                    <div className="grid grid-cols-4 gap-1.5 text-[9px] text-center pt-1">
                      <div className="p-1.5 rounded-lg bg-slate-800/80 text-slate-300">📱 Mobiles</div>
                      <div className="p-1.5 rounded-lg bg-slate-800/80 text-slate-300">💻 Laptops</div>
                      <div className="p-1.5 rounded-lg bg-slate-800/80 text-slate-300">⚡ Tech</div>
                      <div className="p-1.5 rounded-lg bg-slate-800/80 text-slate-300">👟 Shoes</div>
                    </div>

                    {/* Marketplace Logos */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px] text-slate-400">
                      <span>Amazon</span>
                      <span>Flipkart</span>
                      <span>Meesho</span>
                      <span>Myntra</span>
                      <span>Croma</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    Universal entry point. Users can search for <strong>ANY product</strong> across all e-commerce verticals with instant auto-suggestions.
                  </p>
                </div>

                {/* SCREEN 2: Search Results Page */}
                <div className="bg-[#0c1322] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl relative group hover:border-slate-700 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-lg shadow-blue-500/30">
                      2
                    </span>
                    <span className="text-xs font-bold text-slate-400">Search Results Page</span>
                  </div>

                  <div className="rounded-2xl bg-[#080d18] border border-slate-800 p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Results for "{activeCategory}"</span>
                      <span className="text-indigo-400 font-bold">Filters ▾</span>
                    </div>

                    {/* Product Card Example */}
                    <div className="p-3 rounded-xl bg-[#121c30] border border-slate-700/80 space-y-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={current.image}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover bg-black/40 p-0.5 shrink-0"
                        />
                        <div className="overflow-hidden">
                          <div className="font-bold text-white text-xs truncate">{current.name}</div>
                          <div className="text-[10px] text-amber-400 font-semibold">★ 4.4 (12,456)</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-black text-white text-xs">₹{current.bestPrice.toLocaleString('en-IN')}</span>
                            <span className="line-through text-slate-500 text-[10px]">₹{current.mrp.toLocaleString('en-IN')}</span>
                            <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1 rounded font-bold">
                              Lowest on {current.bestStore}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 border-t border-slate-800">
                        <span>4 Available Stores</span>
                        <span className="text-blue-400 font-bold flex items-center gap-0.5">
                          View Details <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-800/40 text-[10px] text-slate-400 text-center">
                      Showing results aggregated from Amazon, Flipkart, Croma & more
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    Lists matching products across all categories with real-time price ranges and availability across retailers.
                  </p>
                </div>

                {/* SCREEN 3: Product Details Page */}
                <div className="bg-[#0c1322] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl relative group hover:border-slate-700 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-lg shadow-blue-500/30">
                      3
                    </span>
                    <span className="text-xs font-bold text-slate-400">Product Details Page</span>
                  </div>

                  <div className="rounded-2xl bg-[#080d18] border border-slate-800 p-4 space-y-3">
                    <div className="w-full h-24 bg-black/40 rounded-xl overflow-hidden flex items-center justify-center p-2">
                      <img src={current.image} alt="" className="h-full object-contain" />
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs font-bold text-white line-clamp-1">{current.name}</div>
                      <div className="text-[10px] text-slate-400">{current.category}</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-black text-emerald-400">₹{current.bestPrice.toLocaleString('en-IN')}</span>
                        <span className="text-[10px] text-slate-400">Best Price Found</span>
                      </div>
                    </div>

                    {/* Compare Prices Button */}
                    <Link
                      to="/compare"
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/25 transition-all"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Compare Prices Across Stores</span>
                    </Link>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    Detailed specs, Deal Score analytics, 90-day price history, and the primary gateway to the Comparison Matrix.
                  </p>
                </div>

                {/* SCREEN 4: Compare Prices Page */}
                <div className="bg-[#0c1322] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl relative group hover:border-slate-700 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-lg shadow-blue-500/30">
                      4
                    </span>
                    <span className="text-xs font-bold text-slate-400">Compare Prices Page</span>
                  </div>

                  <div className="rounded-2xl bg-[#080d18] border border-slate-800 p-3 space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Store</span>
                      <span>Payable Price</span>
                      <span>Action</span>
                    </div>

                    {current.stores.map((s, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded-xl flex items-center justify-between text-xs transition-all ${
                          s.name === selectedStore
                            ? 'bg-blue-600/20 border border-blue-500/40'
                            : 'bg-[#121c30] border border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-md ${s.color} text-white font-black text-[10px] flex items-center justify-center uppercase shrink-0`}>
                            {s.logoLetter}
                          </div>
                          <div>
                            <div className="font-bold text-white text-[11px]">{s.name}</div>
                            <div className="text-[9px] text-slate-400">{s.delivery}</div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-black text-white text-xs">₹{s.price.toLocaleString('en-IN')}</div>
                          <span className="text-[8px] bg-emerald-500/15 text-emerald-400 px-1 py-0.2 rounded font-bold">
                            {s.badge}
                          </span>
                        </div>

                        <button
                          onClick={() => handleTriggerRedirect(s.name)}
                          className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        >
                          Buy
                        </button>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    Live price comparison matrix without internal SmartDeals sellers. Highlights the cheapest store and delivery timelines.
                  </p>
                </div>

                {/* SCREEN 5: Select Marketplace */}
                <div className="bg-[#0c1322] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl relative group hover:border-slate-700 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-lg shadow-blue-500/30">
                      5
                    </span>
                    <span className="text-xs font-bold text-slate-400">Select Marketplace</span>
                  </div>

                  <div className="rounded-2xl bg-[#080d18] border border-slate-800 p-4 space-y-3">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-950/70 to-slate-900 border border-blue-500/40 space-y-2">
                      <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                        Selected Store
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-xl ${currentSelectedOffer.color} text-white font-black text-sm flex items-center justify-center uppercase shadow-md`}>
                            {currentSelectedOffer.logoLetter}
                          </div>
                          <div>
                            <div className="font-extrabold text-white text-sm">{currentSelectedOffer.name}</div>
                            <div className="text-[10px] text-slate-400">{currentSelectedOffer.delivery}</div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-base font-black text-white">₹{currentSelectedOffer.price.toLocaleString('en-IN')}</div>
                          <span className="text-[9px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.2 rounded-full">
                            Verified
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-800/40 text-xs space-y-1.5">
                      <div className="font-bold text-white text-[11px] truncate">{current.name}</div>
                      <div className="text-[10px] text-slate-400 flex items-center justify-between">
                        <span>Original MRP: ₹{current.mrp.toLocaleString('en-IN')}</span>
                        <span className="text-emerald-400 font-bold">
                          Save ₹{(current.mrp - currentSelectedOffer.price).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleTriggerRedirect(currentSelectedOffer.name)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 cursor-pointer"
                    >
                      <span>Buy Product</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    User confirms their chosen merchant and price. Prepares direct transfer payload with verified product reference.
                  </p>
                </div>

                {/* SCREEN 6: Proceed & Redirect Modal */}
                <div className="bg-[#0c1322] border border-indigo-500/40 rounded-3xl p-5 space-y-4 shadow-2xl relative group ring-2 ring-indigo-500/20">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-lg shadow-indigo-500/30">
                      6
                    </span>
                    <span className="text-xs font-bold text-indigo-300">Redirect Page (SmartDeal)</span>
                  </div>

                  <div className="rounded-2xl bg-[#080d18] border border-indigo-500/30 p-4 text-center space-y-3">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                      <Radio className="w-3 h-3 text-indigo-400 animate-pulse" />
                      <span>Direct Redirect Engine</span>
                    </div>

                    <div className="flex items-center justify-center gap-3 py-1">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                        SD
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                      <div className={`w-10 h-10 rounded-2xl ${currentSelectedOffer.color} text-white flex items-center justify-center font-black text-sm uppercase shadow-md`}>
                        {currentSelectedOffer.logoLetter}
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <div className="font-black text-white text-xs">
                        You selected {currentSelectedOffer.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Redirecting directly in 3 seconds...
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-300 font-medium leading-tight">
                      “You will be redirected directly to {currentSelectedOffer.name}’s exact product page.”
                    </div>

                    <button
                      onClick={() => handleTriggerRedirect(currentSelectedOffer.name)}
                      className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Proceed to {currentSelectedOffer.name} →</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    Transparent transition page. <strong>SmartDeal has NO internal cart and NO internal checkout</strong> for comparison purchases.
                  </p>
                </div>

              </div>
            </div>

            {/* TRANSITION DIVIDER */}
            <div className="relative flex items-center justify-center py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-dashed border-slate-700" />
              </div>
              <div className="relative px-6 py-2 rounded-full bg-[#0c1322] border-2 border-indigo-500 text-indigo-300 text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-2xl">
                <span>Direct Seamless Transfer</span>
                <ArrowRight className="w-4 h-4 text-amber-400 animate-bounce" />
                <span className="text-white">To Official Retailer</span>
              </div>
            </div>

            {/* SECTION 2: EXTERNAL MARKETPLACE WEBSITES */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-amber-500/30 pb-3">
                <div className="px-3 py-1 rounded-xl bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider">
                  ZONE 2
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">EXTERNAL MARKETPLACE WEBSITES</h2>
                  <p className="text-xs text-slate-400">Steps 7 & 8 • Exact Same Product Page on Official Retailer Website & User Purchase Completion</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* SCREEN 7: Direct Redirect Action */}
                <div className="bg-[#0c1322] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-lg shadow-amber-500/30">
                      7
                    </span>
                    <span className="text-xs font-bold text-amber-400">Direct Redirect Pipeline</span>
                  </div>

                  <div className="rounded-2xl bg-[#080d18] border border-slate-800 p-4 space-y-3 text-xs">
                    <div className="flex items-center gap-2 font-mono text-[11px] text-slate-300 p-2.5 rounded-xl bg-slate-900 border border-slate-800 break-all">
                      <span className="text-emerald-400 font-bold">GET</span>
                      <span className="truncate">{currentSelectedOffer.url}</span>
                    </div>

                    <div className="space-y-2 text-slate-300">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Exact product mapping guarantees zero manual search required</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Deep link opens native retailer mobile app (if installed) or web browser</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Valid affiliate token captures cashback & rewards for the user</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={executeRedirect}
                        className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Launch Exact Page on {currentSelectedOffer.name}</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    SmartDeal routes the user seamlessly with deep links directly to the merchant's exact product page.
                  </p>
                </div>

                {/* SCREEN 8: External Marketplace Exact Product Page */}
                <div className="bg-[#0c1322] border border-amber-500/30 rounded-3xl p-5 space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-lg shadow-amber-500/30">
                      8
                    </span>
                    <span className="text-xs font-bold text-amber-400">External Marketplace — Exact Product Page</span>
                  </div>

                  <div className="rounded-2xl bg-white text-slate-900 p-4 space-y-3 text-xs shadow-inner">
                    {/* Simulated Retailer Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-base tracking-tight">
                          {currentSelectedOffer.name.toLowerCase()}.in
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-2">
                        <span>Returns</span>
                        <span>Orders</span>
                        <span>Cart 🛒</span>
                      </div>
                    </div>

                    {/* Simulated Product Details */}
                    <div className="flex items-center gap-3">
                      <img
                        src={current.image}
                        alt=""
                        className="w-16 h-16 object-contain rounded-xl bg-slate-50 p-1 border border-slate-200"
                      />
                      <div className="space-y-0.5">
                        <div className="font-black text-slate-900 text-xs line-clamp-2">{current.name}</div>
                        <div className="text-amber-500 font-bold text-[11px]">★ 4.4 out of 5 stars</div>
                        <div className="text-base font-black text-slate-900">
                          ₹{currentSelectedOffer.price.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    {/* Add to Cart & Buy Now Buttons on External Site */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-200">
                      <button
                        onClick={executeRedirect}
                        className="w-full py-2 rounded-xl bg-[#ffd814] hover:bg-[#f7ca00] text-slate-900 font-bold text-xs shadow-sm cursor-pointer"
                      >
                        Add to Cart (on {currentSelectedOffer.name})
                      </button>
                      <button
                        onClick={executeRedirect}
                        className="w-full py-2 rounded-xl bg-[#ffa41c] hover:bg-[#fa8900] text-slate-900 font-bold text-xs shadow-sm cursor-pointer"
                      >
                        Buy Now (on {currentSelectedOffer.name})
                      </button>
                    </div>

                    <div className="text-[10px] text-emerald-700 font-bold text-center flex items-center justify-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>User completes purchase directly on {currentSelectedOffer.name}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    User safely finalizes order using their existing saved payment methods, prime memberships, and merchant guarantees.
                  </p>
                </div>

              </div>
            </div>

            {/* Architecture Data Mapping Matrix */}
            <div className="rounded-3xl border border-slate-800 bg-[#0c1322] p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-lg font-black text-white">Dynamic Product Offer Data Architecture</h3>
                  <p className="text-xs text-slate-400">Every product record maintains verified marketplace offer URLs</p>
                </div>
                <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/30">
                  schema.sql • marketplace_offers table
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-bold uppercase tracking-wider bg-[#080d18]">
                      <th className="py-3 px-4">Marketplace</th>
                      <th className="py-3 px-4">Live Price</th>
                      <th className="py-3 px-4">Delivery SLA</th>
                      <th className="py-3 px-4">Stored Exact Product URL</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    {current.stores.map((s, idx) => (
                      <tr key={idx} className="hover:bg-[#121c30]/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-white font-sans flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-md ${s.color} text-white font-black text-[9px] flex items-center justify-center uppercase`}>
                            {s.logoLetter}
                          </span>
                          <span>{s.name}</span>
                        </td>
                        <td className="py-3 px-4 text-emerald-400 font-bold">
                          ₹{s.price.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 text-slate-300 font-sans">
                          {s.delivery}
                        </td>
                        <td className="py-3 px-4 text-blue-400 truncate max-w-xs">
                          {s.url}
                        </td>
                        <td className="py-3 px-4 text-center font-sans">
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all"
                          >
                            <span>Test Link</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* Redirect Modal Simulation */}
        {isRedirectModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0c1322] border border-indigo-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center font-black text-xs">
                    SD
                  </div>
                  <div>
                    <div className="font-extrabold text-white text-xs">SmartDeal Direct Redirect</div>
                    <div className="text-[10px] text-slate-400">Zero-cart, direct merchant dispatch</div>
                  </div>
                </div>
                <button
                  onClick={() => setIsRedirectModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Transition Graphic */}
              <div className="flex items-center justify-center gap-4 py-2">
                <div className="w-14 h-14 rounded-2xl bg-[#141e33] border border-slate-700 flex items-center justify-center font-bold text-white shadow-lg">
                  SmartDeal
                </div>
                <ArrowRight className="w-5 h-5 text-indigo-400 animate-pulse" />
                <div className={`w-14 h-14 rounded-2xl ${currentSelectedOffer.color} text-white flex items-center justify-center font-black text-xl uppercase shadow-lg`}>
                  {currentSelectedOffer.name}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-3.5 rounded-2xl bg-[#141e33] border border-slate-700/80 flex items-center gap-3">
                <img src={current.image} alt="" className="w-12 h-12 rounded-xl object-contain bg-black/40 p-1 shrink-0" />
                <div className="overflow-hidden">
                  <div className="font-bold text-white text-xs truncate">{current.name}</div>
                  <div className="text-base font-black text-emerald-400">₹{currentSelectedOffer.price.toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-slate-400">On {currentSelectedOffer.name} ({currentSelectedOffer.delivery})</div>
                </div>
              </div>

              {/* Important Redirection Notice */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 leading-relaxed space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>External Merchant Redirect</span>
                </div>
                <div className="text-[11px] text-amber-200/90">
                  “You will be redirected directly to {currentSelectedOffer.name}’s exact product page. Complete your order directly on {currentSelectedOffer.name}.”
                </div>
              </div>

              {/* Countdown & Action */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={executeRedirect}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/30 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>
                    {isRedirecting
                      ? `Opening ${currentSelectedOffer.name} now...`
                      : `Proceed to ${currentSelectedOffer.name} (${countdown}s) →`}
                  </span>
                </button>

                <div className="text-center">
                  <button
                    onClick={() => setIsRedirectModalOpen(false)}
                    className="text-[11px] text-slate-400 hover:text-white transition-colors"
                  >
                    Cancel and return to SmartDeal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
