/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        charcoal: 'var(--color-bg)',
        'charcoal-light': 'var(--color-border)',
        'charcoal-surface': 'var(--color-surface)',
        ivory: 'var(--color-text)',
        'ivory-dim': 'var(--color-border-mid)',
        maroon: 'var(--color-danger)',
        'maroon-soft': 'color-mix(in srgb, var(--color-danger) 70%, transparent)',
        saffron: 'var(--color-primary)',
        'saffron-dim': 'var(--color-primary-dim)',
        'deep-green': 'var(--color-success)',
        'deep-green-soft': 'color-mix(in srgb, var(--color-success) 70%, transparent)',
        'warm-gray': 'var(--color-text-muted)',
        'warm-gray-dim': 'color-mix(in srgb, var(--color-text-muted) 80%, black)',
        'light-ivory': 'var(--color-bg)',
        'dark-ivory': 'var(--color-border-mid)',
        paper: 'var(--color-surface)',
        'border-subtle': 'var(--color-border)',
        'border-mid': 'var(--color-border-mid)',
        'surface-raised': 'var(--color-surface)',
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
