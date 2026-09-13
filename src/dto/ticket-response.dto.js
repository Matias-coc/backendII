export class TicketResponseDTO {
    constructor(ticket) {
        this.id = ticket._id
        this.user = ticket.user
            ? {id: ticket.user._id, first_name: ticket.user.first_name, last_name: ticket.user.last_name, email: ticket.user.email,}
            : null
        this.event = ticket.event
            ? {id: ticket.event._id, title: ticket.event.title, date: ticket.event.date, location: ticket.event.location}
            : null
        this.status = ticket.status
        this.quantity = ticket.quantity
        this.reservationCode = ticket.reservationCode
        this.cancelledAt = ticket.cancelledAt
        this.createdAt = ticket.createdAt
}
}