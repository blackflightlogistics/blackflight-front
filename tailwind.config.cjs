/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#ffffff",
        orange: "#FF8C00",
        orangeBorder: "#FFE8D0",
        black: "#0B0601",
        transparent: "transparent",
        lightGrey:"#D1D5DB"
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
        base: ['0.875rem', '1.25rem'],    // 14px / 20px
        sm: ['1rem', '1.5rem'],           // 16px / 24px
        md: ['1.125rem', '1.75rem'],      // 18px / 28px
        lg: ['1.25rem', '1.75rem'],       // 20px / 28px
        xl: ['1.5rem', '2rem'],           // 24px / 32px
        '2xl': ['1.875rem', '2.25rem'],   // 30px / 36px
        '3xl': ['3rem', '3rem'],          // 48px / 48px
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
