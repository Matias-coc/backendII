import { EventModel } from '../models/Event.js'

export const authorizeEventOwnerOrAdmin = async (req, res, next) => {
    try {
        const { id } = req.params
        const event = await EventModel.findById(id)

        if (!event) {
            return res.status(404).json({ status: 'error', message: 'Evento no encontrado' })
        }

        const isAdmin = req.user.role === 'admin'
        const isOwner = event.organizer.toString() === req.user._id.toString()

        if (!isAdmin && !isOwner) {
            return res.status(403).json({ status: 'error', message: 'No tenés permisos sobre este evento' })
        }

        req.event = event  
        next()
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al validar propiedad del evento' })
    }
}