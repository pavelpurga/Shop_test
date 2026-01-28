import { createContext } from 'react'

type Toast = { id: number; message: string; type?: 'success' | 'info' | 'error' }

export interface ToastContextValue {
  push: (message: string, type?: Toast['type']) => void
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export default ToastContext

