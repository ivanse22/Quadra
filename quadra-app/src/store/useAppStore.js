import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const TABS = ['D1', 'I1', 'A1', 'C1']

const computeKpis = (payments) => {
  return payments.reduce((acc, p) => {
    if (p.type !== 'pila' && p.type !== 'renta') { // Income row
      acc.ytd += (p.gross || 0)
      acc.disponibleHoy += (p.disponible || 0)
      acc.reservadoRenta += (p.reserva || 0)
      acc.reservadoPila += (p.pila || 0)
    } else if (p.type === 'pila') { // Deduct when PILA is paid
      acc.reservadoPila -= (p.pila || 0)
      acc.disponibleHoy += (p.disponible || 0) // if you want visual deduction
    }
    return acc
  }, {
    disponibleHoy: 0,
    ytd: 0,
    reservadoRenta: 0,
    reservadoPila: 0,
  })
}

export const useAppStore = create(
  persist(
    (set, get) => ({
      // ── Navigation ──────────────────────────────────────────────
      currentScreen: 'O1',
      screenHistory: [],
      activeTab: 0,

      // ── Auth ──────────────────────────────────────────────────
      session: null,
      setSession: (session) => set({ session }),

      // ── Analytics ───────────────────────────────────────────────
      monthlyData: [
        { month: 'Ene', amount: 1500000 },
        { month: 'Feb', amount: 1200000 },
        { month: 'Mar', amount: 2400000 },
        { month: 'Abr', amount: 2300000, current: true },
        { month: 'May', amount: 0, projected: true },
        { month: 'Jun', amount: 0, projected: true },
        { month: 'Jul', amount: 0, projected: true },
        { month: 'Ago', amount: 0, projected: true },
        { month: 'Sep', amount: 0, projected: true },
        { month: 'Oct', amount: 0, projected: true },
        { month: 'Nov', amount: 0, projected: true },
        { month: 'Dic', amount: 0, projected: true },
      ],

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

      // ── Theme ────────────────────────────────────────────────────
      theme: 'light',
      toggleTheme: () => {
        const next = get().theme === 'light' ? 'dark' : 'light'
        document.documentElement.setAttribute('data-theme', next)
        set({ theme: next })
      },

      // ── User profile ─────────────────────────────────────────────
      profile: {
        name: 'Valentina Gómez',
        regimen: 'ordinario', // 'simple' | 'ordinario'
        tipo_ingreso: 'honorarios', // 'honorarios' | 'servicios'
        es_declarante: false,
        retencion: 11,  // 3.5 | 4 | 6 | 10 | 11
        pila: 'auto',   // 'auto' | 'manual' | 'no'
      },
      setProfile: (updates) => set(state => ({
        profile: { ...state.profile, ...updates }
      })),

      // ── Payments & Transactions ──────────────────────────────────
      payments: [],
      kpis: { disponibleHoy: 0, ytd: 0, reservadoRenta: 0, reservadoPila: 0 },

      addPayment: (payment) => set(state => {
        const next = [payment, ...state.payments]
        return { payments: next, kpis: computeKpis(next) }
      }),

      payPila: (amount, period) => {
        const payment = {
          id: Date.now(),
          client: `Pago PILA — ${period}`,
          type: 'pila',
          method: 'PSE',
          gross: 0,
          pila: amount,
          reserva: 0,
          retencion: 0,
          disponible: -amount,
          date: new Date().toISOString().split('T')[0],
          dateLabel: 'Hoy',
        }
        set(state => {
          const next = [payment, ...state.payments]
          return { payments: next, kpis: computeKpis(next) }
        })
      },

      selectedPaymentId: null,
      setSelectedPayment: (id) => set({ selectedPaymentId: id }),

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
        pila: true,
        renta: true,
        nuevoPago: false,
        resumenSemanal: true,
        vencimientos: false,
      },
      toggleAlert: (key) => set(state => ({
        alerts: { ...state.alerts, [key]: !state.alerts[key] }
      })),

      // Development / test
      resetStore: () => set({ payments: [], profile: { name: 'Valentina Gómez', regimen: 'ordinario', tipo_ingreso: 'honorarios', es_declarante: false, retencion: 11, pila: 'auto' }, kpis: computeKpis([]), currentScreen: 'O1', screenHistory: [] })
    }),
    {
      name: 'quadra-storage', // name of the item in the storage (must be unique)
      partialize: (state) => ({ 
        payments: state.payments, 
        kpis: state.kpis,
        profile: state.profile,
        alerts: state.alerts,
        theme: state.theme,
        // optionally persist navigation state
        currentScreen: state.currentScreen,
        screenHistory: state.screenHistory,
        activeTab: state.activeTab
      }),
    }
  )
)
