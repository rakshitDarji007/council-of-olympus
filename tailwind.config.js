/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hackuta: {
          clay: "#eee3d2",
          light: "#f6eddf",
          sand: "#ded0bc",
          ink: "#1a3a52",
          night: "#102f46",
          abyss: "#041321",
          ocean: "#305873",
          mist: "#8ca1aa",
          terracotta: "#b4654d",
          gold: "#e8c97a",
          "gold-dark": "#cda53c",
        },
        olympus: {
          bg: "#0A0F1D",
          surface: "#111A2E",
          "surface-light": "#16223B",
          border: "rgba(255, 255, 255, 0.08)",
          "border-bronze": "rgba(217, 119, 70, 0.25)",
          bronze: "#D97746",
          "bronze-light": "#E89162",
          "bronze-dark": "#B35B30",
          cream: "#F8F6F0",
          "cream-muted": "#E2DDD5",
          teal: "#1E5B6A",
          "teal-light": "#2A7385",
          sage: "#94B49F",
          terracotta: "#8B3E37",
          stone: "#94A3B8",
          dark: "#060913",
        }
      },
      fontFamily: {
        heading: ["'Newsreader'", "Georgia", "serif"],
        display: ["'Cinzel'", "serif"],
        sans: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        body: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        serif: ["'Newsreader'", "Georgia", "serif"],
      },
      boxShadow: {
        'subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.1)',
        'elevated': '0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 1px rgba(217, 119, 70, 0.3)',
        'glow-bronze': '0 0 35px -5px rgba(217, 119, 70, 0.25)',
        'glow-teal': '0 0 35px -5px rgba(30, 91, 106, 0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
