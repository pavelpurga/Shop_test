import React, {useEffect, useRef, useState} from 'react'

interface Props {
    value: number
    duration?: number
    format?: (v: number) => string
}

const AnimatedNumber: React.FC<Props> = ({value, duration = 400, format}) => {
    const [display, setDisplay] = useState<number>(value)
    const rafRef = useRef<number | null>(null)
    const startRef = useRef<number | null>(null)
    const fromRef = useRef<number>(value)

    useEffect(() => {
        // cancel any running animation
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current)
            rafRef.current = null
        }
        startRef.current = null
        fromRef.current = display

        const animate = (ts: number) => {
            if (!startRef.current) startRef.current = ts
            const elapsed = ts - startRef.current
            const t = Math.min(1, elapsed / duration)
            const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
            const next = fromRef.current + (value - fromRef.current) * eased
            setDisplay(next)
            if (t < 1) {
                rafRef.current = requestAnimationFrame(animate)
            } else {
                rafRef.current = null
                setDisplay(value)
            }
        }

        rafRef.current = requestAnimationFrame(animate)

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
    }, [value, duration])

    const out = format ? format(display) : String(display.toFixed(2))
    return <span>{out}</span>
}

export default AnimatedNumber

