import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/common/ProductCard';
import { mockCategories } from '../data/mockProducts';
import {
  SlidersHorizontal,
  Filter,
  ArrowUpDown,
  Search,
  Sparkles,
  X
} from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { products } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCatParam = searchParams.get('cat') || '';
  const searchParam = searchParams.get('search') || '';
  const dealsOnlyParam = searchParams.get('deals') === 'true';

  const [selectedCategory, setSelectedCategory] = useState<string>(activeCatParam);
  const [searchQuery, setSearchQuery] = useState<string>(searchParam);
  const [priceMax, setPriceMax] = useState<number>(80000);
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [minRating, setMinRating] = useState<number>(0);
  const [smartDealsOnly, setSmartDealsOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'dealScore' | 'priceAsc' | 'priceDesc' | 'rating'>('dealScore');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Derive unique brands
  const brands = useMemo(() => {
    const set = new Set(products.map(p => p.brand));
    return ['All', ...Array.from(set)];
  }, [products]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        if (selectedCategory && selectedCategory !== 'All') {
          const catParam = selectedCategory.toLowerCase();
          const prodCat = product.category.toLowerCase();
          const isMatch =
            prodCat === catParam ||
            (catParam.includes('shoe') && (prodCat === 'fashion' || product.name.toLowerCase().includes('shoe'))) ||
            (catParam.includes('fashion') && (prodCat === 'fashion' || product.name.toLowerCase().includes('shoe'))) ||
            (catParam.includes('phone') && (prodCat === 'mobiles' || product.name.toLowerCase().includes('phone')));
          if (!isMatch) return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            product.name.toLowerCase().includes(q) ||
            product.brand.toLowerCase().includes(q) ||
            product.category.toLowerCase().includes(q);
          if (!match) return false;
        }
        if (product.sellingPrice > priceMax) return false;
        if (selectedBrand !== 'All' && product.brand !== selectedBrand) return false;
        if (product.rating < minRating) return false;
        if (smartDealsOnly && !product.isSmartDealsChoice) return false;
        if (dealsOnlyParam && product.dealScore < 85) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'dealScore') return b.dealScore - a.dealScore;
        if (sortBy === 'priceAsc') return a.sellingPrice - b.sellingPrice;
        if (sortBy === 'priceDesc') return b.sellingPrice - a.sellingPrice;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [
    products,
    selectedCategory,
    searchQuery,
    priceMax,
    selectedBrand,
    minRating,
    smartDealsOnly,
    dealsOnlyParam,
    sortBy
  ]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setPriceMax(80000);
    setSelectedBrand('All');
    setMinRating(0);
    setSmartDealsOnly(false);
    setSortBy('dealScore');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Top Banner & Title */}
      <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 rounded-3xl p-6 text-white flex flex-wrap items-center justify-between gap-4 shadow-lg border border-indigo-800/40">
        <div>
          <div className="flex items-center gap-2 text-xs text-brand-300 font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Product Catalog & Smart Filter</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">
            {selectedCategory && selectedCategory !== 'All' ? `${selectedCategory} Deals` : 'All Products & Deals'}
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Showing {filteredProducts.length} verified products with cross-store price comparison
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="sm:hidden px-4 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold flex items-center gap-1.5"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filters Sidebar (Desktop) */}
        <aside className="hidden lg:block bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-6 h-fit sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>Smart Filters</span>
            </h3>
            <button
              onClick={resetFilters}
              className="text-[11px] text-brand-600 dark:text-brand-400 hover:text-brand-700 font-bold"
            >
              Reset All
            </button>
          </div>

          {/* Search in results */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Search Keywords</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Filter by keyword..."
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-brand-500 focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category</label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full p-2.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-brand-500 focus:outline-none"
            >
              <option value="All">All Categories (12)</option>
              {mockCategories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Max Price</span>
              <span className="text-brand-600 dark:text-brand-400">₹{priceMax.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="80000"
              step="1000"
              value={priceMax}
              onChange={e => setPriceMax(Number(e.target.value))}
              className="w-full accent-brand-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              <span>₹1,000</span>
              <span>₹80,000+</span>
            </div>
          </div>

          {/* Brand */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Brand</label>
            <div className="flex flex-wrap gap-1.5">
              {brands.map(b => (
                <button
                  key={b}
                  onClick={() => setSelectedBrand(b)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    selectedBrand === b
                      ? 'bg-slate-900 dark:bg-brand-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Min Rating */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Customer Rating</label>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {[4, 4.3, 4.5, 0].map(r => (
                <button
                  key={r}
                  onClick={() => setMinRating(r)}
                  className={`py-1.5 px-2 rounded-xl font-bold transition-all ${
                    minRating === r
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {r === 0 ? 'All Ratings' : `${r}★ & Above`}
                </button>
              ))}
            </div>
          </div>

          {/* Verified Deals Toggle */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200">
              <input
                type="checkbox"
                checked={smartDealsOnly}
                onChange={e => setSmartDealsOnly(e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded accent-brand-600"
              />
              <span>SmartDeals Choice Only</span>
            </label>
          </div>
        </aside>

        {/* Right Product Grid */}
        <div className="lg:col-span-3 space-y-6">
          {/* Sorting and Summary Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
              Showing <strong className="text-slate-900 dark:text-white">{filteredProducts.length}</strong> deals
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>Sort by:</span>
              </span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="dealScore">Deal Score (Highest First)</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-2.5 sm:gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">No matching deals found</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                  Try relaxing your price filters or clearing search keywords to explore more verified products.
                </p>
              </div>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Slide-over Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto border-l border-slate-200 dark:border-slate-800">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 font-extrabold text-slate-900 dark:text-white">
                  <SlidersHorizontal className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  <span>Filter Products</span>
                </div>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Keyword Search */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Keyword Search</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search titles, brands..."
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-brand-500 focus:outline-none"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category</label>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="w-full p-2.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-brand-500 focus:outline-none"
                >
                  <option value="All">All Categories</option>
                  {mockCategories.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Max Price</span>
                  <span className="text-brand-600 dark:text-brand-400">₹{priceMax.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="80000"
                  step="1000"
                  value={priceMax}
                  onChange={e => setPriceMax(Number(e.target.value))}
                  className="w-full accent-brand-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                  <span>₹1,000</span>
                  <span>₹80,000+</span>
                </div>
              </div>

              {/* Brands */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Brand</label>
                <div className="flex flex-wrap gap-1.5">
                  {brands.map(b => (
                    <button
                      key={b}
                      onClick={() => setSelectedBrand(b)}
                      className={`text-xs px-3 py-1 rounded-lg font-semibold transition-all ${
                        selectedBrand === b
                          ? 'bg-brand-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ratings */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Customer Rating</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[4, 4.3, 4.5, 0].map(r => (
                    <button
                      key={r}
                      onClick={() => setMinRating(r)}
                      className={`py-2 px-2.5 rounded-xl font-bold transition-all ${
                        minRating === r
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {r === 0 ? 'All Ratings' : `${r}★ & Above`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Deals toggle */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={smartDealsOnly}
                    onChange={e => setSmartDealsOnly(e.target.checked)}
                    className="w-4 h-4 text-brand-600 rounded accent-brand-600"
                  />
                  <span>SmartDeals Choice Only</span>
                </label>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-2 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md transition-colors"
              >
                View {filteredProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
