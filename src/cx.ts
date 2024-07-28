type Arg = string | number | null | undefined | Record<string, boolean>

export const cx = (...args: (Arg | Arg[])[]) => {
  let className = ''

  for (const arg of args) {
    if (typeof arg === 'string') {
      className += (className ? ' ' : '') + arg.trim()
      continue
    }

    if (typeof arg === 'number') {
      className += (className ? ' ' : '') + arg
      continue
    }

    if (arg && typeof arg === 'object') {
      if (Array.isArray(arg)) {
        className += (className ? ' ' : '') + cx(...arg)
        continue
      }

      for (const key in arg) {
        if (arg[key]) {
          className += (className ? ' ' : '') + key.trim()
        }
      }

      continue
    }
  }

  return className
}

export default cx
