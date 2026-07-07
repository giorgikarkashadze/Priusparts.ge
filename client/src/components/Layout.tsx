import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, Sun, Moon, Menu, X, User, LogOut, Settings, Package } from 'lucide-react'
import { useState } from 'react'
import { useCartStore, useAuthStore, useThemeStore } from '@/store'
import { cn } from '@/lib/utils'

export default function Layout() {
  const itemCount = useCartStore((s) => s.itemCount())
  const { user, clearAuth } = useAuthStore()
  const { dark, toggle } = useThemeStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/catalog', label: 'Catalog' },
    { href: '/about', label: 'About' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Promo banner */}
      <div className="bg-brand text-white text-center text-xs py-1.5 font-medium">
        🏷️ Summer Sale — Use code <strong>SUMMER30</strong> for 30% off brake parts
      </div>

      <nav className="bg-gray-900 dark:bg-black text-white sticky top-0 z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="text-lg font-semibold tracking-tight shrink-0">
            AUTO<span className="text-brand-light">PARTS</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1 flex-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className={cn('px-3 py-1.5 rounded-lg text-sm transition-colors',
                  location.pathname === l.href
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Theme toggle */}
            <button onClick={toggle} className="p-2 rounded-lg hover:bg-white/10 transition-colors" aria-label="Toggle theme">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 rounded-lg hover:bg-white/10 transition-colors">
              <ShoppingCart size={18} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* User menu */}
            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 text-sm transition-colors">
                  <div className="w-6 h-6 rounded-full bg-brand flex items-center justify-center text-xs font-medium">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="hidden md:block">{user.name}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl py-1 z-50">
                    <Link to="/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/10 text-gray-300">
                      <Package size={14} /> My orders
                    </Link>
                    {user.role === 'ADMIN' && (
                      <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/10 text-brand-light">
                        <Settings size={14} /> Admin panel
                      </Link>
                    )}
                    <button onClick={() => { clearAuth(); setUserMenuOpen(false); navigate('/') }} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/10 text-red-400 w-full text-left">
                      <LogOut size={14} /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-white/10 hover:bg-white/20 transition-colors">
                <User size={14} /> Sign in
              </Link>
            )}

            {/* Mobile menu */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-white/10">
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-800 px-4 py-2 space-y-1">
            {navLinks.map((l) => (
              <Link key={l.href} to={l.href} onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10">
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-gray-900 text-gray-400 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="text-white font-semibold mb-2">AUTO<span className="text-brand-light">PARTS</span> Pro</div>
            <p className="text-xs leading-relaxed">Genuine & aftermarket parts with fast delivery. Trusted by mechanics since 2010.</p>
          </div>
          <div>
            <div className="text-gray-300 font-medium mb-2">Shop</div>
            <div className="space-y-1">
              {['Engine', 'Brakes', 'Suspension', 'Electrical', 'Filters'].map(c => (
                <Link key={c} to={`/catalog?category=${c.toLowerCase()}`} className="block hover:text-white transition-colors text-xs">{c}</Link>
              ))}
            </div>
          </div>
          <div>
            <div className="text-gray-300 font-medium mb-2">Support</div>
            <div className="space-y-1 text-xs">
              <p>support@autoparts.pro</p>
              <p>+1 800-AUTOPARTS</p>
              <p>Mon–Fri 8am–6pm EST</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-6 pt-4 border-t border-gray-800 text-xs text-gray-600">
          © 2025 AutoParts Pro. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
