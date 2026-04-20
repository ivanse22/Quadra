import { useState } from 'react'
import { useAppStore } from '../../../store/useAppStore'

const OPTIONS = [
  { id: 3.5,  title: '3.5%', desc: 'Servicios con tarifa especial' },
  { id: 11,   title: '11% — el más común', desc: 'Para la mayoría de servicios de freelancers' },
  { id: 'other', title: 'Otro porcentaje', desc: 'Lo ingreso manualmente' },
]

export default function O3Retencion() {
  const { navigate, setProfile } = useAppStore()
  const [selected, setSelected] = useState(11)

  const handleContinue = () => {
    setProfile({ retencion: selected })
    navigate('O4')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: 'var(--s5) var(--s5) 0' }}>
      <div style={{ marginBottom: 'var(--s4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--s2)' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--t-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--txt-m)' }}>Paso 2 de 3</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--t-xs)', fontWeight: 700, color: 'var(--volt-text)' }}>66%</span>
        </div>
        <div className="progress-bar" style={{ margin: 0 }}><div className="progress-fill" style={{ width: '66%' }} /></div>
      </div>
      <div style={{ flex: 1 }}>
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
      <div style={{ padding: 'var(--s4) 0 var(--s6)' }}>
        <button className="btn btn-primary btn-full" onClick={handleContinue}>Continuar</button>
      </div>
    </div>
  )
}
