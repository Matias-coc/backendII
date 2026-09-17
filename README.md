# Backend de Torneos e Inscripciones

API backend para gestión de torneos deportivos y de e-sports, con inscripción
de participantes. Proyecto del curso Backend II de Coderhouse.

## Temática
Plataforma de gestión de torneos (deportivos y e-sports), donde los
organizadores crean torneos y los usuarios se inscriben como participantes.

## Tecnologías
- Node.js
- Express
- MongoDB / Mongoose
- Passport.js (passport-local, passport-jwt)
- JWT (jsonwebtoken)
- bcrypt
- cookie-parser
- dotenv
- Nodemailer

## Instalación
1. Cloná el repositorio
2. Instalá las dependencias: `npm install`
3. Creá un archivo `.env` basado en `.env.example`
4. Iniciá el servidor: `npm run dev`

## Variables de entorno
- `PORT`: puerto del servidor
- `NODE_ENV`: entorno de ejecución
- `MONGO_URL`: string de conexión a MongoDB Atlas
- `JWT_SECRET`: clave secreta para firmar los JWT. **Obligatoria** — si falta,
  la aplicación no arranca y corta con un error explícito en consola, en
  vez de firmar tokens con una clave `undefined`.
- `JWT_EXPIRES_IN`: tiempo de expiración del token (ej. `1h`)
- `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS`, `MAIL_FROM`: credenciales
  del servicio de email (Nodemailer)

## Estructura de carpetas

src/
├── app.js
├── server.js
├── config/
│ ├── database.js
│ ├── passport.config.js
│ └── mailer.config.js
├── routes/
├── controllers/
├── services/
├── repositories/
├── dao/
├── models/
├── middlewares/
└── utils/

## Arquitectura en capas

El proyecto sigue una arquitectura en capas para separar responsabilidades:

Route → Controller → Service → Repository → DAO → Model

Y al responder:

Model → DAO → Repository → Service → DTO → Controller → Response


- **Routes**: definen los endpoints y qué middlewares/controlador se ejecutan.
  No contienen lógica.
- **Controllers**: extraen datos de `req` (body/params/query), llaman al
  service correspondiente y devuelven la respuesta. No importan modelos de
  Mongoose ni calculan reglas de negocio.
- **Services**: concentran toda la lógica de negocio (validación de cupos,
  estados, duplicados, fechas, permisos sobre recursos propios, envío de
  emails). Son los únicos que orquestan múltiples repositories.
- **Repositories**: capa intermedia orientada al dominio (`getUserByEmail`,
  `getActiveTicket`, etc.). Usan el DAO correspondiente, nunca importan
  modelos directamente.
- **DAO**: los únicos archivos que importan modelos de Mongoose directamente
  y ejecutan las operaciones reales contra MongoDB (`find`, `create`,
  `findByIdAndUpdate`, etc.).
- **DTO**: controlan qué datos viajan en la respuesta al cliente. Existen
  para usuario autenticado (`CurrentUserDTO`), evento (`EventResponseDTO`) y
  ticket (`TicketResponseDTO`). Ningún endpoint expone `password`, incluso
  cuando el documento viene con `.populate()` de otro documento relacionado.

  ### Correcciones de arquitectura aplicadas tras revisión
- El middleware `authorizeEventOwnerOrAdmin` consulta eventos a través de
  `repositories/events.repository.js`, no importa `EventModel` directamente.
- `cancelTicketService` persiste cambios a través de
  `repositories/tickets.repository.js` (`saveTicketUpdate`), no llama a
  `.save()` sobre el documento directamente.
- `events.controller.js` y `sessions.controller.js` ya no importan funciones
  de `repositories/` — pasan siempre por la capa `services`.

### Manejo de errores
Cada service lanza errores con un código interno (ej. `PAST_DATE`,
`FORBIDDEN`, `DUPLICATE_TICKET`). Los controllers traducen ese código a la
respuesta HTTP correcta usando un mapa de errores (`errorMap`), consistente
en `events.controller.js` y `tickets.controller.js`:

