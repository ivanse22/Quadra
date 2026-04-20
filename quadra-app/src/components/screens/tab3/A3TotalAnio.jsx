// A3 — Total ganado YTD (CL-03 → I4)
import { useAppStore } from '../../../store/useAppStore'

export default function A3TotalAnio() {
  const { navigate } = useAppStore()
  const fmt = n => '$' + n.toLocaleString('es-CO')
  return (
    <div className="q-body-inner">
      <div className="hero-card mb5">
        <div className="hero-eye">YTD — Enero a Abril 2026</div>
        <div className="hero-amount" style={{ fontSize: 'var(--t-2xl)' }}>
          <span className="twotone"><span className="twotone-main">$6.500</span><span className="twotone-dec">.000</span></span>
        </div>
        <div className="hero-sub">Ingresados brutos · 4 pagos registrados</div>
        <div className="hero-breakdown">
          <div><div className="hero-bk-lbl">Disponible real</div><div className="hero-bk-val" style={{ color: 'var(--volt-text)' }}>$3.985.000</div></div>
          <div><div className="hero-bk-lbl">Retención total</div><div className="hero-bk-val" style={{ color: 'var(--fin-deduct)' }}>$715.000</div></div>
          <div><div className="hero-bk-lbl">PILA total</div><div className="hero-bk-val" style={{ color: 'var(--fin-reserve)' }}>$850.000</div></div>
        </div>
      </div>
      {/* CL-03 */}
      <button className="btn btn-primary btn-full mb3" onClick={() => navigate('I4')}>Ver todos mis pagos</button>
      <button className="btn btn-ghost btn-full" onClick={() => navigate('A7')}>Exportar datos</button>
    </div>
  )
}
