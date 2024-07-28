import { compact, entries, fromEntries, match } from './utils'
import { PartialRecord, SlotVariantCreatorFn, VariantStyle } from './types'

const push = <K extends string>(
  data: PartialRecord<K, VariantStyle>,
  key: K,
  value?: string | Partial<VariantStyle>
) => {
  if (value) {
    if (data[key] === undefined) {
      data[key] = { className: '', style: {} }
    }

    if (typeof value === 'string') {
      data[key].className += (data[key].className ? ' ' : '') + value.trim()
    } else {
      if (value.className) {
        data[key].className += (data[key].className ? ' ' : '') + value.className.trim()
      }

      if (value.style) {
        data[key].style = { ...data[key].style, ...value.style }
      }
    }
  }
}

export const csv: SlotVariantCreatorFn = (config) => {
  const { slots, base, variants, compoundVariants, defaultVariants, onDone } = config
  return (props) => {
    const { classNames: propClassNames, styles: propStyles, ...rest } = props ?? {}

    const data: PartialRecord<(typeof slots)[number], VariantStyle> = {}

    const variantProps = { ...defaultVariants, ...compact(rest) }

    for (const [key, value] of entries(base)) {
      push(data, key, value)
    }

    for (const [propKey, propValue] of entries(variantProps)) {
      for (const [key, value] of entries(variants?.[propKey]?.[propValue as string])) {
        push(data, key, value)
      }
    }

    for (const { classNames: cvClassNames, styles: cvStyles, ...compoundVariant } of compoundVariants ?? []) {
      if (match(compoundVariant, variantProps)) {
        for (const [key, value] of entries(cvClassNames)) push(data, key, { className: value })
        for (const [key, value] of entries(cvStyles)) push(data, key, { style: value })
      }
    }

    for (const [key, value] of entries(propClassNames)) push(data, key, { className: value })
    for (const [key, value] of entries(propStyles)) push(data, key, { style: value })

    const css = fromEntries(
      slots.map((slot) => [
        slot,
        {
          className: data[slot]?.className ?? '',
          style: data[slot]?.style ?? {},
        },
      ])
    )

    if (onDone) return onDone(css)

    return css
  }
}

export default csv
