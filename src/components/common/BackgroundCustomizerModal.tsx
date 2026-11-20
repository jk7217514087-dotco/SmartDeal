import React, { useState } from 'react';
import { useApp, ThemeId, getThemeDefaultBg } from '../../context/AppContext';
import { Palette, X, RotateCcw, Check, Sparkles, Moon, Sun } from 'lucide-react';

interface FlagshipThemeDef {
  id: ThemeId;
  name: string;
  subtitle: string;
  color: string;
  cardBg: string;
  accentBorder: string;
  tag: string;
  tagBg: string;
  bannerGradient: string;
  iconBg: string;
  badgeEmoji: string;
}

const FLAGSHIP_THEMES: FlagshipThemeDef[] = [
  {
    id: 'croma',
    name: 'Croma Electronics Theme',
    subtitle: 'Signature White & Cyan (#00AEEF) with Red (#E31837) Deals',
    color: '#FFFFFF',
    cardBg: '#FFFFFF',
    accentBorder: 'border-[#00AEEF]',
    tag: 'Flagship Electronics',
    tagBg: 'bg-[#00AEEF] text-white',
    bannerGradient: 'from-white via-[#F4F5F7] to-[#E5E7EB]',
    iconBg: 'from-[#00AEEF] to-[#0095CC]',
    badgeEmoji: '⚡',
  },
  {
    id: 'black-white',
    name: 'Pure Black & White Theme',
    subtitle: 'Strictly TWO Colors: #000000 and #FFFFFF. Pure Monochrome.',
    color: '#000000',
    cardBg: '#000000',
    accentBorder: 'border-white',
    tag: 'Pure Monochrome',
    tagBg: 'bg-white text-black font-mono',
    bannerGradient: 'from-black via-zinc-950 to-black',
    iconBg: 'from-white to-zinc-300 text-black',
    badgeEmoji: '🖤',
  },
  {
    id: 'steel-navy',
    name: 'Steel Oceanic Navy',
    subtitle: 'Deep Navy & Luminous Sky-Blue Waves (Image 1)',
    color: '#0b1a30',
    cardBg: '#112240',
    accentBorder: 'border-sky-400',
    tag: 'Sky Blue & Navy',
    tagBg: 'bg-sky-400 text-slate-950',
    bannerGradient: 'from-[#071324] via-[#0b1a30] to-[#162f55]',
    iconBg: 'from-sky-400 to-blue-500',
    badgeEmoji: '🌊',
  },
  {
    id: 'matrix-lime',
    name: 'Cyber Matrix Lime',
    subtitle: 'Dark Graphite & Neon Lime Perspective Grid (Image 2)',
    color: '#111612',
    cardBg: '#172219',
    accentBorder: 'border-lime-400',
    tag: 'Neon Lime & Matrix',
    tagBg: 'bg-lime-400 text-slate-950',
    bannerGradient: 'from-[#0d130e] via-[#111612] to-[#1f2b21]',
    iconBg: 'from-lime-300 to-green-500',
    badgeEmoji: '⚡',
  },
  {
    id: 'sunset-coral',
    name: 'Cosmic Sunset Coral',
    subtitle: 'Deep Velvet Berry & Sunset Coral Glow (Image 3)',
    color: '#1c0b29',
    cardBg: '#28113b',
    accentBorder: 'border-rose-400',
    tag: 'Sunset Coral & Berry',
    tagBg: 'bg-rose-500 text-white',
    bannerGradient: 'from-[#14061e] via-[#1c0b29] to-[#3a1555]',
    iconBg: 'from-orange-400 to-rose-500',
    badgeEmoji: '🌅',
  },
  {
    id: 'aurora-jade',
    name: 'Aurora Emerald Jade',
    subtitle: 'Deep Pine & Radiant Emerald Aurora Waves (Image 4)',
    color: '#051f15',
    cardBg: '#092e20',
    accentBorder: 'border-emerald-400',
    tag: 'Aurora Emerald Jade',
    tagBg: 'bg-emerald-400 text-slate-950',
    bannerGradient: 'from-[#03140e] via-[#051f15] to-[#0c3e2b]',
    iconBg: 'from-emerald-400 to-teal-500',
    badgeEmoji: '🌲',
  },
  {
    id: 'royal-gold',
    name: 'Royal Obsidian Gold',
    subtitle: 'Warm Luxury Amber Bronze & 24K Gold Rays (Image 5)',
    color: '#181107',
    cardBg: '#241a0b',
    accentBorder: 'border-amber-400',
    tag: 'Regal 24K Gold',
    tagBg: 'bg-amber-400 text-slate-950',
    bannerGradient: 'from-[#120c04] via-[#181107] to-[#2c1e0c]',
    iconBg: 'from-amber-400 to-yellow-500',
    badgeEmoji: '👑',
  },
  {
    id: 'cyber-indigo',
    name: 'Cyber Cosmic Indigo',
    subtitle: 'Deep Midnight Indigo & Electric Violet Glow (Image 6)',
    color: '#08092d',
    cardBg: '#0f1248',
    accentBorder: 'border-violet-400',
    tag: 'Cosmic Violet',
    tagBg: 'bg-violet-500 text-white',
    bannerGradient: 'from-[#050620] via-[#08092d] to-[#161a60]',
    iconBg: 'from-violet-500 to-indigo-600',
    badgeEmoji: '🔮',
  },
  {
    id: 'pure-white',
    name: 'Pure Minimalist White',
    subtitle: 'Crisp Studio White & Electric Indigo Accents (Buyhatke Style)',
    color: '#f8fafd',
    cardBg: '#ffffff',
    accentBorder: 'border-indigo-500',
    tag: 'Minimalist White',
    tagBg: 'bg-indigo-600 text-white',
    bannerGradient: 'from-[#f8faff] via-[#ffffff] to-[#eef2f9]',
    iconBg: 'from-indigo-600 to-purple-600',
    badgeEmoji: '✨',
  },
];

