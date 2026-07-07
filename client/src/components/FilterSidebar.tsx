import { useCategories, useMakes } from '@/hooks/useProducts'
import { cn } from '@/lib/utils'
import type { FilterState } from '../types/types'

interface Props {
  filters: FilterState
  onChange: (filters: Partial<FilterState>) => void
}

export default function FilterSidebar({ filters, onChange }: Props) {
  const { data: categories } = useCategories()
  const { data: makes } = useMakes()

  const selectedMake = makes?.find((m) => m.id === filters.makeId)

  return (
    <aside className="w-56 shrink-0 space-y-5">
      {/* Vehicle selector */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Vehicle</h3>
        <div className="space-y-2">
          <select
            className="input text-sm"
            value={filters.makeId}
            onChange={(e) => onChange({ makeId: e.target.value, modelId: '', year: '' })}
          >
            <option value="">All makes</option>
            {makes?.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>

          {selectedMake && (
            <select
              className="input text-sm"
              value={filters.modelId}
              onChange={(e) => onChange({ modelId: e.target.value, year: '' })}
            >
              <option value="">All models</option>
              {selectedMake.models.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          )}

          {filters.modelId && selectedMake && (
            <select
              className="input text-sm"
              value={filters.year}
              onChange={(e) => onChange({ year: e.target.value })}
            >
              <option value="">All years</option>
              {selectedMake.models
                .find((m) => m.id === filters.modelId)
                ?.years.sort((a, b) => b - a)
                .map((y) => <option key={y} value={String(y)}>{y}</option>)}
            </select>
          )}
        </div>
      </div>

      {/* Category */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Category</h3>
        <div className="space-y-0.5">
          <button
            onClick={() => onChange({ category: '' })}
            className={cn('w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors', !filters.category ? 'bg-brand text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800')}
          >
            All parts
          </button>
          {categories?.map((c) => (
            <button
              key={c.id}
              onClick={() => onChange({ category: c.slug })}
              className={cn('w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center justify-between',
                filters.category === c.slug ? 'bg-brand text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800')}
            >
              <span>{c.icon} {c.name}</span>
              <span className={cn('text-xs', filters.category === c.slug ? 'text-white/70' : 'text-gray-400')}>
                {c._count?.parts}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Price range</h3>
        <div className="flex items-center gap-2">
          <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => onChange({ minPrice: e.target.value })} className="input text-sm" min={0} />
          <span className="text-gray-400">–</span>
          <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => onChange({ maxPrice: e.target.value })} className="input text-sm" min={0} />
        </div>
      </div>

      {/* Reset */}
      {Object.values(filters).some(Boolean) && (
        <button
          onClick={() => onChange({ makeId: '', modelId: '', year: '', category: '', minPrice: '', maxPrice: '', search: '', sort: '' })}
          className="w-full text-sm text-gray-500 hover:text-brand underline"
        >
          Clear all filters
        </button>
      )}
    </aside>
  )
}
