import { useState, useEffect } from 'react'
import { useAppStore } from '../../../store/useAppStore'
import { getPaymentDateLabel } from '../../../lib/dateUtils'
import { IconBarChart, IconShield, IconTarget, IconArrowUp, IconPlus } from '../../ui/Icons'

// ── Skeleton (DS §16 & §18 skeleton del Home) ────────────────────────────────
function HomeSkeleton() {
  return (
    <div style={{ padding: 'var(--s3) var(--screen-px) 0' }}>
      {/* Hero card skeleton */}
      <div style={{ marginBottom: 'var(--s8)' }}>
        <span className="skel" style={{ height: 10, width: '40%', display: 'block', marginBottom: 'var(--s2)' }} />
        <span className="skel" style={{ height: 52, width: '72%', display: 'block', borderRadius: 'var(--r-sm)', marginBottom: 'var(--s2)' }} />
        <span className="skel" style={{ height: 8, width: '52%', display: 'block', marginBottom: 'var(--s5)' }} />
        <span className="skel" style={{ height: 24, width: 100, display: 'block', borderRadius: 'var(--r-full)' }} />
      </div>
      {/* KPI row skeleton */}
      <div style={{ display: 'flex', gap: 'var(--s2)', marginBottom: 'var(--s8)' }}>
        <span className="skel" style={{ flex: 1, height: 68, display: 'block', borderRadius: 'var(--r-lg)' }} />
        <span className="skel" style={{ flex: 1, height: 68, display: 'block', borderRadius: 'var(--r-lg)' }} />
      </div>
      {/* Tx section label */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span className="skel" style={{ height: 9, width: 80, display: 'block' }} />
        <span className="skel" style={{ height: 9, width: 50, display: 'block' }} />
      </div>
      {/* Tx rows */}
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
            <span className="skel" style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0, display: 'block' }} />
            <div style={{ flex: 1 }}>
              <span className="skel" style={{ height: 10, width: '65%', display: 'block', marginBottom: 5 }} />
              <span className="skel" style={{ height: 8, width: '42%', display: 'block' }} />
            </div>
            <span className="skel" style={{ width: 72, height: 10, display: 'block' }} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Transaction row ───────────────────────────────────────────────────────────
function TxRow({ payment, onClick }) {
  const isIncome = payment.disponible > 0 && payment.type !== 'pila'
  const colorStroke = isIncome ? 'var(--fin-income)' : 'var(--fin-reserve)'
  const sign = isIncome ? '+' : '-'
  const abs = Math.abs(isIncome ? payment.gross : payment.pila)
  const disp = Math.abs(payment.disponible)
  const metaLabel = isIncome
    ? `Disponible ${new Intl.NumberFormat('es-CO', { notation: 'compact', maximumFractionDigits: 1 }).format(disp)}`
    : 'Usa tu saldo disponible'

  return (
    <button
      onClick={onClick}
      className="tx-row compact-row movement-row"
      type="button"
      style={{ width: '100%', textAlign: 'left' }}
    >
      <div className="tx-icon">
        {payment.type === 'pila' ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={colorStroke} strokeWidth="2.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="M9 12l2 2 4-4"/>
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={colorStroke} strokeWidth="2.5">
            <path d="M18 15l-6-6-6 6"/>
          </svg>
        )}
      </div>

      <div className="tx-info compact-row-info movement-row-info">
        <div className="tx-name compact-row-name movement-row-name">
          {payment.client}
        </div>
        <div className="tx-sub compact-row-sub movement-row-sub">
          {payment.method}{payment.currency && payment.currency !== 'COP' ? ` · ${payment.currency} ${payment.originalAmount?.toLocaleString()}` : ''}
        </div>
      </div>

      <div className="compact-row-amount movement-row-amount">
        <div className="compact-row-amount-main movement-row-amount-main" style={{ color: colorStroke }}>
          {sign}${abs.toLocaleString('es-CO')}
        </div>
        <div className="compact-row-amount-meta movement-row-amount-meta">{metaLabel}</div>
      </div>
    </button>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function D1Home() {
  const { navigate, switchTab, kpis, payments, setSelectedPayment, profile } = useAppStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  const fmt = (n) => {
    if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
    if (n >= 1000) return `$${(n / 1000).toFixed(0)}k`
    return `$${n.toLocaleString('es-CO')}`
  }

  // Latest 3 movements for the home preview
  const recentTx = payments.slice(0, 3)
  const latestPayment = payments[0]

  // M2.1 — Trend: current month vs previous month gross
  const now = new Date()
  const cm = now.getMonth(), cy = now.getFullYear()
  const prevDate = new Date(now); prevDate.setMonth(cm - 1)
  const pm = prevDate.getMonth(), py = prevDate.getFullYear()
  const MONTH_NAMES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

  const monthGross = (mo, yr) => payments
    .filter(p => p.type !== 'pila' && p.date)
    .filter(p => { const d = new Date(p.date); return d.getMonth() === mo && d.getFullYear() === yr })
    .reduce((s, p) => s + (p.gross || 0), 0)

  const currentMonthGross = monthGross(cm, cy)
  const prevMonthGross = monthGross(pm, py)
  const monthTrend = prevMonthGross > 0
    ? Math.round(((currentMonthGross - prevMonthGross) / prevMonthGross) * 100)
    : null

  // M2.2 — Progress vs meta anual
  const metaAnual = profile?.metaAnual || 0
  const ytdProgress = metaAnual > 0 ? Math.min(100, Math.round(((kpis?.ytd || 0) / metaAnual) * 100)) : null

  // E5.1 — Insight contextual
  const insight = (() => {
    if (!payments.length) return null
    const now = new Date()
    const cm = now.getMonth(), cy = now.getFullYear()

    const grossByMonth = (mo, yr) => payments
      .filter(p => p.type !== 'pila' && p.date)
      .filter(p => { const d = new Date(p.date); return d.getMonth() === mo && d.getFullYear() === yr })
      .reduce((s, p) => s + (p.gross || 0), 0)

    const currentGross = grossByMonth(cm, cy)
    const prev1 = new Date(now); prev1.setMonth(cm - 1)
    const prev2 = new Date(now); prev2.setMonth(cm - 2)
    const avg2 = (grossByMonth(prev1.getMonth(), prev1.getFullYear()) + grossByMonth(prev2.getMonth(), prev2.getFullYear())) / 2

    // PILA overdue: no pila payment in last 60 days
    const pilaList = payments.filter(p => p.type === 'pila' && p.date).sort((a, b) => new Date(b.date) - new Date(a.date))
    const daysSincePila = pilaList[0] ? Math.floor((now - new Date(pilaList[0].date)) / 86400000) : 999
    if (daysSincePila > 60) {
      return { type: 'pila', msg: `Llevas más de ${Math.round(daysSincePila / 30)} meses sin registrar PILA`, cta: 'Ver PILA', screen: 'D3' }
    }

    // Low disponible: disponibleHoy < 30% of YTD gross
    const ytdGross = payments.filter(p => p.type !== 'pila' && p.date && new Date(p.date).getFullYear() === cy).reduce((s, p) => s + (p.gross || 0), 0)
    const disponible = kpis?.disponibleHoy || 0
    if (ytdGross > 0 && disponible < ytdGross * 0.30) {
      return { type: 'low', msg: 'Tu disponible es menor de lo habitual · revisa tus deducciones', cta: 'Entender →', screen: 'D2' }
    }

    // Best month
    if (avg2 > 0 && currentGross > avg2 * 1.2) {
      return { type: 'best', msg: 'Mejor mes del trimestre', cta: 'Ver ingresos →', screen: 'I4' }
    }

    return null
  })()

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {loading ? (
        <HomeSkeleton />
      ) : payments.length === 0 ? (
        <div className="q-empty">
          <div className="q-empty-visual" style={{ animation: 'badgeBounce 500ms var(--ease-spring) both' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--txt-m)" strokeWidth="1.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h2 className="q-empty-headline" style={{ animation: 'slideInUp 400ms var(--ease-out) 100ms both' }}>Sin movimientos</h2>
          <p className="q-empty-desc" style={{ animation: 'slideInUp 400ms var(--ease-out) 200ms both' }}>
            Aún no has registrado ningún pago. Registra el primero para ver tu disponible real.
          </p>
          <button
            className="q-empty-cta"
            style={{ animation: 'slideInUp 400ms var(--ease-out) 300ms both' }}
            onClick={() => navigate('I2')}
          >
            + Registrar mi primer pago
          </button>
        </div>
      ) : (
        <div className="q-body-inner" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

          {/* ── Hero zone ── */}
          <div style={{ paddingBottom: 'var(--s6)', borderBottom: '1px solid var(--border)', marginBottom: 'var(--s4)' }}>
            {/* Eyebrow + help icon */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 'var(--s1)' }}>
              <span className="hero-eye hero-eye--sm" style={{ margin: 0 }}>Lo que es tuyo hoy</span>
              <button
                type="button"
                onClick={() => navigate('D2')}
                style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', padding: '2px 4px', cursor: 'pointer', color: 'var(--txt-f)', borderRadius: 'var(--r-sm)' }}
                aria-label="¿Cómo se calcula este número?"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </button>
            </div>

            {/* Hero number — tocable → desglose último pago */}
            <button
              type="button"
              onClick={() => { if (latestPayment) { setSelectedPayment(latestPayment.id); navigate('I3') } }}
              className="d1-hero-amount"
              aria-label="Ver desglose de tu disponible real"
            >
              {fmt(kpis?.disponibleHoy || 0)}
            </button>

            {/* Meta row: source + badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--s2)' }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--t-sm)', color: 'var(--txt-m)' }}>
                {latestPayment ? getPaymentDateLabel(latestPayment) : 'Sin fecha'}
              </div>
              <span className="badge badge-neu">Disponible actualizado</span>
            </div>
          </div>

          {/* ── Quick Actions Strip ── */}
          <div className="home-qa-strip">
            <button className="home-qa-btn" onClick={() => navigate('I2')}>
              <IconPlus />
              Registrar pago
            </button>
            <button className="home-qa-btn" onClick={() => navigate('D3')}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Pagar PILA
            </button>
            <button className="home-qa-btn" onClick={() => navigate('D4')}>
              <IconShield />
              Reserva renta
            </button>
          </div>

          {/* ── E5.1 Insight card ── */}
          {insight && (
            <button
              type="button"
              onClick={() => navigate(insight.screen)}
              style={{
                display: 'flex', alignItems: 'center', gap: 'var(--s3)',
                width: '100%', textAlign: 'left', marginBottom: 'var(--s4)',
                padding: 'var(--s3) var(--s4)',
                background: insight.type === 'best' ? 'var(--volt-dim)' : insight.type === 'pila' ? 'var(--fin-reserve-dim)' : 'var(--surf-1)',
                border: `1px solid ${insight.type === 'best' ? 'var(--volt-border)' : insight.type === 'pila' ? 'var(--fin-reserve-border)' : 'var(--border)'}`,
                borderRadius: 'var(--r-xl)', cursor: 'pointer',
              }}
            >
              <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                {insight.type === 'best'
                  ? <IconTarget size={18} style={{ color: 'var(--volt-text)' }} />
                  : insight.type === 'pila'
                  ? <IconShield size={18} style={{ color: 'var(--fin-reserve)' }} />
                  : <IconBarChart size={18} style={{ color: 'var(--txt-m)' }} />
                }
              </span>
              <span style={{ flex: 1, fontFamily: 'var(--font-body)', fontSize: 'var(--t-xs)', color: 'var(--txt)', lineHeight: 1.4 }}>
                {insight.msg}
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--t-xs)', color: insight.type === 'best' ? 'var(--volt-text)' : 'var(--txt-m)', fontWeight: 700, flexShrink: 0 }}>
                {insight.cta}
              </span>
            </button>
          )}

          {/* ── KPI row — 2 cards ── */}
          <div style={{ display: 'flex', gap: 'var(--s2)', marginBottom: 'var(--s6)' }}>
            {/* M2.1 + M2.2 — YTD con trend y progress */}
            <button type="button" className="home-kpi-card" onClick={() => navigate('I4')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 'var(--s2)' }}>
                <IconArrowUp />
                <div className="kpi-lbl" style={{ margin: 0 }}>Ingresado YTD</div>
              </div>
              <div className="kpi-val">{fmt(kpis?.ytd || 0)}</div>
              {monthTrend !== null && (
                <div className={`kpi-trend ${monthTrend >= 0 ? 'kpi-trend-up' : 'kpi-trend-down'}`}>
                  {monthTrend >= 0 ? '↑' : '↓'} {Math.abs(monthTrend)}% vs {MONTH_NAMES[pm]}
                </div>
              )}
              {ytdProgress !== null && (
                <>
                  <div className="kpi-progress-wrap">
                    <div className="kpi-progress-bar" style={{ width: `${ytdProgress}%` }} />
                  </div>
                  <div className="kpi-progress-lbl">{ytdProgress}% de la meta anual</div>
                </>
              )}
            </button>

            {/* M2.3 — Para tu renta (reserva total) */}
            <button type="button" className="home-kpi-card" onClick={() => navigate('D4')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 'var(--s2)' }}>
                <IconShield />
                <div className="kpi-lbl" style={{ margin: 0 }}>Para tu renta</div>
              </div>
              <div className="kpi-val" style={{ color: 'var(--fin-reserve)' }}>{fmt((kpis?.reservadoRenta || 0) + (kpis?.reservadoPila || 0))}</div>
              <div className="kpi-sub">Renta + PILA separados</div>
            </button>
          </div>

          {/* ── Movimientos section ── */}
          <div>
            {/* Section header — title + single action */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--s2)' }}>
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: 'var(--t-lg)',
                fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--txt)',
              }}>
                Movimientos
              </span>
              <button
                type="button"
                className="q-text-action"
                onClick={() => switchTab(1)}
              >
                Ver todo →
              </button>
            </div>

            {/* Transaction list card */}
            <div className="tx-list">
              {recentTx.map((p, i) => (
                <TxRow
                  key={p.id}
                  payment={p}
                  onClick={() => {
                    setSelectedPayment(p.id)
                    navigate('I3')
                  }}
                />
              ))}
              {/* Footer CTAs */}
              <div style={{ borderTop: '1px solid var(--border)' }}>
                <button
                  type="button"
                  className="q-inline-footer-action"
                  onClick={() => switchTab(1)}
                >
                  Ver todos los movimientos →
                </button>
                <button
                  type="button"
                  className="q-inline-footer-action q-inline-footer-action-subtle"
                  onClick={() => navigate('D2')}
                >
                  ¿Cómo se calculan tus descuentos?
                </button>
              </div>
            </div>
          </div>

          {/* ── Quick action row — removed in favour of FAB ── */}

          {/* ── E2.1 Panel próxima acción — 3 estados ── */}
          {(() => {
            const pilaPendiente = (kpis?.reservadoPila || 0) > 0
            const ytd = kpis?.ytd || 0
            const reservaActual = kpis?.reservadoRenta || 0
            const proyectadoAnual = Math.max(ytd * 3, 40000000)
            const metaRenta = Math.round(proyectadoAnual * 0.155)
            const progressReserva = metaRenta > 0 ? Math.round((reservaActual / metaRenta) * 100) : 100
            const reservaBaja = progressReserva < 50 && ytd > 0

            if (pilaPendiente) {
              return (
                <button type="button" className="home-task-card" onClick={() => navigate('D3')} style={{ marginTop: 'var(--s4)' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--r-md)', background: 'var(--fin-reserve-dim)', border: '1.5px solid var(--fin-reserve-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--fin-reserve)" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--t-sm)', fontWeight: 700, color: 'var(--txt)', lineHeight: 1.3, marginBottom: 2 }}>PILA pendiente</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--t-xs)', color: 'var(--txt-m)' }}>{fmt(kpis?.reservadoPila || 0)} por registrar</div>
                  </div>
                  <span className="home-task-chip">Pagar</span>
                </button>
              )
            }

            if (reservaBaja) {
              return (
                <button type="button" className="home-task-card" onClick={() => navigate('D4')} style={{ marginTop: 'var(--s4)' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--r-md)', background: 'var(--fin-reserve-dim)', border: '1.5px solid var(--fin-reserve-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--fin-reserve)" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--t-sm)', fontWeight: 700, color: 'var(--txt)', lineHeight: 1.3, marginBottom: 2 }}>Reserva para declaración de renta</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--t-xs)', color: 'var(--txt-m)' }}>Llevas el {progressReserva}% — revisa cuánto te falta</div>
                  </div>
                  <span className="home-task-chip">Ver reserva →</span>
                </button>
              )
            }

            return (
              <button type="button" className="home-task-card home-task-card-ok" onClick={() => navigate('I2')} style={{ marginTop: 'var(--s4)' }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--r-md)', background: 'var(--fin-income-dim)', border: '1.5px solid var(--fin-income-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--fin-income)" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--t-sm)', fontWeight: 700, color: 'var(--txt)', lineHeight: 1.3, marginBottom: 2 }}>Todo al día</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--t-xs)', color: 'var(--txt-m)' }}>¿Recibiste un nuevo pago?</div>
                </div>
                <span className="home-task-chip home-task-chip-ok">+ Registrar</span>
              </button>
            )
          })()}

        </div>
      )}

    </div>
  )
}
