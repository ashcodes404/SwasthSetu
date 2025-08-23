/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        backgroundImage: {
    'landing-bg': "url('/hosbg.png')",
  },
     fontFamily: {
        arimo: ['Arimo', 'sans-serif'],
        georgiapro: ['"Georgia Pro"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [   require('tailwind-scrollbar-hide'),],
}