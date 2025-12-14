import { bench, describe } from 'vitest'
import { scvComplexCard, scvManySlots } from '../shared/scv-configs'
import { tvSlotsComplexCard, tvSlotsManySlots } from '../shared/tv-slots-configs'

describe('css-variants (scv) vs tailwind-variants slots: complex real-world', () => {
  describe('complex real-world card (defaults, 7 slots)', () => {
    bench('css-variants (scv)', () => {
      scvComplexCard()
    })

    bench('tailwind-variants (slots)', () => {
      const { root, header, title, description, content, footer, actions } = tvSlotsComplexCard()
      root()
      header()
      title()
      description()
      content()
      footer()
      actions()
    })
  })

  describe('complex real-world card (with overrides, 7 slots)', () => {
    bench('css-variants (scv)', () => {
      scvComplexCard({
        variant: 'elevated',
        size: 'lg',
        hoverable: true,
        classNames: { root: 'w-full' },
      })
    })

    bench('tailwind-variants (slots)', () => {
      const { root, header, title, description, content, footer, actions } = tvSlotsComplexCard({
        variant: 'elevated',
        size: 'lg',
        hoverable: true,
      })
      root({ class: 'w-full' })
      header()
      title()
      description()
      content()
      footer()
      actions()
    })
  })

  describe('many slots stress test (8 slots)', () => {
    bench('css-variants (scv)', () => {
      scvManySlots({ theme: 'dark' })
    })

    bench('tailwind-variants (slots)', () => {
      const { slot1, slot2, slot3, slot4, slot5, slot6, slot7, slot8 } = tvSlotsManySlots({ theme: 'dark' })
      slot1()
      slot2()
      slot3()
      slot4()
      slot5()
      slot6()
      slot7()
      slot8()
    })
  })
})
