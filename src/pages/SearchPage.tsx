import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/common/ProductCard';
import { MarketplaceBadge } from '../components/common/MarketplaceBadge';
import {
  Search,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  ArrowRight,
  Flame,
  Sparkles,
  ShieldCheck,
  Tag,
  Star,
  Check,
  Heart,
  LayoutGrid,
  List,
  Store,
  ChevronRight,
  TrendingDown,
  Truck
} from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, trackActivity, wishlist, toggleWishlist } = useApp();
  const navigate = useNavigate();

  const queryFromUrl = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(queryFromUrl);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [selectedMarketplace, setSelectedMarketplace] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 150000]);
  const [sortBy, setSortBy] = useState<'relevance' | 'price-low' | 'price-high' | 'discount' | 'score' | 'rating'>('relevance');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    if (queryFromUrl !== searchTerm) {
      setSearchTerm(queryFromUrl);
    }
  }, [queryFromUrl]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(searchTerm ? { q: searchTerm } : {});
    if (searchTerm) {
      trackActivity('SEARCH_PRODUCT', { query: searchTerm, resultsCount: filteredProducts.length });
    }
  };

  // Categories with counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Brands with counts
  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach(p => {
      counts[p.brand] = (counts[p.brand] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Marketplaces list
  const marketplaces = [
    { name: 'Amazon', count: 18 },
    { name: 'Flipkart', count: 16 },
    { name: 'Meesho', count: 8 },
    { name: 'Myntra', count: 8 },
    { name: 'Croma', count: 6 },
    { name: 'Tata CLiQ', count: 5 },
    { name: 'Reliance Digital', count: 4 }
  ];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Query filter
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchBrand = p.brand.toLowerCase().includes(q);
        const matchCat = p.category.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        if (!matchName && !matchBrand && !matchCat && !matchDesc) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // Brand filter
      if (selectedBrand !== 'all' && p.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }

      // Rating filter
      if (minRating > 0 && p.rating < minRating) {
        return false;
      }

      // Discount filter
      if (minDiscount > 0 && p.discountPercent < minDiscount) {
        return false;
      }

      // Price range
      if (p.sellingPrice < priceRange[0] || p.sellingPrice > priceRange[1]) {
        return false;
      }

      // Marketplace filter
      if (selectedMarketplace !== 'all') {
        const hasStore = p.marketplacePrices.some(mp =>
          mp.sellerName.toLowerCase().includes(selectedMarketplace.toLowerCase())
        );
        if (!hasStore) return false;
      }

      return true;
    });
  }, [products, searchTerm, selectedCategory, selectedBrand, minRating, minDiscount, priceRange, selectedMarketplace]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'price-low':
        return list.sort((a, b) => a.sellingPrice - b.sellingPrice);
      case 'price-high':
        return list.sort((a, b) => b.sellingPrice - a.sellingPrice);
      case 'discount':
        return list.sort((a, b) => b.discountPercent - a.discountPercent);
      case 'score':
        return list.sort((a, b) => b.dealScore - a.dealScore);
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      default:
        return list;
    }
  }, [filteredProducts, sortBy]);

  const popularSearches = ['iPhone 15', 'HP Pavilion 15', 'boAt Airdopes', 'Samsung Galaxy Watch6', 'Nike Running Shoes'];

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setMinRating(0);
    setMinDiscount(0);
    setSelectedMarketplace('all');
    setPriceRange([0, 150000]);
    setSearchTerm('');
    setSearchParams({});
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedBrand !== 'all' ||
    minRating > 0 ||
    minDiscount > 0 ||
    selectedMarketplace !== 'all' ||
    priceRange[0] > 0 ||
    priceRange[1] < 150000 ||
    searchTerm !== '';

  const activeFilterCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedBrand !== 'all' ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (minDiscount > 0 ? 1 : 0) +
    (selectedMarketplace !== 'all' ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 150000 ? 1 : 0);

  // Render Filter Form Content
  const renderFilterContent = () => (
    <div className="space-y-6">
      {/* 1. Category Filter */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Category</h3>
        <div className="space-y-1.5 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${selectedCategory === 'all'
                ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
          >
            <span>All Categories</span>
            <span className="text-[11px] text-slate-400">({products.length})</span>
          </button>
          {Object.entries(categoryCounts).map(([cat, count]) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
            >
              <span className="truncate">{cat}</span>
              <span className="text-[11px] text-slate-400">({count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Brand Filter */}
      <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Brand</h3>
        <div className="space-y-1.5 text-xs">
          <button
            onClick={() => setSelectedBrand('all')}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${selectedBrand === 'all'
                ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
          >
            <span>All Brands</span>
            <span className="text-[11px] text-slate-400">({products.length})</span>
          </button>
          {Object.entries(brandCounts).map(([brand, count]) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${selectedBrand.toLowerCase() === brand.toLowerCase()
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
            >
              <span className="truncate">{brand}</span>
              <span className="text-[11px] text-slate-400">({count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Price Range Slider */}
      <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs">
          <h3 className="font-bold uppercase tracking-wider text-slate-400">Price Range</h3>
          <span className="font-extrabold text-slate-900 dark:text-white">
            ₹{priceRange[0].toLocaleString('en-IN')} - ₹{priceRange[1].toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="150000"
          step="5000"
          value={priceRange[1]}
          onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
          className="w-full accent-brand-600 cursor-pointer"
        />
        <div className="flex items-center gap-2 text-[11px]">
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 flex-1 text-center font-bold text-slate-700 dark:text-slate-300">
            Min: ₹{priceRange[0]}
          </div>
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 flex-1 text-center font-bold text-slate-700 dark:text-slate-300">
            Max: ₹{priceRange[1]}
          </div>
        </div>
      </div>

      {/* 4. Rating Filter */}
      <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Customer Rating</h3>
        <div className="space-y-1.5 text-xs font-medium">
          {[4, 3].map(rating => (
            <button
              key={rating}
              onClick={() => setMinRating(minRating === rating ? 0 : rating)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${minRating === rating
                  ? 'bg-amber-500/10 text-amber-500 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
            >
              <span className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{rating}★ & above</span>
              </span>
              <span className="text-[11px] text-slate-400">
                ({products.filter(p => p.rating >= rating).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 5. Discount Filter */}
      <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Discount</h3>
        <div className="space-y-1.5 text-xs font-medium">
          {[10, 20, 30].map(discount => (
            <button
              key={discount}
              onClick={() => setMinDiscount(minDiscount === discount ? 0 : discount)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${minDiscount === discount
                  ? 'bg-rose-500/10 text-rose-500 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
            >
              <span>{discount}% & above</span>
              <span className="text-[11px] text-slate-400">
                ({products.filter(p => p.discountPercent >= discount).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 6. Marketplace Filter */}
      <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Marketplace</h3>
        <div className="space-y-1.5 text-xs font-medium">
          <button
            onClick={() => setSelectedMarketplace('all')}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${selectedMarketplace === 'all'
                ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
          >
            <span>All Marketplaces</span>
          </button>
          {marketplaces.map(m => (
            <button
              key={m.name}
              onClick={() => setSelectedMarketplace(selectedMarketplace === m.name ? 'all' : m.name)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${selectedMarketplace.toLowerCase() === m.name.toLowerCase()
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
            >
              <span className="flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-slate-400" />
                <span>{m.name}</span>
              </span>
              <span className="text-[11px] text-slate-400">({m.count})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const getProductSpec = (p: typeof products[0]) => {
    if (p.features && p.features.length > 0) {
      const displayFeature = p.features.find(f => /display|screen|inch|\"/i.test(f));
      if (displayFeature) {
        const match = displayFeature.match(/(\d+(\.\d+)?["'”]\s*(Display|Screen|OLED|AMOLED|Liquid Retina|Super Retina)?)/i);
        if (match) return `${match[1].trim()} Display`;
        return displayFeature.split(',')[0].trim();
      }
      return p.features[0].split(',')[0].trim();
    }
    return `${p.brand} • ★ ${p.rating}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8 space-y-4 sm:space-y-6">
      {/* Desktop Breadcrumb */}
      <nav className="hidden lg:flex text-xs text-slate-400 dark:text-slate-400 items-center gap-1.5 font-medium">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span>&gt;</span>
        <span className="text-white font-bold">Search</span>
        {searchTerm && (
          <>
            <span>&gt;</span>
            <span className="text-brand-400 font-bold truncate max-w-xs">{searchTerm}</span>
          </>
        )}
      </nav>

      {/* MOBILE SEARCH BAR & SUBHEADER (< lg) - Screen 3 Reference Mockup */}
      <div className="block lg:hidden space-y-3">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-20 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
          />
          <div className="absolute right-2 flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                setSortBy(prev => prev === 'price-low' ? 'price-high' : prev === 'price-high' ? 'discount' : 'price-low');
              }}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title="Sort"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsMobileFiltersOpen(true)}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors relative cursor-pointer"
              title="Filters"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-blue-600 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </form>

        {/* Mobile Subheader Row: Title/Subtitle on Left, Reviews Pill & View Mode on Right */}
        <div className="flex items-center justify-between gap-2 pt-0.5 px-0.5">
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
              {searchTerm || (selectedCategory !== 'all' ? selectedCategory.toUpperCase() : 'iPhone 15')}
            </h1>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium truncate">
              Search & results for {searchTerm || (selectedCategory !== 'all' ? selectedCategory : 'iPhone')}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="appearance-none pl-2.5 pr-6 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold border border-slate-200/60 dark:border-slate-700 cursor-pointer focus:outline-none"
              >
                <option value="relevance">All Reviews</option>
                <option value="rating">Top Rated</option>
                <option value="price-low">Price: Low</option>
                <option value="price-high">Price: High</option>
                <option value="discount">Discount</option>
                <option value="score">Deal Score</option>
              </select>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[9px] text-slate-400">▾</span>
            </div>

            <button
              onClick={() => setViewMode(prev => prev === 'list' ? 'grid' : 'list')}
              className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Toggle View Mode"
            >
              {viewMode === 'list' ? <LayoutGrid className="w-3.5 h-3.5" /> : <List className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* DESKTOP SEARCH HEADER BAR (lg:block) */}
      <div className="hidden lg:block space-y-4">
        <form onSubmit={handleSearchSubmit} className="relative max-w-3xl">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product name, brand, category (e.g. iPhone 15, HP Pavilion, boAt)..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-md"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition-all cursor-pointer shadow-md"
          >
            Search
          </button>
        </form>

        {/* Popular Search Suggestions */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-400">Popular:</span>
          {popularSearches.map(term => (
            <button
              key={term}
              onClick={() => {
                setSearchTerm(term);
                setSearchParams({ q: term });
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile / Tablet Slide-out Drawer */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={() => setIsMobileFiltersOpen(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
          />
          <div className="relative w-full max-w-xs sm:max-w-sm bg-white dark:bg-slate-900 h-full p-5 overflow-y-auto shadow-2xl flex flex-col justify-between z-10 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Filters
                </h2>
              </div>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 space-y-6">
              {renderFilterContent()}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex gap-2">
              <button
                onClick={resetAllFilters}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Reset All
              </button>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Apply Filters ({sortedProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout: 2-Column Panel 2 Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Filters Sidebar (Desktop permanent, matching Panel 2) */}
        <aside className="hidden lg:block lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-6 shadow-sm sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Filters
              </h2>
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="text-xs text-brand-600 dark:text-brand-400 font-bold hover:underline cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>

          {renderFilterContent()}
        </aside>

        {/* RIGHT COLUMN: Results Section matching Panel 2 */}
        <main className="lg:col-span-9 space-y-6">
          {/* Header Bar: Title, Count, Sort, and View Toggle (Desktop) */}
          <div className="hidden lg:flex items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                {searchTerm ? searchTerm : 'All Products'}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Showing <strong className="text-slate-800 dark:text-slate-200">{sortedProducts.length}</strong> results {searchTerm && <span>for "<strong>{searchTerm}</strong>"</span>}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="text-slate-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="discount">Highest Discount (%)</option>
                  <option value="score">AI Deal Score</option>
                  <option value="rating">Customer Rating</option>
                </select>
              </div>

              {/* View Switcher */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === 'list'
                      ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                    }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === 'grid'
                      ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                    }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Results: List View (Panel 2 format) */}
          {sortedProducts.length > 0 ? (
            viewMode === 'list' ? (
              <div className="space-y-3 sm:space-y-4">
                {sortedProducts.map(product => {
                  const isWishlisted = wishlist.includes(product.id);
                  const specText = getProductSpec(product);
                  const externalListings = (product.marketplacePrices || []).filter(
                    p => !p.isSmartDealsSeller && !p.sellerName.toLowerCase().includes('smartdeal')
                  );
                  const lowestStore = externalListings.length > 0
                    ? [...externalListings].sort((a, b) => a.finalPrice - b.finalPrice)[0]
                    : product.marketplacePrices[0];

                  return (
                    <div
                      key={product.id}
                      className="group relative p-2.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 shadow-xs hover:shadow-md transition-all duration-200"
                    >
                      {/* MOBILE CARD (sm:hidden) - Exact Match with Screen 3 Reference */}
                      <div className="flex sm:hidden items-center gap-3">
                        {/* Left: Product Image in dedicated light rounded box */}
                        <Link
                          to={product.id === 'prod-boat-airdopes' ? '/' : `/product/${product.id}`}
                          className="relative w-24 h-28 rounded-xl bg-slate-50 dark:bg-slate-950 p-2 shrink-0 flex items-center justify-center border border-slate-100 dark:border-slate-800/80 active:scale-95 transition-transform"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain drop-shadow-xs"
                          />
                        </Link>

                        {/* Right: Info and In-Column Action Buttons */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 space-y-1">
                          {/* Row 1: Product Title + Wishlist Heart */}
                          <div className="flex items-start justify-between gap-1">
                            <Link
                              to={product.id === 'prod-boat-airdopes' ? '/' : `/product/${product.id}`}
                              className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 leading-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                              {product.name}
                            </Link>
                            <button
                              onClick={() => toggleWishlist(product.id)}
                              className={`p-1 -mr-1 rounded-full transition-colors shrink-0 cursor-pointer ${
                                isWishlisted
                                  ? 'text-rose-500'
                                  : 'text-slate-400 hover:text-rose-500'
                              }`}
                              title="Save to wishlist"
                            >
                              <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                            </button>
                          </div>

                          {/* Row 2: Spec / Subtitle Line */}
                          <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium truncate">
                            {specText}
                          </div>

                          {/* Row 3: Price, MRP & Discount */}
                          <div className="flex items-baseline gap-1.5 flex-wrap">
                            <span className="text-sm font-black text-slate-950 dark:text-white">
                              ₹{product.sellingPrice.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-slate-400 line-through">
                              ₹{product.mrp.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded">
                              {product.discountPercent}% OFF
                            </span>
                          </div>

                          {/* Row 4: Free Delivery Line */}
                          <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                            <Truck className="w-3 h-3 shrink-0" />
                            <span className="truncate">Free - Free Delivery</span>
                          </div>

                          {/* Row 5: Action Buttons side-by-side inside the column */}
                          <div className="flex items-center gap-2 pt-0.5">
                            <Link
                              to={`/compare/${product.id}`}
                              className="flex-1 py-1 px-2 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold text-[11px] text-center flex items-center justify-center gap-1 shadow-2xs hover:bg-blue-100 transition-colors cursor-pointer"
                            >
                              <span className="text-[10px]">⇄</span>
                              <span>Compare</span>
                            </Link>
                            <Link
                              to={product.id === 'prod-boat-airdopes' ? '/' : `/product/${product.id}`}
                              className="flex-1 py-1 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] text-center flex items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer"
                            >
                              <span>View Details</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* DESKTOP CARD (hidden sm:flex) - Matching sleek structure */}
                      <div className="hidden sm:flex sm:items-center sm:gap-6 w-full">
                        {/* Image Thumbnail Container */}
                        <Link
                          to={product.id === 'prod-boat-airdopes' ? '/' : `/product/${product.id}`}
                          className="relative w-36 h-36 rounded-2xl bg-slate-50 dark:bg-slate-950 p-3 shrink-0 flex items-center justify-center border border-slate-100 dark:border-slate-800/80 group-hover:scale-105 transition-transform"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain drop-shadow-sm"
                          />
                        </Link>

                        {/* Center Info */}
                        <div className="flex-1 min-w-0 space-y-1.5 text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800/40">
                              {product.brand}
                            </span>
                            <span className="text-xs text-amber-500 font-bold flex items-center gap-1">
                              ★ {product.rating} <span className="text-slate-400 font-normal">({(product.reviewsCount / 1000).toFixed(1)}k)</span>
                            </span>
                          </div>

                          <Link
                            to={product.id === 'prod-boat-airdopes' ? '/' : `/product/${product.id}`}
                            className="block text-base font-black text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1"
                          >
                            {product.name}
                          </Link>

                          <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                            {specText}
                          </div>

                          <div className="flex items-baseline gap-2 pt-0.5">
                            <span className="text-xl font-black text-slate-950 dark:text-white">
                              ₹{product.sellingPrice.toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs text-slate-400 line-through">
                              ₹{product.mrp.toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
                              {product.discountPercent}% OFF
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold pt-0.5">
                            <Truck className="w-3.5 h-3.5 shrink-0" />
                            <span>Free Delivery • Available on {lowestStore?.sellerName || 'Amazon'}</span>
                          </div>
                        </div>

                        {/* Right Action Block */}
                        <div className="flex flex-col items-end justify-center gap-2.5 shrink-0">
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className={`p-2 rounded-xl transition-all cursor-pointer ${
                              isWishlisted
                                ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
                                : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                            title="Save to wishlist"
                          >
                            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                          </button>

                          <div className="flex flex-col gap-2 w-36">
                            <Link
                              to={`/compare/${product.id}`}
                              className="px-4 py-2 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-700 dark:text-blue-300 font-bold text-xs text-center transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <span>⇄</span>
                              <span>Compare</span>
                            </Link>
                            <Link
                              to={product.id === 'prod-boat-airdopes' ? '/' : `/product/${product.id}`}
                              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs text-center shadow-md transition-all cursor-pointer flex items-center justify-center gap-1"
                            >
                              <span>View Details</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
                {sortedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )
          ) : (
            <div className="p-16 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <Search className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No matching products found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                We couldn't find any products matching your query or active filters. Try adjusting your price range or clearing filters.
              </p>
              <button
                onClick={resetAllFilters}
                className="px-6 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
