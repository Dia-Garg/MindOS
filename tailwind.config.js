/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        card: '#12121a',
        accent: {
          green: '#00ff9d',
          blue: '#4da6ff',
          pink: '#ff6b9d',
          gold: '#ffc35a',
          red: '#ff4d4d'
        }
      },
      fontFamily: {
        mono: ["'Space Mono'", 'monospace'],
        sans: ["'DM Sans'", 'sans-serif'],
        syne: ["'Syne'", 'sans-serif']
      }
    },
  },
  plugins: [],
}
