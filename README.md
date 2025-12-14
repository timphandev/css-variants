<div align="center">

# css-variants

**Zero-dependency, type-safe CSS variant composition for modern JavaScript**

Build powerful, flexible component style systems with variants.<br/>
Perfect for Tailwind CSS, vanilla CSS, or any CSS-in-JS solution.

[![test](https://github.com/timphandev/css-variants/actions/workflows/ci.yml/badge.svg)](https://github.com/timphandev/css-variants/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/css-variants.svg)](https://www.npmjs.com/package/css-variants)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/css-variants)](https://bundlephobia.com/package/css-variants)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Documentation](https://css-variants.vercel.app/) · [Getting Started](https://css-variants.vercel.app/getting-started/introduction/) · [API Reference](https://css-variants.vercel.app/api/cv/)

</div>

---

## Why css-variants?

|   | Feature |
|---|---------|
| ⚡ | **~1KB** — Zero dependencies, tree-shakeable |
| 🔒 | **Type-Safe** — Full TypeScript inference for variants & props |
| 🧩 | **Flexible** — Works with Tailwind, CSS Modules, vanilla CSS, inline styles |
| 🚀 | **Fast** — Up to 10x faster than alternatives in complex scenarios |

## Installation

```bash
npm install css-variants
```

## Quick Start

### Single-Element Variants (`cv`)

```typescript
import { cv } from 'css-variants'

const button = cv({
  base: 'font-semibold rounded-lg transition-colors',
  variants: {
    color: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    },
    size: {
      sm: 'px-3 py-1.5 text-sm',
      lg: 'px-6 py-3 text-lg',
    },
  },
  defaultVariants: { color: 'primary', size: 'sm' },
})

button()                              // Primary + Small (defaults)
button({ color: 'secondary' })        // Secondary + Small
button({ size: 'lg', className: 'w-full' }) // Primary + Large + custom class
```

### Multi-Element Components (`scv`)

```typescript
import { scv } from 'css-variants'

const card = scv({
  slots: ['root', 'header', 'body', 'footer'],
  base: {
    root: 'rounded-xl border shadow-sm',
    header: 'px-6 py-4 border-b',
    body: 'px-6 py-4',
    footer: 'px-6 py-3 bg-gray-50',
  },
  variants: {
    variant: {
      default: { root: 'bg-white border-gray-200' },
      danger: { root: 'bg-red-50 border-red-200', header: 'text-red-900' },
    },
  },
})

const styles = card({ variant: 'danger' })
// styles.root   → 'rounded-xl border shadow-sm bg-red-50 border-red-200'
// styles.header → 'px-6 py-4 border-b text-red-900'
```

### Compound Variants

Apply styles when multiple variants match:

```typescript
const button = cv({
  variants: {
    color: { primary: '...', danger: '...' },
    size: { sm: '...', lg: '...' },
  },
  compoundVariants: [
    { color: 'danger', size: 'lg', className: 'font-bold uppercase' },
  ],
})
```

### Style Variants (`sv`)

For inline styles instead of class names:

```typescript
import { sv } from 'css-variants'

const box = sv({
  base: { display: 'flex', borderRadius: '8px' },
  variants: {
    size: {
      sm: { padding: '8px' },
      lg: { padding: '24px' },
    },
  },
})

box({ size: 'lg' }) // => { display: 'flex', borderRadius: '8px', padding: '24px' }
```

## Performance

| vs cva | vs tailwind-variants |
|:------:|:--------------------:|
| 3-4x faster (compound variants) | 5-6x faster (compound variants) |
| 4-9x faster (complex components) | 10-11x faster (complex components) |

## Documentation

**[Full documentation →](https://css-variants.vercel.app/)**

## Contributing

```bash
git clone https://github.com/timphandev/css-variants.git
cd css-variants && yarn install
yarn css-variants test && yarn css-variants build
```

## License

MIT © [Tim Phan](https://github.com/timphandev)
