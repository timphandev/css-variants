import { bench, describe } from 'vitest'
import { cvWithDefaults, cvWithClassName } from '../shared/cv-configs'
import { cvaWithDefaults, cvaWithClassName } from '../shared/cva-configs'

describe('css-variants vs class-variance-authority: defaults & overrides', () => {
  describe('with default variants (no props)', () => {
    bench('css-variants', () => {
      cvWithDefaults()
    })

    bench('class-variance-authority', () => {
      cvaWithDefaults()
    })
  })

  describe('with default variants (override one)', () => {
    bench('css-variants', () => {
      cvWithDefaults({ size: 'lg' })
    })

    bench('class-variance-authority', () => {
      cvaWithDefaults({ size: 'lg' })
    })
  })

  describe('with className override', () => {
    bench('css-variants', () => {
      cvWithClassName({ color: 'primary', className: 'custom-class extra-class' })
    })

    bench('class-variance-authority', () => {
      cvaWithClassName({ color: 'primary', className: 'custom-class extra-class' })
    })
  })
})
