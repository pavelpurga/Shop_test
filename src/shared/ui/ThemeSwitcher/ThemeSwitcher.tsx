import React from 'react'
import styles from './ThemeSwitcher.module.css'
import { useTheme } from '../../../app/providers/ThemeProvider'

const IconMoon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="var(--moon-color)" />
  </svg>
)

const IconSun = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M12 4.5v-2" stroke="var(--sun-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 21.5v-2" stroke="var(--sun-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 12h-2" stroke="var(--sun-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21.5 12h-2" stroke="var(--sun-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.6 5.6l-1.4-1.4" stroke="var(--sun-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19.8 19.8l-1.4-1.4" stroke="var(--sun-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19.8 4.2l-1.4 1.4" stroke="var(--sun-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.6 18.4l-1.4 1.4" stroke="var(--sun-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="3" fill="var(--sun-color)" stroke="var(--sun-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ThemeSwitcher: React.FC = () => {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'
  return (
    <button className={styles.btn} onClick={toggle} aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}>
      {isDark ? <IconSun /> : <IconMoon />}
    </button>
  )
}

export default ThemeSwitcher
