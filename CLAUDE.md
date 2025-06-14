# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Monorepo-wide commands (run from root)
- `pnpm install` - Install all dependencies across the monorepo
- `pnpm build` - Build all packages and apps
- `pnpm dev` - Start all apps in development mode
- `pnpm lint` - Run ESLint across all packages
- `pnpm format` - Format all TypeScript and Markdown files with Prettier

### App-specific commands
**Web app** (`apps/web/`):
- `pnpm dev` - Start Vite dev server
- `pnpm build` - Build for production (tsc + vite build)
- `pnpm preview` - Preview production build locally

**Infrastructure** (`apps/infra/`):
- `pnpm build` - Compile TypeScript
- `pnpm watch` - Watch mode for TypeScript compilation
- `pnpm cdk <command>` - Run AWS CDK commands

## Architecture Overview

This is a Turborepo monorepo with the following structure:

- **apps/web**: React + Vite web application
- **apps/infra**: AWS CDK infrastructure definitions
- **packages/ui**: Shared React component library used across apps
- **packages/eslint-config**: Shared ESLint configuration
- **packages/typescript-config**: Shared TypeScript configurations

### Key architectural decisions:

1. **Monorepo Management**: Uses Turborepo for orchestrating builds with dependency graph resolution and caching
2. **Package Manager**: PNPM v10.2.0 with workspaces for efficient dependency management
3. **Shared Dependencies**: Common UI components and configurations are extracted into packages to ensure consistency
4. **Build Pipeline**: Turborepo ensures packages are built in the correct order based on dependencies (e.g., `@repo/ui` builds before apps that depend on it)

### Development Workflow

When making changes:
1. Shared components go in `packages/ui`
2. App-specific code stays in the respective app directory
3. Infrastructure changes are made in `apps/infra`
4. All packages use the shared TypeScript and ESLint configs from the packages directory

The monorepo setup ensures that changes to shared packages automatically trigger rebuilds of dependent apps when running `pnpm dev`.