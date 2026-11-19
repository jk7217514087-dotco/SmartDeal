import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronUp, ChevronDown, ArrowDown, ArrowUp } from 'lucide-react';

export const ScrollController: React.FC = () => {
  const location = useLocation();
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [scrollY, setScrollY] = useState<number>(0);
  const [canScroll, setCanScroll] = useState<boolean>(false);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);

  // 1. Auto-scroll to top whenever route/page changes & show transition feedback
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setIsNavigating(true);
    const t = setTimeout(() => setIsNavigating(false), 450);
    return () => clearTimeout(t);
  }, [location.pathname, location.search]);

  // 2. Track scroll position and progress percentage
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (currentScrollY / docHeight) * 100 : 0;

      setScrollY(currentScrollY);
      setScrollProgress(Math.min(100, Math.max(0, progress)));
      setCanScroll(docHeight > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Scroll actions
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  const scrollDownOneScreen = () => {
    window.scrollBy({
      top: window.innerHeight * 0.8,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* Route Navigation Fast Feedback Loader Bar */}
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 h-[3px] z-[99999] pointer-events-none overflow-hidden bg-brand-500/20">
          <div className="h-full w-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 shadow-md shadow-brand-500/50 animate-pulse" />
        </div>
      )}

      {/* Top illuminated reading/scroll progress indicator (Upper se Niche progress) */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-slate-200/40 dark:bg-slate-800/40 z-50 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-brand-600 via-indigo-500 to-purple-600 shadow-sm shadow-brand-500/50 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Scroll Navigation Controllers (Bottom Right) */}
      {canScroll && (
        <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col gap-2 items-end">
          {/* If near top (<25%), show "Scroll Down (Niche Jayein)" button */}
          {scrollProgress < 25 && (
            <button
              onClick={scrollDownOneScreen}
              className="group flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/90 dark:bg-slate-800/95 text-white backdrop-blur-md shadow-xl hover:shadow-brand-500/25 border border-slate-700 hover:border-brand-500 text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer animate-bounce duration-1000"
              title="Niche scroll karein (Scroll Down)"
            >
              <span>Scroll Down</span>
              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-y-0.5 transition-transform">
                <ChevronDown className="w-3.5 h-3.5 text-white" />
              </div>
            </button>
          )}

          {/* Quick Scroll-To-Top button when user has scrolled down */}
          {scrollY > 300 && (
            <button
              onClick={scrollToTop}
              className="group flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/90 dark:bg-slate-800/95 text-white backdrop-blur-md shadow-xl hover:shadow-brand-500/25 border border-slate-700 hover:border-brand-500 text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title="Upar scroll karein (Scroll to Top)"
            >
              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center group-hover:-translate-y-0.5 transition-transform">
                <ChevronUp className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="hidden sm:inline">Top</span>
            </button>
          )}

          {/* Quick Scroll-To-Bottom button when in middle of long page */}
          {scrollY > 300 && scrollProgress < 85 && (
            <button
              onClick={scrollToBottom}
              className="p-2 rounded-xl bg-white/80 dark:bg-slate-850/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 backdrop-blur-md shadow-md border border-slate-200 dark:border-slate-700 hover:border-brand-500 hover:text-brand-600 transition-all hover:scale-105 active:scale-95 cursor-pointer text-xs"
              title="Bottom tak jayein (Scroll to Bottom)"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </>
  );
};
