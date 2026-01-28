import React, { useState, useCallback } from 'react'
import { ToastContext } from '../lib/ToastContext'

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<{ id: number; message: string; type?: 'success' | 'info' | 'error' }[]>([])
  const push = useCallback((message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Date.now()
    setToasts((s) => [...s, { id, message, type }])
    setTimeout(() => setToasts((s) => s.filter((t) => t.id !== id)), 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div style={{
        position: 'fixed',
        left: '50%',
        top: '15%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        pointerEvents: 'none'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {toasts.map((t) => {
            const bg = t.type === 'error' ? 'var(--danger)' : t.type === 'success' ? 'var(--success)' : 'var(--surface)'
            const color = t.type ? 'var(--primary-contrasted)' : 'var(--text)'
            return (
              <div key={t.id} style={{
                pointerEvents: 'auto',
                marginBottom: 8,
                padding: '10px 14px',
                borderRadius: 8,
                color,
                background: bg,
                boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
                minWidth: 240,
                textAlign: 'center'
              }}>
                {t.message}
              </div>
            )
          })}
        </div>
      </div>
    </ToastContext.Provider>
  )
}

export default ToastProvider
