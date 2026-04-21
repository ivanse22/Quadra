import { QuadraLogo, IconX } from './Icons'

export default function InstallBanner({ onInstall, onDismiss }) {
  return (
    <div className="install-banner" role="complementary" aria-label="Instalar aplicación">
      <div className="install-banner-icon">
        <QuadraLogo size={32} color="var(--volt-on)" />
      </div>
      <div className="install-banner-text">
        <span className="install-banner-title">Instala Quadra</span>
        <span className="install-banner-sub">Acceso directo desde tu pantalla de inicio</span>
      </div>
      <button className="install-banner-cta" onClick={onInstall}>
        Instalar
      </button>
      <button className="install-banner-close" onClick={onDismiss} aria-label="Cerrar">
        <IconX />
      </button>
    </div>
  )
}
