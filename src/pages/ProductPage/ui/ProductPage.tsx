import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchProductById } from '../../../entities/product/api/products'
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks'
import { addToCart, setQuantity } from '../../../entities/cart/model'
import { formatPrice } from '../../../shared/lib/format/format'
import { useToast } from '../../../app/providers/ToastProvider'
import ResponsiveImage from '../../../shared/ui/ResponsiveImage/ResponsiveImage'
import Button from '../../../shared/ui/Button/Button'
import stylesPage from './ProductPage.module.css'
import SkeletonLoader from "../../../shared/ui/Skeleton";

const ProductPage: React.FC = () => {
  const { id } = useParams()
  const { data: product, isLoading } = useQuery(['product', id], () => fetchProductById(id!))
  const dispatch = useAppDispatch()
  const toast = useToast()
  const cartItems = useAppSelector(s => s.cart.items)
  const navigate = useNavigate()

  if (isLoading) return (<div style={{padding:12}}><SkeletonLoader variant="page" /></div>)
  if (!product) return <div>Product not found</div>

  const inCartItem = cartItems.find(i => i.product.id === product.id)
  const inCartQty = inCartItem?.quantity || 0
  const stock = product.rating?.count || 0

  const onAdd = () => {
    if (stock <= 0) { toast.push('Out of stock', 'error'); return }
    dispatch(addToCart({ product, quantity: 1 }))
    toast.push('Added to cart', 'success')
  }

  const onInc = () => {
    if (!inCartItem) return
    if (inCartQty >= stock) { toast.push('No more in stock', 'error'); return }
    dispatch(setQuantity({ id: product.id, quantity: Math.min(stock, inCartQty + 1) }))
  }

  const onDec = () => {
    if (!inCartItem) return
    dispatch(setQuantity({ id: product.id, quantity: Math.max(1, inCartQty - 1) }))
  }

  const goToCart = () => navigate('/cart')
  const goHome = () => navigate('/')

  return (
    <main className={stylesPage.root}>
      <Button variant="secondary" className={stylesPage.backBtn} onClick={goHome}>← Back to catalog</Button>
      <div className={stylesPage.left}>
        <div className={stylesPage.imgContainer}>
          <ResponsiveImage src={product.image} alt={product.title} priority maxWidth={1200} maxHeight={600} sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 800px" />
        </div>
      </div>

      <aside className={stylesPage.right}>
        <h1 className={stylesPage.title}>{product.title}</h1>
        <div className={stylesPage.price}>{formatPrice(product.price)}</div>
        <div className={stylesPage.desc}>{product.description}</div>

        <div className={stylesPage.actions}>
          {inCartItem ? (
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <div className={stylesPage.qtyControls}>
                <button className={stylesPage.qtyBtn} onClick={onDec} disabled={inCartQty<=1}>-</button>
                <div className={stylesPage.qtyNum}>{inCartQty}</div>
                <button className={stylesPage.qtyBtn} onClick={onInc} disabled={inCartQty>=stock}>+</button>
              </div>
              <Button variant="secondary" className={stylesPage.inCartBtn} onClick={goToCart}>In cart →</Button>
            </div>
          ) : (
            <Button variant="primary" className={stylesPage.addBtn} onClick={onAdd}>Add to cart</Button>
          )}
        </div>
      </aside>
    </main>
  )
}

export default ProductPage
