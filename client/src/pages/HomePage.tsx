import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Search, Truck, RotateCcw, Shield, Headphones } from 'lucide-react'
import { useProducts, useCategories } from '@/hooks/useProducts'
import PartCard from '@/components/PartCard'

const FEATURES = [
  { icon: Truck, title: 'Fast shipping', desc: '2–5 day delivery nationwide. Same-day dispatch on orders before 2pm.' },
  { icon: RotateCcw, title: 'Easy returns', desc: '30-day returns on all parts. No-hassle refund or exchange.' },
  { icon: Shield, title: 'OEM quality', desc: 'Genuine manufacturer parts and quality aftermarket alternatives.' },
  { icon: Headphones, title: 'Expert support', desc: 'Mechanics on call to help you find the right part.' },
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
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Find parts for <span className="text-brand-light">any vehicle</span>
          </h1>
          <p className="text-gray-400 text-lg mb-8">Over 50,000 genuine & aftermarket parts with fast delivery</p>
          <form onSubmit={handleSearch} className="flex gap-3 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by part name or OEM number..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:border-brand-light text-sm"
              />
            </div>
            <button type="submit" className="btn-primary px-6 py-3 text-base rounded-xl">Search</button>
          </form>
        </div>
      </section>

      {/* Stats */}
      <div className="bg-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-4 py-4 grid grid-cols-4 gap-4 text-center">
          {[['50K+', 'Parts in stock'], ['120+', 'Car brands'], ['2–5', 'Day delivery'], ['4.8★', 'Rating']].map(([val, lbl]) => (
            <div key={lbl}>
              <div className="text-xl font-semibold text-brand-light">{val}</div>
              <div className="text-xs text-gray-400 mt-0.5">{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
        {/* Categories */}
        {categories && (
          <section>
            <h2 className="text-lg font-semibold mb-4">Shop by category</h2>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {categories.map((c) => (
                <Link key={c.id} to={`/catalog?category=${c.slug}`}
                  className="card p-4 text-center hover:border-brand/40 hover:-translate-y-1 transition-all">
                  <div className="text-3xl mb-2">{c.icon}</div>
                  <div className="text-sm font-medium">{c.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{c._count?.parts} parts</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Promo banner */}
        <section className="bg-gradient-to-r from-brand/10 to-orange-500/10 border border-brand/20 rounded-2xl p-6 flex items-center gap-4">
          <div className="text-4xl">🏷️</div>
          <div className="flex-1">
            <div className="font-semibold text-brand">Summer Sale — up to 30% off brake parts</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Use code <strong>SUMMER30</strong> at checkout. Ends August 31.</div>
          </div>
          <Link to="/catalog?category=brakes" className="btn-primary shrink-0">Shop now</Link>
        </section>

        {/* Popular parts */}
        {popular?.data && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">New arrivals</h2>
              <Link to="/catalog" className="text-sm text-brand hover:underline">View all</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {popular.data.map((part) => <PartCard key={part.id} part={part} />)}
            </div>
          </section>
        )}

        {/* Features */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Why AutoParts Pro?</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-4">
                <Icon size={20} className="text-brand mb-2" />
                <h3 className="font-medium text-sm mb-1">{title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
