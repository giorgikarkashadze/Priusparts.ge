import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Search, Truck, RotateCcw, Shield, Headphones } from 'lucide-react'
import { useProducts, useCategories } from '@/hooks/useProducts'
import PartCard from '@/components/PartCard'
import { useTranslation } from 'react-i18next'
import { getCategoryName } from '@/hooks/usePartLocale'
import i18n from '@/i18n/i18n'
import { useThemeStore } from '@/store'

// const GENERATIONS = [
//   { label: 'Gen 2', years: '2004–2009', emoji: '🚗', slug: '2004' },
//   { label: 'Gen 3', years: '2010–2015', emoji: '🚗', slug: '2010' },
//   { label: 'Gen 4', years: '2016–2022', emoji: '🚗', slug: '2016' },
//   { label: 'Gen 5', years: '2023+', emoji: '🚗', slug: '2023' },
// ]

export default function HomePage() {
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
      glowTeal: 'rgba(34,211,184,0.06)'
    } : {
      pageBg: '#F0F4FF',
      cardBg: 'rgba(255,255,255,0.9)',
      cardBorder: 'rgba(60,90,200,0.12)',
      text: '#0B1220',
      textMuted: '#4A5A7A',
      accent: '#2952CC',
      gradientHero: 'linear-gradient(135deg, #E8EEFF 0%, #F0F4FF 50%, #E8F6F4 100%)',
      gradientAccent: 'linear-gradient(135deg, #2952CC, #0A8C7A)',
      energyLine: 'linear-gradient(90deg, #2952CC, #0A8C7A, #2952CC, #0A8C7A)',
      gridColor: 'rgba(41,82,204,0.04)',
      glowBlue: 'rgba(41,82,204,0.06)',
      glowTeal: 'rgba(10,140,122,0.05)'
    }


  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const { data: categories } = useCategories()
  const { data: popular } = useProducts({ sort: 'newest', limit: '5' } as any)
  const { t } = useTranslation()

  const FEATURES = [
  { icon: Shield, title: t('home.WhyusSection.first.title'), desc: t('home.WhyusSection.first.desc') },
  { icon: Truck, title: t('home.WhyusSection.second.title'), desc: t('home.WhyusSection.second.desc') },
  { icon: RotateCcw, title: t('home.WhyusSection.third.title'), desc: t('home.WhyusSection.third.desc') },
  { icon: Headphones, title: t('home.WhyusSection.fourth.title'), desc: t('home.WhyusSection.fourth.desc') },
]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) navigate(`/catalog?search=${encodeURIComponent(search)}`)
  }

  return (
    <div style={{ minHeight: '100vh', background: c.pageBg, color: c.text, position: 'relative', overflow: 'hidden' }}>


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
                  from { opacity: 0; transform: translateY(16px); }
                  to { opacity: 1; transform: translateY(0); }
              }
              @keyframes float {
                  0%, 100% { transform: translateY(0px); }
                  50% { transform: translateY(-8px); }
              }
              @keyframes glow-pulse {
                  0%, 100% { opacity: 0.6; }
                  50% { opacity: 1; }
              }
              .about-grid-bg {
                background-image:
                linear-gradient(${c.gridColor} 1px, transparent 1px),
                linear-gradient(90deg, ${c.gridColor} 1px, transparent 1px);
                background-size: 48px 48px;
                animation: grid-drift 20s linear infinite;
              }
              .energy-bar {
                background: ${c.energyLine};
                background-size: 200% 100%;
                animation: energy-flow 4s linear infinite;
              }
              .feature-card {
                background: ${c.cardBg};
                border: 1px solid ${c.cardBorder};
                border-radius: 14px;
                padding: 20px;
                backdrop-filter: blur(12px);
                transition: all 0.2s ease;
                position: relative;
                overflow: hidden;
              }
              .feature-card::before {
                content: '';
                position: absolute;
                top: 0; left: 0; right: 0;
                height: 2px;
                background: ${c.gradientAccent};
                opacity: 0;
                transition: opacity 0.2s;
              }
              .feature-card:hover::before { opacity: 1; }
              .feature-card:hover {
                transform: translateY(-3px);
                border-color: ${dark ? 'rgba(76,124,255,0.3)' : 'rgba(41,82,204,0.3)'};
                box-shadow: 0 12px 32px ${dark ? 'rgba(76,124,255,0.1)' : 'rgba(41,82,204,0.08)'};
              }
              .category-card {
                background: ${c.cardBg};
                border: 1px solid ${c.cardBorder};
                border-radius: 14px;
                padding: 20px;
                backdrop-filter: blur(12px);
                transition: all 0.2s ease;
                position: relative;
                overflow: hidden;
                min-height: 155px;
              }
              .category-card::before {
                content: '';
                position: absolute;
                top: 0; left: 0; right: 0;
                height: 2px;
                background: ${c.gradientAccent};
                opacity: 0;
                transition: opacity 0.2s;
              }
              .category-card:hover::before { opacity: 1; }
              .category-card:hover {
                transform: translateY(-3px);
                border-color: ${dark ? 'rgba(76,124,255,0.3)' : 'rgba(41,82,204,0.3)'};
                box-shadow: 0 12px 32px ${dark ? 'rgba(76,124,255,0.1)' : 'rgba(41,82,204,0.08)'};
              }
              .section-title {
                font-family: 'Space Grotesk', sans-serif;
                font-size: 26px; font-weight: 700;
                color: ${c.text}; letter-spacing: -0.5px;
                margin: 6px 0 20px;
              }
            `}
      </style>

      {/* Background */}
      <div className="about-grid-bg" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', top: '5%', right: '5%', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, ${c.glowBlue}, transparent 70%)`, filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '10%', left: '5%', width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, ${c.glowTeal}, transparent 70%)`, filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1 }}></div>

      {/* Hero */}
      <section style={{ background: c.gradientHero, padding: '72px 16px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', animation: 'fade-up 0.5s ease-out both' }}>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 44, fontWeight: 700, color: c.text, lineHeight: 1.15, letterSpacing: '-1px', marginBottom: 16 }}>
            {t('home.hero.title')}<br />
            <span style={{ background: `${c.gradientAccent} text`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('home.hero.titleHighlight')}</span>
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: c.textMuted, lineHeight: 1.7, marginBottom: 32 }}>
            {t('home.hero.subtitle')}
          </p>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, maxWidth: 480, margin: '0 auto' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('home.hero.searchPlaceholder')}
                style={{
                  width: '100%', paddingLeft: 44, paddingRight: 16, paddingTop: 12, paddingBottom: 12,
                  borderRadius: 10, background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.9)', border: dark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(41,82,204,0.2)',
                  color: dark ? '#f9fafb' : '#0B1220', fontSize: 14, outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>
            <button type="submit" style={{
              background: c.gradientAccent, color: '#fff', border: 'none', padding: '12px 24px',
              borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap'
            }}>
              {t('home.hero.searchBtn')}
            </button>
          </form>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: c.gradientAccent, borderBottom: '1px solid #334155' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, textAlign: 'center', animation: 'fade-up 0.5s ease-out both' }}>
          {[
            ['5,000+', t('home.stats.parts')],
            ['2008–2024', t('home.stats.brands')],
            ['1–3 ' + t('home.stats.days'), t('home.stats.delivery')],
            ['4.9★', t('home.stats.rating')],
          ].map(([val, lbl]) => (
            <div key={lbl}>
              <div style={{ fontSize: 20, fontWeight: 700, color: dark ? '#18385f' : '#ebeffa' }}>{val}</div>
              <div style={{ fontSize: 12, color: dark ? '#484849' : '#abaeb4', marginTop: 2 }}>{lbl}</div>
            </div>
          ))}
        </div>
        <div className="energy-bar" style={{ position: 'relative', bottom: 0, left: 0, right: 0, height: 2 }} />
      </section>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 16px' }}>

        {/* Shop by generation */}
        {/* <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>{t('home.sections.byGeneration')}</h2>
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
                    {t('home.GenerationsSection.BrowseParts')} <ChevronRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section> */}

        {/* Categories */}
        {Array.isArray(categories) && categories.length > 0 && (
          <section style={{ marginBottom: 48, animation: 'fade-up 0.5s ease-out both' }}>
            <h2 className='section-title'>{t('home.sections.byCategory')}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
              {categories.map((d) => (
                <Link key={d.id} to={`/catalog?category=${d.slug}`} style={{ textDecoration: 'none' }}>
                  <div className='category-card'
                  >
                    <div style={{ fontSize: 28, marginBottom: 6 }}>{d.icon}</div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600, color: c.text, marginTop: 13, height: '52px' }}>{getCategoryName(d, i18n.language)}</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: c.textMuted, lineHeight: 1.6 }}>{d._count?.parts} {t('home.parts')}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Promo banner */}
        {/* <section style={{ marginBottom: 48, animation: 'fade-up 0.5s ease-out both' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(212,56,13,0.15), rgba(255,107,53,0.1))',
            border: '1px solid rgba(212,56,13,0.3)', borderRadius: 16, padding: '24px',
            display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap'
          }}>
            <div style={{ fontSize: 40 }}>🏷️</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: '#4d9fff', fontSize: 16 }}>{t('home.promo.title')}</div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{t('home.promo.subtitle')} <strong style={{ color: '#f9fafb' }}>SUMMER30</strong> {t('home.promo.at')}</div>
            </div>
            <Link to="/catalog?category=brakes" style={{
              background: '#1d6fe8', color: '#fff', textDecoration: 'none',
              padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap'
            }}>
              {t('home.promo.btn')}
            </Link>
          </div>
        </section> */}

        {/* New arrivals */}
        {popular?.data && popular.data.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 className='section-title'>{t('home.sections.newArrivals')}</h2>
              <Link to="/catalog" style={{ color: '#4d9fff', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>
                {t('home.sections.viewAll')}
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
              {popular.data.map((part) => <PartCard key={part.id} part={part} />)}
            </div>
          </section>
        )}

        {/* Features */}
        <section>
          <h2 className='section-title'> {t('home.sections.whyUs')} </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="feature-card">
                <div style={{ width: 40, height: 40, borderRadius: 12, background: dark ? 'rgba(76,124,255,0.12)' : 'rgba(41,82,204,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <Icon size={18} style={{ color: c.accent }} />
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: c.text, marginBottom: 8 }}>{title}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: c.textMuted, lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}