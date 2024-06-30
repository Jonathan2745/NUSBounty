/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html", "./pages/**/*.{js,jsx,ts,tsx}" ],
  theme: {
    extend: {
      colors: {
        'amplify-teal': 'hsl(190, 95%, 30%)'
      }
    },
  },
  plugins: [],
}

