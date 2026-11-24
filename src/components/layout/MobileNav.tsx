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

  const activeColorClass = 'text-blue-600 dark:text-blue-400';

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0b1329]/95 backdrop-blur-xl border-t border-slate-200/90 dark:border-slate-800 px-2 py-2 flex items-center justify-around shadow-2xl transition-colors">
      <Link
        to="/"
        className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
          isActive('/') ? activeColorClass : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </Link>

      <Link
        to="/categories"
        className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
          isActive('/categories') ? activeColorClass : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <SlidersHorizontal className="w-5 h-5" />
        <span>Browse</span>
      </Link>

      <Link
        to="/compare"
        className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
          location.pathname.startsWith('/compare') ? activeColorClass : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Layers className="w-5 h-5" />
        <span>Compare</span>
      </Link>

      <button
        onClick={() => setIsAiAssistantOpen(true)}
        className="flex flex-col items-center gap-0.5 text-[10px] font-bold cursor-pointer -mt-3"
      >
        <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="text-blue-600 dark:text-blue-400">AI Deal</span>
      </button>

      <Link
        to="/cart"
        className={`relative flex flex-col items-center gap-0.5 text-[10px] font-bold ${
          isActive('/cart') ? activeColorClass : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <ShoppingCart className="w-5 h-5" />
        <span>Cart</span>
        {cartCount > 0 && (
          <span className="absolute -top-1 right-1 w-4 h-4 rounded-full text-[9px] font-extrabold flex items-center justify-center bg-blue-600 text-white">
            {cartCount}
          </span>
        )}
      </Link>

      <Link
        to="/profile"
        className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
          isActive('/profile') ? activeColorClass : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <User className="w-5 h-5" />
        <span>Account</span>
      </Link>
    </div>
  );
};
