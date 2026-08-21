/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ace: {
          pink: '#EC1E8C',
          dark: '#C4106E',
          light: '#FCE4F1',
          black: '#1A1A1A',
          soft: '#333333',
          bg: '#FFFFFF',
          alt: '#F7F5F6',
          border: '#E5E5E5',
          divider: '#E5E1E3',
          success: '#1FA855',
          error: '#E0263D',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
        script: ['"Great Vibes"', 'cursive'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(26, 26, 26, 0.06)',
        'elevated': '0 12px 36px -4px rgba(26, 26, 26, 0.12)',
        'pink-glow': '0 4px 20px -2px rgba(236, 30, 140, 0.35)',
      },
      aspectRatio: {
        'portrait': '3/4',
        'story': '9/16',
      }
    },
  },
  plugins: [],
}
