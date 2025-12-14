---
title: scv - Slot Class Variants
description: API reference for the scv function
---

Create variants for **multi-element components** using CSS class names. Perfect for complex UI components like cards, modals, or navigation menus.

## Import

```typescript
import { scv } from 'css-variants'
```

## Type Signature

```typescript
function scv<S extends string, T extends SlotClassVariantRecord<S> | undefined>(
  config: SlotClassVariantDefinition<S, T>
): SlotClassVariantFn<S, T>

interface SlotClassVariantDefinition<S, T> {
  slots: S[]
  base?: PartialRecord<S, ClassValue>
  variants?: T
  compoundVariants?: (ObjectKeyArrayPicker<T> & { classNames: PartialRecord<S, ClassValue> })[]
  defaultVariants?: ObjectKeyPicker<T>
  classNameResolver?: typeof cx
}
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `slots` | `string[]` | Array of slot names |
| `base` | `Record<Slot, ClassValue>` | Base classes for each slot |
| `variants` | `Record<string, Record<string, Record<Slot, ClassValue>>>` | Variant definitions per slot |
| `compoundVariants` | `Array` | Conditional styles with `classNames` for slots |
| `defaultVariants` | `Object` | Default variant selections |
| `classNameResolver` | `Function` | Custom class merger (default: `cx`) |

## Return Value

Returns a function that accepts variant props and returns an object mapping slot names to class name strings.

```typescript
type SlotClassVariantFn<S, T> = (
  props?: VariantProps<T> & { classNames?: PartialRecord<S, ClassValue> }
) => Record<S, string>
```

## Examples

### Card Component

```typescript
const card = scv({
  slots: ['root', 'header', 'title', 'description', 'content', 'footer'],
  base: {
    root: 'rounded-lg border bg-white shadow-sm',
    header: 'border-b p-6',
    title: 'text-2xl font-semibold',
    description: 'text-sm text-gray-500 mt-1',
    content: 'p-6',
    footer: 'border-t bg-gray-50 px-6 py-3',
  },
  variants: {
    variant: {
      default: {
        root: 'border-gray-200',
      },
      primary: {
        root: 'border-blue-200',
        title: 'text-blue-900',
      },
      danger: {
        root: 'border-red-200 bg-red-50',
        title: 'text-red-900',
      },
    },
    padding: {
      none: {
        content: 'p-0',
        header: 'p-0',
        footer: 'p-0',
      },
      sm: {
        content: 'p-4',
        header: 'p-4',
        footer: 'px-4 py-2',
      },
      lg: {
        content: 'p-8',
        header: 'p-8',
        footer: 'px-8 py-4',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const classes = card({ variant: 'primary' })
// => {
//   root: 'rounded-lg border bg-white shadow-sm border-blue-200',
//   header: 'border-b p-6',
//   title: 'text-2xl font-semibold text-blue-900',
//   description: 'text-sm text-gray-500 mt-1',
//   content: 'p-6',
//   footer: 'border-t bg-gray-50 px-6 py-3'
// }
```

### Modal Component

```typescript
const modal = scv({
  slots: ['overlay', 'container', 'content', 'header', 'body', 'footer', 'closeButton'],
  base: {
    overlay: 'fixed inset-0 bg-black/50 flex items-center justify-center',
    container: 'relative bg-white rounded-lg shadow-xl',
    content: 'flex flex-col',
    header: 'flex items-center justify-between px-6 py-4 border-b',
    body: 'px-6 py-4',
    footer: 'flex justify-end gap-2 px-6 py-4 border-t bg-gray-50',
    closeButton: 'text-gray-400 hover:text-gray-600',
  },
  variants: {
    size: {
      sm: { container: 'max-w-md' },
      md: { container: 'max-w-lg' },
      lg: { container: 'max-w-2xl' },
      xl: { container: 'max-w-4xl' },
      full: { container: 'max-w-full mx-4' },
    },
    centered: {
      true: { overlay: 'items-center justify-center' },
      false: { overlay: 'items-start justify-center pt-16' },
    },
  },
  defaultVariants: {
    size: 'md',
    centered: true,
  },
})
```

### Slot-Specific Overrides

Override or add classes to specific slots at runtime:

```typescript
const classes = card({
  variant: 'primary',
  classNames: {
    root: 'max-w-2xl mx-auto',      // Add additional classes to root
    title: 'text-3xl',               // Override title size
    footer: 'flex justify-between',  // Change footer layout
  },
})
```

### Compound Variants with Slots

```typescript
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
      primary: {
        root: 'bg-blue-600 text-white',
      },
      danger: {
        root: 'bg-red-600 text-white',
      },
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

### React Usage

```tsx
function Card({ variant, padding, children }) {
  const classes = card({ variant, padding })

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <h3 className={classes.title}>Card Title</h3>
        <p className={classes.description}>Card description</p>
      </div>
      <div className={classes.content}>{children}</div>
      <div className={classes.footer}>Footer content</div>
    </div>
  )
}
```

## TypeScript

### Extract Variant Props

```typescript
const card = scv({
  slots: ['root', 'header', 'content'],
  variants: {
    variant: { default: {...}, primary: {...} },
    size: { sm: {...}, lg: {...} },
  },
})

type CardVariants = Parameters<typeof card>[0]
// => {
//   variant?: 'default' | 'primary',
//   size?: 'sm' | 'lg',
//   classNames?: { root?: ClassValue, header?: ClassValue, content?: ClassValue }
// }
```

### Get Slot Names

```typescript
type CardSlots = keyof ReturnType<typeof card>
// => 'root' | 'header' | 'content'
```
