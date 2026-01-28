import type { CartItem } from '../types'

export interface RootState {
  cart: {
    items: CartItem[]
  }
}
