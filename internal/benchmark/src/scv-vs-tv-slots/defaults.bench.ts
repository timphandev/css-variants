import { bench, describe } from 'vitest'
import { scvWithDefaults, scvWithClassNames } from '../shared/scv-configs'
import { tvSlotsWithDefaults, tvSlotsWithClassNames } from '../shared/tv-slots-configs'

describe('css-variants (scv) vs tailwind-variants slots: defaults & overrides', () => {
  describe('with default variants (no props)', () => {
    bench('css-variants (scv)', () => {
      scvWithDefaults()
    })

    bench('tailwind-variants (slots)', () => {
      const { root, label, input } = tvSlotsWithDefaults()
      root()
      label()
      input()
    })
  })

  describe('with default variants (override one)', () => {
    bench('css-variants (scv)', () => {
      scvWithDefaults({ size: 'lg' })
    })

    bench('tailwind-variants (slots)', () => {
      const { root, label, input } = tvSlotsWithDefaults({ size: 'lg' })
      root()
      label()
      input()
    })
  })

  describe('with classNames override', () => {
    bench('css-variants (scv)', () => {
      scvWithClassNames({
        centered: true,
        classNames: {
          root: 'custom-root extra-class',
          inner: 'custom-inner',
        },
      })
    })

    // Note: tailwind-variants uses 'class' on individual slot function calls
    bench('tailwind-variants (slots)', () => {
      const { root, inner } = tvSlotsWithClassNames({ centered: true })
      root({ class: 'custom-root extra-class' })
      inner({ class: 'custom-inner' })
    })
  })
})
