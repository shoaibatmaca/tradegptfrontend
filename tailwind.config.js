/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-bg': '#111827',
        'sidebar-bg': '#1f2937',
        'card-bg': '#2d3748',
        'input-bg': '#1e293b',
        'hover-bg': '#374151',
        'primary-text': '#ffffff',
        'secondary-text': '#9ca3af',
        'primary-accent': '#10b981',
        'danger': '#ef4444',
        'warning': '#f59e0b',
      },
      borderRadius: {
        'xl': '12px',
      },
    },
  },
  plugins: [],
}
