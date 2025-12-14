---
title: cv - Class Variants
description: API reference for the cv function
---

Create variants for **single-element components** using CSS class names.

## Import

```typescript
import { cv } from 'css-variants'
```

## Type Signature

```typescript
function cv<T extends ClassVariantRecord | undefined>(
  config: ClassVariantDefinition<T>
): ClassVariantFn<T>

interface ClassVariantDefinition<T> {
  base?: ClassValue
  variants?: T
  compoundVariants?: (ObjectKeyArrayPicker<T> & { className: ClassValue })[]
  defaultVariants?: ObjectKeyPicker<T>
  classNameResolver?: typeof cx
}
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `base` | `ClassValue` | Base classes applied to all instances |
| `variants` | `Record<string, Record<string, ClassValue>>` | Variant definitions |
| `compoundVariants` | `Array` | Conditional styles when multiple variants match |
| `defaultVariants` | `Object` | Default variant selections |
| `classNameResolver` | `Function` | Custom class merger (default: `cx`) |

## Return Value

Returns a function that accepts variant props and returns a class name string.

```typescript
type ClassVariantFn<T> = (props?: VariantProps<T> & { className?: ClassValue }) => string
```

## Examples

### Basic Variant

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

badge({ variant: 'success' })
// => 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800'
```

### Complex Variant with Compound Rules

```typescript
const toast = cv({
  base: 'rounded-lg p-4 shadow-lg transition-all',
  variants: {
    variant: {
      info: 'bg-blue-50 text-blue-900 border-blue-200',
      success: 'bg-green-50 text-green-900 border-green-200',
      error: 'bg-red-50 text-red-900 border-red-200',
    },
    position: {
      'top-right': 'top-4 right-4',
      'bottom-right': 'bottom-4 right-4',
      'top-left': 'top-4 left-4',
      'bottom-left': 'bottom-4 left-4',
    },
    dismissible: {
      true: 'pr-10',
      false: '',
    },
  },
  compoundVariants: [
    {
      variant: 'error',
      dismissible: true,
      className: 'border-l-4 border-l-red-600',
    },
  ],
  defaultVariants: {
    variant: 'info',
    position: 'top-right',
    dismissible: false,
  },
})
```

### Array and Object ClassValues

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

### Runtime Class Overrides

```typescript
const button = cv({
  base: 'px-4 py-2 rounded',
  variants: {
    color: {
      primary: 'bg-blue-600 text-white',
    },
  },
})

button({ color: 'primary', className: 'mt-4 w-full' })
// => 'px-4 py-2 rounded bg-blue-600 text-white mt-4 w-full'
```

### Custom Class Resolver

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
// With twMerge: 'px-6 py-3 text-lg' (conflicts resolved)
```

## TypeScript

### Extract Variant Props

```typescript
const button = cv({
  variants: {
    color: { primary: '...', secondary: '...' },
    size: { sm: '...', md: '...', lg: '...' },
  },
})

type ButtonVariants = Parameters<typeof button>[0]
// => { color?: 'primary' | 'secondary', size?: 'sm' | 'md' | 'lg', className?: ClassValue }
```

### Use in Components

```typescript
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  Parameters<typeof button>[0]

function Button({ color, size, className, children, ...props }: ButtonProps) {
  return (
    <button className={button({ color, size, className })} {...props}>
      {children}
    </button>
  )
}
```
