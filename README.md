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
- `GET /api/health` — verifica que el servidor está activo
- `GET /api/events` — placeholder, en desarrollo
- `GET /api/sessions` — placeholder, en desarrollo

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