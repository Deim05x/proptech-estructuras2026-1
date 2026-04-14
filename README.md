# PropTech Estructuras 2026-1

Proyecto con arquitectura separada en `backend` y `frontend` para la gestión básica de una inmobiliaria. El backend expone una API REST construida con Spring Boot y persiste la información en MariaDB usando `JdbcTemplate`. El frontend está creado con React + Vite, pero en el estado actual del repositorio todavía conserva principalmente la plantilla base y no consume la API.

## Estructura del repositorio

```text
proptech-estructuras2026-1/
|-- backend/   API REST, acceso a datos y estructuras de listas propias
`-- frontend/  aplicación React inicial basada en Vite
```

## Estado actual del proyecto

- `backend`: implementado y con endpoints REST para inmuebles, clientes, asesores, visitas, favoritos e historial de interacciones.
- `frontend`: inicializado, pero todavía sin páginas funcionales conectadas al backend.
- Base de datos: el proyecto está configurado para trabajar con MariaDB en `localhost:3306/inmobiliaria_db`.
- Datos semilla: el backend carga esquema y registros iniciales desde `schema.sql` y `data.sql`.

## Tecnologías usadas

### Backend

- Java 21
- Spring Boot 4.0.5
- Spring Web MVC
- Spring JDBC
- MariaDB Java Client 3.5.7
- Gradle Wrapper

### Frontend

- React 19
- Vite 8
- ESLint 9

## Cómo ejecutar el proyecto

## 1. Backend

Requisitos:

- Java 21
- MariaDB en ejecución
- Base de datos `inmobiliaria_db` creada

Configuración actual en [backend/src/main/resources/application.properties](/c:/Users/mateo/OneDrive/Documents/proptech-estructuras2026-1/backend/src/main/resources/application.properties):

```properties
server.port=8080
spring.datasource.url=jdbc:mariadb://localhost:3306/inmobiliaria_db
spring.datasource.username=root
spring.datasource.password=110426
```

Ejecución:

```powershell
cd backend
.\gradlew.bat bootRun
```

La API quedará disponible en:

```text
http://localhost:8080
```

## 2. Frontend

Requisitos:

- Node.js
- npm

Ejecución:

```powershell
cd frontend
npm install
npm run dev
```

La app de desarrollo normalmente quedará disponible en:

```text
http://localhost:5173
```

## Backend

## Arquitectura

El backend sigue una organización por capas:

- `controller`: expone endpoints HTTP.
- `service`: contiene validaciones y reglas básicas de negocio.
- `repository`: ejecuta consultas SQL con `JdbcTemplate`.
- `model`: representa las entidades del dominio.
- `dto`: requests específicos para acciones como reprogramar o cancelar visitas.
- `estructuras`: implementaciones propias de listas enlazadas usadas por los repositorios y servicios.

## Estructuras de datos propias

Una de las ideas centrales del proyecto es usar estructuras implementadas manualmente en lugar de depender solo de colecciones estándar:

- `LinkedSimpleList`: usada para listar inmuebles, clientes, asesores y visitas.
- `LinkedDoubleList`: usada para el historial de interacciones.
- `LinkedCircularSimpleList`: usada en la rotación de asesores.
- También existen implementaciones circulares dobles e iteradores asociados.

Estas estructuras están ubicadas en [backend/src/main/java/co/edu/uniquindio/backend/estructuras](/c:/Users/mateo/OneDrive/Documents/proptech-estructuras2026-1/backend/src/main/java/co/edu/uniquindio/backend/estructuras).

## Módulos principales del backend

### Inmuebles

Archivo principal: [backend/src/main/java/co/edu/uniquindio/backend/controller/InmuebleController.java](/c:/Users/mateo/OneDrive/Documents/proptech-estructuras2026-1/backend/src/main/java/co/edu/uniquindio/backend/controller/InmuebleController.java)

Responsabilidades:

- listar inmuebles
- consultar un inmueble por código
- crear, actualizar y eliminar inmuebles

Ruta base:

```text
/api/inmuebles
```

### Clientes

Archivo principal: [backend/src/main/java/co/edu/uniquindio/backend/controller/ClienteController.java](/c:/Users/mateo/OneDrive/Documents/proptech-estructuras2026-1/backend/src/main/java/co/edu/uniquindio/backend/controller/ClienteController.java)

Responsabilidades:

- listar clientes
- consultar un cliente por id
- crear, actualizar y eliminar clientes

Ruta base:

```text
/api/clientes
```

### Asesores

Archivo principal: [backend/src/main/java/co/edu/uniquindio/backend/controller/AsesorController.java](/c:/Users/mateo/OneDrive/Documents/proptech-estructuras2026-1/backend/src/main/java/co/edu/uniquindio/backend/controller/AsesorController.java)

Responsabilidades:

- listar asesores
- consultar un asesor por id
- crear, actualizar y eliminar asesores

Ruta base:

```text
/api/asesores
```

### Visitas

Archivo principal: [backend/src/main/java/co/edu/uniquindio/backend/controller/VisitaController.java](/c:/Users/mateo/OneDrive/Documents/proptech-estructuras2026-1/backend/src/main/java/co/edu/uniquindio/backend/controller/VisitaController.java)

Responsabilidades:

- listar visitas
- filtrar visitas por estado
- agendar visitas
- reprogramar visitas
- cancelar visitas
- actualizar y eliminar visitas

Ruta base:

```text
/api/visitas
```

## Favoritos e historial

Archivo principal: [backend/src/main/java/co/edu/uniquindio/backend/controller/FavoritoController.java](/c:/Users/mateo/OneDrive/Documents/proptech-estructuras2026-1/backend/src/main/java/co/edu/uniquindio/backend/controller/FavoritoController.java)

Responsabilidades:

- consultar favoritos de un cliente
- agregar y eliminar favoritos
- consultar historial de interacciones normal y en reverso

Rutas principales:

```text
/api/clientes/{clienteId}/favoritos
/api/clientes/{clienteId}/historial
/api/clientes/{clienteId}/historial/reverso
```

## Rotación de asesores

Servicio relevante: [backend/src/main/java/co/edu/uniquindio/backend/service/RotacionAsesorService.java](/c:/Users/mateo/OneDrive/Documents/proptech-estructuras2026-1/backend/src/main/java/co/edu/uniquindio/backend/service/RotacionAsesorService.java)

El proyecto incluye una rueda de asesores basada en lista circular simple para:

- recargar la rueda desde base de datos
- consultar el orden actual
- obtener el siguiente asesor
- reiniciar la rotación

Actualmente este servicio está implementado a nivel de servicio y puede ser reutilizado desde futuras rutas o flujos de asignación.

## Endpoints disponibles

### Inmuebles

- `GET /api/inmuebles/test`
- `GET /api/inmuebles`
- `GET /api/inmuebles/{codigo}`
- `POST /api/inmuebles`
- `PUT /api/inmuebles/{codigo}`
- `DELETE /api/inmuebles/{codigo}`

### Clientes

- `GET /api/clientes/test`
- `GET /api/clientes`
- `GET /api/clientes/{id}`
- `POST /api/clientes`
- `PUT /api/clientes/{id}`
- `DELETE /api/clientes/{id}`

### Asesores

- `GET /api/asesores/test`
- `GET /api/asesores`
- `GET /api/asesores/{id}`
- `POST /api/asesores`
- `PUT /api/asesores/{id}`
- `DELETE /api/asesores/{id}`

### Visitas

- `GET /api/visitas/test`
- `GET /api/visitas`
- `GET /api/visitas/estado/{estado}`
- `GET /api/visitas/{id}`
- `POST /api/visitas`
- `POST /api/visitas/agendar`
- `PUT /api/visitas/{id}`
- `PUT /api/visitas/{id}/reprogramar`
- `PUT /api/visitas/{id}/cancelar`
- `DELETE /api/visitas/{id}`

### Favoritos e historial

- `GET /api/clientes/{clienteId}/favoritos`
- `POST /api/clientes/{clienteId}/favoritos/{codigoInmueble}`
- `DELETE /api/clientes/{clienteId}/favoritos/{codigoInmueble}`
- `GET /api/clientes/{clienteId}/historial`
- `GET /api/clientes/{clienteId}/historial/reverso`

## Modelo de datos

Definido en [backend/src/main/resources/schema.sql](/c:/Users/mateo/OneDrive/Documents/proptech-estructuras2026-1/backend/src/main/resources/schema.sql).

Tablas principales:

- `inmueble`
- `cliente`
- `asesor`
- `visita`
- `favorito`
- `interaccion`

## Datos iniciales

Definidos en [backend/src/main/resources/data.sql](/c:/Users/mateo/OneDrive/Documents/proptech-estructuras2026-1/backend/src/main/resources/data.sql).

El proyecto inserta registros de ejemplo para:

- 2 inmuebles
- 2 clientes
- 2 asesores
- 2 visitas
- favoritos e interacciones iniciales

## Frontend

El frontend está creado con React y Vite, pero actualmente no representa todavía la solución funcional del negocio.

Estado actual:

- `src/main.jsx` renderiza `App.jsx`
- `src/App.jsx` conserva la plantilla de inicio de Vite/React
- las carpetas `pages`, `components`, `router` y `services` existen como base para evolución futura
- varios archivos dentro de esas carpetas están vacíos en este momento

Esto significa que la mayor parte de la lógica implementada hoy está en el backend.

## Observaciones importantes

- El backend usa `spring.sql.init.mode=always`, por lo que intenta ejecutar `schema.sql` y `data.sql` al iniciar.
- La contraseña de base de datos está escrita directamente en configuración. Para un siguiente paso recomendable, convendría moverla a variables de entorno o a un archivo no versionado.
- En `backend/data/` existe un archivo `inmobiliaria_db.mv.db`, pero la configuración activa apunta a MariaDB, no a H2.
- Algunos textos con tildes en respuestas HTTP y datos semilla muestran problemas de codificación. La documentación conserva el comportamiento actual, pero ese detalle podría corregirse después sin cambiar reglas de negocio.

## Próximos pasos sugeridos

- conectar el frontend con la API REST
- documentar ejemplos de payloads JSON para cada endpoint
- agregar pruebas de integración para servicios y controladores
- externalizar la configuración sensible de base de datos

