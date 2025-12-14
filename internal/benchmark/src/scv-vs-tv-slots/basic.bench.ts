import { bench, describe } from 'vitest'
import {
  scvBaseOnly,
  scvSingleVariant,
  scvMultipleSlots,
  scvMultipleVariants,
  scvNoVariants,
} from '../shared/scv-configs'
import {
  tvSlotsBaseOnly,
  tvSlotsSingleVariant,
  tvSlotsMultipleSlots,
  tvSlotsMultipleVariants,
  tvSlotsNoVariants,
} from '../shared/tv-slots-configs'

describe('css-variants (scv) vs tailwind-variants slots: basic', () => {
  describe('base slots only (2 slots)', () => {
    bench('css-variants (scv)', () => {
      scvBaseOnly()
    })

    bench('tailwind-variants (slots)', () => {
      const { root, content } = tvSlotsBaseOnly()
      root()
      content()
    })
  })

  describe('single variant (2 slots)', () => {
    bench('css-variants (scv)', () => {
      scvSingleVariant({ color: 'primary' })
    })

    bench('tailwind-variants (slots)', () => {
      const { root, icon } = tvSlotsSingleVariant({ color: 'primary' })
      root()
      icon()
    })
  })

  describe('multiple slots (4 slots)', () => {
    bench('css-variants (scv)', () => {
      scvMultipleSlots({ size: 'md' })
    })

    bench('tailwind-variants (slots)', () => {
      const { root, header, body, footer } = tvSlotsMultipleSlots({ size: 'md' })
      root()
      header()
      body()
      footer()
    })
  })

  describe('multiple variants (4 slots)', () => {
    bench('css-variants (scv)', () => {
      scvMultipleVariants({ variant: 'info', size: 'md' })
    })

    bench('tailwind-variants (slots)', () => {
      const { root, title, description, icon } = tvSlotsMultipleVariants({ variant: 'info', size: 'md' })
      root()
      title()
      description()
      icon()
    })
  })

  describe('no variants (optimized path)', () => {
    bench('css-variants (scv)', () => {
      scvNoVariants({ classNames: { root: 'extra' } })
    })

    bench('tailwind-variants (slots)', () => {
      const { root, content } = tvSlotsNoVariants({ class: 'extra' })
      root()
      content()
    })
  })
})
