import { useState } from 'react'
import { useAppStore } from '../../../store/useAppStore'

// Opciones para Régimen Ordinario / No lo tengo claro
const OPTIONS_ORDINARIO = [
  { id: 11,  title: '11%',                    desc: 'Honorarios o comisiones — lo más común para freelancers' },
  { id: 4,   title: '4%',                     desc: 'Servicios generales — si ya declaras renta' },
  { id: 3.5, title: '3.5%',                   desc: 'Servicios generales — si aún no declaras renta' },
  { id: 0,   title: 'No me retienen / No sé', desc: 'Lo reviso después en Mi Cuenta' },
]

// Opciones para Régimen Simple (ingresos anuales → tarifa)
const OPTIONS_SIMPLE = [
  { id: 2.0, title: 'Menos de $89 millones', desc: 'Tarifa estimada: 2%' },
  { id: 2.8, title: 'Entre $89M y $214M',    desc: 'Tarifa estimada: 2.8%' },
  { id: 3.3, title: 'Más de $214 millones',  desc: 'Tarifa estimada: 3.3% o más' },
  { id: 2.0, title: 'Prefiero no decirlo',   desc: 'Configuro mi tarifa manualmente' },
]

export default function O3Retencion() {
  const { navigate, setProfile, profile } = useAppStore()
  const isSimple = profile.regimen === 'simple'
  const options  = isSimple ? OPTIONS_SIMPLE : OPTIONS_ORDINARIO

  const [selectedIdx, setSelectedIdx] = useState(null)
  const [showTooltip, setShowTooltip] = useState(false)

  const handleContinue = () => {
    if (selectedIdx === null) return
    setProfile({ retencion: options[selectedIdx].id })
    navigate('O4')
  }

  return (
    <div className="ob-screen">
      {/* Progreso */}
      <div style={{ marginBottom: 'var(--s4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--s2)' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--t-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--txt-m)' }}>Paso 2 de 3</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--t-xs)', fontWeight: 700, color: 'var(--volt-text)' }}>66%</span>
        </div>
        <div className="progress-bar" style={{ margin: 0 }}><div className="progress-fill" style={{ width: '66%' }} /></div>
      </div>

      <div className="ob-screen-main">
        {/* Headline con tooltip opcional */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--s2)', marginBottom: 'var(--s2)' }}>
          <h1 className="ob-question" style={{ marginBottom: 0 }}>
            {isSimple ? '¿Cuánto ganas al año aproximadamente?' : '¿Cuánto te retienen?'}
          </h1>
          {!isSimple && (
            <button
              onClick={() => setShowTooltip(v => !v)}
              style={{ flexShrink: 0, marginTop: 6, background: 'var(--surf-1)', border: '1px solid var(--border)', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--txt-m)', fontSize: 12, fontWeight: 700 }}
              aria-label="Más información sobre la retención"
            >?</button>
          )}
        </div>

        {showTooltip && (
          <div style={{ background: 'var(--surf-1)', border: '1px solid var(--border)', borderRadius: 10, padding: 'var(--s3)', marginBottom: 'var(--s3)', fontSize: 'var(--t-sm)', color: 'var(--txt-m)', fontFamily: 'var(--font-body)', lineHeight: 1.5 }}>
            La retención es un descuento que tu cliente le paga a la DIAN en tu nombre. No es una multa ni un gasto extra — es parte del impuesto que de todas formas deberías pagar.
          </div>
        )}

        <p className="ob-context">
          {isSimple
            ? 'Con esto Quadra estima tu tarifa del Régimen Simple. Puedes ajustarlo después.'
            : 'Tu cliente descuenta este porcentaje antes de transferirte. Lo encuentras en tu factura o contrato.'}
        </p>

        <div className="ob-options">
          {options.map((opt, i) => (
            <div
              key={i}
              className={`ob-option${selectedIdx === i ? ' selected' : ''}`}
              onClick={() => setSelectedIdx(i)}
            >
              <div className="ob-radio">
                {selectedIdx === i && <div className="ob-radio-dot" />}
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
        <button
          className="btn btn-primary btn-full"
          onClick={handleContinue}
          style={{ opacity: selectedIdx === null ? 0.5 : 1 }}
        >
          Continuar
        </button>
      </div>
    </div>
  )
}
