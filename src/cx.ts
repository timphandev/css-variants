type Arg = string | number | null | undefined | Record<string, boolean>

export const cx = (...args: (Arg | Arg[])[]) => {
  let className = ''
  let i = 0
  let arg: Arg | Arg[]
  let next: string

  for (i = 0; i < args.length; i++) {
    if ((arg = args[i])) {
      if (typeof arg === 'string') {
        className && (className += ' ')
        className += arg.trim()
      } else if (typeof arg === 'number') {
        className && (className += ' ')
        className += arg
      } else if (typeof arg === 'object') {
        if (Array.isArray(arg)) {
          if ((next = cx(...arg))) {
            className && (className += ' ')
            className += next
          }
        } else {
          for (const key in arg) {
            if (arg[key]) {
              className && (className += ' ')
              className += key
            }
          }
        }
      }
    }
  }

  return className
}

export default cx
