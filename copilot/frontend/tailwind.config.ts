import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#ecad0a',
        primary: '#209dd7',
        secondary: '#753991',
        navy: '#032147',
        graytext: '#888888',
      },
      boxShadow: {
        card: '0 20px 40px rgba(3, 33, 71, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
