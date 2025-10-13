# Multiverse Workspace Guide

## Build Commands

- `bun run dev`: Start development server for all apps (ports 5321-5324)
- `bun run build`: Build all apps with type checking
- `bun run lint`: Lint all apps
- `bun run start`: Start all apps
- `bun run clean`: Clean build artifacts
- Build specific app: `bun run build:avalonstar.com` (also available for bryanvelo.so, omnyist.com)
- Docker (Production): `docker compose up -d` (ports 4321-4324)
- Docker (Single App Test): `docker build -t app-test -f docker/Dockerfile --build-arg APP_NAME=<app-name> . && docker run -p <port>:3000 -e DIST_PATH=./dist app-test`

## Code Style Guidelines

- **TypeScript**: Strict mode with all strict flags enabled (@ts-check required in config files)
- **Formatting**: 2-space indentation, single quotes, semicolons
- **Imports**: Type imports separate (`import type {...}`), named imports for modules
- **Components**: React components in PascalCase (Timeline.tsx)
- **Variables**: camelCase for variables/functions, PascalCase for types/interfaces
- **Error Handling**: Use try/catch patterns for middleware and async operations
- **Tailwind**: Custom configuration with shared design tokens
- **Project Structure**: Monorepo with shared configs in packages/config, UI components in packages/ui

## Architecture Notes

- Astro-based applications with React components
- Shared middleware in packages/shared
- Imports use @multiverse/\* namespace for shared packages
- Turbo for monorepo management
- Development ports: 5321-5324 (avalonstar.com, bryanvelo.so, omnyist.com)
- Docker ports: 4321-4324 (corresponding to each app)
- **URL Handling**: Astro middleware only works for SSR routes. For static sites, custom Bun server (docker/server.ts) handles:
  - Legacy URL redirects (e.g., `/blog/YEAR/MONTH/DAY/slug/` → `/blog/YEAR/slug`)
  - Section root redirects (e.g., `/blog/` → `/`)
  - Static file serving with proper MIME types
- **Enhanced Portfolio**: bryanvelo.so app includes new interactive components:
  - Skills matrix for filtering projects by technology
  - Expandable project cards with detailed information
  - Modal view for in-depth project exploration
  - The enhanced portfolio is accessible at `/enhanced-portfolio`

## Font System

- Font files are cached with appropriate headers via middleware
- Font initialization is handled in the build process via `init-fonts` turbo task
- Uses both variable fonts (@fontsource-variable) and standard web fonts (@fontsource)
- Font middleware in packages/shared/middleware/fonts.ts provides proper cache control
- Shared fonts are defined in packages/ui/styles/fonts.css

## Dependency Management

- Root package.json: Only Turbo and global dev tools/utilities
- @multiverse/config: All Tailwind and TypeScript configuration (now using Tailwind CSS v4)
- @multiverse/ui: React components with React as a dependency (updated to React 19)
- @multiverse/shared: Common utilities and middleware
- Individual apps: Reference shared packages with workspace:\* protocol

## Recent Updates

- Upgraded to Tailwind CSS v4.1.5
- Upgraded to React 19.1.0
- Added enhanced portfolio components to bryanvelo.so app
- Refactored app folder structure to use domain names (avalonstar → avalonstar.com, bryanveloso → bryanvelo.so, omnyist → omnyist.com)
- Updated font middleware for better caching
- Bumped TypeScript to 5.8.3
- Improved server-side error handling
- Added AWS SDK for S3 integration
