import { bench, describe } from 'vitest'
import { cvWithDefaults, cvWithClassName } from '../shared/cv-configs'
import { tvWithDefaults, tvWithClassName } from '../shared/tv-configs'

describe('css-variants vs tailwind-variants: defaults & overrides', () => {
  describe('with default variants (no props)', () => {
    bench('css-variants', () => {
      cvWithDefaults()
    })

    bench('tailwind-variants', () => {
      tvWithDefaults()
    })
  })

  describe('with default variants (override one)', () => {
    bench('css-variants', () => {
      cvWithDefaults({ size: 'lg' })
    })

    bench('tailwind-variants', () => {
      tvWithDefaults({ size: 'lg' })
    })
  })

  describe('with className override', () => {
    bench('css-variants', () => {
      cvWithClassName({ color: 'primary', className: 'custom-class extra-class' })
    })

    // Note: tailwind-variants uses 'class' instead of 'className'
    bench('tailwind-variants', () => {
      tvWithClassName({ color: 'primary', class: 'custom-class extra-class' })
    })
  })
})
