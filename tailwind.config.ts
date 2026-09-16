import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)"],
        sans: ["var(--font-body)"],
      },
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        surface2: "var(--surface-2)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        "ink-faint": "var(--ink-faint)",
        line: "var(--line)",
        "line-strong": "var(--line-strong)",
        yellow: "var(--yellow)",
        "yellow-ink": "var(--yellow-ink)",
        "yellow-soft": "var(--yellow-soft)",
        green: "var(--green)",
        "green-soft": "var(--green-soft)",
        red: "var(--red)",
        "red-soft": "var(--red-soft)",
      },
      boxShadow: {
        tag: "var(--shadow-tag)",
        card: "var(--shadow-card)",
      },
    },
  },
  plugins: [],
};
export default config;
