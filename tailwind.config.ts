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
        'primary': '#8C9F8D',
        'primary-dark': '#4D6B71',
        'primary-light': '#A4B1A7',
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
