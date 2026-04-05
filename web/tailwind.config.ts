import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Enable RTL variant for Arabic and other RTL languages
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        // Sovereign Brand Colors (DNA Kapitel 16.3)
        navy: "#0A1628",
        "space-black": "#050D18",
        surface: "#0F2035",
        cyan: "#00E5FF",
        purple: "#BB86FC",
        teal: "#00BFA5",
        gold: "#FFD600",
        pink: "#FF4081",
        "risk-red": "#FF1744",
        "success-green": "#00E676",
        // Text Colors
        "text-primary": "#E0E0E0",
        "text-secondary": "#9E9E9E",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "aura-glow": "aura-glow 4s ease-in-out infinite alternate",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        "aura-glow": {
          "0%": { opacity: "0.05", transform: "scale(1)" },
          "100%": { opacity: "0.2", transform: "scale(1.2)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      fontFamily: {
        "noto-arabic": ["var(--font-noto-arabic)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
