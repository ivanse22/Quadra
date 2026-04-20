import { useEffect } from 'react'
import './styles/index.css'
import { useAppStore } from './store/useAppStore'
import { supabase } from './lib/supabase'

// Layout
import Header from './components/layout/Header'
import BottomNav from './components/layout/BottomNav'
import ToastContainer from './components/ui/Toast'

// Auth
import Auth from './components/screens/auth/Auth'

// Onboarding
import O1Welcome from './components/screens/onboarding/O1Welcome'
import O2Regimen from './components/screens/onboarding/O2Regimen'
import O3Retencion from './components/screens/onboarding/O3Retencion'
import O4PILA from './components/screens/onboarding/O4PILA'
import O5Resultado from './components/screens/onboarding/O5Resultado'

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
const showHeader = (screen) => !NO_HEADER.includes(screen)

const SCREENS = {
  O1: O1Welcome, O2: O2Regimen, O3: O3Retencion, O4: O4PILA, O5: O5Resultado,
  D1: D1Home, D2: D2Entender, D3: D3PagarPILA, D4: D4Reserva,
  I1: I1Pagos, I2: I2Registro, I2R: I2Resultado, I3: I3Detalle, I4: I4TotalGanado, I5: I5HistorialPILA,
  A1: A1Anual, A2: A2Mensual, A3: A3TotalAnio, A4: A4ReservaSaldo, A5: A5ReservaProyeccion, A6: A6Proyectar, A7: A7Exportar,
  C1: C1DatosPersonales, C2: C2Alertas, C3: C3CuentasConectadas, C4: C4AgregarCuenta, C4C: C4Conectando,
}

export default function App() {
  const { currentScreen, theme, session, setSession } = useAppStore()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    return (
      <div className="q-phone" data-theme={theme}>
        <StatusBar />
        <div className="q-body" style={{ height: '100%', paddingTop: '0' }}>
          <Auth />
        </div>
        <ToastContainer />
      </div>
    )
  }

  const Screen = SCREENS[currentScreen] || D1Home

  return (
    <div className="q-phone" data-theme={theme}>
      {currentScreen !== 'O1' && <StatusBar />}
      {showHeader(currentScreen) && <Header />}
      <div className="q-body" style={currentScreen === 'O1' ? { paddingTop: 0 } : {}}>
        <Screen />
      </div>
      <ToastContainer />
      <BottomNav />
    </div>
  )
}
