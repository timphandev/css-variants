<div align="center">

# css-variants

**The fastest, smallest CSS variant library for JavaScript and TypeScript**

A zero-dependency, type-safe alternative to CVA (Class Variance Authority) and tailwind-variants.
Build powerful component style systems with variants — works with Tailwind CSS, vanilla CSS, CSS Modules, or any styling solution.

[![test](https://github.com/timphandev/css-variants/actions/workflows/packages.css-variants.test.yml/badge.svg)](https://github.com/timphandev/css-variants/actions/workflows/packages.css-variants.test.yml)
[![npm version](https://img.shields.io/npm/v/css-variants.svg)](https://www.npmjs.com/package/css-variants)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/css-variants)](https://bundlephobia.com/package/css-variants)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Documentation](https://css-variants.vercel.app/) · [Getting Started](https://css-variants.vercel.app/getting-started/introduction/) · [API Reference](https://css-variants.vercel.app/api/cv/) · [Comparison](https://css-variants.vercel.app/resources/comparison/)

</div>

---

## What is css-variants?

**css-variants** is a lightweight JavaScript/TypeScript library for managing CSS class variants in component-based applications. It provides a clean, declarative API to define style variations (like `color`, `size`, `disabled`) and automatically generates the correct CSS classes at runtime.

### Key Benefits

| Feature | Description |
|---------|-------------|
| **~1KB gzipped** | Smallest variant library available — zero dependencies |
| **Type-safe** | Full TypeScript inference for variants and props |
| **Framework-agnostic** | Works with React, Vue, Svelte, Solid, or vanilla JS |
| **CSS-agnostic** | Works with Tailwind, CSS Modules, vanilla CSS, or any CSS solution |
| **3-11x faster** | Outperforms CVA and tailwind-variants in benchmarks |

---

## Installation

```bash
npm install css-variants
```

```bash
yarn add css-variants
```

```bash
pnpm add css-variants
```

---

## Quick Start

### Basic Variants with `cv()`

Create variants for single-element components:

```typescript
import { cv } from 'css-variants'

const button = cv({
  base: 'font-semibold rounded-lg transition-colors',
  variants: {
    color: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
      danger: 'bg-red-600 text-white hover:bg-red-700',
    },
    size: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    },
    disabled: {
      true: 'opacity-50 cursor-not-allowed',
    },
  },
  defaultVariants: {
    color: 'primary',
    size: 'md',
  },
})

// Usage
button()                                    // Primary + Medium (defaults)
button({ color: 'danger', size: 'lg' })     // Danger + Large
button({ disabled: true })                  // Primary + Medium + Disabled
button({ className: 'w-full' })             // Add custom classes
```

### Multi-Slot Components with `scv()`

Create variants for components with multiple styled elements:

```typescript
import { scv } from 'css-variants'

const card = scv({
  slots: ['root', 'header', 'body', 'footer'],
  base: {
    root: 'rounded-xl border shadow-sm',
    header: 'px-6 py-4 border-b font-semibold',
    body: 'px-6 py-4',
    footer: 'px-6 py-3 bg-gray-50 rounded-b-xl',
  },
  variants: {
    variant: {
      default: { root: 'bg-white border-gray-200' },
      primary: { root: 'bg-blue-50 border-blue-200', header: 'text-blue-900' },
      danger: { root: 'bg-red-50 border-red-200', header: 'text-red-900' },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

// Usage — returns object with class strings for each slot
const classes = card({ variant: 'primary' })
// classes.root   → 'rounded-xl border shadow-sm bg-blue-50 border-blue-200'
// classes.header → 'px-6 py-4 border-b font-semibold text-blue-900'
// classes.body   → 'px-6 py-4'
// classes.footer → 'px-6 py-3 bg-gray-50 rounded-b-xl'
```

### Compound Variants

Apply styles when multiple variant conditions are met:

```typescript
const button = cv({
  base: 'rounded font-medium',
  variants: {
    color: {
      primary: 'bg-blue-600 text-white',
      danger: 'bg-red-600 text-white',
    },
    size: {
      sm: 'px-2 py-1 text-sm',
      lg: 'px-6 py-3 text-lg',
    },
  },
  compoundVariants: [
    // When both color=danger AND size=lg, add these classes
    { color: 'danger', size: 'lg', className: 'font-bold uppercase tracking-wide' },
  ],
})
```

### Inline Style Variants with `sv()`

For CSS style objects instead of class names:

```typescript
import { sv } from 'css-variants'

const box = sv({
  base: { display: 'flex', alignItems: 'center', borderRadius: '8px' },
  variants: {
    size: {
      sm: { padding: '8px', gap: '8px' },
      lg: { padding: '24px', gap: '16px' },
    },
    color: {
      blue: { backgroundColor: '#3b82f6', color: 'white' },
      gray: { backgroundColor: '#f3f4f6', color: '#1f2937' },
    },
  },
})

// Returns style object for React's style prop
<div style={box({ size: 'lg', color: 'blue' })} />
```

### Class Name Merging with `cx()`

A lightweight utility for conditional class merging:

```typescript
import { cx } from 'css-variants'

cx('btn', 'btn-primary')                    // 'btn btn-primary'
cx('btn', isActive && 'active')             // 'btn active' or 'btn'
cx('btn', { 'disabled': isDisabled })       // 'btn disabled' or 'btn'
cx(['btn', 'rounded'], 'shadow')            // 'btn rounded shadow'
```

---

## Performance

css-variants is the **fastest CSS variant library** available:

| Comparison | Simple Operations | Compound Variants | Complex Components |
|:-----------|:-----------------:|:-----------------:|:------------------:|
| **vs CVA** | ~1.1-1.3x faster | **3-4x faster** | **2-7x faster** |
| **vs tailwind-variants** | **3-5x faster** | **5-7x faster** | **10-11x faster** |

[View detailed benchmarks →](https://css-variants.vercel.app/resources/benchmarks/)

---

## API Reference

| Function | Description | Use Case |
|----------|-------------|----------|
| [`cv()`](https://css-variants.vercel.app/api/cv/) | Class variants | Single-element components |
| [`scv()`](https://css-variants.vercel.app/api/scv/) | Slot class variants | Multi-element components (cards, modals) |
| [`sv()`](https://css-variants.vercel.app/api/sv/) | Style variants | Inline CSS style objects |
| [`ssv()`](https://css-variants.vercel.app/api/ssv/) | Slot style variants | Multi-element inline styles |
| [`cx()`](https://css-variants.vercel.app/api/cx/) | Class merger | Conditional class composition |

---

## Framework Examples

### React

```tsx
import { cv } from 'css-variants'

const button = cv({
  base: 'rounded font-medium',
  variants: {
    variant: {
      primary: 'bg-blue-600 text-white',
      secondary: 'bg-gray-200 text-gray-800',
    },
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
    variant: {
      primary: 'bg-blue-600 text-white',
      secondary: 'bg-gray-200 text-gray-800',
    },
  },
})

defineProps<{ variant?: 'primary' | 'secondary' }>()
</script>

<template>
  <button :class="button({ variant })">
    <slot />
  </button>
</template>
```

---

## Tailwind CSS Integration

css-variants works great with Tailwind CSS. For class conflict resolution, use `tailwind-merge`:

```typescript
import { cv, cx } from 'css-variants'
import { twMerge } from 'tailwind-merge'

const button = cv({
  base: 'px-4 py-2 rounded',
  variants: {
    size: {
      lg: 'px-6 py-3', // Would conflict with base px-4 py-2
    },
  },
  // Use twMerge to resolve Tailwind class conflicts
  classNameResolver: (...args) => twMerge(cx(...args)),
})
```

[Tailwind integration guide →](https://css-variants.vercel.app/guides/tailwind/)

---

## Migrating from Other Libraries

### From CVA (Class Variance Authority)

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

[Full CVA migration guide →](https://css-variants.vercel.app/resources/migration-cva/)

### From tailwind-variants

```diff
- import { tv } from 'tailwind-variants'
+ import { cv } from 'css-variants'  // or scv for slots

- const button = tv({
+ const button = cv({
    base: 'rounded',
    variants: { /* same */ },
  })
```

[Full tailwind-variants migration guide →](https://css-variants.vercel.app/resources/migration-tailwind-variants/)

---

## Why css-variants?

### vs CVA (Class Variance Authority)

- **Faster**: 3-7x faster for compound variants and complex components
- **Smaller**: ~1KB vs ~2KB bundle size
- **More features**: Built-in slot variants (`scv`) and style variants (`sv`, `ssv`)
- **Similar API**: Easy migration, nearly identical syntax

### vs tailwind-variants

- **Much faster**: 5-11x faster across all benchmarks
- **Much smaller**: ~1KB vs ~5KB bundle size
- **Zero dependencies**: No bundled tailwind-merge (opt-in if needed)
- **Style variants**: Unique feature for inline CSS style objects

### Works Without Tailwind

css-variants is **not tied to Tailwind CSS**. Use it with:

- Vanilla CSS classes
- CSS Modules
- CSS-in-JS (styled-components, emotion)
- Any utility framework (Bootstrap, Bulma, UnoCSS)
- No CSS at all (just organizing class strings)

---

## Documentation

**[Full documentation →](https://css-variants.vercel.app/)**

- [Getting Started](https://css-variants.vercel.app/getting-started/introduction/)
- [API Reference](https://css-variants.vercel.app/api/cv/)
- [Tailwind Integration](https://css-variants.vercel.app/guides/tailwind/)
- [TypeScript Guide](https://css-variants.vercel.app/guides/typescript/)
- [Framework Guides](https://css-variants.vercel.app/guides/frameworks/)
- [FAQ](https://css-variants.vercel.app/resources/faq/)

---

## Contributing

```bash
git clone https://github.com/timphandev/css-variants.git
cd css-variants && yarn install
yarn css-variants test && yarn css-variants build
```

---

## License

MIT © [Tim Phan](https://github.com/timphandev)
