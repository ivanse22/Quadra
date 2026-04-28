export default {
  title: 'Layout/App Shell',
  parameters: { layout: 'centered' },
};

const PhoneShell = ({ children, label }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
    {label && <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--txt-m)' }}>{label}</p>}
    <div className="q-phone">
      <div className="q-status">
        <span className="q-status-time">9:41</span>
        <span style={{ fontSize: 12, color: 'var(--txt)' }}>🔋 📶</span>
      </div>
      {children}
    </div>
  </div>
);

export const HeaderVariantA = () => (
  <PhoneShell label="Header A — Logo + Bell (D1, C3)">
    <header className="q-header">
      <div className="q-hdr-logo">
        <div className="q-hdr-logo-mark" style={{ background: 'var(--txt)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--bg)"><rect width="24" height="24" rx="4" /></svg>
        </div>
        <span className="q-hdr-logo-name">quadra</span>
      </div>
      <div className="q-hdr-right">
        <button className="q-hdr-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        </button>
      </div>
    </header>
    <div className="q-body"><div className="q-body-inner" /></div>
    <BottomNavMock active={0} />
  </PhoneShell>
);

export const HeaderVariantB = () => (
  <PhoneShell label="Header B — Back + Title centered">
    <header className="q-header">
      <button className="q-hdr-back">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
      </button>
      <span className="q-hdr-title-center">Nuevo pago</span>
      <div className="q-hdr-right" />
    </header>
    <div className="q-body"><div className="q-body-inner" /></div>
  </PhoneShell>
);

export const HeaderVariantC = () => (
  <PhoneShell label="Header C — Title left (listas)">
    <header className="q-header">
      <span className="q-hdr-title-left">Mis Ingresos</span>
      <div className="q-hdr-right">
        <button className="q-hdr-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
      </div>
    </header>
    <div className="q-body"><div className="q-body-inner" /></div>
    <BottomNavMock active={1} />
  </PhoneShell>
);

export const BottomNavStory = () => (
  <PhoneShell label="Bottom Nav — con badge">
    <div className="q-body" style={{ background: 'var(--bg-subtle)' }}><div className="q-body-inner" /></div>
    <BottomNavMock active={0} badge={2} />
  </PhoneShell>
);
BottomNavStory.storyName = 'Bottom Nav';

function BottomNavMock({ active = 0, badge = 0 }) {
  const tabs = [
    { label: 'Mi Dinero', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg> },
    { label: 'Mis Ingresos', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
    { label: 'Mi Año', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
    { label: 'Mi Cuenta', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  ];
  return (
    <nav className="bottom-nav">
      {tabs.map((t, i) => (
        <button key={i} className={`nav-item${active === i ? ' on' : ''}`} style={{ position: 'relative' }}>
          {t.icon}
          <span>{t.label}</span>
          {i === 1 && badge > 0 && active !== 1 && (
            <span style={{ position: 'absolute', top: 6, right: '50%', marginRight: -18, minWidth: 16, height: 16, borderRadius: 'var(--r-full)', background: 'var(--volt)', color: 'var(--volt-on)', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', border: '1.5px solid var(--bg)' }}>{badge}</span>
          )}
        </button>
      ))}
    </nav>
  );
}
