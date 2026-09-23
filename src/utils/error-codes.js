export const ERROR_CODES = {
    MISSING_FIELDS: [400, 'Faltan campos obligatorios'],
    INVALID_CAPACITY: [400, 'La capacidad debe ser mayor a cero'],
    INVALID_PRICE: [400, 'El precio no puede ser negativo'],
    PAST_DATE: [400, 'La fecha del evento debe ser futura'],
    EVENT_CANCELLED: [400, 'No se puede modificar un evento cancelado'],
    INVALID_STATUS: [400, 'Estado no válido'],
    EVENT_NOT_FOUND: [404, 'Evento no encontrado'],
    EVENT_NOT_AVAILABLE: [400, 'El evento no está disponible para inscripciones'],
    EVENT_FINISHED: [400, 'No es posible inscribirse a un evento finalizado'],
    INVALID_QUANTITY: [400, 'La cantidad solicitada no es válida'],
    DUPLICATE_TICKET: [409, 'Ya tenés una inscripción activa para este evento'],
    NO_CAPACITY: [400, 'No hay cupos suficientes disponibles'],
    TICKET_NOT_FOUND: [404, 'Ticket no encontrado'],
    FORBIDDEN: [403, 'No tenés permisos para realizar esta acción'],
    ALREADY_CANCELLED: [400, 'El ticket ya está cancelado'],
    EMAIL_EXISTS: [409, 'El email ya está registrado']
}