import { useAppStore } from '../../../store/useAppStore'
import { toSafeDate } from '../../../lib/dateUtils'

export default function A4ReservaSaldo() {
  const { navigate, payments, kpis } = useAppStore()
  const fmt = n => '$' + n.toLocaleString('es-CO')
  const currentYear = new Date().getFullYear()
  const incomePayments = payments.filter((payment) => {
    if (payment.type === 'pila' || payment.type === 'renta' || !payment.date) return false
    const date = toSafeDate(payment.date)
    return date && date.getFullYear() === currentYear
  })
  const reserveTotal = Math.max(0, kpis?.reservadoRenta || 0)
  const monthsWithReserve = incomePayments.filter((payment) => (payment.reserva || 0) > 0).length
  const averageReserve = monthsWithReserve > 0
    ? incomePayments.reduce((sum, payment) => sum + (payment.reserva || 0), 0) / monthsWithReserve
    : 0
  const target = Math.max(reserveTotal, averageReserve * 8, 1000000)
  const progress = target > 0 ? Math.min(100, Math.round((reserveTotal / target) * 100)) : 0
  const dueLabel = `Ago ${currentYear}`

  return (
    <div className="q-body-inner">
      <div className="hero-card mb5">
        <div className="hero-eye">Saldo reserva declaración</div>
        <div className="hero-amount" style={{ color: 'var(--fin-reserve)', fontSize: 'var(--t-2xl)' }}>{fmt(reserveTotal)}</div>
        <div className="hero-sub">
          {monthsWithReserve > 0
            ? `${monthsWithReserve} ${monthsWithReserve === 1 ? 'mes con ahorro' : 'meses con ahorro'} · actualización al día`
            : 'Empieza a separar renta para ver tu progreso aquí'}
        </div>
        <div className="hero-breakdown">
          <div><div className="hero-bk-lbl">Meta sugerida</div><div className="hero-bk-val">{fmt(Math.round(target))}</div></div>
          <div><div className="hero-bk-lbl">Progreso</div><div className="hero-bk-val">{progress}%</div></div>
          <div><div className="hero-bk-lbl">Vence</div><div className="hero-bk-val">{dueLabel}</div></div>
        </div>
      </div>
      <button className="btn btn-secondary btn-full" onClick={() => navigate('A5')}>Ver proyección</button>
    </div>
  )
}
