import React from 'react'
import styles from './EmptyState.module.css'
import Button from '../Button/Button'
import {useNavigate} from 'react-router-dom'

interface Props {
    title: string
    message?: string
    cta?: { label: string, to?: string, onClick?: () => void }
    illustration?: React.ReactNode
}

const EmptyState: React.FC<Props> = ({title, message, cta, illustration}) => {
    const navigate = useNavigate()
    return (
        <div className={styles.root} role="status">
            <div className={styles.art}>{illustration || (
                <svg width="160" height="120" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg"
                     aria-hidden>
                    <rect x="12" y="20" width="136" height="80" rx="8" fill="var(--surface)"
                          stroke="var(--control-border)"/>
                    <circle cx="50" cy="60" r="16" fill="var(--primary)"/>
                    <rect x="80" y="48" width="52" height="8" rx="4" fill="var(--muted)"/>
                    <rect x="80" y="64" width="36" height="8" rx="4" fill="var(--muted)"/>
                </svg>
            )}</div>
            <h3 className={styles.title}>{title}</h3>
            {message && <p className={styles.message}>{message}</p>}
            {cta && (
                <div className={styles.cta}>
                    <Button variant="primary" onClick={() => {
                        if (cta.onClick) return cta.onClick()
                        if (cta.to) navigate(cta.to)
                    }}>{cta.label}</Button>
                </div>
            )}
        </div>
    )
}

export default EmptyState
