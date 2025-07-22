# @your-org/react-theme

A React theme provider with SSR support for light/dark mode switching.

## Features

- 🌓 Light/Dark theme switching
- 🔄 Persistent theme storage via cookies
- ⚡ SSR/Next.js compatible
- 🎯 TypeScript support
- 🪶 Lightweight (no dependencies)
- 🧪 Fully tested

## Installation

```bash
npm install @your-org/react-theme
```

## Usage

### Client-side usage

```tsx
import { ThemeProvider, useTheme } from '@your-org/react-theme'

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  )
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current: {theme}
    </button>
  )
}
```

### Server-side usage (Next.js)

```tsx
import { ServerThemeWrapper } from '@your-org/react-theme'
import { cookies } from 'next/headers'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ServerThemeWrapper cookies={cookies}>
          {children}
        </ServerThemeWrapper>
      </body>
    </html>
  )
}
```

### CSS Integration

The theme is applied via `data-theme` attribute on `document.documentElement`:

```css
[data-theme="light"] {
  --bg-color: white;
  --text-color: black;
}

[data-theme="dark"] {
  --bg-color: black;
  --text-color: white;
}
```

## API

### `ThemeProvider`

| Prop | Type | Description |
|------|------|-------------|
| `theme` | `"light" \| "dark"` | Optional initial theme |
| `children` | `ReactNode` | Child components |

### `useTheme()`

Returns an object with:
- `theme`: Current theme (`"light" \| "dark" \| undefined`)
- `setTheme`: Function to update theme

### `ServerThemeWrapper`

| Prop | Type | Description |
|------|------|-------------|
| `cookies` | `() => Promise<ReadonlyRequestCookies>` | Next.js cookies function |
| `children` | `ReactNode` | Child components |

## License

MIT