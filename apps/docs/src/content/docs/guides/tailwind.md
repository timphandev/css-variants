---
title: Tailwind CSS Integration
description: How to use css-variants with Tailwind CSS
---

css-variants works seamlessly with Tailwind CSS. This guide covers best practices and how to handle class conflicts.

## Basic Usage

Use Tailwind classes directly in your variants:

```typescript
import { cv } from 'css-variants'

const button = cv({
  base: 'font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2',
  variants: {
    color: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
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
```

## Handling Class Conflicts

By default, css-variants concatenates all classes. This can cause issues with Tailwind when classes conflict:

```typescript
const button = cv({
  base: 'px-4 py-2 text-sm',
  variants: {
    size: {
      lg: 'px-6 py-3 text-lg', // Conflicts with base padding/text
    },
  },
})

button({ size: 'lg' })
// => 'px-4 py-2 text-sm px-6 py-3 text-lg'
// Both px-4 and px-6 are present - last one wins in CSS, but it's messy
```

### Using tailwind-merge

Install `tailwind-merge` to properly resolve conflicts:

```bash
npm install tailwind-merge
```

Create a custom class resolver:

```typescript
import { cv, cx } from 'css-variants'
import { twMerge } from 'tailwind-merge'

const classNameResolver: typeof cx = (...args) => twMerge(cx(...args))

const button = cv({
  base: 'px-4 py-2 text-sm',
  variants: {
    size: {
      lg: 'px-6 py-3 text-lg',
    },
  },
  classNameResolver,
})

button({ size: 'lg' })
// => 'px-6 py-3 text-lg' (conflicts resolved!)
```

## Recommended Setup

Create a utility file to centralize your variant creators:

```typescript
// lib/variants.ts
import css from 'css-variants'
import { twMerge } from 'tailwind-merge'

// Enhanced cx that merges Tailwind classes
export const cx: typeof css.cx = (...args) => twMerge(css.cx(...args))

// Enhanced cv with automatic Tailwind merging
export const cv: typeof css.cv = (config) => css.cv({
  ...config,
  classNameResolver: cx,
})

// Enhanced scv with automatic Tailwind merging
export const scv: typeof css.scv = (config) => css.scv({
  ...config,
  classNameResolver: cx,
})
```

Use throughout your project:

```typescript
// components/Button.tsx
import { cv } from '@/lib/variants'

const button = cv({
  base: 'px-4 py-2 rounded',
  variants: {
    // Your variants...
  },
})
```

## Responsive Variants

Use Tailwind's responsive prefixes in your variant classes:

```typescript
const container = cv({
  base: 'w-full mx-auto',
  variants: {
    size: {
      sm: 'max-w-screen-sm px-4',
      md: 'max-w-screen-md px-6',
      lg: 'max-w-screen-lg px-8',
      xl: 'max-w-screen-xl px-8',
    },
  },
  defaultVariants: {
    size: 'lg',
  },
})
```

For different variants at different breakpoints, combine with `cx`:

```typescript
import { cx } from '@/lib/variants'

<div className={cx(
  container({ size: 'sm' }),
  'md:max-w-screen-md lg:max-w-screen-lg'
)}>
  Content
</div>
```

## Dark Mode

### Using Tailwind's dark: prefix

```typescript
const card = cv({
  base: 'rounded-lg p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
  variants: {
    variant: {
      default: 'border border-gray-200 dark:border-gray-700',
      elevated: 'shadow-lg dark:shadow-gray-900/50',
    },
  },
})
```

### Theme Variants

Alternatively, create explicit theme variants:

```typescript
const card = cv({
  base: 'rounded-lg p-6',
  variants: {
    theme: {
      light: 'bg-white text-gray-900 border-gray-200',
      dark: 'bg-gray-800 text-white border-gray-700',
    },
    variant: {
      default: 'border',
      elevated: 'shadow-lg',
    },
  },
  compoundVariants: [
    {
      theme: 'dark',
      variant: 'elevated',
      className: 'shadow-gray-900/50',
    },
  ],
})
```

## Arbitrary Values

Use Tailwind's arbitrary value syntax:

```typescript
const avatar = cv({
  base: 'rounded-full object-cover',
  variants: {
    size: {
      xs: 'w-6 h-6',
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
      custom: 'w-[42px] h-[42px]', // Arbitrary value
    },
  },
})
```

## Group and Peer Modifiers

```typescript
const card = cv({
  base: 'group rounded-lg border p-4 transition-all',
  variants: {
    interactive: {
      true: 'cursor-pointer hover:shadow-lg hover:border-blue-500',
      false: '',
    },
  },
})

const cardTitle = cv({
  base: 'text-lg font-semibold transition-colors',
  variants: {
    interactive: {
      true: 'group-hover:text-blue-600',
      false: '',
    },
  },
})
```

## Slot Variants with Tailwind

```typescript
import { scv } from '@/lib/variants'

const dropdown = scv({
  slots: ['trigger', 'menu', 'item'],
  base: {
    trigger: 'inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border',
    menu: 'absolute mt-2 w-48 rounded-lg bg-white shadow-lg border py-1',
    item: 'block px-4 py-2 text-sm hover:bg-gray-100 transition-colors',
  },
  variants: {
    size: {
      sm: {
        trigger: 'px-3 py-1.5 text-sm',
        item: 'px-3 py-1.5 text-xs',
      },
      lg: {
        trigger: 'px-6 py-3 text-lg',
        menu: 'w-64',
        item: 'px-6 py-3 text-base',
      },
    },
  },
})
```

## VS Code IntelliSense

For Tailwind CSS autocomplete in VS Code, install the [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) extension.

Add to your `.vscode/settings.json`:

```json
// .vscode/settings.json
{
  "tailwindCSS.classFunctions": ["cv", "scv", "cx"]
}
```

This enables autocomplete for Tailwind classes inside `cv()`, `scv()`, and `cx()` function calls.

## Prettier Plugin

If you use [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) to sort your Tailwind classes, add `cv`, `scv`, and `cx` to the list of functions:

```javascript
// prettier.config.js
module.exports = {
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindFunctions: ['cv', 'scv', 'cx'],
}
```

This ensures your Tailwind classes are automatically sorted within css-variants function calls.
