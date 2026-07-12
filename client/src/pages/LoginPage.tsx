import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react'
import { useAuthStore } from '@/store'
import api from '@/lib/api'
import { cn } from '@/lib/utils'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, { message: "Passwords don't match", path: ['confirm'] })

type LoginData = z.infer<typeof loginSchema>
type RegisterData = z.infer<typeof registerSchema>

export default function LoginPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const loginForm = useForm<LoginData>({ resolver: zodResolver(loginSchema) })
  const registerForm = useForm<RegisterData>({ resolver: zodResolver(registerSchema) })

  const onLogin = async (data: LoginData) => {
    setLoading(true); setError('')
    try {
      const res = await api.post('/auth/login', data)
      setAuth(res.data.user, res.data.access, res.data.refresh)
      navigate(redirect, { replace: true })
    } catch (e: any) {
      setError(e.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const onRegister = async (data: RegisterData) => {
    setLoading(true); setError('')
    try {
      const res = await api.post('/auth/register', { name: data.name, email: data.email, password: data.password })
      setAuth(res.data.user, res.data.access, res.data.refresh)
      navigate(redirect, { replace: true })
    } catch (e: any) {
      setError(e.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-semibold">
            AUTO<span className="text-brand">PARTS</span>
          </Link>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            {tab === 'login' ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        <div className="card p-6">
          {/* Tabs */}
          <div className="flex mb-6 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            {(['login', 'register'] as const).map((t) => (
              <button key={t} onClick={() => { setTab(t); setError('') }}
                className={cn('flex-1 py-2 text-sm font-medium rounded-lg transition-all capitalize',
                  tab === t ? 'bg-white dark:bg-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300')}>
                {t === 'login' ? 'Sign in' : 'Register'}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Login form */}
          {tab === 'login' && (
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <input {...loginForm.register('email')} type="email" className="input" placeholder="you@example.com" autoComplete="email" />
                {loginForm.formState.errors.email && <p className="text-xs text-red-500 mt-1">{loginForm.formState.errors.email.message}</p>}
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-sm font-medium">Password</label>
                  <button type="button" className="text-xs text-brand hover:underline">Forgot password?</button>
                </div>
                <div className="relative">
                  <input {...loginForm.register('password')} type={showPass ? 'text' : 'password'} className="input pr-10" placeholder="••••••••" autoComplete="current-password" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {loginForm.formState.errors.password && <p className="text-xs text-red-500 mt-1">{loginForm.formState.errors.password.message}</p>}
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 flex items-center justify-center gap-2">
                <LogIn size={15} /> {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          )}

          {/* Register form */}
          {tab === 'register' && (
            <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Full name</label>
                <input {...registerForm.register('name')} className="input" placeholder="John Smith" autoComplete="name" />
                {registerForm.formState.errors.name && <p className="text-xs text-red-500 mt-1">{registerForm.formState.errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <input {...registerForm.register('email')} type="email" className="input" placeholder="you@example.com" autoComplete="email" />
                {registerForm.formState.errors.email && <p className="text-xs text-red-500 mt-1">{registerForm.formState.errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Password</label>
                <div className="relative">
                  <input {...registerForm.register('password')} type={showPass ? 'text' : 'password'} className="input pr-10" placeholder="Min. 8 characters" autoComplete="new-password" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {registerForm.formState.errors.password && <p className="text-xs text-red-500 mt-1">{registerForm.formState.errors.password.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Confirm password</label>
                <input {...registerForm.register('confirm')} type="password" className="input" placeholder="••••••••" autoComplete="new-password" />
                {registerForm.formState.errors.confirm && <p className="text-xs text-red-500 mt-1">{registerForm.formState.errors.confirm.message}</p>}
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 flex items-center justify-center gap-2">
                <UserPlus size={15} /> {loading ? 'Creating account…' : 'Create account'}
              </button>
              <p className="text-xs text-center text-gray-400">
                By registering you agree to our <span className="text-brand hover:underline cursor-pointer">Terms of Service</span>
              </p>
            </form>
          )}
        </div>

        {/* Demo credentials */}
        <div className="mt-4 card p-3 text-xs text-gray-500 dark:text-gray-400 text-center">
          <strong>Demo admin:</strong> admin@priusparts.pro / admin123
        </div>
      </div>
    </div>
  )
}
