import React, {PropsWithChildren} from 'react'
import {render as rtlRender} from '@testing-library/react'
import {Provider} from 'react-redux'
import {configureStore} from '@reduxjs/toolkit'
import cartReducer from '../../src/entities/cart/model/cartSlice'
import {MemoryRouter} from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ToastProvider from '../../src/app/providers/ToastProvider/ui/Toast'
import ThemeProvider from '../../src/app/providers/ThemeProvider/ui/ThemeProvider'

export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'

export function createTestStore(preloadedState?: any) {
  return configureStore({
    reducer: { cart: cartReducer },
    preloadedState,
  })
}

export function render(ui: React.ReactElement, {store, route = '/'}: {store?: any, route?: string} = {}) {
  const usedStore = store || createTestStore()
  const queryClient = new QueryClient()

  const Wrapper: React.FC<PropsWithChildren<{}>> = ({children}) => (
    <Provider store={usedStore}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[route]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ThemeProvider>
            <ToastProvider>{children}</ToastProvider>
          </ThemeProvider>
        </MemoryRouter>
      </QueryClientProvider>
    </Provider>
  )

  return { store: usedStore, ...rtlRender(ui, {wrapper: Wrapper}) }
}
