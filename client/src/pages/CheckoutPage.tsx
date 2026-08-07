import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Lock, ChevronRight, ShieldCheck, Truck, RotateCcw, Zap, CreditCard } from 'lucide-react'
import { useCartStore, useThemeStore, useAuthStore } from '@/store'
import api from '@/lib/api'
import { useTranslation } from 'react-i18next'
import { getCategoryName, getPartName } from '@/hooks/usePartLocale'

const schema = z.object({
  name: z.string().min(2, 'Full name required'),
  email: z.string().email('Valid email required'),
  phone: z.string()
    .min(9, 'Phone number required')
    .regex(/^\s?\d{3}\s?\d{2}\s?\d{2}\s?\d{2}$/, 'Enter valid Georgian number (XXX-XX-XX-XX)'),
  line1: z.string().min(4, 'Street address required'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City required'),
  state: z.string().min(2, 'Region required'),
  zip: z.string().min(2, 'ZIP code required').optional(),
})
type FormData = z.infer<typeof schema>

const CATEGORY_ICONS: Record<string, string> = {
  engine: '🔧', brakes: '🛞', suspension: '⚙️', electrical: '⚡', filters: '🌀', hybrid: '🔋',
}

export default function CheckoutPage() {

  // Theme tokens
  const { dark } = useThemeStore()
  const c = dark ? {
    pageBg: '#05070C',
    cardBg: 'rgba(13,18,30,0.8)',
    cardBorder: 'rgba(124,138,165,0.12)',
    text: '#EAF2FF',
    textMuted: '#7C8AA5',
    textFaint: '#4A5670',
    accent: '#4C7CFF',
    teal: '#22D3B8',
    inputBg: 'rgba(255,255,255,0.03)',
    inputBorder: 'rgba(124,138,165,0.2)',
    inputColor: '#EAF2FF',
    inputFocus: 'rgba(34,211,184,0.12)',
    inputFocusBorder: '#22D3B8',
    labelColor: '#22D3B8',
    stepBg: 'rgba(76,124,255,0.1)',
    stepBorder: 'rgba(76,124,255,0.3)',
    stepColor: '#4C7CFF',
    gradient: 'linear-gradient(135deg, #4C7CFF, #22D3B8)',
    energyLine: 'linear-gradient(90deg, #4C7CFF, #22D3B8, #4C7CFF, #22D3B8)',
    gridColor: 'rgba(76,124,255,0.04)',
    glowBlue: 'rgba(76,124,255,0.08)',
    trustBg: 'rgba(255,255,255,0.02)',
    trustBorder: 'rgba(124,138,165,0.1)',
    summaryBg: 'rgba(76,124,255,0.05)',
    summaryBorder: 'rgba(76,124,255,0.15)',
    phonePrefixBg: 'rgba(34,211,184,0.08)',
    phonePrefixBorder: 'rgba(34,211,184,0.2)',
    phonePrefixColor: '#22D3B8',
    errorBg: 'rgba(239,68,68,0.08)',
    errorBorder: 'rgba(239,68,68,0.25)',
    errorColor: '#f87171',
  } : {
    pageBg: '#F0F4FF',
    cardBg: 'rgba(255,255,255,0.92)',
    cardBorder: 'rgba(60,90,200,0.12)',
    text: '#0B1220',
    textMuted: '#4A5A7A',
    textFaint: '#8A9AB8',
    accent: '#2952CC',
    teal: '#0A8C7A',
    inputBg: '#F8FAFF',
    inputBorder: 'rgba(60,90,200,0.2)',
    inputColor: '#0B1220',
    inputFocus: 'rgba(10,140,122,0.08)',
    inputFocusBorder: '#0A8C7A',
    labelColor: '#0A8C7A',
    stepBg: 'rgba(41,82,204,0.08)',
    stepBorder: 'rgba(41,82,204,0.25)',
    stepColor: '#2952CC',
    gradient: 'linear-gradient(135deg, #2952CC, #0A8C7A)',
    energyLine: 'linear-gradient(90deg, #2952CC, #0A8C7A, #2952CC, #0A8C7A)',
    gridColor: 'rgba(41,82,204,0.04)',
    glowBlue: 'rgba(41,82,204,0.05)',
    trustBg: 'rgba(255,255,255,0.8)',
    trustBorder: 'rgba(60,90,200,0.12)',
    summaryBg: 'rgba(41,82,204,0.04)',
    summaryBorder: 'rgba(41,82,204,0.12)',
    phonePrefixBg: 'rgba(10,140,122,0.08)',
    phonePrefixBorder: 'rgba(10,140,122,0.2)',
    phonePrefixColor: '#0A8C7A',
    errorBg: 'rgba(220,38,38,0.06)',
    errorBorder: 'rgba(220,38,38,0.2)',
    errorColor: '#DC2626',
  }

  const { t } = useTranslation()
  const { i18n } = useTranslation()

  const user = useAuthStore((s) => s.user)
  const isAdmin = user?.role === 'ADMIN'

  const { items, total, clearCart } = useCartStore()
  const navigate = useNavigate()
  const location = useLocation()
  const promoCode = (location.state as any)?.promoCode

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { city: 'Tbilisi' },
  })

  const subtotal = total()
  const shipping = 9.99
  const orderTotal = subtotal + shipping

  const onSubmit = async (data: FormData) => {
    setLoading(true); setError('')
    try {
      const { email, phone, ...shippingAddress } = data
      const res = await api.post('/orders', {
        items: items.map((i) => ({ partId: i.part.id, quantity: i.quantity })),
        shippingAddress: { ...shippingAddress, phone },
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

  const onAdminSubmit = async (data: FormData) => {
  setLoading(true); setError('')
  try {
    const { email, phone, ...shippingAddress } = data
    const res = await api.post('/orders/admin-test', {
      items: items.map((i) => ({ partId: i.part.id, quantity: i.quantity })),
      shippingAddress: { ...shippingAddress, phone },
    })
    clearCart()
    navigate('/orders', { state: { success: true, orderId: res.data.order.id } })
  } catch (e: any) {
    setError(e.response?.data?.error || 'Order failed.')
  } finally {
    setLoading(false)
  }
}

  const getInputStyle = (name: string): React.CSSProperties => ({
    width: '100%', padding: '11px 14px',
    borderRadius: 10, boxSizing: 'border-box' as const,
    border: `1px solid ${errors[name as keyof FormData] ? c.errorBorder : focusedField === name ? c.inputFocusBorder : c.inputBorder}`,
    background: focusedField === name ? c.inputFocus : c.inputBg,
    color: c.inputColor, fontSize: 14, outline: 'none',
    fontFamily: "'Inter', sans-serif",
    transition: 'all 0.2s ease',
    boxShadow: focusedField === name ? `0 0 0 3px ${dark ? 'rgba(34,211,184,0.08)' : 'rgba(10,140,122,0.08)'}` : 'none',
  })

  if (items.length === 0) { navigate('/cart'); return null }

  return (
    <div style={{ minHeight: '100vh', background: c.pageBg, color: c.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes energy-flow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes grid-drift {
          from { background-position: 0 0; }
          to { background-position: 48px 48px; }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .checkout-grid-bg {
          background-image:
            linear-gradient(${c.gridColor} 1px, transparent 1px),
            linear-gradient(90deg, ${c.gridColor} 1px, transparent 1px);
          background-size: 48px 48px;
          animation: grid-drift 20s linear infinite;
        }
        .energy-bar {
          background: ${c.energyLine};
          background-size: 200% 100%;
          animation: energy-flow 4s linear infinite;
        }
        .checkout-card {
          background: ${c.cardBg};
          border: 1px solid ${c.cardBorder};
          border-radius: 16px;
          overflow: hidden;
          backdrop-filter: blur(12px);
          transition: border-color 0.2s ease;
        }
        .checkout-card:focus-within {
          border-color: ${dark ? 'rgba(34,211,184,0.2)' : 'rgba(10,140,122,0.2)'};
        }
        .trust-badge {
          display: flex; align-items: center; gap: 10;
          padding: 10px 12px; border-radius: 10px;
          background: ${c.trustBg}; border: 1px solid ${c.trustBorder};
          transition: all 0.2s;
        }
        .trust-badge:hover {
          border-color: ${dark ? 'rgba(34,211,184,0.2)' : 'rgba(10,140,122,0.2)'};
        }
        .submit-btn {
          width: 100%; padding: 15px; border-radius: 12px; border: none;
          font-size: 16px; font-weight: 700; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          font-family: 'Space Grotesk', sans-serif;
          transition: all 0.2s ease;
        }
        .submit-btn.ready {
          background: ${c.gradient};
          color: ${dark ? '#04121A' : '#fff'};
          box-shadow: 0 4px 24px ${dark ? 'rgba(76,124,255,0.4)' : 'rgba(41,82,204,0.35)'};
        }
        .submit-btn.ready:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 32px ${dark ? 'rgba(76,124,255,0.5)' : 'rgba(41,82,204,0.45)'};
        }
        .submit-btn.ready:active { transform: scale(0.99); }
        .submit-btn:disabled {
          background: ${dark ? 'rgba(124,138,165,0.15)' : 'rgba(100,116,139,0.15)'};
          color: ${c.textFaint}; cursor: not-allowed; box-shadow: none;
        }
        .breadcrumb-link {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; color: ${c.textFaint};
          text-decoration: none; transition: color 0.15s;
          letter-spacing: 0.05em;
        }
        .breadcrumb-link:hover { color: ${c.teal}; }
        .section-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; color: ${c.labelColor};
          letter-spacing: 0.12em; text-transform: uppercase;
        }
        select option { background: ${dark ? '#0a0f1e' : '#ffffff'}; }
        @media (max-width: 768px) {
          .checkout-layout { grid-template-columns: 1fr !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .energy-bar, .checkout-grid-bg { animation: none; }
          .submit-btn.ready:hover { transform: none; }
        }
      `}</style>

      {/* Background */}
      <div className="checkout-grid-bg" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', top: '10%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, ${c.glowBlue}, transparent 70%)`, filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1000, margin: '0 auto', padding: '28px 16px 48px' }}>

        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24, animation: 'fade-up 0.3s ease-out both' }}>
          <Link to="/" className="breadcrumb-link">{t('checkout.home')}</Link>
          <ChevronRight size={11} style={{ color: c.textFaint }} />
          <Link to="/cart" className="breadcrumb-link">{t('checkout.cart')}</Link>
          <ChevronRight size={11} style={{ color: c.textFaint }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: c.teal, letterSpacing: '0.05em' }}>{t('checkout.title')}</span>
        </nav>

        {/* Header */}
        <div style={{ marginBottom: 28, animation: 'fade-up 0.3s 0.05s ease-out both' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: c.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 16px ${dark ? 'rgba(76,124,255,0.4)' : 'rgba(41,82,204,0.3)'}` }}>
              <Lock size={18} style={{ color: dark ? '#04121A' : '#fff' }} />
            </div>
            <div>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 29, fontWeight: 700, color: c.text, letterSpacing: '0.3px', marginBottom: 8 }}>{t('checkout.title')}</h1>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: c.textFaint, letterSpacing: '0.08em' }}>{t('checkout.subtitle')}</p>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="checkout-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'flex-start' }}>

          {/* Left — Form */}
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fade-up 0.4s 0.1s ease-out both' }}>

            {/* Step 1 — Contact */}
            <div className="checkout-card">
              <div className="energy-bar" style={{ height: 2 }} />
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${c.cardBorder}`, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 24, height: 24, borderRadius: 8, background: c.stepBg, border: `1px solid ${c.stepBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: c.stepColor }}>1</div>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, color: c.text }}>{t('checkout.contactInfo.title')}</span>
              </div>
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Field label={t('checkout.contactInfo.name')} error={errors.name?.message} c={c}>
                  <input {...register('name')} placeholder="" autoComplete="name"
                    style={getInputStyle('name')}
                    onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)} />
                </Field>
                <Field label={t('checkout.contactInfo.email')} error={errors.email?.message} hint={t('checkout.contactInfo.emailHint')} c={c}>
                  <input {...register('email')} type="email" placeholder="" autoComplete="email"
                    style={getInputStyle('email')}
                    onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} />
                </Field>

                {/* Phone — Georgian only */}
                <Field label={t('checkout.contactInfo.phone')} error={errors.phone?.message} hint={t('checkout.contactInfo.phoneHint')} c={c}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      {...register('phone')}
                      placeholder="--- -- -- --"
                      autoComplete="tel"
                      style={{ ...getInputStyle('phone'), flex: 1 }}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                </Field>
              </div>
            </div>

            {/* Step 2 — Shipping */}
            <div className="checkout-card">
              <div className="energy-bar" style={{ height: 2 }} />
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${c.cardBorder}`, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 24, height: 24, borderRadius: 8, background: c.stepBg, border: `1px solid ${c.stepBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: c.stepColor }}>2</div>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, color: c.text }}>{t('checkout.shipping.title')}</span>
              </div>
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Field label={t('checkout.shipping.address')} error={errors.line1?.message} c={c}>
                  <input {...register('line1')} placeholder="Rustaveli Ave 1" autoComplete="address-line1"
                    style={getInputStyle('line1')}
                    onFocus={() => setFocusedField('line1')} onBlur={() => setFocusedField(null)} />
                </Field>
                <Field label={t('checkout.shipping.apartment')} c={c}>
                  <input {...register('line2')} placeholder="Apt 12"
                    style={getInputStyle('line2')}
                    onFocus={() => setFocusedField('line2')} onBlur={() => setFocusedField(null)} />
                </Field>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Field label={t('checkout.shipping.city')} error={errors.city?.message} c={c}>
                    <input {...register('city')} placeholder="Tbilisi"
                      style={getInputStyle('city')}
                      onFocus={() => setFocusedField('city')} onBlur={() => setFocusedField(null)} />
                  </Field>
                  <Field label={t('checkout.shipping.region')} error={errors.state?.message} c={c}>
                    <input {...register('state')}
                      style={{ ...getInputStyle('state') }}
                      onFocus={() => setFocusedField('state')} onBlur={() => setFocusedField(null)}/>
                  </Field>
                </div>
                <Field label={t('checkout.shipping.zip')} c={c}>
                  <input {...register('zip')} placeholder="0105"
                    style={getInputStyle('zip')}
                    onFocus={() => setFocusedField('zip')} onBlur={() => setFocusedField(null)} />
                </Field>
              </div>
            </div>

            {/* Step 3 — Payment */}
            <div className="checkout-card">
              <div className="energy-bar" style={{ height: 2 }} />
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${c.cardBorder}`, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 24, height: 24, borderRadius: 8, background: c.stepBg, border: `1px solid ${c.stepBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: c.stepColor }}>3</div>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: c.text }}>{t('checkout.payment.title')}</span>
                <CreditCard size={14} style={{ color: c.textFaint, marginLeft: 4 }} />
              </div>
              <div style={{ padding: 20 }}>
                <div style={{
                  border: `1px dashed ${c.inputBorder}`, borderRadius: 12,
                  padding: '24px 16px', textAlign: 'center', background: c.inputBg
                }}>
                  <CreditCard size={24} style={{ color: c.textFaint, margin: '0 auto 10px', display: 'block' }} />
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: c.textMuted, marginBottom: 6 }}>
                    Stripe payment form will appear here
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: c.textFaint }}>
                    Install <code style={{ background: dark ? '#1e293b' : '#E8EEFF', padding: '1px 6px', borderRadius: 4, color: c.accent }}>@stripe/react-stripe-js</code>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 14 }}>
                  {['VISA', 'MC', 'AMEX', 'BOG', 'TBC'].map(brand => (
                    <div key={brand} style={{
                      padding: '3px 8px', borderRadius: 6,
                      border: `1px solid ${c.inputBorder}`,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10, fontWeight: 700, color: c.textFaint
                    }}>{brand}</div>
                  ))}
                </div>
              </div>
            </div>
            {/* Admin test order button */}
            {isAdmin && (
              <button
                type="button"
                onClick={handleSubmit(onAdminSubmit)}
                disabled={loading}
                style={{
                  width: '100%', padding: '12px', borderRadius: 12, border: `1px dashed ${dark ? 'rgba(255,107,87,0.4)' : 'rgba(220,38,38,0.3)'}`,
                  background: dark ? 'rgba(255,107,87,0.06)' : 'rgba(220,38,38,0.04)',
                  color: dark ? '#FF6B57' : '#DC2626',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  fontFamily: "'JetBrains Mono', monospace",
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  letterSpacing: '0.05em'
                }}
              >
                🔐 ADMIN — Place test order (no payment)
              </button>
            )}

            {/* Error */}
            {error && (
              <div style={{
                background: c.errorBg, border: `1px solid ${c.errorBorder}`,
                borderRadius: 10, padding: '12px 16px',
                fontFamily: "'Inter', sans-serif", fontSize: 13, color: c.errorColor,
                display: 'flex', alignItems: 'center', gap: 8
              }}>
                ⚠ {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading} className={`submit-btn${!loading ? ' ready' : ''}`}>
              {loading ? (
                <>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid transparent', borderTopColor: 'currentColor', animation: 'spin 0.8s linear infinite' }} />
                  {t('checkout.payment.placing')}
                </>
              ) : (
                <>
                  <Zap size={16} />
                  {t('checkout.payment.placeOrder')} — {orderTotal}
                </>
              )}
            </button>

            <p style={{ textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: c.textFaint, letterSpacing: '0.05em' }}>
              {t('checkout.payment.paymentSub')}
            </p>
          </form>

          {/* Right — Order summary */}
          <div style={{ position: 'sticky', top: 80, display: 'flex', flexDirection: 'column', gap: 12, animation: 'fade-up 0.4s 0.15s ease-out both' }}>

            {/* Items */}
            <div className="checkout-card">
              <div className="energy-bar" style={{ height: 2 }} />
              <div style={{ padding: '14px 18px', borderBottom: `1px solid ${c.cardBorder}` }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, color: c.text }}>
                  {t('checkout.summary.title')}{' '}
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: c.textFaint, fontWeight: 400 }}>
                    ({items.reduce((a, i) => a + i.quantity, 0)} {t('checkout.summary.items')})
                  </div>
                </span>
              </div>
              <div style={{ padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {items.map(({ part, quantity }) => {
                  const icon = CATEGORY_ICONS[part.category?.slug] || '🔩'
                  return (
                    <div key={part.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 8,
                        background: dark ? '#0a0f1e' : '#E8EEFF',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 20, position: 'relative'
                      }}>
                        {part.images?.[0]
                          ? <img src={part.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : icon}
                        <div style={{
                          position: 'absolute', top: -9, right: -10, width: 18, height: 18,
                          background: c.gradient, borderRadius: '50%',
                          fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700,
                          color: dark ? '#04121A' : '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          zIndex: 2, boxShadow: '0 0 0 2px ' + (dark ? '#0a0f1e' : '#fff')
                        }}>{quantity}</div>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500, color: c.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {getPartName(part, i18n.language)}
                        </div>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: c.textFaint, marginTop: 1 }}>
                          {getCategoryName(part.category, i18n.language)}
                        </div>
                      </div>
                      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600, color: c.text, flexShrink: 0 }}>
                        {Number(part.price) * quantity} ₾
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Totals */}
              <div style={{ padding: '12px 18px', borderTop: `1px solid ${c.cardBorder}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: t('checkout.summary.subtotal'), value: subtotal },
                  { label: t('checkout.summary.shipping'), value: shipping },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Inter', sans-serif", fontSize: 13, color: c.textMuted }}>
                    <span>{label} </span>
                    <span style={{ color: c.text }}>{value} ₾</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: `1px solid ${c.cardBorder}`, marginTop: 2 }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700, color: c.text }}>{t('checkout.summary.total')}</span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, color: c.accent }}>{orderTotal} ₾</span>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { icon: ShieldCheck, text: t('checkout.summary.sslSecure') },
                { icon: Truck, text: t('checkout.summary.delivery') },
                { icon: RotateCcw, text: t('checkout.summary.freeReturns') },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="trust-badge">
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: c.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={13} style={{ color: dark ? '#04121A' : '#fff' }} />
                  </div>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: c.textMuted, paddingLeft: 10 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, error, hint, children, c }: {
  label: string; error?: string; hint?: string;
  children: React.ReactNode; c: any
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, color: c.labelColor, letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
        {label}
      </label>
      {children}
      {hint && !error && <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: c.textFaint }}>{hint}</p>}
      {error && <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: c.errorColor }}>⚠ {error}</p>}
    </div>
  )
}