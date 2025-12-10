import { describe, it, expect } from 'vitest'
import { sv } from './sv'

describe('sv - Comprehensive Test Suite', () => {
  describe('Base Functionality', () => {
    it('should return empty object when no config provided', () => {
      const variantFn = sv({})
      expect(variantFn()).toEqual({})
    })

    it('should return base styles', () => {
      const variantFn = sv({
        base: { color: 'red', fontSize: '14px' },
      })
      expect(variantFn()).toEqual({ color: 'red', fontSize: '14px' })
    })

    it('should handle base with single property', () => {
      const variantFn = sv({
        base: { color: 'blue' },
      })
      expect(variantFn()).toEqual({ color: 'blue' })
    })

    it('should handle base with many properties', () => {
      const variantFn = sv({
        base: {
          color: 'red',
          fontSize: '14px',
          fontWeight: 'bold',
          padding: '10px',
          margin: '5px',
          border: '1px solid black',
        },
      })
      expect(variantFn()).toEqual({
        color: 'red',
        fontSize: '14px',
        fontWeight: 'bold',
        padding: '10px',
        margin: '5px',
        border: '1px solid black',
      })
    })

    it('should handle base with numeric values', () => {
      const variantFn = sv({
        base: {
          width: 100,
          height: 200,
          opacity: 0.5,
          zIndex: 10,
        },
      })
      expect(variantFn()).toEqual({
        width: 100,
        height: 200,
        opacity: 0.5,
        zIndex: 10,
      })
    })
  })

  describe('Variants - Single Variant', () => {
    it('should apply single variant', () => {
      const variantFn = sv({
        base: { color: 'black' },
        variants: {
          size: {
            small: { fontSize: '12px' },
            large: { fontSize: '24px' },
          },
        },
      })
      expect(variantFn({ size: 'small' })).toEqual({ color: 'black', fontSize: '12px' })
      expect(variantFn({ size: 'large' })).toEqual({ color: 'black', fontSize: '24px' })
    })

    it('should apply variant without base', () => {
      const variantFn = sv({
        variants: {
          color: {
            primary: { color: 'blue', backgroundColor: 'lightblue' },
            secondary: { color: 'gray', backgroundColor: 'lightgray' },
          },
        },
      })
      expect(variantFn({ color: 'primary' })).toEqual({ color: 'blue', backgroundColor: 'lightblue' })
      expect(variantFn({ color: 'secondary' })).toEqual({ color: 'gray', backgroundColor: 'lightgray' })
    })

    it('should ignore undefined variant value', () => {
      const variantFn = sv({
        base: { color: 'black' },
        variants: {
          size: {
            small: { fontSize: '12px' },
          },
        },
      })
      expect(variantFn({ size: undefined })).toEqual({ color: 'black' })
    })

    it('should ignore non-existent variant value', () => {
      const variantFn = sv({
        base: { color: 'black' },
        variants: {
          size: {
            small: { fontSize: '12px' },
          },
        },
      })
      // @ts-expect-error - Testing runtime behavior
      expect(variantFn({ size: 'extra-large' })).toEqual({ color: 'black' })
    })

    it('should override base properties with variant properties', () => {
      const variantFn = sv({
        base: { color: 'black', fontSize: '16px' },
        variants: {
          theme: {
            dark: { color: 'white', backgroundColor: 'black' },
          },
        },
      })
      expect(variantFn({ theme: 'dark' })).toEqual({
        color: 'white',
        fontSize: '16px',
        backgroundColor: 'black',
      })
    })
  })

  describe('Variants - Multiple Variants', () => {
    it('should combine multiple variants', () => {
      const variantFn = sv({
        base: { display: 'flex' },
        variants: {
          size: {
            small: { fontSize: '12px', padding: '4px' },
            large: { fontSize: '24px', padding: '8px' },
          },
          color: {
            primary: { color: 'blue' },
            secondary: { color: 'gray' },
          },
        },
      })
      expect(variantFn({ size: 'small', color: 'primary' })).toEqual({
        display: 'flex',
        fontSize: '12px',
        padding: '4px',
        color: 'blue',
      })
      expect(variantFn({ size: 'large', color: 'secondary' })).toEqual({
        display: 'flex',
        fontSize: '24px',
        padding: '8px',
        color: 'gray',
      })
    })

    it('should handle partial variant props', () => {
      const variantFn = sv({
        variants: {
          size: {
            small: { fontSize: '12px' },
          },
          color: {
            primary: { color: 'blue' },
          },
        },
      })
      expect(variantFn({ size: 'small' })).toEqual({ fontSize: '12px' })
      expect(variantFn({ color: 'primary' })).toEqual({ color: 'blue' })
    })

    it('should handle overlapping variant properties (later wins)', () => {
      const variantFn = sv({
        variants: {
          size: {
            large: { fontSize: '24px', padding: '10px' },
          },
          spacing: {
            compact: { padding: '5px' },
          },
        },
      })
      // spacing variant is processed after size variant, so it wins
      const result = variantFn({ size: 'large', spacing: 'compact' })
      expect(result).toEqual({ fontSize: '24px', padding: '5px' })
    })
  })

  describe('Default Variants', () => {
    it('should apply default variants when no props provided', () => {
      const variantFn = sv({
        variants: {
          size: {
            small: { fontSize: '12px' },
            large: { fontSize: '24px' },
          },
        },
        defaultVariants: {
          size: 'small',
        },
      })
      expect(variantFn()).toEqual({ fontSize: '12px' })
    })

    it('should override default variants with provided props', () => {
      const variantFn = sv({
        variants: {
          size: {
            small: { fontSize: '12px' },
            large: { fontSize: '24px' },
          },
        },
        defaultVariants: {
          size: 'small',
        },
      })
      expect(variantFn({ size: 'large' })).toEqual({ fontSize: '24px' })
    })

    it('should apply multiple default variants', () => {
      const variantFn = sv({
        variants: {
          size: {
            small: { fontSize: '12px' },
            large: { fontSize: '24px' },
          },
          color: {
            primary: { color: 'blue' },
            secondary: { color: 'gray' },
          },
        },
        defaultVariants: {
          size: 'small',
          color: 'primary',
        },
      })
      expect(variantFn()).toEqual({ fontSize: '12px', color: 'blue' })
      expect(variantFn({ size: 'large' })).toEqual({ fontSize: '24px', color: 'blue' })
      expect(variantFn({ color: 'secondary' })).toEqual({ fontSize: '12px', color: 'gray' })
    })

    it('should revert to default when variant prop is undefined', () => {
      const variantFn = sv({
        variants: {
          size: {
            small: { fontSize: '12px' },
            large: { fontSize: '24px' },
          },
        },
        defaultVariants: {
          size: 'small',
        },
      })
      expect(variantFn({ size: undefined })).toEqual({ fontSize: '12px' })
    })

    it('should combine base with default variants', () => {
      const variantFn = sv({
        base: { color: 'black' },
        variants: {
          size: {
            small: { fontSize: '12px' },
            large: { fontSize: '24px' },
          },
        },
        defaultVariants: {
          size: 'large',
        },
      })
      expect(variantFn()).toEqual({ color: 'black', fontSize: '24px' })
    })
  })

  describe('Boolean Variants', () => {
    it('should handle boolean true variant', () => {
      const variantFn = sv({
        variants: {
          disabled: {
            true: { opacity: 0.5, cursor: 'not-allowed' },
            false: { opacity: 1, cursor: 'pointer' },
          },
        },
      })
      expect(variantFn({ disabled: true })).toEqual({ opacity: 0.5, cursor: 'not-allowed' })
    })

    it('should handle boolean false variant', () => {
      const variantFn = sv({
        variants: {
          disabled: {
            true: { opacity: 0.5 },
            false: { opacity: 1 },
          },
        },
      })
      expect(variantFn({ disabled: false })).toEqual({ opacity: 1 })
    })

    it('should handle multiple boolean variants', () => {
      const variantFn = sv({
        variants: {
          disabled: {
            true: { opacity: 0.5 },
          },
          loading: {
            true: { cursor: 'wait' },
          },
        },
      })
      expect(variantFn({ disabled: true, loading: true })).toEqual({ opacity: 0.5, cursor: 'wait' })
    })

    it('should handle boolean variant with default', () => {
      const variantFn = sv({
        variants: {
          disabled: {
            true: { opacity: 0.5 },
            false: { opacity: 1 },
          },
        },
        defaultVariants: {
          disabled: false,
        },
      })
      expect(variantFn()).toEqual({ opacity: 1 })
      expect(variantFn({ disabled: true })).toEqual({ opacity: 0.5 })
    })
  })

  describe('Compound Variants', () => {
    it('should apply compound variant when all conditions match', () => {
      const variantFn = sv({
        variants: {
          size: {
            small: { fontSize: '12px' },
            large: { fontSize: '24px' },
          },
          color: {
            primary: { color: 'blue' },
            secondary: { color: 'gray' },
          },
        },
        compoundVariants: [
          {
            size: 'small',
            color: 'primary',
            style: { fontWeight: 'bold', textDecoration: 'underline' },
          },
        ],
      })
      expect(variantFn({ size: 'small', color: 'primary' })).toEqual({
        fontSize: '12px',
        color: 'blue',
        fontWeight: 'bold',
        textDecoration: 'underline',
      })
    })

    it('should not apply compound variant when conditions do not match', () => {
      const variantFn = sv({
        variants: {
          size: {
            small: { fontSize: '12px' },
            large: { fontSize: '24px' },
          },
          color: {
            primary: { color: 'blue' },
            secondary: { color: 'gray' },
          },
        },
        compoundVariants: [
          {
            size: 'small',
            color: 'primary',
            style: { fontWeight: 'bold' },
          },
        ],
      })
      expect(variantFn({ size: 'small', color: 'secondary' })).toEqual({ fontSize: '12px', color: 'gray' })
      expect(variantFn({ size: 'large', color: 'primary' })).toEqual({ fontSize: '24px', color: 'blue' })
    })

    it('should apply multiple compound variants when conditions match', () => {
      const variantFn = sv({
        variants: {
          size: {
            small: { fontSize: '12px' },
            large: { fontSize: '24px' },
          },
          color: {
            primary: { color: 'blue' },
            danger: { color: 'red' },
          },
        },
        compoundVariants: [
          {
            size: 'small',
            color: 'primary',
            style: { border: '1px solid blue' },
          },
          {
            size: 'small',
            color: 'danger',
            style: { border: '1px solid red' },
          },
        ],
      })
      expect(variantFn({ size: 'small', color: 'danger' })).toEqual({
        fontSize: '12px',
        color: 'red',
        border: '1px solid red',
      })
    })

    it('should handle compound variant with array selectors', () => {
      const variantFn = sv({
        variants: {
          size: {
            small: { fontSize: '12px' },
            medium: { fontSize: '16px' },
            large: { fontSize: '24px' },
          },
          color: {
            primary: { color: 'blue' },
            secondary: { color: 'gray' },
          },
        },
        compoundVariants: [
          {
            size: ['small', 'medium'],
            color: 'primary',
            style: { fontWeight: 'bold' },
          },
        ],
      })
      expect(variantFn({ size: 'small', color: 'primary' })).toEqual({
        fontSize: '12px',
        color: 'blue',
        fontWeight: 'bold',
      })
      expect(variantFn({ size: 'medium', color: 'primary' })).toEqual({
        fontSize: '16px',
        color: 'blue',
        fontWeight: 'bold',
      })
      expect(variantFn({ size: 'large', color: 'primary' })).toEqual({ fontSize: '24px', color: 'blue' })
    })

    it('should handle compound variant with multiple array selectors', () => {
      const variantFn = sv({
        variants: {
          size: {
            small: { fontSize: '12px' },
            medium: { fontSize: '16px' },
            large: { fontSize: '24px' },
          },
          color: {
            primary: { color: 'blue' },
            secondary: { color: 'gray' },
            danger: { color: 'red' },
          },
        },
        compoundVariants: [
          {
            size: ['small', 'medium'],
            color: ['primary', 'danger'],
            style: { fontWeight: 'bold' },
          },
        ],
      })
      expect(variantFn({ size: 'small', color: 'primary' })).toEqual({
        fontSize: '12px',
        color: 'blue',
        fontWeight: 'bold',
      })
      expect(variantFn({ size: 'medium', color: 'danger' })).toEqual({
        fontSize: '16px',
        color: 'red',
        fontWeight: 'bold',
      })
      expect(variantFn({ size: 'large', color: 'primary' })).toEqual({ fontSize: '24px', color: 'blue' })
    })

    it('should handle compound variant with default variants', () => {
      const variantFn = sv({
        variants: {
          size: {
            small: { fontSize: '12px' },
            large: { fontSize: '24px' },
          },
          color: {
            primary: { color: 'blue' },
            secondary: { color: 'gray' },
          },
        },
        defaultVariants: {
          size: 'small',
          color: 'primary',
        },
        compoundVariants: [
          {
            size: 'small',
            color: 'primary',
            style: { fontWeight: 'bold' },
          },
        ],
      })
      expect(variantFn()).toEqual({ fontSize: '12px', color: 'blue', fontWeight: 'bold' })
    })

    it('should handle compound variant with boolean variants', () => {
      const variantFn = sv({
        variants: {
          size: {
            large: { fontSize: '24px' },
          },
          disabled: {
            true: { opacity: 0.5 },
            false: { opacity: 1 },
          },
        },
        compoundVariants: [
          {
            size: 'large',
            disabled: true,
            style: { cursor: 'not-allowed' },
          },
        ],
      })
      expect(variantFn({ size: 'large', disabled: true })).toEqual({
        fontSize: '24px',
        opacity: 0.5,
        cursor: 'not-allowed',
      })
    })

    it('should override properties in order: base -> variants -> compounds', () => {
      const variantFn = sv({
        base: { fontSize: '10px' },
        variants: {
          size: {
            large: { fontSize: '20px' },
          },
        },
        compoundVariants: [
          {
            size: 'large',
            style: { fontSize: '30px' },
          },
        ],
      })
      expect(variantFn({ size: 'large' })).toEqual({ fontSize: '30px' })
    })

    it('should apply multiple overlapping compound variants', () => {
      const variantFn = sv({
        variants: {
          color: {
            primary: { color: 'blue' },
          },
          size: {
            large: { fontSize: '24px' },
          },
        },
        compoundVariants: [
          {
            color: 'primary' as const,
            style: { border: '1px solid blue' },
          },
          {
            size: 'large' as const,
            style: { padding: '10px' },
          },
          {
            color: 'primary' as const,
            size: 'large' as const,
            style: { boxShadow: '0 0 10px blue' },
          },
        ],
      })
      expect(variantFn({ color: 'primary', size: 'large' })).toEqual({
        color: 'blue',
        fontSize: '24px',
        border: '1px solid blue',
        padding: '10px',
        boxShadow: '0 0 10px blue',
      })
    })
  })

  describe('style Override', () => {
    it('should merge style prop with base', () => {
      const variantFn = sv({
        base: { color: 'black' },
      })
      expect(variantFn({ style: { fontSize: '20px' } })).toEqual({ color: 'black', fontSize: '20px' })
    })

    it('should merge style prop with variants', () => {
      const variantFn = sv({
        base: { color: 'black' },
        variants: {
          size: {
            small: { fontSize: '12px' },
          },
        },
      })
      expect(variantFn({ size: 'small', style: { padding: '10px' } })).toEqual({
        color: 'black',
        fontSize: '12px',
        padding: '10px',
      })
    })

    it('should override base and variant properties with style prop', () => {
      const variantFn = sv({
        base: { color: 'black', fontSize: '14px' },
        variants: {
          size: {
            small: { fontSize: '12px', padding: '5px' },
          },
        },
      })
      expect(variantFn({ size: 'small', style: { fontSize: '20px', margin: '10px' } })).toEqual({
        color: 'black',
        fontSize: '20px',
        padding: '5px',
        margin: '10px',
      })
    })

    it('should apply style in order: base -> variants -> compounds -> style prop', () => {
      const variantFn = sv({
        base: { fontSize: '10px', color: 'black' },
        variants: {
          size: {
            large: { fontSize: '20px' },
          },
        },
        compoundVariants: [
          {
            size: 'large',
            style: { fontSize: '30px' },
          },
        ],
      })
      expect(variantFn({ size: 'large', style: { fontSize: '40px' } })).toEqual({ fontSize: '40px', color: 'black' })
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty variants object', () => {
      const variantFn = sv({
        base: { color: 'black' },
        variants: {},
      })
      expect(variantFn()).toEqual({ color: 'black' })
    })

    it('should handle variant with empty value object', () => {
      const variantFn = sv({
        variants: {
          size: {},
        },
      })
      // @ts-expect-error - Testing runtime behavior
      expect(variantFn({ size: 'large' })).toEqual({})
    })

    it('should handle compound variants with empty array selectors', () => {
      const variantFn = sv({
        variants: {
          size: {
            large: { fontSize: '24px' },
          },
        },
        compoundVariants: [
          {
            size: [],
            style: { fontWeight: 'bold' },
          },
        ],
      })
      expect(variantFn({ size: 'large' })).toEqual({ fontSize: '24px' })
    })

    it('should handle undefined config properties gracefully', () => {
      const variantFn = sv({
        base: undefined,
        variants: undefined,
        defaultVariants: undefined,
        compoundVariants: undefined,
      })
      expect(variantFn()).toEqual({})
    })

    it('should not mutate input props', () => {
      const variantFn = sv({
        variants: {
          size: {
            small: { fontSize: '12px' },
          },
        },
      })
      const props = { size: 'small' as const }
      variantFn(props)
      expect(props).toEqual({ size: 'small' })
    })

    it('should not mutate base styles', () => {
      const baseStyles = { color: 'black', fontSize: '14px' }
      const variantFn = sv({
        base: baseStyles,
      })
      variantFn({ style: { color: 'red' } })
      expect(baseStyles).toEqual({ color: 'black', fontSize: '14px' })
    })

    it('should handle CSS custom properties', () => {
      const variantFn = sv({
        base: { '--primary-color': 'blue' },
        variants: {
          theme: {
            dark: { '--primary-color': 'lightblue' },
          },
        },
      })
      expect(variantFn({ theme: 'dark' })).toEqual({ '--primary-color': 'lightblue' })
    })
  })

  describe('Real-world Component Examples', () => {
    it('should work for button styles', () => {
      const button = sv({
        base: {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
          fontWeight: 500,
          transition: 'all 0.2s',
        },
        variants: {
          variant: {
            default: {
              backgroundColor: '#3b82f6',
              color: 'white',
            },
            destructive: {
              backgroundColor: '#ef4444',
              color: 'white',
            },
            outline: {
              border: '1px solid #d1d5db',
              backgroundColor: 'transparent',
            },
          },
          size: {
            default: {
              height: 40,
              padding: '0 16px',
              fontSize: '14px',
            },
            sm: {
              height: 36,
              padding: '0 12px',
              fontSize: '12px',
            },
            lg: {
              height: 44,
              padding: '0 32px',
              fontSize: '16px',
            },
          },
        },
        defaultVariants: {
          variant: 'default',
          size: 'default',
        },
      })

      expect(button()).toMatchObject({
        backgroundColor: '#3b82f6',
        height: 40,
      })
      expect(button({ variant: 'destructive', size: 'lg' })).toMatchObject({
        backgroundColor: '#ef4444',
        height: 44,
      })
    })

    it('should work for card styles', () => {
      const card = sv({
        base: {
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          backgroundColor: 'white',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        },
        variants: {
          variant: {
            default: {},
            elevated: {
              border: 'none',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            },
          },
          padding: {
            none: { padding: 0 },
            sm: { padding: 16 },
            md: { padding: 24 },
            lg: { padding: 32 },
          },
        },
        compoundVariants: [
          {
            variant: 'elevated',
            padding: 'lg',
            style: {
              boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
            },
          },
        ],
        defaultVariants: {
          variant: 'default',
          padding: 'md',
        },
      })

      expect(card()).toMatchObject({
        padding: 24,
      })
      expect(card({ variant: 'elevated', padding: 'lg' })).toMatchObject({
        boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
        padding: 32,
      })
    })

    it('should work for input styles', () => {
      const input = sv({
        base: {
          display: 'flex',
          height: 40,
          width: '100%',
          borderRadius: '4px',
          border: '1px solid #d1d5db',
          padding: '0 12px',
          fontSize: '14px',
        },
        variants: {
          variant: {
            default: {
              borderColor: '#d1d5db',
              backgroundColor: 'white',
            },
            filled: {
              borderColor: 'transparent',
              backgroundColor: '#f3f4f6',
            },
          },
          error: {
            true: {
              borderColor: '#ef4444',
            },
            false: {},
          },
          disabled: {
            true: {
              cursor: 'not-allowed',
              opacity: 0.5,
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
        borderColor: '#ef4444',
      })
      expect(input({ disabled: true })).toMatchObject({
        opacity: 0.5,
      })
    })
  })
})
