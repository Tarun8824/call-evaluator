/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8f9ff',
        surface: '#f8f9ff',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#eff4ff',
        'surface-container': '#e5eeff',
        'surface-container-high': '#dce9ff',
        'surface-container-highest': '#d3e4fe',
        'on-surface': '#0b1c30',
        'on-surface-variant': '#434655',
        primary: '#004ac6',
        'primary-container': '#2563eb',
        'primary-fixed': '#dbe1ff',
        secondary: '#565e74',
        'secondary-container': '#dae2fd',
        tertiary: '#943700',
        'tertiary-container': '#bc4800',
        'error-container': '#ffdad6',
        error: '#ba1a1a',
        outline: '#737686',
        'outline-variant': '#c3c6d7',
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] },
    },
  },
  plugins: [],
};
