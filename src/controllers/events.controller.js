import { createEventService, listEventsService, updateEventService, changeEventStatusService, getEventDetailService } from '../services/events.service.js'
import { EventResponseDTO } from '../dto/event-response.dto.js'


const errorMap = {
    MISSING_FIELDS: [400, 'Faltan campos obligatorios'],
    INVALID_CAPACITY: [400, 'La capacidad debe ser mayor a cero'],
    INVALID_PRICE: [400, 'El precio no puede ser negativo'],
    PAST_DATE: [400, 'La fecha del evento debe ser futura'],
    EVENT_CANCELLED: [400, 'No se puede modificar un evento cancelado'],
    INVALID_STATUS: [400, 'Estado no válido'],
    EVENT_NOT_FOUND: [404, 'Evento no encontrado']
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
        const eventDTO = new EventResponseDTO (newEvent)
        res.status(201).json({ status: 'success', payload: eventDTO })
    } catch (error) {
        handleServiceError(error, res)
    }
}

export const getEvents = async (req, res) => {
    try {
        const result = await listEventsService(req.query)
        const eventsDTO = result.data.map(event => new EventResponseDTO(event))
        res.status(200).json({ status: 'success', ...result, data: eventsDTO })
    } catch (error) {
        handleServiceError(error, res)
    }
}

export const getEventDetail = async (req, res) => {
    try {
        const event = await getEventDetailService(req.params.id)
        const eventDTO = new EventResponseDTO(event)
        res.status(200).json({ status: 'success', payload: eventDTO })
    } catch (error) {
        handleServiceError(error, res)
    }
}

export const updateEvent = async (req, res) => {
    try {
        const updated = await updateEventService(req.event, req.body || {})
        const eventDTO = new EventResponseDTO(updated)
        res.status(200).json({ status: 'success', payload: eventDTO })
    } catch (error) {
        handleServiceError(error, res)
    }
}

export const changeEventStatus = async (req, res) => {
    try {
        const { status } = req.body
        const updated = await changeEventStatusService(req.event, status)
        const eventDTO = new EventResponseDTO(updated)
        res.status(200).json({ status: 'success', payload: eventDTO })
    } catch (error) {
        handleServiceError(error, res)
    }
}

