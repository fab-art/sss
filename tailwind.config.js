/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ember: '#f97316',
        midnight: '#030712'
      }
    }
  },
  plugins: []
};
