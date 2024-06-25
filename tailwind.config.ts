import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  content: ["./app/**/*.{ts,tsx}", "./sanity/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'default-bg': '#FFFFFF',
        'contrast-bg': '#D3D5CB',
        'pink-bg': '#ffecff',
        'dark-bg': '#322F2B',
        'primary': '#A4B1A7',
        'text-primary': '#1A1A1A',
        'text-secondary': '#4D4D4D',
        'text-contrast': '#FFFFFF',
      },
      fontFamily: {
        walbaum: ['"Walbaum Display Light"', 'sans-serif'],
        garamond: ['EB Garamond', 'serif'],
        satista: ['"Satista"', 'sans-serif'],
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [typography],
} satisfies Config;
