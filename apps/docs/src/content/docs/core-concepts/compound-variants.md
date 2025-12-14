---
title: Compound Variants
description: Apply styles when multiple variants match simultaneously
---

Compound variants let you apply additional styles when **multiple variants match simultaneously**. This is useful for handling edge cases and variant interactions.

## Basic Compound Variants

Use the `compoundVariants` array to define conditional styles:

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
// => 'rounded font-medium bg-blue-600 text-white px-6 py-3 text-lg font-bold shadow-lg'
```

## Array Matching

Match against multiple variant values using arrays:

```typescript
const text = cv({
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    },
    weight: {
      normal: 'font-normal',
      bold: 'font-bold',
    },
  },
  compoundVariants: [
    {
      size: ['lg', 'xl'], // Match either lg OR xl
      weight: 'bold',
      className: 'tracking-tight', // Tighter letter spacing for large bold text
    },
  ],
})

text({ size: 'lg', weight: 'bold' })
// => 'text-lg font-bold tracking-tight'

text({ size: 'xl', weight: 'bold' })
// => 'text-xl font-bold tracking-tight'

text({ size: 'md', weight: 'bold' })
// => 'text-base font-bold' (no tracking-tight)
```

## Multiple Conditions

Compound variants can match any number of variant conditions:

```typescript
const button = cv({
  variants: {
    color: { primary: '...', secondary: '...' },
    size: { sm: '...', md: '...', lg: '...' },
    outlined: { true: '...', false: '...' },
  },
  compoundVariants: [
    {
      color: 'primary',
      size: 'lg',
      outlined: false,
      className: 'shadow-xl ring-2 ring-blue-300',
    },
  ],
})
```

## Order Matters

Compound variants are applied in order, so later rules can override earlier ones:

```typescript
const card = cv({
  variants: {
    variant: { default: '...', featured: '...' },
    size: { sm: '...', lg: '...' },
  },
  compoundVariants: [
    // Applied first
    { variant: 'featured', className: 'border-2 border-yellow-400' },
    // Applied second - can add to or override the above
    { variant: 'featured', size: 'lg', className: 'border-4' },
  ],
})
```

## Compound Variants in Slot Variants

For slot variants (`scv`), use `classNames` instead of `className`:

```typescript
import { scv } from 'css-variants'

const button = scv({
  slots: ['root', 'icon', 'label'],
  base: {
    root: 'inline-flex items-center gap-2 rounded font-medium',
    icon: 'w-5 h-5',
    label: '',
  },
  variants: {
    size: {
      sm: {
        root: 'px-3 py-1.5 text-sm',
        icon: 'w-4 h-4',
      },
      lg: {
        root: 'px-6 py-3 text-lg',
        icon: 'w-6 h-6',
      },
    },
    color: {
      primary: { root: 'bg-blue-600 text-white' },
      danger: { root: 'bg-red-600 text-white' },
    },
  },
  compoundVariants: [
    {
      size: 'lg',
      color: 'primary',
      classNames: {
        root: 'shadow-lg',
        label: 'font-bold',
      },
    },
  ],
})
```

## Style Variants Compound

For style variants (`sv`), use `style` instead of `className`:

```typescript
import { sv } from 'css-variants'

const progressBar = sv({
  base: {
    width: '100%',
    height: '8px',
    borderRadius: '9999px',
  },
  variants: {
    variant: {
      default: { backgroundColor: '#e5e7eb' },
      success: { backgroundColor: '#d1fae5' },
    },
    animated: {
      true: { transition: 'all 0.3s ease' },
      false: {},
    },
  },
  compoundVariants: [
    {
      variant: 'success',
      animated: true,
      style: {
        boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)',
      },
    },
  ],
})
```

## Best Practices

1. **Use sparingly**: Too many compound variants can make your code hard to understand

2. **Document edge cases**: When compound variants handle edge cases, add comments explaining why

3. **Consider alternatives**: Sometimes it's clearer to create a separate variant instead of a compound rule

```typescript
// Compound variant approach
compoundVariants: [
  { color: 'primary', size: 'lg', className: 'shadow-lg font-bold' },
]

// Alternative: explicit variant
variants: {
  featured: {
    true: 'shadow-lg font-bold',
    false: '',
  },
}
```
