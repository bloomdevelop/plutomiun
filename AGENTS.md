# Agents Code Understanding

This document provides guidance for AI agents working in the `stoat-vite` monorepo.

## Project Overview

This is a [Turborepo](https://turbo.build/repo) monorepo managed with [bun](https://bun.sh/).

### Applications

- **`apps/web`**: React + Vite + Fluent UI web application
  - React Router for routing
  - React Hook Form for forms
  - Error boundaries with react-error-boundary

### Packages

- **`packages/javascript-client-sdk`** (`stoat.js`): SolidJS-based API client library
- **`packages/eslint-config`**: Shared ESLint configuration
- **`packages/typescript-config`**: Shared TypeScript configurations

## Commands

### Root Level (Turborepo)

```bash
# Development
bun dev                    # Start all dev servers

# Building
bun build                  # Build all packages and apps

# Linting and Formatting
bun lint                   # Lint all packages
bun format                 # Format all files with Prettier
```

### SDK Package (`packages/javascript-client-sdk`)

```bash
cd packages/javascript-client-sdk

# Build
bun run build              # Compile TypeScript
bun run build:watch        # Watch mode with auto-restart

# Code Quality
bun run lint               # Run ESLint
bun run lint:fix           # Fix ESLint issues
bun run typecheck          # Type check without emit
bun run fmt                # Format with Prettier
bun run fmt:check          # Check formatting

# Testing
bun test.mjs               # Run manual test (requires TOKEN env var)
```

### Web App (`apps/web`)

```bash
cd apps/web

# Development
bun dev                    # Start Vite dev server
bun run preview            # Preview production build

# Build
bun run build              # Type check and build

# Linting
bun run lint               # ESLint on src/**/*.ts
```

## Code Style Guidelines

### TypeScript

- **Strict mode enabled** - No implicit any, strict null checks
- Use explicit return types for exported functions
- Prefer `type` over `interface` for object shapes
- Use `.ts` extension for files (ES modules)

### Imports

Order (enforced by Prettier plugin):

1. Framework imports (React, SolidJS)
2. Third-party modules
3. Parent directory imports (`../`)
4. Sibling/relative imports (`./`)

```typescript
// React app imports
import { useState } from "react";
import { Button } from "@fluentui/react-components";
import { useStoat } from "../contexts/stoat";
import AppHeader from "./components/app-header";

// SDK imports (SolidJS)
import { createSignal } from "solid-js";
import { API } from "stoat-api";
import { Client } from "./Client.js"; // Note: .js extension required
```

### Naming Conventions

- **Files**: kebab-case for components (`app-header.tsx`), camelCase for utilities
- **Components**: PascalCase function names, default exports
- **Hooks**: camelCase starting with `use`
- **Types/Interfaces**: PascalCase
- **Constants**: UPPER_SNAKE_CASE for true constants
- **Collections**: Suffix with `Collection` (e.g., `UserCollection`)

### React Components

```typescript
// Use default exports for page components
export default function AppHeader() {
  const styles = useStyles();
  // ...
}

// Fluent UI makeStyles pattern
const useStyles = makeStyles({
  root: {
    /* styles */
  },
});
```

### Error Handling

- Use error boundaries for React components
- Log errors with `console.error` or `console.info`
- Type error callbacks explicitly

### Formatting

- 2 spaces indentation
- No semicolons (enforced by Prettier)
- Single quotes for strings
- Trailing commas

## Architecture Notes

- **Web app** uses React with Fluent UI's makeStyles for styling
- **SDK** uses SolidJS signals and is consumed by the web app
- Shared packages use `@repo/` prefix (e.g., `@repo/eslint-config`)
- The SDK package requires `.js` extensions in imports despite using TypeScript

## Environment Variables

- SDK test file uses `TOKEN` env var for bot authentication
- Use `.env` files at root for shared variables
