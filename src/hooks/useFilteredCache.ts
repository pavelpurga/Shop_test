import {useRef} from 'react'
import type {Product} from '../app/types'

type Params = {
    search: string
    sort: string
    category: string
}

type CacheEntry = {
    ts: number
    result: Product[]
}

const TTL = 1000 * 60 * 5 // 5 minutes
const STORAGE_KEY = 'filteredCache_v1'

const makeKey = (products: Product[], params: Params) => {
    const ids = products.map(p => String(p.id)).join(',')
    return `${ids}|len=${products.length}|cat=${params.category}|s=${params.search}|sort=${params.sort}`
}

const readStorage = (): Record<string, CacheEntry> => {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY)
        if (!raw) return {}
        return JSON.parse(raw)
    } catch (e) {
        return {}
    }
}

const writeStorage = (data: Record<string, CacheEntry>) => {
    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (e) {}
}

export default function useFilteredCache(products: Product[], params: Params) {
    const cacheRef = useRef<Record<string, CacheEntry> | null>(null)
    if (cacheRef.current === null) {
        cacheRef.current = readStorage()
    }

    const key = makeKey(products, params)
    const now = Date.now()

    const existing = cacheRef.current[key]
    if (existing && now - existing.ts < TTL) {
        return existing.result
    }

    let list = products.slice()
    const q = (params.search || '').trim().toLowerCase()
    if (q) list = list.filter(p => p.title.toLowerCase().includes(q))
    if (params.sort === 'price_asc') list.sort((a, b) => a.price - b.price)
    else if (params.sort === 'price_desc') list.sort((a, b) => b.price - a.price)
    else if (params.sort === 'title_az') list.sort((a, b) => a.title.localeCompare(b.title))
    else if (params.sort === 'title_za') list.sort((a, b) => b.title.localeCompare(a.title))

    cacheRef.current[key] = {ts: now, result: list}

    try {
        const store = readStorage()
        store[key] = {ts: now, result: list}
        const cutoff = now - TTL * 3
        for (const k in store) {
            if (store[k].ts < cutoff) delete store[k]
        }
        writeStorage(store)
    } catch (e) {}

    return list
}

