import 'dotenv/config'

if (!process.env.JWT_SECRET) {
    console.error('ERROR: falta la variable de entorno JWT_SECRET. La aplicación no puede arrancar sin ella.')
    process.exit(1)
}

const { default: app } = await import('./app.js')
const { connectDB } = await import('./config/database.js')
const dns = (await import('dns')).default

dns.setServers(['8.8.8.8', '1.1.1.1'])
connectDB()

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})