/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        correctAnswer: "#4caf50",
        incorrectAnswer: "#ef4444",
      },
      boxShadow: {
        shadowGreen: "0 0 5px rgba(76, 175, 80, 0.6)",
        shadowRed: "0 0 5px rgba(239, 68, 68, 0.6)",
      },
      animation: {
        twinkle: "twinkle 2s infinite alternate",
        moveStars: "moveStars 15s infinite linear",
      },
      keyframes: {
        twinkle: {
          "0%": { opacity: "0.3" },
          "100%": { opacity: "1" },
        },
        moveStars: {
          "0%": { transform: "translateY(0) translateX(0)" },
          "25%": { transform: "translateY(10px) translateX(-5px)" },
          "50%": { transform: "translateY(0) translateX(-10px)" },
          "75%": { transform: "translateY(-10px) translateX(-5px)" },
          "100%": { transform: "translateY(0) translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
