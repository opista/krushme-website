/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Friz Quadrata Std", ...defaultTheme.fontFamily.serif],
      },
      colors: {
        kfc: "#e3012b",
      },
      screens: {
        "hover-hover": { raw: "(hover: hover)" },
      },
    },
  },
  plugins: [],
};
