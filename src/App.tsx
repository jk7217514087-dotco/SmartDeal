import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { UserLayout } from './components/layout/UserLayout';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminRouteGuard } from './components/admin/AdminRouteGuard';
import { ScrollController } from './components/common/ScrollController';
import { LiveSmsToast } from './components/common/LiveSmsToast';
import { SmsAlertCenterModal } from './components/common/SmsAlertCenterModal';

// Public & Customer Pages
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { PriceComparisonPage } from './pages/PriceComparisonPage';
import { DealIntelligencePage } from './pages/DealIntelligencePage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { OrdersPage } from './pages/OrdersPage';
import { WishlistPage } from './pages/WishlistPage';
import { PriceAlertsPage } from './pages/PriceAlertsPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import { BecomeSellerPage } from './pages/BecomeSellerPage';
import { SellerDashboardPage } from './pages/SellerDashboardPage';
import { SupportPage } from './pages/SupportPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { TermsPage, PrivacyPage } from './pages/LegalPages';
import { ProductVsProductPage } from './pages/ProductVsProductPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { ExternalTrackingPage } from './pages/ExternalTrackingPage';
import { UIUXFlowchartPage } from './pages/UIUXFlowchartPage';
import { DealsPage } from './pages/DealsPage';
import { CouponsPage } from './pages/CouponsPage';
import { PriceTrackerPage } from './pages/PriceTrackerPage';
import { MarketplacesPage } from './pages/MarketplacesPage';
import { SearchPage } from './pages/SearchPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ProductReturnsPage } from './pages/ProductReturnsPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

