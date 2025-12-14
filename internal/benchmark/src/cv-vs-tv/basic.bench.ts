import { bench, describe } from 'vitest'
import { cvBaseOnly, cvSingleVariant, cvMultipleVariants, cvBooleanVariants, cvNoVariants } from '../shared/cv-configs'
import { tvBaseOnly, tvSingleVariant, tvMultipleVariants, tvBooleanVariants, tvNoVariants } from '../shared/tv-configs'

describe('css-variants vs tailwind-variants: basic', () => {
  describe('base class only', () => {
    bench('css-variants', () => {
      cvBaseOnly()
    })

    bench('tailwind-variants', () => {
      tvBaseOnly()
    })
  })

  describe('single variant', () => {
    bench('css-variants', () => {
      cvSingleVariant({ color: 'primary' })
    })

    bench('tailwind-variants', () => {
      tvSingleVariant({ color: 'primary' })
    })
  })

  describe('multiple variants', () => {
    bench('css-variants', () => {
      cvMultipleVariants({ color: 'primary', size: 'md', variant: 'solid' })
    })

    bench('tailwind-variants', () => {
      tvMultipleVariants({ color: 'primary', size: 'md', variant: 'solid' })
    })
  })

  describe('boolean variants', () => {
    bench('css-variants', () => {
      cvBooleanVariants({ disabled: true, loading: false, fullWidth: true })
    })

    bench('tailwind-variants', () => {
      tvBooleanVariants({ disabled: true, loading: false, fullWidth: true })
    })
  })

  describe('no variants with className override', () => {
    bench('css-variants', () => {
      cvNoVariants({ className: 'extra' })
    })

    // Note: tailwind-variants uses 'class' instead of 'className'
    bench('tailwind-variants', () => {
      tvNoVariants({ class: 'extra' })
    })
  })
})
