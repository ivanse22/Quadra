export default {
  title: 'App Components/Feedback & States',
  parameters: { layout: 'padded' },
};

export const Toasts = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 380 }}>
    <div className="toast toast-success">
      <div className="toast-icon">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
      </div>
      <span className="toast-text">Pago registrado exitosamente</span>
      <div className="toast-progress" />
    </div>
    <div className="toast toast-error">
      <div className="toast-icon">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </div>
      <span className="toast-text">Error al conectar con el servidor</span>
    </div>
    <div className="toast toast-info">
      <div className="toast-icon">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      </div>
      <span className="toast-text">Nueva actualización disponible</span>
      <button className="toast-action">Actualizar</button>
      <div className="toast-progress" />
    </div>
  </div>
);

export const EmptyStates = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 360 }}>
    <div className="empty-state">
      <div className="empty-state-icon">💸</div>
      <div className="empty-state-title">Sin pagos este mes</div>
      <div className="empty-state-sub">Registra tu primer pago para empezar a ver tu resumen financiero.</div>
      <button className="btn btn-primary" style={{ marginTop: 16 }}>Registrar pago</button>
    </div>
  </div>
);

export const SkeletonLoaders = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 }}>
    <div className="skel" style={{ height: 120, borderRadius: 'var(--r-2xl)' }} />
    <div style={{ display: 'flex', gap: 12 }}>
      <div className="skel" style={{ height: 80, flex: 1, borderRadius: 'var(--r-lg)' }} />
      <div className="skel" style={{ height: 80, flex: 1, borderRadius: 'var(--r-lg)' }} />
    </div>
    {[1, 2, 3].map(i => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0' }}>
        <div className="skel" style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div className="skel" style={{ height: 14, width: '60%', borderRadius: 6 }} />
          <div className="skel" style={{ height: 12, width: '40%', borderRadius: 6 }} />
        </div>
        <div className="skel" style={{ height: 14, width: 70, borderRadius: 6 }} />
      </div>
    ))}
  </div>
);

export const Badges = () => (
  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
    <span className="badge">Default</span>
    <span className="badge badge-income">Ingreso</span>
    <span className="badge badge-deduct">Gasto</span>
    <span className="badge badge-reserve">Reserva</span>
    <span className="badge badge-volt">Nuevo</span>
  </div>
);

export const ProgressBar = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 360 }}>
    {[25, 60, 85, 100].map(val => (
      <div key={val}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--txt-m)' }}>
          <span>Progreso</span><span>{val}%</span>
        </div>
        <div className="prog-track">
          <div className="prog-bar" style={{ width: `${val}%` }} />
        </div>
      </div>
    ))}
  </div>
);
