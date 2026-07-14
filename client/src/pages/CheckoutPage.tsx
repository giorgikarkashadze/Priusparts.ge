import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Lock, CreditCard, ChevronRight, ShieldCheck, Truck, RotateCcw } from 'lucide-react'
import { useCartStore } from '@/store'
import { formatPrice } from '@/lib/utils'
import api from '@/lib/api'

const schema = z.object({
  name: z.string().min(2, 'Full name required'),
  email: z.string().email('Valid email required'),
  line1: z.string().min(4, 'Street address required'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City required'),
  state: z.string().min(2, 'Region required'),
  zip: z.string().min(3, 'ZIP / postal code required'),
  country: z.string().min(2, 'Country required'),
})
type FormData = z.infer<typeof schema>

const CATEGORY_ICONS: Record<string, string> = {
  engine: '🔧', brakes: '🛞', suspension: '⚙️', electrical: '⚡', filters: '🌀', hybrid: '🔋',
}

function Field({ label, error, children, hint }: { label: string; error?: string; children: React.ReactNode; hint?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: '#94a3b8' }}>{label}</label>
      {children}
      {hint && !error && <p style={{ fontSize: 11, color: '#475569' }}>{hint}</p>}
      {error && <p style={{ fontSize: 11, color: '#f87171' }}>⚠ {error}</p>}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 8,
  border: '1px solid #1a2744', background: '#0a0f1e',
  color: '#f9fafb', fontSize: 14, outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.15s'
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore()
  const navigate = useNavigate()
  const location = useLocation()
  const promoCode = (location.state as any)?.promoCode

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { country: 'Georgia' },
  })

  const subtotal = total()
  const shipping = 9.99
  const orderTotal = subtotal + shipping

  const onSubmit = async (data: FormData) => {
    setLoading(true); setError('')
    try {
      const { email, ...shippingAddress } = data
      const res = await api.post('/orders', {
        items: items.map((i) => ({ partId: i.part.id, quantity: i.quantity })),
        shippingAddress,
        promoCode,
      })
      clearCart()
      navigate(`/orders`, { state: { success: true, orderId: res.data.order.id } })
    } catch (e: any) {
      setError(e.response?.data?.error || 'Order failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getInputStyle = (name: string): React.CSSProperties => ({
    ...inputStyle,
    borderColor: focusedField === name ? '#1d6fe8' : errors[name as keyof FormData] ? '#ef4444' : '#1a2744',
  })

  if (items.length === 0) { navigate('/cart'); return null }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 16px' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#475569', marginBottom: 16 }}>
          <Link to="/cart" style={{ color: '#64748b', textDecoration: 'none' }}>Cart</Link>
          <ChevronRight size={12} />
          <span style={{ color: '#4d9fff', fontWeight: 500 }}>Checkout</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(212,56,13,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lock size={16} style={{ color: '#4d9fff' }} />
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f9fafb' }}>Secure checkout</h1>
            <p style={{ fontSize: 12, color: '#475569' }}>Your information is encrypted and secure</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>

        {/* Left — Form */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Contact */}
          <div style={{ background: '#0d1526', border: '1px solid #1a2744', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #1a2744', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#1d6fe8', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</div>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#f9fafb' }}>Contact information</span>
            </div>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Field label="Full name" error={errors.name?.message}>
                <input {...register('name')} placeholder="Giorgi Beridze"
                  style={getInputStyle('name')}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)} />
              </Field>
              <Field label="Email address" error={errors.email?.message} hint="Order confirmation will be sent here">
                <input {...register('email')} type="email" placeholder="giorgi@example.com"
                  style={getInputStyle('email')}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)} />
              </Field>
            </div>
          </div>

          {/* Shipping */}
          <div style={{ background: '#0d1526', border: '1px solid #1a2744', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #1a2744', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#1d6fe8', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</div>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#f9fafb' }}>Shipping address</span>
            </div>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Field label="Street address" error={errors.line1?.message}>
                <input {...register('line1')} placeholder="Rustaveli Ave 1"
                  style={getInputStyle('line1')}
                  onFocus={() => setFocusedField('line1')}
                  onBlur={() => setFocusedField(null)} />
              </Field>
              <Field label="Apartment, suite (optional)" error={errors.line2?.message}>
                <input {...register('line2')} placeholder="Apt 12"
                  style={getInputStyle('line2')}
                  onFocus={() => setFocusedField('line2')}
                  onBlur={() => setFocusedField(null)} />
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="City" error={errors.city?.message}>
                  <input {...register('city')} placeholder="Tbilisi"
                    style={getInputStyle('city')}
                    onFocus={() => setFocusedField('city')}
                    onBlur={() => setFocusedField(null)} />
                </Field>
                <Field label="Region" error={errors.state?.message}>
                  <input {...register('state')} placeholder="Tbilisi"
                    style={getInputStyle('state')}
                    onFocus={() => setFocusedField('state')}
                    onBlur={() => setFocusedField(null)} />
                </Field>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="ZIP / Postal code" error={errors.zip?.message}>
                  <input {...register('zip')} placeholder="0105"
                    style={getInputStyle('zip')}
                    onFocus={() => setFocusedField('zip')}
                    onBlur={() => setFocusedField(null)} />
                </Field>
                <Field label="Country" error={errors.country?.message}>
                  <select {...register('country')}
                    style={{ ...getInputStyle('country'), cursor: 'pointer' }}
                    onFocus={() => setFocusedField('country')}
                    onBlur={() => setFocusedField(null)}>
                    <option value="Georgia">Georgia</option>
                    <option value="Armenia">Armenia</option>
                    <option value="Azerbaijan">Azerbaijan</option>
                    <option value="Turkey">Turkey</option>
                    <option value="Other">Other</option>
                  </select>
                </Field>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div style={{ background: '#0d1526', border: '1px solid #1a2744', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #1a2744', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#1d6fe8', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</div>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#f9fafb' }}>Payment</span>
              <CreditCard size={14} style={{ color: '#475569', marginLeft: 4 }} />
            </div>
            <div style={{ padding: 20 }}>
              <div style={{
                border: '1px dashed #1a2744', borderRadius: 10, padding: '24px 16px',
                textAlign: 'center', background: '#0a0f1e'
              }}>
                <CreditCard size={24} style={{ color: '#334155', marginBottom: 8 }} />
                <div style={{ fontSize: 13, color: '#475569', marginBottom: 4 }}>Stripe payment form will appear here</div>
                <div style={{ fontSize: 11, color: '#334155' }}>
                  Install <code style={{ background: '#1a2744', padding: '1px 6px', borderRadius: 4, color: '#94a3b8' }}>@stripe/react-stripe-js</code> and add your publishable key
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 14 }}>
                {['VISA', 'MC', 'AMEX', 'PAYPAL'].map(brand => (
                  <div key={brand} style={{ padding: '3px 8px', borderRadius: 4, border: '1px solid #1a2744', fontSize: 10, fontWeight: 700, color: '#475569' }}>{brand}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#f87171' }}>
              ⚠ {error}
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '15px', borderRadius: 12, border: 'none',
            background: loading ? '#374151' : 'linear-gradient(135deg, #1d6fe8, #4d9fff)',
            color: '#fff', fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: loading ? 'none' : '0 4px 20px rgba(212,56,13,0.4)',
            transition: 'all 0.2s'
          }}>
            <Lock size={16} />
            {loading ? 'Placing order…' : `Place order — ${formatPrice(orderTotal)}`}
          </button>

          <p style={{ textAlign: 'center', fontSize: 12, color: '#334155' }}>
            By placing your order you agree to our Terms of Service and Privacy Policy
          </p>
        </form>

        {/* Right — Order summary */}
        <div style={{ position: 'sticky', top: 80, display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Items */}
          <div style={{ background: '#0d1526', border: '1px solid #1a2744', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #1a2744' }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: '#f9fafb' }}>
                Order summary <span style={{ color: '#475569', fontWeight: 400, fontSize: 13 }}>({items.reduce((a, i) => a + i.quantity, 0)} items)</span>
              </h2>
            </div>
            <div style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {items.map(({ part, quantity }) => {
                const icon = CATEGORY_ICONS[part.category?.slug] || '🔩'
                return (
                  <div key={part.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 8, background: '#1a2744',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 20, flexShrink: 0, overflow: 'hidden', position: 'relative'
                    }}>
                      {part.images?.[0]
                        ? <img src={part.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : icon}
                      <div style={{
                        position: 'absolute', top: -4, right: -4, width: 16, height: 16,
                        background: '#1d6fe8', borderRadius: '50%', fontSize: 9, fontWeight: 700,
                        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {quantity}
                      </div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: '#e2e8f0', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {part.name}
                      </div>
                      <div style={{ fontSize: 11, color: '#475569', marginTop: 1 }}>{part.category?.name}</div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#f9fafb', flexShrink: 0 }}>
                      {formatPrice(Number(part.price) * quantity)}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Totals */}
            <div style={{ padding: '12px 20px', borderTop: '1px solid #1a2744', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#64748b' }}>
                <span>Subtotal</span><span style={{ color: '#94a3b8' }}>{formatPrice(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#64748b' }}>
                <span>Shipping</span><span style={{ color: '#94a3b8' }}>{formatPrice(shipping)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, paddingTop: 10, borderTop: '1px solid #1a2744', marginTop: 2 }}>
                <span style={{ color: '#f9fafb' }}>Total</span>
                <span style={{ color: '#4d9fff' }}>{formatPrice(orderTotal)}</span>
              </div>
            </div>
          </div>

          {/* Trust */}
          <div style={{ background: '#0d1526', border: '1px solid #1a2744', borderRadius: 12, padding: '14px 16px' }}>
            {[
              { icon: ShieldCheck, text: 'SSL encrypted & secure' },
              { icon: Truck, text: '1–3 day delivery across Georgia' },
              { icon: RotateCcw, text: '30-day hassle-free returns' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
                <Icon size={14} style={{ color: '#4d9fff', flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: '#64748b' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}