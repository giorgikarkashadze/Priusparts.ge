export interface Part {
  id: string
  name: string
  slug: string
  comparePrice?: number
  oemNumber?: string
  description: string
  price: number
  originalPrice?: number
  stock: number
  sku: string
  category: Category
  categoryId: string
  brand: string
  images: string[]
  compatibility: Compatibility[]
  rating: number
  reviews?: Review[] 
  reviewCount: number
  isActive: boolean
  createdAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  description?: string
  partCount?: number
  _count?: { parts: number }
}

export interface Compatibility {
  id: string
  partId: string
  modelId: string
  years: number[]
  model: {
    id: string
    name: string
    makeId: string
    years: number[]
    make: {
      id: string
      name: string
    }
  }
}

export interface CartItem {
  part: Part
  quantity: number
}

export interface Order {
  id: string
  orderNumber: string
  userId: string
  items: OrderItem[]
  status: OrderStatus
  subtotal: number
  shipping: number
  discount: number
  total: number
  shippingAddress: Address
  promoCode?: string
  createdAt: string
}

export interface OrderItem {
  id: string
  partId: string
  partName: string
  partSku: string
  price: number
  quantity: number
  part: Part 
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface Address {
  firstName: string
  lastName: string
  street: string
  city: string
  state: string
  zip: string
  country: string
  phone: string
}

export interface User {
  id: string
  email: string
  name: string
  firstName: string
  lastName: string
  role: 'customer' | 'ADMIN'
  createdAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload extends LoginPayload {
  firstName: string
  lastName: string
}

export interface Promotion {
  id: string
  code: string
  description?: string
  discount: number
  type: 'PERCENTAGE' | 'FIXED'
  discountPercent: number
  categoryId?: string
  expiresAt: string
  isActive: boolean
  usageCount: number
  usageLimit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface PartFilters {
  categoryId?: string
  make?: string
  model?: string
  yearFrom?: number
  yearTo?: number
  minPrice?: number
  maxPrice?: number
  search?: string
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'rating'
  page?: number
  pageSize?: number
}

export interface DashboardStats {
  totalOrders: number
  monthlyRevenue: number
  lowStockCount: number
  avgRating: number
  recentOrders: Order[]
}

export interface FilterState {
  makeId: string
  modelId: string
  year: string
  category: string
  minPrice: string
  maxPrice: string
  search: string
  sort: string
}

export interface Make {
  id: string
  name: string
  models: Model[]
}

export interface Model {
  id: string
  name: string
  makeId: string
  years: number[]
}

export interface Review {
  id: string
  rating: number
  comment?: string
  createdAt: string
  user: { name: string }
}