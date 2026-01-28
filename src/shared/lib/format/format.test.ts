import {describe, it, expect} from 'vitest'
import {formatPrice} from './format'

describe('formatPrice', () => {
    it('formats numbers with two decimals and dollar sign', () => {
        expect(formatPrice(10)).toBe('$10.00')
        expect(formatPrice(0)).toBe('$0.00')
        expect(formatPrice(3.5)).toBe('$3.50')
        expect(formatPrice(3.456)).toBe('$3.46')
    })
})

