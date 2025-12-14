import { describe, it, expect, vi } from 'vitest'
import { scv } from './scv'
import { cx } from './cx'

describe('scv - Comprehensive Test Suite', () => {
  describe('Base Functionality', () => {
    it('should return empty strings for all slots when no config provided', () => {
      const variantFn = scv({ slots: ['root'] })
      expect(variantFn()).toEqual({ root: '' })
    })

    it('should handle multiple slots with empty config', () => {
      const variantFn = scv({ slots: ['root', 'icon', 'label'] })
      expect(variantFn()).toEqual({ root: '', icon: '', label: '' })
    })

    it('should apply base classes as strings', () => {
      const variantFn = scv({
        slots: ['root', 'icon'],
        base: {
          root: 'btn',
          icon: 'icon',
        },
      })
      expect(variantFn()).toEqual({
        root: 'btn',
        icon: 'icon',
      })
    })

    it('should apply base classes as arrays', () => {
      const variantFn = scv({
        slots: ['root', 'icon'],
        base: {
          root: ['btn', 'rounded'],
          icon: ['icon', 'small'],
        },
      })
      expect(variantFn()).toEqual({
        root: 'btn rounded',
        icon: 'icon small',
      })
    })

    it('should apply base classes as objects', () => {
      const variantFn = scv({
        slots: ['root'],
        base: {
          root: { btn: true, disabled: false, active: true },
        },
      })
      expect(variantFn()).toEqual({
        root: 'btn active',
      })
    })

    it('should handle partial base (not all slots defined)', () => {
      const variantFn = scv({
        slots: ['root', 'icon', 'label'],
        base: {
          root: 'btn',
        },
      })
      expect(variantFn()).toEqual({
        root: 'btn',
        icon: '',
        label: '',
      })
    })

    it('should handle base with mixed types', () => {
      const variantFn = scv({
        slots: ['root', 'icon'],
        base: {
          root: ['btn', { rounded: true, disabled: false }, null, undefined],
          icon: [123, 'icon'],
        },
      })
      expect(variantFn()).toEqual({
        root: 'btn rounded',
        icon: '123 icon',
      })
    })
  })

  describe('Variants - Single Variant', () => {
    it('should apply single variant to single slot', () => {
      const variantFn = scv({
        slots: ['root'],
        variants: {
          color: {
            primary: { root: 'bg-blue-500' },
            secondary: { root: 'bg-gray-500' },
          },
        },
      })
      expect(variantFn({ color: 'primary' })).toEqual({ root: 'bg-blue-500' })
      expect(variantFn({ color: 'secondary' })).toEqual({ root: 'bg-gray-500' })
    })

    it('should handle base as array with variants', () => {
      const variantFn = scv({
        slots: ['root', 'icon'],
        base: {
          root: ['btn', 'rounded'],
          icon: ['icon', 'inline-block'],
        },
        variants: {
          color: {
            primary: { root: 'bg-blue-500' },
          },
        },
      })
      expect(variantFn({ color: 'primary' })).toEqual({
        root: 'btn rounded bg-blue-500',
        icon: 'icon inline-block',
      })
    })

    it('should apply single variant to multiple slots', () => {
      const variantFn = scv({
        slots: ['root', 'icon', 'label'],
        variants: {
          size: {
            sm: {
              root: 'h-8',
              icon: 'w-4 h-4',
              label: 'text-sm',
            },
            lg: {
              root: 'h-12',
              icon: 'w-6 h-6',
              label: 'text-lg',
            },
          },
        },
      })
      expect(variantFn({ size: 'sm' })).toEqual({
        root: 'h-8',
        icon: 'w-4 h-4',
        label: 'text-sm',
      })
      expect(variantFn({ size: 'lg' })).toEqual({
        root: 'h-12',
        icon: 'w-6 h-6',
        label: 'text-lg',
      })
    })

    it('should apply variant to partial slots', () => {
      const variantFn = scv({
        slots: ['root', 'icon', 'label'],
        variants: {
          color: {
            primary: {
              root: 'bg-blue-500',
              label: 'text-white',
              // icon intentionally omitted
            },
          },
        },
      })
      expect(variantFn({ color: 'primary' })).toEqual({
        root: 'bg-blue-500',
        icon: '',
        label: 'text-white',
      })
    })

    it('should ignore undefined variant value', () => {
      const variantFn = scv({
        slots: ['root'],
        variants: {
          color: {
            primary: { root: 'bg-blue-500' },
          },
        },
      })
      expect(variantFn({ color: undefined })).toEqual({ root: '' })
    })

    it('should ignore non-existent variant value', () => {
      const variantFn = scv({
        slots: ['root'],
        variants: {
          color: {
            primary: { root: 'bg-blue-500' },
          },
        },
      })
      // @ts-expect-error - Testing runtime behavior
      expect(variantFn({ color: 'tertiary' })).toEqual({ root: '' })
    })
  })

  describe('Variants - Multiple Variants', () => {
    it('should combine multiple variants across slots', () => {
      const variantFn = scv({
        slots: ['root', 'icon'],
        base: {
          root: 'btn',
          icon: 'icon',
        },
        variants: {
          color: {
            primary: { root: 'bg-blue-500', icon: 'text-blue-500' },
            secondary: { root: 'bg-gray-500', icon: 'text-gray-500' },
          },
          size: {
            sm: { root: 'h-8 px-2', icon: 'w-4 h-4' },
            lg: { root: 'h-12 px-4', icon: 'w-6 h-6' },
          },
        },
      })
      expect(variantFn({ color: 'primary', size: 'lg' })).toEqual({
        root: 'btn bg-blue-500 h-12 px-4',
        icon: 'icon text-blue-500 w-6 h-6',
      })
    })

    it('should handle partial variant props', () => {
      const variantFn = scv({
        slots: ['root', 'icon'],
        variants: {
          color: {
            primary: { root: 'bg-blue-500' },
          },
          size: {
            sm: { icon: 'w-4 h-4' },
          },
        },
      })
      expect(variantFn({ color: 'primary' })).toEqual({ root: 'bg-blue-500', icon: '' })
      expect(variantFn({ size: 'sm' })).toEqual({ root: '', icon: 'w-4 h-4' })
    })
  })

  describe('Default Variants', () => {
    it('should apply default variants when no props provided', () => {
      const variantFn = scv({
        slots: ['root', 'icon'],
        variants: {
          size: {
            sm: { root: 'h-8', icon: 'w-4' },
            lg: { root: 'h-12', icon: 'w-6' },
          },
        },
        defaultVariants: {
          size: 'sm',
        },
      })
      expect(variantFn()).toEqual({ root: 'h-8', icon: 'w-4' })
    })

    it('should override default variants with provided props', () => {
      const variantFn = scv({
        slots: ['root'],
        variants: {
          color: {
            primary: { root: 'bg-blue-500' },
            secondary: { root: 'bg-gray-500' },
          },
        },
        defaultVariants: {
          color: 'primary',
        },
      })
      expect(variantFn({ color: 'secondary' })).toEqual({ root: 'bg-gray-500' })
    })

    it('should apply multiple default variants', () => {
      const variantFn = scv({
        slots: ['root', 'icon'],
        variants: {
          color: {
            primary: { root: 'bg-blue-500' },
            secondary: { root: 'bg-gray-500' },
          },
          size: {
            sm: { icon: 'w-4' },
            lg: { icon: 'w-6' },
          },
        },
        defaultVariants: {
          color: 'primary',
          size: 'sm',
        },
      })
      expect(variantFn()).toEqual({ root: 'bg-blue-500', icon: 'w-4' })
      expect(variantFn({ color: 'secondary' })).toEqual({ root: 'bg-gray-500', icon: 'w-4' })
      expect(variantFn({ size: 'lg' })).toEqual({ root: 'bg-blue-500', icon: 'w-6' })
    })

    it('should revert to default when variant prop is undefined', () => {
      const variantFn = scv({
        slots: ['root'],
        variants: {
          color: {
            primary: { root: 'bg-blue-500' },
            secondary: { root: 'bg-gray-500' },
          },
        },
        defaultVariants: {
          color: 'primary',
        },
      })
      expect(variantFn({ color: undefined })).toEqual({ root: 'bg-blue-500' })
    })
  })

  describe('Boolean Variants', () => {
    it('should handle boolean true variant', () => {
      const variantFn = scv({
        slots: ['root', 'icon'],
        variants: {
          disabled: {
            true: { root: 'opacity-50 cursor-not-allowed', icon: 'opacity-50' },
            false: { root: 'cursor-pointer' },
          },
        },
      })
      expect(variantFn({ disabled: true })).toEqual({
        root: 'opacity-50 cursor-not-allowed',
        icon: 'opacity-50',
      })
    })

    it('should handle boolean false variant', () => {
      const variantFn = scv({
        slots: ['root'],
        variants: {
          disabled: {
            true: { root: 'opacity-50' },
            false: { root: 'cursor-pointer' },
          },
        },
      })
      expect(variantFn({ disabled: false })).toEqual({ root: 'cursor-pointer' })
    })

    it('should handle multiple boolean variants', () => {
      const variantFn = scv({
        slots: ['root'],
        variants: {
          disabled: {
            true: { root: 'opacity-50' },
          },
          loading: {
            true: { root: 'animate-spin' },
          },
        },
      })
      expect(variantFn({ disabled: true, loading: true })).toEqual({ root: 'opacity-50 animate-spin' })
    })
  })

  describe('Compound Variants', () => {
    it('should apply compound variant when all conditions match', () => {
      const variantFn = scv({
        slots: ['root', 'icon'],
        variants: {
          color: {
            primary: { root: 'bg-blue-500' },
            secondary: { root: 'bg-gray-500' },
          },
          size: {
            sm: { icon: 'w-4' },
            lg: { icon: 'w-6' },
          },
        },
        compoundVariants: [
          {
            color: 'primary',
            size: 'lg',
            classNames: {
              root: 'font-bold shadow-lg',
              icon: 'shadow-sm',
            },
          },
        ],
      })
      expect(variantFn({ color: 'primary', size: 'lg' })).toEqual({
        root: 'bg-blue-500 font-bold shadow-lg',
        icon: 'w-6 shadow-sm',
      })
    })

    it('should not apply compound variant when conditions do not match', () => {
      const variantFn = scv({
        slots: ['root'],
        variants: {
          color: {
            primary: { root: 'bg-blue-500' },
            secondary: { root: 'bg-gray-500' },
          },
          size: {
            sm: { root: 'h-8' },
            lg: { root: 'h-12' },
          },
        },
        compoundVariants: [
          {
            color: 'primary',
            size: 'lg',
            classNames: { root: 'font-bold' },
          },
        ],
      })
      expect(variantFn({ color: 'primary', size: 'sm' })).toEqual({ root: 'bg-blue-500 h-8' })
      expect(variantFn({ color: 'secondary', size: 'lg' })).toEqual({ root: 'bg-gray-500 h-12' })
    })

    it('should apply multiple compound variants when conditions match', () => {
      const variantFn = scv({
        slots: ['root'],
        variants: {
          color: {
            primary: { root: 'bg-blue-500' },
            danger: { root: 'bg-red-500' },
          },
          size: {
            sm: { root: 'h-8' },
            lg: { root: 'h-12' },
          },
        },
        compoundVariants: [
          {
            color: 'primary',
            size: 'lg',
            classNames: { root: 'shadow-blue' },
          },
          {
            color: 'danger',
            size: 'lg',
            classNames: { root: 'shadow-red' },
          },
        ],
      })
      expect(variantFn({ color: 'danger', size: 'lg' })).toEqual({ root: 'bg-red-500 h-12 shadow-red' })
    })

    it('should handle compound variant with array selectors', () => {
      const variantFn = scv({
        slots: ['root', 'icon'],
        variants: {
          color: {
            primary: { root: 'bg-blue-500' },
            secondary: { root: 'bg-gray-500' },
            danger: { root: 'bg-red-500' },
          },
          size: {
            sm: { icon: 'w-4' },
            lg: { icon: 'w-6' },
          },
        },
        compoundVariants: [
          {
            color: ['primary', 'danger'],
            size: 'lg',
            classNames: {
              root: 'font-bold',
              icon: 'font-bold',
            },
          },
        ],
      })
      expect(variantFn({ color: 'primary', size: 'lg' })).toEqual({
        root: 'bg-blue-500 font-bold',
        icon: 'w-6 font-bold',
      })
      expect(variantFn({ color: 'danger', size: 'lg' })).toEqual({
        root: 'bg-red-500 font-bold',
        icon: 'w-6 font-bold',
      })
      expect(variantFn({ color: 'secondary', size: 'lg' })).toEqual({
        root: 'bg-gray-500',
        icon: 'w-6',
      })
    })

    it('should handle compound variant with partial slots', () => {
      const variantFn = scv({
        slots: ['root', 'icon', 'label'],
        variants: {
          color: {
            primary: { root: 'bg-blue-500' },
          },
          size: {
            lg: { root: 'h-12' },
          },
        },
        compoundVariants: [
          {
            color: 'primary',
            size: 'lg',
            classNames: {
              root: 'shadow-xl',
              // Only root, not icon or label
            },
          },
        ],
      })
      expect(variantFn({ color: 'primary', size: 'lg' })).toEqual({
        root: 'bg-blue-500 h-12 shadow-xl',
        icon: '',
        label: '',
      })
    })

    it('should handle compound variant with boolean variants', () => {
      const variantFn = scv({
        slots: ['root', 'icon'],
        variants: {
          color: {
            primary: { root: 'bg-blue-500' },
          },
          disabled: {
            true: { root: 'opacity-50' },
            false: { root: 'opacity-100' },
          },
        },
        compoundVariants: [
          {
            color: 'primary',
            disabled: true,
            classNames: {
              root: 'cursor-not-allowed',
              icon: 'hidden',
            },
          },
        ],
      })
      expect(variantFn({ color: 'primary', disabled: true })).toEqual({
        root: 'bg-blue-500 opacity-50 cursor-not-allowed',
        icon: 'hidden',
      })
    })

    it('should handle compound variant classNames as arrays', () => {
      const variantFn = scv({
        slots: ['root'],
        variants: {
          color: {
            primary: { root: 'bg-blue-500' },
          },
          size: {
            lg: { root: 'h-12' },
          },
        },
        compoundVariants: [
          {
            color: 'primary',
            size: 'lg',
            classNames: {
              root: ['font-bold', 'shadow-lg'],
            },
          },
        ],
      })
      expect(variantFn({ color: 'primary', size: 'lg' })).toEqual({ root: 'bg-blue-500 h-12 font-bold shadow-lg' })
    })

    it('should apply multiple overlapping compound variants', () => {
      const variantFn = scv({
        slots: ['root'],
        variants: {
          color: {
            primary: { root: 'bg-blue-500' },
          },
          size: {
            lg: { root: 'h-12' },
          },
        },
        compoundVariants: [
          {
            color: 'primary' as const,
            classNames: { root: 'border-blue' },
          },
          {
            size: 'lg' as const,
            classNames: { root: 'p-4' },
          },
          {
            color: 'primary' as const,
            size: 'lg' as const,
            classNames: { root: 'shadow-xl' },
          },
        ],
      })
      expect(variantFn({ color: 'primary', size: 'lg' })).toEqual({
        root: 'bg-blue-500 h-12 border-blue p-4 shadow-xl',
      })
    })
  })

  describe('classNames Override', () => {
    it('should append classNames prop to result', () => {
      const variantFn = scv({
        slots: ['root', 'icon'],
        base: {
          root: 'btn',
          icon: 'icon',
        },
      })
      expect(variantFn({ classNames: { root: 'custom', icon: 'custom-icon' } })).toEqual({
        root: 'btn custom',
        icon: 'icon custom-icon',
      })
    })

    it('should append classNames with variants', () => {
      const variantFn = scv({
        slots: ['root'],
        base: { root: 'btn' },
        variants: {
          color: {
            primary: { root: 'bg-blue-500' },
          },
        },
      })
      expect(variantFn({ color: 'primary', classNames: { root: 'custom' } })).toEqual({
        root: 'btn bg-blue-500 custom',
      })
    })

    it('should handle classNames as arrays', () => {
      const variantFn = scv({
        slots: ['root'],
        base: { root: 'btn' },
      })
      expect(variantFn({ classNames: { root: ['custom-1', 'custom-2'] } })).toEqual({
        root: 'btn custom-1 custom-2',
      })
    })

    it('should handle classNames as objects', () => {
      const variantFn = scv({
        slots: ['root'],
        base: { root: 'btn' },
      })
      expect(variantFn({ classNames: { root: { 'custom-1': true, 'custom-2': false } } })).toEqual({
        root: 'btn custom-1',
      })
    })

    it('should handle partial classNames (not all slots)', () => {
      const variantFn = scv({
        slots: ['root', 'icon', 'label'],
        base: {
          root: 'btn',
          icon: 'icon',
          label: 'label',
        },
      })
      expect(variantFn({ classNames: { root: 'custom', label: 'custom-label' } })).toEqual({
        root: 'btn custom',
        icon: 'icon',
        label: 'label custom-label',
      })
    })
  })

  describe('Custom classNameResolver', () => {
    it('should use custom classNameResolver', () => {
      const customResolver = vi.fn((...args) => cx(...args))
      const variantFn = scv({
        slots: ['root'],
        base: { root: 'btn' },
        classNameResolver: customResolver,
      })
      variantFn()
      expect(customResolver).toHaveBeenCalled()
    })

    it('should pass correct arguments to custom classNameResolver', () => {
      const customResolver = vi.fn((...args) => cx(...args))
      const variantFn = scv({
        slots: ['root', 'icon'],
        base: { root: 'btn', icon: 'icon' },
        variants: {
          color: {
            primary: { root: 'bg-blue-500' },
          },
        },
        classNameResolver: customResolver,
      })
      variantFn({ color: 'primary', classNames: { root: 'custom' } })
      // Should be called for each slot
      expect(customResolver).toHaveBeenCalledTimes(2)
    })

    it('should allow custom merging logic', () => {
      const customResolver: typeof cx = (...args) => {
        return `custom-${cx(...args)}`
      }
      const variantFn = scv({
        slots: ['root'],
        base: { root: 'btn' },
        variants: {
          color: {
            primary: { root: 'bg-blue-500' },
          },
        },
        classNameResolver: customResolver,
      })
      expect(variantFn({ color: 'primary' })).toEqual({
        root: 'custom-btn bg-blue-500',
      })
    })

    it('should use custom resolver when no variants defined', () => {
      const customResolver = vi.fn((...args) => cx(...args))
      const variantFn = scv({
        slots: ['root'],
        base: { root: 'btn' },
        classNameResolver: customResolver,
      })
      variantFn({ classNames: { root: 'custom' } })
      expect(customResolver).toHaveBeenCalled()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty variants object', () => {
      const variantFn = scv({
        slots: ['root'],
        base: { root: 'btn' },
        variants: {},
      })
      expect(variantFn()).toEqual({ root: 'btn' })
    })

    it('should handle variant with empty value object', () => {
      const variantFn = scv({
        slots: ['root'],
        variants: {
          color: {},
        },
      })
      // @ts-expect-error - Testing runtime behavior
      expect(variantFn({ color: 'primary' })).toEqual({ root: '' })
    })

    it('should handle compound variants with empty array selectors', () => {
      const variantFn = scv({
        slots: ['root'],
        variants: {
          color: {
            primary: { root: 'bg-blue-500' },
          },
        },
        compoundVariants: [
          {
            color: [],
            classNames: { root: 'should-not-match' },
          },
        ],
      })
      expect(variantFn({ color: 'primary' })).toEqual({ root: 'bg-blue-500' })
    })

    it('should handle undefined config properties gracefully', () => {
      const variantFn = scv({
        slots: ['root'],
        base: undefined,
        variants: undefined,
        defaultVariants: undefined,
        compoundVariants: undefined,
      })
      expect(variantFn()).toEqual({ root: '' })
    })

    it('should not mutate input props', () => {
      const variantFn = scv({
        slots: ['root'],
        variants: {
          color: {
            primary: { root: 'bg-blue-500' },
          },
        },
      })
      const props = { color: 'primary' as const }
      variantFn(props)
      expect(props).toEqual({ color: 'primary' })
    })

    it('should handle classNames for non-existent slots gracefully', () => {
      const variantFn = scv({
        slots: ['root'],
        base: { root: 'btn' },
      })
      // @ts-expect-error - Testing runtime with invalid slot
      expect(variantFn({ classNames: { nonExistent: 'custom' } })).toEqual({ root: 'btn' })
    })

    it('should handle very long class strings', () => {
      const longClass = 'a '.repeat(100).trim()
      const variantFn = scv({
        slots: ['root'],
        base: { root: longClass },
      })
      expect(variantFn()).toEqual({ root: longClass })
    })

    it('should handle special characters in class names', () => {
      const variantFn = scv({
        slots: ['root'],
        base: { root: 'btn-primary_active hover:bg-blue-500 [&>svg]:w-4' },
      })
      expect(variantFn()).toEqual({ root: 'btn-primary_active hover:bg-blue-500 [&>svg]:w-4' })
    })

    it('should handle unicode characters in class names', () => {
      const variantFn = scv({
        slots: ['root'],
        base: { root: 'btn-🚀' },
        variants: {
          theme: {
            emoji: { root: '✨-theme' },
          },
        },
      })
      expect(variantFn({ theme: 'emoji' })).toEqual({ root: 'btn-🚀 ✨-theme' })
    })
  })

  describe('Real-world Component Examples', () => {
    it('should work for button component with icon', () => {
      const button = scv({
        slots: ['root', 'icon', 'label'],
        base: {
          root: 'inline-flex items-center justify-center rounded-md font-medium',
          icon: 'flex-shrink-0',
          label: 'flex-1',
        },
        variants: {
          variant: {
            default: { root: 'bg-primary text-primary-foreground' },
            destructive: { root: 'bg-destructive text-destructive-foreground' },
            outline: { root: 'border border-input' },
          },
          size: {
            default: { root: 'h-10 px-4 py-2', icon: 'w-4 h-4', label: 'text-sm' },
            sm: { root: 'h-9 px-3', icon: 'w-3 h-3', label: 'text-xs' },
            lg: { root: 'h-11 px-8', icon: 'w-5 h-5', label: 'text-base' },
          },
        },
        defaultVariants: {
          variant: 'default',
          size: 'default',
        },
      })

      expect(button()).toMatchObject({
        root: expect.stringContaining('bg-primary'),
      })
      expect(button({ variant: 'destructive', size: 'lg' })).toMatchObject({
        root: expect.stringContaining('bg-destructive'),
        icon: expect.stringContaining('w-5'),
      })
    })

    it('should work for card component with multiple slots', () => {
      const card = scv({
        slots: ['root', 'header', 'body', 'footer'],
        base: {
          root: 'rounded-lg border bg-card shadow-sm',
          header: 'p-6',
          body: 'p-6 pt-0',
          footer: 'p-6 pt-0',
        },
        variants: {
          variant: {
            default: { root: 'border-border' },
            elevated: { root: 'border-transparent shadow-md' },
          },
          padding: {
            none: { header: 'p-0', body: 'p-0', footer: 'p-0' },
            sm: { header: 'p-4', body: 'p-4 pt-0', footer: 'p-4 pt-0' },
            lg: { header: 'p-8', body: 'p-8 pt-0', footer: 'p-8 pt-0' },
          },
        },
        compoundVariants: [
          {
            variant: 'elevated',
            padding: 'lg',
            classNames: {
              root: 'shadow-lg',
            },
          },
        ],
        defaultVariants: {
          variant: 'default',
        },
      })

      expect(card()).toMatchObject({
        root: expect.stringContaining('rounded-lg'),
        header: expect.stringContaining('p-6'),
      })
      expect(card({ variant: 'elevated', padding: 'lg' })).toMatchObject({
        root: expect.stringContaining('shadow-lg'),
        header: expect.stringContaining('p-8'),
      })
    })

    it('should work for input component with label and helper text', () => {
      const input = scv({
        slots: ['root', 'label', 'input', 'helper'],
        base: {
          root: 'space-y-2',
          label: 'text-sm font-medium',
          input: 'flex h-10 w-full rounded-md border px-3 py-2',
          helper: 'text-xs',
        },
        variants: {
          variant: {
            default: {
              input: 'border-input bg-background',
              helper: 'text-muted-foreground',
            },
            filled: {
              input: 'border-transparent bg-muted',
              helper: 'text-muted-foreground',
            },
          },
          error: {
            true: {
              input: 'border-destructive',
              helper: 'text-destructive',
              label: 'text-destructive',
            },
            false: {},
          },
          disabled: {
            true: {
              input: 'cursor-not-allowed opacity-50',
              label: 'opacity-50',
            },
            false: {},
          },
        },
        defaultVariants: {
          variant: 'default',
          error: false,
          disabled: false,
        },
      })

      expect(input({ error: true })).toMatchObject({
        input: expect.stringContaining('border-destructive'),
        helper: expect.stringContaining('text-destructive'),
      })
      expect(input({ disabled: true })).toMatchObject({
        input: expect.stringContaining('opacity-50'),
      })
    })
  })
})
