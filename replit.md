# CarbonIntelligence - Strategic Carbon Management Platform

## Overview

CarbonIntelligence (formerly CarbonConstruct AI) is a comprehensive strategic carbon management platform designed for the construction industry. The application provides AI-powered insights for portfolio optimization, regulatory compliance monitoring, carbon budget planning, and investment analysis. Built as a full-stack TypeScript application with a React frontend and Express backend, it leverages modern technologies to deliver intelligent carbon management solutions.

## User Preferences

```
Preferred communication style: Simple, everyday language.
```

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state
- **Authentication**: useAuth hook for session management and protected routes
- **Routing**: Wouter for client-side routing with authentication guards
- **Build Tool**: Vite for development and production builds
- **UI Components**: Extensive use of Radix UI primitives for accessibility

### Backend Architecture
- **Runtime**: Node.js with Express framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints with structured JSON responses
- **Authentication**: Replit Auth with OpenID Connect (supports Google, GitHub, X, Apple, email/password)
- **Session Management**: PostgreSQL-backed sessions with connect-pg-simple
- **Error Handling**: Centralized error middleware with structured error responses
- **Development**: Hot reload with Vite integration in development mode

### Database Strategy
- **ORM**: Drizzle ORM for type-safe database operations
- **Primary Database**: Supabase PostgreSQL (project: carbonconstruct-ver1) for production data
- **Hybrid Storage**: Composite storage pattern using both Supabase and in-memory storage
- **Migrations**: Drizzle Kit for schema management
- **Storage Pattern**: Interface-based storage abstraction enabling seamless switching between storage backends

## Key Components

### 1. Strategic Dashboard
Central hub displaying key performance indicators including:
- Total CO₂ emissions tracking
- Savings opportunities identification
- Net zero progress monitoring
- Active regulatory alerts
- Portfolio performance visualization

### 2. AI-Powered Services
- **OpenAI Integration**: GPT-4o model for intelligent analysis and recommendations
- **Portfolio Analysis**: Automated insights generation for emission patterns and optimization opportunities
- **Investment Analysis**: ROI calculations and opportunity identification
- **Carbon Budget Forecasting**: Predictive modeling for budget planning

### 3. External Service Integrations
- **CarbonConstruct API**: Specialized construction carbon data service
- **Regulatory Intelligence**: Multi-region compliance monitoring
- **Material Emission Factors**: Industry-specific carbon calculation data

### 4. Data Management
Comprehensive schema supporting:
- User management and role-based access
- Project lifecycle tracking
- Multi-scope emission categorization (Scope 1, 2, 3)
- Regulatory alert management
- Carbon budget planning and tracking
- Investment portfolio management
- AI insights storage and retrieval

## Data Flow

1. **Data Ingestion**: External APIs and user inputs feed into the storage layer
2. **Processing**: AI services analyze data patterns and generate insights
3. **Storage**: Structured data persisted via Drizzle ORM to PostgreSQL
4. **API Layer**: Express routes serve processed data to frontend
5. **Presentation**: React components display insights with interactive visualizations
6. **Real-time Updates**: TanStack Query manages cache invalidation and background updates

## External Dependencies

### Production Dependencies
- **Database**: Supabase PostgreSQL (project: carbonconstruct-ver1)
  - Tables: carbon_projects, unified_materials, carbon_reports
  - Secure connection via SUPABASE_URL and SUPABASE_ANON_KEY environment variables
- **AI Services**: OpenAI API for GPT-4o model access
- **Carbon Data**: CarbonConstruct API for industry-specific emission factors
- **Regulatory Data**: Government API integrations for compliance monitoring

### Development Dependencies
- **Replit Integration**: Specialized plugins for Replit environment
- **TypeScript**: Full type safety across frontend and backend
- **Build Tools**: Vite for fast development and optimized production builds

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite middleware integration with Express
- **Type Checking**: Incremental TypeScript compilation
- **Environment Variables**: Separate configuration for development APIs

### Production Build
- **Frontend**: Vite builds optimized React bundle to `dist/public`
- **Backend**: esbuild compiles TypeScript Express server to `dist/index.js`
- **Static Assets**: Express serves built frontend from production bundle
- **Environment**: Production-specific API endpoints and database connections

### Key Architectural Decisions

1. **Monorepo Structure**: Shared schema and utilities between client and server for type safety
2. **Hybrid Storage Architecture**: Composite storage pattern combining Supabase PostgreSQL for persistent data (projects, materials, reports) with in-memory storage for runtime caching and non-persistent data
3. **Supabase Integration**: Direct database access for carbon_projects, unified_materials, and carbon_reports tables with authentication checks on write operations
4. **Replit Auth Integration**: OpenID Connect authentication with PostgreSQL session storage, supporting multiple OAuth providers and email/password login
5. **AI-First Design**: OpenAI integration throughout the application for intelligent insights and recommendations
6. **Component Library**: shadcn/ui provides consistent, accessible UI components with Tailwind CSS
7. **Real-time Data**: TanStack Query enables efficient data fetching and caching for responsive user experience

## Supabase Integration Details

### Connected Tables
1. **carbon_projects**: Main project data with carbon footprint tracking
2. **unified_materials**: Material embodied carbon data with Australian emission factors
3. **carbon_reports**: Analytics summaries and reporting data

### Storage Implementation
- **SupabaseStorage class** (`server/supabase-storage.ts`): Implements IStorage interface for Supabase operations
  - Includes `ensureConfigured()` guard on all methods to verify credentials
  - Uses non-null assertion (`supabase!`) after configuration check
  - Handles date conversions with `toISOString()` helper function
- **Hybrid export** (`server/storage.ts`): Composite storage object with intelligent routing
  - `withSupabaseFallback` wrapper function for graceful degradation
  - Routes to Supabase when configured, falls back to MemStorage otherwise
  - Try-catch error handling with console warnings for debugging
- **Type-safe mappings**: Converts between Supabase snake_case and application camelCase naming
  - Project fields: carbon_footprint ↔ carbonFootprint, target_emissions ↔ targetEmissions
  - Material fields: material_type ↔ materialType, embodied_carbon ↔ embodiedCarbon
  - Date fields: Converts ISO strings to Date objects and vice versa

### Graceful Fallback Strategy
- **Configuration Detection**: `isSupabaseConfigured()` checks for required environment variables
- **Zero-Config Operation**: App runs fully functional without Supabase credentials using MemStorage
- **Production Path**: When credentials provided, Supabase handles persistent data storage
- **Error Resilience**: Network failures or Supabase errors automatically fallback to MemStorage
- **Transparent Migration**: Same IStorage interface regardless of backend, enabling seamless transition

### Authentication & Security
- **Replit Auth**: OpenID Connect authentication with session management
  - Environment variables: DATABASE_URL, SESSION_SECRET (auto-configured by Replit)
  - Sessions stored in PostgreSQL using connect-pg-simple
  - Middleware: `isAuthenticated` protects API routes requiring authentication
  - User identity: OAuth sub claim (string ID) used as primary key
  - Supported providers: Google, GitHub, X (Twitter), Apple, email/password
- **Supabase**: Database access control
  - Environment variables: SUPABASE_URL, SUPABASE_ANON_KEY
  - Row Level Security (RLS) policies enforced by Supabase
  - Write operations require authentication (handled by Supabase client)
  - Error handling with fallback mechanisms for unavailable data
  - Configuration checks prevent null pointer errors