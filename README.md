# HogarXpress Estructuras 2026-1

HogarXpress es una plataforma de gestion inmobiliaria con backend en Spring Boot y frontend en React. El proyecto combina persistencia relacional con MariaDB y estructuras de datos propias implementadas en Java para resolver procesos de catalogo, atencion comercial, monitoreo, analitica y seguimiento de clientes.

## Vision General

El sistema esta organizado como una aplicacion web administrativa y de cliente:

- El backend expone una API REST bajo `/api`.
- El frontend consume esa API desde servicios centralizados en `frontend/src/services`.
- La autenticacion usa tokens persistidos en base de datos.
- El catalogo de inmuebles puede consultarse como invitado sin iniciar sesion.
- El asesor virtual usa IA para orientar busquedas y responder preguntas sobre el catalogo.
- El registro de cliente puede enviar un correo real de bienvenida por SMTP.
- Las reglas de negocio se implementan en servicios Java.
- Las colecciones criticas del dominio usan estructuras propias antes de devolver arreglos JSON al frontend.

```text
HogarXpress/
|-- backend/   API REST, persistencia, seguridad y estructuras propias
`-- frontend/  interfaz React con rutas protegidas por rol
```

## Stack

Backend:

- Java 21
- Spring Boot 4
- Spring Web MVC
- Spring Security
- Spring JDBC
- Spring Mail
- MariaDB
- Gradle Wrapper

Frontend:

- React 19
- React Router
- Vite 8
- Axios

## Diseno Backend

El backend sigue una arquitectura por capas:

- `controller`: define rutas HTTP y traduce solicitudes/respuestas.
- `service`: contiene reglas de negocio, validaciones y uso de estructuras.
- `repository`: accede a MariaDB con `JdbcTemplate`.
- `model`: representa entidades del dominio.
- `dto`: objetos de respuesta o entrada para flujos especificos.
- `estructuras`: implementaciones propias de listas, colas, arboles, tablas hash, pilas y grafos.
- `config` y `security`: CORS, autorizacion por rol y validacion de token.

Flujo base:

```text
React page -> frontend service -> API REST -> controller -> service -> repository -> MariaDB
                                              |
                                              `-> estructura propia segun caso de uso
```

Flujo de IA:

```text
Widget asesor virtual -> POST /api/ia/chat -> AsistenteVirtualService
                                           |-> catalogo de inmuebles disponibles
                                           `-> proveedor IA si esta configurado
```

## Modulos Funcionales

### Inmuebles

Gestiona catalogo, disponibilidad, finalidad, precios, area y asesor responsable. En el frontend administrativo el codigo del inmueble se genera automaticamente con formato `INM-###`; tipo, finalidad, zona, estado y asesor responsable se seleccionan desde controles guiados. El asesor responsable se filtra segun la zona comercial seleccionada.

Rutas principales:

- `GET /api/inmuebles`
- `GET /api/inmuebles/{codigo}`
- `POST /api/inmuebles`
- `PUT /api/inmuebles/{codigo}`
- `DELETE /api/inmuebles/{codigo}`

Estructuras usadas:

- `LinkedSimpleList<Inmueble>` para cargar y recorrer registros desde repositorio.
- `ArbolPrecioInmuebles` para consultas por rango de precio.
- `ArbolBinarioBusqueda<InmuebleOrdenadoDTO>` para ordenamientos comerciales.
- `LinkedCircularDoubleList<Inmueble>` para carrusel de inmuebles destacados.

### Personas

Agrupa clientes, asesores y rotacion de asesores.

En el frontend administrativo los identificadores de clientes y asesores se generan automaticamente con formato `CLI-###` y `ASE-###`. Los formularios usan listas guiadas para tipo de cliente, zona de interes, tipo de inmueble deseado, estado de busqueda y especialidad de zona.

Rutas principales:

- `GET /api/clientes`
- `GET /api/clientes/{id}`
- `GET /api/asesores`
- `GET /api/asesores/{id}`
- `GET /api/rotacion-asesores`

Estructuras usadas:

- `LinkedSimpleList<Cliente>` y `LinkedSimpleList<Asesor>` para listados y recorridos.
- `LinkedCircularSimpleList<Asesor>` para asignacion rotativa de asesores.

### Visitas

Gestiona agenda comercial, reprogramaciones, cancelaciones y estados de visita.

Rutas principales:

- `GET /api/visitas`
- `GET /api/visitas/estado/{estado}`
- `POST /api/visitas`
- `POST /api/visitas/agendar`
- `PUT /api/visitas/{id}/reprogramar`
- `PUT /api/visitas/{id}/cancelar`

Estructuras usadas:

- `LinkedSimpleList<Visita>` para listar, filtrar y validar visitas.

### Solicitudes

Registra solicitudes de atencion, visitas, compra, arriendo e informacion. Este modulo persiste en la tabla `solicitud_atencion`.

