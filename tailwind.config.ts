import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        nuit: {
          DEFAULT: "#0A1A3F",
          50: "#E6E9F1",
          100: "#C2C9DC",
          200: "#8995B5",
          300: "#4F608E",
          400: "#1F3164",
          500: "#0A1A3F",
          600: "#081633",
          700: "#061128",
          800: "#040C1C",
          900: "#020611",
        },
        dore: {
          DEFAULT: "#C9A961",
          50: "#FAF5E8",
          100: "#F1E5C2",
          200: "#E3CC8B",
          300: "#D4B675",
          400: "#C9A961",
          500: "#B5934A",
          600: "#8E7339",
          700: "#67542A",
          800: "#40361B",
          900: "#1A180D",
        },
        creme: {
          DEFAULT: "#FAF7F0",
          50: "#FFFFFF",
          100: "#FAF7F0",
          200: "#F0E9D7",
          300: "#E5DABE",
          400: "#D9C9A3",
        },
      },
      fontFamily: {
        display: ["var(--font-cinzel)", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "arabesque": "url('/patterns/arabesque.svg')",
      },
      transitionDuration: {
        DEFAULT: "300ms",
      },
    },
  },
  plugins: [],
};

export default config;
