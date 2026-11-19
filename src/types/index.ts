export type Role = 'USER' | 'SELLER' | 'ADMIN';

export interface DealScoreBreakdown {
  priceAdvantage: number;
  historicalPrice: number;
  offerQuality: number;
  sellerReliability: number;
  delivery: number;
  transparency: number;
  overallScore: number;
  verdict: 'Excellent Deal' | 'Good Deal' | 'Average Deal' | 'Poor Deal' | 'Superb Genuine Deal';
}

export interface MarketplacePrice {
  sellerName: string;
  isSmartDealsSeller: boolean;
  isSmartDealsDirect?: boolean;
  logo?: string;
  price: number;
  deliveryCharge: number;
  deliveryDate: string;
  couponText?: string;
  couponDiscount?: number;
  finalPrice: number;
  smartCoins: number;
  dealScore: number;
  inStock: boolean;
  rating: number;
  url?: string;
  tag?: 'Cheapest' | 'Best Value' | 'Fastest Delivery' | 'Best Overall' | 'Best Deal' | 'Store Warranty' | 'Lowest Price';
  cashbackAmount?: number;
  discountPercent?: number;
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
  event?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  images: string[];
  mrp: number;
  sellingPrice: number;
  discountPercent: number;
  rating: number;
  reviewsCount: number;
  seller: string;
  sellerRating: number;
  deliveryDate: string;
  deliveryCharge: number;
  smartCoinsEarned: number;
  dealScore: number;
  dealScoreBreakdown: DealScoreBreakdown;
  isSmartDealsChoice?: boolean;
  stock: number;
  returnDays: number;
  warranty: string;
  description: string;
  features: string[];
  specs: Record<string, string>;
  priceHistory: PriceHistoryPoint[];
  buyNowRecommendation: {
    action: 'BUY NOW' | 'WAIT';
    confidence: number;
    reason: string;
    expectedLow?: number;
  };
  fakeDiscountAudit: {
    isGenuine: boolean;
    status: 'Genuine Deal' | 'Possible Inflated MRP';
    reason: string;
    lowestPriceEver: number;
    highestPriceEver: number;
  };
  marketplacePrices: MarketplacePrice[];
  alternatives?: {
    id: string;
    name: string;
    reason: string;
    price: number;
    tag: 'Best Budget' | 'Best Performance' | 'Best Value' | 'Best Overall';
  }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSellerPrice?: MarketplacePrice;
}

export interface Address {
  id: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  sellerName: string;
}

export interface Order {
  id: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  date: string;
  items: OrderItem[];
  mrpTotal: number;
  discountTotal: number;
  deliveryTotal: number;
  couponDiscount: number;
  smartCoinsUsed: number;
  smartCoinsValue: number;
  smartCoinsEarned: number;
  finalAmount: number;
  paymentMethod: 'UPI' | 'Credit / Debit Card' | 'Net Banking' | 'Cash on Delivery';
  paymentStatus: 'Paid' | 'Pending';
  status: 'Confirmed' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  expectedDelivery: string;
  trackingId: string;
  deliveryPartner: string;
  shippingAddress: Address;
  timeline: {
    title: string;
    date: string;
    completed: boolean;
    description: string;
  }[];
}

export interface SmartCoinsTransaction {
  id: string;
  date: string;
  type: 'earned' | 'redeemed';
  amount: number;
  reason: string;
  orderId?: string;
  expiryDate?: string;
}

export interface PriceAlert {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  currentPrice: number;
  targetPrice: number;
  createdDate: string;
  active: boolean;
  notifyVia: ('in-app' | 'email' | 'sms')[];
}

export interface Seller {
  id: string;
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  storeName: string;
  gstNumber: string;
  panNumber: string;
  bankAccount: string;
  bankIfsc: string;
  category: string;
  address: string;
  kycStatus: 'Approved' | 'Pending' | 'Rejected';
  verified: boolean;
  joinedDate: string;
  totalSales: number;
  totalOrders: number;
  deliveredOrdersCount: number;
  rating: number;
  commissionTier: string;
  salesCountForIncentive: number; // e.g. 7 out of 10
}

export interface CommissionSlab {
  minAmount: number;
  maxAmount: number;
  tierName: string;
  commissionRate: number; // percentage
  discountPercent: number;
  description: string;
}

