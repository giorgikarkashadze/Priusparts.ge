import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ShoppingCart, Star, ChevronRight, ChevronLeft,
  Package, RotateCcw, Shield, Zap, AlertTriangle, CheckCircle
} from 'lucide-react'
import { usePart } from '@/hooks/useProducts'
import { useCartStore, useThemeStore } from '@/store'
import { discount } from '@/lib/utils'
import { getCategoryName, getPartDescription, getPartName } from '@/hooks/usePartLocale'
import { useTranslation } from 'react-i18next'

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: part, isLoading, isError } = usePart(slug!)
  const addItem = useCartStore((s) => s.addItem)
  const { dark } = useThemeStore()
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [added, setAdded] = useState(false)
  const { t } = useTranslation()
  const { i18n } = useTranslation()

  // Theme tokens
  const c = dark ? {
    pageBg: '#05070C',
    cardBg: 'rgba(13,18,30,0.8)',
    cardBorder: 'rgba(124,138,165,0.12)',
    text: '#EAF2FF',
    textMuted: '#7C8AA5',
    textFaint: '#4A5670',
    accent: '#4C7CFF',
    teal: '#22D3B8',
    gradient: 'linear-gradient(135deg, #4C7CFF, #22D3B8)',
    energyLine: 'linear-gradient(90deg, #4C7CFF, #22D3B8, #4C7CFF, #22D3B8)',
    gridColor: 'rgba(76,124,255,0.04)',
    glowBlue: 'rgba(76,124,255,0.08)',
    glowTeal: 'rgba(34,211,184,0.06)',
    imageBg: 'rgba(10,15,30,0.9)',
    thumbBg: 'rgba(10,15,30,0.8)',
    thumbActiveBorder: '#22D3B8',
    thumbActiveGlow: 'rgba(34,211,184,0.3)',
    oemBg: 'rgba(76,124,255,0.08)',
    oemBorder: 'rgba(76,124,255,0.2)',
    oemLabelColor: '#4C7CFF',
    oemValueColor: '#EAF2FF',
    qtyBg: 'rgba(255,255,255,0.03)',
    qtyBorder: 'rgba(124,138,165,0.2)',
    divider: 'rgba(124,138,165,0.1)',
    trustBg: 'rgba(255,255,255,0.02)',
    trustBorder: 'rgba(124,138,165,0.1)',
    compatBg: 'rgba(76,124,255,0.06)',
    compatHover: 'rgba(76,124,255,0.05)',
    reviewBg: 'rgba(255,255,255,0.02)',
    reviewBorder: 'rgba(124,138,165,0.1)',
    stockGreen: '#22D3B8',
    stockGreenGlow: 'rgba(34,211,184,0.6)',
    stockOrange: '#F59E0B',
    stockRed: '#FF6B57',
    discountBg: 'linear-gradient(135deg, #FF6B57, #FF9A57)',
    saveBg: 'rgba(255,107,87,0.1)',
    saveBorder: 'rgba(255,107,87,0.2)',
    saveColor: '#FF6B57',
    cornerColor: 'rgba(34,211,184,0.4)',
    breadcrumbColor: '#4A5670',
    breadcrumbHover: '#22D3B8',
    categoryColor: '#22D3B8',
  } : {
    pageBg: '#F0F4FF',
    cardBg: 'rgba(255,255,255,0.92)',
    cardBorder: 'rgba(60,90,200,0.12)',
    text: '#0B1220',
    textMuted: '#4A5A7A',
    textFaint: '#8A9AB8',
    accent: '#2952CC',
    teal: '#0A8C7A',
    gradient: 'linear-gradient(135deg, #2952CC, #0A8C7A)',
    energyLine: 'linear-gradient(90deg, #2952CC, #0A8C7A, #2952CC, #0A8C7A)',
    gridColor: 'rgba(41,82,204,0.04)',
    glowBlue: 'rgba(41,82,204,0.06)',
    glowTeal: 'rgba(10,140,122,0.05)',
    imageBg: '#E8EEFF',
    thumbBg: '#ffffff',
    thumbActiveBorder: '#0A8C7A',
    thumbActiveGlow: 'rgba(10,140,122,0.25)',
    oemBg: 'rgba(41,82,204,0.06)',
    oemBorder: 'rgba(41,82,204,0.2)',
    oemLabelColor: '#2952CC',
    oemValueColor: '#0B1220',
    qtyBg: '#F8FAFF',
    qtyBorder: 'rgba(60,90,200,0.2)',
    divider: 'rgba(60,90,200,0.1)',
    trustBg: '#ffffff',
    trustBorder: 'rgba(60,90,200,0.12)',
    compatBg: 'rgba(41,82,204,0.04)',
    compatHover: 'rgba(41,82,204,0.04)',
    reviewBg: '#ffffff',
    reviewBorder: 'rgba(60,90,200,0.12)',
    stockGreen: '#0A8C7A',
    stockGreenGlow: 'none',
    stockOrange: '#D97706',
    stockRed: '#DC2626',
    discountBg: 'linear-gradient(135deg, #DC2626, #EA580C)',
    saveBg: 'rgba(220,38,38,0.08)',
    saveBorder: 'rgba(220,38,38,0.2)',
    saveColor: '#DC2626',
    cornerColor: 'rgba(10,140,122,0.4)',
    breadcrumbColor: '#8A9AB8',
    breadcrumbHover: '#0A8C7A',
    categoryColor: '#0A8C7A',
  }

  const handleAddToCart = () => {
    if (!part) return
    addItem(part, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  // Loading state
  if (isLoading) return (
    <div style={{ minHeight: '100vh', background: c.pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid transparent', borderTopColor: c.accent, borderRightColor: c.teal, animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: c.teal, letterSpacing: '0.15em' }}>LOADING PART DATA…</div>
      </div>
    </div>
  )

  if (isError || !part) return (
    <div style={{ minHeight: '100vh', background: c.pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 56 }}>🔍</div>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: c.text }}>Part not found</div>
      <Link to="/catalog" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: c.accent, textDecoration: 'none', letterSpacing: '0.1em' }}>← BACK TO CATALOG</Link>
    </div>
  )

  const disc = discount(part.price, part.comparePrice)
  const images = part.images && part.images.length > 0 ? part.images : [null]
  const avgRating = part.reviews?.length
    ? part.reviews.reduce((sum, r) => sum + r.rating, 0) / part.reviews.length
    : 4.2

  const CATEGORY_ICONS: Record<string, string> = {
    engine: '🔧', brakes: '🛞', suspension: '⚙️', electrical: '⚡', filters: '🌀', hybrid: '🔋',
  }
  const icon = CATEGORY_ICONS[part.category?.slug] || '🔩'

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
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px ${c.glowBlue}; }
          50% { box-shadow: 0 0 40px ${c.glowTeal}; }
        }
        @keyframes add-success {
          0% { transform: scale(1); }
          40% { transform: scale(1.04); }
          100% { transform: scale(1); }
        }
        .product-grid-bg {
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
        .image-card {
          background: ${c.imageBg};
          border: 1px solid ${c.cardBorder};
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          animation: glow-pulse 5s ease-in-out infinite;
          backdrop-filter: blur(8px);
        }
        .thumb-btn {
          border-radius: 10px; overflow: hidden; cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.2s ease;
          background: ${c.thumbBg};
          display: flex; align-items: center; justify-content: center;
        }
        .thumb-btn:hover { border-color: ${c.thumbActiveBorder}; opacity: 0.9; }
        .thumb-btn.active {
          border-color: ${c.thumbActiveBorder};
          box-shadow: 0 0 12px ${c.thumbActiveGlow};
        }
        .qty-btn {
          width: 38px; height: 38px; border-radius: 9px;
          border: 1px solid ${c.qtyBorder};
          background: ${c.qtyBg}; color: ${c.text};
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          font-size: 18px; font-weight: 300;
          transition: all 0.15s ease;
        }
        .qty-btn:hover:not(:disabled) {
          border-color: ${c.teal}; color: ${c.teal};
          background: ${dark ? 'rgba(34,211,184,0.06)' : 'rgba(10,140,122,0.06)'};
        }
        .qty-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .add-btn {
          flex: 1; padding: 14px; border-radius: 12px; border: none;
          font-size: 15px; font-weight: 700; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          font-family: 'Space Grotesk', sans-serif;
          transition: all 0.2s ease;
        }
        .add-btn.ready {
          background: ${c.gradient};
          color: ${dark ? '#04121A' : '#fff'};
          box-shadow: 0 4px 24px ${dark ? 'rgba(76,124,255,0.4)' : 'rgba(41,82,204,0.3)'};
        }
        .add-btn.ready:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 32px ${dark ? 'rgba(76,124,255,0.5)' : 'rgba(41,82,204,0.4)'};
        }
        .add-btn.success {
          background: ${dark ? 'linear-gradient(135deg, #22D3B8, #4C7CFF)' : 'linear-gradient(135deg, #0A8C7A, #2952CC)'};
          color: ${dark ? '#04121A' : '#fff'};
          animation: add-success 0.4s ease;
        }
        .add-btn:disabled { background: ${dark ? 'rgba(124,138,165,0.15)' : 'rgba(100,116,139,0.12)'}; color: ${c.textFaint}; cursor: not-allowed; }
        .trust-card {
          flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px;
          padding: 12px 8px; border-radius: 12px;
          background: ${c.trustBg}; border: 1px solid ${c.trustBorder};
          transition: all 0.2s ease;
        }
        .trust-card:hover {
          border-color: ${dark ? 'rgba(34,211,184,0.25)' : 'rgba(10,140,122,0.25)'};
          transform: translateY(-1px);
        }
        .compat-row { transition: background 0.15s ease; }
        .compat-row:hover { background: ${c.compatHover}; }
        .review-card {
          background: ${c.reviewBg};
          border: 1px solid ${c.reviewBorder};
          border-radius: 14px; padding: 18px;
          transition: all 0.2s ease;
          position: relative; overflow: hidden;
        }
        .review-card::before {
          content: '"';
          position: absolute; top: -8px; left: 14px;
          font-size: 56px; color: ${c.accent};
          opacity: ${dark ? 0.1 : 0.08};
          font-family: Georgia, serif; line-height: 1;
          pointer-events: none;
        }
        .review-card:hover {
          border-color: ${dark ? 'rgba(76,124,255,0.2)' : 'rgba(41,82,204,0.2)'};
          transform: translateY(-2px);
        }
        .breadcrumb-link {
          font-family: 'JetBrains Mono', monospace; font-size: 11px;
          color: ${c.breadcrumbColor}; text-decoration: none;
          transition: color 0.15s; letter-spacing: 0.04em;
        }
        .breadcrumb-link:hover { color: ${c.breadcrumbHover}; }
        .nav-arrow {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 34px; height: 34px; border-radius: 10px; z-index: 3;
          background: ${dark ? 'rgba(10,15,30,0.85)' : 'rgba(255,255,255,0.85)'};
          border: 1px solid ${c.cardBorder}; cursor: pointer;
          color: ${c.text}; display: flex; align-items: center; justify-content: center;
          backdrop-filter: blur(8px); transition: all 0.15s ease;
        }
        .nav-arrow:hover {
          border-color: ${c.teal}; color: ${c.teal};
          box-shadow: 0 4px 12px ${dark ? 'rgba(34,211,184,0.2)' : 'rgba(10,140,122,0.2)'};
        }
        @media (max-width: 768px) {
          .product-main-grid { grid-template-columns: 1fr !important; }
          .trust-row { flex-wrap: wrap !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .energy-bar, .product-grid-bg, .image-card { animation: none; }
          .add-btn.ready:hover, .trust-card:hover { transform: none; }
        }
      `}</style>

      {/* Background */}
      <div className="product-grid-bg" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', top: '10%', right: '5%', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, ${c.glowBlue}, transparent 70%)`, filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '15%', left: '5%', width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, ${c.glowTeal}, transparent 70%)`, filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '24px 16px 56px' }}>

        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 28, animation: 'fade-up 0.3s ease-out both' }}>
          <Link to="/" className="breadcrumb-link">{t('product.nav.home')}</Link>
          <ChevronRight size={11} style={{ color: c.textFaint }} />
          <Link to="/catalog" className="breadcrumb-link">{t('product.nav.catalog')}</Link>
          <ChevronRight size={11} style={{ color: c.textFaint }} />
          <Link to={`/catalog?category=${part.category?.slug}`} className="breadcrumb-link">{getCategoryName(part.category, i18n.language)}</Link>
          <ChevronRight size={11} style={{ color: c.textFaint }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: c.teal, letterSpacing: '0.04em', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {getPartName(part, i18n.language)}
          </span>
        </nav>

        {/* Main grid */}
        <div className="product-main-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36, marginBottom: 56 }}>

          {/* Left — Images */}
          <div style={{ animation: 'fade-up 0.4s 0.05s ease-out both' }}>

            {/* Main image */}
            <div className="image-card" style={{ aspectRatio: '1', marginBottom: 12 }}>
              <div className="energy-bar" style={{ height: 2, position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2 }} />

              {images[activeImage] ? (
                <img
                  src={images[activeImage]!}
                  alt={part.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 96 }}>
                  {icon}
                </div>
              )}

              {/* Discount badge */}
              {disc && (
                <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 3, background: c.discountBg, color: '#fff', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20, fontFamily: "'JetBrains Mono', monospace", boxShadow: '0 4px 12px rgba(255,107,87,0.4)' }}>
                  -{disc}%
                </div>
              )}

              {/* Corner brackets */}
              {[
                { top: 10, left: 10, bTop: true, bLeft: true },
                { top: 10, right: 10, bTop: true, bRight: true },
                { bottom: 10, left: 10, bBottom: true, bLeft: true },
                { bottom: 10, right: 10, bBottom: true, bRight: true },
              ].map((pos, i) => (
                <div key={i} style={{
                  position: 'absolute', width: 18, height: 18, zIndex: 2, pointerEvents: 'none',
                  top: (pos as any).top, left: (pos as any).left, right: (pos as any).right, bottom: (pos as any).bottom,
                  borderTop: (pos as any).bTop ? `2px solid ${c.cornerColor}` : undefined,
                  borderLeft: (pos as any).bLeft ? `2px solid ${c.cornerColor}` : undefined,
                  borderRight: (pos as any).bRight ? `2px solid ${c.cornerColor}` : undefined,
                  borderBottom: (pos as any).bBottom ? `2px solid ${c.cornerColor}` : undefined,
                }} />
              ))}

              {/* Image nav arrows */}
              {images.length > 1 && (
                <>
                  <button className="nav-arrow" style={{ left: 12 }} onClick={() => setActiveImage(i => Math.max(0, i - 1))}>
                    <ChevronLeft size={16} />
                  </button>
                  <button className="nav-arrow" style={{ right: 12 }} onClick={() => setActiveImage(i => Math.min(images.length - 1, i + 1))}>
                    <ChevronRight size={16} />
                  </button>
                </>
              )}

              {/* Image counter */}
              {images.length > 1 && (
                <div style={{ position: 'absolute', bottom: 14, right: 14, zIndex: 3, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: c.textMuted, background: dark ? 'rgba(5,7,12,0.7)' : 'rgba(255,255,255,0.8)', padding: '3px 8px', borderRadius: 6, backdropFilter: 'blur(8px)' }}>
                  {activeImage + 1}/{images.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {images.map((img, i) => (
                  <button key={i} className={`thumb-btn${activeImage === i ? ' active' : ''}`}
                    onClick={() => setActiveImage(i)}
                    style={{ width: 64, height: 64, padding: 4, flexShrink: 0 }}>
                    {img
                      ? <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      : <span style={{ fontSize: 24 }}>{icon}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right — Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fade-up 0.4s 0.1s ease-out both' }}>

            {/* Category tag */}
            <div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: c.categoryColor, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                // {getCategoryName(part.category, i18n.language)}
              </span>
            </div>

            {/* Name */}
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 30, fontWeight: 700, color: c.text, lineHeight: 1.2, letterSpacing: '-0.5px', margin: 0 }}>
              {getPartName(part, i18n.language)}
            </h1>

            {/* OEM */}
            {part.oemNumber && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: c.oemBg, border: `1px solid ${c.oemBorder}`, borderRadius: 10, padding: '8px 14px', width: 'fit-content' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: c.oemLabelColor, letterSpacing: '0.12em', textTransform: 'uppercase' }}>OEM</span>
                <div style={{ width: 1, height: 12, background: c.oemBorder }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: c.oemValueColor, fontWeight: 500 }}>{part.oemNumber}</span>
              </div>
            )}

            {/* Rating */}
            {/* <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} style={{ fill: i < Math.round(avgRating) ? '#F59E0B' : 'none', color: i < Math.round(avgRating) ? '#F59E0B' : c.textFaint }} />
                ))}
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: c.textFaint }}>
                {avgRating.toFixed(1)} ({part.reviews?.length ?? 0} reviews)
              </span>
            </div> */}

            {/* Price */}
            <div style={{ padding: '18px 0', borderTop: `1px solid ${c.divider}`, borderBottom: `1px solid ${c.divider}` }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 38, fontWeight: 700, color: c.accent, letterSpacing: '-1px' }}>
                  {part.price}₾
                </span>
                {part.comparePrice && (
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 20, color: c.textFaint, textDecoration: 'line-through' }}>
                    {part.comparePrice}
                  </span>
                )}
                {disc && (
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: c.saveColor, background: c.saveBg, border: `1px solid ${c.saveBorder}`, padding: '4px 10px', borderRadius: 8 }}>
                    {t('product.save')} {disc}%
                  </span>
                )}
              </div>
            </div>

            {/* Stock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {part.stock > 10 ? (
                <>
                  <CheckCircle size={16} style={{ color: c.stockGreen, flexShrink: 0 }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: c.stockGreen }}>
                    {t('product.inStock')} {part.stock} {t('product.available')}
                  </span>
                </>
              ) : part.stock > 0 ? (
                <>
                  <AlertTriangle size={16} style={{ color: c.stockOrange, flexShrink: 0 }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: c.stockOrange }}>
                    {t('product.lowStock')} {part.stock}
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle size={16} style={{ color: c.stockRed, flexShrink: 0 }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: c.stockRed }}>
                    {t('product.outOfStock')}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            {part.description && (
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: c.textMuted, lineHeight: 1.75, margin: 0 }}>
                {getPartDescription(part, i18n.language)}
              </p>
            )}

            {/* Qty + Add to cart */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', background: c.qtyBg, border: `1px solid ${c.qtyBorder}`, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
                <button className="qty-btn" style={{ border: 'none', borderRight: `1px solid ${c.qtyBorder}`, borderRadius: 0 }}
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                <span style={{ width: 44, textAlign: 'center', fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, color: c.text }}>{quantity}</span>
                <button className="qty-btn" style={{ border: 'none', borderLeft: `1px solid ${c.qtyBorder}`, borderRadius: 0 }}
                  disabled={quantity >= part.stock}
                  onClick={() => setQuantity(q => Math.min(part.stock, q + 1))}>+</button>
              </div>
              <button
                className={`add-btn${added ? ' success' : part.stock > 0 ? ' ready' : ''}`}
                onClick={handleAddToCart}
                disabled={part.stock === 0}
              >
                {added ? <><Zap size={16} /> {t('product.added')}</> : <><ShoppingCart size={16} /> {t('product.addToCart')}</>}
              </button>
            </div>

            {/* Trust badges */}
            <div className="trust-row" style={{ display: 'flex', gap: 8 }}>
              {[
                { icon: Package, title: t('product.freeReturns'), sub: t('product.freeReturnsSub') },
                { icon: Shield, title: t('product.oemQuality'), sub: t('product.oemQualitySub') },
                { icon: RotateCcw, title: t('product.fastDelivery'), sub: t('product.fastDeliverySub') },
              ].map(({ icon: Icon, title, sub }) => (
                <div key={title} className="trust-card">
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: c.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={14} style={{ color: dark ? '#04121A' : '#fff' }} />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: c.text }}>{title}</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: c.textFaint, marginTop: 1, letterSpacing: '0.05em' }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Compatibility */}
        {/* {part.compatibility && part.compatibility.length > 0 && (
          <section style={{ marginBottom: 48, animation: 'fade-up 0.4s 0.2s ease-out both' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <div className="energy-bar" style={{ height: 2, width: 28, borderRadius: 2, flexShrink: 0 }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: c.categoryColor, letterSpacing: '0.12em', textTransform: 'uppercase' }}>// COMPATIBILITY</span>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: c.text, margin: 0 }}>
                Vehicle Compatibility
              </h2>
            </div>
            <div style={{ background: c.cardBg, backdropFilter: 'blur(12px)', border: `1px solid ${c.cardBorder}`, borderRadius: 16, overflow: 'hidden' }}>
              <div className="energy-bar" style={{ height: 2 }} />
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: c.compatBg }}>
                    {['Make', 'Model', 'Years'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '12px 18px', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.12em', color: c.categoryColor, borderBottom: `1px solid ${c.divider}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {part.compatibility.map((comp, i) => (
                    <tr key={comp.id} className="compat-row" style={{ borderBottom: i < part.compatibility!.length - 1 ? `1px solid ${c.divider}` : 'none' }}>
                      <td style={{ padding: '13px 18px', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: c.text }}>{comp.model.make.name}</td>
                      <td style={{ padding: '13px 18px', fontFamily: "'Inter', sans-serif", color: c.textMuted }}>{comp.model.name}</td>
                      <td style={{ padding: '13px 18px', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: c.accent }}>
                        {comp.years.sort((a: number, b: number) => a - b).join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )} */}

        {/* Reviews */}
        {/* <section style={{ animation: 'fade-up 0.4s 0.25s ease-out both' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <div className="energy-bar" style={{ height: 2, width: 28, borderRadius: 2, flexShrink: 0 }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: c.categoryColor, letterSpacing: '0.12em', textTransform: 'uppercase' }}>// REVIEWS</span>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: c.text, margin: 0 }}>
              Customer Reviews
            </h2>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: c.textFaint }}>
              ({part.reviews?.length ?? 0})
            </span>
          </div>

          {part.reviews && part.reviews.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
              {part.reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: c.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 700, color: dark ? '#04121A' : '#fff', flexShrink: 0 }}>
                        {review.user.name[0].toUpperCase()}
                      </div>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, color: c.text }}>{review.user.name}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} style={{ fill: i < review.rating ? '#F59E0B' : 'none', color: i < review.rating ? '#F59E0B' : c.textFaint }} />
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: c.textMuted, lineHeight: 1.65, margin: '0 0 12px' }}>
                      {review.comment}
                    </p>
                  )}
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: c.textFaint, letterSpacing: '0.05em' }}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: c.cardBg, backdropFilter: 'blur(12px)', border: `1px solid ${c.cardBorder}`, borderRadius: 16, padding: '48px 24px', textAlign: 'center' }}>
              <Star size={28} style={{ color: c.textFaint, margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: c.textFaint }}>
                No reviews yet. Be the first to review this part.
              </div>
            </div>
          )}
        </section> */}
      </div>
    </div>
  )
}