function AppContent() {
  const { isSmsCenterOpen, setIsSmsCenterOpen, role, currentUser } = useApp();

  // Guarantee smooth rotating loader visibility (1.2s) on phone screen, laptop window or slow internet
  React.useEffect(() => {
    const startTime = (window as unknown as { __smartdeal_start_time?: number }).__smartdeal_start_time || Date.now();
    const elapsed = Date.now() - startTime;
    const minSplashDuration = 1200; // 1.2s full rotation minimum
    const remaining = Math.max(0, minSplashDuration - elapsed);

    const timer = setTimeout(() => {
      const splash = document.getElementById('smartdeal-splash-screen');
      if (splash) {
        splash.style.transition = 'opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1), transform 0.45s ease';
        splash.style.opacity = '0';
        splash.style.transform = 'scale(1.02)';
        splash.style.pointerEvents = 'none';
        setTimeout(() => {
          if (splash && splash.parentNode) {
            splash.parentNode.removeChild(splash);
          }
        }, 500);
      }
    }, remaining);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <ScrollController />
      <Routes>
        {/* ======================================================== */}
        {/* 1. DEDICATED ADMIN LOGIN (Completely outside user layout) */}
        {/* ======================================================== */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* ======================================================== */}
        {/* 2. PROTECTED ADMIN DASHBOARD (RBAC Guard + AdminLayout)  */}
        {/* ======================================================== */}
        <Route
          path="/admin"
          element={
            <AdminRouteGuard>
              <AdminLayout />
            </AdminRouteGuard>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminDashboardPage />} />
          <Route path="guests" element={<AdminDashboardPage />} />
          <Route path="guest-sessions" element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminDashboardPage />} />
          <Route path="product-activity" element={<AdminDashboardPage />} />
          <Route path="categories" element={<AdminDashboardPage />} />
          <Route path="all-category" element={<AdminDashboardPage />} />
          <Route path="all-data" element={<AdminDashboardPage />} />
          <Route path="marketplaces" element={<AdminDashboardPage />} />
          <Route path="commissions" element={<AdminDashboardPage />} />
          <Route path="conversions" element={<AdminDashboardPage />} />
          <Route path="clicks" element={<AdminDashboardPage />} />
          <Route path="outbound-clicks" element={<AdminDashboardPage />} />
          <Route path="orders" element={<AdminDashboardPage />} />
          <Route path="analytics" element={<AdminDashboardPage />} />
          <Route path="price-intelligence" element={<AdminDashboardPage />} />
          <Route path="database" element={<AdminDashboardPage />} />
          <Route path="searches" element={<AdminDashboardPage />} />
          <Route path="search-analytics" element={<AdminDashboardPage />} />
          <Route path="comparisons" element={<AdminDashboardPage />} />
          <Route path="settings" element={<AdminDashboardPage />} />
          <Route path="activity-logs" element={<AdminDashboardPage />} />
          <Route path="audit-logs" element={<AdminDashboardPage />} />
          <Route path="reports" element={<AdminDashboardPage />} />
          <Route path="sellers" element={<AdminDashboardPage />} />
          <Route path="kyc" element={<AdminDashboardPage />} />
          <Route path="cashback" element={<AdminDashboardPage />} />
          <Route path="external-purchases" element={<ExternalTrackingPage />} />
          <Route path="*" element={<AdminDashboardPage />} />
        </Route>

        {/* ======================================================== */}
        {/* 3. NORMAL PUBLIC CUSTOMER WEBSITE (UserLayout)          */}
        {/* ======================================================== */}
        <Route element={<UserLayout />}>
          {/* Main Discovery Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<CategoryPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/coupons" element={<CouponsPage />} />
          <Route path="/price-tracker" element={<PriceTrackerPage />} />
          <Route path="/marketplaces" element={<MarketplacesPage />} />

          {/* Product Details & Comparisons */}
          <Route path="/product/prod-boat-airdopes" element={<Navigate to="/" replace />} />
          <Route path="/product/slug/prod-boat-airdopes" element={<Navigate to="/" replace />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/product/slug/:id" element={<ProductDetailPage />} />
          <Route path="/compare" element={<PriceComparisonPage />} />
          <Route path="/compare/:id" element={<PriceComparisonPage />} />
          <Route path="/product-vs-product" element={<ProductVsProductPage />} />
          <Route path="/compare-ai" element={<ProductVsProductPage />} />

          {/* Customer Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Customer Profile & Activity (Scoped to user's own data) */}
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/account" element={<UserProfilePage />} />
          <Route path="/account/profile" element={<UserProfilePage />} />
          <Route path="/account/wishlist" element={<WishlistPage />} />
          <Route path="/account/recently-viewed" element={<UserProfilePage />} />
          <Route path="/account/search-history" element={<UserProfilePage />} />
          <Route path="/account/comparisons" element={<UserProfilePage />} />
          <Route path="/account/price-alerts" element={<PriceAlertsPage />} />
          <Route path="/account/notifications" element={<NotificationsPage />} />
          <Route path="/account/privacy" element={<UserProfilePage />} />
          <Route path="/account/security" element={<UserProfilePage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/price-alerts" element={<PriceAlertsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />

          {/* Customer Orders & Checkout */}
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/tracking/:id" element={<OrderTrackingPage />} />
          <Route path="/tracking" element={<OrderTrackingPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />

          {/* Seller Flow */}
          <Route path="/become-seller" element={<BecomeSellerPage />} />
          <Route path="/seller/register" element={<BecomeSellerPage />} />
          <Route path="/seller/dashboard" element={<SellerDashboardPage />} />
          <Route path="/seller/products" element={<SellerDashboardPage />} />
          <Route path="/seller/add-product" element={<SellerDashboardPage />} />
          <Route path="/seller/orders" element={<SellerDashboardPage />} />
          <Route path="/seller/earnings" element={<SellerDashboardPage />} />
          <Route path="/seller/commission" element={<SellerDashboardPage />} />
          <Route path="/seller/analytics" element={<SellerDashboardPage />} />

          {/* Company & Support */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/help" element={<SupportPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/returns" element={<ProductReturnsPage />} />
          <Route path="/product-return" element={<ProductReturnsPage />} />
          <Route path="/return-policy" element={<ProductReturnsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />

          {/* AI Intelligence */}
          <Route path="/ai-assistant" element={<AIAssistantPage />} />
          <Route path="/assistant" element={<AIAssistantPage />} />
          <Route path="/deal-intelligence/:id" element={<DealIntelligencePage />} />
          <Route path="/deal-intelligence" element={<DealIntelligencePage />} />
          <Route path="/fake-discount-detector/:id" element={<DealIntelligencePage />} />
          <Route path="/fake-discount-detector" element={<DealIntelligencePage />} />
          <Route path="/buy-or-wait/:id" element={<DealIntelligencePage />} />
          <Route path="/buy-or-wait" element={<DealIntelligencePage />} />
          <Route path="/flowchart" element={<UIUXFlowchartPage />} />
          <Route path="/architecture" element={<UIUXFlowchartPage />} />
          <Route path="/uiux-flowchart" element={<UIUXFlowchartPage />} />

          {/* 404 Catch-All */}
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>

      {/* Admin Emergency SMS Alerts Center (Mounted only for verified admin sessions) */}
      {(role === 'ADMIN' && currentUser?.role === 'ADMIN' && sessionStorage.getItem('smartdeal_admin_authenticated') === 'true') && (
        <>
          <LiveSmsToast onOpenCenter={() => setIsSmsCenterOpen(true)} />
          <SmsAlertCenterModal isOpen={isSmsCenterOpen} onClose={() => setIsSmsCenterOpen(false)} />
        </>
      )}
    </Router>
  );
}

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
