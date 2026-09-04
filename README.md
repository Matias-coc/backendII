# Backend de Eventos e Inscripciones

API backend para gestión de torneos e inscripciones, desarrollada como proyecto del curso Backend II de Coderhouse.

## Temática
Plataforma de gestión de torneos (e-sports), donde los
organizadores crean torneos y los usuarios se inscriben como participantes.

## Tecnologías
- Node.js
- Express
- MongoDB / Mongoose

## Instalación
1. Cloná el repositorio
2. Instalá las dependencias: `npm install`
3. Creá un archivo `.env` basado en `.env.example`
4. Iniciá el servidor: `npm run dev`

## Endpoints disponibles
| Método | Ruta | Descripción | Protegida |
|---|---|---|---|
| GET | /api/health | Verifica que el servidor está activo | No |
| GET | /api/events | Placeholder, en desarrollo | No |
| GET | /api/sessions | Placeholder, en desarrollo | No |
| POST | /api/sessions/register | Registra un nuevo usuario | No |
| POST | /api/sessions/login | Inicia sesión y setea cookie JWT | No |
| GET | /api/sessions/current | Devuelve el usuario autenticado | Sí |
| POST | /api/sessions/logout | Cierra sesión (borra la cookie) | No |

### POST /api/sessions/register
Body (JSON):
```json
{ "first_name": "Ana", 
"last_name": "Pérez", 
"email": "ana@mail.com", 
"password": "Secreta123" }
```
Response 201:
```json
{ "status": "success", 
"payload": { 
  "id": "...", 
  "first_name": "Ana", 
  "last_name": "Pérez", 
  "email": "ana@mail.com", 
  "role": "user" } 
  }
```

### POST /api/sessions/login
Request:
```json
{ "email": "ana@mail.com", 
"password": "Secreta123" }
```
Response 200 (setea cookie `currentUser`):
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
{ "status": "success", 
"payload": { "id": "...", 
"email": "ana@mail.com", 
"role": "user" } }
```
Response 401 (sin cookie o token inválido):
```json
{ "status": "error", "message": "No autenticado" }
```

### POST /api/sessions/logout
Response 200:
```json
{ "status": "success", "message": "Sesión cerrada" }
```

## Variables de entorno
- `PORT`: puerto del servidor
- `NODE_ENV`: entorno de ejecución
- `MONGO_URL`: string de conexión a MongoDB Atlas
- `JWT_SECRET`: clave para firmar tokens 

## Estructura de carpetas

src/
├── app.js
├── server.js
├── config/
├── routes/
├── controllers/
├── services/
├── repositories/
├── dao/
├── models/
├── middlewares/
└── utils/