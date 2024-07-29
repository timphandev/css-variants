export const entries = <
  T extends object,
  TK extends Extract<keyof T, string>,
  TV extends T[TK],
  TEntry extends [TK, TV],
>(
  obj: T
): TEntry[] => {
  return Object.keys(obj).map((key) => [key, obj[key as TK]]) as TEntry[]
}

export function fromEntries<A extends symbol | string | number, B>(entries: [A, B][]): { [key in A]: B } {
  const result: { [key in A]: B } = {} as { [key in A]: B }
  for (let i = 0; i < entries.length; i++) {
    result[entries[i][0]] = entries[i][1]
  }
  return result
}

export const compact = <T extends Record<string, unknown>>(obj: T) => {
  const newObj = {} as T

  for (const k in obj) {
    if (obj[k] !== undefined) {
      newObj[k] = obj[k]
    }
  }

  return newObj
}

export const match = <T1 extends object, T2 extends object>(obj1: T1, obj2: T2) => {
  for (const k in obj1) {
    const val1 = obj1[k]
    const val2 = obj2[k as unknown as keyof T2]
    if (Array.isArray(val1)) {
      if (!val1.includes(val2)) return false
    } else {
      if ((val1 as unknown) !== val2) return false
    }
  }
  return true
}
