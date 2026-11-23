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
        primary: {
          DEFAULT: '#0284c7', // Mediterranean Sea Blue (from DESIGN.md)
          hover: '#0369a1',
          surface: '#f0f9ff',
          light: '#38bdf8',
          dark: '#075985'
        },
        accent: {
          red: '#dc2626', // Minimal Tunisian Red strictly for badges/urgency/live
          'red-subtle': '#fef2f2',
          'red-hover': '#b91c1c'
        },
        neutral: {
          bg: '#f8fafc',
          surface: '#ffffff',
          border: '#e2e8f0',
          text: '#0f172a',
          muted: '#64748b'
        },
        state: {
          success: '#16a34a',
          warning: '#d97706',
          info: '#0284c7'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Tajawal', 'system-ui', 'sans-serif'],
        arabic: ['Tajawal', 'Cairo', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        'card': '16px',
        'btn': '10px'
      }
    },
  },
  plugins: [],
}
