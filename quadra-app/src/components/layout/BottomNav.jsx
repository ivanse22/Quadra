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
  const { currentScreen, activeTab, switchTab } = useAppStore()

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
        >
          <tab.Icon />
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
