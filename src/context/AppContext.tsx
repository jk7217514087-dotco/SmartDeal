import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Product,
  CartItem,
  Order,
  PriceAlert,
  SmartCoinsTransaction,
  Role,
  Seller,
  CommissionSlab,
  AdminSettings,
  Address,
  MarketplacePrice,
  TrackedUser,
  GuestSession,
  ActivityActionType,
  OutboundClickRecord,
  CashbackWallet,
  CashbackTransaction
} from '../types';
import { mockProducts, initialCommissionSlabs } from '../data/mockProducts';
import { trackingService } from '../services/trackingService';

export type ThemeId = 
  | 'steel-navy'
  | 'matrix-lime'
  | 'sunset-coral'
  | 'aurora-jade'
  | 'royal-gold'
  | 'cyber-indigo'
  | 'pure-white'
  | 'cyber-emerald';

export const THEME_BG_MAP: Record<string, string> = {
  'steel-navy': '#121212',
  'matrix-lime': '#111612',
  'sunset-coral': '#1c0b29',
  'aurora-jade': '#051f15',
  'royal-gold': '#181107',
  'cyber-indigo': '#08092d',
  'pure-white': '#f8fafd',
  'cyber-emerald': '#051f15',
};

export const THEME_CYCLE_ORDER: ThemeId[] = [
  'steel-navy',
  'matrix-lime',
  'sunset-coral',
  'aurora-jade',
  'royal-gold',
  'cyber-indigo',
  'pure-white',
];

export const getThemeDefaultBg = (theme: ThemeId): string => {
  return THEME_BG_MAP[theme] || '#0b1a30';
};

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  currentUser: TrackedUser | null;
  guestSession: GuestSession;
  isAuthValidating: boolean;
  loginUser: (emailOrPhone: string, password: string) => Promise<{ success: boolean; message: string; user?: TrackedUser }>;
  loginWithGoogle: (credential?: string, email?: string, name?: string) => Promise<{ success: boolean; message: string; user?: TrackedUser }>;
  registerUser: (name: string, email: string, phone: string, password: string) => Promise<{ success: boolean; message: string; user?: TrackedUser }>;
  logoutUser: () => Promise<void>;
  trackActivity: (actionType: ActivityActionType, details: Record<string, any>, productId?: string, productName?: string, category?: string) => void;
  trackOutboundClick: (productId: string, productName: string, category: string, marketplace: string, price: number, exactUrl: string) => OutboundClickRecord;
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'dealScore' | 'dealScoreBreakdown' | 'fakeDiscountAudit' | 'buyNowRecommendation' | 'priceHistory' | 'marketplacePrices'>) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedSellerPrice?: MarketplacePrice) => void;
  removeFromCart: (productId: string, sellerName?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, sellerName?: string) => void;
  clearCart: () => void;
  appliedCoupon: string | null;
  couponDiscount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  useSmartCoins: boolean;
  setUseSmartCoins: (use: boolean) => void;
  coinsToRedeem: number;
  setCoinsToRedeem: (coins: number) => void;
  cartCalculations: {
    mrpTotal: number;
    sellingPriceTotal: number;
    deliveryTotal: number;
    couponDiscount: number;
    smartCoinsDiscount: number;
    finalPayable: number;
    totalSavings: number;
    coinsEarned: number;
  };
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  priceAlerts: PriceAlert[];
  addPriceAlert: (productId: string, targetPrice: number, notifyVia?: ('in-app' | 'email' | 'sms')[]) => void;
  removePriceAlert: (alertId: string) => void;
  orders: Order[];
  allOrders: Order[];
  placeOrder: (
    paymentMethod: 'UPI' | 'Credit / Debit Card' | 'Net Banking' | 'Cash on Delivery',
    shippingAddress: Address
  ) => Order;
  smartCoinsBalance: number;
  smartCoinsTransactions: SmartCoinsTransaction[];
  claimDailyCoins: () => { success: boolean; message: string };
  canClaimDaily: boolean;
  seller: Seller;
  updateSellerKYC: (status: 'Approved' | 'Pending' | 'Rejected') => void;
  commissionSlabs: CommissionSlab[];
  updateCommissionSlab: (index: number, newRate: number) => void;
  adminSettings: AdminSettings;
  updateAdminSettings: (newSettings: Partial<AdminSettings>) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isAiAssistantOpen: boolean;
  setIsAiAssistantOpen: (open: boolean) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  activeTheme: ThemeId;
  setActiveTheme: (theme: ThemeId) => void;
  toggleTheme: () => void;
  customBg: string;
  setCustomBg: (color: string) => void;
  resetCustomBg: () => void;
  isBgModalOpen: boolean;
  setIsBgModalOpen: (open: boolean) => void;
  cashbackWallet: CashbackWallet;
  cashbackTransactions: CashbackTransaction[];
  redeemCashback: (amount: number, method?: string, accountDetails?: string) => { success: boolean; message: string; newBalance?: number };
  processReturnReversal: (orderRef: string, reason: string) => { success: boolean; message: string; reversedAmount?: number };
  refreshCashback: () => void;
  isSmsCenterOpen: boolean;
  setIsSmsCenterOpen: (open: boolean) => void;
}

