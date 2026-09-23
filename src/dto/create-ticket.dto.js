export class CreateTicketDTO {
    constructor(body) {
        const { quantity } = body || {}
        const rawQuantity = quantity || 1

        this.quantity = Number(rawQuantity)
        
    }
}