// tailwind.config.js
import rippleui from 'rippleui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [
    rippleui, // ✅ use imported plugin, not require()
  ],
};