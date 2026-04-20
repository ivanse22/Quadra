import { useAppStore } from '../../../store/useAppStore'

export default function A4ReservaSaldo() {
  const { navigate } = useAppStore()
  const fmt = n => '$' + n.toLocaleString('es-CO')
  return (
    <div className="q-body-inner">
      <div className="hero-card mb5">
        <div className="hero-eye">Saldo reserva declaración</div>
        <div className="hero-amount" style={{ color: 'var(--fin-reserve)', fontSize: 'var(--t-2xl)' }}>{fmt(1240000)}</div>
        <div className="hero-sub">Acumulado Ene–Abr 2026</div>
        <div className="hero-breakdown">
          <div><div className="hero-bk-lbl">Meta</div><div className="hero-bk-val">$3.000.000</div></div>
          <div><div className="hero-bk-lbl">Progreso</div><div className="hero-bk-val">41%</div></div>
          <div><div className="hero-bk-lbl">Vence</div><div className="hero-bk-val">Ago 2026</div></div>
        </div>
      </div>
      <button className="btn btn-secondary btn-full" onClick={() => navigate('A5')}>Ver proyección</button>
    </div>
  )
}
