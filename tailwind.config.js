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
        charcoal: {
          950: '#0a0c10',
          900: '#0e1117',
          850: '#12161f',
          800: '#171c27',
          700: '#222838',
          600: '#2f374c',
        },
        mint: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        }
      },
      fontFamily: {
        sans: ['"DM Sans"', 'Inter', '-apple-system', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
        syne: ['Syne', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
