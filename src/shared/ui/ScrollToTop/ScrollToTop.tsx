import React, {useEffect, useState} from 'react'
import styles from './ScrollToTop.module.css'

export const ScrollToTop: React.FC = () => {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const onScroll = () => {
            setVisible(window.scrollY > 300)
        }
        onScroll()
        window.addEventListener('scroll', onScroll, {passive: true})
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const onClick = () => {
        const headerEl = document.querySelector('header') as HTMLElement | null
        const headerH = headerEl ? headerEl.offsetHeight : 0
        window.scrollTo({top: headerH, behavior: 'smooth'})
    }

    return (
        <button
            aria-label="Scroll to top"
            className={`${styles.root} ${visible ? styles.visible : ''}`}
            onClick={onClick}
        >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M6 15l6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                      strokeLinejoin="round"/>
            </svg>
        </button>
    )
}
