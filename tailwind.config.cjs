/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#ffffff",
        orange: "#FF8C00",
        black: "#0B0601",
        transparent: "transparent",
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        montserratAlt: ['"Montserrat Alternates"', 'sans-serif'],

        // Alias
        primary: ['"Montserrat Alternates"', 'sans-serif'],
        secondary: ['Montserrat', 'sans-serif'],
        base: ['Roboto', 'sans-serif'],
      },
      fontSize: {
        base: ['14px', '20px'],
        sm: ['16px', '24px'],
        md: ['18px', '28px'],
        lg: ['20px', '28px'],
        xl: ['24px', '32px'],
        '2xl': ['30px', '36px'],
        '3xl': ['48px', '48px'],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
    },
  },
  plugins: [],
}
