# Multiverse Workspace Guide

## Build Commands
- `bun run dev`: Start development server for all apps (ports 53XX)
- `bun run build`: Build all apps with type checking
- `bun run lint`: Lint all apps
- `bun run start`: Start all apps
- `bun run clean`: Clean build artifacts
- Build specific app: `bun run build:avalonstar` (also available for bryanveloso, omnyist)
- Docker/production: `docker compose -f docker-compose.dev.yml up -d` (ports 43XX)

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
- Imports use @multiverse/* namespace for shared packages
- Turbo for monorepo management
- Development ports: 5321-5323, Docker ports: 4321-4323

## Dependency Management
- Root package.json: Only Turbo and global dev tools/utilities
- @multiverse/config: All Tailwind and TypeScript configuration
- @multiverse/ui: React components with React as a dependency
- @multiverse/shared: Common utilities and middleware
- Individual apps: Reference shared packages with workspace:* protocol