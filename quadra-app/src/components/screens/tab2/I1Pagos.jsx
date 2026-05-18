import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '../../../store/useAppStore'
import { getPaymentDateLabel, toSafeDate } from '../../../lib/dateUtils'

const MONTH_LABELS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
const SWIPE_ACTION_WIDTH = 168
const SWIPE_THRESHOLD = 56

const fmt = (n) => '$' + Math.round(n).toLocaleString('es-CO')
const fmtCompact = (n) => '$' + new Intl.NumberFormat('es-CO', {
  notation: 'compact',
  maximumFractionDigits: 1,
}).format(Math.abs(n || 0))

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

function SwipeRow({ payment, isOpen, onOpen, onClose, onDetail, onDelete, showDate, showSwipeHint }) {
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
  const metaLabel = isIncome ? `Disponible ${fmtCompact(payment.disponible || 0)}` : 'Usa tu saldo disponible'
  const rowTypeClass = payment.type === 'pila'
    ? 'income-row--pila'
    : payment.type === 'renta'
    ? 'income-row--renta'
    : 'income-row--income'

  const sub = showDate
    ? `${payment.method}${payment.currency !== 'COP' && payment.currency ? ` · ${payment.currency}` : ''} · ${getPaymentDateLabel(payment)}`
    : `${payment.method}${payment.currency !== 'COP' && payment.originalAmount ? ` · ${payment.currency} ${payment.originalAmount.toLocaleString('es-CO')}` : ''}`

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

  const cancelDrag = () => {
    startXRef.current = null
    dragStartedRef.current = false
    setDragging(false)
    setOffset(isOpen ? -SWIPE_ACTION_WIDTH : 0)
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
        className={`tx-row compact-row movement-row income-row ${rowTypeClass}${showSwipeHint ? ' tx-row--swipe-hint' : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(e) => endDrag(e.clientX)}
        onPointerCancel={cancelDrag}
        onPointerLeave={(e) => {
          if (startXRef.current !== null) endDrag(e.clientX)
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onDetail()
          }
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

        <div className="tx-info compact-row-info movement-row-info">
          <div className="tx-name compact-row-name movement-row-name income-row-name">{payment.client}</div>
          <div className="tx-sub compact-row-sub movement-row-sub income-row-sub">{sub}</div>
        </div>

        <div className="compact-row-amount movement-row-amount income-row-amount">
          <div className="compact-row-amount-main movement-row-amount-main income-row-amount-main" style={{ color: amountTone }}>
            {isIncome ? '+' : '-'}{fmt(amountMain)}
          </div>
          <div className="compact-row-amount-meta movement-row-amount-meta income-row-amount-meta">{metaLabel}</div>
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
  const {
    payments, navigate, setSelectedPayment, removePayment, showToast,
    bannerI1Dismissed, setBannerI1Dismissed,
  } = useAppStore()

  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('mes')
  const [groupBy, setGroupBy] = useState('fecha')
  const [typeFilter, setTypeFilter] = useState('todos')
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [openRowId, setOpenRowId] = useState(null)
  const [footerExpanded, setFooterExpanded] = useState(false)
  const [swipeHintShown, setSwipeHintShown] = useState(() => !!localStorage.getItem('q_swipeHint'))
  const pageRef = useRef(null)

  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  useEffect(() => {
    setLoading(false)
  }, [])

  const scrollToTop = () => {
    const el = pageRef.current
    if (!el) return
    let target = el
    while (target) {
      if (target.scrollHeight > target.clientHeight && target.scrollTop > 0) {
        target.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      target = target.parentElement
    }
  }

  if (payments.length === 0) return <I1Vacio />

  const filtered = payments.filter((payment) => {
    if (!payment.date) return period === 'todo'
    const date = toSafeDate(payment.date)
    if (!date) return period === 'todo'
    if (period === 'mes') return date.getFullYear() === currentYear && date.getMonth() === currentMonth
    if (period === 'anio') return date.getFullYear() === currentYear
    return true
  })

  const incomePayments = filtered.filter((p) => p.type !== 'pila' && p.type !== 'renta')
  const filteredDisponible = filtered.reduce((sum, p) => sum + (p.disponible || 0), 0)
  const filteredBruto = incomePayments.reduce((sum, p) => sum + (p.gross || 0), 0)
  const filteredCount = filtered.length

  // Stacked bar data (based on period income payments)
  const totalRetencion = incomePayments.reduce((s, p) => s + (p.retencion || 0), 0)
  const totalPila      = incomePayments.reduce((s, p) => s + (p.pila      || 0), 0)
  const totalReserva   = incomePayments.reduce((s, p) => s + (p.reserva   || 0), 0)
  const totalDisp      = incomePayments.reduce((s, p) => s + (p.disponible|| 0), 0)
  const pctDisp = filteredBruto > 0 ? (totalDisp      / filteredBruto) * 100 : 0
  const pctRet  = filteredBruto > 0 ? (totalRetencion / filteredBruto) * 100 : 0
  const pctPila = filteredBruto > 0 ? (totalPila      / filteredBruto) * 100 : 0
  const pctRes  = filteredBruto > 0 ? (totalReserva   / filteredBruto) * 100 : 0

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

  const periodTrendLabel =
    period === 'mes' ? 'este mes' :
    period === 'anio' ? 'este año' :
    'visibles'

  // Type filter
  const byType = typeFilter === 'ingresos'
    ? filtered.filter(p => p.type !== 'pila' && p.type !== 'renta')
    : typeFilter === 'pila'
    ? filtered.filter(p => p.type === 'pila')
    : filtered

  // Search filter
  const searchLower = search.toLowerCase()
  const bySearch = search
    ? byType.filter(p =>
        (p.client || '').toLowerCase().includes(searchLower) ||
        (p.method || '').toLowerCase().includes(searchLower) ||
        (getPaymentDateLabel(p) || '').toLowerCase().includes(searchLower)
      )
    : byType

  // Grouping — disable when search active
  const effectiveGroupBy = search ? 'fecha' : groupBy
  const rawGrouped = bySearch.reduce((acc, payment) => {
    const key = effectiveGroupBy === 'cliente'
      ? (payment.type === 'pila' ? 'Pagos PILA' : (payment.client || 'Sin cliente'))
      : getPaymentDateLabel(payment)
    if (!acc[key]) acc[key] = []
    acc[key].push(payment)
    return acc
  }, {})

  const groupEntries = effectiveGroupBy === 'cliente'
    ? Object.entries(rawGrouped).sort(([a], [b]) => a.localeCompare(b, 'es'))
    : Object.entries(rawGrouped)

  const handleConfirmDelete = () => {
    if (!deleteId) return
    removePayment(deleteId)
    setDeleteId(null)
    setOpenRowId(null)
    showToast({ type: 'success', message: 'Pago eliminado' })
  }

  const changePeriod = (v) => {
    setPeriod(v)
    setOpenRowId(null)
    setSearch('')
    scrollToTop()
  }

  const changeTypeFilter = (v) => {
    setTypeFilter(v)
    setOpenRowId(null)
    scrollToTop()
  }

  return (
    <div className="q-body-inner income-page" ref={pageRef} style={{ position: 'relative' }}>

      {/* Banner orientación — dismissible */}
      {!bannerI1Dismissed && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 'var(--s3)', padding: 'var(--s3) var(--s4)',
          background: 'var(--volt-dim)', border: '1px solid var(--volt-border)',
          borderRadius: 'var(--r-lg)', marginBottom: 'var(--s4)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s2)', flex: 1, minWidth: 0 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--volt-text)" strokeWidth="2.2" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span style={{ fontSize: 'var(--t-xs)', color: 'var(--volt-text)', fontFamily: 'var(--font-body)', lineHeight: 1.4 }}>
              Tu dinero disponible real está en <strong>Mi Dinero</strong>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s2)', flexShrink: 0 }}>
            <button
              onClick={() => navigate('D1')}
              style={{ fontSize: 'var(--t-xs)', fontWeight: 700, color: 'var(--volt-text)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-display)', whiteSpace: 'nowrap' }}
            >
              Ver →
            </button>
            <button
              onClick={() => setBannerI1Dismissed(true)}
              aria-label="Cerrar aviso"
              style={{ fontSize: 'var(--t-sm)', color: 'var(--txt-m)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', lineHeight: 1 }}
            >
              ×
            </button>
          </div>
        </div>
      )}

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
                <div className="income-summary-sub">{periodLabel} · Ingreso bruto registrado</div>
              </div>

              <div className="income-summary-side">
                <span className="trend-badge trend-up">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 15l-6-6-6 6" />
                  </svg>
                  +{fmtCompact(filteredBruto)}
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

            {/* Stacked bar — distribución del ingreso en el período */}
            {incomePayments.length > 0 && filteredBruto > 0 && (
              <div className="income-breakdown-section">
                <div className="i1-breakdown-bar">
                  <div className="i1-breakdown-seg" style={{ width: `${pctDisp}%`, background: 'var(--fin-income)' }} />
                  <div className="i1-breakdown-seg" style={{ width: `${pctRet}%`,  background: 'var(--fin-deduct)' }} />
                  <div className="i1-breakdown-seg" style={{ width: `${pctPila}%`, background: 'var(--fin-reserve)' }} />
                  <div className="i1-breakdown-seg" style={{ width: `${pctRes}%`,  background: 'var(--volt-border)' }} />
                </div>
                <div className="i1-breakdown-legend">
                  <div className="i1-breakdown-item">
                    <div className="i1-breakdown-dot" style={{ background: 'var(--fin-income)' }} />
                    Disponible {fmtCompact(totalDisp)}
                  </div>
                  {totalRetencion > 0 && (
                    <div className="i1-breakdown-item">
                      <div className="i1-breakdown-dot" style={{ background: 'var(--fin-deduct)' }} />
                      Retención {fmtCompact(totalRetencion)}
                    </div>
                  )}
                  {totalPila > 0 && (
                    <div className="i1-breakdown-item">
                      <div className="i1-breakdown-dot" style={{ background: 'var(--fin-reserve)' }} />
                      PILA {fmtCompact(totalPila)}
                    </div>
                  )}
                  {totalReserva > 0 && (
                    <div className="i1-breakdown-item">
                      <div className="i1-breakdown-dot" style={{ background: 'var(--volt-border)' }} />
                      Reserva {fmtCompact(totalReserva)}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="income-summary-filter">
              {/* Search input */}
              {showSearch && (
                <div className="i1-search-wrap">
                  <svg className="i1-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="11" cy="11" r="7.5" />
                    <path d="M20 20l-3.5-3.5" />
                  </svg>
                  <input
                    className="q-input"
                    style={{ paddingLeft: 34 }}
                    placeholder="Buscar cliente, método..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    autoFocus
                  />
                  {search && (
                    <button className="i1-search-clear" onClick={() => setSearch('')} aria-label="Limpiar búsqueda">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  )}
                </div>
              )}

              {/* Period filter + search toggle */}
              <div className="income-filter-period">
                <div className="seg-ctrl">
                  <button className={`seg-btn${period === 'mes'  ? ' active' : ''}`} onClick={() => changePeriod('mes')}>Este mes</button>
                  <button className={`seg-btn${period === 'anio' ? ' active' : ''}`} onClick={() => changePeriod('anio')}>Este año</button>
                  <button className={`seg-btn${period === 'todo' ? ' active' : ''}`} onClick={() => changePeriod('todo')}>Todo</button>
                </div>
                <button
                  onClick={() => { setShowSearch(v => !v); if (showSearch) setSearch('') }}
                  aria-label="Buscar"
                  style={{
                    width: 36, height: 36, borderRadius: 'var(--r-full)',
                    background: showSearch ? 'var(--volt-dim)' : 'var(--surf-2)',
                    border: `1px solid ${showSearch ? 'var(--volt-border)' : 'var(--border)'}`,
                    color: showSearch ? 'var(--volt-text)' : 'var(--txt-m)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="11" cy="11" r="7.5" />
                    <path d="M20 20l-3.5-3.5" />
                  </svg>
                </button>
              </div>

              {/* Group + type filters — hidden when search active */}
              <div className="income-filter-secondary" aria-hidden={!!search}>
                <div className="seg-ctrl">
                  <button className={`seg-btn${groupBy === 'fecha'   ? ' active' : ''}`} onClick={() => { setGroupBy('fecha');   setOpenRowId(null) }}>Por fecha</button>
                  <button className={`seg-btn${groupBy === 'cliente' ? ' active' : ''}`} onClick={() => { setGroupBy('cliente'); setOpenRowId(null) }}>Por cliente</button>
                </div>
                <div className="seg-ctrl">
                  <button className={`seg-btn${typeFilter === 'todos'    ? ' active' : ''}`} onClick={() => changeTypeFilter('todos')}>Todos</button>
                  <button className={`seg-btn${typeFilter === 'ingresos' ? ' active' : ''}`} onClick={() => changeTypeFilter('ingresos')}>Ingresos</button>
                  <button className={`seg-btn${typeFilter === 'pila'     ? ' active' : ''}`} onClick={() => changeTypeFilter('pila')}>PILA</button>
                </div>
              </div>
            </div>

            {bySearch.length > 0 && (
              <div className="income-summary-helper">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 5l-6 7 6 7" />
                </svg>
                Desliza un movimiento para ver opciones rápidas
              </div>
            )}
          </div>

          {bySearch.length === 0 ? (
            search ? (
              <div className="q-empty">
                <div className="q-empty-visual">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--txt-f)" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                  </svg>
                </div>
                <h2 className="q-empty-headline">Sin resultados</h2>
                <p className="q-empty-desc">No hay pagos que coincidan con "{search}".</p>
                <button className="btn btn-ghost" onClick={() => setSearch('')} style={{ marginTop: 'var(--s3)' }}>
                  Limpiar búsqueda
                </button>
              </div>
            ) : (
              <I1VacioFiltro period={period} onReset={() => changePeriod('todo')} />
            )
          ) : (
            <div className="tx-list income-list">
              <div className="income-list-summary">
                <div className="income-list-summary-label">{periodLabel}</div>
                <div className="income-list-summary-value">{fmt(filteredBruto)}</div>
                <div className="income-list-summary-meta">
                  {bySearch.length} {bySearch.length === 1 ? 'movimiento visible' : 'movimientos visibles'}
                </div>
              </div>

              {groupEntries.map(([label, rows], gIdx) => (
                <div key={label}>
                  <div className="tx-section-header">{label}</div>
                  {rows.map((payment, rIdx) => {
                    const isFirst = gIdx === 0 && rIdx === 0
                    const showHint = isFirst && !swipeHintShown
                    return (
                    <SwipeRow
                      key={payment.id}
                      payment={payment}
                      isOpen={openRowId === payment.id}
                      onOpen={() => {
                        if (isFirst && !swipeHintShown) {
                          localStorage.setItem('q_swipeHint', '1')
                          setSwipeHintShown(true)
                        }
                        setOpenRowId(payment.id)
                      }}
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
                      showDate={effectiveGroupBy === 'cliente'}
                      showSwipeHint={showHint}
                    />
                    )
                  })}
                  {effectiveGroupBy === 'cliente' && (() => {
                    const groupIncome = rows.filter(p => p.type !== 'pila')
                    const groupBruto  = groupIncome.reduce((s, p) => s + (p.gross      || 0), 0)
                    const groupDisp   = groupIncome.reduce((s, p) => s + (p.disponible || 0), 0)
                    return groupBruto > 0 ? (
                      <div className="i1-client-subtotal">
                        <span>{groupIncome.length} pago{groupIncome.length !== 1 ? 's' : ''}</span>
                        <span>Bruto {fmtCompact(groupBruto)} · Disponible {fmtCompact(groupDisp)}</span>
                      </div>
                    ) : null
                  })()}
                </div>
              ))}

              <div
                className="tx-total-row"
                role="button"
                onClick={() => setFooterExpanded(e => !e)}
                style={{ cursor: 'pointer' }}
              >
                <div className="tx-total-l" style={{ display: 'flex', alignItems: 'center', gap: 'var(--s2)' }}>
                  {footerLabel}
                  <svg
                    width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    style={{ transform: footerExpanded ? 'rotate(180deg)' : 'none', transition: '200ms', flexShrink: 0 }}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
                <div className="tx-total-v">{fmt(filteredDisponible)}</div>
              </div>

              {footerExpanded && (
                <div className="i1-footer-breakdown">
                  <div className="i1-footer-row">
                    <span>Ingreso bruto</span>
                    <span style={{ color: 'var(--fin-income)' }}>{fmt(filteredBruto)}</span>
                  </div>
                  {totalRetencion > 0 && (
                    <div className="i1-footer-row">
                      <span>Retenciones</span>
                      <span style={{ color: 'var(--fin-deduct)' }}>−{fmt(totalRetencion)}</span>
                    </div>
                  )}
                  {totalPila > 0 && (
                    <div className="i1-footer-row">
                      <span>PILA reservada</span>
                      <span style={{ color: 'var(--fin-reserve)' }}>−{fmt(totalPila)}</span>
                    </div>
                  )}
                  {totalReserva > 0 && (
                    <div className="i1-footer-row">
                      <span>Reserva renta</span>
                      <span style={{ color: 'var(--fin-reserve)' }}>−{fmt(totalReserva)}</span>
                    </div>
                  )}
                </div>
              )}
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
      <div className="q-empty-illus" aria-hidden="true">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <rect width="80" height="80" rx="20" fill="var(--volt-dim)" />
          <rect x="20" y="22" width="40" height="5" rx="2.5" fill="var(--volt-border)" />
          <rect x="20" y="33" width="30" height="4" rx="2" fill="var(--border)" />
          <rect x="20" y="43" width="25" height="4" rx="2" fill="var(--border)" />
          <circle cx="56" cy="52" r="12" fill="var(--volt)" />
          <path d="M52 52l3 3 5-5" stroke="var(--volt-on)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 className="q-empty-headline">Tu primer pago está cerca</h2>
      <p className="q-empty-desc">Cuando registres un pago, Quadra calcula automáticamente tu disponible, retención y PILA.</p>
      <button className="q-empty-cta" onClick={() => navigate('I2')}>+ Registrar primer pago</button>
      <button className="btn btn-ghost" onClick={() => navigate('D2')} style={{ marginTop: 'var(--s3)' }}>¿Cómo funciona?</button>
    </div>
  )
}
