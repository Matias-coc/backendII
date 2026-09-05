import { createEventService, listEventsService, updateEventService, changeEventStatusService } from '../services/events.service.js'
import { getEventById } from '../repositories/events.repository.js'

const errorMap = {
    MISSING_FIELDS: [400, 'Faltan campos obligatorios'],
    INVALID_CAPACITY: [400, 'La capacidad debe ser mayor a cero'],
    INVALID_PRICE: [400, 'El precio no puede ser negativo'],
    PAST_DATE: [400, 'La fecha del evento debe ser futura'],
    EVENT_CANCELLED: [400, 'No se puede modificar un evento cancelado'],
    INVALID_STATUS: [400, 'Estado no válido']
}

const handleServiceError = (error, res) => {
    const mapped = errorMap[error.message]
    if (mapped) {
        return res.status(mapped[0]).json({ status: 'error', message: mapped[1] })
    }
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' })
}

export const createEvent = async (req, res) => {
    try {
        const newEvent = await createEventService(req.body || {}, req.user._id)
        res.status(201).json({ status: 'success', payload: newEvent })
    } catch (error) {
        handleServiceError(error, res)
    }
}

export const getEvents = async (req, res) => {
    try {
        const result = await listEventsService(req.query)
        res.status(200).json({ status: 'success', ...result })
    } catch (error) {
        handleServiceError(error, res)
    }
}

export const getEventDetail = async (req, res) => {
    try {
        const event = await getEventById(req.params.id)
        if (!event) {
            return res.status(404).json({ status: 'error', message: 'Evento no encontrado' })
        }
        res.status(200).json({ status: 'success', payload: event })
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al obtener el evento' })
    }
}

export const updateEvent = async (req, res) => {
    try {
        const updated = await updateEventService(req.event, req.body)
        res.status(200).json({ status: 'success', payload: updated })
    } catch (error) {
        handleServiceError(error, res)
    }
}

export const changeEventStatus = async (req, res) => {
    try {
        const { status } = req.body
        const updated = await changeEventStatusService(req.event, status)
        res.status(200).json({ status: 'success', payload: updated })
    } catch (error) {
        handleServiceError(error, res)
    }
}

