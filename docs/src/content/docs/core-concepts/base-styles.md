---
title: Base Styles
description: Apply styles to all component instances with base styles
---

Base styles are applied to **all** instances of a component, regardless of which variants are selected.

## Defining Base Styles

Use the `base` property to define styles that always apply:

```typescript
import { cv } from 'css-variants'

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

card({ padding: 'sm' })
// => 'rounded-lg shadow-md overflow-hidden p-4'

card({ padding: 'lg' })
// => 'rounded-lg shadow-md overflow-hidden p-8'
```

## Base Style Formats

Like variant values, base styles support multiple formats:

### String

```typescript
const button = cv({
  base: 'font-medium rounded transition-colors',
})
```

### Array

```typescript
const button = cv({
  base: ['font-medium', 'rounded', 'transition-colors'],
})
```

### Object (conditional)

```typescript
const button = cv({
  base: {
    'font-medium': true,
    'rounded': true,
    'transition-colors': true,
  },
})
```

### Mixed

```typescript
const button = cv({
  base: [
    'font-medium',
    'rounded',
    { 'transition-colors': true, 'focus:ring-2': true },
  ],
})
```

## Base Styles in Slot Variants

When using slot class variants (`scv`), base styles are defined per slot:

```typescript
import { scv } from 'css-variants'

const modal = scv({
  slots: ['overlay', 'container', 'content', 'header', 'body', 'footer'],
  base: {
    overlay: 'fixed inset-0 bg-black/50',
    container: 'relative bg-white rounded-lg shadow-xl',
    content: 'flex flex-col',
    header: 'px-6 py-4 border-b',
    body: 'px-6 py-4',
    footer: 'px-6 py-4 border-t',
  },
  variants: {
    size: {
      sm: { container: 'max-w-md' },
      md: { container: 'max-w-lg' },
      lg: { container: 'max-w-2xl' },
    },
  },
})
```

## Style Variants Base

For style variants (`sv`), base accepts CSS properties:

```typescript
import { sv } from 'css-variants'

const box = sv({
  base: {
    display: 'flex',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
  },
  variants: {
    size: {
      sm: { padding: '8px' },
      lg: { padding: '24px' },
    },
  },
})
```

## Best Practices

1. **Put shared styles in base**: Any styles that apply to all variants should go in `base`

2. **Keep base minimal**: Only include styles that truly apply to every instance

3. **Use variants for differences**: If a style changes based on props, it belongs in variants, not base

```typescript
// Good: color varies, so it's in variants
const badge = cv({
  base: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  variants: {
    color: {
      gray: 'bg-gray-100 text-gray-800',
      red: 'bg-red-100 text-red-800',
    },
  },
})

// Avoid: putting a specific color in base
const badge = cv({
  base: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800',
  variants: {
    color: {
      red: 'bg-red-100 text-red-800', // Now you have to override gray
    },
  },
})
```
