import { EventModel } from '../models/Event.js'

export const getEvents = async (req, res) => {
    try {
        res.json({ "status": "success", "payload": [] })
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener eventos' })
    }
}

export const createEvent = async (req, res) => {
    try {
        const { titulo, lugar, fecha, capacidad } = req.body || {}

        if (!titulo || !lugar || !fecha || !capacidad) {
            return res.status(400).json({ status: 'error', message: 'Faltan campos obligatorios' })
        }

        const newEvent = await EventModel.create({
            titulo, lugar, fecha, capacidad,
            organizer: req.user._id   
        })

        res.status(201).json({ status: 'success', payload: newEvent })
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al crear el evento' })
    }
}

export const updateEvent = async (req, res) => {
    try {
        const updated = await EventModel.findByIdAndUpdate(req.event._id, req.body, { new: true })
        res.status(200).json({ status: 'success', payload: updated })
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al actualizar el evento' })
    }
}