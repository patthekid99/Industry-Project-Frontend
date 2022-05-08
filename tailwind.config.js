module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      mb: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    extend: {
      colors: {
        chairgreen: {
          50: '#f5f6f6',
          100: '#eaeeee',
          200: '#cbd4d4',
          300: '#abbab9',
          400: '#6d8785',
          500: '#2e5351',
          600: '#294b49',
          700: '#233e3d',
          800: '#1c3231',
          900: '#172928',
        },
        gold: {
          50:  '#fdfaf2',
          100: '#faf5e6',
          200: '#f3e6bf',
          300: '#ebd699',
          400: '#dcb84d',
          500: '#cd9900',
          600: '#b98a00',
          700: '#9a7300',
          800: '#7b5c00',
          900: '#644b00',
        },
      }
    },
  },
  plugins: [require("@tailwindcss/line-clamp"),
            require('@tailwindcss/custom-forms'),
          ],
};
