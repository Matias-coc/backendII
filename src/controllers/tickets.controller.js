import { createTicketService, getMyTicketsService, getEventTicketsService, cancelTicketService } from '../services/tickets.service.js'

const errorMap = {
    EVENT_NOT_FOUND: [404, 'Evento no encontrado'],
    EVENT_NOT_AVAILABLE: [400, 'El evento no está disponible para inscripciones'],
    EVENT_FINISHED: [400, 'No es posible inscribirse a un evento finalizado'],
    INVALID_QUANTITY: [400, 'La cantidad solicitada no es válida'],
    DUPLICATE_TICKET: [409, 'Ya tenés una inscripción activa para este evento'],
    NO_CAPACITY: [400, 'No hay cupos suficientes disponibles'],
    TICKET_NOT_FOUND: [404, 'Ticket no encontrado'],
    FORBIDDEN: [403, 'No tenés permisos para realizar esta acción'],
    ALREADY_CANCELLED: [400, 'El ticket ya está cancelado']
}

const handleTicketError = (error, res) => {
    const mapped = errorMap[error.message]
    if (mapped) return res.status(mapped[0]).json({ status: 'error', message: mapped[1] })
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' })
}

export const createTicket = async (req, res) => {
    try {
        const { eid } = req.params
        const { quantity } = req.body || {}
        const ticket = await createTicketService(eid, quantity, req.user)
        res.status(201).json({ status: 'success', message: 'Inscripción realizada correctamente', payload: ticket })
    } catch (error) {
        handleTicketError(error, res)
    }
}

export const getMyTickets = async (req, res) => {
    try {
        const tickets = await getMyTicketsService(req.user._id)
        res.status(200).json({ status: 'success', payload: tickets })
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al obtener tickets' })
    }
}

export const getEventTickets = async (req, res) => {
    try {
        const { eid } = req.params
        const tickets = await getEventTicketsService(eid, req.user)
        res.status(200).json({ status: 'success', payload: tickets })
    } catch (error) {
        handleTicketError(error, res)
    }
}

export const cancelTicket = async (req, res) => {
    try {
        const { tid } = req.params
        const ticket = await cancelTicketService(tid, req.user)
        res.status(200).json({ status: 'success', message: 'Inscripción cancelada correctamente', payload: ticket })
    } catch (error) {
        handleTicketError(error, res)
    }
}