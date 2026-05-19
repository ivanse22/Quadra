import { useAppStore } from '../../../store/useAppStore'
import { IconCalendar, IconTrendingUp, IconShield } from '../../ui/Icons'

const MONTH_LABELS_SHORT = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

export default function A1Anual() {
  const { monthlyData, kpis, navigate, setSelectedAnnualMonth } = useAppStore()
  const max = Math.max(...monthlyData.map(m => m.amount), 1)
  const fmt = n => n >= 1000000 ? `$${(n/1000000).toFixed(1)}M` : n >= 1000 ? `$${(n/1000).toFixed(0)}k` : '$0'
  const fmtFull = n => '$' + Math.round(n).toLocaleString('es-CO')

  const ytd = kpis?.ytd || 0
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() // 0-11

  const realMonths = monthlyData.filter(m => !m.projected && m.amount > 0)
  const mesesConIngresos = realMonths.length || 1

  const bestMonthIdx = monthlyData.reduce((bestIdx, m, i) => m.amount > (monthlyData[bestIdx]?.amount || 0) ? i : bestIdx, -1)
  const bestLabel = bestMonthIdx >= 0 ? `${MONTH_LABELS_SHORT[bestMonthIdx]} — ${fmt(monthlyData[bestMonthIdx].amount)}` : '—'

  const promedio = ytd / mesesConIngresos
  const proyeccion = promedio * 12

  const firstMonthIdx = monthlyData.findIndex(m => m.amount > 0)
  const rangoLabel = firstMonthIdx >= 0
    ? `${MONTH_LABELS_SHORT[firstMonthIdx]} – ${MONTH_LABELS_SHORT[currentMonth]} ${currentYear} · ${mesesConIngresos} ${mesesConIngresos === 1 ? 'mes' : 'meses'}`
    : `${currentYear}`

  // Year progress (Zone C)
  const yearPct   = Math.round(((currentMonth + 1) / 12) * 100)
  const realPct   = Math.round((mesesConIngresos / 12) * 100)

  return (
    <div className="q-body-inner">
      {/* Annual KPI Hero Card */}
      <div className="hero-card hero-card--viewport mb5">

        {/* Zone A — Eyebrow */}
        <div className="hero-card-header">
          <div className="hero-eye" style={{ marginBottom: 0 }}>Ingresos {currentYear}</div>
          <span className="hero-year-tag">{currentYear}</span>
        </div>

        {/* Zone B — KPI principal (grows to fill vertical space) */}
        <div className="hero-card-kpi">
          <div className="hero-amount hero-amount--lg">
            {ytd > 0 ? fmtFull(ytd) : '$0'}
          </div>
          <div className="hero-kpi-sublabel">Ingreso bruto acumulado</div>
          <div className="hero-sub" style={{ marginBottom: 0 }}>{rangoLabel}</div>
        </div>

        {/* Zone C — Year progress bar */}
        <div className="hero-year-progress">
          <div className="hero-year-progress-head">
            <span className="hero-year-progress-lbl">Avance del año</span>
            <span className="hero-year-progress-meta">
              {MONTH_LABELS_SHORT[currentMonth]} · {currentMonth + 1}/12 meses
            </span>
          </div>
          <div className="hero-year-bar-wrap">
            <div className="hero-year-bar-track">
              <div className="hero-year-bar-fill" style={{ width: `${realPct}%` }} />
              <div className="hero-year-bar-dot" style={{ left: `${yearPct}%` }} />
            </div>
          </div>
          <div className="hero-year-bar-labels">
            <span>Ene</span>
            <span>{yearPct}% del año</span>
            <span>Dic</span>
          </div>
        </div>

        {/* Zone D — Stats grid 3 columns */}
        {ytd > 0 ? (
          <div className="hero-stats-grid">
            <div className="hero-stat">
              <div className="hero-stat-lbl">Mejor mes</div>
              <div className="hero-stat-val hero-stat-val--income">{bestLabel}</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-lbl">Promedio</div>
              <div className="hero-stat-val">{fmt(promedio)}</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-lbl">Proyección</div>
              <div className="hero-stat-val">{fmt(proyeccion)}</div>
            </div>
          </div>
        ) : (
          <div className="hero-empty-hint">Registra tu primer ingreso para ver estadísticas</div>
        )}
      </div>

      <button className="year-projection-cta mb5" onClick={() => navigate('A6')}>
        <div className="year-projection-cta-copy">
          <span className="year-projection-cta-title">Proyectar mi ingreso</span>
          <span className="year-projection-cta-sub">Simula tu disponible mensual y la proyección anual antes de cerrar el año.</span>
        </div>
        <span className="year-projection-cta-action" aria-hidden="true">
          <IconTrendingUp />
        </span>
      </button>

      <button className="year-projection-cta mb5" onClick={() => navigate('D4')}>
        <div className="year-projection-cta-copy">
          <span className="year-projection-cta-title">Ver reserva para renta</span>
          <span className="year-projection-cta-sub">Revisa cuánto llevas separado para tu declaración de renta en agosto.</span>
        </div>
        <span className="year-projection-cta-action" aria-hidden="true">
          <IconShield />
        </span>
      </button>

      <button className="year-projection-cta mb5" onClick={() => navigate('A8')}>
        <div className="year-projection-cta-copy">
          <span className="year-projection-cta-title">Ver calendario</span>
          <span className="year-projection-cta-sub">Visualiza pagos, PILA y fechas clave en una vista mensual mas clara.</span>
        </div>
        <span className="year-projection-cta-action" aria-hidden="true">
          <IconCalendar />
        </span>
      </button>

      {/* Bar chart — redesigned card */}
      <div className="card mb5 year-chart-card">
        <div className="year-chart-head">
          <div className="card-title">Ingresos brutos por mes</div>
          <div className="year-chart-sub">Comparativo {currentYear}</div>
        </div>
        <div className="year-chart-scroll">
          <div className="bar-chart">
            {monthlyData.map((m, i) => {
              const percent = m.amount > 0 ? Math.max(Math.round((m.amount / max) * 100), 8) : 0
              const isActive = m.current
              const isProjEmpty = m.projected && m.amount === 0
              return (
                <button
                  key={i}
                  className={`bar-col${isActive ? ' is-active' : ''}${isProjEmpty ? ' is-projected' : ''}`}
                  onClick={() => {
                    if (m.projected) return
                    setSelectedAnnualMonth(i)
                    navigate('A2')
                  }}
                  disabled={m.projected}
                  aria-label={`${m.month}: ${m.amount > 0 ? fmt(m.amount) : 'Proyectado'}`}
                >
                  <div className="bar-value">{m.amount > 0 ? fmt(m.amount) : ''}</div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ height: `${percent}%` }} />
                  </div>
                  <div className="bar-lbl">{m.month}</div>
                </button>
              )
            })}
          </div>
        </div>
        <div className="year-chart-legend">
          <span className="year-chart-chip"><span className="year-chart-dot real" />Real</span>
          <span className="year-chart-chip"><span className="year-chart-dot active" />Mes actual</span>
          <span className="year-chart-chip"><span className="year-chart-dot projected" />Proyectado</span>
        </div>
      </div>

      <button className="btn btn-secondary btn-full" onClick={() => navigate('A3')}>Ver resumen anual</button>
    </div>
  )
}
