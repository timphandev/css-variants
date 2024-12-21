import { describe, it, expect } from 'vitest'
import { ssv } from '.'

describe('ssv', () => {
  it('should return empty styles for all slots when no config provided', () => {
    const styleVariant = ssv({ slots: ['root', 'icon'] })
    expect(styleVariant()).toEqual({
      root: {},
      icon: {},
    })
  })

  it('should apply base styles', () => {
    const styleVariant = ssv({
      slots: ['root', 'icon'],
      base: {
        root: { padding: '8px' },
        icon: { color: 'red' },
      },
    })

    expect(styleVariant()).toEqual({
      root: { padding: '8px' },
      icon: { color: 'red' },
    })
  })

  it('should apply variant styles', () => {
    const styleVariant = ssv({
      slots: ['root', 'icon'],
      variants: {
        size: {
          small: {
            root: { padding: '4px' },
            icon: { color: 'blue' },
          },
        },
      },
    })

    expect(styleVariant({ size: 'small' })).toEqual({
      root: { padding: '4px' },
      icon: { color: 'blue' },
    })
  })

  it('should merge base and variant styles', () => {
    const styleVariant = ssv({
      slots: ['root'],
      base: {
        root: { color: 'black' },
      },
      variants: {
        size: {
          small: {
            root: { padding: '4px' },
          },
        },
      },
    })

    expect(styleVariant({ size: 'small' })).toEqual({
      root: {
        color: 'black',
        padding: '4px',
      },
    })
  })

  it('should apply compound variants', () => {
    const styleVariant = ssv({
      slots: ['root'],
      variants: {
        size: {
          small: { root: { padding: '4px' } },
        },
        color: {
          red: { root: { color: 'red' } },
        },
      },
      compoundVariants: [
        {
          size: 'small',
          color: 'red',
          styles: {
            root: { border: '1px solid red' },
          },
        },
      ],
    })

    expect(styleVariant({ size: 'small', color: 'red' })).toEqual({
      root: {
        padding: '4px',
        color: 'red',
        border: '1px solid red',
      },
    })
  })

  it('should apply compound variants with multiple variant values', () => {
    const styleVariant = ssv({
      slots: ['root'],
      variants: {
        size: {
          small: { root: { padding: '4px' } },
          medium: { root: { padding: '6px' } },
          large: { root: { padding: '8px' } },
        },
        color: {
          red: { root: { color: 'red' } },
          blue: { root: { color: 'blue' } },
        },
      },
      compoundVariants: [
        {
          size: ['small', 'large'],
          color: 'red',
          styles: {
            root: { border: '2px dashed red' },
          },
        },
      ],
    })

    expect(styleVariant({ size: 'medium', color: 'red' })).toEqual({
      root: {
        padding: '6px',
        color: 'red',
      },
    })
    expect(styleVariant({ size: 'small', color: 'red' })).toEqual({
      root: {
        padding: '4px',
        color: 'red',
        border: '2px dashed red',
      },
    })
  })

  it('should apply default variants', () => {
    const styleVariant = ssv({
      slots: ['root'],
      variants: {
        size: {
          small: { root: { padding: '4px' } },
        },
      },
      defaultVariants: {
        size: 'small',
      },
    })

    expect(styleVariant()).toEqual({
      root: { padding: '4px' },
    })
  })

  it('should allow overriding styles via props', () => {
    const styleVariant = ssv({
      slots: ['root'],
      base: {
        root: { padding: '8px' },
      },
    })

    expect(
      styleVariant({
        styles: {
          root: { padding: '12px' },
        },
      })
    ).toEqual({
      root: { padding: '12px' },
    })
  })
})
