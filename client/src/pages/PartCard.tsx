import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Star } from 'lucide-react'
import { useCartStore } from '@/store'
import { formatPrice, discount } from '@/lib/utils'
import type { Part } from '@/types/types'

const CATEGORY_ICONS: Record<string, string> = {
  engine: '🔧', brakes: '🛞', suspension: '⚙️', electrical: '⚡', filters: '🌀',
}

export default function PartCard({ part }: { part: Part }) {
  const addItem = useCartStore((s) => s.addItem)
  const [added, setAdded] = useState(false)
  const disc = discount(part.price, part.comparePrice)
  const icon = CATEGORY_ICONS[part.category?.slug] || '🔩'

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(part)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div style={{
      background: '#0d1526', border: '1px solid #111e35', borderRadius: 12,
      overflow: 'hidden', transition: 'transform 0.15s, box-shadow 0.15s',
      cursor: 'pointer',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none' }}
    >
      {/* Thumbnail */}
      <Link to={`/catalog/${part.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
        <div style={{
          height: 140, background: '#111e35', display: 'flex',
          alignItems: 'center', justifyContent: 'center', position: 'relative'
        }}>
          {part.images?.[0] ? (
            <img src={part.images[0]} alt={part.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: 48 }}>{icon}</span>
          )}
          {disc && (
            <div style={{
              position: 'absolute', top: 8, right: 8, background: '#1d6fe8',
              color: '#fff', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20
            }}>
              -{disc}%
            </div>
          )}
          {part.stock === 0 && (
            <div style={{
              position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{ color: '#fff', fontSize: 12, background: 'rgba(0,0,0,0.7)', padding: '4px 12px', borderRadius: 20 }}>
                Out of stock
              </span>
            </div>
          )}
          {part.stock > 0 && part.stock <= 5 && (
            <div style={{
              position: 'absolute', top: 8, left: 8, background: '#f97316',
              color: '#fff', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20
            }}>
              Only {part.stock} left
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div style={{ padding: 12 }}>
        <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>{part.category?.name}</div>

        <Link to={`/catalog/${part.slug}`} style={{ textDecoration: 'none' }}>
          <div style={{
            fontSize: 13, fontWeight: 500, color: '#f9fafb', lineHeight: 1.4,
            marginBottom: 4, display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden'
          }}>
            {part.name}
          </div>
        </Link>

        {part.oemNumber && (
          <div style={{ fontSize: 11, color: '#6b7280', fontFamily: 'monospace', marginBottom: 6 }}>
            OEM: {part.oemNumber}
          </div>
        )}

        {/* Stars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={11} style={{ fill: i < 4 ? '#fbbf24' : 'none', color: i < 4 ? '#fbbf24' : '#374151' }} />
          ))}
          <span style={{ fontSize: 11, color: '#6b7280' }}>(24)</span>
        </div>

        {/* Price + Add */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: 16, fontWeight: 600, color: '#1d6fe8' }}>
              {formatPrice(part.price)}
            </span>
            {part.comparePrice && (
              <span style={{ fontSize: 12, color: '#6b7280', textDecoration: 'line-through', marginLeft: 6 }}>
                {formatPrice(part.comparePrice)}
              </span>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={part.stock === 0}
            style={{
              width: 32, height: 32, borderRadius: 8, border: 'none', cursor: part.stock === 0 ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: added ? '#16a34a' : '#111e35',
              color: added ? '#fff' : '#9ca3af',
              opacity: part.stock === 0 ? 0.4 : 1,
              transition: 'all 0.15s'
            }}
          >
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}