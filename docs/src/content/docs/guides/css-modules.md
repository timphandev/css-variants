---
title: CSS Modules
description: How to use css-variants with CSS Modules
---

css-variants works great with CSS Modules, giving you scoped styles with variant composition.

## Basic Setup

Import your CSS module and use the class names in your variants:

```css
/* Button.module.css */
.button {
  font-weight: 500;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.primary {
  background-color: #3b82f6;
  color: white;
}

.primary:hover {
  background-color: #2563eb;
}

.secondary {
  background-color: #e5e7eb;
  color: #1f2937;
}

.secondary:hover {
  background-color: #d1d5db;
}

.sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

.md {
  padding: 0.5rem 1rem;
  font-size: 1rem;
}

.lg {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
}
```

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
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

// Usage
button({ variant: 'primary', size: 'lg' })
// => 'Button_button__x7f2k Button_primary__a3b4c Button_lg__d5e6f'
```

## React Component Example

```tsx
// Button.tsx
import { cv } from 'css-variants'
import styles from './Button.module.css'

const buttonVariants = cv({
  base: styles.button,
  variants: {
    variant: {
      primary: styles.primary,
      secondary: styles.secondary,
      ghost: styles.ghost,
    },
    size: {
      sm: styles.sm,
      md: styles.md,
      lg: styles.lg,
    },
    fullWidth: {
      true: styles.fullWidth,
      false: '',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

type ButtonVariants = Parameters<typeof buttonVariants>[0]

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariants {
  children: React.ReactNode
}

export function Button({
  variant,
  size,
  fullWidth,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonVariants({ variant, size, fullWidth, className })}
      {...props}
    >
      {children}
    </button>
  )
}
```

## Slot Variants with CSS Modules

For multi-element components:

```css
/* Card.module.css */
.root {
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.header {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
}

.content {
  padding: 1rem;
}

.footer {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

/* Variants */
.elevated {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.compact .header,
.compact .content,
.compact .footer {
  padding: 0.5rem;
}
```

```typescript
import { scv } from 'css-variants'
import styles from './Card.module.css'

const card = scv({
  slots: ['root', 'header', 'title', 'content', 'footer'],
  base: {
    root: styles.root,
    header: styles.header,
    title: styles.title,
    content: styles.content,
    footer: styles.footer,
  },
  variants: {
    variant: {
      default: {},
      elevated: { root: styles.elevated },
    },
    size: {
      default: {},
      compact: { root: styles.compact },
    },
  },
})
```

## Combining CSS Modules with Utility Classes

You can mix CSS Module classes with utility classes:

```typescript
import { cv, cx } from 'css-variants'
import styles from './Button.module.css'

const button = cv({
  base: cx(styles.button, 'transition-transform active:scale-95'),
  variants: {
    variant: {
      primary: cx(styles.primary, 'shadow-md hover:shadow-lg'),
      secondary: styles.secondary,
    },
  },
})
```

## Best Practices

### 1. Consistent Naming

Use a consistent naming convention in your CSS modules:

```css
/* Good: matches variant keys */
.primary { }
.secondary { }
.sm { }
.md { }
.lg { }

/* Avoid: inconsistent naming */
.btn-primary { }
.btnSecondary { }
.size-sm { }
```

### 2. Separate Concerns

Keep base styles and variant styles organized:

```css
/* Base styles */
.button {
  /* Always applied */
}

/* Variant: color */
.primary { }
.secondary { }

/* Variant: size */
.sm { }
.md { }
.lg { }

/* Compound: specific combinations */
.primaryLarge {
  /* Only when primary + large */
}
```

### 3. Use Composes for Reuse

CSS Modules support composition:

```css
.baseButton {
  border-radius: 0.5rem;
  font-weight: 500;
}

.primary {
  composes: baseButton;
  background-color: #3b82f6;
}

.secondary {
  composes: baseButton;
  background-color: #e5e7eb;
}
```
