import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  LayoutDashboard, Package, ShoppingBag, Tag, Settings,
  Plus, Pencil, Trash2, ToggleLeft, ToggleRight, ChevronDown, ChevronUp,
  TrendingUp, AlertTriangle, CheckCircle
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import api from '@/lib/api'
import { formatPrice, formatDate, STATUS_LABELS, cn } from '@/lib/utils'
import type { Part, Order, Promotion, Category } from '../types/types'

type Tab = 'dashboard' | 'inventory' | 'orders' | 'promotions' | 'settings'

// ─── Schemas ─────────────────────────────────────────────────────────────────
const partSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  oemNumber: z.string().optional(),
  price: z.coerce.number().positive(),
  comparePrice: z.coerce.number().optional(),
  stock: z.coerce.number().int().min(0),
  categoryId: z.string().min(1, 'Select a category'),
})
type PartForm = z.infer<typeof partSchema>

const promoSchema = z.object({
  code: z.string().min(3).transform(s => s.toUpperCase()),
  description: z.string().optional(),
  discount: z.coerce.number().positive(),
  type: z.enum(['PERCENTAGE', 'FIXED']),
  expiresAt: z.string().optional(),
  usageLimit: z.coerce.number().int().positive().optional(),
})
type PromoForm = z.infer<typeof promoSchema>

// ─── Main component ───────────────────────────────────────────────────────────
export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('dashboard')

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'promotions', label: 'Promotions', icon: Tag },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center text-white text-lg">🔐</div>
        <div>
          <h1 className="text-xl font-semibold">Admin dashboard</h1>
          <p className="text-xs text-gray-500">Manage inventory, orders and promotions</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={cn('flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
              tab === id ? 'bg-white dark:bg-gray-900 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300')}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {tab === 'dashboard' && <DashboardTab />}
      {tab === 'inventory' && <InventoryTab />}
      {tab === 'orders' && <OrdersTab />}
      {tab === 'promotions' && <PromotionsTab />}
      {tab === 'settings' && <SettingsTab />}
    </div>
  )
}

