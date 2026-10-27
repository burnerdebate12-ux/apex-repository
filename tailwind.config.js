/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          base: '#000000',
          card: '#121212',
          card2: '#181818',
          border: '#1f1f1f',
          muted: '#2a2a2a',
        },
        gold: {
          DEFAULT: '#D4AF37',
          soft: '#E6C766',
          dim: '#8C7421',
          glow: 'rgba(212, 175, 55, 0.35)',
        },
        term: {
          green: '#22c55e',
          green2: '#4ade80',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      boxShadow: {
        gold: '0 0 0 1px rgba(212,175,55,0.5), 0 0 24px rgba(212,175,55,0.18)',
        card: '0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 30px rgba(0,0,0,0.6)',
      },
      keyframes: {
        glowpulse: {
          '0%, 100%': { boxShadow: '0 0 0 1px rgba(212,175,55,0.5), 0 0 18px rgba(212,175,55,0.25)' },
          '50%': { boxShadow: '0 0 0 1px rgba(212,175,55,0.8), 0 0 30px rgba(212,175,55,0.45)' },
        },
        slidein: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
      },
      animation: {
        glowpulse: 'glowpulse 2.4s ease-in-out infinite',
        slidein: 'slidein 0.35s ease-out both',
        blink: 'blink 1s steps(1) infinite',
      },
    },
  },
  plugins: [],
};
