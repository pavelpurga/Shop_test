import {api} from '../../client/api/client'
import {Product} from '../../../app/types'

export const fetchProducts = async (): Promise<Product[]> => {
    const {data} = await api.get<Product[]>('/products')
    return data
}

export const fetchProductById = async (id: string | number): Promise<Product> => {
    const {data} = await api.get<Product>(`/products/${id}`)
    return data
}

export const fetchCategories = async (): Promise<string[]> => {
    const {data} = await api.get<string[]>('/products/categories')
    return data
}

export const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
    const {data} = await api.get<Product[]>(`/products/category/${encodeURIComponent(category)}`)
    return data
}

