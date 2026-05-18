import { useAppStore } from '../../store/useAppStore'
import { IconWallet, IconDollar, IconBarChart, IconUser } from '../ui/Icons'

const LEFT_TABS  = [
  { id: 'D1', label: 'Mi Dinero',    Icon: IconWallet,   tabIdx: 0 },
  { id: 'I1', label: 'Mis Ingresos', Icon: IconDollar,   tabIdx: 1 },
]
const RIGHT_TABS = [
  { id: 'A1', label: 'Mi Año',       Icon: IconBarChart, tabIdx: 2 },
  { id: 'C1', label: 'Mi Cuenta',    Icon: IconUser,     tabIdx: 3 },
]

// Screens that HIDE the bottom nav
const HIDDEN_ON = ['O1','O1C','O2','O3','O4','O5','B1','B2','I2','I2R','C4C']

function NavBtn({ tab, activeTab, switchTab, badge }) {
  const isActive = activeTab === tab.tabIdx
  return (
    <button
      className={`nav-item${isActive ? ' on' : ''}`}
      onClick={() => switchTab(tab.tabIdx)}
      aria-label={tab.label}
      aria-current={isActive ? 'page' : undefined}
      style={{ position: 'relative' }}
    >
      <tab.Icon />
      <span>{tab.label}</span>
      {isActive && <span className="nav-tab-indicator" />}
      {badge > 0 && !isActive && (
        <span style={{
          position: 'absolute', top: 6, right: '50%', marginRight: -18,
          minWidth: 16, height: 16, borderRadius: 'var(--r-full)',
          background: 'var(--volt)', color: 'var(--volt-on)',
          fontSize: 9, fontWeight: 700, fontFamily: 'var(--font-body)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 4px', border: '1.5px solid var(--bg)',
        }}>
          {badge}
        </span>
      )}
    </button>
  )
}

export default function BottomNav() {
  const { currentScreen, activeTab, switchTab, payments } = useAppStore()

  const today = new Date().toISOString().slice(0, 10)
  const newPaymentsToday = payments.filter(p => p.type !== 'pila' && p.date === today).length

  if (HIDDEN_ON.includes(currentScreen)) return null

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Navegación principal">
      {LEFT_TABS.map(tab => (
        <NavBtn
          key={tab.id}
          tab={tab}
          activeTab={activeTab}
          switchTab={switchTab}
          badge={tab.tabIdx === 1 ? newPaymentsToday : 0}
        />
      ))}

      {/* Center spacer — the FAB bump sits here */}
      <div className="nav-center-spacer" aria-hidden="true" />

      {RIGHT_TABS.map(tab => (
        <NavBtn
          key={tab.id}
          tab={tab}
          activeTab={activeTab}
          switchTab={switchTab}
          badge={0}
        />
      ))}
    </nav>
  )
}
