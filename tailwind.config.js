/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      screens: {
        // Phones held sideways: short viewport in landscape. The app's primary mobile layout.
        mland: { raw: "(orientation: landscape) and (max-height: 500px)" },
        // Phones held upright.
        mport: { raw: "(orientation: portrait) and (max-width: 600px)" },
        // Any phone, either orientation (sizing that applies to both).
        phone: {
          raw: "(orientation: landscape) and (max-height: 500px), (orientation: portrait) and (max-width: 600px)",
        },
      },
      keyframes: {
        "bounce-in": {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.05)", opacity: "0.8" },
          "70%": { transform: "scale(0.9)", opacity: "0.9" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        swing: {
          "0%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
          "100%": { transform: "rotate(-3deg)" },
        },
      },
      animation: {
        "bounce-in": "bounce-in 0.6s ease-out",
        swing: "swing 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
