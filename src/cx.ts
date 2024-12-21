// credit: https://github.com/lukeed/clsx

export type ClassDictionary = Record<string, unknown>
export type ClassValue = ClassValue[] | string | number | bigint | ClassDictionary | null | boolean | undefined
export type ClassArray = ClassValue[]

function toVal(input: ClassValue): string {
  if (typeof input === 'string') {
    return input
  }

  if (typeof input === 'number' || typeof input === 'bigint') {
    return String(input)
  }

  if (input === null || input === undefined || typeof input === 'boolean') {
    return ''
  }

  let result = ''

  if (Array.isArray(input)) {
    let i = 0
    let tmpClassValue: ClassValue
    let tmpClassName: string
    for (; i < input.length; i++) {
      if ((tmpClassValue = input[i])) {
        if ((tmpClassName = toVal(tmpClassValue))) {
          if (result) result += ' '
          result += tmpClassName
        }
      }
    }

    return result
  }

  for (const key in input) {
    if (input[key]) {
      result && (result += ' ')
      result += key
    }
  }

  return result
}

export function cx(...args: ClassValue[]): string {
  let result = ''
  let i = 0
  let tmpClassValue: ClassValue
  let tmpClassName: string

  for (; i < args.length; i++) {
    if ((tmpClassValue = args[i])) {
      if ((tmpClassName = toVal(tmpClassValue))) {
        if (result) result += ' '
        result += tmpClassName
      }
    }
  }

  return result
}

export default cx
