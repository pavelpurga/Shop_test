import React from 'react'
import styles from './Button.module.css'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger'
}

const Button: React.FC<Props> = ({variant = 'primary', className = '', children, ...rest}) => {
    const cls = `${styles.btn} ${styles[variant]} ${className}`.trim()
    return (
        <button className={cls} {...rest}>{children}</button>
    )
}

export default Button

