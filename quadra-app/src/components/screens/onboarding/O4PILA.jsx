import { useState } from 'react'
import { useAppStore } from '../../../store/useAppStore'

const OPTIONS = [
  { id: 'auto',   title: 'Sí, cotizo independiente', desc: 'Quadra reserva el 12.5% de mi IBC automáticamente' },
  { id: 'manual', title: 'Sí, pero lo calculo yo',   desc: 'Ingreso el valor manualmente en cada pago' },
  { id: 'no',     title: 'No cotizo aún',             desc: 'Quadra puede recordarme cuándo empezar' },
]

export default function O4PILA() {
  const { navigate, setProfile, profile } = useAppStore()
  const [selected, setSelected] = useState(profile.pila || 'auto')

  const handleContinue = () => {
    setProfile({ pila: selected })
    navigate('O5')
  }

  return (
    <div className="ob-screen">
      <div style={{ marginBottom: 'var(--s4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--s2)' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--t-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--txt-m)' }}>Paso 3 de 3</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--t-xs)', fontWeight: 700, color: 'var(--volt-text)' }}>¡Último!</span>
        </div>
        <div className="progress-bar" style={{ margin: 0 }}><div className="progress-fill" style={{ width: '100%' }} /></div>
      </div>
      <div className="ob-screen-main">
        <h1 className="ob-question">¿Cotizas salud y pensión como independiente?</h1>
        <p className="ob-context">Quadra puede reservar automáticamente este valor cada vez que registras un pago.</p>
        <div className="ob-options">
          {OPTIONS.map(opt => (
            <div
              key={opt.id}
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
          ))}
        </div>
      </div>
      <div className="ob-screen-actions">
        <button className="btn btn-primary btn-full" onClick={handleContinue}>Empezar con Quadra →</button>
      </div>
    </div>
  )
}
