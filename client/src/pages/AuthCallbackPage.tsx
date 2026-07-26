import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '@/store'

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    const access = searchParams.get('access')
    const refresh = searchParams.get('refresh')
    const id = searchParams.get('id')
    const name = searchParams.get('name')
    const email = searchParams.get('email')
    const role = searchParams.get('role')
    const error = searchParams.get('error')

    if (error || !access || !refresh) {
      navigate('/login?error=google_failed')
      return
    }

    setAuth(
      { id: id!, name: name!, email: email!, role: role as 'CUSTOMER' | 'CUSTOMER' },
      access,
      refresh
    )
    navigate('/')
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#05070C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid transparent', borderTopColor: '#4C7CFF', borderRightColor: '#22D3B8', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#22D3B8', letterSpacing: '0.15em' }}>AUTHENTICATING WITH GOOGLE…</div>
      </div>
    </div>
  )
}