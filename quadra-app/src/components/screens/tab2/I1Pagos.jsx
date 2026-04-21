import { useState, useEffect } from 'react'
import { useAppStore } from '../../../store/useAppStore'

function SkeletonList() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s3)', padding: '0 var(--screen-px)' }}>
      {[1, 2, 3, 4].map(i => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
          <span className="skel" style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0, display: 'block' }} />
          <div style={{ flex: 1 }}>
            <span className="skel" style={{ width: '60%', height: 12, display: 'block', marginBottom: 6 }} />
            <span className="skel" style={{ width: '40%', height: 10, display: 'block' }} />
          </div>
          <span className="skel" style={{ width: 70, height: 14, display: 'block' }} />
        </div>
      ))}
    </div>
  )
}

export default function I1Pagos() {
  const { payments, navigate, setSelectedPayment } = useAppStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(t)
  }, [])

  if (payments.length === 0) return <I1Vacio />

  // Group by date
  const grouped = payments.reduce((acc, p) => {
    if (!acc[p.dateLabel]) acc[p.dateLabel] = []
    acc[p.dateLabel].push(p)
    return acc
  }, {})

  return (
    <div style={{ position: 'relative' }}>
      {/* Summary badge */}
      <div style={{ padding: 'var(--s4) var(--screen-px)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: 'var(--s3)', alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="trend-badge trend-up">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 15l-6-6-6 6"/></svg>
            +$6.500.000 YTD
          </span>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('I4')}>Ver KPIs →</button>
        </div>
      </div>

      {loading ? <SkeletonList /> : (
        <div className="tx-list" style={{ borderRadius: 0, border: 'none', boxShadow: 'none' }}>
          {Object.entries(grouped).map(([date, rows]) => (
            <div key={date}>
              <div className="tx-section-header">{date}</div>
              {rows.map(p => (
                <div key={p.id} className="tx-row" onClick={() => { setSelectedPayment(p.id); navigate('I3') }}>
                  <div className="tx-icon">
                    {p.type === 'pila' ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--fin-reserve)" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--fin-income)" strokeWidth="2.5"><path d="M18 15l-6-6-6 6"/></svg>
                    )}
                  </div>
                  <div className="tx-info">
                    <div className="tx-name">{p.client}</div>
                    <div className="tx-sub">{p.method}{p.currency !== 'COP' && p.currency ? ` · ${p.currency} ${p.originalAmount?.toLocaleString()}` : ''}</div>
                  </div>
                  <div className="tx-amount" style={{ color: p.disponible < 0 ? 'var(--fin-reserve)' : 'var(--fin-income)' }}>
                    {p.disponible < 0 ? '-' : '+'}${Math.abs(p.disponible).toLocaleString('es-CO')}
                  </div>
                </div>
              ))}
            </div>
          ))}
          <div className="tx-total-row">
            <div className="tx-total-l">Disponible real este mes</div>
            <div className="tx-total-v">$1.240.000</div>
          </div>
        </div>
      )}

    </div>
  )
}

function I1Vacio() {
  const { navigate } = useAppStore()
  return (
    <div className="q-empty">
      <div className="q-empty-visual">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--txt-f)" strokeWidth="1.5"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
      </div>
      <h2 className="q-empty-headline">Aún no tienes pagos</h2>
      <p className="q-empty-desc">Registra tu primer pago y Quadra calcula automáticamente lo que es tuyo.</p>
      <button className="q-empty-cta" onClick={() => navigate('I2')}>+ Registrar primer pago</button>
      <button className="btn btn-ghost" onClick={() => navigate('D2')} style={{ marginTop: 'var(--s3)' }}>¿Cómo funciona?</button>
    </div>
  )
}
