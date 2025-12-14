---
title: Framework Integration
description: Using css-variants with React, Vue, Solid.js, and other frameworks
---

css-variants is framework-agnostic and works with any JavaScript framework. Here are detailed integration guides for popular frameworks.

## React

### Basic Component

```tsx
import { cv } from 'css-variants'

const buttonVariants = cv({
  base: 'font-medium rounded transition-colors',
  variants: {
    color: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
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

export function Button({ color, size, className, children, ...props }) {
  return (
    <button className={buttonVariants({ color, size, className })} {...props}>
      {children}
    </button>
  )
}
```

### TypeScript Component

```tsx
import { cv } from 'css-variants'

const buttonVariants = cv({
  base: 'font-medium rounded transition-colors',
  variants: {
    color: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
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

type ButtonVariants = Parameters<typeof buttonVariants>[0]

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & ButtonVariants

export function Button({ color, size, className, children, ...props }: ButtonProps) {
  return (
    <button className={buttonVariants({ color, size, className })} {...props}>
      {children}
    </button>
  )
}
```

### Multi-Slot Component

```tsx
import { scv } from 'css-variants'

const cardVariants = scv({
  slots: ['root', 'header', 'title', 'content', 'footer'],
  base: {
    root: 'rounded-lg border bg-white',
    header: 'border-b p-4',
    title: 'text-lg font-semibold',
    content: 'p-4',
    footer: 'border-t p-4 bg-gray-50',
  },
  variants: {
    variant: {
      default: { root: 'border-gray-200' },
      primary: { root: 'border-blue-200', title: 'text-blue-900' },
    },
  },
})

type CardVariants = Parameters<typeof cardVariants>[0]

type CardProps = CardVariants & {
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export function Card({ variant, title, children, footer, classNames }: CardProps) {
  const classes = cardVariants({ variant, classNames })

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <h3 className={classes.title}>{title}</h3>
      </div>
      <div className={classes.content}>{children}</div>
      {footer && <div className={classes.footer}>{footer}</div>}
    </div>
  )
}
```

## Vue 3

### Options API

```vue
<template>
  <button :class="buttonClass">
    <slot />
  </button>
</template>

<script>
import { cv } from 'css-variants'

const buttonVariants = cv({
  base: 'font-medium rounded transition-colors',
  variants: {
    color: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
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

export default {
  props: {
    color: String,
    size: String,
  },
  computed: {
    buttonClass() {
      return buttonVariants({
        color: this.color,
        size: this.size,
      })
    },
  },
}
</script>
```

### Composition API

```vue
<template>
  <button :class="buttonClass">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cv } from 'css-variants'

const buttonVariants = cv({
  base: 'font-medium rounded transition-colors',
  variants: {
    color: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
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

type ButtonVariants = Parameters<typeof buttonVariants>[0]

const props = defineProps<ButtonVariants>()

const buttonClass = computed(() =>
  buttonVariants({
    color: props.color,
    size: props.size,
  })
)
</script>
```

### Multi-Slot Component

```vue
<template>
  <div :class="classes.root">
    <div :class="classes.header">
      <h3 :class="classes.title">{{ title }}</h3>
    </div>
    <div :class="classes.content">
      <slot />
    </div>
    <div v-if="$slots.footer" :class="classes.footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { scv } from 'css-variants'

const cardVariants = scv({
  slots: ['root', 'header', 'title', 'content', 'footer'],
  base: {
    root: 'rounded-lg border bg-white',
    header: 'border-b p-4',
    title: 'text-lg font-semibold',
    content: 'p-4',
    footer: 'border-t p-4 bg-gray-50',
  },
  variants: {
    variant: {
      default: { root: 'border-gray-200' },
      primary: { root: 'border-blue-200', title: 'text-blue-900' },
    },
  },
})

type CardVariants = Parameters<typeof cardVariants>[0]

type Props = CardVariants & {
  title: string
}

const props = defineProps<Props>()

const classes = computed(() =>
  cardVariants({ variant: props.variant })
)
</script>
```

## Solid.js

### Basic Component

```tsx
import { cv } from 'css-variants'
import type { JSX } from 'solid-js'

const buttonVariants = cv({
  base: 'font-medium rounded transition-colors',
  variants: {
    color: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
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

type ButtonVariants = Parameters<typeof buttonVariants>[0]

type ButtonProps = ButtonVariants & {
  children: JSX.Element
  onClick?: () => void
}

export function Button(props: ButtonProps) {
  return (
    <button
      class={buttonVariants({ color: props.color, size: props.size })}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  )
}
```

### With splitProps

```tsx
import { splitProps } from 'solid-js'
import { cv } from 'css-variants'

const buttonVariants = cv({
  // ... config
})

export function Button(props) {
  const [variants, rest] = splitProps(props, ['color', 'size', 'class'])

  return (
    <button
      class={buttonVariants({
        color: variants.color,
        size: variants.size,
        className: variants.class,
      })}
      {...rest}
    >
      {props.children}
    </button>
  )
}
```

## Svelte

### Basic Component

```svelte
<!-- Button.svelte -->
<script lang="ts">
  import { cv } from 'css-variants'

  const buttonVariants = cv({
    base: 'font-medium rounded transition-colors',
    variants: {
      color: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
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

  export let color: 'primary' | 'secondary' = 'primary'
  export let size: 'sm' | 'md' | 'lg' = 'md'

  $: className = buttonVariants({ color, size })
</script>

<button class={className} on:click>
  <slot />
</button>
```

## Preact

Preact works identically to React:

```tsx
import { cv } from 'css-variants'
import { h } from 'preact'

const buttonVariants = cv({
  // ... same config as React
})

export function Button({ color, size, className, children, ...props }) {
  return (
    <button className={buttonVariants({ color, size, className })} {...props}>
      {children}
    </button>
  )
}
```

