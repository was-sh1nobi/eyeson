export default {
  darkMode: ["class"],
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx,svelte}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        ring: "var(--ring)",
        border: "var(--border)",
        // Semantic brand aliases — always via tokens
        surface: "var(--color-surface)",
        "surface-raised": "var(--color-surface-raised)",
        primary: "var(--color-primary)",
        "primary-hover": "var(--color-primary-hover)",
        teal: {
          500: "var(--primitive-teal-500)",
          600: "var(--primitive-teal-600)",
          700: "var(--primitive-teal-700)",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "sans-serif"],
        heading: ["Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        full: "var(--radius-full)",
      },
      spacing: {
        "2xs": "var(--space-2xs)",
        xs: "var(--space-xs)",
        sm: "var(--space-sm)",
        md: "var(--space-md)",
        lg: "var(--space-lg)",
        xl: "var(--space-xl)",
        "2xl": "var(--space-2xl)",
        "3xl": "var(--space-3xl)",
        "4xl": "var(--space-4xl)",
        section: "var(--space-section)",
        gutter: "var(--space-gutter)",
      },
      maxWidth: {
        container: "var(--container-max)",
        "container-wide": "var(--container-wide)",
      },
      boxShadow: {
        subtle: "var(--elevation-1)",
        medium: "var(--elevation-2)",
        floating: "var(--elevation-3)",
        glow: "var(--elevation-glow)",
        "glow-strong": "var(--elevation-glow-strong)",
      },
      transitionDuration: {
        fast: "var(--duration-fast)",
        normal: "var(--duration-normal)",
        slow: "var(--duration-slow)",
      },
      transitionTimingFunction: {
        default: "var(--ease-default)",
        emphasized: "var(--ease-emphasized)",
        entrance: "var(--ease-entrance)",
        exit: "var(--ease-exit)",
      },
      height: {
        "control-sm": "var(--height-control-sm)",
        "control-md": "var(--height-control-md)",
        "control-lg": "var(--height-control-lg)",
      },
    },
  },
  plugins: [],
}