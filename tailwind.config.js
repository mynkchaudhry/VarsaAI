/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: '#F8F5F0',
        'cream-dark': '#F0EBE3',
        navy: '#1A1A2E',
        'navy-mid': '#252545',
        'navy-soft': '#EEEEF6',
        ink: '#0D0D0D',
        charcoal: '#3A3A3A',
        stone: '#888480',
        pebble: '#B8B3AC',
        border: '#E8E3DB',
        'border-strong': '#CCC7BF',
        surface: '#FFFFFF',
      },
      animation: {
        'fade-up': 'fadeUp .5s ease both',
        'fade-in': 'fadeIn .4s ease both',
        'slide-down': 'slideDown .3s ease both',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(18px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        slideDown: {
          from: { opacity: 0, transform: 'translateY(-8px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.05)',
        'card-hover': '0 6px 24px rgba(0,0,0,0.1), 0 2px 6px rgba(0,0,0,0.06)',
        'card-lg': '0 8px 32px rgba(0,0,0,0.12)',
        input: '0 0 0 3px rgba(26,26,46,0.08)',
      },
    },
  },
  plugins: [],
}
