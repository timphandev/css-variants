import { concat } from './utils'

type Arg = string | number | null | undefined | Record<string, boolean>

export const cx = (...args: (Arg | Arg[])[]) => {
  let className = ''

  for (const arg of args) {
    if (typeof arg === 'string') {
      className = concat(className, arg)
      continue
    }

    if (typeof arg === 'number') {
      className = concat(className, arg)
      continue
    }

    if (arg && typeof arg === 'object') {
      if (Array.isArray(arg)) {
        className = concat(className, cx(...arg))
        continue
      }

      for (const key in arg) {
        if (arg[key]) {
          className = concat(className, key)
        }
      }

      continue
    }
  }

  return className
}

export default cx
