import { useAppStore } from '../../store/useAppStore'

const TABS = [
  {
    id: 'D1',
    label: 'Mi Dinero',
    icon: (
      <g viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </g>
    ),
  },
  {
    id: 'I1',
    label: 'Mis Ingresos',
    icon: (
      <g viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="2" x2="12" y2="22" />
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </g>
    ),
  },
  {
    id: 'A1',
    label: 'Mi Año',
    icon: (
      <g viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="12" width="4" height="9" />
        <rect x="10" y="7" width="4" height="14" />
        <rect x="17" y="2" width="4" height="19" />
      </g>
    ),
  },
  {
    id: 'C1',
    label: 'Mi Cuenta',
    icon: (
      <g viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </g>
    ),
  },
]

// Screens that HIDE the bottom nav
const HIDDEN_ON = ['O1', 'O1C', 'O2', 'O3', 'O4', 'O5', 'B1', 'B2', 'I2', 'I2R', 'C4C']

export default function BottomNav() {
  const { currentScreen, activeTab, switchTab, payments } = useAppStore()

  // Badge on Mis Ingresos tab if a payment was added today
  const today = new Date().toISOString().slice(0, 10)
  const newPaymentsToday = payments.filter(p => p.type !== 'pila' && p.date === today).length

  if (HIDDEN_ON.includes(currentScreen)) return null

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Navegación principal">
      <svg
        viewBox="0 0 390 90"
        className="bottom-nav-svg"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <style>{`
            .nav-svg-bg { fill: var(--bg); }
            .nav-svg-icon { opacity: 0.5; transition: opacity 0.16s var(--ease-spring), transform 0.16s var(--ease-spring); }
            .nav-svg-icon.active { opacity: 1; transform: scale(1.08); }
            .nav-svg-label { font-family: var(--font-body); font-size: 11px; transition: fill 0.16s var(--ease-out), font-weight 0.16s var(--ease-out); }
            .nav-svg-label.active { fill: var(--volt); font-weight: 700; }
            .nav-svg-label:not(.active) { fill: var(--txt-f); font-weight: 400; }
            .nav-svg-btn { cursor: pointer; }
            .nav-svg-btn:hover rect { fill: var(--surf-1); opacity: 0.3; }
          `}</style>
        </defs>

        {/* Background */}
        <rect width="390" height="90" className="nav-svg-bg" />

        {/* Tabs */}
        {TABS.map((tab, i) => {
          const isActive = activeTab === i
          const xOffset = i < 2 ? 30 + i * 85 : 195 + (i - 2) * 85

          return (
            <g
              key={tab.id}
              className="nav-svg-btn"
              onClick={() => switchTab(i)}
              role="button"
              tabIndex={0}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
              style={{ cursor: 'pointer' }}
            >
              {/* Clickable area */}
              <rect
                x={xOffset - 35}
                y="15"
                width="70"
                height="60"
                fill="none"
                pointerEvents="auto"
              />

              {/* Icon */}
              <g
                className={`nav-svg-icon ${isActive ? 'active' : ''}`}
                transform={`translate(${xOffset}, 28)`}
                width="22"
                height="22"
              >
                {tab.icon}
              </g>

              {/* Label */}
              <text
                x={xOffset}
                y="68"
                textAnchor="middle"
                className={`nav-svg-label ${isActive ? 'active' : ''}`}
              >
                {tab.label}
              </text>

              {/* Badge */}
              {i === 1 && newPaymentsToday > 0 && !isActive && (
                <g transform={`translate(${xOffset + 18}, 20)`}>
                  <circle
                    cx="0"
                    cy="0"
                    r="8"
                    fill="var(--volt)"
                    stroke="var(--bg)"
                    strokeWidth="1.5"
                  />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fontSize="7"
                    fontWeight="700"
                    fill="var(--volt-on)"
                  >
                    {newPaymentsToday}
                  </text>
                </g>
              )}
            </g>
          )
        })}
      </svg>
    </nav>
  )
}
