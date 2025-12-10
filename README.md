# css-variants

> **Zero-dependency, type-safe CSS variant composition for modern JavaScript**

Build powerful, flexible component style systems with variants. Perfect for Tailwind CSS, vanilla CSS, or any CSS-in-JS solution.

[![test](https://github.com/timphandev/css-variants/actions/workflows/ci.yml/badge.svg)](https://github.com/timphandev/css-variants/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/css-variants.svg)](https://www.npmjs.com/package/css-variants)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/css-variants)](https://bundlephobia.com/package/css-variants)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Why css-variants?

⚡ **Tiny & Fast** — Zero dependencies, ~1KB minified+gzipped

🔒 **Type-Safe** — First-class TypeScript support with complete type inference

🧩 **Flexible** — Works with Tailwind, CSS modules, vanilla CSS, or inline styles

👨‍💻 **Developer-Friendly** — Intuitive API inspired by CVA and Panda CSS

🚀 **Production-Ready** — Battle-tested, fully tested, dual CJS/ESM builds

---

## Table of Contents

- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
- [API Reference](#api-reference)
  - [`cv` - Class Variants](#cv---class-variants)
  - [`scv` - Slot Class Variants](#scv---slot-class-variants)
  - [`sv` - Style Variants](#sv---style-variants)
  - [`ssv` - Slot Style Variants](#ssv---slot-style-variants)
  - [`cx` - Class Name Merger](#cx---class-name-merger)
- [Advanced Patterns](#advanced-patterns)
- [Framework Integration](#framework-integration)
- [Migration Guide](#migration-guide)
- [Performance](#performance)

---

## Quick Start

### Installation

```bash
npm install css-variants
# or
yarn add css-variants
# or
pnpm add css-variants
```

### Your First Variant

```typescript
import { cv } from 'css-variants'

const button = cv({
  base: 'font-semibold rounded-lg transition-colors',
  variants: {
    color: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
      danger: 'bg-red-600 text-white hover:bg-red-700',
    },
    size: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    },
  },
  defaultVariants: {
    color: 'primary',
    size: 'md',
  },
})

// Usage
button() // => 'font-semibold rounded-lg transition-colors bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 text-base'
button({ color: 'danger', size: 'lg' }) // => '... bg-red-600 text-white hover:bg-red-700 px-6 py-3 text-lg'
```

### Framework Examples

**React**
```tsx
function Button({ color, size, children, ...props }) {
  return (
    <button className={button({ color, size })} {...props}>
      {children}
    </button>
  )
}

<Button color="danger" size="lg">Delete Account</Button>
```

**Vue**
```vue
<template>
  <button :class="button({ color, size })">
    <slot />
  </button>
</template>

<script setup>
import { cv } from 'css-variants'

const props = defineProps(['color', 'size'])
const button = cv({ /* config */ })
</script>
```

---

## Core Concepts

### Variants

Variants are named groups of style options. Each variant has a set of possible values:

```typescript
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

### Base Styles

Base styles are applied to **all** instances, regardless of variants:

```typescript
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

card({ padding: 'sm' }) // => 'rounded-lg shadow-md overflow-hidden p-4'
```

### Default Variants

Set default values for variants when no props are provided:

```typescript
const input = cv({
  variants: {
    size: {
      sm: 'text-sm px-2 py-1',
      md: 'text-base px-3 py-2',
      lg: 'text-lg px-4 py-3',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

input() // => 'text-base px-3 py-2' (uses default)
input({ size: 'lg' }) // => 'text-lg px-4 py-3' (overrides default)
```

### Compound Variants

Apply styles when **multiple variants match simultaneously**:

```typescript
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
// => Includes 'font-bold shadow-lg' from compound variant
```

**Array Matching** — Match against multiple variant values:

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
      size: ['lg', 'xl'], // Match multiple sizes
      weight: 'bold',
      className: 'tracking-tight', // Apply tighter letter spacing to large bold text
    },
  ],
})
```

### Boolean Variants

Boolean variants use string keys `'true'` and `'false'`, but accept actual booleans in props:

```typescript
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

// TypeScript allows boolean props
checkbox({ checked: true, disabled: false })
// => 'w-4 h-4 rounded border bg-blue-600 border-blue-600 cursor-pointer'
```

### Runtime Class Overrides

Override or extend classes at runtime:

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

---

## API Reference

### `cv` - Class Variants

Create variants for **single-element components** using CSS class names.

#### Type Signature

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

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `base` | `ClassValue` | Base classes applied to all instances |
| `variants` | `Record<string, Record<string, ClassValue>>` | Variant definitions |
| `compoundVariants` | `Array` | Conditional styles when multiple variants match |
| `defaultVariants` | `Object` | Default variant selections |
| `classNameResolver` | `Function` | Custom class merger (default: `cx`) |

#### Examples

**Basic Variant**

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
```

**Complex Variant with Compound Rules**

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

**Array and Object ClassValues**

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

---

### `scv` - Slot Class Variants

Create variants for **multi-element components** using CSS class names. Perfect for complex UI components like cards, modals, or navigation menus.

#### Type Signature

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

#### Examples

**Card Component**

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

**React Usage**

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

**Modal Component**

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

**Slot-Specific Overrides**

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

**Compound Variants with Slots**

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

---

### `sv` - Style Variants

Create variants for **inline CSS styles** (React's `style` prop, Vue's `:style`, etc.).

#### Type Signature

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

#### Examples

**Basic Style Variant**

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
// => { display: 'flex', borderRadius: '8px', padding: '24px', fontSize: '18px', backgroundColor: '#dbeafe', color: '#1e40af' }
```

**CSS Custom Properties (CSS Variables)**

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

**Compound Style Variants**

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

**Runtime Style Overrides**

```typescript
const card = sv({
  base: { padding: '16px', borderRadius: '8px' },
})

card({ style: { marginTop: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' } })
// => { padding: '16px', borderRadius: '8px', marginTop: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }
```

---

### `ssv` - Slot Style Variants

Create variants for **multi-element components** using inline CSS styles.

#### Type Signature

```typescript
function ssv<S extends string, T extends SlotStyleVariantRecord<S> | undefined>(
  config: SlotStyleVariantDefinition<S, T>
): SlotStyleVariantFn<S, T>

interface SlotStyleVariantDefinition<S, T> {
  slots: S[]
  base?: PartialRecord<S, CssProperties>
  variants?: T
  compoundVariants?: (ObjectKeyArrayPicker<T> & { styles: PartialRecord<S, CssProperties> })[]
  defaultVariants?: ObjectKeyPicker<T>
}
```

#### Examples

**Tooltip Component**

```typescript
const tooltip = ssv({
  slots: ['container', 'arrow', 'content'],
  base: {
    container: {
      position: 'relative',
      display: 'inline-block',
    },
    arrow: {
      position: 'absolute',
      width: 0,
      height: 0,
      borderStyle: 'solid',
    },
    content: {
      position: 'absolute',
      padding: '8px 12px',
      borderRadius: '6px',
      fontSize: '14px',
      whiteSpace: 'nowrap',
      zIndex: 1000,
    },
  },
  variants: {
    placement: {
      top: {
        content: { bottom: '100%', left: '50%', transform: 'translateX(-50%)' },
        arrow: {
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: '6px 6px 0',
          borderColor: '#1f2937 transparent transparent',
        },
      },
      bottom: {
        content: { top: '100%', left: '50%', transform: 'translateX(-50%)' },
        arrow: {
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: '0 6px 6px',
          borderColor: 'transparent transparent #1f2937',
        },
      },
      left: {
        content: { right: '100%', top: '50%', transform: 'translateY(-50%)' },
        arrow: {
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          borderWidth: '6px 0 6px 6px',
          borderColor: 'transparent transparent transparent #1f2937',
        },
      },
      right: {
        content: { left: '100%', top: '50%', transform: 'translateY(-50%)' },
        arrow: {
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          borderWidth: '6px 6px 6px 0',
          borderColor: 'transparent #1f2937 transparent transparent',
        },
      },
    },
    variant: {
      dark: {
        content: {
          backgroundColor: '#1f2937',
          color: '#ffffff',
        },
      },
      light: {
        content: {
          backgroundColor: '#f9fafb',
          color: '#1f2937',
          border: '1px solid #e5e7eb',
        },
      },
    },
  },
  defaultVariants: {
    placement: 'top',
    variant: 'dark',
  },
})

const styles = tooltip({ placement: 'bottom', variant: 'light' })
// => {
//   container: { position: 'relative', display: 'inline-block' },
//   arrow: { ... },
//   content: { backgroundColor: '#f9fafb', color: '#1f2937', ... }
// }
```

**Split Pane Component**

```typescript
const splitPane = ssv({
  slots: ['container', 'leftPane', 'divider', 'rightPane'],
  base: {
    container: {
      display: 'flex',
      width: '100%',
      height: '100%',
    },
    leftPane: {
      overflow: 'auto',
    },
    divider: {
      cursor: 'col-resize',
      backgroundColor: '#e5e7eb',
    },
    rightPane: {
      flex: 1,
      overflow: 'auto',
    },
  },
  variants: {
    orientation: {
      horizontal: {
        container: { flexDirection: 'row' },
        divider: { width: '4px' },
      },
      vertical: {
        container: { flexDirection: 'column' },
        divider: { height: '4px', cursor: 'row-resize' },
      },
    },
    leftPaneSize: {
      sm: { leftPane: { width: '200px' } },
      md: { leftPane: { width: '300px' } },
      lg: { leftPane: { width: '400px' } },
    },
  },
  compoundVariants: [
    {
      orientation: 'vertical',
      leftPaneSize: ['sm', 'md', 'lg'],
      styles: {
        leftPane: { width: 'auto', height: '200px' },
      },
    },
  ],
  defaultVariants: {
    orientation: 'horizontal',
    leftPaneSize: 'md',
  },
})
```

**Runtime Style Overrides**

```typescript
const styles = tooltip({
  placement: 'top',
  styles: {
    content: { maxWidth: '300px', whiteSpace: 'normal' },  // Override content styles
    arrow: { display: 'none' },                              // Hide arrow
  },
})
```

---

### `cx` - Class Name Merger

A lightweight utility for merging class names. Supports strings, arrays, objects, and nested combinations.

#### Type Signature

```typescript
function cx(...args: ClassValue[]): string

type ClassValue =
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | ClassDictionary
  | ClassValue[]

type ClassDictionary = Record<string, unknown>
```

#### Examples

**Basic Usage**

```typescript
import { cx } from 'css-variants'

cx('foo', 'bar') // => 'foo bar'
cx('foo', null, 'bar', undefined, 'baz') // => 'foo bar baz'
cx('foo', false && 'bar', 'baz') // => 'foo baz'
```

**Object Syntax**

```typescript
cx({ foo: true, bar: false, baz: true }) // => 'foo baz'
cx('base', { active: isActive, disabled: isDisabled })
```

**Array Syntax**

```typescript
cx(['foo', 'bar']) // => 'foo bar'
cx(['foo', null, 'bar']) // => 'foo bar'
```

**Mixed Syntax**

```typescript
cx(
  'base-class',
  ['array-class-1', 'array-class-2'],
  { conditional: true, ignored: false },
  condition && 'conditional-class',
  42,
  null,
  undefined
) // => 'base-class array-class-1 array-class-2 conditional conditional-class 42'
```

**React Example**

```tsx
function Component({ isActive, isDisabled, className }) {
  return (
    <div className={cx(
      'base-class',
      isActive && 'active',
      isDisabled && 'disabled',
      className
    )}>
      Content
    </div>
  )
}
```

---

## Advanced Patterns

### Tailwind CSS Integration

By default, `cv` and `scv` don't handle Tailwind class conflicts. Integrate with `tailwind-merge` for proper resolution:

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
// Without twMerge: 'px-4 py-2 text-sm px-6 py-3 text-lg' (conflicting classes)
// With twMerge:    'px-6 py-3 text-lg' (conflicts resolved)
```

**Recommended Setup**

```typescript
// lib/variants.ts
import { cv as cvBase, scv as scvBase, cx as cxBase } from 'css-variants'
import { twMerge } from 'tailwind-merge'

export const cx: typeof cxBase = (...args) => twMerge(cxBase(...args))
export const cv = (config) => cvBase({ ...config, classNameResolver: cx })
export const scv = (config) => scvBase({ ...config, classNameResolver: cx })
```

```typescript
// components/Button.tsx
import { cv } from '@/lib/variants'

const button = cv({
  base: 'px-4 py-2',
  variants: { /* ... */ },
})
```

### CSS Modules Integration

```typescript
import { cv } from 'css-variants'
import styles from './Button.module.css'

const button = cv({
  base: styles.button,
  variants: {
    variant: {
      primary: styles.primary,
      secondary: styles.secondary,
    },
    size: {
      sm: styles.sm,
      md: styles.md,
      lg: styles.lg,
    },
  },
})
```

### Responsive Variants (Tailwind)

```typescript
const container = cv({
  base: 'w-full mx-auto',
  variants: {
    size: {
      sm: 'max-w-screen-sm px-4',
      md: 'max-w-screen-md px-6',
      lg: 'max-w-screen-lg px-8',
      xl: 'max-w-screen-xl px-8',
    },
  },
  defaultVariants: {
    size: 'lg',
  },
})

// Responsive: different sizes at different breakpoints
<div className={cx(
  container({ size: 'sm' }),
  'md:max-w-screen-md lg:max-w-screen-lg'
)}>
  Content
</div>
```

### Component Composition

**Extending Variants**

```typescript
const baseButton = cv({
  base: 'rounded font-medium transition-colors',
  variants: {
    size: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    },
  },
})

const iconButton = cv({
  base: baseButton({ size: 'md' }),
  variants: {
    variant: {
      ghost: 'bg-transparent hover:bg-gray-100',
      solid: 'bg-gray-900 text-white hover:bg-gray-700',
    },
  },
})
```

**Composing with cx**

```typescript
const primaryButton = (props) => cx(
  button({ color: 'primary', ...props }),
  'shadow-lg hover:shadow-xl'
)
```

### Type-Safe Props with TypeScript

**Extract Variant Props**

```typescript
import { cv } from 'css-variants'

const button = cv({
  variants: {
    color: { primary: '...', secondary: '...' },
    size: { sm: '...', md: '...', lg: '...' },
  },
})

type ButtonVariants = Parameters<typeof button>[0]
// => { color?: 'primary' | 'secondary', size?: 'sm' | 'md' | 'lg', className?: ClassValue }
```

### Design System Example

```typescript
// design-system/variants.ts
import { cv } from 'css-variants'

export const text = cv({
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    color: {
      default: 'text-gray-900',
      muted: 'text-gray-600',
      subtle: 'text-gray-500',
      primary: 'text-blue-600',
      error: 'text-red-600',
      success: 'text-green-600',
    },
  },
  defaultVariants: {
    size: 'base',
    weight: 'normal',
    color: 'default',
  },
})

export const spacing = cv({
  variants: {
    p: {
      0: 'p-0',
      1: 'p-1',
      2: 'p-2',
      4: 'p-4',
      6: 'p-6',
      8: 'p-8',
    },
    m: {
      0: 'm-0',
      1: 'm-1',
      2: 'm-2',
      4: 'm-4',
      6: 'm-6',
      8: 'm-8',
    },
  },
})
```

---

## Framework Integration

### React

```tsx
import { cv } from 'css-variants'

const button = cv({ /* ... */ })

export function Button({ color, size, className, children, ...props }) {
  return (
    <button className={button({ color, size, className })} {...props}>
      {children}
    </button>
  )
}

// TypeScript version
type ButtonVariants = Parameters<typeof button>[0]

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & ButtonVariants

export function Button({ color, size, className, children, ...props }: ButtonProps) {
  return (
    <button className={button({ color, size, className })} {...props}>
      {children}
    </button>
  )
}
```

### Vue 3

```vue
<template>
  <button :class="buttonClass">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cv } from 'css-variants'

const button = cv({ /* ... */ })

type ButtonVariants = Parameters<typeof button>[0]

const props = defineProps<ButtonVariants>()

const buttonClass = computed(() => button({
  color: props.color,
  size: props.size,
}))
</script>
```

### Solid.js

```tsx
import { cv } from 'css-variants'
import type { JSX } from 'solid-js'

const button = cv({ /* ... */ })

type ButtonVariants = Parameters<typeof button>[0]

type ButtonProps = ButtonVariants & {
  children: JSX.Element
}

export function Button(props: ButtonProps) {
  return (
    <button class={button({ color: props.color, size: props.size })}>
      {props.children}
    </button>
  )
}
```

---

## Migration Guide

### From CVA (Class Variance Authority)

`css-variants` is largely compatible with CVA's API:

```typescript
// CVA
import { cva } from 'class-variance-authority'

const button = cva('btn', {
  variants: { /* ... */ },
  defaultVariants: { /* ... */ },
})

// css-variants
import { cv } from 'css-variants'

const button = cv({
  base: 'btn',  // 'base' instead of first argument
  variants: { /* ... */ },
  defaultVariants: { /* ... */ },
})
```

**Key Differences:**
- Use `base` instead of first argument
- Use `classNameResolver` instead of `className` for custom mergers
- Compound variants use `className` key (CVA uses `class`)

---

## Performance

### Bundle Size

- **Core library**: ~1KB minified + gzipped
- **Tree-shakeable**: Import only what you need
- **Zero dependencies**: No additional packages bundled

```typescript
// Only imports cv (~400 bytes)
import { cv } from 'css-variants'

// Only imports scv (~600 bytes)
import { scv } from 'css-variants'
```

### Production Tips

**1. Create variants outside components**

```typescript
// Good ✓ - Created once
const button = cv({ /* ... */ })

function Button(props) {
  return <button className={button(props)} />
}

// Bad ✗ - Recreated on every render
function Button(props) {
  const button = cv({ /* ... */ })  // Don't do this!
  return <button className={button(props)} />
}
```

**2. Minimize compound variants**

```typescript
// Each compound variant is checked at runtime
compoundVariants: [
  { size: 'lg', color: 'primary', className: '...' },
  { size: 'lg', color: 'secondary', className: '...' },
  // Keep this array as small as possible
]
```

---

## TypeScript Tips

### Extract Types

```typescript
import { cv } from 'css-variants'

const button = cv({ /* ... */ })

// Extract prop types
type ButtonVariants = Parameters<typeof button>[0]

type ButtonProps = ButtonVariants & {
  loading?: boolean
}

// Use in component
function Button(props: ButtonProps) { /* ... */ }
```

---

## FAQ

**Q: How is this different from CVA?**
A: Very similar API! Main differences: `base` property instead of first argument, optimized for smaller bundle size, and includes built-in `cx` utility.

**Q: Can I use this without Tailwind?**
A: Absolutely! Works with any CSS approach: vanilla CSS, CSS modules, styled-components, emotion, etc.

**Q: Does it work with Tailwind's `@apply`?**
A: Yes, but we recommend using variants instead of `@apply` for better tree-shaking and smaller CSS bundles.

**Q: How do I handle responsive variants?**
A: Use Tailwind's responsive prefixes in your variant classes: `'sm:text-sm md:text-base lg:text-lg'`

**Q: Can I use this in a design system?**
A: Yes! Create base variants and export them for consistent styling across your application.

**Q: What about dark mode?**
A: Use Tailwind's `dark:` prefix in variant classes, or create separate variants: `variant: { light: '...', dark: '...' }`

**Q: How do I migrate from CVA?**
A: Very minimal changes needed. See the [Migration Guide](#migration-guide).

---

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) before submitting PRs.

**Development Setup:**

```bash
git clone https://github.com/timphandev/css-variants.git
cd css-variants
yarn install
yarn test
yarn build
```

---

## License

MIT © [Tim Phan](https://github.com/timphandev)

---

## Credits

- Class merging inspired by [clsx](https://github.com/lukeed/clsx) by Luke Edwards
- API design inspired by [CVA](https://github.com/joe-bell/cva) and [Panda CSS](https://panda-css.com)

---

**Made with ❤️ by developers, for developers**
