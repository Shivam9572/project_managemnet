import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./context/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172026",
        mist: "#eef3f2",
        pine: "#0f766e",
        coral: "#e76f51"
      }
    }
  },
  plugins: []
};

export default config;
