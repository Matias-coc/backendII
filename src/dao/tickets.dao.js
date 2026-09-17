import { TicketModel } from '../models/Ticket.js'

export const createTicketDB = (data) => TicketModel.create(data)
export const findTicketByIdDB = (id) => TicketModel.findById(id).populate('event')
export const findTicketsByUserDB = (userId) => TicketModel.find({ user: userId }).populate('event', 'title date location')
export const findTicketsByEventDB = (eventId) => TicketModel.find({ event: eventId }).populate('user', 'first_name last_name email')
export const findActiveTicketDB = (userId, eventId) =>
    TicketModel.findOne({ user: userId, event: eventId, status: { $in: ['confirmed', 'pending'] } })
export const sumReservedQuantityDB = (eventId) => TicketModel.aggregate([
    { $match: { event: eventId, status: { $in: ['confirmed', 'pending'] } } },
    { $group: { _id: '$event', total: { $sum: '$quantity' } } }
])
export const updateTicketDB = (id, data) => TicketModel.findByIdAndUpdate(id, data, { new: true })