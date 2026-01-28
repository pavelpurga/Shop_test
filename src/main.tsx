import React, { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './app/App'
import { store } from './app/store/store'
import './app/styles/index.css'
import {ErrorBoundary} from "./app/providers/ErrorBoundary";
import {ThemeProvider} from "./app/providers/ThemeProvider";
import QueryProvider from "./app/providers/QueryProvider";
import ToastProvider from "./app/providers/ToastProvider";
import SkeletonLoader from "./shared/ui/Skeleton";

try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual' } catch (e) {}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryProvider>
        <ThemeProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ErrorBoundary>
              <Suspense fallback={<SkeletonLoader variant="grid" />}>
                <ToastProvider>
                  <App />
                </ToastProvider>
              </Suspense>
            </ErrorBoundary>
          </BrowserRouter>
        </ThemeProvider>
      </QueryProvider>
    </Provider>
  </React.StrictMode>
)

if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(reg => {
            console.log('Service worker registered', reg.scope)
        }).catch(err => console.warn('Service worker registration failed', err))
    })
}