export interface AdminSettings {
  coinRedemptionRate: number; // 10 coins = 1 rupee
  maxCoinsPerOrder: number; // 500
  baseCommissionPercent: number; // 12%
  incentiveThresholdSales: number; // 10 eligible sales = 0% next sale
  dailyLoginReward: number; // 5 coins
  reviewReward: number; // 15 coins
  referralReward: number; // 50 coins
}

// -------------------------------------------------------------
// SMARTDEAL USER DATA, GUEST TRACKING & COMMISSION SYSTEM TYPES
// -------------------------------------------------------------

export type ActivityActionType =
  | 'LOGIN'
  | 'LOGOUT'
  | 'SEARCH'
  | 'SEARCH_PRODUCT'
  | 'VIEW_PRODUCT'
  | 'COMPARE_PRICES'
  | 'COMPARE_PRODUCT'
  | 'SELECT_MARKETPLACE'
  | 'CLICK_BUY'
  | 'BUY_PRODUCT_CLICK'
  | 'CLICK_PROCEED'
  | 'PROCEED_CLICK'
  | 'REDIRECT_EXTERNAL'
  | 'WISHLIST_ADD'
  | 'WISHLIST_REMOVE';

export interface TrackedUser {
  id: string; // e.g. U10025
  user_id: string; // alias for id
  name: string;
  email: string;
  phone?: string;
  passwordHash?: string; // SHA-256 hashed
  password?: string;
  createdAt: string;
  created_at: string; // alias
  lastLoginAt: string;
  last_login: string; // alias
  role: 'USER' | 'ADMIN';
  status: 'ACTIVE' | 'SUSPENDED';
  totalSearches: number;
  totalViews: number;
  totalComparisons: number;
  totalClicks: number;
  totalCommissionEarned: number;
  total_spend: number; // alias for totalCommissionEarned or spend
  total_activities: number; // alias
  lastActivity: string;
}

export interface GuestSession {
  sessionId: string; // e.g. G-8F72A91
  guest_id: string; // alias for sessionId
  firstSeenAt: string;
  first_visit: string; // alias
  lastActivityAt: string;
  last_active: string; // alias
  userAgent?: string;
  device_info: string; // alias
  ip_address: string; // alias
  totalSearches: number;
  totalViews: number;
  totalComparisons: number;
  totalClicks: number;
  outbound_clicks_count: number; // alias
  total_activities: number; // alias
  lastMarketplace?: string;
  last_marketplace?: string; // alias
  lastActivity: string;
  status: 'ACTIVE' | 'EXPIRED';
}

export interface UserActivityLog {
  id: string;
  log_id: string; // alias for id
  actorType: 'USER' | 'GUEST';
  actorId: string; // userId or guestSessionId
  user_id?: string; // alias
  guest_id?: string; // alias
  actorName?: string;
  actionType: ActivityActionType;
  action_type: ActivityActionType; // alias
  description: string;
  timestamp: string;
  productId?: string;
  productName?: string;
  product_name?: string; // alias
  category?: string;
  searchQuery?: string;
  marketplace?: string;
  comparedStores?: string[];
  priceShown?: number;
  clickId?: string;
  exactUrl?: string;
  metadata?: Record<string, unknown>;
  details: Record<string, any>; // alias for details
}

export type CommissionStatus = 'CLICKED' | 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REJECTED';

export interface OutboundClickRecord {
  clickId: string; // e.g. SD-CLICK-12345
  click_id: string; // alias for clickId
  actorType: 'USER' | 'GUEST';
  actorId: string;
  actorName?: string;
  user_identifier: string; // alias
  productId: string;
  productName: string;
  product_name: string; // alias
  category: string;
  marketplace: string;
  priceAtClick: number;
  price_at_click: number; // alias
  affiliateRefId: string;
  affiliate_tag?: string; // alias
  clickedAt: string;
  timestamp: string; // alias
  redirectedAt: string;
  exactProductUrl: string;
  exact_url: string; // alias
  commissionStatus: CommissionStatus;
  commission_status: CommissionStatus; // alias
  commissionRate: number; // percentage (e.g. 5.5)
  commission_rate: number; // alias
  commissionAmount: number; // in INR
  commission_amount: number; // alias
  estimated_commission: number; // alias
  confirmedAt?: string;
  notes?: string;
}

