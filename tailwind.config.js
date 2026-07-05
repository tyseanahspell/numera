/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#E8ECF4',
          100: '#C5CEE0',
          200: '#9EADC9',
          300: '#778CB2',
          400: '#5A739F',
          500: '#3D5A8C',
          600: '#2B4270',
          700: '#1A2B4A',
          800: '#0F1A2E',
          900: '#0A0E1A',
          950: '#050810',
        },
        gold: {
          50: '#FBF6E8',
          100: '#F5E8C4',
          200: '#EDD99A',
          300: '#E4C970',
          400: '#D4B85C',
          500: '#C9A84C',
          600: '#A88A3A',
          700: '#876C2E',
          800: '#664F22',
          900: '#453416',
        },
        surface: {
          DEFAULT: '#12182A',
          elevated: '#1A2238',
          muted: '#0F1525',
        },
      },
      fontFamily: {
        sans: ['Inter', 'System'],
        display: ['PlayfairDisplay', 'Georgia', 'serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(201, 168, 76, 0.25)',
        'glow-lg': '0 0 40px rgba(201, 168, 76, 0.35)',
      },
    },
  },
  plugins: [],
};
