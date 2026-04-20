import { useAppStore } from '../../../store/useAppStore'

export default function I4TotalGanado() {
  const { navigate, kpis } = useAppStore()
  const fmt = n => '$' + n.toLocaleString('es-CO')
  const totalReservado = (kpis?.reservadoRenta || 0) + (kpis?.reservadoPila || 0)
  const kpiRows = [
    { label: 'Disponible real hoy', val: fmt(kpis?.disponibleHoy || 0), color: 'var(--volt-text)' },
    { label: 'Total YTD 2026', val: fmt(kpis?.ytd || 0), color: 'var(--txt)' },
    { label: 'Reservado Total', val: fmt(totalReservado), color: 'var(--fin-reserve)' },
  ]
  return (
    <div className="q-body-inner">
      <div className="card mb6">
        {kpiRows.map((row, i) => (
          <div key={i} className="tx-drow" style={i === kpiRows.length - 1 ? { borderBottom: 'none' } : {}}>
            <span className="tx-drow-l">{row.label}</span>
            <span className="tx-drow-v" style={{ color: row.color, fontSize: 'var(--t-md)', fontWeight: 900 }}>{row.val}</span>
          </div>
        ))}
      </div>
      {/* CL-03 reverse link */}
      <button className="btn btn-secondary btn-full" onClick={() => navigate('A3')}>Ver resumen anual</button>
    </div>
  )
}
