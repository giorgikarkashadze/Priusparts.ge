import { Link } from 'react-router-dom'
import { Shield, Truck, RotateCcw, Headphones, MapPin, Mail, Phone, Zap, Award, Users, Package } from 'lucide-react'
import { useThemeStore } from '@/store'
import { useTranslation } from 'react-i18next'


// const REVIEWS = [
//   { text: 'Ordered brake pads on Monday, arrived Wednesday. Fit perfectly on my Gen 4 Prius. Will definitely order again.', author: 'Alex M.', rating: 5 },
//   { text: 'Called support to check compatibility for my 2015 model — the mechanic knew exactly what I needed. Outstanding service.', author: 'Nina P.', rating: 5 },
// ]

export default function AboutPage() {
  const { dark } = useThemeStore()
  const { t } = useTranslation()

  const FEATURES = [
  { icon: Shield, title: t('home.WhyusSection.first.title'), desc: t('home.WhyusSection.first.desc') },
  { icon: Truck, title: t('home.WhyusSection.second.title'), desc: t('home.WhyusSection.second.desc') },
  { icon: RotateCcw, title: t('home.WhyusSection.third.title'), desc: t('home.WhyusSection.third.desc') },
  { icon: Headphones, title: t('home.WhyusSection.fourth.title'), desc: t('home.WhyusSection.fourth.desc') },
]

const STATS = [
  { value: '5,000+', label: t('about.stock'), icon: Package },
  { value: '2008–2024', label: t('about.oldAndNew'), icon: Zap },
  { value: '15 years', label: t('about.inBusiness'), icon: Award },
  { value: '98%', label: t('about.satRate'), icon: Users },
]

const TEAM = [
  { name: t('about.ceoName'), role: t('about.ceoSubtitle'), emoji: '🧑‍💼', exp: t('about.ceoChip') },
  { name: t('about.devName'), role: t('about.devSubtitle'), emoji: '💻🛠️', exp: t('about.devChip') },
  { name: t('about.testerName'), role: t('about.testerSubtitle'), emoji: '🚀⚙️', exp: t('about.testerChip') },
]

  const c = dark ? {
    pageBg: '#05070C',
    cardBg: 'rgba(13,18,30,0.8)',
    cardBorder: 'rgba(124,138,165,0.12)',
    text: '#EAF2FF',
    textMuted: '#7C8AA5',
    textFaint: '#4A5670',
    accent: '#4C7CFF',
    teal: '#22D3B8',
    coral: '#FF6B57',
    gradientHero: 'linear-gradient(135deg, #05070C 0%, #0a1628 50%, #05070C 100%)',
    gradientAccent: 'linear-gradient(135deg, #4C7CFF, #22D3B8)',
    energyLine: 'linear-gradient(90deg, #4C7CFF, #22D3B8, #4C7CFF, #22D3B8)',
    statBg: 'rgba(76,124,255,0.06)',
    statBorder: 'rgba(76,124,255,0.15)',
    reviewBg: 'rgba(255,255,255,0.02)',
    reviewBorder: 'rgba(124,138,165,0.1)',
    contactBg: 'rgba(76,124,255,0.06)',
    contactBorder: 'rgba(76,124,255,0.15)',
    gridColor: 'rgba(76,124,255,0.04)',
    glowBlue: 'rgba(76,124,255,0.08)',
    glowTeal: 'rgba(34,211,184,0.06)',
    tagBg: 'rgba(34,211,184,0.08)',
    tagBorder: 'rgba(34,211,184,0.2)',
    tagColor: '#22D3B8',
  } : {
    pageBg: '#F0F4FF',
    cardBg: 'rgba(255,255,255,0.9)',
    cardBorder: 'rgba(60,90,200,0.12)',
    text: '#0B1220',
    textMuted: '#4A5A7A',
    textFaint: '#8A9AB8',
    accent: '#2952CC',
    teal: '#0A8C7A',
    coral: '#CC3A28',
    gradientHero: 'linear-gradient(135deg, #E8EEFF 0%, #F0F4FF 50%, #E8F6F4 100%)',
    gradientAccent: 'linear-gradient(135deg, #2952CC, #0A8C7A)',
    energyLine: 'linear-gradient(90deg, #2952CC, #0A8C7A, #2952CC, #0A8C7A)',
    statBg: 'rgba(41,82,204,0.06)',
    statBorder: 'rgba(41,82,204,0.15)',
    reviewBg: 'rgba(255,255,255,0.8)',
    reviewBorder: 'rgba(60,90,200,0.12)',
    contactBg: 'rgba(41,82,204,0.06)',
    contactBorder: 'rgba(41,82,204,0.15)',
    gridColor: 'rgba(41,82,204,0.04)',
    glowBlue: 'rgba(41,82,204,0.06)',
    glowTeal: 'rgba(10,140,122,0.05)',
    tagBg: 'rgba(10,140,122,0.08)',
    tagBorder: 'rgba(10,140,122,0.25)',
    tagColor: '#0A8C7A',
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
        .about-card {
          background: ${c.cardBg};
          border: 1px solid ${c.cardBorder};
          border-radius: 16px;
          backdrop-filter: blur(12px);
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .about-card:hover {
          transform: translateY(-3px);
          border-color: ${dark ? 'rgba(34,211,184,0.3)' : 'rgba(10,140,122,0.3)'};
          box-shadow: 0 12px 32px ${dark ? 'rgba(76,124,255,0.12)' : 'rgba(41,82,204,0.1)'};
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
        .stat-card {
          background: ${c.statBg};
          border: 1px solid ${c.statBorder};
          border-radius: 14px;
          padding: 20px;
          text-align: center;
          transition: all 0.2s ease;
        }
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px ${dark ? 'rgba(76,124,255,0.15)' : 'rgba(41,82,204,0.12)'};
        }
        .team-card {
          background: ${c.cardBg};
          border: 1px solid ${c.cardBorder};
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          backdrop-filter: blur(12px);
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .team-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px ${dark ? 'rgba(76,124,255,0.15)' : 'rgba(41,82,204,0.12)'};
        }
        .contact-card {
          background: ${c.contactBg};
          border: 1px solid ${c.contactBorder};
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.2s ease;
          text-decoration: none;
        }
        .contact-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px ${dark ? 'rgba(76,124,255,0.15)' : 'rgba(41,82,204,0.1)'};
          border-color: ${dark ? 'rgba(34,211,184,0.4)' : 'rgba(10,140,122,0.4)'};
        }
        .review-card {
          background: ${c.reviewBg};
          border: 1px solid ${c.reviewBorder};
          border-radius: 14px;
          padding: 20px;
          backdrop-filter: blur(8px);
          transition: all 0.2s ease;
          position: relative;
        }
        .review-card::before {
          content: '"';
          position: absolute;
          top: -10px; left: 16px;
          font-size: 60px;
          color: ${c.accent};
          opacity: 0.15;
          font-family: Georgia, serif;
          line-height: 1;
        }
        .review-card:hover {
          border-color: ${dark ? 'rgba(76,124,255,0.25)' : 'rgba(41,82,204,0.25)'};
          transform: translateY(-2px);
        }
        .cta-btn {
          background: ${c.gradientAccent};
          color: ${dark ? '#04121A' : '#fff'};
          border: none; padding: 14px 32px; border-radius: 12px;
          font-size: 15px; font-weight: 700; cursor: pointer;
          font-family: 'Space Grotesk', sans-serif;
          text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 20px ${dark ? 'rgba(76,124,255,0.4)' : 'rgba(41,82,204,0.35)'};
        }
        .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px ${dark ? 'rgba(76,124,255,0.5)' : 'rgba(41,82,204,0.45)'};
        }
        .section-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.15em;
          color: ${c.teal};
        }
        .section-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 26px; font-weight: 700;
          color: ${c.text}; letter-spacing: -0.5px;
          margin: 6px 0 4px;
        }
        .float-emoji { animation: float 3s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .energy-bar, .about-grid-bg, .float-emoji { animation: none; }
          .about-card:hover, .feature-card:hover, .stat-card:hover,
          .team-card:hover, .contact-card:hover, .review-card:hover,
          .cta-btn:hover { transform: none; }
        }
      `}</style>

      {/* Background */}
      <div className="about-grid-bg" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', top: '5%', right: '5%', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, ${c.glowBlue}, transparent 70%)`, filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '10%', left: '5%', width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, ${c.glowTeal}, transparent 70%)`, filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Hero */}
        <section style={{ background: c.gradientHero, padding: '72px 16px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div className="energy-bar" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2 }} />

          <div style={{ maxWidth: 640, margin: '0 auto', animation: 'fade-up 0.5s ease-out both' }}>
            {/* Tag */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: c.tagBg, border: `1px solid ${c.tagBorder}`, borderRadius: 20, padding: '6px 14px', marginBottom: 24 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: c.teal, boxShadow: dark ? `0 0 8px ${c.teal}` : 'none', animation: 'glow-pulse 2s ease-in-out infinite' }} />
              <span className="section-label">{t('about.sectionLabel')}</span>
            </div>

            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 44, fontWeight: 700, color: c.text, lineHeight: 1.15, letterSpacing: '-1px', marginBottom: 16 }}>
              <span style={{ background: `${c.gradientAccent} text`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('about.title')}</span>
            </h1>

            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: c.textMuted, lineHeight: 1.7, marginBottom: 32 }}>
              {t('about.subtitle')}
            </p>

            <Link to="/catalog" className="cta-btn">
              {t('about.browseCatalog')} →
            </Link>
          </div>
        </section>

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 16px' }}>

          {/* Stats */}
          <section style={{ marginBottom: 64, animation: 'fade-up 0.5s 0.05s ease-out both' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              {STATS.map(({ value, label, icon: Icon }) => (
                <div key={label} className="stat-card">
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: c.gradientAccent, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <Icon size={18} style={{ color: dark ? '#04121A' : '#fff' }} />
                  </div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: c.accent, marginBottom: 4 }}>{value}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: c.textFaint, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Why us */}
          <section style={{ marginBottom: 64, animation: 'fade-up 0.5s 0.1s ease-out both' }}>
            <div style={{ marginBottom: 28 }}>
              <h2 className="section-title">{t('about.whyUs')}</h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: c.textMuted }}>{t('about.whyUsSubtitle')}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="feature-card">
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: dark ? 'rgba(76,124,255,0.12)' : 'rgba(41,82,204,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                    <Icon size={18} style={{ color: c.accent }} />
                  </div>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: c.text, marginBottom: 8 }}>{title}</h3>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: c.textMuted, lineHeight: 1.6 }}>{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Team */}
          <section style={{ marginBottom: 64, animation: 'fade-up 0.5s 0.15s ease-out both' }}>
            <div style={{ marginBottom: 28 }}>
              <h2 className="section-title">{t('about.team')}</h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: c.textMuted }}>{t('about.teamSubtitle')}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              {TEAM.map(({ name, role, emoji, exp }) => (
                <div key={name} className="team-card">
                  {/* Top energy line */}
                  <div className="energy-bar" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2 }} />

                  <div className="float-emoji" style={{ fontSize: 52, marginBottom: 14 }}>{emoji}</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, color: c.text, marginBottom: 4 }}>{name}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: c.textMuted, marginBottom: 10 }}>{role}</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: c.tagBg, border: `1px solid ${c.tagBorder}`, borderRadius: 20, padding: '3px 10px' }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: c.teal }} />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: c.tagColor }}>{exp}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Reviews */}
          {/* <section style={{ marginBottom: 64, animation: 'fade-up 0.5s 0.2s ease-out both' }}>
            <div style={{ marginBottom: 28 }}>
              <span className="section-label">// CUSTOMER REVIEWS</span>
              <h2 className="section-title">What our customers say</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <div style={{ display: 'flex', gap: 2 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} style={{ fill: '#F59E0B', color: '#F59E0B' }} />
                  ))}
                </div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: c.textFaint }}>4.9 / 5 from 1,200+ reviews</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              {REVIEWS.map(({ text, author, rating }) => (
                <div key={author} className="review-card">
                  <div style={{ display: 'flex', gap: 2, marginBottom: 12 }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} style={{ fill: i < rating ? '#F59E0B' : 'none', color: i < rating ? '#F59E0B' : c.textFaint }} />
                    ))}
                  </div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: c.textMuted, lineHeight: 1.7, marginBottom: 16, fontStyle: 'italic' }}>"{text}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: c.gradientAccent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 700, color: dark ? '#04121A' : '#fff' }}>
                      {author[0]}
                    </div>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: c.text }}>{author}</span>
                  </div>
                </div>
              ))}
            </div>
          </section> */}

          {/* Contact */}
          <section style={{ marginBottom: 64, animation: 'fade-up 0.5s 0.25s ease-out both' }}>
            <div style={{ marginBottom: 28 }}>
              <h2 className="section-title">{t('about.contact')}</h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: c.textMuted }}>{t('about.available')}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
              {[
                { icon: Mail, label: t('about.email'), value: 'support@priusparts.ge', href: 'mailto:support@priusparts.ge' },
                { icon: Phone, label: t('about.phone'), value: '+995 XXX XXX XXX', href: 'tel:+995000000000' },
                { icon: MapPin, label: t('about.visitUs'), value: 'Tbilisi, Georgia', href: '#' },
              ].map(({ icon: Icon, label, value, href }) => (
                <a key={label} href={href} className="contact-card">
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: c.gradientAccent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} style={{ color: dark ? '#04121A' : '#fff' }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: c.textFaint, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>{label}</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500, color: c.text }}>{value}</div>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* CTA */}
          {/* <section style={{ animation: 'fade-up 0.5s 0.3s ease-out both' }}>
            <div style={{
              background: dark
                ? 'linear-gradient(135deg, rgba(76,124,255,0.12), rgba(34,211,184,0.08))'
                : 'linear-gradient(135deg, rgba(41,82,204,0.08), rgba(10,140,122,0.06))',
              border: `1px solid ${dark ? 'rgba(76,124,255,0.2)' : 'rgba(41,82,204,0.15)'}`,
              borderRadius: 20, padding: '40px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden'
            }}>
              <div className="energy-bar" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2 }} />
              <div className="energy-bar" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2 }} />

              <span className="section-label">// START SHOPPING</span>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 700, color: c.text, letterSpacing: '-0.5px', margin: '10px 0 12px' }}>
                Ready to find your part?
              </h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: c.textMuted, marginBottom: 28, maxWidth: 420, margin: '0 auto 28px' }}>
                Browse our catalog of 5,000+ genuine and aftermarket parts for Toyota Prius 2008–2024.
              </p>
              <Link to="/catalog" className="cta-btn">
                <Zap size={16} /> Browse catalog
              </Link>
            </div>
          </section> */}

        </div>
      </div>
    </div>
  )
}