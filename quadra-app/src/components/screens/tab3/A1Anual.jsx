import { useAppStore } from '../../../store/useAppStore'
import { IconTrendingUp } from '../../ui/Icons'

export default function A1Anual() {
  const { monthlyData, navigate } = useAppStore()
  const max = Math.max(...monthlyData.map(m => m.amount), 1)
  const fmt = n => n >= 1000000 ? `$${(n/1000000).toFixed(1)}M` : n >= 1000 ? `$${(n/1000).toFixed(0)}k` : '$0'

  return (
    <div className="q-body-inner">
      {/* Annual KPI */}
      <div className="hero-card mb5">
        <div className="hero-eye">Ingresos 2026</div>
        <div
          className="hero-amount"
          style={{
            fontSize: 'var(--t-hero)',
            fontWeight: 900,
            lineHeight: 0.92,
            letterSpacing: '-0.05em',
            color: 'var(--volt-text)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          $7.400.000
        </div>
        <div className="hero-sub" style={{ fontSize: 'var(--t-md)', marginTop: 'var(--s2)' }}>Ene – Abr 2026 · 4 meses</div>
        <div className="hero-breakdown">
          <div><div className="hero-bk-lbl">Mejor mes</div><div className="hero-bk-val" style={{ color: 'var(--fin-income)' }}>Mar — $2.4M</div></div>
          <div><div className="hero-bk-lbl">Promedio</div><div className="hero-bk-val">$1.85M</div></div>
          <div><div className="hero-bk-lbl">Proyección</div><div className="hero-bk-val">$22.2M</div></div>
        </div>
      </div>

      <button className="year-projection-cta mb5" onClick={() => navigate('A6')}>
        <div className="year-projection-cta-copy">
          <span className="year-projection-cta-title">Proyectar mi ingreso</span>
          <span className="year-projection-cta-sub">Simula tu disponible mensual y la proyección anual antes de cerrar el año.</span>
        </div>
        <span className="year-projection-cta-action" aria-hidden="true">
          <IconTrendingUp />
        </span>
      </button>

      {/* Bar chart — redesigned card */}
      <div className="card mb5 year-chart-card">
        <div className="year-chart-head">
          <div className="card-title">Ingresos brutos por mes</div>
          <div className="year-chart-sub">Comparativo 2026</div>
        </div>
        <div className="year-chart-scroll">
          <div className="bar-chart">
            {monthlyData.map((m, i) => {
              const percent = m.amount > 0 ? Math.max(Math.round((m.amount / max) * 100), 8) : 0
              const isActive = m.current
              const isProjEmpty = m.projected && m.amount === 0
              return (
                <button
                  key={i}
                  className={`bar-col${isActive ? ' is-active' : ''}${isProjEmpty ? ' is-projected' : ''}`}
                  onClick={() => !m.projected && navigate('A2')}
                  disabled={m.projected}
                  aria-label={`${m.month}: ${m.amount > 0 ? fmt(m.amount) : 'Proyectado'}`}
                >
                  <div className="bar-value">{m.amount > 0 ? fmt(m.amount) : ''}</div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ height: `${percent}%` }} />
                  </div>
                  <div className="bar-lbl">{m.month}</div>
                </button>
              )
            })}
          </div>
        </div>
        <div className="year-chart-legend">
          <span className="year-chart-chip"><span className="year-chart-dot real" />Real</span>
          <span className="year-chart-chip"><span className="year-chart-dot active" />Mes actual</span>
          <span className="year-chart-chip"><span className="year-chart-dot projected" />Proyectado</span>
        </div>
      </div>

      <button className="btn btn-secondary btn-full" onClick={() => navigate('A3')}>Ver total ganado</button>
    </div>
  )
}
