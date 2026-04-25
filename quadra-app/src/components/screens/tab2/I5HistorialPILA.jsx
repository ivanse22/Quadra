// I5 — Historial PILA (destino de CL-02)
import { useAppStore } from '../../../store/useAppStore'
import { toSafeDate } from '../../../lib/dateUtils'

const MONTH_LABELS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

export default function I5HistorialPILA() {
  const { navigate, payments, kpis } = useAppStore()
  const fmt = n => '$' + n.toLocaleString('es-CO')
  const now = new Date()
  const currentYear = now.getFullYear()
  const pilaPayments = payments
    .filter((payment) => payment.type === 'pila' && payment.date)
    .map((payment) => {
      const date = toSafeDate(payment.date)
      return date ? { payment, date } : null
    })
    .filter(Boolean)
    .sort((left, right) => right.date - left.date)

  const currentPending = Math.max(0, kpis?.reservadoPila || 0)
  const pilaHistory = [
    ...(currentPending > 0 ? [{
      id: `pending-${currentYear}-${now.getMonth()}`,
      dateLabel: `${MONTH_LABELS[now.getMonth()]} ${currentYear}`,
      amount: currentPending,
      status: 'pending',
      statusLabel: 'Pendiente',
    }] : []),
    ...pilaPayments.map(({ payment, date }) => ({
      id: payment.id,
      dateLabel: payment.periodLabel || `${MONTH_LABELS[date.getMonth()]} ${date.getFullYear()}`,
      amount: payment.pila || 0,
      status: 'ok',
      statusLabel: 'Pagado',
    })),
  ]
  const paidThisYear = pilaPayments
    .filter(({ date }) => date.getFullYear() === currentYear)
    .reduce((sum, { payment }) => sum + (payment.pila || 0), 0)
  const monthsPaidThisYear = pilaPayments.filter(({ date }) => date.getFullYear() === currentYear).length
  const averagePaid = monthsPaidThisYear > 0 ? Math.round(paidThisYear / monthsPaidThisYear) : 0
  const ctaLabel = currentPending > 0 ? `Pagar PILA pendiente · ${MONTH_LABELS[now.getMonth()]} ${currentYear}` : 'Revisar pago PILA actual'

  return (
    <div className="q-body-inner">
      <div className="hero-card mb5">
        <div className="hero-eye">Historial PILA {currentYear}</div>
        <div className="hero-amount" style={{ color: 'var(--fin-reserve)', fontSize: 'var(--t-2xl)' }}>{fmt(paidThisYear + currentPending)}</div>
        <div className="hero-sub">
          {monthsPaidThisYear > 0
            ? `${monthsPaidThisYear} ${monthsPaidThisYear === 1 ? 'mes registrado' : 'meses registrados'} · promedio ${fmt(averagePaid)}/mes`
            : 'Aún no has pagado PILA este año'}
        </div>
      </div>

      <div className="tx-list">
        <div className="tx-section-header">Historial de cotizaciones</div>
        {pilaHistory.length === 0 ? (
          <div className="q-empty" style={{ padding: 'var(--s6) var(--s5)' }}>
            <div className="q-empty-visual">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--txt-f)" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </div>
            <h2 className="q-empty-headline">Sin historial PILA</h2>
            <p className="q-empty-desc">Cuando registres tu primer pago de seguridad social, verás aquí el historial mensual.</p>
          </div>
        ) : pilaHistory.map((row) => (
          <div key={row.id} className="tx-row compact-row" style={{ cursor: 'default' }}>
            <div className="tx-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={row.status === 'err' ? 'var(--fin-deduct)' : 'var(--fin-reserve)'} strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div className="tx-info compact-row-info">
              <div className="tx-name compact-row-name">{row.dateLabel}</div>
              <div className="tx-sub compact-row-sub">PILA — Salud y Pensión</div>
            </div>
            <div className="compact-row-side">
              {row.amount > 0 && <div className="compact-row-amount-main" style={{ color: 'var(--fin-reserve)' }}>{fmt(row.amount)}</div>}
              <span className={`badge compact-row-status badge-${row.status === 'ok' ? 'ok' : row.status === 'err' ? 'err' : 'warn'}`}>{row.statusLabel}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'var(--s5)' }}>
        <button className="btn btn-primary btn-full" onClick={() => navigate('D3')}>{ctaLabel}</button>
      </div>
    </div>
  )
}
