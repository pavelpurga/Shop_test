import React from 'react'
import {useAppSelector, useAppDispatch} from '../../../app/store/hooks'
import {selectCartItems, selectCartTotal, clearCart} from '../../../entities/cart/model'
import CartItem from './CartItem'
import {formatPrice} from '../../lib/format/format'
import AnimatedNumber from '../AnimatedNumber/AnimatedNumber'
import {useToast} from '../../../app/providers/ToastProvider'
import Button from '../Button/Button'
import styles from './Cart.module.css'

const Cart: React.FC = () => {
    const items = useAppSelector(selectCartItems)
    const total = useAppSelector(selectCartTotal)
    const dispatch = useAppDispatch()
    const toast = useToast()

    if (items.length === 0) return <div className={styles.root}>
        <div className={styles.empty}>Your cart is empty</div>
    </div>

    const onClear = () => {
        dispatch(clearCart())
        toast.push('Cart cleared', 'success')
    }

    return (
        <div className={styles.root}>
            <div className={styles.list}>
                {items.map(it => <CartItem key={it.id} item={it}/>)}
            </div>

            <div className={styles.footer}>
                <div className={styles.totalBlock}>
                    <div className={styles.totalLabel}>Total</div>
                    <div className={styles.totalValue}><AnimatedNumber value={total}
                                                                       format={(v) => formatPrice(Math.round(v * 100) / 100)}/>
                    </div>
                </div>
                <div className={styles.controls}>
                    <Button variant="secondary" onClick={onClear} className={styles.clearBtn}>Clear cart</Button>
                </div>
            </div>
        </div>
    )
}

export default Cart
