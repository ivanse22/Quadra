import { useAppStore } from '../../../store/useAppStore'

export default function A5ReservaProyeccion() {
  const { navigate } = useAppStore()
  const fmt = n => '$' + n.toLocaleString('es-CO')
  const months = ['May','Jun','Jul','Ago']
  const vals = [310000, 310000, 310000, 310000]
  const cumulative = vals.reduce((acc, v, i) => [...acc, (acc[i-1] || 1240000) + v], [])
  return (
    <div className="q-body-inner">
      <div className="preview mb5" style={{ padding: 'var(--s5)' }}>
        <div className="preview-eye">Proyección reserva declaración</div>
        <div className="preview-amount">{fmt(cumulative[3])}</div>
        <div className="preview-sub">Estimado para agosto 2026 · si mantienes el ritmo</div>
      </div>
      <div className="card mb5">
        {months.map((m, i) => (
          <div key={i} className="tx-drow" style={i === 3 ? { borderBottom: 'none' } : {}}>
            <span className="tx-drow-l">{m} 2026</span>
            <span className="tx-drow-v" style={{ color: 'var(--fin-reserve)' }}>+{fmt(vals[i])}</span>
          </div>
        ))}
        <div className="card-divider" />
        <div className="tx-drow" style={{ borderBottom: 'none' }}>
          <span className="tx-drow-l" style={{ fontWeight: 700, color: 'var(--txt)' }}>Total agosto</span>
          <span className="tx-drow-v total" style={{ color: 'var(--fin-reserve)' }}>{fmt(cumulative[3])}</span>
        </div>
      </div>
      <button className="btn btn-ghost btn-full" onClick={() => navigate('A4')}>Ver saldo actual</button>
    </div>
  )
}
