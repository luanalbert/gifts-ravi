import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Cantinho do Ravi
        cream: {
          DEFAULT: "#FAFAF7",
          100: "#FAFAF7",
          200: "#F0EBE1",
          300: "#E8DFD3",
        },
        sage: {
          DEFAULT: "#8FAF8A",
          light: "#B5CDB1",
          dark: "#6A9165",
        },
        brown: {
          DEFAULT: "#3D3530",
          light: "#6B5E57",
          muted: "#9A8880",
        },
        gold: {
          DEFAULT: "#C9A96E",
          light: "#DFC99A",
          dark: "#A8844A",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        card: "0 2px 20px rgba(61, 53, 48, 0.06), 0 1px 4px rgba(61, 53, 48, 0.04)",
        "card-hover":
          "0 8px 40px rgba(61, 53, 48, 0.12), 0 2px 8px rgba(61, 53, 48, 0.06)",
        modal:
          "0 24px 80px rgba(61, 53, 48, 0.18), 0 8px 24px rgba(61, 53, 48, 0.08)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
