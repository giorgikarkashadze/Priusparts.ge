import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Package, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '@/lib/api'
import { formatPrice, formatDate, STATUS_LABELS, cn } from '@/lib/utils'
import type { Order } from '@/types'

export default function OrdersPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const { data } = await api.get('/orders')
      return data
    },
  })

  if (isLoading) return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="card h-24 animate-pulse bg-gray-100 dark:bg-gray-800" />
      ))}
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">My orders</h1>

      {!orders?.length ? (
        <div className="card p-16 text-center text-gray-400">
          <Package size={40} className="mx-auto mb-3 opacity-30" />
          <h2 className="font-medium mb-1">No orders yet</h2>
          <p className="text-sm mb-4">Your orders will appear here after you checkout</p>
          <Link to="/catalog" className="btn-primary">Start shopping</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const status = STATUS_LABELS[order.status] ?? { label: order.status, color: '' }
            const isExpanded = expandedId === order.id
            return (
              <div key={order.id} className="card overflow-hidden">
                {/* Order header */}
                <button
                  className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                >
                  <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
                    <Package size={18} className="text-brand" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">#{order.id.slice(-8).toUpperCase()}</span>
                      <span className={cn('badge text-xs', status.color)}>{status.label}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {formatDate(order.createdAt)} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-semibold text-brand">{formatPrice(order.total)}</div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {isExpanded ? <ChevronUp size={14} className="ml-auto" /> : <ChevronDown size={14} className="ml-auto" />}
                    </div>
                  </div>
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-gray-100 dark:border-gray-800 p-4 space-y-4">
                    {/* Items */}
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden shrink-0">
                            {item.part.images?.[0]
                              ? <img src={item.part.images[0]} alt="" className="w-full h-full object-cover" />
                              : <span className="text-xl">🔩</span>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link to={`/catalog/${item.part.slug}`} className="text-sm font-medium hover:text-brand flex items-center gap-1 line-clamp-1">
                              {item.part.name} <ExternalLink size={11} />
                            </Link>
                            <div className="text-xs text-gray-500">Qty: {item.quantity} × {formatPrice(item.price)}</div>
                          </div>
                          <span className="text-sm font-medium shrink-0">{formatPrice(Number(item.price) * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Summary */}
                    <div className="bg-gray-50 dark:bg-gray-800/60 rounded-lg p-3 text-sm space-y-1.5">
                      <div className="flex justify-between text-gray-500">
                        <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>Shipping</span><span>{formatPrice(order.shipping)}</span>
                      </div>
                      {Number(order.discount) > 0 && (
                        <div className="flex justify-between text-green-600 dark:text-green-400">
                          <span>Discount</span><span>−{formatPrice(order.discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-semibold border-t border-gray-200 dark:border-gray-700 pt-1.5">
                        <span>Total</span><span className="text-brand">{formatPrice(order.total)}</span>
                      </div>
                    </div>

                    {/* Shipping address */}
                    {order.shippingAddress && (
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Shipping to</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {(order.shippingAddress as any).name}<br />
                          {(order.shippingAddress as any).line1}{(order.shippingAddress as any).line2 ? `, ${(order.shippingAddress as any).line2}` : ''}<br />
                          {(order.shippingAddress as any).city}, {(order.shippingAddress as any).state} {(order.shippingAddress as any).zip}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
