import { bench, describe } from 'vitest'
import { cvCompoundVariants } from '../shared/cv-configs'
import { cvaCompoundVariants } from '../shared/cva-configs'

describe('css-variants vs class-variance-authority: compound variants', () => {
  describe('compound variants (no match)', () => {
    bench('css-variants', () => {
      cvCompoundVariants({ color: 'secondary', size: 'sm', disabled: false })
    })

    bench('class-variance-authority', () => {
      cvaCompoundVariants({ color: 'secondary', size: 'sm', disabled: false })
    })
  })

  describe('compound variants (single match)', () => {
    bench('css-variants', () => {
      cvCompoundVariants({ color: 'primary', size: 'lg', disabled: false })
    })

    bench('class-variance-authority', () => {
      cvaCompoundVariants({ color: 'primary', size: 'lg', disabled: false })
    })
  })

  describe('compound variants (multiple matches)', () => {
    bench('css-variants', () => {
      cvCompoundVariants({ color: 'danger', size: 'sm', disabled: true })
    })

    bench('class-variance-authority', () => {
      cvaCompoundVariants({ color: 'danger', size: 'sm', disabled: true })
    })
  })
})
