import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'

const TABS = ['D1', 'I1', 'A1', 'C1']
const MONTH_LABELS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

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

      navigate: (screenId) => {
        const current = get().currentScreen
        set(state => ({
          currentScreen: screenId,
          screenHistory: [...state.screenHistory, current],
        }))
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
        // 1. Update local state immediately (keep UI snappy)
        set(state => {
          const next = [payment, ...state.payments]
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
            id:              payment.id,
            user_id:         session.user.id,
            client:          payment.client,
            method:          payment.method,
            currency:        payment.currency,
            original_amount: payment.originalAmount ?? null,
            gross:           payment.gross,
            retencion:       payment.retencion,
            pila:            payment.pila,
            reserva:         payment.reserva,
            disponible:      payment.disponible,
            date:            payment.date,
            date_label:      payment.dateLabel,
            type:            payment.type || 'income',
          }).then(({ error }) => {
            if (error) console.error('[Quadra] Supabase insert payment:', error.message)
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
          dateLabel:  'Hoy',
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
          const payments = rows.map(p => ({
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
        })
      },
    }),
    {
      name: 'quadra-storage',
      partialize: (state) => ({
        payments:      state.payments,
        kpis:          state.kpis,
        profile:       state.profile,
        alerts:        state.alerts,
        theme:         state.theme,
        currentScreen: state.currentScreen,
        screenHistory: state.screenHistory,
        activeTab:     state.activeTab,
        // monthlyData is recomputed on rehydration via onRehydrateStorage
      }),
      onRehydrateStorage: () => (state) => {
        if (state && state.payments) {
          state.monthlyData = computeMonthlyData(state.payments)
        }
      },
    }
  )
)
