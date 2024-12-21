export function compact<T extends Record<string, unknown>>(obj: T) {
  const newObj = {} as T

  for (const k in obj) {
    if (obj[k] !== undefined) {
      newObj[k] = obj[k]
    }
  }

  return newObj
}
