import 'dotenv/config'

import app from './app.js'
import { connectDB } from './config/database.js'
import dns from 'dns'

dns.setServers(['8.8.8.8', '1.1.1.1'])
connectDB()

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})