const defaultAddress: Address = {
  id: 'addr-1',
  fullName: 'Rohit Kumar',
  street: '123, Green Park, Near Metro Station',
  city: 'New Delhi',
  state: 'Delhi',
  pincode: '110016',
  phone: '+91 98765 43210',
  isDefault: true,
};

const initialOrders: Order[] = [
  {
    id: 'SD1234567890',
    userId: 'U10025',
    userEmail: 'rohit.kumar@example.com',
    userName: 'Rohit Kumar',
    date: '27 May 2024, 10:30 AM',
    items: [
      {
        productId: 'prod-samsung-m14',
        productName: 'Samsung Galaxy M14 5G (Smoky Teal, 6GB RAM, 128GB Storage)',
        productImage: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80',
        price: 12490,
        quantity: 1,
        sellerName: 'SmartDeals Direct'
      },
      {
        productId: 'prod-boat-airdopes',
        productName: 'boAt Airdopes 141 Bluetooth TWS Earbuds',
        productImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
        price: 1299,
        quantity: 1,
        sellerName: 'SoundWave Hub'
      }
    ],
    mrpTotal: 22489,
    discountTotal: 8700,
    deliveryTotal: 0,
    couponDiscount: 200,
    smartCoinsUsed: 230,
    smartCoinsValue: 23,
    smartCoinsEarned: 155,
    finalAmount: 13566,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    status: 'Shipped',
    expectedDelivery: 'Tomorrow, by 2:00 PM',
    trackingId: 'TRK-DELHIVERY-9842',
    deliveryPartner: 'Delhivery Surface Air',
    shippingAddress: defaultAddress,
    timeline: [
      { title: 'Order Confirmed', date: '27 May, 10:30 AM', completed: true, description: 'Order confirmed with SmartDeals Assured Seller.' },
      { title: 'Packed', date: '27 May, 03:15 PM', completed: true, description: 'Item verified and packed with tamper-proof seal.' },
      { title: 'Shipped', date: '28 May, 08:00 AM', completed: true, description: 'In transit from Okhla Logistics Center.' },
      { title: 'Out for Delivery', date: 'Expected Tomorrow', completed: false, description: 'Delivery executive will call before arrival.' },
      { title: 'Delivered', date: 'Expected 29 May', completed: false, description: 'Package handed to customer with OTP verification.' }
    ]
  }
];

const initialTransactions: SmartCoinsTransaction[] = [
  { id: 'tx-1', date: '27 May 2024', type: 'redeemed', amount: 230, reason: 'Used on Order #SD1234567890', orderId: 'SD1234567890' },
  { id: 'tx-2', date: '24 May 2024', type: 'earned', amount: 120, reason: 'Purchase reward for Samsung Galaxy M14 5G' },
  { id: 'tx-3', date: '20 May 2024', type: 'earned', amount: 50, reason: 'Referral Bonus: Friend signed up' },
  { id: 'tx-4', date: '15 May 2024', type: 'earned', amount: 15, reason: 'Verified Product Review' },
  { id: 'tx-5', date: '10 May 2024', type: 'earned', amount: 45, reason: 'Welcome Signup Bonus' }
];

const initialSeller: Seller = {
  id: 'seller-tech-01',
  fullName: 'Jitendra Sharma',
  businessName: 'iTech Retail Ventures Pvt Ltd',
  email: 'seller.support@itechretail.in',
  phone: '+91 98765 11223',
  storeName: 'iTech India Premium',
  gstNumber: '07AAAAA0000A1Z5',
  panNumber: 'ABCDE1234F',
  bankAccount: '918273645012',
  bankIfsc: 'HDFC0001234',
  category: 'Electronics & Mobiles',
  address: 'Shop 42, Nehru Place Commercial Complex, New Delhi 110019',
  kycStatus: 'Approved',
  verified: true,
  joinedDate: '15 Jan 2024',
  totalSales: 125000,
  totalOrders: 156,
  deliveredOrdersCount: 149,
  rating: 4.87,
  commissionTier: 'Standard Tier (12%)',
  salesCountForIncentive: 7 // 7 of 10 completed!
};

