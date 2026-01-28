import React from 'react'
import '@testing-library/jest-dom'
import { vi, describe, it, expect } from 'vitest'
import { render, screen } from '../../../../../config/tests/test-utils'

vi.mock('../../shared/ui/ResponsiveImage/ResponsiveImage', () => ({ default: (props: any) => React.createElement('img', { alt: props.alt, src: props.src }) }))
vi.mock('../../shared/ui/Skeleton/SkeletonLoader', () => ({ default: () => React.createElement('div', { 'data-testid': 'skeleton' }) }))

import ProductCard from './ProductCard'

const product = { id: 1, title: 'Prod', price: 12.5, description: 'd', category: 'c', image: '', rating: { rate: 4, count: 20 } }

describe('ProductCard', () => {
  it('renders product info and add to cart button', async () => {
    render(<ProductCard product={product} />)
    expect(await screen.findByText('Prod')).toBeTruthy()
    expect(await screen.findByText(/Add to cart/i)).toBeTruthy()
  })
})
