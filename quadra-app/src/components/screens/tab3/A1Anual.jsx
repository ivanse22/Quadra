import { useAppStore } from '../../../store/useAppStore'

export default function A1Anual() {
  const { monthlyData, navigate } = useAppStore()
  const actualMonths = monthlyData.filter(m => m.amount > 0)
  const max = Math.max(...monthlyData.map(m => m.amount), 1)
  const total = actualMonths.reduce((sum, month) => sum + month.amount, 0)
  const average = actualMonths.length ? Math.round(total / actualMonths.length) : 0
  const bestMonth = actualMonths.reduce((best, month) => month.amount > best.amount ? month : best, actualMonths[0] || { month: 'Sin datos', amount: 0 })
  const projectedTotal = total + (average * (12 - actualMonths.length))

  const fmt = (n) => {
    if (!n) return '$0'
    if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
    if (n >= 1000) return `$${(n / 1000).toFixed(0)}k`
    return `$${n.toLocaleString('es-CO')}`
  }

  const heroAmount = total.toLocaleString('es-CO')
  const [heroMain, heroDec = '000'] = heroAmount.split('.')

  return (
    <div className="q-body-inner">
      {/* Annual KPI */}
      <div className="hero-card mb5">
        <div className="hero-eye">Ingresos 2026</div>
        <div className="hero-amount" style={{ fontSize: 'var(--t-2xl)' }}>
          <span className="twotone">
            <span className="twotone-main">${heroMain}</span><span className="twotone-dec">.{heroDec}</span>
          </span>
        </div>
        <div className="hero-sub">{actualMonths[0]?.month || 'Sin movimientos'} – {actualMonths[actualMonths.length - 1]?.month || '2026'} · {actualMonths.length || 0} meses</div>
        <div className="hero-breakdown">
          <div><div className="hero-bk-lbl">Mejor mes</div><div className="hero-bk-val" style={{ color: 'var(--fin-income)' }}>{bestMonth.month} — {fmt(bestMonth.amount)}</div></div>
          <div><div className="hero-bk-lbl">Promedio</div><div className="hero-bk-val">{fmt(average)}</div></div>
          <div><div className="hero-bk-lbl">Proyección</div><div className="hero-bk-val">{fmt(projectedTotal)}</div></div>
        </div>
      </div>

      <button className="year-projection-cta mb5" onClick={() => navigate('A6')}>
        <div className="year-projection-cta-copy">
          <span className="year-projection-cta-title">Proyectar mi ingreso</span>
          <span className="year-projection-cta-sub">Simula tu disponible mensual y la proyección anual antes de cerrar el año.</span>
        </div>
        <span className="year-projection-cta-action">Abrir</span>
      </button>

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
                <div className="bar-value" style={{ color: isActive ? 'var(--volt-text)' : 'var(--txt-m)', fontWeight: isActive ? 700 : 500, marginBottom: 2 }}>
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
        <div className="chart-legend">
          <span className="chart-legend-item">
            <span className="chart-legend-swatch" style={{ background: 'var(--fin-income)' }} /> Real
          </span>
          <span className="chart-legend-item">
            <span className="chart-legend-swatch" style={{ background: 'var(--volt-text)' }} /> Mes actual
          </span>
          <span className="chart-legend-item">
            <span className="chart-legend-swatch" style={{ border: '1.5px dashed var(--border-m)' }} /> Proyectado
          </span>
        </div>
      </div>

      <button className="btn btn-secondary btn-full" onClick={() => navigate('A3')}>Ver total ganado</button>
    </div>
  )
}
