import { createPortal } from 'react-dom'

export default function I1FilterSheet({
  open,
  onClose,
  period,
  setPeriod,
  groupBy,
  setGroupBy,
  typeFilter,
  setTypeFilter,
}) {
  const phoneEl = typeof document !== 'undefined' ? document.querySelector('.q-phone') : null
  if (!open || !phoneEl) return null

  const handleReset = () => {
    setPeriod('mes')
    setGroupBy('fecha')
    setTypeFilter('todos')
  }

  return createPortal(
    <div className="filter-sheet-overlay" onClick={onClose}>
      <div className="filter-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Filtros">
        <div className="filter-sheet-handle" aria-hidden />
        <h3 className="filter-sheet-title">Filtros</h3>

        <div className="filter-group">
          <span className="filter-group-label">Período</span>
          <div className="seg-ctrl">
            <button
              type="button"
              className={`seg-btn${period === 'mes' ? ' active' : ''}`}
              onClick={() => setPeriod('mes')}
            >
              Este mes
            </button>
            <button
              type="button"
              className={`seg-btn${period === 'anio' ? ' active' : ''}`}
              onClick={() => setPeriod('anio')}
            >
              Este año
            </button>
            <button
              type="button"
              className={`seg-btn${period === 'todo' ? ' active' : ''}`}
              onClick={() => setPeriod('todo')}
            >
              Todo
            </button>
          </div>
        </div>

        <div className="filter-group">
          <span className="filter-group-label">Agrupar por</span>
          <div className="seg-ctrl">
            <button
              className={`seg-btn${groupBy === 'fecha' ? ' active' : ''}`}
              onClick={() => setGroupBy('fecha')}
            >
              Por fecha
            </button>
            <button
              className={`seg-btn${groupBy === 'cliente' ? ' active' : ''}`}
              onClick={() => setGroupBy('cliente')}
            >
              Por cliente
            </button>
          </div>
        </div>

        <div className="filter-group">
          <span className="filter-group-label">Tipo de movimiento</span>
          <div className="seg-ctrl">
            <button
              className={`seg-btn${typeFilter === 'todos' ? ' active' : ''}`}
              onClick={() => setTypeFilter('todos')}
            >
              Todos
            </button>
            <button
              className={`seg-btn${typeFilter === 'ingresos' ? ' active' : ''}`}
              onClick={() => setTypeFilter('ingresos')}
            >
              Ingresos
            </button>
            <button
              className={`seg-btn${typeFilter === 'pila' ? ' active' : ''}`}
              onClick={() => setTypeFilter('pila')}
            >
              PILA
            </button>
          </div>
        </div>

        <div className="filter-sheet-footer">
          <button type="button" className="btn btn-ghost" onClick={handleReset}>
            Restaurar
          </button>
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Aplicar
          </button>
        </div>
      </div>
    </div>,
    phoneEl
  )
}
