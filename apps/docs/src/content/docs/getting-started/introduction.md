---
title: What is css-variants? Introduction and Overview
description: css-variants is a zero-dependency, type-safe CSS variant library for JavaScript. Learn what it does, why to use it, and how it compares to CVA and tailwind-variants.
---

## What is css-variants?

**css-variants** is a JavaScript library for managing CSS class variants with full TypeScript support. It provides a declarative API for defining style variations (color, size, state) and generates the correct CSS classes at runtime.

**Definition:** A CSS variant library manages conditional styling in components. Instead of writing ternary expressions or switch statements, you define named variants and the library generates the correct classes.

### Basic Example

```typescript
import { cv } from 'css-variants'

// Define a button with color and size variants
const button = cv({
  base: 'px-4 py-2 rounded font-medium transition-colors',
  variants: {
    color: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
      danger: 'bg-red-600 text-white hover:bg-red-700',
    },
    size: {
      sm: 'text-sm px-3 py-1.5',
      md: 'text-base px-4 py-2',
      lg: 'text-lg px-6 py-3',
    },
  },
  defaultVariants: {
    color: 'primary',
    size: 'md',
  },
})

// Use it — returns a class string
button()                        // => 'px-4 py-2 rounded font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 text-base'
button({ color: 'danger' })     // => '... bg-red-600 text-white hover:bg-red-700 ...'
button({ size: 'lg' })          // => '... text-lg px-6 py-3'
```

---

## Why Use css-variants?

:::tip[Key Benefits]
| Feature | Description |
|---------|-------------|
| **~1KB gzipped** | Smallest variant library available — zero dependencies |
| **Full TypeScript support** | Complete type inference for variants and props |
| **3-11x faster** | Outperforms CVA and tailwind-variants in benchmarks |
| **Framework-agnostic** | Works with React, Vue, Svelte, Solid, or vanilla JS |
| **CSS-agnostic** | Works with Tailwind, CSS Modules, vanilla CSS, or any CSS solution |
:::

---

## What Problems Does css-variants Solve?

css-variants addresses common pain points in component styling:

- **Messy conditional class logic** — Replaces scattered ternaries with a declarative API
- **Inconsistent styling patterns** — Enforces consistent variant structure across components
- **Poor TypeScript support** — Provides full type inference for variant props
- **Difficult maintenance** — Centralizes style logic in one place
- **Performance overhead** — Optimized algorithms minimize runtime cost

---

## What Functions Does css-variants Provide?

css-variants exports five functions for different use cases:

### `cv()` — Class Variants

Use for single-element components. Returns a class name string.

```typescript
import { cv } from 'css-variants'

const badge = cv({
  base: 'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
  variants: {
    color: {
      gray: 'bg-gray-100 text-gray-800',
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
    },
  },
})

badge({ color: 'blue' }) // => 'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800'
```

### `scv()` — Slot Class Variants

Use for multi-element components (cards, modals, dropdowns). Returns an object with class strings for each slot.

```typescript
import { scv } from 'css-variants'

const card = scv({
  slots: ['root', 'header', 'body', 'footer'],
  base: {
    root: 'rounded-lg border bg-white shadow-sm',
    header: 'px-6 py-4 border-b font-semibold',
    body: 'px-6 py-4',
    footer: 'px-6 py-3 bg-gray-50 border-t',
  },
  variants: {
    variant: {
      default: { root: 'border-gray-200' },
      primary: { root: 'border-blue-200', header: 'bg-blue-50' },
    },
  },
})

const classes = card({ variant: 'primary' })
// classes.root   => 'rounded-lg border bg-white shadow-sm border-blue-200'
// classes.header => 'px-6 py-4 border-b font-semibold bg-blue-50'
// classes.body   => 'px-6 py-4'
// classes.footer => 'px-6 py-3 bg-gray-50 border-t'
```

### `sv()` — Style Variants