export interface AdminDashboardMetrics {
  totalUsers: number;
  totalRegisteredUsers: number;
  totalGuests: number;
  activeGuestSessions: number;
  todayUsers: number;
  todayGuests: number;
  totalViews: number;
  totalProductViews: number;
  totalComparisons: number;
  totalProductComparisons: number;
  totalClicks: number;
  totalOutboundClicks: number;
  todayClicks: number;
  totalProductsTracked: number;
  totalProductSearches: number;
  pendingCommission: number;
  totalPendingCommissions: number;
  confirmedCommission: number;
  totalConfirmedCommissions: number;
  netPlatformEarnings: number;
  cashbackPending: number;
  cashbackAvailable: number;
  cashbackConfirmed: number;
  cashbackRedeemed: number;
  cashbackReversed: number;
}

// -------------------------------------------------------------
// SMARTDEAL CASHBACK ENGINE & FINANCIAL REVERSAL LEDGER TYPES
// -------------------------------------------------------------

export type CashbackStatus = 'Pending' | 'Confirmed' | 'Available' | 'Redeemed' | 'Reversed';

export type CashbackTxType =
  | 'EARNED_PENDING'
  | 'CONFIRMED'
  | 'AVAILABLE'
  | 'REDEEMED'
  | 'REVERSAL_ADJUSTMENT';

export interface CashbackTransaction {
  id: string; // e.g. CB-TX-10982
  userId: string;
  orderRef: string;
  marketplace: string;
  productName: string;
  amount: number; // in INR (can be negative for reversals or redemptions)
  status: CashbackStatus;
  type: CashbackTxType;
  date: string;
  timestamp: string;
  sourceEventId?: string; // id of click or conversion
  reversalReason?: string;
  idempotencyKey?: string;
}

export interface CashbackWallet {
  availableBalance: number;
  pendingBalance: number;
  totalEarned: number;
  totalRedeemed: number;
  totalReversed: number;
  transactions: CashbackTransaction[];
}

export type ConversionStatus = 'PENDING' | 'CONFIRMED' | 'REVERSED' | 'CANCELLED';

export interface AffiliateConversion {
  id: string; // e.g. CONV-2026-9812
  clickId: string;
  orderRef: string;
  marketplace: string;
  productName: string;
  userId?: string;
  guestId?: string;
  saleAmount: number;
  commissionRate: number; // percentage (e.g. 5.0)
  commissionEarned: number; // e.g. ₹500
  userCashbackAllocation: number; // e.g. ₹100
  smartdealRemaining: number; // e.g. ₹400 = commissionEarned - userCashbackAllocation
  status: ConversionStatus;
  createdAt: string;
  confirmedAt?: string;
  reversedAt?: string;
  reversalReason?: string;
  idempotencyKey: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetEntity: string;
  entityId: string;
  details: Record<string, any>;
  timestamp: string;
  ipAddress?: string;
}

export interface CouponItem {
  id: string;
  code: string;
  store: string;
  discountType: 'FLAT' | 'PERCENTAGE';
  discountValue: number;
  minOrderValue: number;
  description: string;
  expiryDate: string;
  verified: boolean;
  category?: string;
  terms?: string;
}

export type AffiliateApprovalStatus =
  | 'APPROVED'
  | 'PENDING_APPROVAL'
  | 'WRITTEN_APPROVAL_REQUIRED'
  | 'RESTRICTED'
  | 'NOT_APPLIED';

export interface MarketplaceComplianceConfig {
  marketplaceId: string;
  marketplaceName: string;
  domain: string;
  priceTrackingAllowed: boolean;
  priceAlertsAllowed: boolean;
  priceDisplayAllowed: boolean;
  apiAccessAllowed: boolean;
  affiliateApprovalStatus: AffiliateApprovalStatus;
  writtenApprovalObtained: boolean;
  writtenApprovalDate?: string;
  writtenApprovalRef?: string;
  complianceDisclaimer: string;
  policyNotes: string;
  restrictedFeatures: string[];
  lastAuditedDate: string;
}

export interface MarketplacePartner {
  id: string;
  name: string;
  domain: string;
  logo: string;
  tagline: string;
  averageCommission: string;
  cashbackRate: string;
  returnPolicyDays: number;
  affiliateStatus: 'Active Partner' | 'Integrated API' | 'Verified Network';
  categories: string[];
  compliance?: MarketplaceComplianceConfig;
}

