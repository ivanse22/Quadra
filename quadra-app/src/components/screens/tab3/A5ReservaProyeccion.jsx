import { useAppStore } from '../../../store/useAppStore'

export default function A5ReservaProyeccion() {
  const { navigate, payments, kpis } = useAppStore()
  const fmt = n => '$' + n.toLocaleString('es-CO')
  const currentYear = new Date().getFullYear()
  const startMonth = new Date().getMonth() + 1
  const reserveBase = Math.max(0, kpis?.reservadoRenta || 0)
  const reservePayments = payments.filter((payment) => {
    return payment.type !== 'pila' && payment.type !== 'renta' && Number(payment.reserva || 0) > 0
  })
  const averageReserve = reservePayments.length > 0
    ? reservePayments.reduce((sum, payment) => sum + (payment.reserva || 0), 0) / reservePayments.length
    : 0
  const monthlyReserve = Math.max(Math.round(averageReserve), 0)
  const monthLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  const projectionRows = Array.from({ length: Math.max(0, 8 - startMonth) }, (_, index) => {
    const monthIndex = startMonth + index
    return {
      label: `${monthLabels[monthIndex]} ${currentYear}`,
      amount: monthlyReserve,
    }
  }).slice(0, 4)
  const cumulative = projectionRows.reduce((acc, row, index) => [...acc, (acc[index - 1] || reserveBase) + row.amount], [])
  const projectedTotal = cumulative[cumulative.length - 1] || reserveBase
  return (
    <div className="q-body-inner">
      <div className="preview mb5" style={{ padding: 'var(--s5)' }}>
        <div className="preview-eye">Proyección reserva declaración</div>
        <div className="preview-amount">{fmt(projectedTotal)}</div>
        <div className="preview-sub">
          {projectionRows.length > 0
            ? `Estimado para ${projectionRows[projectionRows.length - 1].label} · si mantienes el ritmo actual`
            : 'Ya tienes cubierta la proyección principal de este año'}
        </div>
      </div>
      <div className="card mb5">
        {projectionRows.length > 0 ? projectionRows.map((row, i) => (
          <div key={row.label} className="tx-drow" style={i === projectionRows.length - 1 ? { borderBottom: 'none' } : {}}>
            <span className="tx-drow-l">{row.label}</span>
            <span className="tx-drow-v" style={{ color: 'var(--fin-reserve)' }}>+{fmt(row.amount)}</span>
          </div>
        )) : (
          <div className="tx-drow" style={{ borderBottom: 'none' }}>
            <span className="tx-drow-l">Sin meses restantes por proyectar</span>
            <span className="tx-drow-v" style={{ color: 'var(--fin-reserve)' }}>{fmt(reserveBase)}</span>
          </div>
        )}
        <div className="card-divider" />
        <div className="tx-drow" style={{ borderBottom: 'none' }}>
          <span className="tx-drow-l" style={{ fontWeight: 700, color: 'var(--txt)' }}>Total proyectado</span>
          <span className="tx-drow-v total" style={{ color: 'var(--fin-reserve)' }}>{fmt(projectedTotal)}</span>
        </div>
      </div>
      <button className="btn btn-ghost btn-full" onClick={() => navigate('A4')}>Ver saldo actual</button>
    </div>
  )
}
