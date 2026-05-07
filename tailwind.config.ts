import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cream: "#f5f0e8",
        gold: "#c9a54a",
        charcoal: "#1a1a1a",
        "off-white": "#faf9f6",
      },
      fontFamily: {
        serif: ["var(--font-opensans)", "sans-serif"],
        sans: ["var(--font-opensans)", "sans-serif"],
      },
      letterSpacing: {
        "widest-xl": "0.3em",
      },
    },
  },
  plugins: [],
};
export default config;
