import { ObjectKeyPicker, ObjectKeyArrayPicker, PartialRecord, CssProperties } from './utils/types'
import { compact } from './utils/compact'

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

  if (!variants) {
    return (props) => {
      const result = {} as Record<(typeof slots)[number], CssProperties>

      for (const slot of slots) {
        result[slot] = { ...base?.[slot], ...props?.styles?.[slot] }
      }

      return result
    }
  }

  return (props) => {
    const { styles, ...rest } = props ?? {}

    const mergedProps: Record<string, unknown> = defaultVariants ? { ...defaultVariants, ...compact(rest) } : rest

    const result = {} as Record<(typeof slots)[number], CssProperties>

    for (const slot of slots) {
      result[slot] = base?.[slot] ?? {}
    }

    for (const key in mergedProps) {
      const slotStyle = variants[key]?.[mergedProps[key] as string]

      if (slotStyle) {
        for (const slot in slotStyle) {
          result[slot] = { ...result[slot], ...slotStyle[slot] }
        }
      }
    }

    if (compoundVariants) {
      for (const { styles: slotStyle, ...compoundVariant } of compoundVariants) {
        let matches = true

        for (const key in compoundVariant) {
          const value = compoundVariant[key]
          const propValue = mergedProps[key]

          if (Array.isArray(value) ? !value.includes(propValue) : value !== propValue) {
            matches = false
            break
          }
        }

        if (matches) {
          for (const slot in slotStyle) {
            result[slot] = { ...result[slot], ...slotStyle[slot] }
          }
        }
      }
    }

    if (styles) {
      for (const slot in styles) {
        result[slot] = { ...result[slot], ...styles[slot] }
      }
    }

    return result
  }
}

export default ssv
