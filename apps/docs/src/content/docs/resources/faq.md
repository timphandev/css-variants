---
title: FAQ
description: Frequently asked questions about css-variants
---

## General

### How is css-variants different from CVA?

css-variants has a very similar API to [CVA (Class Variance Authority)](https://cva.style), with a few key differences:

- Use `base` property instead of first argument for base classes
- Use `className` instead of `class` in compound variants
- Built-in slot variants (`scv`) for multi-element components
- Built-in style variants (`sv`, `ssv`) for inline styles
- Use `classNameResolver` for custom class merging

See the [Migration Guide](/resources/migration/) for detailed differences.

### Can I use css-variants without Tailwind CSS?

Absolutely! css-variants works with any CSS approach:

- **Vanilla CSS**: Use regular class names
- **CSS Modules**: Import and use module class names
- **CSS-in-JS**: Use with styled-components, emotion, etc.
- **Any utility framework**: Bootstrap, Bulma, etc.

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

## Tailwind CSS

### How do I handle Tailwind class conflicts?

Use `tailwind-merge` with a custom class resolver:

```typescript
import { cv, cx } from 'css-variants'
import { twMerge } from 'tailwind-merge'

const classNameResolver: typeof cx = (...args) => twMerge(cx(...args))

const button = cv({
  base: 'px-4 py-2',
  variants: {
    size: {
      lg: 'px-6 py-3', // Would conflict with base without twMerge
    },
  },
  classNameResolver,
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

## TypeScript

### How do I extract variant prop types?

Use `Parameters`:

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
toggle({ enabled: true })  // ✓ Works
toggle({ enabled: 'true' }) // ✗ TypeScript error
```

## Usage

### How do I create a variant for a multi-element component?

Use `scv` (slot class variants):

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

const classes = card({ variant: 'primary' })
// classes.root, classes.header, classes.content, classes.footer
```

### When should I use `sv` instead of `cv`?

Use `sv` (style variants) when you need inline CSS styles instead of class names:

- Dynamic CSS values (e.g., `width: ${value}px`)
- CSS custom properties (CSS variables)
- Styles that can't be expressed as utility classes
- When working with `style` prop instead of `className`

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

// Returns a style object
<div style={dynamicBox({ size: 'md' })} />
```

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
// ✅ Good
const button = cv({
  variants: {
    color: { primary: '...', secondary: '...' },
  },
})

// ❌ Bad: Separate variable loses type inference
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
