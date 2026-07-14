import { Link } from 'react-router-dom'
import { Truck, RotateCcw, Shield, Headphones, Star, MapPin, Mail, Phone } from 'lucide-react'

const FEATURES = [
  { icon: Shield, title: 'OEM & aftermarket parts', desc: 'We stock genuine manufacturer parts alongside quality aftermarket alternatives for over 120 car brands.' },
  { icon: Truck, title: 'Fast nationwide shipping', desc: '2–5 day delivery on all orders. Same-day dispatch on orders placed before 2pm on weekdays.' },
  { icon: RotateCcw, title: '30-day easy returns', desc: 'Not satisfied? Return any unused part within 30 days for a full refund or exchange — no questions asked.' },
  { icon: Headphones, title: 'Expert mechanic support', desc: 'Our team of certified mechanics is available to help you identify the right part for your specific vehicle.' },
]

const STATS = [
  { value: '50,000+', label: 'Parts in stock' },
  { value: '120+', label: 'Car brands covered' },
  { value: '15 years', label: 'In business' },
  { value: '98%', label: 'Customer satisfaction' },
]

const TEAM = [
  { name: 'Giga Arabidze', role: 'Founder & Head Mechanic', emoji: '🧑🏻‍💼' },
  { name: 'Giorgi Karkashadze', role: 'Developer', emoji: '🛠️💻' },
]

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-14">
      {/* Hero */}
      <section className="text-center">
        <h1 className="text-3xl font-semibold mb-3">About PriusParts</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
          Founded in 2010 by Marcus Reid, a master mechanic with 20 years of experience, PriusParts was built to
          give everyday drivers and professional workshops access to quality parts at fair prices — with the expert
          knowledge to back it up.
        </p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map(({ value, label }) => (
          <div key={label} className="card p-5 text-center">
            <div className="text-2xl font-semibold text-brand mb-1">{value}</div>
            <div className="text-sm text-gray-500">{label}</div>
          </div>
        ))}
      </section>

      {/* Features */}
      <section>
        <h2 className="text-xl font-semibold mb-5">Why choose us</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-5 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
                <Icon size={18} className="text-brand" />
              </div>
              <div>
                <h3 className="font-medium mb-1">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section>
        <h2 className="text-xl font-semibold mb-5">Our team</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {TEAM.map(({ name, role, emoji }) => (
            <div key={name} className="card p-6 text-center">
              <div className="text-5xl mb-3">{emoji}</div>
              <div className="font-medium">{name}</div>
              <div className="text-sm text-gray-500 mt-1">{role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews highlight */}
      <section className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} className="fill-amber-400 text-amber-400" />)}
          </div>
          <span className="font-semibold">4.8 / 5</span>
          <span className="text-sm text-gray-500">from 3,200+ reviews</span>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { text: 'Ordered brake pads on Monday, arrived Wednesday. Fit perfectly on my BMW 3 Series. Will order again.', author: 'Alex M.' },
            { text: 'Called support to check compatibility — the mechanic knew exactly what I needed. Outstanding service.', author: 'Nina P.' },
          ].map(({ text, author }) => (
            <div key={author} className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 italic leading-relaxed">"{text}"</p>
              <div className="text-xs font-medium mt-2 text-gray-500">— {author}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section>
        <h2 className="text-xl font-semibold mb-5">Get in touch</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Mail, label: 'Email us', value: 'support@priusparts.pro', href: 'mailto:support@priusparts.pro' },
            { icon: Phone, label: 'Call us', value: '+1 800-PriusParts', href: 'tel:+18002886278' },
            { icon: MapPin, label: 'Visit us', value: '142 Garage Blvd, Detroit MI', href: '#' },
          ].map(({ icon: Icon, label, value, href }) => (
            <a key={label} href={href} className="card p-5 flex gap-3 items-start hover:border-brand/40 transition-colors group">
              <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
                <Icon size={16} className="text-brand" />
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-0.5">{label}</div>
                <div className="text-sm font-medium group-hover:text-brand transition-colors">{value}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-6">
        <h2 className="text-xl font-semibold mb-2">Ready to find your part?</h2>
        <p className="text-gray-500 text-sm mb-5">Browse our catalog of 50,000+ parts for any make and model.</p>
        <Link to="/catalog" className="btn-primary px-8 py-3 text-base">Browse catalog</Link>
      </section>
    </div>
  )
}
