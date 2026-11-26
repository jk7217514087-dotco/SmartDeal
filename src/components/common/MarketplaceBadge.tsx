import React from 'react';

interface Props {
  storeName?: string;
  className?: string;
  showName?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const MarketplaceBadge: React.FC<Props> = ({
  storeName = 'Store',
  className = '',
  showName = true,
  size = 'sm'
}) => {
  const s = (storeName || '').toLowerCase();

  const iconDim = size === 'lg' ? 'w-5 h-5 text-xs' : size === 'md' ? 'w-4 h-4 text-[11px]' : 'w-3.5 h-3.5 text-[9px]';
  const textDim = size === 'lg' ? 'text-xs' : size === 'md' ? 'text-[11px]' : 'text-[10px]';

  // 1. Flipkart (Yellow squircle with italic blue 'f')
  if (s.includes('flipkart')) {
    return (
      <div
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#2874F0]/10 dark:bg-[#2874F0]/20 border border-[#2874F0]/30 dark:border-[#2874F0]/40 text-[#1a5ec4] dark:text-[#5fa2ff] font-black shrink-0 ${className}`}
        title="Flipkart Verified Offer"
      >
        <div className={`${iconDim} rounded bg-[#FFE11B] flex items-center justify-center shrink-0 shadow-xs border border-[#2874F0]/30`}>
          <span className="text-[#2874F0] font-black italic -mt-0.5">f</span>
        </div>
        {showName && <span className={`${textDim} tracking-tight font-extrabold`}>Flipkart</span>}
      </div>
    );
  }

  // 2. Amazon (Crisp amber/dark squircle with high-contrast text in dark & light modes)
  if (s.includes('amazon')) {
    return (
      <div
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/10 dark:bg-amber-400/15 border border-amber-500/30 dark:border-amber-400/30 text-amber-900 dark:text-amber-300 font-black shrink-0 ${className}`}
        title="Amazon Verified Offer"
      >
        <div className={`${iconDim} rounded bg-[#131921] border border-amber-500/40 flex items-center justify-center shrink-0 shadow-xs`}>
          <span className="text-[#FF9900] font-black lowercase -mt-0.5">a</span>
        </div>
        {showName && <span className={`${textDim} tracking-tight font-extrabold`}>Amazon</span>}
      </div>
    );
  }

  // 3. Meesho (Magenta/pink circle with white 'm')
  if (s.includes('meesho')) {
    return (
      <div
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-pink-50 dark:bg-pink-950/50 border border-pink-200 dark:border-pink-800/60 text-[#d82a7f] dark:text-pink-300 font-black shrink-0 ${className}`}
        title="Meesho Verified Offer"
      >
        <div className={`${iconDim} rounded-full bg-[#f43397] flex items-center justify-center shrink-0 shadow-xs`}>
          <span className="text-white font-black lowercase -mt-0.5">m</span>
        </div>
        {showName && <span className={`${textDim} tracking-tight font-extrabold`}>Meesho</span>}
      </div>
    );
  }

  // 4. Myntra (Gradient squircle with bold white 'M')
  if (s.includes('myntra')) {
    return (
      <div
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 text-[#ff3f6c] dark:text-rose-300 font-black shrink-0 ${className}`}
        title="Myntra Verified Offer"
      >
        <div className={`${iconDim} rounded bg-gradient-to-tr from-[#ff3f6c] via-[#ff527b] to-[#f26a10] flex items-center justify-center shrink-0 shadow-xs`}>
          <span className="text-white font-black leading-none text-[8px]">M</span>
        </div>
        {showName && <span className={`${textDim} tracking-tight font-extrabold`}>Myntra</span>}
      </div>
    );
  }

  // 5. Croma (Teal squircle with dark 'cr')
  if (s.includes('croma')) {
    return (
      <div
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800/60 text-teal-800 dark:text-teal-300 font-black shrink-0 ${className}`}
        title="Croma Verified Offer"
      >
        <div className={`${iconDim} rounded bg-[#00e9bf] flex items-center justify-center shrink-0 shadow-xs`}>
          <span className="text-slate-950 font-black leading-none text-[8px]">cr</span>
        </div>
        {showName && <span className={`${textDim} tracking-tight font-extrabold`}>Croma</span>}
      </div>
    );
  }

  // 6. Reliance Digital (Red squircle with white 'RD')
  if (s.includes('reliance')) {
    return (
      <div
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/60 text-[#e42529] dark:text-red-300 font-black shrink-0 ${className}`}
        title="Reliance Digital Verified Offer"
      >
        <div className={`${iconDim} rounded bg-[#e42529] flex items-center justify-center shrink-0 shadow-xs`}>
          <span className="text-white font-black leading-none text-[8px]">RD</span>
        </div>
        {showName && <span className={`${textDim} tracking-tight font-extrabold`}>Reliance</span>}
      </div>
    );
  }

  // 7. Tata CLiQ (Squircle with white 'T')
  if (s.includes('tata')) {
    return (
      <div
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-black shrink-0 ${className}`}
        title="Tata CLiQ Verified Offer"
      >
        <div className={`${iconDim} rounded bg-black dark:bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 shadow-xs`}>
          <span className="text-white font-black leading-none text-[9px]">T</span>
        </div>
        {showName && <span className={`${textDim} tracking-tight font-extrabold`}>Tata CLiQ</span>}
      </div>
    );
  }

  // 8. AJIO (Navy squircle with white 'AJ')
  if (s.includes('ajio')) {
    return (
      <div
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-black shrink-0 ${className}`}
        title="AJIO Verified Offer"
      >
        <div className={`${iconDim} rounded bg-[#2c4152] flex items-center justify-center shrink-0 shadow-xs`}>
          <span className="text-white font-bold leading-none text-[8px]">AJ</span>
        </div>
        {showName && <span className={`${textDim} tracking-tight font-extrabold`}>AJIO</span>}
      </div>
    );
  }

  // Generic Fallback
  return (
    <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold shrink-0 ${className}`}>
      <div className={`${iconDim} rounded bg-slate-700 dark:bg-slate-600 flex items-center justify-center shrink-0 shadow-xs text-white`}>
        <span className="text-[8px] font-black leading-none">{storeName.slice(0, 1)}</span>
      </div>
      {showName && <span className={`${textDim} tracking-tight font-extrabold`}>{storeName.split(' ')[0]}</span>}
    </div>
  );
};
