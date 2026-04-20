import { useState, useEffect } from 'react'
import { useAppStore } from '../../../store/useAppStore'

// ── Skeleton (DS §16 & §18 skeleton del Home) ────────────────────────────────
function HomeSkeleton() {
  return (
    <div style={{ padding: 'var(--screen-pt) var(--screen-px) 0' }}>
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
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 20px', borderBottom: '1px solid var(--border)',
        cursor: 'pointer', transition: 'background var(--motion-fast)',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-subtle)'}
      onMouseLeave={e => e.currentTarget.style.background = ''}
    >
      {/* Avatar circle */}
      <div style={{
        width: 38, height: 38, borderRadius: '50%',
        background: 'var(--surf-2)', border: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
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

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 'var(--t-base)',
          fontWeight: 700, color: 'var(--txt)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {payment.client}
        </div>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 'var(--t-sm)',
          color: 'var(--txt-m)', marginTop: 2,
        }}>
          {payment.method}{payment.currency && payment.currency !== 'COP' ? ` · ${payment.currency} ${payment.originalAmount?.toLocaleString()}` : ''}
        </div>
      </div>

      {/* Amount */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 'var(--t-base)',
          fontWeight: 700, color: colorStroke,
          fontVariantNumeric: 'tabular-nums',
        }}>
          {sign}${abs.toLocaleString('es-CO')}
        </div>
        {isIncome && (
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: 'var(--t-xs)',
            color: 'var(--txt-m)', marginTop: 1,
          }}>
            disp ${(disp / 1000).toFixed(0)}k
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function D1Home() {
  const { navigate, switchTab, kpis, payments, setSelectedPayment, showToast } = useAppStore()
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
        <div style={{ padding: '16px 20px 0', display: 'flex', flexDirection: 'column', gap: 0 }}>

          {/* ── Hero zone ── */}
          <div style={{ paddingBottom: 'var(--s8)', borderBottom: '1px solid var(--border)', marginBottom: 'var(--s6)' }}>
            {/* Eyebrow */}
            <div style={{
              fontFamily: 'var(--font-body)', fontSize: 'var(--t-xs)',
              fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.12em',
              color: 'var(--txt-m)', marginBottom: 'var(--s2)',
            }}>
              Lo que es tuyo hoy
            </div>

            {/* Hero number — mobile-first massive */}
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3.5rem, 14vw, 5rem)',
              fontWeight: 900, letterSpacing: '-0.05em',
              lineHeight: 0.9, color: 'var(--volt-text)',
              fontVariantNumeric: 'tabular-nums', marginBottom: 'var(--s3)',
              animation: 'slideInUp var(--motion-slow) var(--ease-out) both',
            }}>
              {fmt(kpis?.disponibleHoy || 0)}
            </div>

            {/* Meta row: source + badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--s2)' }}>
              <div style={{
                fontFamily: 'var(--font-body)', fontSize: 'var(--t-sm)',
                color: 'var(--txt-m)',
              }}>
                Último movimiento · Agosto 2026
              </div>
              {showBadge && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  background: 'var(--fin-income-dim)', border: '1px solid var(--fin-income-border)',
                  color: 'var(--fin-income)', padding: '4px 10px',
                  borderRadius: 'var(--r-full)',
                  fontFamily: 'var(--font-display)', fontSize: 'var(--t-xs)', fontWeight: 700,
                  animation: 'resultPop var(--motion-slow) var(--ease-spring) both',
                }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 15l-6-6-6 6"/>
                  </svg>
                  Pago guardado
                </span>
              )}
            </div>
          </div>

          {/* ── KPI row — 2 cards ── */}
          <div style={{ display: 'flex', gap: 'var(--s2)', marginBottom: 'var(--s6)' }}>
            <div style={{
              flex: 1, background: 'var(--bg-subtle)',
              border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 'var(--s4)',
              cursor: 'pointer', transition: 'background var(--motion-fast) var(--ease-out)',
            }}
            onClick={() => navigate('I4')}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surf-2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-subtle)'}
            >
              <div className="kpi-lbl">Ingresado YTD</div>
              <div className="kpi-val">{fmt(kpis?.ytd || 0)}</div>
            </div>

            <div style={{
              flex: 1, background: 'var(--bg-subtle)',
              border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 'var(--s4)',
              cursor: 'pointer', transition: 'background var(--motion-fast) var(--ease-out)',
            }}
            onClick={() => navigate('D4')}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surf-2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-subtle)'}
            >
              <div className="kpi-lbl">Reservado</div>
              <div className="kpi-val" style={{ color: 'var(--fin-reserve)' }}>{fmt((kpis?.reservadoRenta || 0) + (kpis?.reservadoPila || 0))}</div>
            </div>
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
              <span
                style={{
                  fontFamily: 'var(--font-body)', fontSize: 'var(--t-xs)',
                  fontWeight: 700, color: 'var(--volt-text)', cursor: 'pointer',
                }}
                onClick={() => switchTab(1)}
              >
                Ver todo →
              </span>
            </div>

            {/* Transaction list card */}
            <div style={{
              background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-xl)', overflow: 'hidden',
            }}>
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
                <div
                  style={{
                    padding: 'var(--s3) var(--screen-px)', textAlign: 'center',
                    fontFamily: 'var(--font-body)', fontSize: 'var(--t-xs)',
                    fontWeight: 700, color: 'var(--volt-text)', cursor: 'pointer',
                    transition: 'background var(--motion-fast)',
                  }}
                  onClick={() => switchTab(1)}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-subtle)'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}
                >
                  Ver todos los movimientos →
                </div>
                <div
                  style={{
                    padding: 'var(--s2) var(--screen-px) var(--s3)', textAlign: 'center',
                    borderTop: '1px solid var(--border)',
                    fontFamily: 'var(--font-body)', fontSize: 'var(--t-xs)',
                    fontWeight: 500, color: 'var(--txt-m)', cursor: 'pointer',
                    transition: 'background var(--motion-fast)',
                  }}
                  onClick={() => navigate('D2')}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-subtle)'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}
                >
                  ¿Cómo se calculan tus descuentos?
                </div>
              </div>
            </div>
          </div>

          {/* ── Quick action row — removed in favour of FAB ── */}

          {/* ── PILA alert — task-row card ── */}
          {(kpis?.reservadoPila || 0) > 0 && (
            <div
              onClick={() => navigate('D3')}
              style={{
                marginTop: 'var(--s5)',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-xl)',
                padding: 'var(--s3) var(--s4)',
                display: 'flex', alignItems: 'center', gap: 'var(--s3)',
                cursor: 'pointer',
                transition: 'background var(--motion-fast) var(--ease-out)',
                boxShadow: 'var(--shadow-sm)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-subtle)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--bg)'}
            >
              {/* Icon square */}
              <div style={{
                width: 44, height: 44, borderRadius: 'var(--r-md)',
                background: 'var(--fin-reserve-dim)',
                border: '1.5px solid var(--fin-reserve-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--fin-reserve)" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: 'var(--t-sm)',
                  fontWeight: 700, color: 'var(--txt)', lineHeight: 1.3,
                  marginBottom: 2,
                }}>
                  PILA pendiente
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)', fontSize: 'var(--t-xs)',
                  color: 'var(--txt-m)',
                }}>
                  {fmt(kpis?.reservadoPila || 0)} reservados
                </div>
              </div>

              {/* CTA button */}
              <button
                onClick={e => { e.stopPropagation(); navigate('D3') }}
                style={{
                  height: 36, padding: '0 var(--s4)',
                  background: 'var(--fin-reserve)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--r-full)',
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--t-xs)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all var(--motion-fast) var(--ease-out)',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#92400E'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--fin-reserve)'}
              >
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
          className="fab-pulse"
          style={{
            position: 'absolute',
            bottom: 'calc(72px + var(--s4))',
            right: 'var(--s5)',
            width: 56,
            height: 56,
            borderRadius: 'var(--r-full)',
            background: 'var(--volt)',
            color: 'var(--volt-on)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            fontWeight: 300,
            lineHeight: 1,
            transition: 'transform var(--motion-fast) var(--ease-spring), background var(--motion-fast)',
            zIndex: 10,
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.background = '#CEFF1A' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'var(--volt)' }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.94)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1.1)'}
          aria-label="Registrar nuevo pago"
        >
          +
        </button>
      )}
    </div>
  )
}
