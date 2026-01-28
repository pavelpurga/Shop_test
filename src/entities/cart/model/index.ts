export { default as cartReducer, } from './cartSlice'
export { addToCart, removeFromCart, setQuantity, clearCart } from './cartSlice'
export { selectCartItems, selectCartCount, selectCartTotal } from './cartSlice'

export type { CartItem } from '../../../app/types'

