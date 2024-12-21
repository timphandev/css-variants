import { describe, it, expect } from 'vitest'
import { sv } from './sv'

describe('sv function', () => {
  it('should return base styles if no props are provided', () => {
    const baseStyle = { color: 'red' }
    const styleVariant = sv({ base: baseStyle })
    expect(styleVariant()).toEqual(baseStyle)
    expect(styleVariant({ style: { fontSize: '20px' } })).toEqual({ ...baseStyle, fontSize: '20px' })
  })

  it('should apply variant styles based on props', () => {
    const styleVariant = sv({
      variants: {
        size: {
          small: { fontSize: '12px' },
          large: { fontSize: '24px' },
        },
      },
    })
    expect(styleVariant({ size: 'small' })).toEqual({ fontSize: '12px' })
    expect(styleVariant({ size: 'large' })).toEqual({ fontSize: '24px' })
  })

  it('should apply compound variant styles', () => {
    const styleVariant = sv({
      variants: {
        size: {
          small: { fontSize: '12px' },
          large: { fontSize: '24px' },
        },
        color: {
          red: { color: 'red' },
          blue: { color: 'blue' },
        },
      },
      compoundVariants: [
        { size: 'small', color: 'red', style: { margin: '10px' } },
        { size: 'large', color: 'blue', style: { margin: '20px' } },
      ],
    })
    expect(styleVariant({ size: 'small', color: 'red' })).toEqual({ fontSize: '12px', color: 'red', margin: '10px' })
    expect(styleVariant({ size: 'large', color: 'blue' })).toEqual({ fontSize: '24px', color: 'blue', margin: '20px' })
  })

  it('should apply compound variant styles with multiple variant values', () => {
    const styleVariant = sv({
      variants: {
        size: {
          small: { fontSize: '12px' },
          medium: { fontSize: '16px' },
          large: { fontSize: '24px' },
        },
        color: {
          red: { color: 'red' },
          blue: { color: 'blue' },
        },
      },
      compoundVariants: [
        {
          size: ['small', 'medium'],
          color: 'red',
          style: { padding: '5px' },
        },
      ],
    })
    expect(styleVariant({ size: 'small', color: 'red' })).toEqual({ fontSize: '12px', color: 'red', padding: '5px' })
    expect(styleVariant({ size: 'medium', color: 'red' })).toEqual({ fontSize: '16px', color: 'red', padding: '5px' })
  })

  it('should apply default variants if no props are provided', () => {
    const styleVariant = sv({
      variants: {
        size: {
          small: { fontSize: '12px' },
          large: { fontSize: '24px' },
        },
      },
      defaultVariants: { size: 'small' },
    })
    expect(styleVariant()).toEqual({ fontSize: '12px' })
    expect(styleVariant({ size: undefined })).toEqual({ fontSize: '12px' })
    expect(styleVariant({ size: 'large' })).toEqual({ fontSize: '24px' })
  })

  it('should merge style prop with other styles', () => {
    const styleVariant = sv({
      base: { color: 'red' },
      variants: {
        size: {
          small: { fontSize: '12px' },
        },
      },
    })
    expect(styleVariant({ size: 'small', style: { margin: '10px' } })).toEqual({
      color: 'red',
      fontSize: '12px',
      margin: '10px',
    })
  })
})
