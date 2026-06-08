/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        base:      '#F0F4F0',
        surface1:  '#FFFFFF',
        surface2:  '#F7F9F7',
        surface3:  '#E8EFE8',
        primary:   '#2D6A4F',
        secondary: '#52B788',
        accent:    '#95D5B2',
        coral:     '#E76F51',
        amber:     '#F4A261',
        sky:       '#457B9D',
        dark:      '#1B2B1E',
        muted:     '#6B7E6E',
      },
      fontFamily: {
        sans:    ['DM Sans', 'sans-serif'],
        display: ['DM Serif Display', 'serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        card: '0 2px 12px rgba(45,106,79,0.08)',
        hero: '0 8px 32px rgba(45,106,79,0.20)',
      },
      backgroundImage: {
        'green-gradient':
          'linear-gradient(135deg, #2D6A4F, #52B788)',
        'mint-gradient':
          'linear-gradient(135deg, #95D5B2, #52B788)',
      },
    },
  },
  plugins: [],
};
