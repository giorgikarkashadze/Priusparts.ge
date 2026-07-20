import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, LogIn, UserPlus, Mail, Lock, User, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/store'
import api from '@/lib/api'

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

  // Live field values, used only to drive the status readout below
  const liveEmail = tab === 'login' ? loginForm.watch('email') : registerForm.watch('email')
  const livePassword = tab === 'login' ? loginForm.watch('password') : registerForm.watch('password')
  const emailLooksValid = !!liveEmail && /\S+@\S+\.\S+/.test(liveEmail)
  const passwordLooksValid = tab === 'login' ? !!livePassword : (livePassword?.length ?? 0) >= 8
  const formReady = emailLooksValid && passwordLooksValid

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

  const statusLabel = error
    ? 'ACCESS DENIED'
    : loading
    ? 'AUTHENTICATING…'
    : formReady
    ? 'READY'
    : 'AWAITING INPUT'

  const statusColor = error ? '#FF6B57' : formReady ? '#22D3B8' : '#4C7CFF'

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-[#05070C]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        @keyframes energy-flow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes blink-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.25; }
        }
        @keyframes rise-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes card-flip {
          0% { transform: rotateY(-90deg) scale(0.94); opacity: 0; }
          55% { transform: rotateY(8deg) scale(1.01); opacity: 1; }
          100% { transform: rotateY(0deg) scale(1); opacity: 1; }
        }
        .flip-stage {
          perspective: 1400px;
        }
        .flip-card {
          transform-style: preserve-3d;
          backface-visibility: hidden;
          animation: card-flip 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes grid-drift {
          from { background-position: 0 0; }
          to { background-position: 48px 48px; }
        }
        .console-panel {
          animation: rise-in 0.5s ease-out both;
        }
        .status-dot {
          animation: blink-dot 1.8s ease-in-out infinite;
        }
        .energy-bar {
          background: linear-gradient(90deg, #4C7CFF, #22D3B8, #4C7CFF, #22D3B8);
          background-size: 200% 100%;
          animation: energy-flow 3.5s linear infinite;
        }
        .hud-grid {
          background-image:
            linear-gradient(rgba(76,124,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(76,124,255,0.06) 1px, transparent 1px);
          background-size: 48px 48px;
          animation: grid-drift 14s linear infinite;
        }
        .hud-field {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(124,138,165,0.25);
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }
        .hud-field:focus-within {
          border-color: #22D3B8;
          box-shadow: 0 0 0 3px rgba(34,211,184,0.12);
          background: rgba(34,211,184,0.03);
        }
        @media (prefers-reduced-motion: reduce) {
          .console-panel, .status-dot, .energy-bar, .hud-grid, .flip-card { animation: none; }
        }
      `}</style>

      {/* Ambient backdrop */}
      <div className="absolute inset-0 hud-grid pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(76,124,255,0.14), transparent 70%)', filter: 'blur(40px)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(34,211,184,0.14), transparent 70%)', filter: 'blur(40px)' }} />

      <div className="w-full max-w-md relative">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="text-3xl tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#EAF2FF' }}
          >
            PRIUS<span style={{ color: '#4d9fff' }}>PARTS</span>
          </Link>
          <p className="mt-2 text-sm" style={{ color: '#7C8AA5' }}>
            {tab === 'login' ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        {/* Console panel with HUD corner brackets */}
        <div className="relative console-panel">
          {/* Corner brackets */}
          {[
            { top: -10, left: -10, borderTop: true, borderLeft: true },
            { top: -10, right: -10, borderTop: true, borderRight: true },
            { bottom: -10, left: -10, borderBottom: true, borderLeft: true },
            { bottom: -10, right: -10, borderBottom: true, borderRight: true },
          ].map((pos, i) => (
            <div
              key={i}
              className="absolute w-6 h-6 pointer-events-none transition-colors duration-300"
              style={{
                top: pos.top, left: pos.left, right: pos.right, bottom: pos.bottom,
                borderTop: pos.borderTop ? `2px solid ${statusColor}` : undefined,
                borderLeft: pos.borderLeft ? `2px solid ${statusColor}` : undefined,
                borderRight: pos.borderRight ? `2px solid ${statusColor}` : undefined,
                borderBottom: pos.borderBottom ? `2px solid ${statusColor}` : undefined,
                opacity: 0.8,
              }}
            />
          ))}

          <div className="flip-stage">
          <div
            key={tab}
            className="rounded-xl overflow-hidden flip-card"
            style={{ background: 'rgba(13,18,30,0.72)', backdropFilter: 'blur(16px)', border: '1px solid rgba(124,138,165,0.15)' }}
          >
            {/* Energy line */}
            <div className="h-[2px] w-full energy-bar" />

            <div className="p-6">
              {/* Status readout */}
              <div className="flex items-center gap-2 mb-5">
                <span
                  className="w-1.5 h-1.5 rounded-full status-dot"
                  style={{ background: statusColor, boxShadow: `0 0 6px ${statusColor}` }}
                />
                <span
                  className="text-[11px] tracking-[0.15em] uppercase"
                  style={{ fontFamily: "'JetBrains Mono', monospace", color: statusColor }}
                >
                  AUTH.SYS // {statusLabel}
                </span>
              </div>

              {/* Tabs */}
              <div className="relative flex mb-6 rounded-lg p-1" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(124,138,165,0.15)' }}>
                <div
                  className="absolute top-1 bottom-1 rounded-md transition-all duration-300 ease-out"
                  style={{
                    width: 'calc(50% - 4px)',
                    left: tab === 'login' ? '4px' : 'calc(50% + 0px)',
                    background: 'linear-gradient(135deg, rgba(76,124,255,0.25), rgba(34,211,184,0.25))',
                    border: '1px solid rgba(34,211,184,0.35)',
                  }}
                />
                {(['login', 'register'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => { setTab(t); setError('') }}
                    className="relative z-10 flex-1 py-2 text-sm font-medium rounded-md transition-colors capitalize"
                    style={{ color: tab === t ? '#EAF2FF' : '#7C8AA5', fontFamily: "'Inter', sans-serif" }}
                  >
                    {t === 'login' ? 'Sign in' : 'Register'}
                  </button>
                ))}
              </div>

              {error && (
                <div
                  className="text-sm p-3 rounded-lg mb-4"
                  style={{ background: 'rgba(255,107,87,0.08)', border: '1px solid rgba(255,107,87,0.3)', color: '#FF6B57' }}
                >
                  {error}
                </div>
              )}

              {/* Login form */}
              {tab === 'login' && (
                <div className="space-y-4">
                  <div>
                    <label
                      className="block text-[11px] tracking-[0.1em] uppercase mb-1.5"
                      style={{ fontFamily: "'JetBrains Mono', monospace", color: '#7C8AA5' }}
                    >
                      Email
                    </label>
                    <div className="hud-field rounded-lg flex items-center px-3">
                      <Mail size={15} style={{ color: '#4C7CFF' }} />
                      <input
                        {...loginForm.register('email')}
                        type="email"
                        className="w-full bg-transparent py-2.5 px-2.5 text-sm outline-none"
                        style={{ color: '#EAF2FF', fontFamily: "'Inter', sans-serif" }}
                        placeholder="you@example.com"
                        autoComplete="email"
                      />
                    </div>
                    {loginForm.formState.errors.email && (
                      <p className="text-xs mt-1" style={{ color: '#FF6B57' }}>{loginForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label
                        className="text-[11px] tracking-[0.1em] uppercase"
                        style={{ fontFamily: "'JetBrains Mono', monospace", color: '#7C8AA5' }}
                      >
                        Password
                      </label>
                      <button type="button" className="text-xs hover:underline" style={{ color: '#22D3B8' }}>
                        Forgot password?
                      </button>
                    </div>
                    <div className="hud-field rounded-lg flex items-center px-3">
                      <Lock size={15} style={{ color: '#4C7CFF' }} />
                      <input
                        {...loginForm.register('password')}
                        type={showPass ? 'text' : 'password'}
                        className="w-full bg-transparent py-2.5 px-2.5 text-sm outline-none"
                        style={{ color: '#EAF2FF', fontFamily: "'Inter', sans-serif" }}
                        placeholder="••••••••"
                        autoComplete="current-password"
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)} style={{ color: '#7C8AA5' }}>
                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="text-xs mt-1" style={{ color: '#FF6B57' }}>{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={loginForm.handleSubmit(onLogin)}
                    className="w-full py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-transform active:scale-[0.98] disabled:opacity-60"
                    style={{
                      background: 'linear-gradient(135deg, #4C7CFF, #22D3B8)',
                      color: '#04121A',
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    <LogIn size={15} /> {loading ? 'Signing in…' : 'Sign in'} {!loading && <ArrowRight size={14} />}
                  </button>
                </div>
              )}

              {/* Register form */}
              {tab === 'register' && (
                <div className="space-y-4">
                  <div>
                    <label
                      className="block text-[11px] tracking-[0.1em] uppercase mb-1.5"
                      style={{ fontFamily: "'JetBrains Mono', monospace", color: '#7C8AA5' }}
                    >
                      Full name
                    </label>
                    <div className="hud-field rounded-lg flex items-center px-3">
                      <User size={15} style={{ color: '#4C7CFF' }} />
                      <input
                        {...registerForm.register('name')}
                        className="w-full bg-transparent py-2.5 px-2.5 text-sm outline-none"
                        style={{ color: '#EAF2FF', fontFamily: "'Inter', sans-serif" }}
                        placeholder="John Smith"
                        autoComplete="name"
                      />
                    </div>
                    {registerForm.formState.errors.name && (
                      <p className="text-xs mt-1" style={{ color: '#FF6B57' }}>{registerForm.formState.errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-[11px] tracking-[0.1em] uppercase mb-1.5"
                      style={{ fontFamily: "'JetBrains Mono', monospace", color: '#7C8AA5' }}
                    >
                      Email
                    </label>
                    <div className="hud-field rounded-lg flex items-center px-3">
                      <Mail size={15} style={{ color: '#4C7CFF' }} />
                      <input
                        {...registerForm.register('email')}
                        type="email"
                        className="w-full bg-transparent py-2.5 px-2.5 text-sm outline-none"
                        style={{ color: '#EAF2FF', fontFamily: "'Inter', sans-serif" }}
                        placeholder="you@example.com"
                        autoComplete="email"
                      />
                    </div>
                    {registerForm.formState.errors.email && (
                      <p className="text-xs mt-1" style={{ color: '#FF6B57' }}>{registerForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-[11px] tracking-[0.1em] uppercase mb-1.5"
                      style={{ fontFamily: "'JetBrains Mono', monospace", color: '#7C8AA5' }}
                    >
                      Password
                    </label>
                    <div className="hud-field rounded-lg flex items-center px-3">
                      <Lock size={15} style={{ color: '#4C7CFF' }} />
                      <input
                        {...registerForm.register('password')}
                        type={showPass ? 'text' : 'password'}
                        className="w-full bg-transparent py-2.5 px-2.5 text-sm outline-none"
                        style={{ color: '#EAF2FF', fontFamily: "'Inter', sans-serif" }}
                        placeholder="Min. 8 characters"
                        autoComplete="new-password"
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)} style={{ color: '#7C8AA5' }}>
                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    {registerForm.formState.errors.password && (
                      <p className="text-xs mt-1" style={{ color: '#FF6B57' }}>{registerForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-[11px] tracking-[0.1em] uppercase mb-1.5"
                      style={{ fontFamily: "'JetBrains Mono', monospace", color: '#7C8AA5' }}
                    >
                      Confirm password
                    </label>
                    <div className="hud-field rounded-lg flex items-center px-3">
                      <Lock size={15} style={{ color: '#4C7CFF' }} />
                      <input
                        {...registerForm.register('confirm')}
                        type="password"
                        className="w-full bg-transparent py-2.5 px-2.5 text-sm outline-none"
                        style={{ color: '#EAF2FF', fontFamily: "'Inter', sans-serif" }}
                        placeholder="••••••••"
                        autoComplete="new-password"
                      />
                    </div>
                    {registerForm.formState.errors.confirm && (
                      <p className="text-xs mt-1" style={{ color: '#FF6B57' }}>{registerForm.formState.errors.confirm.message}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={registerForm.handleSubmit(onRegister)}
                    className="w-full py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-transform active:scale-[0.98] disabled:opacity-60"
                    style={{
                      background: 'linear-gradient(135deg, #4C7CFF, #22D3B8)',
                      color: '#04121A',
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    <UserPlus size={15} /> {loading ? 'Creating account…' : 'Create account'}
                  </button>

                  <p className="text-xs text-center" style={{ color: '#4A5670' }}>
                    By registering you agree to our{' '}
                    <span className="hover:underline cursor-pointer" style={{ color: '#22D3B8' }}>Terms of Service</span>
                  </p>
                </div>
              )}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}