import { useMemo } from 'react'
import { useAppStore } from '../../../store/useAppStore'
import { getPaymentDateLabel, toSafeDate } from '../../../lib/dateUtils'

const MONTH_LABELS_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const fmtCurrency = (n) => '$' + Math.round(n || 0).toLocaleString('es-CO')
const fmtCompact = (n) => {
  if (!n) return '$0'
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}k`
  return fmtCurrency(n)
}

export default function A3TotalAnio() {
  const { navigate, payments, monthlyData } = useAppStore()
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()

  const summary = useMemo(() => {
    const currentYearPayments = payments.filter((payment) => {
      const date = toSafeDate(payment.date)
      return date && date.getFullYear() === currentYear
    })

    const incomePayments = currentYearPayments.filter((payment) => payment.type !== 'pila' && payment.type !== 'renta')
    const latestPayment = incomePayments[0] || null
    const grossTotal = incomePayments.reduce((sum, payment) => sum + (payment.gross || 0), 0)
    const retencionTotal = incomePayments.reduce((sum, payment) => sum + (payment.retencion || 0), 0)
    const pilaTotal = incomePayments.reduce((sum, payment) => sum + (payment.pila || 0), 0)
    const reservaTotal = incomePayments.reduce((sum, payment) => sum + (payment.reserva || 0), 0)
    const disponibleTotal = incomePayments.reduce((sum, payment) => sum + (payment.disponible || 0), 0)

    const realMonths = monthlyData.filter((month) => !month.projected && month.amount > 0)
    const monthsWithIncome = realMonths.length
    const firstMonthIdx = monthlyData.findIndex((month) => month.amount > 0)
    const rangeLabel = firstMonthIdx >= 0
      ? `YTD · ${MONTH_LABELS_SHORT[firstMonthIdx]} - ${MONTH_LABELS_SHORT[currentMonth]} ${currentYear}`
      : `YTD · ${currentYear}`

    const bestMonth = monthlyData.reduce((best, month) => (
      month.amount > (best?.amount || 0) ? month : best
    ), null)

    return {
      grossTotal,
      retencionTotal,
      pilaTotal,
      reservaTotal,
      disponibleTotal,
      paymentCount: incomePayments.length,
      rangeLabel,
      averageMonth: monthsWithIncome > 0 ? grossTotal / monthsWithIncome : 0,
      bestMonthLabel: bestMonth?.amount
        ? `${bestMonth.month} · ${fmtCompact(bestMonth.amount)}`
        : 'Sin ingresos aun',
      latestPaymentLabel: latestPayment
        ? `${latestPayment.client} · ${getPaymentDateLabel(latestPayment)}`
        : 'Aun no has registrado pagos este año',
    }
  }, [payments, monthlyData, currentMonth, currentYear])

  const breakdownRows = [
    { label: 'Ingresado bruto', value: fmtCurrency(summary.grossTotal), color: 'var(--txt)' },
    { label: 'Retención total', value: `-${fmtCurrency(summary.retencionTotal)}`, color: 'var(--fin-deduct)' },
    { label: 'PILA total', value: `-${fmtCurrency(summary.pilaTotal)}`, color: 'var(--fin-reserve)' },
    { label: 'Reserva renta', value: `-${fmtCurrency(summary.reservaTotal)}`, color: 'var(--fin-reserve)' },
  ]

  return (
    <div className="q-body-inner">
      <div className="hero-card mb5">
        <div className="hero-eye">{summary.rangeLabel}</div>
        <div
          className="hero-amount"
          style={{
            fontSize: 'var(--t-hero)',
            fontWeight: 900,
            lineHeight: 0.92,
            letterSpacing: '-0.05em',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {fmtCurrency(summary.grossTotal)}
        </div>
        <div className="hero-sub">
          {summary.paymentCount > 0
            ? `Ingresado bruto real · ${summary.paymentCount} ${summary.paymentCount === 1 ? 'pago registrado' : 'pagos registrados'}`
            : 'Este resumen se llenara con tus pagos del año.'}
        </div>
        <div className="hero-breakdown">
          <div>
            <div className="hero-bk-lbl">Disponible acumulado</div>
            <div className="hero-bk-val" style={{ color: 'var(--volt-text)' }}>{fmtCurrency(summary.disponibleTotal)}</div>
          </div>
          <div>
            <div className="hero-bk-lbl">Retención total</div>
            <div className="hero-bk-val" style={{ color: 'var(--fin-deduct)' }}>{fmtCurrency(summary.retencionTotal)}</div>
          </div>
          <div>
            <div className="hero-bk-lbl">PILA separada</div>
            <div className="hero-bk-val" style={{ color: 'var(--fin-reserve)' }}>{fmtCurrency(summary.pilaTotal)}</div>
          </div>
        </div>
      </div>

      <div className="desglose mb5">
        <div className="card-title">Desglose del total anual</div>
        <div className="card-sub" style={{ marginTop: 'var(--s1)' }}>
          Lo que ingreso, lo que separaste y lo que realmente puedes contar como disponible acumulado.
        </div>
        <div style={{ marginTop: 'var(--s4)' }}>
          {breakdownRows.map((row) => (
            <div key={row.label} className="tx-drow">
              <div className="tx-drow-l" style={{ color: 'var(--txt-2)' }}>{row.label}</div>
              <div className="tx-drow-v" style={{ color: row.color }}>{row.value}</div>
            </div>
          ))}
        </div>
        <div className="card-sub" style={{ marginTop: 'var(--s4)' }}>
          Disponible acumulado = ingreso bruto menos retención, PILA y reserva que ya separaste este año.
        </div>
        <div className="dtotal">
          <div className="dtotal-l">Disponible real acumulado</div>
          <div className="dtotal-v">{fmtCurrency(summary.disponibleTotal)}</div>
        </div>
      </div>

      <div className="card mb5 annual-insights-card">
        <div className="annual-insights-head">
          <div className="card-title">Lectura rápida del año</div>
        </div>
        <div className="annual-insights-divider" />
        <div className="annual-insights-list">
          <div className="annual-insight-row">
            <div className="annual-insight-copy">
              <div className="annual-insight-label">Mejor mes</div>
              <div className="annual-insight-note">El mes con mayor ingreso bruto registrado.</div>
            </div>
            <div className="annual-insight-metric">{summary.bestMonthLabel}</div>
          </div>

          <div className="annual-insight-row">
            <div className="annual-insight-copy">
              <div className="annual-insight-label">Promedio mensual</div>
              <div className="annual-insight-note">Tu ritmo promedio de ingreso en el año.</div>
            </div>
            <div className="annual-insight-metric">{fmtCompact(summary.averageMonth)}</div>
          </div>

          <div className="annual-insight-row annual-insight-row--stacked">
            <div className="annual-insight-label">Último pago registrado</div>
            <div className="annual-insight-value">{summary.latestPaymentLabel}</div>
          </div>
        </div>
      </div>

      <div className="annual-actions">
        <button className="btn btn-primary btn-full" onClick={() => navigate(summary.paymentCount > 0 ? 'I1' : 'I2')}>
          {summary.paymentCount > 0 ? 'Ver movimientos del año' : 'Registrar primer pago'}
        </button>
        <button className="btn btn-secondary btn-full" onClick={() => navigate(summary.paymentCount > 0 ? 'A7' : 'A1')}>
          {summary.paymentCount > 0 ? 'Exportar resumen' : 'Volver a Mi Año'}
        </button>
        <button className="btn btn-ghost btn-full" onClick={() => navigate('I4')}>
          Ver indicadores del total
        </button>
      </div>
    </div>
  )
}
