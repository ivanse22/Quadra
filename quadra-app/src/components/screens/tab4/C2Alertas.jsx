import { useAppStore } from '../../../store/useAppStore'

const ALERT_DEFS = [
  { key: 'pila', title: 'Recordatorio PILA', desc: 'Aviso antes del vencimiento mensual de salud y pensión' },
  { key: 'renta', title: 'Recordatorio declaración', desc: 'Alerta cuando se acerque agosto para la declaración de renta' },
  { key: 'nuevoPago', title: 'Confirmar nuevo pago', desc: 'Pedir confirmación antes de guardar cada pago' },
  { key: 'resumenSemanal', title: 'Resumen semanal', desc: 'Cada viernes un resumen de lo que ingresaste esa semana' },
  { key: 'vencimientos', title: 'Alertas de vencimientos', desc: 'Avisos generales sobre fechas importantes de la DIAN' },
]

export default function C2Alertas() {
  const { alerts, toggleAlert } = useAppStore()
  return (
    <div className="q-body-inner">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s3)' }}>
        {ALERT_DEFS.map(alert => (
          <div key={alert.key} className="q-toggle" onClick={() => toggleAlert(alert.key)}>
            <div className="q-toggle-left">
              <div className="q-toggle-title">{alert.title}</div>
              <div className="q-toggle-desc">{alert.desc}</div>
            </div>
            <div className={`q-switch${alerts[alert.key] ? ' on' : ''}`}>
              <div className="q-switch-thumb" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
