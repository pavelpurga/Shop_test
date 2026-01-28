import * as React from 'react'

declare module 'react' {
    interface ImgHTMLAttributes<T> extends React.AriaAttributes, React.DOMAttributes<T> {
        fetchpriority?: 'low' | 'auto' | 'high' | string
    }
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            img: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
        }
    }
}

