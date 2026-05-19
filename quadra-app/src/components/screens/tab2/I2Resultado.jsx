import { useEffect, useState } from 'react'
import { useAppStore } from '../../../store/useAppStore'
import { CONSTANTES } from '../../../lib/calculadoraFinanciera'
import { IconCheck } from '../../ui/Icons'
import ContextualHelp from '../../ui/ContextualHelp'

const UMBRAL_DECLARANTE_COP = CONSTANTES.UMBRAL_DECLARANTE_UVT * CONSTANTES.UVT

function useCountUp(target, duration = 900) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!target) return
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(ease * target))
      if (p < 1) requestAnimationFrame(step)
    }
    const raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return val
}

const CONFETTI_COLORS = ['var(--volt)', '#60efff', '#ff6b6b', '#ffd166', '#a78bfa']

function triggerConfetti() {
  const container = document.querySelector('.i2r-confetti')
  if (!container) return
  for (let i = 0; i < 20; i++) {
    const el = document.createElement('div')
    el.className = 'confetti-particle'
    el.style.setProperty('--p-x', `${(Math.random() - 0.5) * 220}px`)
    el.style.setProperty('--p-y', `${-(Math.random() * 160 + 50)}px`)
    el.style.setProperty('--p-color', CONFETTI_COLORS[i % CONFETTI_COLORS.length])
    el.style.setProperty('--p-delay', `${Math.random() * 180}ms`)
    container.appendChild(el)
    setTimeout(() => el.remove(), 900)
  }
}

