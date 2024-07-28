import { describe, it, expect, vi } from 'vitest'
import { cv } from '.'

describe('cv', async () => {
  it('no variants', () => {
    const component = cv({})
    expect(component()).toEqual({ className: '', style: {} })
    expect(
      component({
        className: 'class',
        style: {
          fontSize: 20,
        },
      })
    ).toEqual({
      className: 'class',
      style: { fontSize: 20 },
    })

    expect(cv({ base: 'base' })({ className: 'class' })).toEqual({ className: 'base class', style: {} })
  })

  it('variants', () => {
    const component = cv({
      variants: {
        color: {
          red: 'red',
          blue: {
            className: 'blue',
          },
          green: {
            style: { color: 'green' },
          },
          yellow: {
            className: 'yellow',
            style: { color: 'yellow' },
          },
        },
      },
    })

    expect(component({ color: 'red' })).toEqual({ className: 'red', style: {} })
    expect(component({ color: 'blue' })).toEqual({ className: 'blue', style: {} })
    expect(component({ color: 'green' })).toEqual({ className: '', style: { color: 'green' } })
    expect(component({ color: 'green', className: 'class' })).toEqual({ className: 'class', style: { color: 'green' } })
    expect(component({ color: 'yellow' })).toEqual({ className: 'yellow', style: { color: 'yellow' } })
  })

  it('variants with default', () => {
    const component = cv({
      variants: {
        color: {
          red: 'red',
          blue: 'blue',
        },
      },
      defaultVariants: {
        color: 'red',
      },
    })

    expect(component()).toEqual({ className: 'red', style: {} })
    expect(component({ color: undefined })).toEqual({ className: 'red', style: {} })
  })

  it('compound variants', () => {
    const component = cv({
      variants: {
        color: {
          red: 'red',
          blue: 'blue',
          green: 'green',
        },
        size: {
          sm: 'sm',
          lg: {
            className: 'lg',
            style: {
              fontSize: 20,
            },
          },
        },
      },
      compoundVariants: [
        {
          color: 'red',
          size: 'sm',
          className: 'red-sm',
        },
        {
          color: ['blue', 'green'],
          size: 'lg',
          className: 'blue-lg',
          style: {
            padding: 20,
          },
        },
      ],
    })

    expect(component({ color: 'red', size: 'sm' })).toEqual({ className: 'red sm red-sm', style: {} })
    expect(component({ color: 'blue', size: 'lg' })).toEqual({
      className: 'blue lg blue-lg',
      style: {
        fontSize: 20,
        padding: 20,
      },
    })
  })

  it('onDone', () => {
    const onDone = vi.fn((css) => css)

    const component = cv({ base: 'base', onDone })
    expect(component()).toEqual({ className: 'base', style: {} })
    expect(onDone).toBeCalledTimes(1)
  })
})
