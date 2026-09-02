/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          blue: '#1e3a8a',    // Deep official navy
          indigo: '#312e81',  // Indigo accent
          light: '#f8fafc',   // Slate background
          card: '#ffffff',
          gold: '#d97706',    // Seal gold
          emerald: '#059669', // Verified green
          ruby: '#dc2626',    // Failed red
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