interface PresetTheme {
  id: string;
  name: string;
  color: string;
  isDark: boolean;
  badge?: string;
}

const PRESET_THEMES: PresetTheme[] = [
  { id: 'steel-navy-p', name: 'Steel Oceanic Navy', color: '#0b1a30', isDark: true, badge: 'Flagship' },
  { id: 'matrix-lime-p', name: 'Cyber Matrix Lime', color: '#111612', isDark: true, badge: 'Neon' },
  { id: 'sunset-coral-p', name: 'Cosmic Sunset Coral', color: '#1c0b29', isDark: true, badge: 'Sunset' },
  { id: 'aurora-jade-p', name: 'Aurora Emerald Jade', color: '#051f15', isDark: true, badge: 'Emerald' },
  { id: 'royal-gold-p', name: 'Royal Obsidian Gold', color: '#181107', isDark: true, badge: '24K Gold' },
  { id: 'cyber-indigo-p', name: 'Cyber Cosmic Indigo', color: '#08092d', isDark: true, badge: 'Violet' },
  { id: 'pure-white-p', name: 'Pure Minimalist White', color: '#f8fafd', isDark: false, badge: 'Buyhatke' },
  { id: 'midnight-sapphire', name: 'Midnight Sapphire', color: '#0a0f1d', isDark: true },
  { id: 'deep-navy', name: 'Deep Oceanic Navy', color: '#061124', isDark: true },
  { id: 'titanium-slate', name: 'Titanium Slate', color: '#0f172a', isDark: true },
  { id: 'pure-white', name: 'Pure Snow White', color: '#FFFFFF', isDark: false },
  { id: 'clean-slate', name: 'Clean Soft Frost', color: '#F8FAFC', isDark: false },
  { id: 'cream-sand', name: 'Warm Cream Sand', color: '#FAF7F2', isDark: false },
];

