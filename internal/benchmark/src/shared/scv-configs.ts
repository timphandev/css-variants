/**
 * Shared css-variants scv (slot class variants) configurations for benchmarks
 */
import { scv } from 'css-variants'

// ===========================================
// Base slots only
// ===========================================
export const scvBaseOnly = scv({
  slots: ['root', 'content'],
  base: {
    root: 'card',
    content: 'card-content',
  },
})

// ===========================================
// Single variant (2 slots)
// ===========================================
export const scvSingleVariant = scv({
  slots: ['root', 'icon'],
  base: {
    root: 'btn',
    icon: 'btn-icon',
  },
  variants: {
    color: {
      primary: {
        root: 'bg-blue-500 text-white',
        icon: 'text-white',
      },
      secondary: {
        root: 'bg-gray-500 text-white',
        icon: 'text-white',
      },
      danger: {
        root: 'bg-red-500 text-white',
        icon: 'text-red-100',
      },
    },
  },
})

// ===========================================
// Multiple slots (4 slots)
// ===========================================
export const scvMultipleSlots = scv({
  slots: ['root', 'header', 'body', 'footer'],
  base: {
    root: 'card rounded shadow',
    header: 'card-header border-b',
    body: 'card-body',
    footer: 'card-footer border-t',
  },
  variants: {
    size: {
      sm: {
        root: 'max-w-sm',
        header: 'p-2 text-sm',
        body: 'p-2',
        footer: 'p-2 text-xs',
      },
      md: {
        root: 'max-w-md',
        header: 'p-4 text-base',
        body: 'p-4',
        footer: 'p-4 text-sm',
      },
      lg: {
        root: 'max-w-lg',
        header: 'p-6 text-lg',
        body: 'p-6',
        footer: 'p-6 text-base',
      },
    },
  },
})

// ===========================================
// Multiple variants (4 slots)
// ===========================================
export const scvMultipleVariants = scv({
  slots: ['root', 'title', 'description', 'icon'],
  base: {
    root: 'alert flex items-start gap-3 rounded-lg border p-4',
    title: 'font-semibold',
    description: 'text-sm',
    icon: 'shrink-0',
  },
  variants: {
    variant: {
      info: {
        root: 'bg-blue-50 border-blue-200',
        title: 'text-blue-900',
        description: 'text-blue-700',
        icon: 'text-blue-600',
      },
      success: {
        root: 'bg-green-50 border-green-200',
        title: 'text-green-900',
        description: 'text-green-700',
        icon: 'text-green-600',
      },
      warning: {
        root: 'bg-yellow-50 border-yellow-200',
        title: 'text-yellow-900',
        description: 'text-yellow-700',
        icon: 'text-yellow-600',
      },
      error: {
        root: 'bg-red-50 border-red-200',
        title: 'text-red-900',
        description: 'text-red-700',
        icon: 'text-red-600',
      },
    },
    size: {
      sm: {
        root: 'p-3',
        title: 'text-sm',
        description: 'text-xs',
        icon: 'w-4 h-4',
      },
      md: {
        root: 'p-4',
        title: 'text-base',
        description: 'text-sm',
        icon: 'w-5 h-5',
      },
    },
  },
})

