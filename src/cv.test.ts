import { describe, it, expect, vi } from 'vitest'
import { cv, cx } from '.'

describe('cv', () => {
  it('should return base class when no props are provided', () => {
    const variantFn = cv({ base: 'base-class' })
    expect(variantFn()).toBe('base-class')
  })

  it('should return base class and variant class when variant prop is provided', () => {
    const variantFn = cv({
      base: 'base-class',
      variants: {
        size: {
          small: 'small-class',
          large: 'large-class',
        },
      },
    })
    expect(variantFn({ size: 'small' })).toBe('base-class small-class')
  })

  it('should return base class and default variant class when no variant prop is provided', () => {
    const variantFn = cv({
      base: 'base-class',
      variants: {
        size: {
          small: 'small-class',
          large: 'large-class',
        },
      },
      defaultVariants: {
        size: 'large',
      },
    })
    expect(variantFn()).toBe('base-class large-class')
    expect(variantFn({ size: 'small' })).toBe('base-class small-class')
    expect(variantFn({ size: undefined })).toBe('base-class large-class')
  })

  it('should return base class, variant class, and compound variant class when all props match', () => {
    const variantFn = cv({
      base: 'base-class',
      variants: {
        size: {
          small: 'small-class',
          large: 'large-class',
        },
        color: {
          red: 'red-class',
          blue: 'blue-class',
        },
        isLoading: {
          true: 'loading',
        },
      },
      compoundVariants: [{ size: 'small', color: 'red', className: 'small-red-class' }],
    })
    expect(variantFn({ size: 'small', color: 'red' })).toBe('base-class small-class red-class small-red-class')
    expect(variantFn({ size: 'small', isLoading: true })).toBe('base-class small-class loading')
  })

  it('should return base class, variant class, and compound variant class when variant values are arrays', () => {
    const variantFn = cv({
      base: 'base-class',
      variants: {
        size: {
          small: 'small-class',
          medium: 'medium-class',
          large: 'large-class',
        },
        color: {
          red: 'red-class',
          blue: 'blue-class',
        },
        isLoading: {
          true: 'loading',
        },
      },
      compoundVariants: [{ size: ['small', 'large'], color: 'red', className: 'with-red-class' }],
    })
    expect(variantFn({ size: 'medium' })).toBe('base-class medium-class')
    expect(variantFn({ size: 'small', color: 'red' })).toBe('base-class small-class red-class with-red-class')
    expect(variantFn({ size: 'large', color: 'red' })).toBe('base-class large-class red-class with-red-class')
  })

  it('should return base class and className prop when provided', () => {
    const variantFn = cv({ base: 'base-class' })
    expect(variantFn({ className: 'custom-class' })).toBe('base-class custom-class')
  })

  it('should return only className prop when no base or variants are provided', () => {
    const variantFn = cv({})
    expect(variantFn({ className: 'custom-class' })).toBe('custom-class')
  })

  it('should allow custom class name resolver', () => {
    const classNameResolver = vi.fn(cx)
    const variantFn = cv({
      base: 'base-class',
      classNameResolver,
    })
    expect(variantFn()).toBe('base-class')
    expect(classNameResolver).toHaveBeenCalled()
  })
})
