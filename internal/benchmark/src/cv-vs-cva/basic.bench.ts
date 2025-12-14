import { bench, describe } from 'vitest'
import { cvBaseOnly, cvSingleVariant, cvMultipleVariants, cvBooleanVariants, cvNoVariants } from '../shared/cv-configs'
import {
  cvaBaseOnly,
  cvaSingleVariant,
  cvaMultipleVariants,
  cvaBooleanVariants,
  cvaNoVariants,
} from '../shared/cva-configs'

describe('css-variants vs class-variance-authority: basic', () => {
  describe('base class only', () => {
    bench('css-variants', () => {
      cvBaseOnly()
    })

    bench('class-variance-authority', () => {
      cvaBaseOnly()
    })
  })

  describe('single variant', () => {
    bench('css-variants', () => {
      cvSingleVariant({ color: 'primary' })
    })

    bench('class-variance-authority', () => {
      cvaSingleVariant({ color: 'primary' })
    })
  })

  describe('multiple variants', () => {
    bench('css-variants', () => {
      cvMultipleVariants({ color: 'primary', size: 'md', variant: 'solid' })
    })

    bench('class-variance-authority', () => {
      cvaMultipleVariants({ color: 'primary', size: 'md', variant: 'solid' })
    })
  })

  describe('boolean variants', () => {
    bench('css-variants', () => {
      cvBooleanVariants({ disabled: true, loading: false, fullWidth: true })
    })

    bench('class-variance-authority', () => {
      cvaBooleanVariants({ disabled: true, loading: false, fullWidth: true })
    })
  })

  describe('no variants with className override', () => {
    bench('css-variants', () => {
      cvNoVariants({ className: 'extra' })
    })

    bench('class-variance-authority', () => {
      cvaNoVariants({ className: 'extra' })
    })
  })
})