Use for inline CSS styles (React's `style` prop). Returns a CSS style object.

```typescript
import { sv } from 'css-variants'

const box = sv({
  base: { display: 'flex', borderRadius: '8px' },
  variants: {
    size: {
      sm: { padding: '8px', gap: '8px' },
      lg: { padding: '24px', gap: '16px' },
    },
  },
})

box({ size: 'lg' }) // => { display: 'flex', borderRadius: '8px', padding: '24px', gap: '16px' }
```

### `ssv()` — Slot Style Variants

Use for multi-element inline styles. Returns an object with style objects for each slot.

```typescript
import { ssv } from 'css-variants'

const tooltip = ssv({
  slots: ['root', 'arrow'],
  base: {
    root: { position: 'absolute', padding: '8px', borderRadius: '4px' },
    arrow: { position: 'absolute', width: '8px', height: '8px' },
  },
  variants: {
    placement: {
      top: { root: { bottom: '100%' }, arrow: { top: '100%' } },
      bottom: { root: { top: '100%' }, arrow: { bottom: '100%' } },
    },
  },
})
```

### `cx()` — Class Name Merger

A lightweight alternative to clsx for conditional class merging:

```typescript
import { cx } from 'css-variants'

cx('btn', 'btn-primary')                    // => 'btn btn-primary'
cx('btn', isActive && 'active')             // => 'btn active' or 'btn'
cx('btn', { disabled: isDisabled })         // => 'btn disabled' or 'btn'
cx(['btn', 'rounded'], 'shadow')            // => 'btn rounded shadow'
```

---

## css-variants vs CVA vs tailwind-variants

### css-variants vs CVA (Class Variance Authority)

css-variants is a faster, smaller alternative to CVA with additional features:

| Feature | css-variants | CVA |
|---------|:------------:|:---:|
| Bundle size | ~1KB | ~2KB |
| Performance | **3-7x faster** | Baseline |
| Slot variants | Built-in (`scv`) | Not available |
| Style variants | Built-in (`sv`, `ssv`) | Not available |
| API style | `base` property | First argument |

### css-variants vs tailwind-variants

css-variants is a faster, smaller alternative to tailwind-variants:

| Feature | css-variants | tailwind-variants |
|---------|:------------:|:-----------------:|
| Bundle size | ~1KB | ~5KB |
| Performance | **5-11x faster** | Baseline |
| Dependencies | 0 | 1 (tailwind-merge) |
| Built-in tw-merge | No (opt-in) | Yes |
| Style variants | Built-in | Not available |

---

## Can I Use css-variants Without Tailwind CSS?

Yes. css-variants is CSS-framework agnostic and works with any CSS approach:

- **Tailwind CSS** — The most common use case
- **Vanilla CSS** — Regular class names like `.btn`, `.btn-primary`
- **CSS Modules** — Import and use scoped class names
- **CSS-in-JS** — Use with styled-components, emotion, etc.
- **Other utility frameworks** — Bootstrap, Bulma, UnoCSS, etc.

```typescript
// Works with vanilla CSS
const button = cv({
  base: 'btn',
  variants: {
    variant: {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
    },
  },
})

// Works with CSS Modules
import styles from './Button.module.css'

const button = cv({
  base: styles.btn,
  variants: {
    variant: {
      primary: styles.primary,
      secondary: styles.secondary,
    },
  },
})
```

---

## What Frameworks Does css-variants Support?

css-variants works with all JavaScript frameworks:

| Framework | Support |
|-----------|:-------:|
| React | Full support |
| Vue 3 | Full support |
| Svelte | Full support |
| Solid.js | Full support |
| Preact | Full support |
| Vanilla JS | Full support |

See the [Framework Guide](/guides/frameworks/) for implementation examples.

---

## Ready to Get Started?

:::note[Next Steps]
1. [Install css-variants](/getting-started/installation/) — Add to your project
2. [Quick Start Guide](/getting-started/quick-start/) — Build your first variant in 5 minutes
3. [API Reference](/api/cv/) — Explore all functions
4. [Tailwind Integration](/guides/tailwind/) — Best practices for Tailwind users
:::
