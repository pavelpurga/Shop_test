import { describe, it, expect } from 'vitest'
import { stripProtocol, buildResizedUrl, buildSrcSet } from './image'

describe('image utils', () => {
  it('stripProtocol removes http/https', () => {
    expect(stripProtocol('https://example.com/img.png')).toBe('example.com/img.png')
    expect(stripProtocol('http://example.com/img.png')).toBe('example.com/img.png')
    expect(stripProtocol('ftp://example.com/img.png')).toBe('ftp://example.com/img.png')
  })

  it('buildResizedUrl builds expected url with width and fit', () => {
    const url = buildResizedUrl('https://fakestoreapi.com/img/test.png', 200)
    expect(url).toContain('images.weserv.nl')
    expect(url).toContain('w=200')
    expect(url).toContain('fit=contain')
  })

  it('buildResizedUrl adds output param for webp when format true or webp', () => {
    const a = buildResizedUrl('https://fakestoreapi.com/img/test.png', 100, true)
    const b = buildResizedUrl('https://fakestoreapi.com/img/test.png', 100, 'webp')
    expect(a).toContain('output=webp')
    expect(b).toContain('output=webp')
  })

  it('buildResizedUrl adds avif when format=avif', () => {
    const u = buildResizedUrl('https://fakestoreapi.com/img/test.png', 150, 'avif')
    expect(u).toContain('output=avif')
  })

  it('buildResizedUrl includes quality and height when provided', () => {
    const u = buildResizedUrl('https://fakestoreapi.com/img/test.png', 120, 'webp', 60, 80)
    expect(u).toContain('q=60')
    expect(u).toContain('h=80')
  })

  it('buildSrcSet returns comma-separated set of urls with widths', () => {
    const s = buildSrcSet('https://fakestoreapi.com/img/test.png', [100,200,300])
    expect(s.split(',').length).toBe(3)
    expect(s).toContain('100w')
    expect(s).toContain('300w')
  })
})

