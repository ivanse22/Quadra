import { useState } from 'react'
import { useAppStore } from '../../../store/useAppStore'

const SUPPORTED = ['bancolombia', 'davivienda', 'bbva', 'nequi', 'daviplata', 'wise', 'paypal']

const banks = [
  { id: 'bancolombia', name: 'Bancolombia', icon: '🏦' },
  { id: 'davivienda',  name: 'Davivienda',  icon: '🏧' },
  { id: 'bbva',        name: 'BBVA',         icon: '🔵' },
  { id: 'nequi',       name: 'Nequi',        icon: '📱' },
  { id: 'daviplata',   name: 'Daviplata',    icon: '💳' },
  { id: 'wise',        name: 'Wise',         icon: '💸' },
  { id: 'paypal',      name: 'PayPal',       icon: '🅿️' },
  { id: 'other',       name: 'Otro banco',   icon: '🏛️' },
]

export default function C4AgregarCuenta() {
  const { navigate, showToast } = useAppStore()
  const [selected, setSelected] = useState(null)
  const [notifyEmail, setNotifyEmail] = useState('')
  const [notifySent, setNotifySent] = useState(false)

  const isUnsupported = selected === 'other'
  const selectedBank = banks.find(b => b.id === selected)

  const handleNotify = () => {
    // In a real app: POST to backend with email + platform
    setNotifySent(true)
    showToast({ type: 'success', message: 'Te avisaremos cuando esté disponible.' })
  }

  return (
    <div className="q-body-inner">
      <p style={{ fontSize: 'var(--t-sm)', color: 'var(--txt-2)', marginBottom: 'var(--s5)', fontFamily: 'var(--font-body)' }}>
        Selecciona tu banco o billetera para conectar tu cuenta.
      </p>

      <div role="radiogroup" aria-label="Selecciona una cuenta" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s3)', marginBottom: 'var(--s6)' }}>
        {banks.map(b => (
          <button
            type="button"
            key={b.id}
            className={`ob-option${selected === b.id ? ' selected' : ''}`}
            style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 'var(--s4)', position: 'relative' }}
            onClick={() => { setSelected(b.id); setNotifySent(false) }}
            aria-pressed={selected === b.id}
          >
            <span style={{ fontSize: 28, marginBottom: 'var(--s2)' }}>{b.icon}</span>
            <div className="ob-option-title">{b.name}</div>
            {b.id === 'other' && (
              <span style={{ position: 'absolute', top: 6, right: 6, fontSize: 9, background: 'var(--surf-3)', color: 'var(--txt-m)', padding: '2px 5px', borderRadius: 'var(--r-full)', fontFamily: 'var(--font-body)', fontWeight: 700 }}>
                Próximo
              </span>
            )}
          </button>
        ))}
      </div>

      {/* E4.4 — Plataforma no soportada */}
      {isUnsupported && (
        <div style={{ background: 'var(--surf-1)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: 'var(--s5)', marginBottom: 'var(--s4)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--t-sm)', fontWeight: 700, color: 'var(--txt)', marginBottom: 'var(--s2)' }}>
            Esta plataforma aún no está disponible
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--t-xs)', color: 'var(--txt-m)', lineHeight: 1.5, marginBottom: 'var(--s4)' }}>
            Déjanos tu correo y te avisamos en cuanto la agreguemos. Puedes seguir usando Quadra sin conectar una cuenta.
          </p>
          {notifySent ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s2)', color: 'var(--fin-income)', fontSize: 'var(--t-xs)', fontFamily: 'var(--font-body)', fontWeight: 700 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
              Listo — te avisamos cuando esté disponible.
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 'var(--s2)' }}>
              <input
                className="q-input"
                type="email"
                placeholder="tu@email.com"
                value={notifyEmail}
                onChange={e => setNotifyEmail(e.target.value)}
                style={{ flex: 1 }}
              />
              <button
                className="btn btn-secondary"
                onClick={handleNotify}
                disabled={!notifyEmail.includes('@')}
              >
                Avisarme
              </button>
            </div>
          )}
        </div>
      )}

      <button
        className="btn btn-primary btn-full"
        disabled={!selected || isUnsupported}
        onClick={() => navigate('C4C')}
      >
        {isUnsupported ? 'Plataforma no disponible' : `Conectar ${selectedBank?.name || 'cuenta'}`}
      </button>

      {isUnsupported && (
        <button className="btn btn-ghost btn-full" style={{ marginTop: 'var(--s2)' }} onClick={() => navigate('D1')}>
          Continuar sin conectar
        </button>
      )}
    </div>
  )
}
