import React, { useState, useEffect, useMemo } from 'react';
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
  Brush
} from 'recharts';
import {
  Product,
  HistoricalPriceRecord,
  PriceHistoryResponse
} from '../../types';
import { priceIntelligenceService } from '../../services/priceIntelligenceService';
import { marketplaceComplianceService } from '../../services/marketplaceComplianceService';
import { useApp } from '../../context/AppContext';
import {
  TrendingDown,
  TrendingUp,
  Clock,
  Sparkles,
  Calendar,
  Layers,
  ZoomIn,
  RotateCcw,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  ShoppingBag,
  Info
} from 'lucide-react';

interface Props {
  product: Product;
  initialMarketplace?: string;
  onMarketplaceChange?: (store: string) => void;
  className?: string;
}

type DateRangeKey = '7d' | '30d' | '3m' | '6m' | '1y' | 'all';

export const InteractivePriceHistoryChart: React.FC<Props> = ({
  product,
  initialMarketplace = 'flipkart',
  onMarketplaceChange,
  className = ''
}) => {
  const { isDarkMode, activeTheme } = useApp();
  const isWhite = !isDarkMode && (activeTheme === 'light' || activeTheme === 'pure-white');
  const [selectedMarketplace, setSelectedMarketplace] = useState<string>(initialMarketplace);
  const [dateRange, setDateRange] = useState<DateRangeKey>('1y');
  const [dataResponse, setDataResponse] = useState<PriceHistoryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Chart Controls State
  const [showOfferPrice, setShowOfferPrice] = useState<boolean>(true);
  const [showRegularPrice, setShowRegularPrice] = useState<boolean>(true);
  const [showReferenceLines, setShowReferenceLines] = useState<boolean>(true);
  const [brushKey, setBrushKey] = useState<number>(0);

  // Marketplaces list supported by SmartDeal
  const availableMarketplaces = [
    { id: 'flipkart', name: 'Flipkart', badge: 'Best Seller' },
    { id: 'amazon', name: 'Amazon', badge: 'Prime' },
    { id: 'croma', name: 'Croma', badge: 'Verified' },
    { id: 'reliancedigital', name: 'Reliance Digital', badge: 'Official' },
    { id: 'myntra', name: 'Myntra', badge: 'Fashion' },
    { id: 'tatacliq', name: 'Tata CLiQ', badge: 'Luxury' },
    { id: 'meesho', name: 'Meesho', badge: 'Budget' },
    { id: 'ajio', name: 'AJIO', badge: 'Policy Paused' }
  ];

  const dateRanges: { key: DateRangeKey; label: string }[] = [
    { key: '7d', label: '7 Days' },
    { key: '30d', label: '30 Days' },
    { key: '3m', label: '3 Months' },
    { key: '6m', label: '6 Months' },
    { key: '1y', label: '1 Year' },
    { key: 'all', label: 'All Time' }
  ];

  // Fetch price history whenever marketplace or range changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    priceIntelligenceService
      .fetchPriceHistory(product.id, selectedMarketplace, dateRange)
      .then(res => {
        if (isMounted) {
          setDataResponse(res);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [product.id, selectedMarketplace, dateRange]);

  const handleMarketplaceSelect = (storeId: string) => {
    setSelectedMarketplace(storeId);
    if (onMarketplaceChange) {
      onMarketplaceChange(storeId);
    }
  };

  const handleResetZoom = () => {
    setDateRange('1y');
    setBrushKey(prev => prev + 1);
  };

  const isAjio = selectedMarketplace.toLowerCase() === 'ajio';

  // Format chart data points
  const chartData = useMemo(() => {
    if (!dataResponse || !dataResponse.records || dataResponse.records.length === 0) {
      return [];
    }

    return dataResponse.records.map((r, idx) => {
      const d = new Date(r.recorded_at);
      const formattedDate = d.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        ...(dateRange === '1y' || dateRange === 'all' ? { year: '2-digit' } : {})
      });

      return {
        id: r.id,
        rawDate: r.recorded_at,
        date: formattedDate,
        offerPrice: r.offer_price,
        regularPrice: r.price,
        event: r.event,
        status: r.availability_status
      };
    });
  }, [dataResponse, dateRange]);

  // Price calculations for reference lines & summary bar
  const stats = useMemo(() => {
    if (!chartData.length) {
      return {
        lowestPrice: product.sellingPrice,
        highestPrice: product.mrp,
        averagePrice: product.sellingPrice,
        currentPrice: product.sellingPrice,
        totalChanges: 0,
        lastUpdated: 'Live Today'
      };
    }

    const offerPrices = chartData.map(d => d.offerPrice);
    const lowest = Math.min(...offerPrices);
    const highest = Math.max(...offerPrices);
    const sum = offerPrices.reduce((a, b) => a + b, 0);
    const avg = Math.round(sum / offerPrices.length);
    const current = offerPrices[offerPrices.length - 1];

    const lastDate = chartData[chartData.length - 1].rawDate;
    const formattedLast = new Date(lastDate).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return {
      lowestPrice: lowest,
      highestPrice: highest,
      averagePrice: avg,
      currentPrice: current,
      totalChanges: chartData.length,
      lastUpdated: formattedLast
    };
  }, [chartData, product.sellingPrice, product.mrp]);

  const minDomain = Math.max(0, Math.floor((stats.lowestPrice * 0.92) / 500) * 500);
  const maxDomain = Math.ceil((stats.highestPrice * 1.05) / 500) * 500;

  // Custom Dark Navy Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const currentPoint = payload[0]?.payload;
      const offer = currentPoint?.offerPrice;
      const regular = currentPoint?.regularPrice;
      const event = currentPoint?.event;
      const discount = regular && offer ? Math.round(((regular - offer) / regular) * 100) : 0;
      const diffFromAvg = offer - stats.averagePrice;

      return (
        <div className={`${isWhite ? 'bg-white border-slate-200 text-slate-900 shadow-xl' : 'bg-[#0b1329] border-cyan-500/40 text-slate-100 shadow-2xl'} border rounded-2xl p-4 min-w-[210px] space-y-2.5 backdrop-blur-md`}>
          <div className={`flex items-center justify-between pb-1.5 border-b ${isWhite ? 'border-slate-100' : 'border-slate-800'}`}>
            <span className={`text-xs font-bold ${isWhite ? 'text-slate-500' : 'text-slate-400'}`}>{label}</span>
            {event && (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/40">
                {event}
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className={`text-xs flex items-center gap-1.5 ${isWhite ? 'text-slate-500' : 'text-slate-400'}`}>
                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                <span>Offer Price:</span>
              </span>
              <span className="text-sm font-black text-cyan-600 dark:text-cyan-400">
                ₹{offer?.toLocaleString('en-IN')}
              </span>
            </div>

            {regular && regular > offer && (
              <div className="flex items-center justify-between">
                <span className={`text-xs flex items-center gap-1.5 ${isWhite ? 'text-slate-500' : 'text-slate-400'}`}>
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span>List Price:</span>
                </span>
                <span className="text-xs font-semibold text-slate-400 line-through">
                  ₹{regular?.toLocaleString('en-IN')}
                </span>
              </div>
            )}

            {discount > 0 && (
              <div className={`flex items-center justify-between text-[11px] font-bold pt-1 border-t ${isWhite ? 'border-slate-100 text-emerald-600' : 'border-slate-800/80 text-emerald-400'}`}>
                <span>Total Discount:</span>
                <span>{discount}% OFF</span>
              </div>
            )}

            <div className={`text-[10px] flex items-center justify-between pt-0.5 ${isWhite ? 'text-slate-500' : 'text-slate-400'}`}>
              <span>Vs Historical Avg:</span>
              <span className={diffFromAvg <= 0 ? 'text-emerald-500 font-semibold' : 'text-rose-500 font-semibold'}>
                {diffFromAvg <= 0 ? `-₹${Math.abs(diffFromAvg).toLocaleString('en-IN')}` : `+₹${diffFromAvg.toLocaleString('en-IN')}`}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={`rounded-3xl border p-5 sm:p-7 shadow-xl relative overflow-hidden transition-colors ${
        isWhite
          ? 'border-slate-200/90 bg-white text-slate-900 shadow-sm'
          : 'border-slate-800 bg-[#070d1e] text-slate-100 shadow-2xl'
      } ${className}`}
    >
      {/* Background glow styling */}
      {!isWhite && (
        <>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      {/* Header */}
      <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b relative z-10 ${
        isWhite ? 'border-slate-200' : 'border-slate-800/80'
      }`}>
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <TrendingDown className="w-4 h-4 text-white" />
            </div>
            <h3 className={`text-lg sm:text-xl font-black flex items-center gap-2 ${
              isWhite ? 'text-slate-900' : 'text-white'
            }`}>
              <span>Interactive Price History Graph</span>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                Store Isolated
              </span>
            </h3>
          </div>
          <p className={`text-xs mt-1 ${isWhite ? 'text-slate-500' : 'text-slate-400'}`}>
            Compare date-wise historical price movements across verified marketplace channels.
          </p>
        </div>

        {/* Date Filter Buttons */}
        <div className={`flex items-center gap-1 p-1 rounded-xl border self-start lg:self-auto overflow-x-auto scrollbar-none ${
          isWhite ? 'bg-slate-100/90 border-slate-200' : 'bg-[#0e172e] border-slate-800'
        }`}>
          {dateRanges.map(r => (
            <button
              key={r.key}
              onClick={() => setDateRange(r.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                dateRange === r.key
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : isWhite
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Marketplace Selector Bar (Do NOT combine marketplaces) */}
      <div className="py-4 relative z-10">
        <div className={`text-[11px] font-bold uppercase tracking-wider mb-2.5 flex items-center justify-between ${
          isWhite ? 'text-slate-500' : 'text-slate-400'
        }`}>
          <span>Select Marketplace Channel:</span>
          <span className={`text-[10px] normal-case ${isWhite ? 'text-slate-400' : 'text-slate-400'}`}>
            Prices tracked strictly independently per store
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {availableMarketplaces.map(store => {
            const isSelected = selectedMarketplace.toLowerCase() === store.id;
            const isStoreAjio = store.id === 'ajio';

            return (
              <button
                key={store.id}
                onClick={() => handleMarketplaceSelect(store.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 cursor-pointer ${
                  isSelected
                    ? isStoreAjio
                      ? 'bg-amber-500/20 border-amber-500/60 text-amber-600 dark:text-amber-300 ring-2 ring-amber-500/30 shadow-lg'
                      : isWhite
                      ? 'bg-blue-50 border-blue-600 text-blue-700 ring-2 ring-blue-500/30 shadow-md font-black'
                      : 'bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border-cyan-500 text-cyan-300 ring-2 ring-cyan-500/30 shadow-lg'
                    : isWhite
                    ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-950'
                    : 'bg-[#0b1329] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <span>{store.name}</span>
                <span
                  className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-md ${
                    isStoreAjio
                      ? 'bg-amber-500/20 text-amber-500'
                      : isSelected
                      ? isWhite ? 'bg-blue-200/80 text-blue-800' : 'bg-cyan-500/20 text-cyan-300'
                      : isWhite ? 'bg-slate-200 text-slate-600' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {store.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* AJIO Compliance Banner if AJIO Selected */}
      {isAjio ? (
        <div className="my-6 p-6 rounded-2xl bg-gradient-to-br from-[#1b170c] to-[#0c0d16] border border-amber-500/40 text-amber-200 space-y-3 shadow-xl">
          <div className="flex items-center gap-2.5 text-amber-400 font-black text-sm">
            <AlertCircle className="w-5 h-5" />
            <span>AJIO Price Tracking & Alerts Disabled</span>
          </div>
          <p className="text-xs text-amber-200/90 leading-relaxed max-w-2xl">
            In compliance with marketplace affiliate configuration and written authorization policies,
            historical price tracking and price drop alerts are currently paused for AJIO.
            No automated price scraping or predictive tracking is performed on this channel without advance written consent.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => handleMarketplaceSelect('flipkart')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              Switch to Flipkart Tracking
            </button>
            <button
              onClick={() => handleMarketplaceSelect('amazon')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all cursor-pointer"
            >
              Switch to Amazon Tracking
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Chart Controls Bar */}
          <div className={`flex flex-wrap items-center justify-between gap-3 py-3 border-y text-xs font-semibold relative z-10 ${
            isWhite ? 'border-slate-200' : 'border-slate-800/80'
          }`}>
            {/* Toggles */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Show Offer Price */}
              <button
                onClick={() => setShowOfferPrice(!showOfferPrice)}
                className={`flex items-center gap-1.5 cursor-pointer transition-colors ${
                  showOfferPrice ? (isWhite ? 'text-cyan-600 font-bold' : 'text-cyan-400') : 'text-slate-400 line-through'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${showOfferPrice ? 'bg-cyan-500' : 'bg-slate-300'}`} />
                <span>Offer Price</span>
              </button>

              {/* Show Regular Price */}
              <button
                onClick={() => setShowRegularPrice(!showRegularPrice)}
                className={`flex items-center gap-1.5 cursor-pointer transition-colors ${
                  showRegularPrice ? (isWhite ? 'text-indigo-600 font-bold' : 'text-indigo-400') : 'text-slate-400 line-through'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${showRegularPrice ? 'bg-indigo-500' : 'bg-slate-300'}`} />
                <span>Regular Price (MRP)</span>
              </button>

              {/* Show Reference Lines */}
              <button
                onClick={() => setShowReferenceLines(!showReferenceLines)}
                className={`flex items-center gap-1.5 cursor-pointer transition-colors ${
                  showReferenceLines ? (isWhite ? 'text-slate-700' : 'text-slate-300') : 'text-slate-400'
                }`}
              >
                {showReferenceLines ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
                <span>Reference Lines (Min/Avg/Max)</span>
              </button>
            </div>

            {/* Reset Zoom & Pan Helper */}
            <div className="flex items-center gap-3">
              <span className={`text-[10px] hidden sm:inline ${isWhite ? 'text-slate-400' : 'text-slate-400'}`}>
                Drag slider below to zoom & pan
              </span>
              <button
                onClick={handleResetZoom}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  isWhite
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Zoom</span>
              </button>
            </div>
          </div>

          {/* Interactive Recharts Canvas */}
          <div className="py-4 relative z-10">
            {loading ? (
              <div className="h-72 w-full flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-slate-400">Loading historical price series...</p>
              </div>
            ) : chartData.length === 0 ? (
              <div className="h-72 w-full flex flex-col items-center justify-center gap-2 bg-[#091124] rounded-2xl border border-slate-800 text-center p-6">
                <Info className="w-6 h-6 text-slate-400" />
                <div className="text-sm font-bold text-white">No historical prices recorded yet</div>
                <p className="text-xs text-slate-400 max-w-sm">
                  Historical recording for this marketplace will accumulate automatically during price checks.
                </p>
              </div>
            ) : (
              <div className="h-80 sm:h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 15, right: 15, left: 0, bottom: 25 }}>
                    <defs>
                      <linearGradient id="cyanOfferGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="indigoRegularGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke={isWhite ? '#f1f5f9' : '#1e293b'} vertical={false} />

                    <XAxis
                      dataKey="date"
                      stroke={isWhite ? '#94a3b8' : '#64748b'}
                      fontSize={11}
                      tickLine={false}
                      dy={8}
                    />

                    <YAxis
                      stroke={isWhite ? '#94a3b8' : '#64748b'}
                      fontSize={11}
                      domain={[minDomain, maxDomain]}
                      tickLine={false}
                      tickFormatter={val => `₹${Number(val).toLocaleString('en-IN')}`}
                      dx={-4}
                    />

                    <Tooltip content={<CustomTooltip />} />

                    {/* Reference Lines */}
                    {showReferenceLines && (
                      <>
                        {/* Lowest Price Reference Line (Green Dashed) */}
                        <ReferenceLine
                          y={stats.lowestPrice}
                          stroke="#10b981"
                          strokeDasharray="4 4"
                          strokeWidth={1.5}
                          label={{
                            value: `Lowest: ₹${stats.lowestPrice.toLocaleString('en-IN')}`,
                            position: 'insideBottomRight',
                            fill: '#10b981',
                            fontSize: 10,
                            fontWeight: 'bold'
                          }}
                        />

                        {/* Average Price Reference Line (Purple Dashed) */}
                        <ReferenceLine
                          y={stats.averagePrice}
                          stroke="#a855f7"
                          strokeDasharray="4 4"
                          strokeWidth={1.5}
                          label={{
                            value: `Avg: ₹${stats.averagePrice.toLocaleString('en-IN')}`,
                            position: 'insideTopRight',
                            fill: '#a855f7',
                            fontSize: 10,
                            fontWeight: 'bold'
                          }}
                        />

                        {/* Highest Price Reference Line (Rose Dashed) */}
                        <ReferenceLine
                          y={stats.highestPrice}
                          stroke="#f43f5e"
                          strokeDasharray="4 4"
                          strokeWidth={1.5}
                          label={{
                            value: `Peak: ₹${stats.highestPrice.toLocaleString('en-IN')}`,
                            position: 'insideTopLeft',
                            fill: '#f43f5e',
                            fontSize: 10,
                            fontWeight: 'bold'
                          }}
                        />
                      </>
                    )}

                    {/* Regular List Price (MRP Line) */}
                    {showRegularPrice && (
                      <Area
                        type="monotone"
                        dataKey="regularPrice"
                        name="Regular Price"
                        stroke="#818cf8"
                        strokeWidth={2}
                        strokeDasharray="3 3"
                        fill="url(#indigoRegularGradient)"
                        dot={false}
                      />
                    )}

                    {/* Offer Price (Main Selling Price Curve) */}
                    {showOfferPrice && (
                      <Area
                        type="monotone"
                        dataKey="offerPrice"
                        name="Offer Price"
                        stroke="#06b6d4"
                        strokeWidth={3}
                        fill="url(#cyanOfferGradient)"
                        dot={{ r: 3, fill: '#06b6d4', strokeWidth: 1.5, stroke: '#070d1e' }}
                        activeDot={{ r: 6, fill: '#38bdf8', stroke: '#fff', strokeWidth: 2 }}
                      />
                    )}

                    {/* Interactive Zoom & Pan Brush */}
                    <Brush
                      key={brushKey}
                      dataKey="date"
                      height={24}
                      stroke="#0284c7"
                      fill={isWhite ? "#f1f5f9" : "#0b1329"}
                      tickFormatter={() => ''}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Historical Price Information (Summary Bar - 6 Cards) */}
          <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-3 border-t relative z-10 ${
            isWhite ? 'border-slate-200' : 'border-slate-800/80'
          }`}>
            {/* Lowest Price */}
            <div className={`border rounded-2xl p-3.5 space-y-1 ${
              isWhite ? 'bg-emerald-50/70 border-emerald-200' : 'bg-[#0b162f] border-emerald-500/30'
            }`}>
              <div className={`text-[10px] uppercase font-bold tracking-wider ${isWhite ? 'text-emerald-700' : 'text-emerald-400'}`}>Lowest Price</div>
              <div className={`text-base sm:text-lg font-black ${isWhite ? 'text-emerald-700' : 'text-emerald-300'}`}>
                ₹{stats.lowestPrice.toLocaleString('en-IN')}
              </div>
              <div className={`text-[10px] font-medium truncate ${isWhite ? 'text-emerald-600/80' : 'text-emerald-400/80'}`}>Historical Record</div>
            </div>

            {/* Highest Price */}
            <div className={`border rounded-2xl p-3.5 space-y-1 ${
              isWhite ? 'bg-rose-50/70 border-rose-200' : 'bg-[#0b162f] border-rose-500/30'
            }`}>
              <div className={`text-[10px] uppercase font-bold tracking-wider ${isWhite ? 'text-rose-700' : 'text-rose-400'}`}>Highest Price</div>
              <div className={`text-base sm:text-lg font-black ${isWhite ? 'text-rose-700' : 'text-rose-300'}`}>
                ₹{stats.highestPrice.toLocaleString('en-IN')}
              </div>
              <div className={`text-[10px] font-medium truncate ${isWhite ? 'text-rose-600/80' : 'text-rose-400/80'}`}>Peak Market Price</div>
            </div>

            {/* Average Price */}
            <div className={`border rounded-2xl p-3.5 space-y-1 ${
              isWhite ? 'bg-purple-50/70 border-purple-200' : 'bg-[#0b162f] border-purple-500/30'
            }`}>
              <div className={`text-[10px] uppercase font-bold tracking-wider ${isWhite ? 'text-purple-700' : 'text-purple-400'}`}>Average Price</div>
              <div className={`text-base sm:text-lg font-black ${isWhite ? 'text-purple-700' : 'text-purple-300'}`}>
                ₹{stats.averagePrice.toLocaleString('en-IN')}
              </div>
              <div className={`text-[10px] font-medium truncate ${isWhite ? 'text-purple-600/80' : 'text-purple-400/80'}`}>Baseline Mean</div>
            </div>

            {/* Current Price */}
            <div className={`border rounded-2xl p-3.5 space-y-1 ${
              isWhite ? 'bg-cyan-50/70 border-cyan-200' : 'bg-[#0b162f] border-cyan-500/30'
            }`}>
              <div className={`text-[10px] uppercase font-bold tracking-wider ${isWhite ? 'text-cyan-700' : 'text-cyan-400'}`}>Current Price</div>
              <div className={`text-base sm:text-lg font-black ${isWhite ? 'text-cyan-700' : 'text-cyan-300'}`}>
                ₹{stats.currentPrice.toLocaleString('en-IN')}
              </div>
              <div className={`text-[10px] font-bold truncate ${isWhite ? 'text-cyan-600' : 'text-cyan-400'}`}>Live Verified</div>
            </div>

            {/* Total Price Changes */}
            <div className={`border rounded-2xl p-3.5 space-y-1 ${
              isWhite ? 'bg-slate-50 border-slate-200' : 'bg-[#0b162f] border-slate-800'
            }`}>
              <div className={`text-[10px] uppercase font-bold tracking-wider ${isWhite ? 'text-slate-500' : 'text-slate-400'}`}>Price Changes</div>
              <div className={`text-base sm:text-lg font-black ${isWhite ? 'text-slate-900' : 'text-white'}`}>{stats.totalChanges} Points</div>
              <div className={`text-[10px] font-medium truncate ${isWhite ? 'text-slate-500' : 'text-slate-400'}`}>Recorded Cycles</div>
            </div>

            {/* Last Price Update */}
            <div className={`border rounded-2xl p-3.5 space-y-1 ${
              isWhite ? 'bg-slate-50 border-slate-200' : 'bg-[#0b162f] border-slate-800'
            }`}>
              <div className={`text-[10px] uppercase font-bold tracking-wider ${isWhite ? 'text-slate-500' : 'text-slate-400'}`}>Last Update</div>
              <div className={`text-xs sm:text-sm font-black mt-1 truncate ${isWhite ? 'text-slate-800' : 'text-slate-200'}`}>{stats.lastUpdated}</div>
              <div className={`text-[10px] font-medium flex items-center gap-1 truncate ${isWhite ? 'text-slate-500' : 'text-slate-400'}`}>
                <Clock className="w-3 h-3 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>Synchronized</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
