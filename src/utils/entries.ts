export function entries<
  T extends object,
  TK extends Extract<keyof T, string>,
  TV extends T[TK],
  TEntry extends [TK, TV],
>(obj: T): TEntry[] {
  return Object.keys(obj).map((key) => [key, obj[key as TK]]) as TEntry[]
}
