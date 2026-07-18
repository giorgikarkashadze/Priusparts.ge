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
  const [showFilters, setShowFilters] = useState(true)
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
    <div style={{ width: 'auto', margin: '0 auto', padding: '24px 16px' }}>

      {/* Top toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input
            style={{
              width: '100%', paddingLeft: 36, paddingRight: 12, paddingTop: 9, paddingBottom: 9,
              borderRadius: 8, border: '1px solid #374151', background: '#111e35',
              color: '#f9fafb', fontSize: 14, outline: 'none', boxSizing: 'border-box'
            }}
            placeholder="Search parts..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
          />
        </div>
        <select
          style={{
            padding: '9px 12px', borderRadius: 8, border: '1px solid #374151',
            background: '#111e35', color: '#f9fafb', fontSize: 14, cursor: 'pointer'
          }}
          value={filters.sort}
          onChange={(e) => updateFilters({ sort: e.target.value })}
        >
          {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px',
            borderRadius: 8, border: '1px solid #374151', background: showFilters ? '#1d6fe8' : '#111e35',
            color: '#f9fafb', fontSize: 14, cursor: 'pointer'
          }}
        >
          <SlidersHorizontal size={14} />
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
      </div>

      {/* Active filter chips */}
      {(filters.category || filters.search) && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {filters.category && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px',
              borderRadius: 20, background: 'rgba(212,56,13,0.15)', color: '#4d9fff', fontSize: 12
            }}>
              {filters.category}
              <button onClick={() => updateFilters({ category: '' })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4d9fff', padding: 0, display: 'flex' }}>
                <X size={12} />
              </button>
            </span>
          )}
          {filters.search && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px',
              borderRadius: 20, background: '#111e35', color: '#9ca3af', fontSize: 12, border: '1px solid #374151'
            }}>
              "{filters.search}"
              <button onClick={() => updateFilters({ search: '' })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0, display: 'flex' }}>
                <X size={12} />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Main layout */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

        {/* Sidebar */}
        {showFilters && (
          <div style={{ width: 220, flexShrink: 0 }}>
            <FilterSidebar filters={filters} onChange={updateFilters} />
          </div>
        )}

        {/* Parts grid area */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Results count */}
          <div style={{ marginBottom: 16, color: '#9ca3af', fontSize: 13 }}>
            {isLoading ? 'Loading…' : `${data?.total ?? 0} parts found`}
          </div>

          {/* Grid */}
          {isLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{ height: 260, borderRadius: 12, background: '#111e35', animation: 'pulse 1.5s infinite' }} />
              ))}
            </div>
          ) : !data?.data?.length ? (
            <div style={{ textAlign: 'center', padding: '64px 0', color: '#6b7280' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
              <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>No parts found</div>
              <div style={{ fontSize: 13 }}>Try adjusting your filters or search terms</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
              {data.data.map((part) => <PartCard key={part.id} part={part} />)}
            </div>
          )}

          {/* Pagination */}
          {data && data.page > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
              {Array.from({ length: data.page }).map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  style={{
                    width: 36, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer',
                    fontSize: 14, fontWeight: 500,
                    background: page === i + 1 ? '#1d6fe8' : '#111e35',
                    color: page === i + 1 ? '#fff' : '#9ca3af',
                  }}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}