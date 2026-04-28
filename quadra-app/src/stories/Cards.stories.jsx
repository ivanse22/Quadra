export default {
  title: 'App Components/Cards',
  parameters: { layout: 'padded', docs: { description: { component: 'Componentes de tarjeta usando las clases reales de components.css' } } },
};

export const HeroCard = () => (
  <div className="hero-card" style={{ maxWidth: 360 }}>
    <div className="hero-eye">Disponible</div>
    <div className="hero-amount">$12,450.00</div>
    <div className="hero-sub">Balance total del mes</div>
    <div className="hero-breakdown">
      <div>
        <div className="hero-bk-lbl">Ingresos</div>
        <div className="hero-bk-val" style={{ color: 'var(--fin-income)' }}>+$15,000</div>
      </div>
      <div>
        <div className="hero-bk-lbl">Gastos</div>
        <div className="hero-bk-val" style={{ color: 'var(--fin-deduct)' }}>-$2,550</div>
      </div>
      <div>
        <div className="hero-bk-lbl">Reserva</div>
        <div className="hero-bk-val" style={{ color: 'var(--fin-reserve)' }}>$0</div>
      </div>
    </div>
  </div>
);

export const DesgloseCard = () => (
  <div className="desglose" style={{ maxWidth: 360 }}>
    <div className="drow">
      <div className="drow-l"><div className="drow-dot" style={{ background: 'var(--volt)' }}></div> Nómina cliente A</div>
      <div className="drow-v">$8,000,000</div>
    </div>
    <div className="drow">
      <div className="drow-l"><div className="drow-dot" style={{ background: 'var(--fin-income)' }}></div> Proyecto freelance</div>
      <div className="drow-v">$4,450,000</div>
    </div>
    <div className="drow">
      <div className="drow-l"><div className="drow-dot" style={{ background: 'var(--fin-reserve)' }}></div> Anticipo</div>
      <div className="drow-v">$1,000,000</div>
    </div>
    <div className="dtotal">
      <div className="dtotal-l">Total Ingresos</div>
      <div className="dtotal-v">$13,450,000</div>
    </div>
  </div>
);

export const TransactionList = () => (
  <div className="tx-list" style={{ maxWidth: 400 }}>
    <div className="tx-section-header">Hoy</div>
    <div className="tx-row">
      <div className="tx-icon">🍟</div>
      <div className="tx-info">
        <div className="tx-name">Rappi — Almuerzo</div>
        <div className="tx-sub">Comida · 12:30 pm</div>
      </div>
      <div className="tx-amount" style={{ color: 'var(--fin-deduct)' }}>-$35,000</div>
    </div>
    <div className="tx-row">
      <div className="tx-icon">💻</div>
      <div className="tx-info">
        <div className="tx-name">Cliente ABC S.A.S</div>
        <div className="tx-sub">Transferencia · 9:00 am</div>
      </div>
      <div className="tx-amount" style={{ color: 'var(--fin-income)' }}>+$4,500,000</div>
    </div>
    <div className="tx-section-header">Ayer</div>
    <div className="tx-row">
      <div className="tx-icon">🏠</div>
      <div className="tx-info">
        <div className="tx-name">Arriendo</div>
        <div className="tx-sub">Vivienda · 8:00 am</div>
      </div>
      <div className="tx-amount" style={{ color: 'var(--fin-deduct)' }}>-$1,200,000</div>
    </div>
  </div>
);
