/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory:   '#FFF8F0',
        cream:   '#FAF3E8',
        saffron: '#F7941D',
        sindoor: '#CC2936',
        indigo:  '#1A237E',
        peacock: '#168AAD',
        marigold:'#FFB627',
        'deep-peacock': '#004D5A',
        'warm-brown':   '#2D1B0E',
        'med-brown':    '#4A3728',
        'gold':         '#D4AF37',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:    ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono:    ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
