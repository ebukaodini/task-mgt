/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      primary: "#3fa905",
      ...colors,
    },
    fontFamily: {
      sans: ["Ubuntu", "sans-serif"],
      serif: ["serif"],
    },
    extend: {
      translate: ["last"],
      dropShadow: {
        custom: ["4px 28px 16px rgba(0, 0, 0, 0.05)"],
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        glimmer: {
          "50%": { opacity: 0.75 },
        },
      },
      animation: {
        glimmer: "glimmer 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;",
        wiggle: "wiggle 2s linear infinite;",
      },
    },
  },
};
