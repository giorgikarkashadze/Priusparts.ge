import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Part } from '../types/types'

interface CartStore {
  items: CartItem[]
  promoCode: string | null
  discount: number
  addItem: (part: Part, quantity?: number) => void
  removeItem: (partId: string) => void
  updateQuantity: (partId: string, quantity: number) => void
  applyPromo: (code: string, discountPercent: number) => void
  clearPromo: () => void
  clearCart: () => void
  subtotal: () => number
  shipping: () => number
  total: () => number
  itemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      discount: 0,

      addItem: (part, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.part.id === part.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.part.id === part.id
                  ? { ...i, quantity: Math.min(i.quantity + quantity, part.stock) }
                  : i
              ),
            }
          }
          return { items: [...state.items, { part, quantity: Math.min(quantity, part.stock) }] }
        })
      },

      removeItem: (partId) =>
        set((state) => ({ items: state.items.filter((i) => i.part.id !== partId) })),

      updateQuantity: (partId, quantity) => {
        if (quantity <= 0) { get().removeItem(partId); return }
        set((state) => ({
          items: state.items.map((i) =>
            i.part.id === partId ? { ...i, quantity: Math.min(quantity, i.part.stock) } : i
          ),
        }))
      },

      applyPromo: (code, discountPercent) =>
        set({ promoCode: code, discount: discountPercent }),

      clearPromo: () => set({ promoCode: null, discount: 0 }),

      clearCart: () => set({ items: [], promoCode: null, discount: 0 }),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.part.price * i.quantity, 0),

      shipping: () => {
        const sub = get().subtotal()
        return sub === 0 ? 0 : sub >= 100 ? 0 : 9.99
      },

      total: () => {
        const sub = get().subtotal()
        const discountAmount = sub * (get().discount / 100)
        return sub - discountAmount + get().shipping()
      },

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'priusparts-cart' }
  )
)
