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
    const result: CssProperties = { ...base }

    const mergedProps = mergeProps(defaultVariants, props, ['style'])

    for (const key in mergedProps) {
      const styleValue = variants[key]?.[mergedProps[key] as string]
      if (styleValue) {
        Object.assign(result, styleValue)
      }
    }

    if (compoundVariants) {
      for (let i = 0; i < compoundVariants.length; i++) {
        const compound = compoundVariants[i]
        let matches = true
        for (const key in compound) {
          if (key === 'style') continue
          const value = compound[key as keyof typeof compound]
          const propValue = mergedProps[key]
          if (Array.isArray(value) ? !value.includes(propValue) : value !== propValue) {
            matches = false
            break
          }
        }
        if (matches && compound.style) {
          Object.assign(result, compound.style)
        }
      }
    }

    if (props?.style) {
      Object.assign(result, props.style)
    }

    return result
  }
}

export default sv
