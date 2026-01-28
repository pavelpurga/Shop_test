import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CartItem, Product } from '../../../app/types'

type RootStateCart = { cart: { items: CartItem[] } }

interface CartState {
    items: CartItem[]
}

const initialState: CartState = {
    items: [],
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<{ product: Product; quantity?: number }>) => {
            const {product, quantity = 1} = action.payload
            const stock = (product.rating?.count) || 0
            const existing = state.items.find((i) => i.product.id === product.id)
            if (existing) {
                existing.quantity = Math.min(stock, existing.quantity + quantity)
            } else {
                const q = Math.min(stock, quantity)
                if (q > 0) state.items.push({id: product.id, product, quantity: q})
            }
        },
        removeFromCart: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter((i) => i.product.id !== action.payload)
        },
        setQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
            const it = state.items.find((i) => i.product.id === action.payload.id)
            if (it) {
                const stock = (it.product.rating?.count) || 0
                it.quantity = Math.max(1, Math.min(stock || 1, action.payload.quantity))
            }
        },
        clearCart: (state) => {
            state.items = []
        },
    },
})

export const {addToCart, removeFromCart, setQuantity, clearCart} = cartSlice.actions

export const selectCartItems = (state: RootStateCart) => state.cart.items
export const selectCartCount = (state: RootStateCart) => state.cart.items.reduce((s: number, it: CartItem) => s + it.quantity, 0)
export const selectCartTotal = (state: RootStateCart) => state.cart.items.reduce((s: number, it: CartItem) => s + it.product.price * it.quantity, 0)

export default cartSlice.reducer
