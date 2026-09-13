/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        charcoal: '#1a1a1a',
        'charcoal-light': '#242424',
        'charcoal-surface': '#1e1e1e',
        ivory: '#f5f0e8',
        'ivory-dim': '#d9d2c5',
        maroon: '#8B1A1A',
        'maroon-soft': '#6b1515',
        saffron: '#E07B00',
        'saffron-dim': '#b86500',
        'deep-green': '#2D4A2D',
        'deep-green-soft': '#1f361f',
        'warm-gray': '#8a8070',
        'warm-gray-dim': '#5a5348',
        'light-ivory': '#faf7f0',
        'dark-ivory': '#e8e0d0',
        paper: '#f0ebe0',
        'border-subtle': '#2e2c28',
        'border-mid': '#3d3a34',
        'surface-raised': '#222220',
      },
      fontFamily: {
        mono: ['Courier Prime', 'Courier New', 'monospace'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'widest-plus': '0.2em',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
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
      },
    },
  },
  plugins: [],
}
