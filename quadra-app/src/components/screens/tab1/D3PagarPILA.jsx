import { useRef, useState } from 'react'
import { useAppStore } from '../../../store/useAppStore'
import { IconCalendar, IconCheck } from '../../ui/Icons'

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const PLATFORM_OPTIONS = [
  { label: 'Mi Planilla', url: 'https://www.miplanilla.com/' },
  { label: 'PILA Digital', url: 'https://www.piladigital.com/' },
  { label: 'Aportes en Línea', url: 'https://www.aportesenlinea.com/' },
]

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
  const { navigate, showToast, payPila, kpis, setMazePilaPaid } = useAppStore()
  const [paid, setPaid] = useState(false)
  const [periodValue, setPeriodValue] = useState(() => toMonthInputValue(new Date()))
  const [selectedPlatform, setSelectedPlatform] = useState(PLATFORM_OPTIONS[0].label)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const monthInputRef = useRef(null)
  const isAllClear = (kpis?.reservadoPila || 0) <= 0

  const selectedPlatformData = PLATFORM_OPTIONS.find((platform) => platform.label === selectedPlatform) || PLATFORM_OPTIONS[0]

  const openPaymentPlatform = () => {
    window.open(selectedPlatformData.url, '_blank', 'noopener,noreferrer')
  }

  const registerManualPayment = () => {
    const periodLabel = formatContributionPeriod(periodValue)
    // Only pay if there is a debt
    if ((kpis?.reservadoPila || 0) > 0) {
      payPila(kpis.reservadoPila, periodLabel)
    }
    setShowConfirmDialog(false)
    setPaid(true)
    showToast({ type: 'success', message: 'Registro manual de PILA guardado' })
    const isMaze = window.location.pathname.includes('/maze/') || window.location.search.includes('mazeTask=')
    if (isMaze) setMazePilaPaid(true)
  }

  const openMonthPicker = () => {
    const input = monthInputRef.current
    if (!input) return
    if (typeof input.showPicker === 'function') {
      input.showPicker()
      return
    }
    input.focus()
    input.click()
  }

  const fmt = n => '$' + Math.abs(n).toLocaleString('es-CO')

  if (paid || isAllClear) {
    const periodLabel = formatContributionPeriod(periodValue)
    return (
      <div className="q-body-inner" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, textAlign: 'center', minHeight: 400 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--fin-income-dim)', border: '2px solid var(--fin-income-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--s5)', animation: 'resultPop .4s var(--ease-spring) both' }}>
          <IconCheck />
        </div>
        <h2 style={{ fontSize: 'var(--t-xl)', fontWeight: 900, color: 'var(--txt)', marginBottom: 'var(--s2)', fontFamily: 'var(--font-display)' }}>Estás al día</h2>
        <p style={{ fontSize: 'var(--t-sm)', color: 'var(--txt-m)', marginBottom: 'var(--s2)', fontFamily: 'var(--font-body)' }}>
          No tienes saldos pendientes por pagar de PILA en este momento.
        </p>
        {paid && (
          <p style={{ fontSize: 'var(--t-xs)', color: 'var(--txt-f)', marginBottom: 'var(--s6)', fontFamily: 'var(--font-body)' }}>
            Registro guardado · {periodLabel}
          </p>
        )}
        {!paid && <div style={{ marginBottom: 'var(--s6)' }} />}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s2)', width: '100%' }}>
          <button className="btn btn-secondary btn-full" onClick={() => navigate('I5')}>Ver historial PILA →</button>
          <button className="btn btn-ghost btn-full" onClick={() => navigate('D1')}>Volver al inicio</button>
        </div>
      </div>
    )
  }

  // Desglose PILA: salud 12.5% + pensión 16% + ARL N1 0.522% = 29.022% del IBC
  const TOTAL_PILA_RATE = 12.5 + 16 + 0.522  // 29.022
  const deuda   = kpis.reservadoPila
  const salud   = Math.round(deuda * (12.5   / TOTAL_PILA_RATE))
  const pension = Math.round(deuda * (16     / TOTAL_PILA_RATE))
  const arl     = deuda - salud - pension // residual para evitar redondeo

  return (
    <div className="q-body-inner">
      {showConfirmDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <div className="dialog-body">
              <div className="dialog-icon-wrap" style={{ background: 'var(--fin-reserve-dim)', border: '1px solid var(--fin-reserve-border)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--fin-reserve)" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div className="dialog-title">¿Ya pagaste en {selectedPlatform}?</div>
              <div className="dialog-desc">
                Quadra solo guardará el registro manual de {fmt(deuda)} para {formatContributionPeriod(periodValue)}. No hará transferencias ni procesará el pago por ti.
              </div>
            </div>
            <div className="dialog-actions">
              <button className="dbtn dbtn-primary" onClick={registerManualPayment}>Sí, registrar en Quadra</button>
              <button className="dbtn dbtn-ghost" onClick={() => setShowConfirmDialog(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

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
        <div className="tx-drow">
          <div className="tx-drow-l" style={{ color: 'var(--txt-2)' }}><div className="drow-dot" style={{ background: 'var(--fin-reserve)' }} />Salud (12.5% IBC)</div>
          <div className="tx-drow-v" style={{ color: 'var(--fin-reserve)' }}>{fmt(salud)}</div>
        </div>
        <div className="tx-drow">
          <div className="tx-drow-l" style={{ color: 'var(--txt-2)' }}><div className="drow-dot" style={{ background: 'var(--fin-reserve)' }} />Pensión (16% IBC)</div>
          <div className="tx-drow-v" style={{ color: 'var(--fin-reserve)' }}>{fmt(pension)}</div>
        </div>
        <div className="tx-drow">
          <div className="tx-drow-l" style={{ color: 'var(--txt-2)' }}><div className="drow-dot" style={{ background: 'var(--fin-reserve)' }} />ARL Nivel I (0.522% IBC)</div>
          <div className="tx-drow-v" style={{ color: 'var(--fin-reserve)' }}>{fmt(arl)}</div>
        </div>
        <div className="dtotal">
          <div className="dtotal-l">Total a pagar PILA</div>
          <div className="dtotal-v" style={{ color: 'var(--fin-reserve)' }}>{fmt(deuda)}</div>
        </div>
      </div>

      <div className="field mb4">
        <label className="field-label">Plataforma de pago</label>
        <select
          className="q-input"
          style={{ height: 52, paddingRight: 'var(--s4)' }}
          value={selectedPlatform}
          onChange={(event) => setSelectedPlatform(event.target.value)}
        >
          {PLATFORM_OPTIONS.map((platform) => (
            <option key={platform.label}>{platform.label}</option>
          ))}
        </select>
      </div>

      <div className="field mb6">
        <label className="field-label">Período de cotización</label>
        <div
          className="date-btn"
          style={{ marginTop: 'var(--s1)' }}
          onClick={openMonthPicker}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              openMonthPicker()
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Seleccionar período de cotización"
        >
          <input
            ref={monthInputRef}
            className="date-native-input"
            type="month"
            value={periodValue}
            onChange={(e) => setPeriodValue(e.target.value)}
            aria-hidden="true"
            tabIndex={-1}
          />
          <span className="sel">{formatContributionPeriod(periodValue)}</span>
          <IconCalendar />
        </div>
      </div>

      <div className="banner banner-warn" style={{ marginBottom: 'var(--s4)' }}>
        <div className="banner-icon" style={{ background: 'var(--fin-reserve-dim)', border: '1px solid var(--fin-reserve-border)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--fin-reserve)" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <div className="banner-content">
          <div className="banner-title">Primero paga fuera de Quadra</div>
          <div className="banner-desc">Quadra no procesa pagos ni mueve dinero. Después de pagar en {selectedPlatform}, vuelve y registra el pago manualmente.</div>
        </div>
      </div>

      <button className="btn btn-primary btn-full" onClick={openPaymentPlatform}>Ir a {selectedPlatform}</button>
      <button className="btn btn-secondary btn-full" style={{ marginTop: 'var(--s2)' }} onClick={() => setShowConfirmDialog(true)}>
        Ya pagué, registrar en Quadra
      </button>
    </div>
  )
}
