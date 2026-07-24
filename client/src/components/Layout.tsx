import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, Sun, Moon, User, LogOut, Settings, Package, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useCartStore, useAuthStore, useThemeStore } from '@/store'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useTranslation } from 'react-i18next'


export default function Layout() {
  const itemCount = useCartStore((s) => s.itemCount())
  const { user, clearAuth } = useAuthStore()
  const { dark, toggle } = useThemeStore()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/catalog', label: t('nav.parts') },
    { href: '/about', label: t('nav.about') },
  ]

  const isActive = (href: string) => href === '/' ? location.pathname === '/' : location.pathname.startsWith(href)

  // Theme-aware token set — same HUD language as the login page, tuned for light/dark
  const c = dark
    ? {
        bg: '#05070C',
        surface: 'rgba(13,18,30,0.72)',
        surfaceSolid: '#0a0f1e',
        border: 'rgba(124,138,165,0.15)',
        borderStrong: '#1a2744',
        text: '#EAF2FF',
        textMuted: '#7C8AA5',
        textFaint: '#4A5670',
        teal: '#22D3B8',
        blue: '#4C7CFF',
        coral: '#FF6B57',
        chip: 'rgba(255,255,255,0.06)',
      }
    : {
        bg: '#F4F7FC',
        surface: 'rgba(255,255,255,0.78)',
        surfaceSolid: '#0a0f1e',
        border: 'rgba(60,90,160,0.15)',
        borderStrong: '#1a2744',
        text: '#0B1220',
        textMuted: '#5B6B85',
        textFaint: '#94A3B8',
        teal: '#0C9C88',
        blue: '#3357CC',
        coral: '#D9432B',
        chip: 'rgba(15,25,50,0.05)',
      }

  const closeMenus = () => { setUserMenuOpen(false); setMobileMenuOpen(false) }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: c.bg, color: c.text, transition: 'background 0.3s ease, color 0.3s ease' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        @keyframes energy-flow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes badge-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(29,111,232,0.5); }
          50% { transform: scale(1.12); box-shadow: 0 0 0 4px rgba(29,111,232,0); }
        }
        @keyframes panel-in {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes grid-drift {
          from { background-position: 0 0; }
          to { background-position: 48px 48px; }
        }
        .plp-energy-line {
          background: linear-gradient(90deg, #4C7CFF, #22D3B8, #4C7CFF, #22D3B8);
          background-size: 200% 100%;
          animation: energy-flow 4s linear infinite;
        }
        .plp-navlink { position: relative; transition: color 0.2s ease, background 0.2s ease; }
        .plp-navlink::after {
          content: '';
          position: absolute;
          left: 12px; right: 12px; bottom: 3px;
          height: 2px;
          background: linear-gradient(90deg, #4C7CFF, #22D3B8);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s ease;
          border-radius: 2px;
        }
        .plp-navlink:hover::after, .plp-navlink.active::after { transform: scaleX(1); }
        .plp-icon-btn { transition: transform 0.15s ease, background 0.2s ease, border-color 0.2s ease; }
        .plp-icon-btn:hover { transform: translateY(-1px); }
        .plp-icon-btn:active { transform: translateY(0) scale(0.96); }
        .plp-cart-badge.has-items { animation: badge-pulse 2.2s ease-in-out infinite; }
        .plp-panel-in { animation: panel-in 0.18s ease-out both; }
        .plp-footer-grid {
          background-image:
            linear-gradient(rgba(76,124,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(76,124,255,0.06) 1px, transparent 1px);
          background-size: 48px 48px;
          animation: grid-drift 16s linear infinite;
        }
        .plp-footer-link { position: relative; transition: color 0.2s ease, transform 0.2s ease; display: inline-block; }
        .plp-footer-link:hover { transform: translateX(3px); }
        .plp-desktop-nav { display: flex; }
        .plp-mobile-toggle { display: none; }
        .plp-mobile-panel { display: none; }
        @media (max-width: 860px) {
          .plp-desktop-nav { display: none; }
          .plp-mobile-toggle { display: flex; }
          .plp-mobile-panel.open { display: block; }
        }
        @media (prefers-reduced-motion: reduce) {
          .plp-energy-line, .plp-cart-badge.has-items, .plp-panel-in, .plp-footer-grid { animation: none; }
        }
      `}</style>

      {/* Navbar */}
      <nav style={{ background: c.surfaceSolid, position: 'sticky', top: 0, zIndex: 100, borderBottom: `1px solid ${c.borderStrong}` }}>
        <div style={{ maxWidth: '100%', margin: '0 auto', padding: '0 16px', height: 56, display: 'flex', alignItems: 'center', gap: 8 }}>

          {/* Logo */}
          <Link to="/" onClick={closeMenus} style={{ textDecoration: 'none', marginRight: 16, flexShrink: 0 }}>
            <span style={{ fontSize: 26, fontWeight: 700, color: '#f9fafb', letterSpacing: '-0.5px', fontFamily: "'Space Grotesk', sans-serif" }}>
              Prius<span style={{ color: '#4d9fff' }}>Parts</span>
              <span style={{ color: '#6b7280', fontSize: 12, fontWeight: 400, fontFamily: "'JetBrains Mono', monospace" }}>.ge</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="plp-desktop-nav" style={{ gap: 4, flex: 1 }}>
            {navLinks.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className={`plp-navlink${isActive(l.href) ? ' active' : ''}`}
                style={{
                  textDecoration: 'none', padding: '6px 12px', borderRadius: 8, fontSize: 14,
                  background: isActive(l.href) ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: isActive(l.href) ? '#fff' : '#94a3b8',
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>

            <LanguageSwitcher />

            {/* Theme toggle */}
            <button onClick={toggle} className="plp-icon-btn" style={{
              background: 'rgba(255,255,255,0.08)', border: 'none', color: '#94a3b8',
              width: 36, height: 36, borderRadius: 8, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transform: `rotate(${dark ? 0 : 180}deg)`,
            }}>
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Cart */}
            <Link to="/cart" onClick={closeMenus} className="plp-icon-btn" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.08)', color: '#94a3b8', textDecoration: 'none' }}>
              <ShoppingCart size={16} />
              {itemCount > 0 && (
                <span className={`plp-cart-badge${itemCount > 0 ? ' has-items' : ''}`} style={{
                  position: 'absolute', top: -4, right: -4, background: '#1d6fe8',
                  color: '#fff', fontSize: 10, width: 16, height: 16, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600
                }}>
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* User — desktop */}
            <div className="plp-desktop-nav" style={{ position: 'relative' }}>
              {user ? (
                <div style={{ position: 'relative' }}>
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="plp-icon-btn" style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px',
                    borderRadius: 8, background: 'rgba(255,255,255,0.08)', border: 'none',
                    color: '#f9fafb', cursor: 'pointer', fontSize: 13
                  }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #4C7CFF, #22D3B8)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 600, color: '#04121A'
                    }}>
                      {user.name[0].toUpperCase()}
                    </div>
                    <span>{user.name}</span>
                  </button>
                  {userMenuOpen && (
                    <div className="plp-panel-in" style={{
                      position: 'absolute', right: 0, top: '100%', marginTop: 4, width: 190,
                      background: '#1a2744', border: '1px solid #334155', borderRadius: 12,
                      padding: 4, zIndex: 50, boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
                      backdropFilter: 'blur(12px)',
                    }}>
                      <Link to="/orders" onClick={closeMenus} className="plp-footer-link" style={{
                        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
                        borderRadius: 8, color: '#94a3b8', textDecoration: 'none', fontSize: 13
                      }}>
                        <Package size={13} /> My orders
                      </Link>
                      {user.role === 'ADMIN' && (
                        <Link to="/admin" onClick={closeMenus} className="plp-footer-link" style={{
                          display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
                          borderRadius: 8, color: '#4d9fff', textDecoration: 'none', fontSize: 13
                        }}>
                          <Settings size={13} /> Admin panel
                        </Link>
                      )}
                      <button onClick={() => {
                        clearAuth()
                        useCartStore.getState().clearCart()
                        closeMenus()
                        navigate('/')
                      }} className="plp-footer-link" style={{
                        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
                        borderRadius: 8, color: '#f87171', background: 'none', border: 'none',
                        cursor: 'pointer', fontSize: 13, width: '100%', textAlign: 'left'
                      }}>
                        <LogOut size={13} /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" onClick={closeMenus} className="plp-icon-btn" style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
                  borderRadius: 8, background: 'rgba(255,255,255,0.08)', color: '#94a3b8',
                  textDecoration: 'none', fontSize: 13
                }}>
                  <User size={13} /> {t('nav.signIn')}
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="plp-icon-btn plp-mobile-toggle"
              style={{
                background: 'rgba(255,255,255,0.08)', border: 'none', color: '#f9fafb',
                width: 36, height: 36, borderRadius: 8, cursor: 'pointer',
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              {mobileMenuOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>

        {/* HUD energy line */}
        <div className="plp-energy-line" style={{ height: 2, width: '100%' }} />

        {/* Mobile nav */}
        <div className={`plp-mobile-panel${mobileMenuOpen ? ' open' : ''}`} style={{
          background: '#0a0f1e', borderBottom: '1px solid #1a2744', padding: '8px 16px 16px',
        }}>
          <div className="plp-panel-in" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {navLinks.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                onClick={closeMenus}
                className={`plp-navlink${isActive(l.href) ? ' active' : ''}`}
                style={{
                  textDecoration: 'none', padding: '10px 12px', borderRadius: 8, fontSize: 15,
                  background: isActive(l.href) ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: isActive(l.href) ? '#fff' : '#94a3b8',
                }}
              >
                {l.label}
              </Link>
            ))}

            <div style={{ height: 1, background: '#1a2744', margin: '8px 0' }} />

            {user ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', fontSize: 13, color: '#f9fafb' }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4C7CFF, #22D3B8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 600, color: '#04121A'
                  }}>
                    {user.name[0].toUpperCase()}
                  </div>
                  {user.name}
                </div>
                <Link to="/orders" onClick={closeMenus} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
                  borderRadius: 8, color: '#94a3b8', textDecoration: 'none', fontSize: 14
                }}>
                  <Package size={14} /> My orders
                </Link>
                {user.role === 'ADMIN' && (
                  <Link to="/admin" onClick={closeMenus} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
                    borderRadius: 8, color: '#4d9fff', textDecoration: 'none', fontSize: 14
                  }}>
                    <Settings size={14} /> Admin panel
                  </Link>
                )}
                <button onClick={() => {
                  clearAuth()
                  useCartStore.getState().clearCart()
                  closeMenus()
                  navigate('/')
                }} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
                  borderRadius: 8, color: '#f87171', background: 'none', border: 'none',
                  cursor: 'pointer', fontSize: 14, textAlign: 'left'
                }}>
                  <LogOut size={14} /> Sign out
                </button>
              </>
            ) : (
              <Link to="/login" onClick={closeMenus} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
                borderRadius: 8, color: '#f9fafb',
                background: 'linear-gradient(135deg, rgba(76,124,255,0.25), rgba(34,211,184,0.25))',
                border: '1px solid rgba(34,211,184,0.35)',
                textDecoration: 'none', fontSize: 14
              }}>
                <User size={14} /> Sign in
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{ position: 'relative', overflow: 'hidden', background: c.surfaceSolid, padding: '44px 16px 20px' }}>
        <div className="plp-energy-line" style={{ height: 2, width: '100%', position: 'absolute', top: 0, left: 0 }} />
        <div className="plp-footer-grid" style={{ position: 'absolute', inset: 0, opacity: 0.5, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: '10%', width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,184,0.10), transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#f9fafb', marginBottom: 8, fontFamily: "'Space Grotesk', sans-serif" }}>
              Prius<span style={{ color: '#4d9fff' }}>Parts</span><span style={{ color: '#475569', fontSize: 13 }}>.ge</span>
            </div>
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7 }}>
              Genuine & aftermarket parts for Toyota Prius 2008–2024. Trusted by Prius owners across Georgia.
            </p>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#22D3B8', marginBottom: 12, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase' }}>Parts</div>
            {['Engine', 'Brakes', 'Suspension', 'Electrical', 'Filters', 'Hybrid Battery'].map(cat => (
              <Link key={cat} to={`/catalog?category=${cat.toLowerCase()}`} className="plp-footer-link" style={{ color: '#64748b', textDecoration: 'none', fontSize: 13, marginBottom: 6 }}>
                {cat}
              </Link>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#22D3B8', marginBottom: 12, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase' }}>Prius Models</div>
            {['Prius Gen 2 (2004–2009)', 'Prius Gen 3 (2010–2015)', 'Prius Gen 4 (2016–2022)', 'Prius Gen 5 (2023+)'].map(m => (
              <div key={m} style={{ color: '#64748b', fontSize: 13, marginBottom: 6 }}>{m}</div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#22D3B8', marginBottom: 12, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase' }}>Contact</div>
            <div style={{ color: '#64748b', fontSize: 13, marginBottom: 6, fontFamily: "'JetBrains Mono', monospace" }}>support@priusparts.ge</div>
            <div style={{ color: '#64748b', fontSize: 13, marginBottom: 6, fontFamily: "'JetBrains Mono', monospace" }}>+995 XXX XXX XXX</div>
            <div style={{ color: '#64748b', fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>Tbilisi, Georgia</div>
          </div>
        </div>
        <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', paddingTop: 20, borderTop: '1px solid #1a2744', fontSize: 12, color: '#475569', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace" }}>
          © 2025 PriusParts.ge — All rights reserved
        </div>
      </footer>
    </div>
  )
}