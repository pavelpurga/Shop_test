import React from 'react'
import {useNavigate} from 'react-router-dom'
import styles from './Header.module.css'
import { useAppSelector } from '../../../app/store/hooks'
import {selectCartCount} from '../../../entities/cart/model'
import ThemeSwitcher from '../../../shared/ui/ThemeSwitcher/ThemeSwitcher'

const Header: React.FC = () => {
    const count = useAppSelector(selectCartCount)
    const navigate = useNavigate()

    const goHome = () => navigate('/')
    const onKeyGoHome = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            goHome()
        }
    }

    const goCart = () => navigate('/cart')
    const onKeyGoCart = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            goCart()
        }
    }

    return (
        <header className={styles.root}>
            <div className={`${styles.container} container`}>
                <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                    <div role="link" tabIndex={0} className={styles.logo} onClick={goHome}
                         onKeyDown={onKeyGoHome}>ShopTest
                    </div>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                    <ThemeSwitcher/>

                    <div role="link" tabIndex={0} aria-label="cart" className={styles.cart} onClick={goCart}
                         onKeyDown={onKeyGoCart}>
                        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                             aria-hidden>
                            <path d="M3 3h2l.4 2M7 13h10l3-8H6.4" stroke="currentColor" strokeWidth="1.5"
                                  strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="10" cy="20" r="1" fill="currentColor"/>
                            <circle cx="18" cy="20" r="1" fill="currentColor"/>
                        </svg>
                        {count > 0 && <span className={styles.badge}>{count}</span>}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
