import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SmartBuyRecommendation } from '../components/product/SmartBuyRecommendation';
import { InteractivePriceHistoryChart } from '../components/product/InteractivePriceHistoryChart';
import { MarketplaceBadge } from '../components/common/MarketplaceBadge';
import { notificationService } from '../services/notificationService';
import { getStoreBuyUrl } from '../utils/storeUrls';
import {
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Search,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  Heart,
  Share2,
  Truck,
  RotateCcw,
  Check,
  ArrowRight
} from 'lucide-react';

export const PriceComparisonPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, wishlist, toggleWishlist, trackActivity, trackOutboundClick, isDarkMode } = useApp();
  const navigate = useNavigate();

  const [selectedId, setSelectedId] = useState<string>(id || products[0]?.id || '');
  const [selectedMarketplace, setSelectedMarketplace] = useState<string>('flipkart');
  const currentProduct = products.find(p => p.id === selectedId) || products[0];

  // Gallery images
  const productImages = currentProduct?.images && currentProduct.images.length > 0
    ? currentProduct.images
    : [
        currentProduct?.image || '',
        currentProduct?.image || '',
        currentProduct?.image || '',
        currentProduct?.image || ''
      ];

  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Lightbox & Zoom States
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Update selectedId when url param changes
  useEffect(() => {
    if (id && id !== selectedId) {
      setSelectedId(id);
      setActiveImageIdx(0);
      setZoomLevel(1);
      setPanOffset({ x: 0, y: 0 });
    }
  }, [id]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsLightboxOpen(false);
        } else if (e.key === 'ArrowRight') {
          setActiveImageIdx(prev => (prev + 1) % productImages.length);
          setZoomLevel(1);
          setPanOffset({ x: 0, y: 0 });
        } else if (e.key === 'ArrowLeft') {
          setActiveImageIdx(prev => (prev - 1 + productImages.length) % productImages.length);
          setZoomLevel(1);
          setPanOffset({ x: 0, y: 0 });
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isLightboxOpen, productImages.length]);

  // Dynamic Marketplace Price Sorting (cheapest position 1, verified in-stock)
  const externalPrices = (currentProduct.marketplacePrices || []).filter(
    p => !p.isSmartDealsSeller && !p.sellerName.toLowerCase().includes('smartdeal')
  );

  const sortedPrices = [...externalPrices].sort((a, b) => {
    if (a.inStock !== b.inStock) {
      return a.inStock ? -1 : 1;
    }
    return a.finalPrice - b.finalPrice;
  });

  const lowestStore = sortedPrices[0] || currentProduct.marketplacePrices[0];
  const highestStore = sortedPrices[sortedPrices.length - 1] || lowestStore;
  const netSavings = Math.max(0, (highestStore?.finalPrice || 0) - (lowestStore?.finalPrice || 0));
  const isWishlisted = wishlist.includes(currentProduct.id);

  const handlePrevImage = () => {
    setActiveImageIdx(prev => (prev - 1 + productImages.length) % productImages.length);
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleNextImage = () => {
    setActiveImageIdx(prev => (prev + 1) % productImages.length);
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3.5));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPanOffset({ x: 0, y: 0 });
      return next;
    });
  };

  const handleWheelZoom = (e: React.WheelEvent) => {
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      dragStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setPanOffset({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const executeStoreRedirect = (store: typeof lowestStore) => {
    const targetUrl = getStoreBuyUrl(store, currentProduct);
    const trackingId = `SD-COMP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    notificationService.notifyBuyClick({
      clickId: trackingId,
      productId: currentProduct.id,
      productName: currentProduct.name,
      marketplace: store.sellerName,
      price: store.finalPrice,
      targetUrl,
      userName: 'Website Visitor',
      userContact: 'Live Price Comparison'
    });

    trackOutboundClick(
      currentProduct.id,
      currentProduct.name,
      currentProduct.category,
      store.sellerName,
      store.finalPrice,
      targetUrl
    );

    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const scrollToComparisonTable = () => {
    const tableElem = document.getElementById('price-comparison-section');
    if (tableElem) {
      tableElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb matching Reference Panel 5 (e.g. Croma > iPhone > iPhone 15) */}
        <nav className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 font-medium">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>&gt;</span>
          <span className="hover:text-blue-600 cursor-pointer">{currentProduct.category}</span>
          <span>&gt;</span>
          <span className="text-slate-900 dark:text-white font-bold truncate max-w-xs">{currentProduct.name}</span>
        </nav>

        {/* Product Switcher Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 min-w-0">
            <Search className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="shrink-0 font-medium">Comparing Prices for:</span>
            <span className="text-slate-900 dark:text-white font-black truncate">{currentProduct.name}</span>
          </div>

          <div className="w-full sm:w-80 shrink-0">
            <select
              value={selectedId}
              onChange={e => {
                setSelectedId(e.target.value);
                navigate(`/compare/${e.target.value}`);
              }}
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name.slice(0, 36)}... (₹{p.sellingPrice.toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 5. COMPARE PRICES SPLIT 2-COLUMN LAYOUT MATCHING REFERENCE PANEL 5 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: PRODUCT IMAGE GALLERY & PRIMARY BUY ACTIONS */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-6">
            {/* Store & Category Tag */}
            <div className="flex items-center justify-between text-xs">
              <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-[11px]">
                {currentProduct.brand} • {currentProduct.category}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleWishlist(currentProduct.id)}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    isWishlisted ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-500'
                  }`}
                  title={isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                </button>
              </div>
            </div>

            {/* Main Image Stage with Navigation Arrows and Zoom Overlay */}
            <div className="relative w-full aspect-square bg-slate-50 dark:bg-slate-950 rounded-2xl p-4 flex items-center justify-center border border-slate-100 dark:border-slate-800/80 group">
              <img
                src={productImages[activeImageIdx]}
                alt={currentProduct.name}
                onClick={() => setIsLightboxOpen(true)}
                className="max-h-full max-w-full object-contain cursor-zoom-in group-hover:scale-105 transition-transform duration-300"
              />

              {/* Prev / Next Image Navigation Arrows */}
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-md text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition-all cursor-pointer"
                title="Previous Image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-md text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition-all cursor-pointer"
                title="Next Image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Lightbox / Zoom Trigger Icon */}
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="absolute bottom-3 right-3 p-2 rounded-xl bg-white/90 dark:bg-slate-800/90 shadow-sm border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-all cursor-pointer"
                title="Open Zoom Lightbox"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Zoom In & Zoom Out Quick Controls directly beneath Image */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setIsLightboxOpen(true);
                  handleZoomIn();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>Zoom In</span>
              </button>
              <button
                onClick={() => {
                  setIsLightboxOpen(true);
                  handleZoomOut();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
                <span>Zoom Out</span>
              </button>
            </div>

            {/* Thumbnail Row matching Reference Panel 5 */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {productImages.slice(0, 4).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveImageIdx(idx);
                    setZoomLevel(1);
                    setPanOffset({ x: 0, y: 0 });
                  }}
                  className={`aspect-square rounded-xl p-1.5 bg-slate-50 dark:bg-slate-950 flex items-center justify-center border-2 transition-all cursor-pointer ${
                    activeImageIdx === idx
                      ? 'border-blue-600 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="max-h-full max-w-full object-contain" />
                </button>
              ))}
            </div>

            {/* Product Title, Rating & Specs */}
            <div className="space-y-3 pt-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                {currentProduct.name}
              </h1>

              {/* Rating & Stock Badges */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                  ★ {currentProduct.rating} <span className="text-slate-400 font-normal">({(currentProduct.reviewsCount / 1000).toFixed(1)}k+ Reviews)</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white">
                  Best Deal
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white">
                  In Stock
                </span>
              </div>

              {/* Pricing Display */}
              <div className="flex items-baseline gap-2.5 pt-1">
                <span className="text-3xl font-black text-slate-950 dark:text-white">
                  ₹{lowestStore.finalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-base text-slate-400 line-through">
                  ₹{currentProduct.mrp.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                  {Math.round(((currentProduct.mrp - lowestStore.finalPrice) / currentProduct.mrp) * 100)}% OFF
                </span>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-blue-600" />
                <span>Free Delivery • 1 Year Official Manufacturer Warranty</span>
              </div>
            </div>

            {/* Quick Action Links Row */}
            <div className="flex items-center gap-4 text-xs font-bold text-slate-600 dark:text-slate-300 pt-1">
              <button
                onClick={scrollToComparisonTable}
                className="hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>+ Add to Compare</span>
              </button>
              <span>•</span>
              <button
                onClick={() => toggleWishlist(currentProduct.id)}
                className="hover:text-rose-600 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>

            {/* 2 MAIN CTA BUTTONS: PURPLE 'COMPARE PRICES' & ROYAL BLUE 'BUY ON STORE' */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* Purple Compare Prices Button */}
              <button
                onClick={scrollToComparisonTable}
                className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm text-center shadow-lg shadow-indigo-600/25 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Compare Prices</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Royal Blue Dynamic Buy Button representing Lowest Verified Store */}
              <button
                onClick={() => executeStoreRedirect(lowestStore)}
                className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm text-center shadow-lg shadow-blue-600/25 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="truncate">Buy on {lowestStore.sellerName}</span>
                <ExternalLink className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: COMPARE PRICES TABLE & MARKETPLACE OFFERS */}
          <div id="price-comparison-section" className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-5">
            {/* Header */}
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Compare Prices
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Find the best deal across marketplaces
              </p>
            </div>

            {/* Sorted Store Offers List matching Section 5 */}
            <div className="space-y-3">
              {sortedPrices.map((item, index) => {
                const isBestPrice = index === 0 && item.inStock;
                const discount = Math.round(((currentProduct.mrp - item.finalPrice) / currentProduct.mrp) * 100);

                return (
                  <div
                    key={`${item.sellerName}-${index}`}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      isBestPrice
                        ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-400 dark:border-blue-700 shadow-sm'
                        : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    {/* Left: Store Logo, Name & Rating */}
                    <div className="flex items-center gap-3 min-w-[140px]">
                      <MarketplaceBadge storeName={item.sellerName} size="md" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                            {item.sellerName}
                          </span>
                          {isBestPrice && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-xs">
                              BEST PRICE
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          ★ {item.rating || currentProduct.rating} ({(currentProduct.reviewsCount / 1000).toFixed(1)}k)
                        </span>
                      </div>
                    </div>

                    {/* Middle: Price, Discount & Free Delivery */}
                    <div className="flex sm:flex-col items-baseline sm:items-start gap-2 sm:gap-0.5">
                      <div className="flex items-baseline gap-2">
                        <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                          ₹{item.finalPrice.toLocaleString('en-IN')}
                        </span>
                        {discount > 0 && (
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            -{discount}%
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Free Delivery</span>
                      </span>
                    </div>

                    {/* Right: Buy Now Button */}
                    <button
                      onClick={() => executeStoreRedirect(item)}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <span>Buy Now</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Bottom Savings Banner matching Reference Panel 5 */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Save ₹{netSavings.toLocaleString('en-IN')} compared with the highest listed price.</span>
            </div>
          </div>
        </div>

        {/* AI SMART BUY RECOMMENDATION & HISTORICAL PRICE GRAPH */}
        <div className="pt-6 space-y-6">
          <SmartBuyRecommendation
            product={currentProduct}
            selectedMarketplace={selectedMarketplace}
            onMarketplaceChange={setSelectedMarketplace}
          />

          <InteractivePriceHistoryChart
            product={currentProduct}
            initialMarketplace={selectedMarketplace}
            onMarketplaceChange={setSelectedMarketplace}
          />
        </div>
      </div>

      {/* PRODUCT IMAGE ZOOM LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center">
            {/* Top Lightbox Controls Bar */}
            <div className="w-full px-5 py-3.5 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm">{currentProduct.name}</span>
                <span className="text-xs text-slate-400">({activeImageIdx + 1} of {productImages.length})</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleZoomIn}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setZoomLevel(1);
                    setPanOffset({ x: 0, y: 0 });
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-all cursor-pointer"
                  title="Reset Zoom"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsLightboxOpen(false)}
                  className="p-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white transition-all cursor-pointer ml-2"
                  title="Close (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Lightbox Main Stage with Drag & Wheel Zoom */}
            <div
              onWheel={handleWheelZoom}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              className={`relative w-full h-[65vh] flex items-center justify-center p-6 overflow-hidden ${
                zoomLevel > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
              }`}
            >
              <img
                src={productImages[activeImageIdx]}
                alt={currentProduct.name}
                style={{
                  transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
                  transition: isDragging ? 'none' : 'transform 0.2s ease-out'
                }}
                className="max-h-full max-w-full object-contain select-none"
                draggable={false}
              />

              {/* Lightbox Nav Arrows */}
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Thumbnails Strip in Lightbox */}
            <div className="w-full px-5 py-3 border-t border-slate-800 flex items-center justify-center gap-2">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveImageIdx(idx);
                    setZoomLevel(1);
                    setPanOffset({ x: 0, y: 0 });
                  }}
                  className={`w-12 h-12 rounded-xl p-1 bg-slate-800 border-2 transition-all cursor-pointer ${
                    activeImageIdx === idx ? 'border-blue-500 scale-105' : 'border-slate-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
