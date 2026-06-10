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
        /* Override per assicurare l'adesione alla palette Editorial */
        stone: {
          50: "#fafaf9", // Bianco Carta
        },
        zinc: {
          950: "#09090b", // Nero Inchiostro
        }
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-33.333%)' },
        }
      },
      animation: {
        /* Timing lineare per fluidità ininterrotta */
        marquee: 'marquee 30s linear infinite',
        
      },
    },
  },
  plugins: [],
};

export default config;