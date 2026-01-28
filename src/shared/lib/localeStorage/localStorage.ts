export const loadState = <T>(key: string): T | undefined => {
    try {
        const raw = localStorage.getItem(key)
        if (!raw) return undefined
        return JSON.parse(raw) as T
    } catch (e) {
        console.warn('Failed to load from localStorage', e)
        return undefined
    }
}

export const saveState = <T>(key: string, state: T) => {
    try {
        localStorage.setItem(key, JSON.stringify(state))
    } catch (e) {
        console.warn('Failed to save to localStorage', e)
    }
}

interface CachedEnvelope<T> {
    t: number
    v: T
}

export const loadCachedState = <T>(key: string, ttlMs?: number): T | undefined => {
    try {
        const raw = localStorage.getItem(key)
        if (!raw) return undefined
        const env = JSON.parse(raw) as CachedEnvelope<T>
        if (typeof env?.t !== 'number') return env.v as T
        if (ttlMs && Date.now() - env.t > ttlMs) {
            localStorage.removeItem(key)
            return undefined
        }
        return env.v
    } catch (e) {
        console.warn('Failed to load cached state from localStorage', e)
        return undefined
    }
}

export const saveCachedState = <T>(key: string, state: T) => {
    try {
        const env: CachedEnvelope<T> = {t: Date.now(), v: state}
        localStorage.setItem(key, JSON.stringify(env))
    } catch (e) {
        console.warn('Failed to save cached state to localStorage', e)
    }
}
