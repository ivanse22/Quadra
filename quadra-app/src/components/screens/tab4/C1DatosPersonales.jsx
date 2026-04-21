import { useAppStore } from '../../../store/useAppStore'
import { supabase } from '../../../lib/supabase'

export default function C1DatosPersonales() {
  const { profile, session, setSession, showToast } = useAppStore()
  const fields = [
    { label: 'Nombre', value: profile.name || 'Valentina Gómez' },
    { label: 'Régimen', value: { simple: 'Régimen Simple', ordinario: 'Régimen Ordinario', unclear: 'Sin definir' }[profile.regimen] || 'Régimen Ordinario' },
    { label: 'Retención habitual', value: `${profile.retencion || 11}%` },
    { label: 'PILA', value: { auto: 'Automático 12.5%', manual: 'Manual', no: 'No aplica' }[profile.pila] || 'Automático 12.5%' },
    { label: 'Email', value: session?.user?.email || 'Pendiente por conectar' },
    { label: 'NIT / Cédula', value: profile.document || 'Pendiente por completar' },
  ]

  const handleSignOut = async () => {
    try {
      if (session?.mock) {
        setSession(null)
      } else {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
      }
      showToast({ type: 'success', message: 'Sesión cerrada correctamente' })
    } catch (error) {
      console.error('Error cerrando sesión:', error)
      showToast({ type: 'error', message: 'No fue posible cerrar sesión' })
    }
  }

  return (
    <div className="q-body-inner">
      <div style={{ marginBottom: 'var(--s5)' }}>
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '.12em',
            color: 'var(--txt-m)',
            marginBottom: 'var(--s2)',
          }}
        >
          Mi perfil fiscal
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--t-lg)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            color: 'var(--txt)',
            lineHeight: 1.12,
            marginBottom: 'var(--s2)',
          }}
        >
          Tus datos de configuracion
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--t-sm)',
            color: 'var(--txt-m)',
            lineHeight: 1.6,
          }}
        >
          Quadra usa esta informacion para calcular tu disponible real y adaptar tus recordatorios.
        </p>
      </div>
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
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(220,38,38,0.10)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--fin-deduct-dim)' }}
          onClick={handleSignOut}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}
