import { useState, useCallback, useEffect } from 'react'
import { IconDelete } from './Icons'

export default function AmountField({ onChange, showCalculatingHint = false }) {
  const [raw, setRaw] = useState('')
  const [showNumpad, setShowNumpad] = useState(false)

  const numVal = Number(raw) || 0
  const formatted = raw ? numVal.toLocaleString('es-CO') : ''
  const hasVal = numVal >= 10000

  // Dynamic font size calculator
  const getFontSize = (len) => {
    if (len <= 4) return 'clamp(3.5rem, 15vw, 5.5rem)'  // Massive single digits
    if (len <= 6) return 'clamp(2.8rem, 12vw, 4.5rem)'  // Mid size
    if (len <= 8) return 'clamp(2.2rem, 9vw, 3.5rem)'   // Normal scale
    return 'clamp(1.8rem, 7vw, 2.5rem)'                 // Min bounds
  }

  // Notify parent on every keystroke
  useEffect(() => {
    if (onChange) onChange(numVal)
  }, [raw]) // eslint-disable-line

  const handleKey = useCallback((key) => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(30)
    }
    if (key === 'del') {
      setRaw(r => r.slice(0, -1))
    } else {
      if (raw.length >= 9) return
      setRaw(r => r + key)
    }
  }, [raw])

  // Support for physical computation keyboard
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is inside a text input (e.g. Cliente field)
      const tagName = document.activeElement?.tagName
      if (tagName === 'INPUT' || tagName === 'TEXTAREA') return

      if (e.key >= '0' && e.key <= '9') {
        handleKey(e.key)
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault() // prevent browser navigation back
        handleKey('del')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKey])

  return (
    <div>
      {/* Currency pill */}
      <button className="amount-currency-pill">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
        </svg>
        COP
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6,9 12,15 18,9"/>
        </svg>
      </button>

      {/* Big number */}
      <div 
        className="amount-input-wrap"
        onClick={() => setShowNumpad(true)}
        style={{ cursor: 'pointer' }}
      >
        <span className="amount-prefix">$</span>
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
                  transition: 'font-size var(--motion-fast) var(--ease-spring)'
                }}
              >
                {formatted}
              </span>
            </span>
          ) : (
            <span style={{ 
              fontSize: getFontSize(1), 
              color: 'var(--txt-f)',
              transition: 'font-size var(--motion-fast) var(--ease-spring)'
            }}>
              0
            </span>
          )}
        </div>
      </div>

      <div className={`amount-divider${raw ? ' focused' : ''}`} />

      {hasVal && showCalculatingHint && (
        <p style={{
          fontSize: 'var(--t-xs)', color: 'var(--fin-income)',
          fontWeight: 600, marginTop: 'var(--s2)', fontFamily: 'var(--font-body)',
        }}>
          Calculando tu disponible…
        </p>
      )}

      {/* Numpad toggleable */}
      {showNumpad && (
        <div style={{ marginTop: 'var(--s4)', animation: 'slideInUp var(--motion-fast) var(--ease-out)' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--s3)' }}>
            <span 
              onClick={() => setShowNumpad(false)}
              style={{
                fontFamily: 'var(--font-body)', fontSize: 'var(--t-sm)', fontWeight: 600,
                color: 'var(--txt-2)', cursor: 'pointer', padding: '6px 14px',
                background: 'var(--surf-2)', borderRadius: 'var(--r-full)',
                display: 'inline-flex', alignItems: 'center', gap: 6,
                transition: 'all var(--motion-fast)'
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--txt)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--txt-2)'}
            >
              Listo
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
          </div>
          <div className="numpad">
            {['1','2','3','4','5','6','7','8','9'].map(k => (
              <button key={k} className="numpad-key" onClick={() => handleKey(k)}>{k}</button>
            ))}
            <button className="numpad-key zero" onClick={() => handleKey('0')}>0</button>
            <button className="numpad-key del" onClick={() => handleKey('del')}>
              <IconDelete />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
