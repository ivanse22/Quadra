import { useAppStore } from '../../../store/useAppStore'

const ALERT_DEFS = [
  { key: 'pila', title: 'Recordatorio PILA', desc: 'Aviso antes del vencimiento mensual de salud y pensión' },
  { key: 'renta', title: 'Recordatorio declaración', desc: 'Alerta cuando se acerque agosto para la declaración de renta' },
  { key: 'nuevoPago', title: 'Confirmar nuevo pago', desc: 'Pedir confirmación antes de guardar cada pago' },
  { key: 'resumenSemanal', title: 'Resumen semanal', desc: 'Cada viernes un resumen de lo que ingresaste esa semana' },
  { key: 'vencimientos', title: 'Alertas de vencimientos', desc: 'Avisos generales sobre fechas importantes de la DIAN' },
]

const isPWA = typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches

export default function C2Alertas() {
  const { alerts, toggleAlert } = useAppStore()
  return (
    <div className="q-body-inner">
      <p style={{ fontSize: 'var(--t-xs)', color: 'var(--txt-m)', fontFamily: 'var(--font-body)', marginBottom: 'var(--s4)', lineHeight: 1.5 }}>
        Canal: notificaciones in-app{isPWA ? ' · push activo (PWA instalada)' : ' · push disponible si instalas la app'}.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s3)' }}>
        {ALERT_DEFS.map(alert => (
          <button key={alert.key} type="button" className="q-toggle" onClick={() => toggleAlert(alert.key)} aria-pressed={alerts[alert.key]}>
            <div className="q-toggle-left">
              <div className="q-toggle-title">{alert.title}</div>
              <div className="q-toggle-desc">{alert.desc}</div>
              <div style={{ fontSize: 'var(--t-2xs)', color: 'var(--txt-f)', fontFamily: 'var(--font-body)', marginTop: 3, letterSpacing: '.04em' }}>
                In-app{isPWA ? ' · Push' : ' · Push (instala la app)'}
              </div>
            </div>
            <div className={`q-switch${alerts[alert.key] ? ' on' : ''}`}>
              <div className="q-switch-thumb" />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
