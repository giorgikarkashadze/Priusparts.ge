import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, Sun, Moon, User, LogOut, Settings, Package } from 'lucide-react'
import { useState } from 'react'
import { useCartStore, useAuthStore, useThemeStore } from '@/store'

export default function Layout() {
  const itemCount = useCartStore((s) => s.itemCount())
  const { user, clearAuth } = useAuthStore()
  const { dark, toggle } = useThemeStore()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/catalog', label: 'Parts' },
    { href: '/about', label: 'About' },
  ]

  const isActive = (href: string) => href === '/' ? location.pathname === '/' : location.pathname.startsWith(href)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: dark ? '#030712' : '#f9fafb', color: dark ? '#f9fafb' : '#0d1526' }}>

      {/* Promo banner */}
      <div style={{ background: '#1d6fe8', color: '#fff', textAlign: 'center', fontSize: 12, padding: '6px 16px', fontWeight: 500 }}>
        🚗 Genuine & aftermarket parts for Toyota Prius 2008–2024 — Fast delivery across Georgia
      </div>

      {/* Navbar */}
      <nav style={{ background: '#0a0f1e', borderBottom: '1px solid #1a2744', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 2000, margin: '0 auto', padding: '0 16px', height: 56, display: 'flex', alignItems: 'center', gap: 8 }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', marginRight: 16, flexShrink: 0 }}>
            <span style={{ fontSize: 30, fontWeight: 700, color: '#f9fafb', letterSpacing: '-0.5px' }}>
              Prius<span style={{ color: '#4d9fff' }}>Parts</span>
              <span style={{ color: '#6b7280', fontSize: 13, fontWeight: 400 }}>.ge</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div style={{ display: 'flex', gap: 4, flex: 1 }}>
            {navLinks.map((l) => (
              <Link key={l.href} to={l.href} style={{
                textDecoration: 'none', padding: '6px 12px', borderRadius: 8, fontSize: 14,
                background: isActive(l.href) ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: isActive(l.href) ? '#fff' : '#94a3b8',
                transition: 'all 0.15s'
              }}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>

            {/* Theme toggle */}
            <button onClick={toggle} style={{
              background: 'rgba(255,255,255,0.08)', border: 'none', color: '#94a3b8',
              width: 36, height: 36, borderRadius: 8, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Cart */}
            <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.08)', color: '#94a3b8', textDecoration: 'none' }}>
              <ShoppingCart size={16} />
              {itemCount > 0 && (
                <span style={{
                  position: 'absolute', top: -4, right: -4, background: '#1d6fe8',
                  color: '#fff', fontSize: 10, width: 16, height: 16, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600
                }}>
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div style={{ position: 'relative' }}>
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px',
                  borderRadius: 8, background: 'rgba(255,255,255,0.08)', border: 'none',
                  color: '#f9fafb', cursor: 'pointer', fontSize: 13
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%', background: '#1d6fe8',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 600, color: '#fff'
                  }}>
                    {user.name[0].toUpperCase()}
                  </div>
                  <span>{user.name}</span>
                </button>
                {userMenuOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: '100%', marginTop: 4, width: 180,
                    background: '#1a2744', border: '1px solid #334155', borderRadius: 12,
                    padding: 4, zIndex: 50, boxShadow: '0 16px 48px rgba(0,0,0,0.4)'
                  }}>
                    <Link to="/orders" onClick={() => setUserMenuOpen(false)} style={{
                      display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
                      borderRadius: 8, color: '#94a3b8', textDecoration: 'none', fontSize: 13
                    }}>
                      <Package size={13} /> My orders
                    </Link>
                    {user.role === 'ADMIN' && (
                      <Link to="/admin" onClick={() => setUserMenuOpen(false)} style={{
                        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
                        borderRadius: 8, color: '#4d9fff', textDecoration: 'none', fontSize: 13
                      }}>
                        <Settings size={13} /> Admin panel
                      </Link>
                    )}
                    <button onClick={() => {
                      clearAuth()
                      useCartStore.getState().clearCart()
                      setUserMenuOpen(false)
                      navigate('/')
                    }} style={{
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
              <Link to="/login" style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
                borderRadius: 8, background: 'rgba(255,255,255,0.08)', color: '#94a3b8',
                textDecoration: 'none', fontSize: 13
              }}>
                <User size={13} /> Sign in
              </Link>
            )}

            {/* Mobile menu button */}
            
          </div>
        </div>
        {/* Mobile nav */}
      </nav>

      {/* Page content */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{ background: '#0a0f1e', borderTop: '1px solid #1a2744', padding: '40px 16px 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#f9fafb', marginBottom: 8 }}>
              Prius<span style={{ color: '#4d9fff' }}>Parts</span><span style={{ color: '#475569', fontSize: 13 }}>.ge</span>
            </div>
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7 }}>
              Genuine & aftermarket parts for Toyota Prius 2008–2024. Trusted by Prius owners across Georgia.
            </p>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 12 }}>Parts</div>
            {['Engine', 'Brakes', 'Suspension', 'Electrical', 'Filters', 'Hybrid Battery'].map(c => (
              <Link key={c} to={`/catalog?category=${c.toLowerCase()}`} style={{ display: 'block', color: '#64748b', textDecoration: 'none', fontSize: 13, marginBottom: 6 }}>
                {c}
              </Link>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 12 }}>Prius Models</div>
            {['Prius Gen 2 (2004–2009)', 'Prius Gen 3 (2010–2015)', 'Prius Gen 4 (2016–2022)', 'Prius Gen 5 (2023+)'].map(m => (
              <div key={m} style={{ color: '#64748b', fontSize: 13, marginBottom: 6 }}>{m}</div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 12 }}>Contact</div>
            <div style={{ color: '#64748b', fontSize: 13, marginBottom: 6 }}>support@priusparts.ge</div>
            <div style={{ color: '#64748b', fontSize: 13, marginBottom: 6 }}>+995 XXX XXX XXX</div>
            <div style={{ color: '#64748b', fontSize: 13 }}>Tbilisi, Georgia</div>
          </div>
        </div>
        <div style={{ maxWidth: 1200, margin: '0 auto', paddingTop: 20, borderTop: '1px solid #1a2744', fontSize: 12, color: '#475569', textAlign: 'center' }}>
          © 2025 PriusParts.ge — All rights reserved
        </div>
      </footer>
    </div>
  )
}