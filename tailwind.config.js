/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#0C7CFF',
          dark: '#0A66D6',
        },
        surface: {
          DEFAULT: '#0F1115',
          raised: '#181B21',
          higher: '#20242C',
          border: '#2A2E37',
        },
      },
    },
  },
  plugins: [],
}
