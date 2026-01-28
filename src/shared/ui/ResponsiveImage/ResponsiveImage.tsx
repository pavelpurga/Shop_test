import React, {useRef, useState} from 'react'
import {buildSrcSet, buildResizedUrl} from '../../lib/image/image'
import styles from './ResponsiveImage.module.css'

interface Props {
    src: string
    alt: string
    className?: string
    priority?: boolean
    qualityWebp?: number
    qualityJpg?: number
    qualityAvif?: number
    maxWidth?: number
    maxHeight?: number | string
    sizes?: string
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))

const CANDIDATE_WIDTHS = [120, 160, 220, 320, 480, 640, 800, 1200, 1600]

// simple AVIF support check
const supportsAvif = () => {
    try {
        const canvas = document.createElement('canvas')
        if (!canvas.getContext) return false
        // Some browsers may not support avif in canvas; try toDataURL
        const res = canvas.toDataURL('image/avif')
        return res.indexOf('data:image/avif') === 0
    } catch (e) {
        return false
    }
}

const THRESHOLD = 2 // px
const DEBOUNCE_MS = 100

const ResponsiveImage: React.FC<Props> = ({
                                              src,
                                              alt,
                                              className = '',
                                              priority = false,
                                              qualityWebp = 55,
                                              qualityJpg = 75,
                                              qualityAvif = 50,
                                              maxWidth = 1600,
                                              maxHeight,
                                              sizes
                                          }) => {
    const wrapRef = useRef<HTMLDivElement | null>(null)
    const [width, setWidth] = useState<number>(0)
    const [height, setHeight] = useState<number>(0)

    // refs for stabilization
    const lastW = useRef<number>(0)
    const lastH = useRef<number>(0)
    const timer = useRef<number | null>(null)
    const roRef = useRef<ResizeObserver | null>(null)
    const attachedRef = useRef<boolean>(false)

    // callback ref to avoid useEffect — setup/teardown happens here
    const setWrapRef = (el: HTMLDivElement | null) => {
        // teardown previous
        if (wrapRef.current && roRef.current) {
            try {
                roRef.current.disconnect()
            } catch (e) { /* ignore */
            }
            roRef.current = null
        }
        if (attachedRef.current) {
            window.removeEventListener('resize', triggerUpdate)
            attachedRef.current = false
        }
        if (timer.current) {
            window.clearTimeout(timer.current)
            timer.current = null
        }

        wrapRef.current = el

        if (el) {
            // initial measurement
            const measure = () => {
                const r = el.getBoundingClientRect()
                const w = Math.max(0, Math.floor(el.clientWidth || r.width || 0))
                const h = Math.max(0, Math.floor(el.clientHeight || r.height || 0))
                applyMaybe(w, h)
            }

            // set up ResizeObserver
            try {
                const ro = new ResizeObserver(() => measure())
                ro.observe(el)
                roRef.current = ro
            } catch (e) {
                // ResizeObserver not available: fallback
            }

            // window resize fallback
            window.addEventListener('resize', triggerUpdate)
            attachedRef.current = true

            // initial measurement call
            measure()
        }
    }

    // helper to trigger measurement (used as window resize handler)
    function triggerUpdate() {
        const el = wrapRef.current
        if (!el) return
        const r = el.getBoundingClientRect()
        const w = Math.max(0, Math.floor(el.clientWidth || r.width || 0))
        const h = Math.max(0, Math.floor(el.clientHeight || r.height || 0))
        applyMaybe(w, h)
    }

    // apply width/height with threshold and debounce
    function applyMaybe(w: number, h: number) {
        const dw = Math.abs(w - lastW.current)
        const dh = Math.abs(h - lastH.current)
        if (dw <= THRESHOLD && dh <= THRESHOLD) return

        if (timer.current) window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => {
            lastW.current = w
            lastH.current = h
            setWidth(w)
            setHeight(h)
            timer.current = null
        }, DEBOUNCE_MS)
    }

    const dpr = typeof window !== 'undefined' ? Math.max(1, Math.floor(window.devicePixelRatio || 1)) : 1
    const desired = clamp(Math.round((width || 320) * dpr), 120, maxWidth)

    // choose candidate widths around desired but not exceeding maxWidth
    const widths = CANDIDATE_WIDTHS.filter(w => w <= maxWidth && w <= Math.max(desired * 2, 320))
    // ensure at least one width
    if (widths.length === 0) widths.push(Math.min(maxWidth, desired))

    const measuredHeight = height || undefined
    const avifSrcSetNew = buildSrcSet(src, widths, 'avif', qualityAvif, measuredHeight)
    const webpSrcSetNew = buildSrcSet(src, widths, 'webp', qualityWebp, measuredHeight)
    const jpgSrcSetNew = buildSrcSet(src, widths, 'jpeg', qualityJpg, measuredHeight)
    const fallbackNew = buildResizedUrl(src, widths[Math.floor(widths.length / 2)] || desired, 'jpeg', qualityJpg, measuredHeight)

    // Provide an accurate sizes hint so the browser chooses an appropriately-sized resource
    const measuredWidth = width || 0
    const sizesAttr = sizes ? sizes : (measuredWidth ? `${Math.min(measuredWidth, maxWidth)}px` : '100vw')

    const avifOk = typeof window !== 'undefined' && supportsAvif()

    // --- NEW: state/ref to avoid re-setting identical URLs and triggering new requests ---
    const prevAvifRef = useRef<string | null>(null)
    const prevWebpRef = useRef<string | null>(null)
    const prevJpgRef = useRef<string | null>(null)
    const prevFallbackRef = useRef<string | null>(null)

    const [avifSrcSet, setAvifSrcSet] = useState<string | null>(avifSrcSetNew)
    const [webpSrcSet, setWebpSrcSet] = useState<string>(webpSrcSetNew)
    const [jpgSrcSet, setJpgSrcSet] = useState<string>(jpgSrcSetNew)
    const [fallback, setFallback] = useState<string>(fallbackNew)
    const [fitMode, setFitMode] = useState<'width' | 'height' | null>(null)
    const [loaded, setLoaded] = useState(false)
    const [imgMaxHeight, setImgMaxHeight] = useState<string | undefined>(undefined)

    // update only when changed
    if (avifOk) {
        if (prevAvifRef.current !== avifSrcSetNew) {
            prevAvifRef.current = avifSrcSetNew
            setAvifSrcSet(avifSrcSetNew)
        }
    } else {
        if (prevAvifRef.current !== null) {
            prevAvifRef.current = null
            setAvifSrcSet(null)
        }
    }

    if (prevWebpRef.current !== webpSrcSetNew) {
        prevWebpRef.current = webpSrcSetNew
        setWebpSrcSet(webpSrcSetNew)
    }

    if (prevJpgRef.current !== jpgSrcSetNew) {
        prevJpgRef.current = jpgSrcSetNew
        setJpgSrcSet(jpgSrcSetNew)
    }

    if (prevFallbackRef.current !== fallbackNew) {
        prevFallbackRef.current = fallbackNew
        setFallback(fallbackNew)
    }

    // Note: sizes/srcset are provided above; image sizing and fit are handled via CSS and measured container dimensions.

    // compute inline image constraints: prefer explicit maxHeight prop, otherwise measured container height
    const imgInlineStyle: React.CSSProperties = {}
    if (maxHeight) {
        imgInlineStyle.maxHeight = typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight
    } else if (imgMaxHeight) {
        imgInlineStyle.maxHeight = imgMaxHeight
    } else if (height) {
        imgInlineStyle.maxHeight = `${height}px`
    }
    imgInlineStyle.maxWidth = '100%'

    const wrapStyle: React.CSSProperties | undefined = maxHeight ? {
        maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
        height: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight
    } : undefined

    return (
        <div ref={setWrapRef} className={`${styles.wrap} ${className}`} style={wrapStyle}>
            <picture>
                {avifOk && avifSrcSet ? <source type="image/avif" srcSet={avifSrcSet} sizes={sizesAttr}/> : null}
                {webpSrcSet ? <source type="image/webp" srcSet={webpSrcSet} sizes={sizesAttr}/> : null}
                {jpgSrcSet ? <source type="image/jpeg" srcSet={jpgSrcSet} sizes={sizesAttr}/> : null}
                <img
                    src={fallback}
                    alt={alt}
                    loading={priority ? 'eager' : 'lazy'}
                    decoding="async"
                    className={`${styles.img} ${fitMode === 'width' ? styles.fitWidth : fitMode === 'height' ? styles.fitHeight : ''} ${loaded ? styles.imgLoaded : ''}`.trim()}
                    style={imgInlineStyle}
                    fetchpriority={priority ? 'high' : undefined}
                    onLoad={(e) => {
                        try {
                            const imgEl = e.currentTarget as HTMLImageElement
                            const natW = imgEl.naturalWidth || 1
                            const natH = imgEl.naturalHeight || 1
                            const wrap = wrapRef.current
                            // If a maxHeight prop is provided (e.g., product page), prefer fitting by height to avoid oversized images
                            if (maxHeight) {
                                setFitMode('height')
                                setImgMaxHeight(typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight)
                                setLoaded(true)
                                return
                            }
                            if (wrap) {
                                const r = wrap.getBoundingClientRect()
                                const cw = Math.max(1, Math.floor(r.width))
                                const ch = Math.max(1, Math.floor(r.height))
                                // compare aspect ratios: if image is relatively wider than container, fit by width; otherwise fit by height
                                const imgRatio = natW / natH
                                const contRatio = cw / ch
                                if (imgRatio > contRatio) setFitMode('width')
                                else setFitMode('height')
                                // store the measured container height so we can cap the img explicitly
                                setImgMaxHeight(`${ch}px`)
                            } else {
                                // fallback: choose fit by height
                                setFitMode('height')
                                // fallback use measured height state if available
                                if (height) setImgMaxHeight(`${height}px`)
                            }
                            // mark loaded after deciding mode so fade-in happens
                            setLoaded(true)
                        } catch (e) {
                            setFitMode('height')
                            setLoaded(true)
                            if (height) setImgMaxHeight(`${height}px`)
                        }
                    }}
                />
            </picture>
        </div>
    )
}

export default ResponsiveImage
