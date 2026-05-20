import { useState, useCallback, useEffect, useRef } from 'react'
import { IconDelete } from './Icons'

const CURRENCIES = ['COP', 'USD', 'EUR']

export default function AmountField({
  onChange,
  showCalculatingHint = false,
  currency = 'COP',
  onCurrencyChange,
  exchangeRates = { USD: 4000, EUR: 4560 },
}) {
  const [raw, setRaw] = useState('')
  const [showNumpad, setShowNumpad] = useState(false)
  const [currencyOpen, setCurrencyOpen] = useState(false)
  const currencyWrapRef = useRef(null)

  const numVal = Number(raw) || 0
  const formatted = raw ? numVal.toLocaleString('es-CO') : ''
  const hasVal = numVal >= 1000
  const isLowAmount = numVal > 0 && numVal < 1000
  const canPickCurrency = typeof onCurrencyChange === 'function'
  const rate = currency === 'COP' ? 1 : (exchangeRates[currency] || 1)
  const prefix = currency === 'EUR' ? '€' : '$'
  const copEquivalent = Math.round(numVal * rate)

  const getFontSize = (len) => {
    if (len <= 4) return 'clamp(3.5rem, 15vw, 5.5rem)'
    if (len <= 6) return 'clamp(2.8rem, 12vw, 4.5rem)'
    if (len <= 8) return 'clamp(2.2rem, 9vw, 3.5rem)'
    return 'clamp(1.8rem, 7vw, 2.5rem)'
  }

  useEffect(() => {
    if (onChange) onChange(numVal)
  }, [raw]) // eslint-disable-line

  useEffect(() => {
    if (!currencyOpen) return
    const handlePointerDown = (e) => {
      if (currencyWrapRef.current && !currencyWrapRef.current.contains(e.target)) {
        setCurrencyOpen(false)
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [currencyOpen])

  const handleKey = useCallback((key) => {
    if (window.navigator?.vibrate) window.navigator.vibrate(30)
    if (key === 'del') {
      setRaw((r) => r.slice(0, -1))
    } else if (raw.length < 9) {
      setRaw((r) => r + key)
    }
  }, [raw])

  useEffect(() => {
    const handleKeyDown = (e) => {
      const tagName = document.activeElement?.tagName
      if (tagName === 'INPUT' || tagName === 'TEXTAREA') return
      if (e.key >= '0' && e.key <= '9') handleKey(e.key)
      else if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault()
        handleKey('del')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKey])

  const selectCurrency = (c) => {
    onCurrencyChange?.(c)
    setCurrencyOpen(false)
  }

  return (
    <div>
      <div className="amount-currency-wrap" ref={currencyWrapRef}>
        {canPickCurrency ? (
          <button
            type="button"
            className={`amount-currency-pill${currencyOpen ? ' is-open' : ''}`}
            onClick={() => setCurrencyOpen((o) => !o)}
            aria-expanded={currencyOpen}
            aria-haspopup="listbox"
            aria-label={`Moneda: ${currency}. Cambiar moneda`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
            </svg>
            {currency}
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
              <polyline points="6,9 12,15 18,9" />
            </svg>
          </button>
        ) : (
          <div className="amount-currency-pill" aria-label="Moneda base COP">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
            </svg>
            COP
          </div>
        )}

        {canPickCurrency && currencyOpen && (
          <div className="amount-currency-menu" role="listbox" aria-label="Seleccionar moneda">
            {CURRENCIES.map((c) => (
              <button
                key={c}
                type="button"
                role="option"
                aria-selected={currency === c}
                className={`amount-currency-option${currency === c ? ' active' : ''}`}
                onClick={() => selectCurrency(c)}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        className="amount-input-wrap"
        onClick={() => setShowNumpad(true)}
        style={{ cursor: 'pointer', width: '100%' }}
      >
        <span className="amount-prefix">{prefix}</span>
        <div
          className={`amount-number${hasVal ? ' has-val' : ''}`}
          style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline' }}
        >
          {raw ? (
            <span className="twotone">
              <span
                className="twotone-main"
                style={{
                  fontSize: getFontSize(formatted.length),
                  color: hasVal ? 'var(--volt-text)' : 'var(--txt)',
                  transition: 'font-size var(--motion-fast) var(--ease-spring)',
                }}
              >
                {formatted}
              </span>
            </span>
          ) : (
            <span
              style={{
                fontSize: getFontSize(1),
                color: 'var(--txt-f)',
                transition: 'font-size var(--motion-fast) var(--ease-spring)',
              }}
            >
              0
            </span>
          )}
        </div>
      </button>

      <div className={`amount-divider${raw ? ' focused' : ''}`} />

      {currency !== 'COP' && numVal > 0 && (
        <p className="amount-fx-hint">
          ≈ ${copEquivalent.toLocaleString('es-CO')} COP · tasa ref. ${rate.toLocaleString('es-CO')}
        </p>
      )}

      {hasVal && showCalculatingHint && (
        <p style={{
          fontSize: 'var(--t-xs)', color: 'var(--fin-income)',
          fontWeight: 600, marginTop: 'var(--s2)', fontFamily: 'var(--font-body)',
        }}>
          Calculando tu disponible…
        </p>
      )}
      {isLowAmount && (
        <p style={{
          fontSize: 'var(--t-xs)', color: 'var(--txt-m)',
          marginTop: 'var(--s2)', fontFamily: 'var(--font-body)',
        }}>
          ¿Es este el monto completo? Los valores típicos suelen ser mayores a $1.000.
        </p>
      )}

      {showNumpad && (
        <div style={{ marginTop: 'var(--s4)', animation: 'slideInUp var(--motion-fast) var(--ease-out)' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--s3)' }}>
            <button
              type="button"
              className="amount-done-btn"
              onClick={() => setShowNumpad(false)}
            >
              Listo
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
            </button>
          </div>
          <div className="numpad">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((k) => (
              <button key={k} type="button" className="numpad-key" onClick={() => handleKey(k)}>{k}</button>
            ))}
            <button type="button" className="numpad-key zero" onClick={() => handleKey('0')}>0</button>
            <button type="button" className="numpad-key del" onClick={() => handleKey('del')}>
              <IconDelete />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
