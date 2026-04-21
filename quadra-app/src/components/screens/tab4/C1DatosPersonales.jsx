import { useAppStore } from '../../../store/useAppStore'
import { supabase } from '../../../lib/supabase'

export default function C1DatosPersonales() {
  const { profile, session } = useAppStore()
  const fields = [
    { label: 'Nombre', value: profile.name || 'Valentina Gómez' },
    { label: 'Régimen', value: { simple: 'Régimen Simple', ordinario: 'Régimen Ordinario', unclear: 'Sin definir' }[profile.regimen] || 'Régimen Ordinario' },
    { label: 'Retención habitual', value: `${profile.retencion || 11}%` },
    { label: 'PILA', value: { auto: 'Automático 12.5%', manual: 'Manual', no: 'No aplica' }[profile.pila] || 'Automático 12.5%' },
    { label: 'Email', value: session?.user?.email || 'Pendiente por conectar' },
    { label: 'NIT / Cédula', value: profile.document || 'Pendiente por completar' },
  ]
  return (
    <div className="q-body-inner">
      <div className="section-head mb5">
        <span className="section-kicker">Mi perfil fiscal</span>
        <h2 className="section-title">Tus datos de configuración</h2>
        <p className="section-desc">Quadra usa esta información para calcular tu disponible real y adaptar tus recordatorios.</p>
      </div>
      <div className="card">
        {fields.map((f, i) => (
          <div key={i} className="tx-drow" style={i === fields.length - 1 ? { borderBottom: 'none' } : {}}>
            <span className="tx-drow-l">{f.label}</span>
            <span className="tx-drow-v">{f.value}</span>
          </div>
        ))}
      </div>
      <div className="account-actions">
        <button className="btn btn-secondary btn-full">Editar datos</button>
        <button className="btn btn-danger btn-full" onClick={async () => await supabase.auth.signOut()}>
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}
