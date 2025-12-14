# css-variants

**The fastest, smallest CSS variant library for JavaScript and TypeScript.**

A zero-dependency, type-safe alternative to CVA (Class Variance Authority) and tailwind-variants. Build powerful component style systems with variants — works with Tailwind CSS, vanilla CSS, CSS Modules, or any styling solution.

## Packages

| Package | Description | Size |
|---------|-------------|------|
| [css-variants](./packages/css-variants) | Core library for CSS variant composition | ~1KB |

## Quick Start

```bash
npm install css-variants
```

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
```

## Why css-variants?

| Feature | css-variants | CVA | tailwind-variants |
|---------|:------------:|:---:|:-----------------:|
| Bundle size | **~1KB** | ~2KB | ~5KB |
| Performance | **Baseline** | 3-7x slower | 5-11x slower |
| Slot variants | Built-in | No | Yes |
| Style variants | Built-in | No | No |
| Dependencies | 0 | 1 | 1 |

## Documentation

Full documentation: **[css-variants.vercel.app](https://css-variants.vercel.app/)**

- [Getting Started](https://css-variants.vercel.app/getting-started/introduction/)
- [API Reference](https://css-variants.vercel.app/api/cv/)
- [Library Comparison](https://css-variants.vercel.app/resources/comparison/)
- [Migration from CVA](https://css-variants.vercel.app/resources/migration-cva/)
- [FAQ](https://css-variants.vercel.app/resources/faq/)

## License

MIT © [Tim Phan](https://github.com/timphandev)
