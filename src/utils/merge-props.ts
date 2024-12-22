export function mergeProps<T extends Record<string, unknown>>(defaultProps: T, props: T) {
  const newObj = { ...defaultProps }

  for (const k in props) {
    if (props[k] !== undefined) {
      newObj[k] = props[k]
    }
  }

  return newObj
}
