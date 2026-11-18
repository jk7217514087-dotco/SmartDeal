import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp, getThemeDefaultBg } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileNav } from './components/layout/MobileNav';
import { AIAssistantModal } from './components/common/AIAssistantModal';
import { QuickDemoBar } from './components/common/QuickDemoBar';
import { GlobalBackButton } from './components/common/GlobalBackButton';
import { ScrollController } from './components/common/ScrollController';
import { LiveSmsToast } from './components/common/LiveSmsToast';
import { SmsAlertCenterModal } from './components/common/SmsAlertCenterModal';
import { InstallAppPrompt } from './components/common/InstallAppPrompt';
import { BackgroundCustomizerModal } from './components/common/BackgroundCustomizerModal';

// Pages
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
import { SmartCoinsWalletPage } from './pages/SmartCoinsWalletPage';
import { WishlistPage } from './pages/WishlistPage';
import { PriceAlertsPage } from './pages/PriceAlertsPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import { BecomeSellerPage } from './pages/BecomeSellerPage';
import { SellerDashboardPage } from './pages/SellerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
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
import { AdminSecurityGuard } from './components/admin/AdminSecurityGuard';

function AppContent() {
  const { isSmsCenterOpen, setIsSmsCenterOpen, role, customBg, activeTheme } = useApp();

  const currentBg = customBg || getThemeDefaultBg(activeTheme);

  return (
    <Router>
      <ScrollController />
      <div 
        className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden text-slate-100 transition-colors duration-200"
        style={{ backgroundColor: currentBg }}
      >
        <Navbar />
          <GlobalBackButton />
          <main className="flex-1 w-full max-w-full overflow-x-hidden pb-16 sm:pb-0">
            <Routes>
              {/* SECTION 3 PUBLIC PAGES */}
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/categories" element={<CategoryPage />} />
              <Route path="/category/:id" element={<CategoryPage />} />
              <Route path="/deals" element={<DealsPage />} />
              <Route path="/coupons" element={<CouponsPage />} />
              <Route path="/price-tracker" element={<PriceTrackerPage />} />
              <Route path="/marketplaces" element={<MarketplacesPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/product/slug/:id" element={<ProductDetailPage />} />
              <Route path="/compare" element={<PriceComparisonPage />} />
              <Route path="/compare/:id" element={<PriceComparisonPage />} />
              <Route path="/product-vs-product" element={<ProductVsProductPage />} />
              <Route path="/compare-ai" element={<ProductVsProductPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/help" element={<SupportPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/returns" element={<ProductReturnsPage />} />
              <Route path="/product-return" element={<ProductReturnsPage />} />
              <Route path="/return-policy" element={<ProductReturnsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              {/* SECTION 3 AUTHENTICATED USER PAGES */}
              <Route path="/profile" element={<UserProfilePage />} />
              <Route path="/account" element={<UserProfilePage />} />
              <Route path="/account/profile" element={<UserProfilePage />} />
              <Route path="/account/wishlist" element={<WishlistPage />} />
              <Route path="/account/recently-viewed" element={<UserProfilePage />} />
              <Route path="/account/search-history" element={<UserProfilePage />} />
              <Route path="/account/comparisons" element={<UserProfilePage />} />
              <Route path="/account/price-alerts" element={<PriceAlertsPage />} />
              <Route path="/account/notifications" element={<NotificationsPage />} />
              <Route path="/account/cashback" element={<UserProfilePage />} />
              <Route path="/account/transactions" element={<UserProfilePage />} />
              <Route path="/account/privacy" element={<UserProfilePage />} />
              <Route path="/account/security" element={<UserProfilePage />} />
              <Route path="/wallet" element={<SmartCoinsWalletPage />} />
              <Route path="/smartcoins" element={<SmartCoinsWalletPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/price-alerts" element={<PriceAlertsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/tracking/:id" element={<OrderTrackingPage />} />
              <Route path="/tracking" element={<OrderTrackingPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />

              {/* SELLER FLOW */}
              <Route path="/become-seller" element={<BecomeSellerPage />} />
              <Route path="/seller/register" element={<BecomeSellerPage />} />
              <Route path="/seller/dashboard" element={<SellerDashboardPage />} />
              <Route path="/seller/products" element={<SellerDashboardPage />} />
              <Route path="/seller/add-product" element={<SellerDashboardPage />} />
              <Route path="/seller/orders" element={<SellerDashboardPage />} />
              <Route path="/seller/earnings" element={<SellerDashboardPage />} />
              <Route path="/seller/commission" element={<SellerDashboardPage />} />
              <Route path="/seller/analytics" element={<SellerDashboardPage />} />

              {/* SECTION 3 ADMIN PAGES */}
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/users" element={<AdminDashboardPage />} />
              <Route path="/admin/guest-sessions" element={<AdminDashboardPage />} />
              <Route path="/admin/guests" element={<AdminDashboardPage />} />
              <Route path="/admin/products" element={<AdminDashboardPage />} />
              <Route path="/admin/categories" element={<AdminDashboardPage />} />
              <Route path="/admin/all-category" element={<AdminDashboardPage />} />
              <Route path="/admin/all-data" element={<AdminDashboardPage />} />
              <Route path="/admin/marketplaces" element={<AdminDashboardPage />} />
              <Route path="/admin/search-analytics" element={<AdminDashboardPage />} />
              <Route path="/admin/product-activity" element={<AdminDashboardPage />} />
              <Route path="/admin/comparisons" element={<AdminDashboardPage />} />
              <Route path="/admin/outbound-clicks" element={<AdminDashboardPage />} />
              <Route path="/admin/conversions" element={<AdminDashboardPage />} />
              <Route path="/admin/commissions" element={<AdminDashboardPage />} />
              <Route path="/admin/cashback" element={<AdminDashboardPage />} />
              <Route path="/admin/coupons" element={<AdminDashboardPage />} />
              <Route path="/admin/notifications" element={<AdminDashboardPage />} />
              <Route path="/admin/reports" element={<AdminDashboardPage />} />
              <Route path="/admin/audit-logs" element={<AdminDashboardPage />} />
              <Route path="/admin/settings" element={<AdminDashboardPage />} />
              <Route path="/admin/sellers" element={<AdminDashboardPage />} />
              <Route path="/admin/kyc" element={<AdminDashboardPage />} />
              <Route path="/admin/analytics" element={<AdminDashboardPage />} />
              <Route path="/admin/database" element={<AdminDashboardPage />} />
              <Route path="/admin/revenue" element={<AdminDashboardPage />} />

              {/* AI & PLATFORM INTELLIGENCE */}
              <Route path="/ai-assistant" element={<AIAssistantPage />} />
              <Route path="/assistant" element={<AIAssistantPage />} />
              <Route path="/deal-intelligence/:id" element={<DealIntelligencePage />} />
              <Route path="/deal-intelligence" element={<DealIntelligencePage />} />
              <Route path="/fake-discount-detector/:id" element={<DealIntelligencePage />} />
              <Route path="/fake-discount-detector" element={<DealIntelligencePage />} />
              <Route path="/buy-or-wait/:id" element={<DealIntelligencePage />} />
              <Route path="/buy-or-wait" element={<DealIntelligencePage />} />
              <Route path="/better-alternatives/:id" element={<ProductDetailPage />} />
              <Route
                path="/external-tracking"
                element={
                  <AdminSecurityGuard>
                    <ExternalTrackingPage />
                  </AdminSecurityGuard>
                }
              />
              <Route path="/flowchart" element={<UIUXFlowchartPage />} />
              <Route path="/architecture" element={<UIUXFlowchartPage />} />
              <Route path="/uiux-flowchart" element={<UIUXFlowchartPage />} />
              <Route
                path="/admin/external-purchases"
                element={
                  <AdminSecurityGuard>
                    <ExternalTrackingPage />
                  </AdminSecurityGuard>
                }
              />
              <Route
                path="/tracking-system"
                element={
                  <AdminSecurityGuard>
                    <ExternalTrackingPage />
                  </AdminSecurityGuard>
                }
              />

              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>
          <Footer />
          <MobileNav />
          <QuickDemoBar />
          <AIAssistantModal />
          <BackgroundCustomizerModal />
          <InstallAppPrompt />
          {role === 'ADMIN' && (
            <>
              <LiveSmsToast onOpenCenter={() => setIsSmsCenterOpen(true)} />
              <SmsAlertCenterModal isOpen={isSmsCenterOpen} onClose={() => setIsSmsCenterOpen(false)} />
            </>
          )}
        </div>
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
