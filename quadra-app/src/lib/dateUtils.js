const DAYS = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']
const MONTHS_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const MONTHS_LONG = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

export const toDateInputValue = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const parseDateValue = (value) => {
  if (!value || typeof value !== 'string') return null
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

export const toSafeDate = (value) => {
  if (!value || typeof value !== 'string') return null
  const date = new Date(`${value}T12:00:00`)
  return Number.isNaN(date.getTime()) ? null : date
}

export const formatDateLabel = (value) => {
  const date = parseDateValue(value)
  if (!date) return 'Sin fecha'
  return `${DAYS[date.getDay()]} ${date.getDate()} ${MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}`
}

export const formatDateButtonLabel = (value) => {
  const todayValue = toDateInputValue(new Date())
  const baseLabel = formatDateLabel(value)
  if (baseLabel === 'Sin fecha') return baseLabel
  return value === todayValue ? `Hoy — ${baseLabel}` : baseLabel
}

export const formatMonthYearLabel = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return ''
  return `${MONTHS_LONG[date.getMonth()]} ${date.getFullYear()}`
}

export const formatShortMonthDay = (value) => {
  const date = typeof value === 'string' ? toSafeDate(value) : value
  if (!(date instanceof Date) || Number.isNaN(date?.getTime?.())) return 'Sin fecha'
  return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}`
}

export const formatCalendarEventMeta = (value) => {
  const date = typeof value === 'string' ? toSafeDate(value) : value
  if (!(date instanceof Date) || Number.isNaN(date?.getTime?.())) return 'Sin fecha'
  return `${DAYS[date.getDay()]} ${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}`
}

export const getPaymentDateLabel = (payment) => {
  if (!payment) return 'Sin fecha'
  if (payment.dateLabel) return payment.dateLabel
  if (payment.date) return formatDateLabel(payment.date)
  return 'Sin fecha'
}

export const normalizePaymentDates = (payment) => {
  if (!payment) return payment
  return {
    ...payment,
    dateLabel: payment.dateLabel || (payment.date ? formatDateLabel(payment.date) : null),
  }
}
