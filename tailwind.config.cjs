/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    height: (theme) => ({
      auto: "auto",
      ...theme("spacing"),
      full: "100%",
      screen: "calc(var(--vh) * 100)",
    }),
    minHeight: (theme) => ({
      0: "0",
      ...theme("spacing"),
      full: "100%",
      screen: "calc(var(--vh) * 100)",
    }),

    extend: {
      keyframes: {
        like: {
          "0%": {
            transform: "scale(1)",
          },
          "14%": {
            transform: "scale(1.3)",
          },
          "28%": {
            transform: "scale(1)",
          },
          "42%": {
            transform: "scale(1.3)",
          },
          "70%": {
            transform: "scale(1)",
          },
        },
      },
      animation: {
        like: "like 1s ease-in-out",
      },
    },
  },
  plugins: [],
};

module.exports = config;
