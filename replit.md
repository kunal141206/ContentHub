# Personalized Content Dashboard

## Overview

This is a modern, personalized content dashboard built with React and TypeScript that aggregates content from multiple sources including news, movies, social media, sports, and music. The application provides users with a customizable, interactive interface to track and engage with their preferred content types.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with a clear separation between client and server components:

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **State Management**: Redux Toolkit for global state management
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Routing**: Wouter for lightweight client-side routing
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful API with structured error handling

## Key Components

### Database Schema
The application uses four main database tables:
- **users**: User authentication and basic profile information
- **userPreferences**: Stores user content preferences, categories, and theme settings
- **favorites**: Tracks user-favorited content items across all content types
- **contentItems**: Cached content from external APIs with metadata

### Content Management System
- **Content Types**: Supports news, movies, social media, sports, and music content
- **External API Integration**: Integrates with NewsAPI, TMDB, and social media APIs
- **Content Aggregation**: Unified content feed with personalized recommendations
- **Search Functionality**: Cross-content search with debounced input and suggestions

### User Interface Components
- **Responsive Layout**: Mobile-first design with collapsible sidebar navigation
- **Content Cards**: Specialized card components for each content type (NewsCard, MovieCard, SocialCard, etc.)
- **Drag & Drop**: Reorderable content with custom drag-and-drop implementation
- **Theme System**: Light/dark mode support with CSS variables
- **Infinite Scrolling**: Pagination support for large content sets

### State Management
- **Redux Slices**:
  - `contentSlice`: Manages content items, loading states, and view preferences
  - `preferencesSlice`: Handles user preferences and category selections
  - `favoritesSlice`: Tracks user-favorited content items
- **Local Storage**: Persists user preferences and theme settings

## Data Flow

1. **User Authentication**: Basic user system with preferences tied to user ID
2. **Preference Loading**: User preferences loaded on dashboard initialization
3. **Content Fetching**: Content retrieved based on user's selected categories and preferences
4. **Real-time Updates**: React Query handles background refetching and cache invalidation
5. **Interactive Features**: Favorites, search, and content reordering update both local state and server

## External Dependencies

### APIs
- **NewsAPI**: Fetches latest news based on categories (API key required)
- **TMDB API**: Provides movie recommendations and metadata (API key required)
- **Social Media APIs**: Planned integration for social content

### UI Libraries
- **Radix UI**: Accessible, unstyled component primitives
- **Framer Motion**: Animation library for smooth interactions
- **Lucide React**: Icon library for consistent iconography
- **React Hook Form**: Form state management with validation

### Development Tools
- **Drizzle Kit**: Database migrations and schema management
- **Zod**: Runtime type validation for API data
- **ESBuild**: Fast JavaScript bundler for production builds

## Deployment Strategy

### Development Environment
- **Vite Dev Server**: Hot module replacement for fast development
- **Express Middleware**: Vite integrated with Express for API development
- **TypeScript Compilation**: Real-time type checking and compilation

### Production Build
- **Client Build**: Vite builds optimized static assets to `dist/public`
- **Server Build**: ESBuild bundles server code to `dist/index.js`
- **Environment Variables**: Database URL and API keys configured via environment
- **Database Migrations**: Drizzle Kit handles schema updates and migrations

### Database Configuration
- **Connection**: PostgreSQL via Neon Database serverless platform
- **ORM**: Drizzle ORM with TypeScript-first approach
- **Migrations**: Schema changes tracked in `./migrations` directory
- **Connection Pooling**: Built-in connection management for serverless environment

The application is designed to be deployed on platforms like Replit, Vercel, or similar services that support Node.js applications with PostgreSQL databases.