import { useState } from 'react'
import { useAppStore } from '../../../store/useAppStore'

const OPTIONS = [
  { id: 3.5,  title: '3.5%', desc: 'Servicios con tarifa especial' },
  { id: 11,   title: '11% — el más común', desc: 'Para la mayoría de servicios de freelancers' },
  { id: 'other', title: 'Otro porcentaje', desc: 'Lo ingreso manualmente' },
]

export default function O3Retencion() {
  const { navigate, setProfile, profile } = useAppStore()
  const initialSelection = [3.5, 11, 'other'].includes(profile.retencion) ? profile.retencion : 11
  const [selected, setSelected] = useState(initialSelection)

  const handleContinue = () => {
    setProfile({ retencion: selected })
    navigate('O4')
  }

  return (
    <div className="ob-screen">
      <div style={{ marginBottom: 'var(--s4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--s2)' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--t-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--txt-m)' }}>Paso 2 de 3</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--t-xs)', fontWeight: 700, color: 'var(--volt-text)' }}>66%</span>
        </div>
        <div className="progress-bar" style={{ margin: 0 }}><div className="progress-fill" style={{ width: '66%' }} /></div>
      </div>
      <div className="ob-screen-main">
        <h1 className="ob-question">¿Qué porcentaje te retienen?</h1>
        <p className="ob-context">Mira una factura reciente. El porcentaje más común para servicios es 11%.</p>
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
        <button className="btn btn-primary btn-full" onClick={handleContinue}>Continuar</button>
      </div>
    </div>
  )
}
