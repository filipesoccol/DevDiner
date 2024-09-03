/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    colors: {
      'beige': '#F1E7DB',
      'orange': '#DB4439',
      'blue': '#40AABF',
      'green': '#8AB34C',
      'yellow': '#D6BF29',
      'red': '#772821',
      'black': '#2C263D',
    },
  },
  plugins: [
    require("tailwindcss-animate")
  ]
}

