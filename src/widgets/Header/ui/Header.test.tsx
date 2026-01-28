import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '../../../../config/tests/test-utils'
import Header from './Header'

describe('Header', () => {
  it('renders logo and cart badge', () => {
    const { store } = render(<Header />)
    expect(screen.getByText('ShopTest')).toBeTruthy()
    expect(screen.queryByText('0')).toBeNull()
  })
})
