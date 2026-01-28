const BASE = 'https://fakestoreapi.com'
const DEFAULT_TIMEOUT = 10000

async function request<T>(path: string, init: RequestInit = {}, timeout = DEFAULT_TIMEOUT): Promise<{ data: T }> {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)
    try {
        const res = await fetch(`${BASE}${path}`, {...init, signal: controller.signal})
        clearTimeout(id)
        if (!res.ok) {
            const text = await res.text().catch(() => '')
            throw new Error(`Request failed ${res.status} ${res.statusText} ${text}`)
        }
        const data = await res.json()
        return {data}
    } finally {
        clearTimeout(id)
    }
}

export const api = {
    get: <T = any>(path: string) => request<T>(path, {method: 'GET'}),
}
