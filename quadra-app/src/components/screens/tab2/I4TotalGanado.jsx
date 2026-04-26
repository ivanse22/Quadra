import { useMemo } from 'react'
import { useAppStore } from '../../../store/useAppStore'
import { toSafeDate } from '../../../lib/dateUtils'

const MONTH_LABELS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const fmt    = (n) => '$' + Math.round(n || 0).toLocaleString('es-CO')
const fmtCmp = (n) => '$' + new Intl.NumberFormat('es-CO', { notation: 'compact', maximumFractionDigits: 1 }).format(Math.abs(n || 0))

export default function I4TotalGanado() {
  const { navigate, payments } = useAppStore()
  const now          = new Date()
  const currentYear  = now.getFullYear()
  const currentMonth = now.getMonth()

  const yearPayments = useMemo(() => payments.filter((p) => {
    const d = toSafeDate(p.date)
    return d && d.getFullYear() === currentYear && p.type !== 'renta' && p.type !== 'pila'
  }), [payments, currentYear])

  const disponible   = yearPayments.reduce((s, p) => s + (p.disponible  || 0), 0)
  const bruto        = yearPayments.reduce((s, p) => s + (p.gross       || 0), 0)
  const totalRet     = yearPayments.reduce((s, p) => s + (p.retencion   || 0), 0)
  const totalPila    = yearPayments.reduce((s, p) => s + (p.pila        || 0), 0)
  const totalReserva = yearPayments.reduce((s, p) => s + (p.reserva     || 0), 0)

  const pctDisp = bruto > 0 ? Math.round((disponible   / bruto) * 100) : 0
  const pctRet  = bruto > 0 ? Math.round((totalRet     / bruto) * 100) : 0
  const pctPila = bruto > 0 ? Math.round((totalPila    / bruto) * 100) : 0
  const pctRes  = bruto > 0 ? Math.round((totalReserva / bruto) * 100) : 0

  // Últimos 6 meses de disponible para el mini chart
  const last6 = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const offset = 5 - i
      const d  = new Date(currentYear, currentMonth - offset, 1)
      const mo = d.getMonth()
      const yr = d.getFullYear()
      const monthPayments = payments.filter((p) => {
        const pd = toSafeDate(p.date)
        return pd && pd.getMonth() === mo && pd.getFullYear() === yr
          && p.type !== 'pila' && p.type !== 'renta'
      })
      return {
        label:      MONTH_LABELS[mo],
        disponible: monthPayments.reduce((s, p) => s + (p.disponible || 0), 0),
        isCurrent:  offset === 0,
      }
    })
  }, [payments, currentYear, currentMonth])

  const maxDisp = Math.max(...last6.map((m) => m.disponible), 1)
  const hasData = yearPayments.length > 0

  if (!hasData) {
    return (
      <div className="q-body-inner">
        <div className="q-empty">
          <div className="q-empty-visual">
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="var(--txt-f)" strokeWidth="1.5">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
          </div>
          <h2 className="q-empty-headline">Sin ingresos este año</h2>
          <p className="q-empty-desc">Registra tu primer pago para ver aquí el resumen de tus KPIs anuales.</p>
          <button className="q-empty-cta" onClick={() => navigate('I2')}>Registrar un pago</button>
        </div>
      </div>
    )
  }

  return (
    <div className="q-body-inner">

      {/* ── Hero card ── */}
      <div className="hero-card mb5">
        <div className="hero-eye">Disponible real {currentYear}</div>
        <div className="hero-amount" style={{ color: 'var(--volt-text)', fontSize: 'var(--t-2xl)' }}>
          {fmt(disponible)}
        </div>
        <div className="hero-sub">De {fmt(bruto)} en ingresos brutos</div>

        {/* Barra de distribución */}
        {bruto > 0 && (
          <div style={{ marginTop: 'var(--s4)' }}>
            <div className="i1-breakdown-bar">
              <div className="i1-breakdown-seg" style={{ width: `${pctDisp}%`, background: 'var(--fin-income)' }} />
              <div className="i1-breakdown-seg" style={{ width: `${pctRet}%`,  background: 'var(--fin-deduct)' }} />
              <div className="i1-breakdown-seg" style={{ width: `${pctPila}%`, background: 'var(--fin-reserve)' }} />
              <div className="i1-breakdown-seg" style={{ width: `${pctRes}%`,  background: 'var(--volt-border)' }} />
            </div>
            <div className="i1-breakdown-legend">
              <div className="i1-breakdown-item">
                <div className="i1-breakdown-dot" style={{ background: 'var(--fin-income)' }} />
                Disponible {pctDisp}%
              </div>
              {totalRet > 0 && (
                <div className="i1-breakdown-item">
                  <div className="i1-breakdown-dot" style={{ background: 'var(--fin-deduct)' }} />
                  Retención {pctRet}%
                </div>
              )}
              {totalPila > 0 && (
                <div className="i1-breakdown-item">
                  <div className="i1-breakdown-dot" style={{ background: 'var(--fin-reserve)' }} />
                  PILA {pctPila}%
                </div>
              )}
              {totalReserva > 0 && (
                <div className="i1-breakdown-item">
                  <div className="i1-breakdown-dot" style={{ background: 'var(--volt-border)' }} />
                  Reserva {pctRes}%
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Grid 2×2 de KPIs ── */}
      <div className="kpi-grid mb5">
        {/* Bruto */}
        <div className="kpi-mini-card">
          <div className="kpi-mini-icon" style={{ background: 'rgba(22,163,74,0.08)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--fin-income)" strokeWidth="2.2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
          </div>
          <div className="kpi-mini-label">Bruto {currentYear}</div>
          <div className="kpi-mini-value" style={{ color: 'var(--txt)' }}>{fmtCmp(bruto)}</div>
        </div>

        {/* Retenciones */}
        <div className="kpi-mini-card">
          <div className="kpi-mini-icon" style={{ background: 'rgba(220,38,38,0.08)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--fin-deduct)" strokeWidth="2.2">
              <circle cx="12" cy="12" r="9" /><path d="M9 14l-4-4 4-4m7 8l4-4-4-4" />
            </svg>
          </div>
          <div className="kpi-mini-label">Retenciones</div>
          <div className="kpi-mini-value" style={{ color: totalRet > 0 ? 'var(--fin-deduct)' : 'var(--txt-m)' }}>{fmtCmp(totalRet)}</div>
        </div>

        {/* PILA */}
        <div className="kpi-mini-card">
          <div className="kpi-mini-icon" style={{ background: 'rgba(180,83,9,0.08)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--fin-reserve)" strokeWidth="2.2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div className="kpi-mini-label">PILA reservada</div>
          <div className="kpi-mini-value" style={{ color: totalPila > 0 ? 'var(--fin-reserve)' : 'var(--txt-m)' }}>{fmtCmp(totalPila)}</div>
        </div>

        {/* Reserva renta */}
        <div className="kpi-mini-card">
          <div className="kpi-mini-icon" style={{ background: 'var(--surf-2)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--txt-m)" strokeWidth="2.2">
              <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div className="kpi-mini-label">Reserva renta</div>
          <div className="kpi-mini-value" style={{ color: 'var(--txt)' }}>{fmtCmp(totalReserva)}</div>
        </div>
      </div>

      {/* ── Mini chart — disponible mensual (últimos 6 meses) ── */}
      <div className="card mb5">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--s4)' }}>
          <div>
            <div style={{ fontSize: 'var(--t-sm)', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--txt)' }}>
              Disponible mensual
            </div>
            <div style={{ fontSize: 'var(--t-xs)', color: 'var(--txt-m)', fontFamily: 'var(--font-body)', marginTop: 2 }}>
              Últimos 6 meses
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--t-xs)', color: 'var(--txt-m)', fontFamily: 'var(--font-body)' }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--volt-text)' }} />
            Mes actual
          </div>
        </div>

        <div className="i4-bar-chart" style={{ gridTemplateColumns: `repeat(6, 1fr)` }}>
          {last6.map((m, i) => (
            <div key={i} className={`i4-bar-col${m.isCurrent ? ' i4-bar-col--current' : ''}`}>
              <div className="i4-bar-value">
                {m.disponible > 0 ? fmtCmp(m.disponible).replace('$', '') : ''}
              </div>
              <div className="i4-bar-track" style={{ height: 72 }}>
                <div
                  className="i4-bar-fill"
                  style={{ height: `${Math.max(m.disponible > 0 ? 4 : 0, (m.disponible / maxDisp) * 100)}%` }}
                />
              </div>
              <div className="i4-bar-lbl">{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Movimientos del año ── */}
      <div className="card mb5">
        <div className="tx-drow" style={{ borderBottom: 'none' }}>
          <span className="tx-drow-l" style={{ color: 'var(--txt-m)', fontFamily: 'var(--font-body)' }}>
            Pagos registrados {currentYear}
          </span>
          <span className="tx-drow-v" style={{ fontWeight: 900, color: 'var(--txt)', fontSize: 'var(--t-md)' }}>
            {yearPayments.length}
          </span>
        </div>
      </div>

      <button className="btn btn-ghost btn-full" onClick={() => navigate('A3')}>
        Ver resumen anual →
      </button>
    </div>
  )
}
