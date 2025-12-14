import { describe, it, expect } from 'vitest'
import { ssv } from './ssv.js'

describe('ssv - Comprehensive Test Suite', () => {
  describe('Base Functionality', () => {
    it('should return empty objects for all slots when no config provided', () => {
      const variantFn = ssv({ slots: ['root'] })
      expect(variantFn()).toEqual({ root: {} })
    })

    it('should handle multiple slots with empty config', () => {
      const variantFn = ssv({ slots: ['root', 'icon', 'label'] })
      expect(variantFn()).toEqual({ root: {}, icon: {}, label: {} })
    })

    it('should apply base styles to single slot', () => {
      const variantFn = ssv({
        slots: ['root'],
        base: {
          root: { color: 'red', fontSize: '14px' },
        },
      })
      expect(variantFn()).toEqual({
        root: { color: 'red', fontSize: '14px' },
      })
    })

    it('should apply base styles to multiple slots', () => {
      const variantFn = ssv({
        slots: ['root', 'icon', 'label'],
        base: {
          root: { padding: '8px', margin: '4px' },
          icon: { width: 16, height: 16 },
          label: { fontSize: '14px', fontWeight: 'bold' },
        },
      })
      expect(variantFn()).toEqual({
        root: { padding: '8px', margin: '4px' },
        icon: { width: 16, height: 16 },
        label: { fontSize: '14px', fontWeight: 'bold' },
      })
    })

    it('should handle partial base (not all slots defined)', () => {
      const variantFn = ssv({
        slots: ['root', 'icon', 'label'],
        base: {
          root: { color: 'black' },
          label: { fontSize: '14px' },
        },
      })
      expect(variantFn()).toEqual({
        root: { color: 'black' },
        icon: {},
        label: { fontSize: '14px' },
      })
    })

    it('should handle numeric values in base styles', () => {
      const variantFn = ssv({
        slots: ['root'],
        base: {
          root: {
            width: 100,
            height: 200,
            opacity: 0.5,
            zIndex: 10,
          },
        },
      })
      expect(variantFn()).toEqual({
        root: {
          width: 100,
          height: 200,
          opacity: 0.5,
          zIndex: 10,
        },
      })
    })
  })

  describe('Variants - Single Variant', () => {
    it('should apply single variant to single slot', () => {
      const variantFn = ssv({
        slots: ['root'],
        variants: {
          size: {
            small: { root: { fontSize: '12px', padding: '4px' } },
            large: { root: { fontSize: '24px', padding: '8px' } },
          },
        },
      })
      expect(variantFn({ size: 'small' })).toEqual({
        root: { fontSize: '12px', padding: '4px' },
      })
      expect(variantFn({ size: 'large' })).toEqual({
        root: { fontSize: '24px', padding: '8px' },
      })
    })

    it('should apply single variant to multiple slots', () => {
      const variantFn = ssv({
        slots: ['root', 'icon', 'label'],
        variants: {
          size: {
            small: {
              root: { height: 32 },
              icon: { width: 16, height: 16 },
              label: { fontSize: '12px' },
            },
            large: {
              root: { height: 48 },
              icon: { width: 24, height: 24 },
              label: { fontSize: '16px' },
            },
          },
        },
      })
      expect(variantFn({ size: 'small' })).toEqual({
        root: { height: 32 },
        icon: { width: 16, height: 16 },
        label: { fontSize: '12px' },
      })
      expect(variantFn({ size: 'large' })).toEqual({
        root: { height: 48 },
        icon: { width: 24, height: 24 },
        label: { fontSize: '16px' },
      })
    })

    it('should apply variant to partial slots', () => {
      const variantFn = ssv({
        slots: ['root', 'icon', 'label'],
        variants: {
          color: {
            primary: {
              root: { backgroundColor: 'blue' },
              label: { color: 'white' },
              // icon intentionally omitted
            },
          },
        },
      })
      expect(variantFn({ color: 'primary' })).toEqual({
        root: { backgroundColor: 'blue' },
        icon: {},
        label: { color: 'white' },
      })
    })

    it('should ignore undefined variant value', () => {
      const variantFn = ssv({
        slots: ['root'],
        variants: {
          size: {
            small: { root: { fontSize: '12px' } },
          },
        },
      })
      expect(variantFn({ size: undefined })).toEqual({ root: {} })
    })

    it('should ignore non-existent variant value', () => {
      const variantFn = ssv({
        slots: ['root'],
        variants: {
          size: {
            small: { root: { fontSize: '12px' } },
          },
        },
      })
      // @ts-expect-error - Testing runtime behavior
      expect(variantFn({ size: 'extra-large' })).toEqual({ root: {} })
    })

    it('should merge base with variant styles', () => {
      const variantFn = ssv({
        slots: ['root'],
        base: {
          root: { color: 'black', display: 'flex' },
        },
        variants: {
          size: {
            small: { root: { fontSize: '12px' } },
          },
        },
      })
      expect(variantFn({ size: 'small' })).toEqual({
        root: { color: 'black', display: 'flex', fontSize: '12px' },
      })
    })

    it('should override base properties with variant properties', () => {
      const variantFn = ssv({
        slots: ['root'],
        base: {
          root: { color: 'black', fontSize: '14px' },
        },
        variants: {
          theme: {
            dark: { root: { color: 'white', backgroundColor: 'black' } },
          },
        },
      })
      expect(variantFn({ theme: 'dark' })).toEqual({
        root: { color: 'white', fontSize: '14px', backgroundColor: 'black' },
      })
    })
  })

  describe('Variants - Multiple Variants', () => {
    it('should combine multiple variants across slots', () => {
      const variantFn = ssv({
        slots: ['root', 'icon'],
        base: {
          root: { display: 'flex' },
          icon: { flexShrink: 0 },
        },
        variants: {
          color: {
            primary: {
              root: { backgroundColor: 'blue' },
              icon: { color: 'blue' },
            },
            secondary: {
              root: { backgroundColor: 'gray' },
              icon: { color: 'gray' },
            },
          },
          size: {
            small: {
              root: { height: 32, padding: '0 8px' },
              icon: { width: 16, height: 16 },
            },
            large: {
              root: { height: 48, padding: '0 16px' },
              icon: { width: 24, height: 24 },
            },
          },
        },
      })
      expect(variantFn({ color: 'primary', size: 'large' })).toEqual({
        root: { display: 'flex', backgroundColor: 'blue', height: 48, padding: '0 16px' },
        icon: { flexShrink: 0, color: 'blue', width: 24, height: 24 },
      })
    })

    it('should handle partial variant props', () => {
      const variantFn = ssv({
        slots: ['root', 'icon'],
        variants: {
          color: {
            primary: { root: { backgroundColor: 'blue' } },
          },
          size: {
            small: { icon: { width: 16 } },
          },
        },
      })
      expect(variantFn({ color: 'primary' })).toEqual({
        root: { backgroundColor: 'blue' },
        icon: {},
      })
      expect(variantFn({ size: 'small' })).toEqual({
        root: {},
        icon: { width: 16 },
      })
    })

    it('should handle overlapping variant properties (later wins)', () => {
      const variantFn = ssv({
        slots: ['root'],
        variants: {
          size: {
            large: { root: { fontSize: '24px', padding: '10px' } },
          },
          spacing: {
            compact: { root: { padding: '5px' } },
          },
        },
      })
      const result = variantFn({ size: 'large', spacing: 'compact' })
      expect(result.root.padding).toBe('5px')
      expect(result.root.fontSize).toBe('24px')
    })
  })

  describe('Default Variants', () => {
    it('should apply default variants when no props provided', () => {
      const variantFn = ssv({
        slots: ['root', 'icon'],
        variants: {
          size: {
            small: {
              root: { height: 32 },
              icon: { width: 16 },
            },
            large: {
              root: { height: 48 },
              icon: { width: 24 },
            },
          },
        },
        defaultVariants: {
          size: 'small',
        },
      })
      expect(variantFn()).toEqual({
        root: { height: 32 },
        icon: { width: 16 },
      })
    })

    it('should override default variants with provided props', () => {
      const variantFn = ssv({
        slots: ['root'],
        variants: {
          size: {
            small: { root: { fontSize: '12px' } },
            large: { root: { fontSize: '24px' } },
          },
        },
        defaultVariants: {
          size: 'small',
        },
      })
      expect(variantFn({ size: 'large' })).toEqual({ root: { fontSize: '24px' } })
    })

    it('should apply multiple default variants', () => {
      const variantFn = ssv({
        slots: ['root', 'icon'],
        variants: {
          color: {
            primary: { root: { backgroundColor: 'blue' } },
            secondary: { root: { backgroundColor: 'gray' } },
          },
          size: {
            small: { icon: { width: 16 } },
            large: { icon: { width: 24 } },
          },
        },
        defaultVariants: {
          color: 'primary',
          size: 'small',
        },
      })
      expect(variantFn()).toEqual({
        root: { backgroundColor: 'blue' },
        icon: { width: 16 },
      })
      expect(variantFn({ color: 'secondary' })).toEqual({
        root: { backgroundColor: 'gray' },
        icon: { width: 16 },
      })
      expect(variantFn({ size: 'large' })).toEqual({
        root: { backgroundColor: 'blue' },
        icon: { width: 24 },
      })
    })

    it('should revert to default when variant prop is undefined', () => {
      const variantFn = ssv({
        slots: ['root'],
        variants: {
          size: {
            small: { root: { fontSize: '12px' } },
            large: { root: { fontSize: '24px' } },
          },
        },
        defaultVariants: {
          size: 'small',
        },
      })
      expect(variantFn({ size: undefined })).toEqual({ root: { fontSize: '12px' } })
    })

    it('should combine base with default variants', () => {
      const variantFn = ssv({
        slots: ['root'],
        base: {
          root: { color: 'black' },
        },
        variants: {
          size: {
            small: { root: { fontSize: '12px' } },
            large: { root: { fontSize: '24px' } },
          },
        },
        defaultVariants: {
          size: 'large',
        },
      })
      expect(variantFn()).toEqual({ root: { color: 'black', fontSize: '24px' } })
    })
  })

  describe('Boolean Variants', () => {
    it('should handle boolean true variant', () => {
      const variantFn = ssv({
        slots: ['root', 'icon'],
        variants: {
          disabled: {
            true: {
              root: { opacity: 0.5, cursor: 'not-allowed' },
              icon: { opacity: 0.5 },
            },
            false: {
              root: { opacity: 1, cursor: 'pointer' },
            },
          },
        },
      })
      expect(variantFn({ disabled: true })).toEqual({
        root: { opacity: 0.5, cursor: 'not-allowed' },
        icon: { opacity: 0.5 },
      })
    })

    it('should handle boolean false variant', () => {
      const variantFn = ssv({
        slots: ['root'],
        variants: {
          disabled: {
            true: { root: { opacity: 0.5 } },
            false: { root: { opacity: 1 } },
          },
        },
      })
      expect(variantFn({ disabled: false })).toEqual({ root: { opacity: 1 } })
    })

    it('should handle multiple boolean variants', () => {
      const variantFn = ssv({
        slots: ['root'],
        variants: {
          disabled: {
            true: { root: { opacity: 0.5 } },
          },
          loading: {
            true: { root: { cursor: 'wait' } },
          },
        },
      })
      expect(variantFn({ disabled: true, loading: true })).toEqual({
        root: { opacity: 0.5, cursor: 'wait' },
      })
    })
  })

  describe('Compound Variants', () => {
    it('should apply compound variant when all conditions match', () => {
      const variantFn = ssv({
        slots: ['root', 'icon'],
        variants: {
          color: {
            primary: { root: { backgroundColor: 'blue' } },
            secondary: { root: { backgroundColor: 'gray' } },
          },
          size: {
            small: { icon: { width: 16 } },
            large: { icon: { width: 24 } },
          },
        },
        compoundVariants: [
          {
            color: 'primary',
            size: 'large',
            styles: {
              root: { fontWeight: 'bold', boxShadow: '0 0 10px blue' },
              icon: { filter: 'drop-shadow(0 0 2px blue)' },
            },
          },
        ],
      })
      expect(variantFn({ color: 'primary', size: 'large' })).toEqual({
        root: { backgroundColor: 'blue', fontWeight: 'bold', boxShadow: '0 0 10px blue' },
        icon: { width: 24, filter: 'drop-shadow(0 0 2px blue)' },
      })
    })

    it('should not apply compound variant when conditions do not match', () => {
      const variantFn = ssv({
        slots: ['root'],
        variants: {
          color: {
            primary: { root: { backgroundColor: 'blue' } },
            secondary: { root: { backgroundColor: 'gray' } },
          },
          size: {
            small: { root: { height: 32 } },
            large: { root: { height: 48 } },
          },
        },
        compoundVariants: [
          {
            color: 'primary',
            size: 'large',
            styles: { root: { fontWeight: 'bold' } },
          },
        ],
      })
      expect(variantFn({ color: 'primary', size: 'small' })).toEqual({
        root: { backgroundColor: 'blue', height: 32 },
      })
      expect(variantFn({ color: 'secondary', size: 'large' })).toEqual({
        root: { backgroundColor: 'gray', height: 48 },
      })
    })

    it('should apply multiple compound variants when conditions match', () => {
      const variantFn = ssv({
        slots: ['root'],
        variants: {
          color: {
            primary: { root: { backgroundColor: 'blue' } },
            danger: { root: { backgroundColor: 'red' } },
          },
          size: {
            small: { root: { height: 32 } },
            large: { root: { height: 48 } },
          },
        },
        compoundVariants: [
          {
            color: 'primary',
            size: 'large',
            styles: { root: { boxShadow: '0 0 10px blue' } },
          },
          {
            color: 'danger',
            size: 'large',
            styles: { root: { boxShadow: '0 0 10px red' } },
          },
        ],
      })
      expect(variantFn({ color: 'danger', size: 'large' })).toEqual({
        root: { backgroundColor: 'red', height: 48, boxShadow: '0 0 10px red' },
      })
    })

    it('should handle compound variant with array selectors', () => {
      const variantFn = ssv({
        slots: ['root', 'icon'],
        variants: {
          color: {
            primary: { root: { backgroundColor: 'blue' } },
            secondary: { root: { backgroundColor: 'gray' } },
            danger: { root: { backgroundColor: 'red' } },
          },
          size: {
            small: { icon: { width: 16 } },
            large: { icon: { width: 24 } },
          },
        },
        compoundVariants: [
          {
            color: ['primary', 'danger'],
            size: 'large',
            styles: {
              root: { fontWeight: 'bold' },
              icon: { fontWeight: 'bold' },
            },
          },
        ],
      })
      expect(variantFn({ color: 'primary', size: 'large' })).toEqual({
        root: { backgroundColor: 'blue', fontWeight: 'bold' },
        icon: { width: 24, fontWeight: 'bold' },
      })
      expect(variantFn({ color: 'danger', size: 'large' })).toEqual({
        root: { backgroundColor: 'red', fontWeight: 'bold' },
        icon: { width: 24, fontWeight: 'bold' },
      })
      expect(variantFn({ color: 'secondary', size: 'large' })).toEqual({
        root: { backgroundColor: 'gray' },
        icon: { width: 24 },
      })
    })

    it('should handle compound variant with partial slots', () => {
      const variantFn = ssv({
        slots: ['root', 'icon', 'label'],
        variants: {
          color: {
            primary: { root: { backgroundColor: 'blue' } },
          },
          size: {
            large: { root: { height: 48 } },
          },
        },
        compoundVariants: [
          {
            color: 'primary',
            size: 'large',
            styles: {
              root: { boxShadow: '0 0 10px blue' },
              // Only root, not icon or label
            },
          },
        ],
      })
      expect(variantFn({ color: 'primary', size: 'large' })).toEqual({
        root: { backgroundColor: 'blue', height: 48, boxShadow: '0 0 10px blue' },
        icon: {},
        label: {},
      })
    })

    it('should handle compound variant with boolean variants', () => {
      const variantFn = ssv({
        slots: ['root', 'icon'],
        variants: {
          color: {
            primary: { root: { backgroundColor: 'blue' } },
          },
          disabled: {
            true: { root: { opacity: 0.5 } },
            false: { root: { opacity: 1 } },
          },
        },
        compoundVariants: [
          {
            color: 'primary',
            disabled: true,
            styles: {
              root: { cursor: 'not-allowed' },
              icon: { display: 'none' },
            },
          },
        ],
      })
      expect(variantFn({ color: 'primary', disabled: true })).toEqual({
        root: { backgroundColor: 'blue', opacity: 0.5, cursor: 'not-allowed' },
        icon: { display: 'none' },
      })
    })

    it('should handle compound variant with default variants', () => {
      const variantFn = ssv({
        slots: ['root'],
        variants: {
          size: {
            small: { root: { fontSize: '12px' } },
            large: { root: { fontSize: '24px' } },
          },
          color: {
            primary: { root: { color: 'blue' } },
            secondary: { root: { color: 'gray' } },
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
            styles: { root: { fontWeight: 'bold' } },
          },
        ],
      })
      expect(variantFn()).toEqual({
        root: { fontSize: '12px', color: 'blue', fontWeight: 'bold' },
      })
    })

    it('should apply multiple overlapping compound variants', () => {
      const variantFn = ssv({
        slots: ['root'],
        variants: {
          color: {
            primary: { root: { color: 'blue' } },
          },
          size: {
            large: { root: { fontSize: '24px' } },
          },
        },
        compoundVariants: [
          {
            color: 'primary' as const,
            styles: { root: { border: '1px solid blue' } },
          },
          {
            size: 'large' as const,
            styles: { root: { padding: '10px' } },
          },
          {
            color: 'primary' as const,
            size: 'large' as const,
            styles: { root: { boxShadow: '0 0 10px blue' } },
          },
        ],
      })
      expect(variantFn({ color: 'primary', size: 'large' })).toEqual({
        root: {
          color: 'blue',
          fontSize: '24px',
          border: '1px solid blue',
          padding: '10px',
          boxShadow: '0 0 10px blue',
        },
      })
    })
  })

  describe('styles Override', () => {
    it('should merge styles prop with base', () => {
      const variantFn = ssv({
        slots: ['root', 'icon'],
        base: {
          root: { color: 'black' },
          icon: { width: 16 },
        },
      })
      expect(
        variantFn({
          styles: {
            root: { fontSize: '20px' },
            icon: { height: 16 },
          },
        })
      ).toEqual({
        root: { color: 'black', fontSize: '20px' },
        icon: { width: 16, height: 16 },
      })
    })

    it('should merge styles prop with variants', () => {
      const variantFn = ssv({
        slots: ['root'],
        base: { root: { color: 'black' } },
        variants: {
          size: {
            small: { root: { fontSize: '12px' } },
          },
        },
      })
      expect(variantFn({ size: 'small', styles: { root: { padding: '10px' } } })).toEqual({
        root: { color: 'black', fontSize: '12px', padding: '10px' },
      })
    })

    it('should override base and variant properties with styles prop', () => {
      const variantFn = ssv({
        slots: ['root'],
        base: {
          root: { color: 'black', fontSize: '14px' },
        },
        variants: {
          size: {
            small: { root: { fontSize: '12px', padding: '5px' } },
          },
        },
      })
      expect(variantFn({ size: 'small', styles: { root: { fontSize: '20px', margin: '10px' } } })).toEqual({
        root: { color: 'black', fontSize: '20px', padding: '5px', margin: '10px' },
      })
    })

    it('should handle partial styles (not all slots)', () => {
      const variantFn = ssv({
        slots: ['root', 'icon', 'label'],
        base: {
          root: { color: 'black' },
          icon: { width: 16 },
          label: { fontSize: '14px' },
        },
      })
      expect(
        variantFn({
          styles: {
            root: { fontSize: '20px' },
            label: { fontWeight: 'bold' },
          },
        })
      ).toEqual({
        root: { color: 'black', fontSize: '20px' },
        icon: { width: 16 },
        label: { fontSize: '14px', fontWeight: 'bold' },
      })
    })

    it('should apply styles in order: base -> variants -> compounds -> styles prop', () => {
      const variantFn = ssv({
        slots: ['root'],
        base: {
          root: { fontSize: '10px', color: 'black' },
        },
        variants: {
          size: {
            large: { root: { fontSize: '20px' } },
          },
        },
        compoundVariants: [
          {
            size: 'large',
            styles: { root: { fontSize: '30px' } },
          },
        ],
      })
      expect(variantFn({ size: 'large', styles: { root: { fontSize: '40px' } } })).toEqual({
        root: { fontSize: '40px', color: 'black' },
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty variants object', () => {
      const variantFn = ssv({
        slots: ['root'],
        base: { root: { color: 'black' } },
        variants: {},
      })
      expect(variantFn()).toEqual({ root: { color: 'black' } })
    })

    it('should handle variant with empty value object', () => {
      const variantFn = ssv({
        slots: ['root'],
        variants: {
          size: {},
        },
      })
      // @ts-expect-error - Testing runtime behavior
      expect(variantFn({ size: 'large' })).toEqual({ root: {} })
    })

    it('should handle compound variants with empty array selectors', () => {
      const variantFn = ssv({
        slots: ['root'],
        variants: {
          size: {
            large: { root: { fontSize: '24px' } },
          },
        },
        compoundVariants: [
          {
            size: [],
            styles: { root: { fontWeight: 'bold' } },
          },
        ],
      })
      expect(variantFn({ size: 'large' })).toEqual({ root: { fontSize: '24px' } })
    })

    it('should handle undefined config properties gracefully', () => {
      const variantFn = ssv({
        slots: ['root'],
        base: undefined,
        variants: undefined,
        defaultVariants: undefined,
        compoundVariants: undefined,
      })
      expect(variantFn()).toEqual({ root: {} })
    })

    it('should not mutate input props', () => {
      const variantFn = ssv({
        slots: ['root'],
        variants: {
          size: {
            small: { root: { fontSize: '12px' } },
          },
        },
      })
      const props = { size: 'small' as const }
      variantFn(props)
      expect(props).toEqual({ size: 'small' })
    })

    it('should not mutate base styles', () => {
      const baseStyles = {
        root: { color: 'black', fontSize: '14px' },
      }
      const variantFn = ssv({
        slots: ['root'],
        base: baseStyles,
      })
      variantFn({ styles: { root: { color: 'red' } } })
      expect(baseStyles).toEqual({
        root: { color: 'black', fontSize: '14px' },
      })
    })

    it('should handle styles for non-existent slots gracefully', () => {
      const variantFn = ssv({
        slots: ['root'],
        base: { root: { color: 'black' } },
      })
      // @ts-expect-error - Testing runtime with invalid slot
      expect(variantFn({ styles: { nonExistent: { color: 'red' } } })).toEqual({
        root: { color: 'black' },
      })
    })

    it('should handle CSS custom properties', () => {
      const variantFn = ssv({
        slots: ['root'],
        base: {
          root: { '--primary-color': 'blue' },
        },
        variants: {
          theme: {
            dark: { root: { '--primary-color': 'lightblue' } },
          },
        },
      })
      expect(variantFn({ theme: 'dark' })).toEqual({
        root: { '--primary-color': 'lightblue' },
      })
    })
  })

  describe('Real-world Component Examples', () => {
    it('should work for button component with icon', () => {
      const button = ssv({
        slots: ['root', 'icon', 'label'],
        base: {
          root: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
            fontWeight: 500,
          },
          icon: {
            flexShrink: 0,
            marginRight: '8px',
          },
          label: {
            flex: 1,
          },
        },
        variants: {
          variant: {
            default: {
              root: { backgroundColor: '#3b82f6', color: 'white' },
            },
            destructive: {
              root: { backgroundColor: '#ef4444', color: 'white' },
            },
            outline: {
              root: { border: '1px solid #d1d5db', backgroundColor: 'transparent' },
            },
          },
          size: {
            default: {
              root: { height: 40, padding: '0 16px' },
              icon: { width: 16, height: 16 },
              label: { fontSize: '14px' },
            },
            sm: {
              root: { height: 36, padding: '0 12px' },
              icon: { width: 14, height: 14 },
              label: { fontSize: '12px' },
            },
            lg: {
              root: { height: 44, padding: '0 32px' },
              icon: { width: 20, height: 20 },
              label: { fontSize: '16px' },
            },
          },
        },
        defaultVariants: {
          variant: 'default',
          size: 'default',
        },
      })

      expect(button()).toMatchObject({
        root: expect.objectContaining({ backgroundColor: '#3b82f6', height: 40 }),
      })
      expect(button({ variant: 'destructive', size: 'lg' })).toMatchObject({
        root: expect.objectContaining({ backgroundColor: '#ef4444', height: 44 }),
        icon: expect.objectContaining({ width: 20 }),
      })
    })

    it('should work for card component with multiple slots', () => {
      const card = ssv({
        slots: ['root', 'header', 'body', 'footer'],
        base: {
          root: {
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            backgroundColor: 'white',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
          },
          header: {
            padding: 24,
            borderBottom: '1px solid #e5e7eb',
          },
          body: {
            padding: 24,
          },
          footer: {
            padding: 24,
            borderTop: '1px solid #e5e7eb',
          },
        },
        variants: {
          variant: {
            default: {},
            elevated: {
              root: {
                border: 'none',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              },
            },
          },
          padding: {
            none: {
              header: { padding: 0 },
              body: { padding: 0 },
              footer: { padding: 0 },
            },
            sm: {
              header: { padding: 16 },
              body: { padding: 16 },
              footer: { padding: 16 },
            },
            lg: {
              header: { padding: 32 },
              body: { padding: 32 },
              footer: { padding: 32 },
            },
          },
        },
        compoundVariants: [
          {
            variant: 'elevated',
            padding: 'lg',
            styles: {
              root: {
                boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
              },
            },
          },
        ],
        defaultVariants: {
          variant: 'default',
        },
      })

      expect(card()).toMatchObject({
        header: expect.objectContaining({ padding: 24 }),
      })
      expect(card({ variant: 'elevated', padding: 'lg' })).toMatchObject({
        root: expect.objectContaining({ boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)' }),
        header: expect.objectContaining({ padding: 32 }),
      })
    })

    it('should work for input component with label and helper', () => {
      const input = ssv({
        slots: ['root', 'label', 'input', 'helper'],
        base: {
          root: {
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          },
          label: {
            fontSize: '14px',
            fontWeight: 500,
          },
          input: {
            display: 'flex',
            height: 40,
            width: '100%',
            borderRadius: '4px',
            border: '1px solid #d1d5db',
            padding: '0 12px',
            fontSize: '14px',
          },
          helper: {
            fontSize: '12px',
          },
        },
        variants: {
          variant: {
            default: {
              input: {
                borderColor: '#d1d5db',
                backgroundColor: 'white',
              },
              helper: {
                color: '#6b7280',
              },
            },
            filled: {
              input: {
                borderColor: 'transparent',
                backgroundColor: '#f3f4f6',
              },
              helper: {
                color: '#6b7280',
              },
            },
          },
          error: {
            true: {
              input: {
                borderColor: '#ef4444',
              },
              helper: {
                color: '#ef4444',
              },
              label: {
                color: '#ef4444',
              },
            },
            false: {},
          },
          disabled: {
            true: {
              input: {
                cursor: 'not-allowed',
                opacity: 0.5,
              },
              label: {
                opacity: 0.5,
              },
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
        input: expect.objectContaining({ borderColor: '#ef4444' }),
        helper: expect.objectContaining({ color: '#ef4444' }),
      })
      expect(input({ disabled: true })).toMatchObject({
        input: expect.objectContaining({ opacity: 0.5 }),
      })
    })
  })
})
