import { useAppStore } from '../../store/useAppStore'
import { IconX, IconCheck, IconArrowUp, IconArrowDown, IconInfo, IconZap } from './Icons'

export default function ToastContainer() {
  const { toasts, dismissToast } = useAppStore()
  if (toasts.length === 0) return null

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => dismissToast(toast.id)} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onDismiss }) {
  const variantClass = {
    success: 'toast-success',
    error:   'toast-error',
    warning: 'toast-error',
    info:    'toast-info',
  }[toast.type] || 'toast-info'

  const ToastIcon = {
    success: IconCheck,
    error:   IconX,
    info:    IconInfo,
  }[toast.type] || IconInfo

  return (
    <div className={`toast ${variantClass}`} role="alert">
      <div className="toast-icon">
        <ToastIcon />
      </div>
      <span className="toast-text">{toast.message}</span>
      {toast.action && (
        <button type="button" className="toast-action" onClick={toast.action.fn}>{toast.action.label}</button>
      )}
      <button className="toast-dismiss" onClick={onDismiss} aria-label="Cerrar">
        <IconX />
      </button>
      {toast.type !== 'error' && <div className="toast-progress" />}
    </div>
  )
}
