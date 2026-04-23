import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '../../../store/useAppStore'

const MONTH_LABELS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
const SWIPE_ACTION_WIDTH = 168
const SWIPE_THRESHOLD = 56

const fmt = (n) => '$' + Math.round(n).toLocaleString('es-CO')

function SkeletonList() {
  return (
    <div className="q-body-inner" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-section)' }}>
      <div className="card" style={{ padding: 'var(--space-card)' }}>
        <span className="skel" style={{ width: 110, height: 10, display: 'block', marginBottom: 'var(--s3)' }} />
        <span className="skel" style={{ width: '56%', height: 48, display: 'block', borderRadius: 'var(--r-sm)', marginBottom: 'var(--s2)' }} />
        <span className="skel" style={{ width: '46%', height: 10, display: 'block', marginBottom: 'var(--s5)' }} />
        <div style={{ display: 'flex', gap: 'var(--s2)', marginBottom: 'var(--s4)' }}>
          <span className="skel" style={{ flex: 1, height: 60, display: 'block', borderRadius: 'var(--r-lg)' }} />
          <span className="skel" style={{ flex: 1, height: 60, display: 'block', borderRadius: 'var(--r-lg)' }} />
        </div>
        <span className="skel" style={{ width: '100%', height: 42, display: 'block', borderRadius: 'var(--r-full)' }} />
      </div>

      <div className="tx-list income-list">
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px var(--screen-px)', borderBottom: i === 3 ? 'none' : '1px solid var(--border)' }}>
            <span className="skel" style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0, display: 'block' }} />
            <div style={{ flex: 1 }}>
              <span className="skel" style={{ width: '60%', height: 11, display: 'block', marginBottom: 6 }} />
              <span className="skel" style={{ width: '36%', height: 9, display: 'block' }} />
            </div>
            <div style={{ width: 92 }}>
              <span className="skel" style={{ width: '100%', height: 11, display: 'block', marginBottom: 5 }} />
              <span className="skel" style={{ width: '72%', height: 8, display: 'block', marginLeft: 'auto' }} />
            </div>
          </div>
        ))}
        <div className="tx-total-row">
          <span className="skel" style={{ width: 150, height: 12, display: 'block' }} />
          <span className="skel" style={{ width: 90, height: 14, display: 'block' }} />
        </div>
      </div>
    </div>
  )
}

function SwipeRow({ payment, isOpen, onOpen, onClose, onDetail, onDelete }) {
  const startXRef = useRef(null)
  const dragStartedRef = useRef(false)
  const [dragging, setDragging] = useState(false)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    setOffset(isOpen ? -SWIPE_ACTION_WIDTH : 0)
    setDragging(false)
  }, [isOpen])

  const isIncome = payment.type !== 'pila'
  const amountMain = isIncome ? payment.gross || 0 : payment.pila || 0
  const amountTone = payment.disponible < 0 || !isIncome ? 'var(--fin-reserve)' : 'var(--fin-income)'
  const metaLabel = isIncome ? `Disponible ${fmt(payment.disponible || 0)}` : 'Afecta tu disponible real'

  const onPointerDown = (e) => {
    startXRef.current = e.clientX
    dragStartedRef.current = false
    setDragging(true)
  }

  const onPointerMove = (e) => {
    if (startXRef.current === null) return
    const delta = e.clientX - startXRef.current
    if (Math.abs(delta) > 6) dragStartedRef.current = true
    const base = isOpen ? -SWIPE_ACTION_WIDTH : 0
    const next = Math.max(-SWIPE_ACTION_WIDTH, Math.min(0, base + delta))
    setOffset(next)
  }

  const endDrag = (clientX) => {
    if (startXRef.current === null) return
    const delta = clientX - startXRef.current
    startXRef.current = null
    setDragging(false)

    if (!dragStartedRef.current) {
      if (isOpen) onClose()
      else onDetail()
      return
    }

    if (delta < -SWIPE_THRESHOLD || offset < -(SWIPE_ACTION_WIDTH / 2)) onOpen()
    else onClose()
  }

  return (
    <div className="income-swipe-wrap">
      <div className="income-swipe-actions" aria-hidden={!isOpen} style={{ width: SWIPE_ACTION_WIDTH }}>
        <button className="income-swipe-btn income-swipe-detail" onClick={onDetail} aria-label="Ver detalle del pago">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="11" cy="11" r="7.5" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          Ver detalle
        </button>
        <button className="income-swipe-btn income-swipe-delete" onClick={onDelete} aria-label="Eliminar pago">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
          </svg>
          Eliminar
        </button>
      </div>

      <div
        className="tx-row income-row"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(e) => endDrag(e.clientX)}
        onPointerCancel={() => endDrag(startXRef.current ?? 0)}
        onPointerLeave={(e) => {
          if (startXRef.current !== null) endDrag(e.clientX)
        }}
        style={{
          transform: `translateX(${offset}px)`,
          transition: dragging ? 'none' : 'transform var(--motion-shift) var(--ease-spring-gentle)',
          userSelect: 'none',
          touchAction: 'pan-y',
        }}
      >
        <div className="tx-icon income-row-icon">
          {payment.type === 'pila' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--fin-reserve)" strokeWidth="2.4">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--fin-income)" strokeWidth="2.4">
              <path d="M18 15l-6-6-6 6" />
            </svg>
          )}
        </div>

        <div className="tx-info">
          <div className="tx-name income-row-name">{payment.client}</div>
          <div className="tx-sub income-row-sub">
            {payment.method}
            {payment.currency !== 'COP' && payment.currency ? ` · ${payment.currency} ${payment.originalAmount?.toLocaleString('es-CO')}` : ''}
          </div>
        </div>

        <div className="income-row-amount">
          <div className="income-row-amount-main" style={{ color: amountTone }}>
            {isIncome ? '+' : '-'}{fmt(amountMain)}
          </div>
          <div className="income-row-amount-meta">{metaLabel}</div>
        </div>
      </div>
    </div>
  )
}

