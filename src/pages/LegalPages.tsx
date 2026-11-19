import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">SmartDeals Terms & Conditions</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Last revised: May 2026 • Governing laws of India</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed shadow-xs">
        <section className="space-y-2">
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">1. Platform Nature & Dual Functionality</h2>
          <p>
            SmartDeals operates simultaneously as an independent cross-marketplace price comparison tool and a curated third-party merchant marketplace. We crawl public retailers (including Amazon, Flipkart, Croma, Tata CLiQ) to present consumers with genuine price comparisons. SmartDeals is not affiliated with nor sponsored by third-party retailers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">2. Real Payable Price Engine & Price Integrity</h2>
          <p>
            We adhere strictly to our Anti-Fake Pricing Guarantee. Product prices, applicable delivery charges, and verified coupons are calculated before final checkout. AI estimations and price drop forecasts represent predictive analyses based on historical trend data and do not constitute financial commitments.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">3. Verified Cashback Program Rules</h2>
          <p>
            Cashback rewards are credited upon verified purchase completion and delivery through partner merchants. Confirmed balances can be withdrawn directly to the user's UPI ID or Indian Bank Account subject to standard verification.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">4. Marketplace Seller Agreement & Commission Slabs</h2>
          <p>
            Sellers listed on SmartDeals Marketplace undergo mandatory KYC verification. Standard commission of 12% applies to items under ₹10,000. Under our Seller Performance Incentive, sellers completing 10 successfully delivered, non-returned orders earn a 0% commission waiver on their subsequent eligible order.
          </p>
        </section>
      </div>
    </div>
  );
};

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Privacy & Data Protection Policy</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Compliant with Digital Personal Data Protection (DPDP) Act</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed shadow-xs">
        <section className="space-y-2">
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">1. Information We Collect</h2>
          <p>
            When you register, place orders, or set price drop alerts, we collect your name, email, delivery address, contact telephone, and device logs. We never store raw debit/credit card CVV credentials or net banking passwords; all transactions are routed through RBI-licensed payment gateways.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">2. Use of Price Alert & Cookie Data</h2>
          <p>
            We use localized device storage to maintain your active cart, wishlist, and target price drop notifications. Price alert parameters are monitored by our background price crawlers solely to trigger timely notifications.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">3. User Rights & Data Deletion</h2>
          <p>
            You retain the right to download your order ledger, review your transaction history, and request permanent deletion of your profile data by writing to privacy@smartdeals.in.
          </p>
        </section>
      </div>
    </div>
  );
};
