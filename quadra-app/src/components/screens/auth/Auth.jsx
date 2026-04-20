import { useState } from 'react'
import { QuadraLogo } from '../../ui/Icons'
import { supabase } from '../../../lib/supabase'
import { useAppStore } from '../../../store/useAppStore'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)

  const { showToast, navigate } = useAppStore()

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        showToast({ type: 'success', message: 'Tu registro ha sido exitoso.' })
        // Usually you'd confirm email, but we assume auto-confirm for now or let them log in
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        showToast({ type: 'success', message: 'Has iniciado sesión correctamente.' })
        navigate('O1') // Or D1, we will handle this in App state later
      }
    } catch (error) {
      showToast({ type: 'error', message: `Error: ${error.message}` })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100%', padding: 'var(--s8) var(--screen-px)', paddingBottom: '15vh' }}>
      {/* Logo + tagline */}
      <div style={{ textAlign: 'center', marginBottom: 'var(--s8)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--s3)' }}>
          <QuadraLogo size={60} color="var(--txt)" />
        </div>
        <p style={{ color: 'var(--txt-m)', fontFamily: 'var(--font-body)', fontSize: 'var(--t-sm)' }}>Sin enredos. Todo cuadra.</p>
      </div>

      {/* Auth card */}
      <div className="card" style={{ padding: 'var(--space-card)' }}>
        <h2 className="card-title mb4">{isSignUp ? 'Crear mi cuenta' : 'Iniciar sesión'}</h2>
        
        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-form-gap)' }}>
          <div className="field">
            <label className="field-label">Correo electrónico</label>
            <input
              type="email"
              className="q-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              required
            />
          </div>

          <div className="field">
            <label className="field-label">Contraseña</label>
            <input
              type="password"
              className="q-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            style={{ marginTop: 'var(--s2)' }}
            disabled={loading}
          >
            {loading ? 'Cargando...' : (isSignUp ? 'Registrarme' : 'Entrar')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--s5)' }}>
          <p style={{ fontSize: 'var(--t-sm)', color: 'var(--txt-m)', fontFamily: 'var(--font-body)' }}>
            {isSignUp ? '¿Ya tienes cuenta? ' : '¿No tienes cuenta? '}
            <span
              style={{ color: 'var(--volt-text)', fontWeight: 700, cursor: 'pointer' }}
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Inicia sesión' : 'Regístrate aquí'}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
