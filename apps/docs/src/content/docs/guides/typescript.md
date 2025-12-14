---
title: TypeScript
description: Getting the most out of TypeScript with css-variants
---

css-variants is built with TypeScript and provides complete type inference out of the box.

## Type Inference

Variant types are automatically inferred from your configuration:

```typescript
import { cv } from 'css-variants'

const button = cv({
  variants: {
    color: {
      primary: 'bg-blue-600',
      secondary: 'bg-gray-200',
      danger: 'bg-red-600',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
})

// TypeScript knows the valid options
button({ color: 'primary' }) // ✓ Valid
button({ color: 'invalid' }) // ✗ Error: Type '"invalid"' is not assignable
button({ size: 'xl' }) // ✗ Error: Type '"xl"' is not assignable
```

## Extracting Variant Types

Use `Parameters` to extract the props type from a variant function:

```typescript
const button = cv({
  variants: {
    color: { primary: '...', secondary: '...' },
    size: { sm: '...', md: '...', lg: '...' },
  },
})

// Extract the variant props type
type ButtonVariants = Parameters<typeof button>[0]
// => {
//   color?: 'primary' | 'secondary'
//   size?: 'sm' | 'md' | 'lg'
//   className?: ClassValue
// }
```

## Component Props

Combine variant props with HTML element props:

### React

```tsx
import { cv } from 'css-variants'

const buttonVariants = cv({
  base: 'rounded font-medium',
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
  },
})

type ButtonVariants = Parameters<typeof buttonVariants>[0]

// Combine with HTML button props
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & ButtonVariants

export function Button({
  color,
  size,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonVariants({ color, size, className })}
      {...props}
    >
      {children}
    </button>
  )
}
```

### With Required Variants

Make specific variants required:

```tsx
type ButtonVariants = Parameters<typeof buttonVariants>[0]

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  Omit<ButtonVariants, 'color'> &
  Required<Pick<ButtonVariants, 'color'>>

// Now color is required
<Button color="primary">Click me</Button> // ✓
<Button>Click me</Button> // ✗ Error: Property 'color' is missing
```

## Slot Variant Types

For slot variants, you can extract both props and slot names:

```typescript
import { scv } from 'css-variants'

const card = scv({
  slots: ['root', 'header', 'title', 'content', 'footer'],
  base: {
    root: 'rounded-lg border',
    header: 'p-4 border-b',
    title: 'text-lg font-semibold',
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

// Extract variant props
type CardVariants = Parameters<typeof card>[0]
// => {
//   variant?: 'default' | 'primary'
//   classNames?: { root?: ClassValue, header?: ClassValue, ... }
// }

// Extract slot names
type CardSlots = keyof ReturnType<typeof card>
// => 'root' | 'header' | 'title' | 'content' | 'footer'
```

## Boolean Variants

Boolean variants accept actual `boolean` values despite using string keys:

```typescript
const checkbox = cv({
  variants: {
    checked: {
      true: 'bg-blue-600',  // String key
      false: 'bg-white',    // String key
    },
    disabled: {
      true: 'opacity-50',
      false: '',
    },
  },
})

// TypeScript accepts booleans
checkbox({ checked: true, disabled: false }) // ✓ Valid
checkbox({ checked: 'true' }) // ✗ Error: Type 'string' is not assignable to type 'boolean'
```

## Type Utilities

### NonNullable Variants

```typescript
type ButtonVariants = Parameters<typeof button>[0]
type RequiredVariants = NonNullable<ButtonVariants>
```

### Variant Keys

```typescript
const button = cv({
  variants: {
    color: { primary: '...', secondary: '...' },
    size: { sm: '...', md: '...', lg: '...' },
  },
})

type VariantConfig = Parameters<typeof button>[0]
type ColorOptions = NonNullable<VariantConfig>['color']
// => 'primary' | 'secondary' | undefined

type SizeOptions = NonNullable<VariantConfig>['size']
// => 'sm' | 'md' | 'lg' | undefined
```

## IDE Support

css-variants provides excellent IDE support:

- **Autocomplete** for variant names and values
- **Type checking** for invalid variants
- **Hover documentation** showing available options
- **Go to definition** for variant configurations

Make sure your `tsconfig.json` has strict mode enabled for the best experience:

```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true
  }
}
```
