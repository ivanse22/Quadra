# Quadra — Fintech PWA ⚡️

Un ecosistema financiero responsivo y progresivo (PWA) construido bajo el sólido **Design System v7** de Quadra. Orientado a ofrecer una experiencia premium sin fricciones para trabajadores independientes (freelancers, creadores) optimizando retenciones (PILAs y Rentas).

## 🚀 Estado Actual de la Aplicación

La aplicación web progresiva (`quadra-app/`) implementa 100% el **DS v7** en un entorno modular de React + Vite. Se han estructurado fluidamente todas las vistas core.

### 📱 Flujos y Pantallas Implementados

#### 1. Onboarding & Autenticación
- **O1 - Welcome**: Headline cinemático responsive y CTAs claros.
- **O2 a O4 - Cuestionario (Régimen, Retención, PILA)**: Flujo wizard con barra de progreso superior animada y etiquetas de estado (ej: "¡Último!").
- **Auth**: Formularios refactorizados utilizando puro CSS Semántico (`.q-input`, `.field`) para login y registro unificado.

#### 2. Tab 1: Mi Dinero (Home - D1)
El corazón jerárquico de Quadra:
- **Hero "Disponible hoy"**: Implementación de tipografía dinámica responsiva (`clamp(3.5rem, 14vw, 5rem)`) con la marca personal de Quadra, garantizando impacto visual total en móvil y desktop.
- **KPI Cards**: Jerarquías visuales controladas clases semánticas `.kpi-lbl` y `.kpi-val` para YTD y Reservas.
- **Alerta PILA (Task-row)**: Card rediseñada tipo "tarea financiera" con botón sólido y claro para incentivar el pago sin saturar de colores de alerta ruidosos.
- **Floating Action Button (FAB)**: Introducido globalmente en D1 y Tab 2 con un `fab-pulse` (anillo expansivo al cargar) que guía de forma instintiva al usuario hacia la acción principal: "*Registrar un nuevo ingreso*".

#### 3. Tab 2: Entradas (Movimientos - I1 e I2)
- Flujo interactivo para listar ingresos clasificados.
- **AmountField Inteligente (Nuevo Pago)**: Input central de valores que imita calculadoras premium.
  - _Tipografía Fluida_: El número decrece en tamaño suavemente mientras más cifras escribes.
  - _Teclado Táctil bajo demanda_: El `numpad` viene oculto por default para no estorbar; se despliega con fluidas animaciones al tocar la zona numérica y se oculta presionando "Listo".
  - _Soporte Desktop Nativo_: Soporte activo al NumPad y teclas físicas del computador para ingresos rápidos mientras se discrimina la entrada a inputs de texto del sistema (e.g. campo "cliente").

#### 4. Tabs adicionales
- **Tab 3: Perfil / Datos (C1)**: Manejo de datos y logouts respetando `.btn--destructive` del DS v7.
- Sistema de **Bottom Navigation** responsivo (con tokens interactivos `hover`, `active pill` y pulsaciones escala `0.93`).

---

## 🎨 Design System (DS v7)

La fuente de verdad se encuentra mapeada en `quadra-app/src/styles/`:
- `tokens.css`: Raíz absoluta de pesos tipográficos, tokens semánticos financieros (`--fin-income`, `--fin-reserve`), colores neutros ajustados por contraste AA/AAA (ej. `--txt-m: #556357`) y dinámicas de superficie (`surf-1`). Modo Oscuro automatizado incluido.
- `components.css`: Patrones de diseño reutilizables (`.btn`, `.q-input`, `numpad`, `.badge`, `fab-pulse`).
- **Accesibilidad**: Todos los íconos de navegación incluyen sus roles (`role="img"`) y sus resoluciones ARIA (`aria-label`) optimizando la app para Screen Readers.

---

## 🛠 Entorno de Desarrollo y Despliegue

### Requisitos Prerequisitos
- Node.js versión `18.x` o posterior.

### Instrucciones para levantar la App localmente
```bash
# Ingresar al directorio de la app nativa
cd quadra-app

# Instalar las dependencias
npm install

# Correr el entorno local de Vite (con --host para visualizar en móvil)
npm run dev --host
```

## 📦 Próximos pasos identificados
- Conectar Supabase (Base de datos remota) y sincronizar el App context (Estado global).
- Refinamiento offline-first (Service Workers para modo sin internet).
- Lógicas reales de cálculo (disponible hoy = ingresos - reservas de salud/pensión/renta).