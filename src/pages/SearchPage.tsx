import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/common/ProductCard';
import {
  Search,
  SlidersHorizontal,
  X,
  ArrowUpDown,
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
  TrendingDown
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Breadcrumb matching Panel 2 */}
      <nav className="text-xs text-slate-400 dark:text-slate-400 flex items-center gap-1.5 font-medium">
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

      {/* Search Header Bar */}
      <div className="space-y-4">
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

      {/* Mobile / Tablet Filter Bar (< lg) */}
      <div className="lg:hidden flex items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <button
          onClick={() => setIsMobileFiltersOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs shadow-xs"
        >
          <SlidersHorizontal className="w-4 h-4 text-brand-500" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-[10px] flex items-center justify-center font-extrabold">
              {activeFilterCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold"
          >
            <option value="relevance">Relevance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="discount">Discount (%)</option>
            <option value="score">Deal Score</option>
          </select>
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
              <div className="space-y-4">
                {sortedProducts.map(product => {
                  const isWishlisted = wishlist.includes(product.id);
                  const cashbackAmount =
                    product.marketplacePrices[0]?.cashbackAmount ||
                    Math.round(product.sellingPrice * 0.015);

                  return (
                    <div
                      key={product.id}
                      className="group relative p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row items-center gap-5 sm:gap-6"
                    >
                      {/* Image Thumbnail Container */}
                      <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-slate-50 dark:bg-slate-950 p-2 sm:p-3 shrink-0 flex items-center justify-center border border-slate-100 dark:border-slate-800/80 group-hover:scale-105 transition-transform">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                        {product.dealScore >= 90 && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-sm">
                            Best Deal
                          </span>
                        )}
                      </div>

                      {/* Center Info */}
                      <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left w-full sm:w-auto">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                          <span className="text-[11px] font-extrabold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded-md border border-brand-200 dark:border-brand-800/40">
                            {product.brand}
                          </span>
                          <span className="text-xs text-amber-500 font-bold flex items-center gap-1">
                            ★ {product.rating} <span className="text-slate-400 font-normal">({(product.reviewsCount / 1000).toFixed(1)}k)</span>
                          </span>
                        </div>

                        <Link
                          to={`/product/${product.id}`}
                          className="block text-sm sm:text-base font-black text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors line-clamp-2 sm:line-clamp-1"
                        >
                          {product.name}
                        </Link>

                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg sm:text-xl font-black text-slate-950 dark:text-white">
                              ₹{product.sellingPrice.toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs text-slate-400 line-through">
                              ₹{product.mrp.toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
                              {product.discountPercent}% OFF
                            </span>
                          </div>
                        </div>

                        {/* Cashback Banner matching Panel 2 */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                          <span className="text-emerald-500">🪙</span>
                          <span>Cashback: ₹{cashbackAmount.toLocaleString('en-IN')}</span>
                          <span className="text-[10px] text-emerald-500/80 hidden sm:inline">(from commission)</span>
                        </div>
                      </div>

                      {/* Right Action Block matching Panel 2 */}
                      <div className="flex flex-col sm:items-end justify-center gap-2.5 w-full sm:w-auto shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className={`self-end p-2 rounded-xl transition-all cursor-pointer ${isWishlisted
                              ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
                              : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          title="Save to wishlist"
                        >
                          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                        </button>

                        <div className="flex sm:flex-col gap-2 w-full">
                          <Link
                            to={`/compare/${product.id}`}
                            className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-transparent text-slate-800 dark:text-slate-200 font-bold text-xs text-center transition-all cursor-pointer"
                          >
                            Compare Prices
                          </Link>
                          <Link
                            to={`/product/${product.id}`}
                            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold text-xs text-center shadow-md shadow-brand-500/20 transition-all cursor-pointer"
                          >
                            View Details
                          </Link>
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
