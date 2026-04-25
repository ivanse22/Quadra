import { useAppStore } from '../../../store/useAppStore'
import { toSafeDate } from '../../../lib/dateUtils'

export default function I4TotalGanado() {
  const { navigate, payments } = useAppStore()
  const currentYear = new Date().getFullYear()
  const fmt = n => '$' + n.toLocaleString('es-CO')
  const currentYearPayments = payments.filter((payment) => {
    const date = toSafeDate(payment.date)
    return date && date.getFullYear() === currentYear && payment.type !== 'renta' && payment.type !== 'pila'
  })
  const disponibleAcumulado = currentYearPayments.reduce((sum, payment) => sum + (payment.disponible || 0), 0)
  const brutoAnual = currentYearPayments.reduce((sum, payment) => sum + (payment.gross || 0), 0)
  const totalReservado = currentYearPayments.reduce((sum, payment) => sum + (payment.pila || 0) + (payment.reserva || 0) + (payment.retencion || 0), 0)
  const kpiRows = [
    { label: 'Disponible acumulado', val: fmt(disponibleAcumulado || 0), color: 'var(--volt-text)' },
    { label: `Bruto YTD ${currentYear}`, val: fmt(brutoAnual || 0), color: 'var(--txt)' },
    { label: 'Separado en obligaciones', val: fmt(totalReservado), color: 'var(--fin-reserve)' },
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
      <button className="btn btn-secondary btn-full" onClick={() => navigate('A3')}>Volver al resumen anual</button>
    </div>
  )
}
