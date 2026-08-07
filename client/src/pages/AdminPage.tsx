import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  LayoutDashboard, Package, ShoppingBag, Tag, Settings,
  Plus, Pencil, Trash2, ToggleLeft, ToggleRight, ChevronDown, ChevronUp,
  TrendingUp, AlertTriangle, CheckCircle, Search, X, Eye, EyeOff
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import api from '@/lib/api'
import { formatPrice, formatDate } from '@/lib/utils'
import { useThemeStore } from '@/store'
import type { Part, Order, Promotion, Category } from '@/types/types'

type Tab = 'dashboard' | 'inventory' | 'orders' | 'promotions' | 'settings'

const partSchema = z.object({
  name: z.string().min(2),
  nameKa: z.string().optional(),
  description: z.string().optional(),
  descriptionKa: z.string().optional(),
  oemNumber: z.string().optional(),
  price: z.string().min(1, 'Price is required'),
  comparePrice: z.string().optional(),
  stock: z.string().min(1, 'Stock is required'),
  categoryId: z.string().min(1, 'Select a category'),
  yearFrom: z.string().optional(),
  yearTo: z.string().optional(),
}).refine((data) => {
  if (!data.comparePrice || data.comparePrice === '') return true
  return parseFloat(data.comparePrice) > parseFloat(data.price)
}, {
  message: 'Compare price should be more than price',
  path: ['comparePrice'],
}).refine((data) => {
  if (!data.yearFrom || !data.yearTo) return true
  return parseInt(data.yearFrom) <= parseInt(data.yearTo)
}, {
  message: 'Year "from" cannot be greater than year "to"',
  path: ['yearTo'],
})
type PartForm = z.infer<typeof partSchema>

const promoSchema = z.object({
  code: z.string().min(3),
  description: z.string().optional(),
  discount: z.number().positive(),
  type: z.enum(['PERCENTAGE', 'FIXED']),
  expiresAt: z.string().optional(),
  usageLimit: z.number().int().positive().optional(),
})
type PromoForm = z.infer<typeof promoSchema>

