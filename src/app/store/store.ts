import { configureStore } from '@reduxjs/toolkit'
import { cartReducer } from '../../entities/cart/model'
import { loadState, saveState, loadCachedState, saveCachedState } from '../../shared/lib/localeStorage/localStorage'
import type { RootState as RootStateType } from './types'

const PERSIST_KEY = 'shop_cart_v1'
const PERSIST_TTL_MS = 1000 * 60 * 60 * 24 * 30 // 30 days

function debounce(fn: (...args: any[]) => void, wait = 200) {
  let t: any
  return (...args: any[]) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...args), wait)
  }
}

const preloaded = loadCachedState<{ items: any[] }>(PERSIST_KEY, PERSIST_TTL_MS) || loadState<{ items: any[] }>(PERSIST_KEY) || undefined

export const store = configureStore({
  reducer: {
    cart: (cartReducer as any),
  },
  preloadedState: {
    cart: preloaded,
  },
})

// local type describing the bit we access
type RootStateLocal = { cart: { items: Array<{ product: any; quantity: number }> } }

const persistedSave = debounce(() => {
  const state = store.getState() as RootStateLocal
  try {
    saveCachedState(PERSIST_KEY, { items: state.cart.items })
  } catch (e) {
    saveState(PERSIST_KEY, { items: state.cart.items })
  }
}, 300)

store.subscribe(() => {
  persistedSave()
})

export type RootState = RootStateType
export type AppDispatch = typeof store.dispatch

export default store
