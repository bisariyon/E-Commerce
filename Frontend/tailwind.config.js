/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode:"class",
  theme: {
    extend: {
      keyframes: {
        slideLeftToRight: {
          '0%': { transform: 'translateX(-20%)' },
          '50%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-20%)' },
        },
      },
      animation: {
        'slide-left-right': 'slideLeftToRight 10s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

