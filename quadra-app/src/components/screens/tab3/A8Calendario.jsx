import { useEffect, useMemo, useState } from 'react'
import { useAppStore } from '../../../store/useAppStore'
import { formatCalendarEventMeta, formatMonthYearLabel, getPaymentDateLabel, toSafeDate } from '../../../lib/dateUtils'
import { IconArrowLeft, IconArrowRight, IconBell, IconCalendar, IconClock, IconShield, IconX } from '../../ui/Icons'

const WEEK_DAYS = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB']
const MONTHS_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const DEFAULT_FILTERS = ['income', 'pila', 'renta', 'vencimiento']
const EVENT_PRIORITY = ['renta', 'pila', 'vencimiento', 'income']

const EVENT_META = {
  income: {
    label: 'Pago',
    dotClassName: 'calendar-day-dot payment',
    cardClassName: 'calendar-sheet-event payment',
  },
  pila: {
    label: 'PILA',
    dotClassName: 'calendar-day-dot pila',
    cardClassName: 'calendar-sheet-event pila',
  },
  renta: {
    label: 'Renta',
    dotClassName: 'calendar-day-dot renta',
    cardClassName: 'calendar-sheet-event renta',
  },
  vencimiento: {
    label: 'Vencimiento',
    dotClassName: 'calendar-day-dot vencimiento',
    cardClassName: 'calendar-sheet-event vencimiento',
  },
}

const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1)
const addMonths = (date, offset) => new Date(date.getFullYear(), date.getMonth() + offset, 1)
const isSameMonth = (left, right) => left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth()
const isSameDay = (left, right) => left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth() && left.getDate() === right.getDate()

const getDayKey = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatMoney = (value) => {
  const amount = Math.round(Math.abs(value || 0))
  return `$${amount.toLocaleString('es-CO')}`
}

const formatCountLabel = (count, singular, plural) => `${count} ${count === 1 ? singular : plural}`

