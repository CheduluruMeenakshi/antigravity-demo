/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        earth: {
          50: '#fdf8f0',
          100: '#faebd7',
          200: '#f5d5a8',
          300: '#e8b97a',
          400: '#d4924d',
          500: '#b8732a',
          600: '#8b5a1e',
          700: '#6b4416',
          800: '#4a2f0f',
          900: '#2d1c08',
        },
      },
    },
  },
  plugins: [],
};