Rutas principales:

- `GET /api/solicitudes`
- `GET /api/solicitudes/cliente/{idCliente}`
- `GET /api/solicitudes/estado/{estado}`
- `GET /api/solicitudes/pendientes`
- `GET /api/solicitudes/prioritarias`
- `POST /api/solicitudes`
- `POST /api/solicitudes/cola/recargar`
- `POST /api/solicitudes/cola/procesar`
- `POST /api/solicitudes/cola-prioridad/procesar`
- `PATCH /api/solicitudes/{id}/estado`
- `PATCH /api/solicitudes/{id}/asesor`

Estructuras usadas:

- `LinkedSimpleList<SolicitudAtencion>` para resultados persistidos desde MariaDB.
- `Cola<SolicitudAtencion>` para solicitudes pendientes en orden FIFO.
- `ColaPrioridad<SolicitudAtencion>` para solicitudes con prioridad alta.

### Operaciones y Contratos

Operaciones registra procesos de venta/arriendo. Contratos gestiona estado contractual, vencimientos y contratos proximos a vencer. Los contratos persisten en la tabla `contrato`.

Rutas principales:

- `GET /api/operaciones`
- `POST /api/operaciones`
- `GET /api/contratos`
- `GET /api/contratos/estado/{estado}`
- `GET /api/contratos/proximos-vencer`
- `GET /api/contratos/vencidos`
- `POST /api/contratos`
- `PATCH /api/contratos/{id}/estado`

Estructuras usadas:

- Arreglos tipados para interoperabilidad JSON en operaciones.
- `LinkedSimpleList<Contrato>` en repositorio y servicio de contratos.
- Reglas de vencimiento calculadas en `ContratoService`.

### Monitoreo

Agrupa alertas, eventos inusuales, motor de alertas comerciales y validaciones de negocio.

Rutas principales:

- `GET /api/alertas`
- `GET /api/eventos-inusuales`
- `GET /api/motor-alertas`
- `GET /api/motor-alertas/contratos-proximos`
- `GET /api/motor-alertas/contratos-vencidos`
- `GET /api/motor-alertas/solicitudes-prioritarias`
- `POST /api/validaciones`
- `GET /api/validaciones/consistencia-general`

Estructuras usadas:

- `Cola` y `ColaPrioridad` en gestion de alertas/solicitudes.
- `LinkedSimpleList<AlertaComercialDTO>` para generar alertas comerciales.
- `TablaHashPropia<String, String>` para evitar procesar clientes o inmuebles repetidos en el motor de alertas.

### Analitica y Busqueda

Agrupa reportes, analisis de relaciones y busqueda rapida.

Rutas principales:

- `GET /api/reportes/resumen`
- `GET /api/grafos/resumen`
- `GET /api/grafos/nodos`
- `GET /api/grafos/relaciones`
- `GET /api/busqueda-hash/clientes/{idCliente}`
- `GET /api/busqueda-hash/inmuebles/{codigoInmueble}`
- `GET /api/busqueda-hash/asesores/{idAsesor}`

Estructuras usadas:

- `TablaHash` para agregaciones y reportes.
- `TablaHashPropia` para busquedas directas por clave.
- `GrafoNoDirigido` para relaciones entre clientes, inmuebles, asesores y zonas.

### Favoritos e Historial

Permite guardar inmuebles de interes y consultar actividad del cliente.

Rutas principales:

- `GET /api/clientes/{clienteId}/favoritos`
- `POST /api/clientes/{clienteId}/favoritos/{codigoInmueble}`
- `DELETE /api/clientes/{clienteId}/favoritos/{codigoInmueble}`
- `GET /api/clientes/{clienteId}/historial`
- `GET /api/clientes/{clienteId}/historial/reverso`

Estructuras usadas:

- `LinkedSimpleList<Inmueble>` para favoritos.
- `LinkedDoubleList<Interaccion>` para historial.
- `Pila` para navegacion inversa de historial de inmuebles.

### Asistente Virtual IA y Correo

El sistema incluye un asesor virtual visible desde el frontend. Puede responder como invitado o como usuario autenticado, usa el catalogo real como contexto y recomienda inmuebles disponibles sin inventar datos. Si no hay API key configurada, responde con una logica local de respaldo para mantener el proyecto operativo.

Rutas principales:

- `POST /api/ia/chat`
- `POST /api/auth/register-cliente`

Servicios principales:

- `AsistenteVirtualService`: construye el contexto inmobiliario, invoca el proveedor IA cuando esta activo y genera respuestas de respaldo.
- `CorreoBienvenidaService`: envia correo HTML de bienvenida cuando el registro de cliente termina correctamente y SMTP esta configurado.

DTOs principales:

- `AsistenteVirtualRequest`
- `AsistenteVirtualResponse`
- `ChatMessageDTO`

