# Stoat Vite

Microsoft Teams, but on Stoat.chat.

> Currently unfinished, so the progress is very slow.

> Also, this is a monorepo along with a stoat.js fork

## Screenshots

![Screenshot](.github/assets/main.png)

## File Structure (Apps and Packages)

- `web`: react [vite](https://vitejs.dev) ts app
- `@repo/ui`: a stub component library shared by `web` application
- `@repo/eslint-config`: shared `eslint` configurations
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo
- `javascript-client-sdk`: modified stoat.js designed for client usage
