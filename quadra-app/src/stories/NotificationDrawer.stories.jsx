export default {
  title: 'App Components/Notification Drawer',
  parameters: { layout: 'padded' },
};

const mockNotifications = [
  { id: 1, icon: 'shield', title: 'Declaración de renta', msg: 'Tienes hasta el 30 de junio para presentar tu declaración.', actionLabel: 'Ver detalle', action: 'A4' },
  { id: 2, icon: 'calendar', title: 'PILA vence pronto', msg: 'El pago de seguridad social está próximo a vencer el 15 del mes.', actionLabel: 'Ir a PILA', action: 'D3' },
];

const ICON_MAP = {
  shield: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  calendar: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
};

export const WithNotifications = () => (
  <div style={{ maxWidth: 390, background: 'var(--bg)', borderRadius: 'var(--r-2xl)', border: '1px solid var(--border)', overflow: 'hidden' }}>
    <div className="fab-sheet" style={{ position: 'relative', maxHeight: 'none' }}>
      <div className="fab-sheet-handle" />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 'var(--s3)' }}>
        <p className="fab-sheet-title" style={{ margin: 0 }}>Notificaciones</p>
        <button style={{ background: 'none', border: 'none', padding: 'var(--s2) var(--s1)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 'var(--t-xs)', color: 'var(--txt-m)' }}>
          Leer todo ×
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s3)' }}>
        {mockNotifications.map(n => (
          <div key={n.id} style={{ background: 'var(--surf-1)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: 'var(--s4)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--s3)', marginBottom: 'var(--s3)' }}>
              <span style={{ flexShrink: 0, color: 'var(--txt-m)', paddingTop: 2 }}>{ICON_MAP[n.icon]}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--t-sm)', fontWeight: 700, color: 'var(--txt)', marginBottom: 4 }}>{n.title}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--t-xs)', color: 'var(--txt-m)', lineHeight: 1.5 }}>{n.msg}</div>
              </div>
            </div>
            <button className="btn btn-secondary btn-full" style={{ height: 40 }}>{n.actionLabel}</button>
          </div>
        ))}
      </div>
      <button className="btn btn-ghost btn-full" style={{ marginTop: 'var(--s4)' }}>Configurar alertas →</button>
    </div>
  </div>
);

export const Empty = () => (
  <div style={{ maxWidth: 390, background: 'var(--bg)', borderRadius: 'var(--r-2xl)', border: '1px solid var(--border)', overflow: 'hidden' }}>
    <div className="fab-sheet" style={{ position: 'relative', maxHeight: 'none' }}>
      <div className="fab-sheet-handle" />
      <p className="fab-sheet-title">Notificaciones</p>
      <div style={{ padding: 'var(--s8) 0', textAlign: 'center', color: 'var(--txt-m)', fontFamily: 'var(--font-body)', fontSize: 'var(--t-sm)' }}>
        Sin notificaciones pendientes
      </div>
    </div>
  </div>
);
