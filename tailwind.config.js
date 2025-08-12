/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  extend: {
  backgroundImage: {
    'landing-bg': "url('Bg _image_landing_page.webp')",
  },
     fontFamily: {
        arimo: ['Arimo', 'sans-serif'],
      }
}
  },
  plugins: [],
}