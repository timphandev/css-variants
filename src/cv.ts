import { compact, entries, match } from './utils'
import { VariantCreatorFn, VariantStyle } from './types'

const push = (data: VariantStyle, value: string | Partial<VariantStyle>) => {
  if (typeof value === 'string') {
    data.className && (data.className += ' ')
    data.className += value.trim()
  } else {
    if (value?.className) {
      data.className && (data.className += ' ')
      data.className += value.className.trim()
    }
    if (value?.style) {
      data.style = { ...data.style, ...value.style }
    }
  }
}

export const cv: VariantCreatorFn = (config) => {
  const { base, variants, compoundVariants, defaultVariants, onDone } = config
  return (props) => {
    const { className: propClassName, style: propStyle, ...rest } = props ?? {}

    const css: VariantStyle = { className: '', style: {} }

    const variantProps = { ...defaultVariants, ...compact(rest) }

    if (base) {
      push(css, base)
    }

    for (const [propKey, propValue] of entries(variantProps)) {
      const value = variants?.[propKey]?.[propValue as string]
      if (value) {
        push(css, value)
      }
    }

    if (compoundVariants?.length) {
      for (const { className: cvClassName, style: cvStyle, ...compoundVariant } of compoundVariants) {
        if (match(compoundVariant, variantProps)) {
          push(css, { className: cvClassName, style: cvStyle })
        }
      }
    }

    if (propClassName) {
      css.className && (css.className += ' ')
      css.className += propClassName
    }

    if (propStyle) {
      css.style = { ...css.style, ...propStyle }
    }

    if (onDone) return onDone(css)

    return css
  }
}

export default cv
