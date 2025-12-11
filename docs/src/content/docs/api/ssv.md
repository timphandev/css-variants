---
title: ssv - Slot Style Variants
description: API reference for the ssv function
---

Create variants for **multi-element components** using inline CSS styles.

## Import

```typescript
import { ssv } from 'css-variants'
```

## Type Signature

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

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `slots` | `string[]` | Array of slot names |
| `base` | `Record<Slot, CssProperties>` | Base styles for each slot |
| `variants` | `Record<string, Record<string, Record<Slot, CssProperties>>>` | Variant definitions per slot |
| `compoundVariants` | `Array` | Conditional styles with `styles` for slots |
| `defaultVariants` | `Object` | Default variant selections |

## Return Value

Returns a function that accepts variant props and returns an object mapping slot names to CSS properties objects.

```typescript
type SlotStyleVariantFn<S, T> = (
  props?: VariantProps<T> & { styles?: PartialRecord<S, CssProperties> }
) => Record<S, CssProperties>
```

## Examples

### Tooltip Component

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

### Split Pane Component

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

### Runtime Style Overrides

```typescript
const styles = tooltip({
  placement: 'top',
  styles: {
    content: { maxWidth: '300px', whiteSpace: 'normal' },  // Override content styles
    arrow: { display: 'none' },                              // Hide arrow
  },
})
```

### React Usage

```tsx
import { type ReactNode } from 'react'

type TooltipProps = Parameters<typeof tooltip>[0] & {
  children: ReactNode
  content: ReactNode
}

function Tooltip({ placement, variant, children, content }: TooltipProps) {
  const styles = tooltip({ placement, variant })

  return (
    <div style={styles.container}>
      {children}
      <div style={styles.content}>
        {content}
        <div style={styles.arrow} />
      </div>
    </div>
  )
}

// Usage
<Tooltip placement="top" variant="dark" content="Hello!">
  <button>Hover me</button>
</Tooltip>
```

## TypeScript

### Extract Variant Props

```typescript
const tooltip = ssv({
  slots: ['container', 'arrow', 'content'],
  variants: {
    placement: { top: {...}, bottom: {...} },
    variant: { dark: {...}, light: {...} },
  },
})

type TooltipVariants = Parameters<typeof tooltip>[0]
// => {
//   placement?: 'top' | 'bottom',
//   variant?: 'dark' | 'light',
//   styles?: { container?: CssProperties, arrow?: CssProperties, content?: CssProperties }
// }
```

### Get Slot Names

```typescript
type TooltipSlots = keyof ReturnType<typeof tooltip>
// => 'container' | 'arrow' | 'content'
```
