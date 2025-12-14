import { ObjectKeyPicker, ObjectKeyArrayPicker, PartialRecord } from './utils/types.js'
import { cx, ClassValue } from './cx.js'
import { mergeProps } from './utils/merge-props.js'

export type SlotClassRecord<S extends string> = PartialRecord<S, ClassValue>

export type SlotClassVariantRecord<S extends string> = Record<string, Record<string, SlotClassRecord<S>>>

export type SlotClassVariantExtendProps<S extends string> = { classNames: SlotClassRecord<S> }

export interface SlotClassVariantDefinition<S extends string, T extends SlotClassVariantRecord<S> | undefined> {
  slots: S[]
  base?: SlotClassRecord<S>
  variants?: T
  compoundVariants?: (ObjectKeyArrayPicker<T> & SlotClassVariantExtendProps<S>)[]
  defaultVariants?: ObjectKeyPicker<T>
  classNameResolver?: typeof cx
}

export type SlotClassVariantFnProps<
  S extends string,
  T extends SlotClassVariantRecord<S> | undefined,
> = T extends undefined
  ? Partial<SlotClassVariantExtendProps<S>>
  : ObjectKeyPicker<T> & Partial<SlotClassVariantExtendProps<S>>

export type SlotClassVariantFn<S extends string, T extends SlotClassVariantRecord<S> | undefined> = (
  props?: SlotClassVariantFnProps<S, T>
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

  if (!variants) {
    return (props) => {
      const result = {} as Record<(typeof slots)[number], string>

      for (const slot of slots) {
        result[slot] = classNameResolver(base?.[slot], props?.classNames?.[slot])
      }

      return result
    }
  }

  return (props) => {
    const mergedProps = mergeProps(defaultVariants, props, ['classNames'])

    const slotClassValues = {} as Record<(typeof slots)[number], ClassValue[]>

    for (const slot of slots) {
      if (base?.[slot]) {
        slotClassValues[slot] = Array.isArray(base[slot]) ? [...base[slot]] : [base[slot]]
      } else {
        slotClassValues[slot] = []
      }
    }

    for (const key in mergedProps) {
      const cls = variants[key]?.[mergedProps[key] as string]

      if (cls) {
        for (const slot in cls) {
          slotClassValues[slot]?.push(cls[slot])
        }
      }
    }

    if (compoundVariants) {
      for (let i = 0; i < compoundVariants.length; i++) {
        const compound = compoundVariants[i]
        let matches = true
        for (const key in compound) {
          if (key === 'classNames') continue
          const value = compound[key as keyof typeof compound]
          const propValue = mergedProps[key]
          if (Array.isArray(value) ? !value.includes(propValue) : value !== propValue) {
            matches = false
            break
          }
        }
        if (matches && compound.classNames) {
          for (const slot in compound.classNames) {
            slotClassValues[slot]?.push(compound.classNames[slot])
          }
        }
      }
    }

    if (props?.classNames) {
      for (const slot in props.classNames) {
        slotClassValues[slot]?.push(props.classNames[slot])
      }
    }

    const result = {} as Record<(typeof slots)[number], string>

    for (const slot in slotClassValues) {
      result[slot] = classNameResolver(slotClassValues[slot])
    }

    return result
  }
}

export default scv
