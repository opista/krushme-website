/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
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
