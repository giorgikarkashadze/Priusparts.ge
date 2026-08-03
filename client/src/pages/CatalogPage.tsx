import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import PartCard from '@/components/PartCard'
import FilterSidebar from '@/components/FilterSidebar'
import type { FilterState } from '@/types/types'
import { useTranslation } from 'react-i18next'
import { useThemeStore } from '@/store'


export default function CatalogPage() {
  const { dark } = useThemeStore()

  const c = dark ? {
      pageBg: '#05070C',
      cardBg: 'rgba(13,18,30,0.8)',
      cardBorder: 'rgba(124,138,165,0.12)',
      text: '#EAF2FF',
      textMuted: '#7C8AA5',
      accent: '#4C7CFF',
      gradientHero: 'linear-gradient(135deg, #05070C 0%, #0a1628 50%, #05070C 100%)',
      gradientAccent: 'linear-gradient(135deg, #4C7CFF, #22D3B8)',
      energyLine: 'linear-gradient(90deg, #4C7CFF, #22D3B8, #4C7CFF, #22D3B8)',
      gridColor: 'rgba(76,124,255,0.04)',
      glowBlue: 'rgba(76,124,255,0.08)',
      glowTeal: 'rgba(34,211,184,0.06)',
      inputPlaceholder: '#b9bfca',
    } : {
      pageBg: '#F0F4FF',
      cardBg: 'rgba(255,255,255,0.9)',
      cardBorder: 'rgba(60,90,200,0.12)',
      text: '#4e5157',
      textMuted: '#4A5A7A',
      accent: '#2952CC',
      gradientHero: 'linear-gradient(135deg, #E8EEFF 0%, #F0F4FF 50%, #E8F6F4 100%)',
      gradientAccent: 'linear-gradient(135deg, #2952CC, #0A8C7A)',
      energyLine: 'linear-gradient(90deg, #2952CC, #0A8C7A, #2952CC, #0A8C7A)',
      gridColor: 'rgba(41,82,204,0.04)',
      glowBlue: 'rgba(41,82,204,0.06)',
      glowTeal: 'rgba(10,140,122,0.05)',
      inputPlaceholder: '#515357',
    }


  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(() => window.innerWidth >= 768);
  const [page, setPage] = useState(1)
  const { t } = useTranslation()
  

  const [filters, setFilters] = useState<FilterState>({
    makeId: searchParams.get('makeId') || '',
    modelId: searchParams.get('modelId') || '',
    year: searchParams.get('year') || '',
    yearFrom: searchParams.get('yearFrom') || '',
    yearTo: searchParams.get('yearTo') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'newest',
  })


  const SORTS = [
  { value: 'newest', label: t('catalog.newestFirst') },
  { value: 'price_asc', label: t('catalog.priceLow') },
  { value: 'price_desc', label: t('catalog.priceHigh') },
 ]

  let itemsPerPage = 20
  const { data, isLoading } = useProducts({ ...filters, page, limit: String( showFilters ? itemsPerPage : itemsPerPage = 30) })

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
    <div style={{ minHeight: '100vh', background:c.pageBg, color: c.text, position: 'relative', overflow: 'hidden' }}> 
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
        .about-grid-bg {
          background-image:
          linear-gradient(${c.gridColor} 1px, transparent 1px),
          linear-gradient(90deg, ${c.gridColor} 1px, transparent 1px);
          background-size: 48px 48px;
          animation: grid-drift 20s linear infinite;
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
        .catalog-input::placeholder { color: ${c.inputPlaceholder} }
        .sort-select option { background: ${c.cardBg}; color: ${c.text}; }
        .filter-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 10px 16px; border-radius: 10px; border: 1px solid rgba(124,138,165,0.2);
          background: rgba(255,255,255,0.03); color: ${c.text}; font-size: 13px;
          cursor: pointer; font-family: 'Inter', sans-serif; font-weight: 500;
          transition: all 0.2s ease;
        }
        .filter-btn:hover { border-color: #22D3B8; color: #22D3B8; background: rgba(34,211,184,0.05); }
        .filter-btn.active { border-color: #1796834b; color: ${c.text}; background: rgba(22, 202, 175, 0.28); }
        .chip {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 4px 10px; border-radius: 20px; font-size: 13px; font-weight: 500;
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
    <div className="about-grid-bg" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', top: '5%', right: '5%', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, ${c.glowBlue}, transparent 70%)`, filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '10%', left: '5%', width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, ${c.glowTeal}, transparent 70%)`, filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', padding: '24px 16px' }}>

        {/* Header */}
        <div style={{ marginBottom: 24, animation: 'fade-up 0.4s ease-out both' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, background: `${c.gradientAccent} text`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              {t('catalog.extraTitle')}
            </span>
          </div>
          {/* <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, color: '#EAF2FF', letterSpacing: '-0.5px' }}>
            {t('catalog.title')}
          </h1> */}
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap', animation: 'fade-up 0.4s 0.05s ease-out both' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
            <input
              className="catalog-input"
              maxLength={10}
              style={{
                  width: '100%', paddingLeft: 44, paddingRight: 16, paddingTop: 12, paddingBottom: 12,
                  borderRadius: 10, background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.9)', border: dark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(41,82,204,0.2)',
                  color: dark ? '#f9fafb' : '#0B1220', fontSize: 14, outline: 'none', boxSizing: 'border-box'
                }}
              placeholder={t('catalog.searchPlaceholder')}
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
            />
          </div>

          {/* Sort */}
          <select
            className="catalog-input sort-select"
            style={{ padding: '10px 12px', cursor: 'pointer', minWidth: 160, color: c.text, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            value={filters.sort}
            onChange={(e) => updateFilters({ sort: e.target.value })}
          >
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>

          {/* Mobile filter trigger */}
          <button
            className={`filter-btn mobile-filter-trigger${showFilters ? '' : 'active'}`}
            style={{ display: 'none' }}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={14} />
            {t('catalog.filters')} {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>

          {/* Desktop filter toggle */}
          <button
            className={`filter-btn${showFilters ? ' active' : ''}`}
            style={{ display: 'flex' }}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={14} />
            {t('catalog.filters')} {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
        </div>

        {/* Active chips */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap', animation: 'fade-up 0.3s ease-out both' }}>
              <span style={{visibility: filters.category ? 'visible' : 'hidden'}} className="chip" onClick={() => updateFilters({ category: '' })}>
                {filters.category} <X size={14} />
              </span>
            {filters.year && (
              <span style={{visibility: filters.year ? 'visible' : 'hidden'}} className="chip" onClick={() => updateFilters({ year: '' })}>
                {filters.year} <X size={10} />
              </span>
            )}
            
            {(filters.minPrice ||filters.maxPrice) &&(
              <span className="chip" style={{ visibility: filters.minPrice || filters.maxPrice ? 'visible' : 'hidden'}}  onClick={() => updateFilters({ minPrice: '', maxPrice: '' })}>
                 {filters.minPrice || '0'} - {filters.maxPrice || '*'} ₾  <X size={10} />
              </span>
            )}
            {(filters.yearFrom || filters.yearTo) && (
              <span style={{ visibility: filters.yearFrom || filters.yearTo ? 'visible' : 'hidden'}} className="chip" onClick={() => updateFilters({ yearFrom: '', yearTo: '' })}>
                {filters.yearFrom || '2008'} — {filters.yearTo || '2024'} <X size={10} />
              </span>
            )}
          </div>

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
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: c.text }}>
                {isLoading ? t('catalog.scanning') : `${data?.total ?? 0} ${t('catalog.partsFound')}`}
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
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: '#EAF2FF', marginBottom: 6 }}>{t('catalog.noPartsTitle')}</div>
                <div style={{ fontSize: 13, color: '#4A5670' }}>{t('catalog.noPartsSub')}</div>
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
        {/* Pagination */}
        {data && data.pages > 1  && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 40 }}>

          {/* Prev button */}
          <button
            onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            disabled={page === 1}
            style={{
              padding: '8px 14px', borderRadius: 8, border: '1px solid rgba(124,138,165,0.2)',
              background: 'transparent', color: page === 1 ? dark ? '#f9fafb' : '#0B1220' : dark ? '#f9fafb' : '#0B1220',
              cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: 13,
              fontFamily: "'JetBrains Mono', monospace", opacity: page === 1 ? 0.4 : 1,
              transition: 'all 0.15s'
            }}>
            ← {t('catalog.previous')}
          </button>

          {/* Page numbers */}
          <div style={{ display: 'flex', gap: 4 }}>
            {Array.from({ length: data.pages }).map((_, i) => {
              const pageNum = i + 1
              // Show first, last, current and neighbors — hide others with ellipsis
              const showPage = pageNum === 1 || pageNum === data.pages ||
                Math.abs(pageNum - page) <= 1

              if (!showPage) {
                // Show ellipsis only once between gaps
                if (pageNum === 2 || pageNum === data.pages - 1) {
                  return (
                    <span key={i} style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4A5670', fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
                      …
                    </span>
                  )
                }
                return null
              }

              return (
                <button
                  key={i}
                  onClick={() => { setPage(pageNum); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  style={{
                    width: 36, height: 36, borderRadius: 8, cursor: 'pointer',
                    fontSize: 13, fontWeight: page === pageNum ? 700 : 400,
                    fontFamily: "'JetBrains Mono', monospace",
                    background: page === pageNum
                      ? 'linear-gradient(135deg, #4C7CFF, #22D3B8)'
                      : 'rgba(255,255,255,0.04)',
                    color: page === pageNum ? '#04121A' : '#7C8AA5',
                    border: page === pageNum ? 'none' : '1px solid rgba(124,138,165,0.2)',
                    transition: 'all 0.15s',
                    boxShadow: page === pageNum ? '0 4px 12px rgba(76,124,255,0.4)' : 'none'
                  }}>
                  {pageNum}
                </button>
              )
            })}
          </div>

          {/* Next button */}
          <button
            onClick={() => { setPage(p => Math.min(data.pages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            disabled={page === data.pages}
            style={{
              padding: '8px 14px', borderRadius: 8, border: '1px solid rgba(124,138,165,0.2)',
              background: 'transparent', color: page === data.pages ? dark ? '#f9fafb' : '#0B1220' : dark ? '#f9fafb' : '#0B1220',
              cursor: page === data.pages ? 'not-allowed' : 'pointer', fontSize: 13,
              fontFamily: "'JetBrains Mono', monospace", opacity: page === data.pages ? 0.4 : 1,
              transition: 'all 0.15s'
            }}>
            {t('catalog.next')} →
          </button>

          {/* Page info */}
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#4A5670', marginLeft: 8 }}>
            {((page - 1) * itemsPerPage) + 1}–{Math.min(page * itemsPerPage, data.total)} / {data.total}
          </div>
        </div>
      )}
      </div>
    </div>
  )
}