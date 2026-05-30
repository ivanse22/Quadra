const fmt = (n) => '$' + Math.round(n).toLocaleString('es-CO')
const MONTHS = ['E','F','M','A','M','J','J','A','S','O','N','D']

export default {
  title: 'Patterns/Annual (A1)',
  parameters: { phoneFrame: true, phoneLabel: 'Hero A1 Anual', fullHeight: false },
}

export const HeroWithStats = () => (
  <div className="hero-card hero-card--viewport mb5">
    <div className="hero-card-header">
      <div className="hero-eye" style={{ marginBottom: 0 }}>Ingresos 2026</div>
      <span className="hero-year-tag">2026</span>
    </div>

    <div className="hero-card-kpi">
      <div className="hero-amount hero-amount--lg">{fmt(48000000)}</div>
      <div className="hero-kpi-sublabel">Ingreso bruto acumulado</div>
      <div className="hero-sub" style={{ marginBottom: 0 }}>Ene – May 2026</div>
    </div>

    <div className="hero-year-progress">
      <div className="hero-year-progress-head">
        <span className="hero-year-progress-lbl">Avance del año</span>
        <span className="hero-year-progress-meta">42% del calendario · 38% real</span>
      </div>
      <div className="hero-year-bar-wrap">
        <div className="hero-year-bar-track">
          <div className="hero-year-bar-calendar" style={{ width: '42%' }} />
          <div className="hero-year-bar-fill" style={{ width: '38%' }} />
          <div className="hero-year-bar-dot" style={{ left: '42%' }} />
        </div>
      </div>
      <div className="hero-month-dots">
        {MONTHS.map((m, i) => (
          <span
            key={m + i}
            className={[
              'hero-month-dot',
              i < 5 ? 'hero-month-dot--filled' : '',
              i === 4 ? 'hero-month-dot--current' : '',
              i > 4 ? 'hero-month-dot--future' : '',
            ].filter(Boolean).join(' ')}
            title={m}
          />
        ))}
      </div>
    </div>

    <div className="hero-stats-grid">
      <div className="hero-stat">
        <div className="hero-stat-lbl">Mejor mes</div>
        <div className="hero-stat-val hero-stat-val--income">{fmt(12000000)}</div>
        <div className="hero-stat-sub hero-stat-sub--income">Mayo</div>
      </div>
      <div className="hero-stat">
        <div className="hero-stat-lbl">Promedio</div>
        <div className="hero-stat-val">{fmt(9600000)}</div>
      </div>
      <div className="hero-stat hero-stat--highlight">
        <div className="hero-stat-lbl">Proyección</div>
        <div className="hero-stat-val hero-stat-val--projection">{fmt(115000000)}</div>
      </div>
    </div>
  </div>
)

export const ToolCTAs = () => (
  <div className="cta-group mb5">
    <div className="cta-group-label">Herramientas</div>
    <button type="button" className="year-projection-cta year-projection-cta--compact">
      <span className="year-projection-cta-title">Proyectar mi ingreso</span>
    </button>
    <button type="button" className="year-projection-cta year-projection-cta--compact">
      <span className="year-projection-cta-title">Ver reserva para renta</span>
    </button>
    <button type="button" className="year-projection-cta year-projection-cta--compact">
      <span className="year-projection-cta-title">Ver calendario</span>
    </button>
  </div>
)
ToolCTAs.parameters = { phoneFrame: false, layout: 'padded' }
