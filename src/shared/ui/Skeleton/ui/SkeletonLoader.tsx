import React from 'react'
import styles from './SkeletonLoader.module.css'
import cardStyles from './SkeletonCard.module.css'

type Props = {
    variant?: 'grid' | 'card' | 'image' | 'page'
    count?: number
}

const SkeletonCardInner: React.FC = () => (
    <div className={styles.cardWrap}>
        <div className={cardStyles.box} style={{height: 160, borderRadius: 8, marginBottom: 8}}/>
        <div className={cardStyles.box} style={{height: 16, width: '80%', marginBottom: 6, borderRadius: 6}}/>
        <div className={cardStyles.box} style={{height: 14, width: '60%', marginBottom: 6, borderRadius: 6}}/>
        <div className={cardStyles.box} style={{height: 36, width: '100%', borderRadius: 6, marginTop: 8}}/>
    </div>
)

const SkeletonLoader: React.FC<Props> = ({variant = 'grid', count = 12}) => {
    if (variant === 'image') {
        return (
            <div className={styles.imageWrap}>
                <div className={cardStyles.box} style={{width: '100%', height: '100%', borderRadius: 8}}/>
            </div>
        )
    }

    if (variant === 'card') return <SkeletonCardInner/>

    if (variant === 'page') {
        return (
            <div className={styles.pageWrap}>
                <div className={cardStyles.box} style={{height: 320, borderRadius: 10, marginBottom: 16}}/>
                <div style={{display: 'flex', gap: 16}}>
                    <div style={{flex: 1}}>
                        {Array.from({length: 2}).map((_, i) => (
                            <div key={i} style={{marginBottom: 8}}>
                                <div className={cardStyles.box} style={{height: 16, width: '60%', borderRadius: 6}}/>
                            </div>
                        ))}
                    </div>
                    <div style={{width: 240}}>
                        <div className={cardStyles.box}
                             style={{height: 16, width: '40%', borderRadius: 6, marginBottom: 8}}/>
                        <div className={cardStyles.box} style={{height: 48, width: '100%', borderRadius: 8}}/>
                    </div>
                </div>
            </div>
        )
    }

    // grid
    return (
        <div className={styles.grid}>
            {Array.from({length: count}).map((_, i) => (
                <div key={i} className={styles.gridItem}>
                    <SkeletonCardInner/>
                </div>
            ))}
        </div>
    )
}

export default SkeletonLoader

