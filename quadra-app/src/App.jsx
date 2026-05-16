import { useEffect, useRef, useState } from 'react'
import './styles/index.css'
import { useAppStore } from './store/useAppStore'
import { supabase } from './lib/supabase'
import { computeNotifications } from './lib/notifications'

const MONTH_LABELS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

// ── FAB quick-action definitions ─────────────────────────────────────────────
const QUICK_ACTIONS = [
  {
    id: 'nuevo-pago',
    label: 'Nuevo pago',
    desc: 'Registrar un ingreso',
    color: 'var(--volt-text)',
    bg: 'var(--volt-dim)',
    border: 'var(--volt-border)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
    ),
    action: (navigate) => navigate('I2'),
  },
  {
    id: 'movimientos',
    label: 'Movimientos',
    desc: 'Ver todos los ingresos',
    color: 'var(--txt)',
    bg: 'var(--surf-1)',
    border: 'var(--border)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
        <line x1="8" y1="18" x2="21" y2="18"/>
        <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    ),
    action: (navigate) => navigate('I1'),
  },
  {
    id: 'pagar-pila',
    label: 'Pagar PILA',
    desc: 'Salud y pensión',
    color: 'var(--fin-reserve)',
    bg: 'var(--fin-reserve-dim)',
    border: 'var(--fin-reserve-border)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    action: (navigate) => navigate('D3'),
  },
  {
    id: 'reservado',
    label: 'Reservado',
    desc: 'Fondo para declaración',
    color: 'var(--fin-income)',
    bg: 'var(--fin-income-dim)',
    border: 'var(--fin-income-border)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M8 12h.01M12 8v4l2.5 2.5"/>
      </svg>
    ),
    action: (navigate) => navigate('D4'),
  },
]

// Layout
import Header from './components/layout/Header'
import BottomNav from './components/layout/BottomNav'
import ToastContainer from './components/ui/Toast'
import InstallBanner from './components/ui/InstallBanner'
import NotificationDrawer from './components/ui/NotificationDrawer'

// Onboarding
import O1Welcome from './components/screens/onboarding/O1Welcome'
import O1CreaCuenta from './components/screens/onboarding/O1CreaCuenta'
import O2Regimen from './components/screens/onboarding/O2Regimen'
import O3Retencion from './components/screens/onboarding/O3Retencion'
import O4PILA from './components/screens/onboarding/O4PILA'
import O5Resultado from './components/screens/onboarding/O5Resultado'
import B1Login from './components/screens/onboarding/B1Login'
import B2RecuperarPassword from './components/screens/onboarding/B2RecuperarPassword'

// Tab 1 — Mi Dinero
import D1Home from './components/screens/tab1/D1Home'
import D2Entender from './components/screens/tab1/D2Entender'
import D3PagarPILA from './components/screens/tab1/D3PagarPILA'
import D4Reserva from './components/screens/tab1/D4Reserva'

// Tab 2 — Mis Ingresos
import I1Pagos from './components/screens/tab2/I1Pagos'
import I2Registro from './components/screens/tab2/I2Registro'
import I2Resultado from './components/screens/tab2/I2Resultado'
import I3Detalle from './components/screens/tab2/I3Detalle'
import I4TotalGanado from './components/screens/tab2/I4TotalGanado'
import I5HistorialPILA from './components/screens/tab2/I5HistorialPILA'

// Tab 3 — Mi Año
import A1Anual from './components/screens/tab3/A1Anual'
import A2Mensual from './components/screens/tab3/A2Mensual'
import A3TotalAnio from './components/screens/tab3/A3TotalAnio'
import A4ReservaSaldo from './components/screens/tab3/A4ReservaSaldo'
import A5ReservaProyeccion from './components/screens/tab3/A5ReservaProyeccion'
import A6Proyectar from './components/screens/tab3/A6Proyectar'
import A7Exportar from './components/screens/tab3/A7Exportar'
import A8Calendario from './components/screens/tab3/A8Calendario'

// Tab 4 — Mi Cuenta
import C1DatosPersonales from './components/screens/tab4/C1DatosPersonales'
import C2Alertas from './components/screens/tab4/C2Alertas'
import C3CuentasConectadas from './components/screens/tab4/C3CuentasConectadas'
import C4AgregarCuenta from './components/screens/tab4/C4AgregarCuenta'
import C4Conectando from './components/screens/tab4/C4Conectando'

// Status bar padding (safe-area spacing only)
function StatusBar() {
  return (
    <div className="q-status" style={{ background: 'transparent' }}>
    </div>
  )
}

// Show/hide header logic
const NO_HEADER = ['O1', 'I2R', 'C4C']
const AUTH_SCREENS = ['O1', 'O1C', 'O2', 'O3', 'O4', 'O5', 'B1', 'B2']
const showHeader = (screen) => !NO_HEADER.includes(screen)

