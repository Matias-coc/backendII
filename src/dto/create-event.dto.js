export class CreateEventDTO {
    constructor(body) {
        const { title, description, category, date, location, capacity, price, discipline } = body || {}

        if (!title || !description || !category || !date || !location) {
            throw new Error('MISSING_FIELDS')
        }

        this.title = String(title).trim()
        this.description = String(description).trim()
        this.category = category
        this.date = date
        this.location = String(location).trim()
        this.capacity = Number(capacity)
        this.price = price !== undefined ? Number(price) : 0
        this.discipline = discipline ? String(discipline).trim() : undefined
    }
}