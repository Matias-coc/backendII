import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Base de datos conectada')
    } catch (error) {
        console.error('Error al conectar MongoDB', error)
    }
}