import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import {
  Bell,
  CheckCircle2,
  TrendingDown,
  Truck,
  ShieldCheck,
  Trash2,
  Check,
  Sparkles
} from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'price' | 'deal' | 'order' | 'seller';
  read: boolean;
}

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Price Drop Alert Triggered!',
      description: 'Samsung Galaxy M14 5G dropped by ₹500 on Flipkart. Now at ₹12,490 (90-day historic low).',
      time: '15 mins ago',
      type: 'price',
      read: false
    },
    {
      id: 'notif-2',
      title: 'Exclusive Deal Verified',
      description: 'Apple MacBook Air M2 dropped to ₹84,990 across verified retail partners.',
      time: '2 hours ago',
      type: 'deal',
      read: false
    },
    {
      id: 'notif-3',
      title: 'Order Dispatched #SD1234567890',
      description: 'Your order is in transit with Delhivery Surface Air. Estimated delivery tomorrow by 2:00 PM.',
      time: 'Yesterday',
      type: 'order',
      read: true
    },
    {
      id: 'notif-4',
      title: '0% Seller Commission Progress Update',
      description: 'You are at 7/10 eligible sales. Complete 3 more sales under ₹10,000 to unlock 0% commission on your next sale!',
      time: '2 days ago',
      type: 'seller',
      read: true
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'unread' | 'price' | 'deal' | 'order'>('all');
  const [showToast, setShowToast] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.3 }
    });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const markSingleAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'price') return n.type === 'price';
    if (filter === 'deal') return n.type === 'deal';
    if (filter === 'order') return n.type === 'order';
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>All notifications marked as read!</span>
        </div>
      )}

      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            <span>Notifications & Alerts</span>
            {unreadCount > 0 && (
              <span className="text-xs font-bold text-brand-600 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 px-2.5 py-0.5 rounded-full border border-brand-200 dark:border-brand-800/60">
                {unreadCount} Unread
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Stay updated with price drops, courier dispatch timelines, and verified deals
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs font-extrabold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-brand-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 text-xs font-bold">
        {[
          { id: 'all', label: `All (${notifications.length})` },
          { id: 'unread', label: `Unread (${unreadCount})` },
          { id: 'price', label: 'Price Alerts' },
          { id: 'deal', label: 'Verified Deals' },
          { id: 'order', label: 'Orders' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              filter === tab.id
                ? 'bg-slate-900 dark:bg-brand-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(n => (
            <div
              key={n.id}
              className={`p-5 rounded-3xl border transition-all flex items-start justify-between gap-4 group ${
                !n.read
                  ? 'bg-white dark:bg-slate-800/90 border-brand-200 dark:border-brand-800/60 shadow-xs'
                  : 'bg-slate-50/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    n.type === 'price'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40'
                      : n.type === 'deal'
                      ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40'
                      : n.type === 'order'
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40'
                      : 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/40'
                  }`}
                >
                  {n.type === 'price' && <TrendingDown className="w-5 h-5" />}
                  {n.type === 'deal' && <Sparkles className="w-5 h-5" />}
                  {n.type === 'order' && <Truck className="w-5 h-5" />}
                  {n.type === 'seller' && <ShieldCheck className="w-5 h-5" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">{n.title}</h3>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-brand-600 dark:bg-brand-400" />}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{n.description}</p>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{n.time}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                {!n.read && (
                  <button
                    onClick={() => markSingleAsRead(n.id)}
                    title="Mark as read"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(n.id)}
                  title="Remove notification"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No notifications in this filter</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              You're all caught up! New price drops and shipping alerts will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
