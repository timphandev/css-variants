import { describe, it, expect } from 'vitest'
import { cx } from '.'

describe('cx', () => {
  it('returns empty string for no args', () => {
    expect(cx()).toBe('')
  })

  it('returns empty string for falsy values', () => {
    expect(cx(null, undefined, false, true, '')).toBe('')
  })

  it('handles strings', () => {
    expect(cx('foo')).toBe('foo')
    expect(cx('foo', 'bar')).toBe('foo bar')
  })

  it('handles numbers', () => {
    expect(cx(1, 2)).toBe('1 2')
  })

  it('handles bigints', () => {
    expect(cx(BigInt(1), BigInt(2))).toBe('1 2')
  })

  it('handles arrays', () => {
    expect(cx(['foo', 'bar'])).toBe('foo bar')
    expect(cx(['foo'], ['bar'])).toBe('foo bar')
    expect(cx(['foo', ['bar']])).toBe('foo bar')
  })

  it('handles objects', () => {
    expect(cx({ foo: true, bar: false })).toBe('foo')
    expect(cx({ foo: true, bar: true })).toBe('foo bar')
    expect(cx({ 'foo-bar': true })).toBe('foo-bar')
  })

  it('handles mixed inputs', () => {
    expect(cx('foo', { bar: true }, ['baz'])).toBe('foo bar baz')
    expect(cx('foo', { bar: false }, ['baz', null])).toBe('foo baz')
  })
})
