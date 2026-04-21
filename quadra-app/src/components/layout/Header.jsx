import { useAppStore } from '../../store/useAppStore'
import { QuadraLogo, IconSun, IconMoon, IconArrowLeft, IconBell, IconPlus, IconDownload, IconSettings } from '../ui/Icons'

const BACK_SCREENS = ['O2','O3','O4','O5','B1','B2','D2','D3','D4','I2','I2R','I3','I4','I5','A2','A3','A4','A5','A6','A7','C1','C2','C3','C4','C4C']

export default function Header() {
  const { currentScreen, goBack, navigate, theme, toggleTheme } = useAppStore()

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
            onClick={() => navigate('C2')}
            aria-label="Alertas"
            style={{ position: 'relative' }}
          >
            <IconBell />
            <span style={{
              position: 'absolute', top: 7, right: 7,
              width: 7, height: 7,
              background: 'var(--fin-deduct)', borderRadius: '50%',
              border: '1.5px solid var(--bg)',
            }} />
          </button>
          <button className="q-hdr-btn" onClick={toggleTheme} aria-label="Cambiar tema">
            {theme === 'light' ? <IconMoon /> : <IconSun />}
          </button>
        </div>
      </header>
    )
  }

  // Header C — Title left (listas)
  if (['I1','I4','I5','A1','A2','A3','A4','A5','C2'].includes(s)) {
    const titles = {
      I1: 'Mis Ingresos', I4: 'Total ganado', I5: 'Historial PILA',
      A1: 'Mi Año', A2: 'Abril 2026', A3: 'Total ganado',
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
          <button className="q-hdr-btn" onClick={toggleTheme} aria-label="Cambiar tema">
            {theme === 'light' ? <IconMoon /> : <IconSun />}
          </button>
        </div>
      </header>
    )
  }

  // Header B — Back + title centered
  const titles = {
    O2:'¿Cómo tributas?', O3:'Retención', O4:'Salud y pensión', O5:'Resumen',
    B1:'Iniciar sesión', B2:'Recuperar acceso',
    D2:'Entender mis descuentos', D3:'Pagar PILA', D4:'Reserva declaración',
    I2:'Nuevo pago', I3:'Detalle del pago', I5:'Historial PILA',
    A6:'Proyectar ingresos', A7:'Exportar datos',
    C1:'Mis datos', C4:'Agregar cuenta',
  }

  return (
    <header className="q-header">
      <button className="q-hdr-back" onClick={goBack} aria-label="Volver">
        <IconArrowLeft />
      </button>
      {titles[s] && <span className="q-hdr-title-center">{titles[s]}</span>}
      <div className="q-hdr-right">
        <button className="q-hdr-btn" onClick={toggleTheme} aria-label="Cambiar tema">
          {theme === 'light' ? <IconMoon /> : <IconSun />}
        </button>
      </div>
    </header>
  )
}
