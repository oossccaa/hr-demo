/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3f0',
          100: '#e8e4e0',
          200: '#d4cfc9',
          300: '#b8b0a5',
          400: '#8b7355',
          500: '#6b5d4f',
          600: '#5a5a5a',
          700: '#3d3d3d',
        },
        success: '#6b8e23',
        warning: '#cd853f',
        danger: '#a0522d',
      }
    },
  },
  plugins: [],
}
