const fmt = (n) => '$' + Math.round(n).toLocaleString('es-CO')

export default {
  title: 'Patterns/Home (D1)',
  parameters: { phoneFrame: true, phoneLabel: 'Hero D1 Home' },
}

export const HeroBlock = () => (
  <div className="d1-home-stack">
    <div className="d1-home-hero">
      <div className="d1-home-hero__eyebrow">
        <span className="hero-eye hero-eye--sm" style={{ margin: 0 }}>Lo que es tuyo hoy</span>
        <button
          type="button"
          style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', padding: '2px 4px', cursor: 'pointer', color: 'var(--txt-f)', borderRadius: 'var(--r-sm)' }}
          aria-label="¿Cómo se calcula este número?"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </button>
      </div>
      <button type="button" className="d1-hero-amount" aria-label="Ver desglose de tu disponible real">
        {fmt(8506944)}
      </button>
      <div className="d1-home-hero__meta">
        <div className="d1-home-hero__date">15 May 2026</div>
        <span className="d1-home-hero__badge">Disponible actualizado</span>
      </div>
    </div>
  </div>
)
