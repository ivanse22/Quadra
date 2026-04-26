// I5 — Historial PILA (destino de CL-02)
import { useMemo } from 'react'
import { useAppStore } from '../../../store/useAppStore'
import { toSafeDate } from '../../../lib/dateUtils'

const MONTH_LABELS     = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const MONTH_LABELS_FULL = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

const fmt = (n) => '$' + Math.round(n || 0).toLocaleString('es-CO')

export default function I5HistorialPILA() {
  const { navigate, payments, kpis } = useAppStore()
  const now          = new Date()
  const currentYear  = now.getFullYear()
  const currentMonth = now.getMonth()

  const pilaPayments = useMemo(() =>
    payments
      .filter((p) => p.type === 'pila' && p.date)
      .map((p) => {
        const date = toSafeDate(p.date)
        return date ? { payment: p, date } : null
      })
      .filter(Boolean)
      .sort((a, b) => b.date - a.date),
    [payments]
  )

  const currentPending    = Math.max(0, kpis?.reservadoPila || 0)
  const paidThisYear      = pilaPayments
    .filter(({ date }) => date.getFullYear() === currentYear)
    .reduce((sum, { payment }) => sum + (payment.pila || 0), 0)
  const monthsPaidThisYear = pilaPayments
    .filter(({ date }) => date.getFullYear() === currentYear).length
  const averagePaid       = monthsPaidThisYear > 0
    ? Math.round(paidThisYear / monthsPaidThisYear) : 0

  // Set of months (0-indexed) with PILA paid this year
  const paidMonthsSet = useMemo(() => {
    const s = new Set()
    pilaPayments
      .filter(({ date }) => date.getFullYear() === currentYear)
      .forEach(({ date }) => s.add(date.getMonth()))
    return s
  }, [pilaPayments, currentYear])

  // Historia para la lista
  const pilaHistory = useMemo(() => [
    ...(currentPending > 0 ? [{
      id:          `pending-${currentYear}-${currentMonth}`,
      dateLabel:   `${MONTH_LABELS_FULL[currentMonth]} ${currentYear}`,
      amount:      currentPending,
      status:      'pending',
      statusLabel: 'Pendiente',
      pilaDetalle: null,
    }] : []),
    ...pilaPayments.map(({ payment, date }) => ({
      id:          payment.id,
      dateLabel:   payment.periodLabel || `${MONTH_LABELS_FULL[date.getMonth()]} ${date.getFullYear()}`,
      amount:      payment.pila || 0,
      status:      'ok',
      statusLabel: 'Pagado',
      pilaDetalle: payment.pilaDetalle || null,
    })),
  ], [pilaPayments, currentPending, currentYear, currentMonth])

  const ctaLabel = currentPending > 0
    ? `Pagar PILA · ${MONTH_LABELS[currentMonth]} ${currentYear}`
    : 'Revisar pago PILA actual'

  // Estado de cada mes para el grid
  const monthStatus = (mo) => {
    if (mo > currentMonth) return 'future'
    if (paidMonthsSet.has(mo)) return 'paid'
    if (mo === currentMonth && currentPending > 0) return 'pending'
    if (mo === currentMonth) return 'future'
    return 'future'
  }

  return (
    <div className="q-body-inner">

      {/* ── Hero ── */}
      <div className="hero-card mb5">
        <div className="hero-eye">Seguridad social {currentYear}</div>
        <div className="hero-amount" style={{ color: 'var(--fin-reserve)', fontSize: 'var(--t-2xl)' }}>
          {fmt(paidThisYear + currentPending)}
        </div>
        <div style={{ display: 'flex', gap: 'var(--s4)', marginTop: 'var(--s2)', flexWrap: 'wrap' }}>
          <div style={{ fontSize: 'var(--t-xs)', color: 'var(--txt-m)', fontFamily: 'var(--font-body)' }}>
            <span style={{ fontWeight: 700, color: 'var(--txt-2)' }}>{monthsPaidThisYear}</span>
            {' '}
            {monthsPaidThisYear === 1 ? 'mes pagado' : 'meses pagados'}
          </div>
          {averagePaid > 0 && (
            <div style={{ fontSize: 'var(--t-xs)', color: 'var(--txt-m)', fontFamily: 'var(--font-body)' }}>
              Promedio <span style={{ fontWeight: 700, color: 'var(--txt-2)' }}>{fmt(averagePaid)}</span>/mes
            </div>
          )}
          {currentPending > 0 && (
            <div style={{ fontSize: 'var(--t-xs)', fontFamily: 'var(--font-body)', color: 'var(--fin-reserve)', fontWeight: 700 }}>
              {fmt(currentPending)} pendiente
            </div>
          )}
        </div>

        {/* Grid de 12 meses */}
        <div className="pila-month-grid">
          {MONTH_LABELS.map((label, mo) => {
            const st = monthStatus(mo)
            return (
              <div key={mo} className="pila-month-cell">
                <div className={`pila-month-dot pila-month-dot--${st}`}>
                  {st === 'paid' && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--fin-income)" strokeWidth="3">
                      <polyline points="20,6 9,17 4,12" />
                    </svg>
                  )}
                  {st === 'pending' && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--fin-reserve)" strokeWidth="3">
                      <circle cx="12" cy="12" r="1" fill="var(--fin-reserve)" /><circle cx="7" cy="12" r="1" fill="var(--fin-reserve)" /><circle cx="17" cy="12" r="1" fill="var(--fin-reserve)" />
                    </svg>
                  )}
                </div>
                <div className={`pila-month-label pila-month-label--${st === 'future' ? '' : st}`}>{label}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Lista de cotizaciones ── */}
      <div className="tx-list">
        <div className="tx-section-header">Historial de cotizaciones</div>

        {pilaHistory.length === 0 ? (
          <div className="q-empty" style={{ padding: 'var(--s6) var(--s5)' }}>
            <div className="q-empty-visual">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--txt-f)" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h2 className="q-empty-headline">Sin historial PILA</h2>
            <p className="q-empty-desc">Cuando registres tu primer pago de seguridad social, verás aquí el historial mensual.</p>
          </div>
        ) : pilaHistory.map((row) => {
          const isPending = row.status === 'pending'
          const hasSub = row.pilaDetalle
            ? `Salud ${fmt(row.pilaDetalle.salud)} · Pensión ${fmt(row.pilaDetalle.pension)} · ARL ${fmt(row.pilaDetalle.arl)}`
            : 'PILA — Salud, Pensión y ARL'
          return (
            <div
              key={row.id}
              className={`tx-row compact-row${isPending ? ' pila-row-pending' : ''}`}
              style={{ cursor: 'default' }}
            >
              <div className="tx-icon" style={{ background: isPending ? 'rgba(180,83,9,0.08)' : 'var(--surf-1)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke={isPending ? 'var(--fin-reserve)' : 'var(--fin-income)'} strokeWidth="2.5">
                  {isPending
                    ? <circle cx="12" cy="12" r="9" />
                    : <polyline points="20,6 9,17 4,12" />
                  }
                </svg>
              </div>
              <div className="tx-info compact-row-info">
                <div className="tx-name compact-row-name" style={{ color: isPending ? 'var(--fin-reserve)' : 'var(--txt)' }}>
                  {row.dateLabel}
                </div>
                <div className="tx-sub compact-row-sub" style={{ fontSize: 'var(--t-xs)' }}>{hasSub}</div>
              </div>
              <div className="compact-row-side">
                {row.amount > 0 && (
                  <div className="compact-row-amount-main" style={{ color: 'var(--fin-reserve)' }}>
                    {fmt(row.amount)}
                  </div>
                )}
                <span className={`badge compact-row-status badge-${row.status === 'ok' ? 'ok' : 'warn'}`}>
                  {row.statusLabel}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: 'var(--s5)' }}>
        <button className="btn btn-primary btn-full" onClick={() => navigate('D3')}>
          {ctaLabel}
        </button>
      </div>
    </div>
  )
}
