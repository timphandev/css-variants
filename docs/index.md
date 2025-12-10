---
layout: default
title: css-variants
---

# css-variants

> **Zero-dependency, type-safe CSS variant composition for modern JavaScript**

Build powerful, flexible component style systems with variants. Perfect for Tailwind CSS, vanilla CSS, or any CSS-in-JS solution.

[![test](https://github.com/timphandev/css-variants/actions/workflows/ci.yml/badge.svg)](https://github.com/timphandev/css-variants/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/css-variants.svg)](https://www.npmjs.com/package/css-variants)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/css-variants)](https://bundlephobia.com/package/css-variants)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Give a Star](https://img.shields.io/badge/⭐️%20Give%20a%20Star-support%20the%20project-ffcc00)](https://github.com/timphandev/css-variants)

---

## Why css-variants?

⚡ **Tiny & Fast** — Zero dependencies, ~1KB minified+gzipped

🔒 **Type-Safe** — First-class TypeScript support with complete type inference

🧩 **Flexible** — Works with Tailwind, CSS modules, vanilla CSS, or inline styles

👨‍💻 **Developer-Friendly** — Intuitive API inspired by CVA and Panda CSS

🚀 **Production-Ready** — Battle-tested, fully tested, dual CJS/ESM builds

---

## Quick Start

### Installation

```bash
npm install css-variants
# or
yarn add css-variants
# or
pnpm add css-variants
```

### Your First Variant

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
  },
  defaultVariants: {
    color: 'primary',
    size: 'md',
  },
})

// Usage
button()
// => 'font-semibold rounded-lg transition-colors bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 text-base'

button({ color: 'danger', size: 'lg' })
// => '... bg-red-600 text-white hover:bg-red-700 px-6 py-3 text-lg'
```

### Framework Examples

#### React

```tsx
function Button({ color, size, children, ...props }) {
  return (
    <button className={button({ color, size })} {...props}>
      {children}
    </button>
  )
}

<Button color="danger" size="lg">Delete Account</Button>
```

#### Vue

```vue
<template>
  <button :class="button({ color, size })">
    <slot />
  </button>
</template>

<script setup>
import { cv } from 'css-variants'

const props = defineProps(['color', 'size'])
const button = cv({ /* config */ })
</script>
```

---

## Core Concepts

### Variants

Variants are named groups of style options. Each variant has a set of possible values:

```typescript
const alert = cv({
  variants: {
    variant: {
      info: 'bg-blue-100 text-blue-900',
      warning: 'bg-yellow-100 text-yellow-900',
      error: 'bg-red-100 text-red-900',
    },
  },
})

