import { useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useAppStore } from '../../../store/useAppStore'
import { calcularPago } from '../../../lib/calculadoraFinanciera'
import { formatDateButtonLabel, formatDateLabel, toDateInputValue } from '../../../lib/dateUtils'
import AmountField from '../../ui/AmountField'
import ContextualHelp from '../../ui/ContextualHelp'
import { IconAlertTriangle, IconCalendar, IconCheck } from '../../ui/Icons'

const METHODS = ['Transferencia', 'PSE', 'Wise', 'Efectivo']

export default function I2Registro() {
  const { navigate, addPayment, showToast, profile, kpis, payments } = useAppStore()
  const [amount, setAmount]           = useState(0)
  const [client, setClient]           = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [currency, setCurrency]       = useState('COP')
  const [method, setMethod]           = useState('Transferencia')
  const [paymentDate, setPaymentDate] = useState(() => toDateInputValue(new Date()))
  const [showDialog, setShowDialog]   = useState(false)
  const [btnState, setBtnState]       = useState('default') // default | loading | success
  const [pilaExpanded, setPilaExpanded] = useState(false)
  const dateInputRef = useRef(null)

  // Autocomplete de clientes (top 8 por frecuencia)
  const uniqueClients = useMemo(() => {
    const freq = {}
    payments
      .filter((p) => p.type !== 'pila' && p.client)
      .forEach((p) => { freq[p.client] = (freq[p.client] || 0) + 1 })
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name)
      .slice(0, 8)
  }, [payments])

  const suggestions = useMemo(() => {
    if (!client.trim()) return uniqueClients
    return uniqueClients.filter((c) => c.toLowerCase().includes(client.toLowerCase()) && c !== client)
  }, [client, uniqueClients])

  const tasasCambio = { COP: 1, USD: 4000, EUR: 4560 }

  const calc = useMemo(() =>
    calcularPago(amount, currency, tasasCambio[currency], profile, kpis),
    [amount, currency, profile, kpis]
  )

  // Porcentajes para la mini barra de preview
  const gross = calc.pago_cop || 0
  const pctDisp = gross > 0 ? Math.round((calc.disponible  / gross) * 100) : 0
  const pctRet  = gross > 0 ? Math.round((calc.retencion   / gross) * 100) : 0
  const pctPila = gross > 0 ? Math.round((calc.pila        / gross) * 100) : 0
  const pctRes  = gross > 0 ? Math.round((calc.reserva     / gross) * 100) : 0

  const handleConfirm = () => { if (!amount) return; setShowDialog(true) }

  const openDatePicker = () => {
    const input = dateInputRef.current
    if (!input) return
    if (typeof input.showPicker === 'function') { input.showPicker(); return }
    input.focus(); input.click()
  }

  const executeConfirm = () => {
    setShowDialog(false)
    setBtnState('loading')
    setTimeout(() => {
      setBtnState('success')
      addPayment({
        id:             Date.now(),
        client,
        method,
        currency,
        originalAmount: currency !== 'COP' ? amount : null,
        gross:          calc.pago_cop,
        retencion:      calc.retencion,
        pila:           calc.pila,
        reserva:        calc.reserva,
        disponible:     calc.disponible,
        date:           paymentDate,
        dateLabel:      formatDateLabel(paymentDate),
        pilaDetalle:    calc.pilaDetalle,
        retencionDetalle: calc.retencionDetalle,
      })
      showToast({ type: 'success', message: 'Pago guardado correctamente' })
      setTimeout(() => navigate('I2R'), 400)
    }, 1200)
  }

  const phoneEl = document.querySelector('.q-phone')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>

      {/* ── Dialog de confirmación — portado a .q-phone para cubrir exactamente el frame ── */}
      {showDialog && phoneEl && createPortal(
        <div className="dialog-overlay">
          <div className="dialog">
            <div className="dialog-body">
              <div className="dialog-icon-wrap" style={{ background: 'var(--volt-dim)', border: '1px solid var(--volt-border)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--volt-text)" strokeWidth="2">
                  <line x1="12" y1="2" x2="12" y2="22"/>
                  <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                </svg>
              </div>
              <div className="dialog-title">¿Confirmar este pago?</div>
              <div className="dialog-desc">
                <strong>
                  {currency !== 'COP' ? `${currency} ${amount.toLocaleString('es-CO')} → ` : ''}
                  ${calc.pago_cop.toLocaleString('es-CO')} COP
                </strong>
                {client ? <> de <strong>{client}</strong></> : null}
                {' · '}{formatDateButtonLabel(paymentDate)}
                <br />Quadra calculará tu disponible real al instante.
              </div>
            </div>
            <div className="dialog-actions">
              <button className="dbtn dbtn-primary" onClick={executeConfirm}>Sí, calcular</button>
              <button className="dbtn dbtn-ghost" onClick={() => setShowDialog(false)}>Cancelar</button>
            </div>
          </div>
        </div>,
        phoneEl
      )}

      {/* ── Formulario ── */}
      <div style={{ flex: 1, padding: 'var(--screen-pt) var(--screen-px) 0' }}>
        <AmountField onChange={setAmount} showCalculatingHint={btnState === 'loading'} />
        <p style={{ fontSize: 'var(--t-xs)', color: 'var(--txt-f)', fontFamily: 'var(--font-body)', marginTop: 4 }}>
          Ingresa el valor bruto de tu factura o pago recibido.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s5)', marginTop: 'var(--s6)' }}>

          {/* Moneda */}
          <div className="field">
            <label className="field-label">Moneda</label>
            <div className="currency-group" style={{ marginTop: 'var(--s1)' }}>
              {['COP', 'USD', 'EUR'].map((c) => (
                <button key={c} className={`currency-btn${currency === c ? ' active' : ''}`} onClick={() => setCurrency(c)}>
                  {c}
                  {c !== 'COP' && <span className="currency-rate">${c === 'USD' ? '4.000' : '4.560'}</span>}
                </button>
              ))}
            </div>
            <span className="field-helper">Tasa aproximada — se usa la del día del pago</span>
          </div>

          {/* Método de pago */}
          <div className="field">
            <label className="field-label">Método de pago</label>
            <div className="seg-ctrl" style={{ marginTop: 'var(--s1)' }}>
              {METHODS.map((m) => (
                <button
                  key={m}
                  className={`seg-btn${method === m ? ' active' : ''}`}
                  onClick={() => setMethod(m)}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Cliente */}
          <div className="field" style={{ position: 'relative' }}>
            <label className="field-label">Cliente</label>
            <span className="field-sub">Como aparece en tu factura</span>
            <input
              className="q-input"
              style={{ marginTop: 'var(--s1)' }}
              value={client}
              onChange={(e) => { setClient(e.target.value); setShowSuggestions(true) }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Nombre del cliente"
              autoComplete="off"
            />
            {uniqueClients.length > 0 && !showSuggestions && !client && (
              <span style={{ display: 'block', fontSize: 'var(--t-xs)', color: 'var(--txt-m)', marginTop: 4, fontFamily: 'var(--font-body)' }}>
                Toca para ver clientes anteriores
              </span>
            )}
            {showSuggestions && suggestions.length > 0 && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 20,
                background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-lg)',
                marginTop: 4, overflow: 'hidden',
              }}>
                {suggestions.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => { setClient(c); setShowSuggestions(false) }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      width: '100%', textAlign: 'left',
                      padding: '10px 14px', background: 'none', border: 'none',
                      borderBottom: i < suggestions.length - 1 ? '1px solid var(--border)' : 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {/* Avatar inicial */}
                    <div className="i2-client-avatar">
                      {c.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--t-sm)', color: 'var(--txt)', fontWeight: 500 }}>
                      {c}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fecha */}
          <div className="field">
            <label className="field-label">Fecha del pago</label>
            <div
              className="date-btn"
              style={{ marginTop: 'var(--s1)' }}
              onClick={openDatePicker}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDatePicker() } }}
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

          {/* ── Preview card premium ── */}
          {calc.pago_cop > 0 && (
            <div className="i2-preview-card">
              <div className="i2-preview-header">Vista previa del cálculo</div>

              {/* Mini barra proporcional */}
              <div style={{ marginBottom: 'var(--s4)' }}>
                <div className="i1-breakdown-bar">
                  <div className="i1-breakdown-seg" style={{ width: `${pctDisp}%`, background: 'var(--fin-income)' }} />
                  <div className="i1-breakdown-seg" style={{ width: `${pctRet}%`,  background: 'var(--fin-deduct)' }} />
                  <div className="i1-breakdown-seg" style={{ width: `${pctPila}%`, background: 'var(--fin-reserve)' }} />
                  <div className="i1-breakdown-seg" style={{ width: `${pctRes}%`,  background: 'var(--volt-border)' }} />
                </div>
                <div className="i1-breakdown-legend">
                  <div className="i1-breakdown-item">
                    <div className="i1-breakdown-dot" style={{ background: 'var(--fin-income)' }} />
                    Disponible {pctDisp}%
                  </div>
                  {calc.retencion > 0 && (
                    <div className="i1-breakdown-item">
                      <div className="i1-breakdown-dot" style={{ background: 'var(--fin-deduct)' }} />
                      Retención {pctRet}%
                    </div>
                  )}
                  {calc.pila > 0 && (
                    <div className="i1-breakdown-item">
                      <div className="i1-breakdown-dot" style={{ background: 'var(--fin-reserve)' }} />
                      PILA {pctPila}%
                    </div>
                  )}
                  {calc.reserva > 0 && (
                    <div className="i1-breakdown-item">
                      <div className="i1-breakdown-dot" style={{ background: 'var(--volt-border)' }} />
                      Reserva {pctRes}%
                    </div>
                  )}
                </div>
              </div>

              {/* Disponible hero */}
              <div style={{ marginBottom: 'var(--s3)' }}>
                <div style={{ fontSize: 'var(--t-xs)', color: 'var(--txt-m)', fontFamily: 'var(--font-body)', marginBottom: 2 }}>Disponible exacto</div>
                <div style={{ fontSize: 'var(--t-2xl)', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--volt-text)', letterSpacing: '-0.04em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                  ${calc.disponible.toLocaleString('es-CO')}
                </div>
                <div style={{ fontSize: 'var(--t-xs)', color: 'var(--txt-m)', fontFamily: 'var(--font-body)', marginTop: 3 }}>
                  De ${calc.pago_cop.toLocaleString('es-CO')} brutos COP
                </div>
              </div>

              {/* Desglose línea por línea */}
              <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border)', paddingTop: 'var(--s3)', gap: 0 }}>

                {/* Retención */}
                {calc.retencion > 0 && (
                  <div style={{ padding: 'var(--s2) 0', borderBottom: '1px solid var(--border)' }}>
                    <div className="tx-drow" style={{ border: 'none', padding: 0 }}>
                      <div className="tx-drow-l" style={{ color: 'var(--txt-2)', fontSize: 'var(--t-sm)' }}>Retención en la fuente</div>
                      <div className="tx-drow-v" style={{ color: 'var(--fin-deduct)', fontSize: 'var(--t-sm)' }}>
                        −${calc.retencion.toLocaleString('es-CO')}
                      </div>
                    </div>
                    <ContextualHelp
                      term="¿Qué es la retención?"
                      explanation="Tu cliente descuenta este porcentaje directamente al pagarte. Es un anticipo del impuesto de renta — no es un gasto extra. Al declarar, el gobierno lo reconoce como pago adelantado."
                    />
                  </div>
                )}

                {/* PILA con toggle para desglose */}
                {calc.pila > 0 && (
                  <div style={{ borderBottom: '1px solid var(--border)' }}>
                    <button className="i2-pila-toggle" onClick={() => setPilaExpanded((v) => !v)}>
                      <div className="tx-drow-l" style={{ color: 'var(--txt-2)', fontSize: 'var(--t-sm)', flex: 1, textAlign: 'left' }}>
                        PILA (seg. social, este pago)
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: 'var(--fin-reserve)', fontSize: 'var(--t-sm)', fontWeight: 700, fontFamily: 'var(--font-display)', fontVariantNumeric: 'tabular-nums' }}>
                          −${calc.pila.toLocaleString('es-CO')}
                        </span>
                        <svg
                          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--txt-m)" strokeWidth="2.5"
                          style={{ transform: pilaExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 200ms var(--ease-out)', flexShrink: 0 }}
                        >
                          <polyline points="6,9 12,15 18,9" />
                        </svg>
                      </div>
                    </button>

                    {/* Desglose PILA colapsable */}
                    {pilaExpanded && calc.pilaDetalle && (
                      <div style={{ paddingBottom: 'var(--s3)', paddingLeft: 'var(--s2)', borderTop: '1px solid var(--border)', paddingTop: 'var(--s2)' }}>
                        <p className="i2-legal-hint" style={{ marginBottom: 'var(--s2)' }}>
                          PILA es mensual sobre el total del mes (todos tus clientes). IBC = 40% del total, con piso 1 SMMLV y tope 25 SMMLV.
                        </p>
                        {[
                          { l: `IBC del mes`, v: `$${calc.pilaDetalle.ibc.toLocaleString('es-CO')}`, c: 'var(--txt-2)' },
                          { l: 'Salud 12,5%', v: `−$${calc.pilaDetalle.salud.toLocaleString('es-CO')}`, c: 'var(--fin-reserve)' },
                          { l: 'Pensión 16%', v: `−$${calc.pilaDetalle.pension.toLocaleString('es-CO')}`, c: 'var(--fin-reserve)' },
                          { l: 'ARL', v: `−$${calc.pilaDetalle.arl.toLocaleString('es-CO')}`, c: 'var(--fin-reserve)' },
                        ].map(({ l, v, c }) => (
                          <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: 'var(--t-xs)', fontFamily: 'var(--font-body)' }}>
                            <span style={{ color: 'var(--txt-m)' }}>{l}</span>
                            <span style={{ color: c, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{v}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Reserva renta */}
                {calc.reserva > 0 && (
                  <div style={{ padding: 'var(--s2) 0', borderBottom: '1px solid var(--border)' }}>
                    <div className="tx-drow" style={{ border: 'none', padding: 0 }}>
                      <div className="tx-drow-l" style={{ color: 'var(--txt-2)', fontSize: 'var(--t-sm)' }}>Reserva para declaración de renta</div>
                      <div className="tx-drow-v" style={{ color: 'var(--fin-reserve)', fontSize: 'var(--t-sm)' }}>
                        −${calc.reserva.toLocaleString('es-CO')}
                      </div>
                    </div>
                    <ContextualHelp
                      term="¿Por qué se reserva esto?"
                      explanation="Quadra separa automáticamente una parte de cada pago para que tengas dinero disponible cuando llegue tu declaración de renta en agosto. No lo pierdes — es tuyo, solo está separado."
                    />
                  </div>
                )}

                {/* Disponible total */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--s3) 0 0', marginTop: 2 }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--t-sm)', fontWeight: 700, color: 'var(--txt)' }}>Lo que es tuyo hoy</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--t-md)', fontWeight: 900, color: 'var(--volt-text)', fontVariantNumeric: 'tabular-nums' }}>
                    ${calc.disponible.toLocaleString('es-CO')}
                  </span>
                </div>
              </div>

              {/* Advertencias */}
              {calc.warnings.some((w) => w.id === 'PILA_ALTA' || w.id === 'PILA_MIN') && (
                <div style={{ marginTop: 'var(--s3)', padding: 'var(--s3)', background: 'var(--bg-subtle)', border: '1px solid var(--fin-reserve)', borderRadius: 'var(--r-md)' }}>
                  <div style={{ fontSize: 'var(--t-2xs)', fontWeight: 700, color: 'var(--fin-reserve)', fontFamily: 'var(--font-body)', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <IconAlertTriangle size={12} /> Seguridad social del mes
                  </div>
                  <div style={{ fontSize: 'var(--t-2xs)', color: 'var(--txt-2)', fontFamily: 'var(--font-body)', lineHeight: 1.5 }}>
                    Tus aportes de PILA para este mes superan el valor de este pago. El disponible hoy es $0. El balance se ajustará con tus próximos ingresos del mes.
                  </div>
                </div>
              )}
              {calc.warnings.filter((w) => w.id !== 'PILA_ALTA' && w.id !== 'PILA_MIN').length > 0 && (
                <div style={{ marginTop: 'var(--s3)', paddingTop: 'var(--s3)', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {calc.warnings
                    .filter((w) => w.id !== 'PILA_ALTA' && w.id !== 'PILA_MIN')
                    .map((w, i) => (
                      <div key={i} style={{ fontSize: 'var(--t-2xs)', color: 'var(--txt-2)', fontFamily: 'var(--font-body)' }}>• {w.msg}</div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Botón sticky ── */}
      <div className="q-sticky-footer">
        <button
          className={`btn-confirm${btnState === 'loading' ? ' loading' : ''}${btnState === 'success' ? ' success' : ''}`}
          onClick={handleConfirm}
          disabled={!amount || btnState !== 'default'}
        >
          {btnState === 'loading' && <span className="spin" />}
          {btnState === 'success' && <IconCheck />}
          {btnState === 'default'  && 'Confirmar y calcular'}
          {btnState === 'loading'  && 'Calculando tu disponible...'}
          {btnState === 'success'  && 'Guardado'}
        </button>
      </div>
    </div>
  )
}
