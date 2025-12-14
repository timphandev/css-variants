export function mergeProps<T extends Record<string, unknown>, P extends Record<string, unknown>>(
  defaultProps: T | undefined,
  props: P | undefined,
  omitKeys?: (keyof P)[]
): Record<string, unknown> {
  const merged: Record<string, unknown> = { ...defaultProps }

  if (props) {
    for (const k in props) {
      if (props[k] !== undefined && (!omitKeys || !omitKeys.includes(k))) {
        merged[k] = props[k]
      }
    }
  }

  return merged
}