const formatFullDate = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return 'Sin fecha'
  return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}`
}

const buildFiscalEvents = (visibleMonth, profile, alerts) => {
  const year = visibleMonth.getFullYear()
  const month = visibleMonth.getMonth()
  const items = []

  if (profile?.pila !== 'no') {
    const pilaDate = new Date(year, month, 12)
    items.push({
      id: `pila-${year}-${month}`,
      dateKey: getDayKey(pilaDate),
      date: pilaDate,
      type: 'pila',
      title: 'Revisar y pagar PILA',
      description: alerts?.pila ? 'Tus alertas están activas para este aporte mensual.' : 'Se recomienda revisar salud y pensión en esta fecha.',
      source: 'system',
      amount: null,
    })
  }

  if (month === 7) {
    const rentaDate = new Date(year, 7, 12)
    items.push({
      id: `renta-${year}`,
      dateKey: getDayKey(rentaDate),
      date: rentaDate,
      type: 'renta',
      title: 'Separar reserva para renta',
      description: alerts?.renta ? 'Quadra puede recordarte esta preparación.' : 'Fecha sugerida para revisar tu fondo de declaración.',
      source: 'system',
      amount: null,
    })
  }

  if (alerts?.vencimientos) {
    const dueDate = new Date(year, month, 28)
    items.push({
      id: `vencimiento-${year}-${month}`,
      dateKey: getDayKey(dueDate),
      date: dueDate,
      type: 'vencimiento',
      title: 'Revisar vencimientos del mes',
      description: 'Confirma pagos, reservas y obligaciones cercanas antes del cierre.',
      source: 'system',
      amount: null,
    })
  }

  return items
}

const buildMonthCells = (visibleMonth) => {
  const firstDay = startOfMonth(visibleMonth)
  const firstWeekday = firstDay.getDay()
  const daysInMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate()
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7

  return Array.from({ length: totalCells }, (_, index) => {
    const dayNumber = index - firstWeekday + 1
    const date = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), dayNumber)
    return {
      key: getDayKey(date),
      date,
      dayNumber: date.getDate(),
      inCurrentMonth: date.getMonth() === visibleMonth.getMonth(),
    }
  })
}

const getPrimaryEvent = (events) => {
  if (!events?.length) return null
  return [...events].sort((left, right) => EVENT_PRIORITY.indexOf(left.type) - EVENT_PRIORITY.indexOf(right.type))[0]
}

export default function A8Calendario() {
  const { payments, profile, alerts } = useAppStore()
  const today = useMemo(() => new Date(), [])
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(today))
  const [selectedDateKey, setSelectedDateKey] = useState(() => getDayKey(today))
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState(DEFAULT_FILTERS)

  useEffect(() => {
    const selectedDate = toSafeDate(selectedDateKey)
    if (selectedDate && isSameMonth(selectedDate, visibleMonth)) return
    const frameId = requestAnimationFrame(() => setSelectedDateKey(getDayKey(visibleMonth)))
    return () => cancelAnimationFrame(frameId)
  }, [selectedDateKey, visibleMonth])

  useEffect(() => {
    if (!isSheetOpen) return undefined
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsSheetOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isSheetOpen])

  const paymentEvents = useMemo(() => {
    return payments
      .filter((payment) => payment.date)
      .map((payment) => {
        const date = toSafeDate(payment.date)
        if (!date) return null
        return {
          id: `payment-${payment.id}`,
          dateKey: getDayKey(date),
          date,
          type: payment.type === 'renta' ? 'renta' : payment.type === 'pila' ? 'pila' : 'income',
          title: payment.type === 'pila' ? payment.client || 'Pago de PILA' : payment.client || 'Pago registrado',
          description: payment.type === 'pila'
            ? `Movimiento por ${formatMoney(payment.pila || 0)}`
            : `${getPaymentDateLabel(payment)} · Disponible ${formatMoney(payment.disponible || 0)}`,
          source: 'payment',
          amount: payment.type === 'pila' ? payment.pila || 0 : payment.gross || 0,
        }
      })
      .filter(Boolean)
  }, [payments])

  const fiscalEvents = useMemo(() => buildFiscalEvents(visibleMonth, profile, alerts), [visibleMonth, profile, alerts])

  const monthEvents = useMemo(() => {
    return [...paymentEvents, ...fiscalEvents]
      .filter((event) => event.date.getFullYear() === visibleMonth.getFullYear() && event.date.getMonth() === visibleMonth.getMonth())
      .sort((a, b) => a.date - b.date)
  }, [paymentEvents, fiscalEvents, visibleMonth])

  const filteredMonthEvents = useMemo(() => {
    return monthEvents.filter((event) => activeFilters.includes(event.type))
  }, [monthEvents, activeFilters])

  const eventsByDay = useMemo(() => {
    return filteredMonthEvents.reduce((acc, event) => {
      if (!acc[event.dateKey]) acc[event.dateKey] = []
      acc[event.dateKey].push(event)
      return acc
    }, {})
  }, [filteredMonthEvents])

  const monthCells = useMemo(() => buildMonthCells(visibleMonth), [visibleMonth])
  const selectedDate = toSafeDate(selectedDateKey)
  const selectedDayEvents = eventsByDay[selectedDateKey] || []
  const nextEvent = filteredMonthEvents.find((event) => event.date >= today) || filteredMonthEvents[0] || null
  const monthStats = useMemo(() => {
    const counts = filteredMonthEvents.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1
      return acc
    }, {})
    return {
      total: filteredMonthEvents.length,
      totalAvailable: monthEvents.length,
      pagos: counts.income || 0,
      obligaciones: (counts.pila || 0) + (counts.renta || 0) + (counts.vencimiento || 0),
    }
  }, [filteredMonthEvents, monthEvents])
  const highlights = filteredMonthEvents.slice(0, 3)

  const handleSelectDay = (dayKey) => {
    setSelectedDateKey(dayKey)
    setIsSheetOpen(true)
  }

  const toggleFilter = (filterKey) => {
    setActiveFilters((current) => {
      if (current.includes(filterKey)) {
        if (current.length === 1) return current
        return current.filter((item) => item !== filterKey)
      }
      return [...current, filterKey]
    })
  }

  return (
    <div className="q-body-inner calendar-page">
      <div className="card calendar-shell">
        <div className="calendar-shell-head">
          <button className="calendar-nav-btn" onClick={() => { setVisibleMonth((current) => addMonths(current, -1)); setIsSheetOpen(false) }} aria-label="Mes anterior">
            <IconArrowLeft />
          </button>
          <div className="calendar-shell-title-wrap">
            <div className="calendar-shell-kicker">Calendario financiero</div>
            <div className="calendar-shell-title">{formatMonthYearLabel(visibleMonth)}</div>
          </div>
          <button className="calendar-nav-btn" onClick={() => { setVisibleMonth((current) => addMonths(current, 1)); setIsSheetOpen(false) }} aria-label="Mes siguiente">
            <IconArrowRight />
          </button>
        </div>

        <div className="calendar-meta-row">
          <button
            className="calendar-meta-pill calendar-meta-pill--today"
            onClick={() => {
              const currentMonth = startOfMonth(today)
              setVisibleMonth(currentMonth)
              setSelectedDateKey(getDayKey(today))
              setIsSheetOpen(false)
            }}
          >
            Hoy {today.getDate()}
          </button>
          {nextEvent && (
            <div className="calendar-meta-pill">
              Próximo: {nextEvent.title}
            </div>
          )}
        </div>

        <div className="calendar-grid-head">
          {WEEK_DAYS.map((day) => (
            <div key={day} className="calendar-grid-head-cell">{day}</div>
          ))}
        </div>

        <div className="calendar-grid">
          {monthCells.map((cell) => {
            const isToday = isSameDay(cell.date, today)
            const isSelected = cell.key === selectedDateKey
            const dayEvents = eventsByDay[cell.key] || []
            const primaryEvent = getPrimaryEvent(dayEvents)
            const secondaryEvents = dayEvents
              .filter((event) => event.id !== primaryEvent?.id)
              .sort((left, right) => EVENT_PRIORITY.indexOf(left.type) - EVENT_PRIORITY.indexOf(right.type))
            const extraCount = Math.max(0, secondaryEvents.length - 2)

            return (
              <div key={cell.key} className={`calendar-day-slot${cell.inCurrentMonth ? '' : ' muted'}`}>
                <button
                  className={`calendar-day${isToday ? ' today' : ''}${isSelected ? ' selected' : ''}${primaryEvent ? ` is-${primaryEvent.type}` : ''}`}
                  onClick={() => handleSelectDay(cell.key)}
                  aria-label={`${cell.dayNumber} ${formatMonthYearLabel(cell.date)}`}
                >
                  <span className="calendar-day-number">{cell.dayNumber}</span>
                </button>
                <span className="calendar-day-markers" aria-hidden="true">
                  {secondaryEvents.slice(0, 2).map((event) => (
                    <span key={event.id} className={EVENT_META[event.type]?.dotClassName || 'calendar-day-dot'} />
                  ))}
                  {extraCount > 0 && <span className="calendar-day-more">+{extraCount}</span>}
                </span>
              </div>
            )
          })}
        </div>

        <div className="calendar-legend">
          {Object.entries(EVENT_META).map(([key, meta]) => (
            <button
              key={key}
              type="button"
              className={`calendar-legend-chip${activeFilters.includes(key) ? ' is-active' : ' is-inactive'}`}
              onClick={() => toggleFilter(key)}
              aria-pressed={activeFilters.includes(key)}
            >
              <span className={meta.dotClassName} />
              {meta.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card calendar-summary-card">
        <div className="calendar-summary-head">
          <div>
            <div className="card-title">Vista rápida</div>
            <div className="card-sub">
              {monthStats.total > 0
                ? `${formatCountLabel(monthStats.total, 'evento visible', 'eventos visibles')} este mes`
                : monthStats.totalAvailable > 0
                  ? 'No hay eventos visibles con los filtros actuales'
                  : 'Aún no tienes eventos visibles este mes'}
            </div>
          </div>
          <span className="calendar-summary-badge">
            {formatCountLabel(monthStats.pagos, 'pago', 'pagos')}
          </span>
        </div>

        <div className="calendar-summary-stats">
          <div className="calendar-stat-card">
            <div className="calendar-stat-label">Pagos</div>
            <div className="calendar-stat-value">{monthStats.pagos}</div>
          </div>
          <div className="calendar-stat-card">
            <div className="calendar-stat-label">Obligaciones</div>
            <div className="calendar-stat-value">{monthStats.obligaciones}</div>
          </div>
        </div>

        <div className="calendar-upcoming-list">
          {highlights.map((event) => (
            <button
              key={event.id}
              className="calendar-upcoming-row"
              onClick={() => {
                setSelectedDateKey(event.dateKey)
                setIsSheetOpen(true)
              }}
            >
              <div className="calendar-upcoming-copy">
                <div className="calendar-upcoming-date">{formatCalendarEventMeta(event.date)}</div>
                <div className="calendar-upcoming-title">{event.title}</div>
              </div>
              <span className="calendar-upcoming-pill">{event.source === 'payment' ? 'Real' : 'Quadra'}</span>
            </button>
          ))}
          {highlights.length === 0 && (
            <div className="calendar-empty-copy">Cuando registres pagos o actives alertas, los hitos del mes aparecerán aquí.</div>
          )}
        </div>
      </div>

      {isSheetOpen && (
        <>
          <button className="calendar-sheet-backdrop" aria-label="Cerrar detalle del día" onClick={() => setIsSheetOpen(false)} />
          <div className="calendar-day-sheet" role="dialog" aria-modal="true" aria-label="Detalle del día">
            <div className="calendar-day-sheet-handle" />
            <div className="calendar-day-sheet-head">
              <div>
                <div className="calendar-day-sheet-kicker">
                  <IconClock />
                  {selectedDate ? formatCalendarEventMeta(selectedDate) : 'Sin fecha'}
                </div>
                <div className="calendar-day-sheet-title">
                  {selectedDate ? formatFullDate(selectedDate) : 'Detalle del día'}
                </div>
              </div>
              <button className="calendar-sheet-close" onClick={() => setIsSheetOpen(false)} aria-label="Cerrar detalle">
                <IconX />
              </button>
            </div>

            {selectedDayEvents.length === 0 ? (
              <div className="calendar-empty-state">
                <div className="calendar-empty-icon">
                  <IconBell />
                </div>
                <div>
                  <div className="calendar-empty-title">Día despejado</div>
                  <div className="calendar-empty-copy">No hay pagos ni recordatorios para esta fecha. Puedes usarla como espacio libre de obligaciones.</div>
                </div>
              </div>
            ) : (
              <div className="calendar-sheet-event-list">
                {selectedDayEvents.map((event) => (
                  <div key={event.id} className={EVENT_META[event.type]?.cardClassName || 'calendar-sheet-event'}>
                    <div className="calendar-sheet-event-icon">
                      {event.source === 'payment' ? <IconCalendar /> : <IconShield />}
                    </div>
                    <div className="calendar-sheet-event-copy">
                      <div className="calendar-sheet-event-topline">
                        <span className="calendar-sheet-event-title">{event.title}</span>
                        <span className="calendar-sheet-event-type">{EVENT_META[event.type]?.label || 'Evento'}</span>
                      </div>
                      <div className="calendar-sheet-event-description">{event.description}</div>
                      {event.amount != null && (
                        <div className="calendar-sheet-event-amount">{formatMoney(event.amount)}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
