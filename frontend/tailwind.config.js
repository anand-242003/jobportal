/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: '#0a0a0a',
        white: '#ffffff',
        yellow: '#fbbf24',
        gray: {
          100: '#f5f5f5',
          200: '#e5e5e5',
          400: '#a3a3a3',
          800: '#262626',
        },
      },
      fontFamily: {
        heading: ['Archivo Black', 'Arial Black', 'sans-serif'],
        body: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['Courier New', 'monospace'],
      },
      borderWidth: {
        '3': '3px',
        '5': '5px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
}
