import { describe, it, expect } from 'vitest'
import { cx } from '.'

describe('cx', async () => {
  it('string', () => {
    expect(cx('c1', '  c2  ')).toEqual('c1 c2')
  })

  it('number', () => {
    expect(cx(1, 2, 3)).toEqual('1 2 3')
  })

  it('null / undefined', () => {
    expect(cx('c1', null, undefined, 0)).toEqual('c1 0')
  })

  it('object', () => {
    expect(cx({ c1: true, c2: false, 3: true })).toEqual('3 c1')
  })

  it('array', () => {
    expect(cx([1, 'c1', ' c2  ', { c3: true, c4: false }])).toEqual('1 c1 c2 c3')
  })
})
