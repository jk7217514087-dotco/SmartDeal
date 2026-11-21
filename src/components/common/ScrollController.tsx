import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollController: React.FC = () => {
  const location = useLocation();
  const [scrollProgress, setScrollProgress] = useState<number>(0);
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
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  return (
    <>
      {/* Route Navigation Fast Feedback Loader Bar */}
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 h-[3px] z-[99999] pointer-events-none overflow-hidden bg-brand-500/20">
          <div className="h-full w-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 shadow-md shadow-brand-500/50 animate-pulse" />
        </div>
      )}

      {/* Top illuminated reading/scroll progress indicator */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-slate-200/40 dark:bg-slate-800/40 z-50 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-brand-600 via-indigo-500 to-purple-600 shadow-sm shadow-brand-500/50 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </>
  );
};
