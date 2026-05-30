export default {
  title: 'App Components/Forms & Inputs',
  parameters: { layout: 'padded' },
};

export const AllFormElements = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 40, maxWidth: 400 }}>

    <div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--txt-m)', marginBottom: 16 }}>Text Input</p>
      <div className="field">
        <label className="field-label">Nombre completo</label>
        <input className="field-input" type="text" placeholder="ej. Juan García" />
      </div>
    </div>

    <div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--txt-m)', marginBottom: 16 }}>Input con error</p>
      <div className="field field-error">
        <label className="field-label">Email</label>
        <input className="field-input" type="email" value="noválido" readOnly />
        <span className="field-hint field-hint-error">Ingresa un correo válido</span>
      </div>
    </div>

    <div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--txt-m)', marginBottom: 16 }}>Segmented Control</p>
      <div className="seg-ctrl">
        <button type="button" className="seg-btn active">Mensual</button>
        <button type="button" className="seg-btn">Anual</button>
        <button type="button" className="seg-btn">Total</button>
      </div>
    </div>

    <div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--txt-m)', marginBottom: 16 }}>Toggle Switch</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--surf-1)', borderRadius: 'var(--r-md)' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--txt)' }}>Notificaciones activas</span>
          <label className="toggle">
            <input type="checkbox" defaultChecked />
            <span className="toggle-track"><span className="toggle-thumb" /></span>
          </label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--surf-1)', borderRadius: 'var(--r-md)' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--txt)' }}>Modo oscuro</span>
          <label className="toggle">
            <input type="checkbox" />
            <span className="toggle-track"><span className="toggle-thumb" /></span>
          </label>
        </div>
      </div>
    </div>

    <div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--txt-m)', marginBottom: 16 }}>Select</p>
      <div className="field">
        <label className="field-label">Tipo de contrato</label>
        <select className="field-input">
          <option>Persona natural</option>
          <option>Empleado</option>
          <option>Pensionado</option>
        </select>
      </div>
    </div>

  </div>
);
