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


## Rutas disponibles

| Método | Ruta | Descripción | Protegida |
|---|---|---|---|
| GET | /api/health | Verifica que el servidor está activo | No |
| GET | /api/events | Placeholder, en desarrollo | No |
| GET | /api/sessions | Placeholder, en desarrollo | No |
| POST | /api/sessions/register | Registra un nuevo usuario (vía estrategia Passport) | No |
| POST | /api/sessions/login | Inicia sesión y setea cookie JWT (vía estrategia Passport) | No |
| GET | /api/sessions/current | Devuelve el usuario autenticado (vía estrategia Passport) | Sí |
| POST | /api/sessions/logout | Cierra sesión (borra la cookie) | No |

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

## Pruebas realizadas
- Registro exitoso → login → /current (200) → logout → /current (401) ✅
- Registro con email duplicado → 409 ✅
- Login con credenciales inválidas → 401 ✅
- /current sin cookie → 401 ✅