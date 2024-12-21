import { ObjectKeyPicker, ObjectKeyArrayPicker, PartialRecord } from './utils/types'
import { cx, ClassValue } from './cx'
import { compact } from './utils/compact'
import { entries } from './utils/entries'

export type SlotClassRecord<S extends string> = PartialRecord<S, ClassValue>

export type SlotClassVariantRecord<S extends string> = Record<string, Record<string, SlotClassRecord<S>>>

export interface SlotClassVariantDefinition<S extends string, T extends SlotClassVariantRecord<S> | undefined> {
  slots: S[]
  base?: SlotClassRecord<S>
  variants?: T
  compoundVariants?: (ObjectKeyArrayPicker<T> & { classNames: SlotClassRecord<S> })[]
  defaultVariants?: ObjectKeyPicker<T>
  classNameResolver?: typeof cx
}

export type SlotClassVariantFn<S extends string, T extends SlotClassVariantRecord<S> | undefined> = (
  props?: ObjectKeyPicker<T> & { classNames?: SlotClassRecord<S> }
) => Record<S, string>

export type SlotClassVariantCreatorFn = <S extends string, T extends SlotClassVariantRecord<S> | undefined>(
  config: SlotClassVariantDefinition<S, T>
) => SlotClassVariantFn<S, T>

/**
 * Creates a slot-based class variant function that manages class names for multiple slots with variants.
 *
 * @param config - Configuration object for creating the variant function
 * @returns A function that accepts variant props and returns class names for each slot
 *
 * @example
 * ```typescript
 * const button = scv({
 *   slots: ['root', 'icon'],
 *   base: {
 *     root: 'btn',
 *     icon: 'btn-icon'
 *   },
 *   variants: {
 *     size: {
 *       sm: {
 *         root: 'btn-sm',
 *         icon: 'icon-sm'
 *       },
 *       lg: {
 *         root: 'btn-lg',
 *         icon: 'icon-lg'
 *       }
 *     }
 *   },
 *   defaultVariants: {
 *     size: 'sm'
 *   }
 * })
 *
 * // Usage
 * const classes = button({ size: 'lg' })
 * // Result: { root: 'btn btn-lg', icon: 'btn-icon icon-lg' }
 * ```
 */
export const scv: SlotClassVariantCreatorFn = (config) => {
  const { slots, base, variants, compoundVariants, defaultVariants, classNameResolver = cx } = config

  return (props) => {
    const { classNames, ...rest } = props ?? {}

    const mergedProps = { ...defaultVariants, ...compact(rest) }

    const slotClassValues = {} as Record<(typeof slots)[number], ClassValue[]>

    for (const slot of slots) {
      if (base?.[slot]) {
        slotClassValues[slot] = Array.isArray(base[slot]) ? base[slot] : [base[slot]]
      } else {
        slotClassValues[slot] = []
      }
    }

    if (variants) {
      for (const [key, value] of entries(mergedProps)) {
        const slotClassValue = variants[key]?.[value as string]

        if (slotClassValue) {
          for (const [slot, slotValue] of entries(slotClassValue)) {
            slotClassValues[slot].push(slotValue)
          }
        }
      }
    }

    if (compoundVariants) {
      for (const { classNames: slotClassValue, ...compoundVariant } of compoundVariants) {
        if (
          entries(compoundVariant).every(([key, value]) =>
            Array.isArray(value) ? value.includes(mergedProps[key]) : value === mergedProps[key]
          )
        ) {
          for (const [slot, slotValue] of entries(slotClassValue)) {
            slotClassValues[slot].push(slotValue)
          }
        }
      }
    }

    if (classNames) {
      for (const [slot, slotValue] of entries(classNames)) {
        slotClassValues[slot].push(slotValue)
      }
    }

    const result = {} as Record<(typeof slots)[number], string>

    for (const [slot, classValues] of entries(slotClassValues)) {
      result[slot] = classNameResolver(...classValues)
    }

    return result
  }
}

export default scv
