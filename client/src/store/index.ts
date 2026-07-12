import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Part, User } from '../types/types'

// ─── Auth store ───────────────────────────────────────────────────────────────
interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  setAuth: (user: User, access: string, refresh: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setAuth: (user, accessToken, refreshToken) => {
        localStorage.setItem('access_token', accessToken)
        localStorage.setItem('refresh_token', refreshToken)
        set({ user, accessToken, refreshToken })
      },
      clearAuth: () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('cart-storage')
        set({ user: null, accessToken: null, refreshToken: null })
      },
    }),
    { name: 'auth-storage', partialize: (s) => ({ user: s.user }) }
  )
)

// ─── Cart store ───────────────────────────────────────────────────────────────
interface CartState {
  items: CartItem[]
  addItem: (part: Part, quantity?: number) => void
  removeItem: (partId: string) => void
  updateQuantity: (partId: string, quantity: number) => void
  clearCart: () => void
  total: () => number
  itemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (part, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.part.id === part.id)
          if (existing) {
            return { items: state.items.map((i) => i.part.id === part.id ? { ...i, quantity: Math.min(i.quantity + quantity, part.stock) } : i) }
          }
          return { items: [...state.items, { part, quantity: Math.min(quantity, part.stock) }] }
        })
      },
      removeItem: (partId) => set((state) => ({ items: state.items.filter((i) => i.part.id !== partId) })),
      updateQuantity: (partId, quantity) => {
        if (quantity <= 0) { get().removeItem(partId); return }
        set((state) => ({ items: state.items.map((i) => i.part.id === partId ? { ...i, quantity } : i) }))
      },
      clearCart: () => set({ items: [] }),
      total: () => get().items.reduce((sum, i) => sum + Number(i.part.price) * i.quantity, 0),
      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'cart-storage' }
  )
)

// ─── Theme store ──────────────────────────────────────────────────────────────
interface ThemeState {
  dark: boolean
  toggle: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      dark: false,
      toggle: () => {
        const next = !get().dark
        document.documentElement.classList.toggle('dark', next)
        set({ dark: next })
      },
    }),
    { name: 'theme-storage', onRehydrateStorage: () => (state) => {
      if (state?.dark) document.documentElement.classList.add('dark')
    }}
  )
)
