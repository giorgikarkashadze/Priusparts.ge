import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Tag, ArrowRight, ShieldCheck, RotateCcw, BadgeCheck, Minus, Plus } from 'lucide-react'
import { useCartStore, useAuthStore, useThemeStore } from '@/store'
import api from '@/lib/api'
import { useTranslation } from "react-i18next";
import { getPartName, getCategoryName } from "@/hooks/usePartLocale";

const CATEGORY_ICONS: Record<string, string> = {
  engine: '🔧', brakes: '🛞', suspension: '⚙️', electrical: '⚡', filters: '🌀', hybrid: '🔋',
}

export default function CartPage() {
  const { items, updateQuantity, total } = useCartStore()
  const user = useAuthStore((s) => s.user)
  const { dark } = useThemeStore()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { i18n } = useTranslation()

  const [promoCode, setPromoCode] = useState('')
  const [promoResult, setPromoResult] = useState<{ discount: number; type: string; description?: string } | null>(null)
  const [promoError, setPromoError] = useState('')
  const [promoLoading, setPromoLoading] = useState(false)

  const c = dark ? {
    pageBg: '#05070C',
    cardBg: 'rgba(13,18,30,0.8)',
    cardBorder: 'rgba(124,138,165,0.12)',
    text: '#EAF2FF',
    textMuted: '#7C8AA5',
    textFaint: '#8694b3',
    accent: '#4C7CFF',
    teal: '#22D3B8',
    inputBg: 'rgba(255,255,255,0.03)',
    inputBorder: 'rgba(124,138,165,0.2)',
    divider: 'rgba(124,138,165,0.1)',
    qtyBg: 'rgba(255,255,255,0.04)',
    qtyBorder: 'rgba(124,138,165,0.2)',
    deleteBg: 'rgba(239,68,68,0.08)',
    deleteBorder: 'rgba(239,68,68,0.2)',
    deleteColor: '#f87171',
    gradientBtn: 'linear-gradient(135deg, #4C7CFF, #22D3B8)',
    energyLine: 'linear-gradient(90deg, #4C7CFF, #22D3B8, #4C7CFF, #22D3B8)',
    glowBtn: 'rgba(76,124,255,0.35)',
    thumbBg: '#0a0f1e',
    glowBlue: 'rgba(76,124,255,0.08)',
    glowTeal: 'rgba(34,211,184,0.06)',
    gridColor: 'rgba(76,124,255,0.04)'
  } : {
    pageBg: '#F0F4FF',
    cardBg: 'rgba(255,255,255,0.9)',
    cardBorder: 'rgba(60,90,200,0.12)',
    text: '#0B1220',
    textMuted: '#4A5A7A',
    textFaint: '#8A9AB8',
    accent: '#2952CC',
    teal: '#0A8C7A',
    inputBg: '#f8faff',
    inputBorder: 'rgba(60,90,200,0.2)',
    divider: 'rgba(60,90,200,0.1)',
    qtyBg: '#f8faff',
    qtyBorder: 'rgba(60,90,200,0.2)',
    deleteBg: 'rgba(220,38,38,0.06)',
    deleteBorder: 'rgba(220,38,38,0.2)',
    deleteColor: '#dc2626',
    gradientBtn: 'linear-gradient(135deg, #2952CC, #0A8C7A)',
    energyLine: 'linear-gradient(90deg, #2952CC, #0A8C7A, #2952CC, #0A8C7A)',
    glowBtn: 'rgba(41,82,204,0.3)',
    thumbBg: '#f0f4ff',
    glowBlue: 'rgba(41,82,204,0.06)',
    glowTeal: 'rgba(10,140,122,0.05)',
    gridColor: 'rgba(41,82,204,0.04)'
  }

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
    <div style={{ minHeight: '70vh', background: c.pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: dark ? 'rgba(76,124,255,0.1)' : 'rgba(41,82,204,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 32 }}>🛒</div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: c.text, marginBottom: 8 }}>{t('cart.empty')}</h2>
        <p style={{ fontFamily: "'Inter', sans-serif", color: c.textMuted, fontSize: 14, marginBottom: 24 }}>{t('cart.emptySub')}</p>
        <Link to="/catalog" style={{ background: c.gradientBtn, color: dark ? '#04121A' : '#fff', textDecoration: 'none', padding: '12px 28px', borderRadius: 10, fontSize: 14, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>{t('cart.browseParts')}</Link>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: c.pageBg }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes energy-flow { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
        .energy-bar { background: ${c.energyLine}; background-size:200% 100%; animation:energy-flow 4s linear infinite; }
        .cart-layout { display:grid; grid-template-columns:1fr 340px; gap:20px; align-items:flex-start; }
        .cart-item-card { background:${c.cardBg}; border:1px solid ${c.cardBorder}; border-radius:14px; padding:14px; display:flex; align-items:center; gap:12px; backdrop-filter:blur(8px); transition:border-color 0.2s; position:relative; overflow:hidden; }
        .cart-item-card:hover { border-color:${dark ? 'rgba(76,124,255,0.25)' : 'rgba(41,82,204,0.25)'}; }
        .cart-thumb { width:72px; height:72px; border-radius:10px; background:${c.thumbBg}; display:flex; align-items:center; justify-content:center; overflow:hidden; border:1px solid ${c.cardBorder}; flex-shrink:0; }
        .cart-info { flex:1; min-width:0; }
        .cart-price-block { display:flex; align-items:; gap:10px; flex-shrink:0; }
        .qty-btn { width:30px; height:30px; display:flex; align-items:center; justify-content:center; background:${c.qtyBg}; border:1px solid ${c.qtyBorder}; color:${c.text}; cursor:pointer; border-radius:7px; transition:all 0.15s; flex-shrink:0; }
        .qty-btn:hover { border-color:${c.teal}; color:${c.teal}; }
        .qty-btn:disabled { opacity:0.3; cursor:not-allowed; }
        .del-btn { width:30px; height:30px; display:flex; align-items:center; justify-content:center; background:${c.deleteBg}; border:1px solid ${c.deleteBorder}; color:${c.deleteColor}; cursor:pointer; border-radius:7px; transition:all 0.15s; flex-shrink:0; }
        .del-btn:hover { opacity:0.8; }
        .summary-card { background:${c.cardBg}; border:1px solid ${c.cardBorder}; border-radius:16px; overflow:hidden; backdrop-filter:blur(8px); }
        .promo-input { background:${c.inputBg}; border:1px solid ${c.inputBorder}; color:${c.text}; border-radius:8px; padding:9px 10px 9px 28px; font-size:13px; outline:none; font-family:'JetBrains Mono',monospace; text-transform:uppercase; letter-spacing:0.05em; width:100%; box-sizing:border-box; }
        .promo-input:focus { border-color:${c.teal}; }
        .promo-input::placeholder { color:${c.textFaint}; text-transform:none; letter-spacing:0; }
        .checkout-btn { width:100%; padding:14px; border-radius:12px; border:none; background:${c.gradientBtn}; color:${dark ? '#04121A' : '#fff'}; font-size:15px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; font-family:'Space Grotesk',sans-serif; box-shadow:0 4px 20px ${c.glowBtn}; transition:all 0.2s; }
        .checkout-btn:hover { transform:translateY(-1px); }
        .trust-item { display:flex; align-items:center; gap:10px; padding:8px 0; border-bottom:1px solid ${c.divider}; }
        .trust-item:last-child { border-bottom:none; }
        .about-grid-bg {
          background-image:
          linear-gradient(${c.gridColor} 1px, transparent 1px),
          linear-gradient(90deg, ${c.gridColor} 1px, transparent 1px);
          background-size: 48px 48px;
          animation: grid-drift 20s linear infinite;
        }

        @media (max-width:768px) {
          .cart-layout { grid-template-columns:1fr !important; }
          .cart-item-card { flex-wrap:wrap; }
          .cart-thumb { width:56px !important; height:56px !important; }
          .cart-price-block { width:100%; justify-content:space-between; padding-top:10px; border-top:1px solid ${c.divider}; margin-top:4px; }
        }
        @media (max-width:400px) {
          .cart-item-card { padding:10px !important; gap:8px !important; }
        }
      `}</style>

      <div className='about-grid-bg' style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 16px', position: 'relative' }}>
        <div style={{ position: 'fixed', top: '5%', right: '5%', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, ${c.glowBlue}, transparent 70%)`, filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'fixed', bottom: '10%', left: '5%', width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, ${c.glowTeal}, transparent 70%)`, filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 900, color: c.text, marginTop: 4, marginBottom: 2, gap: 4 }}>{t('cart.title')}</h1>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: c.textFaint, paddingTop: 10 }}>{items.reduce((a, i) => a + i.quantity, 0)} {t('cart.items')}</p>
        </div>

        <div className="cart-layout">

          {/* Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {items.map(({ part, quantity }) => {
              const icon = CATEGORY_ICONS[part.category?.slug] || '🔩'
              return (
                <div key={part.id} className="cart-item-card">
                  <div className="energy-bar" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, opacity: 0.4 }} />

                  {/* Thumb */}
                  <Link to={`/catalog/${part.slug}`} style={{ textDecoration: 'none' }}>
                    <div className="cart-thumb">
                      {part.images?.[0]
                        ? <img src={part.images[0]} alt={part.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }} />
                        : <span style={{ fontSize: 26 }}>{icon}</span>}
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="cart-info">
                    <div style={{ textDecoration: 'none', width: 'auto' }}>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, color: c.text, lineHeight: 1.3, marginBottom: 6 }}>{getPartName(part, i18n.language)}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' as const }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: c.teal, background: dark ? 'rgba(34,211,184,0.08)' : 'rgba(10,140,122,0.08)', border: `1px solid ${dark ? 'rgba(34,211,184,0.2)' : 'rgba(10,140,122,0.2)'}`, padding: '2px 7px', borderRadius: 20, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
                        {getCategoryName(part.category, i18n.language)}
                      </span>
                      {part.oemNumber && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: c.textFaint }}>{part.oemNumber}</span>}
                    </div>
                  </div>

                  {/* Price + qty + delete */}
                  <div className="cart-price-block">
                    {/* Qty */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <button className="qty-btn" onClick={() => updateQuantity(part.id, quantity - 1)}><Minus size={12} /></button>
                      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: c.text, minWidth: 20, textAlign: 'center' as const }}>{quantity}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(part.id, quantity + 1)} disabled={quantity >= part.stock}><Plus size={12} /></button>
                    </div>

                    {/* Price */}
                    <div style={{ textAlign: 'right' as const, marginTop: 20 }}>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700, color: c.accent }}>
                        {part.price * quantity}₾
                      </div>
                      
                      {/* Always rendered to reserve height, hidden when quantity === 1 */}
                      <div 
                        style={{ 
                          fontFamily: "'JetBrains Mono', monospace", 
                          fontSize: 11, 
                          color: c.textFaint,
                          visibility: quantity > 1 ? 'visible' : 'hidden' 
                        }}
                      >
                        {part.price}₾ {t('common.eachPrice')}
                      </div>
                    </div>

                    {/* Delete */}
                    {/* <button className="del-btn" onClick={() => removeItem(part.id)}><Trash2 size={13} /></button> */}
                  </div>
                </div>
              )
            })}

            <Link to="/catalog" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: c.textMuted, textDecoration: 'none', fontSize: 13, fontFamily: "'Inter', sans-serif", padding: '8px 0', marginTop: 4, width: '160px' }}>
              <ShoppingBag size={14} /> {t('cart.continueShopping')}
            </Link>
          </div>

          {/* Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="summary-card">
              <div className="energy-bar" style={{ height: 2 }} />
              <div style={{ padding: '16px 18px' }}>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700, color: c.text, marginBottom: 16 }}>{t('cart.orderSummary')}</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${c.divider}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Inter', sans-serif", fontSize: 13, color: c.textMuted }}>
                    <span>{t('cart.subtotal')} ({items.reduce((a, i) => a + i.quantity, 0)} {t('cart.items')})</span>
                    <span style={{ color: c.text }}>{(subtotal)}₾</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Inter', sans-serif", fontSize: 13, color: c.textMuted }}>
                    <span>{t('cart.shipping')}</span><span style={{ color: c.text }}>{(shipping)}₾</span>
                  </div>
                  {discountAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#4ade80' }}>
                      <span>{t('cart.discount')}</span><span>−{(discountAmount)}₾</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, paddingTop: 10, borderTop: `1px solid ${c.divider}`, marginTop: 4 }}>
                    <span style={{ color: c.text }}>{t('cart.total')}</span>
                    <span style={{ color: c.accent }}>{(orderTotal)}₾</span>
                  </div>
                </div>

                {/* Promo */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <Tag size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: c.textFaint }} />
                      <input className="promo-input" placeholder={t('cart.promoPlaceholder')} value={promoCode}
                        onChange={(e) => { setPromoCode(e.target.value); setPromoError(''); setPromoResult(null) }}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()} />
                    </div>
                    <button onClick={handleApplyPromo} disabled={promoLoading} style={{ padding: '9px 12px', borderRadius: 8, border: `1px solid ${c.inputBorder}`, background: c.inputBg, color: c.text, fontSize: 12, cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", whiteSpace: 'nowrap' as const, flexShrink: 0 }}>
                      {promoLoading ? '…' : t('cart.apply')}
                    </button>
                  </div>
                  {promoError && <p style={{ fontSize: 12, color: '#f87171', marginTop: 6, fontFamily: "'Inter', sans-serif" }}>{promoError}</p>}
                  {promoResult && <p style={{ fontSize: 12, color: '#4ade80', marginTop: 6, fontFamily: "'Inter', sans-serif" }}>✓ {promoResult.description || `${promoResult.discount}% off applied`}</p>}
                </div>

                <button className="checkout-btn" onClick={() => user
                  ? navigate('/checkout', { state: { promoCode: promoResult ? promoCode : undefined } })
                  : navigate('/login?redirect=/checkout')}>
                  {user ? t('cart.checkout') : t('cart.signInToCheckout')} <ArrowRight size={16} />
                </button>
                {!user && <p style={{ textAlign: 'center', color: c.textFaint, fontSize: 12, marginTop: 10, fontFamily: "'Inter', sans-serif" }}>{t('cart.signInNote')}</p>}
              </div>
            </div>

            {/* Trust */}
            <div className="summary-card" style={{ padding: '12px 16px' }}>
              {[
                { icon: ShieldCheck, text: t('cart.secureSSL') },
                { icon: RotateCcw, text: t('cart.freeReturns') },
                { icon: BadgeCheck, text: t('cart.genuineParts') },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="trust-item">
                  <Icon size={14} style={{ color: c.teal, flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: c.textMuted }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}