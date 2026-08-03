import { getCategoryName } from '@/hooks/usePartLocale'
import { useCategories } from '@/hooks/useProducts'
import { useThemeStore } from '@/store'
import type { FilterState } from '@/types/types'
import { useTranslation } from 'react-i18next'

// const GENERATIONS = [
//   { label: 'Gen 2 (2008–2009)', years: [2008, 2009] },
//   { label: 'Gen 3 (2010–2015)', years: [2010, 2011, 2012, 2013, 2014, 2015] },
//   { label: 'Gen 4 (2016–2022)', years: [2016, 2017, 2018, 2019, 2020, 2021, 2022] },
//   { label: 'Gen 5 (2023+)', years: [2023, 2024] },
// ]

const ALL_YEARS = Array.from({ length: 2024 - 2008 + 1 }, (_, i) => 2008 + i)

interface Props {
  filters: FilterState
  onChange: (filters: Partial<FilterState>) => void
}

export default function FilterSidebar({ filters, onChange }: Props) {
  const { data: categories } = useCategories()
  const { dark } = useThemeStore()
  const { t } = useTranslation()
  const { i18n } = useTranslation()

  // Theme-aware tokens
  const s = dark ? {
    bg: 'rgba(13,18,30,0.8)',
    border: 'rgba(124,138,165,0.12)',
    selectBg: 'rgba(255,255,255,0.03)',
    selectBorder: 'rgba(124,138,165,0.2)',
    selectColor: 'rgba(198, 204, 218, 0.94)',
    optionBg: '#0a0f1e',
    labelColor: '#22D3B8',
    mutedColor: '#7C8AA5',
    separatorColor: '#4A5670',
    activeYearBg: 'linear-gradient(135deg, rgba(76,124,255,0.25), rgba(34,211,184,0.25))',
    activeYearBorder: 'rgba(34,211,184,0.5)',
    activeYearColor: '#22D3B8',
    inactiveYearBg: 'rgba(255,255,255,0.02)',
    inactiveYearBorder: 'rgba(124,138,165,0.15)',
    inactiveYearColor: '#7C8AA5',
    rangeDisplayBg: 'rgba(76,124,255,0.08)',
    rangeDisplayBorder: 'rgba(76,124,255,0.2)',
    rangeDisplayColor: '#4C7CFF',
    clearBg: 'rgba(255,107,87,0.06)',
    clearBorder: 'rgba(255,107,87,0.3)',
    clearColor: '#FF6B57',
    gradientAccent: 'linear-gradient(135deg, #4C7CFF, #22D3B8)',
  } : {
    bg: 'rgba(255,255,255,0.9)',
    border: 'rgba(3, 10, 26, 0.56)',
    selectBg: '#f8faff',
    selectBorder: 'rgba(60,90,160,0.2)',
    selectColor: 'rgba(7, 7, 7, 0.75)',
    optionBg: '#ffffff',
    labelColor: '#0C9C88',
    mutedColor: '#5B6B85',
    separatorColor: '#94A3B8',
    activeYearBg: 'linear-gradient(135deg, rgba(51,87,204,0.15), rgba(12,156,136,0.15))',
    activeYearBorder: 'rgba(12,156,136,0.5)',
    activeYearColor: '#0C9C88',
    inactiveYearBg: '#f8faff',
    inactiveYearBorder: 'rgba(60,90,160,0.15)',
    inactiveYearColor: '#5B6B85',
    rangeDisplayBg: 'rgba(51,87,204,0.08)',
    rangeDisplayBorder: 'rgba(51,87,204,0.2)',
    rangeDisplayColor: '#3357CC',
    clearBg: 'rgba(217,67,43,0.06)',
    clearBorder: 'rgba(217,67,43,0.3)',
    clearColor: '#D9432B',
    gradientAccent: 'linear-gradient(135deg, #2952CC, #0A8C7A)',
  }
  
  const sectionLabel: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13, fontWeight: 600,
    letterSpacing: '0.12em', background: `${s.gradientAccent} text`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 10, display: 'block'
  }

  const selectStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: 8,
    border: `1px solid ${s.selectBorder}`, background: s.selectBg,
    color: s.selectColor, fontSize: 13, cursor: 'pointer', marginBottom: 6,
    fontFamily: "'Inter', sans-serif", outline: 'none', boxSizing: 'border-box' as const,
    transition: 'border-color 0.2s, box-shadow 0.2s',
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237C8AA5' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
    paddingRight: 32,
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: 8,
    border: `1px solid ${s.selectBorder}`, background: s.selectBg,
    color: s.selectColor, fontSize: 13, outline: 'none', boxSizing: 'border-box' as const,
    fontFamily: "'Inter', sans-serif", transition: 'border-color 0.2s, box-shadow 0.2s'
  }

  const yearFrom = filters.yearFrom ? parseInt(filters.yearFrom) : null
  const yearTo = filters.yearTo ? parseInt(filters.yearTo) : null

  return (
    <>
    <style>{`
        .hud-select:focus {
          border-color: ${s.activeYearBorder} !important;
          box-shadow: 0 0 0 3px ${dark ? 'rgba(34,211,184,0.1)' : 'rgba(12,156,136,0.1)'} !important;
        }
        .hud-input:focus {
          border-color: ${s.activeYearBorder} !important;
          box-shadow: 0 0 0 3px ${dark ? 'rgba(34,211,184,0.1)' : 'rgba(12,156,136,0.1)'} !important;
        }
        .year-select-btn {
          transition: all 0.15s ease !important;
        }
        .year-select-btn:hover {
          border-color: ${s.activeYearBorder} !important;
          color: ${s.activeYearColor} !important;
        }
        .clear-btn:hover {
          background: ${dark ? 'rgba(255,107,87,0.12)' : 'rgba(217,67,43,0.1)'} !important;
          transform: translateY(-1px);
        }
        .filter-sidebar {
          background: ${dark ? 'rgba(16, 26, 49, 0.8)' : 'rgba(40, 56, 128, 0.2)'} !important;
          transform: translateY(-1px);
          backdropFilter: blur(12px);
          border: 1px solid rgba(124,138,165,0.12); border-radius: 14px;
          padding: 16px; position: relative; overflow: hidden;
        }
      `}</style>

    <div className='filter-sidebar'>

      {/* Top energy line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg, #4C7CFF, #22D3B8)',
      }} />

      {/* Category */}
      <div style={{ marginBottom: 20 }}>
        <span style={sectionLabel}>{t('catalog.category')}</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <button
            onClick={() => onChange({ category: '' })}
            style={{
              textAlign: 'left', padding: '8px 12px', borderRadius: 8,
              border: !filters.category ? '1px solid rgba(76,124,255,0.5)' : '1px solid transparent',
              cursor: 'pointer', fontSize: 15, fontWeight: 600,
              background: !filters.category ? 'linear-gradient(135deg, rgba(18, 57, 163, 0.2), rgba(34,211,184,0.2))' : 'transparent',
              color: s.selectColor,
              fontFamily: "'Inter', sans-serif", transition: 'all 0.15s'
            }}>
            {t('catalog.allParts')}
          </button>
          {Array.isArray(categories) && categories.map((c) => (
            <button
              key={c.id}
              onClick={() => onChange({ category: c.slug })}
              style={{
                textAlign: 'left', padding: '8px 12px', borderRadius: 8,
                border: filters.category === c.slug ? '1px solid rgba(34,211,184,0.5)' : '1px solid transparent',
                cursor: 'pointer', fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: filters.category === c.slug ? 'rgba(34,211,184,0.1)' : 'transparent',
                color: filters.category === c.slug ? dark ? '#f9fafb' : '#0B1220' : dark ? '#f9fafb' : '#0B1220',
                fontFamily: "'Inter', sans-serif", transition: 'all 0.15s'
              }}>
              <span>{c.icon} {getCategoryName(c, i18n.language)}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, opacity: 0.6 }}>
                {c._count?.parts}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div style={{ marginBottom: 20 }}>
        <span style={sectionLabel}>{t('catalog.priceRange')}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="number" placeholder={t('catalog.priceMin')} value={filters.minPrice}
            onChange={(e) => onChange({ minPrice: e.target.value })}
            style={{ ...inputStyle, width: '50%' }} />
          <span style={{ color: '#4A5670', fontFamily: "'JetBrains Mono', monospace" }}>—</span>
          <input type="number" placeholder={t('catalog.priceMax')} value={filters.maxPrice}
            onChange={(e) => onChange({ maxPrice: e.target.value })}
            style={{ ...inputStyle, width: '50%' }} />
        </div>
      </div>

      {/* Year range */}
        <div style={{ marginBottom: 20, marginTop: 4 }}>
          <span style={sectionLabel}>{ t('catalog.year') }</span>
 
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* From / To row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* From select */}
              <div style={{ flex: 1, position: 'relative' }}>
                <div style={{
                  position: 'absolute', top: -8, left: 8, zIndex: 1,
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                  color: s.labelColor, letterSpacing: '0.1em',
                  background: dark ? '#0d1526' : '#fff',
                  padding: '0 4px', pointerEvents: 'none', borderRadius: 20
                }}>{ t('catalog.from') }</div>
                <select
                  className="hud-select"
                  style={{ ...selectStyle, marginBottom: 0 }}
                  value={filters.yearFrom || ''}
                  onChange={(e) => {
                    const from = e.target.value
                    if (filters.yearTo && Number(from) > Number(filters.yearTo)) {
                      onChange({ yearFrom: from, yearTo: '' })
                    } else {
                      onChange({ yearFrom: from })
                    }
                  }}
                >
                  {ALL_YEARS.map(y => (
                    <option key={y} value={String(y)}
                      disabled={yearTo !== null && y > yearTo}
                      style={{ background: s.optionBg }}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
 
              {/* Separator */}
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, flexShrink: 0
              }}>
                <div style={{ width: 12, height: 1, background: s.separatorColor, opacity: 0.5 }} />
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: s.labelColor, opacity: 0.6 }} />
                <div style={{ width: 12, height: 1, background: s.separatorColor, opacity: 0.5 }} />
              </div>
 
              {/* To select */}
              <div style={{ flex: 1, position: 'relative' }}>
                <div style={{
                  position: 'absolute', top: -8, left: 8, zIndex: 1,
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                  color: s.labelColor, letterSpacing: '0.1em',
                  background: dark ? '#0d1526' : '#fff',
                  padding: '0 4px', pointerEvents: 'none', borderRadius: 20
                }}>{ t('catalog.to') }</div>
                <select
                  className="hud-select"
                  style={{ ...selectStyle, marginBottom: 0 }}
                  value={filters.yearTo || ''}
                  onChange={(e) => onChange({ yearTo: e.target.value })}
                >
                  <option value="" style={{ background: s.optionBg }}></option>
                  {ALL_YEARS.map(y => (
                    <option key={y} value={String(y)}
                      disabled={yearFrom !== null && y < yearFrom}
                      style={{ background: s.optionBg }}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
 
            {/* Active range display */}
            {/* {(filters.yearFrom || filters.yearTo) && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '6px 10px', borderRadius: 8,
                background: s.rangeDisplayBg,
                border: `1px solid ${s.rangeDisplayBorder}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: s.labelColor, boxShadow: dark ? `0 0 6px ${s.labelColor}` : 'none' }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: s.rangeDisplayColor, letterSpacing: '0.05em' }}>
                    {filters.yearFrom || '2008'} — {filters.yearTo || '2024'}
                  </span>
                </div>
                <button
                  onClick={() => onChange({ yearFrom: '', yearTo: '' })}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.mutedColor, fontSize: 14, padding: '0 2px', lineHeight: 1, display: 'flex', alignItems: 'center' }}
                >
                  ×
                </button>
              </div>
            )} */}
          </div>
        </div>

      {/* Clear */}
      {Object.values(filters).some(Boolean) && (
        <button
          onClick={() => onChange({ makeId: '', modelId: '', yearFrom: '', yearTo: '', category: '', minPrice: '', maxPrice: '', search: '', sort: 'newest' })}
          style={{
            width: '100%', padding: '9px', borderRadius: 8,
            border: '1px solid rgba(255,107,87,0.3)', background: 'rgba(255,107,87,0.06)',
            color: s.clearColor, fontSize: 12, cursor: 'pointer',
            fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em',
            transition: 'all 0.15s'
          }}>
          {t('catalog.clearFilters')}
        </button>
      )}
    </div>
    </>
  )
}