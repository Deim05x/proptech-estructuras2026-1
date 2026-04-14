# Frontend

Este directorio contiene la aplicación cliente del proyecto, construida con React + Vite.

## Stack

- React 19
- Vite 8
- ESLint 9

## Scripts disponibles

```powershell
npm install
npm run dev
npm run build
npm run lint
npm run preview
```

## Estado actual

En el estado actual del repositorio, el frontend todavía está en una fase inicial:

- [src/main.jsx](/c:/Users/mateo/OneDrive/Documents/proptech-estructuras2026-1/frontend/src/main.jsx) monta `App.jsx`.
- [src/App.jsx](/c:/Users/mateo/OneDrive/Documents/proptech-estructuras2026-1/frontend/src/App.jsx) conserva la interfaz base de la plantilla de Vite/React.
- Existen carpetas para `pages`, `components`, `router` y `services`, preparadas para la construcción de la interfaz del sistema.
- Varios archivos de esas carpetas están vacíos y aún no contienen lógica funcional.

## Estructura base

```text
frontend/
|-- public/
|-- src/
|   |-- components/
|   |-- pages/
|   |-- router/
|   |-- services/
|   |-- App.jsx
|   `-- main.jsx
|-- package.json
`-- vite.config.js
```

## Objetivo esperado

La estructura creada sugiere una futura interfaz para:

- dashboard
- inmuebles
- clientes
- asesores
- visitas
- alertas
- operaciones

Sin embargo, esa navegación todavía no está implementada ni conectada al backend.

## Relación con el backend

La API del proyecto vive en `backend/` y se ejecuta por defecto en:

```text
http://localhost:8080
```

Cuando el frontend evolucione, la carpeta `src/services` puede centralizar las llamadas HTTP hacia esa API.
