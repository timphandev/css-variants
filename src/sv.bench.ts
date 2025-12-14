import { bench, describe } from 'vitest'
import { sv } from './sv.js'

describe('sv benchmarks', () => {
  // Simple base style only
  const simpleVariant = sv({
    base: { color: 'black', fontSize: '16px' },
  })

  bench('base style only', () => {
    simpleVariant()
  })

  // Single variant
  const singleVariant = sv({
    base: { fontFamily: 'sans-serif' },
    variants: {
      color: {
        primary: { color: 'blue', backgroundColor: '#e3f2fd' },
        secondary: { color: 'gray', backgroundColor: '#f5f5f5' },
        danger: { color: 'red', backgroundColor: '#ffebee' },
      },
    },
  })

  bench('single variant', () => {
    singleVariant({ color: 'primary' })
  })

  // Multiple variants
  const multipleVariants = sv({
    base: { display: 'inline-flex', alignItems: 'center', borderRadius: '4px' },
    variants: {
      color: {
        primary: { color: 'blue', backgroundColor: '#1976d2' },
        secondary: { color: 'white', backgroundColor: '#757575' },
        danger: { color: 'white', backgroundColor: '#d32f2f' },
      },
      size: {
        sm: { padding: '4px 8px', fontSize: '12px' },
        md: { padding: '8px 16px', fontSize: '14px' },
        lg: { padding: '12px 24px', fontSize: '16px' },
      },
      fontWeight: {
        normal: { fontWeight: '400' },
        medium: { fontWeight: '500' },
        bold: { fontWeight: '700' },
      },
    },
  })

  bench('multiple variants', () => {
    multipleVariants({ color: 'primary', size: 'md', fontWeight: 'medium' })
  })

  // With default variants
  const withDefaults = sv({
    base: { display: 'flex', transition: 'all 0.2s' },
    variants: {
      color: {
        primary: { color: 'blue', backgroundColor: '#1976d2' },
        secondary: { color: 'white', backgroundColor: '#757575' },
        danger: { color: 'white', backgroundColor: '#d32f2f' },
      },
      size: {
        sm: { padding: '4px 8px', fontSize: '12px' },
        md: { padding: '8px 16px', fontSize: '14px' },
        lg: { padding: '12px 24px', fontSize: '16px' },
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
  const withCompoundVariants = sv({
    base: { display: 'inline-flex', borderRadius: '4px' },
    variants: {
      color: {
        primary: { color: 'white', backgroundColor: '#1976d2' },
        secondary: { color: 'white', backgroundColor: '#757575' },
        danger: { color: 'white', backgroundColor: '#d32f2f' },
      },
      size: {
        sm: { padding: '4px 8px', fontSize: '12px' },
        md: { padding: '8px 16px', fontSize: '14px' },
        lg: { padding: '12px 24px', fontSize: '16px' },
      },
      disabled: {
        true: { opacity: 0.5, cursor: 'not-allowed' },
        false: { cursor: 'pointer' },
      },
    },
    compoundVariants: [
      {
        size: 'lg',
        color: 'primary',
        style: { fontWeight: '700', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
      },
      {
        size: ['sm', 'md'],
        color: 'danger',
        style: { fontWeight: '600' },
      },
      {
        disabled: true,
        color: ['primary', 'secondary', 'danger'],
        style: { pointerEvents: 'none' },
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

  // With style override
  const withStyleOverride = sv({
    base: { color: 'black' },
    variants: {
      color: {
        primary: { backgroundColor: '#1976d2' },
        secondary: { backgroundColor: '#757575' },
      },
    },
  })

  bench('with style override', () => {
    withStyleOverride({
      color: 'primary',
      style: { margin: '8px', border: '1px solid #ccc' },
    })
  })

  // Complex real-world example
  const complexCard = sv({
    base: {
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
    },
    variants: {
      elevation: {
        low: { boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
        medium: { boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
        high: { boxShadow: '0 10px 20px rgba(0,0,0,0.15)' },
      },
      padding: {
        none: { padding: '0' },
        sm: { padding: '8px' },
        md: { padding: '16px' },
        lg: { padding: '24px' },
      },
      variant: {
        outlined: { border: '1px solid #e0e0e0', boxShadow: 'none' },
        filled: { backgroundColor: '#f5f5f5' },
        elevated: {},
      },
    },
    compoundVariants: [
      {
        elevation: 'high',
        variant: 'elevated',
        style: {
          transform: 'translateY(-2px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
        },
      },
      {
        variant: 'outlined',
        padding: ['sm', 'md'],
        style: { borderRadius: '4px' },
      },
    ],
    defaultVariants: {
      elevation: 'medium',
      padding: 'md',
      variant: 'elevated',
    },
  })

  bench('complex real-world card (defaults)', () => {
    complexCard()
  })

  bench('complex real-world card (with overrides)', () => {
    complexCard({
      elevation: 'high',
      padding: 'lg',
      variant: 'elevated',
      style: { width: '100%', maxWidth: '600px' },
    })
  })

  // Boolean variants
  const booleanVariants = sv({
    base: { display: 'inline-block' },
    variants: {
      disabled: {
        true: { opacity: 0.5, cursor: 'not-allowed', pointerEvents: 'none' },
        false: { cursor: 'pointer' },
      },
      loading: {
        true: { opacity: 0.7, cursor: 'wait' },
        false: {},
      },
      fullWidth: {
        true: { width: '100%', display: 'block' },
        false: { width: 'auto' },
      },
    },
  })

  bench('boolean variants', () => {
    booleanVariants({ disabled: true, loading: false, fullWidth: true })
  })

  // No variants (edge case)
  const noVariants = sv({
    base: { color: 'black', fontSize: '14px' },
  })

  bench('no variants (optimized path)', () => {
    noVariants({ style: { margin: '10px' } })
  })

  // Many CSS properties (stress test)
  const manyProperties = sv({
    base: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      margin: '8px',
      borderRadius: '8px',
      backgroundColor: '#ffffff',
      color: '#000000',
      fontSize: '14px',
      fontWeight: '400',
      lineHeight: '1.5',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
    },
    variants: {
      theme: {
        light: {
          backgroundColor: '#ffffff',
          color: '#000000',
          borderColor: '#e0e0e0',
        },
        dark: {
          backgroundColor: '#1a1a1a',
          color: '#ffffff',
          borderColor: '#333333',
        },
      },
    },
  })

  bench('many CSS properties', () => {
    manyProperties({ theme: 'dark' })
  })
})
