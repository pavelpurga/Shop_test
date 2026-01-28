import React, { useEffect, useState } from 'react'
import { ThemeContext, Theme } from '../lib/ThemeContext'

const THEME_KEY = 'theme'

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [theme, setThemeState] = useState<Theme>(() => {
        try {
            const stored = localStorage.getItem(THEME_KEY)
            if (stored === 'light' || stored === 'dark') return stored
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
        } catch (e) {}
        return 'light'
    })

    useEffect(() => {
        document.documentElement.classList.toggle('theme-dark', theme === 'dark')
        try {
            localStorage.setItem(THEME_KEY, theme)
        } catch (e) {}
    }, [theme])

    const toggle = () => setThemeState((t: Theme) => (t === 'dark' ? 'light' : 'dark'))
    const setTheme = (t: Theme) => setThemeState(t)

    return <ThemeContext.Provider value={{theme, toggle, setTheme}}>{children}</ThemeContext.Provider>
}

export default ThemeProvider
