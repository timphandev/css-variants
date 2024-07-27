import { cx } from './cx'
import { compact, entries, match } from './utils'
import { CssProperties, VariantCreatorFn, VariantStyle } from './types'

const push = (data: { classNames: string[]; style: CssProperties }, value?: string | Partial<VariantStyle>) => {
  if (typeof value === 'string') {
    data.classNames.push(value)
  } else {
    if (value?.className) {
      data.classNames.push(value.className)
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

    const data: { classNames: string[]; style: CssProperties } = { classNames: [], style: {} }

    const variantProps = { ...defaultVariants, ...compact(rest) }

    if (base) {
      push(data, base)
    }

    for (const [propKey, propValue] of entries(variantProps)) {
      push(data, variants?.[propKey]?.[propValue as string])
    }

    for (const { className: cvClassName, style: cvStyle, ...compoundVariant } of compoundVariants ?? []) {
      if (match(compoundVariant, variantProps)) {
        push(data, { className: cvClassName, style: cvStyle })
      }
    }

    if (propClassName || propStyle) {
      push(data, { className: propClassName, style: propStyle })
    }

    const css = { className: cx(data.classNames), style: data.style }

    if (onDone) return onDone(css)

    return css
  }

export default cv