### Simulación de Crecimiento de Demanda (RA7)

Módulo avanzado que simula y proyecta el crecimiento de demanda por sector/zona utilizando análisis predictivo basado en datos históricos.

Rutas principales:

- `GET /api/simulacion-demanda/zonas` - Simular demanda para todas las zonas
- `GET /api/simulacion-demanda/zona/{zona}` - Proyección específica por zona
- `GET /api/simulacion-demanda/resumen` - Resumen general del mercado

Servicios principales:

- `SimulacionDemandaService`: calcula proyecciones, tasas de crecimiento y recomendaciones estratégicas basadas en:
  - Demanda histórica (visitas por zona)
  - Operaciones realizadas (cierre de ventas/arriendos)
  - Disponibilidad de inmuebles
  - Análisis de precios promedio

Algoritmo de predicción:

- Regresión lineal simple para proyectar tendencias
- Cálculo de tasa de crecimiento: (operaciones / demanda histórica) × 100
- Proyección de 3 meses usando la tasa de crecimiento
- Clasificación de tendencias: CRECIMIENTO ACELERADO, MODERADO, ESTABLE, DESCENSO

DTOs principales:

- `ProyeccionDemandaDTO` - Análisis detallado por zona
- `ResumenSimulacionDemandaDTO` - Agregación global del mercado

Estructuras usadas:

- `TablaHash` para agrupar y contar inmuebles por zona
- Lógica de análisis sin estructuras adicionales para mantener eficiencia

## Uso de Estructuras Propias

Las estructuras propias se encuentran en:

```text
backend/src/main/java/co/edu/uniquindio/backend/estructuras
```

Resumen de uso:

| Estructura | Uso principal | Modulos |
| --- | --- | --- |
| `LinkedSimpleList<T>` | Listados desde repositorios, recorridos y conversion a arreglos de salida | Inmuebles, clientes, asesores, visitas, contratos, solicitudes |
| `LinkedDoubleList<T>` | Historial con recorrido en ambos sentidos | Historial de cliente |
| `LinkedCircularSimpleList<T>` | Rotacion secuencial circular | Asesores |
| `LinkedCircularDoubleList<T>` | Navegacion adelante/atras | Carrusel de inmuebles |
| `Cola<T>` | Atencion FIFO | Solicitudes pendientes |
| `ColaPrioridad<T>` | Atencion prioritaria | Solicitudes de alta prioridad |
| `ArbolBinarioBusqueda<T>` | Ordenamiento por criterio comparable | Organizacion de inmuebles |
| `ArbolPrecioInmuebles` | Consulta por rango de precio | Rangos de precio |
| `TablaHash<K,V>` | Agregaciones para reportes | Reportes |
| `TablaHashPropia<K,V>` | Busqueda por clave y control de duplicados | Busqueda rapida, motor de alertas |
| `GrafoNoDirigido` | Relaciones entre entidades | Analisis comercial |
| `Pila<T>` | Consulta inversa de actividad | Historial |

## Criterio de Diseno para las Estructuras

El proyecto usa estructuras propias cuando aportan una operacion clara al negocio:

- Lista simple: recorrer datos persistidos sin depender de `ArrayList` como estructura principal.
- Lista doble: permitir historial normal y reverso.
- Lista circular: mantener ciclos de asignacion o navegacion.
- Cola: procesar solicitudes en orden de llegada.
- Cola de prioridad: atender primero solicitudes de mayor importancia.
- Arbol: ordenar y filtrar inmuebles por precio o demanda.
- Hash: acceder rapidamente por clave y contar elementos sin busqueda lineal.
- Grafo: representar relaciones comerciales entre clientes, inmuebles, asesores y zonas.

Los controladores devuelven arreglos tipados o DTOs para que Jackson entregue JSON normal al frontend. La estructura propia se conserva en repositorios/servicios, y la capa HTTP solo adapta la salida.

## Diseno Frontend

El frontend esta organizado por rutas protegidas y modulos agrupados:

- `Sidebar`: muestra accesos segun rol.
- `AppRouter`: declara rutas y protege vistas.
- `services/api.js`: configura Axios con base URL `/api` y token Bearer.
- `services/asistenteVirtualService.js`: consume el endpoint del asesor virtual.
- `components/AsistenteVirtualChat.jsx`: muestra el chat flotante global.
- `pages`: contiene vistas administrativas y de cliente.
- `utils/formOptions.js`: centraliza opciones de formularios para zonas, tipos, finalidades y estados.
- `utils/idGenerator.js`: genera el siguiente codigo visible para clientes, asesores e inmuebles.

Modulos de administrador:

- Panel principal
- Inmuebles
- Personas
- Comercial
- Monitoreo
- Analitica

Modulos de cliente:

- Inicio
- Catalogo
- Mi actividad
- Mis solicitudes

