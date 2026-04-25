# Quadra — Fintech PWA para Freelancers 🇨🇴

PWA de gestión financiera para trabajadores independientes colombianos. Calcula en tiempo real el disponible real tras descontar PILA (salud + pensión), retención en la fuente y reserva para declaración de renta.

**Stack:** React 19 + Vite · Zustand · Supabase · CSS puro (sin Tailwind)

---

## 🚀 Levantar localmente

```bash
cd quadra-app
npm install
npm run dev          # http://localhost:5173
npm run dev -- --host  # + acceso desde móvil en la misma red
```

---

## 📱 Pantallas implementadas

### Onboarding & Auth (`O1–O5`, `B1–B2`)
- Bienvenida cinemática con animaciones spring
- Wizard de perfil fiscal: régimen tributario, retención habitual, cotización PILA
- Registro / login con Supabase Auth (email + magic link)
- Recuperación de contraseña
- Resumen de configuración con opción de conectar cuenta bancaria al terminar

### Tab 1 — Mi Dinero (`D1–D4`)
- **D1 Home**: Hero "Lo que es tuyo hoy" tocable (abre desglose), KPI cards con tendencia mes vs. mes anterior y barra de progreso vs. meta anual, desglose Renta + PILA en card Reservado, insights contextuales (mejor mes, disponible bajo, PILA vencida)
- **D2 Entender**: Explicación del cálculo de descuentos con CTAs forward
- **D3 Pagar PILA**: Calcula IBC automático, registra pago, historial en I5
- **D4 Reserva**: Progreso visual hacia la meta de declaración de renta

### Tab 2 — Mis Ingresos (`I1–I5`)
- **I1**: Lista con swipe-hint, banner orientador hacia D1
- **I2 Registro**: AmountField con teclado numérico táctil, preview en vivo del disponible exacto, autocomplete de cliente desde historial, soporte COP/USD/EUR
- **I2R Resultado**: Ficha de disponible con desglose completo post-cálculo
- **I3 Detalle**: Timeline del pago con todos los importes
- **I4 Total ganado**: KPIs YTD, mejor mes, promedio
- **I5 Historial PILA**: Lista de pagos de seguridad social con estado

### Tab 3 — Mi Año (`A1–A8`)
- **A1 Anual**: Gráfico de barras mensual, proyección, acceso a herramientas
- **A2 Mensual**: Detalle por mes
- **A3 Resumen**: Totales anuales
- **A4/A5 Reserva**: Saldo y proyección hacia meta de renta
- **A6 Proyectar**: Chips de preset ($2M/$4M/$6M/$10M), barra visual apilada (PILA/Ret./Reserva/Disponible), contexto vs. promedio real, guardar como meta anual
- **A7 Exportar**: Descarga CSV real con BOM UTF-8 (Excel compatible); PDF marcado como Premium
- **A8 Calendario**: Fechas clave DIAN y recordatorios

### Tab 4 — Mi Cuenta (`C1–C4`)
- **C1 Datos personales**: Edición inline de nombre, régimen, retención, PILA, NIT; toggle dark/light mode; cerrar sesión
- **C2 Alertas**: Toggles de notificaciones con canal in-app / push (si PWA instalada)
- **C3 Cuentas conectadas**: Vista de plataformas vinculadas
- **C4 Agregar cuenta**: Bancolombia, Davivienda, BBVA, Nequi, Daviplata, Wise, PayPal; lista de espera por email para plataformas no soportadas

---

## 🔔 Sistema de notificaciones in-app

Motor de alertas cliente-side que evalúa condiciones en cada cambio de pagos y sincroniza un array de notificaciones en el store (sin backend):

| Condición | Alerta |
|-----------|--------|
| Sin PILA > 25 días | "PILA pendiente" → D3 |
| Reserva < 40% en mayo+ | "Reserva para renta baja" → D4 |
| Es viernes con pagos esta semana | "Resumen semanal" → I1 |
| Fecha límite DIAN próxima (≤ 15 días) | "Vencimiento DIAN" → A8 |

El bell del header muestra un badge numérico (no solo un punto). Al hacer tap abre un drawer bottom-sheet con las notificaciones accionables. Los toggles de C2 controlan qué reglas se evalúan.

---

## 🧮 Motor financiero (`calculadoraFinanciera.js`)

Calcula por cada pago registrado:
- **Retención en la fuente**: según porcentaje del perfil del usuario
- **PILA**: 12,5% salud + 16% pensión + ARL sobre IBC del mes (acumulativo), respetando mínimos legales
- **Reserva para renta**: 14,5% del bruto
- **Disponible real**: bruto − retención − PILA − reserva

Soporta múltiples monedas (COP, USD, EUR) con tasas de cambio configurables.

---

## 🎨 Design System

Tokens en `src/styles/tokens.css`:
- Tipografía: `--font-display` (Syne) + `--font-body` (DM Sans)
- Colores financieros semánticos: `--fin-income`, `--fin-reserve`, `--fin-deduct`
- Volt brand color: `--volt` / `--volt-dim` / `--volt-text`
- Modo oscuro automático via `data-theme`

Componentes en `src/styles/components.css`: `.btn`, `.q-input`, `.card`, `.tx-row`, `.home-kpi-card`, `.fab-pulse`, `.badge`, `.toast`, `.dialog`, `.q-empty`, `.q-toggle`, y más.

---

## 🗄 Supabase

- Auth: email + magic link
- Tabla `profiles`: régimen, retención, PILA, NIT, metaAnual
- Tabla `payments`: historial de pagos sincronizado por `user.id`
- Mock session disponible para demo sin cuenta

---

## 📁 Estructura

```
quadra-app/src/
├── App.jsx                    # Routing, FAB, notificaciones hook
├── store/useAppStore.js       # Zustand (payments, kpis, profile, alerts, notifications)
├── lib/
│   ├── calculadoraFinanciera.js
│   ├── dateUtils.js
│   └── notifications.js       # computeNotifications()
├── components/
│   ├── layout/               # Header, BottomNav
│   ├── ui/                   # Toast, Dialog, NotificationDrawer, AmountField
│   └── screens/
│       ├── onboarding/       # O1–O5, B1–B2
│       ├── tab1/             # D1–D4
│       ├── tab2/             # I1–I5
│       ├── tab3/             # A1–A8
│       └── tab4/             # C1–C4
└── styles/
    ├── tokens.css
    └── components.css
```
