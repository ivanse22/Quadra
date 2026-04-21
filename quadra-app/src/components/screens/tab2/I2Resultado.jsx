import { useEffect, useState } from 'react'
import { useAppStore } from '../../../store/useAppStore'

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
  const { navigate, payments, switchTab, showToast } = useAppStore()
  const [step, setStep] = useState(0) // 0=hero, 1=desglose, 2=full

  // Read the most recently added payment (first in the array, since addPayment prepends)
  const latest = payments[0]
  const gross     = latest?.gross     ?? 2000000
  const retencion = latest?.retencion ?? 200000
  const pila      = latest?.pila      ?? 250000
  const reserva   = latest?.reserva   ?? 310000
  const disponible = latest?.disponible ?? 1240000
  const client    = latest?.client    ?? 'Agencia Creativa SAS'

  const countedDisponible = useCountUp(step >= 1 ? disponible : 0, 900)

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 300)
    const t2 = setTimeout(() => setStep(2), 1400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const fmt = (n) => '$' + Math.abs(n).toLocaleString('es-CO')

  // Derive real rates from actual payment values
  const retRate  = gross > 0 ? (retencion / gross * 100).toFixed(1).replace(/\.0$/, '') : 0
  const pilaRate = gross > 0 ? (pila      / gross * 100).toFixed(1).replace(/\.0$/, '') : 0

  const desglose = [
    { label: 'Ingreso bruto',                              val: fmt(gross),         color: 'var(--fin-income)',  delay: 0   },
    { label: `Retención en la fuente (${retRate}%)`,       val: `−${fmt(retencion)}`,color: 'var(--fin-deduct)', delay: 80  },
    { label: `Salud y pensión — PILA (${pilaRate}% bruto)`,val: `−${fmt(pila)}`,    color: 'var(--fin-reserve)', delay: 160 },
    { label: 'Reserva declaración renta',                  val: `−${fmt(reserva)}`, color: 'var(--fin-reserve)', delay: 240 },
  ]

  return (
    <div className="q-body-inner" style={{ paddingTop: 'var(--s6)', paddingBottom: 'var(--s10)' }}>

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
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 'var(--t-xs)',
          fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.14em',
          color: 'var(--txt-m)', marginBottom: 'var(--s2)',
        }}>
          Disponible real
        </div>

        {/* Hero count-up — DS: Satoshi 900, --t-3xl, volt-text */}
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(3rem, 10vw, 3.8rem)',
          fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 0.9,
          color: 'var(--volt-text)', fontVariantNumeric: 'tabular-nums',
          marginBottom: 8,
        }}>
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
          {desglose.map((row, i) => (
            <div
              key={i}
              className="drow stagger-item"
              style={{ animationDelay: `${row.delay}ms` }}
            >
              <div className="drow-l">
                <div className="drow-dot" style={{ background: row.color }} />
                {row.label}
              </div>
              <div className="drow-v" style={{ color: row.color }}>{row.val}</div>
            </div>
          ))}

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