Modo invitado:

- La ruta `/descubrir-inmuebles` permite explorar el catalogo sin iniciar sesion.
- Los invitados pueden ver y filtrar inmuebles.
- Los invitados pueden usar el asesor virtual para preguntar por inmuebles, zonas y presupuesto.
- Guardar favoritos, crear solicitudes, pedir visitas, comprar, arrendar o consultar actividad requiere cuenta de cliente.

## Seguridad

La seguridad vive en `SecurityConfig` y `TokenAuthenticationFilter`.

Reglas principales:

- `/api/auth/login` y `/api/auth/register-cliente` son publicos.
- `POST /api/ia/chat` es publico para que invitados puedan conversar con el asesor virtual.
- `GET /api/inmuebles/**` y `GET /api/ordenamientos/**` son publicos para soportar el catalogo en modo invitado.
- Carrusel, recomendaciones, rangos de precio, favoritos, historial y solicitudes requieren autenticacion.
- Rutas administrativas como contratos, reportes, motor de alertas y validaciones requieren rol `ADMIN`.
- Solicitudes quedan autenticadas para permitir flujos de cliente y administracion.
- El token se guarda en `auth_token` y se valida en cada solicitud.

Usuarios semilla:

- `admin` / `Admin123*`
- `cliente1` / `Cliente123*`
- `cliente2` / `Cliente123*`

## Configuracion de IA y Correo

La IA y el correo estan listos para servicios reales, pero se activan por variables de entorno para no guardar claves en el repositorio.

La forma recomendada en Windows es editar el archivo local:

```text
backend/.env.local
```

Ese archivo esta ignorado por Git. Puedes tomar como guia `backend/.env.example`. Despues inicia el backend con:

```powershell
cd backend
.\run-local.ps1
```

IA:

```powershell
$env:AI_ENABLED="true"
$env:OPENAI_API_KEY="tu_api_key"
$env:AI_MODEL="gpt-4.1-mini"
```

Correo SMTP:

```powershell
$env:MAIL_ENABLED="true"
$env:MAIL_HOST="smtp.gmail.com"
$env:MAIL_PORT="587"
$env:MAIL_USERNAME="tu_correo@gmail.com"
$env:MAIL_PASSWORD="tu_app_password"
$env:MAIL_FROM="tu_correo@gmail.com"
```

Si `AI_ENABLED` esta apagado o falta la API key, el asesor virtual usa respuesta local. Si `MAIL_ENABLED` esta apagado o faltan datos SMTP, el registro funciona normal pero no envia correo.

Para probar solo el correo, sin registrar un cliente:

```powershell
cd backend
.\test-mail.ps1
```

El script envia un correo de prueba al `MAIL_USERNAME` configurado. Tambien puedes indicar otro destinatario:

```powershell
.\test-mail.ps1 -To cliente@correo.com
```

Para probar solo la API de OpenAI:

```powershell
cd backend
.\test-openai.ps1
```

Si OpenAI responde `429 Too Many Requests`, la clave puede estar correcta, pero falta saldo/facturacion, se alcanzo un limite del proyecto o el modelo configurado no tiene disponibilidad para esa cuenta.

## Persistencia

El esquema se define en:

```text
backend/src/main/resources/schema.sql
```

Datos iniciales:

```text
backend/src/main/resources/data.sql
```

Tablas principales:

- `inmueble`
- `cliente`
- `asesor`
- `visita`
- `favorito`
- `interaccion`
- `auth_usuario`
- `auth_token`
- `operaciones`
- `contrato`
- `solicitud_atencion`
- `alertas`
- `eventos_inusuales`

## Documentacion JavaDoc

La documentacion navegable de clases y estructuras se genera desde el backend:

```powershell
cd backend
.\gradlew.bat javadoc
```

El archivo principal queda en:

```text
backend/build/docs/javadoc/index.html
```

Alli se pueden revisar los paquetes, servicios y estructuras propias. Las
clases principales incluyen la justificacion de uso de listas, colas, arboles,
tablas hash, grafos y pilas dentro de los flujos del sistema.

## Ejecucion

Backend:

```powershell
cd backend
.\gradlew.bat bootRun
```

Frontend:

```powershell
cd frontend
npm install
npm run dev
```

Verificaciones utiles:

```powershell
cd backend
.\gradlew.bat test
```

```powershell
cd frontend
npm run build
```

## Observaciones Tecnicas

- `spring.sql.init.mode=always` ejecuta `schema.sql` y `data.sql` al iniciar.
- La configuracion actual apunta a MariaDB en `localhost:3306/inmobiliaria_db`.
- Las respuestas HTTP convierten estructuras propias a arreglos cuando el frontend necesita JSON de lista.
- La contrasena de base de datos esta en `application.properties`; para despliegue conviene moverla a variables de entorno.
