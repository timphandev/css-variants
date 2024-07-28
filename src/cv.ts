import { compact, concat, entries, match } from './utils'
import { VariantCreatorFn, VariantStyle } from './types'

const push = (data: VariantStyle, value?: string | Partial<VariantStyle>) => {
  if (typeof value === 'string') {
    if (value.trim()) {
      data.className = concat(data.className, value)
    }
  } else {
    if (value?.className) {
      data.className = concat(data.className, value?.className)
    }

    if (value?.style) {
      data.style = { ...data.style, ...value.style }
    }
  }
}

export const cv: VariantCreatorFn =
  ({ base, variants, compoundVariants, defaultVariants, onDone }) =>
  (props) => {
    const { className: propClassName, style: propStyle, ...rest } = props ?? {}

    const css: VariantStyle = { className: '', style: {} }

    const variantProps = { ...defaultVariants, ...compact(rest) }

    if (base) {
      push(css, base)
    }

    for (const [propKey, propValue] of entries(variantProps)) {
      push(css, variants?.[propKey]?.[propValue as string])
    }

    if (compoundVariants?.length) {
      for (const { className: cvClassName, style: cvStyle, ...compoundVariant } of compoundVariants) {
        if (match(compoundVariant, variantProps)) {
          push(css, { className: cvClassName, style: cvStyle })
        }
      }
    }

    if (propClassName || propStyle) {
      push(css, { className: propClassName, style: propStyle })
    }

    if (onDone) return onDone(css)

    return css
  }

export default cv
