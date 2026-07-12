/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base "mission control" surfaces
        base: {
          void: "#05080e",      // page background
          panel: "#07090f",     // card/panel background
          card: "#080e1c",      // hazard card background
          line: "#0e1929",      // borders/dividers
          muted: "#2e4156",     // secondary text
          faint: "#1a2a3a",     // footer/tertiary text
        },
        // Hazard-specific accent colors — same meaning everywhere in the app
        hazard: {
          wildfire: "#F97316",
          tornado: "#8B5CF6",
          hail: "#22C55E",
          thunderstorm: "#3B82F6",
          flashflood: "#06B6D4",
          heat: "#EF4444",
          drought: "#EAB308",
        },
        // Threat level scale — matches the segmented threat bar
        threat: {
          minimal: "#22C55E",
          low: "#84CC16",
          moderate: "#EAB308",
          elevated: "#F97316",
          high: "#EF4444",
          extreme: "#DC2626",
        },
      },
      fontFamily: {
        display: ["Rajdhani", "sans-serif"],   // titles, labels, tactical UI text
        mono: ["'Space Mono'", "monospace"],    // all numeric readouts
        body: ["Inter", "sans-serif"],           // factor labels, body copy
      },
    },
  },
  plugins: [],
};
