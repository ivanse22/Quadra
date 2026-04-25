import { useAppStore } from '../../../store/useAppStore'
import { toSafeDate } from '../../../lib/dateUtils'

const MONTH_LABELS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const MONTH_LABELS_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

export default function A2Mensual() {
  const { navigate, payments, selectedAnnualMonth } = useAppStore()
  const currentYear = new Date().getFullYear()
  const monthIndex = selectedAnnualMonth ?? new Date().getMonth()
  const fmt = n => '$' + n.toLocaleString('es-CO')
  const monthIncomePayments = payments.filter((payment) => {
    if (payment.type === 'pila' || payment.type === 'renta' || !payment.date) return false
    const date = toSafeDate(payment.date)
    return date && date.getFullYear() === currentYear && date.getMonth() === monthIndex
  })
  const gross = monthIncomePayments.reduce((sum, payment) => sum + (payment.gross || 0), 0)
  const retencion = monthIncomePayments.reduce((sum, payment) => sum + (payment.retencion || 0), 0)
  const pila = monthIncomePayments.reduce((sum, payment) => sum + (payment.pila || 0), 0)
  const reserva = monthIncomePayments.reduce((sum, payment) => sum + (payment.reserva || 0), 0)
  const disponible = monthIncomePayments.reduce((sum, payment) => sum + (payment.disponible || 0), 0)
  const monthLabel = `${MONTH_LABELS[monthIndex]} ${currentYear}`

  return (
    <div className="q-body-inner">
      <p style={{ fontSize: 'var(--t-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--volt-text)', marginBottom: 'var(--s2)', fontFamily: 'var(--font-display)' }}>{monthLabel}</p>
      {monthIncomePayments.length === 0 ? (
        <div className="q-empty">
          <div className="q-empty-visual">
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="var(--txt-f)" strokeWidth="1.5">
              <circle cx="12" cy="12" r="9" />
              <path d="M8 12h8" />
            </svg>
          </div>
          <h2 className="q-empty-headline">Sin ingresos en {MONTH_LABELS_SHORT[monthIndex]}</h2>
          <p className="q-empty-desc">Cuando registres pagos en este mes, aquí verás el bruto, las obligaciones y tu disponible real.</p>
        </div>
      ) : (
        <div className="desglose mb5">
          <div className="tx-drow">
            <div className="tx-drow-l"><div className="drow-dot" style={{ background: 'var(--fin-income)' }} />Ingresos brutos</div>
            <div className="tx-drow-v" style={{ color: 'var(--fin-income)' }}>{fmt(gross)}</div>
          </div>
          <div className="tx-drow">
            <div className="tx-drow-l"><div className="drow-dot" style={{ background: 'var(--fin-deduct)' }} />Retención en la fuente</div>
            <div className="tx-drow-v" style={{ color: 'var(--fin-deduct)' }}>-{fmt(retencion)}</div>
          </div>
          <div className="tx-drow">
            <div className="tx-drow-l"><div className="drow-dot" style={{ background: 'var(--fin-reserve)' }} />PILA separada</div>
            <div className="tx-drow-v" style={{ color: 'var(--fin-reserve)' }}>-{fmt(pila)}</div>
          </div>
          <div className="tx-drow">
            <div className="tx-drow-l"><div className="drow-dot" style={{ background: 'var(--fin-reserve)' }} />Reserva declaración</div>
            <div className="tx-drow-v" style={{ color: 'var(--fin-reserve)' }}>-{fmt(reserva)}</div>
          </div>
          <div className="dtotal"><div className="dtotal-l">Disponible real</div><div className="dtotal-v">{fmt(disponible)}</div></div>
        </div>
      )}
      <button className="btn btn-secondary btn-full mb3" onClick={() => navigate('I1')}>{monthIncomePayments.length > 0 ? 'Ver pagos de este mes' : 'Ver todos los pagos'}</button>
    </div>
  )
}
