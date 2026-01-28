import React, {useState, useRef, useEffect} from 'react'
import {useQuery} from '@tanstack/react-query'
import {fetchProducts, fetchCategories, fetchProductsByCategory} from '../../../../entities/product/api/products'
import EmptyState from '../../../../shared/ui/EmptyState/EmptyState'
import styles from './ProductList.module.css'
import {useDebounce} from '../../../../hooks/useDebounce'
import Select from '../../../../shared/ui/Select/Select'
import useFilteredCache from '../../../../hooks/useFilteredCache'
import {ProductCard} from "../../../../entities/product";

const PAGE_SIZE = 12
const PRELOAD_COUNT = 2

const ProductList = () => {
    const [search, setSearch] = useState('')
    const debounced = useDebounce(search, 350)
    const [category, setCategory] = useState<string>('')
    const [sort, setSort] = useState<string>('title_az')
    const [page, setPage] = useState(1)

    const {data: categories} = useQuery(['categories'], fetchCategories)

    const productsQueryKey = category ? ['product', 'cat', category] : ['product', 'all']
    const {
        data: products = [],
        isLoading
    } = useQuery(productsQueryKey, () => category ? fetchProductsByCategory(category) : fetchProducts())

    const filtered = useFilteredCache(products, {search: debounced, sort, category})

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    const sortOptions = [
        {value: 'title_az', label: 'Title A–Z'},
        {value: 'title_za', label: 'Title Z–A'},
        {value: 'price_asc', label: 'Price ↑'},
        {value: 'price_desc', label: 'Price ↓'},
    ]

    const topRef = useRef<HTMLElement | null>(null)

    useEffect(() => {
        if (isLoading) return
        const headerEl = document.querySelector('header') as HTMLElement | null
        const headerH = headerEl ? headerEl.offsetHeight : 0
        const topEl = topRef.current
        if (topEl) {
            const prev = (topEl.style && topEl.style.scrollMarginTop) || ''
            topEl.style.scrollMarginTop = `${headerH}px`
            let raf1 = 0, raf2 = 0
            raf1 = requestAnimationFrame(() => {
                raf2 = requestAnimationFrame(() => topEl.scrollIntoView({behavior: 'smooth', block: 'start'}))
            })
            const toId = setTimeout(() => topEl.scrollIntoView({behavior: 'smooth', block: 'start'}), 160)
            // restore previous value after short delay
            const restore = setTimeout(() => {
                topEl.style.scrollMarginTop = prev
            }, 600)
            return () => {
                cancelAnimationFrame(raf1);
                cancelAnimationFrame(raf2);
                clearTimeout(toId);
                clearTimeout(restore);
                topEl.style.scrollMarginTop = prev
            }
        }
        return
    }, [page, isLoading])

    const scrollToListTop = () => {
        const headerEl = document.querySelector('header') as HTMLElement | null
        const headerH = headerEl ? headerEl.offsetHeight : 0
        const topEl = topRef.current
        if (!topEl) return
        const prev = (topEl.style && topEl.style.scrollMarginTop) || ''
        topEl.style.scrollMarginTop = `${headerH}px`
        let r1 = 0, r2 = 0
        r1 = requestAnimationFrame(() => {
            r2 = requestAnimationFrame(() => topEl.scrollIntoView({behavior: 'smooth', block: 'start'}))
        })
        const to = setTimeout(() => topEl.scrollIntoView({behavior: 'smooth', block: 'start'}), 160)
        setTimeout(() => {
            cancelAnimationFrame(r1);
            cancelAnimationFrame(r2);
            clearTimeout(to);
            topEl.style.scrollMarginTop = prev
        }, 500)
    }

    const scrollImmediateToHeader = () => {
        try {
            const headerEl = document.querySelector('header') as HTMLElement | null
            const headerH = headerEl ? headerEl.offsetHeight : 0
            window.scrollTo({top: headerH, behavior: 'smooth'})
        } catch (e) {
            window.scrollTo({top: 0, behavior: 'smooth'})
        }
    }

    const handlePrev = () => {
        if (page <= 1) return
        setPage(p => Math.max(1, p - 1))
        scrollImmediateToHeader()
        setTimeout(() => scrollToListTop(), 120)
    }
    const handleNext = () => {
        if (page >= totalPages) return
        setPage(p => Math.min(totalPages, p + 1))
        scrollImmediateToHeader()
        setTimeout(() => scrollToListTop(), 120)
    }

    return (
        <section ref={el => {
            topRef.current = el
        }}>
            <div className={styles.controls}>
                <div className={styles.searchWrap}>
                    <input
                        className="input"
                        placeholder="Search by title"
                        value={search}
                        onChange={e => {
                            let v = e.target.value
                            v = v.replace(/^\s+/, '')
                            v = v.replace(/\s{2,}/g, ' ')
                            setSearch(v)
                            setPage(1)
                        }}
                    />
                    {search && <button aria-label="Clear search" className={styles.clearBtn} onClick={() => {
                        setSearch('');
                        setPage(1)
                    }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                             aria-hidden>
                            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                  strokeLinejoin="round"/>
                        </svg>
                    </button>}
                </div>

                <Select
                    value={category}
                    onChange={(v) => {
                        setCategory(v);
                        setPage(1)
                    }}
                    options={[{value: '', label: 'All filters'}, ...(categories || []).map(c => ({
                        value: c,
                        label: c
                    }))]}
                    placeholder="All filters"
                    ariaLabel="Filter by category"
                    forceCustom
                    variant="sort"
                />

                <Select
                    value={sort}
                    onChange={(v) => setSort(v)}
                    options={sortOptions}
                    placeholder="Sort"
                    ariaLabel="Sort"
                    forceCustom
                    variant="sort"
                />
            </div>

            {isLoading ? (
                <div className="grid">
                    {Array.from({length: 12}).map((_, i) => <div key={i} style={{
                        background: 'var(--surface)',
                        height: 260,
                        borderRadius: 8
                    }}/>)}
                </div>
            ) : filtered.length === 0 ? (
                <div className={styles.emptyFull}>
                    <EmptyState title="No products"
                                message="No items match your search. Try changing the search or category." cta={{
                        label: 'Show all', onClick: () => {
                            setSearch('');
                            setCategory('');
                            setSort('title_az');
                            setPage(1)
                        }
                    }}/>
                </div>
            ) : (
                <div className={styles.grid}>
                    {pageItems.map((p, i) => <ProductCard product={p} key={p.id} priority={i < PRELOAD_COUNT}/>)}
                </div>
            )}

            {(() => {
                const canPrev = page > 1
                const canNext = page < totalPages
                return (
                    <div style={{
                        display: 'flex',
                        gap: 8,
                        marginTop: 16,
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%'
                    }}>
                        <button className={`btn ${!canPrev ? 'disabled' : ''}`} onClick={handlePrev} disabled={!canPrev}
                                aria-disabled={!canPrev}>Prev
                        </button>
                        <div>Page {page} / {totalPages}</div>
                        <button className={`btn ${!canNext ? 'disabled' : ''}`} onClick={handleNext} disabled={!canNext}
                                aria-disabled={!canNext}>Next
                        </button>
                    </div>
                )
            })()}
        </section>
    )
}

export default ProductList
