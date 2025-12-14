---
title: Introduction
description: Learn about css-variants and why you should use it for your component styling
---

**css-variants** is a zero-dependency, type-safe CSS variant composition library for modern JavaScript. It helps you build powerful, flexible component style systems with variants.

:::tip[Why css-variants?]
- ⚡ **Tiny & Fast** — Zero dependencies, ~1KB minified+gzipped
- 🔒 **Type-Safe** — First-class TypeScript support with complete type inference
- 🧩 **Flexible** — Works with Tailwind, CSS modules, vanilla CSS, or inline styles
- 👨‍💻 **Developer-Friendly** — Intuitive API inspired by CVA and Panda CSS
- 🚀 **Production-Ready** — Battle-tested, fully tested, dual CJS/ESM builds
:::

## What problems does it solve?

:::caution[Without a structured approach, styling components can lead to...]
- **Messy conditional class logic** scattered throughout your components
- **Inconsistent styling patterns** across your codebase
- **Poor TypeScript support** for component props
- **Difficult maintenance** as your component library grows
:::

css-variants solves these problems by providing a clean, declarative API for defining component variants.

## Features at a glance

### Class Variants (`cv`)

Create variants for single-element components using CSS class names:

```typescript
import { cv } from 'css-variants'

const button = cv({
  base: 'rounded font-medium',
  variants: {
    color: {
      primary: 'bg-blue-600 text-white',
      secondary: 'bg-gray-200 text-gray-900',
    },
    size: {
      sm: 'px-3 py-1.5 text-sm',
      lg: 'px-6 py-3 text-lg',
    },
  },
})
```

### Slot Class Variants (`scv`)

Create variants for multi-element components:

```typescript
import { scv } from 'css-variants'

const card = scv({
  slots: ['root', 'header', 'content', 'footer'],
  base: {
    root: 'rounded-lg border bg-white',
    header: 'border-b p-4',
    content: 'p-4',
    footer: 'border-t p-4',
  },
  variants: {
    variant: {
      default: { root: 'border-gray-200' },
      primary: { root: 'border-blue-200' },
    },
  },
})
```

### Style Variants (`sv` & `ssv`)

Create variants using inline CSS styles for React's `style` prop or similar:

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
```

### Class Name Merger (`cx`)

A lightweight utility for merging class names:

```typescript
import { cx } from 'css-variants'

cx('foo', 'bar') // => 'foo bar'
cx('foo', { active: true, disabled: false }) // => 'foo active'
```

## Ready to get started?

:::note[Next Steps]
Head over to the [Installation](/getting-started/installation/) guide to add css-variants to your project, or explore the [API Reference](/api-reference/cv/) to dive deeper into each function.
:::
