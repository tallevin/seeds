/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'app-bg': '#1a1a1a',
        'sidebar-bg': '#242424',
        'panel-bg': '#2a2a2a',
        'border': '#3a3a3a',
        'text-primary': '#ffffff',
        'text-secondary': '#888888',
        'text-muted': '#666666',
        'accent': '#4a4a4a',
        'highlight-yellow': '#a3923a',
        'highlight-pink': '#a34a6a',
      },
    },
  },
  plugins: [],
}