// ─── Dashboard tab ────────────────────────────────────────────────────────────
function DashboardTab() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => { const { data } = await api.get('/admin/stats'); return data },
  })

  const STAT_CARDS = [
    { label: 'Total orders', value: stats?.totalOrders ?? '—', icon: ShoppingBag, color: 'text-blue-500' },
    { label: 'Revenue', value: stats?.revenue ? formatPrice(stats.revenue) : '—', icon: TrendingUp, color: 'text-green-500' },
    { label: 'Low stock alerts', value: stats?.lowStock ?? '—', icon: AlertTriangle, color: 'text-orange-500' },
    { label: 'Active parts', value: stats?.totalParts ?? '—', icon: Package, color: 'text-brand' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5">
            <Icon size={18} className={cn('mb-2', color)} />
            <div className="text-2xl font-semibold">{value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>
      <div className="card p-5">
        <h2 className="font-semibold mb-1">Quick start</h2>
        <p className="text-sm text-gray-500">Use the tabs above to manage inventory, view and update orders, create promotions, and configure store settings.</p>
      </div>
    </div>
  )
}

// ─── Inventory tab ────────────────────────────────────────────────────────────
function InventoryTab() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const { data: parts, isLoading } = useQuery<Part[]>({
    queryKey: ['admin-parts'],
    queryFn: async () => { const { data } = await api.get('/admin/parts'); return data },
  })

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => { const { data } = await api.get('/products/categories'); return data },
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PartForm>({
    resolver: zodResolver(partSchema),
  })

  const saveMutation = useMutation({
    mutationFn: async (data: PartForm) => {
      if (editId) return api.put(`/admin/parts/${editId}`, data)
      return api.post('/admin/parts', data)
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-parts'] }); setShowForm(false); setEditId(null); reset() },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/parts/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-parts'] }),
  })

  const filtered = parts?.filter(p => p.name.toLowerCase().includes(search.toLowerCase())) ?? []

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input className="input max-w-xs" placeholder="Search parts…" value={search} onChange={e => setSearch(e.target.value)} />
        <button onClick={() => { setShowForm(!showForm); setEditId(null); reset() }} className="btn-primary flex items-center gap-2 ml-auto">
          <Plus size={14} /> Add part
        </button>
      </div>

      {/* Add / Edit form */}
      {showForm && (
        <div className="card p-5">
          <h3 className="font-semibold mb-4">{editId ? 'Edit part' : 'Add new part'}</h3>
          <form onSubmit={handleSubmit(d => saveMutation.mutate(d))} className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Part name *</label>
              <input {...register('name')} className="input" placeholder="e.g. Bosch Front Brake Pad Set" />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea {...register('description')} className="input" rows={2} placeholder="Part description…" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">OEM number</label>
              <input {...register('oemNumber')} className="input" placeholder="e.g. 04465-02210" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select {...register('categoryId')} className="input">
                <option value="">Select category</option>
                {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {errors.categoryId && <p className="text-xs text-red-500 mt-1">{errors.categoryId.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price ($) *</label>
              <input {...register('price')} type="number" step="0.01" className="input" placeholder="49.99" />
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Compare price ($)</label>
              <input {...register('comparePrice')} type="number" step="0.01" className="input" placeholder="Optional original price" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock quantity *</label>
              <input {...register('stock')} type="number" className="input" placeholder="0" />
              {errors.stock && <p className="text-xs text-red-500 mt-1">{errors.stock.message}</p>}
            </div>
            <div className="md:col-span-2 flex gap-2 justify-end">
              <button type="button" onClick={() => { setShowForm(false); reset() }} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={saveMutation.isPending} className="btn-primary">
                {saveMutation.isPending ? 'Saving…' : editId ? 'Update part' : 'Add part'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Parts table */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/60">
            <tr>
              {['Name', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}><td colSpan={5} className="px-4 py-3"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" /></td></tr>
              ))
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No parts found</td></tr>
            ) : filtered.map((part) => (
              <tr key={part.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                <td className="px-4 py-3">
                  <div className="font-medium">{part.name}</div>
                  {part.oemNumber && <div className="text-xs text-gray-400 font-mono">{part.oemNumber}</div>}
                </td>
                <td className="px-4 py-3 text-gray-500">{part.category.name}</td>
                <td className="px-4 py-3 font-medium text-brand">{formatPrice(part.price)}</td>
                <td className="px-4 py-3">
                  <span className={cn('badge text-xs',
                    part.stock === 0 ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                    : part.stock <= 10 ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                    : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400')}>
                    {part.stock === 0 ? 'Out of stock' : `${part.stock} in stock`}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => { setEditId(part.id); setShowForm(true) }}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 transition-colors">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => deleteMutation.mutate(part.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Orders tab ───────────────────────────────────────────────────────────────
function OrdersTab() {
  const qc = useQueryClient()
  const [statusFilter, setStatusFilter] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const { data } = useQuery<{ data: Order[]; total: number }>({
    queryKey: ['admin-orders', statusFilter],
    queryFn: async () => {
      const { data } = await api.get('/admin/orders', { params: statusFilter ? { status: statusFilter } : {} })
      return data
    },
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => api.patch(`/admin/orders/${id}/status`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-orders'] }),
  })

  const STATUS_OPTIONS = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        {['', ...STATUS_OPTIONS].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
              statusFilter === s ? 'bg-brand text-white' : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700')}>
            {s || 'All'} {s === '' && data ? `(${data.total})` : ''}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/60">
            <tr>
              {['Order', 'Customer', 'Total', 'Status', 'Date', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {data?.data.map((order) => {
              const isExpanded = expandedId === order.id
              const status = STATUS_LABELS[order.status] ?? { label: order.status, color: '' }
              return (
                <>
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                    <td className="px-4 py-3 font-mono text-xs font-medium">#{order.id.slice(-8).toUpperCase()}</td>
                    <td className="px-4 py-3">
                      <div>{(order as any).user?.name ?? 'Guest'}</div>
                      <div className="text-xs text-gray-400">{(order as any).user?.email}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-brand">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={e => statusMutation.mutate({ id: order.id, status: e.target.value })}
                        className={cn('text-xs px-2 py-1 rounded-lg border-0 font-medium cursor-pointer', status.color)}
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setExpandedId(isExpanded ? null : order.id)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400">
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={`${order.id}-detail`}>
                      <td colSpan={6} className="bg-gray-50 dark:bg-gray-800/40 px-4 py-3">
                        <div className="space-y-1">
                          {order.items.map(item => (
                            <div key={item.id} className="flex items-center justify-between text-sm">
                              <span>{item.part.name} × {item.quantity}</span>
                              <span className="text-brand">{formatPrice(Number(item.price) * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Promotions tab ───────────────────────────────────────────────────────────
function PromotionsTab() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)

  const { data: promos } = useQuery<Promotion[]>({
    queryKey: ['admin-promos'],
    queryFn: async () => { const { data } = await api.get('/admin/promotions'); return data },
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PromoForm>({
    resolver: zodResolver(promoSchema),
    defaultValues: { type: 'PERCENTAGE' },
  })

  const createMutation = useMutation({
    mutationFn: (data: PromoForm) => api.post('/admin/promotions', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-promos'] }); setShowForm(false); reset() },
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => api.patch(`/admin/promotions/${id}`, { isActive }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-promos'] }),
  })

  return (
    <div className="space-y-4">
      <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
        <Plus size={14} /> Create promotion
      </button>

      {showForm && (
        <div className="card p-5">
          <h3 className="font-semibold mb-4">New promotion</h3>
          <form onSubmit={handleSubmit(d => createMutation.mutate(d))} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Promo code *</label>
              <input {...register('code')} className="input uppercase" placeholder="SUMMER30" />
              {errors.code && <p className="text-xs text-red-500 mt-1">{errors.code.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <input {...register('description')} className="input" placeholder="Summer sale — 30% off brakes" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Discount *</label>
              <input {...register('discount')} type="number" step="0.01" className="input" placeholder="30" />
              {errors.discount && <p className="text-xs text-red-500 mt-1">{errors.discount.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type *</label>
              <select {...register('type')} className="input">
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed amount ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Expires at</label>
              <input {...register('expiresAt')} type="date" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Usage limit</label>
              <input {...register('usageLimit')} type="number" className="input" placeholder="Unlimited" />
            </div>
            <div className="md:col-span-2 flex gap-2 justify-end">
              <button type="button" onClick={() => { setShowForm(false); reset() }} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={createMutation.isPending} className="btn-primary">
                {createMutation.isPending ? 'Creating…' : 'Create promotion'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/60">
            <tr>
              {['Code', 'Discount', 'Description', 'Expires', 'Used', 'Active'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {promos?.map(promo => (
              <tr key={promo.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                <td className="px-4 py-3 font-mono font-semibold text-brand">{promo.code}</td>
                <td className="px-4 py-3 font-medium">
                  {promo.type === 'PERCENTAGE' ? `${promo.discount}%` : formatPrice(promo.discount)}
                </td>
                <td className="px-4 py-3 text-gray-500">{promo.description ?? '—'}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{promo.expiresAt ? formatDate(promo.expiresAt) : 'Never'}</td>
                <td className="px-4 py-3 text-gray-500">{promo.usageCount}{promo.usageLimit ? ` / ${promo.usageLimit}` : ''}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleMutation.mutate({ id: promo.id, isActive: !promo.isActive })}
                    className={cn('transition-colors', promo.isActive ? 'text-green-500' : 'text-gray-300 dark:text-gray-600')}>
                    {promo.isActive ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Settings tab ─────────────────────────────────────────────────────────────
function SettingsTab() {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="card p-6">
        <h2 className="font-semibold mb-4">Store information</h2>
        <div className="space-y-4">
          {[
            { label: 'Store name', placeholder: 'AutoParts Pro', type: 'text' },
            { label: 'Contact email', placeholder: 'admin@autoparts.pro', type: 'email' },
            { label: 'Support phone', placeholder: '+1 800-AUTOPARTS', type: 'text' },
          ].map(({ label, placeholder, type }) => (
            <div key={label}>
              <label className="block text-sm font-medium mb-1.5">{label}</label>
              <input type={type} defaultValue={placeholder} className="input" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium mb-1.5">Currency</label>
            <select className="input" defaultValue="USD">
              {['USD ($)', 'EUR (€)', 'GBP (£)', 'CAD (C$)', 'AUD (A$)'].map(c => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="font-semibold mb-4">Shipping settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Default shipping cost ($)</label>
            <input type="number" defaultValue="9.99" step="0.01" className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Free shipping threshold ($)</label>
            <input type="number" defaultValue="100" className="input" />
            <p className="text-xs text-gray-400 mt-1">Orders above this amount get free shipping</p>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="same-day" className="w-4 h-4 accent-brand" defaultChecked />
            <label htmlFor="same-day" className="text-sm">Enable same-day dispatch for orders before 2pm</label>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="font-semibold mb-4">Notification settings</h2>
        <div className="space-y-3">
          {[
            { id: 'new-order', label: 'Email on new order', checked: true },
            { id: 'low-stock', label: 'Email when stock drops below 10', checked: true },
            { id: 'review', label: 'Email on new customer review', checked: false },
          ].map(({ id, label, checked }) => (
            <div key={id} className="flex items-center gap-3">
              <input type="checkbox" id={id} defaultChecked={checked} className="w-4 h-4 accent-brand" />
              <label htmlFor={id} className="text-sm">{label}</label>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleSave} className={cn('btn-primary flex items-center gap-2', saved && 'bg-green-600 hover:bg-green-700')}>
        {saved ? <><CheckCircle size={15} /> Saved!</> : 'Save settings'}
      </button>
    </div>
  )
}
