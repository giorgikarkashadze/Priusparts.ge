import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Search, Truck, RotateCcw, Shield, Headphones, ChevronRight } from 'lucide-react'
import { useProducts, useCategories } from '@/hooks/useProducts'
import PartCard from '@/components/PartCard'

const GENERATIONS = [
  { label: 'Gen 2', years: '2004–2009', emoji: '🚗', slug: '2004' },
  { label: 'Gen 3', years: '2010–2015', emoji: '🚗', slug: '2010' },
  { label: 'Gen 4', years: '2016–2022', emoji: '🚗', slug: '2016' },
  { label: 'Gen 5', years: '2023+', emoji: '🚗', slug: '2023' },
]

const FEATURES = [
  { icon: Shield, title: 'OEM & Aftermarket', desc: 'Genuine Toyota parts alongside quality aftermarket alternatives built for Prius.' },
  { icon: Truck, title: 'Fast delivery', desc: 'Quick delivery across Georgia. Same-day dispatch on orders before 2pm.' },
  { icon: RotateCcw, title: '30-day returns', desc: 'Not the right part? Return within 30 days for a full refund or exchange.' },
  { icon: Headphones, title: 'Prius experts', desc: 'Our team specializes exclusively in Toyota Prius — we know every part.' },
]

export default function HomePage() {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const { data: categories } = useCategories()
  const { data: popular } = useProducts({ sort: 'newest', limit: '4' } as any)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) navigate(`/catalog?search=${encodeURIComponent(search)}`)
  }

  return (
    <div>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #0a0f1e 0%, #1e1b4b 50%, #0a0f1e 100%)',
        padding: '64px 16px', textAlign: 'center'
      }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(212,56,13,0.15)', color: '#4d9fff', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500, marginBottom: 20, border: '1px solid rgba(212,56,13,0.3)' }}>
            🚗 Toyota Prius Specialist — 2008 to 2024
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 700, color: '#f9fafb', lineHeight: 1.2, marginBottom: 12, letterSpacing: '-1px' }}>
            Parts for your<br />
            <span style={{ color: '#4d9fff' }}>Toyota Prius</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 16, marginBottom: 32, lineHeight: 1.6 }}>
            Genuine & aftermarket Prius parts delivered fast across Georgia.
            All generations from 2008 to 2024.
          </p>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, maxWidth: 480, margin: '0 auto' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Prius parts..."
                style={{
                  width: '100%', paddingLeft: 44, paddingRight: 16, paddingTop: 12, paddingBottom: 12,
                  borderRadius: 10, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                  color: '#f9fafb', fontSize: 14, outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>
            <button type="submit" style={{
              background: '#1d6fe8', color: '#fff', border: 'none', padding: '12px 24px',
              borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap'
            }}>
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Stats */}
      <div style={{ background: '#1a2744', borderBottom: '1px solid #334155' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, textAlign: 'center' }}>
          {[
            ['5,000+', 'Prius parts'],
            ['2008–2024', 'All generations'],
            ['1–3 days', 'Delivery'],
            ['4.9★', 'Customer rating'],
          ].map(([val, lbl]) => (
            <div key={lbl}>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#4d9fff' }}>{val}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 16px' }}>

        {/* Shop by generation */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Shop by generation</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            {GENERATIONS.map((gen) => (
              <Link key={gen.label} to={`/catalog?year=${gen.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: '#0d1526', border: '1px solid #111e35', borderRadius: 12,
                  padding: '20px 16px', textAlign: 'center', cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#1d6fe8'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#111e35'; (e.currentTarget as HTMLDivElement).style.transform = 'none' }}
                >
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{gen.emoji}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#f9fafb', marginBottom: 2 }}>Toyota Prius {gen.label}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{gen.years}</div>
                  <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, color: '#4d9fff', fontSize: 12, fontWeight: 500 }}>
                    Browse parts <ChevronRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Categories */}
        {Array.isArray(categories) && categories.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Shop by category</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
              {categories.map((c) => (
                <Link key={c.id} to={`/catalog?category=${c.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: '#0d1526', border: '1px solid #111e35', borderRadius: 12,
                    padding: '16px 12px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s'
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#1d6fe8' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#111e35' }}
                  >
                    <div style={{ fontSize: 28, marginBottom: 6 }}>{c.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#f9fafb' }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{c._count?.parts} parts</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Promo banner */}
        <section style={{ marginBottom: 48 }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(212,56,13,0.15), rgba(255,107,53,0.1))',
            border: '1px solid rgba(212,56,13,0.3)', borderRadius: 16, padding: '24px',
            display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap'
          }}>
            <div style={{ fontSize: 40 }}>🏷️</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: '#4d9fff', fontSize: 16 }}>Summer Sale — up to 30% off brake parts</div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Use code <strong style={{ color: '#f9fafb' }}>SUMMER30</strong> at checkout. Ends August 31.</div>
            </div>
            <Link to="/catalog?category=brakes" style={{
              background: '#1d6fe8', color: '#fff', textDecoration: 'none',
              padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap'
            }}>
              Shop brakes
            </Link>
          </div>
        </section>

        {/* New arrivals */}
        {popular?.data && popular.data.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600 }}>New arrivals</h2>
              <Link to="/catalog" style={{ color: '#4d9fff', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>
                View all →
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
              {popular.data.map((part) => <PartCard key={part.id} part={part} />)}
            </div>
          </section>
        )}

        {/* Features */}
        <section>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Why PriusParts.ge?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{ background: '#0d1526', border: '1px solid #111e35', borderRadius: 12, padding: 20 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(212,56,13,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <Icon size={18} style={{ color: '#4d9fff' }} />
                </div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6, color: 'white' }}>{title}</div>
                <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}