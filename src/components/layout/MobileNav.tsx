import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Home,
  SlidersHorizontal,
  Flame,
  ShoppingCart,
  User,
  Sparkles,
  Layers
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const location = useLocation();
  const { cart, setIsAiAssistantOpen } = useApp();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 px-2 py-2 flex items-center justify-around shadow-lg">
      <Link
        to="/"
        className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
          isActive('/') ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </Link>

      <Link
        to="/categories"
        className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
          isActive('/categories') ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <SlidersHorizontal className="w-5 h-5" />
        <span>Browse</span>
      </Link>

      <Link
        to="/compare"
        className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
          location.pathname.startsWith('/compare') ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Layers className="w-5 h-5" />
        <span>Compare</span>
      </Link>

      <button
        onClick={() => setIsAiAssistantOpen(true)}
        className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 -mt-3"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-brand-500/30">
          <Sparkles className="w-5 h-5 text-amber-300" />
        </div>
        <span>AI Deal</span>
      </button>

      <Link
        to="/cart"
        className={`relative flex flex-col items-center gap-0.5 text-[10px] font-bold ${
          isActive('/cart') ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <ShoppingCart className="w-5 h-5" />
        <span>Cart</span>
        {cartCount > 0 && (
          <span className="absolute -top-1 right-1 w-4 h-4 rounded-full bg-brand-600 text-white text-[9px] font-extrabold flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </Link>

      <Link
        to="/profile"
        className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
          isActive('/profile') ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <User className="w-5 h-5" />
        <span>Account</span>
      </Link>
    </div>
  );
};
