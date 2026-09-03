import app from './app.js'
import dotenv from 'dotenv'
import { connectDB } from './config/database.js'

dotenv.config()

import dns from 'dns'
dns.setServers(['8.8.8.8', '1.1.1.1'])

connectDB()

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})