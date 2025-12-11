---
title: Quick Start
description: Create your first variant with css-variants
---

This guide will walk you through creating your first component variant with css-variants.

## Your First Variant

Let's create a button component with color and size variants:

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
```

## Using the Variant

Call the variant function with your desired options:

```typescript
// Use defaults
button()
// => 'font-semibold rounded-lg transition-colors bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 text-base'

// Override specific variants
button({ color: 'danger', size: 'lg' })
// => 'font-semibold rounded-lg transition-colors bg-red-600 text-white hover:bg-red-700 px-6 py-3 text-lg'

// Mix defaults with overrides
button({ size: 'sm' })
// => 'font-semibold rounded-lg transition-colors bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 text-sm'
```

## Framework Examples

### React

```typescript
import type { ComponentProps } from 'react'

type ButtonProps = Parameters<typeof button>[0] & ComponentProps<'button'>

function Button({ color, size, children, ...props }: ButtonProps) {
  return (
    <button className={button({ color, size })} {...props}>
      {children}
    </button>
  )
}

// Usage
<Button color="danger" size="lg">Delete Account</Button>
```

### Vue

```vue
<template>
  <button :class="button({ color, size })">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { cv } from 'css-variants'

const button = cv({ /* config */ })

type ButtonProps = Parameters<typeof button>[0]

const { color, size } = defineProps<ButtonProps>()
</script>
```

### Solid.js

```typescript
import type { ParentProps } from 'solid-js'
import { cv } from 'css-variants'

const button = cv({ /* config */ })

type ButtonProps = ParentProps<Parameters<typeof button>[0]>

function Button(props: ButtonProps) {
  return (
    <button class={button({ color: props.color, size: props.size })}>
      {props.children}
    </button>
  )
}
```

## Adding Runtime Overrides

You can add additional classes at runtime using the `className` prop:

```typescript
button({ color: 'primary', className: 'mt-4 w-full' })
// => 'font-semibold rounded-lg ... bg-blue-600 ... px-4 py-2 ... mt-4 w-full'
```

## Next Steps

Now that you understand the basics, explore:

- [Core Concepts](/core-concepts/variants/) - Deep dive into variants, compound variants, and more
- [API Reference](/api/cv/) - Complete API documentation
- [Framework Integration](/guides/frameworks/) - Detailed guides for React, Vue, and more
