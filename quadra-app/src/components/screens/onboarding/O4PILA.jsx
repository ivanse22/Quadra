import { useState } from 'react'
import { useAppStore } from '../../../store/useAppStore'

const OPTIONS = [
  { id: 'auto',   title: 'Quadra lo calcula solo',  desc: 'Cada pago que registres incluye tu reserva automática' },
  { id: 'manual', title: 'Yo decido cuánto apartar', desc: 'Tú eliges el monto cuando lo necesites' },
  { id: 'no',     title: 'Todavía no cotizo',        desc: 'Quadra te avisa cuando debas empezar' },
]

export default function O4PILA() {
  const { navigate, setProfile, profile } = useAppStore()
  const [selected, setSelected] = useState(profile.pila || null)

  const handleContinue = () => {
    if (!selected) return
    setProfile({ pila: selected })
    navigate('O5')
  }

  return (
    <div className="ob-screen">
      {/* Progreso */}
      <div style={{ marginBottom: 'var(--s4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--s2)' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--t-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--txt-m)' }}>Paso 3 de 3</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--t-xs)', fontWeight: 700, color: 'var(--volt-text)' }}>100%</span>
        </div>
        <div className="progress-bar" style={{ margin: 0 }}><div className="progress-fill" style={{ width: '100%' }} /></div>
      </div>

      <div className="ob-screen-main">
        <h1 className="ob-question">¿Cómo manejas salud y pensión?</h1>
        <p className="ob-context">Quadra puede apartar lo necesario de cada pago para que no te coja desprevenido a fin de mes.</p>

        <div className="ob-options">
          {OPTIONS.map(opt => (
            <div key={opt.id}>
              <div
                className={`ob-option${selected === opt.id ? ' selected' : ''}`}
                onClick={() => setSelected(opt.id)}
              >
                <div className="ob-radio">
                  {selected === opt.id && <div className="ob-radio-dot" />}
                </div>
                <div>
                  <div className="ob-option-title">{opt.title}</div>
                  <div className="ob-option-desc">{opt.desc}</div>
                </div>
              </div>
              {opt.id === 'no' && selected === 'no' && (
                <p style={{ fontSize: 'var(--t-xs)', color: 'var(--txt-m)', fontFamily: 'var(--font-body)', marginTop: 'var(--s2)', marginBottom: 'var(--s2)', paddingLeft: 'var(--s2)', borderLeft: '2px solid var(--border)', lineHeight: 1.45 }}>
                  Si ganas más de $1.750.905 al mes, cotizar es obligatorio. Quadra te recuerda.
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="ob-screen-actions">
        <button
          className="btn btn-primary btn-full"
          onClick={handleContinue}
          style={{ opacity: selected === null ? 0.5 : 1 }}
        >
          Listo, ver mi perfil
        </button>
      </div>
    </div>
  )
}
