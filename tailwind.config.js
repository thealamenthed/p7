/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}", "./src/**/*.{html,js}", "./index.html"],
  theme: {
    extend: {}
  },
  plugins: [require("@tailwindcss/line-clamp")]
};
