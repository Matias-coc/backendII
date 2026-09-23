import { createEventService, listEventsService, updateEventService, changeEventStatusService, getEventDetailService } from '../services/events.service.js'
import { EventResponseDTO } from '../dto/event-response.dto.js'
import { CreateEventDTO } from '../dto/create-event.dto.js'


export const createEvent = async (req, res, next) => {
    try {
        const eventInput = new CreateEventDTO(req.body)
        const newEvent = await createEventService(eventInput, req.user._id)
        const eventDTO = new EventResponseDTO(newEvent)
        res.status(201).json({ status: 'success', payload: eventDTO })
    } catch (error) {
        next(error)
    }
}

export const getEvents = async (req, res, next) => {
    try {
        const result = await listEventsService(req.query)
        const eventsDTO = result.data.map(event => new EventResponseDTO(event))
        res.status(200).json({ status: 'success', ...result, data: eventsDTO })
    } catch (error) {
        next(error)
    }
}

export const getEventDetail = async (req, res, next) => {
    try {
        const event = await getEventDetailService(req.params.id)
        const eventDTO = new EventResponseDTO(event)
        res.status(200).json({ status: 'success', payload: eventDTO })
    } catch (error) {
        next(error)
    }
}

export const updateEvent = async (req, res, next) => {
    try {
        const updated = await updateEventService(req.event, req.body || {})
        const eventDTO = new EventResponseDTO(updated)
        res.status(200).json({ status: 'success', payload: eventDTO })
    } catch (error) {
        next(error)
    }
}

export const changeEventStatus = async (req, res, next) => {
    try {
        const { status } = req.body
        const updated = await changeEventStatusService(req.event, status)
        const eventDTO = new EventResponseDTO(updated)
        res.status(200).json({ status: 'success', payload: eventDTO })
    } catch (error) {
        next(error)
    }
}

