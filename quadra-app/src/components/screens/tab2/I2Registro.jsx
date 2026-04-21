import { useState, useMemo } from 'react'
import { useAppStore } from '../../../store/useAppStore'
import { calcularPago } from '../../../lib/calculadoraFinanciera'
import AmountField from '../../ui/AmountField'
import { IconCalendar, IconCheck } from '../../ui/Icons'

const DAYS = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']
const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const toDateInputValue = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatDateLabel = (value) => {
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return `${DAYS[date.getDay()]} ${day} ${MONTHS[month - 1]} ${year}`
}

const formatDateButtonLabel = (value) => {
  const todayValue = toDateInputValue(new Date())
  return value === todayValue ? `Hoy — ${formatDateLabel(value)}` : formatDateLabel(value)
}

export default function I2Registro() {
  const { navigate, addPayment, showToast, profile, kpis } = useAppStore()
  const [amount, setAmount] = useState(0)
  const [client, setClient] = useState('Agencia Creativa SAS')
  const [currency, setCurrency] = useState('COP')
  const [paymentDate, setPaymentDate] = useState(() => toDateInputValue(new Date()))
  const [showDialog, setShowDialog] = useState(false)
  const [btnState, setBtnState] = useState('default') // default | loading | success

  // Tasas de cambio mockeadas estáticas
  const tasasCambio = { COP: 1, USD: 4000, EUR: 4560 }

  // Cálculo Exacto en Vivo
  const calc = useMemo(() => {
    return calcularPago(amount, currency, tasasCambio[currency], profile, kpis)
  }, [amount, currency, profile, kpis])

  const handleConfirm = () => {
    if (!amount) return
    setShowDialog(true)
  }

  const executeConfirm = () => {
    setShowDialog(false)
    setBtnState('loading')
    setTimeout(() => {
      setBtnState('success')
      addPayment({
        id: Date.now(), 
        client, 
        method: currency === 'COP' ? 'Transferencia' : 'Wise',
        currency, 
        originalAmount: currency !== 'COP' ? amount : null,
        gross: calc.pago_cop, 
        retencion: calc.retencion, 
        pila: calc.pila, 
        reserva: calc.reserva, 
        disponible: calc.disponible,
        date: paymentDate,
        dateLabel: formatDateLabel(paymentDate),
      })
      showToast({ type: 'success', message: 'Pago guardado correctamente' })
      setTimeout(() => navigate('I2R'), 400)
    }, 1200)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, position: 'relative' }}>
      {/* Confirmation dialog */}
      {showDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <div className="dialog-body">
              <div className="dialog-icon-wrap" style={{ background: 'var(--volt-dim)', border: '1px solid var(--volt-border)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--volt-text)" strokeWidth="2"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
              </div>
              <div className="dialog-title">¿Confirmar este pago?</div>
              <div className="dialog-desc">
                <strong>{currency !== 'COP' ? `${currency} ${amount.toLocaleString('es-CO')} ` : ''}${calc.pago_cop.toLocaleString('es-CO')} COP</strong> de <strong>{client}</strong> · {formatDateButtonLabel(paymentDate)}
                <br />Quadra calculará tu disponible real al instante.
              </div>
            </div>
            <div className="dialog-actions">
              <button className="dbtn dbtn-primary" onClick={executeConfirm}>Sí, calcular</button>
              <button className="dbtn dbtn-ghost" onClick={() => setShowDialog(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <div style={{ flex: 1, padding: 'var(--screen-pt) var(--screen-px) 0' }}>
        <AmountField onChange={setAmount} showCalculatingHint={btnState === 'loading'} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s5)', marginTop: 'var(--s6)' }}>
          {/* Currency */}
          <div className="field">
            <label className="field-label">Moneda</label>
            <div className="currency-group" style={{ marginTop: 'var(--s1)' }}>
              {['COP', 'USD', 'EUR'].map(c => (
                <button key={c} className={`currency-btn${currency === c ? ' active' : ''}`} onClick={() => setCurrency(c)}>
                  {c}
                  {c !== 'COP' && <span className="currency-rate">${c === 'USD' ? '4.000' : '4.560'}</span>}
                </button>
              ))}
            </div>
            <span className="field-helper">Tasa aproximada — se usa la del día del pago</span>
          </div>

          {/* Client */}
          <div className="field">
            <label className="field-label">Cliente</label>
            <span className="field-sub">Como aparece en tu factura</span>
            <input className="q-input" style={{ marginTop: 'var(--s1)' }} value={client} onChange={e => setClient(e.target.value)} placeholder="Nombre del cliente" />
          </div>

          {/* Date */}
          <div className="field">
            <label className="field-label">Fecha del pago</label>
            <label className="date-btn" style={{ marginTop: 'var(--s1)' }}>
              <input
                className="date-native-input"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                aria-label="Seleccionar fecha del pago"
              />
              <span className="sel">{formatDateButtonLabel(paymentDate)}</span>
              <IconCalendar />
            </label>
          </div>

          {/* Live preview interactiva real */}
          {calc.pago_cop > 0 && (
            <div className="preview">
              <div className="preview-eye">Disponible exacto</div>
              <div className="preview-amount" style={{ color: 'var(--volt-text)' }}>${calc.disponible.toLocaleString('es-CO')}</div>
              <div className="preview-sub">De ${calc.pago_cop.toLocaleString('es-CO')} brutos (COP)</div>
              
              <div className="preview-breakdown" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s2)', marginTop: 'var(--s4)' }}>
                {calc.pila > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--t-xs)', fontFamily: 'var(--font-body)' }}>
                    <div style={{ color: 'var(--txt-m)', fontWeight: 500 }}>Salud y Pensión</div>
                    <div style={{ color: 'var(--fin-reserve)', fontWeight: 700 }}>-${calc.pila.toLocaleString('es-CO')}</div>
                  </div>
                )}
                {calc.retencion > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--t-xs)', fontFamily: 'var(--font-body)' }}>
                    <div style={{ color: 'var(--txt-m)', fontWeight: 500 }}>Retención Fuente</div>
                    <div style={{ color: 'var(--fin-deduct)', fontWeight: 700 }}>-${calc.retencion.toLocaleString('es-CO')}</div>
                  </div>
                )}
                {calc.reserva > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--t-xs)', fontFamily: 'var(--font-body)' }}>
                    <div style={{ color: 'var(--txt-m)', fontWeight: 500 }}>Reserva Renta</div>
                    <div style={{ color: 'var(--fin-reserve)', fontWeight: 700 }}>-${calc.reserva.toLocaleString('es-CO')}</div>
                  </div>
                )}
              </div>
              
              {calc.warnings.length > 0 && (
                <div style={{ marginTop: 'var(--s3)', paddingTop: 'var(--s3)', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {calc.warnings.map((w, i) => (
                     <div key={i} style={{ fontSize: 10, color: 'var(--txt-2)', fontFamily: 'var(--font-body)' }}>• {w.msg}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sticky confirm */}
      <div className="q-sticky-footer">
        <button
          className={`btn-confirm${btnState === 'loading' ? ' loading' : ''}${btnState === 'success' ? ' success' : ''}`}
          onClick={handleConfirm}
          disabled={!amount || btnState !== 'default'}
        >
          {btnState === 'loading' && <span className="spin" />}
          {btnState === 'success' && <IconCheck />}
          {btnState === 'default' && 'Confirmar y calcular'}
          {btnState === 'loading' && 'Calculando tu disponible...'}
          {btnState === 'success' && 'Guardado'}
        </button>
      </div>
    </div>
  )
}
