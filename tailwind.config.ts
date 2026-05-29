import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        abyss: {
          950: '#03040a',
          900: '#06070d',
          850: '#0a0c16',
          800: '#111421',
          700: '#1b2033'
        },
        xp: {
          400: '#41f8ff',
          500: '#18d7ff',
          600: '#7c3dff'
        },
        ember: '#ffb545'
      },
      boxShadow: {
        'xp-glow': '0 0 32px rgb(24 215 255 / 0.35), 0 0 80px rgb(124 61 255 / 0.2)'
      },
      fontFamily: {
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
} satisfies Config;
