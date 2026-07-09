import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import PartCard from '../components/PartCard'
import FilterSidebar from '../components/FilterSidebar'
import type { FilterState } from '../types/types'

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input pl-9"
            placeholder="Search parts..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
          />
        </div>
        <select
          className="input w-44"
          value={filters.sort}
          onChange={(e) => updateFilters({ sort: e.target.value })}
        >
          {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden btn-secondary flex items-center gap-2"
        >
          <SlidersHorizontal size={14} />
          Filters
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar — desktop always, mobile toggle */}
        <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
          <FilterSidebar filters={filters} onChange={updateFilters} />
        </div>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">
              {isLoading ? 'Loading…' : `${data?.total ?? 0} parts found`}
            </span>
            {/* Active filter chips */}
            <div className="flex flex-wrap gap-1.5">
              {filters.category && (
                <span className="badge bg-brand/10 text-brand text-xs flex items-center gap-1">
                  {filters.category} <button onClick={() => updateFilters({ category: '' })}><X size={10} /></button>
                </span>
              )}
              {filters.search && (
                <span className="badge bg-gray-100 dark:bg-gray-800 text-xs flex items-center gap-1">
                  "{filters.search}" <button onClick={() => updateFilters({ search: '' })}><X size={10} /></button>
                </span>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card h-56 animate-pulse bg-gray-100 dark:bg-gray-800" />
              ))}
            </div>
          ) : data?.data.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-4xl mb-3">🔍</div>
              <div className="font-medium mb-1">No parts found</div>
              <div className="text-sm">Try adjusting your filters or search terms</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data?.data.map((part) => <PartCard key={part.id} part={part} />)}
            </div>
          )}

          {/* Pagination */}
          {data && data.page > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: data.page }).map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    page === i + 1 ? 'bg-brand text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
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
