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
        primary: "#1D4ED8",
        accent: "#059669",
        warning: "#D97706",
        danger: "#DC2626",
        dark: "#0F172A",
      },
    },
  },
  plugins: [],
}
