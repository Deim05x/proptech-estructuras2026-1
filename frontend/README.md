# Frontend HogarXpress

Aplicacion cliente construida con React + Vite para consumir la API del backend HogarXpress.

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
- `src/components/AsistenteVirtualChat.jsx`: muestra el asesor virtual flotante.
- `src/services/api.js`: configura Axios con `http://localhost:8080/api` y token Bearer.
- `src/services/asistenteVirtualService.js`: envia preguntas al endpoint `/api/ia/chat`.
- `src/pages`: contiene las vistas funcionales.
- `src/utils/formOptions.js`: centraliza opciones compartidas para formularios.
- `src/utils/idGenerator.js`: calcula el siguiente codigo visible para registros administrativos.

El login y el registro usan una experiencia visual unificada con fondo inmobiliario, tarjetas glass y animaciones suaves. Desde el login se puede entrar como invitado al catalogo publico. El asesor virtual esta disponible de forma global para orientar busquedas y resolver preguntas sobre inmuebles.

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

Invitado:

- Descubrir inmuebles sin iniciar sesion.
- Filtrar y ordenar el catalogo.
- Conversar con el asesor virtual sobre zonas, presupuesto, tipo de inmueble y disponibilidad.
- Iniciar sesion o registrarse cuando quiera guardar favoritos, solicitar visitas o enviar intenciones comerciales.

## Asesor virtual

- El componente `AsistenteVirtualChat` se monta en `App.jsx`.
- El chat conserva historial corto en memoria mientras la vista esta abierta.
- Cada mensaje se envia a `POST /api/ia/chat`.
- Si la respuesta indica que la accion requiere cuenta, se muestran accesos a registro e inicio de sesion.
- Los codigos de inmuebles sugeridos abren el catalogo publico para continuar la exploracion.

## Formularios administrativos

- Clientes: el ID se genera automaticamente con formato `CLI-###`.
- Asesores: el ID se genera automaticamente con formato `ASE-###` y la especialidad se selecciona por zona.
- Inmuebles: el codigo se genera automaticamente con formato `INM-###`.
- Registro de inmuebles: tipo, finalidad, zona, estado y asesor responsable se seleccionan desde listas.
- El selector de asesor responsable muestra solo asesores cuya `especialidadZona` coincide con la zona elegida.

## Relacion con Estructuras del Backend

El frontend no implementa estructuras de datos propias. Su responsabilidad es presentar y operar los flujos que el backend resuelve con estructuras Java:

- Rangos de precio consume resultados generados con arbol de precios.
- Busqueda rapida consume resultados de tabla hash.
- Rotacion de asesores consume la rueda circular del backend.
- Solicitudes consume colas normal y prioritaria.
- Analisis de relaciones consume el grafo de relaciones.
- Historial consume recorridos de lista doble y pila.

El detalle completo esta documentado en el README principal del repositorio.
