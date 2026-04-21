import { useAppStore } from '../../../store/useAppStore'
import { supabase } from '../../../lib/supabase'

export default function O5Resultado() {
  const { switchTab, navigate, profile, session } = useAppStore()

  const firstName = (profile.name || 'tú').split(' ')[0]

  const regimenLabel =
    profile.regimen === 'simple'  ? 'Régimen Simple' :
    profile.regimen === 'unclear' ? 'Régimen por definir' :
                                    'Régimen Ordinario'

  const retencionLabel =
    profile.retencion === 0 || profile.retencion === undefined
      ? 'Sin retención'
      : `Retención ${profile.retencion}%`

  const pilaLabel =
    profile.pila === 'auto'   ? 'Salud y pensión automático' :
    profile.pila === 'manual' ? 'Salud y pensión manual' :
                                'Sin cotización activa'

  const saveProfile = async () => {
    if (session && !session.mock && session.user?.id) {
      const { error } = await supabase.from('profiles').upsert({
        id:            session.user.id,
        name:          profile.name,
        regimen:       profile.regimen,
        tipo_ingreso:  profile.tipo_ingreso,
        es_declarante: profile.es_declarante,
        retencion:     profile.retencion,
        pila:          profile.pila,
        updated_at:    new Date().toISOString(),
      })
      if (error) console.error('[Quadra] O5 upsert profile:', error.message)
    }
  }

  const handleRegister = async () => {
    await saveProfile()
    navigate('I2')
  }

  const handleExplore = async () => {
    await saveProfile()
    switchTab(0)
  }

  return (
    <div className="ob-result">
      <div className="ob-result-head">
        {/* Animated check icon */}
        <div style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'var(--volt-dim)',
          border: '2px solid var(--volt-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 'var(--s4)',
          animation: 'badgeBounce 560ms var(--ease-spring) 120ms both',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--volt-text)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20,6 9,17 4,12" />
          </svg>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 8vw, 2.8rem)',
          fontWeight: 900,
          letterSpacing: '-0.04em',
          lineHeight: 1.0,
          color: 'var(--txt)',
          marginBottom: 'var(--s3)',
          textAlign: 'center',
        }}>
          Todo quadra,<br />
          <span style={{ color: 'var(--volt-text)' }}>{firstName}.</span>
        </h1>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--t-sm)',
          color: 'var(--txt-m)',
          textAlign: 'center',
          lineHeight: 1.5,
          marginBottom: 'var(--s2)',
        }}>
          Así quedó tu configuración:
        </p>
      </div>

      {/* Summary card */}
      <div className="ob-result-card">
        {[regimenLabel, retencionLabel, pilaLabel].map((line, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--s2)',
              paddingTop: i > 0 ? 'var(--s2)' : 0,
              paddingBottom: i < 2 ? 'var(--s2)' : 0,
              borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--volt-text)" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="20,6 9,17 4,12" />
            </svg>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--t-sm)', color: 'var(--txt)', fontWeight: 500 }}>
              {line}
            </span>
          </div>
        ))}
      </div>

      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--t-xs)',
        color: 'var(--txt-m)',
        textAlign: 'center',
        marginTop: 'var(--s3)',
        lineHeight: 1.45,
      }}>
        Puedes cambiar esto cuando quieras en Mi Cuenta.
      </p>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s3)', width: '100%', marginTop: 'auto', paddingTop: 'var(--s5)' }}>
        <button className="btn btn-primary btn-full" onClick={handleRegister}>
          Registrar mi primer pago
        </button>
        <button className="btn btn-ghost btn-full" onClick={handleExplore}>
          Explorar primero
        </button>
      </div>
    </div>
  )
}
