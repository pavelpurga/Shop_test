import React, {Suspense, lazy} from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import {ScrollToTop} from '../shared/ui/ScrollToTop/ScrollToTop'

import HomePage from '../pages/HomePage'
import ProductPage from '../pages/ProductPage'
import CartPage from '../pages/CartPage'
import Header from "../widgets/Header";

const SkeletonLoader = lazy(() => import('../shared/ui/Skeleton/ui/SkeletonLoader'))

const App: React.FC = () => {
    return (
        <div>
            <Header/>
            <main>
                <ScrollToTop/>
                <Suspense fallback={<SkeletonLoader variant="grid"/>}>
                    <Routes>
                        <Route path="/" element={<HomePage/>}/>
                        <Route path="/product/:id" element={<ProductPage/>}/>
                        <Route path="/cart" element={<CartPage/>}/>
                        <Route path="*" element={<Navigate to="/" replace/>}/>
                    </Routes>
                </Suspense>
            </main>
        </div>
    )
}

export default App
