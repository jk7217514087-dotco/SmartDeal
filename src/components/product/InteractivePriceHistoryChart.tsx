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
  const { activeTheme } = useApp();
  const isWhiteTheme = activeTheme === 'pure-white';
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

  // Custom Recharts Tooltip (Light / Dark responsive)
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const currentPoint = payload[0]?.payload;
      const offer = currentPoint?.offerPrice;
      const regular = currentPoint?.regularPrice;
      const event = currentPoint?.event;
      const discount = regular && offer ? Math.round(((regular - offer) / regular) * 100) : 0;
      const diffFromAvg = offer - stats.averagePrice;

      return (
        <div className="bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-cyan-500/40 rounded-2xl p-4 shadow-xl dark:shadow-2xl text-slate-800 dark:text-slate-100 min-w-[210px] space-y-2.5 backdrop-blur-md">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{label}</span>
            {event && (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/40">
                {event}
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                <span>Offer Price:</span>
              </span>
              <span className="text-sm font-black text-cyan-600 dark:text-cyan-400">
                ₹{offer?.toLocaleString('en-IN')}
              </span>
            </div>

            {regular && regular > offer && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400" />
                  <span>List Price:</span>
                </span>
                <span className="text-xs font-semibold text-slate-400 line-through">
                  ₹{regular?.toLocaleString('en-IN')}
                </span>
              </div>
            )}

            {discount > 0 && (
              <div className="flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-bold pt-1 border-t border-slate-100 dark:border-slate-800/80">
                <span>Total Discount:</span>
                <span>{discount}% OFF</span>
              </div>
            )}

            <div className="text-[10px] text-slate-400 flex items-center justify-between pt-0.5">
              <span>Vs Historical Avg:</span>
              <span className={diffFromAvg <= 0 ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-rose-600 dark:text-rose-400 font-semibold'}>
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
      className={`rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#070d1e] p-5 sm:p-7 shadow-sm dark:shadow-2xl text-slate-900 dark:text-slate-100 relative overflow-hidden ${className}`}
    >
      {/* Background glow styling */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800/80 relative z-10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <TrendingDown className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>Interactive Price History Graph</span>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
                Store Isolated
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Compare date-wise historical price movements across verified marketplace channels.
          </p>
        </div>

        {/* Date Filter Buttons */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-[#0e172e] border border-slate-200 dark:border-slate-800 self-start lg:self-auto overflow-x-auto scrollbar-none">
          {dateRanges.map(r => (
            <button
              key={r.key}
              onClick={() => setDateRange(r.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                dateRange === r.key
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Marketplace Selector Bar (Do NOT combine marketplaces) */}
      <div className="py-4 relative z-10">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
          <span>Select Marketplace Channel:</span>
          <span className="text-[10px] text-slate-400 normal-case">
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
                      ? 'bg-amber-50 dark:bg-amber-500/20 border-amber-500 text-amber-700 dark:text-amber-300 ring-2 ring-amber-500/20 shadow-md'
                      : 'bg-blue-50 dark:bg-gradient-to-r dark:from-cyan-950/80 dark:to-blue-950/80 border-blue-500 dark:border-cyan-500 text-blue-700 dark:text-cyan-300 ring-2 ring-blue-500/20 dark:ring-cyan-500/30 shadow-md'
                    : 'bg-slate-50 dark:bg-[#0b1329] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <span>{store.name}</span>
                <span
                  className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-md ${
                    isStoreAjio
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                      : isSelected
                      ? 'bg-blue-100 text-blue-700 dark:bg-cyan-500/20 dark:text-cyan-300'
                      : 'bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
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
          <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-y border-slate-100 dark:border-slate-800/80 text-xs font-semibold relative z-10">
            {/* Toggles */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Show Offer Price */}
              <button
                onClick={() => setShowOfferPrice(!showOfferPrice)}
                className={`flex items-center gap-1.5 cursor-pointer transition-colors ${
                  showOfferPrice ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 line-through'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${showOfferPrice ? 'bg-cyan-500 dark:bg-cyan-400' : 'bg-slate-400'}`} />
                <span>Offer Price</span>
              </button>

              {/* Show Regular Price */}
              <button
                onClick={() => setShowRegularPrice(!showRegularPrice)}
                className={`flex items-center gap-1.5 cursor-pointer transition-colors ${
                  showRegularPrice ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 line-through'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${showRegularPrice ? 'bg-indigo-500 dark:bg-indigo-400' : 'bg-slate-400'}`} />
                <span>Regular Price (MRP)</span>
              </button>

              {/* Show Reference Lines */}
              <button
                onClick={() => setShowReferenceLines(!showReferenceLines)}
                className={`flex items-center gap-1.5 cursor-pointer transition-colors ${
                  showReferenceLines ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'
                }`}
              >
                {showReferenceLines ? <Eye className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
                <span>Reference Lines (Min/Avg/Max)</span>
              </button>
            </div>

            {/* Reset Zoom & Pan Helper */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-slate-400 hidden sm:inline">
                Drag slider below to zoom & pan
              </span>
              <button
                onClick={handleResetZoom}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 dark:text-slate-300 dark:border-slate-700 text-xs font-bold transition-all cursor-pointer"
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
                <p className="text-xs text-slate-500 dark:text-slate-400">Loading historical price series...</p>
              </div>
            ) : chartData.length === 0 ? (
              <div className="h-72 w-full flex flex-col items-center justify-center gap-2 bg-slate-50 dark:bg-[#091124] rounded-2xl border border-slate-200 dark:border-slate-800 text-center p-6">
                <Info className="w-6 h-6 text-slate-400" />
                <div className="text-sm font-bold text-slate-900 dark:text-white">No historical prices recorded yet</div>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
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

                    <CartesianGrid strokeDasharray="3 3" stroke={isWhiteTheme ? '#e2e8f0' : '#1e293b'} vertical={false} />

                    <XAxis
                      dataKey="date"
                      stroke={isWhiteTheme ? '#94a3b8' : '#64748b'}
                      fontSize={11}
                      tickLine={false}
                      dy={8}
                    />

                    <YAxis
                      stroke={isWhiteTheme ? '#94a3b8' : '#64748b'}
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
                        dot={{ r: 3, fill: '#06b6d4', strokeWidth: 1.5, stroke: isWhiteTheme ? '#fff' : '#070d1e' }}
                        activeDot={{ r: 6, fill: '#38bdf8', stroke: '#fff', strokeWidth: 2 }}
                      />
                    )}

                    {/* Interactive Zoom & Pan Brush */}
                    <Brush
                      key={brushKey}
                      dataKey="date"
                      height={24}
                      stroke={isWhiteTheme ? '#3b82f6' : '#0284c7'}
                      fill={isWhiteTheme ? '#f8fafc' : '#0b1329'}
                      tickFormatter={() => ''}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Historical Price Information (Summary Bar - 6 Cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 relative z-10">
            {/* Lowest Price */}
            <div className="bg-emerald-50/80 dark:bg-[#0b162f] border border-emerald-200 dark:border-emerald-500/30 rounded-2xl p-3.5 space-y-1">
              <div className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">Lowest Price</div>
              <div className="text-base sm:text-lg font-black text-emerald-700 dark:text-emerald-300">
                ₹{stats.lowestPrice.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] font-medium text-emerald-600/80 dark:text-emerald-400/80 truncate">Historical Record</div>
            </div>

            {/* Highest Price */}
            <div className="bg-rose-50/80 dark:bg-[#0b162f] border border-rose-200 dark:border-rose-500/30 rounded-2xl p-3.5 space-y-1">
              <div className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 tracking-wider">Highest Price</div>
              <div className="text-base sm:text-lg font-black text-rose-700 dark:text-rose-300">
                ₹{stats.highestPrice.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] font-medium text-rose-600/80 dark:text-rose-400/80 truncate">Peak Market Price</div>
            </div>

            {/* Average Price */}
            <div className="bg-purple-50/80 dark:bg-[#0b162f] border border-purple-200 dark:border-purple-500/30 rounded-2xl p-3.5 space-y-1">
              <div className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400 tracking-wider">Average Price</div>
              <div className="text-base sm:text-lg font-black text-purple-700 dark:text-purple-300">
                ₹{stats.averagePrice.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] font-medium text-purple-600/80 dark:text-purple-400/80 truncate">Baseline Mean</div>
            </div>

            {/* Current Price */}
            <div className="bg-cyan-50/80 dark:bg-[#0b162f] border border-cyan-200 dark:border-cyan-500/30 rounded-2xl p-3.5 space-y-1">
              <div className="text-[10px] uppercase font-bold text-cyan-600 dark:text-cyan-400 tracking-wider">Current Price</div>
              <div className="text-base sm:text-lg font-black text-cyan-700 dark:text-cyan-300">
                ₹{stats.currentPrice.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 truncate">Live Verified</div>
            </div>

            {/* Total Price Changes */}
            <div className="bg-slate-50 dark:bg-[#0b162f] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Price Changes</div>
              <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">{stats.totalChanges} Points</div>
              <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate">Recorded Cycles</div>
            </div>

            {/* Last Price Update */}
            <div className="bg-slate-50 dark:bg-[#0b162f] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Last Update</div>
              <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-200 mt-1 truncate">{stats.lastUpdated}</div>
              <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate">
                <Clock className="w-3 h-3 text-cyan-500 dark:text-cyan-400 shrink-0" />
                <span>Synchronized</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
