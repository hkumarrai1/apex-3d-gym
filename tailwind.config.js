/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gym: {
          dark: '#0a0a0c',
          darker: '#050507',
          card: '#121318',
          cardLight: '#ffffff',
          accent: '#00f0ff', // Cyber cyan
          accentHover: '#00c8d6',
          neon: '#ccff00',   // Electric lime/gold
          danger: '#ff0055',
          gold: '#ffd700',
        }
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'sans-serif'],
        heading: ['Syne', 'Rajdhani', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
        'float': 'float 4s infinite ease-in-out',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(0, 240, 255, 0.4), 0 0 30px rgba(0, 240, 255, 0.2)' },
          '50%': { boxShadow: '0 0 25px rgba(0, 240, 255, 0.8), 0 0 50px rgba(0, 240, 255, 0.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        }
      }
    },
  },
  plugins: [],
}
