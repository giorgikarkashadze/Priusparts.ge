import { useCategories } from '@/hooks/useProducts'
import type { FilterState } from '@/types/types'

// const PRIUS_YEARS = Array.from({ length: 2024 - 2008 + 1 }, (_, i) => 2008 + i).reverse()

const GENERATIONS = [
  { label: 'Gen 2 (2004–2009)', years: [2008, 2009] },
  { label: 'Gen 3 (2010–2015)', years: [2010, 2011, 2012, 2013, 2014, 2015] },
  { label: 'Gen 4 (2016–2022)', years: [2016, 2017, 2018, 2019, 2020, 2021, 2022] },
  { label: 'Gen 5 (2023+)', years: [2023, 2024] },
]

interface Props {
  filters: FilterState
  onChange: (filters: Partial<FilterState>) => void
}

const sectionTitle: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
  letterSpacing: '0.05em', color: '#6b7280', marginBottom: 10
}

const selectStyle: React.CSSProperties = {
  width: '100%', padding: '8px 10px', borderRadius: 8,
  border: '1px solid #374151', background: '#111e35',
  color: '#f9fafb', fontSize: 13, cursor: 'pointer', marginBottom: 8,
  boxSizing: 'border-box'
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 10px', borderRadius: 8,
  border: '1px solid #374151', background: '#111e35',
  color: '#f9fafb', fontSize: 13, outline: 'none', boxSizing: 'border-box'
}

export default function FilterSidebar({ filters, onChange }: Props) {
  const { data: categories } = useCategories()

  return (
    <div style={{ background: '#0d1526', border: '1px solid #111e35', borderRadius: 12, padding: 16 }}>

      {/* Year */}
      <div style={{ marginBottom: 20 }}>
        <div style={sectionTitle}>Prius Year</div>
        <select style={selectStyle} value={filters.year}
          onChange={(e) => onChange({ year: e.target.value })}>
          <option value="">All years (2008–2024)</option>
          {GENERATIONS.map(gen => (
            <optgroup key={gen.label} label={gen.label}>
              {gen.years.map(y => (
                <option key={y} value={String(y)}>{y}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Category */}
      <div style={{ marginBottom: 20 }}>
        <div style={sectionTitle}>Category</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <button
            onClick={() => onChange({ category: '' })}
            style={{
              textAlign: 'left', padding: '8px 12px', borderRadius: 8, border: 'none',
              cursor: 'pointer', fontSize: 13, fontWeight: 500,
              background: !filters.category ? '#1d6fe8' : 'transparent',
              color: !filters.category ? '#fff' : '#9ca3af',
            }}>
            All parts
          </button>
          {Array.isArray(categories) && categories.map((c) => (
            <button
              key={c.id}
              onClick={() => onChange({ category: c.slug })}
              style={{
                textAlign: 'left', padding: '8px 12px', borderRadius: 8, border: 'none',
                cursor: 'pointer', fontSize: 13, display: 'flex', justifyContent: 'space-between',
                alignItems: 'center',
                background: filters.category === c.slug ? '#1d6fe8' : 'transparent',
                color: filters.category === c.slug ? '#fff' : '#9ca3af',
              }}>
              <span>{c.icon} {c.name}</span>
              <span style={{ fontSize: 11, opacity: 0.7 }}>{c._count?.parts}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div style={{ marginBottom: 20 }}>
        <div style={sectionTitle}>Price range</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="number" placeholder="Min" value={filters.minPrice}
            onChange={(e) => onChange({ minPrice: e.target.value })}
            style={{ ...inputStyle, width: '50%' }} />
          <span style={{ color: '#6b7280' }}>–</span>
          <input type="number" placeholder="Max" value={filters.maxPrice}
            onChange={(e) => onChange({ maxPrice: e.target.value })}
            style={{ ...inputStyle, width: '50%' }} />
        </div>
      </div>

      {/* Clear */}
      {Object.values(filters).some(Boolean) && (
        <button
          onClick={() => onChange({ makeId: '', modelId: '', year: '', category: '', minPrice: '', maxPrice: '', search: '', sort: 'newest' })}
          style={{
            width: '100%', padding: '8px', borderRadius: 8, border: '1px solid #374151',
            background: 'transparent', color: '#6b7280', fontSize: 13, cursor: 'pointer'
          }}>
          Clear all filters
        </button>
      )}
    </div>
  )
}