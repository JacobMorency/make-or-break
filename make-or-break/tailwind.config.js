/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
    "./App.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        base: {
          100: "#1a1a1a", // Dark background
          200: "#262626", // Dark surface
          300: "#333333", // Card/Panel background
          content: "#fefbee", // Creamy text
        },
      },
    },
  },
  plugins: [],
};
