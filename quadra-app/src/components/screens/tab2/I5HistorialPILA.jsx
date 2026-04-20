// I5 — Historial PILA (destino de CL-02)
import { useAppStore } from '../../../store/useAppStore'

const pilaHistory = [
  { date: 'Abr 2026', amount: 250000, status: 'pending', statusLabel: 'Pendiente' },
  { date: 'Mar 2026', amount: 187500, status: 'ok', statusLabel: 'Al día' },
  { date: 'Feb 2026', amount: 225000, status: 'ok', statusLabel: 'Al día' },
  { date: 'Ene 2026', amount: 187500, status: 'ok', statusLabel: 'Al día' },
  { date: 'Dic 2025', amount: 0, status: 'err', statusLabel: 'Sin ingresos' },
]

export default function I5HistorialPILA() {
  const { navigate } = useAppStore()
  const fmt = n => '$' + n.toLocaleString('es-CO')
  return (
    <div className="q-body-inner">
      <div className="hero-card mb5">
        <div className="hero-eye">Acumulado PILA 2026</div>
        <div className="hero-amount" style={{ color: 'var(--fin-reserve)', fontSize: 'var(--t-2xl)' }}>$850.000</div>
        <div className="hero-sub">4 meses cotizados · promedio $212.500/mes</div>
      </div>

      <div className="tx-list">
        <div className="tx-section-header">Historial de cotizaciones</div>
        {pilaHistory.map((row, i) => (
          <div key={i} className="tx-row" style={{ cursor: 'default' }}>
            <div className="tx-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={row.status === 'err' ? 'var(--fin-deduct)' : 'var(--fin-reserve)'} strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div className="tx-info">
              <div className="tx-name">{row.date}</div>
              <div className="tx-sub">PILA — Salud y Pensión</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
              {row.amount > 0 && <div className="tx-amount" style={{ color: 'var(--fin-reserve)' }}>{fmt(row.amount)}</div>}
              <span className={`badge badge-${row.status === 'ok' ? 'ok' : row.status === 'err' ? 'err' : 'warn'}`}>{row.statusLabel}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'var(--s5)' }}>
        <button className="btn btn-primary btn-full" onClick={() => navigate('D3')}>Pagar PILA — Abr 2026</button>
      </div>
    </div>
  )
}
