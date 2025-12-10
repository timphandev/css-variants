import { bench, describe } from 'vitest'
import { cv } from './cv'

describe('cv benchmarks', () => {
  // Simple base class only
  const simpleVariant = cv({
    base: 'base-class',
  })

  bench('base class only', () => {
    simpleVariant()
  })

  // Single variant
  const singleVariant = cv({
    base: 'btn',
    variants: {
      color: {
        primary: 'bg-blue-500 text-white',
        secondary: 'bg-gray-500 text-white',
        danger: 'bg-red-500 text-white',
      },
    },
  })

  bench('single variant', () => {
    singleVariant({ color: 'primary' })
  })

  // Multiple variants
  const multipleVariants = cv({
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

  bench('multiple variants', () => {
    multipleVariants({ color: 'primary', size: 'md', variant: 'solid' })
  })

  // With default variants
  const withDefaults = cv({
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

  bench('with default variants (no props)', () => {
    withDefaults()
  })

  bench('with default variants (override one)', () => {
    withDefaults({ size: 'lg' })
  })

  // Compound variants
  const withCompoundVariants = cv({
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

  bench('compound variants (no match)', () => {
    withCompoundVariants({ color: 'secondary', size: 'sm', disabled: false })
  })

  bench('compound variants (single match)', () => {
    withCompoundVariants({ color: 'primary', size: 'lg', disabled: false })
  })

  bench('compound variants (multiple matches)', () => {
    withCompoundVariants({ color: 'danger', size: 'sm', disabled: true })
  })

  // With className override
  const withClassName = cv({
    base: 'btn',
    variants: {
      color: {
        primary: 'bg-blue-500',
        secondary: 'bg-gray-500',
      },
    },
  })

  bench('with className override', () => {
    withClassName({ color: 'primary', className: 'custom-class extra-class' })
  })

  // Complex real-world example
  const complexButton = cv({
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

  bench('complex real-world button (defaults)', () => {
    complexButton()
  })

  bench('complex real-world button (with overrides)', () => {
    complexButton({ variant: 'destructive', size: 'lg', className: 'w-full' })
  })

  // Boolean variants
  const booleanVariants = cv({
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

  bench('boolean variants', () => {
    booleanVariants({ disabled: true, loading: false, fullWidth: true })
  })

  // No variants (edge case)
  const noVariants = cv({
    base: 'simple-class',
  })

  bench('no variants (optimized path)', () => {
    noVariants({ className: 'extra' })
  })
})
