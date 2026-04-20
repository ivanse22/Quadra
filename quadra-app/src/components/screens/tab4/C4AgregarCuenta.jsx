import { useState } from 'react'
import { useAppStore } from '../../../store/useAppStore'

export default function C4AgregarCuenta() {
  const { navigate } = useAppStore()
  const [selected, setSelected] = useState(null)
  const banks = [
    { id: 'bancolombia', name: 'Bancolombia', icon: '🏦' },
    { id: 'davivienda', name: 'Davivienda', icon: '🏧' },
    { id: 'bbva', name: 'BBVA', icon: '🔵' },
    { id: 'nequi', name: 'Nequi', icon: '📱' },
    { id: 'daviplata', name: 'Daviplata', icon: '💳' },
    { id: 'wise', name: 'Wise', icon: '💸' },
    { id: 'paypal', name: 'PayPal', icon: '🅿️' },
    { id: 'other', name: 'Otro banco', icon: '🏛️' },
  ]
  return (
    <div className="q-body-inner">
      <p style={{ fontSize: 'var(--t-sm)', color: 'var(--txt-2)', marginBottom: 'var(--s5)', fontFamily: 'var(--font-body)' }}>
        Selecciona tu banco o billetera para conectar tu cuenta.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s3)', marginBottom: 'var(--s6)' }}>
        {banks.map(b => (
          <div
            key={b.id}
            className={`ob-option${selected === b.id ? ' selected' : ''}`}
            style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 'var(--s4)' }}
            onClick={() => setSelected(b.id)}
          >
            <span style={{ fontSize: 28, marginBottom: 'var(--s2)' }}>{b.icon}</span>
            <div className="ob-option-title">{b.name}</div>
          </div>
        ))}
      </div>
      <button
        className="btn btn-primary btn-full"
        disabled={!selected}
        onClick={() => navigate('C4C')}
      >
        Conectar {banks.find(b => b.id === selected)?.name || 'cuenta'}
      </button>
    </div>
  )
}
