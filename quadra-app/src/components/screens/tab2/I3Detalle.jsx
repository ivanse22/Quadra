import { useMemo, useState } from 'react'
import { useAppStore } from '../../../store/useAppStore'
import { getPaymentDateLabel } from '../../../lib/dateUtils'

export default function I3Detalle() {
  const { payments, selectedPaymentId, navigate, removePayment, showToast } = useAppStore()
  const [tab, setTab] = useState('timeline')
  const [showDelDialog, setShowDelDialog] = useState(false)

  const p = payments.find(x => x.id === selectedPaymentId) || payments[0]
  const isPilaPayment = p?.type === 'pila'
  const fmt = (n) => '$' + n.toLocaleString('es-CO')
  const paymentDateLabel = getPaymentDateLabel(p)
  const paymentMethodLabel = useMemo(() => {
    if (!p) return 'Sin método'
    if (p.currency && p.currency !== 'COP' && p.originalAmount) {
      return `${p.method || 'Wise'} · ${p.currency} ${p.originalAmount.toLocaleString('es-CO')}`
    }
    return [p.method, p.currency || 'COP'].filter(Boolean).join(' · ')
  }, [p])
  const timelineItems = useMemo(() => {
    if (!p) return []
    if (isPilaPayment) {
      return [
        {
          date: paymentDateLabel,
          label: 'Quadra registró tu pago de PILA',
          note: [p.periodLabel ? `Período ${p.periodLabel}` : null, paymentMethodLabel].filter(Boolean).join(' · '),
          last: false,
        },
        {
          date: paymentDateLabel,
          label: `Se pagó ${fmt(Math.abs(p.pila || 0))} de seguridad social`,
          note: 'Este movimiento usa el dinero que Quadra ya había reservado para tu PILA.',
          last: false,
        },
        {
          date: paymentDateLabel,
          label: `Impacto en tu disponible: ${fmt(p.disponible || 0)}`,
          note: 'El saldo disponible baja porque este pago ya fue ejecutado.',
          last: true,
        },
      ]
    }
    return [
      {
        date: paymentDateLabel,
        label: p.type === 'pila' ? 'Quadra registró tu pago de PILA' : 'Quadra registró tu pago',
        note: `${p.client} · ${paymentMethodLabel}`,
        last: false,
      },
      {
        date: paymentDateLabel,
        label: 'Cálculo completado',
        note: `Retención: ${fmt(p.retencion || 0)} · PILA: ${fmt(p.pila || 0)} · Reserva: ${fmt(p.reserva || 0)}. Ver pestaña Detalles para IBC y aportes.`,
        last: false,
      },
      {
        date: paymentDateLabel,
        label: `Tu disponible real: ${fmt(p.disponible || 0)}`,
        note: 'Este es el dinero que puedes usar hoy después de separar tus obligaciones.',
        last: true,
      },
    ]
  }, [p, paymentDateLabel, paymentMethodLabel])

  const handleDelete = () => {
    setShowDelDialog(false)
    if (p?.id) removePayment(p.id)
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
          {isPilaPayment ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--fin-reserve)" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--fin-income)" strokeWidth="2"><path d="M18 15l-6-6-6 6"/></svg>
          )}
        </div>
        <div className="tx-detail-type">{isPilaPayment ? 'Pago PILA registrado' : 'Pago recibido'}</div>
        <div
          className="tx-detail-amount"
          style={isPilaPayment ? { color: 'var(--fin-reserve)' } : {}}
        >
          {isPilaPayment ? `-${fmt(Math.abs(p?.pila || 0))}` : fmt(p?.gross || 0)} COP
        </div>
        <div className="tx-detail-from">
          {isPilaPayment ? (p?.periodLabel || p?.client || 'Pago PILA') : (p?.client || 'Agencia Creativa SAS')}
        </div>
      </div>

      <div style={{ padding: 'var(--s4) var(--s5)' }}>
        <div className="seg-ctrl">
          <button className={`seg-btn${tab === 'timeline' ? ' active' : ''}`} onClick={() => setTab('timeline')}>Actualizaciones</button>
          <button className={`seg-btn${tab === 'details' ? ' active' : ''}`} onClick={() => setTab('details')}>Detalles</button>
        </div>
      </div>

      {tab === 'timeline' ? (
        <div className="tx-timeline">
          {timelineItems.map((item, i) => (
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
          <div style={{ fontSize: 'var(--t-sm)', fontWeight: 700, color: 'var(--txt)', marginBottom: 'var(--s4)', fontFamily: 'var(--font-display)' }}>
            {isPilaPayment ? 'Detalle del movimiento' : 'Detalles del cálculo'}
          </div>
          {isPilaPayment
            ? [
                { l: 'Valor pagado de PILA', v: `-${fmt(Math.abs(p?.pila || 0))}`, c: 'var(--fin-reserve)' },
                { l: 'Impacto en disponible', v: fmt(p?.disponible || 0), c: 'var(--fin-reserve)' },
                { l: 'Retención aplicada', v: fmt(p?.retencion || 0), c: null },
                { l: 'Reserva renta afectada', v: fmt(p?.reserva || 0), c: null },
              ].map((row, i, rows) => (
                <div key={row.l} className="tx-drow" style={i === rows.length - 1 ? { borderBottom: 'none' } : {}}>
                  <span className="tx-drow-l" style={row.total ? { fontWeight: 700, color: 'var(--txt)' } : {}}>{row.l}</span>
                  <span className={`tx-drow-v${row.total ? ' total' : ''}`} style={row.c ? { color: row.c } : {}}>{row.v}</span>
                </div>
              ))
            : (
              <>
                <div className="tx-drow">
                  <span className="tx-drow-l">Pago bruto recibido</span>
                  <span className="tx-drow-v">{fmt(p?.gross || 0)}</span>
                </div>
                <div className="tx-drow">
                  <div className="tx-drow-l" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
                    <span>Retención en la fuente</span>
                    {p?.gross > 0 && p?.retencion > 0 && (
                      <span className="i3-legal-hint" style={{ fontSize: 10, color: 'var(--txt-2)' }}>
                        ~{(Math.round((p.retencion / p.gross) * 1000) / 10).toString().replace(/\.0$/, '')}% del bruto
                      </span>
                    )}
                  </div>
                  <span className="tx-drow-v" style={{ color: 'var(--fin-deduct)' }}>−{fmt(p?.retencion || 0)}</span>
                </div>
                {p?.pilaDetalle && (p?.pila > 0) ? (
                  <div
                    className="card pila-mes-blk"
                    style={{
                      margin: 'var(--s3) 0',
                      padding: 'var(--s4)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--r-lg)',
                      background: 'var(--bg-subtle)',
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: 6 }}>PILA (seguridad social)</div>
                    <p className="i3-legal-hint" style={{ fontSize: 10, lineHeight: 1.5, color: 'var(--txt-2)', marginBottom: 10 }}>
                      Salud 12,5% y pensión 16% se aplican sobre el <strong>IBC</strong>, no sobre el 100% de la factura. IBC del mes = 40% de ingresos (con ajustes legales en el cálculo).
                    </p>
                    <div className="tx-drow" style={{ border: 'none', padding: '3px 0' }}>
                      <span className="tx-drow-l">IBC del mes (base)</span>
                      <span className="tx-drow-v">{fmt(p.pilaDetalle.ibc)}</span>
                    </div>
                    <div className="tx-drow" style={{ border: 'none', padding: '3px 0' }}>
                      <span className="tx-drow-l">Salud 12,5% del IBC</span>
                      <span className="tx-drow-v" style={{ color: 'var(--fin-reserve)' }}>−{fmt(p.pilaDetalle.salud)}</span>
                    </div>
                    <div className="tx-drow" style={{ border: 'none', padding: '3px 0' }}>
                      <span className="tx-drow-l">Pensión 16% del IBC</span>
                      <span className="tx-drow-v" style={{ color: 'var(--fin-reserve)' }}>−{fmt(p.pilaDetalle.pension)}</span>
                    </div>
                    <div className="tx-drow" style={{ border: 'none', padding: '3px 0' }}>
                      <span className="tx-drow-l">ARL riesgo I</span>
                      <span className="tx-drow-v" style={{ color: 'var(--fin-reserve)' }}>−{fmt(p.pilaDetalle.arl)}</span>
                    </div>
                    <div className="tx-drow" style={{ border: 'none', padding: '3px 0' }}>
                      <span className="tx-drow-l">Obligación del mes</span>
                      <span className="tx-drow-v" style={{ fontWeight: 700 }}>−{fmt(p.pilaDetalle.obligacionMensual)}</span>
                    </div>
                    {p.pilaDetalle.yaReservadoMes > 0 && (
                      <div className="tx-drow" style={{ border: 'none', padding: '3px 0' }}>
                        <span className="tx-drow-l">Ya reservado en el mes</span>
                        <span className="tx-drow-v" style={{ color: 'var(--txt-m)' }}>−{fmt(p.pilaDetalle.yaReservadoMes)}</span>
                      </div>
                    )}
                    <div className="tx-drow" style={{ border: 'none', padding: '6px 0 0', marginTop: 4, borderTop: '1px solid var(--border)' }}>
                      <span className="tx-drow-l" style={{ fontWeight: 800 }}>Reservado en este pago</span>
                      <span className="tx-drow-v" style={{ color: 'var(--fin-reserve)', fontWeight: 800 }}>−{fmt(p.pila || 0)}</span>
                    </div>
                  </div>
                ) : (p?.pila > 0) ? (
                  <div className="tx-drow">
                    <span className="tx-drow-l">PILA (total reservado)</span>
                    <span className="tx-drow-v" style={{ color: 'var(--fin-reserve)' }}>−{fmt(p.pila)}</span>
                  </div>
                ) : null}
                <div className="tx-drow">
                  <span className="tx-drow-l">Reserva declaración renta</span>
                  <span className="tx-drow-v" style={{ color: 'var(--fin-reserve)' }}>−{fmt(p?.reserva || 0)}</span>
                </div>
                <div className="tx-drow" style={{ borderBottom: 'none' }}>
                  <span className="tx-drow-l" style={{ fontWeight: 700, color: 'var(--txt)' }}>Disponible real</span>
                  <span className="tx-drow-v total" style={{ color: 'var(--volt-text)' }}>{fmt(p?.disponible || 0)}</span>
                </div>
              </>
            )}
          <div className="card-divider" />
          <div style={{ fontSize: 'var(--t-sm)', fontWeight: 700, color: 'var(--txt)', marginBottom: 'var(--s4)', fontFamily: 'var(--font-display)' }}>Datos del pago</div>
          {(isPilaPayment
            ? [
                { l: 'Concepto', v: p?.client || 'Pago PILA' },
                { l: 'Período', v: p?.periodLabel || 'Mes en curso' },
                { l: 'Fecha', v: paymentDateLabel },
                { l: 'Método', v: paymentMethodLabel },
              ]
            : [
                { l: 'Cliente', v: p?.client || 'Agencia Creativa SAS' },
                { l: 'Fecha', v: paymentDateLabel },
                { l: 'Método', v: paymentMethodLabel },
              ]).map((row, i, rows) => (
            <div key={i} className="tx-drow" style={i === rows.length - 1 ? { borderBottom: 'none' } : {}}>
              <span className="tx-drow-l">{row.l}</span>
              <span className="tx-drow-v">{row.v}</span>
            </div>
          ))}
        </div>
      )}

      {/* CL-01: link to D2 educational */}
      <div className="tx-detail-footer">
        <div className="tx-detail-footer-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('D2')}>
            ¿Cómo se calculó esto? →
          </button>
          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--fin-deduct)' }} onClick={() => setShowDelDialog(true)}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}
