# zzoo-i18n

Platform-agnostic internationalization library with TypeScript support.

## Features

- 🌐 **Platform Independent**: Works in browser, Node.js, and SSR environments
- 🚀 **High Performance**: Built-in caching and memoization
- 💪 **TypeScript**: Full type safety with excellent IntelliSense
- ⚡ **Simple API**: Intuitive `t({ko: "안녕", en: "hello"})` syntax
- 🍪 **Cookie Storage**: Persists locale preference across sessions
- ⚛️ **React Support**: Optional React hooks for reactive updates
- 🎯 **Zero Dependencies**: Core library has no runtime dependencies

## Installation

```bash
npm install zzoo-i18n
```

## Quick Start

### Basic Usage

```typescript
import { t, setLocale } from 'zzoo-i18n';

// Set current locale
setLocale('ko');

// Translate with object syntax
const greeting = t({
  ko: '안녕하세요',
  en: 'Hello',
  ja: 'こんにちは'
});
console.log(greeting); // "안녕하세요"

// With variable interpolation
const welcome = t({
  ko: '환영합니다, {{name}}님!',
  en: 'Welcome, {{name}}!'
}, { name: 'John' });
console.log(welcome); // "환영합니다, John님!"
```

### Advanced Usage

```typescript
import { createTranslator } from 'zzoo-i18n';

const translator = createTranslator({
  fallbackLocale: 'en',
  debugMode: process.env.NODE_ENV === 'development'
});

translator.setLocale('ko');

const message = translator.t({
  ko: '{{count}}개의 새 메시지',
  en: '{{count}} new messages'
}, { count: 5 });
```

### React Integration

```typescript
import { useTranslation } from 'zzoo-i18n/react';

function MyComponent() {
  const { t, locale, setLocale } = useTranslation();
  
  return (
    <div>
      <h1>{t({ ko: '안녕하세요', en: 'Hello' })}</h1>
      <p>Current locale: {locale}</p>
      <button onClick={() => setLocale(locale === 'ko' ? 'en' : 'ko')}>
        Switch Language
      </button>
    </div>
  );
}
```

## API Reference

### Core Functions

#### `t(translation, variables?)`
Main translation function.
- `translation`: Object with locale keys and translated strings
- `variables`: Optional object for string interpolation

#### `setLocale(locale)`
Set the current locale.

#### `getLocale()`
Get the current locale.

#### `autoDetectLocale()`
Auto-detect locale from environment.

### Advanced API

#### `createTranslator(options?)`
Create a new translator instance.
- `fallbackLocale`: Fallback locale (default: 'en')
- `debugMode`: Enable debug logging (default: false)

### React Hooks

#### `useTranslation(options?)`
React hook with reactive locale changes.

#### `useTranslationStatic(options?)`
React hook without reactivity (better performance).

#### `useLocale(options?)`
Hook for locale management only.

## String Interpolation

Use `{{variableName}}` syntax for dynamic values:

```typescript
const message = t({
  ko: '안녕하세요, {{name}}님! {{count}}개의 알림이 있습니다.',
  en: 'Hello, {{name}}! You have {{count}} notifications.'
}, {
  name: 'John',
  count: 3
});
```

## Locale Detection

The library automatically detects locale in this order:

1. **Browser**: URL params (`?lang=ko`) → `navigator.language`
2. **Node.js**: `process.env.LANG` → `process.env.LANGUAGE`
3. **Fallback**: 'en'

## Performance

- **Caching**: Translations are cached for optimal performance
- **Memoization**: Interpolation functions are compiled and cached
- **Bundle Size**: Core library is ~3KB gzipped
- **Tree Shaking**: Unused code is automatically removed

## TypeScript Support

Full TypeScript support with type inference:

```typescript
import type { Translation, Locale } from 'zzoo-i18n';

const myTranslation: Translation = {
  ko: '안녕',
  en: 'hello'
};

const currentLocale: Locale = getLocale();
```

## Examples

### Next.js App Router

```typescript
// app/layout.tsx
import { setLocale, autoDetectLocale } from 'zzoo-i18n';

export default function RootLayout({ children }) {
  // Auto-detect on server
  autoDetectLocale();
  
  return (
    <html lang={getLocale()}>
      <body>{children}</body>
    </html>
  );
}
```

### Vanilla JavaScript

```javascript
import { t, setLocale } from 'zzoo-i18n';

// No framework required!
setLocale('ko');

document.getElementById('greeting').textContent = t({
  ko: '안녕하세요!',
  en: 'Hello!'
});
```

## License

MIT