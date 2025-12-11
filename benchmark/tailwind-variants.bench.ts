import { bench, describe } from 'vitest'
import { tv } from 'tailwind-variants/dist/lite'
import { cv } from '../dist/esm/cv'

describe('css-variants vs tailwind-variants', () => {
  // ===========================================
  // Simple base class only
  // ===========================================
  describe('base class only', () => {
    const cssVariants = cv({
      base: 'base-class',
    })

    const tailwindVariants = tv({
      base: 'base-class',
    })

    bench('css-variants', () => {
      cssVariants()
    })

    bench('tailwind-variants', () => {
      tailwindVariants()
    })
  })

  // ===========================================
  // Single variant
  // ===========================================
  describe('single variant', () => {
    const cssVariants = cv({
      base: 'btn',
      variants: {
        color: {
          primary: 'bg-blue-500 text-white',
          secondary: 'bg-gray-500 text-white',
          danger: 'bg-red-500 text-white',
        },
      },
    })

    const tailwindVariants = tv({
      base: 'btn',
      variants: {
        color: {
          primary: 'bg-blue-500 text-white',
          secondary: 'bg-gray-500 text-white',
          danger: 'bg-red-500 text-white',
        },
      },
    })

    bench('css-variants', () => {
      cssVariants({ color: 'primary' })
    })

    bench('tailwind-variants', () => {
      tailwindVariants({ color: 'primary' })
    })
  })

  // ===========================================
  // Multiple variants
  // ===========================================
  describe('multiple variants', () => {
    const cssVariants = cv({
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

    const tailwindVariants = tv({
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

    bench('css-variants', () => {
      cssVariants({ color: 'primary', size: 'md', variant: 'solid' })
    })

    bench('tailwind-variants', () => {
      tailwindVariants({ color: 'primary', size: 'md', variant: 'solid' })
    })
  })

  // ===========================================
  // With default variants (no props)
  // ===========================================
  describe('with default variants (no props)', () => {
    const cssVariants = cv({
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

    const tailwindVariants = tv({
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

    bench('css-variants', () => {
      cssVariants()
    })

    bench('tailwind-variants', () => {
      tailwindVariants()
    })
  })

  // ===========================================
  // With default variants (override one)
  // ===========================================
  describe('with default variants (override one)', () => {
    const cssVariants = cv({
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

    const tailwindVariants = tv({
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

    bench('css-variants', () => {
      cssVariants({ size: 'lg' })
    })

    bench('tailwind-variants', () => {
      tailwindVariants({ size: 'lg' })
    })
  })

  // ===========================================
  // Compound variants (no match)
  // ===========================================
  describe('compound variants (no match)', () => {
    const cssVariants = cv({
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

    const tailwindVariants = tv({
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
          class: 'font-bold shadow-lg',
        },
        {
          size: ['sm', 'md'],
          color: 'danger',
          class: 'font-semibold',
        },
        {
          disabled: true,
          color: ['primary', 'secondary', 'danger'],
          class: 'pointer-events-none',
        },
      ],
    })

    bench('css-variants', () => {
      cssVariants({ color: 'secondary', size: 'sm', disabled: false })
    })

    bench('tailwind-variants', () => {
      tailwindVariants({ color: 'secondary', size: 'sm', disabled: false })
    })
  })

  // ===========================================
  // Compound variants (single match)
  // ===========================================
  describe('compound variants (single match)', () => {
    const cssVariants = cv({
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

    const tailwindVariants = tv({
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
          class: 'font-bold shadow-lg',
        },
        {
          size: ['sm', 'md'],
          color: 'danger',
          class: 'font-semibold',
        },
        {
          disabled: true,
          color: ['primary', 'secondary', 'danger'],
          class: 'pointer-events-none',
        },
      ],
    })

    bench('css-variants', () => {
      cssVariants({ color: 'primary', size: 'lg', disabled: false })
    })

    bench('tailwind-variants', () => {
      tailwindVariants({ color: 'primary', size: 'lg', disabled: false })
    })
  })

  // ===========================================
  // Compound variants (multiple matches)
  // ===========================================
  describe('compound variants (multiple matches)', () => {
    const cssVariants = cv({
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

    const tailwindVariants = tv({
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
          class: 'font-bold shadow-lg',
        },
        {
          size: ['sm', 'md'],
          color: 'danger',
          class: 'font-semibold',
        },
        {
          disabled: true,
          color: ['primary', 'secondary', 'danger'],
          class: 'pointer-events-none',
        },
      ],
    })

    bench('css-variants', () => {
      cssVariants({ color: 'danger', size: 'sm', disabled: true })
    })

    bench('tailwind-variants', () => {
      tailwindVariants({ color: 'danger', size: 'sm', disabled: true })
    })
  })

  // ===========================================
  // With className override
  // ===========================================
  describe('with className override', () => {
    const cssVariants = cv({
      base: 'btn',
      variants: {
        color: {
          primary: 'bg-blue-500',
          secondary: 'bg-gray-500',
        },
      },
    })

    const tailwindVariants = tv({
      base: 'btn',
      variants: {
        color: {
          primary: 'bg-blue-500',
          secondary: 'bg-gray-500',
        },
      },
    })

    bench('css-variants', () => {
      cssVariants({ color: 'primary', className: 'custom-class extra-class' })
    })

    bench('tailwind-variants', () => {
      tailwindVariants({ color: 'primary', class: 'custom-class extra-class' })
    })
  })

  // ===========================================
  // Complex real-world button (defaults)
  // ===========================================
  describe('complex real-world button (defaults)', () => {
    const cssVariants = cv({
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

    const tailwindVariants = tv({
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
          class: 'font-bold',
        },
        {
          variant: ['outline', 'ghost'],
          size: ['sm', 'default'],
          class: 'font-normal',
        },
      ],
      defaultVariants: {
        variant: 'default',
        size: 'default',
      },
    })

    bench('css-variants', () => {
      cssVariants()
    })

    bench('tailwind-variants', () => {
      tailwindVariants()
    })
  })

  // ===========================================
  // Complex real-world button (with overrides)
  // ===========================================
  describe('complex real-world button (with overrides)', () => {
    const cssVariants = cv({
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

    const tailwindVariants = tv({
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
          class: 'font-bold',
        },
        {
          variant: ['outline', 'ghost'],
          size: ['sm', 'default'],
          class: 'font-normal',
        },
      ],
      defaultVariants: {
        variant: 'default',
        size: 'default',
      },
    })

    bench('css-variants', () => {
      cssVariants({ variant: 'destructive', size: 'lg', className: 'w-full' })
    })

    bench('tailwind-variants', () => {
      tailwindVariants({ variant: 'destructive', size: 'lg', class: 'w-full' })
    })
  })

  // ===========================================
  // Boolean variants
  // ===========================================
  describe('boolean variants', () => {
    const cssVariants = cv({
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

    const tailwindVariants = tv({
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

    bench('css-variants', () => {
      cssVariants({ disabled: true, loading: false, fullWidth: true })
    })

    bench('tailwind-variants', () => {
      tailwindVariants({ disabled: true, loading: false, fullWidth: true })
    })
  })

  // ===========================================
  // No variants (edge case)
  // ===========================================
  describe('no variants with className override', () => {
    const cssVariants = cv({
      base: 'simple-class',
    })

    const tailwindVariants = tv({
      base: 'simple-class',
    })

    bench('css-variants', () => {
      cssVariants({ className: 'extra' })
    })

    bench('tailwind-variants', () => {
      tailwindVariants({ class: 'extra' })
    })
  })
})
