/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        olympus: {
          navy: "#12233F",
          charcoal: "#1B1B16",
          dark: "#0F1A2C",
          orange: "#EE8A2E",
          "orange-light": "#FFA959",
          "orange-dark": "#C86B18",
          cream: "#FDF4CC",
          "cream-dark": "#E6DCB5",
          teal: "#1F5C66",
          "teal-dark": "#133E46",
          maroon: "#9B3B33",
          "maroon-dark": "#752B24",
          seafoam: "#C1DDD0",
          stone: "#DDD3C8",
          torch: "#E4EC6A",
        }
      },
      fontFamily: {
        heading: ["'Cinzel Decorative'", "'Cinzel'", "serif"],
        serif: ["'Cinzel'", "serif"],
        body: ["'Sofia Sans Semi Condensed'", "'Saira Condensed'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        'god-glow': '0 0 35px rgba(238, 138, 46, 0.45)',
        'athena-glow': '0 0 35px rgba(193, 221, 208, 0.45)',
        'poseidon-glow': '0 0 35px rgba(31, 92, 102, 0.65)',
        'hermes-glow': '0 0 35px rgba(238, 138, 46, 0.55)',
        'torch-glow': '0 0 25px rgba(228, 236, 106, 0.6)',
      },
      animation: {
        'flame': 'flame 1.5s infinite alternate ease-in-out',
        'float-slow': 'float 6s ease-in-out infinite',
        'wave-drift': 'waveDrift 12s linear infinite',
        'ship-sail': 'shipSail 24s linear infinite',
        'star-twinkle': 'twinkle 3s ease-in-out infinite alternate',
      },
      keyframes: {
        flame: {
          '0%': { transform: 'scale(0.95) rotate(-2deg)', filter: 'drop-shadow(0 0 8px #EE8A2E)' },
          '50%': { transform: 'scale(1.05) rotate(2deg)', filter: 'drop-shadow(0 0 15px #E4EC6A)' },
          '100%': { transform: 'scale(0.98) rotate(-1deg)', filter: 'drop-shadow(0 0 10px #EE8A2E)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        waveDrift: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shipSail: {
          '0%': { transform: 'translateX(-120px) translateY(0px) rotate(1deg)' },
          '25%': { transform: 'translateX(25vw) translateY(-4px) rotate(-1deg)' },
          '50%': { transform: 'translateX(50vw) translateY(2px) rotate(1.5deg)' },
          '75%': { transform: 'translateX(75vw) translateY(-3px) rotate(-1deg)' },
          '100%': { transform: 'translateX(105vw) translateY(0px) rotate(1deg)' },
        },
        twinkle: {
          '0%': { opacity: '0.2', transform: 'scale(0.8)' },
          '100%': { opacity: '0.9', transform: 'scale(1.15)' },
        }
      }
    },
  },
  plugins: [],
}
