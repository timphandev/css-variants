import { bench, describe } from 'vitest'
import { ssv } from './ssv'

describe('ssv benchmarks', () => {
  // Simple base styles only
  const simpleVariant = ssv({
    slots: ['root', 'content'],
    base: {
      root: { display: 'flex', flexDirection: 'column' },
      content: { padding: '16px' },
    },
  })

  bench('base styles only', () => {
    simpleVariant()
  })

  // Single variant with two slots
  const singleVariant = ssv({
    slots: ['root', 'icon'],
    base: {
      root: { display: 'inline-flex', alignItems: 'center' },
      icon: { marginRight: '8px' },
    },
    variants: {
      color: {
        primary: {
          root: { color: 'white', backgroundColor: '#1976d2' },
          icon: { color: 'white' },
        },
        secondary: {
          root: { color: 'white', backgroundColor: '#757575' },
          icon: { color: 'white' },
        },
      },
    },
  })

  bench('single variant (2 slots)', () => {
    singleVariant({ color: 'primary' })
  })

  // Multiple slots (realistic component)
  const multipleSlots = ssv({
    slots: ['root', 'header', 'body', 'footer'],
    base: {
      root: {
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
      header: { padding: '16px', borderBottom: '1px solid #e0e0e0' },
      body: { padding: '16px', flex: '1' },
      footer: { padding: '16px', borderTop: '1px solid #e0e0e0' },
    },
    variants: {
      size: {
        sm: {
          header: { padding: '8px', fontSize: '12px' },
          body: { padding: '8px' },
          footer: { padding: '8px', fontSize: '10px' },
        },
        md: {
          header: { padding: '16px', fontSize: '14px' },
          body: { padding: '16px' },
          footer: { padding: '16px', fontSize: '12px' },
        },
        lg: {
          header: { padding: '24px', fontSize: '16px' },
          body: { padding: '24px' },
          footer: { padding: '24px', fontSize: '14px' },
        },
      },
    },
  })

  bench('multiple slots (4 slots)', () => {
    multipleSlots({ size: 'md' })
  })

  // Multiple variants across multiple slots
  const multipleVariants = ssv({
    slots: ['root', 'title', 'description', 'icon'],
    base: {
      root: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        borderRadius: '8px',
        border: '1px solid',
        padding: '16px',
      },
      title: { fontWeight: '600', margin: '0' },
      description: { fontSize: '14px', margin: '4px 0 0 0' },
      icon: { flexShrink: 0 },
    },
    variants: {
      variant: {
        info: {
          root: { backgroundColor: '#e3f2fd', borderColor: '#90caf9' },
          title: { color: '#0d47a1' },
          description: { color: '#1565c0' },
          icon: { color: '#1976d2' },
        },
        success: {
          root: { backgroundColor: '#e8f5e9', borderColor: '#a5d6a7' },
          title: { color: '#1b5e20' },
          description: { color: '#2e7d32' },
          icon: { color: '#388e3c' },
        },
        warning: {
          root: { backgroundColor: '#fff3e0', borderColor: '#ffcc80' },
          title: { color: '#e65100' },
          description: { color: '#ef6c00' },
          icon: { color: '#f57c00' },
        },
        error: {
          root: { backgroundColor: '#ffebee', borderColor: '#ef9a9a' },
          title: { color: '#b71c1c' },
          description: { color: '#c62828' },
          icon: { color: '#d32f2f' },
        },
      },
      size: {
        sm: {
          root: { padding: '12px' },
          title: { fontSize: '14px' },
          description: { fontSize: '12px' },
          icon: { width: '16px', height: '16px' },
        },
        md: {
          root: { padding: '16px' },
          title: { fontSize: '16px' },
          description: { fontSize: '14px' },
          icon: { width: '20px', height: '20px' },
        },
      },
    },
  })

  bench('multiple variants (4 slots)', () => {
    multipleVariants({ variant: 'info', size: 'md' })
  })

  // With default variants
  const withDefaults = ssv({
    slots: ['root', 'label', 'input'],
    base: {
      root: { display: 'flex', flexDirection: 'column', gap: '8px' },
      label: { fontSize: '14px', fontWeight: '500' },
      input: { border: '1px solid #ccc', borderRadius: '4px' },
    },
    variants: {
      size: {
        sm: {
          label: { fontSize: '12px' },
          input: { padding: '4px 8px', fontSize: '12px' },
        },
        md: {
          label: { fontSize: '14px' },
          input: { padding: '8px 12px', fontSize: '14px' },
        },
        lg: {
          label: { fontSize: '16px' },
          input: { padding: '12px 16px', fontSize: '16px' },
        },
      },
      variant: {
        outlined: {
          input: { border: '2px solid', borderRadius: '4px' },
        },
        filled: {
          input: { backgroundColor: '#f5f5f5', border: '0' },
        },
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'outlined',
    },
  })

  bench('with default variants (no props)', () => {
    withDefaults()
  })

  bench('with default variants (override one)', () => {
    withDefaults({ size: 'lg' })
  })

  // Compound variants
  const withCompoundVariants = ssv({
    slots: ['root', 'content', 'icon'],
    base: {
      root: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        borderRadius: '4px',
        transition: 'all 0.2s',
      },
      content: { fontWeight: '500' },
      icon: { display: 'flex' },
    },
    variants: {
      color: {
        primary: {
          root: { backgroundColor: '#1976d2', color: 'white' },
          icon: { color: 'white' },
        },
        secondary: {
          root: { backgroundColor: '#757575', color: 'white' },
          icon: { color: 'white' },
        },
        danger: {
          root: { backgroundColor: '#d32f2f', color: 'white' },
          icon: { color: 'white' },
        },
      },
      size: {
        sm: {
          root: { padding: '4px 8px' },
          content: { fontSize: '12px' },
          icon: { width: '12px', height: '12px' },
        },
        md: {
          root: { padding: '8px 16px' },
          content: { fontSize: '14px' },
          icon: { width: '16px', height: '16px' },
        },
        lg: {
          root: { padding: '12px 24px' },
          content: { fontSize: '16px' },
          icon: { width: '20px', height: '20px' },
        },
      },
      disabled: {
        true: {
          root: { opacity: 0.5, cursor: 'not-allowed' },
        },
        false: {
          root: { cursor: 'pointer' },
        },
      },
    },
    compoundVariants: [
      {
        size: 'lg',
        color: 'primary',
        styles: {
          root: { fontWeight: '700', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
          content: { letterSpacing: '0.5px' },
        },
      },
      {
        size: ['sm', 'md'],
        color: 'danger',
        styles: {
          root: { fontWeight: '600' },
        },
      },
      {
        disabled: true,
        color: ['primary', 'secondary', 'danger'],
        styles: {
          root: { pointerEvents: 'none' },
        },
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

  // With styles override
  const withStylesOverride = ssv({
    slots: ['root', 'inner'],
    base: {
      root: { display: 'flex' },
      inner: { padding: '16px' },
    },
    variants: {
      centered: {
        true: {
          root: { justifyContent: 'center', margin: '0 auto' },
          inner: { textAlign: 'center' },
        },
      },
    },
  })

  bench('with styles override', () => {
    withStylesOverride({
      centered: true,
      styles: {
        root: { width: '100%', maxWidth: '1200px' },
        inner: { backgroundColor: '#f5f5f5' },
      },
    })
  })

  // Complex real-world modal component
  const complexModal = ssv({
    slots: ['overlay', 'container', 'header', 'title', 'close', 'content', 'footer', 'actions'],
    base: {
      overlay: {
        position: 'fixed',
        inset: '0',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      },
      container: {
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        position: 'relative',
        maxHeight: '90vh',
        overflow: 'auto',
      },
      header: {
        padding: '24px',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      title: {
        fontSize: '20px',
        fontWeight: '600',
        margin: '0',
      },
      close: {
        cursor: 'pointer',
        border: 'none',
        backgroundColor: 'transparent',
      },
      content: {
        padding: '24px',
      },
      footer: {
        padding: '24px',
        borderTop: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'flex-end',
      },
      actions: {
        display: 'flex',
        gap: '8px',
      },
    },
    variants: {
      size: {
        sm: {
          container: { width: '400px' },
          header: { padding: '16px' },
          title: { fontSize: '16px' },
          content: { padding: '16px' },
          footer: { padding: '16px' },
        },
        md: {
          container: { width: '600px' },
        },
        lg: {
          container: { width: '800px' },
          header: { padding: '32px' },
          title: { fontSize: '24px' },
          content: { padding: '32px' },
          footer: { padding: '32px' },
        },
        full: {
          container: { width: '95vw', maxWidth: '1200px' },
        },
      },
      centered: {
        true: {
          content: { textAlign: 'center' },
        },
      },
    },
    compoundVariants: [
      {
        size: 'lg',
        centered: true,
        styles: {
          title: { textAlign: 'center', width: '100%' },
          header: { flexDirection: 'column', gap: '16px' },
        },
      },
    ],
    defaultVariants: {
      size: 'md',
    },
  })

  bench('complex real-world modal (defaults)', () => {
    complexModal()
  })

  bench('complex real-world modal (with overrides)', () => {
    complexModal({
      size: 'lg',
      centered: true,
      styles: { overlay: { backdropFilter: 'blur(4px)' } },
    })
  })

  // Many slots (stress test)
  const manySlots = ssv({
    slots: ['slot1', 'slot2', 'slot3', 'slot4', 'slot5', 'slot6', 'slot7', 'slot8'],
    base: {
      slot1: { display: 'flex', padding: '8px' },
      slot2: { display: 'block', margin: '4px' },
      slot3: { fontSize: '14px', color: '#333' },
      slot4: { fontWeight: '500' },
      slot5: { borderRadius: '4px' },
      slot6: { backgroundColor: '#f5f5f5' },
      slot7: { border: '1px solid #ccc' },
      slot8: { boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    },
    variants: {
      theme: {
        light: {
          slot1: { backgroundColor: 'white', color: 'black' },
          slot2: { backgroundColor: '#f9f9f9' },
          slot3: { color: '#666' },
          slot6: { backgroundColor: '#f5f5f5' },
          slot7: { borderColor: '#e0e0e0' },
        },
        dark: {
          slot1: { backgroundColor: '#1a1a1a', color: 'white' },
          slot2: { backgroundColor: '#2a2a2a' },
          slot3: { color: '#aaa' },
          slot6: { backgroundColor: '#333' },
          slot7: { borderColor: '#444' },
        },
      },
    },
  })

  bench('many slots (8 slots)', () => {
    manySlots({ theme: 'dark' })
  })

  // No variants (edge case)
  const noVariants = ssv({
    slots: ['root', 'content'],
    base: {
      root: { display: 'flex' },
      content: { padding: '16px' },
    },
  })

  bench('no variants (optimized path)', () => {
    noVariants({ styles: { root: { margin: '10px' } } })
  })

  // Many CSS properties per slot (stress test)
  const manyProperties = ssv({
    slots: ['root', 'content'],
    base: {
      root: {
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
        border: '1px solid #e0e0e0',
        cursor: 'pointer',
      },
      content: {
        width: '100%',
        minHeight: '100px',
        overflow: 'auto',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      },
    },
    variants: {
      theme: {
        light: {
          root: {
            backgroundColor: '#ffffff',
            color: '#000000',
            borderColor: '#e0e0e0',
          },
          content: {
            backgroundColor: '#f9f9f9',
          },
        },
        dark: {
          root: {
            backgroundColor: '#1a1a1a',
            color: '#ffffff',
            borderColor: '#333333',
          },
          content: {
            backgroundColor: '#2a2a2a',
          },
        },
      },
    },
  })

  bench('many CSS properties per slot', () => {
    manyProperties({ theme: 'dark' })
  })
})
