import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ShoppingBag, Tag, ArrowRight } from 'lucide-react'
import { useCartStore, useAuthStore } from '@/store'
import { formatPrice, cn } from '@/lib/utils'
import api from '@/lib/api'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCartStore()
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  const [promoCode, setPromoCode] = useState('')
  const [promoResult, setPromoResult] = useState<{ discount: number; type: string; description?: string } | null>(null)
  const [promoError, setPromoError] = useState('')
  const [promoLoading, setPromoLoading] = useState(false)

  const subtotal = total()
  const shipping = subtotal > 0 ? 9.99 : 0
  const discountAmount = promoResult
    ? promoResult.type === 'PERCENTAGE'
      ? subtotal * (promoResult.discount / 100)
      : Math.min(promoResult.discount, subtotal)
    : 0
  const orderTotal = Math.max(0, subtotal - discountAmount + shipping)

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return
    setPromoLoading(true)
    setPromoError('')
    setPromoResult(null)
    try {
      const { data } = await api.post('/orders/validate-promo', { code: promoCode.trim().toUpperCase() })
      setPromoResult(data)
    } catch {
      setPromoError('Invalid or expired promo code')
    } finally {
      setPromoLoading(false)
    }
  }

  if (items.length === 0) return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <ShoppingBag size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
      <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
      <p className="text-gray-500 mb-6 text-sm">Add some parts to get started</p>
      <Link to="/catalog" className="btn-primary">Browse catalog</Link>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Your cart</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Items */}
        <div className="md:col-span-2 space-y-3">
          {items.map(({ part, quantity }) => (
            <div key={part.id} className="card p-4 flex gap-4">
              {/* Thumbnail */}
              <Link to={`/catalog/${part.slug}`} className="w-20 h-20 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 overflow-hidden">
                {part.images[0]
                  ? <img src={part.images[0]} alt={part.name} className="w-full h-full object-cover" />
                  : <span className="text-3xl">🔩</span>}
              </Link>

              <div className="flex-1 min-w-0">
                <Link to={`/catalog/${part.slug}`} className="font-medium text-sm hover:text-brand line-clamp-2">{part.name}</Link>
                <div className="text-xs text-gray-500 mt-0.5">{part.category.name}</div>
                {part.oemNumber && <div className="text-xs text-gray-400 font-mono mt-0.5">OEM: {part.oemNumber}</div>}

                <div className="flex items-center justify-between mt-3">
                  {/* Quantity */}
                  <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <button onClick={() => updateQuantity(part.id, quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-lg">−</button>
                    <span className="w-8 text-center text-sm">{quantity}</span>
                    <button onClick={() => updateQuantity(part.id, quantity + 1)}
                      disabled={quantity >= part.stock}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-lg disabled:opacity-30">+</button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-brand">{formatPrice(Number(part.price) * quantity)}</span>
                    <button onClick={() => removeItem(part.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Link to="/catalog" className="flex items-center gap-2 text-sm text-brand hover:underline mt-2">
            ← Continue shopping
          </Link>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="font-semibold mb-4">Order summary</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal ({items.reduce((a, i) => a + i.quantity, 0)} items)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span>{formatPrice(shipping)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Discount ({promoCode.toUpperCase()})</span>
                  <span>−{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="border-t border-gray-100 dark:border-gray-800 pt-2 flex justify-between font-semibold text-base">
                <span>Total</span>
                <span className="text-brand">{formatPrice(orderTotal)}</span>
              </div>
            </div>

            {/* Promo code */}
            <div className="mt-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    className="input pl-8 text-sm uppercase"
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(e) => { setPromoCode(e.target.value); setPromoError(''); setPromoResult(null) }}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                  />
                </div>
                <button onClick={handleApplyPromo} disabled={promoLoading} className="btn-secondary text-sm px-3">
                  {promoLoading ? '…' : 'Apply'}
                </button>
              </div>
              {promoError && <p className="text-xs text-red-500 mt-1.5">{promoError}</p>}
              {promoResult && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1.5 flex items-center gap-1">
                  ✓ {promoResult.description || `${promoResult.discount}${promoResult.type === 'PERCENTAGE' ? '%' : '$'} off applied`}
                </p>
              )}
            </div>

            <button
              onClick={() => user ? navigate('/checkout', { state: { promoCode: promoResult ? promoCode : undefined } }) : navigate('/login?redirect=/checkout')}
              className={cn('btn-primary w-full mt-4 flex items-center justify-center gap-2 py-3')}
            >
              {user ? 'Proceed to checkout' : 'Sign in to checkout'}
              <ArrowRight size={16} />
            </button>

            {!user && <p className="text-xs text-center text-gray-400 mt-2">You need to be signed in to place an order</p>}
          </div>

          {/* Trust */}
          <div className="card p-4 space-y-2">
            {['🔒 Secure SSL checkout', '🚚 Free returns within 30 days', '✅ Genuine OEM parts guaranteed'].map(t => (
              <div key={t} className="text-xs text-gray-500 dark:text-gray-400">{t}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
