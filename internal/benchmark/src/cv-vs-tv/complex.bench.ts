import { bench, describe } from 'vitest'
import { cvComplexButton } from '../shared/cv-configs'
import { tvComplexButton } from '../shared/tv-configs'

describe('css-variants vs tailwind-variants: complex real-world', () => {
  describe('complex real-world button (defaults)', () => {
    bench('css-variants', () => {
      cvComplexButton()
    })

    bench('tailwind-variants', () => {
      tvComplexButton()
    })
  })

  describe('complex real-world button (with overrides)', () => {
    bench('css-variants', () => {
      cvComplexButton({ variant: 'destructive', size: 'lg', className: 'w-full' })
    })

    // Note: tailwind-variants uses 'class' instead of 'className'
    bench('tailwind-variants', () => {
      tvComplexButton({ variant: 'destructive', size: 'lg', class: 'w-full' })
    })
  })
})
