import { bench, describe } from 'vitest'
import { scvCompoundVariants } from '../shared/scv-configs'
import { tvSlotsCompoundVariants } from '../shared/tv-slots-configs'

describe('css-variants (scv) vs tailwind-variants slots: compound variants', () => {
  describe('compound variants (no match)', () => {
    bench('css-variants (scv)', () => {
      scvCompoundVariants({ color: 'secondary', size: 'sm', disabled: false })
    })

    bench('tailwind-variants (slots)', () => {
      const { root, content, icon } = tvSlotsCompoundVariants({ color: 'secondary', size: 'sm', disabled: false })
      root()
      content()
      icon()
    })
  })

  describe('compound variants (single match)', () => {
    bench('css-variants (scv)', () => {
      scvCompoundVariants({ color: 'primary', size: 'lg', disabled: false })
    })

    bench('tailwind-variants (slots)', () => {
      const { root, content, icon } = tvSlotsCompoundVariants({ color: 'primary', size: 'lg', disabled: false })
      root()
      content()
      icon()
    })
  })

  describe('compound variants (multiple matches)', () => {
    bench('css-variants (scv)', () => {
      scvCompoundVariants({ color: 'danger', size: 'sm', disabled: true })
    })

    bench('tailwind-variants (slots)', () => {
      const { root, content, icon } = tvSlotsCompoundVariants({ color: 'danger', size: 'sm', disabled: true })
      root()
      content()
      icon()
    })
  })
})
