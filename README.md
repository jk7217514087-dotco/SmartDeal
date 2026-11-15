# SmartDeals - Intelligent E-Commerce & Price Comparison Platform

> **“Smart Shopping. Better Deals. Every Time.”**

SmartDeals is a modern e-commerce and price comparison platform that combines an Amazon-style marketplace with transparent cross-marketplace price comparison, an AI-powered Deal Intelligence engine, a SmartCoins loyalty reward system, and a comprehensive seller incentive ecosystem.

---

## 🚀 Key Highlights & Innovations

1. **Dual Platform Architecture**:
   - Works simultaneously as a **Price Comparison Engine** (crawling Amazon, Flipkart, Croma, Tata CLiQ, Reliance Digital) and **SmartDeals Direct Assured Marketplace**.
2. **Real Final Price Engine**:
   - Transparently calculates: `Final Payable Price = Product Price + Delivery Charges - Valid Coupons - Applicable Discounts - SmartCoins Redemption`.
3. **Deal DNA / Deal Score (0–100)**:
   - Evaluates 6 core vectors: Price Advantage, 90-day Historical Price, Offer Quality, Seller Reliability, Delivery Speed, and Price Transparency.
4. **Fake Discount Detector**:
   - Interactive 30-day and 90-day price history graphs detecting artificially inflated retail MRPs with AI verdicts (*“Genuine Deal”* vs *“Possible Inflated MRP”*).
5. **Buy Now or Wait Prediction**:
   - Data-backed guidance calculating price volatility and festive sales forecasting with confidence ratings.
6. **SmartCoins Loyalty System**:
   - Rule: **10 SmartCoins = ₹1** cash redemption value at checkout.
   - Dynamic earning slabs up to 500 SmartCoins per order.
   - Daily login streak bonuses and referral rewards.
7. **Seller 0% Commission Incentive**:
   - For products priced below ₹10,000: Sellers completing 10 delivered orders unlock **0% SmartDeals Commission** on their next eligible order!
8. **Live Commission & Payout Calculator**:
   - Integrated into the *Add Product* seller form to preview real-time platform fees, seller payouts, and subsidized SmartCoins.
9. **Admin Command Center**:
   - Complete platform oversight: GMV metrics, revenue charts, KYC moderation, configurable commission slabs, and SmartCoins monetary controls.
10. **GST Tax Invoice Generator**:
    - Full Indian GST compliant tax invoice generator (`InvoiceModal.tsx`) with CIN, GSTIN `06AABCS9876Q1Z2`, HSN codes (`8517.13`), CGST (9%) + SGST (9%), and 1-click browser `@media print` PDF layout available across Checkout, Tracking, and Orders.
11. **Progressive Web App (PWA) Ready**:
    - Web App Manifest (`manifest.json`) and mobile installability for seamless desktop and mobile home screen experiences.
12. **Flash Deals & Urgency Timer**:
    - Live ticking countdown timer for lightning deals on the home screen.
13. **Backend-Ready Database Schema**:
    - Complete [schema.sql](./schema.sql) covering all 35 relational tables specified in Section 42.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **Charts & Graphs**: Recharts
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```

### 4. Run with Docker & PostgreSQL
```bash
docker compose up --build
```
- SmartDeals Web: [http://localhost:8080](http://localhost:8080)
- PostgreSQL Database: `localhost:5432` (Auto-initialized with `schema.sql`)

---

## 🗺️ Route Directory (48 Pages & Views)

| Route | Description |
| :--- | :--- |
| `/` | Home Page with Hero, Feature Cards, Categories & Deals |
| `/categories` | Category & Product Listing with multi-faceted filters |
| `/product/:id` | Product Details with Gallery, Delivery Estimator, and Specs |
| `/compare` or `/compare/:id` | Dedicated Cross-Marketplace Price Comparison Table |
| `/product-vs-product` | Head-to-Head Product vs Product AI Comparison Engine |
| `/deal-intelligence/:id` | 0–100 Deal DNA & Score Breakdown |
| `/fake-discount-detector/:id` | 90-Day Price History Graph & Inflated MRP Audit |
| `/cart` | Intelligent Cart with SmartCoins Slider & Coupons |
| `/checkout` | 5-Step Checkout with UPI, Cards, Net Banking & COD |
| `/order-confirmation/:id` | Confetti Order Placed Celebration, Coins Rewards & Instant GST Tax Invoice |
| `/tracking/:id` | 5-Step Courier Stepper Timeline, AWB Tracking & Tax Invoice Modal |
| `/orders` | User Order History & 1-Click Tax Invoice Downloads |
| `/wallet` | SmartCoins Rewards Wallet & Transaction Ledger |
| `/wishlist` | Saved Products, Move All to Cart & Aggregate Savings Banner |
| `/price-alerts` | Target Price Threshold Manager & Channel Toggles |
| `/notifications` | Live Price Drop, Order, and Seller Milestone Alerts |
| `/profile` | User Account, Dynamic Delivery Address Manager & 1-Click Role Switcher |
| `/login` & `/register` | Modern Authentication with +45 Coins Welcome Gift |
| `/become-seller` | Merchant Registration & KYC Document Upload |
| `/seller/dashboard` | Seller Metrics, Sales Chart, and 0% Commission Tracker |
| `/seller/add-product` | Add Listing with Real-Time Payout Calculator |
| `/admin/dashboard` | Admin Command Center, GMV, KYC Approvals, and Fee Controls |
| `/admin/database` | Database & Live Analytics Command Center (Dark Dashboard + PostgreSQL Table Explorer) |
| `/support` | Help Center, FAQs Accordion, and Support Channels |
| `/about` | SmartDeals Mission & Anti-Fake Pricing Guarantee |
| `/contact` | Headquarters Info & Support Ticket Submission |
| `/terms` & `/privacy` | Legal Terms and DPDP-Compliant Privacy Policy |

---

## 🧪 Automated Acceptance Test Suite (20/20 Scenarios)
Run the automated test runner to verify financial ledger integrity, idempotency, non-destructive reversals, and decimal-safe calculations:
```bash
npm test
```

---

## 📄 Database Architecture (`schema.sql`)

Includes PostgreSQL/MySQL definitions for 35 tables:
`users`, `roles`, `sellers`, `seller_documents`, `seller_stores`, `products`, `product_images`, `categories`, `platforms`, `prices`, `price_history`, `offers`, `coupons`, `cart`, `cart_items`, `wishlist`, `orders`, `order_items`, `payments`, `addresses`, `delivery`, `reviews`, `ratings`, `smartcoins_wallet`, `smartcoins_transactions`, `price_alerts`, `notifications`, `commissions`, `seller_commission_tiers`, `affiliate_clicks`, `affiliate_conversions`, `analytics`, `campaigns`, `admin_users`, `audit_logs`.

---

© 2026 SmartDeals Inc. All rights reserved.
