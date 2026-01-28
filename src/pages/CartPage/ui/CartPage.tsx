import React from 'react'
import Cart from '../../../shared/ui/Cart/Cart'
import EmptyState from '../../../shared/ui/EmptyState/EmptyState'
import { useAppSelector } from '../../../app/store/hooks'
import { selectCartItems } from '../../../entities/cart/model'

const CartPage: React.FC = () => {
    const items = useAppSelector(selectCartItems)

    return (
        <div>
            <h1>Cart</h1>
            {items.length === 0 ? (
                <EmptyState title="Your cart is empty" message="Add products to your cart to see them here."
                            cta={{label: 'Go to catalog', to: '/'}}/>
            ) : (
                <Cart/>
            )}
        </div>
    )
}

export default CartPage
