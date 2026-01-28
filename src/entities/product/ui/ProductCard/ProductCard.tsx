import React, {Suspense} from 'react'
import styles from './ProductCard.module.css'
import {Product} from '../../../../app/types'
import {formatPrice} from '../../../../shared/lib/format/format'
import { useAppDispatch, useAppSelector } from '../../../../app/store/hooks'
import {addToCart, setQuantity} from '../../../cart/model'
import { useToast } from '../../../../app/providers/ToastProvider'
import Button from '../../../../shared/ui/Button/Button'
import {useNavigate} from 'react-router-dom'

const ResponsiveImage = React.lazy(() => import('../../../../shared/ui/ResponsiveImage/ResponsiveImage'))
const SkeletonLoader = React.lazy(() => import('../../../../shared/ui/Skeleton/ui/SkeletonLoader'))

interface Props {
    product: Product;
    priority?: boolean
}

const ProductCard: React.FC<Props> = ({product, priority = false}) => {
    const dispatch = useAppDispatch()
    const toast = useToast()
    const cartItems = useAppSelector(s => s.cart.items)
    const currentInCart = cartItems.find(i => i.product.id === product.id)?.quantity || 0
    const stock = product.rating?.count || 0

    const onAdd = () => {
        if (stock <= 0) {
            toast.push('Out of stock', 'error')
            return
        }
        if (currentInCart >= stock) {
            toast.push('No more in stock', 'error')
            return
        }
        dispatch(addToCart({product, quantity: 1}))
        toast.push('Added to cart', 'success')
    }

    const inStock = (product.rating?.count || 0) > 0

    // badge text and modifier
    let badgeText: string
    let badgeClass: string
    if (stock <= 0) {
        badgeText = 'Out of stock'
        badgeClass = styles['badge--danger']
    } else if (stock > 0 && stock < 15) {
        badgeText = `Low stock (${stock})`
        badgeClass = styles['badge--warning']
    } else {
        badgeText = 'In stock'
        badgeClass = styles['badge--success']
    }

    const navigate = useNavigate()
    const goProduct = () => navigate(`/product/${product.id}`)
    const onKeyGoProduct = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            goProduct()
        }
    }

    return (
        <div className={styles.card}>
            <div role="link" tabIndex={0} className={styles.imgWrap} onClick={goProduct} onKeyDown={onKeyGoProduct}
                 aria-label={`Open ${product.title}`}>
                <Suspense fallback={<SkeletonLoader variant="image"/>}>
                    <ResponsiveImage src={product.image} alt={product.title} priority={priority} maxWidth={220}
                                     maxHeight={220} sizes="160px" qualityWebp={50} qualityJpg={60}/>
                </Suspense>
            </div>
            <div className={`${styles.badge} ${badgeClass}`} aria-hidden>{badgeText}</div>
            <div className={styles.meta}>
                <div className={styles.title} title={product.title}>{product.title}</div>
                <div className={styles.price}>{formatPrice(product.price)}</div>
                <div className={styles.desc} title={product.description}>{product.description}</div>
            </div>
            <div className={styles.actions}>
                {currentInCart > 0 ? (
                    <div className={styles.qtyCard}>
                        <button aria-label="Decrease quantity" title="Decrease" className={styles.qtyBtnCard}
                                onClick={() => dispatch(setQuantity({
                                    id: product.id,
                                    quantity: Math.max(1, currentInCart - 1)
                                }))} disabled={currentInCart <= 1}>-
                        </button>
                        <div className={styles.qtyNum} aria-live="polite">{currentInCart}</div>
                        <button aria-label="Increase quantity" title="Increase" className={styles.qtyBtnCard}
                                onClick={() => dispatch(setQuantity({
                                    id: product.id,
                                    quantity: Math.min(stock, currentInCart + 1)
                                }))} disabled={currentInCart >= stock}>+
                        </button>
                    </div>
                ) : (
                    <div className={styles.fullBtn}>
                        <Button onClick={onAdd} disabled={!inStock || currentInCart >= stock} variant="primary">Add to
                            cart</Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProductCard
