# Quadra App

Aplicación PWA financiera construida con React y Vite, utilizando el Quadra Design System.

## Arquitectura
- **Framework**: React 19 + Vite
- **Gestión de Estado**: Zustand
- **Backend / Auth**: Supabase
- **Estilos**: Vanilla CSS con variables de diseño (Tokens) centralizados
- **PWA**: Habilitado mediante `vite-plugin-pwa`

## Instalación y Ejecución Local

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configuración de Variables de Entorno:**
   Copia el archivo `.env.example` a `.env.local` y configura tus credenciales de Supabase:
   ```env
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-key
   ```

3. **Configurar la Base de Datos:**
   Dentro de la carpeta `docs/` se encuentra el archivo `esquema_bd.sql`. Debes ejecutar este script en el *SQL Editor* de tu proyecto en Supabase para crear las tablas necesarias y sus políticas de seguridad (RLS).

4. **Levantar el Servidor de Desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación se expondrá localmente (por defecto en el puerto 5173).

## Uso del Design System
El diseño está centralizado. Sigue estas reglas al crear nuevas vistas:
- **No escribas CSS ad-hoc por componente.** 
- Todo el layout principal utiliza las clases del shell: `.q-phone`, `.q-body`, etc.
- Todas las tarjetas y listas usan las clases globales en `src/styles/components.css` (`.card`, `.tx-row`, `.hero-card`, etc).
- Usa los tokens de `src/styles/tokens.css` para cualquier color o espaciado (ej. `var(--volt)`, `var(--s4)`).
- Revisa el archivo `quadra-ds-v10.html` en la raíz del proyecto para explorar el catálogo visual completo.

## Estructura de Directorios
- `src/components/ui/`: Elementos interactivos independientes (`AmountField`, `Toast`, `Icons`).
- `src/components/layout/`: Elementos estructurales y de navegación (`Header`, `BottomNav`).
- `src/components/screens/`: Flujos de vistas principales (`auth`, `tab1`, `tab2`, etc.).
- `src/styles/`: Archivos globales de CSS y sistema de diseño.
