import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { MarketplaceBadge } from '../components/common/MarketplaceBadge';
import {
  ArrowDownCircle,
  ArrowRight,
  Sparkles,
  ChevronRight,
  TrendingDown,
  Layers,
  Zap,
  CheckCircle2
} from 'lucide-react';

interface CategoryDealSection {
  id: string;
  title: string;
  subtitle: string;
  searchTerm: string;
  productIds: string[];
}

export const DealsPage: React.FC = () => {
  const { products, isDarkMode } = useApp();
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Defined Category Sections matching Reference Mockup
  const categorySections: CategoryDealSection[] = useMemo(() => [
    {
      id: 'laptops',
      title: 'Top Laptops',
      subtitle: 'Laptops',
      searchTerm: 'laptop',
      productIds: [
        'prod-lenovo-ideapad-slim3',
        'prod-macbook-air-m2',
        'prod-hp-pavilion-15',
        'prod-asus-vivobook'
      ]
    },
    {
      id: 'smartphones',
      title: 'Latest Smartphones',
      subtitle: 'Smartphones',
      searchTerm: 'mobile',
      productIds: [
        'prod-samsung-galaxy-s24',
        'prod-apple-iphone15',
        'prod-redmi-13c',
        'prod-samsung-m14'
      ]
    },
    {
      id: 'headphones',
      title: 'Headphones & Earbuds',
      subtitle: 'Headphones',
      searchTerm: 'headphones',
      productIds: [
        'prod-boat-airdopes',
        'prod-sony-wh1000xm5',
        'prod-boat-rockerz-450',
        'prod-fire-boltt-ninja'
      ]
    },
    {
      id: 'appliances',
      title: 'Refrigerators & Kitchen',
      subtitle: 'Refrigerators',
      searchTerm: 'refrigerator',
      productIds: [
        'prod-samsung-refrigerator-253l',
        'prod-lg-refrigerator-185l',
        'prod-whirlpool-refrigerator-265l',
        'prod-pigeon-stove'
      ]
    },
    {
      id: 'footwear',
      title: 'Footwear & Sneakers',
      subtitle: 'Footwear',
      searchTerm: 'shoes',
      productIds: [
        'prod-nike-running-shoes',
        'prod-adidas-ultraboost',
        'prod-campus-shoes',
        'prod-nike-court-vision'
      ]
    }
  ], []);

  // Filter sections based on top pills
  const activeSections = useMemo(() => {
    if (selectedFilter === 'all') return categorySections;
    return categorySections.filter(s => s.id === selectedFilter);
  }, [categorySections, selectedFilter]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8">
      {/* 1. TOP HEADER & QUICK ACTIONS (Matching Reference Screen 2) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1 pb-2">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Live Category Deals</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Verified Lowest
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Real-time price drop alerts and store comparisons across Amazon, Flipkart, Croma & Myntra
          </p>
        </div>

        {/* Action Buttons: View More / View All Deals */}
        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => navigate('/categories')}
            className="flex-1 sm:flex-initial px-4 sm:px-6 py-2 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-indigo-200 dark:border-slate-700 text-indigo-900 dark:text-indigo-200 font-extrabold text-xs sm:text-sm shadow-xs transition-all cursor-pointer text-center"
          >
            View More
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedFilter('all');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex-1 sm:flex-initial px-5 sm:px-7 py-2 rounded-xl bg-[#4338ca] hover:bg-[#3730a3] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer text-center"
          >
            View All Deals
          </button>
        </div>
      </div>

      {/* 2. CATEGORY JUMP FILTER PILLS STRIP */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          type="button"
          onClick={() => setSelectedFilter('all')}
          className={`px-4 py-2 rounded-full text-xs font-black transition-all shrink-0 cursor-pointer shadow-xs ${
            selectedFilter === 'all'
              ? 'bg-[#4338ca] text-white shadow-md'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
          }`}
        >
          All Deals
        </button>
        {categorySections.map(sec => (
          <button
            key={sec.id}
            type="button"
            onClick={() => setSelectedFilter(sec.id)}
            className={`px-4 py-2 rounded-full text-xs font-black transition-all shrink-0 cursor-pointer shadow-xs ${
              selectedFilter === sec.id
                ? 'bg-[#4338ca] text-white shadow-md'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
            }`}
          >
            {sec.subtitle}
          </button>
        ))}
      </div>

      {/* 3. SHOWCASE CATEGORY DEAL SECTIONS (Matching Panels 1, 2, 3) */}
      <div className="space-y-8 sm:space-y-10">
        {activeSections.map(section => {
          // Resolve real product objects
          const sectionProducts = section.productIds
            .map(id => products.find(p => p.id === id))
            .filter((p): p is NonNullable<typeof p> => Boolean(p))
            .map(product => {
              const externalListings = (product.marketplacePrices || []).filter(
                m => !m.isSmartDealsSeller && !m.sellerName.toLowerCase().includes('smartdeal')
              );
              const lowestListing = externalListings.length > 0
                ? [...externalListings].sort((a, b) => a.finalPrice - b.finalPrice)[0]
                : null;
              
              const storeName = lowestListing?.sellerName || product.seller || 'Amazon';
              const savings = Math.max(0, product.mrp - product.sellingPrice);
              const discount = product.discountPercent || Math.round((savings / product.mrp) * 100);

              return {
                product,
                storeName,
                savings,
                discount
              };
            });

          // Calculate max discount for the top-left pill badge
          const maxSecDiscount = sectionProducts.length > 0
            ? Math.max(...sectionProducts.map(sp => sp.discount))
            : 20;

          return (
            <div
              key={section.id}
              className="relative rounded-3xl p-4 sm:p-7 md:p-8 overflow-hidden shadow-xs border bg-[#EEF2FF] dark:bg-slate-900/90 border-indigo-100 dark:border-slate-800 transition-all"
            >
              {/* Top-Left Max Discount Badge (Fully inside container, completely visible) */}
              <div className="absolute top-3.5 left-3.5 sm:top-5 sm:left-6 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-blue-600 text-white font-black text-xs sm:text-sm shadow-md shadow-blue-500/30 z-10 tracking-tight select-none">
                Up to {maxSecDiscount}% off
              </div>

              {/* Center Category Title & 3 Bullet Badges */}
              <div className="text-center pt-9 sm:pt-2 pb-1 relative z-10">
                <h2 className="font-extrabold text-xl sm:text-2xl md:text-3xl text-slate-900 dark:text-white tracking-tight font-sans">
                  {section.title}
                </h2>

                {/* Subtitle with 3 Badges: Top Brands --- Best Deals --- Max Savings */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-bold text-slate-600 dark:text-slate-400 mt-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-600 text-white font-black text-[8px] flex items-center justify-center shadow-xs">
                      SD
                    </span>
                    <span>Top Brands</span>
                  </span>
                  <span className="text-slate-400">---</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-600 text-white font-black text-[8px] flex items-center justify-center shadow-xs">
                      SD
                    </span>
                    <span>Best Deals</span>
                  </span>
                  <span className="text-slate-400">---</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-600 text-white font-black text-[8px] flex items-center justify-center shadow-xs">
                      SD
                    </span>
                    <span>Max Savings</span>
                  </span>
                </div>
              </div>

              {/* 4 Clean Product Cards in Row (Grid cols: 2 on mobile, 4 on laptop) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 my-5 sm:my-6 relative z-10">
                {sectionProducts.map(({ product, storeName, savings, discount }) => (
                  <div
                    key={product.id}
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-4 shadow-xs hover:shadow-lg border border-slate-100 dark:border-slate-800 transition-all flex flex-col justify-between group cursor-pointer"
                  >
                    {/* Centered Isolated Packshot Image */}
                    <div className="w-full h-32 sm:h-36 md:h-40 flex items-center justify-center p-2 rounded-xl bg-white dark:bg-slate-950/60 mb-2 group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80';
                        }}
                      />
                    </div>

                    {/* Product Name */}
                    <div className="flex-1 flex flex-col justify-between">
                      <h3
                        className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                        title={product.name}
                      >
                        {product.name}
                      </h3>

                      {/* Price Row: Store Logo Icon + Selling Price */}
                      <div className="mt-2.5 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <MarketplaceBadge storeName={storeName} showName={false} size="sm" />
                          <span className="text-sm sm:text-base font-black text-slate-950 dark:text-white">
                            ₹{product.sellingPrice.toLocaleString('en-IN')}
                          </span>
                        </div>

                        {/* Green Arrow Down Circle + Discount % + Savings in ₹ */}
                        <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          <ArrowDownCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 fill-emerald-100 dark:fill-emerald-950" />
                          <span>{discount}% (₹{savings.toLocaleString('en-IN')}) off</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom "View All" Button in Center */}
              <div className="flex justify-center mt-3 sm:mt-5 relative z-10">
                <button
                  type="button"
                  onClick={() => navigate(`/search?q=${encodeURIComponent(section.searchTerm)}`)}
                  className="px-8 sm:px-12 py-2 sm:py-2.5 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-indigo-900 dark:text-indigo-200 font-extrabold text-xs sm:text-sm border border-indigo-200/90 dark:border-slate-700 shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-95"
                >
                  View All
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
