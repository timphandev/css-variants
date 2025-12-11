---
title: Migration from CVA
description: How to migrate from Class Variance Authority (CVA) to css-variants
---

css-variants has a similar API to [CVA (Class Variance Authority)](https://cva.style/docs), making migration straightforward.

## Key Differences

| Feature | CVA | css-variants |
|---------|-----|--------------|
| Base styles | First argument | `base` property |
| Compound class key | `class` | `className` |
| Custom merger | `class` in call | `classNameResolver` in config |
| Slot variants | Not built-in | `scv` function |
| Style variants | Not built-in | `sv` and `ssv` functions |

## Basic Migration

### Before (CVA)

```typescript
import { cva } from 'class-variance-authority'

const button = cva('btn base-styles', {
  variants: {
    color: {
      primary: 'bg-blue-600 text-white',
      secondary: 'bg-gray-200 text-gray-900',
    },
    size: {
      sm: 'px-3 py-1 text-sm',
      lg: 'px-6 py-3 text-lg',
    },
  },
  defaultVariants: {
    color: 'primary',
    size: 'sm',
  },
})
```

### After (css-variants)

```typescript
import { cv } from 'css-variants'

const button = cv({
  base: 'btn base-styles',  // Move to 'base' property
  variants: {
    color: {
      primary: 'bg-blue-600 text-white',
      secondary: 'bg-gray-200 text-gray-900',
    },
    size: {
      sm: 'px-3 py-1 text-sm',
      lg: 'px-6 py-3 text-lg',
    },
  },
  defaultVariants: {
    color: 'primary',
    size: 'sm',
  },
})
```

## Compound Variants

### Before (CVA)

```typescript
const button = cva('btn', {
  variants: { /* ... */ },
  compoundVariants: [
    {
      color: 'primary',
      size: 'lg',
      class: 'shadow-lg', // CVA uses 'class'
    },
  ],
})
```

### After (css-variants)

```typescript
const button = cv({
  base: 'btn',
  variants: { /* ... */ },
  compoundVariants: [
    {
      color: 'primary',
      size: 'lg',
      className: 'shadow-lg', // css-variants uses 'className'
    },
  ],
})
```

## Runtime Class Overrides

### Before (CVA)

```typescript
button({ color: 'primary', class: 'mt-4' })
```

### After (css-variants)

```typescript
button({ color: 'primary', className: 'mt-4' })
```

## Type Extraction

### Before (CVA)

```typescript
import { type VariantProps } from 'class-variance-authority'

const button = cva('btn', { /* ... */ })

type ButtonProps = VariantProps<typeof button>
```

### After (css-variants)

```typescript
const button = cv({ /* ... */ })

type ButtonProps = Parameters<typeof button>[0]
```

## New Features in css-variants

After migrating, you can take advantage of features not available in CVA:

### Slot Variants

```typescript
import { scv } from 'css-variants'

const card = scv({
  slots: ['root', 'header', 'content', 'footer'],
  base: {
    root: 'rounded-lg border',
    header: 'p-4 border-b',
    content: 'p-4',
    footer: 'p-4 border-t',
  },
  variants: {
    variant: {
      default: { root: 'border-gray-200' },
      primary: { root: 'border-blue-200' },
    },
  },
})
```

### Style Variants

```typescript
import { sv } from 'css-variants'

const box = sv({
  base: {
    display: 'flex',
    borderRadius: '8px',
  },
  variants: {
    size: {
      sm: { padding: '8px' },
      lg: { padding: '24px' },
    },
  },
})
```

## Migration Checklist

- [ ] Replace `cva` imports with `cv` from `css-variants`
- [ ] Move first argument (base classes) to `base` property
- [ ] Change `class` to `className` in compound variants
- [ ] Change `class` to `className` in runtime overrides
- [ ] Update `VariantProps` type extraction to use `Parameters<typeof fn>[0]`
- [ ] (Optional) Convert multi-element components to use `scv`
