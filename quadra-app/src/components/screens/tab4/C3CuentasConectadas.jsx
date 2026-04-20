import { useAppStore } from '../../../store/useAppStore'

const accounts = [
  { name: 'Bancolombia', type: 'Cuenta ahorros · *4821', status: 'ok', icon: '🏦' },
  { name: 'Wise', type: 'Cuenta USD · valentina@gmail.com', status: 'ok', icon: '💸' },
  { name: 'Nequi', type: 'Billetera digital · *3254', status: 'warn', icon: '📱' },
]

export default function C3CuentasConectadas() {
  const { navigate } = useAppStore()
  return (
    <div>
      <div style={{ padding: 'var(--s4) var(--screen-px)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 'var(--t-xl)', fontWeight: 900, letterSpacing: '-0.04em', fontFamily: 'var(--font-display)', color: 'var(--txt)' }}>Cuentas</span>
        <button className="btn btn-primary btn-sm" onClick={() => navigate('C4')}>+ Agregar</button>
      </div>

      <div className="q-body-inner">
        <div className="tx-list mb5">
          {accounts.map((acc, i) => (
            <div key={i} className="tx-row">
              <div className="tx-icon" style={{ fontSize: 20 }}>{acc.icon}</div>
              <div className="tx-info">
                <div className="tx-name">{acc.name}</div>
                <div className="tx-sub">{acc.type}</div>
              </div>
              <span className={`badge badge-${acc.status === 'ok' ? 'ok' : 'warn'}`}>
                {acc.status === 'ok' ? 'Conectada' : 'Revisar'}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s3)' }}>
          <div className="card" style={{ cursor: 'pointer' }} onClick={() => navigate('C1')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="card-title">Datos personales</div>
                <div className="card-sub">Valentina Gómez · 1.015.432.891</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--txt-m)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
          <div className="card" style={{ cursor: 'pointer' }} onClick={() => navigate('C2')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="card-title">Alertas y notificaciones</div>
                <div className="card-sub">3 de 5 activas</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--txt-m)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
