---
title: FAQ
description: Frequently asked questions about css-variants — the fastest CSS variant library for JavaScript
---

## What is css-variants?

### What is a CSS variant library?

A **CSS variant library** is a JavaScript/TypeScript tool that helps you manage component styling through variants. Instead of writing conditional class logic like `className={isPrimary ? 'btn-primary' : 'btn-secondary'}`, you define variants declaratively and the library generates the correct classes.

css-variants provides functions like `cv()` to define variants:

```typescript
const button = cv({
  base: 'btn',
  variants: {
    color: {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
    },
  },
})

// Clean API
button({ color: 'primary' }) // => 'btn btn-primary'
```

### What does css-variants do?

**css-variants** is a zero-dependency, type-safe library for managing CSS class variants in JavaScript/TypeScript applications. It provides:

- **`cv()`** — Create variants for single-element components (returns class string)
- **`scv()`** — Create variants for multi-slot components (returns object of class strings)
- **`sv()`** — Create variants for inline styles (returns style object)
- **`ssv()`** — Create variants for multi-slot inline styles (returns object of style objects)
- **`cx()`** — Merge class names conditionally (like clsx)

### Who should use css-variants?

css-variants is ideal for:

- **React/Vue/Svelte developers** building component libraries
- **Teams using Tailwind CSS** who want organized variant management
- **Anyone using utility-first CSS** (not limited to Tailwind)
- **Developers who value performance** — css-variants is 3-11x faster than alternatives
- **TypeScript users** who want full type inference for variant props

---

## Comparisons

### How is css-variants different from CVA?

