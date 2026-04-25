import { useAppStore } from '../../store/useAppStore'
import { QuadraLogo, IconArrowLeft, IconBell, IconPlus, IconDownload, IconCalendar } from '../ui/Icons'

const BACK_SCREENS = ['O1C','O2','O3','O4','O5','B1','B2','D2','D3','D4','I2','I2R','I3','I4','I5','A2','A3','A4','A5','A6','A7','A8','C1','C2','C3','C4','C4C']
const MONTH_LABELS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

export default function Header() {
  const { currentScreen, goBack, navigate, screenHistory, selectedAnnualMonth, notifications, setNotifDrawerOpen } = useAppStore()

  const unreadCount = notifications.filter(n => !n.read).length

  const s = currentScreen

  // Header A — Logo (D1, C3) — DS §17 variant A
  if (s === 'D1' || s === 'C3') {
    return (
      <header className="q-header">
        <div className="q-hdr-logo">
          <QuadraLogo size={28} color="var(--txt)" />
          <span className="q-hdr-logo-name">quadra</span>
        </div>
        <div className="q-hdr-right" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Bell with red dot — DS line 6372-6374 */}
          <button
            className="q-hdr-btn"
            onClick={() => unreadCount > 0 ? setNotifDrawerOpen(true) : navigate('C2')}
            aria-label={unreadCount > 0 ? `${unreadCount} notificaciones` : 'Alertas'}
            style={{ position: 'relative' }}
          >
            <IconBell />
            {unreadCount > 0 && (
              <span className="bell-badge">{unreadCount}</span>
            )}
          </button>
          {s === 'D1' && (
            <button className="q-hdr-btn" onClick={() => navigate('A8')} aria-label="Abrir calendario">
              <IconCalendar />
            </button>
          )}
        </div>
      </header>
    )
  }

  // Header — login / recuperar: atrás a bienvenida o login si no hay historial
  if (s === 'B1' || s === 'B2') {
    const titles = { B1: 'Iniciar sesión', B2: 'Recuperar acceso' }
    const onBack = () => {
      if (screenHistory.length > 0) goBack()
      else if (s === 'B1') navigate('O1')
      else navigate('B1')
    }
    return (
      <header className="q-header">
        <button className="q-hdr-back" onClick={onBack} type="button" aria-label="Volver">
          <IconArrowLeft />
        </button>
        <span className="q-hdr-title-center">{titles[s]}</span>
        <div className="q-hdr-right" />
      </header>
    )
  }

  // Header C — Title left (listas)
  if (['I1','I4','I5','A1','A2','A4','A5','C2'].includes(s)) {
    const annualMonthTitle = selectedAnnualMonth != null
      ? `${MONTH_LABELS[selectedAnnualMonth]} ${new Date().getFullYear()}`
      : `${MONTH_LABELS[new Date().getMonth()]} ${new Date().getFullYear()}`
    const titles = {
      I1: 'Mis Ingresos', I4: 'Total ganado', I5: 'Historial PILA',
      A1: 'Mi Año', A2: annualMonthTitle,
      A4: 'Reserva declaración', A5: 'Proyección', C2: 'Alertas',
    }
    return (
      <header className="q-header">
        <span className="q-hdr-title-left">{titles[s]}</span>
        <div className="q-hdr-right">
          {s === 'I1' && (
            <button className="q-hdr-btn" onClick={() => navigate('I2')} aria-label="Nuevo pago">
              <IconPlus />
            </button>
          )}
          {s === 'A1' && (
            <button className="q-hdr-btn" onClick={() => navigate('A7')} aria-label="Exportar">
              <IconDownload />
            </button>
          )}
        </div>
      </header>
    )
  }

  // Header B — Back + title centered
  const titles = {
    O1C:'Crea tu cuenta', O2:'¿Cómo tributas?', O3:'Retención', O4:'Salud y pensión', O5:'Resumen',
    D2:'Entender mis descuentos', D3:'Pagar PILA', D4:'Reserva declaración',
    I2:'Nuevo pago', I3:'Detalle del pago', I5:'Historial PILA',
    A3:'Resumen anual', A6:'Proyectar ingresos', A7:'Exportar resumen', A8:'Calendario',
    C1:'Mis datos', C4:'Agregar cuenta',
  }

  return (
    <header className="q-header">
      <button className="q-hdr-back" onClick={goBack} aria-label="Volver">
        <IconArrowLeft />
      </button>
      {titles[s] && <span className="q-hdr-title-center">{titles[s]}</span>}
      <div className="q-hdr-right" />
    </header>
  )
}
