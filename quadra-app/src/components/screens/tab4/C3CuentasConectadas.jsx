import { useAppStore } from '../../../store/useAppStore'
import { useMemo } from 'react'

export default function C3CuentasConectadas() {
  const { navigate, payments, profile, alerts } = useAppStore()
  const accounts = useMemo(() => {
    const accountMap = new Map()
    payments.forEach((payment) => {
      if (payment.currency && payment.currency !== 'COP') {
        accountMap.set('wise', { id: 'wise', name: 'Wise', type: `Cuenta ${payment.currency} · pagos internacionales`, status: 'ok', icon: '💸' })
      }
      if (payment.method === 'Transferencia') {
        accountMap.set('bank', { id: 'bank', name: 'Cuenta bancaria', type: 'Transferencias en COP registradas', status: 'ok', icon: '🏦' })
      }
      if (payment.method === 'PSE' || payment.type === 'pila') {
        accountMap.set('pse', { id: 'pse', name: 'PSE', type: 'Usada para pagos de PILA', status: 'ok', icon: '🛡️' })
      }
    })
    if (accountMap.size === 0) {
      accountMap.set('pending', { id: 'pending', name: 'Sin cuentas conectadas aún', type: 'Conecta una cuenta para ver aquí tus métodos frecuentes', status: 'warn', icon: '🏛️' })
    }
    return [...accountMap.values()]
  }, [payments])
  const activeAlerts = Object.values(alerts || {}).filter(Boolean).length
  return (
    <div>
      <div style={{ padding: 'var(--s4) var(--screen-px)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 'var(--t-xl)', fontWeight: 900, letterSpacing: '-0.04em', fontFamily: 'var(--font-display)', color: 'var(--txt)' }}>Cuentas</span>
        <button className="btn btn-primary btn-sm" onClick={() => navigate('C4')}>+ Agregar</button>
      </div>

      <div className="q-body-inner">
        <div className="tx-list mb5">
          {accounts.map((acc, i) => (
            <div key={i} className="tx-row compact-row" role="listitem">
              <div className="tx-icon" style={{ fontSize: 20 }}>{acc.icon}</div>
              <div className="tx-info compact-row-info">
                <div className="tx-name compact-row-name">{acc.name}</div>
                <div className="tx-sub compact-row-sub">{acc.type}</div>
              </div>
              <div className="compact-row-side">
                <span className={`badge compact-row-status badge-${acc.status === 'ok' ? 'ok' : 'warn'}`}>
                  {acc.status === 'ok' ? 'Conectada' : 'Revisar'}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s3)' }}>
          <button type="button" className="card" style={{ cursor: 'pointer', width: '100%', textAlign: 'left' }} onClick={() => navigate('C1')}>
            <div className="settings-link-row">
              <div className="settings-link-copy">
                <div className="card-title">Datos personales</div>
                <div className="card-sub">{profile?.name || 'Tu perfil'} · {profile?.tipo_ingreso || 'Sin régimen definido'}</div>
              </div>
              <svg className="settings-link-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </button>
          <button type="button" className="card" style={{ cursor: 'pointer', width: '100%', textAlign: 'left' }} onClick={() => navigate('C2')}>
            <div className="settings-link-row">
              <div className="settings-link-copy">
                <div className="card-title">Alertas y notificaciones</div>
                <div className="card-sub">{activeAlerts} de {Object.keys(alerts || {}).length} activas</div>
              </div>
              <svg className="settings-link-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
