export interface Part {
  id: string
  name: string
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
}

export interface Compatibility {
  id: string
  make: string
  model: string
  yearFrom: number
  yearTo: number
  engine?: string
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
  firstName: string
  lastName: string
  role: 'customer' | 'admin'
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
