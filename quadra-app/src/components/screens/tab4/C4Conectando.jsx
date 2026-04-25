import { useEffect, useState } from 'react'
import { useAppStore } from '../../../store/useAppStore'

export default function C4Conectando() {
  const { navigate, showToast } = useAppStore()
  const [step, setStep] = useState(0)
  const steps = ['Iniciando conexión segura...', 'Autenticando con el banco...', '¡Cuenta conectada!']

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 1200)
    const t2 = setTimeout(() => setStep(2), 2800)
    const t3 = setTimeout(() => {
      showToast({ type: 'success', message: 'Cuenta conectada exitosamente' })
      navigate('C3')
    }, 4200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [navigate, showToast])

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--s8)', textAlign: 'center' }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', border: `3px solid ${step === 2 ? 'var(--fin-income)' : 'var(--volt-text)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--s6)', transition: 'all .4s var(--ease-out)', position: 'relative' }}>
        {step < 2 ? (
          <div className="spin" style={{ width: 28, height: 28, borderWidth: 3 }} />
        ) : (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--fin-income)" strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
        )}
      </div>
      <h2 style={{ fontSize: 'var(--t-lg)', fontWeight: 900, color: 'var(--txt)', marginBottom: 'var(--s2)', fontFamily: 'var(--font-display)' }}>
        {steps[step]}
      </h2>
      <p style={{ fontSize: 'var(--t-sm)', color: 'var(--txt-m)', fontFamily: 'var(--font-body)' }}>
        {step < 2 ? 'Esto toma unos segundos. No cierres la app.' : 'Tu cuenta ya está sincronizada con Quadra.'}
      </p>
      {step === 0 && (
        <div style={{ display: 'flex', gap: 6, marginTop: 'var(--s6)' }}>
          {[0, 1, 2].map(i => (
            <div key={i} className="skel" style={{ width: 8, height: 8, borderRadius: '50%', animationDelay: `${i * 200}ms`, display: 'block' }} />
          ))}
        </div>
      )}
      {step < 2 && (
        <button className="btn btn-ghost" type="button" style={{ marginTop: 'var(--s5)' }} onClick={() => navigate('C4')}>
          Cancelar
        </button>
      )}
    </div>
  )
}
