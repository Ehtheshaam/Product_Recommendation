/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#2563EB',
          cyan: '#06B6D4',
          purple: '#7C3AED',
          success: '#22C55E',
          warning: '#F59E0B',
          danger: '#EF4444',
          bg: '#FFFFFF',
          bgSecondary: '#F8FAFC',
          border: '#E5E7EB',
          textPrimary: '#111827',
          textSecondary: '#6B7280'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
