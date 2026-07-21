import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Star, Zap } from 'lucide-react'
import { useCartStore } from '@/store'
import { formatPrice, discount } from '@/lib/utils'
import type { Part } from '@/types/types'

const CATEGORY_ICONS: Record<string, string> = {
  engine: '🔧', brakes: '🛞', suspension: '⚙️', electrical: '⚡', filters: '🌀', hybrid: '🔋',
}

export default function PartCard({ part }: { part: Part }) {
  const addItem = useCartStore((s) => s.addItem)
  const [added, setAdded] = useState(false)
  const [hovered, setHovered] = useState(false)
  const disc = discount(part.price, part.comparePrice)
  const icon = CATEGORY_ICONS[part.category?.slug] || '🔩'

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(part)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <>
      <style>{`
        @keyframes add-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .part-card-hud {
          background: rgba(13,18,30,0.75);
          border: 1px solid rgba(124,138,165,0.12);
          border-radius: 14px; overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          cursor: pointer; position: relative;
          backdrop-filter: blur(8px);
        }
        .part-card-hud:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(76,124,255,0.15), 0 0 0 1px rgba(34,211,184,0.2);
          border-color: rgba(34,211,184,0.3);
        }
        .part-card-hud .add-btn {
          width: 32px; height: 32px; border-radius: 8px; border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s ease;
          background: rgba(76,124,255,0.15); color: #4C7CFF;
        }
        .part-card-hud .add-btn:hover {
          background: linear-gradient(135deg, #4C7CFF, #22D3B8);
          color: #04121A; transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(76,124,255,0.4);
        }
        .part-card-hud .add-btn.added {
          background: linear-gradient(135deg, #22D3B8, #4C7CFF);
          color: #04121A; animation: add-pulse 0.4s ease;
        }
        .part-card-hud .add-btn:disabled {
          opacity: 0.3; cursor: not-allowed; transform: none;
        }
        .part-thumb-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(13,18,30,0.8) 0%, transparent 50%);
          pointer-events: none;
        }
      `}</style>

      <div className="part-card-hud"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Thumbnail */}
        <Link to={`/catalog/${part.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
          <div style={{ height: 140, background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            {part.images?.[0] ? (
              <img src={part.images[0]} alt={part.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 8, transition: 'transform 0.3s ease', transform: hovered ? 'scale(1.05)' : 'scale(1)' }} />
            ) : (
              <span style={{ fontSize: 44, transition: 'transform 0.3s ease', transform: hovered ? 'scale(1.1)' : 'scale(1)', display: 'block' }}>{icon}</span>
            )}
            <div className="part-thumb-overlay" />

            {/* Badges */}
            {disc && (
              <div style={{
                position: 'absolute', top: 8, right: 8,
                background: 'linear-gradient(135deg, #FF6B57, #FF9A57)',
                color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px',
                borderRadius: 20, fontFamily: "'JetBrains Mono', monospace",
                boxShadow: '0 2px 8px rgba(255,107,87,0.4)'
              }}>
                -{disc}%
              </div>
            )}
            {part.stock === 0 && (
              <div style={{
                position: 'absolute', inset: 0, background: 'rgba(5,7,12,0.7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(2px)'
              }}>
                <span style={{ color: '#7C8AA5', fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' }}>OUT OF STOCK</span>
              </div>
            )}
            {part.stock > 0 && part.stock <= 5 && (
              <div style={{
                position: 'absolute', top: 8, left: 8,
                background: 'rgba(255,154,87,0.15)', color: '#FF9A57',
                border: '1px solid rgba(255,154,87,0.3)',
                fontSize: 9, fontWeight: 600, padding: '2px 7px', borderRadius: 20,
                fontFamily: "'JetBrains Mono', monospace"
              }}>
                {part.stock} LEFT
              </div>
            )}
          </div>
        </Link>

        {/* Info */}
        <div style={{ padding: '10px 12px 12px' }}>
          {/* Category */}
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#22D3B8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
            {part.category?.name}
          </div>

          {/* Name */}
          <Link to={`/catalog/${part.slug}`} style={{ textDecoration: 'none' }}>
            <div style={{
              fontSize: 13, fontWeight: 600, color: '#EAF2FF', lineHeight: 1.4, marginBottom: 4,
              fontFamily: "'Inter', sans-serif",
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
              transition: 'color 0.15s'
            }}>
              {part.name}
            </div>
          </Link>

          {/* OEM */}
          {part.oemNumber && (
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#4A5670', marginBottom: 8 }}>
              {part.oemNumber}
            </div>
          )}

          {/* Stars */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 10 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={10} style={{ fill: i < 4 ? '#F59E0B' : 'none', color: i < 4 ? '#F59E0B' : '#1e293b' }} />
            ))}
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#4A5670', marginLeft: 2 }}>(24)</span>
          </div>

          {/* Price + Add */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700, color: '#4C7CFF' }}>
                {formatPrice(part.price)}
              </span>
              {part.comparePrice && (
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: '#4A5670', textDecoration: 'line-through', marginLeft: 6 }}>
                  {formatPrice(part.comparePrice)}
                </span>
              )}
            </div>
            <button
              className={`add-btn${added ? ' added' : ''}`}
              onClick={handleAdd}
              disabled={part.stock === 0}
              title="Add to cart"
            >
              {added ? <Zap size={14} /> : <ShoppingCart size={14} />}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}