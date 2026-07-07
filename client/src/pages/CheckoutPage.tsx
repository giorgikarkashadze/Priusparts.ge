import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Lock, CreditCard } from 'lucide-react'
import { useCartStore } from '@/store'
import { formatPrice } from '@/lib/utils'
import api from '@/lib/api'

const schema = z.object({
  name: z.string().min(2, 'Full name required'),
  email: z.string().email('Valid email required'),
  line1: z.string().min(4, 'Street address required'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City required'),
  state: z.string().min(2, 'State required'),
  zip: z.string().min(3, 'ZIP code required'),
  country: z.string().min(2, 'Country required'),
})
type FormData = z.infer<typeof schema>

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore()
  const navigate = useNavigate()
  const location = useLocation()
  const promoCode = (location.state as any)?.promoCode

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { country: 'US' },
  })

  const subtotal = total()
  const shipping = 9.99
  const orderTotal = subtotal + shipping

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError('')
    try {
      const { email, ...shippingAddress } = data
      const payload = {
        items: items.map((i) => ({ partId: i.part.id, quantity: i.quantity })),
        shippingAddress,
        promoCode,
      }
      const res = await api.post('/orders', payload)
      clearCart()
      navigate(`/orders/${res.data.order.id}?success=true`)
    } catch (e: any) {
      setError(e.response?.data?.error || 'Order failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <Lock size={20} className="text-brand" /> Secure checkout
      </h1>

      <div className="grid md:grid-cols-5 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="md:col-span-3 space-y-6">
          {/* Contact */}
          <div className="card p-5">
            <h2 className="font-semibold mb-4">Contact information</h2>
            <div className="space-y-3">
              <Field label="Full name" error={errors.name?.message}>
                <input {...register('name')} className="input" placeholder="John Smith" />
              </Field>
              <Field label="Email address" error={errors.email?.message}>
                <input {...register('email')} type="email" className="input" placeholder="john@example.com" />
              </Field>
            </div>
          </div>

          {/* Shipping */}
          <div className="card p-5">
            <h2 className="font-semibold mb-4">Shipping address</h2>
            <div className="space-y-3">
              <Field label="Street address" error={errors.line1?.message}>
                <input {...register('line1')} className="input" placeholder="123 Main St" />
              </Field>
              <Field label="Apartment, suite (optional)" error={errors.line2?.message}>
                <input {...register('line2')} className="input" placeholder="Apt 4B" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="City" error={errors.city?.message}>
                  <input {...register('city')} className="input" placeholder="New York" />
                </Field>
                <Field label="State" error={errors.state?.message}>
                  <input {...register('state')} className="input" placeholder="NY" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="ZIP code" error={errors.zip?.message}>
                  <input {...register('zip')} className="input" placeholder="10001" />
                </Field>
                <Field label="Country" error={errors.country?.message}>
                  <select {...register('country')} className="input">
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                  </select>
                </Field>
              </div>
            </div>
          </div>

          {/* Payment placeholder */}
          <div className="card p-5">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <CreditCard size={16} /> Payment
            </h2>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-sm text-gray-500 border border-dashed border-gray-300 dark:border-gray-700 text-center">
              Stripe Elements mount here.
              <br />
              <span className="text-xs">Install <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">@stripe/react-stripe-js</code> and add your publishable key.</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-base">
            <Lock size={16} />
            {loading ? 'Placing order…' : `Place order — ${formatPrice(orderTotal)}`}
          </button>
        </form>

        {/* Order summary */}
        <div className="md:col-span-2">
          <div className="card p-5 sticky top-20">
            <h2 className="font-semibold mb-4">Order summary</h2>
            <div className="space-y-3 mb-4">
              {items.map(({ part, quantity }) => (
                <div key={part.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center shrink-0 text-xl overflow-hidden">
                    {part.images[0] ? <img src={part.images[0]} alt="" className="w-full h-full object-cover" /> : '🔩'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium line-clamp-1">{part.name}</div>
                    <div className="text-xs text-gray-400">Qty: {quantity}</div>
                  </div>
                  <span className="text-sm font-medium shrink-0">{formatPrice(Number(part.price) * quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 dark:border-gray-800 pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between text-gray-500"><span>Shipping</span><span>{formatPrice(shipping)}</span></div>
              <div className="flex justify-between font-semibold pt-1.5 border-t border-gray-100 dark:border-gray-800">
                <span>Total</span><span className="text-brand">{formatPrice(orderTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
