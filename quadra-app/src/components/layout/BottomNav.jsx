import { useAppStore } from '../../store/useAppStore'

const TABS = [
  {
    id: 'D1',
    label: 'Mi Dinero',
    icon: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
        <path d="M2 10h20" fill="none" stroke="currentColor" strokeWidth="2"/>
      </>
    ),
  },
  {
    id: 'I1',
    label: 'Mis Ingresos',
    icon: (
      <>
        <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="2"/>
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" fill="none" stroke="currentColor" strokeWidth="2"/>
      </>
    ),
  },
  {
    id: 'A1',
    label: 'Mi Año',
    icon: (
      <>
        <rect x="3" y="12" width="4" height="9" fill="none" stroke="currentColor" strokeWidth="2"/>
        <rect x="10" y="7" width="4" height="14" fill="none" stroke="currentColor" strokeWidth="2"/>
        <rect x="17" y="2" width="4" height="19" fill="none" stroke="currentColor" strokeWidth="2"/>
      </>
    ),
  },
  {
    id: 'C1',
    label: 'Mi Cuenta',
    icon: (
      <>
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" fill="none" stroke="currentColor" strokeWidth="2"/>
        <circle cx="12" cy="7" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
      </>
    ),
  },
]

const HIDDEN_ON = ['O1','O1C','O2','O3','O4','O5','B1','B2','I2','I2R','C4C']

// 5 columns with 16px padding each side: centers at 51, 122, 195, 268, 339
const COL = [51, 122, 195, 268, 339]

export default function BottomNav({ onFabPress, fabOpen }) {
  const { currentScreen, activeTab, switchTab, payments } = useAppStore()

  const today = new Date().toISOString().slice(0, 10)
  const newPaymentsToday = payments.filter(p => p.type !== 'pila' && p.date === today).length

  if (HIDDEN_ON.includes(currentScreen)) return null

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Navegación principal">
      <svg
        viewBox="0 0 390 72"
        className="bottom-nav-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Nav items */}
        {TABS.map((tab, i) => {
          const isActive = activeTab === i
          const cx = COL[i]
          const color = isActive ? 'var(--volt-text)' : 'var(--txt-f)'
          const strokeColor = isActive ? 'var(--volt-text)' : 'var(--txt-f)'
          const sw = isActive ? 2.5 : 2

          return (
            <g
              key={tab.id}
              onClick={() => switchTab(i)}
              style={{ cursor: 'pointer' }}
              aria-label={tab.label}
              role="button"
            >
              {/* Hit area */}
              <rect x={cx - 36} y="0" width="72" height="72" fill="transparent"/>

              {/* Active pill background */}
              {isActive && (
                <rect
                  x={cx - 30}
                  y="10"
                  width="60"
                  height="52"
                  rx="14"
                  fill="var(--volt-dim)"
                />
              )}

              {/* Icon */}
              <svg
                x={cx - 11}
                y="16"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke={strokeColor}
                strokeWidth={sw}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {tab.icon}
              </svg>

              {/* Label */}
              <text
                x={cx}
                y="57"
                textAnchor="middle"
                fontSize="9.5"
                fontWeight={isActive ? '700' : '500'}
                fill={color}
                fontFamily="var(--font-body)"
                letterSpacing="0.01em"
              >
                {tab.label}
              </text>

              {/* Badge */}
              {i === 1 && newPaymentsToday > 0 && !isActive && (
                <g transform={`translate(${cx + 12}, 14)`}>
                  <circle r="7" fill="var(--volt)" stroke="var(--bg)" strokeWidth="1.5"/>
                  <text
                    textAnchor="middle"
                    y="2.5"
                    fontSize="7"
                    fontWeight="700"
                    fill="var(--volt-on)"
                    fontFamily="var(--font-body)"
                  >
                    {newPaymentsToday}
                  </text>
                </g>
              )}
            </g>
          )
        })}

        {/* + Button — rightmost, volt green */}
        <g
          onClick={onFabPress}
          style={{ cursor: 'pointer' }}
          aria-label={fabOpen ? 'Cerrar menú' : 'Acciones rápidas'}
          role="button"
        >
          {/* Hit area */}
          <rect x={COL[4] - 36} y="0" width="72" height="72" fill="transparent"/>

          {/* Green circle */}
          <circle
            cx={COL[4]}
            cy="36"
            r="24"
            fill="var(--volt)"
          />

          {/* + or × */}
          <text
            x={COL[4]}
            y={fabOpen ? "43" : "44"}
            textAnchor="middle"
            fontSize={fabOpen ? "22" : "26"}
            fontWeight="300"
            fill="var(--volt-on)"
            fontFamily="var(--font-display)"
            style={{ userSelect: 'none' }}
          >
            {fabOpen ? '×' : '+'}
          </text>
        </g>
      </svg>
    </nav>
  )
}
