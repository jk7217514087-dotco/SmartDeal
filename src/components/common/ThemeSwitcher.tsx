import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Check, Sparkles, Sliders, ChevronDown } from 'lucide-react';

interface ThemeSwitcherProps {
  variant?: 'header' | 'admin' | 'full' | 'compact';
  className?: string;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  variant = 'header',
  className = ''
}) => {
  const { activeTheme, setActiveTheme, toggleTheme } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const isCroma = activeTheme === 'croma' || activeTheme === 'steel-navy' || activeTheme === 'pure-white';
  const isBlackWhite = activeTheme === 'black-white';

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // FULL / SETTINGS CARD VIEW (For Profile and Settings Pages)
  if (variant === 'full') {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Website Theme Mode
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select between Croma electronics store theme and pure Black & White minimalist design.
            </p>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            Active: {isCroma ? 'Croma Mode' : 'Black & White'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* THEME 1: CROMA */}
          <button
            type="button"
            onClick={() => setActiveTheme('croma')}
            className={`p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden group cursor-pointer ${
              isCroma
                ? 'bg-white border-[#00AEEF] shadow-lg shadow-[#00AEEF]/20'
                : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00AEEF] to-[#0095CC] flex items-center justify-center text-white font-black text-xs shadow-md shadow-[#00AEEF]/30">
                  CR
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>Croma Mode</span>
                    {isCroma && (
                      <span className="w-2 h-2 rounded-full bg-[#00AEEF] animate-pulse" />
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Inspired by croma.com
                  </div>
                </div>
              </div>
              {isCroma && (
                <div className="w-6 h-6 rounded-full bg-[#00AEEF] text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
              Clean white & light grey layout with signature Croma Cyan (#00AEEF) buttons and Red (#E31837) deal highlights.
            </p>

            {/* Color Swatches */}
            <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="w-4 h-4 rounded-full bg-[#FFFFFF] border border-slate-300 shadow-xs" title="White #FFFFFF" />
              <span className="w-4 h-4 rounded-full bg-[#F4F5F7] border border-slate-300 shadow-xs" title="Light Grey #F4F5F7" />
              <span className="w-4 h-4 rounded-full bg-[#00AEEF] shadow-xs" title="Cyan Blue #00AEEF" />
              <span className="w-4 h-4 rounded-full bg-[#0095CC] shadow-xs" title="Dark Blue #0095CC" />
              <span className="w-4 h-4 rounded-full bg-[#E31837] shadow-xs" title="Red Accent #E31837" />
              <span className="w-4 h-4 rounded-full bg-[#171717] shadow-xs" title="Charcoal Black #171717" />
            </div>
          </button>

          {/* THEME 2: BLACK & WHITE */}
          <button
            type="button"
            onClick={() => setActiveTheme('black-white')}
            className={`p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden group cursor-pointer ${
              isBlackWhite
                ? 'bg-black text-white border-white shadow-xl shadow-black/80'
                : 'bg-black/90 text-white border-white/30 hover:border-white/70'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center font-black text-xs border border-white">
                  BW
                </div>
                <div>
                  <div className="text-sm font-black text-white flex items-center gap-1.5">
                    <span>Pure Black & White</span>
                    {isBlackWhite && (
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    )}
                  </div>
                  <div className="text-[10px] text-white/70">
                    High-Contrast Monochrome
                  </div>
                </div>
              </div>
              {isBlackWhite && (
                <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </div>

            <p className="text-xs text-white/90 mb-3 leading-relaxed">
              Strictly TWO COLORS ONLY: #000000 and #FFFFFF. Brutalist monochrome elegance, zero color distraction.
            </p>

            {/* Color Swatches */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/20">
              <span className="w-5 h-5 rounded-full bg-black border-2 border-white shadow-xs" title="Pure Black #000000" />
              <span className="w-5 h-5 rounded-full bg-white border border-black shadow-xs" title="Pure White #FFFFFF" />
              <span className="text-[10px] font-mono text-white/80 uppercase tracking-widest pl-1">
                Strictly 2 Colors
              </span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // HEADER & COMPACT TOGGLE PILL VIEW
  return (
    <div className={`relative inline-flex items-center ${className}`} ref={popoverRef}>
      {/* 1-Click Toggle Button with Dropdown Trigger */}
      <div className="flex items-center rounded-xl sm:rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-0.5 bg-white/90 dark:bg-slate-900/90 shadow-sm">
        <button
          type="button"
          onClick={toggleTheme}
          className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer active:scale-95 ${
            isCroma
              ? 'bg-[#00AEEF] text-white shadow-xs hover:bg-[#0095CC]'
              : 'bg-white text-black border border-white hover:bg-white/90 font-mono'
          }`}
          title={`Currently active: ${isCroma ? 'Croma Mode' : 'Black & White Mode'}. Click to switch theme!`}
          aria-label="Toggle Website Theme Mode"
        >
          {isCroma ? (
            <>
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="hidden sm:inline">Croma</span>
              <span className="sm:hidden">CR</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
              <span className="hidden sm:inline font-mono">B&W</span>
              <span className="sm:hidden font-mono">BW</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 sm:p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
          title="Choose Theme Mode"
          aria-label="Open Theme Selector"
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-3 z-50 animate-fadeIn space-y-2">
          <div className="px-2 py-1 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              Select Theme Mode
            </span>
            <span className="text-[10px] font-bold text-slate-400">
              2 Modes
            </span>
          </div>

          {/* Option 1: Croma */}
          <button
            type="button"
            onClick={() => {
              setActiveTheme('croma');
              setIsOpen(false);
            }}
            className={`w-full p-2.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
              isCroma
                ? 'bg-slate-50 border-[#00AEEF] ring-2 ring-[#00AEEF]/20'
                : 'hover:bg-slate-50 dark:hover:bg-slate-800 border-transparent'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00AEEF] to-[#0095CC] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                CR
              </div>
              <div>
                <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Croma Theme</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#E31837] text-white font-bold">
                    Official
                  </span>
                </div>
                <div className="text-[10px] text-slate-500">
                  White • Cyan (#00AEEF) • Red (#E31837)
                </div>
              </div>
            </div>
            {isCroma && (
              <div className="w-5 h-5 rounded-full bg-[#00AEEF] text-white flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            )}
          </button>

          {/* Option 2: Black & White */}
          <button
            type="button"
            onClick={() => {
              setActiveTheme('black-white');
              setIsOpen(false);
            }}
            className={`w-full p-2.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
              isBlackWhite
                ? 'bg-black text-white border-white ring-2 ring-white/30'
                : 'bg-black/95 text-white hover:bg-black border-transparent'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center font-black text-xs shrink-0 border border-white">
                BW
              </div>
              <div>
                <div className="text-xs font-black text-white flex items-center gap-1.5">
                  <span>Black & White Theme</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-white text-black font-mono font-bold">
                    Pure
                  </span>
                </div>
                <div className="text-[10px] text-white/70 font-mono">
                  Strictly 2 Colors: #000000 & #FFFFFF
                </div>
              </div>
            </div>
            {isBlackWhite && (
              <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
export default ThemeSwitcher;
