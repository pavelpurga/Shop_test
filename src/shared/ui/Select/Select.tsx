import React, {useEffect, useRef, useState} from 'react'
import styles from './Select.module.css'

interface Option {
    value: string;
    label: string
}

interface Props {
    value: string
    onChange: (v: string) => void
    options: Option[]
    placeholder?: string
    ariaLabel?: string
    className?: string
    forceCustom?: boolean
    variant?: 'default' | 'sort'
}

const isMobileMatch = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 767px)').matches

const Select: React.FC<Props> = ({
                                     value,
                                     onChange,
                                     options,
                                     placeholder,
                                     ariaLabel,
                                     className,
                                     forceCustom,
                                     variant = 'default'
                                 }) => {
    const [isMobile, setIsMobile] = useState(false)
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        setIsMobile(isMobileMatch())
        const mql = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(max-width: 767px)') : null
        const handler = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile((e as MediaQueryList).matches)
        if (mql && mql.addEventListener) mql.addEventListener('change', handler)
        else if (mql && mql.addListener) mql.addListener(handler)
        return () => {
            if (mql && mql.removeEventListener) mql.removeEventListener('change', handler)
            else if (mql && mql.removeListener) mql.removeListener(handler)
        }
    }, [])

    useEffect(() => {
        if (!open) return
        const onDoc = (e: MouseEvent) => {
            if (!ref.current) return
            if (!(e.target instanceof Node)) return
            if (!ref.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', onDoc)
        return () => document.removeEventListener('mousedown', onDoc)
    }, [open])

    const selectedLabel = () => {
        const found = options.find(o => o.value === value)
        if (found) return found.label
        return placeholder || ''
    }

    if (!isMobile && !forceCustom) {
        return (
            <div className={`${styles.root} ${className || ''}`}>
                <select
                    className={styles.select}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    aria-label={ariaLabel}
                >
                    {options.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>
                <span className={styles.chev} aria-hidden>
          ▾
        </span>
            </div>
        )
    }

    // Mobile: custom dropdown to control option layout
    return (
        <div className={`${styles.root} ${className || ''}`} ref={ref}>
            <button
                type="button"
                className={`${styles.mobileToggle} ${open ? styles.open : ''}`}
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen(s => !s)}
            >
                <span className={styles.mobileLabel}>{selectedLabel() || placeholder}</span>
                {variant === 'sort' ? (
                    <span className={styles.sortToggleIcon} aria-hidden>
            {/* single chevron that will rotate */}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                             aria-hidden>
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
                    strokeLinejoin="round" fill="none"/>
            </svg>
          </span>
                ) : (
                    <span className={styles.chev} aria-hidden>▾</span>
                )}
            </button>

            {open && (
                <div className={styles.menu} role="listbox" tabIndex={-1}>
                    {options.map(o => (
                        <button
                            key={o.value}
                            type="button"
                            role="option"
                            aria-selected={o.value === value}
                            className={`${styles.menuItem} ${o.value === value ? styles.menuItemActive : ''}`}
                            onClick={() => {
                                onChange(o.value);
                                setOpen(false)
                            }}
                        >
                            <span className={styles.menuItemLabel}>{o.label}</span>
                            <span className={styles.menuItemCheck} aria-hidden>
                {o.value === value ? '✓' : ''}
              </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Select
