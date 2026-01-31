import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yellow: "#facc15",
        muted: "rgba(255,255,255,0.75)",
        border: "rgba(255,255,255,0.12)",
      },
      boxShadow: {
        yellow: "0 0 30px rgba(250,204,21,0.35)",
      },
    },
  },
  plugins: [],
};

export default config;