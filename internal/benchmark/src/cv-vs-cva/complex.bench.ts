import { bench, describe } from 'vitest'
import { cvComplexButton } from '../shared/cv-configs'
import { cvaComplexButton } from '../shared/cva-configs'

describe('css-variants vs class-variance-authority: complex real-world', () => {
  describe('complex real-world button (defaults)', () => {
    bench('css-variants', () => {
      cvComplexButton()
    })

    bench('class-variance-authority', () => {
      cvaComplexButton()
    })
  })

  describe('complex real-world button (with overrides)', () => {
    bench('css-variants', () => {
      cvComplexButton({ variant: 'destructive', size: 'lg', className: 'w-full' })
    })

    bench('class-variance-authority', () => {
      cvaComplexButton({ variant: 'destructive', size: 'lg', className: 'w-full' })
    })
  })
})
