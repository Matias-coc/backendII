export const getSessions = async (req, res) => {
    try {
        res.json({ message: 'Listado de sesiones (pendiente de implementar)' })
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener sesiones' })
    }
}