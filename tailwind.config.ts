import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      // Compact page gutter (was 2rem); surfaces also use px-4
      padding: {
        DEFAULT: '1rem',
        lg: '1.5rem',
      },
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar))',
          foreground: 'hsl(var(--sidebar-foreground))',
          muted: 'hsl(var(--sidebar-muted))',
          border: 'hsl(var(--sidebar-border))',
        },
        footer: 'hsl(var(--footer))',
        nav: {
          DEFAULT: 'hsl(var(--nav))',
          foreground: 'hsl(var(--nav-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        raised: 'var(--shadow-raised)',
      },
      spacing: {
        /* Named aliases for design-system docs (map to existing scale) */
        'page-x': '1rem',
        'page-x-lg': '1.5rem',
        'section': '1rem',
        'card': '1rem',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-in-from-top': {
          from: { transform: 'translateY(-100%)' },
          to: { transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in': 'slide-in-from-top 0.3s ease-out',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'hsl(var(--foreground))',
            a: {
              color: 'hsl(var(--primary))',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            h2: {
              fontSize: '1rem',
              fontWeight: '600',
              lineHeight: '1.375',
              marginTop: '1.25rem',
              marginBottom: '0.5rem',
            },
            h3: {
              fontSize: '0.875rem',
              fontWeight: '500',
              lineHeight: '1.375',
              marginTop: '1rem',
              marginBottom: '0.375rem',
            },
            p: {
              fontSize: '0.875rem',
              lineHeight: '1.625',
              marginTop: '0.5rem',
              marginBottom: '0.5rem',
            },
          },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};

export default config;
