/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff5f0', 100: '#ffe0d0', 200: '#ffc0a0',
          400: '#ff6b35', 500: '#d4380d', 600: '#b52e0a',
          700: '#8a2008', 900: '#3d0e03',
        },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
}
