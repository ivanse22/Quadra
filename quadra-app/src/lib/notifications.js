const DIAN_DATES = [
  { date: '2026-03-21', title: 'Vencimiento declaración de renta' },
  { date: '2026-08-10', title: 'Renta — grandes contribuyentes' },
  { date: '2026-10-15', title: 'Declaración de renta personas naturales' },
]

export function computeNotifications(payments, kpis, profile, alerts) {
  const notifs = []
  const now = new Date()
  const today = now.toISOString().slice(0, 10)

  // PILA overdue (> 25 days without PILA registration)
  if (alerts.pila && payments.length > 0) {
    const pilaList = payments
      .filter(p => p.type === 'pila' && p.date)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
    const neverRegistered = pilaList.length === 0
    const daysSincePila = pilaList[0]
      ? Math.floor((now - new Date(pilaList[0].date)) / 86400000)
      : 999
    if (daysSincePila > 25) {
      notifs.push({
        id: 'pila-overdue',
        type: 'pila',
        icon: 'shield',
        title: 'PILA pendiente',
        msg: neverRegistered
          ? 'Aún no has registrado ningún pago de seguridad social este año.'
          : `Llevas ${daysSincePila} días sin registrar salud y pensión.`,
        action: 'D3',
        actionLabel: 'Pagar PILA →',
        read: false,
        ts: now.toISOString(),
      })
    }
  }

  // Low reserve (< 40% after May)
  if (alerts.renta && now.getMonth() >= 4) {
    const ytd = kpis?.ytd || 0
    const proyectadoAnual = Math.max(ytd * 3, 40000000)
    const metaRenta = proyectadoAnual * 0.155
    const reserva = kpis?.reservadoRenta || 0
    const pct = metaRenta > 0 ? Math.round((reserva / metaRenta) * 100) : 100
    if (pct < 40) {
      notifs.push({
        id: 'renta-baja',
        type: 'renta',
        icon: 'chart',
        title: 'Reserva para renta baja',
        msg: `Tu reserva está al ${pct}% de la meta. En agosto se declara renta.`,
        action: 'D4',
        actionLabel: 'Ver reserva →',
        read: false,
        ts: now.toISOString(),
      })
    }
  }

  // Weekly summary (Fridays)
  if (alerts.resumenSemanal && now.getDay() === 5) {
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - 5)
    const weekPayments = payments.filter(
      p => p.type !== 'pila' && p.date && new Date(p.date) >= weekStart
    )
    if (weekPayments.length > 0) {
      const weekGross = weekPayments.reduce((s, p) => s + (p.gross || 0), 0)
      notifs.push({
        id: `resumen-${today}`,
        type: 'resumen',
        icon: 'calendar',
        title: 'Resumen de la semana',
        msg: `Esta semana ingresaste $${weekGross.toLocaleString('es-CO')} en ${weekPayments.length} pago${weekPayments.length !== 1 ? 's' : ''}.`,
        action: 'I1',
        actionLabel: 'Ver movimientos →',
        read: false,
        ts: now.toISOString(),
      })
    }
  }

  // DIAN vencimientos
  if (alerts.vencimientos) {
    DIAN_DATES.forEach(({ date, title }) => {
      const d = new Date(date)
      const daysUntil = Math.floor((d - now) / 86400000)
      if (daysUntil >= 0 && daysUntil <= 15) {
        notifs.push({
          id: `venc-${date}`,
          type: 'venc',
          icon: 'file',
          title,
          msg: `Faltan ${daysUntil} días para esta fecha límite de la DIAN.`,
          action: 'A8',
          actionLabel: 'Ver calendario →',
          read: false,
          ts: now.toISOString(),
        })
      }
    })
  }

  return notifs
}
