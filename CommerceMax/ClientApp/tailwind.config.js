/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bggray: '#212529'
      },
      boxShadow: {
        '3xl': '0 0 0.2em #87F, 0 0 0.2em #87F, 0 0 0.2em #87F',
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}