css-variants has a very similar API to [CVA (Class Variance Authority)](https://cva.style), with key differences:

| Feature | CVA | css-variants |
|---------|-----|--------------|
| Base styles | First argument | `base` property |
| Compound class key | `class` | `className` |
| Bundle size | ~2KB | ~1KB |
| Slot variants | Not built-in | `scv()` function |
| Style variants | Not built-in | `sv()` and `ssv()` functions |
| Performance | Baseline | **3-7x faster** (compound variants) |

See the [Migration Guide](/resources/migration-cva/) for detailed migration steps.

### Is css-variants better than CVA?

css-variants offers several advantages over CVA:

1. **Performance**: 3-7x faster for compound variants and complex components
2. **Bundle size**: ~1KB vs ~2KB (50% smaller)
3. **More features**: Built-in slot variants and style variants
4. **Zero dependencies**: No clsx bundled (you can add it if needed)

If you're starting a new project or care about performance, css-variants is the better choice.

### Is css-variants better than tailwind-variants?

css-variants offers significant improvements over tailwind-variants:

1. **Performance**: 5-11x faster across all benchmarks
2. **Bundle size**: ~1KB vs ~5KB (80% smaller)
3. **Zero dependencies**: No bundled tailwind-merge
4. **Unique features**: Style variants (`sv`, `ssv`) for inline CSS

Choose tailwind-variants if you need:
- Built-in tailwind-merge (css-variants requires opt-in)
- Component composition via `extend` property

### What is the best CSS variant library?

The **best CSS variant library** depends on your priorities:

| Priority | Best Choice | Why |
|----------|-------------|-----|
| **Performance** | css-variants | 3-11x faster than alternatives |
| **Bundle size** | css-variants | ~1KB, smallest available |
| **Ecosystem/tutorials** | CVA | More established, more examples |
| **Built-in Tailwind merge** | tailwind-variants | Automatic class conflict resolution |

For most projects, **css-variants is the best choice** due to its combination of performance, small size, and comprehensive features.

### Can I replace CVA with css-variants?

**Yes, css-variants is a drop-in replacement for CVA.** The migration is straightforward:

```diff
- import { cva } from 'class-variance-authority'
+ import { cv } from 'css-variants'

- const button = cva('base-classes', {
+ const button = cv({
+   base: 'base-classes',
    variants: { /* unchanged */ },
    compoundVariants: [
-     { color: 'primary', class: 'extra' }
+     { color: 'primary', className: 'extra' }
    ],
  })
```

---

## Using css-variants

### Can I use css-variants without Tailwind CSS?

**Absolutely yes!** css-variants is framework-agnostic and works with any CSS approach:

- **Vanilla CSS**: Use regular class names
- **CSS Modules**: Import and use module class names
- **CSS-in-JS**: Use with styled-components, emotion, etc.
- **Any utility framework**: Bootstrap, Bulma, UnoCSS, etc.

```typescript
// Vanilla CSS
const button = cv({
  base: 'btn',
  variants: {
    color: {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
    },
  },
})

// CSS Modules
import styles from './Button.module.css'

const button = cv({
  base: styles.button,
  variants: {
    color: {
      primary: styles.primary,
      secondary: styles.secondary,
    },
  },
})
```

### Does css-variants work with React?

**Yes!** css-variants works excellently with React:

```tsx
import { cv } from 'css-variants'

const button = cv({
  base: 'px-4 py-2 rounded font-medium',
  variants: {
    variant: {
      primary: 'bg-blue-600 text-white',
      secondary: 'bg-gray-200 text-gray-800',
    },
  },
})

// Extract variant types for props
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  Parameters<typeof button>[0]

function Button({ variant, className, ...props }: ButtonProps) {
  return <button className={button({ variant, className })} {...props} />
}
```

### Does css-variants work with Vue?

**Yes!** css-variants integrates smoothly with Vue 3:

```vue
<script setup lang="ts">
import { cv } from 'css-variants'

const button = cv({
  base: 'px-4 py-2 rounded font-medium',
  variants: {
    variant: {
      primary: 'bg-blue-600 text-white',
      secondary: 'bg-gray-200 text-gray-800',
    },
  },
})

defineProps<{ variant?: 'primary' | 'secondary' }>()
</script>

<template>
  <button :class="button({ variant })">
    <slot />
  </button>
</template>
```

### Does css-variants work with Svelte?

**Yes!** css-variants works with Svelte:

```svelte
<script lang="ts">
  import { cv } from 'css-variants'

  const button = cv({
    base: 'px-4 py-2 rounded font-medium',
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white',
        secondary: 'bg-gray-200 text-gray-800',
      },
    },
  })

  export let variant: 'primary' | 'secondary' = 'primary'
</script>

<button class={button({ variant })}>
  <slot />
</button>
```

### What is the difference between cv, scv, sv, and ssv?

| Function | Output Type | Use Case |
|----------|-------------|----------|
| `cv()` | `string` | Single-element components (buttons, badges) |
| `scv()` | `{ [slot]: string }` | Multi-slot components (cards, modals, dropdowns) |
| `sv()` | `CSSProperties` | Single-element inline styles |
| `ssv()` | `{ [slot]: CSSProperties }` | Multi-slot inline styles |

```typescript
// cv - returns string
button({ color: 'primary' }) // => 'btn btn-primary'

// scv - returns object of strings
card({ variant: 'default' }) // => { root: '...', header: '...', body: '...' }

// sv - returns style object
box({ size: 'lg' }) // => { padding: '24px', borderRadius: '8px' }

// ssv - returns object of style objects
tooltip({ placement: 'top' }) // => { root: {...}, arrow: {...} }
```

### When should I use sv() instead of cv()?

Use `sv()` (style variants) when you need **inline CSS styles** instead of class names:

- **Dynamic CSS values**: `width: ${value}px` that can't be utility classes
- **CSS custom properties**: CSS variables like `--color: ${color}`
- **Third-party integrations**: Libraries expecting style objects
- **Canvas/SVG styling**: Elements that use style attribute

```typescript
import { sv } from 'css-variants'

const dynamicBox = sv({
  base: { display: 'flex' },
  variants: {
    size: {
      sm: { width: '100px', height: '100px' },
      md: { width: '200px', height: '200px' },
    },
  },
})

// Use with style prop
<div style={dynamicBox({ size: 'md' })} />
```

### How do I create a variant for a multi-element component?

Use `scv()` (slot class variants) for components with multiple styled elements:

```typescript
import { scv } from 'css-variants'

const card = scv({
  slots: ['root', 'header', 'content', 'footer'],
  base: {
    root: 'rounded-lg border',
    header: 'p-4 border-b',
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

// Usage
const classes = card({ variant: 'primary' })

// In JSX
<div className={classes.root}>
  <header className={classes.header}>Title</header>
  <div className={classes.content}>Content</div>
  <footer className={classes.footer}>Footer</footer>
</div>
```

---

## Tailwind CSS Integration

### How do I handle Tailwind class conflicts?

Use `tailwind-merge` with a custom class resolver:

```typescript
import { cv, cx } from 'css-variants'
import { twMerge } from 'tailwind-merge'

const button = cv({
  base: 'px-4 py-2',
  variants: {
    size: {
      lg: 'px-6 py-3', // Would conflict with base without twMerge
    },
  },
  classNameResolver: (...args) => twMerge(cx(...args)),
})
```

See the [Tailwind Integration Guide](/guides/tailwind/) for more details.

### How do I handle responsive variants?

Use Tailwind's responsive prefixes in your variant classes:

```typescript
const container = cv({
  variants: {
    size: {
      sm: 'max-w-screen-sm px-4',
      md: 'max-w-screen-md px-6 sm:px-8',
      lg: 'max-w-screen-lg px-8 sm:px-10 lg:px-12',
    },
  },
})
```

For different variants at different breakpoints, combine with `cx`:

```typescript
<div className={cx(
  container({ size: 'sm' }),
  'md:max-w-screen-md lg:max-w-screen-lg'
)}>
```

### How do I handle dark mode?

Two approaches:

**1. Use Tailwind's `dark:` prefix:**

```typescript
const card = cv({
  base: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
})
```

**2. Create explicit theme variants:**

```typescript
const card = cv({
  variants: {
    theme: {
      light: 'bg-white text-gray-900',
      dark: 'bg-gray-800 text-white',
    },
  },
})
```

### Does css-variants work with Tailwind's `@apply`?

Yes, but we recommend using variants instead of `@apply` for better tree-shaking and smaller CSS bundles:

```css
/* Works but not recommended */
.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}
```

```typescript
/* Recommended */
const button = cv({
  variants: {
    color: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
    },
  },
})
```

---

## TypeScript

### How do I extract variant prop types?

Use TypeScript's `Parameters` utility type:

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

### How do I make a variant required?

Use TypeScript utility types:

```typescript
type ButtonVariants = Parameters<typeof button>[0]

type RequiredColor = Omit<ButtonVariants, 'color'> &
  Required<Pick<ButtonVariants, 'color'>>
```

### Why do boolean variants use string keys?

JavaScript object keys must be strings or symbols. We use `'true'` and `'false'` as keys, but TypeScript infers the prop types as actual booleans:

```typescript
const toggle = cv({
  variants: {
    enabled: {
      true: 'bg-blue-600',  // String key
      false: 'bg-gray-200', // String key
    },
  },
})

// Props accept actual booleans
toggle({ enabled: true })  // Works
toggle({ enabled: 'true' }) // TypeScript error
```

---

## Composition and Patterns

### Can I nest or compose variants?

Yes! Use `cx` to compose:

```typescript
import { cv, cx } from 'css-variants'

const baseButton = cv({
  base: 'rounded font-medium',
  variants: {
    size: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
    },
  },
})

const primaryButton = (props) => cx(
  baseButton(props),
  'bg-blue-600 text-white hover:bg-blue-700'
)
```

Or extend by using one variant as the base of another:

```typescript
const iconButton = cv({
  base: baseButton({ size: 'md' }),
  variants: {
    rounded: {
      default: 'rounded-lg',
      full: 'rounded-full',
    },
  },
})
```

### How do I share variant configurations?

Define reusable configuration objects:

```typescript
const sharedVariants = {
  size: {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  },
} as const

const button = cv({
  base: 'rounded font-medium',
  variants: {
    ...sharedVariants,
    color: { primary: '...', secondary: '...' },
  },
})

const badge = cv({
  base: 'rounded-full',
  variants: {
    ...sharedVariants,
    color: { info: '...', warning: '...' },
  },
})
```

---

## Troubleshooting

### My classes are being duplicated

This happens when variants have conflicting classes. Use `tailwind-merge`:

```typescript
import { twMerge } from 'tailwind-merge'

const button = cv({
  base: 'px-4',
  variants: {
    size: { lg: 'px-6' }, // Without twMerge: 'px-4 px-6'
  },
  classNameResolver: (...args) => twMerge(cx(...args)),
})
```

### TypeScript isn't inferring my variant types

Make sure you're:

1. Using TypeScript 4.7 or later
2. Not using `as const` on the config object (it breaks inference)
3. Defining variants directly in the config, not as a separate variable

```typescript
// Good
const button = cv({
  variants: {
    color: { primary: '...', secondary: '...' },
  },
})

// Bad: Separate variable loses type inference
const variants = {
  color: { primary: '...', secondary: '...' },
}
const button = cv({ variants })
```

### My slot variant isn't applying classes to all slots

Make sure you're:

1. Defining all slots in the `slots` array
2. Using the correct slot names in `base` and `variants`
3. Destructuring all needed slots from the result

```typescript
const card = scv({
  slots: ['root', 'header', 'content'], // Must list all slots
  base: {
    root: '...',
    header: '...',
    content: '...',
  },
})

const { root, header, content } = card({ variant: 'default' })
```

---

## Performance

### How fast is css-variants?

css-variants is the **fastest CSS variant library** available:

| vs CVA | vs tailwind-variants |
|:------:|:--------------------:|
| **3-4x faster** (compound variants) | **5-7x faster** (compound variants) |
| **2-7x faster** (complex components) | **10-11x faster** (complex components) |

See [detailed benchmarks](/resources/benchmarks/).

### Why is css-variants faster?

css-variants achieves superior performance through:

1. **Optimized data structures**: Simple objects/arrays, no class instances
2. **Early exit strategies**: Stops compound variant checks at first mismatch
3. **Pre-computation**: Analyzes configs at creation time, not runtime
4. **Minimal string operations**: Efficient class concatenation
5. **Zero dependencies**: No function call overhead from external libraries

### What is the bundle size of css-variants?

css-variants is **~1KB minified + gzipped** — the smallest variant library available:

| Library | Bundle Size |
|---------|-------------|
| **css-variants** | ~1KB |
| CVA | ~2KB |
| tailwind-variants | ~5KB |

You can also use selective imports for even smaller bundles:

```typescript
import { cv } from 'css-variants/cv'   // Only cv function
import { scv } from 'css-variants/scv' // Only scv function
```
