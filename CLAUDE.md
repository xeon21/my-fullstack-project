# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Backend (NestJS)
```bash
# Development
npm run start:dev     # Start in watch mode with hot reload
npm run start:debug   # Start with debugging enabled

# Building & Production
npm run build        # Build the application
npm run start:prod   # Run the production build

# Testing
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:cov     # Run tests with coverage report
npm run test:e2e     # Run end-to-end tests

# Code Quality
npm run lint         # Lint and fix TypeScript files
npm run format       # Format code with Prettier
```

### Frontend (Next.js)
```bash
# Development
npm run dev          # Start development server with Turbopack

# Building & Production
npm run build        # Build the application
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run test         # Run Jest tests
```

## High-Level Architecture

### Full-Stack Application Structure
This is a full-stack TypeScript application with:
- **Backend**: NestJS REST API with MySQL database
- **Frontend**: Next.js 15 with App Router and React 19
- **Authentication**: JWT-based with role-based access control
- **State Management**: Zustand with persistence in frontend

### Backend Architecture (NestJS)
- **Modular Design**: Each feature is a separate NestJS module
- **Repository Pattern**: Data access abstracted in `*.repository.ts` files
- **Service Layer**: Business logic in `*.service.ts` files
- **DTO Pattern**: Request/response validation using DTOs
- **Authentication**: JWT with Passport strategy and Guards
- **Logging**: Winston with daily rotating file logs
- **API Documentation**: Swagger UI available at `/api-docs`

Key modules include:
- `auth/` - JWT authentication and authorization
- `userinfo/` & `login/` - User management
- `admin/` - Administrative functions
- `project/` - Project management
- `canvas-resolution/` - Canvas configuration
- `game/` - Game-related features
- `resource/` - System resource monitoring

### Frontend Architecture (Next.js)
- **App Router**: File-based routing with Next.js 15
- **Component Organization**: Feature-based component structure
- **Styling**: Hybrid approach using styled-components + Tailwind CSS
- **State Management**: Zustand stores for global state
- **API Integration**: Axios for HTTP requests
- **UI Features**: Drag-and-drop (dnd-kit), resizable components (react-rnd), charts (recharts)

Key features include:
- Dashboard with statistics and monitoring
- Scene editor with drag-and-drop functionality
- Board management system
- Tag status management
- Admin panel interface

### Development Philosophy
The project follows Test-Driven Development (TDD) principles:
1. **Red-Green-Refactor Cycle**: Write failing test → Make it pass → Refactor
2. **Clean First Approach**: Separate structural from behavioral changes
3. **Single Responsibility**: Keep methods small and focused
4. **Functional Programming**: Prefer functional style in TypeScript
5. **Commit Discipline**: Only commit when all tests pass

### Database Configuration
- **Primary Database**: MySQL with mysql2 driver
- **Secondary Database**: MongoDB with Mongoose (for specific features)
- **Connection Pooling**: Enabled for MySQL
- **Transactions**: Supported for data consistency

### Security Considerations
- JWT tokens for authentication
- bcrypt for password hashing
- Role-based access control (RBAC)
- CORS enabled for cross-origin requests
- 50MB request body limit for file uploads