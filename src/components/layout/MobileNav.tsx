import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Tag,
  Layers,
  Heart,
  User
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const location = useLocation();
  const { wishlist } = useApp();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Deals', path: '/deals', icon: Tag },
    { name: 'Compare', path: '/compare', icon: Layers },
    { name: 'Wishlist', path: '/wishlist', icon: Heart, badge: wishlist.length },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0b1329]/95 backdrop-blur-xl border-t border-slate-200/90 dark:border-slate-800 px-3 py-2 flex items-center justify-around shadow-2xl transition-colors">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);

        return (
          <Link
            key={item.name}
            to={item.path}
            className={`relative flex flex-col items-center gap-1 text-[10px] transition-colors py-0.5 px-2 ${
              active
                ? 'text-blue-600 dark:text-blue-400 font-black'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5]' : 'stroke-2'}`} />
              {typeof item.badge === 'number' && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[14px] h-[14px] px-1 rounded-full bg-rose-500 text-white text-[8px] font-black flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};
