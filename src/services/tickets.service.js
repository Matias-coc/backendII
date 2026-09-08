import { saveTicket, getTicketById, getTicketsByUser, getTicketsByEvent, getActiveTicket, getReservedQuantity } from '../repositories/tickets.repository.js'
import { getEventById } from '../repositories/events.repository.js'
import { sendTicketConfirmationEmail, sendTicketCancellationEmail } from './mail.service.js'

const generateTicketCode = () => 'TCK-' + Math.random().toString(36).substring(2, 8).toUpperCase()

export const createTicketService = async (eventId, quantity, user) => {
    const event = await getEventById(eventId)

    if (!event) throw new Error('EVENT_NOT_FOUND')
    if (event.status !== 'published') throw new Error('EVENT_NOT_AVAILABLE')
    if (event.date <= new Date()) throw new Error('EVENT_FINISHED')

    const qty = quantity || 1
    if (qty <= 0) throw new Error('INVALID_QUANTITY')

    const existing = await getActiveTicket(user._id, event._id)
    if (existing) throw new Error('DUPLICATE_TICKET')

    const result = await getReservedQuantity(event._id)
    const reserved = result[0]?.total || 0
    const available = event.capacity - reserved

    if (qty > available) throw new Error('NO_CAPACITY')

    const reservationCode = generateTicketCode()
    const ticket = await saveTicket({
        user: user._id, event: event._id, quantity: qty, reservationCode, status: 'confirmed'
    })

    await sendTicketConfirmationEmail({
        to: user.email, userName: user.first_name, eventTitle: event.title, ticketCode: reservationCode
    })

    return ticket
}

export const getMyTicketsService = (userId) => getTicketsByUser(userId)

export const getEventTicketsService = async (eventId, requestUser) => {
    const event = await getEventById(eventId)
    if (!event) throw new Error('EVENT_NOT_FOUND')

    const organizerId = event.organizer._id ? event.organizer._id.toString() : event.organizer.toString()
    const isOwner = organizerId === requestUser._id.toString()
    const isAdmin = requestUser.role === 'admin'

    if (!isOwner && !isAdmin) throw new Error('FORBIDDEN')

    return await getTicketsByEvent(event._id)
}

export const cancelTicketService = async (ticketId, requestUser) => {
    const ticket = await getTicketById(ticketId)
    if (!ticket) throw new Error('TICKET_NOT_FOUND')

    const isOwner = ticket.user.toString() === requestUser._id.toString()
    const isAdmin = requestUser.role === 'admin'
    if (!isOwner && !isAdmin) throw new Error('FORBIDDEN')

    if (ticket.status === 'cancelled') throw new Error('ALREADY_CANCELLED')

    ticket.status = 'cancelled'
    ticket.cancelledAt = new Date()
    await ticket.save()

    await sendTicketCancellationEmail({
        to: requestUser.email, userName: requestUser.first_name,
        eventTitle: ticket.event.title, ticketCode: ticket.reservationCode
    })

    return ticket
}