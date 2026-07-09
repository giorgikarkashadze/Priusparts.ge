import { Link } from 'react-router-dom'
import { ShoppingCart, Star } from 'lucide-react'
import { useCartStore } from '@/store'
import { formatPrice, discount, cn } from '@/lib/utils'
import type { Part } from '../types/types'

const CATEGORY_ICONS: Record<string, string> = {
  engine: '🔧', brakes: '🛞', suspension: '⚙️', electrical: '⚡', filters: '🌀',
}

interface Props { part: Part; className?: string }

export default function PartCard({ part, className }: Props) {
  const addItem = useCartStore((s) => s.addItem)
  const disc = discount(part.price, part.comparePrice)
  const icon = CATEGORY_ICONS[part.category.slug] || '🔩'

  return (
    <div className={cn('card overflow-hidden group hover:-translate-y-1 transition-all duration-200 hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-black/40', className)}>
      {/* Thumbnail */}
      <Link to={`/catalog/${part.slug}`} className="block">
        <div className="relative h-36 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          {part.images.length > 0 ? (
            <img src={part.images[0]} alt={part.name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-4xl">{icon}</span>
          )}
          {disc && (
            <div className="absolute top-2 right-2 bg-brand text-white text-xs font-medium px-2 py-0.5 rounded-full">
              -{disc}%
            </div>
          )}
          {part.stock <= 5 && part.stock > 0 && (
            <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
              Only {part.stock} left
            </div>
          )}
          {part.stock === 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white text-xs font-medium bg-black/60 px-3 py-1 rounded-full">Out of stock</span>
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-3">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{part.category.name}</div>
        <Link to={`/catalog/${part.slug}`}>
          <h3 className="text-sm font-medium leading-snug mb-1 hover:text-brand transition-colors line-clamp-2">{part.name}</h3>
        </Link>
        {part.oemNumber && (
          <div className="text-xs text-gray-400 font-mono mb-2">OEM: {part.oemNumber}</div>
        )}

        {/* Rating placeholder */}
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={11} className={i < 4 ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'} />
          ))}
          <span className="text-xs text-gray-400 ml-1">(24)</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-base font-semibold text-brand">{formatPrice(part.price)}</span>
            {part.comparePrice && (
              <span className="text-xs text-gray-400 line-through ml-1.5">{formatPrice(part.comparePrice)}</span>
            )}
          </div>
          <button
            onClick={() => addItem(part)}
            disabled={part.stock === 0}
            className={cn('p-2 rounded-lg transition-all',
              part.stock === 0
                ? 'opacity-30 cursor-not-allowed bg-gray-100 dark:bg-gray-800'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-brand hover:text-white active:scale-95'
            )}
            aria-label="Add to cart"
          >
            <ShoppingCart size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}
