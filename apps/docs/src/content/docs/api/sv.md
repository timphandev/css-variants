---
title: sv - Style Variants
description: API reference for the sv function
---

Create variants for **inline CSS styles** (React's `style` prop, Vue's `:style`, etc.).

## Import

```typescript
import { sv } from 'css-variants'
```

## Type Signature

```typescript
function sv<T extends StyleVariantRecord | undefined>(
  config: StyleVariantDefinition<T>
): StyleVariantFn<T>

interface StyleVariantDefinition<T> {
  base?: CssProperties
  variants?: T
  compoundVariants?: (ObjectKeyArrayPicker<T> & { style: CssProperties })[]
  defaultVariants?: ObjectKeyPicker<T>
}

type CssProperties = Properties<string | number> & {
  [key: `--${string}`]: string | number  // CSS custom properties
}
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `base` | `CssProperties` | Base styles applied to all instances |
| `variants` | `Record<string, Record<string, CssProperties>>` | Variant definitions |
| `compoundVariants` | `Array` | Conditional styles with `style` property |
| `defaultVariants` | `Object` | Default variant selections |

## Return Value

Returns a function that accepts variant props and returns a CSS properties object.

```typescript
type StyleVariantFn<T> = (props?: VariantProps<T> & { style?: CssProperties }) => CssProperties
```

## Examples

### Basic Style Variant

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
// => {
//   display: 'flex',
//   borderRadius: '8px',
//   padding: '24px',
//   fontSize: '18px',
//   backgroundColor: '#dbeafe',
//   color: '#1e40af'
// }
```

### CSS Custom Properties (CSS Variables)

```typescript
const theme = sv({
  base: {
    '--spacing-unit': '8px',
    '--border-radius': '4px',
  },
  variants: {
    theme: {
      light: {
        '--color-bg': '#ffffff',
        '--color-text': '#000000',
      },
      dark: {
        '--color-bg': '#1a1a1a',
        '--color-text': '#ffffff',
      },
    },
  },
})

// React usage
<div style={theme({ theme: 'dark' })}>
  <p style={{ color: 'var(--color-text)' }}>Dark mode text</p>
</div>
```

### Compound Style Variants

```typescript
const progressBar = sv({
  base: {
    width: '100%',
    height: '8px',
    borderRadius: '9999px',
    overflow: 'hidden',
  },
  variants: {
    variant: {
      default: { backgroundColor: '#e5e7eb' },
      success: { backgroundColor: '#d1fae5' },
      error: { backgroundColor: '#fee2e2' },
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

### Runtime Style Overrides

Add or override styles at runtime:

```typescript
const card = sv({
  base: { padding: '16px', borderRadius: '8px' },
})

card({ style: { marginTop: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' } })
// => {
//   padding: '16px',
//   borderRadius: '8px',
//   marginTop: '24px',
//   boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
// }
```

### React Example

```typescript
import type { CSSProperties, PropsWithChildren } from 'react'

const boxStyles = sv({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  variants: {
    size: {
      sm: { width: '100px', height: '100px' },
      md: { width: '200px', height: '200px' },
      lg: { width: '300px', height: '300px' },
    },
    color: {
      blue: { backgroundColor: '#3b82f6' },
      green: { backgroundColor: '#10b981' },
      red: { backgroundColor: '#ef4444' },
    },
  },
})

type BoxProps = PropsWithChildren<Parameters<typeof boxStyles>[0]>

function Box({ size, color, children, style }: BoxProps) {
  return (
    <div style={boxStyles({ size, color, style })}>
      {children}
    </div>
  )
}

// Usage
<Box size="lg" color="blue" style={{ border: '2px solid white' }}>
  Content
</Box>
```

### Vue Example

```vue
<template>
  <div :style="boxStyle">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { sv } from 'css-variants'

const box = sv({
  base: { padding: '16px', borderRadius: '8px' },
  variants: {
    variant: {
      solid: { backgroundColor: '#3b82f6', color: 'white' },
      outline: { border: '2px solid #3b82f6', color: '#3b82f6' },
    },
  },
})

type BoxProps = Parameters<typeof box>[0]

const { variant } = defineProps<BoxProps>()
const boxStyle = computed(() => box({ variant }))
</script>
```

## TypeScript

### Extract Variant Props

```typescript
const box = sv({
  variants: {
    size: { sm: {...}, md: {...}, lg: {...} },
    color: { blue: {...}, green: {...} },
  },
})

type BoxVariants = Parameters<typeof box>[0]
// => { size?: 'sm' | 'md' | 'lg', color?: 'blue' | 'green', style?: CssProperties }
```

## When to Use `sv` vs `cv`

| Use `sv` when... | Use `cv` when... |
|------------------|------------------|
| Working with inline styles | Working with CSS classes |
| Need dynamic CSS values | Using Tailwind or CSS frameworks |
| Managing CSS custom properties | Want class-based styling |
| Need programmatic style control | Building a class-based design system |
