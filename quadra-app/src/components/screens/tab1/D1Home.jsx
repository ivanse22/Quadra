import { useState, useEffect } from 'react'
import { useAppStore } from '../../../store/useAppStore'

// ── Skeleton (DS §16 & §18 skeleton del Home) ────────────────────────────────
function HomeSkeleton() {
  return (
    <div className="screen-stack screen-stack-compact">
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

  return (
    <div
      onClick={onClick}
      className="tx-row"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
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

      <div className="tx-info">
        <div className="tx-name">{payment.client}</div>
        <div className="tx-sub">
          {payment.method}{payment.currency && payment.currency !== 'COP' ? ` · ${payment.currency} ${payment.originalAmount?.toLocaleString()}` : ''}
        </div>
      </div>

      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div className="tx-amount" style={{ color: colorStroke }}>
          {sign}${abs.toLocaleString('es-CO')}
        </div>
        {isIncome && (
          <div className="tx-amount-note">
            disp ${(disp / 1000).toFixed(0)}k
          </div>
        )}
      </div>
    </div>
  )
}

function KpiCard({ label, value, accent, onClick }) {
  return (
    <button className="pressable-card pressable-card-kpi" onClick={onClick}>
      <span className="kpi-lbl">{label}</span>
      <span className="kpi-val" style={accent ? { color: accent } : {}}>{value}</span>
    </button>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function D1Home() {
  const { navigate, switchTab, kpis, payments, setSelectedPayment } = useAppStore()
  const [loading, setLoading] = useState(true)
  const [showBadge, setShowBadge] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setLoading(false), 900)
    const t2 = setTimeout(() => setShowBadge(true), 1100)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const fmt = (n) => {
    if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
    if (n >= 1000) return `$${(n / 1000).toFixed(0)}k`
    return `$${n.toLocaleString('es-CO')}`
  }

  // Latest 3 movements for the home preview
  const recentTx = payments.slice(0, 3)
  const latestMovement = recentTx[0]?.dateLabel ? `Último movimiento · ${recentTx[0].dateLabel}` : 'Aún no has registrado movimientos'
  const reservedTotal = (kpis?.reservadoRenta || 0) + (kpis?.reservadoPila || 0)

  return (
    <div style={{ flex: 1, overflow: 'hidden auto', paddingBottom: 16 }}>
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
        <div className="screen-stack screen-stack-compact">
          <section className="metric-hero">
            <span className="section-kicker">Lo que es tuyo hoy</span>
            <div className="metric-hero-value" style={{ animation: 'slideInUp var(--motion-slow) var(--ease-out) both' }}>
              {fmt(kpis?.disponibleHoy || 0)}
            </div>
            <div className="metric-hero-row">
              <span className="metric-hero-meta">{latestMovement}</span>
              {showBadge && (
                <span className="badge badge-ok" style={{ animation: 'resultPop var(--motion-slow) var(--ease-spring) both' }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 15l-6-6-6 6"/>
                  </svg>
                  Pago guardado
                </span>
              )}
            </div>
          </section>

          <div className="metrics-grid">
            <KpiCard label="Ingresado YTD" value={fmt(kpis?.ytd || 0)} onClick={() => navigate('I4')} />
            <KpiCard label="Reservado" value={fmt(reservedTotal)} accent="var(--fin-reserve)" onClick={() => navigate('D4')} />
          </div>

          <section className="section-head">
            <div className="section-inline-action">
              <div className="section-head">
                <h2 className="section-title">Movimientos</h2>
                <p className="section-desc">Tus últimos ingresos y reservas, ordenados para revisar rápido.</p>
              </div>
              <button className="section-link" onClick={() => switchTab(1)}>Ver todo →</button>
            </div>

            <div className="list-card">
              {recentTx.map((p) => (
                <TxRow
                  key={p.id}
                  payment={p}
                  onClick={() => {
                    setSelectedPayment(p.id)
                    navigate('I3')
                  }}
                />
              ))}
              <div style={{ borderTop: '1px solid var(--border)' }}>
                <button className="list-footer-action" onClick={() => switchTab(1)}>
                  Ver todos los movimientos →
                </button>
                <button className="list-footer-subaction" onClick={() => navigate('D2')}>
                  ¿Cómo se calculan tus descuentos?
                </button>
              </div>
            </div>
          </section>

          {(kpis?.reservadoPila || 0) > 0 && (
            <div
              className="task-card"
              role="button"
              tabIndex={0}
              onClick={() => navigate('D3')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  navigate('D3')
                }
              }}
            >
              <div className="task-card-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--fin-reserve)" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div className="task-card-main">
                <div className="task-card-title">PILA pendiente</div>
                <div className="task-card-desc">{fmt(kpis?.reservadoPila || 0)} reservados</div>
              </div>
              <button className="task-card-cta" onClick={(e) => { e.stopPropagation(); navigate('D3') }}>
                Pagar
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Floating Action Button (FAB) ── */}
      {!loading && payments.length > 0 && (
        <button
          onClick={() => navigate('I2')}
          className="fab-primary fab-pulse"
          aria-label="Registrar nuevo pago"
        >
          +
        </button>
      )}
    </div>
  )
}
