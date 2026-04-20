import { useState } from 'react'
import { useAppStore } from '../../../store/useAppStore'
import AmountField from '../../ui/AmountField'
import { IconDelete, IconCheck } from '../../ui/Icons'

export default function I2Registro() {
  const { navigate, addPayment, showToast } = useAppStore()
  const [amount, setAmount] = useState(0)
  const [client, setClient] = useState('Agencia Creativa SAS')
  const [currency, setCurrency] = useState('COP')
  const [showDialog, setShowDialog] = useState(false)
  const [btnState, setBtnState] = useState('default') // default | loading | success

  const handleAmountConfirm = (val) => setAmount(val)

  const handleConfirm = () => {
    if (!amount) return
    setShowDialog(true)
  }

  const executeConfirm = () => {
    setShowDialog(false)
    setBtnState('loading')
    setTimeout(() => {
      setBtnState('success')
      const gross = amount
      const retencion = Math.round(gross * 0.11)
      const pila = Math.round(gross * 0.125)
      const reserva = Math.round(gross * 0.155)
      const disponible = gross - retencion - pila - reserva
      addPayment({
        id: Date.now(), client, method: currency === 'USD' ? 'Wise' : 'Transferencia',
        currency, gross, retencion, pila, reserva, disponible,
        date: '2026-04-19', dateLabel: '19 Abr 2026',
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
                <strong>${amount.toLocaleString('es-CO')}</strong> de <strong>{client}</strong> · 19 Abr 2026
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
        <AmountField onChange={setAmount} />

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
            <button className="date-btn" style={{ marginTop: 'var(--s1)' }}>
              <span className="sel">Hoy — Sab 19 Abr 2026</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            </button>
          </div>

          {/* Live preview */}
          {amount > 100000 && (
            <div className="preview">
              <div className="preview-eye">Disponible estimado</div>
              <div className="preview-amount">${Math.round(amount * 0.62).toLocaleString('es-CO')}</div>
              <div className="preview-sub">De ${amount.toLocaleString('es-CO')} brutos · estimado</div>
              <div className="preview-breakdown">
                <div><div className="preview-item-lbl">S+P</div><div className="preview-item-val" style={{ color: 'var(--fin-reserve)' }}>-${Math.round(amount * 0.125).toLocaleString('es-CO')}</div></div>
                <div><div className="preview-item-lbl">Ret.</div><div className="preview-item-val" style={{ color: 'var(--fin-deduct)' }}>-${Math.round(amount * 0.11).toLocaleString('es-CO')}</div></div>
                <div><div className="preview-item-lbl">Ago.</div><div className="preview-item-val" style={{ color: 'var(--fin-reserve)' }}>-${Math.round(amount * 0.155).toLocaleString('es-CO')}</div></div>
              </div>
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
          {btnState === 'loading' && 'Calculando...'}
          {btnState === 'success' && 'Guardado'}
        </button>
      </div>
    </div>
  )
}
