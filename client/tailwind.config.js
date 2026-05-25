/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // class-based dark mode
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        primary: {
          DEFAULT: "#b20900",    // Bold red
          light: "#e53939",
          dark: "#7f0000",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#0066cc",    // Professional blue
          light: "#3399ff",
          dark: "#004080",
          foreground: "#ffffff",
        },
        success: {
          DEFAULT: "#28a745",
          light: "#71d88c",
          dark: "#1c6f34",
          foreground: "#ffffff",
        },
        warning: {
          DEFAULT: "#ff9800",
          light: "#ffc34d",
          dark: "#b26a00",
          foreground: "#000000",
        },
        error: {
          DEFAULT: "#dc3545",
          light: "#ff6b6b",
          dark: "#a71d2a",
          foreground: "#ffffff",
        },

        // Neutral / backgrounds
        card: "#f9f9f9",
        cardDark: "#1E1E2F",
        background: "#ffffff",
        backgroundDark: "#121212",
        foreground: "#1F2937",
        foregroundDark: "#F5F5F7",
        muted: "#6B7280",
        mutedDark: "#9CA3AF",
      },

      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        serif: ['Merriweather', 'serif'],
      },

      boxShadow: {
        soft: "0 4px 20px rgba(0,0,0,0.1)",
        card: "0 2px 12px rgba(0,0,0,0.12)",
        elevated: "0 10px 25px rgba(0,0,0,0.15)",
      },

      borderRadius: {
        xl: "1rem",
        '2xl': "1.5rem",
      },

      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
