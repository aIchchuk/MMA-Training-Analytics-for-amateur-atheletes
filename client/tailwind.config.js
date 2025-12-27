/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'mma-blue': '#2563eb', // Professional blue
                'mma-bg': '#f8fafc',  // Clean whitish background
                'mma-card': '#ffffff', // Pure white cards
                'mma-text': '#0f172a', // Dark slate for text
                'mma-gray': '#64748b', // Text/Border gray
            },
            fontFamily: {
                heading: ['Roboto', 'sans-serif'],
                body: ['Roboto', 'sans-serif'],
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 10px -2px rgba(0, 0, 0, 0.03)',
                'blue-glow': '0 0 15px rgba(37, 99, 235, 0.15)',
                'neo': '0 10px 15px -3px rgba(0, 0, 0, 0.02), 0 4px 6px -4px rgba(0, 0, 0, 0.02), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
            }
        },
    },
    plugins: [],
}
