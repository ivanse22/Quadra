import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'
import { formatDateLabel, normalizePaymentDates } from '../lib/dateUtils'

const TABS = ['D1', 'I1', 'A1', 'C1']
const MONTH_LABELS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

const formatDateKey = (date) => date.toISOString().split('T')[0]

const createMazePayment = ({ id, client, gross, retencion, pila, reserva, disponible, monthOffset = 0, day = 10 }) => {
  const now = new Date()
  const date = new Date(now.getFullYear(), now.getMonth() + monthOffset, day, 12)
  return normalizePaymentDates({
    id,
    client,
    method: 'Transferencia',
    currency: 'COP',
    gross,
    retencion,
    pila,
    reserva,
    disponible,
    date: formatDateKey(date),
    dateLabel: formatDateLabel(formatDateKey(date)),
    type: 'income',
  })
}

const createMazeScenarioPayments = () => [
  createMazePayment({
    id: 'maze-actual-brandlab',
    client: 'Brandlab',
    gross: 12000000,
    retencion: 1200000,
    pila: 1393056,
    reserva: 900000,
    disponible: 8506944,
    day: 6,
  }),
  createMazePayment({
    id: 'maze-prev-nova',
    client: 'Nova Studio',
    gross: 8000000,
    retencion: 800000,
    pila: 928704,
    reserva: 500000,
    disponible: 5771296,
    monthOffset: -1,
    day: 16,
  }),
  createMazePayment({
    id: 'maze-prev-orbita',
    client: 'Órbita Consultores',
    gross: 6500000,
    retencion: 650000,
    pila: 754572,
    reserva: 420000,
    disponible: 4675428,
    monthOffset: -2,
    day: 22,
  }),
]

const safeLocalStorage = {
  getItem: (name) => {
    try {
      return window.localStorage.getItem(name)
    } catch {
      return null
    }
  },
  setItem: (name, value) => {
    try {
      window.localStorage.setItem(name, value)
    } catch {
      // Safari private mode and some in-app browsers can reject storage writes.
    }
  },
  removeItem: (name) => {
    try {
      window.localStorage.removeItem(name)
    } catch {
      // Ignore storage cleanup failures in restricted browser contexts.
    }
  },
}

// ── Derived computations ──────────────────────────────────────────────────────

const computeKpis = (payments) => {
  const now          = new Date()
  const currentMonth = now.getMonth()    // 0-11
  const currentYear  = now.getFullYear()

  const isCurrentMonth = (p) => {
    if (!p.date) return false
    const d = new Date(p.date + 'T12:00:00')
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth
  }

  return payments.reduce((acc, p) => {
    if (p.type !== 'pila' && p.type !== 'renta') {
      acc.ytd            += (p.gross     || 0)
      acc.disponibleHoy  += (p.disponible|| 0)
      acc.reservadoRenta += (p.reserva   || 0)
      acc.reservadoPila  += (p.pila      || 0)
      acc.retencionesYTD += (p.retencion || 0)
      // Contexto mensual para cálculo PILA acumulativo
      if (isCurrentMonth(p)) {
        acc.ingresosMesActual += (p.gross || 0)
        acc.pilaReservadaMes  += (p.pila  || 0)
      }
    } else if (p.type === 'pila') {
      acc.reservadoPila -= (p.pila      || 0)
      acc.disponibleHoy += (p.disponible|| 0)
    }
    return acc
  }, {
    disponibleHoy:      0,
    ytd:                0,
    reservadoRenta:     0,
    reservadoPila:      0,
    retencionesYTD:     0,
    ingresosMesActual:  0,
    pilaReservadaMes:   0,
  })
}

