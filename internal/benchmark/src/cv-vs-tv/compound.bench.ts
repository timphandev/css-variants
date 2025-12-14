import { bench, describe } from 'vitest'
import { cvCompoundVariants } from '../shared/cv-configs'
import { tvCompoundVariants } from '../shared/tv-configs'

describe('css-variants vs tailwind-variants: compound variants', () => {
  describe('compound variants (no match)', () => {
    bench('css-variants', () => {
      cvCompoundVariants({ color: 'secondary', size: 'sm', disabled: false })
    })

    bench('tailwind-variants', () => {
      tvCompoundVariants({ color: 'secondary', size: 'sm', disabled: false })
    })
  })

  describe('compound variants (single match)', () => {
    bench('css-variants', () => {
      cvCompoundVariants({ color: 'primary', size: 'lg', disabled: false })
    })

    bench('tailwind-variants', () => {
      tvCompoundVariants({ color: 'primary', size: 'lg', disabled: false })
    })
  })

  describe('compound variants (multiple matches)', () => {
    bench('css-variants', () => {
      cvCompoundVariants({ color: 'danger', size: 'sm', disabled: true })
    })

    bench('tailwind-variants', () => {
      tvCompoundVariants({ color: 'danger', size: 'sm', disabled: true })
    })
  })
})
