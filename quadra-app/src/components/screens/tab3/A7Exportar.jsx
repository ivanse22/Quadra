import { useAppStore } from '../../../store/useAppStore'

export default function A7Exportar() {
  const { showToast } = useAppStore()
  const handleExport = (type) => {
    showToast({ type: 'info', message: `Exportando datos en ${type}... (en un prototipo real)` })
  }
  return (
    <div className="q-body-inner">
      <p style={{ fontSize: 'var(--t-sm)', color: 'var(--txt-2)', marginBottom: 'var(--s6)', fontFamily: 'var(--font-body)', lineHeight: 1.65 }}>
        Descarga un reporte de tus ingresos, retenciones y reservas para tu contador o la DIAN.
      </p>
      {[
        { title: 'Reporte 2026 completo', desc: 'Todos tus pagos con desglose de retenciones y PILA', format: 'PDF' },
        { title: 'Hoja de cálculo', desc: 'CSV con todos los datos ordenados por fecha', format: 'CSV' },
        { title: 'Resumen para contador', desc: 'Formato optimizado para presentación tributaria', format: 'PDF' },
      ].map((item, i) => (
        <div key={i} className="card mb3" style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => handleExport(item.format)}>
          <div>
            <div className="card-title">{item.title}</div>
            <div className="card-sub">{item.desc}</div>
          </div>
          <span className="badge badge-neu">{item.format}</span>
        </div>
      ))}
    </div>
  )
}
