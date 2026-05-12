# Frontend PropTech

Aplicacion cliente construida con React + Vite para consumir la API del backend PropTech.

## Stack

- React 19
- React Router
- Axios
- Vite 8
- ESLint 9

## Scripts

```powershell
npm install
npm run dev
npm run build
npm run lint
npm run preview
```

## Diseno

La interfaz esta organizada por rutas protegidas y por rol:

- `src/router/AppRouter.jsx`: define rutas y permisos.
- `src/components/Sidebar.jsx`: muestra los modulos disponibles para administrador o cliente.
- `src/components/ProtectedRoute.jsx`: valida sesion y rol permitido.
- `src/services/api.js`: configura Axios con `http://localhost:8080/api` y token Bearer.
- `src/pages`: contiene las vistas funcionales.

## Modulos

Administrador:

- Panel principal
- Inmuebles
- Personas
- Comercial
- Monitoreo
- Analitica

Cliente:

- Inicio
- Catalogo
- Mi actividad
- Mis solicitudes

## Relacion con Estructuras del Backend

El frontend no implementa estructuras de datos propias. Su responsabilidad es presentar y operar los flujos que el backend resuelve con estructuras Java:

- Rangos de precio consume resultados generados con arbol de precios.
- Busqueda rapida consume resultados de tabla hash.
- Rotacion de asesores consume la rueda circular del backend.
- Solicitudes consume colas normal y prioritaria.
- Analisis de relaciones consume el grafo de relaciones.
- Historial consume recorridos de lista doble y pila.

El detalle completo esta documentado en el README principal del repositorio.
