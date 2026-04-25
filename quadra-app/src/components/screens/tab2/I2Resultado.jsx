import { useEffect, useState } from 'react'
import { useAppStore } from '../../../store/useAppStore'
import { CONSTANTES } from '../../../lib/calculadoraFinanciera'

const UMBRAL_DECLARANTE_COP = CONSTANTES.UMBRAL_DECLARANTE_UVT * CONSTANTES.UVT

function useCountUp(target, duration = 900) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!target) return
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      // ease-out cubic
      const ease = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(ease * target))
      if (p < 1) requestAnimationFrame(step)
    }
    const raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return val
}

export default function I2Resultado() {
  const { navigate, payments, switchTab, setSelectedPayment } = useAppStore()
  const [step, setStep] = useState(0) // 0=hero, 1=desglose, 2=full

  // Read the most recently added payment (first in the array, since addPayment prepends)
  const latest = payments[0]
  const gross     = latest?.gross ?? 0
  const retencion = latest?.retencion ?? 0
  const pila      = latest?.pila ?? 0
  const reserva   = latest?.reserva ?? 0
  const disponible = latest?.disponible ?? 0
  const client    = latest?.client ?? 'Pago reciente'

  const countedDisponible = useCountUp(step >= 1 ? disponible : 0, 900)

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 300)
    const t2 = setTimeout(() => setStep(2), 1400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const fmt = (n) => '$' + Math.abs(n).toLocaleString('es-CO')
  const pilaD = latest?.pilaDetalle
  const retPctoBruto = gross > 0 && retencion > 0
    ? (Math.round((retencion / gross) * 1000) / 10)
    : null
  const pilaPctoBruto = gross > 0 && pila > 0
    ? (Math.round((pila / gross) * 1000) / 10)
    : null

  if (!latest) {
    return (
      <div className="q-body-inner">
        <div className="q-empty">
          <div className="q-empty-visual">
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="var(--txt-f)" strokeWidth="1.5">
              <circle cx="12" cy="12" r="9" />
              <path d="M8 12h8" />
            </svg>
          </div>
          <h2 className="q-empty-headline">Sin resultado reciente</h2>
          <p className="q-empty-desc">Registra un pago primero para ver el disponible calculado con cifras reales.</p>
          <button className="q-empty-cta" onClick={() => navigate('I2')}>
            Registrar un pago
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="q-body-inner" style={{ paddingTop: 'var(--s4)', paddingBottom: 'var(--s10)' }}>

      {/* ── Minimal close row (NO_HEADER screen) ── */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--s2)' }}>
        <button
          onClick={() => switchTab(0)}
          style={{
            display: 'flex', alignItems: 'center', gap: 'var(--s1)',
            fontSize: 'var(--t-xs)', color: 'var(--txt-m)',
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-body)', padding: 'var(--s1) 0',
          }}
          aria-label="Volver al inicio"
        >
          Inicio
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </button>
      </div>

      {/* ── Hero Result — DS motion: slide-in + count-up ── */}
      <div
        style={{
          textAlign: 'center', marginBottom: 'var(--s6)',
          animation: 'slideInHero 260ms var(--ease-out) both',
        }}
      >
        {/* Confirmation badge */}
        <div style={{ marginBottom: 'var(--s4)' }}>
          <span
            className="badge badge-ok"
            style={{ animation: 'badgeBounce 440ms var(--ease-spring) 1.3s both' }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20,6 9,17 4,12"/>
            </svg>
            Pago guardado
          </span>
        </div>

        {/* Eyebrow */}
        <div className="hero-eye hero-eye--sm">
          Disponible real
        </div>

        {/* Hero count-up — DS: Satoshi 900, clamp font, volt-text */}
        <div className="i2r-hero-amount">
          ${countedDisponible.toLocaleString('es-CO')}
        </div>

        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 'var(--t-sm)',
          color: 'var(--txt-m)',
        }}>
          De {fmt(gross)} brutos · {client}
        </p>
      </div>

      {/* ── Desglose con stagger ── */}
      {step >= 1 && (
        <div className="desglose mb5">
          <div className="tx-drow stagger-item" style={{ animationDelay: '0ms' }}>
            <div className="tx-drow-l" style={{ color: 'var(--txt-2)' }}>
              <div className="drow-dot" style={{ background: 'var(--fin-income)' }} />
              Ingreso bruto
            </div>
            <div className="tx-drow-v" style={{ color: 'var(--fin-income)' }}>{fmt(gross)}</div>
          </div>

          <div className="tx-drow stagger-item" style={{ animationDelay: '80ms' }}>
            <div className="tx-drow-l" style={{ color: 'var(--txt-2)', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="drow-dot" style={{ background: 'var(--fin-deduct)' }} />
                <span>Retención en la fuente</span>
              </div>
              {retPctoBruto != null && (
                <span className="i2-legal-hint">~{String(retPctoBruto).replace(/\.0$/, '')}% del bruto de este pago (tu tarifa o 11% si aplica).</span>
              )}
            </div>
            <div className="tx-drow-v" style={{ color: 'var(--fin-deduct)' }}>−{fmt(retencion)}</div>
          </div>

          {(pila > 0 || pilaD) && (
            <div className="stagger-item" style={{ animationDelay: '160ms' }}>
              {pilaD ? (
                <div
                  className="card pila-mes-blk"
                  style={{
                    marginTop: 'var(--s2)',
                    padding: 'var(--s4)',
                    textAlign: 'left',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--r-lg)',
                    background: 'var(--bg-subtle)',
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--txt)', marginBottom: 'var(--s2)' }}>PILA — aportes (sobre IBC del mes)</div>
                  <p className="i2-legal-hint" style={{ marginBottom: 'var(--s3)' }}>
                    La PILA es mensual sobre el total de tus ingresos del mes (todos los clientes). IBC = 40% del total, con piso 1 SMMLV y tope 25 SMMLV.
                  </p>
                  <div className="tx-drow" style={{ border: 'none', padding: '4px 0' }}>
                    <span className="tx-drow-l">IBC del mes (base)</span>
                    <span className="tx-drow-v">{fmt(pilaD.ibc)}</span>
                  </div>
                  <div className="tx-drow" style={{ border: 'none', padding: '4px 0' }}>
                    <span className="tx-drow-l">Salud 12,5% del IBC</span>
                    <span className="tx-drow-v" style={{ color: 'var(--fin-reserve)' }}>−{fmt(pilaD.salud)}</span>
                  </div>
                  <div className="tx-drow" style={{ border: 'none', padding: '4px 0' }}>
                    <span className="tx-drow-l">Pensión 16% del IBC</span>
                    <span className="tx-drow-v" style={{ color: 'var(--fin-reserve)' }}>−{fmt(pilaD.pension)}</span>
                  </div>
                  <div className="tx-drow" style={{ border: 'none', padding: '4px 0' }}>
                    <span className="tx-drow-l">ARL (riesgo I)</span>
                    <span className="tx-drow-v" style={{ color: 'var(--fin-reserve)' }}>−{fmt(pilaD.arl)}</span>
                  </div>
                  <div className="tx-drow" style={{ border: 'none', padding: '4px 0' }}>
                    <span className="tx-drow-l">Obligación total del mes</span>
                    <span className="tx-drow-v" style={{ fontWeight: 700 }}>−{fmt(pilaD.obligacionMensual)}</span>
                  </div>
                  {pilaD.yaReservadoMes > 0 && (
                    <div className="tx-drow" style={{ border: 'none', padding: '4px 0' }}>
                      <span className="tx-drow-l">Ya reservado este mes</span>
                      <span className="tx-drow-v" style={{ color: 'var(--txt-m)' }}>−{fmt(pilaD.yaReservadoMes)}</span>
                    </div>
                  )}
                  <div className="tx-drow" style={{ border: 'none', padding: '6px 0 0', marginTop: 4, borderTop: '1px solid var(--border)' }}>
                    {pila > 0 ? (
                      <>
                        <span className="tx-drow-l" style={{ fontWeight: 800 }}>Reservado en este pago</span>
                        <span className="tx-drow-v" style={{ color: 'var(--fin-reserve)', fontWeight: 800 }}>−{fmt(pila)}</span>
                      </>
                    ) : (
                      <>
                        <span className="tx-drow-l" style={{ fontWeight: 700, color: 'var(--fin-income)' }}>
                          ✓ Seguridad social del mes ya cubierta
                        </span>
                        <span className="tx-drow-v" style={{ color: 'var(--fin-income)', fontWeight: 700 }}>$0</span>
                      </>
                    )}
                  </div>
                  {pila === 0 && (
                    <p className="i2-legal-hint" style={{ marginTop: 'var(--s2)', marginBottom: 0 }}>
                      Este pago no agrega PILA adicional. La obligación mensual ya fue cubierta con pagos anteriores del mes.
                    </p>
                  )}
                  {pila > 0 && pilaPctoBruto != null && (
                    <p className="i2-legal-hint" style={{ marginTop: 'var(--s2)', marginBottom: 0 }}>
                      Equivale a ~{String(pilaPctoBruto).replace(/\.0$/, '')}% del bruto de <em>este</em> pago: eso es distinto al 12,5% de salud, que va sobre IBC.
                    </p>
                  )}
                </div>
              ) : (
                <div className="tx-drow" style={{ marginTop: 'var(--s1)' }}>
                  <div className="tx-drow-l" style={{ color: 'var(--txt-2)' }}>
                    <div className="drow-dot" style={{ background: 'var(--fin-reserve)' }} />
                    PILA (registrado en pagos anteriores sin desglose)
                  </div>
                  <div className="tx-drow-v" style={{ color: 'var(--fin-reserve)' }}>−{fmt(pila)}</div>
                </div>
              )}
            </div>
          )}

          <div className="stagger-item" style={{ animationDelay: '240ms' }}>
            {reserva > 0 ? (
              <div className="tx-drow">
                <div className="tx-drow-l" style={{ color: 'var(--txt-2)' }}>
                  <div className="drow-dot" style={{ background: 'var(--fin-reserve)' }} />
                  Reserva declaración renta
                </div>
                <div className="tx-drow-v" style={{ color: 'var(--fin-reserve)' }}>−{fmt(reserva)}</div>
              </div>
            ) : (
              <div
                className="card"
                style={{
                  marginTop: 'var(--s2)',
                  padding: 'var(--s4)',
                  textAlign: 'left',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-lg)',
                  background: 'var(--bg-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--s2)' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--txt)' }}>
                    RENTA — reserva declaración
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--fin-income)', fontSize: 'var(--t-sm)' }}>$0</span>
                </div>
                <p className="i2-legal-hint" style={{ marginBottom: 'var(--s3)' }}>
                  Tu proyección anual aún no supera el umbral de ~{fmt(UMBRAL_DECLARANTE_COP)} (1.400 UVT). No estás obligado a declarar renta por ahora.
                </p>
                <button
                  onClick={() => navigate('C1')}
                  style={{
                    fontSize: 'var(--t-xs)', fontWeight: 700, fontFamily: 'var(--font-body)',
                    color: 'var(--txt-m)', background: 'none', border: 'none',
                    cursor: 'pointer', padding: 0, textDecoration: 'underline',
                  }}
                >
                  Soy declarante voluntario → activar en perfil
                </button>
              </div>
            )}
          </div>

          {/* Total row — DS: volt-dim background, volt-text */}
          <div className="dtotal" style={{ background: 'var(--volt-dim)', borderRadius: 'var(--r-lg)', padding: '12px 14px', marginTop: 'var(--s3)', border: '1px solid var(--volt-border)' }}>
            <div className="dtotal-l">Lo que es tuyo hoy</div>
            <div className="dtotal-v">{fmt(disponible)}</div>
          </div>
        </div>
      )}

      {/* ── Actions — aparecen al final del stagger ── */}
      {step >= 2 && (
        <div
          className="stagger-item"
          style={{ animationDelay: '340ms', display: 'flex', flexDirection: 'column', gap: 'var(--s3)' }}
        >
          <button
            className="btn btn-primary btn-full"
            onClick={() => {
              setSelectedPayment(latest.id)
              navigate('I3')
            }}
          >
            Ver detalle completo
          </button>
          <button
            className="btn btn-secondary btn-full"
            onClick={() => navigate('I2')}
          >
            + Registrar otro pago
          </button>
          <button
            className="btn btn-ghost btn-full"
            onClick={() => {
              switchTab(0) // go to D1 Home tab
            }}
          >
            Ir al inicio
          </button>
        </div>
      )}
    </div>
  )
}