export const BackgroundCustomizerModal: React.FC = () => {
  const { 
    customBg, 
    setCustomBg, 
    resetCustomBg, 
    isBgModalOpen, 
    setIsBgModalOpen, 
    isDarkMode, 
    toggleDarkMode,
    activeTheme,
    setActiveTheme
  } = useApp();
  const [pickerColor, setPickerColor] = useState(customBg || getThemeDefaultBg(activeTheme));

  if (!isBgModalOpen) return null;

  const handleSelectPreset = (color: string) => {
    setPickerColor(color);
    setCustomBg(color);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setPickerColor(newColor);
    setCustomBg(newColor);
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith('#') && val.length > 0) val = '#' + val;
    setPickerColor(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      setCustomBg(val);
    }
  };

  const handleReset = () => {
    resetCustomBg();
    setPickerColor(getThemeDefaultBg(activeTheme));
  };

  const activeColor = customBg || getThemeDefaultBg(activeTheme);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-[#0c1829] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scaleUp"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 pb-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-slate-950 shadow-md bg-gradient-to-tr from-sky-400 via-amber-400 to-emerald-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Theme & Color Studio</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/60">
                  7 Flagship Themes
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                1-Click switch matching your uploaded themes & custom palettes
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsBgModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* THE PRIMARY THEMES REQUESTED BY USER */}
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-300 mb-3 flex items-center justify-between">
              <span>Select Primary Visual Theme</span>
              <span className="text-[11px] font-normal text-slate-400">1-Click Instant Full Website Switch</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {FLAGSHIP_THEMES.map(theme => {
                const isCurrentTheme = activeTheme === theme.id || (theme.id === 'aurora-jade' && activeTheme === 'cyber-emerald');
                return (
                  <div 
                    key={theme.id}
                    onClick={() => {
                      setActiveTheme(theme.id);
                      setPickerColor(theme.color);
                    }}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden group ${
                      isCurrentTheme
                        ? `${theme.accentBorder} ring-2 ring-white/20 shadow-lg scale-[1.01]`
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600'
                    }`}
                    style={{ backgroundColor: theme.cardBg }}
                  >
                    {/* Visual Glow preview banner */}
                    <div className={`h-12 w-full rounded-xl bg-gradient-to-r ${theme.bannerGradient} p-2.5 flex items-center justify-between relative overflow-hidden mb-2.5 border ${theme.id === 'pure-white' ? 'border-slate-200' : 'border-white/10'}`}>
                      <div className="flex items-center gap-2 z-10">
                        <div className={`w-6 h-6 rounded-full bg-gradient-to-tr ${theme.iconBg} flex items-center justify-center text-white text-[10px] font-black`}>
                          S
                        </div>
                        <span className={`text-xs font-black ${theme.id === 'pure-white' ? 'text-slate-900' : 'text-white'}`}>{theme.name}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full ${theme.tagBg} text-[9px] font-black`}>
                        {theme.tag}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`text-xs font-black ${theme.id === 'pure-white' ? 'text-slate-900' : 'text-white'} flex items-center gap-1.5`}>
                          <span>{theme.badgeEmoji} {theme.name}</span>
                          {isCurrentTheme && (
                            <span className={`text-[10px] ${theme.id === 'pure-white' ? 'text-indigo-600' : 'text-brand-300'} font-bold`}>• Active</span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">
                          {theme.subtitle}
                        </div>
                      </div>
                      {isCurrentTheme && (
                        <div className={`w-6 h-6 rounded-full ${theme.id === 'pure-white' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-950'} flex items-center justify-center shrink-0 shadow-md font-black`}>
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Color Preview & Quick Controls */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-2xl border-2 border-white dark:border-slate-700 shadow-md flex items-center justify-center transition-all"
                style={{ backgroundColor: activeColor }}
              >
                <Sparkles className="w-4 h-4 text-white drop-shadow" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Current Theme Palette</div>
                <div className="text-sm font-black text-slate-900 dark:text-white font-mono uppercase">
                  {activeColor} ({activeTheme})
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs shadow-xs transition-all cursor-pointer"
                title="Toggle Base Mode"
              >
                {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-500" />}
                <span>{isDarkMode ? 'Dark' : 'Light'}</span>
              </button>
              {customBg && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-bold text-xs transition-all cursor-pointer"
                  title="Reset to active theme default"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Curated Theme Presets */}
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2.5">
              Curated Background Color Presets
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {PRESET_THEMES.map(theme => {
                const isSelected = activeColor.toLowerCase() === theme.color.toLowerCase();
                return (
                  <button
                    key={theme.id}
                    onClick={() => handleSelectPreset(theme.color)}
                    className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between h-20 cursor-pointer ${
                      isSelected
                        ? 'border-brand-500 ring-2 ring-brand-500/30 shadow-md scale-[1.02]'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600'
                    }`}
                    style={{ backgroundColor: theme.color }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span 
                        className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-xs ${
                          theme.isDark ? 'bg-white/20 text-white' : 'bg-black/10 text-slate-800'
                        }`}
                      >
                        {theme.color}
                      </span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <div className={`text-xs font-bold truncate ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
                      {theme.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Color Picker */}
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2.5">
              Custom Color (Pick Any Color)
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <input
                type="color"
                value={pickerColor.startsWith('#') && pickerColor.length === 7 ? pickerColor : '#0b1a30'}
                onChange={handleCustomColorChange}
                className="w-12 h-12 rounded-xl cursor-pointer border-0 bg-transparent"
                title="Choose custom color"
              />
              <div className="flex-1">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  Hex Color Code
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={pickerColor}
                    onChange={handleHexInputChange}
                    placeholder="#0b1a30"
                    maxLength={7}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <button
                    onClick={() => setCustomBg(pickerColor)}
                    className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer whitespace-nowrap"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            Changes are saved to your browser automatically.
          </span>
          <button
            onClick={() => setIsBgModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-extrabold text-xs transition-all cursor-pointer shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