const ALL_YEARS = Array.from({ length: 2024 - 2008 + 1 }, (_, i) => 2008 + i)

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('dashboard')
  const { dark } = useThemeStore()

  const c = dark ? {
    pageBg: '#05070C',
    cardBg: 'rgba(13,18,30,0.85)',
    cardBorder: 'rgba(124,138,165,0.12)',
    text: '#EAF2FF',
    textMuted: '#7C8AA5',
    textFaint: '#4A5670',
    accent: '#4C7CFF',
    teal: '#22D3B8',
    gradient: 'linear-gradient(135deg, #4C7CFF, #22D3B8)',
    energyLine: 'linear-gradient(90deg, #4C7CFF, #22D3B8, #4C7CFF)',
    inputBg: 'rgba(255,255,255,0.03)',
    inputBorder: 'rgba(124,138,165,0.2)',
    tabActiveBg: '#1e293b',
    tabInactiveBg: 'transparent',
    tableHeadBg: 'rgba(76,124,255,0.06)',
    tableHoverBg: 'rgba(255,255,255,0.02)',
    divider: 'rgba(124,138,165,0.1)',
    statBg: 'rgba(76,124,255,0.06)',
    statBorder: 'rgba(76,124,255,0.15)',
    gridColor: 'rgba(76,124,255,0.04)',
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
    energyLine: 'linear-gradient(90deg, #2952CC, #0A8C7A, #2952CC)',
    inputBg: '#F8FAFF',
    inputBorder: 'rgba(60,90,200,0.2)',
    tabActiveBg: '#ffffff',
    tabInactiveBg: 'transparent',
    tableHeadBg: 'rgba(41,82,204,0.04)',
    tableHoverBg: 'rgba(41,82,204,0.02)',
    divider: 'rgba(60,90,200,0.1)',
    statBg: 'rgba(41,82,204,0.06)',
    statBorder: 'rgba(41,82,204,0.15)',
    gridColor: 'rgba(41,82,204,0.04)',
  }

  const inputSt: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 8,
    border: `1px solid ${c.inputBorder}`, background: c.inputBg,
    color: c.text, fontSize: 13, outline: 'none',
    boxSizing: 'border-box' as const, fontFamily: "'Inter', sans-serif",
    transition: 'border-color 0.2s',
  }

  const labelSt: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500,
    color: c.teal, letterSpacing: '0.1em', textTransform: 'uppercase' as const,
    marginBottom: 6, display: 'block'
  }

  const btnPrimary: React.CSSProperties = {
    background: c.gradient, color: dark ? '#04121A' : '#fff',
    border: 'none', padding: '10px 18px', borderRadius: 9, fontSize: 13,
    fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center',
    gap: 6, fontFamily: "'Inter', sans-serif", transition: 'all 0.2s',
    boxShadow: `0 4px 16px ${dark ? 'rgba(76,124,255,0.3)' : 'rgba(41,82,204,0.25)'}`,
  }

  const btnSecondary: React.CSSProperties = {
    background: c.inputBg, color: c.textMuted, border: `1px solid ${c.inputBorder}`,
    padding: '10px 18px', borderRadius: 9, fontSize: 13, cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
  }

  const TABS: { id: Tab; label: string; icon: React.ElementType; shortLabel: string }[] = [
    { id: 'dashboard', label: 'Dashboard', shortLabel: 'Dash', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', shortLabel: 'Parts', icon: Package },
    { id: 'orders', label: 'Orders', shortLabel: 'Orders', icon: ShoppingBag },
    { id: 'promotions', label: 'Promotions', shortLabel: 'Promos', icon: Tag },
    { id: 'settings', label: 'Settings', shortLabel: 'Settings', icon: Settings },
  ]

  const sharedProps = { c, inputSt, labelSt, btnPrimary, btnSecondary, dark }

  return (
    <div style={{ minHeight: '100vh', background: c.pageBg, color: c.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes energy-flow { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
        @keyframes grid-drift { from { background-position: 0 0; } to { background-position: 48px 48px; } }
        @keyframes fade-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .admin-grid-bg {
          background-image: linear-gradient(${c.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${c.gridColor} 1px, transparent 1px);
          background-size: 48px 48px; animation: grid-drift 20s linear infinite;
        }
        .admin-energy-bar { background: ${c.energyLine}; background-size: 200% 100%; animation: energy-flow 4s linear infinite; }
        .admin-card { background: ${c.cardBg}; border: 1px solid ${c.cardBorder}; border-radius: 14px; backdrop-filter: blur(12px); overflow: hidden; }
        .admin-input:focus { border-color: ${c.teal} !important; box-shadow: 0 0 0 3px ${dark ? 'rgba(34,211,184,0.08)' : 'rgba(10,140,122,0.08)'} !important; }
        .admin-tab-btn { transition: all 0.15s ease; white-space: nowrap; }
        .admin-tab-btn:hover { color: ${c.text} !important; }
        .admin-table-row { transition: background 0.15s; }
        .admin-table-row:hover { background: ${c.tableHoverBg} !important; }
        .admin-stat-card { background: ${c.statBg}; border: 1px solid ${c.statBorder}; border-radius: 14px; padding: 20px; transition: all 0.2s; }
        .admin-stat-card:hover { transform: translateY(-2px); }
        .btn-primary-admin { transition: all 0.2s; }
        .btn-primary-admin:hover { opacity: 0.9; transform: translateY(-1px); }
        .btn-secondary-admin:hover { border-color: ${c.teal} !important; color: ${c.teal} !important; }

        /* Mobile responsive */
        .admin-page-inner { max-width: 1200px; margin: 0 auto; padding: 20px 12px; }
        .admin-tab-bar { overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
        .admin-tab-bar::-webkit-scrollbar { display: none; }
        .admin-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .admin-fullcol { grid-column: 1 / -1; }
        .admin-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .admin-orders-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }

        @media (max-width: 640px) {
          .admin-page-inner { padding: 12px 10px; }
          .admin-2col { grid-template-columns: 1fr !important; }
          .admin-stat-grid { grid-template-columns: 1fr 1fr !important; }
          .admin-tab-label-full { display: none; }
          .admin-tab-label-short { display: inline !important; }
          .admin-table-wrap table { font-size: 12px; }
          .admin-table-wrap th, .admin-table-wrap td { padding: 10px 10px !important; }
          .admin-hide-mobile { display: none !important; }
          .admin-orders-grid { grid-template-columns: 1fr; }
        }
        @media (min-width: 641px) {
          .admin-tab-label-short { display: none; }
          .admin-stat-grid { grid-template-columns: repeat(4, 1fr) !important; }
          .admin-orders-grid { grid-template-columns: 1fr; }
        }
        @media (prefers-reduced-motion: reduce) {
          .admin-energy-bar, .admin-grid-bg { animation: none; }
          .admin-stat-card:hover, .btn-primary-admin:hover { transform: none; }
        }
      `}</style>

      <div className="admin-grid-bg" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="admin-page-inner">

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, animation: 'fade-up 0.3s ease-out both' }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: c.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 14px ${dark ? 'rgba(76,124,255,0.4)' : 'rgba(41,82,204,0.3)'}`, flexShrink: 0 }}>
              <Settings size={17} style={{ color: dark ? '#04121A' : '#fff' }} />
            </div>
            <div>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, color: c.text, margin: 0 }}>Admin Panel</h1>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: c.textFaint, letterSpacing: '0.1em', margin: 0 }}>PRIUSPARTS.GE</p>
            </div>
          </div>

          {/* Tab bar */}
          <div className="admin-tab-bar" style={{ marginBottom: 20, animation: 'fade-up 0.3s 0.05s ease-out both' }}>
            <div style={{ display: 'flex', gap: 4, background: dark ? 'rgba(0,0,0,0.3)' : 'rgba(41,82,204,0.06)', borderRadius: 12, padding: 4, border: `1px solid ${c.cardBorder}`, width: 'fit-content', minWidth: '100%' }}>
              {TABS.map(({ id, label, shortLabel, icon: Icon }) => (
                <button key={id} onClick={() => setTab(id)} className="admin-tab-btn" style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '8px 12px', borderRadius: 9, border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: tab === id ? 600 : 400,
                  fontFamily: "'Inter', sans-serif",
                  background: tab === id ? c.tabActiveBg : c.tabInactiveBg,
                  color: tab === id ? c.text : c.textFaint,
                  boxShadow: tab === id ? `0 2px 8px ${dark ? 'rgba(0,0,0,0.3)' : 'rgba(41,82,204,0.1)'}` : 'none',
                }}>
                  <Icon size={13} />
                  <span className="admin-tab-label-full">{label}</span>
                  <span className="admin-tab-label-short" style={{ display: 'none' }}>{shortLabel}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div style={{ animation: 'fade-up 0.3s 0.1s ease-out both' }}>
            {tab === 'dashboard' && <DashboardTab c={c} dark={dark} />}
            {tab === 'inventory' && <InventoryTab {...sharedProps} />}
            {tab === 'orders' && <OrdersTab c={c} dark={dark} />}
            {tab === 'promotions' && <PromotionsTab {...sharedProps} />}
            {tab === 'settings' && <SettingsTab {...sharedProps} />}
          </div>

        </div>
      </div>
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function DashboardTab({ c, dark }: any) {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => { const { data } = await api.get('/admin/stats'); return data },
  })

  const CARDS = [
    { label: 'Orders', value: stats?.totalOrders ?? '—', icon: ShoppingBag, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    { label: 'Revenue', value: stats?.revenue ? formatPrice(stats.revenue) : '—', icon: TrendingUp, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
    { label: 'Low stock', value: stats?.lowStock ?? '—', icon: AlertTriangle, color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
    { label: 'Active parts', value: stats?.totalParts ?? '—', icon: Package, color: dark ? '#ff6b35' : '#2952CC', bg: dark ? 'rgba(76,124,255,0.1)' : 'rgba(41,82,204,0.08)' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="admin-stat-grid" style={{ display: 'grid', gap: 10 }}>
        {CARDS.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="admin-stat-card">
            <div style={{ width: 34, height: 34, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <Icon size={15} style={{ color }} />
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700, color: c.text, marginBottom: 2 }}>{value}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: c.textFaint, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>{label}</div>
          </div>
        ))}
      </div>
      <div className="admin-card" style={{ padding: 18 }}>
        <div className="admin-energy-bar" style={{ height: 2, margin: '-18px -18px 16px' }} />
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 15, color: c.text, marginBottom: 6 }}>Quick start</h2>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: c.textMuted, lineHeight: 1.6 }}>Use the tabs above to manage Prius parts, orders, promotions and settings.</p>
      </div>
    </div>
  )
}

