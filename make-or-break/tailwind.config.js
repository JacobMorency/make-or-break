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
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        bg: {
          DEFAULT: "#ffffff",
          dark: "#000000",
        },
        card: {
          DEFAULT: "#f3f4f6",
          dark: "#1f1f1f",
        },
        text: {
          DEFAULT: "#111827",
          dark: "#f9fafb",
        },
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      // Auto-switching utilities that respond to .dark class
      addUtilities({
        // Text color - auto-switches based on theme
        '.text-text': {
          color: '#111827', // light mode text
        },
        '.dark .text-text': {
          color: '#f9fafb', // dark mode text
        },
        // Background color - auto-switches based on theme
        '.bg-bg': {
          backgroundColor: '#ffffff', // light mode background
        },
        '.dark .bg-bg': {
          backgroundColor: '#000000', // dark mode background
        },
        // Card background - auto-switches based on theme
        '.bg-card': {
          backgroundColor: '#f3f4f6', // light mode card
        },
        '.dark .bg-card': {
          backgroundColor: '#1f1f1f', // dark mode card
        },
      });
    },
  ],
};
