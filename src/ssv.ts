import { ObjectKeyPicker, ObjectKeyArrayPicker, PartialRecord, CssProperties } from './utils/types'
import { compact } from './utils/compact'
import { entries } from './utils/entries'

export type SlotStyleRecord<S extends string> = PartialRecord<S, CssProperties>

export type SlotStyleVariantRecord<S extends string> = Record<string, Record<string, SlotStyleRecord<S>>>

export interface SlotStyleVariantDefinition<S extends string, T extends SlotStyleVariantRecord<S> | undefined> {
  slots: S[]
  base?: SlotStyleRecord<S>
  variants?: T
  compoundVariants?: (ObjectKeyArrayPicker<T> & { styles: SlotStyleRecord<S> })[]
  defaultVariants?: ObjectKeyPicker<T>
}

export type SlotStyleVariantFn<S extends string, T extends SlotStyleVariantRecord<S> | undefined> = (
  props?: ObjectKeyPicker<T> & { styles?: SlotStyleRecord<S> }
) => Record<S, CssProperties>

export type SlotStyleVariantCreatorFn = <S extends string, T extends SlotStyleVariantRecord<S> | undefined>(
  config: SlotStyleVariantDefinition<S, T>
) => SlotStyleVariantFn<S, T>

/**
 * Creates a slot-based style variant function that composes CSS properties based on variants and compound variants.
 *
 * @param config - Configuration object for creating style variants
 * @returns A function that accepts variant props and returns composed styles for each slot
 *
 * @example
 * ```ts
 * const buttonStyles = csv({
 *   slots: ['root', 'icon'],
 *   base: {
 *     root: { padding: '8px' },
 *     icon: { size: '16px' }
 *   },
 *   variants: {
 *     size: {
 *       small: {
 *         root: { padding: '4px' },
 *         icon: { size: '12px' }
 *       },
 *       large: {
 *         root: { padding: '12px' },
 *         icon: { size: '20px' }
 *       }
 *     }
 *   }
 * });
 *
 * // Usage
 * const styles = buttonStyles({ size: 'small' });
 * // => { root: { padding: '4px' }, icon: { size: '12px' } }
 * ```
 */
export const ssv: SlotStyleVariantCreatorFn = (config) => {
  const { slots, base, variants, compoundVariants, defaultVariants } = config

  return (props) => {
    const { styles, ...rest } = props ?? {}

    const mergedProps = { ...defaultVariants, ...compact(rest) }

    const result = {} as Record<(typeof slots)[number], CssProperties>

    for (const slot of slots) {
      result[slot] = base?.[slot] ?? ({} as CssProperties)
    }

    if (variants) {
      for (const [key, value] of entries(mergedProps)) {
        const slotStyle = variants[key]?.[value as string]

        if (slotStyle) {
          for (const [slot, slotValue] of entries(slotStyle)) {
            result[slot] = { ...result[slot], ...slotValue }
          }
        }
      }
    }

    if (compoundVariants) {
      for (const { styles: slotStyle, ...compoundVariant } of compoundVariants) {
        if (
          entries(compoundVariant).every(([key, value]) =>
            Array.isArray(value) ? value.includes(mergedProps[key]) : value === mergedProps[key]
          )
        ) {
          for (const [slot, slotValue] of entries(slotStyle)) {
            result[slot] = { ...result[slot], ...slotValue }
          }
        }
      }
    }

    if (styles) {
      for (const [slot, slotValue] of entries(styles)) {
        result[slot] = { ...result[slot], ...slotValue }
      }
    }

    return result
  }
}

export default ssv
