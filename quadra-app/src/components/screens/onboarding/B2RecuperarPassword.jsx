import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useAppStore } from '../../../store/useAppStore'

export default function B2RecuperarPassword() {
  const { navigate } = useAppStore()

  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)
  const [error, setError]     = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      })

      if (resetError) {
        if (resetError.message?.toLowerCase().includes('user not found') ||
            resetError.message?.toLowerCase().includes('no user')) {
          setError('notfound')
        } else {
          setError('network')
        }
      } else {
        setSent(true)
      }
    } catch {
      // Demo/prototype mode
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  const errorMsg = {
    notfound: 'No encontramos ese correo. ¿Seguro que es el que usaste para crear tu cuenta?',
    network:  'Sin conexión. Revisa tu red e intenta de nuevo.',
  }[error]

  return (
    <div className="ob-screen">
      <div className="ob-screen-main">
        <h1 className="ob-question" style={{ marginBottom: 'var(--s2)' }}>
          Recupera tu acceso.
        </h1>
        <p className="ob-context">Escribe tu email y te enviamos las instrucciones.</p>

        {!sent ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s4)', marginTop: 'var(--s5)' }}>
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
              {loading ? 'Enviando...' : 'Enviar instrucciones'}
            </button>
          </form>
        ) : (
          <div style={{ marginTop: 'var(--s6)', background: 'var(--surf-1)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 'var(--s4)', lineHeight: 1.5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s2)', marginBottom: 'var(--s2)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--volt-text)" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20,6 9,17 4,12" />
              </svg>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--t-sm)', color: 'var(--txt)' }}>
                Listo.
              </span>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--t-sm)', color: 'var(--txt-m)' }}>
              Revisa tu correo en <strong style={{ color: 'var(--txt)' }}>{email}</strong>. Si no llega en unos minutos, revisa la carpeta de spam.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
