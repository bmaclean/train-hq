/* eslint-disable @typescript-eslint/no-var-requires */
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: colors.green,
        secondary: colors.gray,
        neutral: colors.gray,
      },
    },
  },
  plugins: [],
};
