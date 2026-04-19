# Quadra Design System v7 ⚡️

Bienvenido al repositorio oficial del **Design System de Quadra**. Este repositorio sirve como la "fuente de la verdad" (Single Source of Truth) para la interfaz gráfica y los estilos fundamentales que serán utilizados posteriormente para construir la aplicación real de Quadra.

## 🎨 Sobre el Proyecto

**Quadra DS v7** está diseñado con un enfoque "fintech", inspirado en interfaces limpias, accesibles y directas como las de Wise o Nubank. El sistema incluye diseño estructurado y modular con soporte nativo para **Light Mode y Dark Mode**.

El archivo principal del repositorio (`quadra-ds-v7.html`) actúa como un catálogo visual y técnico donde están integradas todas las variables CSS, clases estructurales y los componentes de UI listos para ser adaptados.

## ✨ Características Principales

### 1. Sistema de Tokens de Variables (CSS Root)
- **Control Centralizado**: Manejo de colores, superficies, bordes, sombreados (`--shadow-sm`, `--shadow-lg`) y animaciones (`--motion-base`, `--ease-spring`).
- **Superficies (Surfaces)**: Uso de jerarquías de fondo o elevaciones visuales (`surf-1`, `surf-2`) en vez de recargar con bordes duros.

### 2. Paleta de Colores FinTech
- **Acento Primario**: Volt (`#BDF300`). Utilizado solo para el 10% del viewport para dirigir la atención o marcar el dinero disponible en modo Dark.
- **Mode Switching**: De modo claro (`#FFFFFF`) a un oscuro atmosférico que mantiene un ligero "tono verdoso cálido" (`#090D0B`).
- **Semántica Financiera**:
  - `Income` / Ingresos (Verde: `#16A34A` / Modo oscuro: `#4ADE80`).
  - `Deduct` / Gastos (Rojo: `#DC2626` / Modo oscuro: `#F87171`).
  - `Reserve` / Reservado (Ámbar: `#B45309` / Modo oscuro: `#FBBF24`).

### 3. Tipografía Dual (Data & Text)
Utilizamos dos familias recomendadas que otorgan contraste y legibilidad para tablas financieras:
- **Satoshi**: Utilizado obligatoriamente para encabezados grandes, títulos y los grandes montos de dinero (display numérico tabular).
- **DM Sans**: Destinado a bloques de texto largos, cuerpos, meta-datos y campos de ayuda en formularios de menor tamaño.

### 4. Componentes UI Base Listos para Migrar
- **Amount Inputs (Entradas de Dinero)**: Textos hiperlegibles enormes inspirados en Wise, con divisores custom y selectores de moneda.
- **Formularios Dinámicos**: Cuentan con estados `.err` (rojo) y `.ok` (verde) además de transiciones suaves para inputs seleccionados o deshabilitados.
- **Botones y Modales**: Con interacciones hápticas, clases de carga o espera (`.loading` con spinners) y confirmaciones directas.
- **Layouts y Cards**: Listas limpias para historial de transacciones, divisiones/desgloses, o "Hero cards" pensadas para mostrar balance total con sombras de impacto.

---

## 🛠 Cómo Utilizar en tu Próximo Proyecto

El objetivo de este repositorio es transicionar la estructura maquetada plana a una aplicación en formato framework (React, Vue, Svelte o Vanilla JS refinado).

Para consumirlo:
1. Extrae las variables desde `:root` en `quadra-ds-v7.html` hacia el archivo universal de estilos (`index.css` / `global.css`).
2. Replantea los bloques HTML visualizados en el DS como componentes aislados de tu framework (Ej. `<TransactionRow />`, `<HeroCard />`, `<AmountInput />`).
3. Disfruta de una base que ya tiene contemplados los Breakpoints, Responsive Design y Dark Mode de un plumazo.