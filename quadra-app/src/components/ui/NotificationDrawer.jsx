import { useAppStore } from '../../store/useAppStore'

export default function NotificationDrawer() {
  const { notifications, markAllRead, navigate, setNotifDrawerOpen } = useAppStore()

  const handleAction = (screen) => {
    markAllRead()
    setNotifDrawerOpen(false)
    navigate(screen)
  }

  const handleClose = () => {
    markAllRead()
    setNotifDrawerOpen(false)
  }

  return (
    <>
      <div className="fab-sheet-overlay" onClick={handleClose} aria-hidden="true" />
      <div className="fab-sheet" role="dialog" aria-label="Notificaciones">
        <div className="fab-sheet-handle" />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 'var(--s3)' }}>
          <p className="fab-sheet-title" style={{ margin: 0 }}>Notificaciones</p>
          <button
            onClick={handleClose}
            style={{
              background: 'none', border: 'none', padding: 'var(--s2) var(--s1)',
              cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 'var(--t-xs)',
              color: 'var(--txt-m)', display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            Leer todo ×
          </button>
        </div>

        {notifications.length === 0 ? (
          <div style={{ padding: 'var(--s8) 0', textAlign: 'center', color: 'var(--txt-m)', fontFamily: 'var(--font-body)', fontSize: 'var(--t-sm)' }}>
            Sin notificaciones pendientes
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s3)' }}>
            {notifications.map(n => (
              <div
                key={n.id}
                style={{
                  background: 'var(--surf-1)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-xl)',
                  padding: 'var(--s4)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--s3)', marginBottom: 'var(--s3)' }}>
                  <span style={{ fontSize: 20, flexShrink: 0, lineHeight: 1.2 }}>{n.icon}</span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--t-sm)', fontWeight: 700, color: 'var(--txt)', marginBottom: 4 }}>
                      {n.title}
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--t-xs)', color: 'var(--txt-m)', lineHeight: 1.5 }}>
                      {n.msg}
                    </div>
                  </div>
                </div>
                <button
                  className="btn btn-secondary btn-full"
                  style={{ height: 40 }}
                  onClick={() => handleAction(n.action)}
                >
                  {n.actionLabel}
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          className="btn btn-ghost btn-full"
          style={{ marginTop: 'var(--s4)' }}
          onClick={() => { setNotifDrawerOpen(false); navigate('C2') }}
        >
          Configurar alertas →
        </button>
      </div>
    </>
  )
}
