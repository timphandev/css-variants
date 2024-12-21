import { CssProperties, ObjectKeyArrayPicker, ObjectKeyPicker } from './utils/types'
import { compact } from './utils/compact'
import { entries } from './utils/entries'

export type StyleVariantRecord = Record<string, Record<string, CssProperties>>

export interface StyleVariantDefinition<T extends StyleVariantRecord | undefined> {
  base?: CssProperties
  variants?: T
  compoundVariants?: (ObjectKeyArrayPicker<T> & { style: CssProperties })[]
  defaultVariants?: ObjectKeyPicker<T>
}

export type StyleVariantFn<T extends StyleVariantRecord | undefined> = (
  props?: ObjectKeyPicker<T> & { style?: CssProperties }
) => CssProperties

export type StyleVariantCreatorFn = <T extends StyleVariantRecord | undefined>(
  config: StyleVariantDefinition<T>
) => StyleVariantFn<T>

/**
 * Creates a style variant function based on the provided configuration.
 *
 * @template T - The type of the style variant record.
 * @param {StyleVariantDefinition<T>} config - The configuration object for style variants.
 * @returns {StyleVariantFn<T>} A function that takes props and returns the computed CSS properties.
 *
 * @example
 * ```typescript
 *
 * const makeStyle = sv({
 *   base: { color: 'black' },
 *   variants: {
 *     size: {
 *       small: { fontSize: '12px' },
 *       large: { fontSize: '24px' }
 *     }
 *   },
 *   compoundVariants: [
 *     { size: 'large', style: { fontWeight: 'bold' } }
 *   ],
 *   defaultVariants: { size: 'small' }
 * });
 *
 * const style = makeStyle({ size: 'large' });
 * // style = { color: 'black', fontSize: '24px', fontWeight: 'bold' }
 * ```
 */
export const sv: StyleVariantCreatorFn = (config) => {
  const { base, variants, compoundVariants, defaultVariants } = config
  return (props) => {
    const { style, ...rest } = props ?? {}

    let result: CssProperties = { ...base }

    const mergedProps = { ...defaultVariants, ...compact(rest) }

    if (variants) {
      for (const [key, variant] of entries(variants)) {
        const s = variant[mergedProps[key] as string]
        if (s) {
          result = { ...result, ...s }
        }
      }
    }

    if (compoundVariants) {
      for (const { style: s, ...compoundVariant } of compoundVariants) {
        if (
          entries(compoundVariant).every(([key, value]) =>
            Array.isArray(value) ? value.includes(mergedProps[key]) : value === mergedProps[key]
          )
        ) {
          result = { ...result, ...s }
        }
      }
    }

    if (style) {
      result = { ...result, ...style }
    }

    return result
  }
}

export default sv
