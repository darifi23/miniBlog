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
        // Moroccan-Modern Palette
        gold: {
          50: '#fefef9',
          100: '#fdf9ed',
          200: '#f9efcd',
          300: '#f1dda8',
          400: '#e8a855', // Primary Saffron Gold
          500: '#e0943d',
          600: '#d47a1a',
          700: '#b35e12',
          800: '#924b0f',
          900: '#7a3e0d',
        },
        bone: {
          50: '#fefdfb',
          100: '#f9f7f2', // Warm Bone
          200: '#efeae0',
          300: '#e5dccf',
          400: '#d9c9b8',
        },
        charcoal: {
          50: '#f8f8f7',
          100: '#e6e5e3',
          200: '#d0ccc9',
          300: '#a9a49f',
          500: '#6b6561',
          700: '#3f3b38',
          900: '#2d2d2d', // Deep Charcoal
        },
        // Semantic aliases
        primary: '#E8A855',   // Saffron Gold
        secondary: '#2D2D2D', // Deep Charcoal
        background: '#F9F7F2', // Warm Bone
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Merriweather', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
