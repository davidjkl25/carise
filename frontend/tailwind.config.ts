import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          brown: "rgb(var(--color-brand-brown-rgb) / <alpha-value>)",
          blush: "rgb(var(--color-brand-blush-rgb) / <alpha-value>)",
          bubble: "rgb(var(--color-brand-bubble-rgb) / <alpha-value>)",
          sky: "rgb(var(--color-brand-sky-rgb) / <alpha-value>)",
          rose: "rgb(var(--color-brand-rose-rgb) / <alpha-value>)",
          ink: "rgb(var(--color-brand-brown-rgb) / <alpha-value>)",
          cream: "rgb(var(--color-brand-cream-rgb) / <alpha-value>)",
          sand: "rgb(var(--color-brand-bubble-rgb) / <alpha-value>)",
          clay: "rgb(var(--color-brand-rose-rgb) / <alpha-value>)",
          olive: "rgb(var(--color-brand-sky-rgb) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        accent: ["var(--font-mea-culpa)", "cursive"],
        sans: ["Myriad Pro", "system-ui", "Segoe UI", "sans-serif"],
      },
      borderRadius: {
        brand: "var(--radius-brand)",
      },
      spacing: {
        brand: "var(--space-brand)",
      },
    },
  },
  plugins: [],
};

export default config;
