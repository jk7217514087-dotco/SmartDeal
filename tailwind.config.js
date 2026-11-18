/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          dark: '#070913',
          navy: '#0f172a',
          surface: '#0d1424',
          elevated: '#131d33',
        },
        obsidian: {
          950: '#070913',
          900: '#0a0f1d',
          850: '#0d1424',
          800: '#111a2e',
          750: '#15213b',
          700: '#1b2a4a',
        },
        electric: {
          cyan: '#06b6d4',
          sky: '#0ea5e9',
          violet: '#8b5cf6',
          purple: '#a855f7',
          mint: '#10b981',
        },
        coin: {
          light: '#fef3c7',
          DEFAULT: '#f59e0b',
          dark: '#d97706',
          glow: '#fbbf24',
        },
        savings: {
          light: '#ecfdf5',
          DEFAULT: '#10b981',
          dark: '#059669',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.08)',
        'glow': '0 0 25px -5px rgba(99, 102, 241, 0.45)',
        'glow-cyan': '0 0 25px -4px rgba(6, 182, 212, 0.4)',
        'glow-violet': '0 0 25px -4px rgba(139, 92, 246, 0.45)',
        'glow-emerald': '0 0 25px -4px rgba(16, 185, 129, 0.4)',
        'coin-glow': '0 0 20px -3px rgba(245, 158, 11, 0.45)',
        'card-elevated': '0 12px 36px -8px rgba(7, 9, 19, 0.6), 0 0 0 1px rgba(99, 102, 241, 0.12)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        }
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
