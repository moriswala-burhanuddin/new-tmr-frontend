/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#C41E3A", // Industrial Red
        "primary-dark": "#A01A2E",
        "dark-bg": "#121212",
        "card-bg": "#2A2A2A",
        "header-bg": "#1A1A1A",
        "border-gray": "#333333",
        "text-gray": "#AAAAAA",
        "text-white": "#FFFFFF",
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        display: ['Oswald', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
