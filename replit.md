# Mitosis Educational Game

## Overview

This is an educational web application designed to teach students about cell division (mitosis) through interactive games and quizzes. The application features multiple game modes including matching, ordering, multiple choice, fill-in-the-blank, and timed challenges. Teachers can monitor student progress through a password-protected dashboard that tracks student answers and performance.

The application is built as a full-stack web app with a React frontend and Express backend, storing student responses in a PostgreSQL database for review and assessment purposes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server, configured with custom aliases for cleaner imports (`@/` for client code, `@shared/` for shared types)
- Hot Module Replacement (HMR) enabled for rapid development

**UI Component System**
- Radix UI primitives for accessible, unstyled components (dialogs, dropdowns, tooltips, etc.)
- Custom component library built on top of Radix using Tailwind CSS and class-variance-authority for consistent styling
- shadcn/ui design system patterns for component composition

**State Management**
- Zustand stores for client-side state management (student information, game state, audio preferences)
- TanStack Query (React Query) for server state management and data fetching
- Local storage persistence for user preferences

**Styling Approach**
- Tailwind CSS for utility-first styling with custom theme configuration
- CSS variables for dynamic theming support (light/dark mode ready)
- PostCSS with Autoprefixer for cross-browser compatibility

**3D Graphics & Visualization**
- React Three Fiber for WebGL-based 3D rendering
- Three.js Drei for common 3D helpers and abstractions
- Custom Canvas components for rendering mitosis phases (currently 2D canvas, structured for potential 3D upgrade)
- GLSL shader support via vite-plugin-glsl

### Backend Architecture

**Server Framework**
- Express.js as the HTTP server framework
- TypeScript with ESM modules for modern JavaScript support
- Custom middleware for request logging and JSON response capture

**API Design**
- RESTful API endpoints under `/api` prefix
- Student answers endpoint (`/api/student-answers`) supporting GET (fetch all) and POST (submit answer) operations
- JSON request/response format with error handling middleware

**Development & Production**
- Vite middleware integration in development for seamless frontend/backend development
- Static file serving for production builds
- Custom logging system with timestamps and request duration tracking

### Data Storage

**Database**
- PostgreSQL as the primary database (via Neon serverless)
- Drizzle ORM for type-safe database queries and schema management
- Schema-first approach with TypeScript types automatically inferred from database schema

**Database Schema**
- `users` table: Basic user authentication structure (username, password)
- `student_answers` table: Stores student responses with fields for student name, game mode, question, student answer, correct answer, correctness flag, and timestamp
- Migration system using Drizzle Kit for schema versioning

**Data Access Layer**
- Storage abstraction interface (`IStorage`) for potential future database swapping
- DatabaseStorage implementation with methods for users and student answers
- Shared types between frontend and backend via `@shared/schema` module

### Authentication & Authorization

**Teacher Access**
- Password-protected teacher view for monitoring student progress
- Client-side password validation (currently hardcoded as "DariusPetree" - should be moved server-side for production)
- Query-based authorization using TanStack Query's `on401` handling

**Student Identification**
- Name-based student tracking (no authentication required)
- Student name stored in Zustand store and persisted to local storage
- Student form enforced before game access

### External Dependencies

**Database Service**
- Neon Serverless PostgreSQL for cloud-hosted database
- Connection via `@neondatabase/serverless` client
- Environment-based configuration via `DATABASE_URL`

**UI Component Libraries**
- Radix UI component primitives for 30+ accessible components
- Lucide React for icon system
- Sonner for toast notifications
- React Day Picker for calendar/date functionality

**3D & Graphics Libraries**
- Three.js for WebGL rendering engine
- React Three Fiber for React integration
- @react-three/drei for helpful 3D utilities
- @react-three/postprocessing for visual effects

**Form & Validation**
- Zod for runtime type validation and schema definitions
- Drizzle Zod for database schema validation
- React Hook Form integration ready (via form UI components)

**Development Tools**
- TSX for running TypeScript in development
- ESBuild for production bundling
- Drizzle Kit for database migrations
- @replit/vite-plugin-runtime-error-modal for enhanced error display

**Styling & Theming**
- Tailwind CSS with custom configuration
- Class Variance Authority for component variants
- clsx and tailwind-merge for conditional class composition
- @fontsource/inter for typography