alert({ variant: 'error' }) // => 'bg-red-100 text-red-900'
```

### Base Styles

Base styles are applied to **all** instances, regardless of variants:

```typescript
const card = cv({
  base: 'rounded-lg shadow-md overflow-hidden',
  variants: {
    padding: {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
  },
})

card({ padding: 'sm' }) // => 'rounded-lg shadow-md overflow-hidden p-4'
```

### Default Variants

Set default values for variants when no props are provided:

```typescript
const input = cv({
  variants: {
    size: {
      sm: 'text-sm px-2 py-1',
      md: 'text-base px-3 py-2',
      lg: 'text-lg px-4 py-3',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

input() // => 'text-base px-3 py-2' (uses default)
input({ size: 'lg' }) // => 'text-lg px-4 py-3' (overrides default)
```

### Compound Variants

Apply styles when **multiple variants match simultaneously**:

```typescript
const button = cv({
  base: 'rounded font-medium',
  variants: {
    color: {
      primary: 'bg-blue-600 text-white',
      secondary: 'bg-gray-200 text-gray-900',
    },
    size: {
      sm: 'px-3 py-1 text-sm',
      lg: 'px-6 py-3 text-lg',
    },
    disabled: {
      true: 'opacity-50 cursor-not-allowed',
      false: 'cursor-pointer',
    },
  },
  compoundVariants: [
    // Large primary buttons get extra bold text
    {
      color: 'primary',
      size: 'lg',
      className: 'font-bold shadow-lg',
    },
    // Disabled state removes hover effects
    {
      disabled: true,
      className: 'pointer-events-none',
    },
  ],
})

button({ color: 'primary', size: 'lg' })
// => Includes 'font-bold shadow-lg' from compound variant
```

### Boolean Variants

Boolean variants use string keys `'true'` and `'false'`, but accept actual booleans in props:

```typescript
const checkbox = cv({
  base: 'w-4 h-4 rounded border',
  variants: {
    checked: {
      true: 'bg-blue-600 border-blue-600',
      false: 'bg-white border-gray-300',
    },
    disabled: {
      true: 'opacity-50 cursor-not-allowed',
      false: 'cursor-pointer',
    },
  },
})

// TypeScript allows boolean props
checkbox({ checked: true, disabled: false })
// => 'w-4 h-4 rounded border bg-blue-600 border-blue-600 cursor-pointer'
```

---

## API Reference

### `cv` - Class Variants

Create variants for **single-element components** using CSS class names.

```typescript
const badge = cv({
  base: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  variants: {
    variant: {
      default: 'bg-gray-100 text-gray-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
    },
  },
})
```

### `scv` - Slot Class Variants

Create variants for **multi-element components** using CSS class names.

```typescript
const card = scv({
  slots: ['root', 'header', 'title', 'description', 'content', 'footer'],
  base: {
    root: 'rounded-lg border bg-white shadow-sm',
    header: 'border-b p-6',
    title: 'text-2xl font-semibold',
    description: 'text-sm text-gray-500 mt-1',
    content: 'p-6',
    footer: 'border-t bg-gray-50 px-6 py-3',
  },
  variants: {
    variant: {
      default: {
        root: 'border-gray-200',
      },
      primary: {
        root: 'border-blue-200',
        title: 'text-blue-900',
      },
      danger: {
        root: 'border-red-200 bg-red-50',
        title: 'text-red-900',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const classes = card({ variant: 'primary' })
// => {
//   root: 'rounded-lg border bg-white shadow-sm border-blue-200',
//   header: 'border-b p-6',
//   title: 'text-2xl font-semibold text-blue-900',
//   description: 'text-sm text-gray-500 mt-1',
//   content: 'p-6',
//   footer: 'border-t bg-gray-50 px-6 py-3'
// }
```

### `sv` - Style Variants

Create variants for **inline CSS styles** (React's `style` prop, Vue's `:style`, etc.).

```typescript
const box = sv({
  base: {
    display: 'flex',
    borderRadius: '8px',
  },
  variants: {
    size: {
      sm: { padding: '8px', fontSize: '14px' },
      md: { padding: '16px', fontSize: '16px' },
      lg: { padding: '24px', fontSize: '18px' },
    },
    color: {
      gray: { backgroundColor: '#f3f4f6', color: '#1f2937' },
      blue: { backgroundColor: '#dbeafe', color: '#1e40af' },
      red: { backgroundColor: '#fee2e2', color: '#991b1b' },
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'gray',
  },
})

box({ size: 'lg', color: 'blue' })
// => { display: 'flex', borderRadius: '8px', padding: '24px', fontSize: '18px', backgroundColor: '#dbeafe', color: '#1e40af' }
```

### `ssv` - Slot Style Variants

Create variants for **multi-element components** using inline CSS styles.

```typescript
const tooltip = ssv({
  slots: ['container', 'arrow', 'content'],
  base: {
    container: {
      position: 'relative',
      display: 'inline-block',
    },
    arrow: {
      position: 'absolute',
      width: 0,
      height: 0,
      borderStyle: 'solid',
    },
    content: {
      position: 'absolute',
      padding: '8px 12px',
      borderRadius: '6px',
      fontSize: '14px',
      whiteSpace: 'nowrap',
      zIndex: 1000,
    },
  },
  variants: {
    placement: {
      top: {
        content: { bottom: '100%', left: '50%', transform: 'translateX(-50%)' },
      },
      bottom: {
        content: { top: '100%', left: '50%', transform: 'translateX(-50%)' },
      },
    },
  },
})
```

### `cx` - Class Name Merger

A lightweight utility for merging class names.

```typescript
import { cx } from 'css-variants'

cx('foo', 'bar') // => 'foo bar'
cx('foo', null, 'bar', undefined, 'baz') // => 'foo bar baz'
cx({ foo: true, bar: false, baz: true }) // => 'foo baz'
cx(['foo', 'bar'], 'baz') // => 'foo bar baz'
```

---

## Advanced Patterns

### Tailwind CSS Integration

By default, `cv` and `scv` don't handle Tailwind class conflicts. Integrate with `tailwind-merge` for proper resolution:

```typescript
import { cv, cx } from 'css-variants'
import { twMerge } from 'tailwind-merge'

const classNameResolver: typeof cx = (...args) => twMerge(cx(...args))

const button = cv({
  base: 'px-4 py-2 text-sm',
  variants: {
    size: {
      lg: 'px-6 py-3 text-lg', // Conflicts with base padding/text
    },
  },
  classNameResolver,
})

button({ size: 'lg' })
// Without twMerge: 'px-4 py-2 text-sm px-6 py-3 text-lg' (conflicting classes)
// With twMerge:    'px-6 py-3 text-lg' (conflicts resolved)
```

### CSS Modules Integration

```typescript
import { cv } from 'css-variants'
import styles from './Button.module.css'

const button = cv({
  base: styles.button,
  variants: {
    variant: {
      primary: styles.primary,
      secondary: styles.secondary,
    },
    size: {
      sm: styles.sm,
      md: styles.md,
      lg: styles.lg,
    },
  },
})
```

### Type-Safe Props with TypeScript

```typescript
import { cv } from 'css-variants'

const button = cv({
  variants: {
    color: { primary: '...', secondary: '...' },
    size: { sm: '...', md: '...', lg: '...' },
  },
})

type ButtonVariants = Parameters<typeof button>[0]
// => { color?: 'primary' | 'secondary', size?: 'sm' | 'md' | 'lg', className?: ClassValue }

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & ButtonVariants

function Button({ color, size, className, children, ...props }: ButtonProps) {
  return (
    <button className={button({ color, size, className })} {...props}>
      {children}
    </button>
  )
}
```

---

## Performance

### Bundle Size

- **Core library**: ~1KB minified + gzipped
- **Tree-shakeable**: Import only what you need
- **Zero dependencies**: No additional packages bundled

| Import | Size (gzipped) |
|--------|----------------|
| `import { cv } from 'css-variants'` | ~400 bytes |
| `import { scv } from 'css-variants'` | ~600 bytes |
| `import { sv } from 'css-variants'` | ~350 bytes |
| `import { cx } from 'css-variants'` | ~200 bytes |

### Production Tips

**1. Create variants outside components**

```typescript
// Good ✓ - Created once
const button = cv({ /* ... */ })

function Button(props) {
  return <button className={button(props)} />
}

// Bad ✗ - Recreated on every render
function Button(props) {
  const button = cv({ /* ... */ })  // Don't do this!
  return <button className={button(props)} />
}
```

**2. Minimize compound variants**

```typescript
// Each compound variant is checked at runtime
compoundVariants: [
  { size: 'lg', color: 'primary', className: '...' },
  { size: 'lg', color: 'secondary', className: '...' },
  // Keep this array as small as possible
]
```

---

## FAQ

### How is this different from CVA?

Very similar API! Main differences: `base` property instead of first argument, optimized for smaller bundle size, and includes built-in `cx` utility.

### Can I use this without Tailwind?

Absolutely! Works with any CSS approach: vanilla CSS, CSS modules, styled-components, emotion, etc.

### How do I handle responsive variants?

Use Tailwind's responsive prefixes in your variant classes: `'sm:text-sm md:text-base lg:text-lg'`

### Can I use this in a design system?

Yes! Create base variants and export them for consistent styling across your application.

### What about dark mode?

Use Tailwind's `dark:` prefix in variant classes, or create separate variants: `variant: { light: '...', dark: '...' }`

---

## Contributing

Contributions are welcome! Please read our [contributing guidelines](https://github.com/timphandev/css-variants/blob/main/CONTRIBUTING.md) before submitting PRs.

**Development Setup:**

```bash
git clone https://github.com/timphandev/css-variants.git
cd css-variants
yarn install
yarn test
yarn build
```

---

## License

MIT © [Tim Phan](https://github.com/timphandev)

---

## Credits

- Class merging inspired by [clsx](https://github.com/lukeed/clsx) by Luke Edwards
- API design inspired by [CVA](https://github.com/joe-bell/cva) and [Panda CSS](https://panda-css.com)

## ⭐ Like it? Star it!

If this library saves you time, a **⭐ on GitHub** means a lot. Thank you! 🚀

---

**Made with ❤️ by developers, for developers**
