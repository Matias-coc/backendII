export class EventResponseDTO {
    constructor(event) {
        this.id = event._id
        this.title = event.title
        this.description = event.description
        this.date = event.date
        this.location = event.location
        this.capacity = event.capacity
        this.price = event.price
        this.status = event.status
        this.discipline = event.discipline

        this.category = event.category
            ? { id: event.category._id, name: event.category.name }
            : null

        this.organizer = event.organizer
            ? {
                id: event.organizer._id,
                first_name: event.organizer.first_name,
                last_name: event.organizer.last_name
              }
            : null
    }
}