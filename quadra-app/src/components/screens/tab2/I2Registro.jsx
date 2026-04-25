import { useMemo, useRef, useState } from 'react'
import { useAppStore } from '../../../store/useAppStore'
import { calcularPago } from '../../../lib/calculadoraFinanciera'
import { formatDateButtonLabel, formatDateLabel, toDateInputValue } from '../../../lib/dateUtils'
import AmountField from '../../ui/AmountField'
import { IconCalendar, IconCheck } from '../../ui/Icons'

export default function I2Registro() {
  const { navigate, addPayment, showToast, profile, kpis, payments } = useAppStore()
  const [amount, setAmount] = useState(0)
  const [client, setClient] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [currency, setCurrency] = useState('COP')
  const [paymentDate, setPaymentDate] = useState(() => toDateInputValue(new Date()))
  const [showDialog, setShowDialog] = useState(false)
  const [btnState, setBtnState] = useState('default') // default | loading | success
  const dateInputRef = useRef(null)

  // E5.2 — Client autocomplete
  const uniqueClients = useMemo(() => {
    const seen = new Set()
    return payments
      .filter(p => p.type !== 'pila' && p.client)
      .map(p => p.client)
      .filter(c => { if (seen.has(c)) return false; seen.add(c); return true })
      .slice(0, 5)
  }, [payments])

  const suggestions = useMemo(() => {
    if (!client.trim()) return uniqueClients
    return uniqueClients.filter(c => c.toLowerCase().includes(client.toLowerCase()) && c !== client)
  }, [client, uniqueClients])

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

  const openDatePicker = () => {
    const input = dateInputRef.current
    if (!input) return
    if (typeof input.showPicker === 'function') {
      input.showPicker()
      return
    }
    input.focus()
    input.click()
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
        pilaDetalle: calc.pilaDetalle,
        retencionDetalle: calc.retencionDetalle,
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
          <div className="field" style={{ position: 'relative' }}>
            <label className="field-label">Cliente</label>
            <span className="field-sub">Como aparece en tu factura</span>
            <input
              className="q-input"
              style={{ marginTop: 'var(--s1)' }}
              value={client}
              onChange={e => { setClient(e.target.value); setShowSuggestions(true) }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Nombre del cliente"
              autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 20,
                background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: 'var(--r-lg)', boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                marginTop: 4, overflow: 'hidden',
              }}>
                {suggestions.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => { setClient(c); setShowSuggestions(false) }}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '10px 14px', background: 'none', border: 'none',
                      borderBottom: i < suggestions.length - 1 ? '1px solid var(--border)' : 'none',
                      fontFamily: 'var(--font-body)', fontSize: 'var(--t-sm)', color: 'var(--txt)',
                      cursor: 'pointer',
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date */}
          <div className="field">
            <label className="field-label">Fecha del pago</label>
            <div
              className="date-btn"
              style={{ marginTop: 'var(--s1)' }}
              onClick={openDatePicker}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  openDatePicker()
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="Seleccionar fecha del pago"
            >
              <input
                ref={dateInputRef}
                className="date-native-input"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                aria-hidden="true"
                tabIndex={-1}
              />
              <span className="sel">{formatDateButtonLabel(paymentDate)}</span>
              <IconCalendar />
            </div>
          </div>

          {/* Live preview interactiva real */}
          {calc.pago_cop > 0 && (
            <div className="preview">
              <div className="preview-eye">Disponible exacto</div>
              <div className="preview-amount" style={{ color: 'var(--volt-text)' }}>${calc.disponible.toLocaleString('es-CO')}</div>
              <div className="preview-sub">De ${calc.pago_cop.toLocaleString('es-CO')} brutos (COP)</div>
              
              <div className="preview-breakdown" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s1)', marginTop: 'var(--s4)' }}>
                {calc.pila > 0 && (
                  <div className="pila-preview-blk" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div className="tx-drow" style={{ padding: 'var(--s2) 0', borderBottom: '1px solid var(--volt-border)' }}>
                      <div className="tx-drow-l" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
                        <span>PILA (seg. social, este pago)</span>
                        {calc.pilaDetalle && (
                          <span style={{ fontSize: 9, fontWeight: 500, color: 'var(--txt-2)', lineHeight: 1.35, maxWidth: 280 }}>12,5% salud, 16% pensión y ARL se calculan sobre el IBC del mes, no como % único de tu factura.</span>
                        )}
                      </div>
                      <div className="tx-drow-v" style={{ color: 'var(--fin-reserve)' }}>-${calc.pila.toLocaleString('es-CO')}</div>
                    </div>
                    {calc.pilaDetalle && (
                      <div style={{ fontSize: 10, color: 'var(--txt-2)', lineHeight: 1.45, paddingLeft: 2 }}>
                        IBC del mes: ${calc.pilaDetalle.ibc.toLocaleString('es-CO')}
                        {' · '}
                        salud 12,5%: ${calc.pilaDetalle.salud.toLocaleString('es-CO')}
                        {', pensión 16%: '}${calc.pilaDetalle.pension.toLocaleString('es-CO')}
                        {', ARL: '}${calc.pilaDetalle.arl.toLocaleString('es-CO')}
                      </div>
                    )}
                  </div>
                )}
                {calc.retencion > 0 && (
                  <div className="tx-drow" style={{ padding: 'var(--s2) 0', borderBottomColor: 'var(--volt-border)' }}>
                    <div className="tx-drow-l">Retención Fuente</div>
                    <div className="tx-drow-v" style={{ color: 'var(--fin-deduct)' }}>-${calc.retencion.toLocaleString('es-CO')}</div>
                  </div>
                )}
                {calc.reserva > 0 && (
                  <div className="tx-drow" style={{ padding: 'var(--s2) 0', borderBottomColor: 'var(--volt-border)' }}>
                    <div className="tx-drow-l">Reserva Renta</div>
                    <div className="tx-drow-v" style={{ color: 'var(--fin-reserve)' }}>-${calc.reserva.toLocaleString('es-CO')}</div>
                  </div>
                )}
              </div>
              
              {calc.warnings.some(w => w.id === 'PILA_ALTA' || w.id === 'PILA_MIN') && (
                <div style={{ marginTop: 'var(--s3)', padding: 'var(--s3)', background: 'var(--warning-bg, #fff8e1)', border: '1px solid var(--warning-border, #ffc107)', borderRadius: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--warning-text, #7c5a00)', fontFamily: 'var(--font-body)', marginBottom: 2 }}>⚠️ Seguridad social del mes</div>
                  <div style={{ fontSize: 10, color: 'var(--warning-text, #7c5a00)', fontFamily: 'var(--font-body)', lineHeight: 1.5 }}>
                    Tus aportes de PILA para este mes superan el valor de este pago. El disponible hoy es $0. El balance se ajustará con tus próximos ingresos del mes.
                  </div>
                </div>
              )}
              {calc.warnings.filter(w => w.id !== 'PILA_ALTA' && w.id !== 'PILA_MIN').length > 0 && (
                <div style={{ marginTop: 'var(--s3)', paddingTop: 'var(--s3)', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {calc.warnings.filter(w => w.id !== 'PILA_ALTA' && w.id !== 'PILA_MIN').map((w, i) => (
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
