import { ObjectKeyPicker, ObjectKeyArrayPicker } from './utils/types'
import { compact } from './utils/compact'
import { cx, ClassValue } from './cx'

export type ClassVariantRecord = Record<string, Record<string, ClassValue>>

export interface ClassVariantDefinition<T extends ClassVariantRecord | undefined> {
  base?: ClassValue
  variants?: T
  compoundVariants?: (ObjectKeyArrayPicker<T> & { className: ClassValue })[]
  defaultVariants?: ObjectKeyPicker<T>
  classNameResolver?: typeof cx
}

export type ClassVariantFn<T extends ClassVariantRecord | undefined> = (
  props?: ObjectKeyPicker<T> & { className?: ClassValue }
) => string

export type ClassVariantCreatorFn = <T extends ClassVariantRecord | undefined>(
  config: ClassVariantDefinition<T>
) => ClassVariantFn<T>

/**
 * Creates a class variant function that combines base classes, variants, compound variants, and default variants.
 *
 * @template T - Type of the variant record
 * @param config - Configuration object for creating class variants
 * @returns A function that accepts variant props and returns a combined class string
 *
 * @example
 * ```typescript
 * const button = cv({
 *   base: 'px-4 py-2 rounded',
 *   variants: {
 *     color: {
 *       primary: 'bg-blue-500 text-white',
 *       secondary: 'bg-gray-500 text-white'
 *     },
 *     size: {
 *       sm: 'text-sm',
 *       lg: 'text-lg'
 *     }
 *   },
 *   defaultVariants: {
 *     color: 'primary',
 *     size: 'sm'
 *   }
 * });
 *
 * button(); // => 'px-4 py-2 rounded bg-blue-500 text-white text-sm'
 * button({ color: 'secondary' }); // => 'px-4 py-2 rounded bg-gray-500 text-white text-sm'
 * ```
 */
export const cv: ClassVariantCreatorFn = (config) => {
  const { base, variants, compoundVariants, defaultVariants, classNameResolver = cx } = config
  return (props) => {
    const { className, ...rest } = props ?? {}

    if (!variants) return classNameResolver(base, className)

    const mergedProps = { ...defaultVariants, ...compact(rest) }

    const classValues: ClassValue[] = []

    for (const key in mergedProps) {
      const classValue = variants[key][mergedProps[key] as string]
      if (classValue) {
        classValues.push(classValue)
      }
    }

    if (compoundVariants) {
      for (const { className: classValue, ...compoundVariant } of compoundVariants) {
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
          classValues.push(classValue)
        }
      }
    }

    return classNameResolver(base, classValues, className)
  }
}

export default cv