| Código interno | HTTP | Significado |
|---|---|---|
| `MISSING_FIELDS`, `INVALID_CAPACITY`, `INVALID_PRICE`, `PAST_DATE`, `INVALID_QUANTITY` | 400 | Datos inválidos |
| — (sin cookie/token) | 401 | No autenticado |
| `FORBIDDEN` | 403 | Sin permisos |
| `EVENT_NOT_FOUND`, `TICKET_NOT_FOUND` | 404 | No encontrado |
| `DUPLICATE_TICKET` | 409 | Conflicto |
| Error no mapeado | 500 | Error interno |

## Autenticación con Passport.js

El sistema de autenticación está centralizado en `src/config/passport.config.js`,
usando tres estrategias:

- **register** (`passport-local`): valida campos obligatorios, normaliza el
  email, verifica duplicados, hashea la contraseña con bcrypt y crea el
  usuario con rol `user` por defecto.
- **login** (`passport-local`): busca el usuario por email, compara la
  contraseña con bcrypt, y devuelve un mensaje genérico ("Credenciales
  inválidas") si el email o la contraseña no coinciden.
- **current** (`passport-jwt`): extrae el JWT desde la cookie `currentUser`,
  lo verifica y busca al usuario en la base de datos para confirmar que
  sigue existiendo.

Passport se inicializa en `app.js` con `passport.initialize()`, pero toda la
configuración de estrategias vive en `passport.config.js`, sin mezclarse con
la app principal. Esto deja el proyecto preparado para sumar en el futuro
providers externos (Google, GitHub, etc.) sin modificar `app.js`.

Después de una autenticación exitosa vía Passport, es el **controller** quien
genera el JWT y configura la cookie — Passport nunca genera tokens
directamente, solo valida usuarios.

La verificación de la estrategia `current` está centralizada en
`middlewares/auth.middleware.js` (`authenticateCurrent`), reutilizada en
todas las rutas protegidas que requieren sesión activa, en vez de repetir
`passport.authenticate('current', ...)` en cada router.

Las estrategias de `passport.config.js` no acceden a `UserModel`
directamente — consultan y crean usuarios a través de
`repositories/users.repository.js`, respetando la misma arquitectura en
capas del resto del proyecto.

## Roles y autorización

### Roles del sistema
- `user`: rol por defecto al registrarse. Puede consultar torneos e
  inscribirse a eventos.
- `organizer`: puede crear torneos y modificar/cancelar los propios.
- `admin`: acceso total, incluyendo gestión de usuarios y cualquier torneo.

El campo `role` tiene una validación `enum: ['user', 'organizer', 'admin']`
a nivel de modelo, para evitar que se persista cualquier valor inválido en
la base de datos.

El registro público (`POST /api/sessions/register`) siempre asigna `role: 'user'`,
sin importar qué se envíe en el body — los roles `organizer` y `admin` se
asignan manualmente en la base de datos.

### Matriz de permisos

| Acción | user | organizer | admin |
|---|---|---|---|
| Consultar torneos publicados | ✅ | ✅ | ✅ |
| Crear torneos | ❌ | ✅ | ✅ |
| Modificar/cancelar torneos propios | ❌ | ✅ | ✅ |
| Modificar cualquier torneo | ❌ | ❌ | ✅ |
| Ver todos los usuarios | ❌ | ❌ | ✅ |
| Inscribirse a un torneo | ✅ | ✅ | ✅ |
| Ver inscriptos de un torneo | ❌ | solo propios | ✅ |

### Diferencia entre 401 y 403
- **401 No autenticado**: no hay cookie, el token es inválido o expiró.
  El backend no sabe quién es el usuario.
- **403 Sin permisos**: el usuario está autenticado (el backend sabe quién
  es), pero su rol no le permite realizar esa acción.

### Autorización por propiedad de recursos

Además de la autorización por rol, el sistema valida que un `organizer` solo
pueda modificar los eventos que él mismo creó, y que un usuario solo pueda
cancelar sus propios tickets. Esta validación vive en
`middlewares/authorizeOwner.middleware.js` (para eventos) y directamente en
`services/tickets.service.js` (para tickets):

```js
const isAdmin = req.user.role === 'admin'
const isOwner = event.organizer.toString() === req.user._id.toString()

if (!isAdmin && !isOwner) {
    return res.status(403).json({ status: 'error', message: 'No tenés permisos sobre este evento' })
}
```

**Casos probados:**
- El dueño (Leo, organizer) editó su propio evento → 200
- Admin (Ana) editó un evento ajeno (creado por Leo) → 200 (permiso total)
- Un organizer distinto al dueño (Carlos) intentó editar un evento ajeno → 403
- Un usuario intentó cancelar el ticket de otro → 403

## Rutas disponibles

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| GET | /api/health | Verifica que el servidor está activo | Público |
| POST | /api/sessions/register | Registra un nuevo usuario | Público |
| POST | /api/sessions/login | Inicia sesión y setea cookie JWT | Público |
| GET | /api/sessions/current | Devuelve el usuario autenticado | Autenticado |
| POST | /api/sessions/logout | Cierra sesión (borra la cookie) | Público |
| GET | /api/sessions/users | Lista todos los usuarios | admin |
| POST | /api/events | Crea un torneo | organizer, admin |
| GET | /api/events | Lista torneos con filtros | Público |
| GET | /api/events/:id | Consulta un torneo puntual | Público |
| PUT | /api/events/:id | Modifica un torneo | dueño del evento o admin |
| PATCH | /api/events/:id/status | Cambia el estado de un torneo | dueño del evento o admin |
| POST | /api/events/:eid/tickets | Inscribe al usuario autenticado a un torneo | Autenticado |
| GET | /api/events/:eid/tickets | Lista inscriptos de un torneo | dueño del torneo o admin |
| GET | /api/tickets/my-tickets | Lista las inscripciones propias | Autenticado |
| PATCH | /api/tickets/:tid/cancel | Cancela una inscripción | dueño del ticket o admin |

### POST /api/sessions/register
Request:
```json
{ "first_name": "Ana", "last_name": "Pérez", "email": "ana@mail.com", "password": "Secreta123" }
```
Response 201:
```json
{ "status": "success", "message": "Usuario registrado correctamente", "payload": { "id": "...", "first_name": "Ana", "last_name": "Pérez", "email": "ana@mail.com", "role": "user" } }
```

### POST /api/sessions/login
Request:
```json
{ "email": "ana@mail.com", "password": "Secreta123" }
```
Response 200 (setea cookie `currentUser`, HttpOnly):
```json
{ "status": "success", "message": "Login correcto" }
```
Response 401 (credenciales inválidas):
```json
{ "status": "error", "message": "Credenciales inválidas" }
```

### GET /api/sessions/current
Requiere la cookie `currentUser`. Response 200:
```json
{ "status": "success", "payload": { "id": "...", "email": "ana@mail.com", "role": "user" } }
```
Response 401 (sin cookie o token inválido/expirado):
```json
{ "status": "error", "message": "No autenticado" }
```

### POST /api/sessions/logout
Response 200:
```json
{ "status": "success", "message": "Sesión cerrada" }
```

## Entidad Events

### Modelo
`title`, `description`, `category` (referencia a `Category`), `date`,
`location`, `capacity`, `price`, `status` (`draft`/`published`/`cancelled`/`finished`),
`organizer` (referencia a `User`, asignado automáticamente desde la sesión —
nunca desde el body), `discipline` (campo propio de la temática de torneos e-sports).

### Filtros disponibles (GET /api/events)
`status`, `category`, `location` (búsqueda parcial, insensible a mayúsculas),
`dateFrom`, `dateTo`, `page`, `limit` (máx. 50), `sort`. La respuesta incluye
`data`, `page`, `limit`, `total`, `totalPages`.

Ejemplo: `GET /api/events?status=published&category=65f1...&page=1&limit=5`

### Reglas de negocio (en la capa `services`)
- No se puede crear un evento con fecha pasada
- `capacity` debe ser mayor a 0; `price` no puede ser negativo
- Un evento cancelado no puede modificarse (ni con PUT ni con PATCH de estado)
- Cancelar un evento cambia su `status` a `cancelled`; nunca se elimina físicamente
- El campo `organizer` siempre se asigna desde `req.user`, nunca puede venir del body
- **En la actualización (`PUT /api/events/:id`), solo se aceptan campos de
  una lista blanca** (`title`, `description`, `category`, `date`, `location`,
  `capacity`, `price`, `discipline`) — cualquier otro campo enviado en el
  body (como `organizer` o `status`) se ignora. Los campos `date`,
  `capacity` y `price` se re-validan con las mismas reglas que en la
  creación.

## Entidad Ticket

### Modelo
`user` (referencia a `User`), `event` (referencia a `Event`), `status`
(`confirmed`/`pending`/`cancelled`), `quantity`, `reservationCode` (único,
generado automáticamente), `cancelledAt`. Solo referencias, sin objetos
embebidos completos.

### Flujo de inscripción (validaciones en `services`, no en el controller)
1. El evento debe existir
2. El evento debe estar en estado `published`
3. El evento no debe haber finalizado (fecha futura)
4. `quantity` debe ser un número mayor a 0
5. El usuario no puede tener ya un ticket activo (`confirmed`/`pending`) para ese evento
6. Debe haber cupo disponible: `capacity - tickets activos reservados ≥ quantity`

### Regla de cupos
Los cupos ocupados se calculan sumando `quantity` de todos los tickets con
estado `confirmed` o `pending` para ese evento. Los tickets `cancelled`
**no** cuentan para el cupo — por eso cancelar un ticket libera lugar
automáticamente para nuevas inscripciones, sin necesidad de modificar el
evento manualmente.

### Cancelación
Cambia `status` a `cancelled` y registra `cancelledAt`. **Nunca se elimina
el documento** — se conserva el historial completo. Antes de cancelar, se
valida que el ticket exista, que pertenezca al solicitante (o que sea
`admin`), y que no esté ya cancelado.

### Notificaciones con Nodemailer
Se envía un email de confirmación al crear un ticket, y uno de cancelación
al cancelarlo. En este proyecto se usa **Ethereal** (servicio de testing de
Nodemailer) para no enviar correos reales durante el desarrollo — los
emails se pueden previsualizar desde la URL que devuelve
`nodemailer.getTestMessageUrl()`, impresa en consola tras cada envío.

## Pruebas realizadas

**Sesiones:**
- Registro exitoso → login → /current (200) → logout → /current (401) ✅
- Registro con email duplicado → 409 ✅
- Login con credenciales inválidas → 401 ✅
- /current sin cookie → 401 ✅

**Eventos:**
1. Crear evento con rol user → 403 ✅
2. Crear evento con fecha pasada → 400 ✅
3. Crear evento con capacity 0 → 400 ✅
4. Organizer edita su propio evento → 200 ✅
5. Organizer edita evento ajeno → 403 ✅
6. Admin edita evento de otro organizador → 200 ✅
7. Cambiar estado de evento ya cancelado → 400 ✅
8. Listado con filtros combinados y paginación → 200 ✅
9. Consultar evento inexistente → 404 ✅

**Tickets:**
1. Inscripción exitosa → email recibido y verificado en Ethereal ✅
2. Inscripción sin sesión → 401 ✅
3. Inscripción a evento inexistente → 404 ✅
4. Inscripción a evento cancelado → 400 ✅
5. Inscripción sin cupo suficiente → 400 ✅
6. Inscripción duplicada activa → 409 ✅
7. Cancelación propia → cupo liberado, nueva inscripción exitosa por ese cupo ✅
8. Cancelación de ticket ajeno como user → 403 ✅
9. Consultar inscriptos de un evento como user común → 403 ✅
10. Consultar inscriptos como organizer de otro evento → 403 ✅

