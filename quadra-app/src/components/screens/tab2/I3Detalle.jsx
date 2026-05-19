import { useMemo, useState } from 'react'
import { useAppStore } from '../../../store/useAppStore'
import { getPaymentDateLabel } from '../../../lib/dateUtils'

export default function I3Detalle() {
  const { payments, selectedPaymentId, navigate, removePayment, showToast } = useAppStore()
  const [tab, setTab]               = useState('timeline')
  const [showDelDialog, setShowDelDialog] = useState(false)

  const p              = payments.find((x) => x.id === selectedPaymentId) || payments[0]
  const isPilaPayment  = p?.type === 'pila'
  const fmt            = (n) => '$' + Math.round(Math.abs(n || 0)).toLocaleString('es-CO')
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
          icon: 'doc',
          date:  paymentDateLabel,
          label: 'Quadra registró tu pago de PILA',
          note:  [p.periodLabel ? `Período ${p.periodLabel}` : null, paymentMethodLabel].filter(Boolean).join(' · '),
          last:  false,
        },
        {
          icon: 'shield',
          date:  paymentDateLabel,
          label: `Se pagó ${fmt(p.pila)} de seguridad social`,
          note:  'Este movimiento usa el dinero que Quadra ya había reservado para tu PILA.',
          last:  false,
        },
        {
          icon: 'check',
          date:  paymentDateLabel,
          label: `Impacto en tu disponible: ${fmt(p.disponible)}`,
          note:  'El saldo disponible baja porque este pago ya fue ejecutado.',
          last:  true,
        },
      ]
    }
    return [
      {
        icon: 'doc',
        date:  paymentDateLabel,
        label: 'Quadra registró tu pago',
        note:  `${p.client} · ${paymentMethodLabel}`,
        last:  false,
      },
      {
        icon: 'calc',
        date:  paymentDateLabel,
        label: 'Cálculo completado',
        note:  `Retención: ${fmt(p.retencion)} · PILA: ${fmt(p.pila)} · Reserva: ${fmt(p.reserva)}. Ver pestaña Detalles para IBC y aportes.`,
        last:  false,
      },
      {
        icon: 'check',
        date:  paymentDateLabel,
        label: `Tu disponible real: ${fmt(p.disponible)}`,
        note:  'Este es el dinero que puedes usar hoy después de separar tus obligaciones.',
        last:  true,
      },
    ]
  }, [p, paymentDateLabel, paymentMethodLabel])

  const handleDelete = () => {
    setShowDelDialog(false)
    if (p?.id) removePayment(p.id)
    showToast({ type: 'success', message: 'Pago eliminado' })
    navigate('I1')
  }

  // Íconos para cada paso del timeline
  const TlIcon = ({ type, isLast }) => {
    const color = isLast ? '#fff' : 'var(--txt-m)'
    if (type === 'doc') return (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
      </svg>
    )
    if (type === 'calc') return (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5">
        <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/>
      </svg>
    )
    if (type === 'shield') return (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    )
    // check
    return (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3">
        <polyline points="20,6 9,17 4,12"/>
      </svg>
    )
  }

  if (!p) return null

  return (
    <div style={{ position: 'relative' }}>

      {/* ── Dialog eliminar ── */}
      {showDelDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <div className="dialog-body">
              <div className="dialog-icon-wrap" style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.18)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--fin-deduct)" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                </svg>
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

      {/* ── Header premium ── */}
      <div className="i3-header-card">
        {/* Ícono de tipo */}
        <div
          className="i3-header-icon"
          style={{ background: isPilaPayment ? 'rgba(180,83,9,0.10)' : 'rgba(22,163,74,0.10)' }}
        >
          {isPilaPayment ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--fin-reserve)" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--fin-income)" strokeWidth="2">
              <path d="M18 15l-6-6-6 6"/>
            </svg>
          )}
        </div>

        {/* Monto principal */}
        <div className="i3-header-amount" style={{ color: isPilaPayment ? 'var(--fin-reserve)' : 'var(--txt)' }}>
          {isPilaPayment ? `−${fmt(p.pila)}` : fmt(p.gross)} COP
        </div>

        {/* Disponible real (solo ingresos) */}
        {!isPilaPayment && (
          <div className="i3-header-disponible">
            Disponible real {fmt(p.disponible)}
          </div>
        )}

        {/* Chips de metadata */}
        <div className="i3-header-chips">
          {/* Cliente o período */}
          <div className="i3-header-chip">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            {isPilaPayment ? (p.periodLabel || 'Pago PILA') : (p.client || 'Sin cliente')}
          </div>
          {/* Fecha */}
          <div className="i3-header-chip">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {paymentDateLabel}
          </div>
          {/* Método */}
          <div className="i3-header-chip">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            {paymentMethodLabel}
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ padding: 'var(--s4) var(--s5)' }}>
        <div className="seg-ctrl">
          <button className={`seg-btn${tab === 'timeline' ? ' active' : ''}`} onClick={() => setTab('timeline')}>
            Actualizaciones
          </button>
          <button className={`seg-btn${tab === 'details' ? ' active' : ''}`} onClick={() => setTab('details')}>
            Detalles
          </button>
        </div>
      </div>

      {/* ── Timeline ── */}
      {tab === 'timeline' && (
        <div className="tx-timeline">
          {timelineItems.map((item, i) => (
            <div key={i} className="tl-row">
              <div className="tl-left">
                <div
                  className="tl-check"
                  style={item.last
                    ? { background: 'var(--volt-text)', width: 26, height: 26 }
                    : { background: 'var(--surf-2)', border: '1.5px solid var(--border)' }
                  }
                >
                  <TlIcon type={item.icon} isLast={item.last} />
                </div>
                {!item.last && <div className="tl-line-seg" />}
              </div>
              <div className="tl-content">
                <div className="tl-date" style={item.last ? { color: 'var(--volt-text)' } : {}}>
                  {item.date}
                </div>
                <div className="tl-label">
                  {item.last ? <strong>{item.label}</strong> : item.label}
                </div>
                {item.note && (
                  <div
                    className="tl-note"
                    style={item.last
                      ? { background: 'var(--volt-dim)', border: '1px solid var(--volt-border)', borderRadius: 'var(--r-md)', padding: '6px 8px', marginTop: 4 }
                      : {}
                    }
                  >
                    {item.note}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Detalles ── */}
      {tab === 'details' && (
        <div className="tx-detail-data" style={{ padding: '0 var(--s5) var(--s5)' }}>
          <div style={{ fontSize: 'var(--t-sm)', fontWeight: 700, color: 'var(--txt)', marginBottom: 'var(--s4)', fontFamily: 'var(--font-display)' }}>
            {isPilaPayment ? 'Detalle del movimiento' : 'Detalles del cálculo'}
          </div>

          {isPilaPayment ? (
            [
              { l: 'Valor pagado de PILA', v: `−${fmt(p.pila)}`, c: 'var(--fin-reserve)' },
              { l: 'Impacto en disponible',  v: fmt(p.disponible), c: 'var(--fin-reserve)' },
              { l: 'Retención aplicada',     v: fmt(p.retencion),  c: null },
              { l: 'Reserva renta afectada', v: fmt(p.reserva),    c: null },
            ].map((row, i, rows) => (
              <div key={row.l} className="tx-drow" style={i === rows.length - 1 ? { borderBottom: 'none' } : {}}>
                <span className="tx-drow-l">{row.l}</span>
                <span className="tx-drow-v" style={row.c ? { color: row.c } : {}}>{row.v}</span>
              </div>
            ))
          ) : (
            <>
              <div className="tx-drow">
                <span className="tx-drow-l">Pago bruto recibido</span>
                <span className="tx-drow-v" style={{ color: 'var(--fin-income)' }}>{fmt(p.gross)}</span>
              </div>
              <div className="tx-drow">
                <div className="tx-drow-l" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
                  <span>Retención en la fuente</span>
                  {p.gross > 0 && p.retencion > 0 && (
                    <span className="i3-legal-hint">
                      ~{(Math.round((p.retencion / p.gross) * 1000) / 10).toString().replace(/\.0$/, '')}% del bruto
                    </span>
                  )}
                </div>
                <span className="tx-drow-v" style={{ color: 'var(--fin-deduct)' }}>−{fmt(p.retencion)}</span>
              </div>

              {/* PILA detalle o simple */}
              {p.pilaDetalle && p.pila > 0 ? (
                <div className="card pila-mes-blk" style={{ margin: 'var(--s3) 0', padding: 'var(--s4)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', background: 'var(--bg-subtle)' }}>
                  <div style={{ fontSize: 12, fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: 6 }}>PILA (seguridad social)</div>
                  <p className="i3-legal-hint" style={{ fontSize: 'var(--t-2xs)', lineHeight: 1.5, color: 'var(--txt-2)', marginBottom: 10 }}>
                    Salud 12,5% y pensión 16% se aplican sobre el <strong>IBC</strong>, no sobre el 100% de la factura. IBC del mes = 40% de ingresos (con ajustes legales).
                  </p>
                  {[
                    { l: 'IBC del mes (base)', v: fmt(p.pilaDetalle.ibc), c: null },
                    { l: 'Salud 12,5% del IBC', v: `−${fmt(p.pilaDetalle.salud)}`, c: 'var(--fin-reserve)' },
                    { l: 'Pensión 16% del IBC', v: `−${fmt(p.pilaDetalle.pension)}`, c: 'var(--fin-reserve)' },
                    { l: 'ARL riesgo I',         v: `−${fmt(p.pilaDetalle.arl)}`, c: 'var(--fin-reserve)' },
                    { l: 'Obligación del mes',   v: `−${fmt(p.pilaDetalle.obligacionMensual)}`, c: null, bold: true },
                    ...(p.pilaDetalle.yaReservadoMes > 0
                      ? [{ l: 'Ya reservado en el mes', v: `−${fmt(p.pilaDetalle.yaReservadoMes)}`, c: 'var(--txt-m)' }]
                      : []),
                  ].map(({ l, v, c, bold }) => (
                    <div key={l} className="tx-drow" style={{ border: 'none', padding: '3px 0' }}>
                      <span className="tx-drow-l" style={bold ? { fontWeight: 800 } : {}}>{l}</span>
                      <span className="tx-drow-v" style={{ ...(c ? { color: c } : {}), ...(bold ? { fontWeight: 800 } : {}) }}>{v}</span>
                    </div>
                  ))}
                  <div className="tx-drow" style={{ border: 'none', padding: '6px 0 0', marginTop: 4, borderTop: '1px solid var(--border)' }}>
                    <span className="tx-drow-l" style={{ fontWeight: 800 }}>Reservado en este pago</span>
                    <span className="tx-drow-v" style={{ color: 'var(--fin-reserve)', fontWeight: 800 }}>−{fmt(p.pila)}</span>
                  </div>
                </div>
              ) : p.pila > 0 ? (
                <div className="tx-drow">
                  <span className="tx-drow-l">PILA (total reservado)</span>
                  <span className="tx-drow-v" style={{ color: 'var(--fin-reserve)' }}>−{fmt(p.pila)}</span>
                </div>
              ) : null}

              <div className="tx-drow">
                <span className="tx-drow-l">Reserva declaración renta</span>
                <span className="tx-drow-v" style={{ color: 'var(--fin-reserve)' }}>−{fmt(p.reserva)}</span>
              </div>
              <div className="tx-drow" style={{ borderBottom: 'none', background: 'var(--volt-dim)', borderRadius: 'var(--r-md)', padding: '10px 12px', marginTop: 'var(--s2)' }}>
                <span className="tx-drow-l" style={{ fontWeight: 700, color: 'var(--volt-text)' }}>Disponible real</span>
                <span className="tx-drow-v" style={{ color: 'var(--volt-text)', fontWeight: 900, fontSize: 'var(--t-md)' }}>{fmt(p.disponible)}</span>
              </div>
            </>
          )}

          {/* Datos del pago */}
          <div className="card-divider" />
          <div style={{ fontSize: 'var(--t-sm)', fontWeight: 700, color: 'var(--txt)', marginBottom: 'var(--s4)', fontFamily: 'var(--font-display)' }}>
            Datos del pago
          </div>
          {(isPilaPayment
            ? [
                { icon: 'user', l: 'Concepto', v: p.client || 'Pago PILA' },
                { icon: 'cal',  l: 'Período',  v: p.periodLabel || 'Mes en curso' },
                { icon: 'cal',  l: 'Fecha',    v: paymentDateLabel },
                { icon: 'card', l: 'Método',   v: paymentMethodLabel },
              ]
            : [
                { icon: 'user', l: 'Cliente', v: p.client || '—' },
                { icon: 'cal',  l: 'Fecha',   v: paymentDateLabel },
                { icon: 'card', l: 'Método',  v: paymentMethodLabel },
              ]
          ).map((row, i, rows) => (
            <div key={i} className="tx-drow" style={i === rows.length - 1 ? { borderBottom: 'none' } : {}}>
              <span className="tx-drow-l" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {row.icon === 'user' && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--txt-m)" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                )}
                {row.icon === 'cal' && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--txt-m)" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                )}
                {row.icon === 'card' && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--txt-m)" strokeWidth="2">
                    <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                )}
                {row.l}
              </span>
              <span className="tx-drow-v">{row.v}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Footer compacto ── */}
      <div className="tx-detail-footer">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'var(--s3)', padding: 'var(--s2) 0' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('D2')}>
            ¿Cómo se calculó esto?
          </button>
          <span style={{ color: 'var(--border-m)', fontSize: 'var(--t-sm)' }}>·</span>
          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--fin-deduct)' }} onClick={() => setShowDelDialog(true)}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}
