import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import PartCard from '@/components/PartCard'
import FilterSidebar from '@/components/FilterSidebar'
import type { FilterState } from '@/types/types'

const SORTS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
]

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)

  const [filters, setFilters] = useState<FilterState>({
    makeId: searchParams.get('makeId') || '',
    modelId: searchParams.get('modelId') || '',
    year: searchParams.get('year') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'newest',
  })

  const { data, isLoading } = useProducts({ ...filters, page })

  const updateFilters = (updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }))
    setPage(1)
  }

  useEffect(() => {
    const params: Record<string, string> = {}
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v })
    setSearchParams(params, { replace: true })
  }, [filters])

  const activeFilterCount = [filters.makeId, filters.modelId, filters.year, filters.category, filters.minPrice, filters.maxPrice].filter(Boolean).length

  return (
    <div style={{ minHeight: '100vh', background: '#05070C', color: '#EAF2FF' }}>
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
        @keyframes card-in {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .catalog-grid-bg {
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
        .catalog-input {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(124,138,165,0.2);
          border-radius: 10px;
          color: #EAF2FF;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
          font-family: 'Inter', sans-serif;
        }
        .catalog-input:focus {
          border-color: #22D3B8;
          box-shadow: 0 0 0 3px rgba(34,211,184,0.1);
          background: rgba(34,211,184,0.03);
        }
        .catalog-input::placeholder { color: #4A5670; }
        .sort-select option { background: #0a0f1e; }
        .filter-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 10px 16px; border-radius: 10px; border: 1px solid rgba(124,138,165,0.2);
          background: rgba(255,255,255,0.03); color: #7C8AA5; font-size: 13px;
          cursor: pointer; font-family: 'Inter', sans-serif; font-weight: 500;
          transition: all 0.2s ease;
        }
        .filter-btn:hover { border-color: #22D3B8; color: #22D3B8; background: rgba(34,211,184,0.05); }
        .filter-btn.active { border-color: #4C7CFF; color: #EAF2FF; background: rgba(76,124,255,0.15); }
        .chip {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 500;
          background: rgba(76,124,255,0.12); color: #4C7CFF;
          border: 1px solid rgba(76,124,255,0.25); cursor: pointer;
          font-family: 'JetBrains Mono', monospace; transition: all 0.15s;
        }
        .chip:hover { background: rgba(76,124,255,0.2); }
        .part-card-wrap {
          animation: card-in 0.35s ease-out both;
        }
        .skeleton {
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 14px;
        }
        .page-btn {
          width: 36px; height: 36px; border-radius: 8px; border: 1px solid rgba(124,138,165,0.2);
          background: transparent; color: #7C8AA5; font-size: 13px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s ease; font-family: 'Inter', sans-serif;
        }
        .page-btn:hover { border-color: #22D3B8; color: #22D3B8; }
        .page-btn.active {
          background: linear-gradient(135deg, #4C7CFF, #22D3B8);
          border-color: transparent; color: #04121A; font-weight: 700;
        }
        .sidebar-overlay {
          display: none;
          position: fixed; inset: 0; background: rgba(0,0,0,0.7);
          z-index: 40; backdrop-filter: blur(4px);
        }
        .sidebar-drawer {
          position: fixed; top: 0; left: 0; bottom: 0; width: 280px;
          background: #0a0f1e; border-right: 1px solid rgba(76,124,255,0.15);
          z-index: 50; overflow-y: auto; transform: translateX(-100%);
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
          padding: 16px;
        }
        .sidebar-drawer.open { transform: translateX(0); }
        .sidebar-overlay.open { display: block; }

        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-filter-trigger { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-filter-trigger { display: none !important; }
          .sidebar-drawer { display: none !important; }
          .sidebar-overlay { display: none !important; }
          .desktop-sidebar { display: block !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .energy-bar, .catalog-grid-bg, .part-card-wrap, .skeleton { animation: none; }
        }
      `}</style>

      {/* Background */}
      <div className="catalog-grid-bg" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', top: '20%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(76,124,255,0.06), transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '20%', left: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,184,0.05), transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', padding: '24px 16px' }}>

        {/* Header */}
        <div style={{ marginBottom: 24, animation: 'fade-up 0.4s ease-out both' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#22D3B8', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              // PARTS.CATALOG
            </span>
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, color: '#EAF2FF', letterSpacing: '-0.5px' }}>
            Prius Parts
          </h1>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap', animation: 'fade-up 0.4s 0.05s ease-out both' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#4A5670' }} />
            <input
              className="catalog-input"
              style={{ width: '100%', paddingLeft: 36, paddingRight: 12, paddingTop: 10, paddingBottom: 10, boxSizing: 'border-box' }}
              placeholder="Search parts..."
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
            />
          </div>

          {/* Sort */}
          <select
            className="catalog-input sort-select"
            style={{ padding: '10px 12px', cursor: 'pointer', minWidth: 160 }}
            value={filters.sort}
            onChange={(e) => updateFilters({ sort: e.target.value })}
          >
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>

          {/* Mobile filter trigger */}
          <button
            className={`filter-btn mobile-filter-trigger${showFilters ? ' active' : ''}`}
            style={{ display: 'none' }}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={14} />
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>

          {/* Desktop filter toggle */}
          <button
            className={`filter-btn${showFilters ? ' active' : ''}`}
            style={{ display: 'flex' }}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={14} />
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
        </div>

        {/* Active chips */}
        {(filters.category || filters.search || filters.year) && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap', animation: 'fade-up 0.3s ease-out both' }}>
            {filters.category && (
              <span className="chip" onClick={() => updateFilters({ category: '' })}>
                {filters.category} <X size={10} />
              </span>
            )}
            {filters.year && (
              <span className="chip" onClick={() => updateFilters({ year: '' })}>
                {filters.year} <X size={10} />
              </span>
            )}
            {filters.search && (
              <span className="chip" style={{ background: 'rgba(34,211,184,0.1)', color: '#22D3B8', borderColor: 'rgba(34,211,184,0.25)' }} onClick={() => updateFilters({ search: '' })}>
                "{filters.search}" <X size={10} />
              </span>
            )}
          </div>
        )}

        {/* Main layout */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

          {/* Desktop sidebar */}
          {showFilters && (
            <div className="desktop-sidebar" style={{ width: 240, flexShrink: 0, animation: 'fade-up 0.3s ease-out both' }}>
              <FilterSidebar filters={filters} onChange={updateFilters} />
            </div>
          )}

          {/* Mobile drawer overlay */}
          <div className={`sidebar-overlay${showFilters ? ' open' : ''}`} onClick={() => setShowFilters(false)} />

          {/* Mobile drawer */}
          <div className={`sidebar-drawer${showFilters ? ' open' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#22D3B8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Filters</span>
              <button onClick={() => setShowFilters(false)} style={{ background: 'none', border: 'none', color: '#7C8AA5', cursor: 'pointer', display: 'flex' }}>
                <X size={16} />
              </button>
            </div>
            <FilterSidebar filters={filters} onChange={(f) => { updateFilters(f) }} />
          </div>

          {/* Parts area */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Results bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#4A5670' }}>
                {isLoading ? 'SCANNING…' : `${data?.total ?? 0} PARTS FOUND`}
              </span>
            </div>

            {/* Grid */}
            {isLoading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: 260, animationDelay: `${i * 0.05}s` }} />
                ))}
              </div>
            ) : !data?.data?.length ? (
              <div style={{ textAlign: 'center', padding: '64px 0', animation: 'fade-up 0.4s ease-out both' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: '#EAF2FF', marginBottom: 6 }}>No parts found</div>
                <div style={{ fontSize: 13, color: '#4A5670' }}>Try adjusting your filters or search terms</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
                {data.data.map((part, i) => (
                  <div key={part.id} className="part-card-wrap" style={{ animationDelay: `${i * 0.04}s` }}>
                    <PartCard part={part} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}