// Monthly chart: real data from payments; future months marked projected.
const computeMonthlyData = (payments) => {
  const now = new Date()
  const currentMonth = now.getMonth()   // 0-11
  const currentYear  = now.getFullYear()

  return MONTH_LABELS.map((month, i) => {
    const amount = payments
      .filter(p => p.type !== 'pila' && p.type !== 'renta' && p.date)
      .filter(p => {
        const d = new Date(p.date + 'T12:00:00') // avoid timezone offset flips
        return d.getFullYear() === currentYear && d.getMonth() === i
      })
      .reduce((sum, p) => sum + (p.gross || 0), 0)

    if (i === currentMonth) return { month, amount, current: true }
    if (i > currentMonth)   return { month, amount: 0, projected: true }
    return { month, amount }
  })
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useAppStore = create(
  persist(
    (set, get) => ({

      // ── Navigation ──────────────────────────────────────────────
      currentScreen: 'O1',
      screenHistory: [],
      activeTab: 0,
      selectedAnnualMonth: null,

      navigate: (screenId) => {
        const current = get().currentScreen
        set(state => ({
          currentScreen: screenId,
          screenHistory: [...state.screenHistory, current],
        }))
      },

      navigateRoot: (screenId) => {
        set({ currentScreen: screenId, screenHistory: [], activeTab: 0 })
      },

      goBack: () => {
        const history = get().screenHistory
        if (history.length === 0) return
        const prev = history[history.length - 1]
        set(state => ({
          currentScreen: prev,
          screenHistory: state.screenHistory.slice(0, -1),
        }))
      },

      switchTab: (tabIndex) => {
        set({
          activeTab: tabIndex,
          currentScreen: TABS[tabIndex],
          screenHistory: [],
        })
      },

      setSelectedAnnualMonth: (monthIndex) => set({ selectedAnnualMonth: monthIndex }),

      // ── Auth ──────────────────────────────────────────────────
      session: null,
      setSession: (session) => set({ session }),

      // ── Theme ────────────────────────────────────────────────────
      theme: 'light',
      toggleTheme: () => {
        const next = get().theme === 'light' ? 'dark' : 'light'
        document.documentElement.setAttribute('data-theme', next)
        set({ theme: next })
      },

      wireframeMode: false,
      toggleWireframeMode: () => {
        set({ wireframeMode: !get().wireframeMode })
      },

      // ── User profile ─────────────────────────────────────────────
      profile: {
        name:           'Valentina Gómez',
        regimen:        'ordinario',
        tipo_ingreso:   'honorarios',
        es_declarante:  false,
        retencion:      11,
        pila:           'auto',
        is_pila_exempt: false,
      },

      setProfile: (updates) => {
        const newProfile = { ...get().profile, ...updates }
        set({ profile: newProfile })

        // Sync to Supabase in background (non-blocking)
        const { session } = get()
        if (session && !session.mock && session.user?.id) {
          supabase.from('profiles').upsert({
            id:             session.user.id,
            name:           newProfile.name,
            regimen:        newProfile.regimen,
            tipo_ingreso:   newProfile.tipo_ingreso,
            es_declarante:  newProfile.es_declarante,
            retencion:      newProfile.retencion,
            pila:           newProfile.pila,
            is_pila_exempt: newProfile.is_pila_exempt ?? false,
            updated_at:     new Date().toISOString(),
          }).then(({ error }) => {
            if (error) console.error('[Quadra] Supabase upsert profile:', error.message)
          })
        }
      },

      // ── Payments & KPIs ──────────────────────────────────────────
      payments: [],
      kpis: {
        disponibleHoy: 0, ytd: 0,
        reservadoRenta: 0, reservadoPila: 0, retencionesYTD: 0,
        ingresosMesActual: 0, pilaReservadaMes: 0,
      },
      monthlyData: computeMonthlyData([]),

      addPayment: (payment) => {
        const normalizedPayment = normalizePaymentDates(payment)
        // 1. Update local state immediately (keep UI snappy)
        set(state => {
          const next = [normalizedPayment, ...state.payments]
          return {
            payments:    next,
            kpis:        computeKpis(next),
            monthlyData: computeMonthlyData(next),
          }
        })

        // 2. Persist to Supabase in background
        const { session } = get()
        if (session && !session.mock && session.user?.id) {
          supabase.from('payments').insert({
            id:              normalizedPayment.id,
            user_id:         session.user.id,
            client:          normalizedPayment.client,
            method:          normalizedPayment.method,
            currency:        normalizedPayment.currency,
            original_amount: normalizedPayment.originalAmount ?? null,
            gross:           normalizedPayment.gross,
            retencion:       normalizedPayment.retencion,
            pila:            normalizedPayment.pila,
            reserva:         normalizedPayment.reserva,
            disponible:      normalizedPayment.disponible,
            date:            normalizedPayment.date,
            date_label:      normalizedPayment.dateLabel,
            type:            normalizedPayment.type || 'income',
          }).then(({ error }) => {
            if (error) console.error('[Quadra] Supabase insert payment:', error.message)
          })
        }
      },

      removePayment: (id) => {
        set(state => {
          const next = state.payments.filter(p => p.id !== id)
          return { payments: next, kpis: computeKpis(next), monthlyData: computeMonthlyData(next) }
        })
        const { session } = get()
        if (session && !session.mock && session.user?.id) {
          supabase.from('payments').delete().eq('id', id).then(({ error }) => {
            if (error) console.error('[Quadra] removePayment:', error.message)
          })
        }
      },

      payPila: (amount, period) => {
        const payment = {
          id:         Date.now(),
          client:     `Pago PILA — ${period}`,
          type:       'pila',
          method:     'PSE',
          gross:      0,
          pila:       amount,
          reserva:    0,
          retencion:  0,
          disponible: -amount,
          date:       new Date().toISOString().split('T')[0],
          dateLabel:  formatDateLabel(new Date().toISOString().split('T')[0]),
          periodLabel: period,
        }

        set(state => {
          const next = [payment, ...state.payments]
          return {
            payments:    next,
            kpis:        computeKpis(next),
            monthlyData: computeMonthlyData(next),
          }
        })

        // Persist to Supabase in background
        const { session } = get()
        if (session && !session.mock && session.user?.id) {
          supabase.from('payments').insert({
            id:           payment.id,
            user_id:      session.user.id,
            client:       payment.client,
            method:       payment.method,
            currency:     'COP',
            gross:        0,
            retencion:    0,
            pila:         amount,
            reserva:      0,
            disponible:   -amount,
            date:         payment.date,
            date_label:   payment.dateLabel,
            type:         'pila',
            period_label: period,
          }).then(({ error }) => {
            if (error) console.error('[Quadra] Supabase insert payPila:', error.message)
          })
        }
      },

      selectedPaymentId: null,
      setSelectedPayment: (id) => set({ selectedPaymentId: id }),

      // ── Supabase data load / clear ───────────────────────────────
      loadUserData: async (userId) => {
        // Profile
        const { data: profileData, error: profileErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle()

        if (profileErr) {
          console.error('[Quadra] loadUserData profiles:', profileErr.message)
        } else if (profileData) {
          set({
            profile: {
              name:           profileData.name           || 'Usuario',
              regimen:        profileData.regimen         || 'ordinario',
              tipo_ingreso:   profileData.tipo_ingreso    || 'honorarios',
              es_declarante:  profileData.es_declarante   ?? false,
              retencion:      Number(profileData.retencion ?? 11),
              pila:           profileData.pila            || 'auto',
              is_pila_exempt: profileData.is_pila_exempt  ?? false,
            },
          })
        }

        // Payments
        const { data: rows, error: paymentsErr } = await supabase
          .from('payments')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (paymentsErr) {
          console.error('[Quadra] loadUserData payments:', paymentsErr.message)
          return
        }

        if (rows && rows.length > 0) {
          const payments = rows.map(p => normalizePaymentDates({
            id:             p.id,
            client:         p.client,
            method:         p.method,
            currency:       p.currency,
            originalAmount: p.original_amount != null ? Number(p.original_amount) : null,
            gross:          Number(p.gross      || 0),
            retencion:      Number(p.retencion  || 0),
            pila:           Number(p.pila        || 0),
            reserva:        Number(p.reserva     || 0),
            disponible:     Number(p.disponible  || 0),
            date:           p.date,
            dateLabel:      p.date_label,
            type:           p.type || 'income',
            periodLabel:    p.period_label,
          }))
          set({
            payments,
            kpis:        computeKpis(payments),
            monthlyData: computeMonthlyData(payments),
          })
        }
      },

      clearUserData: () => {
        const empty = []
        set({
          payments:    empty,
          kpis:        computeKpis(empty),
          monthlyData: computeMonthlyData(empty),
          selectedAnnualMonth: null,
        })
      },

      applyMazeScenario: (task = 'ingreso') => {
        const payments = createMazeScenarioPayments()
        const screenByTask = {
          ingreso: 'D1',
          pila: 'D1',
          renta: 'D1',
          home: 'D1',
        }
        set({
          currentScreen: screenByTask[task] || 'D1',
          screenHistory: [],
          activeTab: 0,
          selectedAnnualMonth: null,
          selectedPaymentId: null,
          payments,
          kpis: computeKpis(payments),
          monthlyData: computeMonthlyData(payments),
          profile: {
            name: 'Valentina Gómez',
            regimen: 'ordinario',
            tipo_ingreso: 'honorarios',
            es_declarante: true,
            retencion: 10,
            pila: 'auto',
            is_pila_exempt: false,
          },
          alerts: {
            pila: true,
            renta: true,
            nuevoPago: false,
            resumenSemanal: true,
            vencimientos: true,
          },
          bannerI1Dismissed: true,
          notifDrawerOpen: false,
          notifications: [],
          toasts: [],
        })
      },

      // ── Toasts ───────────────────────────────────────────────────
      toasts: [],
      showToast: (toast) => {
        const id = Date.now()
        set(state => ({ toasts: [...state.toasts, { ...toast, id }] }))
        if (toast.type !== 'error') {
          setTimeout(() => get().dismissToast(id), 3000)
        }
        return id
      },
      dismissToast: (id) => {
        set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }))
      },

      // ── UI prefs ─────────────────────────────────────────────────
      bannerI1Dismissed: false,
      setBannerI1Dismissed: (v) => set({ bannerI1Dismissed: v }),

      // ── Alerts toggles (C2) ───────────────────────────────────────
      alerts: {
        pila:           true,
        renta:          true,
        nuevoPago:      false,
        resumenSemanal: true,
        vencimientos:   false,
      },
      toggleAlert: (key) => set(state => ({
        alerts: { ...state.alerts, [key]: !state.alerts[key] },
      })),

      // ── Notifications (in-app, computed client-side) ──────────────
      notifications: [],
      notifDrawerOpen: false,
      addNotification: (n) => set(state => ({
        notifications: state.notifications.find(x => x.id === n.id)
          ? state.notifications
          : [...state.notifications, n],
      })),
      syncNotifications: (newNotifs) => set(state => ({
        // Replace array but preserve read state for existing items
        notifications: newNotifs.map(n => ({
          ...n,
          read: state.notifications.find(x => x.id === n.id)?.read ?? false,
        })),
      })),
      markAllRead: () => set(state => ({
        notifications: state.notifications.map(n => ({ ...n, read: true })),
      })),
      clearNotifications: () => set({ notifications: [] }),
      setNotifDrawerOpen: (v) => set({ notifDrawerOpen: v }),

      // ── Dev ───────────────────────────────────────────────────────
      resetStore: () => {
        const empty = []
        set({
          payments:     empty,
          profile:      { name: 'Valentina Gómez', regimen: 'ordinario', tipo_ingreso: 'honorarios', es_declarante: false, retencion: 11, pila: 'auto' },
          kpis:         computeKpis(empty),
          monthlyData:  computeMonthlyData(empty),
          currentScreen: 'O1',
          screenHistory: [],
          selectedAnnualMonth: null,
        })
      },
    }),
    {
      name: 'quadra-storage',
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state) => ({
        payments:      state.payments,
        kpis:          state.kpis,
        profile:       state.profile,
        alerts:        state.alerts,
        bannerI1Dismissed: state.bannerI1Dismissed,
        theme:         state.theme,
        wireframeMode: state.wireframeMode,
        currentScreen: state.currentScreen,
        screenHistory: state.screenHistory,
        activeTab:     state.activeTab,
        selectedAnnualMonth: state.selectedAnnualMonth,
        // monthlyData is recomputed on rehydration via onRehydrateStorage
      }),
      onRehydrateStorage: () => (state) => {
        if (state && state.payments) {
          state.monthlyData = computeMonthlyData(state.payments)
        }
        // B2 (recuperar contraseña) no debe ser la pantalla “de inicio” tras F5 / abrir de nuevo
        if (state?.currentScreen === 'B2') {
          state.currentScreen = 'O1'
          state.screenHistory = []
        }
      },
    }
  )
)
