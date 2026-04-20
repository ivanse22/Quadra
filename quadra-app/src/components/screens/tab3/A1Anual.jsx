import { useAppStore } from '../../../store/useAppStore'

export default function A1Anual() {
  const { monthlyData, navigate } = useAppStore()
  const max = Math.max(...monthlyData.map(m => m.amount), 1)
  const fmt = n => n >= 1000000 ? `$${(n/1000000).toFixed(1)}M` : n >= 1000 ? `$${(n/1000).toFixed(0)}k` : '$0'

  return (
    <div className="q-body-inner">
      {/* Annual KPI */}
      <div className="hero-card mb5">
        <div className="hero-eye">Ingresos 2026</div>
        <div className="hero-amount" style={{ fontSize: 'var(--t-2xl)' }}>
          <span className="twotone">
            <span className="twotone-main">$7.400</span><span className="twotone-dec">.000</span>
          </span>
        </div>
        <div className="hero-sub">Ene – Abr 2026 · 4 meses</div>
        <div className="hero-breakdown">
          <div><div className="hero-bk-lbl">Mejor mes</div><div className="hero-bk-val" style={{ color: 'var(--fin-income)' }}>Mar — $2.4M</div></div>
          <div><div className="hero-bk-lbl">Promedio</div><div className="hero-bk-val">$1.85M</div></div>
          <div><div className="hero-bk-lbl">Proyección</div><div className="hero-bk-val">$22.2M</div></div>
        </div>
      </div>

      {/* Bar chart — CSS puro */}
      <div className="card mb5" style={{ padding: 'var(--s5)' }}>
        <div className="card-title mb3">Ingresos brutos por mes</div>
        <div className="bar-chart" style={{ height: 140, alignItems: 'flex-end' }}>
          {monthlyData.map((m, i) => {
            const h = m.amount > 0 ? Math.max(Math.round((m.amount / max) * 120), 4) : 4
            const isActive = m.current
            const isProjEmpty = m.projected && m.amount === 0
            return (
              <div key={i} className="bar-col" style={{ cursor: 'pointer' }} onClick={() => !m.projected && navigate('A2')}>
                <div style={{ fontSize: 8, color: isActive ? 'var(--volt-text)' : 'var(--txt-m)', fontWeight: isActive ? 700 : 400, marginBottom: 2, fontFamily: 'var(--font-body)' }}>
                  {m.amount > 0 ? fmt(m.amount) : ''}
                </div>
                <div
                  className="bar-fill"
                  style={{
                    height: h,
                    background: isActive ? 'var(--volt-text)' : isProjEmpty ? 'var(--surf-3)' : 'var(--fin-income)',
                    opacity: isProjEmpty ? 0.5 : 1,
                    border: isProjEmpty ? '1.5px dashed var(--border-m)' : 'none',
                    borderRadius: '4px 4px 0 0',
                  }}
                />
                <div className="bar-lbl" style={{ color: isActive ? 'var(--volt-text)' : 'var(--txt-m)', fontWeight: isActive ? 700 : 400 }}>
                  {m.month}
                </div>
              </div>
            )
          })}
        </div>
        <div style={{ display: 'flex', gap: 'var(--s4)', marginTop: 'var(--s4)', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 9, color: 'var(--txt-m)', fontFamily: 'var(--font-body)' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--fin-income)', display: 'inline-block' }} /> Real
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 9, color: 'var(--txt-m)', fontFamily: 'var(--font-body)' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--volt-text)', display: 'inline-block' }} /> Mes actual
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 9, color: 'var(--txt-m)', fontFamily: 'var(--font-body)' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, border: '1.5px dashed var(--border-m)', display: 'inline-block' }} /> Proyectado
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s3)' }}>
        <button className="btn btn-secondary btn-full" onClick={() => navigate('A3')}>Ver total ganado</button>
        <button className="btn btn-ghost btn-full" onClick={() => navigate('A6')}>Proyectar mi ingreso</button>
      </div>
    </div>
  )
}
