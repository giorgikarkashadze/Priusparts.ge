import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ShoppingBag, Tag, ArrowRight, ShieldCheck, RotateCcw, BadgeCheck, Minus, Plus } from 'lucide-react'
import { useCartStore, useAuthStore } from '@/store'
import { formatPrice } from '@/lib/utils'
import api from '@/lib/api'

const CATEGORY_ICONS: Record<string, string> = {
  engine: '🔧', brakes: '🛞', suspension: '⚙️', electrical: '⚡', filters: '🌀', hybrid: '🔋',
}

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
    setPromoLoading(true); setPromoError(''); setPromoResult(null)
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
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 36 }}>
          🛒
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: '#f9fafb', marginBottom: 8 }}>Your cart is empty</h2>
        <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>Add some Prius parts to get started</p>
        <Link to="/catalog" style={{
          background: '#d4380d', color: '#fff', textDecoration: 'none',
          padding: '12px 28px', borderRadius: 10, fontSize: 14, fontWeight: 600
        }}>
          Browse parts
        </Link>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 16px' }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#f9fafb', marginBottom: 4 }}>Your cart</h1>
        <p style={{ color: '#6b7280', fontSize: 14 }}>{items.reduce((a, i) => a + i.quantity, 0)} items in your cart</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>

        {/* Items list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map(({ part, quantity }) => {
            const icon = CATEGORY_ICONS[part.category?.slug] || '🔩'
            return (
              <div key={part.id} style={{
                background: '#111827', border: '1px solid #1f2937', borderRadius: 14,
                padding: 16, display: 'flex', gap: 16, alignItems: 'center'
              }}>
                {/* Image */}
                <Link to={`/catalog/${part.slug}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
                  <div style={{
                    width: 80, height: 80, borderRadius: 10, background: '#1f2937',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden', fontSize: 32
                  }}>
                    {part.images?.[0]
                      ? <img src={part.images[0]} alt={part.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : icon}
                  </div>
                </Link>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link to={`/catalog/${part.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#f9fafb', marginBottom: 4, lineHeight: 1.3 }}>
                      {part.name}
                    </div>
                  </Link>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{
                      background: 'rgba(212,56,13,0.12)', color: '#ff6b35',
                      fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 6
                    }}>
                      {part.category?.name}
                    </span>
                    {part.oemNumber && (
                      <span style={{ fontSize: 11, color: '#6b7280', fontFamily: 'monospace' }}>
                        OEM: {part.oemNumber}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity + Price + Delete */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                  {/* Qty control */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 0,
                    border: '1px solid #374151', borderRadius: 8, overflow: 'hidden'
                  }}>
                    <button onClick={() => updateQuantity(part.id, quantity - 1)}
                      style={{ width: 32, height: 32, background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Minus size={13} />
                    </button>
                    <span style={{ width: 32, textAlign: 'center', fontSize: 14, fontWeight: 600, color: '#f9fafb', borderLeft: '1px solid #374151', borderRight: '1px solid #374151', lineHeight: '32px' }}>
                      {quantity}
                    </span>
                    <button onClick={() => updateQuantity(part.id, quantity + 1)}
                      disabled={quantity >= part.stock}
                      style={{ width: 32, height: 32, background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: quantity >= part.stock ? 0.3 : 1 }}>
                      <Plus size={13} />
                    </button>
                  </div>

                  {/* Price */}
                  <div style={{ textAlign: 'right', minWidth: 72 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#ff6b35' }}>
                      {formatPrice(Number(part.price) * quantity)}
                    </div>
                    {quantity > 1 && (
                      <div style={{ fontSize: 11, color: '#6b7280' }}>
                        {formatPrice(Number(part.price))} each
                      </div>
                    )}
                  </div>

                  {/* Delete */}
                  <button onClick={() => removeItem(part.id)} style={{
                    width: 32, height: 32, borderRadius: 8, border: 'none', background: 'rgba(239,68,68,0.1)',
                    color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          })}

          {/* Continue shopping */}
          <Link to="/catalog" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: '#6b7280', textDecoration: 'none', fontSize: 13, marginTop: 4,
            padding: '8px 0'
          }}>
            <ShoppingBag size={14} /> Continue shopping
          </Link>
        </div>

        {/* Order summary */}
        <div style={{ position: 'sticky', top: 80 }}>
          <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 16, overflow: 'hidden' }}>

            {/* Summary header */}
            <div style={{ padding: '20px 20px 0', borderBottom: '1px solid #1f2937', paddingBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#f9fafb' }}>Order summary</h2>
            </div>

            {/* Line items */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #1f2937' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#9ca3af', marginBottom: 10 }}>
                <span>Subtotal ({items.reduce((a, i) => a + i.quantity, 0)} items)</span>
                <span style={{ color: '#f9fafb' }}>{formatPrice(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#9ca3af', marginBottom: 10 }}>
                <span>Shipping</span>
                <span style={{ color: '#f9fafb' }}>{formatPrice(shipping)}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#4ade80', marginBottom: 10 }}>
                  <span>Discount ({promoCode.toUpperCase()})</span>
                  <span>−{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 700, paddingTop: 12, borderTop: '1px solid #1f2937', marginTop: 4 }}>
                <span style={{ color: '#f9fafb' }}>Total</span>
                <span style={{ color: '#ff6b35' }}>{formatPrice(orderTotal)}</span>
              </div>
            </div>

            {/* Promo code */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #1f2937' }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Tag size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                  <input
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(e) => { setPromoCode(e.target.value); setPromoError(''); setPromoResult(null) }}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                    style={{
                      width: '100%', paddingLeft: 32, paddingRight: 10, paddingTop: 9, paddingBottom: 9,
                      borderRadius: 8, border: '1px solid #374151', background: '#1f2937',
                      color: '#f9fafb', fontSize: 13, outline: 'none', boxSizing: 'border-box',
                      textTransform: 'uppercase', letterSpacing: '0.05em'
                    }}
                  />
                </div>
                <button onClick={handleApplyPromo} disabled={promoLoading} style={{
                  padding: '9px 14px', borderRadius: 8, border: '1px solid #374151',
                  background: '#1f2937', color: '#f9fafb', fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap'
                }}>
                  {promoLoading ? '…' : 'Apply'}
                </button>
              </div>
              {promoError && <p style={{ color: '#f87171', fontSize: 12, marginTop: 6 }}>{promoError}</p>}
              {promoResult && (
                <p style={{ color: '#4ade80', fontSize: 12, marginTop: 6 }}>
                  ✓ {promoResult.description || `${promoResult.discount}${promoResult.type === 'PERCENTAGE' ? '%' : '$'} off applied`}
                </p>
              )}
            </div>

            {/* Checkout button */}
            <div style={{ padding: 20 }}>
              <button
                onClick={() => user
                  ? navigate('/checkout', { state: { promoCode: promoResult ? promoCode : undefined } })
                  : navigate('/login?redirect=/checkout')}
                style={{
                  width: '100%', padding: '14px', borderRadius: 10, border: 'none',
                  background: 'linear-gradient(135deg, #d4380d, #ff6b35)',
                  color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: '0 4px 16px rgba(212,56,13,0.35)'
                }}>
                {user ? 'Proceed to checkout' : 'Sign in to checkout'}
                <ArrowRight size={16} />
              </button>
              {!user && (
                <p style={{ textAlign: 'center', color: '#6b7280', fontSize: 12, marginTop: 10 }}>
                  You need to be signed in to place an order
                </p>
              )}
            </div>
          </div>

          {/* Trust badges */}
          <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 12, padding: '14px 16px', marginTop: 12 }}>
            {[
              { icon: ShieldCheck, text: 'Secure SSL checkout' },
              { icon: RotateCcw, text: 'Free returns within 30 days' },
              { icon: BadgeCheck, text: 'Genuine OEM parts guaranteed' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
                <Icon size={14} style={{ color: '#ff6b35', flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: '#6b7280' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}