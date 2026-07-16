import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm cream paper & botanical romance palette
        cream: {
          50: "#fdfaf3",
          100: "#faf3e6",
          200: "#f4e8d2",
          300: "#ecd9b8",
        },
        blush: {
          100: "#f9e5e3",
          200: "#f3cfcb",
          300: "#e9aaa3",
          400: "#dd857c",
          500: "#c9645b",
        },
        rose: {
          300: "#e6a4ac",
          400: "#d67f8c",
          500: "#c05a6d",
          600: "#9e4356",
        },
        sage: {
          300: "#b7c4a4",
          400: "#93a67e",
          500: "#6f855b",
          600: "#556844",
        },
        gold: {
          200: "#efdcae",
          300: "#e3c583",
          400: "#d2a959",
          500: "#b8873a",
        },
        forest: {
          400: "#2f6b3e",
          500: "#1E4D2B",
          600: "#163D22",
          700: "#0e2b18",
        },
        wine: {
          400: "#7a3450",
          500: "#5d263b",
          600: "#4a1d2e",
        },
        ink: {
          400: "#7a5c4a",
          500: "#5a4033",
          600: "#3f2c22",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        script: ["var(--font-dancing)", "cursive"],
        body: ["var(--font-eb-garamond)", "Georgia", "serif"],
      },
      boxShadow: {
        paper:
          "0 1px 1px rgba(90,64,51,0.05), 0 10px 30px rgba(90,64,51,0.12), 0 30px 60px rgba(90,64,51,0.10)",
        glass:
          "0 8px 32px rgba(90,64,51,0.18), inset 0 1px 0 rgba(255,255,255,0.35)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        shimmer: "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
