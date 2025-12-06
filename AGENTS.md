# Agents Code Understanding

This document provides a summary of the technologies and architecture of the `stoat-vite` monorepo.

## Project Overview

This is a [Turborepo](https://turbo.build/repo) monorepo managed with [bun](https://bun.sh/). It contains a web application and several supporting packages.

## Applications

### `apps/web`

This is the main web application.

- **Framework:** [React](https://react.dev/)
- **Bundler:** [Vite](https://vitejs.dev/)
- **Routing:** [React Router](https://reactrouter.com/)
- **UI:** [Fluent UI](https://storybooks.fluentui.dev/)

## Packages

### `packages/javascript-client-sdk`

This package, named `stoat.js`, is a library for interacting with the Stoat API.

- **Framework:** It appears to be written using [SolidJS](https://www.solidjs.com/), which is notable since the main application uses React.

### `packages/eslint-config`

This package provides a shared [ESLint](https://eslint.org/) configuration for the monorepo.

### `packages/typescript-config`

This package contains shared [TypeScript](https://www.typescriptlang.org/) configurations used across the projects.

## Tooling

- **Linting:** [ESLint](https://eslint.org/)
- **Formatting:** [Prettier](https://prettier.io/)
- **Monorepo Management:** [Turborepo](https://turbo.build/repo)
- **Package Management:** [bun](https://bun.sh/)
