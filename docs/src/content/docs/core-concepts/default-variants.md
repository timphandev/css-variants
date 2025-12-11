---
title: Default Variants
description: Set default values for variants when no props are provided
---

Default variants let you specify fallback values when variant props aren't provided.

## Setting Defaults

Use the `defaultVariants` property to define default values:

```typescript
import { cv } from 'css-variants'

const input = cv({
  variants: {
    size: {
      sm: 'text-sm px-2 py-1',
      md: 'text-base px-3 py-2',
      lg: 'text-lg px-4 py-3',
    },
    variant: {
      outline: 'border border-gray-300',
      filled: 'bg-gray-100 border-transparent',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'outline',
  },
})
```

## Using Defaults

When you call the variant function without specifying a value, the default is used:

```typescript
// Uses both defaults
input()
// => 'text-base px-3 py-2 border border-gray-300'

// Overrides size, uses default variant
input({ size: 'lg' })
// => 'text-lg px-4 py-3 border border-gray-300'

// Overrides both
input({ size: 'sm', variant: 'filled' })
// => 'text-sm px-2 py-1 bg-gray-100 border-transparent'
```

## Partial Defaults

You don't need to provide defaults for every variant. Only define defaults for variants that should have a fallback:

```typescript
const button = cv({
  variants: {
    color: {
      primary: 'bg-blue-600 text-white',
      secondary: 'bg-gray-200 text-gray-900',
      danger: 'bg-red-600 text-white',
    },
    size: {
      sm: 'px-3 py-1.5',
      md: 'px-4 py-2',
      lg: 'px-6 py-3',
    },
    disabled: {
      true: 'opacity-50 cursor-not-allowed',
      false: 'cursor-pointer',
    },
  },
  defaultVariants: {
    size: 'md', // Only size has a default
  },
})

// size defaults to 'md', color and disabled have no value
button()
// => 'px-4 py-2'

// Must specify color explicitly
button({ color: 'primary' })
// => 'bg-blue-600 text-white px-4 py-2'
```

## Defaults in Slot Variants

Default variants work the same way in slot variants (`scv`):

```typescript
import { scv } from 'css-variants'

const card = scv({
  slots: ['root', 'header', 'content'],
  base: {
    root: 'rounded-lg border',
    header: 'p-4 border-b',
    content: 'p-4',
  },
  variants: {
    variant: {
      default: { root: 'border-gray-200 bg-white' },
      primary: { root: 'border-blue-200 bg-blue-50' },
    },
    size: {
      sm: { header: 'p-2', content: 'p-2' },
      md: { header: 'p-4', content: 'p-4' },
      lg: { header: 'p-6', content: 'p-6' },
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
})
```

## Best Practices

1. **Set sensible defaults**: Choose the most commonly used variant values as defaults

2. **Document your defaults**: When building a component library, make defaults clear in documentation

3. **Consider omitting defaults for required variants**: If a variant should always be explicitly chosen, don't provide a default

```typescript
// Color is important - require explicit choice
const alert = cv({
  variants: {
    type: {
      info: 'bg-blue-100 text-blue-900',
      warning: 'bg-yellow-100 text-yellow-900',
      error: 'bg-red-100 text-red-900',
      success: 'bg-green-100 text-green-900',
    },
  },
  // No default - force developers to think about which alert type to use
})
```
