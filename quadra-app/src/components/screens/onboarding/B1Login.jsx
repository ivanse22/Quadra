import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useAppStore } from '../../../store/useAppStore'

export default function B1Login() {
  const { navigate, setSession, loadUserData, switchTab } = useAppStore()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd]   = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })

      if (authError) {
        if (authError.message?.toLowerCase().includes('invalid login credentials') ||
            authError.message?.toLowerCase().includes('wrong password') ||
            authError.message?.toLowerCase().includes('invalid password')) {
          setError('password')
        } else if (authError.message?.toLowerCase().includes('user not found') ||
                   authError.message?.toLowerCase().includes('no user')) {
          setError('notfound')
        } else {
          setError('network')
        }
        return
      }

      if (data?.session?.user?.id) {
        loadUserData(data.session.user.id)
      }
      switchTab(0)
    } catch {
      // Demo/prototype mode — no real Supabase configured
      setSession({ user: { email }, mock: true })
      switchTab(0)
    } finally {
      setLoading(false)
    }
  }

  const errorMsg = {
    notfound: 'No encontramos esa cuenta. ¿Quieres crear una nueva?',
    password:  'Contraseña incorrecta. Puedes intentarlo de nuevo o recuperarla.',
    network:   'Sin conexión. Revisa tu red e intenta de nuevo.',
  }[error]

  return (
    <div className="ob-screen">
      <div className="ob-screen-main">
        <h1 className="ob-question" style={{ marginBottom: 'var(--s2)' }}>
          Bienvenido de nuevo.
        </h1>
        <p className="ob-context">Entra con tu email y contraseña de Quadra.</p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s4)', marginTop: 'var(--s5)' }}>
          {/* Email */}
          <div className="field">
            <label className="field-label">Email</label>
            <input
              type="email"
              className="q-input"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null) }}
              placeholder="tu@correo.com"
              autoComplete="email"
              required
            />
          </div>

          {/* Contraseña */}
          <div className="field">
            <label className="field-label">Contraseña</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPwd ? 'text' : 'password'}
                className="q-input"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null) }}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{ paddingRight: '44px' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPwd(v => !v)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--txt-m)', padding: 4, lineHeight: 1, fontSize: 13,
                  fontFamily: 'var(--font-body)', fontWeight: 600,
                }}
                aria-label={showPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPwd ? 'Ocultar' : 'Ver'}
              </button>
            </div>
          </div>

          {/* Error inline */}
          {errorMsg && (
            <p style={{ fontSize: 'var(--t-sm)', color: 'var(--fin-deduct)', fontFamily: 'var(--font-body)', marginTop: 'calc(var(--s2) * -1)', lineHeight: 1.4 }}>
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
            style={{ marginTop: 'var(--s2)', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--s5)' }}>
          <button
            className="btn btn-ghost"
            onClick={() => navigate('B2')}
            style={{ fontSize: 'var(--t-sm)' }}
          >
            Olvidé mi contraseña
          </button>
        </div>
      </div>
    </div>
  )
}
