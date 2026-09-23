import { createTicketService, getMyTicketsService, getEventTicketsService, cancelTicketService } from '../services/tickets.service.js'
import { TicketResponseDTO } from '../dto/ticket-response.dto.js'
import { CreateTicketDTO } from '../dto/create-ticket.dto.js'


export const createTicket = async (req, res, next) => {
    try {
        const { eid } = req.params
        const ticketInput = new CreateTicketDTO(req.body)
        const ticket = await createTicketService(eid, ticketInput.quantity, req.user)
        const ticketsDTO = new TicketResponseDTO(ticket)
        res.status(201).json({ status: 'success', message: 'Inscripción realizada correctamente', payload: ticketsDTO })
    } catch (error) {
        next(error)
    }
}

export const getMyTickets = async (req, res, next) => {
    try {
        const tickets = await getMyTicketsService(req.user._id)
        const ticketsDTO = tickets.map(ticket => new TicketResponseDTO(ticket))
        res.status(200).json({ status: 'success', payload: ticketsDTO })
    } catch (error) {
        next(error)
    }
}

export const getEventTickets = async (req, res, next) => {
    try {
        const { eid } = req.params
        const tickets = await getEventTicketsService(eid, req.user)
        const ticketsDTO = tickets.map(ticket => new TicketResponseDTO(ticket))
        res.status(200).json({ status: 'success', payload: ticketsDTO })
    } catch (error) {
        next(error)
    }
}

export const cancelTicket = async (req, res, next) => {
    try {
        const { tid } = req.params
        const ticket = await cancelTicketService(tid, req.user)
        const ticketsDTO = new TicketResponseDTO(ticket)
        res.status(200).json({ status: 'success', message: 'Inscripción cancelada correctamente', payload: ticketsDTO })
    } catch (error) {
        next(error)
    }
}