<div align="center">

# css-variants

**Fastest CSS variant library for JavaScript and TypeScript**

Type-safe alternative to CVA (Class Variance Authority) and tailwind-variants.
~1KB gzipped. 3-11x faster. Zero dependencies.

[![npm version](https://img.shields.io/npm/v/css-variants.svg)](https://www.npmjs.com/package/css-variants)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/css-variants)](https://bundlephobia.com/package/css-variants)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Documentation](https://css-variants.vercel.app/) · [API Reference](https://css-variants.vercel.app/api/cv/) · [Comparison](https://css-variants.vercel.app/resources/comparison/)

</div>

---

## What is css-variants?

css-variants is a JavaScript library for managing CSS class variants with full TypeScript support. Define style variations (color, size, state) declaratively and get the correct CSS classes at runtime.

Works with Tailwind CSS, vanilla CSS, CSS Modules, or any styling solution.

## Installation

```bash
npm install css-variants
```

```bash
pnpm add css-variants
```

```bash
yarn add css-variants
```

---

## Quick Start

### cv() — Class Variants

Create type-safe variants for single-element components:

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
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    },
  },
  defaultVariants: {
    color: 'primary',
    size: 'md',
  },
})

button()                                // Uses defaults
button({ color: 'secondary', size: 'lg' }) // Override variants
button({ className: 'w-full' })         // Add custom classes
```

### scv() — Slot Class Variants

Create variants for multi-element components (cards, modals, dropdowns):

```typescript
import { scv } from 'css-variants'

const card = scv({
  slots: ['root', 'header', 'body', 'footer'],
  base: {
    root: 'rounded-xl border shadow-sm',
    header: 'px-6 py-4 border-b font-semibold',
    body: 'px-6 py-4',
    footer: 'px-6 py-3 bg-gray-50',
  },
  variants: {
    variant: {
      default: { root: 'bg-white border-gray-200' },
      primary: { root: 'bg-blue-50 border-blue-200' },
    },
  },
})

const classes = card({ variant: 'primary' })
// classes.root   → 'rounded-xl border shadow-sm bg-blue-50 border-blue-200'
// classes.header → 'px-6 py-4 border-b font-semibold'
```

### sv() — Style Variants

Create variants that return CSS style objects:

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

<div style={box({ size: 'lg' })} />
```

### cx() — Class Merger

Lightweight clsx alternative for conditional class merging:

```typescript
import { cx } from 'css-variants'

cx('btn', 'btn-primary')              // 'btn btn-primary'
cx('btn', isActive && 'active')       // 'btn active' or 'btn'
cx('btn', { disabled: isDisabled })   // 'btn disabled' or 'btn'
```

---

## Why css-variants?

| Feature | css-variants | CVA | tailwind-variants |
|---------|:------------:|:---:|:-----------------:|
| Bundle size | **~1KB** | ~2KB | ~5KB |
| Performance | **Baseline** | 3-7x slower | 5-11x slower |
| Slot variants | Built-in | No | Yes |
| Style variants | Built-in | No | No |
| Dependencies | 0 | 1 | 1 |

---

## Tailwind CSS Integration

Use with tailwind-merge for class conflict resolution:

```typescript
import { cv, cx } from 'css-variants'
import { twMerge } from 'tailwind-merge'

const button = cv({
  base: 'px-4 py-2 rounded',
  variants: {
    size: { lg: 'px-6 py-3' },
  },
  classNameResolver: (...args) => twMerge(cx(...args)),
})
```

[Full Tailwind guide →](https://css-variants.vercel.app/guides/tailwind/)

---

## Framework Examples

### React

```tsx
import { cv } from 'css-variants'

const button = cv({
  base: 'rounded font-medium',
  variants: {
    variant: { primary: 'bg-blue-600 text-white' },
  },
})

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  Parameters<typeof button>[0]

function Button({ variant, className, ...props }: ButtonProps) {
  return <button className={button({ variant, className })} {...props} />
}
```

### Vue

```vue
<script setup lang="ts">
import { cv } from 'css-variants'

const button = cv({
  base: 'rounded font-medium',
  variants: {
    variant: { primary: 'bg-blue-600 text-white' },
  },
})

defineProps<{ variant?: 'primary' }>()
</script>

<template>
  <button :class="button({ variant })"><slot /></button>
</template>
```

---

## Migrate from CVA

```diff
- import { cva } from 'class-variance-authority'
+ import { cv } from 'css-variants'

- const button = cva('base-classes', {
+ const button = cv({
+   base: 'base-classes',
    variants: { /* same */ },
    compoundVariants: [
-     { color: 'primary', class: 'extra' }
+     { color: 'primary', className: 'extra' }
    ],
  })
```

[Full migration guide →](https://css-variants.vercel.app/resources/migration-cva/)

---

## API Reference

| Function | Description |
|----------|-------------|
| [`cv()`](https://css-variants.vercel.app/api/cv/) | Class variants for single-element components |
| [`scv()`](https://css-variants.vercel.app/api/scv/) | Slot class variants for multi-element components |
| [`sv()`](https://css-variants.vercel.app/api/sv/) | Style variants for inline CSS style objects |
| [`ssv()`](https://css-variants.vercel.app/api/ssv/) | Slot style variants for multi-element inline styles |
| [`cx()`](https://css-variants.vercel.app/api/cx/) | Class merger utility (like clsx) |

---

## Documentation

**[css-variants.vercel.app](https://css-variants.vercel.app/)**

- [Getting Started](https://css-variants.vercel.app/getting-started/introduction/)
- [API Reference](https://css-variants.vercel.app/api/cv/)
- [Tailwind CSS Guide](https://css-variants.vercel.app/guides/tailwind/)
- [React, Vue, Svelte Guides](https://css-variants.vercel.app/guides/frameworks/)
- [css-variants vs CVA vs tailwind-variants](https://css-variants.vercel.app/resources/comparison/)
- [FAQ](https://css-variants.vercel.app/resources/faq/)

---

## License

MIT © [Tim Phan](https://github.com/timphandev)
