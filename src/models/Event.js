import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    lugar: { type: String, required: true },
    fecha: { type: Date, required: true, },
    capacidad: { type: Number, required: true },
}, { timestamps: true })

export const EventModel = mongoose.model('Event', eventSchema)