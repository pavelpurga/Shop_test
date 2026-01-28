import { describe, it, expect, beforeEach } from 'vitest'
import { loadState, saveState, loadCachedState, saveCachedState } from './localStorage'

beforeEach(() => {
  localStorage.clear()
})

describe('localStorage utils', () => {
  it('saveState and loadState roundtrip', () => {
    const key = 'test:key'
    const obj = { a: 1, b: 'two' }
    saveState(key, obj)
    const loaded = loadState<typeof obj>(key)
    expect(loaded).toEqual(obj)
  })

  it('loadState returns undefined for missing key', () => {
    expect(loadState('missing')).toBeUndefined()
  })

  it('loadState handles invalid JSON gracefully', () => {
    localStorage.setItem('bad', 'not-json')
    const v = loadState('bad')
    expect(v).toBeUndefined()
  })

  it('saveCachedState and loadCachedState returns value if not expired', () => {
    const key = 'cached:test'
    const value = { x: 5 }
    saveCachedState(key, value)
    const v = loadCachedState<typeof value>(key, 1000)
    expect(v).toEqual(value)
  })

  it('loadCachedState returns undefined and clears item when expired', () => {
    const key = 'cached:expired'
    const env = { t: Date.now() - 5000, v: { x: 1 } }
    localStorage.setItem(key, JSON.stringify(env))
    const v = loadCachedState(key, 1000)
    expect(v).toBeUndefined()
    expect(localStorage.getItem(key)).toBeNull()
  })

  it('loadCachedState returns value without ttl check when ttl not provided', () => {
    const key = 'cached:notttl'
    const env = { t: Date.now() - 1000000, v: { x: 9 } }
    localStorage.setItem(key, JSON.stringify(env))
    const v = loadCachedState<typeof env.v>(key)
    expect(v).toEqual(env.v)
  })
})

