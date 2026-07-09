import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import type { PaginatedResponse, Part, Category, Make, FilterState  } from '../types/types'

export function useProducts(filters: Partial<FilterState> & { page?: number }) {
  return useQuery<PaginatedResponse<Part>>({
    queryKey: ['products', filters],
    queryFn: async () => {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
      const { data } = await api.get('/products', { params })
      return data
    },
  })
}

export function usePart(slug: string) {
  return useQuery<Part>({
    queryKey: ['part', slug],
    queryFn: async () => {
      const { data } = await api.get(`/products/${slug}`)
      return data
    },
    enabled: !!slug,
  })
}

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/products/categories')
      return data
    },
    staleTime: Infinity,
  })
}

export function useMakes() {
  return useQuery<Make[]>({
    queryKey: ['makes'],
    queryFn: async () => {
      const { data } = await api.get('/products/makes')
      return data
    },
    staleTime: Infinity,
  })
}
