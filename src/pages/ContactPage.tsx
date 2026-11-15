import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Order & Delivery Support');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setName('');
      setEmail('');
      setMessage('');
    }, 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Get in Touch with SmartDeals</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Have a question regarding an order, seller registration, or price matching dispute? Our support team responds within 2 business hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl border border-slate-800">
          <div>
            <h3 className="font-extrabold text-lg">Headquarters & Support</h3>
            <p className="text-xs text-slate-400 mt-1">SmartDeals Technologies Private Limited</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white">Registered Address:</strong>
                <span className="text-slate-300">Level 4, SmartDeals Innovation Tower, Nehru Place Commercial Centre, New Delhi, Delhi 110019</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white">Direct Phone:</strong>
                <span className="text-slate-300">+91 11 4987 6543 / 1800-SMART-DEALS</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white">Customer Support Email:</strong>
                <span className="text-slate-300">help@smartdeals.in</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-[11px] text-slate-300 space-y-1">
            <strong>Operating Hours:</strong>
            <div>Mon – Sat: 8:00 AM – 10:00 PM IST</div>
            <div>Sunday: 10:00 AM – 6:00 PM IST</div>
          </div>
        </div>

        {/* Form (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-5">
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Send Us a Message</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">We will generate an instant support ticket for your query</p>
          </div>

          {sent && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Ticket created! Reference #SD-TICKET-8924 sent to your email.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Rohit Kumar"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-semibold focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="rohit@example.com"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-semibold focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Query Category</label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:border-brand-500 focus:outline-none"
              >
                <option>Order & Delivery Support</option>
                <option>SmartCoins Balance or Redemption</option>
                <option>Seller Onboarding & KYC</option>
                <option>Price Comparison Discrepancy</option>
                <option>Corporate & Affiliate Inquiries</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Message / Details</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Please describe your query with order number or product details..."
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-medium focus:border-brand-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-brand-600 dark:hover:bg-brand-500 text-white font-extrabold text-xs flex items-center gap-2 active:scale-95 transition-all shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Message</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