const SCREENS = {
  O1: O1Welcome, O1C: O1CreaCuenta, O2: O2Regimen, O3: O3Retencion, O4: O4PILA, O5: O5Resultado,
  B1: B1Login, B2: B2RecuperarPassword,
  D1: D1Home, D2: D2Entender, D3: D3PagarPILA, D4: D4Reserva,
  I1: I1Pagos, I2: I2Registro, I2R: I2Resultado, I3: I3Detalle, I4: I4TotalGanado, I5: I5HistorialPILA,
  A1: A1Anual, A2: A2Mensual, A3: A3TotalAnio, A4: A4ReservaSaldo, A5: A5ReservaProyeccion, A6: A6Proyectar, A7: A7Exportar, A8: A8Calendario,
  C1: C1DatosPersonales, C2: C2Alertas, C3: C3CuentasConectadas, C4: C4AgregarCuenta, C4C: C4Conectando,
}

export default function App() {
  const { currentScreen, theme, wireframeMode, session, setSession, navigate, navigateRoot, switchTab, payments, loadUserData, clearUserData, selectedAnnualMonth, kpis, profile, alerts, syncNotifications, notifDrawerOpen } = useAppStore()
  const deferredPrompt = useRef(null)
  const [showInstallBanner, setShowInstallBanner] = useState(false)
  const [showQuickMenu, setShowQuickMenu] = useState(false)
  /** Evita tratar `session: null` inicial como cierre de sesión antes de getSession() */
  const [authReady, setAuthReady] = useState(false)
  const bodyRef = useRef(null)
  const fabRef = useRef(null)
  const sheetRef = useRef(null)
  const sheetDragRef = useRef({ startY: null, startTime: null })

  const onSheetPointerDown = (e) => {
    sheetDragRef.current = { startY: e.clientY, startTime: Date.now() }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onSheetPointerMove = (e) => {
    const { startY } = sheetDragRef.current
    if (startY === null || !sheetRef.current) return
    const dy = Math.max(0, e.clientY - startY)
    sheetRef.current.style.transition = 'none'
    sheetRef.current.style.transform = `translateY(${dy}px)`
  }
  const onSheetPointerUp = (e) => {
    const { startY, startTime } = sheetDragRef.current
    if (startY === null || !sheetRef.current) return
    sheetDragRef.current = { startY: null, startTime: null }
    const dy = Math.max(0, e.clientY - startY)
    const dt = Date.now() - startTime
    const velocity = dt > 0 ? dy / dt : 0
    if (dy > 80 || velocity > 0.5) {
      sheetRef.current.style.transition = 'transform 220ms var(--ease-accel)'
      sheetRef.current.style.transform = `translateY(100%)`
      setTimeout(() => setShowQuickMenu(false), 220)
    } else {
      sheetRef.current.style.transition = 'transform 320ms var(--ease-spring)'
      sheetRef.current.style.transform = 'translateY(0)'
    }
  }

  // Spring-press animation handlers for the FAB button
  const onFabDown = () => {
    if (!fabRef.current) return
    fabRef.current.style.transition = 'transform 80ms var(--ease-in)'
    fabRef.current.style.transform = 'scale(0.87)'
  }
  const onFabUp = () => {
    if (!fabRef.current) return
    fabRef.current.style.transition = 'transform 500ms var(--ease-spring)'
    fabRef.current.style.transform = 'scale(1)'
  }

  // Intercept the native A2HS prompt so we can trigger it on demand
  useEffect(() => {
    if (localStorage.getItem('pwa-install-dismissed')) return

    const handleInstallPrompt = (e) => {
      e.preventDefault()
      deferredPrompt.current = e
      setShowInstallBanner(true)
    }

    const handleInstalled = () => {
      deferredPrompt.current = null
      setShowInstallBanner(false)
    }

    window.addEventListener('beforeinstallprompt', handleInstallPrompt)
    window.addEventListener('appinstalled', handleInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt)
      window.removeEventListener('appinstalled', handleInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt.current) return
    deferredPrompt.current.prompt()
    const { outcome } = await deferredPrompt.current.userChoice
    deferredPrompt.current = null
    setShowInstallBanner(false)
    if (outcome === 'dismissed') {
      localStorage.setItem('pwa-install-dismissed', '1')
    }
  }

  const handleDismissBanner = () => {
    setShowInstallBanner(false)
    localStorage.setItem('pwa-install-dismissed', '1')
  }

  // M3.3 — Sync in-app notifications whenever payments or kpis change
  useEffect(() => {
    const newNotifs = computeNotifications(payments, kpis, profile, alerts)
    syncNotifications(newNotifs)
  }, [payments, kpis]) // eslint-disable-line react-hooks/exhaustive-deps

  // Reset scroll position and close quick menu on every screen change
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0
    const frameId = requestAnimationFrame(() => {
      if (currentScreen !== 'D1') setShowQuickMenu(false)
      bodyRef.current?.focus({ preventScroll: true })
    })
    return () => cancelAnimationFrame(frameId)
  }, [currentScreen])

  useEffect(() => {
    const titles = {
      D1: 'Quadra',
      I1: 'Mis Ingresos',
      I2: 'Nuevo pago',
      I2R: 'Resultado del pago',
      I3: 'Detalle del pago',
      I4: 'Indicadores',
      I5: 'Historial PILA',
      A1: 'Mi Año',
      A2: `${MONTH_LABELS[selectedAnnualMonth ?? new Date().getMonth()]} ${new Date().getFullYear()}`,
      A3: 'Resumen anual',
      A4: 'Reserva declaración',
      A5: 'Proyección reserva',
      A6: 'Proyectar ingresos',
      A7: 'Exportar resumen',
      A8: 'Calendario',
      C1: 'Mis datos',
      C2: 'Alertas',
      C3: 'Cuentas',
      C4: 'Agregar cuenta',
      C4C: 'Conectando cuenta',
    }
    document.title = titles[currentScreen] ? `${titles[currentScreen]} · Quadra` : 'Quadra'
  }, [currentScreen, selectedAnnualMonth])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    if (wireframeMode) {
      document.documentElement.setAttribute('data-wireframe', 'true')
    } else {
      document.documentElement.removeAttribute('data-wireframe')
    }
  }, [wireframeMode])

  // Cargar / limpiar datos según sesión (solo tras el primer getSession, para no vaciar el store antes)
  useEffect(() => {
    if (!authReady) return
    if (session && !session.mock && session.user?.id) {
      loadUserData(session.user.id)
    } else if (!session) {
      clearUserData()
    }
  }, [authReady, session, loadUserData, clearUserData])

  useEffect(() => {
    if (!authReady || session) return
    if (!AUTH_SCREENS.includes(currentScreen)) {
      navigateRoot('B1')
    }
  }, [authReady, session, currentScreen, navigateRoot])

  useEffect(() => {
    // Demo / screenshot mode: if a mock session was rehydrated from localStorage,
    // skip Supabase auth entirely so the app stays on the injected screen.
    if (session?.mock) {
      queueMicrotask(() => setAuthReady(true))
      return
    }

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session)
      })
      .finally(() => {
        setAuthReady(true)
      })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [setSession]) // eslint-disable-line react-hooks/exhaustive-deps

  const Screen = SCREENS[currentScreen] || D1Home

  // FAB is only shown on Mi Dinero tab and only when there are payments
  const showFab = currentScreen === 'D1' && payments.length > 0

  return (
    <div className="q-phone" data-theme={theme}>
      {currentScreen !== 'O1' && <StatusBar />}
      {showHeader(currentScreen) && <Header />}
      <div
        className="q-body"
        ref={bodyRef}
        tabIndex={-1}
        style={currentScreen === 'O1' ? { paddingTop: 0 } : {}}
      >
        <Screen />
      </div>
      <BottomNav />

      {/* ── FAB + Quick-action sheet (direct child of q-phone to avoid overflow clipping) ── */}
      {showFab && (
        <>
          {showQuickMenu && (
            <div
              className="fab-sheet-overlay"
              onClick={() => setShowQuickMenu(false)}
              aria-hidden="true"
            />
          )}
          {showQuickMenu && (
            <div
              ref={sheetRef}
              className="fab-sheet"
              role="dialog"
              aria-label="Acciones rápidas"
            >
              <div
                className="fab-sheet-handle"
                onPointerDown={onSheetPointerDown}
                onPointerMove={onSheetPointerMove}
                onPointerUp={onSheetPointerUp}
              />
              <p className="fab-sheet-title">Acciones rápidas</p>
              <p className="fab-sheet-subtitle">Selecciona lo que quieres hacer</p>
              <div className="fab-sheet-list">
                {QUICK_ACTIONS.map((item) => (
                  <button
                    key={item.id}
                    className="fab-sheet-option"
                    style={{ '--item-color': item.color, '--item-bg': item.bg, '--item-border': item.border }}
                    onClick={() => {
                      setShowQuickMenu(false)
                      item.action(navigate, switchTab)
                    }}
                  >
                    <span className="fab-sheet-icon">{item.icon}</span>
                    <span className="fab-sheet-text">
                      <span className="fab-sheet-label">{item.label}</span>
                      <span className="fab-sheet-desc">{item.desc}</span>
                    </span>
                    <svg className="fab-sheet-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}
          <button
            ref={fabRef}
            onClick={() => setShowQuickMenu(v => !v)}
            onPointerDown={onFabDown}
            onPointerUp={onFabUp}
            onPointerLeave={onFabUp}
            className={`q-quick-fab ${showQuickMenu ? 'fab-open' : 'fab-pulse'}`}
            style={{
              background: showQuickMenu ? 'var(--surf-3)' : 'var(--volt)',
              color: showQuickMenu ? 'var(--txt)' : 'var(--volt-on)',
              boxShadow: showQuickMenu ? 'none' : '0 6px 24px rgba(189,243,0,0.35)',
            }}
            aria-label={showQuickMenu ? 'Cerrar menú' : 'Acciones rápidas'}
          >
            {showQuickMenu ? '×' : '+'}
          </button>
        </>
      )}

      {showInstallBanner && (
        <InstallBanner onInstall={handleInstall} onDismiss={handleDismissBanner} />
      )}
      {notifDrawerOpen && <NotificationDrawer />}
      <ToastContainer />
    </div>
  )
}
