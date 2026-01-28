import React from 'react'
import {CartItem as CI} from '../../../app/types'
import { useAppDispatch } from '../../../app/store/hooks'
import {removeFromCart, setQuantity} from '../../../entities/cart/model'
import {formatPrice} from '../../lib/format/format'
import styles from './Cart.module.css'
import {useNavigate} from 'react-router-dom'
import { useToast } from '../../../app/providers/ToastProvider'

const IconMinus = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="11" width="14" height="2" fill="currentColor"/>
    </svg>
)
const IconPlus = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="11" y="5" width="2" height="14" fill="currentColor"/>
        <rect x="5" y="11" width="14" height="2" fill="currentColor"/>
    </svg>
)
const IconDelete = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              strokeLinejoin="round"/>
        <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
)

const CartItem: React.FC<{ item: CI }> = ({item}) => {
    const dispatch = useAppDispatch()
    const toast = useToast()
    const onRemove = () => {
        dispatch(removeFromCart(item.product.id));
        toast.push('Item removed from cart', 'info')
    }
    const stock = item.product.rating?.count || 0
    const navigate = useNavigate()
    const goProduct = () => navigate(`/product/${item.product.id}`)
    const onKeyGoProduct = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            goProduct()
        }
    }

    const subtotal = item.product.price * item.quantity

    return (
        <div className={styles.item}>
            <div role="link" tabIndex={0} className={styles.left} onClick={goProduct} onKeyDown={onKeyGoProduct}
                 aria-label={item.product.title}>
                <div className={styles.thumb}><img src={item.product.image} alt={item.product.title} width={64}
                                                   height={64}/></div>
                <div className={styles.meta}>
                    <div className={styles.title} title={item.product.title}>{item.product.title}</div>
                    <div className={styles.unitPrice}>{formatPrice(item.product.price)}</div>
                </div>
            </div>

            <div className={styles.right}>
                <div className={styles.quantity}>
                    <button className={styles.qtyBtn} onClick={() => dispatch(setQuantity({
                        id: item.product.id,
                        quantity: Math.max(1, item.quantity - 1)
                    }))} disabled={item.quantity <= 1} aria-label="Decrease"><IconMinus/></button>
                    <input className={styles.qtyInput} value={item.quantity} onChange={(e) => {
                        const v = Math.max(1, Math.min(stock || 1, Number(e.target.value) || 1));
                        dispatch(setQuantity({id: item.product.id, quantity: v}))
                    }} aria-label="Quantity"/>
                    <button className={styles.qtyBtn} onClick={() => dispatch(setQuantity({
                        id: item.product.id,
                        quantity: Math.min(stock || (item.quantity + 1), item.quantity + 1)
                    }))} disabled={item.quantity >= (stock || item.quantity)} aria-label="Increase"><IconPlus/></button>
                </div>
                <div className={styles.subtotal} aria-hidden>{formatPrice(subtotal)}</div>
                <button className={styles.deleteBtn} onClick={onRemove} aria-label="Delete"><span
                    className={styles.deleteIcon}><IconDelete/></span></button>
            </div>
        </div>
    )
}

export default CartItem
