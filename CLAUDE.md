# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Building
- `npm run build` - Builds all packages and the demo app
- `npm run build:packages` - Builds only the two packages (@theme and @i18n)
- `cd @theme && npm run build` - Build theme package individually
- `cd @i18n && npm run build` - Build i18n package individually

### Testing
- `npm run test` - Runs tests for packages and demo app
- `npm run test:packages` - Runs tests only for packages
- `npm run test:coverage` - Runs tests with coverage report
- `npm run test:ui` - Runs tests with Vitest UI
- `vitest` - Run tests in watch mode

### Development
- `npm run dev` - Starts the demo app development server
- `npm run lint` - Lints all code with ESLint
- `npm run clean` - Removes all build artifacts

## Architecture

This is a TypeScript monorepo containing two reusable React packages:

### @theme Package (`@theme/`)
- **Purpose**: Theme management with SSR support for light/dark mode switching
- **Key Components**:
  - `ThemeProvider` - Main provider component with cookie persistence
  - `ServerThemeWrapper` - SSR-compatible theme wrapper
  - `useTheme()` hook - Access theme state and switching function
- **Cookie-based persistence** for theme state survival across page reloads

### @i18n Package (`@i18n/`)
- **Purpose**: Platform-agnostic internationalization library
- **Key Features**:
  - Works anywhere (not React-specific)
  - Simple API: `t({ko: "안녕", en: "hello"})`
  - Variable interpolation: `{{name}}`
  - Built-in caching for performance
- **React Integration**:
  - `useTranslation()` hook - Translation function access
  - `useLocale()` hook - Current locale management
- **Core exports**: `./` (platform-agnostic) and `./react` (React hooks)

### Demo App (`src/`)
- Demonstrates both packages working together
- Shows theme switching, multi-language support, variable interpolation
- Uses Vite aliases (`@theme` and `@i18n`) pointing to package sources

### Build System
- **Root**: Uses Vite for demo app, TypeScript for type checking
- **Packages**: Each uses TypeScript compiler (`tsc`) for building
- **Testing**: Vitest for all testing needs
- **Dependencies**: React 19, packages have peer dependencies on React >=18

### Monorepo Structure
The packages are designed to be independent and publishable. The demo app imports from source (`@theme/src`, `@i18n/src`) via Vite aliases during development, but packages export from `dist/` when built.