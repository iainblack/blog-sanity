import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  content: ["./app/**/*.{ts,tsx}", "./sanity/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'default-bg': '#FFFBF5',
        'contrast-bg': '#D3D5CB',
        'dark-bg': '#322F2B',
        'primary': '#A4B1A7',
        'text-primary': '#1A1A1A',
        'text-secondary': '#4D4D4D',
        'text-contrast': '#FFFFFF',
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [typography],
} satisfies Config;
