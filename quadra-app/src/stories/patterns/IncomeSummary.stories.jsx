const fmt = (n) => '$' + Math.round(n).toLocaleString('es-CO')
const fmtCompact = (n) => '$' + new Intl.NumberFormat('es-CO', {
  notation: 'compact',
  maximumFractionDigits: 1,
}).format(Math.abs(n || 0))

const breakdownSlides = [
  { key: 'disp', label: 'Disponible', value: fmtCompact(8506944), color: 'var(--fin-income)' },
  { key: 'ret', label: 'Retención', value: fmtCompact(1200000), color: 'var(--fin-deduct)' },
  { key: 'pila', label: 'Pila', value: fmtCompact(1400000), color: 'var(--fin-reserve)' },
  { key: 'res', label: 'Reserva', value: fmtCompact(900000), color: 'var(--volt-border)' },
]

export default {
  title: 'Patterns/Income (I1)',
  parameters: { phoneFrame: true, phoneLabel: 'Tarjeta resumen I1' },
}

export const SummaryCard = () => (
  <div className="income-page">
    <div className="card income-summary-card">
      <div className="income-summary-header">
        <div className="income-summary-eyebrow">Período actual</div>
        <span className="trend-badge trend-up">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
            <path d="M18 15l-6-6-6 6" />
          </svg>
          +{fmtCompact(12000000)}
        </span>
      </div>

      <div className="income-summary-kpi">
        <div className="income-summary-amount">{fmt(12000000)}</div>
        <div className="income-summary-sub">May 2026 · Ingreso bruto registrado</div>
      </div>

      <div className="income-summary-available-block">
        <div className="income-summary-available">{fmt(8506944)}</div>
        <div className="income-summary-available-sub">Disponible real · 5 movimientos</div>
      </div>

      <div className="income-breakdown-section">
        <div className="income-breakdown-title">Distribución del ingreso</div>
        <div className="i1-breakdown-bar">
          <div className="i1-breakdown-seg" style={{ width: '71%', background: 'var(--fin-income)' }} />
          <div className="i1-breakdown-seg" style={{ width: '10%', background: 'var(--fin-deduct)' }} />
          <div className="i1-breakdown-seg" style={{ width: '12%', background: 'var(--fin-reserve)' }} />
          <div className="i1-breakdown-seg" style={{ width: '7%', background: 'var(--volt-border)' }} />
        </div>
        <div className="i1-dist-carousel" role="list" aria-label="Distribución del ingreso">
          {breakdownSlides.map((slide) => (
            <div key={slide.key} className="i1-dist-slide" role="listitem">
              <div className="i1-dist-slide-head">
                <span className="i1-dist-dot" style={{ background: slide.color }} />
                <span className="i1-dist-cat-title">{slide.label}</span>
              </div>
              <span className="i1-dist-value">{slide.value}</span>
            </div>
          ))}
        </div>
        <div className="i1-dist-dots" aria-hidden>
          {breakdownSlides.map((slide) => (
            <span key={slide.key} className="i1-dist-dot-indicator" />
          ))}
        </div>
        <button type="button" className="income-breakdown-link">Ver desglose completo →</button>
      </div>
    </div>
  </div>
)
