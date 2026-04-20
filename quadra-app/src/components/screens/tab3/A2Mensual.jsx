// A2 — Detalle mes actual (Abril 2026)
import { useAppStore } from '../../../store/useAppStore'

export default function A2Mensual() {
  const { navigate } = useAppStore()
  const fmt = n => '$' + n.toLocaleString('es-CO')
  return (
    <div className="q-body-inner">
      <p style={{ fontSize: 'var(--t-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--volt-text)', marginBottom: 'var(--s2)', fontFamily: 'var(--font-display)' }}>Abril 2026</p>
      <div className="desglose mb5">
        <div className="drow"><div className="drow-l"><div className="drow-dot" style={{ background: 'var(--fin-income)' }} />Ingresos brutos</div><div className="drow-v" style={{ color: 'var(--fin-income)' }}>{fmt(2000000)}</div></div>
        <div className="drow"><div className="drow-l"><div className="drow-dot" style={{ background: 'var(--fin-deduct)' }} />Retención en la fuente</div><div className="drow-v" style={{ color: 'var(--fin-deduct)' }}>-{fmt(200000)}</div></div>
        <div className="drow"><div className="drow-l"><div className="drow-dot" style={{ background: 'var(--fin-reserve)' }} />PILA</div><div className="drow-v" style={{ color: 'var(--fin-reserve)' }}>-{fmt(250000)}</div></div>
        <div className="drow"><div className="drow-l"><div className="drow-dot" style={{ background: 'var(--fin-reserve)' }} />Reserva declaración</div><div className="drow-v" style={{ color: 'var(--fin-reserve)' }}>-{fmt(310000)}</div></div>
        <div className="dtotal"><div className="dtotal-l">Disponible real</div><div className="dtotal-v">{fmt(1240000)}</div></div>
      </div>
      <button className="btn btn-secondary btn-full mb3" onClick={() => navigate('I1')}>Ver todos los pagos</button>
    </div>
  )
}
