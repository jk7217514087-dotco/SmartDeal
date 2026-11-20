import React from 'react';

interface Props {
  storeName: string;
  sizeClass?: string;
  className?: string;
}

export const MarketplaceLogo: React.FC<Props> = ({
  storeName,
  sizeClass = 'w-10 h-10',
  className = ''
}) => {
  const name = (storeName || '').toLowerCase();

  // Flipkart: Yellow squircle with blue 'f' shopping icon
  if (name.includes('flipkart')) {
    return (
      <div
        className={`${sizeClass} rounded-2xl bg-[#FFE11B] flex items-center justify-center shrink-0 shadow-xs border border-amber-200/60 overflow-hidden ${className}`}
        title="Flipkart"
      >
        <svg viewBox="0 0 100 100" className="w-7 h-7" fill="none">
          {/* Blue Flipkart stylized 'f' */}
          <path
            d="M58 20C47 20 40 27 40 38V48H28V60H40V82H54V60H68L70 48H54V38C54 34 56 31 62 31H70V20H58Z"
            fill="#2874F0"
          />
          <circle cx="28" cy="46" r="3" fill="#2874F0" />
          <circle cx="72" cy="46" r="3" fill="#2874F0" />
        </svg>
      </div>
    );
  }

  // Meesho: Vibrant Magenta/Pink squircle with white cursive 'm'
  if (name.includes('meesho')) {
    return (
      <div
        className={`${sizeClass} rounded-2xl bg-[#9B1750] flex flex-col items-center justify-center shrink-0 shadow-xs border border-pink-700/50 text-white ${className}`}
        title="Meesho"
      >
        <svg viewBox="0 0 100 100" className="w-7 h-7" fill="currentColor">
          <path d="M26 68V36C26 33.8 27.8 32 30 32C32.2 32 34 33.8 34 36V56C34 57.1 34.9 58 36 58C37.1 58 38 57.1 38 56V36C38 33.8 39.8 32 42 32C44.2 32 46 33.8 46 36V56C46 57.1 46.9 58 48 58C49.1 58 50 57.1 50 56V36C50 33.8 51.8 32 54 32C56.2 32 58 33.8 58 36V68H50V46C50 44.9 49.1 44 48 44C46.9 44 46 44.9 46 46V68H38V46C38 44.9 37.1 44 36 44C34.9 44 34 44.9 34 46V68H26Z" />
          <text x="50" y="85" textAnchor="middle" fontSize="16" fontWeight="bold" fill="white" letterSpacing="-0.5">
            meesho
          </text>
        </svg>
      </div>
    );
  }

  // Amazon: Dark charcoal squircle with clean white 'a' and golden curve
  if (name.includes('amazon')) {
    return (
      <div
        className={`${sizeClass} rounded-2xl bg-[#131921] flex flex-col items-center justify-center shrink-0 shadow-xs border border-slate-700/80 p-1 ${className}`}
        title="Amazon"
      >
        <span className="text-white font-black text-lg leading-none tracking-tighter">a</span>
        <svg viewBox="0 0 40 12" className="w-5 h-2 -mt-0.5" fill="none">
          <path
            d="M2 3C10 9 26 9 36 3"
            stroke="#FF9900"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path d="M33 2L37 3.5L34 6" fill="#FF9900" />
        </svg>
      </div>
    );
  }

  // Myntra: Vibrant pink/orange stylized overlapping 'M'
  if (name.includes('myntra')) {
    return (
      <div
        className={`${sizeClass} rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-xs border border-pink-200/80 p-1 ${className}`}
        title="Myntra"
      >
        <svg viewBox="0 0 100 100" className="w-7 h-7">
          <defs>
            <linearGradient id="myntra-grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF3F6C" />
              <stop offset="100%" stopColor="#FF7A00" />
            </linearGradient>
            <linearGradient id="myntra-grad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF7A00" />
              <stop offset="100%" stopColor="#FF3F6C" />
            </linearGradient>
          </defs>
          <path
            d="M25 75L38 42L48 58L42 75H25Z"
            fill="url(#myntra-grad1)"
          />
          <path
            d="M48 58L58 42L71 75H54L48 58Z"
            fill="url(#myntra-grad2)"
          />
          <path
            d="M38 42C42 32 46 32 50 38C54 32 58 32 62 42L58 42L48 58L38 42Z"
            fill="#FF3F6C"
            opacity="0.9"
          />
        </svg>
      </div>
    );
  }

  // AJIO: Clean white squircle with black uppercase AJIO
  if (name.includes('ajio')) {
    return (
      <div
        className={`${sizeClass} rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-xs border border-slate-300 ${className}`}
        title="AJIO"
      >
        <span className="text-slate-950 font-black text-xs tracking-wider">AJIO</span>
      </div>
    );
  }

  // Tata CLiQ: Dark squircle with TATA CLiQ text
  if (name.includes('tata') || name.includes('cliq')) {
    return (
      <div
        className={`${sizeClass} rounded-2xl bg-[#1e1e24] flex flex-col items-center justify-center shrink-0 shadow-xs border border-slate-700 text-white p-0.5 ${className}`}
        title="Tata CLiQ"
      >
        <span className="text-[8px] font-bold text-slate-400 tracking-widest leading-none">TATA</span>
        <span className="text-[10px] font-black text-white tracking-tight leading-none">CLiQ</span>
      </div>
    );
  }

  // Croma: Dark teal squircle with cyan Croma logo
  if (name.includes('croma')) {
    return (
      <div
        className={`${sizeClass} rounded-2xl bg-[#002d28] flex items-center justify-center shrink-0 shadow-xs border border-teal-800 text-[#00e9bf] ${className}`}
        title="Croma"
      >
        <svg viewBox="0 0 100 100" className="w-6 h-6" fill="none">
          <circle cx="50" cy="50" r="32" stroke="#00e9bf" strokeWidth="12" />
          <circle cx="68" cy="32" r="8" fill="#00e9bf" />
        </svg>
      </div>
    );
  }

  // Reliance Digital: Vibrant red squircle with white RD
  if (name.includes('reliance')) {
    return (
      <div
        className={`${sizeClass} rounded-2xl bg-[#E11900] flex flex-col items-center justify-center shrink-0 shadow-xs border border-red-700 text-white ${className}`}
        title="Reliance Digital"
      >
        <span className="text-[11px] font-black tracking-tight leading-none">reliance</span>
        <span className="text-[8px] font-bold tracking-widest leading-none opacity-90">digital</span>
      </div>
    );
  }

  // Generic fallback
  return (
    <div
      className={`${sizeClass} rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs ${className}`}
    >
      {(storeName || 'ST').slice(0, 2).toUpperCase()}
    </div>
  );
};
