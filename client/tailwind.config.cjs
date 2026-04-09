/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FF8000", // Orange, t.ex. för knappar
        secondary: "#261292", // Blå, t.ex. accent
        accent: "#FBFFFA", // Vit / beige
        backgroundLight: "#E6EEE7", // Ljus bakgrund (dashboard)
        backgroundDark: "#DEEAE0", // Mörkare bakgrund (Home)
        textPrimary: "#1C1C1C", // Standard text
      },
      fontFamily: {
        heading: ["Montserrat", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      fontSize: {
        h1: "2.25rem", // 36px
        h2: "1.875rem", // 30px
        h3: "1.5rem", // 24px
        body: "1rem", // 16px
      },
    },
  },
  plugins: [],
};
