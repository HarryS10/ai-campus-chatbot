/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        sea: "#0f766e",
        gold: "#b45309",
        berry: "#be123c",
      },
      boxShadow: {
        soft: "0 24px 80px rgba(17, 24, 39, 0.12)",
      },
    },
  },
  plugins: [],
};