// ===========================================
// With default variants
// ===========================================
export const scvWithDefaults = scv({
  slots: ['root', 'label', 'input'],
  base: {
    root: 'form-field',
    label: 'form-label',
    input: 'form-input',
  },
  variants: {
    size: {
      sm: {
        label: 'text-xs',
        input: 'px-2 py-1 text-sm',
      },
      md: {
        label: 'text-sm',
        input: 'px-3 py-2 text-base',
      },
      lg: {
        label: 'text-base',
        input: 'px-4 py-3 text-lg',
      },
    },
    variant: {
      outlined: {
        input: 'border-2 rounded',
      },
      filled: {
        input: 'bg-gray-100 border-0 rounded',
      },
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'outlined',
  },
})

// ===========================================
// Compound variants
// ===========================================
export const scvCompoundVariants = scv({
  slots: ['root', 'content', 'icon'],
  base: {
    root: 'btn inline-flex items-center gap-2 rounded transition',
    content: 'btn-content',
    icon: 'btn-icon',
  },
  variants: {
    color: {
      primary: {
        root: 'bg-blue-500 text-white hover:bg-blue-600',
        icon: 'text-white',
      },
      secondary: {
        root: 'bg-gray-500 text-white hover:bg-gray-600',
        icon: 'text-white',
      },
      danger: {
        root: 'bg-red-500 text-white hover:bg-red-600',
        icon: 'text-white',
      },
    },
    size: {
      sm: {
        root: 'px-2 py-1',
        content: 'text-sm',
        icon: 'w-3 h-3',
      },
      md: {
        root: 'px-4 py-2',
        content: 'text-base',
        icon: 'w-4 h-4',
      },
      lg: {
        root: 'px-6 py-3',
        content: 'text-lg',
        icon: 'w-5 h-5',
      },
    },
    disabled: {
      true: {
        root: 'opacity-50 cursor-not-allowed',
      },
      false: {
        root: 'cursor-pointer',
      },
    },
  },
  compoundVariants: [
    {
      size: 'lg',
      color: 'primary',
      classNames: {
        root: 'font-bold shadow-lg',
        content: 'tracking-wide',
      },
    },
    {
      size: ['sm', 'md'],
      color: 'danger',
      classNames: {
        root: 'font-semibold',
      },
    },
    {
      disabled: true,
      color: ['primary', 'secondary', 'danger'],
      classNames: {
        root: 'pointer-events-none',
      },
    },
  ],
})

// ===========================================
// With classNames override
// ===========================================
export const scvWithClassNames = scv({
  slots: ['root', 'inner'],
  base: {
    root: 'container',
    inner: 'content',
  },
  variants: {
    centered: {
      true: {
        root: 'mx-auto',
        inner: 'text-center',
      },
    },
  },
})

// ===========================================
// Complex real-world card component
// ===========================================
export const scvComplexCard = scv({
  slots: ['root', 'header', 'title', 'description', 'content', 'footer', 'actions'],
  base: {
    root: 'card relative rounded-lg border bg-white shadow-sm transition-shadow',
    header: 'card-header space-y-1.5 p-6',
    title: 'card-title text-2xl font-semibold leading-none tracking-tight',
    description: 'card-description text-sm text-gray-500',
    content: 'card-content p-6 pt-0',
    footer: 'card-footer flex items-center p-6 pt-0',
    actions: 'card-actions flex gap-2',
  },
  variants: {
    variant: {
      default: {
        root: 'border-gray-200',
      },
      outlined: {
        root: 'border-2 shadow-none',
      },
      elevated: {
        root: 'border-0 shadow-lg',
      },
    },
    size: {
      sm: {
        root: 'max-w-sm',
        header: 'p-4',
        title: 'text-lg',
        description: 'text-xs',
        content: 'p-4 pt-0',
        footer: 'p-4 pt-0',
      },
      md: {
        root: 'max-w-md',
      },
      lg: {
        root: 'max-w-2xl',
        header: 'p-8',
        title: 'text-3xl',
        content: 'p-8 pt-0',
        footer: 'p-8 pt-0',
      },
    },
    hoverable: {
      true: {
        root: 'hover:shadow-md cursor-pointer',
      },
    },
  },
  compoundVariants: [
    {
      variant: 'elevated',
      hoverable: true,
      classNames: {
        root: 'hover:shadow-xl hover:-translate-y-1',
      },
    },
  ],
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
})

// ===========================================
// Many slots (stress test - 8 slots)
// ===========================================
export const scvManySlots = scv({
  slots: ['slot1', 'slot2', 'slot3', 'slot4', 'slot5', 'slot6', 'slot7', 'slot8'],
  base: {
    slot1: 'class1',
    slot2: 'class2',
    slot3: 'class3',
    slot4: 'class4',
    slot5: 'class5',
    slot6: 'class6',
    slot7: 'class7',
    slot8: 'class8',
  },
  variants: {
    theme: {
      light: {
        slot1: 'bg-white text-black',
        slot2: 'bg-gray-100',
        slot3: 'bg-gray-200',
        slot4: 'bg-gray-300',
        slot5: 'border-gray-400',
        slot6: 'text-gray-600',
        slot7: 'text-gray-700',
        slot8: 'text-gray-800',
      },
      dark: {
        slot1: 'bg-black text-white',
        slot2: 'bg-gray-900',
        slot3: 'bg-gray-800',
        slot4: 'bg-gray-700',
        slot5: 'border-gray-600',
        slot6: 'text-gray-400',
        slot7: 'text-gray-300',
        slot8: 'text-gray-200',
      },
    },
  },
})

// ===========================================
// No variants (edge case)
// ===========================================
export const scvNoVariants = scv({
  slots: ['root', 'content'],
  base: {
    root: 'container',
    content: 'content',
  },
})
