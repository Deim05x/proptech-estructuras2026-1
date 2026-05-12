# PropTech Estructuras 2026-1

PropTech es una plataforma de gestion inmobiliaria con backend en Spring Boot y frontend en React. El proyecto combina persistencia relacional con MariaDB y estructuras de datos propias implementadas en Java para resolver procesos de catalogo, atencion comercial, monitoreo, analitica y seguimiento de clientes.

## Vision General

El sistema esta organizado como una aplicacion web administrativa y de cliente:

- El backend expone una API REST bajo `/api`.
- El frontend consume esa API desde servicios centralizados en `frontend/src/services`.
- La autenticacion usa tokens persistidos en base de datos.
- Las reglas de negocio se implementan en servicios Java.
- Las colecciones criticas del dominio usan estructuras propias antes de devolver arreglos JSON al frontend.

```text
proptech-estructuras2026-1/
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

## Modulos Funcionales

### Inmuebles

Gestiona catalogo, disponibilidad, finalidad, precios, area y asesor responsable.

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
- `pages`: contiene vistas administrativas y de cliente.

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

## Seguridad

La seguridad vive en `SecurityConfig` y `TokenAuthenticationFilter`.

Reglas principales:

- `/api/auth/login` y `/api/auth/register-cliente` son publicos.
- Las rutas de consulta de catalogo requieren autenticacion.
- Rutas administrativas como contratos, reportes, motor de alertas y validaciones requieren rol `ADMIN`.
- Solicitudes quedan autenticadas para permitir flujos de cliente y administracion.
- El token se guarda en `auth_token` y se valida en cada solicitud.

Usuarios semilla:

- `admin` / `Admin123*`
- `cliente1` / `Cliente123*`
- `cliente2` / `Cliente123*`

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
