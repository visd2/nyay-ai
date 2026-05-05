/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fff8f0',
          100: '#ffe8cc',
          500: '#e07b39',
          600: '#c26228',
          700: '#a04d1a',
          900: '#5c2c0d',
        },
        law: {
          50:  '#f0f4ff',
          500: '#4361ee',
          700: '#2c47d1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        hindi: ['Noto Sans Devanagari', 'serif'],
      },
    },
  },
  plugins: [],
}
