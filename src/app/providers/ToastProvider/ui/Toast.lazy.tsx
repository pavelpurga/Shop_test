import React from 'react'

const LazyToastProvider = React.lazy(() => import('./Toast'))

export default LazyToastProvider

