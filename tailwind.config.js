/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        terminal: {
          bg: "#0a1914",
          bgDark: "#06100c",
          bgLight: "#0f281e",
          green: "#39ff14",
          greenDim: "#1fa80c",
          amber: "#ffb000",
          cyan: "#00b7c2",
          border: "#1a3a2c",
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', '"Courier New"', 'monospace'],
        display: ['"Space Mono"', '"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        glow: "0 0 20px rgba(57, 255, 20, 0.3)",
        glowStrong: "0 0 40px rgba(57, 255, 20, 0.5)",
        glowAmber: "0 0 20px rgba(255, 176, 0, 0.3)",
        glowCyan: "0 0 20px rgba(0, 183, 194, 0.3)",
      },
      animation: {
        flicker: "flicker 0.15s infinite",
        scanline: "scanline 6s linear infinite",
        fadeInUp: "fadeInUp 0.6s ease-out forwards",
        pulseGlow: "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.98" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(57, 255, 20, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(57, 255, 20, 0.6)" },
        },
      },
    },
  },
  plugins: [],
};
