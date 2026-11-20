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
  const { cart, setIsAiAssistantOpen, activeTheme } = useApp();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const isActive = (path: string) => location.pathname === path;

  const activeColorClass = activeTheme === 'royal-gold'
    ? 'text-amber-400'
    : 'text-teal-300';

  return (
    <div className={`sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t px-2 py-2 flex items-center justify-around shadow-2xl transition-colors ${
      activeTheme === 'royal-gold'
        ? 'dark:bg-[#181107]/95 dark:border-amber-900/80'
        : 'dark:bg-[#031926]/95 dark:border-teal-900/80'
    }`}>
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
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
          activeTheme === 'royal-gold'
            ? 'bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 text-slate-950 shadow-amber-500/30'
            : 'bg-gradient-to-tr from-teal-400 via-cyan-400 to-emerald-400 text-slate-950 shadow-teal-500/30'
        }`}>
          <Sparkles className={`w-5 h-5 ${activeTheme === 'royal-gold' ? 'text-slate-950' : 'text-slate-950'}`} />
        </div>
        <span className={activeTheme === 'royal-gold' ? 'text-amber-400' : 'text-teal-300'}>AI Deal</span>
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
          <span className={`absolute -top-1 right-1 w-4 h-4 rounded-full text-[9px] font-extrabold flex items-center justify-center ${
            activeTheme === 'royal-gold'
              ? 'bg-amber-400 text-slate-950'
              : 'bg-teal-400 text-slate-950'
          }`}>
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
