import { useState } from 'react'
import { useAppStore } from '../../../store/useAppStore'

export default function I3Detalle() {
  const { payments, selectedPaymentId, navigate, showToast } = useAppStore()
  const [tab, setTab] = useState('timeline')
  const [showDelDialog, setShowDelDialog] = useState(false)

  const p = payments.find(x => x.id === selectedPaymentId) || payments[0]
  const fmt = (n) => '$' + n.toLocaleString('es-CO')

  const handleDelete = () => {
    setShowDelDialog(false)
    showToast({ type: 'success', message: 'Pago eliminado' })
    navigate('I1')
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Delete dialog */}
      {showDelDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <div className="dialog-body">
              <div className="dialog-icon-wrap" style={{ background: 'var(--fin-deduct-dim)', border: '1px solid var(--fin-deduct-border)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--fin-deduct)" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
              </div>
              <div className="dialog-title">¿Eliminar este pago?</div>
              <div className="dialog-desc">Esta acción no se puede deshacer. El cálculo será revertido.</div>
            </div>
            <div className="dialog-actions">
              <button className="dbtn dbtn-destructive" onClick={handleDelete}>Sí, eliminar</button>
              <button className="dbtn dbtn-ghost" onClick={() => setShowDelDialog(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <div className="tx-detail-header">
        <div className="tx-detail-icon-wrap">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--fin-income)" strokeWidth="2"><path d="M18 15l-6-6-6 6"/></svg>
        </div>
        <div className="tx-detail-type">Pago recibido</div>
        <div className="tx-detail-amount">{fmt(p?.gross || 2000000)} COP</div>
        <div className="tx-detail-from">{p?.client || 'Agencia Creativa SAS'}</div>
      </div>

      <div style={{ padding: 'var(--s4) var(--s5)' }}>
        <div className="seg-ctrl">
          <button className={`seg-btn${tab === 'timeline' ? ' active' : ''}`} onClick={() => setTab('timeline')}>Actualizaciones</button>
          <button className={`seg-btn${tab === 'details' ? ' active' : ''}`} onClick={() => setTab('details')}>Detalles</button>
        </div>
      </div>

      {tab === 'timeline' ? (
        <div className="tx-timeline">
          {[
            { date: '19 Abr 2026 · 9:41 AM', label: 'Quadra registró tu pago', note: null, last: false },
            { date: '19 Abr 2026 · 9:41 AM', label: 'Cálculo completado', note: `Retención: ${fmt(p?.retencion || 200000)} · PILA: ${fmt(p?.pila || 250000)} · Agosto: ${fmt(p?.reserva || 310000)}`, last: false },
            { date: '19 Abr 2026 · 9:42 AM', label: `Tu disponible real: ${fmt(p?.disponible || 1240000)}`, note: 'Este es el dinero que puedes gastar hoy.', last: true },
          ].map((item, i) => (
            <div key={i} className="tl-row">
              <div className="tl-left">
                <div className="tl-check" style={item.last ? { background: 'var(--volt-text)' } : {}}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>
                </div>
                {!item.last && <div className="tl-line-seg" />}
              </div>
              <div className="tl-content">
                <div className="tl-date" style={item.last ? { color: 'var(--volt-text)' } : {}}>{item.date}</div>
                <div className="tl-label">{item.last ? <strong>{item.label}</strong> : item.label}</div>
                {item.note && <div className="tl-note">{item.note}</div>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="tx-detail-data" style={{ padding: '0 var(--s5) var(--s5)' }}>
          <div style={{ fontSize: 'var(--t-sm)', fontWeight: 700, color: 'var(--txt)', marginBottom: 'var(--s4)', fontFamily: 'var(--font-display)' }}>Detalles del cálculo</div>
          {[
            { l: 'Pago bruto recibido', v: fmt(p?.gross || 2000000), c: null },
            { l: 'Retención en la fuente', v: `-${fmt(p?.retencion || 200000)}`, c: 'var(--fin-deduct)' },
            { l: 'Salud y pensión (PILA)', v: `-${fmt(p?.pila || 250000)}`, c: 'var(--fin-reserve)' },
            { l: 'Reserva para agosto', v: `-${fmt(p?.reserva || 310000)}`, c: 'var(--fin-reserve)' },
            { l: 'Disponible real', v: fmt(p?.disponible || 1240000), c: 'var(--volt-text)', total: true },
          ].map((row, i) => (
            <div key={i} className="tx-drow" style={i === 4 ? { borderBottom: 'none' } : {}}>
              <span className="tx-drow-l" style={row.total ? { fontWeight: 700, color: 'var(--txt)' } : {}}>{row.l}</span>
              <span className={`tx-drow-v${row.total ? ' total' : ''}`} style={row.c ? { color: row.c } : {}}>{row.v}</span>
            </div>
          ))}
          <div className="card-divider" />
          <div style={{ fontSize: 'var(--t-sm)', fontWeight: 700, color: 'var(--txt)', marginBottom: 'var(--s4)', fontFamily: 'var(--font-display)' }}>Datos del pago</div>
          {[
            { l: 'Cliente', v: p?.client || 'Agencia Creativa SAS' },
            { l: 'Fecha', v: p?.dateLabel || '19 Abr 2026' },
            { l: 'Método', v: `${p?.method || 'Wise'} · ${p?.currency || 'USD'} ${p?.originalAmount?.toLocaleString() || '500'}` },
          ].map((row, i) => (
            <div key={i} className="tx-drow" style={i === 2 ? { borderBottom: 'none' } : {}}>
              <span className="tx-drow-l">{row.l}</span>
              <span className="tx-drow-v">{row.v}</span>
            </div>
          ))}
        </div>
      )}

      {/* CL-01: link to D2 educational */}
      <div style={{ padding: 'var(--s4) var(--s5)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('D2')}>
          ¿Cómo se calculó esto? →
        </button>
        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--fin-deduct)' }} onClick={() => setShowDelDialog(true)}>
          Eliminar
        </button>
      </div>
    </div>
  )
}
