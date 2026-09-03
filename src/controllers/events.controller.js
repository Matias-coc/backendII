export const getEvents = async (req, res) => {
    try {
        res.json({ "status": "success", "payload": [] })
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener eventos' })
    }
}