/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#262624",
        accent: "#20FF00",
        neutral: "#C2C0B6",
        dark: "#1a1a18",
        darker: "#111110",
        "bg-light": "#2e2e2b",
      },
      fontFamily: {
        display: ["'Bebas Neue'", "cursive"],
        heading: ["'DM Sans'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'Space Mono'", "monospace"],
      },
      fontSize: {
        "10xl": "10rem",
        "12xl": "12rem",
        "14xl": "14rem",
      },
      animation: {
        "spin-slow": "spin 20s linear infinite",
        "pulse-accent": "pulseAccent 2s ease-in-out infinite",
        marquee: "marquee 20s linear infinite",
        "fade-up": "fadeUp 0.8s ease forwards",
      },
      keyframes: {
        pulseAccent: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(40px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