function I1VacioFiltro({ period, onReset }) {
  const labels = { mes: 'este mes', anio: 'este año', todo: 'todo el histórico' }
  return (
    <div className="q-empty">
      <div className="q-empty-visual">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--txt-f)" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </div>
      <h2 className="q-empty-headline">Sin pagos {labels[period] || ''}</h2>
      <p className="q-empty-desc">No hay movimientos visibles en este período. Puedes cambiar el filtro o ver todo el histórico.</p>
      <button className="btn btn-ghost" onClick={onReset} style={{ marginTop: 'var(--s3)' }}>
        Ver todo el histórico
      </button>
    </div>
  )
}

export default function I1Pagos() {
  const { payments, kpis, navigate, setSelectedPayment, removePayment, showToast } = useAppStore()
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('mes')
  const [deleteId, setDeleteId] = useState(null)
  const [openRowId, setOpenRowId] = useState(null)

  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(t)
  }, [])

  if (payments.length === 0) return <I1Vacio />

  const filtered = payments.filter((payment) => {
    if (!payment.date) return period === 'todo'
    const date = new Date(payment.date + 'T12:00:00')
    if (period === 'mes') return date.getFullYear() === currentYear && date.getMonth() === currentMonth
    if (period === 'anio') return date.getFullYear() === currentYear
    return true
  })

  const incomePayments = filtered.filter((payment) => payment.type !== 'pila' && payment.type !== 'renta')
  const filteredDisponible = filtered.reduce((sum, payment) => sum + (payment.disponible || 0), 0)
  const filteredBruto = incomePayments.reduce((sum, payment) => sum + (payment.gross || 0), 0)
  const filteredCount = filtered.length
  const periodEyebrow =
    period === 'mes' ? 'Período actual' :
    period === 'anio' ? 'Año en curso' :
    'Histórico completo'

  const periodLabel =
    period === 'mes' ? `${MONTH_LABELS[currentMonth]} ${currentYear}` :
    period === 'anio' ? String(currentYear) :
    'Todo el histórico'

  const footerLabel =
    period === 'mes' ? 'Disponible real este mes' :
    period === 'anio' ? `Disponible real ${currentYear}` :
    'Disponible real total'

  const grouped = filtered.reduce((acc, payment) => {
    const key = payment.dateLabel || payment.date || 'Sin fecha'
    if (!acc[key]) acc[key] = []
    acc[key].push(payment)
    return acc
  }, {})

  const handleConfirmDelete = () => {
    if (!deleteId) return
    removePayment(deleteId)
    setDeleteId(null)
    setOpenRowId(null)
    showToast({ type: 'success', message: 'Pago eliminado' })
  }

  return (
    <div className="q-body-inner income-page" style={{ position: 'relative' }}>
      {deleteId && (
        <div className="dialog-overlay">
          <div className="dialog">
            <div className="dialog-body">
              <div className="dialog-icon-wrap" style={{ background: 'var(--fin-deduct-dim)', border: '1px solid var(--fin-deduct-border)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--fin-deduct)" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14H6L5 6" />
                </svg>
              </div>
              <div className="dialog-title">¿Eliminar este pago?</div>
              <div className="dialog-desc">Esta acción no se puede deshacer. El cálculo será revertido.</div>
            </div>
            <div className="dialog-actions">
              <button className="dbtn dbtn-destructive" onClick={handleConfirmDelete}>Sí, eliminar</button>
              <button className="dbtn dbtn-ghost" onClick={() => setDeleteId(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {loading ? <SkeletonList /> : (
        <>
          <div className="card income-summary-card">
            <div className="income-summary-top">
              <div>
                <div className="income-summary-eyebrow">{periodEyebrow}</div>
                <div className="income-summary-amount">{fmt(filteredBruto)}</div>
                <div className="income-summary-sub">{periodLabel} · Ingreso bruto visible</div>
              </div>

              <div className="income-summary-side">
                <span className="trend-badge trend-up">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 15l-6-6-6 6" />
                  </svg>
                  +{fmt(kpis?.ytd || 0)} YTD
                </span>
                <button className="btn btn-ghost btn-sm income-summary-link" onClick={() => navigate('I4')}>
                  Ver KPIs →
                </button>
              </div>
            </div>

            <div className="income-summary-stats">
              <div className="income-summary-stat">
                <div className="income-summary-stat-label">Movimientos</div>
                <div className="income-summary-stat-value">{filteredCount}</div>
              </div>
              <div className="income-summary-stat">
                <div className="income-summary-stat-label">Disponible real</div>
                <div className="income-summary-stat-value income-summary-stat-value--volt">{fmt(filteredDisponible)}</div>
              </div>
            </div>

            <div className="income-summary-filter">
              <div className="seg-ctrl">
                <button className={`seg-btn${period === 'mes' ? ' active' : ''}`} onClick={() => { setPeriod('mes'); setOpenRowId(null) }}>Este mes</button>
                <button className={`seg-btn${period === 'anio' ? ' active' : ''}`} onClick={() => { setPeriod('anio'); setOpenRowId(null) }}>Este año</button>
                <button className={`seg-btn${period === 'todo' ? ' active' : ''}`} onClick={() => { setPeriod('todo'); setOpenRowId(null) }}>Todo</button>
              </div>
            </div>

            {filtered.length > 0 && (
              <div className="income-summary-helper">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 5l-6 7 6 7" />
                </svg>
                Desliza un movimiento para ver opciones rápidas
              </div>
            )}
          </div>

          {filtered.length === 0 ? (
            <I1VacioFiltro period={period} onReset={() => setPeriod('todo')} />
          ) : (
            <div className="tx-list income-list">
              <div className="income-list-summary">
                <div className="income-list-summary-label">{periodLabel}</div>
                <div className="income-list-summary-value">{fmt(filteredBruto)}</div>
                <div className="income-list-summary-meta">
                  {filteredCount} {filteredCount === 1 ? 'movimiento visible' : 'movimientos visibles'}
                </div>
              </div>

              {Object.entries(grouped).map(([date, rows]) => (
                <div key={date}>
                  <div className="tx-section-header">{date}</div>
                  {rows.map((payment) => (
                    <SwipeRow
                      key={payment.id}
                      payment={payment}
                      isOpen={openRowId === payment.id}
                      onOpen={() => setOpenRowId(payment.id)}
                      onClose={() => setOpenRowId(null)}
                      onDetail={() => {
                        setOpenRowId(null)
                        setSelectedPayment(payment.id)
                        navigate('I3')
                      }}
                      onDelete={() => {
                        setOpenRowId(null)
                        setDeleteId(payment.id)
                      }}
                    />
                  ))}
                </div>
              ))}

              <div className="tx-total-row">
                <div className="tx-total-l">{footerLabel}</div>
                <div className="tx-total-v">{fmt(filteredDisponible)}</div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function I1Vacio() {
  const { navigate } = useAppStore()
  return (
    <div className="q-empty">
      <div className="q-empty-visual">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--txt-f)" strokeWidth="1.5">
          <line x1="12" y1="2" x2="12" y2="22" />
          <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
        </svg>
      </div>
      <h2 className="q-empty-headline">Aún no tienes pagos</h2>
      <p className="q-empty-desc">Registra tu primer pago y Quadra calcula automáticamente lo que es tuyo.</p>
      <button className="q-empty-cta" onClick={() => navigate('I2')}>+ Registrar primer pago</button>
      <button className="btn btn-ghost" onClick={() => navigate('D2')} style={{ marginTop: 'var(--s3)' }}>¿Cómo funciona?</button>
    </div>
  )
}
