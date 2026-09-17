import { createTicketDB, findTicketByIdDB, findTicketsByUserDB, findTicketsByEventDB, findActiveTicketDB, sumReservedQuantityDB, updateTicketDB } from '../dao/tickets.dao.js'

export const saveTicket = (data) => createTicketDB(data)
export const getTicketById = (id) => findTicketByIdDB(id)
export const getTicketsByUser = (userId) => findTicketsByUserDB(userId)
export const getTicketsByEvent = (eventId) => findTicketsByEventDB(eventId)
export const getActiveTicket = (userId, eventId) => findActiveTicketDB(userId, eventId)
export const getReservedQuantity = (eventId) => sumReservedQuantityDB(eventId)
export const saveTicketUpdate = (id, data) => updateTicketDB(id, data)