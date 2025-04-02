/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    // colors: {
    //   void: "#070D27",
    //   voidLight: "#20304C",
    //   opulent: "#0250F4",
    //   azure: "#0692F2",
    //   glitter: "#43BCFF",
    //   frost: "#E3E8F4",
    //   white: "#ffffff",
    //   black: "#000000",
    //   transparent: "transparent",
     
    // },
    fontFamily: {
      primary: ['Syoog', 'sans-serif'], // Ignorar por enquanto
      secondary: ['Exo', 'sans-serif'],
    },
    extend: {
      spacing: {
        '8xl': '96rem',
        '9xl': '128rem',
      },
      
      borderRadius: {
        '4xl': '2rem',
      },
      fontSize: {
        // Reutilizáveis
        'text-xs': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0' }], // 14px
        'text-sm': ['1rem', { lineHeight: '1.5', letterSpacing: '0' }],     // 16px
        'text-md': ['1.125rem', { lineHeight: '1.5', letterSpacing: '0' }], // 18px
        'text-lg': ['1.25rem', { lineHeight: '1.5', letterSpacing: '0' }],  // 20px
        'text-xl': ['1.5rem', { lineHeight: '1.4', letterSpacing: '0' }],   // 24px
        'text-xl-semibold': ['1.75rem', { lineHeight: '1.2', letterSpacing: '0' }],
        'text-2xl': ['2rem', { lineHeight: '1.3', letterSpacing: '0' }],    // 32px
        'text-3xl': ['2.5rem', { lineHeight: '1.2', letterSpacing: '0' }],  // 40px
        'text-4xl': ['3rem', { lineHeight: '1.2', letterSpacing: '0' }],    // 48px
        'text-5xl': ['3.5rem', { lineHeight: '1.2', letterSpacing: '0' }],  // 56px

        // Específicos
        'button-fakecard': ['1.222rem', { lineHeight: '1.5', letterSpacing: '0' }], // 19.55px
        'button-fakecard-mono': ['1.222rem', { lineHeight: '1.5', letterSpacing: '0' }],
        'title-name-person': ['2rem', { lineHeight: '1.3', letterSpacing: '0' }],
      },
      fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
    },
  },
  plugins: [],
}
