import { CssProperties, ObjectKeyArrayPicker, ObjectKeyPicker } from './utils/types'
import { mergeProps } from './utils/merge-props'

export type StyleVariantRecord = Record<string, Record<string, CssProperties>>

export type StyleVariantExtendProps = { style: CssProperties }

export interface StyleVariantDefinition<T extends StyleVariantRecord | undefined> {
  base?: CssProperties
  variants?: T
  compoundVariants?: (ObjectKeyArrayPicker<T> & StyleVariantExtendProps)[]
  defaultVariants?: ObjectKeyPicker<T>
}

export type StyleVariantFnProps<T extends StyleVariantRecord | undefined> = T extends undefined
  ? Partial<StyleVariantExtendProps>
  : ObjectKeyPicker<T> & Partial<StyleVariantExtendProps>

export type StyleVariantFn<T extends StyleVariantRecord | undefined> = (props?: StyleVariantFnProps<T>) => CssProperties

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

  if (!variants) {
    return (props) => ({ ...base, ...props?.style })
  }

  return (props) => {
    const { style, ...rest } = props ?? {}

    let result: CssProperties = { ...base }

    const mergedProps: Record<string, unknown> = defaultVariants ? mergeProps(defaultVariants, rest) : rest

    for (const key in mergedProps) {
      const styleValue = variants[key][mergedProps[key] as string]
      if (styleValue) {
        result = { ...result, ...styleValue }
      }
    }

    if (compoundVariants) {
      for (const { style: styleValue, ...compoundVariant } of compoundVariants) {
        let matches = true
        for (const key in compoundVariant) {
          const value = compoundVariant[key as keyof typeof compoundVariant]
          const propValue = mergedProps[key]
          if (Array.isArray(value) ? !value.includes(propValue) : value !== propValue) {
            matches = false
            break
          }
        }
        if (matches) {
          result = { ...result, ...styleValue }
        }
      }
    }

    return { ...result, ...style }
  }
}

export default sv