export default function I2Resultado() {
  const { navigate, payments, switchTab, setSelectedPayment } = useAppStore()
  const [step, setStep] = useState(0) // 0=hero, 1=desglose, 2=full
  const [pilaDetailOpen, setPilaDetailOpen] = useState(false)
  const [showGlow, setShowGlow] = useState(false)

  const latest     = payments[0]
  const gross      = latest?.gross      ?? 0
  const retencion  = latest?.retencion  ?? 0
  const pila       = latest?.pila       ?? 0
  const reserva    = latest?.reserva    ?? 0
  const disponible = latest?.disponible ?? 0
  const client     = latest?.client     ?? 'Pago reciente'

  const countedDisponible = useCountUp(step >= 1 ? disponible : 0, 900)

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 300)
    const t2 = setTimeout(() => {
      setStep(2)
      setShowGlow(true)
      triggerConfetti()
      setTimeout(() => setShowGlow(false), 700)
    }, 1400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const fmt = (n) => '$' + Math.abs(n || 0).toLocaleString('es-CO')
  const pilaD = latest?.pilaDetalle

  const retPctoBruto  = gross > 0 && retencion > 0 ? (Math.round((retencion / gross) * 1000) / 10) : null
  const pilaPctoBruto = gross > 0 && pila > 0       ? (Math.round((pila     / gross) * 1000) / 10) : null

  // Porcentajes para la mini barra
  const pctDisp = gross > 0 ? Math.round((disponible / gross) * 100) : 0
  const pctRet  = gross > 0 ? Math.round((retencion  / gross) * 100) : 0
  const pctPila = gross > 0 ? Math.round((pila       / gross) * 100) : 0
  const pctRes  = gross > 0 ? Math.round((reserva    / gross) * 100) : 0

  if (!latest) {
    return (
      <div className="q-body-inner">
        <div className="q-empty">
          <div className="q-empty-visual">
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="var(--txt-f)" strokeWidth="1.5">
              <circle cx="12" cy="12" r="9"/><path d="M8 12h8"/>
            </svg>
          </div>
          <h2 className="q-empty-headline">Sin resultado reciente</h2>
          <p className="q-empty-desc">Registra un pago primero para ver el disponible calculado con cifras reales.</p>
          <button className="q-empty-cta" onClick={() => navigate('I2')}>Registrar un pago</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
    <div className="q-body-inner" style={{ paddingTop: 'var(--s4)', paddingBottom: 'var(--s4)', flex: 1 }}>

      {/* ── Pill de cierre — top right ── */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--s3)' }}>
        <button
          className="i2r-close-pill"
          onClick={() => switchTab(0)}
          aria-label="Volver al inicio"
        >
          Inicio
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </button>
      </div>

      {/* ── Hero ── */}
      <div style={{ textAlign: 'center', marginBottom: 'var(--s5)', animation: 'slideInHero 260ms var(--ease-out) both', position: 'relative' }}>
        {/* Confetti anchor */}
        <div className="i2r-confetti" aria-hidden="true" />
        <div style={{ marginBottom: 'var(--s4)' }}>
          <span className="badge badge-ok" style={{ animation: 'badgeBounce 440ms var(--ease-spring) 1.3s both' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20,6 9,17 4,12"/>
            </svg>
            Pago guardado
          </span>
        </div>
        <div className="hero-eye hero-eye--sm">Disponible real</div>
        <div className={`i2r-hero-amount${showGlow ? ' i2r-amount-glow' : ''}`}>${countedDisponible.toLocaleString('es-CO')}</div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--t-sm)', color: 'var(--txt-m)' }}>
          De {fmt(gross)} brutos · {client}
        </p>
      </div>

      {/* ── Mini barra de desglose rápido ── */}
      {step >= 1 && gross > 0 && (
        <div className="i2r-breakdown-bar-wrap stagger-item" style={{ animationDelay: '0ms' }}>
          <div className="i1-breakdown-bar">
            <div className="i1-breakdown-seg" style={{ width: `${pctDisp}%`, background: 'var(--fin-income)' }} />
            <div className="i1-breakdown-seg" style={{ width: `${pctRet}%`,  background: 'var(--fin-deduct)' }} />
            <div className="i1-breakdown-seg" style={{ width: `${pctPila}%`, background: 'var(--fin-reserve)' }} />
            <div className="i1-breakdown-seg" style={{ width: `${pctRes}%`,  background: 'var(--volt-border)' }} />
          </div>
          <div className="i1-breakdown-legend" style={{ justifyContent: 'center' }}>
            <div className="i1-breakdown-item">
              <div className="i1-breakdown-dot" style={{ background: 'var(--fin-income)' }} />
              Disponible {pctDisp}%
            </div>
            {retencion > 0 && (
              <div className="i1-breakdown-item">
                <div className="i1-breakdown-dot" style={{ background: 'var(--fin-deduct)' }} />
                Retención {pctRet}%
              </div>
            )}
            {pila > 0 && (
              <div className="i1-breakdown-item">
                <div className="i1-breakdown-dot" style={{ background: 'var(--fin-reserve)' }} />
                PILA {pctPila}%
              </div>
            )}
            {reserva > 0 && (
              <div className="i1-breakdown-item">
                <div className="i1-breakdown-dot" style={{ background: 'var(--volt-border)' }} />
                Reserva {pctRes}%
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Desglose completo con stagger ── */}
      {step >= 1 && (
        <div className="desglose mb5">
          <div className="tx-drow stagger-item" style={{ animationDelay: '80ms' }}>
            <div className="tx-drow-l" style={{ color: 'var(--txt-2)' }}>
              <div className="drow-dot" style={{ background: 'var(--fin-income)' }} />
              Ingreso bruto
            </div>
            <div className="tx-drow-v" style={{ color: 'var(--fin-income)' }}>{fmt(gross)}</div>
          </div>

          <div className="tx-drow stagger-item" style={{ animationDelay: '160ms', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <div className="tx-drow-l" style={{ color: 'var(--txt-2)' }}>
                <div className="drow-dot" style={{ background: 'var(--fin-deduct)' }} />
                <span>Retención en la fuente</span>
              </div>
              <div className="tx-drow-v" style={{ color: 'var(--fin-deduct)' }}>−{fmt(retencion)}</div>
            </div>
            <ContextualHelp
              term="¿Qué es la retención?"
              explanation={`Anticipo del impuesto de renta que tu cliente te descuenta al pagarte.${retPctoBruto != null ? ` Equivale a ~${String(retPctoBruto).replace(/\.0$/, '')}% de este pago.` : ''} Al declarar renta, este valor se abona como pago anticipado.`}
            />
          </div>

          {(pila > 0 || pilaD) && (
            <div className="stagger-item" style={{ animationDelay: '240ms' }}>
              {pilaD ? (
                <div className="card pila-mes-blk" style={{ marginTop: 'var(--s2)', padding: 'var(--s4)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', background: 'var(--bg-subtle)' }}>
                  <button
                    className="i2-pila-toggle"
                    onClick={() => setPilaDetailOpen((open) => !open)}
                    aria-expanded={pilaDetailOpen}
                  >
                    <div className="tx-drow-l" style={{ color: 'var(--txt-2)', fontSize: 'var(--t-sm)', flex: 1, textAlign: 'left' }}>
                      <div className="drow-dot" style={{ background: 'var(--fin-reserve)' }} />
                      PILA del mes
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: pila > 0 ? 'var(--fin-reserve)' : 'var(--fin-income)', fontSize: 'var(--t-sm)', fontWeight: 800, fontFamily: 'var(--font-display)', fontVariantNumeric: 'tabular-nums' }}>
                        {pila > 0 ? `−${fmt(pila)}` : '$0'}
                      </span>
                      <span style={{ fontSize: 'var(--t-2xs)', color: 'var(--txt-m)', fontWeight: 700, fontFamily: 'var(--font-body)' }}>
                        {pilaDetailOpen ? 'Ocultar' : 'Ver cálculo'}
                      </span>
                    </div>
                  </button>
                  {pilaDetailOpen && (
                    <div style={{ borderTop: '1px solid var(--border)', marginTop: 'var(--s2)', paddingTop: 'var(--s3)' }}>
                      <p className="i2-legal-hint" style={{ marginBottom: 'var(--s3)' }}>
                        La PILA es mensual sobre el total de tus ingresos del mes. IBC = 40% del total, con piso 1 SMMLV y tope 25 SMMLV.
                      </p>
                      {[
                        { l: 'IBC del mes (base)', v: fmt(pilaD.ibc) },
                        { l: 'Salud 12,5% del IBC', v: `−${fmt(pilaD.salud)}`, c: 'var(--fin-reserve)' },
                        { l: 'Pensión 16% del IBC', v: `−${fmt(pilaD.pension)}`, c: 'var(--fin-reserve)' },
                        { l: 'ARL (riesgo I)', v: `−${fmt(pilaD.arl)}`, c: 'var(--fin-reserve)' },
                        { l: 'Obligación total del mes', v: `−${fmt(pilaD.obligacionMensual)}`, bold: true },
                        ...(pilaD.yaReservadoMes > 0
                          ? [{ l: 'Ya reservado este mes', v: `−${fmt(pilaD.yaReservadoMes)}`, c: 'var(--txt-m)' }]
                          : []),
                      ].map(({ l, v, c, bold }) => (
                        <div key={l} className="tx-drow" style={{ border: 'none', padding: '4px 0' }}>
                          <span className="tx-drow-l" style={bold ? { fontWeight: 800 } : {}}>{l}</span>
                          <span className="tx-drow-v" style={{ ...(c ? { color: c } : {}), ...(bold ? { fontWeight: 800 } : {}) }}>{v}</span>
                        </div>
                      ))}
                      <div className="tx-drow" style={{ border: 'none', padding: '6px 0 0', marginTop: 4, borderTop: '1px solid var(--border)' }}>
                        {pila > 0 ? (
                          <>
                            <span className="tx-drow-l" style={{ fontWeight: 800 }}>Reservado en este pago</span>
                            <span className="tx-drow-v" style={{ color: 'var(--fin-reserve)', fontWeight: 800 }}>−{fmt(pila)}</span>
                          </>
                        ) : (
                          <>
                            <span className="tx-drow-l" style={{ fontWeight: 700, color: 'var(--fin-income)', display: 'flex', alignItems: 'center', gap: 4 }}>
                              <IconCheck /> Seguridad social del mes ya cubierta
                            </span>
                            <span className="tx-drow-v" style={{ color: 'var(--fin-income)', fontWeight: 700 }}>$0</span>
                          </>
                        )}
                      </div>
                      {pila > 0 && pilaPctoBruto != null && (
                        <p className="i2-legal-hint" style={{ marginTop: 'var(--s2)', marginBottom: 0 }}>
                          Equivale a ~{String(pilaPctoBruto).replace(/\.0$/, '')}% del bruto de <em>este</em> pago (distinto al 12,5% de salud sobre IBC).
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="tx-drow" style={{ marginTop: 'var(--s1)' }}>
                  <div className="tx-drow-l" style={{ color: 'var(--txt-2)' }}>
                    <div className="drow-dot" style={{ background: 'var(--fin-reserve)' }} />
                    PILA (registrado previamente sin desglose)
                  </div>
                  <div className="tx-drow-v" style={{ color: 'var(--fin-reserve)' }}>−{fmt(pila)}</div>
                </div>
              )}
            </div>
          )}

          <div className="stagger-item" style={{ animationDelay: '320ms' }}>
            {reserva > 0 ? (
              <div className="tx-drow">
                <div className="tx-drow-l" style={{ color: 'var(--txt-2)' }}>
                  <div className="drow-dot" style={{ background: 'var(--fin-reserve)' }} />
                  Reserva declaración renta
                </div>
                <div className="tx-drow-v" style={{ color: 'var(--fin-reserve)' }}>−{fmt(reserva)}</div>
              </div>
            ) : (
              <div className="tx-drow">
                <div className="tx-drow-l" style={{ color: 'var(--txt-2)', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="drow-dot" style={{ background: 'var(--volt-border)' }} />
                    <span>Reserva renta</span>
                  </div>
                  <ContextualHelp
                    term="¿Por qué $0?"
                    explanation={`Tu proyección anual aún no supera el umbral de ~$${UMBRAL_DECLARANTE_COP.toLocaleString('es-CO')} (1.400 UVT). Si eres declarante voluntario, actívalo en tu perfil.`}
                  />
                </div>
                <div className="tx-drow-v" style={{ color: 'var(--txt-m)' }}>$0</div>
              </div>
            )}
          </div>

          {/* Total row volt */}
          <div className="dtotal" style={{ background: 'var(--volt-dim)', borderRadius: 'var(--r-lg)', padding: '12px 14px', marginTop: 'var(--s3)', border: '1px solid var(--volt-border)' }}>
            <div className="dtotal-l">Lo que es tuyo hoy</div>
            <div className="dtotal-v">{fmt(disponible)}</div>
          </div>
        </div>
      )}

    </div>
    {/* ── CTAs sticky — visibles sin scroll ── */}
    <div className="i2r-actions-footer">
      {step >= 2 && (
        <div className="stagger-item" style={{ animationDelay: '0ms', display: 'flex', flexDirection: 'column', gap: 'var(--s2)' }}>
          <button
            className="btn btn-primary btn-full"
            onClick={() => { setSelectedPayment(latest.id); navigate('I3') }}
          >
            Ver detalle completo
          </button>
          <div className="i2r-secondary-actions">
            <button className="btn btn-ghost" onClick={() => navigate('I2')}>+ Registrar otro</button>
            <span className="i2r-divider" aria-hidden />
            <button className="btn btn-ghost" onClick={() => switchTab(0)}>Ir al inicio</button>
          </div>
        </div>
      )}
    </div>
    </div>
  )
}
