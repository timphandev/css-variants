import { describe, it, expect, vi } from 'vitest'
import { cv } from './cv'
import { cx } from './cx'

describe('cv - Comprehensive Test Suite', () => {
  describe('Base Functionality', () => {
    it('should return empty string when no config is provided', () => {
      const variantFn = cv({})
      expect(variantFn()).toBe('')
    })

    it('should handle base as string', () => {
      const variantFn = cv({ base: 'btn' })
      expect(variantFn()).toBe('btn')
    })

    it('should handle base as array of strings', () => {
      const variantFn = cv({ base: ['btn', 'rounded'] })
      expect(variantFn()).toBe('btn rounded')
    })

    it('should handle base as object dictionary', () => {
      const variantFn = cv({ base: { btn: true, disabled: false, active: true } })
      expect(variantFn()).toBe('btn active')
    })

    it('should handle base with mixed types', () => {
      const variantFn = cv({ base: ['btn', { rounded: true, disabled: false }, null, undefined] })
      expect(variantFn()).toBe('btn rounded')
    })

    it('should handle base with numbers and bigints', () => {
      const variantFn = cv({ base: [123, BigInt(456), 'text'] })
      expect(variantFn()).toBe('123 456 text')
    })
  })

  describe('Variants - Single Variant', () => {
    it('should apply single variant', () => {
      const variantFn = cv({
        base: 'btn',
        variants: {
          color: {
            primary: 'bg-blue-500',
            secondary: 'bg-gray-500',
          },
        },
      })

      expect(variantFn({ color: 'primary' })).toBe('btn bg-blue-500')
      expect(variantFn({ color: 'secondary' })).toBe('btn bg-gray-500')
    })

    it('should ignore undefined variant value', () => {
      const variantFn = cv({
        base: 'btn',
        variants: {
          color: {
            primary: 'bg-blue-500',
          },
        },
      })
      expect(variantFn({ color: undefined })).toBe('btn')
    })

    it('should ignore non-existent variant key', () => {
      const variantFn = cv({
        base: 'btn',
        variants: {
          color: {
            primary: 'bg-blue-500',
          },
        },
      })
      // @ts-expect-error - Testing runtime behavior with invalid key
      expect(variantFn({ size: 'large' })).toBe('btn')
    })

    it('should ignore non-existent variant value', () => {
      const variantFn = cv({
        base: 'btn',
        variants: {
          color: {
            primary: 'bg-blue-500',
          },
        },
      })
      // @ts-expect-error - Testing runtime behavior with invalid value
      expect(variantFn({ color: 'tertiary' })).toBe('btn')
    })

    it('should handle variant values as arrays', () => {
      const variantFn = cv({
        base: 'btn',
        variants: {
          color: {
            primary: ['bg-blue-500', 'text-white'],
          },
        },
      })
      expect(variantFn({ color: 'primary' })).toBe('btn bg-blue-500 text-white')
    })

    it('should handle variant values as objects', () => {
      const variantFn = cv({
        base: 'btn',
        variants: {
          color: {
            primary: { 'bg-blue-500': true, 'bg-red-500': false, 'text-white': true },
          },
        },
      })
      expect(variantFn({ color: 'primary' })).toBe('btn bg-blue-500 text-white')
    })
  })

  describe('Variants - Multiple Variants', () => {
    it('should combine multiple variants', () => {
      const variantFn = cv({
        base: 'btn',
        variants: {
          color: {
            primary: 'bg-blue-500',
            secondary: 'bg-gray-500',
          },
          size: {
            sm: 'text-sm px-2 py-1',
            lg: 'text-lg px-4 py-2',
          },
        },
      })
      expect(variantFn({ color: 'primary', size: 'lg' })).toBe('btn bg-blue-500 text-lg px-4 py-2')
    })

    it('should handle partial variant props', () => {
      const variantFn = cv({
        base: 'btn',
        variants: {
          color: {
            primary: 'bg-blue-500',
          },
          size: {
            sm: 'text-sm',
          },
        },
      })
      expect(variantFn({ color: 'primary' })).toBe('btn bg-blue-500')
      expect(variantFn({ size: 'sm' })).toBe('btn text-sm')
    })
  })

  describe('Default Variants', () => {
    it('should apply default variants when no props provided', () => {
      const variantFn = cv({
        base: 'btn',
        variants: {
          color: {
            primary: 'bg-blue-500',
            secondary: 'bg-gray-500',
          },
        },
        defaultVariants: {
          color: 'primary',
        },
      })
      expect(variantFn()).toBe('btn bg-blue-500')
    })

    it('should override default variants with provided props', () => {
      const variantFn = cv({
        base: 'btn',
        variants: {
          color: {
            primary: 'bg-blue-500',
            secondary: 'bg-gray-500',
          },
        },
        defaultVariants: {
          color: 'primary',
        },
      })
      expect(variantFn({ color: 'secondary' })).toBe('btn bg-gray-500')
    })

    it('should apply default variants for multiple variants', () => {
      const variantFn = cv({
        base: 'btn',
        variants: {
          color: {
            primary: 'bg-blue-500',
            secondary: 'bg-gray-500',
          },
          size: {
            sm: 'text-sm',
            lg: 'text-lg',
          },
        },
        defaultVariants: {
          color: 'primary',
          size: 'sm',
        },
      })
      expect(variantFn()).toBe('btn bg-blue-500 text-sm')
      expect(variantFn({ color: 'secondary' })).toBe('btn bg-gray-500 text-sm')
      expect(variantFn({ size: 'lg' })).toBe('btn bg-blue-500 text-lg')
    })

    it('should revert to default when variant prop is undefined', () => {
      const variantFn = cv({
        base: 'btn',
        variants: {
          color: {
            primary: 'bg-blue-500',
            secondary: 'bg-gray-500',
          },
        },
        defaultVariants: {
          color: 'primary',
        },
      })
      expect(variantFn({ color: undefined })).toBe('btn bg-blue-500')
    })
  })

  describe('Boolean Variants', () => {
    it('should handle boolean true variant', () => {
      const variantFn = cv({
        base: 'btn',
        variants: {
          disabled: {
            true: 'opacity-50 cursor-not-allowed',
            false: 'cursor-pointer',
          },
        },
      })
      expect(variantFn({ disabled: true })).toBe('btn opacity-50 cursor-not-allowed')
    })

    it('should handle boolean false variant', () => {
      const variantFn = cv({
        base: 'btn',
        variants: {
          disabled: {
            true: 'opacity-50',
            false: 'cursor-pointer',
          },
        },
      })
      expect(variantFn({ disabled: false })).toBe('btn cursor-pointer')
    })

    it('should handle boolean variant with default', () => {
      const variantFn = cv({
        base: 'btn',
        variants: {
          disabled: {
            true: 'opacity-50',
            false: 'cursor-pointer',
          },
        },
        defaultVariants: {
          disabled: false,
        },
      })
      expect(variantFn()).toBe('btn cursor-pointer')
      expect(variantFn({ disabled: true })).toBe('btn opacity-50')
    })

    it('should handle multiple boolean variants', () => {
      const variantFn = cv({
        base: 'btn',
        variants: {
          disabled: {
            true: 'opacity-50',
          },
          loading: {
            true: 'animate-spin',
          },
        },
      })
      expect(variantFn({ disabled: true, loading: true })).toBe('btn opacity-50 animate-spin')
    })
  })

  describe('Compound Variants', () => {
    it('should apply compound variant when all conditions match', () => {
      const variantFn = cv({
        base: 'btn',
        variants: {
          color: {
            primary: 'bg-blue-500',
            secondary: 'bg-gray-500',
          },
          size: {
            sm: 'text-sm',
            lg: 'text-lg',
          },
        },
        compoundVariants: [
          {
            color: 'primary',
            size: 'lg',
            className: 'font-bold shadow-lg',
          },
        ],
      })
      expect(variantFn({ color: 'primary', size: 'lg' })).toBe('btn bg-blue-500 text-lg font-bold shadow-lg')
    })

    it('should not apply compound variant when conditions do not match', () => {
      const variantFn = cv({
        base: 'btn',
        variants: {
          color: {
            primary: 'bg-blue-500',
            secondary: 'bg-gray-500',
          },
          size: {
            sm: 'text-sm',
            lg: 'text-lg',
          },
        },
        compoundVariants: [
          {
            color: 'primary',
            size: 'lg',
            className: 'font-bold',
          },
        ],
      })
      expect(variantFn({ color: 'primary', size: 'sm' })).toBe('btn bg-blue-500 text-sm')
      expect(variantFn({ color: 'secondary', size: 'lg' })).toBe('btn bg-gray-500 text-lg')
    })

    it('should apply multiple compound variants when conditions match', () => {
      const variantFn = cv({
        base: 'btn',
        variants: {
          color: {
            primary: 'bg-blue-500',
            danger: 'bg-red-500',
          },
          size: {
            sm: 'text-sm',
            lg: 'text-lg',
          },
        },
        compoundVariants: [
          {
            color: 'primary',
            size: 'lg',
            className: 'shadow-blue',
          },
          {
            color: 'danger',
            size: 'lg',
            className: 'shadow-red',
          },
        ],
      })
      expect(variantFn({ color: 'danger', size: 'lg' })).toBe('btn bg-red-500 text-lg shadow-red')
    })

    it('should handle compound variant with array selectors', () => {
      const variantFn = cv({
        base: 'btn',
        variants: {
          color: {
            primary: 'bg-blue-500',
            secondary: 'bg-gray-500',
            danger: 'bg-red-500',
          },
          size: {
            sm: 'text-sm',
            lg: 'text-lg',
          },
        },
        compoundVariants: [
          {
            color: ['primary', 'danger'],
            size: 'lg',
            className: 'font-bold',
          },
        ],
      })
      expect(variantFn({ color: 'primary', size: 'lg' })).toBe('btn bg-blue-500 text-lg font-bold')
      expect(variantFn({ color: 'danger', size: 'lg' })).toBe('btn bg-red-500 text-lg font-bold')
      expect(variantFn({ color: 'secondary', size: 'lg' })).toBe('btn bg-gray-500 text-lg')
    })

    it('should handle compound variant with multiple array selectors', () => {
      const variantFn = cv({
        base: 'btn',
        variants: {
          color: {
            primary: 'bg-blue-500',
            secondary: 'bg-gray-500',
            danger: 'bg-red-500',
          },
          size: {
            sm: 'text-sm',
            md: 'text-base',
            lg: 'text-lg',
          },
        },
        compoundVariants: [
          {
            color: ['primary', 'danger'],
            size: ['md', 'lg'],
            className: 'font-bold',
          },
        ],
      })
      expect(variantFn({ color: 'primary', size: 'md' })).toBe('btn bg-blue-500 text-base font-bold')
      expect(variantFn({ color: 'danger', size: 'lg' })).toBe('btn bg-red-500 text-lg font-bold')
      expect(variantFn({ color: 'primary', size: 'sm' })).toBe('btn bg-blue-500 text-sm')
    })

    it('should handle compound variant with default variants', () => {
      const variantFn = cv({
        base: 'btn',
        variants: {
          color: {
            primary: 'bg-blue-500',
            secondary: 'bg-gray-500',
          },
          size: {
            sm: 'text-sm',
            lg: 'text-lg',
          },
        },
        defaultVariants: {
          color: 'primary',
          size: 'lg',
        },
        compoundVariants: [
          {
            color: 'primary',
            size: 'lg',
            className: 'font-bold',
          },
        ],
      })
      expect(variantFn()).toBe('btn bg-blue-500 text-lg font-bold')
    })

    it('should handle compound variant with boolean variants', () => {
      const variantFn = cv({
        base: 'btn',
        variants: {
          color: {
            primary: 'bg-blue-500',
          },
          disabled: {
            true: 'opacity-50',
            false: 'opacity-100',
          },
        },
        compoundVariants: [
          {
            color: 'primary',
            disabled: true,
            className: 'cursor-not-allowed',
          },
        ],
      })
      expect(variantFn({ color: 'primary', disabled: true })).toBe('btn bg-blue-500 opacity-50 cursor-not-allowed')
    })

    it('should handle compound variant className as array', () => {
      const variantFn = cv({
        base: 'btn',
        variants: {
          color: {
            primary: 'bg-blue-500',
          },
          size: {
            lg: 'text-lg',
          },
        },
        compoundVariants: [
          {
            color: 'primary',
            size: 'lg',
            className: ['font-bold', 'shadow-lg'],
          },
        ],
      })
      expect(variantFn({ color: 'primary', size: 'lg' })).toBe('btn bg-blue-500 text-lg font-bold shadow-lg')
    })

    it('should handle compound variant with partial matches (only apply when all match)', () => {
      const variantFn = cv({
        base: 'btn',
        variants: {
          color: {
            primary: 'bg-blue-500',
          },
          size: {
            lg: 'text-lg',
          },
          disabled: {
            true: 'opacity-50',
          },
        },
        compoundVariants: [
          {
            color: 'primary',
            size: 'lg',
            disabled: true,
            className: 'special',
          },
        ],
      })
      expect(variantFn({ color: 'primary', size: 'lg' })).toBe('btn bg-blue-500 text-lg')
      expect(variantFn({ color: 'primary', size: 'lg', disabled: true })).toBe(
        'btn bg-blue-500 text-lg opacity-50 special'
      )
    })

    it('should not apply compound variant when className is undefined', () => {
      const variantFn = cv({
        base: 'btn',
        variants: {
          color: {
            primary: 'bg-blue-500',
          },
        },
        compoundVariants: [
          {
            color: 'primary',
            className: undefined,
          },
        ],
      })
      expect(variantFn({ color: 'primary' })).toBe('btn bg-blue-500')
    })

    it('should apply multiple overlapping compound variants', () => {
      const variantFn = cv({
        base: 'btn',
        variants: {
          color: {
            primary: 'bg-blue-500',
          },
          size: {
            lg: 'text-lg',
          },
        },
        compoundVariants: [
          {
            color: 'primary',
            className: 'border-blue',
          },
          {
            size: 'lg',
            className: 'p-4',
          },
          {
            color: 'primary',
            size: 'lg',
            className: 'shadow-xl',
          },
        ],
      })
      expect(variantFn({ color: 'primary', size: 'lg' })).toBe('btn bg-blue-500 text-lg border-blue p-4 shadow-xl')
    })
  })

  describe('className Override', () => {
    it('should append className prop to result', () => {
      const variantFn = cv({
        base: 'btn',
      })
      expect(variantFn({ className: 'custom' })).toBe('btn custom')
    })

    it('should append className with variants', () => {
      const variantFn = cv({
        base: 'btn',
        variants: {
          color: {
            primary: 'bg-blue-500',
          },
        },
      })
      expect(variantFn({ color: 'primary', className: 'custom' })).toBe('btn bg-blue-500 custom')
    })

    it('should handle className as array', () => {
      const variantFn = cv({
        base: 'btn',
      })
      expect(variantFn({ className: ['custom-1', 'custom-2'] })).toBe('btn custom-1 custom-2')
    })

    it('should handle className as object', () => {
      const variantFn = cv({
        base: 'btn',
      })
      expect(variantFn({ className: { 'custom-1': true, 'custom-2': false } })).toBe('btn custom-1')
    })

    it('should not include className in variant matching', () => {
      const variantFn = cv({
        base: 'btn',
        variants: {
          color: {
            primary: 'bg-blue-500',
          },
        },
        defaultVariants: {
          color: 'primary',
        },
      })
      expect(variantFn({ className: 'custom' })).toBe('btn bg-blue-500 custom')
    })
  })

  describe('Custom classNameResolver', () => {
    it('should use custom classNameResolver', () => {
      const customResolver = vi.fn((...args) => cx(...args))
      const variantFn = cv({
        base: 'btn',
        classNameResolver: customResolver,
      })
      variantFn()
      expect(customResolver).toHaveBeenCalledWith('btn', undefined)
    })

    it('should pass all arguments to custom classNameResolver', () => {
      const customResolver = vi.fn((...args) => cx(...args))
      const variantFn = cv({
        base: 'btn',
        variants: {
          color: {
            primary: 'bg-blue-500',
          },
        },
        classNameResolver: customResolver,
      })
      variantFn({ color: 'primary', className: 'custom' })
      expect(customResolver).toHaveBeenCalledWith('btn', ['bg-blue-500'], 'custom')
    })

    it('should allow custom merging logic', () => {
      const customResolver: typeof cx = (...args) => {
        return `custom-${cx(...args)}`
      }
      const variantFn = cv({
        base: 'btn',
        variants: {
          color: {
            primary: 'bg-blue-500',
          },
        },
        classNameResolver: customResolver,
      })
      expect(variantFn({ color: 'primary' })).toBe('custom-btn bg-blue-500')
    })

    it('should work with custom resolver that filters duplicates', () => {
      const dedupeResolver: typeof cx = (...args) => {
        const classes = cx(...args).split(' ')
        return [...new Set(classes)].join(' ')
      }
      const variantFn = cv({
        base: 'btn btn',
        variants: {
          color: {
            primary: 'btn bg-blue-500',
          },
        },
        classNameResolver: dedupeResolver,
      })
      expect(variantFn({ color: 'primary' })).toBe('btn bg-blue-500')
    })

    it('should use custom resolver when no variants defined', () => {
      const customResolver = vi.fn((...args) => cx(...args))
      const variantFn = cv({
        base: 'btn',
        classNameResolver: customResolver,
      })
      variantFn({ className: 'custom' })
      expect(customResolver).toHaveBeenCalledWith('btn', 'custom')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty variants object', () => {
      const variantFn = cv({
        base: 'btn',
        variants: {},
      })
      expect(variantFn()).toBe('btn')
    })

    it('should handle variant with empty value object', () => {
      const variantFn = cv({
        base: 'btn',
        variants: {
          color: {},
        },
      })
      // @ts-expect-error - Testing runtime behavior
      expect(variantFn({ color: 'primary' })).toBe('btn')
    })

    it('should handle null and undefined in base', () => {
      const variantFn = cv({
        base: [null, undefined, 'btn', null],
      })
      expect(variantFn()).toBe('btn')
    })

    it('should handle false and true booleans in base', () => {
      const variantFn = cv({
        base: [false, 'btn', true, 'text'],
      })
      expect(variantFn()).toBe('btn text')
    })

    it('should handle empty string in base', () => {
      const variantFn = cv({
        base: ['', 'btn', ''],
      })
      expect(variantFn()).toBe('btn')
    })

    it('should handle nested arrays in variant values', () => {
      const variantFn = cv({
        base: 'btn',
        variants: {
          color: {
            primary: [['bg-blue-500', 'text-white'], 'border-blue-600'],
          },
        },
      })
      expect(variantFn({ color: 'primary' })).toBe('btn bg-blue-500 text-white border-blue-600')
    })

    it('should handle compound variants with empty array selectors', () => {
      const variantFn = cv({
        base: 'btn',
        variants: {
          color: {
            primary: 'bg-blue-500',
          },
        },
        compoundVariants: [
          {
            color: [],
            className: 'should-not-match',
          },
        ],
      })
      expect(variantFn({ color: 'primary' })).toBe('btn bg-blue-500')
    })

    it('should handle very long class strings', () => {
      const longClass = 'a '.repeat(1000).trim()
      const variantFn = cv({
        base: longClass,
      })
      expect(variantFn()).toBe(longClass)
    })

    it('should handle special characters in class names', () => {
      const variantFn = cv({
        base: 'btn-primary_active hover:bg-blue-500 [&>svg]:w-4',
      })
      expect(variantFn()).toBe('btn-primary_active hover:bg-blue-500 [&>svg]:w-4')
    })

    it('should handle undefined config properties gracefully', () => {
      const variantFn = cv({
        base: undefined,
        variants: undefined,
        defaultVariants: undefined,
        compoundVariants: undefined,
      })
      expect(variantFn()).toBe('')
    })

    it('should handle calling function multiple times with same config', () => {
      const variantFn = cv({
        base: 'btn',
        variants: {
          color: {
            primary: 'bg-blue-500',
          },
        },
      })
      expect(variantFn({ color: 'primary' })).toBe('btn bg-blue-500')
      expect(variantFn({ color: 'primary' })).toBe('btn bg-blue-500')
      expect(variantFn()).toBe('btn')
    })

    it('should not mutate input props', () => {
      const variantFn = cv({
        base: 'btn',
        variants: {
          color: {
            primary: 'bg-blue-500',
          },
        },
      })
      const props = { color: 'primary' as const }
      variantFn(props)
      expect(props).toEqual({ color: 'primary' })
    })

    it('should handle unicode characters in class names', () => {
      const variantFn = cv({
        base: 'btn-🚀',
        variants: {
          theme: {
            emoji: '✨-theme',
          },
        },
      })
      expect(variantFn({ theme: 'emoji' })).toBe('btn-🚀 ✨-theme')
    })
  })

  describe('Type Safety Scenarios', () => {
    it('should work with no variants (minimal config)', () => {
      const variantFn = cv({
        base: 'btn',
      })
      expect(variantFn()).toBe('btn')
      expect(variantFn({})).toBe('btn')
      expect(variantFn({ className: 'custom' })).toBe('btn custom')
    })

    it('should work with only variants (no base)', () => {
      const variantFn = cv({
        variants: {
          color: {
            primary: 'bg-blue-500',
          },
        },
      })
      expect(variantFn({ color: 'primary' })).toBe('bg-blue-500')
    })

    it('should work with only defaultVariants', () => {
      const variantFn = cv({
        variants: {
          color: {
            primary: 'bg-blue-500',
          },
        },
        defaultVariants: {
          color: 'primary',
        },
      })
      expect(variantFn()).toBe('bg-blue-500')
    })

    it('should work with only compoundVariants', () => {
      const variantFn = cv({
        base: 'btn',
        variants: {
          color: {
            primary: 'bg-blue-500',
          },
        },
        compoundVariants: [
          {
            color: 'primary',
            className: 'font-bold',
          },
        ],
      })
      expect(variantFn({ color: 'primary' })).toBe('btn bg-blue-500 font-bold')
    })
  })

  describe('Performance and Iteration Order', () => {
    it('should maintain order of class application: base -> variants -> compounds -> className', () => {
      const variantFn = cv({
        base: 'base',
        variants: {
          a: { x: 'variant-a' },
          b: { y: 'variant-b' },
        },
        compoundVariants: [
          {
            a: 'x',
            b: 'y',
            className: 'compound',
          },
        ],
      })
      expect(variantFn({ a: 'x', b: 'y', className: 'override' })).toBe('base variant-a variant-b compound override')
    })

    it('should handle large number of variants efficiently', () => {
      const variants: Record<string, Record<string, string>> = {}
      for (let i = 0; i < 50; i++) {
        variants[`variant${i}`] = {
          value: `class-${i}`,
        }
      }
      const variantFn = cv({
        base: 'btn',
        variants,
      })
      const props = Object.keys(variants).reduce(
        (acc, key) => {
          acc[key] = 'value'
          return acc
        },
        {} as Record<string, string>
      )
      const result = variantFn(props)
      expect(result.split(' ').length).toBe(51) // base + 50 variants
    })

    it('should handle large number of compound variants', () => {
      const compoundVariants: Array<{ color: 'primary'; size: 'lg'; className: string }> = []
      for (let i = 0; i < 20; i++) {
        compoundVariants.push({
          color: 'primary' as const,
          size: 'lg' as const,
          className: `compound-${i}`,
        })
      }
      const variantFn = cv({
        base: 'btn',
        variants: {
          color: { primary: 'bg-blue' },
          size: { lg: 'text-lg' },
        },
        compoundVariants,
      })
      const result = variantFn({ color: 'primary', size: 'lg' })
      expect(result.split(' ').length).toBe(23) // base + 2 variants + 20 compounds
    })
  })

  describe('Configuration Composition (Extend Pattern)', () => {
    it('should support extending configuration via shared config object', () => {
      const baseButtonConfig = {
        base: 'rounded font-medium',
        variants: {
          size: {
            sm: 'px-2 py-1 text-sm',
            lg: 'px-4 py-2 text-lg',
          },
        },
      } as const

      const baseButton = cv(baseButtonConfig)

      // Extend by spreading and adding new styles
      const primaryButton = cv({
        base: [baseButtonConfig.base, 'bg-blue-600 text-white'],
        variants: {
          ...baseButtonConfig.variants,
        },
      })

      expect(baseButton({ size: 'sm' })).toBe('rounded font-medium px-2 py-1 text-sm')
      expect(primaryButton({ size: 'sm' })).toBe('rounded font-medium bg-blue-600 text-white px-2 py-1 text-sm')
    })

    it('should support overriding variants in extended config', () => {
      const baseConfig = {
        base: 'btn',
        variants: {
          color: {
            primary: 'bg-blue-500',
            secondary: 'bg-gray-500',
          },
          size: {
            sm: 'text-sm',
            lg: 'text-lg',
          },
        },
        defaultVariants: {
          color: 'primary',
          size: 'sm',
        },
      } as const

      // Extend and override color variants
      const extendedButton = cv({
        base: baseConfig.base,
        variants: {
          ...baseConfig.variants,
          color: {
            ...baseConfig.variants.color,
            primary: 'bg-indigo-600', // Override primary
            danger: 'bg-red-600', // Add new variant
          },
        },
        defaultVariants: baseConfig.defaultVariants,
      })

      expect(extendedButton({ color: 'primary' })).toBe('btn bg-indigo-600 text-sm')
      expect(extendedButton({ color: 'secondary' })).toBe('btn bg-gray-500 text-sm')
      expect(extendedButton({ color: 'danger' })).toBe('btn bg-red-600 text-sm')
    })

    it('should support adding compound variants to extended config', () => {
      const baseConfig = {
        base: 'btn',
        variants: {
          color: {
            primary: 'bg-blue-500',
          },
          size: {
            lg: 'text-lg',
          },
        },
      } as const

      const extendedButton = cv({
        ...baseConfig,
        compoundVariants: [
          {
            color: 'primary',
            size: 'lg',
            className: 'font-bold shadow-lg',
          },
        ],
      })

      expect(extendedButton({ color: 'primary', size: 'lg' })).toBe('btn bg-blue-500 text-lg font-bold shadow-lg')
    })
  })

  describe('Real-world Component Examples', () => {
    it('should work for button component', () => {
      const button = cv({
        base: 'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        variants: {
          variant: {
            default: 'bg-primary text-primary-foreground hover:bg-primary/90',
            destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
            outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
            ghost: 'hover:bg-accent hover:text-accent-foreground',
          },
          size: {
            default: 'h-10 px-4 py-2',
            sm: 'h-9 rounded-md px-3',
            lg: 'h-11 rounded-md px-8',
            icon: 'h-10 w-10',
          },
        },
        defaultVariants: {
          variant: 'default',
          size: 'default',
        },
      })

      expect(button()).toContain('bg-primary')
      expect(button({ variant: 'destructive', size: 'lg' })).toContain('bg-destructive')
    })

    it('should work for card component with compound variants', () => {
      const card = cv({
        base: 'rounded-lg border bg-card text-card-foreground shadow-sm',
        variants: {
          variant: {
            default: 'border-border',
            elevated: 'border-transparent shadow-md',
          },
          padding: {
            none: 'p-0',
            sm: 'p-4',
            md: 'p-6',
            lg: 'p-8',
          },
          hoverable: {
            true: 'cursor-pointer transition-shadow',
            false: '',
          },
        },
        compoundVariants: [
          {
            variant: 'elevated',
            hoverable: true,
            className: 'hover:shadow-lg',
          },
        ],
        defaultVariants: {
          variant: 'default',
          padding: 'md',
          hoverable: false,
        },
      })

      expect(card()).toContain('p-6')
      expect(card({ variant: 'elevated', hoverable: true })).toContain('hover:shadow-lg')
    })

    it('should work for input component', () => {
      const input = cv({
        base: 'flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0',
        variants: {
          variant: {
            default: 'border-input bg-background',
            filled: 'border-transparent bg-muted',
          },
          error: {
            true: 'border-destructive focus-visible:ring-destructive',
            false: '',
          },
          disabled: {
            true: 'cursor-not-allowed opacity-50',
            false: '',
          },
        },
        defaultVariants: {
          variant: 'default',
          error: false,
          disabled: false,
        },
      })

      expect(input({ error: true })).toContain('border-destructive')
      expect(input({ disabled: true })).toContain('opacity-50')
    })
  })
})
