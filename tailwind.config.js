module.exports = {
	darkMode: ['class'],
	content: [
	  './index.html',
	  './src/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
    	extend: {
    		fontFamily: {
    			sans: ['Delight', 'Inter', 'sans-serif'],
    			delight: ['Delight', 'Inter', 'sans-serif']
    		},
    		fontSize: {
    			xs: [
    				'0.8rem',
    				{
    					lineHeight: '1rem'
    				}
    			]
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		colors: {
    			// New semantic color system
    			'text-primary': 'hsl(var(--text-primary))',
    			'text-secondary': 'hsl(var(--text-secondary))',
    			'text-tertiary': 'hsl(var(--text-tertiary))',
    			'text-muted': 'hsl(var(--text-muted))',
    			'text-on-accent': 'hsl(var(--text-on-accent))',
    			'bg-primary': 'hsl(var(--bg-primary))',
    			'bg-secondary': 'hsl(var(--bg-secondary))',
    			'bg-tertiary': 'hsl(var(--bg-tertiary))',
    			'accent-main': 'hsl(var(--accent-main))',
    			'border-primary': 'hsl(var(--border-primary))',
    			'border-secondary': 'hsl(var(--border-secondary))',
    			'border-muted': 'hsl(var(--border-muted))',
    			
    			// Original shadcn/ui colors
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			},
    			sidebar: {
    				DEFAULT: 'hsl(var(--sidebar-background))',
    				foreground: 'hsl(var(--sidebar-foreground))',
    				primary: 'hsl(var(--sidebar-primary))',
    				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
    				accent: 'hsl(var(--sidebar-accent))',
    				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
    				border: 'hsl(var(--sidebar-border))',
    				ring: 'hsl(var(--sidebar-ring))'
    			}
    		}
    	}
    },
	plugins: [
	  require("tailwindcss-animate"),
	  require('tailwind-scrollbar-hide'),
	  require('@tailwindcss/container-queries')
	],
  }