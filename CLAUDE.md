# Deepsight - Trading Analytics Dashboard

## Project Overview

Deepsight is a Next.js-based trading analytics dashboard that provides comprehensive analysis of trading performance through Supabase database integration. The application tracks trading sessions, individual trades, and provides detailed analytics on win rates, confirmation patterns, and loss analysis.

## Tech Stack

- **Framework**: Next.js 15.4.1 with App Router
- **Language**: TypeScript 5.6.2
- **Database**: Supabase (PostgreSQL)
- **UI Framework**: React 18.3.1
- **Styling**: Tailwind CSS 3.4.17
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Charts**: Recharts 2.15.4
- **PWA**: Service Worker enabled
- **Build Tool**: Next.js with Turbopack

## Project Structure

```
/Users/egeberg/Desktop/Deepsight/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── components/         # Dashboard-specific components
│   │   ├── data.json          # Mock/sample data
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Main dashboard page
│   ├── components/ui/         # Reusable UI components (shadcn/ui)
│   ├── lib/
│   │   ├── database.ts        # Supabase client & data functions
│   │   └── utils.ts          # Utility functions
│   ├── hooks/                 # Custom React hooks (empty)
│   └── types/                 # TypeScript type definitions (empty)
├── public/                    # Static assets & PWA files
├── package.json              # Dependencies & scripts
└── configuration files
```

## Available Scripts

```bash
npm run dev         # Start development server with Turbopack
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
```

## Database Schema & Types

The application uses Supabase with the following main types:

### Core Types
- **Session**: Trading session data with win/loss counts, rates, earnings
- **Trade**: Individual trade records with confirmations and results
- **Analysis Types**: Various analytics for loss reasons, confirmations, day analysis

### Key Database Tables
- `sessions` - Trading session records
- `trades` - Individual trade records with session relationships

## Key Features

### 1. Dashboard Analytics
- Total earnings tracking
- Overall win rate calculation  
- Session count and trade count metrics
- Win/loss trade breakdown
- Sessions above/below 60% win rate

### 2. Data Visualization
- Interactive area charts (Recharts)
- Performance metrics cards
- Data tables for detailed analysis

### 3. Analysis Capabilities
- Loss reason analysis with confirmation breakdowns
- Confirmation pattern analysis
- Day-of-week performance analysis
- Win rate trends over time

### 4. PWA Support
- Service worker registration
- Standalone app capability
- Mobile-optimized design

## Architecture Patterns

### 1. Server Components
- Main page uses async server components for data fetching
- Direct database queries in server components
- No client-side state management for data

### 2. Database Layer (`/src/lib/database.ts`)
- Centralized Supabase client configuration
- Read-only query functions for dashboard metrics
- Type-safe database operations
- Error handling with fallback values

### 3. UI Component Structure
- shadcn/ui for base components
- Custom dashboard components in `/src/app/components/`
- Responsive design with Tailwind CSS
- Container queries for adaptive layouts

### 4. Styling System
- CSS variables for theming
- Tailwind CSS utility classes
- shadcn/ui design system
- Container query support

## Component Architecture

### Main Components
- **SectionCards**: Displays key metrics (earnings, win rate, sessions, trades)
- **ChartAreaInteractive**: Interactive charts for performance visualization
- **DataTable**: Tabular data analysis with multiple views
- **SiteHeader**: Application header/navigation

### UI Components (shadcn/ui)
Complete set of accessible UI primitives including buttons, cards, tables, charts, dialogs, and form components.

## Database Integration

### Connection Setup
```typescript
const supabase = createClient(supabaseUrl, supabaseKey);
```

### Key Query Functions
- `getTotalEarnings()` - Sum of all session earnings
- `getOverallWinRate()` - Calculated from all trades
- `getAllSessions()` - Complete session history
- `getConfirmationAnalysisWithCounts()` - Trading pattern analysis
- `getLossReasonsWithConfirmations()` - Loss analysis
- `getChartData()` - Time series data for charts

## Configuration

### Next.js Config (`next.config.ts`)
- Minimal configuration (webpack config removed)
- Default Next.js optimizations

### Tailwind Config (`tailwind.config.js`)
- Custom color scheme with CSS variables
- shadcn/ui integration
- Container queries plugin
- Responsive design utilities

### PWA Manifest (`public/manifest.json`)
- Standalone app mode
- Finance/productivity category
- Icon configuration for various sizes

## Development Guidelines

### 1. Data Flow
- Server-side data fetching in page components
- Props drilling for dashboard metrics
- No client-side state management currently implemented

### 2. Error Handling
- Database functions include try/catch with fallback values
- Graceful degradation for failed queries
- Console error logging

### 3. Performance
- Server-side rendering for initial load
- Parallel data fetching with Promise.all
- Turbopack for fast development builds

### 4. Code Organization
- Separation of concerns: UI components, data layer, utilities
- Type-safe database operations
- Consistent naming conventions

## Recent Changes (Based on Git History)

1. **Dashboard Migration**: Moved from `shadcn dashboard/` to `dashboard/` directory
2. **PWA Implementation**: Added service worker and manifest configuration
3. **Performance Issues**: Notes indicate slow function performance needs optimization

## Known Issues & Technical Debt


1. **Missing Features**: 
   - hooks/ and types/ directories are empty
   - No client-side state management
   - Limited error boundaries

## Future Development Areas

1. **Performance Optimization**
   - Database query optimization
   - Implement caching strategies
   - Consider client-side state management

2. **Feature Enhancements**
   - Real-time data updates
   - Advanced filtering and sorting
   - Export functionality
   - User authentication

3. **Code Structure Improvements**
   - Implement custom hooks
   - Add proper TypeScript types
   - Error boundary components
   - Loading states

## Environment Setup

1. Install dependencies: `npm install`
2. Configure Supabase credentials in `/src/lib/database.ts`
3. Start development: `npm run dev`
4. Access at `http://localhost:3000`

## Key Files for Development

- `/src/app/page.tsx` - Main dashboard page
- `/src/lib/database.ts` - All database operations
- `/src/app/components/` - Dashboard-specific components
- `/src/components/ui/` - Reusable UI components
- `package.json` - Dependencies and scripts
- `tailwind.config.js` - Styling configuration

This trading dashboard provides a solid foundation for analytics but requires performance optimization and additional features for production use.