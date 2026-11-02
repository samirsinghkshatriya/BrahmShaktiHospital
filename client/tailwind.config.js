/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Official Brahm Shakti Palette Specification
        primary: {
          DEFAULT: '#0F766E', // Deep Medical Teal
          hover: '#0D655E',
          light: '#14B8A6',
          dark: '#0B5953',
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A'
        },
        secondary: {
          DEFAULT: '#12304A', // Healthcare Navy
          dark: '#0B1F31',
          light: '#1B466B',
          50: '#F0F4F8',
          100: '#D9E3EC',
          900: '#0A1B2A'
        },
        accent: {
          DEFAULT: '#D1FAE5', // Soft Mint
          hover: '#A7F3D0',
          dark: '#065F46'
        },
        medical: {
          white: '#FFFFFF',
          coolgray: '#F4F8FA',
          slate: '#1E293B',
          muted: '#64748B',
          border: '#E2E8F0',
          card: '#FFFFFF'
        },
        status: {
          success: '#16A34A',
          warning: '#F59E0B',
          error: '#DC2626'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(18, 48, 74, 0.05)',
        'elevated': '0 10px 30px -5px rgba(18, 48, 74, 0.08), 0 4px 6px -2px rgba(18, 48, 74, 0.03)',
        'card-hover': '0 20px 35px -5px rgba(15, 118, 110, 0.12), 0 10px 15px -5px rgba(18, 48, 74, 0.06)'
      }
    },
  },
  plugins: [],
}
