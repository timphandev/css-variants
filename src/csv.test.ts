import { describe, it, expect, vi } from 'vitest'
import { csv } from '.'

describe('csv', () => {
  it('no slots', () => {
    expect(csv({ slots: [] })()).toEqual({})
    expect(csv({ slots: [], base: {} })()).toEqual({})
  })

  it('no variants', () => {
    expect(csv({ slots: ['root'] })()).toEqual({ root: { className: '', style: {} } })
    expect(csv({ slots: ['root'], base: {} })()).toEqual({ root: { className: '', style: {} } })
    expect(csv({ slots: ['root'], base: { root: 'root' } })()).toEqual({ root: { className: 'root', style: {} } })
  })

  it('variants', () => {
    const component = csv({
      slots: ['root', 'title'],
      variants: {
        color: {
          red: {
            root: 'root-red',
            title: {
              className: 'title-red',
            },
          },
        },
      },
    })

    expect(component()).toEqual({
      root: { className: '', style: {} },
      title: { className: '', style: {} },
    })
    expect(component({ color: 'red' })).toEqual({
      root: { className: 'root-red', style: {} },
      title: { className: 'title-red', style: {} },
    })
    expect(component({ color: 'red', classNames: { root: 'class' }, styles: { title: { fontSize: 10 } } })).toEqual({
      root: { className: 'root-red class', style: {} },
      title: { className: 'title-red', style: { fontSize: 10 } },
    })
  })

  it('variants - with default', () => {
    const component = csv({
      slots: ['root', 'title'],
      variants: {
        color: {
          red: {
            root: 'root-red',
            title: 'title-red',
          },
        },
      },
      defaultVariants: {
        color: 'red',
      },
    })

    expect(component()).toEqual({
      root: { className: 'root-red', style: {} },
      title: { className: 'title-red', style: {} },
    })
    expect(component({ classNames: { root: 'class' } })).toEqual({
      root: { className: 'root-red class', style: {} },
      title: { className: 'title-red', style: {} },
    })
  })

  it('compound variants', () => {
    const component = csv({
      slots: ['root', 'title'],
      variants: {
        color: {
          red: {
            root: 'root-red',
            title: 'title-red',
          },
          blue: {
            root: 'root-blue',
            title: 'title-blue',
          },
        },
        size: {
          sm: {
            root: 'root-sm',
            title: 'title-sm',
          },
          md: {
            root: 'root-md',
            title: 'title-md',
          },
        },
      },
      compoundVariants: [
        {
          color: 'red',
          size: 'sm',
          classNames: {
            root: 'root-red-sm',
          },
          styles: {
            title: {
              fontSize: 20,
            },
          },
        },
      ],
    })

    expect(component({ color: 'red', size: 'sm' })).toEqual({
      root: {
        className: 'root-red root-sm root-red-sm',
        style: {},
      },
      title: {
        className: 'title-red title-sm',
        style: { fontSize: 20 },
      },
    })
  })

  it('onDone', () => {
    const onDone = vi.fn((css) => css)

    const component = csv({ slots: ['root'], base: { root: 'root' }, onDone })
    expect(component()).toEqual({ root: { className: 'root', style: {} } })
    expect(onDone).toBeCalledTimes(1)
  })
})
