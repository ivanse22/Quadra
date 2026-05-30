import { IconSliders, IconSearch } from '../components/ui/Icons'

export default {
  title: 'App Components/Filters & Navigation',
  parameters: { layout: 'padded', phoneFrame: true, phoneLabel: 'Barra de filtros I1' },
}

export const FilterBar = () => (
  <div className="income-page">
    <div className="income-list-header">
      <div className="income-list-header-row income-list-header-row--tools">
        <button type="button" className="filter-pill-btn" aria-label="Filtros">
          <IconSliders size={13} />
          <span>Filtros</span>
          <span className="filter-pill-badge">2</span>
        </button>
        <button type="button" className="filter-icon-btn" aria-label="Buscar">
          <IconSearch size={13} />
        </button>
      </div>
      <div className="filter-active-chips">
        <button type="button" className="filter-active-chip">
          Este año
          <span className="chip-x" aria-hidden>×</span>
        </button>
        <button type="button" className="filter-active-chip">
          Por cliente
          <span className="chip-x" aria-hidden>×</span>
        </button>
      </div>
    </div>
  </div>
)

export const FilterSheet = () => (
  <div className="sb-full-width" style={{ position: 'relative', minHeight: 520 }}>
    <div className="filter-sheet" style={{ position: 'relative', transform: 'none', maxHeight: 'none' }} role="dialog" aria-label="Filtros">
      <div className="filter-sheet-handle" aria-hidden />
      <h3 className="filter-sheet-title">Filtros</h3>

      <div className="filter-group">
        <span className="filter-group-label">Período</span>
        <div className="seg-ctrl">
          <button type="button" className="seg-btn">Este mes</button>
          <button type="button" className="seg-btn active">Este año</button>
          <button type="button" className="seg-btn">Todo</button>
        </div>
      </div>

      <div className="filter-group">
        <span className="filter-group-label">Agrupar por</span>
        <div className="seg-ctrl">
          <button type="button" className="seg-btn active">Por fecha</button>
          <button type="button" className="seg-btn">Por cliente</button>
        </div>
      </div>

      <div className="filter-group">
        <span className="filter-group-label">Tipo de movimiento</span>
        <div className="seg-ctrl">
          <button type="button" className="seg-btn active">Todos</button>
          <button type="button" className="seg-btn">Ingresos</button>
          <button type="button" className="seg-btn">PILA</button>
        </div>
      </div>

      <div className="filter-sheet-footer">
        <button type="button" className="btn btn-ghost">Restaurar</button>
        <button type="button" className="btn btn-primary">Aplicar</button>
      </div>
    </div>
  </div>
)
FilterSheet.parameters = { phoneFrame: false, layout: 'centered' }
