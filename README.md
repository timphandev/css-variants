# css-variants

**Fastest CSS variant library for JavaScript and TypeScript.**

A zero-dependency, type-safe alternative to CVA (Class Variance Authority) and tailwind-variants. ~1KB gzipped. 3-11x faster. Works with Tailwind CSS, vanilla CSS, CSS Modules, or any styling solution.

## What is css-variants?

css-variants is a JavaScript library for managing CSS class variants with full TypeScript support. Define style variations (color, size, state) declaratively and get the correct CSS classes at runtime.

## Installation

```bash
npm install css-variants
```

## Quick Start

```typescript
import { cv } from 'css-variants'

const button = cv({
  base: 'px-4 py-2 rounded font-medium',
  variants: {
    color: {
      primary: 'bg-blue-600 text-white',
      secondary: 'bg-gray-200 text-gray-800',
    },
    size: {
      sm: 'text-sm px-3 py-1.5',
      lg: 'text-lg px-6 py-3',
    },
  },
})

button({ color: 'primary', size: 'lg' })
// => 'px-4 py-2 rounded font-medium bg-blue-600 text-white text-lg px-6 py-3'
```

## Why css-variants?

| Feature | css-variants | CVA | tailwind-variants |
|---------|:------------:|:---:|:-----------------:|
| Bundle size | **~1KB** | ~2KB | ~5KB |
| Performance | **Baseline** | 3-7x slower | 5-11x slower |
| Slot variants | Built-in | No | Yes |
| Style variants | Built-in | No | No |
| Dependencies | 0 | 1 | 1 |

## API Functions

| Function | Description |
|----------|-------------|
| `cv()` | Class variants for single-element components |
| `scv()` | Slot class variants for multi-element components |
| `sv()` | Style variants for inline CSS style objects |
| `ssv()` | Slot style variants for multi-element inline styles |
| `cx()` | Class name merger utility (like clsx) |

## Documentation

**[css-variants.vercel.app](https://css-variants.vercel.app/)**

- [Getting Started](https://css-variants.vercel.app/getting-started/introduction/)
- [API Reference](https://css-variants.vercel.app/api/cv/)
- [Tailwind CSS Guide](https://css-variants.vercel.app/guides/tailwind/)
- [css-variants vs CVA vs tailwind-variants](https://css-variants.vercel.app/resources/comparison/)
- [Migrate from CVA](https://css-variants.vercel.app/resources/migration-cva/)
- [FAQ](https://css-variants.vercel.app/resources/faq/)

## Packages

| Package | Description | Size |
|---------|-------------|------|
| [css-variants](./packages/css-variants) | Core library | ~1KB |

## License

MIT © [Tim Phan](https://github.com/timphandev)
