/**
 * Shared css-variants configurations for benchmarks
 * These configs are used to ensure consistent comparisons across different libraries
 */
import { cv } from 'css-variants'

// ===========================================
// Base class only
// ===========================================
export const cvBaseOnly = cv({
  base: 'base-class',
})

// ===========================================
// Single variant
// ===========================================
export const cvSingleVariant = cv({
  base: 'btn',
  variants: {
    color: {
      primary: 'bg-blue-500 text-white',
      secondary: 'bg-gray-500 text-white',
      danger: 'bg-red-500 text-white',
    },
  },
})

// ===========================================
// Multiple variants
// ===========================================
export const cvMultipleVariants = cv({
  base: 'btn rounded transition',
  variants: {
    color: {
      primary: 'bg-blue-500 text-white hover:bg-blue-600',
      secondary: 'bg-gray-500 text-white hover:bg-gray-600',
      danger: 'bg-red-500 text-white hover:bg-red-600',
    },
    size: {
      sm: 'px-2 py-1 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    },
    variant: {
      solid: 'shadow-md',
      outline: 'border-2 bg-transparent',
      ghost: 'bg-transparent',
    },
  },
})

// ===========================================
// With default variants
// ===========================================
export const cvWithDefaults = cv({
  base: 'btn rounded transition',
  variants: {
    color: {
      primary: 'bg-blue-500 text-white hover:bg-blue-600',
      secondary: 'bg-gray-500 text-white hover:bg-gray-600',
      danger: 'bg-red-500 text-white hover:bg-red-600',
    },
    size: {
      sm: 'px-2 py-1 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    },
  },
  defaultVariants: {
    color: 'primary',
    size: 'md',
  },
})

// ===========================================
// Compound variants
// ===========================================
export const cvCompoundVariants = cv({
  base: 'btn rounded transition',
  variants: {
    color: {
      primary: 'bg-blue-500 text-white',
      secondary: 'bg-gray-500 text-white',
      danger: 'bg-red-500 text-white',
    },
    size: {
      sm: 'px-2 py-1 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    },
    disabled: {
      true: 'opacity-50 cursor-not-allowed',
      false: 'cursor-pointer',
    },
  },
  compoundVariants: [
    {
      size: 'lg',
      color: 'primary',
      className: 'font-bold shadow-lg',
    },
    {
      size: ['sm', 'md'],
      color: 'danger',
      className: 'font-semibold',
    },
    {
      disabled: true,
      color: ['primary', 'secondary', 'danger'],
      className: 'pointer-events-none',
    },
  ],
})

// ===========================================
// With className override
// ===========================================
export const cvWithClassName = cv({
  base: 'btn',
  variants: {
    color: {
      primary: 'bg-blue-500',
      secondary: 'bg-gray-500',
    },
  },
})

// ===========================================
// Complex real-world button
// ===========================================
export const cvComplexButton = cv({
  base: 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
    },
    size: {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-md px-3',
      lg: 'h-11 rounded-md px-8',
      icon: 'h-10 w-10',
    },
  },
  compoundVariants: [
    {
      variant: 'destructive',
      size: 'lg',
      className: 'font-bold',
    },
    {
      variant: ['outline', 'ghost'],
      size: ['sm', 'default'],
      className: 'font-normal',
    },
  ],
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

// ===========================================
// Boolean variants
// ===========================================
export const cvBooleanVariants = cv({
  base: 'btn',
  variants: {
    disabled: {
      true: 'opacity-50 cursor-not-allowed',
      false: 'cursor-pointer',
    },
    loading: {
      true: 'animate-pulse pointer-events-none',
      false: '',
    },
    fullWidth: {
      true: 'w-full',
      false: 'w-auto',
    },
  },
})

// ===========================================
// No variants (edge case)
// ===========================================
export const cvNoVariants = cv({
  base: 'simple-class',
})
