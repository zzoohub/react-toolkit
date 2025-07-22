# React Toolkit

A monorepo containing reusable React packages with TypeScript support.

## Packages

- **@theme** - Theme management with SSR support for light/dark mode switching
- **@i18n** - Platform-agnostic internationalization library with React hooks

## Demo App

The root contains a demo application showcasing both packages working together.

- 🎨 **Theme switching**: Light/Dark mode with persistent storage
- 🌍 **Multi-language**: Korean, English, Japanese, French support
- 💾 **Cookie persistence**: Settings survive page reloads
- ⚡ **Performance optimized**: Caching and memoization built-in

## Development

```bash
# Install dependencies
npm install

# Start demo app
npm run dev

# Build all packages
npm run build

# Run tests
npm run test

# Build individual packages
cd @theme && npm run build
cd @i18n && npm run build
```

## Package Features

### @theme
- Light/Dark theme switching
- SSR-compatible theme provider
- Cookie-based persistence
- React hooks: `useTheme()`

### @i18n  
- Platform-agnostic (works anywhere)
- Simple API: `t({ko: "안녕", en: "hello"})`
- Variable interpolation: `{{name}}`
- React hooks: `useTranslation()`, `useLocale()`
- Built-in caching for performance

The demo app demonstrates:

- **Dynamic theme switching** with smooth transitions
- **Real-time language switching** across 4 languages
- **Variable interpolation** showing name and count examples
- **Persistent state** that survives page reloads
- **Combined usage** of both packages working together

## Project Structure

```
react-toolkit/
├── @theme/              # Theme management package
│   ├── src/
│   │   ├── components/  # ThemeProvider, ServerThemeWrapper
│   │   ├── context/     # ThemeContext
│   │   ├── hooks/       # useTheme
│   │   ├── types/       # TypeScript definitions
│   │   └── utils/       # Cookie utilities
│   ├── package.json
│   └── README.md
├── @i18n/              # Internationalization package
│   ├── src/
│   │   ├── core/       # Core translator logic
│   │   ├── react/      # React hooks
│   │   ├── types/      # TypeScript definitions
│   │   └── utils/      # Interpolation, locale detection
│   ├── package.json
│   └── README.md
└── src/                # Demo application
    ├── App.tsx         # Main demo component
    ├── index.css       # Theme-aware styles
    └── main.tsx        # App entry point
```

## License

MIT
