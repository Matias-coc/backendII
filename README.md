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

## Instalación
1. Cloná el repositorio
2. Instalá las dependencias: `npm install`
3. Creá un archivo `.env` basado en `.env.example`
4. Iniciá el servidor: `npm run dev`

## Variables de entorno
- `PORT`: puerto del servidor
- `NODE_ENV`: entorno de ejecución
- `MONGO_URL`: string de conexión a MongoDB Atlas
- `JWT_SECRET`: clave secreta para firmar los JWT
- `JWT_EXPIRES_IN`: tiempo de expiración del token (ej. `1h`)

## Estructura de carpetas

src/
├── app.js
├── server.js
├── config/
│ ├── database.js
│ └── passport.config.js
├── routes/
├── controllers/
├── services/
├── repositories/
├── dao/
├── models/
├── middlewares/
└── utils/

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

## Roles y autorización

## Roles del sistema

- `user`: rol por defecto al registrarse. Puede consultar torneos e
  inscribirse (a implementar en Módulo 7).
- `organizer`: puede crear torneos y modificar/cancelar los propios.
- `admin`: acceso total, incluyendo gestión de usuarios y cualquier torneo.

El registro público (`POST /api/sessions/register`) siempre asigna `role: 'user'`,
sin importar qué se envíe en el body — los roles `organizer` y `admin` se
asignan manualmente en la base de datos.

## Matriz de permisos

| Acción | user | organizer | admin |
|---|---|---|---|
| Consultar torneos publicados | ✅ | ✅ | ✅ |
| Crear torneos | ❌ | ✅ | ✅ |
| Modificar/cancelar torneos propios | ❌ | ✅ | ✅ |
| Modificar cualquier torneo | ❌ | ❌ | ✅ |
| Ver todos los usuarios | ❌ | ❌ | ✅ |

## Diferencia entre 401 y 403

- **401 No autenticado**: no hay cookie, el token es inválido o expiró.
  El backend no sabe quién es el usuario.
- **403 Sin permisos**: el usuario está autenticado (el backend sabe quién
  es), pero su rol no le permite realizar esa acción.

### Autorización por propiedad de recursos

Además de la autorización por rol, el sistema valida que un `organizer` solo
pueda modificar los eventos que él mismo creó. Esta validación vive en
`middlewares/authorizeOwner.middleware.js`:

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
- Un organizer distinto al dueño (Carlos, tras cambiar su rol) intentó editar
  un evento ajeno → 403

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

Ejemplo: GET /api/events?status=published&category=65f1...&page=1&limit=5

### Reglas de negocio (en la capa `services`)
- No se puede crear un evento con fecha pasada
- `capacity` debe ser mayor a 0; `price` no puede ser negativo
- Un evento cancelado no puede modificarse (ni con PUT ni con PATCH de estado)
- Cancelar un evento cambia su `status` a `cancelled`; nunca se elimina físicamente
- El campo `organizer` siempre se asigna desde `req.user`, nunca puede venir del body

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


## Rutas protegidas

| Método | Ruta | Protección |
|---|---|---|
| GET | /api/sessions/current | Autenticación (401 si no hay sesión) |
| GET | /api/sessions/users | Autenticación + rol admin (403 si no es admin) |
| POST | /api/events | Autenticación + rol organizer/admin (403 si es user) |
| PUT | /api/events/:id | Autenticación + rol + propiedad del recurso o admin |