const defaultAdminSettings: AdminSettings = {
  coinRedemptionRate: 10, // 10 coins = 1 rupee
  maxCoinsPerOrder: 500,
  baseCommissionPercent: 12,
  incentiveThresholdSales: 10,
  dailyLoginReward: 5,
  reviewReward: 15,
  referralReward: 50
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<TrackedUser | null>(() => {
    return trackingService.getCurrentUser();
  });
  const [isAuthValidating, setIsAuthValidating] = useState<boolean>(true);

  const [guestSession, setGuestSession] = useState<GuestSession>(() => {
    return trackingService.getGuestSession();
  });

  const [role, setRoleState] = useState<Role>(() => {
    const active = trackingService.getCurrentUser();
    if (active?.role === 'ADMIN') return 'ADMIN';
    return (localStorage.getItem('smartdeals_role') as Role) || 'USER';
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('smartdeals_products');
    return saved ? JSON.parse(saved) : mockProducts;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('smartdeals_cart');
    if (saved) return JSON.parse(saved);
    // Initial sample cart item
    return [{ product: mockProducts[0], quantity: 1 }];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('SMART200');
  const [couponDiscount, setCouponDiscount] = useState<number>(200);
  const [useSmartCoins, setUseSmartCoins] = useState<boolean>(false);
  const [coinsToRedeem, setCoinsToRedeem] = useState<number>(0);

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const userKey = currentUser ? `smartdeals_wishlist_${currentUser.id}` : 'smartdeals_wishlist_guest';
    const saved = localStorage.getItem(userKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return currentUser?.id === 'U10025' ? ['prod-apple-iphone15', 'prod-hp-pavilion-15', 'prod-boat-airdopes', 'prod-nike-running-shoes'] : [];
  });

  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>(() => {
    const userKey = currentUser ? `smartdeals_alerts_${currentUser.id}` : 'smartdeals_alerts_guest';
    const saved = localStorage.getItem(userKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return currentUser?.id === 'U10025' ? [
      {
        id: 'alert-1',
        productId: 'prod-samsung-m14',
        productName: 'Samsung Galaxy M14 5G (Smoky Teal, 6GB RAM)',
        productImage: mockProducts[0].image,
        currentPrice: 12490,
        targetPrice: 11999,
        createdDate: '28 May 2024',
        active: true,
        notifyVia: ['in-app', 'email']
      }
    ] : [];
  });

  const [allOrders, setAllOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('smartdeals_orders');
    if (saved) {
      try {
        const parsed: Order[] = JSON.parse(saved);
        return parsed.map(o => o.id === 'SD1234567890' && !o.userId ? { ...o, userId: 'U10025', userEmail: 'rohit.kumar@example.com', userName: 'Rohit Kumar' } : o);
      } catch {
        return initialOrders;
      }
    }
    return initialOrders;
  });

  // User Data Isolation:
  // - Admin sees all orders from all users across the platform
  // - Logged-in regular user sees ONLY their own orders
  // - Guest sees only their own guest-session orders
  const visibleOrders = useMemo(() => {
    if (role === 'ADMIN' || currentUser?.role === 'ADMIN') {
      return allOrders;
    }
    if (currentUser) {
      return allOrders.filter(o => o.userId === currentUser.id || o.userEmail === currentUser.email);
    }
    const currentGuestId = guestSession?.sessionId;
    return allOrders.filter(o => o.userId === ('guest_' + currentGuestId));
  }, [allOrders, role, currentUser, guestSession]);

  const [smartCoinsBalance, setSmartCoinsBalance] = useState<number>(0);

  const [smartCoinsTransactions, setSmartCoinsTransactions] = useState<SmartCoinsTransaction[]>(() => {
    const saved = localStorage.getItem('smartdeals_coin_txs');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [seller, setSeller] = useState<Seller>(() => {
    const saved = localStorage.getItem('smartdeals_seller');
    return saved ? JSON.parse(saved) : initialSeller;
  });

  const [commissionSlabs, setCommissionSlabs] = useState<CommissionSlab[]>(() => {
    const saved = localStorage.getItem('smartdeals_slabs');
    return saved ? JSON.parse(saved) : initialCommissionSlabs;
  });

  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
    const saved = localStorage.getItem('smartdeals_admin_settings');
    return saved ? JSON.parse(saved) : defaultAdminSettings;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isSmsCenterOpen, setIsSmsCenterOpen] = useState(false);
  const [lastClaimDate, setLastClaimDate] = useState<string>(() => {
    return localStorage.getItem('smartdeals_last_claim') || '';
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('smartdeals_dark_mode');
    if (saved !== null) return saved === 'true';
    return true;
  });

  const [activeTheme, setActiveThemeState] = useState<ThemeId>(() => {
    const saved = localStorage.getItem('smartdeals_active_theme') as ThemeId | null;
    if (saved && (saved in THEME_BG_MAP)) {
      return saved === 'cyber-emerald' ? 'aurora-jade' : saved;
    }
    return 'steel-navy';
  });

  const [customBg, setCustomBgState] = useState<string>(() => {
    const savedBg = localStorage.getItem('smartdeals_custom_bg');
    const savedTheme = (localStorage.getItem('smartdeals_active_theme') as ThemeId) || 'steel-navy';
    // Purge any legacy black background or white background values
    if (savedBg && savedBg !== '#070709' && savedBg !== '#030a0d' && savedBg !== '#000000' && savedBg !== '#0d0d08' && savedBg !== '#ffffff' && savedBg !== '#FFFFFF') {
      return savedBg;
    }
    return getThemeDefaultBg(savedTheme);
  });
  const [isBgModalOpen, setIsBgModalOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('smartdeals_active_theme', activeTheme);
    const bg = getThemeDefaultBg(activeTheme);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', activeTheme);
      document.body.classList.remove(
        'theme-cyber-neon',
        'theme-royal-gold',
        'theme-cyber-emerald',
        'theme-steel-navy',
        'theme-matrix-lime',
        'theme-sunset-coral',
        'theme-aurora-jade',
        'theme-cyber-indigo',
        'theme-pure-white'
      );
      document.body.classList.add(`theme-${activeTheme}`);
      if (activeTheme === 'pure-white' || bg === '#f8fafd' || bg === '#ffffff') {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('text-slate-100');
        document.body.classList.add('text-slate-900');
      } else {
        document.documentElement.classList.add('dark');
        document.body.classList.remove('text-slate-900');
        document.body.classList.add('text-slate-100');
      }
      document.documentElement.style.setProperty('--smartdeal-bg', bg);
      document.body.style.backgroundColor = bg;
      document.documentElement.style.backgroundColor = bg;
    }
  }, [activeTheme]);

  const setActiveTheme = (theme: ThemeId) => {
    const normalizedTheme = theme === 'cyber-emerald' ? 'aurora-jade' : theme;
    setActiveThemeState(normalizedTheme);
    const bg = getThemeDefaultBg(normalizedTheme);
    setCustomBgState(bg);
    localStorage.setItem('smartdeals_active_theme', normalizedTheme);
    localStorage.setItem('smartdeals_custom_bg', bg);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', normalizedTheme);
      document.body.classList.remove(
        'theme-cyber-neon',
        'theme-royal-gold',
        'theme-cyber-emerald',
        'theme-steel-navy',
        'theme-matrix-lime',
        'theme-sunset-coral',
        'theme-aurora-jade',
        'theme-cyber-indigo',
        'theme-pure-white'
      );
      document.body.classList.add(`theme-${normalizedTheme}`);
      if (normalizedTheme === 'pure-white' || bg === '#f8fafd' || bg === '#ffffff') {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('text-slate-100');
        document.body.classList.add('text-slate-900');
      } else {
        document.documentElement.classList.add('dark');
        document.body.classList.remove('text-slate-900');
        document.body.classList.add('text-slate-100');
      }
      document.documentElement.style.setProperty('--smartdeal-bg', bg);
      document.body.style.backgroundColor = bg;
      document.documentElement.style.backgroundColor = bg;
    }
  };

  const toggleTheme = () => {
    const currentIndex = THEME_CYCLE_ORDER.indexOf(activeTheme);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % THEME_CYCLE_ORDER.length;
    setActiveTheme(THEME_CYCLE_ORDER[nextIndex]);
  };

  useEffect(() => {
    if (customBg) {
      localStorage.setItem('smartdeals_custom_bg', customBg);
      if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty('--smartdeal-bg', customBg);
        document.body.style.backgroundColor = customBg;
        document.documentElement.style.backgroundColor = customBg;
        const lower = customBg.toLowerCase();
        if (lower === '#ffffff' || lower === '#f8fafd' || lower === '#f8fafc' || lower === '#faf7f2') {
          document.documentElement.classList.remove('dark');
          document.body.classList.remove('text-slate-100');
          document.body.classList.add('text-slate-900');
        }
      }
    }
  }, [customBg]);

  const setCustomBg = (color: string) => {
    setCustomBgState(color);
    localStorage.setItem('smartdeals_custom_bg', color);
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--smartdeal-bg', color);
      document.body.style.backgroundColor = color;
      document.documentElement.style.backgroundColor = color;
    }
    const lower = color.toLowerCase();
    if (lower === '#0b1a30' || lower === '#112240') {
      setActiveThemeState('steel-navy');
      localStorage.setItem('smartdeals_active_theme', 'steel-navy');
      if (typeof document !== 'undefined') document.documentElement.setAttribute('data-theme', 'steel-navy');
    } else if (lower === '#111612' || lower === '#172219') {
      setActiveThemeState('matrix-lime');
      localStorage.setItem('smartdeals_active_theme', 'matrix-lime');
      if (typeof document !== 'undefined') document.documentElement.setAttribute('data-theme', 'matrix-lime');
    } else if (lower === '#1c0b29' || lower === '#28113b') {
      setActiveThemeState('sunset-coral');
      localStorage.setItem('smartdeals_active_theme', 'sunset-coral');
      if (typeof document !== 'undefined') document.documentElement.setAttribute('data-theme', 'sunset-coral');
    } else if (lower === '#051f15' || lower === '#092e20' || lower === '#031926') {
      setActiveThemeState('aurora-jade');
      localStorage.setItem('smartdeals_active_theme', 'aurora-jade');
      if (typeof document !== 'undefined') document.documentElement.setAttribute('data-theme', 'aurora-jade');
    } else if (lower === '#181107' || lower === '#241a0b' || lower === '#070709') {
      setActiveThemeState('royal-gold');
      localStorage.setItem('smartdeals_active_theme', 'royal-gold');
      if (typeof document !== 'undefined') document.documentElement.setAttribute('data-theme', 'royal-gold');
    } else if (lower === '#08092d' || lower === '#0f1248') {
      setActiveThemeState('cyber-indigo');
      localStorage.setItem('smartdeals_active_theme', 'cyber-indigo');
      if (typeof document !== 'undefined') document.documentElement.setAttribute('data-theme', 'cyber-indigo');
    } else if (lower === '#f8fafd' || lower === '#ffffff' || lower === '#f8fafc' || lower === '#faf7f2') {
      setActiveThemeState('pure-white');
      localStorage.setItem('smartdeals_active_theme', 'pure-white');
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', 'pure-white');
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('text-slate-100');
        document.body.classList.add('text-slate-900');
      }
    }
  };

  const resetCustomBg = () => {
    const defaultColor = getThemeDefaultBg(activeTheme);
    setCustomBgState(defaultColor);
  };

  useEffect(() => {
    localStorage.setItem('smartdeals_dark_mode', isDarkMode.toString());
    if (typeof document !== 'undefined') {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('smartdeals_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('smartdeals_cart', JSON.stringify(cart));
  }, [cart]);

  // User-scoped Wishlist & Price Alerts: each user only sees their own!
  useEffect(() => {
    const userWishlistKey = currentUser ? `smartdeals_wishlist_${currentUser.id}` : 'smartdeals_wishlist_guest';
    const savedWishlist = localStorage.getItem(userWishlistKey);
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch {
        setWishlist([]);
      }
    } else {
      setWishlist(currentUser?.id === 'U10025' ? ['prod-apple-iphone15', 'prod-hp-pavilion-15', 'prod-boat-airdopes', 'prod-nike-running-shoes'] : []);
    }

    const userAlertsKey = currentUser ? `smartdeals_alerts_${currentUser.id}` : 'smartdeals_alerts_guest';
    const savedAlerts = localStorage.getItem(userAlertsKey);
    if (savedAlerts) {
      try {
        setPriceAlerts(JSON.parse(savedAlerts));
      } catch {
        setPriceAlerts([]);
      }
    } else {
      setPriceAlerts(currentUser?.id === 'U10025' ? [
        {
          id: 'alert-1',
          productId: 'prod-samsung-m14',
          productName: 'Samsung Galaxy M14 5G (Smoky Teal, 6GB RAM)',
          productImage: mockProducts[0].image,
          currentPrice: 12490,
          targetPrice: 11999,
          createdDate: '28 May 2024',
          active: true,
          notifyVia: ['in-app', 'email']
        }
      ] : []);
    }
  }, [currentUser]);

  useEffect(() => {
    const userWishlistKey = currentUser ? `smartdeals_wishlist_${currentUser.id}` : 'smartdeals_wishlist_guest';
    localStorage.setItem(userWishlistKey, JSON.stringify(wishlist));
  }, [wishlist, currentUser]);

  useEffect(() => {
    const userAlertsKey = currentUser ? `smartdeals_alerts_${currentUser.id}` : 'smartdeals_alerts_guest';
    localStorage.setItem(userAlertsKey, JSON.stringify(priceAlerts));
  }, [priceAlerts, currentUser]);

  useEffect(() => {
    localStorage.setItem('smartdeals_orders', JSON.stringify(allOrders));
  }, [allOrders]);

  const [cashbackWallet, setCashbackWallet] = useState<CashbackWallet>(() => {
    return trackingService.getCashbackWallet(currentUser?.id);
  });

  const refreshCashback = () => {
    const updated = trackingService.getCashbackWallet(currentUser?.id);
    setCashbackWallet(updated);
  };

  useEffect(() => {
    refreshCashback();
  }, [currentUser]);

  const redeemCashback = (amount: number, method: string = 'UPI', accountDetails: string = 'user@okaxis') => {
    if (!currentUser?.id) {
      return { success: false, message: 'Please sign in to redeem cashback' };
    }
    const res = trackingService.redeemCashback(currentUser.id, amount, method, accountDetails);
    if (res.success) {
      refreshCashback();
    }
    return res;
  };

  const processReturnReversal = (orderRef: string, reason: string) => {
    const res = trackingService.processReturnAndReversal({ orderRef, reason });
    if (res.success) {
      refreshCashback();
    }
    return res;
  };

  useEffect(() => {
    localStorage.setItem('smartdeals_coins', smartCoinsBalance.toString());
  }, [smartCoinsBalance]);

  useEffect(() => {
    localStorage.setItem('smartdeals_coin_txs', JSON.stringify(smartCoinsTransactions));
  }, [smartCoinsTransactions]);

  useEffect(() => {
    localStorage.setItem('smartdeals_seller', JSON.stringify(seller));
  }, [seller]);

  useEffect(() => {
    localStorage.setItem('smartdeals_products', JSON.stringify(products));
  }, [products]);

  // Validate session on app initialization
  useEffect(() => {
    let isMounted = true;
    trackingService.validateSession()
      .then(user => {
        if (isMounted) {
          setCurrentUser(user);
          if (user?.role === 'ADMIN') {
            setRoleState('ADMIN');
            localStorage.setItem('smartdeals_role', 'ADMIN');
          } else if (!user) {
            setRoleState('USER');
            localStorage.setItem('smartdeals_role', 'USER');
          }
          setIsAuthValidating(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsAuthValidating(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync with local REST API server if reachable
  useEffect(() => {
    fetch('http://localhost:3001/api/products')
      .then(res => res.json())
      .then(data => {
        if (data && data.success) {
          console.info(`[SmartDeals REST API] Connected. Synced ${data.count} catalog items from backend.`);
        }
      })
      .catch(() => {
        // Offline / standalone mode: seamless local state fallback
      });
  }, []);

  const setRole = (newRole: Role) => {
    if (newRole === 'ADMIN') {
      if (currentUser?.role === 'ADMIN') {
        setRoleState('ADMIN');
        localStorage.setItem('smartdeals_role', 'ADMIN');
      } else {
        console.warn('[SmartDeals Security] Unauthorized attempt to switch to ADMIN role blocked.');
      }
    } else {
      setRoleState('USER');
      localStorage.setItem('smartdeals_role', 'USER');
    }
  };

  const loginUser = async (email: string, password: string) => {
    const res = await trackingService.authenticateUser(email, password);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      if (res.user.role === 'ADMIN') {
        setRoleState('ADMIN');
        localStorage.setItem('smartdeals_role', 'ADMIN');
      } else {
        setRoleState('USER');
        localStorage.setItem('smartdeals_role', 'USER');
      }
    }
    return res;
  };

  const loginWithGoogle = async (credential?: string, email?: string, name?: string) => {
    const res = await trackingService.loginWithGoogle(credential, email, name);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      if (res.user.role === 'ADMIN') {
        setRoleState('ADMIN');
        localStorage.setItem('smartdeals_role', 'ADMIN');
      } else {
        setRoleState('USER');
        localStorage.setItem('smartdeals_role', 'USER');
      }
    }
    return res;
  };

  const registerUser = async (name: string, email: string, phone: string, password: string) => {
    const res = await trackingService.registerUser(name, email, phone, password);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      setRoleState('USER');
      localStorage.setItem('smartdeals_role', 'USER');
    }
    return res;
  };

  const logoutUser = async () => {
    await trackingService.logoutUser();
    setCurrentUser(null);
    setRoleState('USER');
    localStorage.setItem('smartdeals_role', 'USER');
    sessionStorage.removeItem('smartdeal_admin_authenticated');
  };

  const trackActivity = (
    actionType: ActivityActionType,
    details: Record<string, any>,
    productId?: string,
    productName?: string,
    category?: string
  ) => {
    trackingService.logActivity(actionType, details, productId, productName, category);
  };

  const trackOutboundClick = (
    productId: string,
    productName: string,
    category: string,
    marketplace: string,
    price: number,
    exactUrl: string
  ) => {
    return trackingService.recordOutboundClick(productId, productName, category, marketplace, price, exactUrl);
  };

  const addToCart = (product: Product, quantity = 1, selectedSellerPrice?: MarketplacePrice) => {
    setCart(prev => {
      const existing = prev.find(
        item => item.product.id === product.id &&
                (!selectedSellerPrice || item.selectedSellerPrice?.sellerName === selectedSellerPrice?.sellerName)
      );
      if (existing) {
        return prev.map(item =>
          item === existing
            ? { ...item, quantity: item.quantity + quantity, selectedSellerPrice: selectedSellerPrice || item.selectedSellerPrice }
            : item
        );
      }
      return [...prev, { product, quantity, selectedSellerPrice }];
    });
  };

  const removeFromCart = (productId: string, sellerName?: string) => {
    setCart(prev => prev.filter(item => {
      if (item.product.id !== productId) return true;
      if (sellerName && item.selectedSellerPrice?.sellerName !== sellerName) return true;
      return false;
    }));
  };

  const updateCartQuantity = (productId: string, quantity: number, sellerName?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, sellerName);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.product.id === productId && (!sellerName || item.selectedSellerPrice?.sellerName === sellerName)) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyCoupon = (code: string) => {
    const upper = code.trim().toUpperCase();
    if (upper === 'SMART200') {
      setAppliedCoupon('SMART200');
      setCouponDiscount(200);
      return { success: true, message: 'Coupon applied! ₹200 savings added.' };
    }
    if (upper === 'DEAL500') {
      setAppliedCoupon('DEAL500');
      setCouponDiscount(500);
      return { success: true, message: 'Mega Coupon applied! ₹500 off.' };
    }
    if (upper === 'WELCOME50') {
      setAppliedCoupon('WELCOME50');
      setCouponDiscount(50);
      return { success: true, message: 'Welcome coupon applied! ₹50 savings added.' };
    }
    return { success: false, message: 'Invalid or expired coupon code. Try SMART200 or DEAL500' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const addPriceAlert = (productId: string, targetPrice: number, notifyVia: ('in-app' | 'email' | 'sms')[] = ['in-app', 'email']) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;
    const newAlert: PriceAlert = {
      id: `alert-${Date.now()}`,
      productId,
      productName: prod.name,
      productImage: prod.image,
      currentPrice: prod.sellingPrice,
      targetPrice,
      createdDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      active: true,
      notifyVia
    };
    setPriceAlerts(prev => [newAlert, ...prev.filter(a => a.productId !== productId)]);
  };

  const removePriceAlert = (alertId: string) => {
    setPriceAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  // Cart Calculations
  const mrpTotal = cart.reduce((sum, item) => sum + item.product.mrp * item.quantity, 0);
  const sellingPriceTotal = cart.reduce((sum, item) => {
    const p = item.selectedSellerPrice ? item.selectedSellerPrice.finalPrice : item.product.sellingPrice;
    return sum + p * item.quantity;
  }, 0);
  const deliveryTotal = sellingPriceTotal > 999 || sellingPriceTotal === 0 ? 0 : 49;
  
  // Coins system disabled per request: zeroed out cleanly
  const coinsEarned = 0;
  const effectiveCoinsToRedeem = 0;
  const smartCoinsDiscount = 0;

  const finalPayable = Math.max(0, sellingPriceTotal + deliveryTotal - couponDiscount);
  const totalSavings = Math.max(0, mrpTotal - finalPayable);

  const placeOrder = (
    paymentMethod: 'UPI' | 'Credit / Debit Card' | 'Net Banking' | 'Cash on Delivery',
    shippingAddress: Address = defaultAddress
  ): Order => {
    const orderId = `SD${Date.now().toString().slice(-8)}`;
    const newOrder: Order = {
      id: orderId,
      userId: currentUser?.id || ('guest_' + (guestSession?.sessionId || 'guest')),
      userEmail: currentUser?.email || 'guest@smartdeal.com',
      userName: currentUser?.name || shippingAddress.fullName || 'Shopper',
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.image,
        price: item.selectedSellerPrice ? item.selectedSellerPrice.finalPrice : item.product.sellingPrice,
        quantity: item.quantity,
        sellerName: item.selectedSellerPrice ? item.selectedSellerPrice.sellerName : item.product.seller
      })),
      mrpTotal,
      discountTotal: mrpTotal - sellingPriceTotal,
      deliveryTotal,
      couponDiscount,
      smartCoinsUsed: effectiveCoinsToRedeem,
      smartCoinsValue: smartCoinsDiscount,
      smartCoinsEarned: coinsEarned,
      finalAmount: finalPayable,
      paymentMethod,
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      status: 'Confirmed',
      expectedDelivery: 'Tomorrow, by 6:00 PM',
      trackingId: `TRK-SMART-${Math.floor(100000 + Math.random() * 900000)}`,
      deliveryPartner: 'SmartDeals Express Assured',
      shippingAddress,
      timeline: [
        { title: 'Order Confirmed', date: 'Just now', completed: true, description: 'Order confirmed and inventory locked.' },
        { title: 'Packed', date: 'In progress', completed: false, description: 'Quality verification and tamper-proof packing.' },
        { title: 'Shipped', date: 'Pending', completed: false, description: 'Handover to courier partner.' },
        { title: 'Out for Delivery', date: 'Expected Tomorrow', completed: false, description: 'Dispatched for doorstep delivery.' },
        { title: 'Delivered', date: 'Expected Tomorrow', completed: false, description: 'Delivery completed upon OTP confirmation.' }
      ]
    };

    // Update wallet
    let newBalance = smartCoinsBalance;
    const newTransactions: SmartCoinsTransaction[] = [...smartCoinsTransactions];

    if (effectiveCoinsToRedeem > 0) {
      newBalance -= effectiveCoinsToRedeem;
      newTransactions.unshift({
        id: `tx-${Date.now()}-redeem`,
        date: 'Today',
        type: 'redeemed',
        amount: effectiveCoinsToRedeem,
        reason: `Redeemed on Order #${orderId}`,
        orderId
      });
    }

    if (coinsEarned > 0) {
      newBalance += coinsEarned;
      newTransactions.unshift({
        id: `tx-${Date.now()}-earn`,
        date: 'Today',
        type: 'earned',
        amount: coinsEarned,
        reason: `Cashback earned on Order #${orderId}`,
        orderId
      });
    }

    setSmartCoinsBalance(newBalance);
    setSmartCoinsTransactions(newTransactions);
    setAllOrders(prev => [newOrder, ...prev]);

    // Update seller incentive progress
    setSeller(prev => {
      const nextSales = prev.salesCountForIncentive + 1;
      const willUnlockFree = nextSales >= 10;
      return {
        ...prev,
        totalOrders: prev.totalOrders + 1,
        totalSales: prev.totalSales + finalPayable,
        salesCountForIncentive: willUnlockFree ? 0 : nextSales
      };
    });

    // Sync order to REST server if available
    fetch('http://localhost:3001/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    }).catch(() => {});

    clearCart();
    return newOrder;
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const canClaimDaily = lastClaimDate !== todayStr;

  const claimDailyCoins = () => {
    if (!canClaimDaily) {
      return { success: false, message: 'You have already claimed today’s daily login reward. Come back tomorrow!' };
    }
    const reward = adminSettings.dailyLoginReward;
    setSmartCoinsBalance(prev => prev + reward);
    setSmartCoinsTransactions(prev => [
      {
        id: `tx-${Date.now()}-daily`,
        date: 'Today',
        type: 'earned',
        amount: reward,
        reason: 'Daily Login Reward streak bonus'
      },
      ...prev
    ]);
    setLastClaimDate(todayStr);
    localStorage.setItem('smartdeals_last_claim', todayStr);

    // Sync claim to backend REST server
    fetch('http://localhost:3001/api/smartcoins/claim', { method: 'POST' }).catch(() => {});

    return { success: true, message: `Congratulations! +${reward} SmartCoins added to your wallet!` };
  };

  const addProduct = (newProdData: Omit<Product, 'id' | 'dealScore' | 'dealScoreBreakdown' | 'fakeDiscountAudit' | 'buyNowRecommendation' | 'priceHistory' | 'marketplacePrices'>) => {
    const id = `prod-seller-${Date.now()}`;
    const calculatedDealScore = Math.min(96, Math.max(70, Math.floor(80 + Math.random() * 15)));
    
    const newProduct: Product = {
      ...newProdData,
      id,
      dealScore: calculatedDealScore,
      dealScoreBreakdown: {
        priceAdvantage: 90,
        historicalPrice: 85,
        offerQuality: 88,
        sellerReliability: 92,
        delivery: 90,
        transparency: 94,
        overallScore: calculatedDealScore,
        verdict: calculatedDealScore > 90 ? 'Excellent Deal' : 'Good Deal'
      },
      fakeDiscountAudit: {
        isGenuine: true,
        status: 'Genuine Deal',
        reason: 'Seller listing verified against brand invoice catalogue.',
        lowestPriceEver: newProdData.sellingPrice,
        highestPriceEver: newProdData.mrp
      },
      buyNowRecommendation: {
        action: 'BUY NOW',
        confidence: 88,
        reason: 'Competitive new seller listing with prompt dispatch guarantee.'
      },
      priceHistory: [
        { date: 'Initial Listing', price: newProdData.sellingPrice }
      ],
      marketplacePrices: [
        {
          sellerName: newProdData.seller,
          isSmartDealsSeller: true,
          price: newProdData.sellingPrice,
          deliveryCharge: newProdData.deliveryCharge,
          deliveryDate: newProdData.deliveryDate,
          couponText: '₹100 Store Off',
          couponDiscount: 100,
          finalPrice: newProdData.sellingPrice - 100,
          smartCoins: newProdData.smartCoinsEarned,
          dealScore: calculatedDealScore,
          inStock: newProdData.stock > 0,
          rating: 4.8,
          tag: 'Best Overall'
        }
      ]
    };

    setProducts(prev => [newProduct, ...prev]);

    // Sync new product to backend REST server
    fetch('http://localhost:3001/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    }).catch(() => {});
  };

  const updateSellerKYC = (status: 'Approved' | 'Pending' | 'Rejected') => {
    setSeller(prev => ({
      ...prev,
      kycStatus: status,
      verified: status === 'Approved'
    }));
  };

  const updateCommissionSlab = (index: number, newRate: number) => {
    setCommissionSlabs(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], commissionRate: newRate };

      // Sync updated slabs to backend REST server
      fetch('http://localhost:3001/api/seller/commission-slabs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(copy)
      }).catch(() => {});

      return copy;
    });
  };

  const updateAdminSettings = (newSettings: Partial<AdminSettings>) => {
    setAdminSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        guestSession,
        isAuthValidating,
        loginUser,
        loginWithGoogle,
        registerUser,
        logoutUser,
        trackActivity,
        trackOutboundClick,
        products,
        addProduct,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        appliedCoupon,
        couponDiscount,
        applyCoupon,
        removeCoupon,
        useSmartCoins,
        setUseSmartCoins,
        coinsToRedeem,
        setCoinsToRedeem,
        cartCalculations: {
          mrpTotal,
          sellingPriceTotal,
          deliveryTotal,
          couponDiscount,
          smartCoinsDiscount,
          finalPayable,
          totalSavings,
          coinsEarned
        },
        wishlist,
        toggleWishlist,
        priceAlerts,
        addPriceAlert,
        removePriceAlert,
        orders: visibleOrders,
        allOrders,
        placeOrder,
        smartCoinsBalance,
        smartCoinsTransactions,
        claimDailyCoins,
        canClaimDaily,
        seller,
        updateSellerKYC,
        commissionSlabs,
        updateCommissionSlab,
        adminSettings,
        updateAdminSettings,
        searchQuery,
        setSearchQuery,
        isAiAssistantOpen,
        setIsAiAssistantOpen,
        isDarkMode,
        toggleDarkMode,
        activeTheme,
        setActiveTheme,
        toggleTheme,
        customBg,
        setCustomBg,
        resetCustomBg,
        isBgModalOpen,
        setIsBgModalOpen,
        cashbackWallet,
        cashbackTransactions: cashbackWallet.transactions,
        redeemCashback,
        processReturnReversal,
        refreshCashback,
        isSmsCenterOpen,
        setIsSmsCenterOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
