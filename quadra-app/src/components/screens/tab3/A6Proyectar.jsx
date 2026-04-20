import { useState } from 'react'
import { useAppStore } from '../../../store/useAppStore'

export default function A6Proyectar() {
  const { navigate } = useAppStore()
  const [monthly, setMonthly] = useState(2000000)
  const disposable = Math.round(monthly * 0.62)
  const fmt = n => '$' + n.toLocaleString('es-CO')

  return (
    <div className="q-body-inner">
      <div className="field mb5">
        <label className="field-label">¿Cuánto esperas ganar por mes?</label>
        <span className="field-sub">Estimación de tu ingreso bruto mensual</span>
        <input className="q-input" style={{ marginTop: 'var(--s2)' }} type="number"
          value={monthly} onChange={e => setMonthly(Number(e.target.value))} />
      </div>

      {monthly > 0 && (
        <div className="preview mb5">
          <div className="preview-eye">Disponible real estimado / mes</div>
          <div className="preview-amount">{fmt(disposable)}</div>
          <div className="preview-sub">62% de {fmt(monthly)} brutos · estimado</div>
          <div className="preview-breakdown">
            <div><div className="preview-item-lbl">PILA</div><div className="preview-item-val" style={{ color: 'var(--fin-reserve)' }}>-{fmt(Math.round(monthly * 0.125))}</div></div>
            <div><div className="preview-item-lbl">Ret.</div><div className="preview-item-val" style={{ color: 'var(--fin-deduct)' }}>-{fmt(Math.round(monthly * 0.11))}</div></div>
            <div><div className="preview-item-lbl">Ago.</div><div className="preview-item-val" style={{ color: 'var(--fin-reserve)' }}>-{fmt(Math.round(monthly * 0.145))}</div></div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-title mb3">Proyección anual</div>
        <div className="tx-drow"><span className="tx-drow-l">12 meses bruto</span><span className="tx-drow-v">{fmt(monthly * 12)}</span></div>
        <div className="tx-drow"><span className="tx-drow-l">12 meses disponible</span><span className="tx-drow-v" style={{ color: 'var(--volt-text)' }}>{fmt(disposable * 12)}</span></div>
        <div className="tx-drow" style={{ borderBottom: 'none' }}><span className="tx-drow-l">Reserva declaración</span><span className="tx-drow-v" style={{ color: 'var(--fin-reserve)' }}>{fmt(Math.round(monthly * 0.145 * 12))}</span></div>
      </div>
    </div>
  )
}
