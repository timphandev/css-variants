---
title: When to Use css-variants
description: Learn when and why to use css-variants for managing CSS variants in JavaScript applications
---

## When Should You Use a CSS Variant Library?

Use a CSS variant library like css-variants when you need to:

1. **Manage component styling variations** — buttons with different colors, sizes, states
2. **Avoid messy conditional class logic** — replace ternary chains and switch statements
3. **Ensure type-safe styling** — get TypeScript autocomplete for variant props
4. **Build consistent component libraries** — share variant patterns across components
5. **Improve code maintainability** — centralize style logic in one place

---

## Use Case Examples

### Building a Design System

css-variants is ideal for design systems where you need consistent, reusable components:

```typescript
import { cv } from 'css-variants'

// Define your button variants once
export const button = cv({
  base: 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  variants: {
    variant: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
      outline: 'border-2 border-gray-300 bg-transparent hover:bg-gray-100 focus:ring-gray-500',
      ghost: 'bg-transparent hover:bg-gray-100 focus:ring-gray-500',
      destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    },
    size: {
      sm: 'h-8 px-3 text-sm rounded-md',
      md: 'h-10 px-4 text-sm rounded-md',
      lg: 'h-12 px-6 text-base rounded-lg',
      icon: 'h-10 w-10 rounded-md',
    },
    disabled: {
      true: 'opacity-50 cursor-not-allowed pointer-events-none',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

// Reuse across your application
<button className={button({ variant: 'primary', size: 'lg' })}>
  Get Started
</button>

<button className={button({ variant: 'ghost', size: 'icon' })}>
  <Icon />
</button>
```

### Multi-Element Components

Use `scv` when a component has multiple styled parts:

```typescript
import { scv } from 'css-variants'

const modal = scv({
  slots: ['overlay', 'container', 'header', 'body', 'footer', 'closeButton'],
  base: {
    overlay: 'fixed inset-0 bg-black/50 backdrop-blur-sm',
    container: 'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl',
    header: 'flex items-center justify-between px-6 py-4 border-b',
    body: 'px-6 py-4',
    footer: 'flex justify-end gap-2 px-6 py-4 border-t',
    closeButton: 'absolute top-4 right-4 text-gray-400 hover:text-gray-600',
  },
  variants: {
    size: {
      sm: { container: 'w-80' },
      md: { container: 'w-[480px]' },
      lg: { container: 'w-[640px]' },
      full: { container: 'w-[90vw] max-w-4xl' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

// In your component
const classes = modal({ size: 'lg' })

<div className={classes.overlay}>
  <div className={classes.container}>
    <header className={classes.header}>...</header>
    <div className={classes.body}>...</div>
    <footer className={classes.footer}>...</footer>
    <button className={classes.closeButton}>×</button>
  </div>
</div>
```

### Dynamic Styling with Inline Styles

Use `sv` when you need CSS style objects instead of class names:

```typescript
import { sv } from 'css-variants'

// Perfect for dynamic values that can't be utility classes
const progressBar = sv({
  base: {
    height: '8px',
    borderRadius: '4px',
    backgroundColor: '#e5e7eb',
    overflow: 'hidden',
  },
  variants: {
    color: {
      blue: { '--progress-color': '#3b82f6' },
      green: { '--progress-color': '#22c55e' },
      red: { '--progress-color': '#ef4444' },
    },
  },
})

// CSS custom properties work great with sv
<div
  style={{
    ...progressBar({ color: 'blue' }),
    '--progress-width': `${progress}%`,
  }}
>
  <div style={{ width: 'var(--progress-width)', backgroundColor: 'var(--progress-color)' }} />
</div>
```

### Conditional Styling in React

Replace complex conditional logic with clean variant calls:

```typescript
// Before: Messy conditional logic
function Button({ isPrimary, isLarge, isDisabled, isLoading }) {
  const className = [
    'btn',
    isPrimary ? 'btn-primary' : 'btn-secondary',
    isLarge ? 'btn-lg' : 'btn-md',
    isDisabled && 'btn-disabled',
    isLoading && 'btn-loading',
  ].filter(Boolean).join(' ')

  return <button className={className}>...</button>
}

// After: Clean variant-based styling
import { cv } from 'css-variants'

const button = cv({
  base: 'btn',
  variants: {
    variant: { primary: 'btn-primary', secondary: 'btn-secondary' },
    size: { lg: 'btn-lg', md: 'btn-md' },
    disabled: { true: 'btn-disabled' },
    loading: { true: 'btn-loading' },
  },
  defaultVariants: { variant: 'secondary', size: 'md' },
})

function Button({ variant, size, disabled, loading }) {
  return <button className={button({ variant, size, disabled, loading })}>...</button>
}
```

---

## When to Choose css-variants Over Alternatives

### Choose css-variants when you want:

| Requirement | Why css-variants |
|-------------|------------------|
| **Best performance** | 3-11x faster than CVA and tailwind-variants |
| **Smallest bundle** | ~1KB vs 2-5KB for alternatives |
| **Zero dependencies** | No clsx or tailwind-merge bundled |
| **Multi-slot components** | Built-in `scv` function |
| **Inline style variants** | Unique `sv` and `ssv` functions |
| **Framework flexibility** | Works with React, Vue, Svelte, Solid, vanilla JS |
| **CSS flexibility** | Works with Tailwind, CSS Modules, vanilla CSS |

### Choose CVA when:

- Your team is already using CVA and migration isn't worth it
- You need maximum ecosystem compatibility (more tutorials, examples exist)

### Choose tailwind-variants when:

- You need built-in tailwind-merge without configuration
- You need the `extend` property for component composition

---

## Common Questions

### Should I use css-variants for every component?

Not necessarily. css-variants is most valuable for:

- **Components with multiple variants** — buttons, badges, inputs
- **Components used frequently** — where type safety and consistency matter
- **Multi-element components** — cards, modals, dropdowns (use `scv`)

For simple components with no variants, regular class strings are fine:

```typescript
// This is fine — no need for css-variants
function Divider() {
  return <hr className="my-4 border-gray-200" />
}
```

### Can I use css-variants with an existing codebase?

Yes! css-variants is additive. You can:

1. Install css-variants alongside your existing solution
2. Migrate components gradually
3. Mix css-variants and regular class logic in the same project

### Does css-variants work with server-side rendering (SSR)?

Yes. css-variants generates class strings at runtime with no DOM dependencies. It works perfectly with:

- Next.js (App Router and Pages Router)
- Remix
- Astro
- Nuxt
- SvelteKit
- Any SSR framework

### Is css-variants production-ready?

Yes. css-variants is:

- **Fully tested** — comprehensive test suite
- **Type-safe** — 100% TypeScript
- **Stable API** — semantic versioning
- **Used in production** — by real applications
- **Actively maintained** — regular updates

---

## Summary

Use css-variants when you want:

1. **The fastest variant library** — 3-11x faster than alternatives
2. **The smallest bundle** — ~1KB with zero dependencies
3. **Full TypeScript support** — complete type inference
4. **Multi-slot support** — built-in `scv` for complex components
5. **Inline style support** — unique `sv` and `ssv` functions
6. **Framework freedom** — works everywhere

Ready to start? See the [Quick Start Guide](/getting-started/quick-start/).
