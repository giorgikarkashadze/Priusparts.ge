import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingCart, Star, ChevronRight, Package, RotateCcw, Shield, Zap, ChevronLeft } from 'lucide-react'
import { usePart } from '@/hooks/useProducts'
import { useCartStore } from '@/store'
import { formatPrice, discount } from '@/lib/utils'

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: part, isLoading, isError } = usePart(slug!)
  const addItem = useCartStore((s) => s.addItem)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    if (!part) return
    addItem(part, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (isLoading) return (
    <div style={{ minHeight: '100vh', background: '#05070C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes energy-flow { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
      `}</style>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid transparent', borderTopColor: '#4C7CFF', borderRightColor: '#22D3B8', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#22D3B8', letterSpacing: '0.15em' }}>LOADING PART DATA…</div>
      </div>
    </div>
  )

  if (isError || !part) return (
    <div style={{ minHeight: '100vh', background: '#05070C', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 48 }}>🔍</div>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 600, color: '#EAF2FF' }}>Part not found</div>
      <Link to="/catalog" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#4C7CFF', textDecoration: 'none', letterSpacing: '0.1em' }}>← BACK TO CATALOG</Link>
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
    <div style={{ minHeight: '100vh', background: '#05070C', color: '#EAF2FF' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes energy-flow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes grid-drift {
          from { background-position: 0 0; }
          to { background-position: 48px 48px; }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(76,124,255,0.2); }
          50% { box-shadow: 0 0 40px rgba(34,211,184,0.3); }
        }
        @keyframes add-success {
          0% { transform: scale(1); }
          50% { transform: scale(1.03); }
          100% { transform: scale(1); }
        }
        .product-grid-bg {
          background-image:
            linear-gradient(rgba(76,124,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(76,124,255,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          animation: grid-drift 18s linear infinite;
        }
        .energy-bar {
          background: linear-gradient(90deg, #4C7CFF, #22D3B8, #4C7CFF, #22D3B8);
          background-size: 200% 100%;
          animation: energy-flow 4s linear infinite;
        }
        .thumb-btn {
          border-radius: 10px; overflow: hidden; cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.2s ease;
          background: rgba(10,15,30,0.8);
        }
        .thumb-btn:hover { border-color: rgba(34,211,184,0.4); }
        .thumb-btn.active {
          border-color: #22D3B8;
          box-shadow: 0 0 12px rgba(34,211,184,0.3);
        }
        .qty-btn {
          width: 36px; height: 36px; border-radius: 8px;
          border: 1px solid rgba(124,138,165,0.25);
          background: rgba(255,255,255,0.04); color: #EAF2FF;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          font-size: 18px; transition: all 0.15s ease;
        }
        .qty-btn:hover { border-color: #22D3B8; color: #22D3B8; background: rgba(34,211,184,0.08); }
        .qty-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .add-cart-btn {
          flex: 1; padding: 14px; border-radius: 12px; border: none;
          font-size: 15px; font-weight: 700; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          font-family: 'Space Grotesk', sans-serif;
          transition: all 0.2s ease;
        }
        .add-cart-btn.ready {
          background: linear-gradient(135deg, #4C7CFF, #22D3B8);
          color: #04121A;
          box-shadow: 0 4px 24px rgba(76,124,255,0.4);
        }
        .add-cart-btn.ready:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 32px rgba(76,124,255,0.5);
        }
        .add-cart-btn.ready:active { transform: scale(0.98); }
        .add-cart-btn.success {
          background: linear-gradient(135deg, #22D3B8, #4C7CFF);
          color: #04121A; animation: add-success 0.4s ease;
        }
        .add-cart-btn:disabled {
          background: rgba(124,138,165,0.15); color: #4A5670; cursor: not-allowed;
          box-shadow: none;
        }
        .trust-badge {
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          padding: 12px 8px; border-radius: 10px;
          background: rgba(255,255,255,0.02); border: 1px solid rgba(124,138,165,0.1);
          flex: 1; transition: all 0.2s;
        }
        .trust-badge:hover { border-color: rgba(34,211,184,0.2); background: rgba(34,211,184,0.03); }
        .compat-row:hover { background: rgba(76,124,255,0.05); }
        .review-card {
          background: rgba(255,255,255,0.02); border: 1px solid rgba(124,138,165,0.1);
          border-radius: 12px; padding: 16px; transition: border-color 0.2s;
        }
        .review-card:hover { border-color: rgba(76,124,255,0.2); }
        .breadcrumb-link { color: #4A5670; text-decoration: none; font-size: 12px; transition: color 0.15s; }
        .breadcrumb-link:hover { color: #22D3B8; }
        @media (max-width: 768px) {
          .product-grid { grid-template-columns: 1fr !important; }
          .trust-row { flex-direction: column !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .energy-bar, .product-grid-bg { animation: none; }
        }
      `}</style>

      {/* Background */}
      <div className="product-grid-bg" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', top: '10%', right: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(76,124,255,0.07), transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '10%', left: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,184,0.05), transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>

        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 28, animation: 'fade-up 0.3s ease-out both' }}>
          <Link to="/" className="breadcrumb-link">Home</Link>
          <ChevronRight size={12} style={{ color: '#1e293b' }} />
          <Link to="/catalog" className="breadcrumb-link">Catalog</Link>
          <ChevronRight size={12} style={{ color: '#1e293b' }} />
          <Link to={`/catalog?category=${part.category?.slug}`} className="breadcrumb-link">{part.category?.name}</Link>
          <ChevronRight size={12} style={{ color: '#1e293b' }} />
          <span style={{ fontSize: 12, color: '#7C8AA5', fontFamily: "'Inter', sans-serif" }}>{part.name}</span>
        </nav>

        {/* Main grid */}
        <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 48 }}>

          {/* Left — Images */}
          <div style={{ animation: 'fade-up 0.4s 0.05s ease-out both' }}>
            {/* Main image */}
            <div style={{
              background: 'rgba(10,15,30,0.8)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(124,138,165,0.12)', borderRadius: 16,
              overflow: 'hidden', position: 'relative', aspectRatio: '1',
              animation: 'glow-pulse 4s ease-in-out infinite'
            }}>
              {/* Energy line top */}
              <div className="energy-bar" style={{ height: 2, width: '100%', position: 'absolute', top: 0, left: 0, zIndex: 2 }} />

              {images[activeImage] ? (
                <img src={images[activeImage]!} alt={part.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 24, transition: 'transform 0.4s ease' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80 }}>
                  {icon}
                </div>
              )}

              {disc && (
                <div style={{
                  position: 'absolute', top: 16, right: 16, zIndex: 3,
                  background: 'linear-gradient(135deg, #FF6B57, #FF9A57)',
                  color: '#fff', fontSize: 12, fontWeight: 700, padding: '4px 12px',
                  borderRadius: 20, fontFamily: "'JetBrains Mono', monospace",
                  boxShadow: '0 4px 12px rgba(255,107,87,0.4)'
                }}>
                  -{disc}%
                </div>
              )}

              {/* Corner brackets */}
              {[
                { top: 8, left: 8, borderTop: true, borderLeft: true },
                { top: 8, right: 8, borderTop: true, borderRight: true },
                { bottom: 8, left: 8, borderBottom: true, borderLeft: true },
                { bottom: 8, right: 8, borderBottom: true, borderRight: true },
              ].map((pos, i) => (
                <div key={i} style={{
                  position: 'absolute', width: 16, height: 16, zIndex: 2,
                  top: pos.top, left: (pos as any).left, right: (pos as any).right, bottom: (pos as any).bottom,
                  borderTop: pos.borderTop ? '2px solid rgba(34,211,184,0.4)' : undefined,
                  borderLeft: pos.borderLeft ? '2px solid rgba(34,211,184,0.4)' : undefined,
                  borderRight: (pos as any).borderRight ? '2px solid rgba(34,211,184,0.4)' : undefined,
                  borderBottom: (pos as any).borderBottom ? '2px solid rgba(34,211,184,0.4)' : undefined,
                  pointerEvents: 'none'
                }} />
              ))}

              {/* Nav arrows for multiple images */}
              {images.length > 1 && (
                <>
                  <button onClick={() => setActiveImage(i => Math.max(0, i - 1))}
                    style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 3, background: 'rgba(10,15,30,0.8)', border: '1px solid rgba(124,138,165,0.2)', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', color: '#EAF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={() => setActiveImage(i => Math.min(images.length - 1, i + 1))}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 3, background: 'rgba(10,15,30,0.8)', border: '1px solid rgba(124,138,165,0.2)', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', color: '#EAF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
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
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#22D3B8', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                // {part.category?.name}
              </span>
            </div>

            {/* Name */}
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: '#EAF2FF', lineHeight: 1.2, letterSpacing: '-0.5px' }}>
              {part.name}
            </h1>

            {/* OEM */}
            {part.oemNumber && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(76,124,255,0.08)', border: '1px solid rgba(76,124,255,0.2)', borderRadius: 8, padding: '6px 12px', width: 'fit-content' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#4C7CFF', letterSpacing: '0.1em' }}>OEM</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: '#EAF2FF' }}>{part.oemNumber}</span>
              </div>
            )}

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} style={{ fill: i < Math.round(avgRating) ? '#F59E0B' : 'none', color: i < Math.round(avgRating) ? '#F59E0B' : '#1e293b' }} />
                ))}
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#4A5670' }}>
                {avgRating.toFixed(1)} ({part.reviews?.length ?? 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, padding: '16px 0', borderTop: '1px solid rgba(124,138,165,0.1)', borderBottom: '1px solid rgba(124,138,165,0.1)' }}>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 36, fontWeight: 700, color: '#4C7CFF', letterSpacing: '-1px' }}>
                {formatPrice(part.price)}
              </span>
              {part.comparePrice && (
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, color: '#4A5670', textDecoration: 'line-through' }}>
                  {formatPrice(part.comparePrice)}
                </span>
              )}
              {disc && (
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#FF6B57', background: 'rgba(255,107,87,0.1)', border: '1px solid rgba(255,107,87,0.2)', padding: '3px 8px', borderRadius: 6 }}>
                  SAVE {disc}%
                </span>
              )}
            </div>

            {/* Stock status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {part.stock > 10 ? (
                <>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22D3B8', boxShadow: '0 0 8px rgba(34,211,184,0.6)' }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#22D3B8' }}>IN STOCK — {part.stock} available</span>
                </>
              ) : part.stock > 0 ? (
                <>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B', boxShadow: '0 0 8px rgba(245,158,11,0.6)' }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#F59E0B' }}>LOW STOCK — only {part.stock} left</span>
                </>
              ) : (
                <>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF6B57', boxShadow: '0 0 8px rgba(255,107,87,0.6)' }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#FF6B57' }}>OUT OF STOCK</span>
                </>
              )}
            </div>

            {/* Description */}
            {part.description && (
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#7C8AA5', lineHeight: 1.7 }}>
                {part.description}
              </p>
            )}

            {/* Quantity + Add to cart */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(124,138,165,0.2)', borderRadius: 10, overflow: 'hidden' }}>
                <button className="qty-btn" style={{ border: 'none', borderRight: '1px solid rgba(124,138,165,0.15)', borderRadius: 0 }}
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                <span style={{ width: 44, textAlign: 'center', fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, color: '#EAF2FF' }}>{quantity}</span>
                <button className="qty-btn" style={{ border: 'none', borderLeft: '1px solid rgba(124,138,165,0.15)', borderRadius: 0 }}
                  disabled={quantity >= part.stock}
                  onClick={() => setQuantity(q => Math.min(part.stock, q + 1))}>+</button>
              </div>
              <button className={`add-cart-btn${added ? ' success' : part.stock > 0 ? ' ready' : ''}`}
                onClick={handleAddToCart} disabled={part.stock === 0}>
                {added ? <><Zap size={16} /> Added!</> : <><ShoppingCart size={16} /> Add to cart</>}
              </button>
            </div>

            {/* Trust badges */}
            <div className="trust-row" style={{ display: 'flex', gap: 8 }}>
              {[
                { icon: Package, text: 'Free returns', sub: 'within 30 days' },
                { icon: Shield, text: 'OEM quality', sub: 'genuine parts' },
                { icon: RotateCcw, text: 'Fast delivery', sub: '1–3 days GE' },
              ].map(({ icon: Icon, text, sub }) => (
                <div key={text} className="trust-badge">
                  <Icon size={16} style={{ color: '#22D3B8' }} />
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: '#EAF2FF' }}>{text}</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#4A5670', marginTop: 1 }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Compatibility table */}
        {part.compatibility && part.compatibility.length > 0 && (
          <section style={{ marginBottom: 40, animation: 'fade-up 0.4s 0.2s ease-out both' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div className="energy-bar" style={{ height: 2, width: 32, borderRadius: 2 }} />
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, color: '#EAF2FF' }}>
                Vehicle Compatibility
              </h2>
            </div>
            <div style={{ background: 'rgba(13,18,30,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(124,138,165,0.12)', borderRadius: 14, overflow: 'hidden' }}>
              <div className="energy-bar" style={{ height: 2 }} />
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'rgba(76,124,255,0.06)' }}>
                    {['Make', 'Model', 'Years'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#22D3B8', borderBottom: '1px solid rgba(124,138,165,0.1)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {part.compatibility.map((c) => (
                    <tr key={c.id} className="compat-row" style={{ borderBottom: '1px solid rgba(124,138,165,0.06)', transition: 'background 0.15s' }}>
                      <td style={{ padding: '12px 16px', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: '#EAF2FF' }}>{c.model.make.name}</td>
                      <td style={{ padding: '12px 16px', fontFamily: "'Inter', sans-serif", color: '#7C8AA5' }}>{c.model.name}</td>
                      <td style={{ padding: '12px 16px', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#4C7CFF' }}>
                        {c.years.sort((a: number, b: number) => a - b).join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Reviews */}
        <section style={{ animation: 'fade-up 0.4s 0.25s ease-out both' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div className="energy-bar" style={{ height: 2, width: 32, borderRadius: 2 }} />
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, color: '#EAF2FF' }}>
              Customer Reviews
            </h2>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#4A5670' }}>
              ({part.reviews?.length ?? 0})
            </span>
          </div>

          {part.reviews && part.reviews.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {part.reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #4C7CFF, #22D3B8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 700, color: '#04121A' }}>
                        {review.user.name[0].toUpperCase()}
                      </div>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, color: '#EAF2FF' }}>{review.user.name}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} style={{ fill: i < review.rating ? '#F59E0B' : 'none', color: i < review.rating ? '#F59E0B' : '#1e293b' }} />
                      ))}
                    </div>
                  </div>
                  {review.comment && <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#7C8AA5', lineHeight: 1.6 }}>{review.comment}</p>}
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#4A5670', marginTop: 8 }}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: 'rgba(13,18,30,0.8)', border: '1px solid rgba(124,138,165,0.1)', borderRadius: 14, padding: '48px 24px', textAlign: 'center' }}>
              <Star size={28} style={{ color: '#1e293b', margin: '0 auto 12px' }} />
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#4A5670' }}>No reviews yet. Be the first to review this part.</div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}