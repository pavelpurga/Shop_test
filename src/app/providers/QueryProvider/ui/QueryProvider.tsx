import React, {useEffect, useMemo} from 'react'
import {QueryClient, QueryClientProvider, dehydrate, hydrate} from '@tanstack/react-query'

const RQ_CACHE_KEY = 'rq_cache_v1'

const createClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            cacheTime: 1000 * 60 * 60 * 24,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            keepPreviousData: true,
            retry: 1,
        },
    },
})

const QueryProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const queryClient = useMemo(() => createClient(), [])

    useEffect(() => {
        try {
            const raw = localStorage.getItem(RQ_CACHE_KEY)
            if (raw) {
                const parsed = JSON.parse(raw)
                hydrate(queryClient, parsed)
            }
        } catch (e) {
        }

        let saveTimer: any = null
        const persist = () => {
            clearTimeout(saveTimer)
            saveTimer = setTimeout(() => {
                try {
                    const state = dehydrate(queryClient)
                    localStorage.setItem(RQ_CACHE_KEY, JSON.stringify(state))
                } catch (e) {
                }
            }, 300)
        }

        const qc = queryClient.getQueryCache()
        const unsub = qc.subscribe(() => persist())

        const onVisibility = () => {
            if (document.visibilityState === 'hidden') persist()
        }
        window.addEventListener('visibilitychange', onVisibility)
        window.addEventListener('beforeunload', persist)

        return () => {
            unsub()
            window.removeEventListener('visibilitychange', onVisibility)
            window.removeEventListener('beforeunload', persist)
            clearTimeout(saveTimer)
        }
    }, [queryClient])

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

export default QueryProvider

