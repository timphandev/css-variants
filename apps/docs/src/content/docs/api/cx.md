---
title: cx() Function API Reference — clsx Alternative
description: Complete API reference for the cx() function. A lightweight clsx alternative for conditional class name merging in JavaScript and TypeScript.
---

The `cx()` function is a lightweight utility for merging CSS class names. It's a clsx/classnames alternative that supports strings, arrays, objects, and nested combinations.

## Import

```typescript
import { cx } from 'css-variants'
```

## Type Signature

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

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `...args` | `ClassValue[]` | Any number of class values to merge |

## Return Value

Returns a single string with all valid class names joined by spaces.

## Examples

### Basic Usage

```typescript
import { cx } from 'css-variants'

cx('foo', 'bar')
// => 'foo bar'

cx('foo', null, 'bar', undefined, 'baz')
// => 'foo bar baz'

cx('foo', false && 'bar', 'baz')
// => 'foo baz'
```

### Object Syntax

Conditionally include classes based on boolean values:

```typescript
cx({ foo: true, bar: false, baz: true })
// => 'foo baz'

cx('base', { active: isActive, disabled: isDisabled })
// => 'base active' (if isActive is true and isDisabled is false)
```

### Array Syntax

Group related classes together:

```typescript
cx(['foo', 'bar'])
// => 'foo bar'

cx(['foo', null, 'bar'])
// => 'foo bar'

cx(['text-lg', 'font-bold'], 'text-blue-600')
// => 'text-lg font-bold text-blue-600'
```

### Mixed Syntax

Combine all formats as needed:

```typescript
cx(
  'base-class',
  ['array-class-1', 'array-class-2'],
  { conditional: true, ignored: false },
  condition && 'conditional-class',
  42,
  null,
  undefined
)
// => 'base-class array-class-1 array-class-2 conditional conditional-class 42'
```

### Nested Arrays

Arrays can be nested to any depth:

```typescript
cx('a', ['b', ['c', 'd']], 'e')
// => 'a b c d e'
```

### Number Values

Numbers are converted to strings:

```typescript
cx('z-index-', 10)
// => 'z-index- 10'

cx(1, 2, 3)
// => '1 2 3'
```

## React Example

```tsx
function Component({ isActive, isDisabled, className }) {
  return (
    <div
      className={cx(
        'base-class',
        isActive && 'active',
        isDisabled && 'disabled',
        className
      )}
    >
      Content
    </div>
  )
}

// Usage
<Component isActive className="custom-class" />
// => <div className="base-class active custom-class">
```

## Vue Example

```vue
<template>
  <div :class="classes">Content</div>
</template>

<script setup>
import { computed } from 'vue'
import { cx } from 'css-variants'

const props = defineProps(['isActive', 'isDisabled'])

const classes = computed(() =>
  cx(
    'base-class',
    { active: props.isActive, disabled: props.isDisabled }
  )
)
</script>
```

## Common Patterns

### Conditional Styling

```typescript
const buttonClass = cx(
  'btn',
  variant === 'primary' && 'btn-primary',
  variant === 'secondary' && 'btn-secondary',
  size === 'large' && 'btn-lg',
  disabled && 'btn-disabled'
)
```

### Merging User Classes

```typescript
function Button({ className, ...props }) {
  return (
    <button
      className={cx('px-4 py-2 rounded', className)}
      {...props}
    />
  )
}
```

### Responsive Classes

```typescript
const containerClass = cx(
  'container mx-auto',
  ['px-4', 'sm:px-6', 'lg:px-8'],
  fullWidth && 'max-w-none'
)
```

### State-Based Classes

```typescript
const inputClass = cx(
  'border rounded px-3 py-2',
  {
    'border-gray-300 focus:border-blue-500': !error,
    'border-red-500 focus:border-red-600': error,
    'bg-gray-100 cursor-not-allowed': disabled,
  }
)
```

## cx() vs clsx vs classnames

`cx` is similar to `clsx` and `classnames`, but bundled with css-variants so you don't need an extra dependency:

```typescript
// css-variants cx
import { cx } from 'css-variants'

// clsx
import clsx from 'clsx'

// classnames
import classNames from 'classnames'

// All produce the same output for basic usage
cx('foo', 'bar')        // => 'foo bar'
clsx('foo', 'bar')      // => 'foo bar'
classNames('foo', 'bar') // => 'foo bar'
```

## How to Use cx() with tailwind-merge

For Tailwind CSS projects, combine `cx` with `tailwind-merge` to resolve class conflicts:

```typescript
import { cx } from 'css-variants'
import { twMerge } from 'tailwind-merge'

// Create a custom merger
const cn: typeof cx = (...args) => twMerge(cx(...args))

// Now conflicting Tailwind classes are resolved
cn('px-4 py-2', 'px-6')
// => 'py-2 px-6' (px-4 is removed, px-6 wins)
```

See the [Tailwind CSS Integration](/guides/tailwind/) guide for more details.
