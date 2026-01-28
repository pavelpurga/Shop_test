import React from 'react'
import '@testing-library/jest-dom'
import { describe, it, expect } from 'vitest'
import { render, screen } from '../../../../config/tests/test-utils'
import Cart from './Cart'
import { addToCart } from '../../../entities/cart/model'

describe('Cart', () => {
  it('shows empty state when no items', () => {
    render(<Cart />)
    expect(screen.getByText(/Your cart is empty/i)).toBeTruthy()
  })

  it('renders items from store when added', async () => {
    const { store } = render(<Cart />)
    store.dispatch(addToCart({ product: { id: 1, title: 'X', price: 10, description: '', category: '', image: '', rating: { rate: 4, count: 10 } }, quantity: 2 }))
    expect(await screen.findByText('X')).toBeTruthy()
    expect(screen.getByText('$10.00')).toBeTruthy()
  })
})
