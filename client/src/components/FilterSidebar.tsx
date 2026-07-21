import { useCategories } from '@/hooks/useProducts'
import type { FilterState } from '@/types/types'

const GENERATIONS = [
  { label: 'Gen 2 (2008–2009)', years: [2008, 2009] },
  { label: 'Gen 3 (2010–2015)', years: [2010, 2011, 2012, 2013, 2014, 2015] },
  { label: 'Gen 4 (2016–2022)', years: [2016, 2017, 2018, 2019, 2020, 2021, 2022] },
  { label: 'Gen 5 (2023+)', years: [2023, 2024] },
]

interface Props {
  filters: FilterState
  onChange: (filters: Partial<FilterState>) => void
}

export default function FilterSidebar({ filters, onChange }: Props) {
  const { data: categories } = useCategories()

  const sectionLabel: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10, fontWeight: 500, textTransform: 'uppercase' as const,
    letterSpacing: '0.12em', color: '#22D3B8', marginBottom: 10, display: 'block'
  }

  const selectStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: 8,
    border: '1px solid rgba(124,138,165,0.2)', background: 'rgba(255,255,255,0.03)',
    color: '#EAF2FF', fontSize: 13, cursor: 'pointer', marginBottom: 6,
    fontFamily: "'Inter', sans-serif", outline: 'none', boxSizing: 'border-box' as const,
    transition: 'border-color 0.2s'
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: 8,
    border: '1px solid rgba(124,138,165,0.2)', background: 'rgba(255,255,255,0.03)',
    color: '#EAF2FF', fontSize: 13, outline: 'none', boxSizing: 'border-box' as const,
    fontFamily: "'Inter', sans-serif", transition: 'border-color 0.2s'
  }

  return (
    <div style={{
      background: 'rgba(13,18,30,0.8)', backdropFilter: 'blur(12px)',
      border: '1px solid rgba(124,138,165,0.12)', borderRadius: 14,
      padding: 16, position: 'relative', overflow: 'hidden'
    }}>
      {/* Top energy line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg, #4C7CFF, #22D3B8)',
      }} />

      {/* Year */}
      <div style={{ marginBottom: 20 }}>
        <span style={sectionLabel}>Prius Year</span>
        <select style={selectStyle} value={filters.year}
          onChange={(e) => onChange({ year: e.target.value })}>
          <option value="">All years (2008–2024)</option>
          {GENERATIONS.map(gen => (
            <optgroup key={gen.label} label={gen.label} style={{ background: '#0a0f1e' }}>
              {gen.years.map(y => (
                <option key={y} value={String(y)} style={{ background: '#0a0f1e' }}>{y}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Category */}
      <div style={{ marginBottom: 20 }}>
        <span style={sectionLabel}>Category</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <button
            onClick={() => onChange({ category: '' })}
            style={{
              textAlign: 'left', padding: '8px 12px', borderRadius: 8,
              border: !filters.category ? '1px solid rgba(76,124,255,0.5)' : '1px solid transparent',
              cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: !filters.category ? 'linear-gradient(135deg, rgba(76,124,255,0.2), rgba(34,211,184,0.2))' : 'transparent',
              color: !filters.category ? '#EAF2FF' : '#7C8AA5',
              fontFamily: "'Inter', sans-serif", transition: 'all 0.15s'
            }}>
            All parts
          </button>
          {Array.isArray(categories) && categories.map((c) => (
            <button
              key={c.id}
              onClick={() => onChange({ category: c.slug })}
              style={{
                textAlign: 'left', padding: '8px 12px', borderRadius: 8,
                border: filters.category === c.slug ? '1px solid rgba(34,211,184,0.5)' : '1px solid transparent',
                cursor: 'pointer', fontSize: 13, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: filters.category === c.slug ? 'rgba(34,211,184,0.1)' : 'transparent',
                color: filters.category === c.slug ? '#22D3B8' : '#7C8AA5',
                fontFamily: "'Inter', sans-serif", transition: 'all 0.15s'
              }}>
              <span>{c.icon} {c.name}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, opacity: 0.6 }}>
                {c._count?.parts}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div style={{ marginBottom: 20 }}>
        <span style={sectionLabel}>Price Range</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="number" placeholder="Min" value={filters.minPrice}
            onChange={(e) => onChange({ minPrice: e.target.value })}
            style={{ ...inputStyle, width: '50%' }} />
          <span style={{ color: '#4A5670', fontFamily: "'JetBrains Mono', monospace" }}>—</span>
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
            width: '100%', padding: '9px', borderRadius: 8,
            border: '1px solid rgba(255,107,87,0.3)', background: 'rgba(255,107,87,0.06)',
            color: '#FF6B57', fontSize: 12, cursor: 'pointer',
            fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em',
            transition: 'all 0.15s'
          }}>
          CLEAR FILTERS
        </button>
      )}
    </div>
  )
}