import { useAppStore } from '../../store/useAppStore'
import { IconWallet, IconDollar, IconBarChart, IconUser } from '../ui/Icons'

const TABS = [
  { id: 'D1', label: 'Mi Dinero',    Icon: IconWallet },
  { id: 'I1', label: 'Mis Ingresos', Icon: IconDollar },
  { id: 'A1', label: 'Mi Año',       Icon: IconBarChart },
  { id: 'C1', label: 'Mi Cuenta',    Icon: IconUser },
]

// Screens that HIDE the bottom nav
const HIDDEN_ON = ['O1','O1C','O2','O3','O4','O5','B1','B2','I2','I2R','C4C']

export default function BottomNav() {
  const { currentScreen, activeTab, switchTab, payments } = useAppStore()

  // E5.4 — Badge on Mis Ingresos tab if a payment was added today
  const today = new Date().toISOString().slice(0, 10)
  const newPaymentsToday = payments.filter(p => p.type !== 'pila' && p.date === today).length

  if (HIDDEN_ON.includes(currentScreen)) return null

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Navegación principal">
      {TABS.map((tab, i) => (
        <button
          key={tab.id}
          className={`nav-item${activeTab === i ? ' on' : ''}`}
          onClick={() => switchTab(i)}
          aria-label={tab.label}
          aria-current={activeTab === i ? 'page' : undefined}
          style={{ position: 'relative' }}
        >
          <tab.Icon />
          <span>{tab.label}</span>
          {i === 1 && newPaymentsToday > 0 && activeTab !== 1 && (
            <span style={{
              position: 'absolute', top: 6, right: '50%', marginRight: -18,
              minWidth: 16, height: 16, borderRadius: 'var(--r-full)',
              background: 'var(--volt)', color: 'var(--volt-on)',
              fontSize: 9, fontWeight: 700, fontFamily: 'var(--font-body)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 4px', border: '1.5px solid var(--bg)',
            }}>
              {newPaymentsToday}
            </span>
          )}
        </button>
      ))}
    </nav>
  )
}
