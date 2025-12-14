---
title: Boolean Variants
description: Using boolean variants for true/false toggles
---

Boolean variants provide a convenient way to handle on/off or enabled/disabled states in your components.

## Defining Boolean Variants

Boolean variants use string keys `'true'` and `'false'` in the variant definition:

```typescript
import { cv } from 'css-variants'

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
```

## Using Boolean Variants

When calling the variant function, you can pass actual boolean values:

```typescript
// TypeScript allows boolean props
checkbox({ checked: true, disabled: false })
// => 'w-4 h-4 rounded border bg-blue-600 border-blue-600 cursor-pointer'

checkbox({ checked: false, disabled: true })
// => 'w-4 h-4 rounded border bg-white border-gray-300 opacity-50 cursor-not-allowed'
```

## Why String Keys?

You might wonder why we use `'true'` and `'false'` as strings instead of actual booleans. This is because:

1. **Object keys must be strings or symbols** in JavaScript
2. **TypeScript inference works correctly** - the types are automatically inferred as booleans
3. **Consistency** with other variant patterns

```typescript
// This works because of how JavaScript handles object keys
const button = cv({
  variants: {
    disabled: {
      true: 'opacity-50',  // Key is string 'true'
      false: 'opacity-100', // Key is string 'false'
    },
  },
})

// Props accept actual booleans
button({ disabled: true })  // ✓ Works
button({ disabled: false }) // ✓ Works
button({ disabled: 'true' }) // TypeScript error - expects boolean
```

## Boolean Variants with Defaults

Set default boolean states:

```typescript
const toggle = cv({
  base: 'relative inline-flex h-6 w-11 rounded-full transition-colors',
  variants: {
    enabled: {
      true: 'bg-blue-600',
      false: 'bg-gray-200',
    },
    size: {
      sm: 'h-5 w-9',
      md: 'h-6 w-11',
      lg: 'h-7 w-14',
    },
  },
  defaultVariants: {
    enabled: false, // Default to disabled state
    size: 'md',
  },
})

toggle() // => '... bg-gray-200 h-6 w-11'
toggle({ enabled: true }) // => '... bg-blue-600 h-6 w-11'
```

## Boolean Variants in Compounds

Boolean variants work naturally in compound variants:

```typescript
const button = cv({
  base: 'px-4 py-2 rounded font-medium',
  variants: {
    color: {
      primary: 'bg-blue-600 text-white',
      secondary: 'bg-gray-200 text-gray-900',
    },
    loading: {
      true: 'relative text-transparent',
      false: '',
    },
    disabled: {
      true: 'opacity-50 cursor-not-allowed',
      false: '',
    },
  },
  compoundVariants: [
    {
      loading: true,
      disabled: false,
      className: 'cursor-wait',
    },
    {
      color: 'primary',
      disabled: true,
      className: 'bg-blue-400', // Lighter blue when disabled
    },
  ],
})
```

## Partial Boolean Variants

You don't have to define both `true` and `false`:

```typescript
const input = cv({
  base: 'border rounded px-3 py-2',
  variants: {
    error: {
      true: 'border-red-500 focus:ring-red-500',
      // No 'false' - just uses base styles
    },
    fullWidth: {
      true: 'w-full',
      // No 'false' - default width
    },
  },
})

input() // => 'border rounded px-3 py-2'
input({ error: true }) // => 'border rounded px-3 py-2 border-red-500 focus:ring-red-500'
input({ error: false }) // => 'border rounded px-3 py-2' (same as default)
```

## React Pattern

A common pattern in React is to pass boolean props directly:

```tsx
import { type ReactNode } from 'react'

const buttonVariants = cv({
  base: 'px-4 py-2 rounded',
  variants: {
    disabled: {
      true: 'opacity-50 cursor-not-allowed',
      false: 'hover:bg-opacity-90',
    },
    loading: {
      true: 'cursor-wait',
      false: '',
    },
  },
  defaultVariants: {
    disabled: false,
    loading: false,
  },
})

type ButtonProps = Parameters<typeof buttonVariants>[0] & {
  children?: ReactNode
}

function Button({ disabled, loading, children }: ButtonProps) {
  return (
    <button
      className={buttonVariants({ disabled, loading })}
      disabled={disabled || loading}
    >
      {children}
    </button>
  )
}

// Usage
<Button disabled>Can't click</Button>
<Button loading>Loading...</Button>
```
