/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#1E3A5F",
        accent: "#F59E0B",
        "bg-light": "#F8FAFC",
        "bg-dark": "#0F172A",
        "surface-light": "#FFFFFF",
        "surface-dark": "#1E293B",
        "text-primary": "#1E293B",
        "text-secondary": "#64748B",
        hairline: "#E2E8F0",
        "diff-highlight": "#FEF3C7",
      },
    },
  },
  plugins: [],
};
