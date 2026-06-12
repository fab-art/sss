/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#22c55e', // green-500
        secondary: '#166534', // green-800
        accent: '#4ade80', // green-400
        background: '#0a0a0a',
        surface: '#171717'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        black: ['Inter Black', 'system-ui', 'sans-serif']
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite'
      }
    }
  },
  plugins: []
};
