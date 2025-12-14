import { ObjectKeyPicker, ObjectKeyArrayPicker, PartialRecord, CssProperties } from './utils/types.js'
import { mergeProps } from './utils/merge-props.js'

export type SlotStyleRecord<S extends string> = PartialRecord<S, CssProperties>

export type SlotStyleVariantRecord<S extends string> = Record<string, Record<string, SlotStyleRecord<S>>>

export type SlotStyleVariantExtendProps<S extends string> = { styles: SlotStyleRecord<S> }

export interface SlotStyleVariantDefinition<S extends string, T extends SlotStyleVariantRecord<S> | undefined> {
  slots: S[]
  base?: SlotStyleRecord<S>
  variants?: T
  compoundVariants?: (ObjectKeyArrayPicker<T> & SlotStyleVariantExtendProps<S>)[]
  defaultVariants?: ObjectKeyPicker<T>
}

export type SlotStyleVariantFnProps<
  S extends string,
  T extends SlotStyleVariantRecord<S> | undefined,
> = T extends undefined
  ? Partial<SlotStyleVariantExtendProps<S>>
  : ObjectKeyPicker<T> & Partial<SlotStyleVariantExtendProps<S>>

export type SlotStyleVariantFn<S extends string, T extends SlotStyleVariantRecord<S> | undefined> = (
  props?: SlotStyleVariantFnProps<S, T>
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
    const mergedProps = mergeProps(defaultVariants, props, ['styles'])

    const result = {} as Record<(typeof slots)[number], CssProperties>

    for (const slot of slots) {
      result[slot] = { ...base?.[slot] }
    }

    for (const key in mergedProps) {
      const slotStyle = variants[key]?.[mergedProps[key] as string]

      if (slotStyle) {
        for (const slot in slotStyle) {
          Object.assign(result[slot], slotStyle[slot])
        }
      }
    }

    if (compoundVariants) {
      for (let i = 0; i < compoundVariants.length; i++) {
        const compound = compoundVariants[i]
        let matches = true

        for (const key in compound) {
          if (key === 'styles') continue
          const value = compound[key as keyof typeof compound]
          const propValue = mergedProps[key]

          if (Array.isArray(value) ? !value.includes(propValue) : value !== propValue) {
            matches = false
            break
          }
        }

        if (matches && compound.styles) {
          for (const slot in compound.styles) {
            Object.assign(result[slot], compound.styles[slot])
          }
        }
      }
    }

    if (props?.styles) {
      for (const slot in props.styles) {
        Object.assign(result[slot], props.styles[slot])
      }
    }

    return result
  }
}

export default ssv
