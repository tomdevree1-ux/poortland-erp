/** Huisstijlgids blad 01 tot 03: kleuren, typografie en ritme als thema. */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: { 950: '#0F160F', 900: '#141C15', 850: '#1A241B', 800: '#222E24', 700: '#2E3B30', 600: '#3D4C3F', 500: '#56684F' },
        stone2: { 50: '#FAF6EE', 100: '#F4EEE1', 200: '#ECE3D2', 300: '#DBCEB5', 400: '#C2B393', 500: '#9C8E72', 600: '#6E6450', 700: '#4B4538' },
        bronze: { 600: '#8A6A3C', 500: '#A6824C', 400: '#C2A36B', 300: '#D9C194' },
        corten: { 600: '#8E4A2E', 500: '#A85638', 400: '#C27A57' },
        olive: { 600: '#5C5F37', 500: '#717544', 400: '#8C8F5C' },
        vlak: { canvas: '#FAF6EE', surface: '#FFFDF8', raised: '#F1E9D8', sunken: '#ECE3D2' },
        inkt: { DEFAULT: '#141C15', body: '#222E24', muted: '#6E6450', faint: '#9C8E72' }
      },
      fontFamily: {
        display: ['Cormorant', 'serif'],
        sans: ['"Hanken Grotesk"', 'system-ui', 'sans-serif']
      },
      borderRadius: { chip: '3px', control: '5px', card: '6px' },
      fontSize: { '2xs': '10.5px' }
    }
  },
  plugins: []
}
