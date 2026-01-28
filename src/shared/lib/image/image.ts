export type ImgFormat = boolean | 'webp' | 'avif' | 'jpeg'

export const stripProtocol = (url: string) => url.replace(/^https?:\/\//, '')

export const buildResizedUrl = (src: string, width: number, format: ImgFormat = false, quality?: number, height?: number) => {
    try {
        const naked = stripProtocol(src)
        const params = new URLSearchParams()
        params.set('url', naked)
        params.set('w', String(width))
        params.set('fit', 'contain')

        // backward-compatible handling: boolean true => webp
        if (format === true || format === 'webp') params.set('output', 'webp')
        if (format === 'avif') params.set('output', 'avif')
        // if format === false or 'jpeg' -> no output param (jpeg)

        if (quality) params.set('q', String(quality))
        if (height) params.set('h', String(height))
        return `https://images.weserv.nl/?${params.toString()}`
    } catch (e) {
        return src
    }
}

export const buildSrcSet = (src: string, widths: number[], format: ImgFormat = false, quality?: number, height?: number) => {
    return widths.map(w => `${buildResizedUrl(src, w, format, quality, height)} ${w}w`).join(', ')
}
