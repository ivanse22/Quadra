import { useAppStore } from '../../../store/useAppStore'
import { supabase } from '../../../lib/supabase'

export default function C1DatosPersonales() {
  const { profile } = useAppStore()
  const fields = [
    { label: 'Nombre', value: profile.name || 'Valentina Gómez' },
    { label: 'Régimen', value: { simple: 'Régimen Simple', ordinario: 'Régimen Ordinario', unclear: 'Sin definir' }[profile.regimen] || 'Régimen Ordinario' },
    { label: 'Retención habitual', value: `${profile.retencion || 11}%` },
    { label: 'PILA', value: { auto: 'Automático 12.5%', manual: 'Manual', no: 'No aplica' }[profile.pila] || 'Automático 12.5%' },
    { label: 'Email', value: 'valentina@gmail.com' },
    { label: 'NIT / Cédula', value: '1.015.432.891' },
  ]
  return (
    <div className="q-body-inner">
      <div className="card">
        {fields.map((f, i) => (
          <div key={i} className="tx-drow" style={i === fields.length - 1 ? { borderBottom: 'none' } : {}}>
            <span className="tx-drow-l">{f.label}</span>
            <span className="tx-drow-v">{f.value}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 'var(--s5)', display: 'flex', flexDirection: 'column', gap: 'var(--s3)' }}>
        <button className="btn btn-secondary btn-full">Editar datos</button>
        <button 
          className="btn btn-full" 
          style={{ 
            height: 52,
            background: 'var(--fin-deduct-dim)',
            color: 'var(--fin-deduct)',
            border: '1.5px solid var(--fin-deduct-border)',
            borderRadius: 'var(--r-full)',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 'var(--t-md)',
            transition: 'all var(--motion-fast) var(--ease-out)',
          }}
          onClick={async () => await supabase.auth.signOut()}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}
