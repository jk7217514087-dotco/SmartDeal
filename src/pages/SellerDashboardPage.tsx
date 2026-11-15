import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Store,
  TrendingUp,
  Package,
  PlusCircle,
  ShoppingBag,
  Percent,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Coins,
  Truck,
  ArrowRight,
  Sparkles,
  Award,
  Layers,
  Search,
  DollarSign
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const SellerDashboardPage: React.FC = () => {
  const {
    seller,
    products,
    addProduct,
    orders,
    commissionSlabs
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'add-product' | 'commission' | 'orders'>('overview');

  // Add Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newCategory, setNewCategory] = useState('Electronics');
  const [newMrp, setNewMrp] = useState<number>(14999);
  const [newSellingPrice, setNewSellingPrice] = useState<number>(11999);
  const [newStock, setNewStock] = useState<number>(30);
  const [newDeliveryDays, setNewDeliveryDays] = useState('Tomorrow, by 5 PM');
  const [newDeliveryCharge, setNewDeliveryCharge] = useState<number>(0);
  const [newImgUrl, setNewImgUrl] = useState('https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80');
  const [newDescription, setNewDescription] = useState('');
  const [isProductAdded, setIsProductAdded] = useState(false);

  // Live Commission Calculator Logic (Section 15 & 18)
  const calculateCommission = (price: number) => {
    let rate = 12; // default for < 10000
    if (price > 500000) rate = 3.0;
    else if (price > 100000) rate = 4.5;
    else if (price > 50000) rate = 6.5;
    else if (price > 10000) rate = 9.0;

    const commissionFee = Math.round(price * (rate / 100));
    const netPayout = price - commissionFee;
    const smartCoinsAward = Math.min(500, Math.floor(price * 0.015));

    return { rate, commissionFee, netPayout, smartCoinsAward };
  };

  const currentCalc = calculateCommission(newSellingPrice);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newSellingPrice) return;

    const discount = Math.round(((newMrp - newSellingPrice) / newMrp) * 100);

    addProduct({
      name: newProdName,
      brand: newBrand || 'SmartDeals Brand',
      category: newCategory,
      image: newImgUrl,
      images: [newImgUrl],
      mrp: Number(newMrp),
      sellingPrice: Number(newSellingPrice),
      discountPercent: discount,
      rating: 4.8,
      reviewsCount: 12,
      seller: seller.storeName,
      sellerRating: seller.rating,
      deliveryDate: newDeliveryDays,
      deliveryCharge: Number(newDeliveryCharge),
      smartCoinsEarned: currentCalc.smartCoinsAward,
      stock: Number(newStock),
      returnDays: 7,
      warranty: '1 Year Brand Warranty',
      description: newDescription || 'Premium verified product listed on SmartDeals Marketplace.',
      features: ['100% Genuine Sealed Unit', 'Brand Warranty with GST Invoice', 'Express Dispatch'],
      specs: { 'Brand': newBrand || 'Assured', 'Category': newCategory, 'Condition': 'Brand New Sealed' }
    });

    setIsProductAdded(true);
    setTimeout(() => {
      setIsProductAdded(false);
      setActiveTab('products');
    }, 1200);
  };

  // Mock Sales Trend Data for Recharts
  const salesTrend = [
    { day: 'Mon', sales: 18000, orders: 14 },
    { day: 'Tue', sales: 24000, orders: 19 },
    { day: 'Wed', sales: 21000, orders: 16 },
    { day: 'Thu', sales: 32000, orders: 25 },
    { day: 'Fri', sales: 29000, orders: 22 },
    { day: 'Sat', sales: 42000, orders: 34 },
    { day: 'Sun', sales: 38000, orders: 29 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Seller Bar */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg">
            <Store className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">{seller.storeName}</h1>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-extrabold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>KYC Approved Seller</span>
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {seller.businessName} • GST: {seller.gstNumber} • Rating: {seller.rating}★
            </p>
          </div>
        </div>

        {/* Section 16: Seller Incentive 0% Commission Progress Tracker Banner */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 w-full md:w-80 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-amber-300">
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>0% Commission Incentive</span>
            </span>
            <span className="text-white font-black">{seller.salesCountForIncentive}/10 Sales</span>
          </div>

          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${(seller.salesCountForIncentive / 10) * 100}%` }}
            />
          </div>

          <div className="text-[11px] text-slate-300">
            <strong>{10 - seller.salesCountForIncentive} more sales</strong> to unlock <strong>0% SmartDeals Commission</strong> on your next eligible sale!
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 no-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'overview'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 dark:hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Dashboard Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'products'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 dark:hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Products ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('add-product')}
          className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'add-product'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 text-brand-700 dark:text-brand-400'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </button>

        <button
          onClick={() => setActiveTab('commission')}
          className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'commission'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 text-amber-800 dark:text-amber-400'
          }`}
        >
          <Percent className="w-4 h-4" />
          <span>Commission & Slabs</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'orders'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 dark:hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders ({orders.length})</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Top 8 Metric Cards (Section 14) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Sales (GMV)</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">₹{seller.totalSales.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+18.4% this week</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Orders</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{seller.totalOrders}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{seller.deliveredOrdersCount} delivered</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Store Visitors</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">5,430</div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">+12% vs last month</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Conversion Rate</div>
              <div className="text-2xl font-black text-brand-600 dark:text-brand-400">2.87%</div>
              <div className="text-[11px] text-slate-400">Industry avg: 1.8%</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Products</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{products.length}</div>
              <div className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold">100% In Stock</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Net Payout Revenue</div>
              <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400">₹1,11,250</div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Auto-credited weekly</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Orders</div>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400">4</div>
              <div className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold">Dispatch by 4 PM</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Commission Paid</div>
              <div className="text-2xl font-black text-slate-800 dark:text-slate-100">₹13,750</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Avg 11% platform rate</div>
            </div>
          </div>

          {/* Sales Chart */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Weekly Sales Trend (₹)</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Real-time daily transaction velocity</p>
              </div>
              <span className="text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold px-3 py-1 rounded-xl">
                Avg ₹28,570 / day
              </span>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesTrend}>
                  <defs>
                    <linearGradient id="sellerGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#334155" />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={v => `₹${v / 1000}k`} stroke="#334155" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '1rem', color: '#fff' }}
                    formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Sales']}
                  />
                  <Area type="monotone" dataKey="sales" stroke="#d97706" strokeWidth={3} fill="url(#sellerGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS LIST */}
      {activeTab === 'products' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Listed Catalog Products</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Live products compared across market channels</p>
            </div>
            <button
              onClick={() => setActiveTab('add-product')}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-brand-500/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">MRP</th>
                  <th className="p-3">Selling Price</th>
                  <th className="p-3">Deal Score</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Est. Commission</th>
                  <th className="p-3">Net Payout</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {products.map(p => {
                  const calc = calculateCommission(p.sellingPrice);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-3 flex items-center gap-3">
                        <img src={p.image} alt="" className="w-10 h-10 object-contain rounded-lg bg-slate-50 dark:bg-slate-800 p-1 shrink-0" />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{p.name}</div>
                          <div className="text-[10px] text-slate-400">{p.brand}</div>
                        </div>
                      </td>
                      <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">{p.category}</td>
                      <td className="p-3 text-slate-400 line-through">₹{p.mrp.toLocaleString('en-IN')}</td>
                      <td className="p-3 font-black text-slate-900 dark:text-white text-sm">₹{p.sellingPrice.toLocaleString('en-IN')}</td>
                      <td className="p-3">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                          {p.dealScore}/100
                        </span>
                      </td>
                      <td className="p-3 font-bold text-slate-700 dark:text-slate-300">{p.stock} units</td>
                      <td className="p-3 text-amber-700 dark:text-amber-400 font-semibold">₹{calc.commissionFee} ({calc.rate}%)</td>
                      <td className="p-3 font-extrabold text-emerald-700 dark:text-emerald-400 text-sm">₹{calc.netPayout.toLocaleString('en-IN')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ADD PRODUCT WITH LIVE COMMISSION CALCULATOR (Section 18) */}
      {activeTab === 'add-product' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <form onSubmit={handleAddProduct} className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-5 text-xs">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Add New Marketplace Product</h3>
              <p className="text-slate-500 dark:text-slate-400">Your listing will be instantly compared against external retailers</p>
            </div>

            {isProductAdded && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Product published to SmartDeals Marketplace!</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 sm:col-span-2">
                <label className="font-bold text-slate-700 dark:text-slate-300">Product Title</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={e => setNewProdName(e.target.value)}
                  placeholder="e.g. OnePlus Nord CE 4 5G (8GB RAM, 128GB Storage)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Brand Name</label>
                <input
                  type="text"
                  required
                  value={newBrand}
                  onChange={e => setNewBrand(e.target.value)}
                  placeholder="e.g. OnePlus"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Category</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 bg-white dark:bg-slate-800"
                >
                  <option>Mobiles</option>
                  <option>Laptops</option>
                  <option>Electronics</option>
                  <option>Fashion</option>
                  <option>Home & Kitchen</option>
                  <option>Appliances</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">MRP (Retail Tag Price)</label>
                <input
                  type="number"
                  required
                  value={newMrp}
                  onChange={e => setNewMrp(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Your Selling Price (₹)</label>
                <input
                  type="number"
                  required
                  value={newSellingPrice}
                  onChange={e => setNewSellingPrice(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-black text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Available Stock (Units)</label>
                <input
                  type="number"
                  value={newStock}
                  onChange={e => setNewStock(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Delivery Charge (₹)</label>
                <input
                  type="number"
                  value={newDeliveryCharge}
                  onChange={e => setNewDeliveryCharge(Number(e.target.value))}
                  placeholder="0 for FREE"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-bold text-slate-700 dark:text-slate-300">Product Image URL</label>
                <input
                  type="url"
                  value={newImgUrl}
                  onChange={e => setNewImgUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-bold text-slate-700 dark:text-slate-300">Product Description</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="Describe specifications, key features and packaging..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-md shadow-brand-500/25 active:scale-95 transition-all"
            >
              Publish Product to Marketplace
            </button>
          </form>

          {/* Right: Live Real-Time Commission & Payout Calculator (Section 18) */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 sticky top-28 text-xs">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-black text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span>Live Payout Calculator</span>
              </h4>
              <p className="text-slate-400 text-[11px]">Real-time margin calculation</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-2">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Product Selling Price</span>
                <span className="font-bold text-slate-900 dark:text-white">₹{newSellingPrice.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-amber-700 dark:text-amber-400 font-semibold">
                <span>Platform Commission ({currentCalc.rate}%)</span>
                <span>-₹{currentCalc.commissionFee}</span>
              </div>

              <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                <span>SmartCoins Customer Reward</span>
                <span>+{currentCalc.smartCoinsAward} Coins (Subsidized)</span>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline">
                <span className="font-black text-slate-900 dark:text-white">Your Estimated Payout</span>
                <span className="text-xl font-black text-emerald-700 dark:text-emerald-400">₹{currentCalc.netPayout.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-indigo-900 dark:text-indigo-200 text-[11px] leading-relaxed space-y-1">
              <strong>SmartDeals Fee Guarantee:</strong>
              <div>
                Products above ₹10,000 unlock reduced commission tiers automatically (down to 3%). Eligible sales under ₹10k count towards your 0% free commission cycle!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COMMISSION SYSTEM & 0% INCENTIVE (Section 15 & 16) */}
      {activeTab === 'commission' && (
        <div className="space-y-6">
          {/* Section 16 Hero */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-xs uppercase font-extrabold tracking-wider bg-white/20 px-3 py-0.5 rounded-full">
                Seller Loyalty Incentive
              </span>
              <h3 className="text-2xl font-black">0% Commission Sales Unlock Rule</h3>
              <p className="text-xs text-amber-100 max-w-xl">
                For products priced below ₹10,000: Complete 10 successful delivered orders and SmartDeals will completely waive its 12% commission on your 11th order!
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-4 rounded-2xl text-center shrink-0 shadow-md">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Your Current Progress</div>
              <div className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">{seller.salesCountForIncentive} / 10</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{10 - seller.salesCountForIncentive} sales to 0% fee</div>
            </div>
          </div>

          {/* Configurable Commission Slabs (Section 15) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Active Platform Commission Slabs</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Configured by SmartDeals platform administration</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {commissionSlabs.map((slab, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-900 dark:text-white">{slab.tierName}</span>
                    <span className="font-black text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50 px-2 py-0.5 rounded-lg border border-brand-200/50 dark:border-brand-800/50">
                      {slab.commissionRate}%
                    </span>
                  </div>
                  <div className="text-slate-500 dark:text-slate-400">
                    Range: ₹{slab.minAmount.toLocaleString('en-IN')} – {slab.maxAmount === Infinity ? 'Above' : `₹${slab.maxAmount.toLocaleString('en-IN')}`}
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">{slab.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Merchant Orders to Fulfill</h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {orders.map(o => (
              <div key={o.id} className="py-3.5 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-extrabold text-slate-900 dark:text-white">
                    Order #{o.id} • {o.items.length} Item(s)
                  </div>
                  <div className="text-slate-500 dark:text-slate-400">
                    Placed: {o.date} • Customer: {o.shippingAddress.fullName} ({o.shippingAddress.city})
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-black text-slate-900 dark:text-white">₹{o.finalAmount.toLocaleString('en-IN')}</div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">{o.paymentStatus} via {o.paymentMethod}</div>
                  </div>
                  <span className="bg-indigo-50 dark:bg-indigo-950/50 text-brand-700 dark:text-brand-300 font-bold px-2.5 py-1 rounded-xl border border-brand-200/50 dark:border-brand-800/50">
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
