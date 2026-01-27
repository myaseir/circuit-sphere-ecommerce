import type { Config } from "tailwindcss";

const defaultTheme = require("tailwindcss/defaultTheme");

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    // Keep your specific family here if you use font-euclid-circular-a
    fontFamily: {
      "euclid-circular-a": ["var(--font-euclid)", "sans-serif"],
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        xl: "0",
      },
    },
    colors: {
      current: "currentColor",
      transparent: "transparent",
      white: "#FFFFFF",
      body: "#6C6F93",
      meta: {
        DEFAULT: "#F7F9FC",
        2: "#495270",
        3: "#606882",
        4: "#8D93A5",
        5: "#BBBEC9",
      },
      dark: {
        DEFAULT: "#1C274C",
        2: "#495270",
        3: "#606882",
        4: "#8D93A5",
        5: "#BBBEC9",
      },
      gray: {
        DEFAULT: "#F3F5F6",
        1: "#F9FAFB",
        2: "#F3F4F6",
        3: "#E5E7EB",
        4: "#D1D5DB",
        5: "#9CA3AF",
        6: "#6B7280",
        7: "#374151",
      },
      blue: {
        DEFAULT: "#3C50E0",
        dark: "#1C3FB7",
        light: "#5475E5",
        "light-2": "#8099EC",
        "light-3": "#ADBCF2",
        "light-4": "#C3CEF6",
        "light-5": "#E1E8FF",
      },
      red: {
        DEFAULT: "#F23030",
        dark: "#E10E0E",
        light: "#F56060",
        "light-2": "#F89090",
        "light-3": "#FBC0C0",
        "light-4": "#FDD8D8",
        "light-5": "#FEEBEB",
        "light-6": "#FEF3F3",
      },
      green: {
        DEFAULT: "#22AD5C",
        dark: "#1A8245",
        light: "#2CD673",
        "light-2": "#57DE8F",
        "light-3": "#82E6AC",
        "light-4": "#ACEFC8",
        "light-5": "#C2F3D6",
        "light-6": "#DAF8E6",
      },
      yellow: {
        DEFAULT: "#FBBF24",
        dark: "#F59E0B",
        "dark-2": "#D97706",
        light: "#FCD34D",
        "light-1": "#FDE68A",
        "light-2": "#FEF3C7",
        "light-4": "#FFFBEB",
      },
      teal: {
        DEFAULT: "#02AAA4",
        dark: "#06A09B",
      },
      orange: {
        DEFAULT: "#F27430",
        dark: "#E1580E",
      },
    },
    screens: {
      xsm: "375px",
      lsm: "425px",
      "3xl": "2000px",
      ...defaultTheme.screens,
    },
    extend: {
      // ✅ ADD THIS BLOCK: Defines font-sans so @apply works
      fontFamily: {
        sans: ["var(--font-euclid)", ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        "2xs": ["10px", "17px"],
        "heading-1": ["60px", "72px"],
        "heading-2": ["48px", "64px"],
        "heading-3": ["40px", "48px"],
        "heading-4": ["30px", "38px"],
        "heading-5": ["28px", "40px"],
        "heading-6": ["24px", "30px"],
        "custom-xl": ["20px", "24px"],
        "custom-lg": ["18px", "24px"],
        "custom-sm": ["14px", "22px"],
        "custom-xs": ["12px", "20px"],
        "custom-2xl": ["24px", "34px"],
        "custom-4xl": ["36px", "48px"],
        "custom-1": ["22px", "30px"],
        "custom-2": ["32px", "38px"],
        "custom-3": ["35px", "45px"],
      },
      spacing: {
        4.5: "1.125rem",
        5.5: "1.375rem",
        // ... (truncated for brevity)
        230: "57.5rem",
      },
      maxWidth: {
        30: "7.5rem",
        40: "10rem",
        50: "12.5rem",
      },
      zIndex: {
        999999: "999999",
        99999: "99999",
        9999: "9999",
        999: "999",
        99: "99",
        1: "1",
      },
      boxShadow: {
        1: "0px 1px 2px 0px rgba(166, 175, 195, 0.25)",
        2: "0px 6px 24px 0px rgba(235, 238, 251, 0.40), 0px 2px 4px 0px rgba(148, 163, 184, 0.05)",
        3: "0px 2px 16px 0px rgba(13, 10, 44, 0.12)",
        testimonial:
          "0px 0px 4px 0px rgba(148, 163, 184, 0.10), 0px 6px 12px 0px rgba(224, 227, 238, 0.45)",
        breadcrumb: "0px 1px 0px 0px #E5E7EB, 0px -1px 0px 0px #E5E7EB",
        range:
          "0px 0px 1px 0px rgba(33, 37, 41, 0.08), 0px 2px 2px 0px rgba(33, 37, 41, 0.06)",
        filter: "0px 1px 0px 0px #E5E7EB",
        list: "1px 0px 0px 0px #E5E7EB",
        input: "inset 0 0 0 2px #3C50E0",
      },
    },
  },
  plugins: [],
};
export default config;