import { compact, entries, fromEntries, match } from './utils'
import { PartialRecord, RequireAtLeastOne, SlotVariantCreatorFn, VariantStyle } from './types'

const push = <K extends string>(
  data: PartialRecord<K, VariantStyle>,
  key: K,
  value: string | Partial<VariantStyle>
) => {
  if (data[key] === undefined) data[key] = { className: '', style: {} }

  if (typeof value === 'string') {
    data[key].className && (data[key].className += ' ')
    data[key].className += value
  } else {
    if (value.className) {
      data[key].className && (data[key].className += ' ')
      data[key].className += value.className
    }

    if (value.style) {
      data[key].style = { ...data[key].style, ...value.style }
    }
  }
}

export const csv: SlotVariantCreatorFn = (config) => {
  const { slots, base, variants, compoundVariants, defaultVariants, onDone } = config
  return (props) => {
    const { classNames: propClassNames, styles: propStyles, ...rest } = props ?? {}

    const variantProps = { ...defaultVariants, ...compact(rest) }
    const data: PartialRecord<(typeof slots)[number], VariantStyle> = {}
    let tmp: Partial<Record<(typeof slots)[number], string | RequireAtLeastOne<VariantStyle>>>

    if (base) {
      for (const [key, value] of entries(base)) {
        if (value) {
          push(data, key, value)
        }
      }
    }

    if (variants) {
      for (const [key, variant] of entries(variants)) {
        if ((tmp = variant[variantProps[key] as string])) {
          for (const [key, value] of entries(tmp)) {
            if (value) {
              push(data, key, value)
            }
          }
        }
      }
    }

    if (compoundVariants) {
      for (const { classNames: cvClassNames, styles: cvStyles, ...compoundVariant } of compoundVariants) {
        if (match(compoundVariant, variantProps)) {
          if (cvClassNames) {
            for (const [key, value] of entries(cvClassNames)) push(data, key, { className: value })
          }
          if (cvStyles) {
            for (const [key, value] of entries(cvStyles)) push(data, key, { style: value })
          }
        }
      }
    }

    if (propClassNames) {
      for (const [key, value] of entries(propClassNames)) push(data, key, { className: value })
    }

    if (propStyles) {
      for (const [key, value] of entries(propStyles)) push(data, key, { style: value })
    }

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
