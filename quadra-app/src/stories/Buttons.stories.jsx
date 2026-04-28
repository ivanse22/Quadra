export default {
  title: 'App Components/Buttons',
  parameters: { layout: 'padded' },
};

export const AllButtons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

    <div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--txt-m)', marginBottom: 16 }}>Primary</p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <button className="btn btn-primary">Continuar</button>
        <button className="btn btn-primary btn-full" style={{ maxWidth: 300 }}>btn-full</button>
        <button className="btn btn-primary" disabled>Disabled</button>
      </div>
    </div>

    <div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--txt-m)', marginBottom: 16 }}>Secondary</p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <button className="btn btn-secondary">Cancelar</button>
        <button className="btn btn-secondary btn-sm">btn-sm</button>
        <button className="btn btn-secondary" disabled>Disabled</button>
      </div>
    </div>

    <div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--txt-m)', marginBottom: 16 }}>Ghost</p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <button className="btn btn-ghost">Ver más →</button>
        <button className="btn btn-ghost btn-full" style={{ maxWidth: 300 }}>btn-ghost btn-full</button>
      </div>
    </div>

    <div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--txt-m)', marginBottom: 16 }}>Confirm sequence</p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', maxWidth: 300 }}>
        <button className="btn-confirm">Confirmar pago</button>
        <button className="btn-confirm loading">Procesando...</button>
        <button className="btn-confirm success">¡Pago enviado! ✓</button>
      </div>
    </div>

  </div>
);
