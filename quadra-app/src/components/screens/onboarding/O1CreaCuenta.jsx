import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useAppStore } from '../../../store/useAppStore'

export default function O1CreaCuenta() {
  const { navigate, setProfile, showToast } = useAppStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const trimmedName = name.trim()
    const trimmedEmail = email.trim().toLowerCase()

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: { data: { name: trimmedName, full_name: trimmedName } },
      })

      if (authError) {
        const msg = authError.message?.toLowerCase() || ''
        if (msg.includes('already') || msg.includes('registered') || msg.includes('exists')) {
          setError('exists')
        } else if (msg.includes('password') && msg.includes('6')) {
          setError('weak')
        } else {
          setError('network')
        }
        return
      }

      setProfile({ name: trimmedName })

      if (data?.session) {
        navigate('O2')
        return
      }

      showToast({
        type: 'info',
        message: 'Revisa tu bandeja y confirma el correo. Luego inicia sesión para continuar.',
      })
      navigate('B1')
    } catch {
      setError('network')
    } finally {
      setLoading(false)
    }
  }

  const errorMsg = {
    exists:  'Ese correo ya está registrado. Inicia sesión o usa otro email.',
    weak:   'La contraseña debe tener al menos 6 caracteres.',
    network: 'No se pudo completar el registro. Revisa tu conexión e inténtalo de nuevo.',
  }[error]

  return (
    <div className="ob-screen">
      <div className="ob-screen-main">
        <h1 className="ob-question" style={{ marginBottom: 'var(--s2)' }}>
          Crea tu cuenta
        </h1>
        <p className="ob-context">Nombre, correo y contraseña. Luego afinamos tu perfil fiscal.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s4)', marginTop: 'var(--s5)' }}>
          <div className="field">
            <label className="field-label">Nombre</label>
            <input
              type="text"
              className="q-input"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(null) }}
              placeholder="Cómo te llamamos"
              autoComplete="name"
              required
            />
          </div>

          <div className="field">
            <label className="field-label">Correo</label>
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

          <div className="field">
            <label className="field-label">Contraseña</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPwd ? 'text' : 'password'}
                className="q-input"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null) }}
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
                minLength={6}
                style={{ paddingRight: '44px' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--txt-m)',
                  padding: 4,
                  lineHeight: 1,
                  fontSize: 13,
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                }}
                aria-label={showPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPwd ? 'Ocultar' : 'Ver'}
              </button>
            </div>
          </div>

          {errorMsg && (
            <p
              style={{
                fontSize: 'var(--t-sm)',
                color: 'var(--fin-deduct)',
                fontFamily: 'var(--font-body)',
                marginTop: 'calc(var(--s2) * -1)',
                lineHeight: 1.4,
              }}
            >
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
            style={{ marginTop: 'var(--s2)', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Creando cuenta...' : 'Continuar'}
          </button>
        </form>
      </div>
    </div>
  )
}
