/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  extend: {
  backgroundImage: {
    'landing-bg': "url('bg_image.jpg')",
  },
     fontFamily: {
        arimo: ['Arimo', 'sans-serif'],
        georgiapro: ['"Georgia Pro"', 'Georgia', 'serif'],
      },
      keyframes: {
        'tracking-in-expand': {
          '0%': { letterSpacing: '-0.5em', opacity: '0' },
          '40%': { opacity: '0.6' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'tracking-in-expand': 'tracking-in-expand 1s cubic-bezier(.215,.61,.355,1) both',
      },

}
  },
  plugins: [],
}