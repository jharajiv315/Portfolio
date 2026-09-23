/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        sans: ["Poppins", "sans-serif"],
        display: ["Roboto", "sans-serif"],
        heading: ["Roboto", "sans-serif"],
      },
      colors: {
        brand: {
          linen: "#FAF7F2",
          linenAlt: "#F3EFE6",
          linenCard: "#FFFFFF",
          borderWarm: "#E8E1D5",
          obsidian: "#1C1917",
          stone: "#57534E",
          stoneMuted: "#78716C",
          terracotta: "#B84A1C",
          terracottaHover: "#9C3E16",
          terracottaLight: "#FDEEE9",
          amberWarm: "#D97706",
          black: "#1C1917",
          surface1: "#FAF7F2",
          surface2: "#F3EFE6",
          surface3: "#EFEAE1",
          textPrimary: "#1C1917",
          textSecondary: "#57534E",
          textMuted: "#78716C",
          cyan: "#B84A1C",
          cyanBright: "#C2410C",
          blue: "#B84A1C",
          blueDeep: "#9C3E16",
          purple: "#78350F",
          magenta: "#B84A1C",
          white: "#FAF7F2",
          gold: "#D97706",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        full: "9999px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}