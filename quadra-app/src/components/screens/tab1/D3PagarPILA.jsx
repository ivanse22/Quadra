import { useState } from 'react'
import { useAppStore } from '../../../store/useAppStore'
import { IconCalendar, IconCheck } from '../../ui/Icons'

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const toMonthInputValue = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

const formatContributionPeriod = (value) => {
  const [year, month] = value.split('-').map(Number)
  if (!year || !month) return 'Mes en curso'
  return `${MONTHS[month - 1]} ${year}`
}

export default function D3PagarPILA() {
  const { navigate, showToast, payPila, kpis } = useAppStore()
  const [paid, setPaid] = useState(false)
  const [periodValue, setPeriodValue] = useState(() => toMonthInputValue(new Date()))
  const isAllClear = (kpis?.reservadoPila || 0) <= 0

  const handlePay = () => {
    const periodLabel = formatContributionPeriod(periodValue)
    // Only pay if there is a debt
    if ((kpis?.reservadoPila || 0) > 0) {
      payPila(kpis.reservadoPila, periodLabel)
    }
    setPaid(true)
    showToast({ type: 'success', message: 'Pago PILA registrado correctamente' })
  }

  const fmt = n => '$' + Math.abs(n).toLocaleString('es-CO')

  if (paid || isAllClear) {
    return (
      <div className="q-body-inner" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, textAlign: 'center', minHeight: 400 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--fin-income-dim)', border: '2px solid var(--fin-income-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--s5)', animation: 'resultPop .4s var(--ease-spring) both' }}>
          <IconCheck />
        </div>
        <h2 style={{ fontSize: 'var(--t-xl)', fontWeight: 900, color: 'var(--txt)', marginBottom: 'var(--s2)', fontFamily: 'var(--font-display)' }}>Estás al día</h2>
        <p style={{ fontSize: 'var(--t-sm)', color: 'var(--txt-m)', marginBottom: 'var(--s6)', fontFamily: 'var(--font-body)' }}>
          No tienes saldos pendientes por pagar de PILA en este momento.
        </p>
        <button className="btn btn-ghost" onClick={() => navigate('D1')} style={{ marginTop: 'var(--s2)' }}>Volver al inicio</button>
      </div>
    )
  }

  // Desglose real PILA: salud 12.5% IBC + pensión 16% IBC (Decreto 780/2016)
  // Ratio derivado: salud/total = 12.5 / (12.5 + 16) = 12.5 / 28.5
  const PILA_SALUD_RATIO = 12.5 / 28.5
  const deuda  = kpis.reservadoPila
  const salud  = Math.round(deuda * PILA_SALUD_RATIO)
  const pension = deuda - salud

  return (
    <div className="q-body-inner">
      <div className="banner banner-info" style={{ marginBottom: 'var(--s6)' }}>
        <div className="banner-icon" style={{ background: 'rgba(189,243,0,0.12)', border: '1px solid rgba(189,243,0,0.22)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--volt-text)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <div className="banner-content">
          <div className="banner-title">Pago PILA</div>
          <div className="banner-desc">Tienes un saldo acumulado por declarar. Quadra ya reservó este valor por ti.</div>
        </div>
      </div>

      <div className="desglose mb6">
        <div className="drow">
          <div className="drow-l"><div className="drow-dot" style={{ background: 'var(--fin-reserve)' }} />Salud (12.5% IBC)</div>
          <div className="drow-v" style={{ color: 'var(--fin-reserve)' }}>{fmt(salud)}</div>
        </div>
        <div className="drow">
          <div className="drow-l"><div className="drow-dot" style={{ background: 'var(--fin-reserve)' }} />Pensión (16% IBC)</div>
          <div className="drow-v" style={{ color: 'var(--fin-reserve)' }}>{fmt(pension)}</div>
        </div>
        <div className="dtotal">
          <div className="dtotal-l">Total a pagar PILA</div>
          <div className="dtotal-v" style={{ color: 'var(--fin-reserve)' }}>{fmt(deuda)}</div>
        </div>
      </div>

      <div className="field mb4">
        <label className="field-label">Plataforma de pago</label>
        <select className="q-input" style={{ height: 52, paddingRight: 'var(--s4)' }} defaultValue="Mi Planilla">
          <option>Mi Planilla</option>
          <option>PILA Digital</option>
          <option>Aportes en Línea</option>
        </select>
      </div>

      <div className="field mb6">
        <label className="field-label">Período de cotización</label>
        <label className="date-btn" style={{ marginTop: 'var(--s1)' }}>
          <input
            className="date-native-input"
            type="month"
            value={periodValue}
            onChange={(e) => setPeriodValue(e.target.value)}
            aria-label="Seleccionar período de cotización"
          />
          <span className="sel">{formatContributionPeriod(periodValue)}</span>
          <IconCalendar />
        </label>
      </div>

      <button className="btn btn-primary btn-full" onClick={handlePay}>Registrar pago PILA</button>
    </div>
  )
}
