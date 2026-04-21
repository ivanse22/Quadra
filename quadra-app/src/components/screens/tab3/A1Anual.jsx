import { useAppStore } from '../../../store/useAppStore'
import { IconTrendingUp } from '../../ui/Icons'

const MONTH_LABELS_SHORT = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

export default function A1Anual() {
  const { monthlyData, kpis, navigate } = useAppStore()
  const max = Math.max(...monthlyData.map(m => m.amount), 1)
  const fmt = n => n >= 1000000 ? `$${(n/1000000).toFixed(1)}M` : n >= 1000 ? `$${(n/1000).toFixed(0)}k` : '$0'
  const fmtFull = n => '$' + Math.round(n).toLocaleString('es-CO')

  // Cálculos anuales derivados del store
  const ytd = kpis?.ytd || 0
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() // 0-11

  // Meses con ingresos reales (excluye proyectados)
  const realMonths = monthlyData.filter((m, i) => !m.projected && m.amount > 0)
  const mesesConIngresos = realMonths.length || 1

  // Mejor mes
  const bestMonth = monthlyData.reduce((best, m, i) => m.amount > (best?.amount || 0) ? { ...m, index: i } : best, null)
  const bestLabel = bestMonth ? `${MONTH_LABELS_SHORT[monthlyData.indexOf(bestMonth)]} — ${fmt(bestMonth.amount)}` : '—'

  // Promedio mensual (sobre meses con datos)
  const promedio = ytd / mesesConIngresos

  // Proyección anual lineal
  const proyeccion = promedio * 12

  // Rango de meses con datos
  const firstMonthIdx = monthlyData.findIndex(m => m.amount > 0)
  const rangoLabel = firstMonthIdx >= 0
    ? `${MONTH_LABELS_SHORT[firstMonthIdx]} – ${MONTH_LABELS_SHORT[currentMonth]} ${currentYear} · ${mesesConIngresos} ${mesesConIngresos === 1 ? 'mes' : 'meses'}`
    : `${currentYear}`

  return (
    <div className="q-body-inner">
      {/* Annual KPI */}
      <div className="hero-card mb5">
        <div className="hero-eye">Ingresos {currentYear}</div>
        <div
          className="hero-amount"
          style={{
            fontSize: 'var(--t-hero)',
            fontWeight: 900,
            lineHeight: 0.92,
            letterSpacing: '-0.05em',
            color: 'var(--volt-text)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {ytd > 0 ? fmtFull(ytd) : '$0'}
        </div>
        <div className="hero-sub" style={{ fontSize: 'var(--t-md)', marginTop: 'var(--s2)' }}>{rangoLabel}</div>
        {ytd > 0 ? (
          <div className="hero-breakdown">
            <div><div className="hero-bk-lbl">Mejor mes</div><div className="hero-bk-val" style={{ color: 'var(--fin-income)' }}>{bestLabel}</div></div>
            <div><div className="hero-bk-lbl">Promedio</div><div className="hero-bk-val">{fmt(promedio)}</div></div>
            <div><div className="hero-bk-lbl">Proyección</div><div className="hero-bk-val">{fmt(proyeccion)}</div></div>
          </div>
        ) : (
          <div className="hero-sub" style={{ fontSize: 'var(--t-sm)', marginTop: 'var(--s3)', color: 'var(--txt-2)' }}>Registra tu primer ingreso para ver estadísticas</div>
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

      {/* Bar chart — redesigned card */}
      <div className="card mb5 year-chart-card">
        <div className="year-chart-head">
          <div className="card-title">Ingresos brutos por mes</div>
          <div className="year-chart-sub">Comparativo 2026</div>
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
                  onClick={() => !m.projected && navigate('A2')}
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

      <button className="btn btn-secondary btn-full" onClick={() => navigate('A3')}>Ver total ganado</button>
    </div>
  )
}