// ─── Inventory ────────────────────────────────────────────────────────────────
function InventoryTab({ c, inputSt, labelSt, btnPrimary, btnSecondary, dark }: any) {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [apiError, setApiError] = useState('')
  const [imageUrls, setImageUrls] = useState<string[]>([''])
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const { data: parts, isLoading } = useQuery<Part[]>({
    queryKey: ['admin-parts'],
    queryFn: async () => { const { data } = await api.get('/admin/parts'); return data },
  })

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/products/categories')
      return Array.isArray(data) ? data : data.data ?? []
    },
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PartForm>({
    resolver: zodResolver(partSchema),
  })

  const getInput = (name: string): React.CSSProperties => ({
    ...inputSt,
    borderColor: focusedField === name ? c.teal : errors[name as keyof PartForm] ? '#ef4444' : c.inputBorder,
  })

  const saveMutation = useMutation({
    mutationFn: async (data: PartForm) => {
      const price = parseFloat(data.price)
      const stock = parseInt(data.stock)
      const comparePrice = data.comparePrice ? parseFloat(data.comparePrice) : undefined
      if (isNaN(price) || price <= 0) throw new Error('Invalid price')
      if (isNaN(stock) || stock < 0) throw new Error('Invalid stock')

      const existingParts = await api.get('/admin/parts')
      const duplicate = existingParts.data.find(
        (p: Part) => p.name.toLowerCase().trim() === data.name.toLowerCase().trim() && p.id !== editId
      )
      if (duplicate) throw new Error(`A part named "${data.name}" already exists`)

      const yearFrom = data.yearFrom ? parseInt(data.yearFrom) : 2008
      const yearTo = data.yearTo ? parseInt(data.yearTo) : 2024
      const years = Array.from({ length: yearTo - yearFrom + 1 }, (_, i) => yearFrom + i)
      const validImages = imageUrls.filter(u => u.trim() !== '')

      const payload = { name: data.name, nameKa: data.nameKa, description: data.description, descriptionKa: data.descriptionKa, oemNumber: data.oemNumber, categoryId: data.categoryId, price, stock, comparePrice, images: validImages, years }

      if (editId) return api.put(`/admin/parts/${editId}`, payload)
      return api.post('/admin/parts', payload)
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-parts'] }); setShowForm(false); setEditId(null); setImageUrls(['']); setApiError(''); reset() },
    onError: (e: Error) => setApiError(e.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/parts/${id}/hard`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-parts'] }),
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => api.patch(`/admin/parts/${id}/toggle`, { isActive }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-parts'] }),
  })

  const filtered = (Array.isArray(parts) ? parts : []).filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 160 }}>
          <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: c.textFaint }} />
          <input className="admin-input" placeholder="Search parts…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ ...inputSt, paddingLeft: 34 }} />
        </div>
        <button className="btn-primary-admin" onClick={() => { setShowForm(!showForm); setEditId(null); setApiError(''); reset(); setImageUrls(['']) }} style={btnPrimary}>
          {showForm ? <><X size={13} /> Cancel</> : <><Plus size={13} /> Add part</>}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="admin-card">
          <div className="admin-energy-bar" style={{ height: 2 }} />
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${c.cardBorder}`, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus size={14} style={{ color: c.teal }} />
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: c.text }}>{editId ? 'Edit part' : 'Add new Prius part'}</span>
          </div>
          <form onSubmit={handleSubmit(d => saveMutation.mutate(d))} style={{ padding: 18 }}>
            <div className="admin-2col">
              {/* Name EN */}
              <div className="admin-fullcol">
                <label style={labelSt}>Part name (English) *</label>
                <input {...register('name')} className="admin-input" placeholder="e.g. Bosch Front Brake Pad Set"
                  style={getInput('name')} onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)} />
                {errors.name && <p style={{ fontSize: 11, color: '#f87171', marginTop: 4 }}>⚠ {errors.name.message}</p>}
              </div>
              {/* Name KA */}
              <div className="admin-fullcol">
                <label style={labelSt}>სახელი (Georgian)</label>
                <input {...register('nameKa')} className="admin-input" placeholder="მაგ. ბოშის წინა სამუხრუჭე პატჩები"
                  style={getInput('nameKa')} onFocus={() => setFocusedField('nameKa')} onBlur={() => setFocusedField(null)} />
              </div>
              {/* Description EN */}
              <div className="admin-fullcol">
                <label style={labelSt}>Description (English)</label>
                <textarea {...register('description')} className="admin-input" rows={2} placeholder="Part description in English…"
                  style={{ ...inputSt, resize: 'vertical' as const }} />
              </div>
              {/* Description KA */}
              <div className="admin-fullcol">
                <label style={labelSt}>აღწერა (Georgian)</label>
                <textarea {...register('descriptionKa')} className="admin-input" rows={2} placeholder="ნაწილის აღწერა ქართულად…"
                  style={{ ...inputSt, resize: 'vertical' as const }} />
              </div>
              {/* OEM */}
              <div>
                <label style={labelSt}>OEM Number</label>
                <input {...register('oemNumber')} className="admin-input" placeholder="e.g. 04465-47080"
                  style={{ ...getInput('oemNumber'), fontFamily: 'monospace' }} onFocus={() => setFocusedField('oemNumber')} onBlur={() => setFocusedField(null)} />
              </div>
              {/* Category */}
              <div>
                <label style={labelSt}>Category *</label>
                <select {...register('categoryId')} className="admin-input" style={{ ...getInput('categoryId'), cursor: 'pointer' }}
                  onFocus={() => setFocusedField('categoryId')} onBlur={() => setFocusedField(null)}>
                  <option value="">Select category…</option>
                  {Array.isArray(categories) && categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
                {errors.categoryId && <p style={{ fontSize: 11, color: '#f87171', marginTop: 4 }}>⚠ {errors.categoryId.message}</p>}
              </div>
              {/* Price */}
              <div>
                <label style={labelSt}>Price (₾) *</label>
                <input {...register('price')} type="number" step="0.01" className="admin-input" placeholder="49.99"
                  style={getInput('price')} onFocus={() => setFocusedField('price')} onBlur={() => setFocusedField(null)} />
                {errors.price && <p style={{ fontSize: 11, color: '#f87171', marginTop: 4 }}>⚠ {errors.price.message}</p>}
              </div>
              {/* Compare price */}
              <div>
                <label style={labelSt}>Compare price (₾)</label>
                <input {...register('comparePrice')} type="number" step="0.01" className="admin-input" placeholder="64.99"
                  style={getInput('comparePrice')} onFocus={() => setFocusedField('comparePrice')} onBlur={() => setFocusedField(null)} />
                {errors.comparePrice && <p style={{ fontSize: 11, color: '#f87171', marginTop: 4 }}>⚠ {errors.comparePrice.message}</p>}
              </div>
              {/* Stock */}
              <div>
                <label style={labelSt}>Stock qty *</label>
                <input {...register('stock')} type="number" className="admin-input" placeholder="0"
                  style={getInput('stock')} onFocus={() => setFocusedField('stock')} onBlur={() => setFocusedField(null)} />
                {errors.stock && <p style={{ fontSize: 11, color: '#f87171', marginTop: 4 }}>⚠ {errors.stock.message}</p>}
              </div>
              {/* Year from */}
              <div>
                <label style={labelSt}>Compatible from year</label>
                <select {...register('yearFrom')} className="admin-input" style={{ ...inputSt, cursor: 'pointer' }}>
                  <option value="">From year</option>
                  {ALL_YEARS.map(y => <option key={y} value={String(y)}>{y}</option>)}
                </select>
              </div>
              {/* Year to */}
              <div>
                <label style={labelSt}>Compatible to year</label>
                <select {...register('yearTo')} className="admin-input" style={{ ...inputSt, cursor: 'pointer' }}>
                  <option value="">To year</option>
                  {ALL_YEARS.map(y => <option key={y} value={String(y)}>{y}</option>)}
                </select>
                {errors.yearTo && <p style={{ fontSize: 11, color: '#f87171', marginTop: 4 }}>⚠ {errors.yearTo.message}</p>}
              </div>
              {/* Images */}
              <div className="admin-fullcol">
                <label style={labelSt}>Part images (URLs)</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {imageUrls.map((url, index) => (
                    <div key={index} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input value={url} onChange={(e) => { const u = [...imageUrls]; u[index] = e.target.value; setImageUrls(u) }}
                        placeholder={`Image URL ${index + 1}…`} className="admin-input" style={{ ...inputSt, flex: 1 }} />
                      {url && <img src={url} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'contain', background: c.inputBg, border: `1px solid ${c.inputBorder}`, flexShrink: 0 }} onError={e => (e.currentTarget.style.display = 'none')} />}
                      {imageUrls.length > 1 && (
                        <button type="button" onClick={() => setImageUrls(imageUrls.filter((_, i) => i !== index))}
                          style={{ width: 32, height: 32, borderRadius: 7, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                  {imageUrls.length < 5 && (
                    <button type="button" onClick={() => setImageUrls([...imageUrls, ''])}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 8, border: `1px dashed ${dark ? 'rgba(34,211,184,0.3)' : 'rgba(10,140,122,0.3)'}`, background: 'transparent', color: c.teal, cursor: 'pointer', fontSize: 12, fontFamily: "'JetBrains Mono', monospace", width: 'fit-content' }}>
                      <Plus size={12} /> Add image URL
                    </button>
                  )}
                </div>
              </div>

              {/* API Error */}
              {apiError && (
                <div className="admin-fullcol" style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: 13 }}>
                  ⚠ {apiError}
                </div>
              )}

              {/* Buttons */}
              <div className="admin-fullcol" style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 12, borderTop: `1px solid ${c.divider}`, flexWrap: 'wrap' }}>
                <button type="button" onClick={() => { setShowForm(false); reset(); setApiError('') }} style={btnSecondary} className="btn-secondary-admin">Cancel</button>
                <button type="submit" disabled={saveMutation.isPending} className="btn-primary-admin" style={{ ...btnPrimary, opacity: saveMutation.isPending ? 0.7 : 1 }}>
                  {saveMutation.isPending ? 'Saving…' : editId ? 'Update part' : '+ Add part'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Parts list */}
      <div className="admin-card">
        <div className="admin-energy-bar" style={{ height: 2 }} />
        <div className="admin-table-wrap">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: c.tableHeadBg }}>
                {['Name', 'Price', 'Stock', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'center', padding: '12px 14px', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: c.teal, borderBottom: `1px solid ${c.divider}`, whiteSpace: 'nowrap' as const }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}><td colSpan={5} style={{ padding: '12px 14px' }}><div style={{ height: 14, background: c.inputBg, borderRadius: 4 }} /></td></tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '40px 14px', textAlign: 'center', color: c.textFaint, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>NO PARTS FOUND</td></tr>
              ) : filtered.map((part, i) => (
                <tr key={part.id} className="admin-table-row" style={{ borderTop: i === 0 ? 'none' : `1px solid ${c.divider}` }}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 8, background: c.inputBg, border: `1px solid ${c.inputBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                        {part.images?.[0] ? <img src={part.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <span style={{ fontSize: 16 }}>🔩</span>}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, color: c.text, fontSize: 12 }}>{part.name}</span>
                          <div style={{ width: 5, height: 5, borderRadius: '50%', background: part.isActive ? '#22D3B8' : '#64748b', boxShadow: part.isActive && dark ? '0 0 5px rgba(34,211,184,0.6)' : 'none', flexShrink: 0 }} />
                        </div>
                        {part.oemNumber && <div style={{ fontSize: 10, color: c.textFaint, fontFamily: 'monospace' }}>{part.oemNumber}</div>}
                      </div>
                    </div>
                  </td>
                  {/* <td style={{ padding: '12px 14px' }} className="admin-hide-mobile">
                    <span style={{ background: dark ? 'rgba(34,211,184,0.1)' : 'rgba(10,140,122,0.08)', color: c.teal, fontSize: 11, padding: '2px 8px', borderRadius: 6, fontFamily: "'Inter', sans-serif" }}>
                      {part.category?.name}
                    </span>
                  </td> */}
                  <td style={{ padding: '12px 14px', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: c.accent, fontSize: 13, whiteSpace: 'nowrap' as const }}>
                    ₾{Number(part.price).toFixed(2)}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 500, fontFamily: "'JetBrains Mono', monospace", whiteSpace: 'nowrap' as const,
                      background: part.stock === 0 ? 'rgba(239,68,68,0.1)' : part.stock <= 10 ? 'rgba(249,115,22,0.1)' : 'rgba(34,197,94,0.1)',
                      color: part.stock === 0 ? '#f87171' : part.stock <= 10 ? '#fb923c' : '#4ade80'
                    }}>{part.stock === 0 ? 'Out' : `${part.stock}`}</span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'nowrap' }}>
                      {/* Edit */}
                      <button onClick={() => {
                        setEditId(part.id); setShowForm(true); setApiError('')
                        setImageUrls(part.images && part.images.length > 0 ? part.images : [''])
                        // reset form with part values handled by useEffect or manual reset
                      }} style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${c.inputBorder}`, background: c.inputBg, color: c.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Pencil size={12} />
                      </button>
                      {/* Toggle */}
                      <button onClick={() => toggleMutation.mutate({ id: part.id, isActive: !part.isActive })} title={part.isActive ? 'Deactivate' : 'Activate'}
                        style={{ width: 28, height: 28, borderRadius: 7, border: part.isActive ? '1px solid rgba(34,197,94,0.3)' : `1px solid ${c.inputBorder}`, background: part.isActive ? 'rgba(34,197,94,0.1)' : c.inputBg, color: part.isActive ? '#4ade80' : c.textFaint, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {part.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                      </button>
                      {/* Delete */}
                      {confirmDeleteId === part.id ? (
                        <div style={{ display: 'flex', gap: 3 }}>
                          <button onClick={() => { deleteMutation.mutate(part.id); setConfirmDeleteId(null) }}
                            style={{ padding: '3px 8px', borderRadius: 6, border: '1px solid rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.15)', color: '#f87171', cursor: 'pointer', fontSize: 11, fontFamily: "'JetBrains Mono', monospace", whiteSpace: 'nowrap' as const }}>✓</button>
                          <button onClick={() => setConfirmDeleteId(null)}
                            style={{ padding: '3px 8px', borderRadius: 6, border: `1px solid ${c.inputBorder}`, background: c.inputBg, color: c.textMuted, cursor: 'pointer', fontSize: 11 }}>✕</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDeleteId(part.id)} title="Delete permanently"
                          style={{ width: 28, height: 28, borderRadius: 7, border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.08)', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── Orders ───────────────────────────────────────────────────────────────────
function OrdersTab({ c, dark }: any) {
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
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: ['admin-orders', statusFilter] })
      const previous = qc.getQueryData(['admin-orders', statusFilter])
      qc.setQueryData(['admin-orders', statusFilter], (old: any) => {
        if (!old) return old
        return { ...old, data: old.data.map((o: Order) => o.id === id ? { ...o, status } : o) }
      })
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) qc.setQueryData(['admin-orders', statusFilter], context.previous)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['admin-orders'] }),
  })

  const STATUS_OPTIONS = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']
  const STATUS_COLORS: Record<string, string> = {
    PENDING: '#f59e0b', PROCESSING: '#3b82f6', SHIPPED: '#8b5cf6', DELIVERED: '#22c55e', CANCELLED: '#ef4444'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Status filter — scrollable on mobile */}
      <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
        <div style={{ display: 'flex', gap: 6, width: 'fit-content' }}>
          {['', ...STATUS_OPTIONS].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{
              padding: '6px 12px', borderRadius: 20, border: 'none', cursor: 'pointer',
              fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap' as const, fontFamily: "'JetBrains Mono', monospace",
              background: statusFilter === s ? (dark ? '#4C7CFF' : '#2952CC') : (dark ? 'rgba(255,255,255,0.06)' : 'rgba(41,82,204,0.08)'),
              color: statusFilter === s ? '#fff' : c.textMuted,
              transition: 'all 0.15s'
            }}>
              {s || `ALL (${data?.total ?? 0})`}
            </button>
          ))}
        </div>
      </div>

      {/* Orders — cards on mobile, table on desktop */}
      <div className="admin-orders-grid">
        {data?.data.map((order) => {
          const isExpanded = expandedId === order.id
          const statusColor = STATUS_COLORS[order.status] || '#64748b'
          return (
            <div key={order.id} className="admin-card">
              <div style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: c.textMuted }}>
                      #{order.id.slice(-8).toUpperCase()}
                    </div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500, color: c.text, marginTop: 2 }}>
                      {(order as any).user?.name ?? 'Guest'}
                    </div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: c.textFaint }}>
                      {(order as any).user?.email}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700, color: c.accent }}>
                      ₾{Number(order.total).toFixed(2)}
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: c.textFaint, marginTop: 2 }}>
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, gap: 8, flexWrap: 'wrap' }}>
                  <select value={order.status}
                    onChange={e => statusMutation.mutate({ id: order.id, status: e.target.value })}
                    style={{ padding: '5px 10px', borderRadius: 8, border: `1px solid ${statusColor}44`, background: `${statusColor}18`, color: statusColor, fontSize: 12, fontWeight: 600, cursor: 'pointer', outline: 'none', fontFamily: "'JetBrains Mono', monospace" }}>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s} style={{ background: dark ? '#0a0f1e' : '#fff', color: c.text }}>{s}</option>)}
                  </select>

                  <button onClick={() => setExpandedId(isExpanded ? null : order.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, background: c.inputBg, border: `1px solid ${c.inputBorder}`, borderRadius: 8, padding: '5px 10px', color: c.textMuted, cursor: 'pointer', fontSize: 12, fontFamily: "'Inter', sans-serif" }}>
                    {isExpanded ? <><ChevronUp size={13} /> Hide</> : <><ChevronDown size={13} /> Details</>}
                  </button>
                </div>

                {isExpanded && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${c.divider}` }}>
                    {order.items.map(item => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: c.textMuted, padding: '4px 0', fontFamily: "'Inter', sans-serif" }}>
                        <span>{item.part?.name} × {item.quantity}</span>
                        <span style={{ color: c.accent, fontWeight: 600 }}>₾{(Number(item.price) * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Promotions ───────────────────────────────────────────────────────────────
function PromotionsTab({ c, inputSt, labelSt, btnPrimary, btnSecondary, dark }: any) {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)

  const { data: promos } = useQuery<Promotion[]>({
    queryKey: ['admin-promos'],
    queryFn: async () => { const { data } = await api.get('/admin/promotions'); return data },
  })

  const { register, handleSubmit, reset } = useForm<PromoForm>({
    resolver: zodResolver(promoSchema),
    defaultValues: { type: 'PERCENTAGE' },
  })

  const createMutation = useMutation({
    mutationFn: (data: PromoForm) => api.post('/admin/promotions', {
      ...data,
      discount: parseFloat(String(data.discount)),
      usageLimit: data.usageLimit ? parseInt(String(data.usageLimit)) : undefined,
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-promos'] }); setShowForm(false); reset() },
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => api.patch(`/admin/promotions/${id}`, { isActive }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-promos'] }),
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <button className="btn-primary-admin" onClick={() => setShowForm(!showForm)} style={{ ...btnPrimary, width: 'fit-content' }}>
        {showForm ? <><X size={13} /> Cancel</> : <><Plus size={13} /> Create promotion</>}
      </button>

      {showForm && (
        <div className="admin-card">
          <div className="admin-energy-bar" style={{ height: 2 }} />
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${c.cardBorder}`, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Tag size={14} style={{ color: c.teal }} />
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: c.text }}>New promotion</span>
          </div>
          <form onSubmit={handleSubmit(d => createMutation.mutate(d))} style={{ padding: 18 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
              <div>
                <label style={labelSt}>Promo code *</label>
                <input {...register('code')} className="admin-input" placeholder="SUMMER30" style={{ ...inputSt, textTransform: 'uppercase' as const, letterSpacing: '0.1em', fontWeight: 600 }} />
              </div>
              <div>
                <label style={labelSt}>Description</label>
                <input {...register('description')} className="admin-input" placeholder="Summer sale…" style={inputSt} />
              </div>
              <div>
                <label style={labelSt}>Discount *</label>
                <input {...register('discount', { valueAsNumber: true })} type="number" step="0.01" className="admin-input" placeholder="30" style={inputSt} />
              </div>
              <div>
                <label style={labelSt}>Type *</label>
                <select {...register('type')} className="admin-input" style={{ ...inputSt, cursor: 'pointer' }}>
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED">Fixed (₾)</option>
                </select>
              </div>
              <div>
                <label style={labelSt}>Expiry date</label>
                <input {...register('expiresAt')} type="date" className="admin-input" style={inputSt} />
              </div>
              <div>
                <label style={labelSt}>Usage limit</label>
                <input {...register('usageLimit', { valueAsNumber: true })} type="number" className="admin-input" placeholder="Unlimited" style={inputSt} />
              </div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 12, borderTop: `1px solid ${c.divider}`, flexWrap: 'wrap' }}>
                <button type="button" onClick={() => { setShowForm(false); reset() }} style={btnSecondary} className="btn-secondary-admin">Cancel</button>
                <button type="submit" disabled={createMutation.isPending} className="btn-primary-admin" style={btnPrimary}>
                  {createMutation.isPending ? 'Creating…' : 'Create'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Promos list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {Array.isArray(promos) && promos.map(promo => (
          <div key={promo.id} className="admin-card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, fontWeight: 700, color: c.accent, letterSpacing: '0.05em' }}>{promo.code}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: c.textMuted, marginTop: 2 }}>{promo.description ?? '—'}</div>
                <div style={{ display: 'flex', gap: 10, marginTop: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: c.text, fontWeight: 600 }}>
                    {promo.type === 'PERCENTAGE' ? `${promo.discount}%` : `₾${promo.discount}`}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: c.textFaint }}>
                    Used: {promo.usageCount}{promo.usageLimit ? `/${promo.usageLimit}` : ''}
                  </span>
                  {promo.expiresAt && (
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: c.textFaint }}>
                      Expires: {formatDate(promo.expiresAt)}
                    </span>
                  )}
                </div>
              </div>
              <button onClick={() => toggleMutation.mutate({ id: promo.id, isActive: !promo.isActive })}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: promo.isActive ? '#22c55e' : c.textFaint, display: 'flex', padding: 4 }}>
                {promo.isActive ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Settings ─────────────────────────────────────────────────────────────────
function SettingsTab({ c, inputSt, labelSt, btnPrimary, dark }: any) {
  const [saved, setSaved] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 600 }}>
      {[
        {
          title: 'Store information',
          fields: [
            { label: 'Store name', value: 'PriusParts.ge', type: 'text' },
            { label: 'Contact email', value: 'admin@priusparts.ge', type: 'email' },
            { label: 'Support phone', value: '+995 XXX XXX XXX', type: 'text' },
          ]
        },
        {
          title: 'Shipping',
          fields: [
            { label: 'Default shipping cost (₾)', value: '9.99', type: 'number' },
            { label: 'Free shipping threshold (₾)', value: '200', type: 'number' },
          ]
        }
      ].map(section => (
        <div key={section.title} className="admin-card">
          <div className="admin-energy-bar" style={{ height: 2 }} />
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${c.cardBorder}` }}>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: c.text }}>{section.title}</span>
          </div>
          <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {section.fields.map(f => (
              <div key={f.label}>
                <label style={labelSt}>{f.label}</label>
                <input type={f.type} defaultValue={f.value} className="admin-input" style={inputSt} />
              </div>
            ))}
          </div>
        </div>
      ))}

      <button className="btn-primary-admin" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500) }}
        style={{ ...btnPrimary, width: 'fit-content', background: saved ? 'linear-gradient(135deg, #16a34a, #22c55e)' : btnPrimary.background }}>
        {saved ? <><CheckCircle size={14} /> Saved!</> : 'Save settings'}
      </button>
    </div>
  )
}