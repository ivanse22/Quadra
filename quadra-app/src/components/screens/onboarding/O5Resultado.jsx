import { useAppStore } from '../../../store/useAppStore'
import { QuadraLogo } from '../../ui/Icons'

export default function O5Resultado() {
  const { switchTab, navigate, profile } = useAppStore()
  const regimenLabel = { simple: 'Simple', ordinario: 'Ordinario', unclear: 'Por definir' }[profile.regimen] || 'Ordinario'
  const retencionLabel = profile.retencion === 'other' ? 'Personalizado' : `${profile.retencion || 11}%`
  const pilaLabel = { auto: 'Auto 12.5%', manual: 'Manual', no: 'No aún' }[profile.pila] || 'Auto 12.5%'

  const goHome = () => switchTab(0) // resets to D1 + activeTab=0

  return (
    <div className="ob-result">
      <div className="ob-result-icon">
        <QuadraLogo size={32} color="var(--txt)" />
      </div>
      <h1 className="ob-result-title">¡Todo listo,<br />Valentina!</h1>
      <p className="ob-result-desc">
        Quadra ya sabe cómo calcular tu disponible real. Registra tu primer pago o explora el resumen.
      </p>

      {/* Profile summary card */}
      <div className="ob-result-card" style={{ width: '100%' }}>
        <div className="ob-result-card-lbl">Tu perfil Quadra</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s2)', marginTop: 'var(--s3)' }}>
          {[
            { label: 'Régimen', value: regimenLabel },
            { label: 'Retención', value: retencionLabel },
            { label: 'PILA', value: pilaLabel },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--t-xs)' }}>
              <span style={{ color: 'var(--txt-m)', fontFamily: 'var(--font-body)' }}>{row.label}</span>
              <span style={{ fontWeight: 700, fontFamily: 'var(--font-display)' }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s3)', width: '100%', marginTop: 'auto', paddingTop: 'var(--s5)' }}>
        <button className="btn btn-primary btn-full" onClick={() => navigate('I2')}>
          + Registrar mi primer pago
        </button>
        <button className="btn btn-ghost btn-full" onClick={goHome}>
          Ver el resumen →
        </button>
      </div>
    </div>
  )
}
