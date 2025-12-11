---
title: Variants
description: Understanding variants in css-variants
---

Variants are named groups of style options. Each variant has a set of possible values that map to different styles.

## Basic Variants

Define variants as an object where keys are variant names and values are objects mapping option names to styles:

```typescript
import { cv } from 'css-variants'

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

## Multiple Variants

Components can have any number of variants:

```typescript
const button = cv({
  variants: {
    color: {
      primary: 'bg-blue-600 text-white',
      secondary: 'bg-gray-200 text-gray-900',
    },
    size: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    },
    rounded: {
      none: 'rounded-none',
      sm: 'rounded',
      full: 'rounded-full',
    },
  },
})

button({ color: 'primary', size: 'lg', rounded: 'full' })
// => 'bg-blue-600 text-white px-6 py-3 text-lg rounded-full'
```

## Variant Values

Variant values can be:

### Strings

```typescript
const badge = cv({
  variants: {
    color: {
      gray: 'bg-gray-100 text-gray-800',
      red: 'bg-red-100 text-red-800',
    },
  },
})
```

### Arrays

```typescript
const container = cv({
  variants: {
    spacing: {
      normal: ['py-12', 'gap-6'],
      loose: ['py-16', 'gap-8'],
    },
  },
})
```

### Objects (conditional)

```typescript
const card = cv({
  variants: {
    interactive: {
      true: { 'cursor-pointer': true, 'hover:shadow-lg': true },
      false: {},
    },
  },
})
```

### Mixed

```typescript
const container = cv({
  base: ['max-w-7xl', 'mx-auto', { 'px-4': true, 'sm:px-6': true }],
  variants: {
    spacing: {
      tight: ['py-8', 'gap-4'],
      normal: ['py-12', 'gap-6'],
      loose: ['py-16', 'gap-8'],
    },
  },
})
```

## Optional Variants

All variants are optional by default. If you don't pass a value, and there's no default, the variant simply won't contribute any classes:

```typescript
const text = cv({
  variants: {
    weight: {
      normal: 'font-normal',
      bold: 'font-bold',
    },
  },
})

text() // => '' (no classes)
text({ weight: 'bold' }) // => 'font-bold'
```

## Next Steps

- Learn about [Base Styles](/core-concepts/base-styles/) for styles that apply to all instances
- Set up [Default Variants](/core-concepts/default-variants/) for fallback values
- Combine variants with [Compound Variants](/core-concepts/compound-variants/)
