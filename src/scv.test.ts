import { describe, it, expect, vi } from 'vitest'
import { scv, cx } from '.'

describe('scv', () => {
  it('should return empty class names when given empty config', () => {
    const variantFn = scv({ slots: ['root'] })
    expect(variantFn()).toEqual({ root: '' })
  })

  it('should apply base classes', () => {
    const variantFn = scv({
      slots: ['root', 'icon'],
      base: {
        root: 'base-root',
        icon: ['base-icon'],
      },
    })
    expect(variantFn()).toEqual({
      root: 'base-root',
      icon: 'base-icon',
    })
  })

  it('should apply variants', () => {
    const variantFn = scv({
      slots: ['root', 'icon'],
      base: { root: 'base', icon: [] },
      variants: {
        size: {
          sm: { root: 'size-sm', icon: 'icon-sm' },
          lg: { root: 'size-lg' },
        },
        color: {
          red: { root: 'color-red' },
          blue: { root: 'color-blue' },
        },
        isLoading: {
          true: {
            root: 'loading',
          },
        },
      },
    })
    expect(variantFn({ size: 'sm', color: 'red' })).toEqual({
      root: 'base size-sm color-red',
      icon: 'icon-sm',
    })
    expect(variantFn({ size: 'sm', isLoading: true })).toEqual({
      root: 'base size-sm loading',
      icon: 'icon-sm',
    })
    expect(variantFn({ size: 'sm', isLoading: undefined })).toEqual({
      root: 'base size-sm',
      icon: 'icon-sm',
    })
    expect(variantFn({ size: 'sm', isLoading: false })).toEqual({
      root: 'base size-sm',
      icon: 'icon-sm',
    })
  })

  it('should apply compound variants', () => {
    const variantFn = scv({
      slots: ['root'],
      variants: {
        size: {
          sm: { root: 'size-sm' },
          lg: { root: 'size-lg' },
        },
        color: {
          red: { root: 'color-red' },
          blue: { root: 'color-blue' },
        },
      },
      compoundVariants: [
        {
          size: 'sm',
          color: 'red',
          classNames: { root: 'small-red' },
        },
      ],
    })
    expect(variantFn({ size: 'sm', color: 'red' })).toEqual({
      root: 'size-sm color-red small-red',
    })
  })

  it('should apply compound variants with multiple variant values', () => {
    const variantFn = scv({
      slots: ['root'],
      variants: {
        size: {
          sm: { root: 'size-sm' },
          md: { root: 'size-md' },
          lg: { root: 'size-lg' },
        },
        color: {
          red: { root: 'color-red' },
          blue: { root: 'color-blue' },
        },
      },
      compoundVariants: [
        {
          size: ['sm', 'lg'],
          color: 'blue',
          classNames: { root: 'special-blue' },
        },
      ],
    })
    expect(variantFn({ size: 'md' })).toEqual({
      root: 'size-md',
    })
    expect(variantFn({ size: 'lg', color: 'blue' })).toEqual({
      root: 'size-lg color-blue special-blue',
    })
  })

  it('should apply default variants', () => {
    const variantFn = scv({
      slots: ['root'],
      variants: {
        size: {
          sm: { root: 'size-sm' },
          lg: { root: 'size-lg' },
        },
      },
      defaultVariants: {
        size: 'sm',
      },
    })
    expect(variantFn()).toEqual({
      root: 'size-sm',
    })
    expect(variantFn({ size: undefined })).toEqual({
      root: 'size-sm',
    })
    expect(variantFn({ size: 'lg' })).toEqual({
      root: 'size-lg',
    })
  })

  it('should merge provided classNames with generated ones', () => {
    const config = {
      slots: ['root'],
      base: { root: 'base' },
    }
    expect(
      scv(config)({
        classNames: { root: 'custom' },
      })
    ).toEqual({
      root: 'base custom',
    })

    expect(
      scv({ ...config, variants: {} })({
        classNames: { root: 'custom' },
      })
    ).toEqual({
      root: 'base custom',
    })
  })

  it('should allow custom class name resolver', () => {
    const classNameResolver = vi.fn(cx)
    const variantFn = scv({
      slots: ['root'],
      base: { root: 'base' },
      classNameResolver,
    })
    expect(variantFn()).toEqual({
      root: 'base',
    })
    expect(classNameResolver).toHaveBeenCalled()
  })
})
