import type { Config } from "tailwindcss";

// ─────────────────────────────────────────────
// ARDEN DESIGN TOKENS
// Change values here, they cascade everywhere.
// Homepage is the source of truth for all values.
// ─────────────────────────────────────────────

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
        // Brand palette — use these names everywhere. Hex codes only live here.
        bone: "#faf9f6",       // primary background
        ink: "#1a1a1a",        // primary text + dark section bg
        gold: "#c9a54a",       // accent + hover
        cream: "#f0ede6",      // accent section bg — used for all non-bone sections + CTAs
        // Legacy aliases (kept so existing files don't break during migration)
        charcoal: "#1a1a1a",
        "off-white": "#faf9f6",
      },
      fontFamily: {
        serif: ["var(--font-opensans)", "sans-serif"],
        sans: ["var(--font-opensans)", "sans-serif"],
      },
      fontSize: {
        // Editorial scale — always paired with the intent in the name.
        // Values are [size, { letterSpacing, lineHeight, fontWeight }].
        "display": ["clamp(2.2rem, 4.5vw, 4.5vw)", { letterSpacing: "0.22em", lineHeight: "1.25", fontWeight: "400" }],
        "h1": ["clamp(2.1rem, 4vw, 3.8rem)", { letterSpacing: "0.02em", lineHeight: "1.05", fontWeight: "700" }],
        "h2": ["clamp(1.95rem, 3.4vw, 3.1rem)", { letterSpacing: "0.02em", lineHeight: "1.25", fontWeight: "400" }],
        "h3": ["clamp(1.5rem, 2.2vw, 2rem)", { letterSpacing: "0.02em", lineHeight: "1.3", fontWeight: "500" }],
        "stat": ["clamp(2.4rem, 4vw, 4rem)", { letterSpacing: "0", lineHeight: "1", fontWeight: "700" }],
        "body-lg": ["20px", { lineHeight: "2" }],
        "body": ["15px", { lineHeight: "1.6" }],
        "body-sm": ["14px", { lineHeight: "1.6" }],
        "eyebrow-sm": ["11px", { letterSpacing: "0.22em", lineHeight: "1.5" }],
        "eyebrow": ["13px", { letterSpacing: "0.24em", lineHeight: "1.5" }],
        "eyebrow-lg": ["15px", { letterSpacing: "0.32em", lineHeight: "1.5" }],
      },
      spacing: {
        // Section padding rhythm from homepage — use with Section primitive
        "edge": "7.5%",         // horizontal edge padding (all sections)
        "nav-offset": "140px",  // top padding for pages that follow the fixed nav
      },
      transitionTimingFunction: {
        "arden": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      letterSpacing: {
        "widest-xl": "0.3em",
      },
    },
  },
  plugins: [],
};
export default config;
