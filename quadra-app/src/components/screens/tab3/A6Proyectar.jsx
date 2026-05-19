import { useMemo, useState } from 'react'
import { useAppStore } from '../../../store/useAppStore'
import { IconCheck } from '../../ui/Icons'

const PRESETS = [2000000, 4000000, 6000000, 10000000]

export default function A6Proyectar() {
  const { navigate, profile, setProfile, showToast, payments } = useAppStore()
  const [monthly, setMonthly] = useState(profile.metaAnual ? Math.round(profile.metaAnual / 12) : 2000000)
  const [customMode, setCustomMode] = useState(!PRESETS.includes(profile.metaAnual ? Math.round(profile.metaAnual / 12) : 2000000))
  const [saved, setSaved] = useState(false)

  const retencionRate = (profile.retencion ?? 11) / 100
  const pilaRate = profile.pila === 'no' ? 0 : 0.125
  const reservaRate = 0.145
  const disposable = Math.round(monthly * (1 - retencionRate - pilaRate - reservaRate))
  const dispPct = Math.round((1 - retencionRate - pilaRate - reservaRate) * 100)
  const fmt = n => '$' + n.toLocaleString('es-CO')

  // M1.2 — real average from payments
  const avgMonthly = useMemo(() => {
    const year = new Date().getFullYear()
    const months = new Set()
    const total = payments
      .filter(p => p.type !== 'pila' && p.date && new Date(p.date).getFullYear() === year)
      .reduce((s, p) => {
        months.add(new Date(p.date).getMonth())
        return s + (p.gross || 0)
      }, 0)
    return months.size > 0 ? Math.round(total / months.size) : 0
  }, [payments])

  const handleSaveMeta = () => {
    setProfile({ ...profile, metaAnual: monthly * 12 })
    showToast({ type: 'success', message: 'Meta anual guardada en tu perfil.' })
    setSaved(true)
  }

  const selectPreset = (v) => {
    setMonthly(v)
    setCustomMode(false)
    setSaved(false)
  }

  const barSegments = [
    { label: 'PILA', pct: Math.round(pilaRate * 100), color: 'var(--fin-reserve)' },
    { label: 'Ret.', pct: Math.round(retencionRate * 100), color: 'var(--fin-deduct)' },
    { label: 'Reserva', pct: Math.round(reservaRate * 100), color: 'rgba(237,137,54,0.55)' },
    { label: 'Tuyo', pct: dispPct, color: 'var(--volt)' },
  ]

  return (
    <div className="q-body-inner">

      {/* M1.1 — Chips de selección rápida */}
      <div className="field mb5">
        <label className="field-label">¿Cuánto esperas ganar por mes?</label>
        <span className="field-sub">Estimación de tu ingreso bruto mensual</span>
        <div style={{ display: 'flex', gap: 'var(--s2)', flexWrap: 'wrap', marginTop: 'var(--s3)' }}>
          {PRESETS.map(v => (
            <button
              key={v}
              type="button"
              onClick={() => selectPreset(v)}
              style={{
                padding: 'var(--s2) var(--s4)', borderRadius: 'var(--r-full)',
                background: monthly === v && !customMode ? 'var(--volt-dim)' : 'var(--surf-1)',
                border: `1.5px solid ${monthly === v && !customMode ? 'var(--volt-border)' : 'var(--border)'}`,
                fontFamily: 'var(--font-display)', fontSize: 'var(--t-sm)', fontWeight: 700,
                color: monthly === v && !customMode ? 'var(--volt-text)' : 'var(--txt)',
                cursor: 'pointer', transition: 'all var(--motion-fast) var(--ease-out)',
              }}
            >
              ${(v / 1000000).toFixed(0)}M
            </button>
          ))}
          <button
            type="button"
            onClick={() => { setCustomMode(true); setSaved(false) }}
            style={{
              padding: 'var(--s2) var(--s4)', borderRadius: 'var(--r-full)',
              background: customMode ? 'var(--volt-dim)' : 'var(--surf-1)',
              border: `1.5px solid ${customMode ? 'var(--volt-border)' : 'var(--border)'}`,
              fontFamily: 'var(--font-display)', fontSize: 'var(--t-sm)', fontWeight: 700,
              color: customMode ? 'var(--volt-text)' : 'var(--txt-m)',
              cursor: 'pointer', transition: 'all var(--motion-fast) var(--ease-out)',
            }}
          >
            Otro
          </button>
        </div>
        {customMode && (
          <input
            className="q-input"
            style={{ marginTop: 'var(--s2)' }}
            type="number"
            value={monthly}
            onChange={e => { setMonthly(Number(e.target.value)); setSaved(false) }}
            autoFocus
            placeholder="Ingreso mensual bruto"
          />
        )}
      </div>

      {monthly > 0 && (
        <>
          <div className="preview mb4">
            <div className="preview-eye">Disponible real estimado / mes</div>
            <div className="preview-amount">{fmt(disposable)}</div>
            <div className="preview-sub">{dispPct}% de {fmt(monthly)} brutos · basado en tu perfil</div>

            {/* M1.3 — Stacked bar visual */}
            <div style={{ margin: 'var(--s4) 0 var(--s2)', height: 10, borderRadius: 'var(--r-full)', overflow: 'hidden', display: 'flex', gap: 1 }}>
              {barSegments.map(seg => (
                <div key={seg.label} style={{ flex: seg.pct, background: seg.color }} title={`${seg.label} ${seg.pct}%`} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 'var(--s4)', flexWrap: 'wrap', marginBottom: 'var(--s2)' }}>
              {barSegments.map(seg => (
                <div key={seg.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: seg.color, display: 'inline-block', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: 'var(--txt-m)' }}>{seg.label} {seg.pct}%</span>
                </div>
              ))}
            </div>

            <div className="preview-breakdown">
              <div><div className="preview-item-lbl">PILA</div><div className="preview-item-val" style={{ color: 'var(--fin-reserve)' }}>-{fmt(Math.round(monthly * pilaRate))}</div></div>
              <div><div className="preview-item-lbl">Ret. {(retencionRate * 100).toFixed(0)}%</div><div className="preview-item-val" style={{ color: 'var(--fin-deduct)' }}>-{fmt(Math.round(monthly * retencionRate))}</div></div>
              <div><div className="preview-item-lbl">Ago.</div><div className="preview-item-val" style={{ color: 'var(--fin-reserve)' }}>-{fmt(Math.round(monthly * reservaRate))}</div></div>
            </div>
          </div>

          {/* M1.2 — Contexto vs. ingresos reales */}
          {avgMonthly > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s2)', flexWrap: 'wrap', marginBottom: 'var(--s4)' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--t-xs)', color: 'var(--txt-m)' }}>
                Tu promedio real: <strong style={{ color: 'var(--txt)' }}>{fmt(avgMonthly)}/mes</strong>
              </span>
              {monthly >= avgMonthly ? (
                <span className="badge badge-ok" style={{ fontSize: 9, padding: '2px 8px' }}>Por encima de tu media</span>
              ) : (
                <span className="badge badge-warn" style={{ fontSize: 9, padding: '2px 8px' }}>Por debajo de tu media</span>
              )}
            </div>
          )}
        </>
      )}

      <div className="card">
        <div className="card-title mb3">Proyección anual</div>
        <div className="tx-drow"><span className="tx-drow-l">12 meses bruto</span><span className="tx-drow-v">{fmt(monthly * 12)}</span></div>
        <div className="tx-drow"><span className="tx-drow-l">12 meses disponible</span><span className="tx-drow-v" style={{ color: 'var(--volt-text)' }}>{fmt(disposable * 12)}</span></div>
        <div className="tx-drow" style={{ borderBottom: 'none' }}><span className="tx-drow-l">Reserva declaración</span><span className="tx-drow-v" style={{ color: 'var(--fin-reserve)' }}>{fmt(Math.round(monthly * reservaRate * 12))}</span></div>
      </div>

      <button
        className={`btn btn-full ${saved ? 'btn-secondary' : 'btn-primary'}`}
        style={{ marginTop: 'var(--s4)' }}
        onClick={handleSaveMeta}
        disabled={saved || !monthly}
      >
        {saved ? <><IconCheck /> Meta guardada en tu perfil</> : 'Aplicar como meta anual →'}
      </button>
    </div>
  )
}
