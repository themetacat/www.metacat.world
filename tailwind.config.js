export const purge = ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'];
export const darkMode = false;
export const theme = {
  extend: {
    colors: {
      mainDark: '#00D0EC',
      mainDark02: 'rgba(0, 208, 236, 0.2)',
      mainLight: '#00ECB3',
      mainLight02: 'rgba(0, 236, 179, 0.2)',
    },
  },
};
export const variants = {
  extend: {
    brightness: ['hover', 'active'],
  },
};
export const plugins = [];
