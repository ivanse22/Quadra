import { useState } from 'react'
import { useAppStore } from '../../../store/useAppStore'

const OPTIONS = [
  { id: 'simple',    title: 'Régimen Simple', desc: 'Pagas una tarifa fija mensual. La retención ya está incluida en tu tributación.' },
  { id: 'ordinario', title: 'Régimen Ordinario', desc: 'Tu cliente te descuenta un porcentaje antes de pagarte. Es la más común entre freelancers.' },
  { id: 'unclear',   title: 'No lo tengo claro', desc: 'Quadra usa el porcentaje más común (11%) y puedes ajustarlo después.' },
]

export default function O2Regimen() {
  const { navigate, setProfile, profile } = useAppStore()
  const [selected, setSelected] = useState(profile.regimen || 'ordinario')

  const handleContinue = () => {
    setProfile({ regimen: selected })
    navigate('O3')
  }

  return (
    <div className="ob-screen">
      <div style={{ marginBottom: 'var(--s4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--s2)' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--t-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--txt-m)' }}>Paso 1 de 3</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--t-xs)', fontWeight: 700, color: 'var(--volt-text)' }}>33%</span>
        </div>
        <div className="progress-bar" style={{ margin: 0 }}><div className="progress-fill" style={{ width: '33%' }} /></div>
      </div>
      <div className="ob-screen-main">
        <h1 className="ob-question">¿Cómo tributas como freelancer?</h1>
        <p className="ob-context">Esto define cómo calculamos tu retención. Lo puedes cambiar después.</p>
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
