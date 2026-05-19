import { useAppStore } from '../../../store/useAppStore'

function downloadCSV(payments, year) {
  const headers = ['Fecha', 'Cliente', 'Bruto (COP)', 'Retención', 'PILA', 'Reserva Renta', 'Disponible', 'Moneda', 'Tipo']
  const rows = payments.map(p => [
    p.date || p.dateLabel || '',
    p.client || '',
    p.gross ?? 0,
    p.retencion ?? 0,
    p.pila ?? 0,
    p.reserva ?? 0,
    p.disponible ?? 0,
    p.currency || 'COP',
    p.type || 'ingreso',
  ])
  const csv = [headers, ...rows]
    .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `quadra-ingresos-${year}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function A7Exportar() {
  const { showToast, payments } = useAppStore()
  const currentYear = new Date().getFullYear()

  const handleExport = (type) => {
    if (type === 'CSV') {
      if (!payments.length) {
        showToast({ type: 'info', message: 'No tienes pagos registrados para exportar.' })
        return
      }
      downloadCSV(payments, currentYear)
      showToast({ type: 'success', message: `CSV con ${payments.length} pagos descargado.` })
    } else {
      showToast({ type: 'info', message: 'Los reportes PDF estarán disponibles en la versión premium.' })
    }
  }

  return (
    <div className="q-body-inner">
      <p style={{ fontSize: 'var(--t-sm)', color: 'var(--txt-2)', marginBottom: 'var(--s6)', fontFamily: 'var(--font-body)', lineHeight: 1.65 }}>
        Descarga un resumen de tus ingresos, retenciones, PILA y reservas del año para compartirlo o revisarlo fuera de la app.
      </p>
      <div className="tx-list">
        {[
          { title: `Reporte ${currentYear} completo`, desc: 'Todos tus pagos con desglose de retenciones y PILA', format: 'PDF', premium: true },
          { title: 'Hoja de cálculo anual', desc: 'CSV con todos los datos ordenados por fecha', format: 'CSV', premium: false },
          { title: 'Resumen para contador', desc: 'Formato optimizado para presentación tributaria', format: 'PDF', premium: true },
        ].map((item, i) => (
          <button
            key={i}
            type="button"
            className="tx-row compact-row"
            onClick={() => handleExport(item.format)}
            style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left' }}
          >
            <div className="tx-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--txt-m)" strokeWidth="2">
                <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z" />
                <path d="M14 2v5h5" />
                {!item.premium && <path d="M12 12v4M10 14h4" />}
              </svg>
            </div>
            <div className="tx-info compact-row-info">
              <div className="tx-name compact-row-name">{item.title}</div>
              <div className="tx-sub compact-row-sub">{item.desc}</div>
            </div>
            <div className="compact-row-side">
              <span className={`badge compact-row-status ${item.premium ? 'badge-neu' : 'badge-ok'}`}>{item.format}</span>
              {item.premium && <span style={{ display: 'block', fontSize: 'var(--t-2xs)', color: 'var(--txt-f)', fontFamily: 'var(--font-body)', marginTop: 3, textAlign: 'right' }}>Premium</span>}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
