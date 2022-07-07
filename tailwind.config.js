module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        mainDark: '#00D0EC',
        mainDark02: 'rgba(0, 208, 236, 0.2)',
        mainLight: '#00ECB3',
        mainLight02: 'rgba(0, 236, 179, 0.2)',
      },
    },
  },
  variants: {
    extend: {
      brightness: ['hover', 'active'],
    },
  },
  plugins: [],
};
